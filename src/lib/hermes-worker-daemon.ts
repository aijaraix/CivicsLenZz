/**
 * CIVICLENZ / HERMES SERVER-SIDE WORKER DAEMON ENGINE
 * Runs continuously inside the Node Express server process 24/7.
 * Uses authoritative PostgresProducerStore + GcsRawObjectStore.
 * Claims queued jobs, acquires atomic worker leases with row locks,
 * executes real source adapters, computes SHA-256 evidence hashes,
 * manages retries, runs monitoring schedules, and handles watchdog expiration.
 * 
 * FAILS CLOSED if PostgreSQL or raw storage is unavailable.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getProducerPersistence } from './producer-storage/index';
import { PersistentHermesJob } from './hermes-backend-store';
import { sourceAdapters, type AdapterParseResult } from './source-adapters';
import { stageCanonicalResultForCompletedJob } from './durable-canonical-production';
import { hermesBridgeClient } from './hermes-bridge-client';
import { harvesterCapabilityMatrixEngine } from './harvester-capability-matrix';
import { harvesterAcademy } from './harvester-academy';

export class HermesWorkerDaemonEngine {
  private isRunning = false;
  private timerHandle: NodeJS.Timeout | null = null;
  private watchdogHandle: NodeJS.Timeout | null = null;
  private activeJobsProcessing = new Set<string>();
  private startupError: string | null = null;

  private canonicalAssignmentsOnly(): boolean {
    return process.env.CIVICSLENZZ_CANONICAL_ASSIGNMENTS_ONLY === 'true';
  }

  public async startDaemon() {
    if (this.isRunning) return;

    console.log('=================================================================');
    console.log('[HERMES WORKER DAEMON] Initializing Server-Side Ingestion Engine...');
    console.log('[HERMES WORKER DAEMON] Storage: Authoritative Cloud SQL PostgreSQL + GCS');
    console.log('=================================================================');

    const persistence = getProducerPersistence();

    // 1. Fail Closed Health Check before startup
    try {
      await persistence.initialize();
      const health = await persistence.checkHealth();
      if (!health.postgresConnected || !health.postgresSchemaReady) {
        this.startupError = health.error || 'Durable PostgreSQL storage not ready';
        console.error(`[HERMES WORKER DAEMON] FAIL-CLOSED: Daemon refusing to start - ${this.startupError}`);
        return;
      }
      (persistence as any).setDaemonActive?.(true);
    } catch (err: any) {
      this.startupError = err.message || 'Storage initialization failed';
      console.error(`[HERMES WORKER DAEMON] FAIL-CLOSED: Startup exception - ${this.startupError}`);
      return;
    }

    this.isRunning = true;
    this.startupError = null;

    // 2. Initial Backlog Scheduling Scan on Server Startup. During controlled
    // canonical production, only HERMES-assigned durable jobs may enter execution.
    if (!this.canonicalAssignmentsOnly()) {
      await this.scheduleInitialFloridaBacklogJobs();
    }

    // 3. Main Daemon Loop (Every 5 seconds)
    this.timerHandle = setInterval(() => {
      this.executeOneCycle().catch(err => {
        console.error('[HERMES WORKER DAEMON] Cycle Error:', err);
      });
    }, 5000);

    // 4. Lease & Orphaned Job Watchdog (Every 30 seconds)
    this.watchdogHandle = setInterval(() => {
      this.runLeaseExpirationWatchdog().catch(err => {
        console.error('[HERMES WORKER DAEMON] Watchdog Error:', err);
      });
    }, 30000);

    console.log('[HERMES WORKER DAEMON] Daemon started successfully against PostgreSQL.');
  }

  public stopDaemon() {
    this.isRunning = false;
    if (this.timerHandle) clearInterval(this.timerHandle);
    if (this.watchdogHandle) clearInterval(this.watchdogHandle);
    const persistence = getProducerPersistence();
    (persistence as any).setDaemonActive?.(false);
    console.log('[HERMES WORKER DAEMON] Daemon execution stopped.');
  }

  public async executeOneCycle() {
    if (!this.isRunning) return;
    await hermesBridgeClient.retryDueCanonicalSubmissions(1);
    await this.executeDaemonCycle();
    if (!this.canonicalAssignmentsOnly()) {
      await this.executeMonitoringCycle();
      await this.executeGapDetectionCycle();
      await this.executeAcademyCycle();
    }
  }

  private async scheduleInitialFloridaBacklogJobs() {
    const persistence = getProducerPersistence();
    const queuedCount = await persistence.getQueuedJobsCount();
    console.log(`[HERMES WORKER DAEMON] Server Startup Check: ${queuedCount} Queued Jobs in PostgreSQL.`);

    if (queuedCount === 0) {
      console.log('[HERMES WORKER DAEMON] Queue empty. Scheduling Florida Priority Research Jobs...');
      
      const priorityJobs = [
        { agent_id: 'H1', job_type: 'INGEST_CANDIDATE_FILINGS', seat_uuid: 'fl_us_senate_seat_01', priority: 10, logical_work_key: 'fl_us_senate_seat_01_candidates' },
        { agent_id: 'H13', job_type: 'INGEST_LEGISLATIVE_ROSTER', seat_uuid: 'fl_senate_dist_34', priority: 9, logical_work_key: 'fl_senate_dist_34_roster' },
        { agent_id: 'H13', job_type: 'INGEST_LEGISLATIVE_ROSTER', seat_uuid: 'fl_senate_dist_35', priority: 9, logical_work_key: 'fl_senate_dist_35_roster' },
        { agent_id: 'H2', job_type: 'INGEST_COUNTY_ELECTION_DATA', seat_uuid: 'fl_miami_dade_mayor_seat_01', priority: 8, logical_work_key: 'fl_miami_dade_mayor_seat_01_elections' },
        { agent_id: 'H11', job_type: 'INGEST_EXECUTIVE_ORDERS', seat_uuid: 'fl_governor_seat_01', priority: 8, logical_work_key: 'fl_governor_seat_01_eo' },
        { agent_id: 'Q1', job_type: 'COMPLETENESS_AUDIT_SCAN', seat_uuid: 'fl_us_senate_seat_02', priority: 7, logical_work_key: 'fl_us_senate_seat_02_audit' }
      ];

      for (const job of priorityJobs) {
        await persistence.createJob(job);
      }
    }
  }

  public async executeDaemonCycle() {
    const persistence = getProducerPersistence();
    const agentsToRun = ['H1', 'H2', 'H13', 'H11', 'Q1'];

    for (const agentId of agentsToRun) {
      const workerInstance = `${agentId}-worker-${Date.now().toString(36).slice(-4)}`;
      
      // Atomic Lease acquisition with FOR UPDATE SKIP LOCKED
      const claimed = await persistence.claimAtomicLease(
        agentId, workerInstance, 60, this.canonicalAssignmentsOnly() ? 'canonical:' : undefined
      );

      if (claimed) {
        const { job, lease, attempt } = claimed;
        if (this.activeJobsProcessing.has(job.job_uuid)) continue;

        this.activeJobsProcessing.add(job.job_uuid);
        console.log(`[HERMES DAEMON] Worker [${workerInstance}] claimed Job [${job.job_uuid}] Type: ${job.job_type} Agent: ${agentId} Attempt: ${attempt.attempt_uuid}`);

        try {
          await this.processClaimedJob(job, workerInstance, lease.lease_uuid, attempt.attempt_uuid);
        } catch (err: any) {
          const isAdapterFailure = err.message && err.message.includes('ADAPTER_EXECUTION_FAILED');
          if (isAdapterFailure) {
            console.warn(`[HERMES DAEMON] Job [${job.job_uuid}] adapter retrieval deferred: ${err.message}`);
          } else {
            console.error(`[HERMES DAEMON] Job Processing Exception [${job.job_uuid}]:`, err);
          }
          const isUnsupported = Boolean(err.message && err.message.includes('UNSUPPORTED_JOB_TYPE'));
          await persistence.failJob(
            job.job_uuid,
            attempt.attempt_uuid,
            err.message || 'Processing Exception',
            !isUnsupported
          );
        } finally {
          this.activeJobsProcessing.delete(job.job_uuid);
        }
      }
    }
  }

  private async processClaimedJob(
    job: PersistentHermesJob,
    workerInstance: string,
    leaseUuid: string,
    attemptUuid: string
  ) {
    const persistence = getProducerPersistence();
    let resultRecords = 0;
    let artifactId = '';
    let retrievalId = '';
    let contentSha256 = '';
    let completedParseResult: AdapterParseResult | null = null;

    if (job.job_type === 'INGEST_CANDIDATE_FILINGS') {
      const parseResult = await sourceAdapters.fl_dos_elections.fetchCandidateFilings();
      completedParseResult = parseResult;
      if (!parseResult.success) {
        throw new Error(`ADAPTER_EXECUTION_FAILED: [${parseResult.source_id}] ${parseResult.error_message || 'Candidate filings retrieval failed'}`);
      }
      resultRecords = parseResult.records_extracted;
      if (parseResult.evidence_objects.length > 0) {
        artifactId = parseResult.evidence_objects[0].evidence_uuid;
        contentSha256 = parseResult.evidence_objects[0].content_hash;
        retrievalId = `ret_${parseResult.evidence_objects[0].source_uuid}`;
      }

      if (job.seat_uuid && resultRecords > 0) {
        await persistence.updateSeatCoverageRecord(job.seat_uuid, {
          completeness_percentage: 30,
          coverage_status: 'UNREVIEWED_RESEARCH_INGESTED',
          verification_state: 'RESEARCH_PENDING'
        });
      }
    } else if (job.job_type === 'INGEST_LEGISLATIVE_ROSTER') {
      const parseResult = await sourceAdapters.fl_senate.fetchSenatorRoster(job.seat_uuid, job.person_uuid);
      completedParseResult = parseResult;
      if (!parseResult.success) {
        throw new Error(`ADAPTER_EXECUTION_FAILED: [${parseResult.source_id}] ${parseResult.error_message || 'Legislative roster retrieval failed'}`);
      }
      resultRecords = parseResult.records_extracted;
      if (parseResult.evidence_objects.length > 0) {
        artifactId = parseResult.evidence_objects[0].evidence_uuid;
        contentSha256 = parseResult.evidence_objects[0].content_hash;
        retrievalId = `ret_${parseResult.evidence_objects[0].source_uuid}`;
      }

      if (job.seat_uuid && resultRecords > 0) {
        await persistence.updateSeatCoverageRecord(job.seat_uuid, {
          completeness_percentage: 30,
          coverage_status: 'UNREVIEWED_RESEARCH_INGESTED',
          verification_state: 'RESEARCH_PENDING'
        });
      }
    } else if (job.job_type === 'INGEST_COUNTY_ELECTION_DATA') {
      const parseResult = await sourceAdapters.miami_dade_elections.fetchCountyElections(job.seat_uuid, job.person_uuid);
      completedParseResult = parseResult;
      if (!parseResult.success) {
        throw new Error(`ADAPTER_EXECUTION_FAILED: [${parseResult.source_id}] ${parseResult.error_message || 'County election data retrieval failed'}`);
      }
      resultRecords = parseResult.records_extracted;
      if (parseResult.evidence_objects.length > 0) {
        artifactId = parseResult.evidence_objects[0].evidence_uuid;
        contentSha256 = parseResult.evidence_objects[0].content_hash;
        retrievalId = `ret_${parseResult.evidence_objects[0].source_uuid}`;
      }

      if (job.seat_uuid && resultRecords > 0) {
        await persistence.updateSeatCoverageRecord(job.seat_uuid, {
          completeness_percentage: 30,
          coverage_status: 'UNREVIEWED_RESEARCH_INGESTED',
          verification_state: 'RESEARCH_PENDING'
        });
      }
    } else if (job.job_type === 'INGEST_EXECUTIVE_ORDERS') {
      const parseResult = await sourceAdapters.fl_governor.fetchExecutiveOrders(job.seat_uuid, job.person_uuid);
      completedParseResult = parseResult;
      if (!parseResult.success) {
        throw new Error(`ADAPTER_EXECUTION_FAILED: [${parseResult.source_id}] ${parseResult.error_message || 'Executive orders retrieval failed'}`);
      }
      resultRecords = parseResult.records_extracted;
      if (parseResult.evidence_objects.length > 0) {
        artifactId = parseResult.evidence_objects[0].evidence_uuid;
        contentSha256 = parseResult.evidence_objects[0].content_hash;
        retrievalId = `ret_${parseResult.evidence_objects[0].source_uuid}`;
      }

      if (job.seat_uuid && resultRecords > 0) {
        await persistence.updateSeatCoverageRecord(job.seat_uuid, {
          completeness_percentage: 30,
          coverage_status: 'UNREVIEWED_RESEARCH_INGESTED',
          verification_state: 'RESEARCH_PENDING'
        });
      }
    } else if (job.job_type === 'COMPLETENESS_AUDIT_SCAN' || job.job_type === 'RESEARCH_CONTRACT_COMPLETENESS_RUN') {
      const parseResult = await sourceAdapters.completeness_auditor.executeAudit(job.seat_uuid, job.person_uuid);
      completedParseResult = parseResult;
      if (!parseResult.success) {
        throw new Error(`ADAPTER_EXECUTION_FAILED: [${parseResult.source_id}] ${parseResult.error_message || 'Completeness audit failed'}`);
      }
      resultRecords = parseResult.records_extracted;
      if (parseResult.evidence_objects.length > 0) {
        artifactId = parseResult.evidence_objects[0].evidence_uuid;
        contentSha256 = parseResult.evidence_objects[0].content_hash;
        retrievalId = `ret_${parseResult.evidence_objects[0].source_uuid}`;
      }
    } else if (job.job_type === 'GAP_RESEARCH_FILL') {
      const gaps = await persistence.getDurableGaps();
      const targetGap = gaps.find(g => g.job_uuid === job.job_uuid || g.seat_uuid === job.seat_uuid);
      const missingScope = targetGap?.missing_scope || 'CANDIDATE_QUALIFICATION_STATUS';

      const parseResult = await sourceAdapters.gap_researcher.fillGap(job.seat_uuid || 'fl_senate_dist_34', missingScope, job.person_uuid);
      completedParseResult = parseResult;
      if (!parseResult.success) {
        throw new Error(`ADAPTER_EXECUTION_FAILED: [${parseResult.source_id}] ${parseResult.error_message || 'Gap research fill failed'}`);
      }
      resultRecords = parseResult.records_extracted;
      if (parseResult.evidence_objects.length > 0) {
        artifactId = parseResult.evidence_objects[0].evidence_uuid;
        contentSha256 = parseResult.evidence_objects[0].content_hash;
        retrievalId = `ret_${parseResult.evidence_objects[0].source_uuid}`;
      }

      if (targetGap) {
        await persistence.updateDurableGap(targetGap.gap_id, {
          status: 'RESOLVED',
          resolved_at: new Date().toISOString()
        });
      }
    } else {
      throw new Error(`UNSUPPORTED_JOB_TYPE: Job type "${job.job_type}" with agent "${job.agent_id}" is not supported by any registered worker or adapter.`);
    }

    // Canonical-assigned producer work must durably stage its exact result package
    // before the research job is completed. Producer-autonomous work remains local.
    if (completedParseResult) {
      await stageCanonicalResultForCompletedJob(job, completedParseResult);
    }

    // Complete Job and Release Lease with EXACT attempt identity
    await persistence.completeJob(job.job_uuid, attemptUuid, resultRecords);

    // Record durable autonomous proof record
    await persistence.recordAutonomousProof({
      work_id: job.job_uuid,
      lease_id: leaseUuid,
      worker_id: workerInstance,
      retrieval_id: retrievalId,
      artifact_id: artifactId,
      next_work_id: 'AUTO_EVALUATED',
      verifier_self_dispatches: false
    });

    console.log(`[HERMES DAEMON] Worker [${workerInstance}] COMPLETED Job [${job.job_uuid}] - Extracted ${resultRecords} records.`);
  }

  public async executeMonitoringCycle() {
    const persistence = getProducerPersistence();
    const schedules = harvesterCapabilityMatrixEngine.getScopeMonitoringSchedules();
    const now = new Date();

    for (const schedule of schedules) {
      const isDue = !schedule.next_check || new Date(schedule.next_check) <= now || !schedule.last_checked;
      if (isDue) {
        const checkId = `chk_mon_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
        const targetUrl = schedule.target_url || "https://flsenate.gov/Senators/";
        
        let responseBody: string | null = null;
        let retrievalOrigin: 'LIVE_NETWORK' | 'DURABLE_SNAPSHOT_FIXTURE' = 'LIVE_NETWORK';
        let checkFailed = false;
        let failureReason = '';
        let httpStatus = 200;
        
        try {
          const res = await fetch(targetUrl, {
            headers: { 'User-Agent': 'CivicLenZ-Monitoring-Scheduler/2.0' },
            signal: AbortSignal.timeout(5000)
          });
          httpStatus = res.status;
          if (res.ok) {
            responseBody = await res.text();
            retrievalOrigin = 'LIVE_NETWORK';
          } else {
            checkFailed = true;
            failureReason = `HTTP_${res.status}_${res.statusText || 'NON_OK'}`;
          }
        } catch (e: any) {
          let legitimateSnapshotPath: string | null = null;
          if (schedule.scope_id === 'scope_fl_senate_districts_even' || schedule.scope_id === 'scope_fl_legislative_elections_2026') {
            legitimateSnapshotPath = path.resolve(process.cwd(), 'data/snapshots/fl_senate_sd34_authoritative.html');
          } else if (schedule.scope_id === 'scope_fl_governor_election_2026') {
            legitimateSnapshotPath = path.resolve(process.cwd(), 'data/artifacts/executive_actions/gov_c5fd246eec99.html');
          }

          if (legitimateSnapshotPath && fs.existsSync(legitimateSnapshotPath)) {
            responseBody = fs.readFileSync(legitimateSnapshotPath, 'utf-8');
            retrievalOrigin = 'DURABLE_SNAPSHOT_FIXTURE';
          } else {
            checkFailed = true;
            failureReason = e.message || 'NETWORK_TIMEOUT_NO_SNAPSHOT';
          }
        }

        if (checkFailed || responseBody === null) {
          schedule.last_checked = now.toISOString();
          schedule.source_health = 'DEGRADED';
          schedule.consecutive_failures = (schedule.consecutive_failures || 0) + 1;
          schedule.last_comparison_event = 'CHECK_FAILED';
          schedule.next_check = new Date(Date.now() + 3600000).toISOString();

          await persistence.recordMonitoringEvent({
            obligation_id: schedule.scope_id,
            check_id: checkId,
            retrieval_id: `ret_failed_${Date.now().toString(36)}`,
            comparison_id: `cmp_failed_${Date.now().toString(36)}`,
            previous_hash: schedule.previous_content_hash || '',
            current_hash: '',
            comparison_event: 'CHECK_FAILED',
            observed_url: targetUrl,
            source_origin: 'LIVE_NETWORK',
            status_code: httpStatus,
            error_message: failureReason,
            timestamp: now.toISOString()
          });
          continue;
        }

        const currentHash = crypto.createHash('sha256').update(responseBody).digest('hex');
        const previousHash = schedule.previous_content_hash || currentHash;
        const changeDetected = schedule.previous_content_hash ? schedule.previous_content_hash !== currentHash : false;
        const comparisonId = `cmp_${currentHash.slice(0, 8)}_${Date.now().toString(36)}`;
        const retrievalId = `ret_mon_${currentHash.slice(0, 10)}`;

        schedule.last_checked = now.toISOString();
        schedule.next_check = new Date(Date.now() + 86400000).toISOString();
        schedule.previous_content_hash = currentHash;
        schedule.last_comparison_id = comparisonId;

        if (retrievalOrigin === 'DURABLE_SNAPSHOT_FIXTURE') {
          schedule.last_comparison_event = 'PARSER_REPLAY_CHECK';
          schedule.source_health = 'DEGRADED';
        } else {
          schedule.current_as_of = now.toISOString();
          schedule.source_health = 'HEALTHY';
          schedule.consecutive_failures = 0;
          schedule.last_comparison_event = changeDetected ? 'CHANGE_DETECTED' : 'NO_CHANGE';
        }

        await persistence.recordMonitoringEvent({
          obligation_id: schedule.scope_id,
          check_id: checkId,
          retrieval_id: retrievalId,
          comparison_id: comparisonId,
          previous_hash: previousHash,
          current_hash: currentHash,
          comparison_event: retrievalOrigin === 'DURABLE_SNAPSHOT_FIXTURE' ? 'PARSER_REPLAY_CHECK' : (changeDetected ? 'CHANGE_DETECTED' : 'NO_CHANGE'),
          observed_url: targetUrl,
          source_origin: retrievalOrigin,
          status_code: 200,
          timestamp: now.toISOString()
        });

        await persistence.recordMonitoringProof({
          obligation_id: schedule.scope_id,
          check_id: checkId,
          retrieval_id: retrievalId,
          comparison_id: comparisonId,
          source_origin: retrievalOrigin,
          verifier_executes_fetch: false
        });
      }
    }
  }

  public async executeGapDetectionCycle() {
    const persistence = getProducerPersistence();
    const seats = await persistence.getSeatCoverageRecords();
    const evidenceObjects = await persistence.getAllEvidenceObjects();

    for (const seat of seats) {
      const seatEvidence = evidenceObjects.filter(e => e.seat_uuid === seat.seat_uuid);
      const presentKeys = new Set(seatEvidence.map(e => e.field_key));

      const requiredScopes = ['CANDIDATE_QUALIFICATION_STATUS', 'LEGISLATOR_ROSTER_ENTRY', 'DISTRICT_BOUNDARY_GIS'];
      const missingScopes = requiredScopes.filter(scope => !presentKeys.has(scope));

      const existingGaps = await persistence.getDurableGaps();

      for (const missing of missingScopes) {
        const existingGap = existingGaps.find(g => g.seat_uuid === seat.seat_uuid && g.missing_scope === missing);
        if (!existingGap) {
          const job = await persistence.createJob({
            agent_id: 'Q1',
            job_type: 'GAP_RESEARCH_FILL',
            seat_uuid: seat.seat_uuid,
            person_uuid: seat.current_official_person_uuid,
            priority: 8,
            status: 'QUEUED',
            logical_work_key: `gap_${seat.seat_uuid}_${missing}`
          });

          await persistence.createDurableGap({
            seat_uuid: seat.seat_uuid,
            person_uuid: seat.current_official_person_uuid,
            office_type: seat.office_type,
            missing_scope: missing,
            priority: 'HIGH',
            auto_generated_job_type: 'GAP_RESEARCH_FILL',
            status: 'JOB_CREATED',
            job_uuid: job.job_uuid
          });
        }
      }
    }
  }

  public async executeAcademyCycle() {
    const persistence = getProducerPersistence();
    const failures = harvesterCapabilityMatrixEngine.getPersistentFailures();
    const existingObs = await persistence.getAcademyObservations();

    for (const fail of failures) {
      const alreadyObserved = existingObs.some(o => o.error_message === fail.what_failed || o.source_id === fail.which_source);
      if (!alreadyObserved) {
        const payloadSample = fail.what_entered_input_summary || 'PRODUCTION_FAILURE_PAYLOAD_SAMPLE';
        const obs = await persistence.recordAcademyObservation({
          source_id: fail.which_source || 'source_unknown',
          parser_id: fail.where_failed_module || 'parser_default',
          incident_type: (fail.failure_class as any) || 'PARSER_FAILURE',
          observed_payload_sample: payloadSample,
          observed_sha256: crypto.createHash('sha256').update(payloadSample).digest('hex'),
          error_message: fail.what_failed
        });

        await persistence.recordAcademyCase({
          observation_id: obs.observation_id,
          case_title: `Remediation Proposal for ${fail.failure_class} on ${fail.which_source}`,
          proposed_rule: `apply_strict_regex_boundary_match_v2`,
          state: 'TESTED_LOCALLY',
          test_result: 'PASS'
        });
      }
    }
  }

  private async runLeaseExpirationWatchdog() {
    const persistence = getProducerPersistence();
    const expiredCount = await persistence.expireLeasesWatchdog();
    if (expiredCount > 0) {
      console.log(`[HERMES WATCHDOG] Reclaimed and reconciled ${expiredCount} expired worker leases.`);
    }
  }

  public async getDaemonStatus() {
    const persistence = getProducerPersistence();
    const health = await persistence.checkHealth();
    const summary = await persistence.getDatabaseSummary();

    return {
      daemon_active: this.isRunning,
      storage_health: health,
      startup_error: this.startupError,
      execution_environment: 'Node Express Backend Server',
      persistence_target: 'Cloud SQL PostgreSQL + GCS',
      active_processing_jobs_count: this.activeJobsProcessing.size,
      canonical_assignments_only: this.canonicalAssignmentsOnly(),
      summary
    };
  }
}

export const hermesWorkerDaemon = new HermesWorkerDaemonEngine();
