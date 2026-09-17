/**
 * CIVICSLENZZ POSTGRES PRODUCER STORE
 * 
 * Authoritative production implementation of ProducerPersistence backed by
 * Cloud SQL PostgreSQL and R2.
 */

import crypto from 'crypto';
import { eq, and, sql, desc, gte, lt, or, inArray } from 'drizzle-orm';
import { db, pool } from '../../db/index.ts';
import {
  hermesJobs,
  hermesJobAttempts,
  hermesWorkerLeases,
  hermesCheckpoints,
  hermesSourceRegistry,
  rawSourceSnapshots,
  rawEvidenceObjects,
  researchContractStatuses,
  seatCoverageStatuses,
  personCoverageStatuses,
  deadLetterJobs,
  monitoringEvents,
  durableGaps,
  academyObservations,
  academyCases,
  autonomousProofRecords,
  monitoringProofRecords,
  bridgeSubmissions,
  domainRateLimits,
  producerSystemState
} from '../../db/schema.ts';
import {
  ProducerPersistence,
  StorageHealthInfo,
  ClaimLeaseResult
} from './storage-interface';
import {
  hermesBackendStore,
  PersistentHermesJob,
  HermesWorkerLease,
  HermesJobAttempt,
  HermesCheckpoint,
  SourceRegistryEntry,
  RawSourceSnapshot,
  RawEvidenceObject,
  ResearchContractStatus,
  SeatCoverageStatusRecord,
  PersonCoverageStatusRecord,
  DeadLetterJobRecord,
  MonitoringEventRecord,
  DurableGapRecord,
  DurableAcademyObservationRecord,
  DurableAcademyCaseRecord,
  DurableAutonomousProofRecord,
  DurableMonitoringProofRecord,
  JobStatus
} from '../hermes-backend-store';
import { ResultSubmissionRecord } from '../hermes-bridge-client';
import { ResearchIngestPackage } from '../hermes-bridge-types';
import type { RawObjectStore } from './raw-object-store';
import { R2RawObjectStore } from './r2-raw-object-store';

export class PostgresProducerStore implements ProducerPersistence {
  private rawObjectStore: RawObjectStore;
  private isInitialized: boolean = false;
  private daemonActive: boolean = false;

  constructor(rawObjectStore?: RawObjectStore) {
    this.rawObjectStore = rawObjectStore || new R2RawObjectStore();
  }

  public async initialize(): Promise<void> {
    const health = await this.checkHealth();
    if (!health.postgresConnected || !health.postgresSchemaReady) {
      this.daemonActive = false;
      throw new Error(`[PostgresProducerStore] Fail-closed initialization check failed: PostgreSQL unready (${health.error || 'SQL unready'})`);
    }
    if (!health.rawObjectStorageConnected) {
      this.daemonActive = false;
      throw new Error(`[PostgresProducerStore] Fail-closed initialization check failed: Raw object storage unready (${health.error || 'R2 inaccessible'})`);
    }
    this.isInitialized = true;
    this.daemonActive = true;
  }

  public isFailClosed(): boolean {
    return true;
  }

  public setDaemonActive(active: boolean) {
    this.daemonActive = active;
  }

  public isLocalStoragePermitted(): boolean {
    return process.env.NODE_ENV === 'test' || process.env.PRODUCER_STORAGE_MODE === 'LOCAL_TEST';
  }

  public ensurePostgresConfigured(methodName: string): void {
    if (!process.env.SQL_HOST) {
      if (!this.isLocalStoragePermitted()) {
        throw new Error(`[PostgresProducerStore] Production fail-closed: missing SQL configuration for ${methodName}. Local storage forbidden in production.`);
      }
    }
  }

  public async checkHealth(): Promise<StorageHealthInfo> {
    const postgresConfigured = Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME && process.env.SQL_USER);
    let postgresConnected = false;
    let postgresSchemaReady = false;
    let error: string | undefined;

    if (postgresConfigured) {
      try {
        await db.execute(sql`SELECT 1`);
        postgresConnected = true;

        // Verify key tables exist
        const check = await db.execute(sql`
          SELECT count(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
            AND table_name IN ('hermes_jobs', 'hermes_worker_leases', 'hermes_job_attempts', 'raw_evidence_objects', 'bridge_submissions')
        `);
        const tableCount = Number((check as any)?.rows?.[0]?.count || 0);
        postgresSchemaReady = tableCount >= 5;
      } catch (err: any) {
        error = err.message;
      }
    } else {
      error = 'SQL_HOST or credentials missing in environment';
    }

    const rawHealth = await this.rawObjectStore.checkHealth();
    if (!rawHealth.ok && !error) {
      error = rawHealth.error || 'Raw object storage inaccessible';
    }

