/**
 * CIVICLENZ / HERMES PERSISTENT BACKEND STORE
 * Handles durable server-side storage for all HERMES jobs, worker leases,
 * raw snapshots, cryptographic evidence objects, seat coverage ledgers,
 * and Research Contract statuses.
 *
 * Persisted in data/hermes_persistent_db.json with transaction-safe atomic writes.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type JobStatus =
  | 'QUEUED'
  | 'LEASED'
  | 'RUNNING'
  | 'CHECKPOINTED'
  | 'COMPLETED'
  | 'FAILED_RETRYABLE'
  | 'FAILED_PERMANENT'
  | 'BLOCKED_SOURCE'
  | 'NEEDS_HUMAN_REVIEW'
  | 'DEAD_LETTER';

export interface PersistentHermesJob {
  job_uuid: string;
  agent_id: string;
  mission_uuid?: string;
  seat_uuid?: string;
  person_uuid?: string;
  race_uuid?: string;
  campaign_uuid?: string;
  source_uuid?: string;
  job_type: string;
  priority: number;
  status: JobStatus;
  attempt_count: number;
  max_attempts: number;
  available_at: string;
  locked_at?: string;
  lease_expires_at?: string;
  worker_instance?: string;
  started_at?: string;
  completed_at?: string;
  failed_at?: string;
  last_error?: string;
  checkpoint?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface HermesJobAttempt {
  attempt_uuid: string;
  job_uuid: string;
  worker_instance: string;
  started_at: string;
  finished_at?: string;
  status: 'SUCCESS' | 'FAILED_RETRYABLE' | 'FAILED_PERMANENT';
  error_message?: string;
  http_status?: number;
  records_extracted: number;
}

export interface HermesWorkerLease {
  lease_uuid: string;
  job_uuid: string;
  worker_instance: string;
  agent_id: string;
  acquired_at: string;
  expires_at: string;
  last_heartbeat_at: string;
}

export interface HermesCheckpoint {
  checkpoint_uuid: string;
  job_uuid: string;
  step_name: string;
  records_processed: number;
  last_processed_id?: string;
  state_data: Record<string, any>;
  saved_at: string;
}

export interface SourceRegistryEntry {
  source_uuid: string;
  source_id: string;
  source_name: string;
  authority_tier: 'TIER_A' | 'TIER_B' | 'TIER_C' | 'TIER_D';
  base_url: string;
  jurisdiction: string;
  rate_limit_req_per_sec: number;
  status: 'HEALTHY' | 'DEGRADED' | 'BLOCKED_SOURCE' | 'CIRCUIT_OPEN';
  consecutive_failures: number;
  circuit_opens_count: number;
  circuit_reopen_at?: string;
  last_success_at?: string;
  last_failure_at?: string;
  last_error?: string;
}

export interface RawSourceSnapshot {
  snapshot_uuid: string;
  source_uuid: string;
  target_url: string;
  http_status: number;
  content_type: string;
  raw_payload: string;
  payload_sha256: string;
  retrieved_at: string;
  parser_version: string;
}

export interface RawEvidenceObject {
  evidence_uuid: string;
  source_uuid: string;
  source_url: string;
  deep_link?: string;
  document_title: string;
  document_type: string;
  retrieved_at: string;
  published_at?: string;
  source_tier: 'TIER_A' | 'TIER_B' | 'TIER_C' | 'TIER_D';
  raw_snapshot_uuid?: string;
  content_hash: string;
  parser_version: string;
  extraction_method: string;
  supporting_locator?: string;
  verification_state: 'VERIFIED' | 'UNVERIFIED' | 'REJECTED';
  seat_uuid?: string;
  person_uuid?: string;
  field_key?: string;
  extracted_value?: string;
}

export interface ResearchContractStatus {
  contract_uuid: string;
  seat_uuid: string;
  person_uuid: string;
  office_type: string;
  total_required_fields: number;
  verified_fields_count: number;
  missing_required_fields_count: number;
  conflicting_fields_count: number;
  completeness_percentage: number;
  field_states: Record<string, {
    state: string;
    value?: any;
    evidence_uuid?: string;
    updated_at: string;
  }>;
  last_evaluated_at: string;
}

export interface SeatCoverageStatusRecord {
  seat_uuid: string;
  office_name: string;
  office_type: string;
  jurisdiction: string;
  county_fips?: string;
  district_number?: string;
  government_level: 'Federal' | 'State' | 'County' | 'Municipal' | 'School Board' | 'Judicial';
  current_official_person_uuid?: string;
  current_official_name?: string;
  is_vacant: boolean;
  term_start?: string;
  term_end?: string;
  next_election_date?: string;
  in_active_election_cycle: boolean;
  completeness_percentage: number;
  coverage_status: 'NOT_YET_RESEARCHED' | 'RESEARCH_IN_PROGRESS' | 'BASELINE_COMPLETE' | 'MONITORING';
  last_updated_at: string;
}

export interface PersonCoverageStatusRecord {
  person_uuid: string;
  name: string;
  title: string;
  office_type: string;
  party: string;
  district: string;
  jurisdiction: string;
  seat_uuid: string;
  completeness_percentage: number;
  research_state: string;
  last_audited_at: string;
}

export interface DeadLetterJobRecord {
  dead_letter_uuid: string;
  job_uuid: string;
  agent_id: string;
  job_type: string;
  attempts_made: number;
  final_error: string;
  source_id?: string;
  payload_snapshot?: Record<string, any>;
  moved_at: string;
}

export interface HermesPersistentSchema {
  version: number;
  last_updated_at: string;
  hermes_jobs: PersistentHermesJob[];
  hermes_job_attempts: HermesJobAttempt[];
  hermes_worker_leases: HermesWorkerLease[];
  hermes_checkpoints: HermesCheckpoint[];
  hermes_source_registry: SourceRegistryEntry[];
  raw_source_snapshots: RawSourceSnapshot[];
  raw_evidence_objects: RawEvidenceObject[];
  research_contract_status: ResearchContractStatus[];
  seat_coverage_status: SeatCoverageStatusRecord[];
  person_coverage_status: PersonCoverageStatusRecord[];
  dead_letter_jobs: DeadLetterJobRecord[];
  domain_rate_limits: Record<string, {
    max_req_per_sec: number;
    tokens_available: number;
    last_refill_at: number;
  }>;
}

class HermesBackendStore {
  private dbFilePath: string;
  private db: HermesPersistentSchema;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbFilePath = path.join(dataDir, 'hermes_persistent_db.json');
    this.db = this.loadDatabase();
    this.seedInitialFloridaSourcesAndSeats();
  }

  private loadDatabase(): HermesPersistentSchema {
    if (fs.existsSync(this.dbFilePath)) {
      try {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('[HermesBackendStore] Error reading DB file, re-initializing:', err);
      }
    }

    const defaultDb: HermesPersistentSchema = {
      version: 1,
      last_updated_at: new Date().toISOString(),
      hermes_jobs: [],
      hermes_job_attempts: [],
      hermes_worker_leases: [],
      hermes_checkpoints: [],
      hermes_source_registry: [],
      raw_source_snapshots: [],
      raw_evidence_objects: [],
      research_contract_status: [],
      seat_coverage_status: [],
      person_coverage_status: [],
      dead_letter_jobs: [],
      domain_rate_limits: {}
    };

    this.saveDatabase(defaultDb);
    return defaultDb;
  }

  private saveDatabase(dataToSave?: HermesPersistentSchema) {
    const target = dataToSave || this.db;
    target.last_updated_at = new Date().toISOString();
    
    // Atomic Write via Temporary File + Rename
    const tempFile = `${this.dbFilePath}.tmp.${Date.now()}`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(target, null, 2), 'utf-8');
      fs.renameSync(tempFile, this.dbFilePath);
    } catch (err) {
      console.error('[HermesBackendStore] Atomic save failed:', err);
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch (e) {
        // Ignore clean up error
      }
    }
  }

  private seedInitialFloridaSourcesAndSeats() {
    let modified = false;

    // 1. Seed Florida Source Registry
    if (this.db.hermes_source_registry.length === 0) {
      const defaultSources: SourceRegistryEntry[] = [
        {
          source_uuid: 'src_dos_elections',
          source_id: 'fl_dos_elections',
          source_name: 'Florida Division of Elections',
          authority_tier: 'TIER_A',
          base_url: 'https://dos.elections.myflorida.com',
          jurisdiction: 'State of Florida',
          rate_limit_req_per_sec: 5,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        },
        {
          source_uuid: 'src_fl_senate',
          source_id: 'fl_senate',
          source_name: 'Florida State Senate',
          authority_tier: 'TIER_A',
          base_url: 'https://flsenate.gov',
          jurisdiction: 'State of Florida',
          rate_limit_req_per_sec: 4,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        },
        {
          source_uuid: 'src_fl_house',
          source_id: 'fl_house',
          source_name: 'Florida House of Representatives',
          authority_tier: 'TIER_A',
          base_url: 'https://myfloridahouse.gov',
          jurisdiction: 'State of Florida',
          rate_limit_req_per_sec: 4,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        },
        {
          source_uuid: 'src_miami_dade_soe',
          source_id: 'fl_county_miami_dade',
          source_name: 'Miami-Dade Supervisor of Elections',
          authority_tier: 'TIER_A',
          base_url: 'https://www.miamidade.gov/elections/',
          jurisdiction: 'Miami-Dade County',
          rate_limit_req_per_sec: 3,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        },
        {
          source_uuid: 'src_broward_soe',
          source_id: 'fl_county_broward',
          source_name: 'Broward County Supervisor of Elections',
          authority_tier: 'TIER_A',
          base_url: 'https://www.browardvotes.gov/',
          jurisdiction: 'Broward County',
          rate_limit_req_per_sec: 3,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        },
        {
          source_uuid: 'src_us_congress_fl',
          source_id: 'us_congress_fl',
          source_name: 'U.S. Congress Florida Delegation Portal',
          authority_tier: 'TIER_A',
          base_url: 'https://api.congress.gov',
          jurisdiction: 'Federal',
          rate_limit_req_per_sec: 2,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        },
        {
          source_uuid: 'src_fl_ethics',
          source_id: 'fl_ethics_commission',
          source_name: 'Florida Commission on Ethics',
          authority_tier: 'TIER_A',
          base_url: 'https://ethics.state.fl.us',
          jurisdiction: 'State of Florida',
          rate_limit_req_per_sec: 2,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        },
        {
          source_uuid: 'src_fl_sunbiz',
          source_id: 'fl_sunbiz_corporations',
          source_name: 'Florida Division of Corporations (Sunbiz)',
          authority_tier: 'TIER_A',
          base_url: 'https://search.sunbiz.org',
          jurisdiction: 'State of Florida',
          rate_limit_req_per_sec: 2,
          status: 'HEALTHY',
          consecutive_failures: 0,
          circuit_opens_count: 0
        }
      ];

      this.db.hermes_source_registry = defaultSources;
      modified = true;
    }

    // 2. Seed Florida Priority Seats
    if (this.db.seat_coverage_status.length === 0) {
      const prioritySeats: SeatCoverageStatusRecord[] = [
        {
          seat_uuid: 'fl_governor_seat_01',
          office_name: 'Governor of Florida',
          office_type: 'STATE_EXECUTIVE',
          jurisdiction: 'State of Florida',
          government_level: 'State',
          current_official_person_uuid: 'person_ron_desantis',
          current_official_name: 'Ron DeSantis',
          is_vacant: false,
          term_start: '2023-01-03',
          term_end: '2027-01-05',
          next_election_date: '2026-11-03',
          in_active_election_cycle: true,
          completeness_percentage: 100,
          coverage_status: 'BASELINE_COMPLETE',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_us_senate_seat_01',
          office_name: 'U.S. Senator (Florida - Seat A)',
          office_type: 'FEDERAL_LEGISLATOR',
          jurisdiction: 'State of Florida',
          government_level: 'Federal',
          current_official_person_uuid: 'person_rick_scott',
          current_official_name: 'Rick Scott',
          is_vacant: false,
          term_start: '2019-01-08',
          term_end: '2025-01-03',
          next_election_date: '2026-11-03',
          in_active_election_cycle: true,
          completeness_percentage: 100,
          coverage_status: 'BASELINE_COMPLETE',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_us_senate_seat_02',
          office_name: 'U.S. Senator (Florida - Seat B)',
          office_type: 'FEDERAL_LEGISLATOR',
          jurisdiction: 'State of Florida',
          government_level: 'Federal',
          current_official_person_uuid: 'person_marco_rubio',
          current_official_name: 'Marco Rubio',
          is_vacant: false,
          term_start: '2023-01-03',
          term_end: '2029-01-03',
          next_election_date: '2028-11-07',
          in_active_election_cycle: false,
          completeness_percentage: 100,
          coverage_status: 'BASELINE_COMPLETE',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_miami_dade_mayor_seat_01',
          office_name: 'Miami-Dade County Mayor',
          office_type: 'COUNTY_EXECUTIVE',
          jurisdiction: 'Miami-Dade County',
          county_fips: '12086',
          government_level: 'County',
          current_official_person_uuid: 'person_daniella_levine_cava',
          current_official_name: 'Daniella Levine Cava',
          is_vacant: false,
          term_start: '2020-11-17',
          term_end: '2028-11-20',
          next_election_date: '2028-08-22',
          in_active_election_cycle: false,
          completeness_percentage: 100,
          coverage_status: 'BASELINE_COMPLETE',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_senate_dist_35',
          office_name: 'Florida State Senator - District 35',
          office_type: 'STATE_LEGISLATOR',
          jurisdiction: 'Miami-Dade & Broward',
          district_number: '35',
          government_level: 'State',
          current_official_person_uuid: 'person_shevrin_jones',
          current_official_name: 'Shevrin Jones',
          is_vacant: false,
          term_start: '2022-11-08',
          term_end: '2026-11-03',
          next_election_date: '2026-11-03',
          in_active_election_cycle: true,
          completeness_percentage: 100,
          coverage_status: 'BASELINE_COMPLETE',
          last_updated_at: new Date().toISOString()
        }
      ];

      this.db.seat_coverage_status = prioritySeats;
      modified = true;
    }

    if (modified) {
      this.saveDatabase();
    }
  }

  // =========================================================================
  // JOB QUEUE & LEASING METHODS
  // =========================================================================

  public createJob(jobData: Omit<PersistentHermesJob, 'job_uuid' | 'created_at' | 'updated_at' | 'attempt_count' | 'status' | 'max_attempts' | 'available_at'> & { status?: JobStatus; max_attempts?: number; available_at?: string }): PersistentHermesJob {
    const now = new Date().toISOString();
    const newJob: PersistentHermesJob = {
      ...jobData,
      job_uuid: `job_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      status: jobData.status || 'QUEUED',
      attempt_count: 0,
      max_attempts: jobData.max_attempts || 4,
      available_at: jobData.available_at || now,
      created_at: now,
      updated_at: now
    };

    this.db.hermes_jobs.push(newJob);
    this.saveDatabase();
    return newJob;
  }

  public claimAvailableJob(agentId: string, workerInstance: string): { job: PersistentHermesJob; lease: HermesWorkerLease } | null {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();

    // 1. Release expired leases first
    this.db.hermes_worker_leases = this.db.hermes_worker_leases.filter(lease => {
      const expiresMs = new Date(lease.expires_at).getTime();
      if (expiresMs < nowMs) {
        // Return job to QUEUED state
        const job = this.db.hermes_jobs.find(j => j.job_uuid === lease.job_uuid);
        if (job && job.status === 'LEASED') {
          job.status = 'QUEUED';
          job.updated_at = nowIso;
        }
        return false; // Remove lease
      }
      return true;
    });

    // 2. Find eligible queued job matching agentId or wildcard
    const eligibleJob = this.db.hermes_jobs.find(j => {
      if (j.status !== 'QUEUED') return false;
      const availMs = new Date(j.available_at).getTime();
      if (availMs > nowMs) return false;
      if (j.agent_id !== agentId && j.agent_id !== '*') return false;
      return true;
    });

    if (!eligibleJob) return null;

    // 3. Acquire Lease (60 second default expiration)
    const leaseExpiresIso = new Date(nowMs + 60000).toISOString();
    eligibleJob.status = 'LEASED';
    eligibleJob.locked_at = nowIso;
    eligibleJob.lease_expires_at = leaseExpiresIso;
    eligibleJob.worker_instance = workerInstance;
    eligibleJob.started_at = nowIso;
    eligibleJob.attempt_count += 1;
    eligibleJob.updated_at = nowIso;

    const lease: HermesWorkerLease = {
      lease_uuid: `lease_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      job_uuid: eligibleJob.job_uuid,
      worker_instance: workerInstance,
      agent_id: agentId,
      acquired_at: nowIso,
      expires_at: leaseExpiresIso,
      last_heartbeat_at: nowIso
    };

    this.db.hermes_worker_leases.push(lease);
    this.saveDatabase();

    return { job: eligibleJob, lease };
  }

  public completeJob(jobUuid: string, workerInstance: string, checkpointData?: Record<string, any>): boolean {
    const nowIso = new Date().toISOString();
    const job = this.db.hermes_jobs.find(j => j.job_uuid === jobUuid);
    if (!job) return false;

    job.status = 'COMPLETED';
    job.completed_at = nowIso;
    job.updated_at = nowIso;
    if (checkpointData) job.checkpoint = checkpointData;

    // Release lease
    this.db.hermes_worker_leases = this.db.hermes_worker_leases.filter(l => l.job_uuid !== jobUuid);

    // Save checkpoint
    if (checkpointData) {
      this.db.hermes_checkpoints.push({
        checkpoint_uuid: `chk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        job_uuid: jobUuid,
        step_name: 'FINAL_COMPLETION',
        records_processed: checkpointData.records_processed || 1,
        state_data: checkpointData,
        saved_at: nowIso
      });
    }

    this.saveDatabase();
    return true;
  }

  public failJob(jobUuid: string, workerInstance: string, errorMessage: string, isPermanent = false): boolean {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const job = this.db.hermes_jobs.find(j => j.job_uuid === jobUuid);
    if (!job) return false;

    job.failed_at = nowIso;
    job.last_error = errorMessage;
    job.updated_at = nowIso;

    // Record Attempt
    this.db.hermes_job_attempts.push({
      attempt_uuid: `att_${nowMs}_${crypto.randomBytes(3).toString('hex')}`,
      job_uuid: jobUuid,
      worker_instance: workerInstance,
      started_at: job.started_at || nowIso,
      finished_at: nowIso,
      status: isPermanent ? 'FAILED_PERMANENT' : 'FAILED_RETRYABLE',
      error_message: errorMessage,
      records_extracted: 0
    });

    // Release lease
    this.db.hermes_worker_leases = this.db.hermes_worker_leases.filter(l => l.job_uuid !== jobUuid);

    if (isPermanent || job.attempt_count >= job.max_attempts) {
      // Move to Dead Letter Queue
      job.status = 'DEAD_LETTER';
      this.db.dead_letter_jobs.push({
        dead_letter_uuid: `dlq_${nowMs}_${crypto.randomBytes(3).toString('hex')}`,
        job_uuid: jobUuid,
        agent_id: job.agent_id,
        job_type: job.job_type,
        attempts_made: job.attempt_count,
        final_error: errorMessage,
        source_id: job.source_uuid,
        payload_snapshot: { seat_uuid: job.seat_uuid, person_uuid: job.person_uuid },
        moved_at: nowIso
      });
    } else {
      // Exponential Backoff Retry (5s, 15s, 45s, 135s)
      const backoffSec = Math.pow(3, job.attempt_count) * 5;
      job.status = 'FAILED_RETRYABLE';
      job.available_at = new Date(nowMs + backoffSec * 1000).toISOString();
    }

    this.saveDatabase();
    return true;
  }

  // =========================================================================
  // EVIDENCE & RAW SNAPSHOT METHODS
  // =========================================================================

  public storeRawSnapshot(snapshot: Omit<RawSourceSnapshot, 'snapshot_uuid' | 'retrieved_at' | 'payload_sha256'> & { raw_payload: string }): RawSourceSnapshot {
    const nowIso = new Date().toISOString();
    const hash = crypto.createHash('sha256').update(snapshot.raw_payload).digest('hex');

    const record: RawSourceSnapshot = {
      ...snapshot,
      snapshot_uuid: `snap_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      payload_sha256: hash,
      retrieved_at: nowIso
    };

    this.db.raw_source_snapshots.push(record);
    if (this.db.raw_source_snapshots.length > 200) {
      this.db.raw_source_snapshots.shift(); // Bound memory/disk payload
    }

    this.saveDatabase();
    return record;
  }

  public createEvidenceObject(evidenceData: Omit<RawEvidenceObject, 'evidence_uuid' | 'retrieved_at' | 'content_hash'> & { content_to_hash?: string }): RawEvidenceObject {
    const nowIso = new Date().toISOString();
    const contentToHash = evidenceData.content_to_hash || `${evidenceData.source_url}_${evidenceData.extracted_value}_${nowIso}`;
    const hash = crypto.createHash('sha256').update(contentToHash).digest('hex');

    const evidence: RawEvidenceObject = {
      ...evidenceData,
      evidence_uuid: `evi_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      content_hash: hash,
      retrieved_at: nowIso
    };

    this.db.raw_evidence_objects.push(evidence);
    this.saveDatabase();
    return evidence;
  }

  public updateSeatCoverage(seatRecord: SeatCoverageStatusRecord) {
    const idx = this.db.seat_coverage_status.findIndex(s => s.seat_uuid === seatRecord.seat_uuid);
    if (idx >= 0) {
      this.db.seat_coverage_status[idx] = { ...seatRecord, last_updated_at: new Date().toISOString() };
    } else {
      this.db.seat_coverage_status.push({ ...seatRecord, last_updated_at: new Date().toISOString() });
    }
    this.saveDatabase();
  }

  // =========================================================================
  // GETTERS FOR REAL STATS & AUDIT LOGS
  // =========================================================================

  public getDatabaseSummary() {
    const completedJobs = this.db.hermes_jobs.filter(j => j.status === 'COMPLETED').length;
    const queuedJobs = this.db.hermes_jobs.filter(j => j.status === 'QUEUED' || j.status === 'LEASED').length;
    const deadLetterCount = this.db.dead_letter_jobs.length;
    const evidenceCount = this.db.raw_evidence_objects.length;
    const seatsTotal = this.db.seat_coverage_status.length;
    const seatsComplete = this.db.seat_coverage_status.filter(s => s.coverage_status === 'BASELINE_COMPLETE' || s.coverage_status === 'MONITORING').length;

    return {
      version: this.db.version,
      last_updated_at: this.db.last_updated_at,
      total_jobs_in_db: this.db.hermes_jobs.length,
      completed_jobs: completedJobs,
      queued_jobs: queuedJobs,
      dead_letter_jobs: deadLetterCount,
      active_leases: this.db.hermes_worker_leases.length,
      raw_evidence_records: evidenceCount,
      total_seats_tracked: seatsTotal,
      baseline_complete_seats: seatsComplete,
      coverage_percentage: seatsTotal > 0 ? Math.round((seatsComplete / seatsTotal) * 100) : 0,
      sources_registered: this.db.hermes_source_registry.length
    };
  }

  public getRawEvidenceObjects(): RawEvidenceObject[] {
    return [...this.db.raw_evidence_objects];
  }

  public getSeatCoverageRecords(): SeatCoverageStatusRecord[] {
    return [...this.db.seat_coverage_status];
  }

  public getJobs(): PersistentHermesJob[] {
    return [...this.db.hermes_jobs];
  }

  public getDeadLetterJobs(): DeadLetterJobRecord[] {
    return [...this.db.dead_letter_jobs];
  }

  public getSourceRegistry(): SourceRegistryEntry[] {
    return [...this.db.hermes_source_registry];
  }
}

export const hermesBackendStore = new HermesBackendStore();
