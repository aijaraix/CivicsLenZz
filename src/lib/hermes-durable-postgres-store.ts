/**
 * HERMES DURABLE POSTGRESQL STORE ADAPTER
 * 
 * Implements durable, fail-closed persistence for CivicsLenZz producer
 * state backed by Cloud SQL PostgreSQL.
 */

import { eq, and, sql, desc, gte, lt, isNull } from 'drizzle-orm';
import { db, pool } from '../db/index.ts';
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
} from '../db/schema.ts';

export class HermesDurablePostgresStore {
  private static instance: HermesDurablePostgresStore | null = null;
  private isConfigured: boolean = false;

  private constructor() {
    this.isConfigured = Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME && process.env.SQL_USER);
  }

  public static getInstance(): HermesDurablePostgresStore {
    if (!HermesDurablePostgresStore.instance) {
      HermesDurablePostgresStore.instance = new HermesDurablePostgresStore();
    }
    return HermesDurablePostgresStore.instance;
  }

  public isAvailable(): boolean {
    return this.isConfigured;
  }

  /**
   * Health check to ensure SQL connectivity
   */
  public async checkHealth(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
    if (!this.isConfigured) {
      return { ok: false, error: 'Database environment variables not configured' };
    }
    const start = Date.now();
    try {
      await db.execute(sql`SELECT 1`);
      return { ok: true, latencyMs: Date.now() - start };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  }

  // --- JOB OPERATIONS WITH ACID TRANSACTIONS & LEASING ---

  public async getJob(jobUuid: string) {
    const results = await db.select().from(hermesJobs).where(eq(hermesJobs.jobUuid, jobUuid)).limit(1);
    return results[0] || null;
  }

  public async getAllJobs() {
    return await db.select().from(hermesJobs).orderBy(desc(hermesJobs.createdAt));
  }

  public async insertJob(job: typeof hermesJobs.$inferInsert) {
    const res = await db.insert(hermesJobs).values(job).onConflictDoNothing().returning();
    return res[0] || null;
  }

  public async updateJobStatus(jobUuid: string, status: string, updates: Partial<typeof hermesJobs.$inferInsert> = {}) {
    const res = await db.update(hermesJobs)
      .set({
        status,
        updatedAt: new Date().toISOString(),
        ...updates
      })
      .where(eq(hermesJobs.jobUuid, jobUuid))
      .returning();
    return res[0] || null;
  }

  /**
   * Atomic Lease Acquisition using Postgres row locking semantics
   */
  public async acquireAtomicLease(
    workerInstance: string,
    agentId: string,
    leaseDurationSec: number = 300
  ): Promise<{ job: typeof hermesJobs.$inferSelect; leaseUuid: string } | null> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + leaseDurationSec * 1000).toISOString();
    const nowIso = now.toISOString();

    // Use a transaction to safely select and lease exactly one eligible job
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Select candidate job FOR UPDATE SKIP LOCKED
      const selectRes = await client.query(`
        SELECT job_uuid, agent_id, mission_uuid, seat_uuid, person_uuid, race_uuid, campaign_uuid,
               source_uuid, job_type, priority, status, attempt_count, max_attempts, available_at,
               locked_at, lease_expires_at, worker_instance, started_at, completed_at, failed_at,
               last_error, checkpoint, created_at, updated_at
        FROM hermes_jobs
        WHERE (
          status IN ('QUEUED', 'CHECKPOINTED', 'FAILED_RETRYABLE')
          OR (status = 'LEASED' AND lease_expires_at < $1)
        )
        AND available_at <= $1
        ORDER BY priority DESC, created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `, [nowIso]);

      if (selectRes.rows.length === 0) {
        await client.query('COMMIT');
        return null;
      }

      const candidate = selectRes.rows[0];
      const jobUuid = candidate.job_uuid;
      const leaseUuid = `lease_${jobUuid}_${Date.now()}`;
      const attemptCount = (candidate.attempt_count || 0) + 1;

      // Update job state
      await client.query(`
        UPDATE hermes_jobs
        SET status = 'LEASED',
            worker_instance = $1,
            locked_at = $2,
            lease_expires_at = $3,
            attempt_count = $4,
            started_at = COALESCE(started_at, $2),
            updated_at = $2
        WHERE job_uuid = $5
      `, [workerInstance, nowIso, expiresAt, attemptCount, jobUuid]);

      // Upsert worker lease
      await client.query(`
        INSERT INTO hermes_worker_leases (lease_uuid, job_uuid, worker_instance, agent_id, acquired_at, expires_at, last_heartbeat_at)
        VALUES ($1, $2, $3, $4, $5, $6, $5)
        ON CONFLICT (job_uuid) DO UPDATE
        SET lease_uuid = $1,
            worker_instance = $3,
            agent_id = $4,
            acquired_at = $5,
            expires_at = $6,
            last_heartbeat_at = $5
      `, [leaseUuid, jobUuid, workerInstance, agentId, nowIso, expiresAt]);

      // Record attempt
      const attemptUuid = `att_${jobUuid}_${attemptCount}_${Date.now()}`;
      await client.query(`
        INSERT INTO hermes_job_attempts (attempt_uuid, job_uuid, worker_instance, started_at, status, records_extracted)
        VALUES ($1, $2, $3, $4, 'RUNNING', 0)
      `, [attemptUuid, jobUuid, workerInstance, nowIso]);

      await client.query('COMMIT');

      // Fetch fresh job
      const freshJob = await this.getJob(jobUuid);
      return freshJob ? { job: freshJob, leaseUuid } : null;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Release Lease and Complete Job
   */
  public async completeJob(jobUuid: string, recordsExtracted: number = 0) {
    const nowIso = new Date().toISOString();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`
        UPDATE hermes_jobs
        SET status = 'COMPLETED',
            completed_at = $1,
            lease_expires_at = NULL,
            updated_at = $1
        WHERE job_uuid = $2
      `, [nowIso, jobUuid]);

      await client.query(`DELETE FROM hermes_worker_leases WHERE job_uuid = $1`, [jobUuid]);

      await client.query(`
        UPDATE hermes_job_attempts
        SET finished_at = $1,
            status = 'SUCCESS',
            records_extracted = $2
        WHERE job_uuid = $3 AND finished_at IS NULL
      `, [nowIso, recordsExtracted, jobUuid]);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Mark Job Failed with Retry or Dead-Letter
   */
  public async failJob(jobUuid: string, error: string, retryable: boolean = true, httpStatus?: number) {
    const nowIso = new Date().toISOString();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const jobRes = await client.query(`SELECT attempt_count, max_attempts, agent_id, job_type FROM hermes_jobs WHERE job_uuid = $1 FOR UPDATE`, [jobUuid]);
      if (jobRes.rows.length === 0) {
        await client.query('COMMIT');
        return;
      }
      const job = jobRes.rows[0];
      const attempts = job.attempt_count || 1;
      const maxAttempts = job.max_attempts || 3;

      let nextStatus = 'FAILED_RETRYABLE';
      if (!retryable || attempts >= maxAttempts) {
        nextStatus = 'FAILED_PERMANENT';
      }

      await client.query(`
        UPDATE hermes_jobs
        SET status = $1,
            failed_at = $2,
            last_error = $3,
            lease_expires_at = NULL,
            updated_at = $2
        WHERE job_uuid = $4
      `, [nextStatus, nowIso, error, jobUuid]);

      await client.query(`DELETE FROM hermes_worker_leases WHERE job_uuid = $1`, [jobUuid]);

      await client.query(`
        UPDATE hermes_job_attempts
        SET finished_at = $1,
            status = $2,
            error_message = $3,
            http_status = $4
        WHERE job_uuid = $5 AND finished_at IS NULL
      `, [nowIso, nextStatus, error, httpStatus || null, jobUuid]);

      if (nextStatus === 'FAILED_PERMANENT') {
        const deadLetterUuid = `dlq_${jobUuid}_${Date.now()}`;
        await client.query(`
          INSERT INTO dead_letter_jobs (dead_letter_uuid, job_uuid, agent_id, job_type, attempts_made, final_error, moved_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (job_uuid) DO NOTHING
        `, [deadLetterUuid, jobUuid, job.agent_id, job.job_type, attempts, error, nowIso]);
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // --- RAW EVIDENCE & SNAPSHOT METHODS ---

  public async insertRawSnapshot(snapshot: typeof rawSourceSnapshots.$inferInsert) {
    return await db.insert(rawSourceSnapshots).values(snapshot).onConflictDoNothing().returning();
  }

  public async insertEvidenceObjects(evidenceList: (typeof rawEvidenceObjects.$inferInsert)[]) {
    if (evidenceList.length === 0) return [];
    return await db.insert(rawEvidenceObjects).values(evidenceList).onConflictDoNothing().returning();
  }

  // --- BRIDGE SUBMISSIONS ---

  public async getBridgeSubmission(jobId: string) {
    const results = await db.select().from(bridgeSubmissions).where(eq(bridgeSubmissions.jobId, jobId)).limit(1);
    return results[0] || null;
  }

  public async getAllBridgeSubmissions() {
    return await db.select().from(bridgeSubmissions).orderBy(desc(bridgeSubmissions.createdAt));
  }

  public async upsertBridgeSubmission(sub: typeof bridgeSubmissions.$inferInsert) {
    return await db.insert(bridgeSubmissions).values(sub).onConflictDoUpdate({
      target: bridgeSubmissions.jobId,
      set: {
        deliveryState: sub.deliveryState,
        attempts: sub.attempts,
        maxAttempts: sub.maxAttempts,
        nextRetryAt: sub.nextRetryAt,
        lastAttemptAt: sub.lastAttemptAt,
        lastError: sub.lastError,
        canonicalAckCode: sub.canonicalAckCode,
        canonicalCorrelationId: sub.canonicalCorrelationId,
        acknowledgment: sub.acknowledgment,
        resultPackage: sub.resultPackage,
        updatedAt: new Date().toISOString()
      }
    }).returning();
  }

  // --- PROOF RECORDS ---

  public async recordAutonomousProof(proof: typeof autonomousProofRecords.$inferInsert) {
    return await db.insert(autonomousProofRecords).values(proof).onConflictDoNothing().returning();
  }

  public async recordMonitoringProof(proof: typeof monitoringProofRecords.$inferInsert) {
    return await db.insert(monitoringProofRecords).values(proof).onConflictDoNothing().returning();
  }

  // --- METRICS / COUNTS RECONCILIATION ---

  public async getEntityCounts() {
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
}