    return {
      storageMode: this.isLocalStoragePermitted() ? 'LOCAL_TEST' : 'CLOUD_SQL_POSTGRES_R2',
      postgresConfigured,
      postgresConnected,
      postgresSchemaReady,
      rawObjectStorageConfigured: rawHealth.configured,
      rawObjectStorageConnected: rawHealth.ok,
      localFallbackEnabled: rawHealth.localFallbackEnabled,
      daemonActive: this.daemonActive && postgresConnected && postgresSchemaReady && rawHealth.ok,
      error
    };
  }

  // =========================================================================
  // JOBS & LOGICAL WORK IDEMPOTENCY
  // =========================================================================

  public async createJob(jobData: {
    agent_id: string;
    job_type: string;
    logical_work_key?: string;
    seat_uuid?: string;
    person_uuid?: string;
    race_uuid?: string;
    campaign_uuid?: string;
    source_uuid?: string;
    target_url?: string;
    priority?: number;
    max_attempts?: number;
    available_at?: string;
    checkpoint?: any;
    status?: JobStatus;
  }): Promise<PersistentHermesJob> {
    this.ensurePostgresConfigured('createJob');
    if (jobData.logical_work_key) {
      const existing = await this.findJobByLogicalKey(jobData.logical_work_key);
      if (existing && ['QUEUED', 'LEASED', 'RUNNING', 'CHECKPOINTED'].includes(existing.status)) {
        return existing;
      }
    }

    if (!process.env.SQL_HOST) {
      return hermesBackendStore.createJob({
        ...jobData,
        priority: jobData.priority ?? 5
      });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // If logical work key is provided, use advisory transaction lock to prevent concurrent races
      if (jobData.logical_work_key) {
        await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [jobData.logical_work_key]);

        const existingRes = await client.query(`
          SELECT job_uuid, agent_id, logical_work_key, mission_uuid, seat_uuid, person_uuid, race_uuid, campaign_uuid,
                 source_uuid, job_type, priority, status, attempt_count, max_attempts, available_at,
                 locked_at, lease_expires_at, worker_instance, started_at, completed_at, failed_at,
                 last_error, checkpoint, created_at, updated_at
          FROM hermes_jobs
          WHERE logical_work_key = $1
          ORDER BY created_at DESC
          LIMIT 1
        `, [jobData.logical_work_key]);

        if (existingRes.rows.length > 0) {
          const existing = this.mapJobRow(existingRes.rows[0]);
          if (['QUEUED', 'LEASED', 'RUNNING', 'CHECKPOINTED'].includes(existing.status)) {
            await client.query('COMMIT');
            return existing;
          }
        }
      }

      const now = new Date().toISOString();
      const jobUuid = `job_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

      await client.query(`
        INSERT INTO hermes_jobs (
          job_uuid, agent_id, logical_work_key, seat_uuid, person_uuid, race_uuid, campaign_uuid,
          source_uuid, job_type, priority, status, attempt_count, max_attempts, available_at,
          checkpoint, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, $12, $13, $14, $15, $15
        )
      `, [
        jobUuid,
        jobData.agent_id || 'fl_dos_elections',
        jobData.logical_work_key || null,
        jobData.seat_uuid || null,
        jobData.person_uuid || null,
        jobData.race_uuid || null,
        jobData.campaign_uuid || null,
        jobData.source_uuid || null,
        jobData.job_type,
        jobData.priority || 1,
        jobData.status || 'QUEUED',
        jobData.max_attempts || 4,
        jobData.available_at || now,
        jobData.checkpoint ? JSON.stringify(jobData.checkpoint) : null,
        now
      ]);

      await client.query('COMMIT');

      const created = await this.getJob(jobUuid);
      if (!created) {
        throw new Error(`Failed to retrieve newly created job ${jobUuid}`);
      }
      return created;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async findJobByLogicalKey(logicalWorkKey: string): Promise<PersistentHermesJob | null> {
    this.ensurePostgresConfigured('findJobByLogicalKey');
    if (!process.env.SQL_HOST) {
      const all = hermesBackendStore.getJobs();
      return all.find(j => j.logical_work_key === logicalWorkKey) || null;
    }
    const rows = await db.select().from(hermesJobs)
      .where(eq(hermesJobs.logicalWorkKey, logicalWorkKey))
      .orderBy(desc(hermesJobs.createdAt))
      .limit(1);

    if (rows.length === 0) return null;
    return this.mapJobRow(rows[0]);
  }

  public async getJob(jobUuid: string): Promise<PersistentHermesJob | null> {
    this.ensurePostgresConfigured('getJob');
    if (!process.env.SQL_HOST) {
      const all = hermesBackendStore.getJobs();
      return all.find(j => j.job_uuid === jobUuid) || null;
    }
    const rows = await db.select().from(hermesJobs).where(eq(hermesJobs.jobUuid, jobUuid)).limit(1);
    if (rows.length === 0) return null;
    return this.mapJobRow(rows[0]);
  }

  public async getAllJobs(): Promise<PersistentHermesJob[]> {
    this.ensurePostgresConfigured('getAllJobs');
    if (!process.env.SQL_HOST) {
      return hermesBackendStore.getJobs();
    }
    const rows = await db.select().from(hermesJobs).orderBy(desc(hermesJobs.createdAt));
    return rows.map(r => this.mapJobRow(r));
  }

  public async getQueuedJobsCount(): Promise<number> {
    this.ensurePostgresConfigured('getQueuedJobsCount');
    if (!process.env.SQL_HOST) {
      return hermesBackendStore.getJobs().filter(j => j.status === 'QUEUED').length;
    }
    const res = await db.select({ count: sql<number>`count(*)` })
      .from(hermesJobs)
      .where(eq(hermesJobs.status, 'QUEUED'));
    return Number(res[0]?.count || 0);
  }

  // =========================================================================
  // ATOMIC AGENT-SPECIFIC LEASING WITH ROW LOCKING & EXACT ATTEMPT IDENTITY
  // =========================================================================

  public async claimAtomicLease(
    agentId: string,
    workerInstance: string,
    leaseDurationSec: number = 60,
    logicalWorkPrefix?: string
  ): Promise<ClaimLeaseResult | null> {
    this.ensurePostgresConfigured('claimAtomicLease');
    const now = new Date();
    const nowIso = now.toISOString();
    const expiresAt = new Date(now.getTime() + leaseDurationSec * 1000).toISOString();

    if (!process.env.SQL_HOST) {
      const res = hermesBackendStore.claimAvailableJob(agentId, workerInstance, logicalWorkPrefix);
      if (!res) return null;
      return {
        job: res.job,
        lease: res.lease,
        attempt: {
          attempt_uuid: `att_${res.job.job_uuid}_${Date.now()}`,
          job_uuid: res.job.job_uuid,
          worker_instance: workerInstance,
          started_at: new Date().toISOString(),
          status: 'RUNNING',
          records_extracted: 0
        }
      };
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Expire any stale leases first
      await client.query(`
        UPDATE hermes_job_attempts
        SET status = 'LEASED_EXPIRED',
            finished_at = $1,
            error_message = 'Worker lease expired without completion'
        WHERE job_uuid IN (
          SELECT job_uuid FROM hermes_worker_leases WHERE expires_at < $1
        )
        AND finished_at IS NULL
      `, [nowIso]);

      await client.query(`
        UPDATE hermes_jobs
        SET status = CASE 
              WHEN attempt_count >= max_attempts THEN 'FAILED_PERMANENT'
              ELSE 'FAILED_RETRYABLE'
            END,
            lease_expires_at = NULL,
            active_attempt_uuid = NULL,
            updated_at = $1
        WHERE job_uuid IN (
          SELECT job_uuid FROM hermes_worker_leases WHERE expires_at < $1
        )
      `, [nowIso]);

      await client.query(`DELETE FROM hermes_worker_leases WHERE expires_at < $1`, [nowIso]);

      // 2. Select eligible job with strict agent routing, max attempt filter, priority ordering, and row lock
      const selectRes = await client.query(`
        SELECT job_uuid, agent_id, logical_work_key, mission_uuid, seat_uuid, person_uuid, race_uuid, campaign_uuid,
               source_uuid, job_type, priority, status, attempt_count, max_attempts, available_at,
               locked_at, lease_expires_at, worker_instance, started_at, completed_at, failed_at,
               last_error, checkpoint, created_at, updated_at
        FROM hermes_jobs
        WHERE (
          status IN ('QUEUED', 'CHECKPOINTED', 'FAILED_RETRYABLE')
        )
        AND available_at <= $1
        AND attempt_count < max_attempts
        AND (agent_id = $2 OR agent_id = '*' OR $2 = '*')
        AND ($3::text IS NULL OR logical_work_key LIKE ($3 || '%'))
        ORDER BY priority DESC, created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `, [nowIso, agentId, logicalWorkPrefix || null]);

      if (selectRes.rows.length === 0) {
        await client.query('COMMIT');
        return null;
      }

      const row = selectRes.rows[0];
      const jobUuid = row.job_uuid;
      const attemptCount = (row.attempt_count || 0) + 1;
      const attemptUuid = `att_${jobUuid}_${attemptCount}_${Date.now()}`;
      const leaseUuid = `lease_${jobUuid}_${Date.now()}`;

      // 3. Update job state with active attempt
      await client.query(`
        UPDATE hermes_jobs
        SET status = 'LEASED',
            worker_instance = $1,
            locked_at = $2,
            lease_expires_at = $3,
            attempt_count = $4,
            active_attempt_uuid = $5,
            started_at = COALESCE(started_at, $2),
            updated_at = $2
        WHERE job_uuid = $6
      `, [workerInstance, nowIso, expiresAt, attemptCount, attemptUuid, jobUuid]);

      // 4. Upsert worker lease
      await client.query(`
        INSERT INTO hermes_worker_leases (lease_uuid, job_uuid, attempt_uuid, worker_instance, agent_id, acquired_at, expires_at, last_heartbeat_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $6)
        ON CONFLICT (job_uuid) DO UPDATE
        SET lease_uuid = $1,
            attempt_uuid = $3,
            worker_instance = $4,
            agent_id = $5,
            acquired_at = $6,
            expires_at = $7,
            last_heartbeat_at = $6
      `, [leaseUuid, jobUuid, attemptUuid, workerInstance, agentId, nowIso, expiresAt]);

      // 5. Insert new running attempt
      await client.query(`
        INSERT INTO hermes_job_attempts (attempt_uuid, job_uuid, worker_instance, started_at, status, records_extracted)
        VALUES ($1, $2, $3, $4, 'RUNNING', 0)
      `, [attemptUuid, jobUuid, workerInstance, nowIso]);

      await client.query('COMMIT');

      const freshJob = await this.getJob(jobUuid);
      if (!freshJob) {
        throw new Error(`Failed to load freshly leased job ${jobUuid}`);
      }

      const lease: HermesWorkerLease = {
        lease_uuid: leaseUuid,
        job_uuid: jobUuid,
        worker_instance: workerInstance,
        agent_id: agentId,
        acquired_at: nowIso,
        expires_at: expiresAt,
        last_heartbeat_at: nowIso
      };

      const attempt: HermesJobAttempt = {
        attempt_uuid: attemptUuid,
        job_uuid: jobUuid,
        worker_instance: workerInstance,
        started_at: nowIso,
        status: 'RUNNING',
        records_extracted: 0
      };

      return { job: freshJob, lease, attempt };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async heartbeatLease(leaseUuid: string, extendSeconds: number = 60): Promise<boolean> {
    this.ensurePostgresConfigured('heartbeatLease');
    const now = new Date();
    const nowIso = now.toISOString();
    const expiresAt = new Date(now.getTime() + extendSeconds * 1000).toISOString();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query(`
        UPDATE hermes_worker_leases
        SET expires_at = $1,
            last_heartbeat_at = $2
        WHERE lease_uuid = $3
        RETURNING job_uuid
      `, [expiresAt, nowIso, leaseUuid]);

      if (res.rows.length === 0) {
        await client.query('COMMIT');
        return false;
      }

      const jobUuid = res.rows[0].job_uuid;
      await client.query(`
        UPDATE hermes_jobs
        SET lease_expires_at = $1,
            updated_at = $2
        WHERE job_uuid = $3
      `, [expiresAt, nowIso, jobUuid]);

      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async completeJob(jobUuid: string, attemptUuid: string, recordsExtracted: number = 0): Promise<void> {
    this.ensurePostgresConfigured('completeJob');
    if (!process.env.SQL_HOST) {
      hermesBackendStore.completeJob(jobUuid, 'local-worker', { recordsExtracted });
      return;
    }
    const nowIso = new Date().toISOString();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(`
        UPDATE hermes_jobs
        SET status = 'COMPLETED',
            completed_at = $1,
            lease_expires_at = NULL,
            active_attempt_uuid = NULL,
            updated_at = $1
        WHERE job_uuid = $2
      `, [nowIso, jobUuid]);

      await client.query(`DELETE FROM hermes_worker_leases WHERE job_uuid = $1`, [jobUuid]);

      // Complete ONLY the exact attempt identity
      await client.query(`
        UPDATE hermes_job_attempts
        SET finished_at = $1,
            status = 'SUCCESS',
            records_extracted = $2
        WHERE attempt_uuid = $3
      `, [nowIso, recordsExtracted, attemptUuid]);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async failJob(
    jobUuid: string,
    attemptUuid: string,
    errorMessage: string,
    retryable: boolean = true,
    httpStatus?: number
  ): Promise<void> {
    this.ensurePostgresConfigured('failJob');
    if (!process.env.SQL_HOST) {
      hermesBackendStore.failJob(jobUuid, 'local-worker', errorMessage, !retryable);
      return;
    }
    const nowIso = new Date().toISOString();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const jobRes = await client.query(`
        SELECT attempt_count, max_attempts, agent_id, job_type 
        FROM hermes_jobs 
        WHERE job_uuid = $1 
        FOR UPDATE
      `, [jobUuid]);

      if (jobRes.rows.length === 0) {
        await client.query('COMMIT');
        return;
      }

      const job = jobRes.rows[0];
      const attempts = job.attempt_count || 1;
      const maxAttempts = job.max_attempts || 4;

      let nextStatus = 'FAILED_RETRYABLE';
      if (!retryable || attempts >= maxAttempts) {
        nextStatus = 'FAILED_PERMANENT';
      }

      // Exponential backoff if retryable (10s, 30s, 90s)
      const backoffSec = Math.min(180, Math.pow(3, attempts) * 5);
      const nextAvailableAt = new Date(Date.now() + backoffSec * 1000).toISOString();

      await client.query(`
        UPDATE hermes_jobs
        SET status = $1,
            failed_at = $2,
            last_error = $3,
            available_at = CASE WHEN $1 = 'FAILED_RETRYABLE' THEN $4 ELSE available_at END,
            lease_expires_at = NULL,
            active_attempt_uuid = NULL,
            updated_at = $2
        WHERE job_uuid = $5
      `, [nextStatus, nowIso, errorMessage, nextAvailableAt, jobUuid]);

      await client.query(`DELETE FROM hermes_worker_leases WHERE job_uuid = $1`, [jobUuid]);

      // Fail ONLY the exact attempt identity
      await client.query(`
        UPDATE hermes_job_attempts
        SET finished_at = $1,
            status = $2,
            error_message = $3,
            http_status = $4
        WHERE attempt_uuid = $5
      `, [nowIso, nextStatus, errorMessage, httpStatus || null, attemptUuid]);

      if (nextStatus === 'FAILED_PERMANENT') {
        const deadLetterUuid = `dlq_${jobUuid}_${Date.now()}`;
        await client.query(`
          INSERT INTO dead_letter_jobs (dead_letter_uuid, job_uuid, agent_id, job_type, attempts_made, final_error, moved_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (job_uuid) DO NOTHING
        `, [deadLetterUuid, jobUuid, job.agent_id, job.job_type, attempts, errorMessage, nowIso]);
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async getJobAttempts(jobUuid?: string): Promise<HermesJobAttempt[]> {
    this.ensurePostgresConfigured('getJobAttempts');
    if (!process.env.SQL_HOST) {
      return hermesBackendStore.getJobAttempts(jobUuid);
    }
    try {
      const client = await pool.connect();
      try {
        let query = `
          SELECT attempt_uuid, job_uuid, worker_instance, started_at, finished_at, status, error_message, http_status, records_extracted
          FROM hermes_job_attempts
        `;
        const params: any[] = [];
        if (jobUuid) {
          query += ` WHERE job_uuid = $1`;
          params.push(jobUuid);
        }
        query += ` ORDER BY started_at DESC`;
        const res = await client.query(query, params);
        return res.rows.map(r => ({
          attempt_uuid: r.attempt_uuid,
          job_uuid: r.job_uuid,
          worker_instance: r.worker_instance,
          started_at: r.started_at,
          finished_at: r.finished_at || undefined,
          status: r.status,
          error_message: r.error_message || undefined,
          http_status: r.http_status || undefined,
          records_extracted: r.records_extracted || 0
        }));
      } finally {
        client.release();
      }
    } catch (err) {
      if (this.isLocalStoragePermitted() && !process.env.SQL_HOST) {
        return hermesBackendStore.getJobAttempts(jobUuid);
      }
      throw err;
    }
  }

  public async expireLeasesWatchdog(): Promise<number> {
    this.ensurePostgresConfigured('expireLeasesWatchdog');
    const nowIso = new Date().toISOString();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const expiredLeases = await client.query(`
        SELECT l.lease_uuid, l.job_uuid, l.attempt_uuid, j.attempt_count, j.max_attempts, j.agent_id, j.job_type
        FROM hermes_worker_leases l
        JOIN hermes_jobs j ON l.job_uuid = j.job_uuid
        WHERE l.expires_at < $1
        FOR UPDATE
      `, [nowIso]);

      if (expiredLeases.rows.length === 0) {
        await client.query('COMMIT');
        return 0;
      }

      for (const row of expiredLeases.rows) {
        const attempts = row.attempt_count || 1;
        const maxAttempts = row.max_attempts || 4;
        const isPermanent = attempts >= maxAttempts;

        if (row.attempt_uuid) {
          await client.query(`
            UPDATE hermes_job_attempts
            SET status = 'LEASE_EXPIRED',
                finished_at = $1,
                error_message = 'Worker lease expired and was reclaimed by watchdog'
            WHERE attempt_uuid = $2 AND finished_at IS NULL
          `, [nowIso, row.attempt_uuid]);
        }

        await client.query(`
          UPDATE hermes_jobs
          SET status = $1,
              lease_expires_at = NULL,
              active_attempt_uuid = NULL,
              last_error = 'Lease expired without completion',
              updated_at = $2
          WHERE job_uuid = $3
        `, [isPermanent ? 'FAILED_PERMANENT' : 'FAILED_RETRYABLE', nowIso, row.job_uuid]);

        if (isPermanent) {
          const dlqUuid = `dlq_${row.job_uuid}_${Date.now()}`;
          await client.query(`
            INSERT INTO dead_letter_jobs (dead_letter_uuid, job_uuid, agent_id, job_type, attempts_made, final_error, moved_at)
            VALUES ($1, $2, $3, $4, $5, 'Lease expired at max attempts', $6)
            ON CONFLICT (job_uuid) DO NOTHING
          `, [dlqUuid, row.job_uuid, row.agent_id, row.job_type, attempts, nowIso]);
        }
      }

      await client.query(`DELETE FROM hermes_worker_leases WHERE expires_at < $1`, [nowIso]);

      await client.query('COMMIT');
      return expiredLeases.rows.length;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // =========================================================================
  // CHECKPOINTS
  // =========================================================================

  public async saveCheckpoint(checkpoint: {
    job_uuid: string;
    step_name: string;
    records_processed: number;
    last_processed_id?: string;
    state_data: Record<string, any>;
  }): Promise<HermesCheckpoint> {
    this.ensurePostgresConfigured('saveCheckpoint');
    const checkpointUuid = `chk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const nowIso = new Date().toISOString();

    await db.insert(hermesCheckpoints).values({
      checkpointUuid,
      jobUuid: checkpoint.job_uuid,
      stepName: checkpoint.step_name,
      recordsProcessed: checkpoint.records_processed,
      lastProcessedId: checkpoint.last_processed_id || null,
      stateData: checkpoint.state_data,
      savedAt: nowIso
    });

    await db.update(hermesJobs).set({
      checkpoint: {
        checkpoint_uuid: checkpointUuid,
        step_name: checkpoint.step_name,
        records_processed: checkpoint.records_processed,
        last_processed_id: checkpoint.last_processed_id,
        saved_at: nowIso
      },
      updatedAt: nowIso
    }).where(eq(hermesJobs.jobUuid, checkpoint.job_uuid));

    return {
      checkpoint_uuid: checkpointUuid,
      job_uuid: checkpoint.job_uuid,
      step_name: checkpoint.step_name,
      records_processed: checkpoint.records_processed,
      last_processed_id: checkpoint.last_processed_id,
      state_data: checkpoint.state_data,
      saved_at: nowIso
    };
  }

  public async getCheckpoints(jobUuid: string): Promise<HermesCheckpoint[]> {
    this.ensurePostgresConfigured('getCheckpoints');
    const rows = await db.select().from(hermesCheckpoints)
      .where(eq(hermesCheckpoints.jobUuid, jobUuid))
      .orderBy(desc(hermesCheckpoints.savedAt));

    return rows.map(r => ({
      checkpoint_uuid: r.checkpointUuid,
      job_uuid: r.jobUuid,
      step_name: r.stepName,
      records_processed: r.recordsProcessed,
      last_processed_id: r.lastProcessedId || undefined,
      state_data: (r.stateData as any) || {},
      saved_at: r.savedAt
    }));
  }

  // =========================================================================
  // RAW SNAPSHOTS & EVIDENCE OBJECTS
  // =========================================================================

  public async saveRawSnapshot(snapshot: Partial<RawSourceSnapshot> & {
    source_uuid: string;
    target_url: string;
    http_status: number;
    content_type: string;
    raw_bytes?: Buffer;
  }): Promise<RawSourceSnapshot> {
    this.ensurePostgresConfigured('saveRawSnapshot');
    const snapshotUuid = snapshot.snapshot_uuid || crypto.randomUUID();
    const retrievedAt = snapshot.retrieved_at || new Date().toISOString();
    let rawBytesPath = snapshot.raw_bytes_path || `snapshots/${snapshotUuid}.raw`;
    let objectLocator = snapshot.object_locator;

    let payloadSha256 = snapshot.payload_sha256;
    let byteLength = snapshot.byte_length;
    let rawPayload = snapshot.raw_payload;

    if (snapshot.raw_bytes) {
      byteLength = snapshot.raw_bytes.length;
      payloadSha256 = crypto.createHash('sha256').update(snapshot.raw_bytes).digest('hex');
      try {
        rawPayload = snapshot.raw_bytes.toString('utf-8');
      } catch {
        rawPayload = '';
      }
      if (this.rawObjectStore) {
        const stored = await this.rawObjectStore.putObject(
          rawBytesPath,
          snapshot.raw_bytes,
          snapshot.content_type
        );
        if (stored.byteLength !== byteLength) {
          throw new Error(`[POSTGRES-STORE] Raw object storage byte length mismatch: expected ${byteLength}, got ${stored.byteLength}`);
        }
        if (stored.sha256 !== payloadSha256) {
          throw new Error(`[POSTGRES-STORE] Raw object storage SHA256 mismatch: expected ${payloadSha256}, got ${stored.sha256}`);
        }
        rawBytesPath = stored.locator;
        objectLocator = stored.locator;
      }
    } else if (rawPayload && !payloadSha256) {
      payloadSha256 = crypto.createHash('sha256').update(rawPayload, 'utf-8').digest('hex');
      byteLength = Buffer.byteLength(rawPayload, 'utf-8');
    }

    if (!payloadSha256) {
      payloadSha256 = crypto.createHash('sha256').update('').digest('hex');
    }

    let classification = snapshot.provenance_classification;
    if (!classification) {
      if (snapshot.http_status >= 200 && snapshot.http_status < 300) {
        classification = 'UNKNOWN';
      } else {
        classification = 'LEGACY_UNPROVEN';
      }
    }

    const fullSnapshot: RawSourceSnapshot = {
      snapshot_uuid: snapshotUuid,
      source_uuid: snapshot.source_uuid,
      target_url: snapshot.target_url,
      http_status: snapshot.http_status,
      content_type: snapshot.content_type,
      charset: snapshot.charset || 'utf-8',
      byte_length: byteLength || 0,
      raw_payload: rawPayload || undefined,
      payload_sha256: payloadSha256,
      raw_bytes_path: rawBytesPath,
      object_locator: objectLocator || undefined,
      retrieved_at: retrievedAt,
      parser_version: snapshot.parser_version || 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
      provenance_classification: classification,
      challenge_reason: snapshot.challenge_reason,
      failure_class: snapshot.failure_class
    };

    await db.insert(rawSourceSnapshots).values({
      snapshotUuid: fullSnapshot.snapshot_uuid,
      sourceUuid: fullSnapshot.source_uuid,
      targetUrl: fullSnapshot.target_url,
      httpStatus: fullSnapshot.http_status,
      contentType: fullSnapshot.content_type,
      charset: fullSnapshot.charset || null,
      byteLength: fullSnapshot.byte_length || null,
      rawPayload: fullSnapshot.raw_payload || null,
      payloadSha256: fullSnapshot.payload_sha256,
      rawBytesPath: fullSnapshot.raw_bytes_path,
      objectLocator: fullSnapshot.object_locator || null,
      retrievedAt: fullSnapshot.retrieved_at,
      parserVersion: fullSnapshot.parser_version,
      provenanceClassification: fullSnapshot.provenance_classification || 'UNKNOWN',
      challengeReason: fullSnapshot.challenge_reason || null,
      failureClass: fullSnapshot.failure_class || null
    }).onConflictDoNothing();

    // Local snapshot mirroring is permitted ONLY in explicit LOCAL_TEST mode
    if (process.env.PRODUCER_STORAGE_MODE === 'LOCAL_TEST') {
      hermesBackendStore.registerSnapshot(fullSnapshot);
    }
    return fullSnapshot;
  }

  public async getRawSnapshot(snapshotUuid: string): Promise<RawSourceSnapshot | null> {
    this.ensurePostgresConfigured('getRawSnapshot');
    const rows = await db.select().from(rawSourceSnapshots)
      .where(eq(rawSourceSnapshots.snapshotUuid, snapshotUuid))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      snapshot_uuid: r.snapshotUuid,
      source_uuid: r.sourceUuid,
      target_url: r.targetUrl,
      http_status: r.httpStatus,
      content_type: r.contentType,
      charset: r.charset || undefined,
      byte_length: r.byteLength || undefined,
      raw_payload: r.rawPayload || undefined,
      payload_sha256: r.payloadSha256,
      raw_bytes_path: r.rawBytesPath,
      object_locator: r.objectLocator || undefined,
      retrieved_at: r.retrievedAt,
      parser_version: r.parserVersion,
      provenance_classification: r.provenanceClassification as any,
      challenge_reason: r.challengeReason || undefined,
      failure_class: r.failureClass as any
    };
  }

  public async getAllRawSnapshots(): Promise<RawSourceSnapshot[]> {
    this.ensurePostgresConfigured('getAllRawSnapshots');
    const rows = await db.select().from(rawSourceSnapshots).orderBy(desc(rawSourceSnapshots.retrievedAt));
    return rows.map(r => ({
      snapshot_uuid: r.snapshotUuid,
      source_uuid: r.sourceUuid,
      target_url: r.targetUrl,
      http_status: r.httpStatus,
      content_type: r.contentType,
      charset: r.charset || undefined,
      byte_length: r.byteLength || undefined,
      raw_payload: r.rawPayload || undefined,
      payload_sha256: r.payloadSha256,
      raw_bytes_path: r.rawBytesPath,
      object_locator: r.objectLocator || undefined,
      retrieved_at: r.retrievedAt,
      parser_version: r.parserVersion,
      provenance_classification: r.provenanceClassification as any,
      challenge_reason: r.challengeReason || undefined,
      failure_class: r.failureClass as any
    }));
  }

  public async saveEvidenceObjects(evidenceList: Array<Partial<RawEvidenceObject> & {
    source_uuid: string;
    source_url: string;
    document_title: string;
    document_type: string;
    source_tier: any;
    parser_version: string;
    extraction_method: string;
  }>): Promise<RawEvidenceObject[]> {
    this.ensurePostgresConfigured('saveEvidenceObjects');
    if (evidenceList.length === 0) return [];

    const results: RawEvidenceObject[] = [];

    for (const e of evidenceList) {
      const evidenceUuid = e.evidence_uuid || crypto.randomUUID();
      const retrievedAt = e.retrieved_at || new Date().toISOString();
      const contentHash = e.content_hash || crypto.createHash('sha256')
        .update(`${e.source_url}_${e.seat_uuid || ''}_${e.field_key || ''}_${e.extracted_value || ''}`)
        .digest('hex');
      // Fail-closed provenance: caller omission MUST default to UNKNOWN, never promoted to REAL_PROVEN
      const classification = e.provenance_classification || 'UNKNOWN';

      const fullEvidence: RawEvidenceObject = {
        evidence_uuid: evidenceUuid,
        source_uuid: e.source_uuid,
        source_url: e.source_url,
        deep_link: e.deep_link,
        document_title: e.document_title,
        document_type: e.document_type,
        retrieved_at: retrievedAt,
        published_at: e.published_at,
        source_tier: e.source_tier,
        raw_snapshot_uuid: e.raw_snapshot_uuid,
        retrieval_content_sha256: e.retrieval_content_sha256,
        claim_fingerprint: e.claim_fingerprint,
        content_hash: contentHash,
        parser_version: e.parser_version,
        extraction_method: e.extraction_method,
        supporting_locator: e.supporting_locator,
        verification_state: e.verification_state || 'EXTRACTED_UNREVIEWED',
        seat_uuid: e.seat_uuid,
        person_uuid: e.person_uuid,
        field_key: e.field_key,
        extracted_value: e.extracted_value,
        provenance_classification: classification
      };

      await db.insert(rawEvidenceObjects).values({
        evidenceUuid: fullEvidence.evidence_uuid,
        sourceUuid: fullEvidence.source_uuid,
        sourceUrl: fullEvidence.source_url,
        deepLink: fullEvidence.deep_link || null,
        documentTitle: fullEvidence.document_title,
        documentType: fullEvidence.document_type,
        retrievedAt: fullEvidence.retrieved_at,
        publishedAt: fullEvidence.published_at || null,
        sourceTier: fullEvidence.source_tier,
        rawSnapshotUuid: fullEvidence.raw_snapshot_uuid || null,
        retrievalContentSha256: fullEvidence.retrieval_content_sha256 || null,
        claimFingerprint: fullEvidence.claim_fingerprint || null,
        contentHash: fullEvidence.content_hash,
        parserVersion: fullEvidence.parser_version,
        extractionMethod: fullEvidence.extraction_method,
        supportingLocator: fullEvidence.supporting_locator || null,
        verificationState: fullEvidence.verification_state || 'EXTRACTED_UNREVIEWED',
        seatUuid: fullEvidence.seat_uuid || null,
        personUuid: fullEvidence.person_uuid || null,
        fieldKey: fullEvidence.field_key || null,
        extractedValue: fullEvidence.extracted_value || null,
        provenanceClassification: fullEvidence.provenance_classification || 'UNKNOWN'
      }).onConflictDoNothing();

      results.push(fullEvidence);
    }

    return results;
  }

  public async getAllEvidenceObjects(): Promise<RawEvidenceObject[]> {
    this.ensurePostgresConfigured('getAllEvidenceObjects');
    const rows = await db.select().from(rawEvidenceObjects).orderBy(desc(rawEvidenceObjects.retrievedAt));
    return rows.map(r => ({
      evidence_uuid: r.evidenceUuid,
      source_uuid: r.sourceUuid,
      source_url: r.sourceUrl,
      deep_link: r.deepLink || undefined,
      document_title: r.documentTitle,
      document_type: r.documentType,
      retrieved_at: r.retrievedAt,
      published_at: r.publishedAt || undefined,
      source_tier: r.sourceTier as any,
      raw_snapshot_uuid: r.rawSnapshotUuid || undefined,
      retrieval_content_sha256: r.retrievalContentSha256 || undefined,
      claim_fingerprint: r.claimFingerprint || undefined,
      content_hash: r.contentHash,
      parser_version: r.parserVersion,
      extraction_method: r.extractionMethod,
      supporting_locator: r.supportingLocator || undefined,
      verification_state: r.verificationState as any,
      seat_uuid: r.seatUuid || undefined,
      person_uuid: r.personUuid || undefined,
      field_key: r.fieldKey || undefined,
      extracted_value: r.extractedValue || undefined,
      provenance_classification: r.provenanceClassification as any
    }));
  }

  public async getEvidenceForSeat(seatUuid: string): Promise<RawEvidenceObject[]> {
    this.ensurePostgresConfigured('getEvidenceForSeat');
    const rows = await db.select().from(rawEvidenceObjects)
      .where(eq(rawEvidenceObjects.seatUuid, seatUuid))
      .orderBy(desc(rawEvidenceObjects.retrievedAt));

    return rows.map(r => ({
      evidence_uuid: r.evidenceUuid,
      source_uuid: r.sourceUuid,
      source_url: r.sourceUrl,
      deep_link: r.deepLink || undefined,
      document_title: r.documentTitle,
      document_type: r.documentType,
      retrieved_at: r.retrievedAt,
      published_at: r.publishedAt || undefined,
      source_tier: r.sourceTier as any,
      raw_snapshot_uuid: r.rawSnapshotUuid || undefined,
      retrieval_content_sha256: r.retrievalContentSha256 || undefined,
      claim_fingerprint: r.claimFingerprint || undefined,
      content_hash: r.contentHash,
      parser_version: r.parserVersion,
      extraction_method: r.extractionMethod,
      supporting_locator: r.supportingLocator || undefined,
      verification_state: r.verificationState as any,
      seat_uuid: r.seatUuid || undefined,
      person_uuid: r.personUuid || undefined,
      field_key: r.fieldKey || undefined,
      extracted_value: r.extractedValue || undefined,
      provenance_classification: r.provenanceClassification as any
    }));
  }

  // =========================================================================
  // SOURCE REGISTRY
  // =========================================================================

  public async getSourceRegistry(): Promise<SourceRegistryEntry[]> {
    this.ensurePostgresConfigured('getSourceRegistry');
    const rows = await db.select().from(hermesSourceRegistry);
    return rows.map(r => ({
      source_uuid: r.sourceUuid,
      source_id: r.sourceId,
      source_name: r.sourceName,
      authority_tier: r.authorityTier as any,
      base_url: r.baseUrl,
      jurisdiction: r.jurisdiction,
      rate_limit_req_per_sec: r.rateLimitReqPerSec,
      status: r.status as any,
      consecutive_failures: r.consecutiveFailures,
      circuit_opens_count: r.circuitOpensCount,
      circuit_reopen_at: r.circuitReopenAt || undefined,
      last_success_at: r.lastSuccessAt || undefined,
      last_failure_at: r.lastFailureAt || undefined,
      last_error: r.lastError || undefined,
      last_checked_at: r.lastCheckedAt || undefined
    }));
  }

  public async updateSourceStatus(sourceId: string, status: string, error?: string): Promise<void> {
    this.ensurePostgresConfigured('updateSourceStatus');
    const nowIso = new Date().toISOString();
    await db.update(hermesSourceRegistry).set({
      status,
      lastCheckedAt: nowIso,
      lastError: error || null,
      lastSuccessAt: status === 'HEALTHY' ? nowIso : undefined,
      lastFailureAt: status !== 'HEALTHY' ? nowIso : undefined
    }).where(eq(hermesSourceRegistry.sourceId, sourceId));
  }

  // =========================================================================
  // COVERAGE RECORDS (SEATS & PERSONS)
  // =========================================================================

  public async getSeatCoverageRecords(): Promise<SeatCoverageStatusRecord[]> {
    this.ensurePostgresConfigured('getSeatCoverageRecords');
    const rows = await db.select().from(seatCoverageStatuses);
    return rows.map(r => ({
      seat_uuid: r.seatUuid,
      office_name: r.officeName,
      office_type: r.officeType,
      jurisdiction: r.jurisdiction,
      county_fips: r.countyFips || undefined,
      district_number: r.districtNumber || undefined,
      government_level: r.governmentLevel as any,
      current_official_person_uuid: r.currentOfficialPersonUuid || undefined,
      current_official_name: r.currentOfficialName || undefined,
      is_vacant: r.isVacant as any,
      vacancy_status: r.vacancyStatus as any,
      tenure_years: r.tenureYears,
      term_start: r.termStart,
      term_end: r.termEnd,
      next_election_date: r.nextElectionDate,
      in_active_election_cycle: r.inActiveElectionCycle,
      completeness_percentage: r.completenessPercentage,
      coverage_status: r.coverageStatus as any,
      verification_state: r.verificationState as any,
      last_updated_at: r.lastUpdatedAt
    }));
  }

  public async updateSeatCoverageRecord(seatUuid: string, updates: Partial<SeatCoverageStatusRecord>): Promise<void> {
    this.ensurePostgresConfigured('updateSeatCoverageRecord');
    const nowIso = new Date().toISOString();
    await db.update(seatCoverageStatuses).set({
      completenessPercentage: updates.completeness_percentage,
      coverageStatus: updates.coverage_status,
      verificationState: updates.verification_state,
      lastUpdatedAt: nowIso
    }).where(eq(seatCoverageStatuses.seatUuid, seatUuid));
  }

  public async getPersonCoverageRecords(): Promise<PersonCoverageStatusRecord[]> {
    this.ensurePostgresConfigured('getPersonCoverageRecords');
    const rows = await db.select().from(personCoverageStatuses);
    return rows.map(r => ({
      person_uuid: r.personUuid,
      name: r.name,
      title: r.title,
      office_type: r.officeType,
      party: r.party,
      district: r.district,
      jurisdiction: r.jurisdiction,
      seat_uuid: r.seatUuid,
      completeness_percentage: r.completenessPercentage,
      research_state: r.researchState as any,
      last_audited_at: r.lastAuditedAt
    }));
  }

  // =========================================================================
  // DEAD LETTERS, MONITORING, GAPS, ACADEMY, PROOFS
  // =========================================================================

  public async getDeadLetterJobs(): Promise<DeadLetterJobRecord[]> {
    this.ensurePostgresConfigured('getDeadLetterJobs');
    const rows = await db.select().from(deadLetterJobs).orderBy(desc(deadLetterJobs.movedAt));
    return rows.map(r => ({
      dead_letter_uuid: r.deadLetterUuid,
      job_uuid: r.jobUuid,
      agent_id: r.agentId,
      job_type: r.jobType,
      attempts_made: r.attemptsMade,
      final_error: r.finalError,
      source_id: r.sourceId || undefined,
      payload_snapshot: r.payloadSnapshot,
      moved_at: r.movedAt
    }));
  }

  public async recordMonitoringEvent(event: Omit<MonitoringEventRecord, 'event_uuid'>): Promise<MonitoringEventRecord> {
    this.ensurePostgresConfigured('recordMonitoringEvent');
    const eventUuid = `mon_ev_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    await db.insert(monitoringEvents).values({
      eventUuid,
      obligationId: event.obligation_id,
      checkId: event.check_id,
      retrievalId: event.retrieval_id,
      comparisonId: event.comparison_id,
      previousHash: event.previous_hash,
      currentHash: event.current_hash,
      comparisonEvent: event.comparison_event,
      observedUrl: event.observed_url,
      sourceOrigin: event.source_origin || 'LIVE_NETWORK',
      statusCode: event.status_code || null,
      errorMessage: event.error_message || null,
      timestamp: event.timestamp
    });

    return { ...event, event_uuid: eventUuid };
  }

  public async getMonitoringEvents(): Promise<MonitoringEventRecord[]> {
    this.ensurePostgresConfigured('getMonitoringEvents');
    const rows = await db.select().from(monitoringEvents).orderBy(desc(monitoringEvents.timestamp));
    return rows.map(r => ({
      event_uuid: r.eventUuid,
      obligation_id: r.obligationId,
      check_id: r.checkId,
      retrieval_id: r.retrievalId,
      comparison_id: r.comparisonId,
      previous_hash: r.previousHash,
      current_hash: r.currentHash,
      comparison_event: r.comparisonEvent as any,
      observed_url: r.observedUrl,
      source_origin: r.sourceOrigin as any,
      status_code: r.statusCode || undefined,
      error_message: r.errorMessage || undefined,
      timestamp: r.timestamp
    }));
  }

  public async getDurableGaps(): Promise<DurableGapRecord[]> {
    this.ensurePostgresConfigured('getDurableGaps');
    const rows = await db.select().from(durableGaps);
    return rows.map(r => ({
      gap_id: r.gapId,
      seat_uuid: r.seatUuid,
      person_uuid: r.personUuid || undefined,
      office_type: r.officeType,
      missing_scope: r.missingScope,
      priority: r.priority as any,
      auto_generated_job_type: r.autoGeneratedJobType || undefined,
      status: r.status as any,
      job_uuid: r.jobUuid || undefined,
      created_at: r.createdAt,
      resolved_at: r.resolvedAt || undefined
    }));
  }

  public async createDurableGap(gap: Omit<DurableGapRecord, 'gap_id' | 'created_at'>): Promise<DurableGapRecord> {
    this.ensurePostgresConfigured('createDurableGap');
    const gapId = `gap_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const nowIso = new Date().toISOString();

    await db.insert(durableGaps).values({
      gapId,
      seatUuid: gap.seat_uuid,
      personUuid: gap.person_uuid || null,
      officeType: gap.office_type,
      missingScope: gap.missing_scope,
      priority: gap.priority,
      autoGeneratedJobType: gap.auto_generated_job_type || null,
      status: gap.status,
      jobUuid: gap.job_uuid || null,
      createdAt: nowIso,
      resolvedAt: null
    });

    return { ...gap, gap_id: gapId, created_at: nowIso };
  }

  public async updateDurableGap(gapId: string, updates: Partial<DurableGapRecord>): Promise<DurableGapRecord | null> {
    this.ensurePostgresConfigured('updateDurableGap');
    await db.update(durableGaps).set({
      status: updates.status,
      resolvedAt: updates.resolved_at
    }).where(eq(durableGaps.gapId, gapId));

    const rows = await db.select().from(durableGaps).where(eq(durableGaps.gapId, gapId)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      gap_id: r.gapId,
      seat_uuid: r.seatUuid,
      person_uuid: r.personUuid || undefined,
      office_type: r.officeType,
      missing_scope: r.missingScope,
      priority: r.priority as any,
      auto_generated_job_type: r.autoGeneratedJobType || undefined,
      status: r.status as any,
      job_uuid: r.jobUuid || undefined,
      created_at: r.createdAt,
      resolved_at: r.resolvedAt || undefined
    };
  }

  public async recordAcademyObservation(obs: Omit<DurableAcademyObservationRecord, 'observation_id' | 'created_at'>): Promise<DurableAcademyObservationRecord> {
    this.ensurePostgresConfigured('recordAcademyObservation');
    const observationId = `obs_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const nowIso = new Date().toISOString();

    await db.insert(academyObservations).values({
      observationId,
      sourceId: obs.source_id,
      parserId: obs.parser_id,
      incidentType: obs.incident_type,
      observedPayloadSample: obs.observed_payload_sample,
      observedSha256: obs.observed_sha256,
      errorMessage: obs.error_message || null,
      createdAt: nowIso
    });

    return { ...obs, observation_id: observationId, created_at: nowIso };
  }

  public async getAcademyObservations(): Promise<DurableAcademyObservationRecord[]> {
    this.ensurePostgresConfigured('getAcademyObservations');
    const rows = await db.select().from(academyObservations).orderBy(desc(academyObservations.createdAt));
    return rows.map(r => ({
      observation_id: r.observationId,
      source_id: r.sourceId,
      parser_id: r.parserId,
      incident_type: r.incidentType as any,
      observed_payload_sample: r.observedPayloadSample,
      observed_sha256: r.observedSha256,
      error_message: r.errorMessage || undefined,
      created_at: r.createdAt
    }));
  }

  public async recordAcademyCase(caseRecord: Omit<DurableAcademyCaseRecord, 'case_id' | 'created_at'>): Promise<DurableAcademyCaseRecord> {
    this.ensurePostgresConfigured('recordAcademyCase');
    const caseId = `case_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const nowIso = new Date().toISOString();

    await db.insert(academyCases).values({
      caseId,
      observationId: caseRecord.observation_id,
      caseTitle: caseRecord.case_title,
      proposedRule: caseRecord.proposed_rule || null,
      state: caseRecord.state,
      testResult: caseRecord.test_result || null,
      createdAt: nowIso,
      testedAt: caseRecord.tested_at || null,
      promotedAt: caseRecord.promoted_at || null,
      promotionAuthority: caseRecord.promotion_authority || null
    });

    return { ...caseRecord, case_id: caseId, created_at: nowIso };
  }

  public async getAcademyCases(): Promise<DurableAcademyCaseRecord[]> {
    this.ensurePostgresConfigured('getAcademyCases');
    const rows = await db.select().from(academyCases).orderBy(desc(academyCases.createdAt));
    return rows.map(r => ({
      case_id: r.caseId,
      observation_id: r.observationId,
      case_title: r.caseTitle,
      proposed_rule: r.proposedRule || undefined,
      state: r.state as any,
      test_result: (r.testResult as 'PASS' | 'FAIL') || undefined,
      created_at: r.createdAt,
      tested_at: r.testedAt || undefined,
      promoted_at: r.promotedAt || undefined,
      promotion_authority: r.promotionAuthority || undefined
    }));
  }

  public async updateAcademyCase(caseId: string, updates: Partial<DurableAcademyCaseRecord>): Promise<DurableAcademyCaseRecord | null> {
    this.ensurePostgresConfigured('updateAcademyCase');
    await db.update(academyCases).set({
      state: updates.state,
      testResult: updates.test_result,
      testedAt: updates.tested_at,
      promotedAt: updates.promoted_at,
      promotionAuthority: updates.promotion_authority
    }).where(eq(academyCases.caseId, caseId));

    const rows = await db.select().from(academyCases).where(eq(academyCases.caseId, caseId)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      case_id: r.caseId,
      observation_id: r.observationId,
      case_title: r.caseTitle,
      proposed_rule: r.proposedRule || undefined,
      state: r.state as any,
      test_result: (r.testResult as 'PASS' | 'FAIL') || undefined,
      created_at: r.createdAt,
      tested_at: r.testedAt || undefined,
      promoted_at: r.promotedAt || undefined,
      promotion_authority: r.promotionAuthority || undefined
    };
  }

  public async recordAutonomousProof(proof: Omit<DurableAutonomousProofRecord, 'proof_uuid' | 'proven_at'>): Promise<DurableAutonomousProofRecord> {
    this.ensurePostgresConfigured('recordAutonomousProof');
    const proofUuid = `proof_auto_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const nowIso = new Date().toISOString();

    await db.insert(autonomousProofRecords).values({
      proofUuid,
      workId: proof.work_id,
      leaseId: proof.lease_id,
      workerId: proof.worker_id,
      retrievalId: proof.retrieval_id,
      artifactId: proof.artifact_id,
      nextWorkId: proof.next_work_id,
      verifierSelfDispatches: Boolean(proof.verifier_self_dispatches),
      provenAt: nowIso
    });

    return { ...proof, proof_uuid: proofUuid, proven_at: nowIso };
  }

  public async getAutonomousProofRecords(): Promise<DurableAutonomousProofRecord[]> {
    this.ensurePostgresConfigured('getAutonomousProofRecords');
    const rows = await db.select().from(autonomousProofRecords).orderBy(desc(autonomousProofRecords.provenAt));
    return rows.map(r => ({
      proof_uuid: r.proofUuid,
      work_id: r.workId,
      lease_id: r.leaseId,
      worker_id: r.workerId,
      retrieval_id: r.retrievalId,
      artifact_id: r.artifactId,
      next_work_id: r.nextWorkId,
      verifier_self_dispatches: false as const,
      proven_at: r.provenAt
    }));
  }

  public async recordMonitoringProof(proof: Omit<DurableMonitoringProofRecord, 'proof_uuid' | 'proven_at'>): Promise<DurableMonitoringProofRecord> {
    this.ensurePostgresConfigured('recordMonitoringProof');
    const proofUuid = `proof_mon_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const nowIso = new Date().toISOString();

    await db.insert(monitoringProofRecords).values({
      proofUuid,
      obligationId: proof.obligation_id,
      checkId: proof.check_id,
      retrievalId: proof.retrieval_id,
      comparisonId: proof.comparison_id,
      sourceOrigin: proof.source_origin || 'LIVE_NETWORK',
      verifierExecutesFetch: Boolean(proof.verifier_executes_fetch),
      provenAt: nowIso
    });

    return { ...proof, proof_uuid: proofUuid, proven_at: nowIso };
  }

  public async getMonitoringProofRecords(): Promise<DurableMonitoringProofRecord[]> {
    this.ensurePostgresConfigured('getMonitoringProofRecords');
    const rows = await db.select().from(monitoringProofRecords).orderBy(desc(monitoringProofRecords.provenAt));
    return rows.map(r => ({
      proof_uuid: r.proofUuid,
      obligation_id: r.obligationId,
      check_id: r.checkId,
      retrieval_id: r.retrievalId,
      comparison_id: r.comparisonId,
      source_origin: r.sourceOrigin as any,
      verifier_executes_fetch: false as const,
      proven_at: r.provenAt
    }));
  }

  // =========================================================================
  // BRIDGE SUBMISSIONS (POSTGRESQL-BACKED IDEMPOTENCY)
  // =========================================================================

  public async getBridgeSubmission(jobId: string): Promise<ResultSubmissionRecord | null> {
    this.ensurePostgresConfigured('getBridgeSubmission');
    const rows = await db.select().from(bridgeSubmissions)
      .where(eq(bridgeSubmissions.jobId, jobId))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      submission_id: r.submissionId,
      job_id: r.jobId,
      idempotency_key: r.idempotencyKey,
      delivery_state: r.deliveryState as any,
      attempts: r.attempts,
      max_attempts: r.maxAttempts,
      next_retry_at: r.nextRetryAt || null,
      last_attempt_at: r.lastAttemptAt || null,
      last_error: r.lastError || null,
      acknowledgment: (r.acknowledgment as any) || null,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    };
  }

  public async getAllBridgeSubmissions(): Promise<ResultSubmissionRecord[]> {
    this.ensurePostgresConfigured('getAllBridgeSubmissions');
    const rows = await db.select().from(bridgeSubmissions).orderBy(desc(bridgeSubmissions.createdAt));
    return rows.map(r => ({
      submission_id: r.submissionId,
      job_id: r.jobId,
      idempotency_key: r.idempotencyKey,
      delivery_state: r.deliveryState as any,
      attempts: r.attempts,
      max_attempts: r.maxAttempts,
      next_retry_at: r.nextRetryAt || null,
      last_attempt_at: r.lastAttemptAt || null,
      last_error: r.lastError || null,
      acknowledgment: (r.acknowledgment as any) || null,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    }));
  }

  public async getBridgeResultPackage(jobId: string): Promise<ResearchIngestPackage | null> {
    this.ensurePostgresConfigured('getBridgeResultPackage');
    const rows = await db.select({ resultPackage: bridgeSubmissions.resultPackage })
      .from(bridgeSubmissions).where(eq(bridgeSubmissions.jobId, jobId)).limit(1);
    return (rows[0]?.resultPackage as ResearchIngestPackage | null) || null;
  }

  public async upsertBridgeSubmission(submission: ResultSubmissionRecord, resultPackage?: ResearchIngestPackage): Promise<void> {
    this.ensurePostgresConfigured('upsertBridgeSubmission');
    const nowIso = new Date().toISOString();
    await db.insert(bridgeSubmissions).values({
      submissionId: submission.submission_id || submission.job_id,
      jobId: submission.job_id,
      idempotencyKey: submission.idempotency_key || `sub_${submission.job_id}`,
      deliveryState: submission.delivery_state,
      attempts: submission.attempts,
      maxAttempts: submission.max_attempts || 10,
      nextRetryAt: submission.next_retry_at || null,
      lastAttemptAt: submission.last_attempt_at || null,
      lastError: submission.last_error || null,
      canonicalAckCode: submission.acknowledgment?.code || null,
      canonicalCorrelationId: submission.acknowledgment?.ingest_receipt_id || (submission.acknowledgment?.details as any)?.correlation_id || null,
      acknowledgment: submission.acknowledgment,
      resultPackage: resultPackage || null,
      createdAt: submission.created_at || nowIso,
      updatedAt: nowIso
    }).onConflictDoUpdate({
      target: bridgeSubmissions.jobId,
      set: {
        deliveryState: submission.delivery_state,
        attempts: submission.attempts,
        maxAttempts: submission.max_attempts,
        nextRetryAt: submission.next_retry_at || null,
        lastAttemptAt: submission.last_attempt_at || null,
        lastError: submission.last_error || null,
        canonicalAckCode: submission.acknowledgment?.code || null,
        canonicalCorrelationId: submission.acknowledgment?.ingest_receipt_id || (submission.acknowledgment?.details as any)?.correlation_id || null,
        acknowledgment: submission.acknowledgment,
        resultPackage: resultPackage || undefined,
        updatedAt: nowIso
      }
    });
  }

  // =========================================================================
  // METRICS & RECONCILIATION
  // =========================================================================

  public async getEntityCounts(): Promise<Record<string, number>> {
    const [
      jobs,
      attempts,
      leases,
      checkpoints,
      sources,
      snapshots,
      evidence,
      contracts,
      seats,
      persons,
      deadLetters,
      monEvents,
      gaps,
      acadObs,
      acadCases,
      autoProofs,
      monProofs,
      bridgeSubs
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(hermesJobs),
      db.select({ count: sql<number>`count(*)` }).from(hermesJobAttempts),
      db.select({ count: sql<number>`count(*)` }).from(hermesWorkerLeases),
      db.select({ count: sql<number>`count(*)` }).from(hermesCheckpoints),
      db.select({ count: sql<number>`count(*)` }).from(hermesSourceRegistry),
      db.select({ count: sql<number>`count(*)` }).from(rawSourceSnapshots),
      db.select({ count: sql<number>`count(*)` }).from(rawEvidenceObjects),
      db.select({ count: sql<number>`count(*)` }).from(researchContractStatuses),
      db.select({ count: sql<number>`count(*)` }).from(seatCoverageStatuses),
      db.select({ count: sql<number>`count(*)` }).from(personCoverageStatuses),
      db.select({ count: sql<number>`count(*)` }).from(deadLetterJobs),
      db.select({ count: sql<number>`count(*)` }).from(monitoringEvents),
      db.select({ count: sql<number>`count(*)` }).from(durableGaps),
      db.select({ count: sql<number>`count(*)` }).from(academyObservations),
      db.select({ count: sql<number>`count(*)` }).from(academyCases),
      db.select({ count: sql<number>`count(*)` }).from(autonomousProofRecords),
      db.select({ count: sql<number>`count(*)` }).from(monitoringProofRecords),
      db.select({ count: sql<number>`count(*)` }).from(bridgeSubmissions)
    ]);

    return {
      jobs: Number(jobs[0]?.count || 0),
      attempts: Number(attempts[0]?.count || 0),
      leases: Number(leases[0]?.count || 0),
      checkpoints: Number(checkpoints[0]?.count || 0),
      sources: Number(sources[0]?.count || 0),
      snapshots: Number(snapshots[0]?.count || 0),
      evidence: Number(evidence[0]?.count || 0),
      contracts: Number(contracts[0]?.count || 0),
      seats: Number(seats[0]?.count || 0),
      persons: Number(persons[0]?.count || 0),
      dead_letters: Number(deadLetters[0]?.count || 0),
      monitoring_events: Number(monEvents[0]?.count || 0),
      gaps: Number(gaps[0]?.count || 0),
      academy_observations: Number(acadObs[0]?.count || 0),
      academy_cases: Number(acadCases[0]?.count || 0),
      autonomous_proofs: Number(autoProofs[0]?.count || 0),
      monitoring_proofs: Number(monProofs[0]?.count || 0),
      bridge_submissions: Number(bridgeSubs[0]?.count || 0)
    };
  }

  public async getDatabaseSummary(): Promise<Record<string, any>> {
    const counts = await this.getEntityCounts();
    const queuedCount = await this.getQueuedJobsCount();

    return {
      total_jobs_in_db: counts.jobs,
      queued_jobs: queuedCount,
      total_seats_tracked: counts.seats,
      total_evidence_collected: counts.evidence,
      total_dead_letter_jobs: counts.dead_letters,
      storage_engine: 'PostgresProducerStore (Cloud SQL PostgreSQL + GCS)'
    };
  }

  private mapJobRow(r: any): PersistentHermesJob {
    return {
      job_uuid: r.jobUuid || r.job_uuid,
      agent_id: r.agentId || r.agent_id,
      logical_work_key: r.logicalWorkKey || r.logical_work_key || undefined,
      mission_uuid: r.missionUuid || r.mission_uuid || undefined,
      seat_uuid: r.seatUuid || r.seat_uuid || undefined,
      person_uuid: r.personUuid || r.person_uuid || undefined,
      race_uuid: r.raceUuid || r.race_uuid || undefined,
      campaign_uuid: r.campaignUuid || r.campaign_uuid || undefined,
      source_uuid: r.sourceUuid || r.source_uuid || undefined,
      job_type: r.jobType || r.job_type,
      priority: r.priority,
      status: (r.status) as JobStatus,
      attempt_count: r.attemptCount ?? r.attempt_count ?? 0,
      max_attempts: r.maxAttempts ?? r.max_attempts ?? 4,
      available_at: r.availableAt || r.available_at,
      locked_at: r.lockedAt || r.locked_at || undefined,
      lease_expires_at: r.leaseExpiresAt || r.lease_expires_at || undefined,
      worker_instance: r.workerInstance || r.worker_instance || undefined,
      started_at: r.startedAt || r.started_at || undefined,
      completed_at: r.completedAt || r.completed_at || undefined,
      failed_at: r.failedAt || r.failed_at || undefined,
      last_error: r.lastError || r.last_error || undefined,
      checkpoint: r.checkpoint || undefined,
      created_at: r.createdAt || r.created_at,
      updated_at: r.updatedAt || r.updated_at
    };
  }
}
