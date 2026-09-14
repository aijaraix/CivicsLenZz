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

export interface AccessChallengeInspection {
  isChallenge: boolean;
  reason?: string;
  failureClass?: string;
}

export function detectAccessChallenge(status: number, text: string): AccessChallengeInspection {
  if (status === 403) {
    const lower = text.toLowerCase();
    if (lower.includes('cf-mitigated') || lower.includes('cloudflare') || lower.includes('challenges.cloudflare.com')) {
      return { isChallenge: true, reason: 'ACCESS_RESTRICTED: Cloudflare bot challenge mitigation (HTTP 403)', failureClass: 'ACCESS_RESTRICTED' };
    }
    return { isChallenge: true, reason: 'ACCESS_RESTRICTED: HTTP 403 Forbidden', failureClass: 'ACCESS_RESTRICTED' };
  }

  if (status === 429) {
    return { isChallenge: true, reason: 'RATE_LIMITED: HTTP 429 Too Many Requests', failureClass: 'RATE_LIMITED' };
  }

  if (status === 503 || status === 502 || status === 504) {
    return { isChallenge: true, reason: `SOURCE_UNAVAILABLE: HTTP ${status}`, failureClass: 'SOURCE_UNAVAILABLE' };
  }

  if (status < 200 || status >= 300) {
    return { isChallenge: true, reason: `RETRIEVAL_FAILED: HTTP ${status}`, failureClass: 'RETRIEVAL_FAILED' };
  }

  const lower = text.toLowerCase();
  if (
    lower.includes('cf-turnstile') ||
    lower.includes('challenge-platform') ||
    lower.includes('just a moment...') ||
    lower.includes('attention required! | cloudflare') ||
    lower.includes('challenges.cloudflare.com') ||
    lower.includes('cf-mitigated') ||
    lower.includes('cf-chl-bypass') ||
    lower.includes('cloudflare')
  ) {
    return { isChallenge: true, reason: 'ACCESS_RESTRICTED: Cloudflare interstitial challenge detected', failureClass: 'ACCESS_RESTRICTED' };
  }

  if (
    lower.includes('robot or human?') ||
    lower.includes('bot verification') ||
    lower.includes('security check to continue') ||
    lower.includes('captcha') ||
    lower.includes('ddos-guard') ||
    lower.includes('access denied') ||
    lower.includes('enable javascript and cookies to continue')
  ) {
    return { isChallenge: true, reason: 'ACCESS_RESTRICTED: Bot mitigation challenge page detected', failureClass: 'ACCESS_RESTRICTED' };
  }

  if (text.trim().length === 0) {
    return { isChallenge: true, reason: 'SOURCE_UNAVAILABLE: Empty response body received from source', failureClass: 'SOURCE_UNAVAILABLE' };
  }

  return { isChallenge: false };
}
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
  status: 'RUNNING' | 'SUCCESS' | 'FAILED_RETRYABLE' | 'FAILED_PERMANENT';
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
  status: 'HEALTHY' | 'DEGRADED' | 'BLOCKED_SOURCE' | 'CIRCUIT_OPEN' | 'UNKNOWN';
  consecutive_failures: number;
  circuit_opens_count: number;
  circuit_reopen_at?: string;
  last_success_at?: string;
  last_failure_at?: string;
  last_error?: string;
  last_checked_at?: string;
}

export type EvidenceProvenance = 'REAL_PROVEN' | 'LEGACY_UNPROVEN' | 'LEGACY_SYNTHETIC' | 'TEST_FIXTURE' | 'UNKNOWN';

export interface RawSourceSnapshot {
  snapshot_uuid: string;
  source_uuid: string;
  target_url: string;
  http_status: number;
  content_type: string;
  charset?: string;
  byte_length?: number;
  raw_payload?: string;
  payload_sha256: string;
  raw_bytes_path: string;
  object_locator?: string;
  challenge_reason?: string;
  failure_class?: string;
  retrieved_at: string;
  parser_version: string;
  provenance_classification?: EvidenceProvenance;
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
  retrieval_content_sha256?: string;
  claim_fingerprint?: string;
  content_hash: string;
  parser_version: string;
  extraction_method: string;
  supporting_locator?: string;
  verification_state: 'VERIFIED' | 'UNVERIFIED' | 'REJECTED' | 'EXTRACTED_UNREVIEWED' | 'CANONICAL_VALIDATED';
  seat_uuid?: string;
  person_uuid?: string;
  field_key?: string;
  extracted_value?: string;
  provenance_classification?: EvidenceProvenance;
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
  is_vacant: boolean | 'UNKNOWN';
  vacancy_status?: 'VACANT' | 'OCCUPIED' | 'UNKNOWN';
  tenure_years?: number | null;
  term_start?: string | null;
  term_end?: string | null;
  next_election_date?: string | null;
  in_active_election_cycle: boolean;
  completeness_percentage: number;
  coverage_status: 'NOT_YET_RESEARCHED' | 'RESEARCH_IN_PROGRESS' | 'UNREVIEWED_RESEARCH_INGESTED' | 'BASELINE_COMPLETE' | 'MONITORING';
  verification_state?: 'RESEARCH_PENDING' | 'EXTRACTED_UNREVIEWED' | 'CANONICAL_VALIDATED';
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

export interface MonitoringEventRecord {
  event_uuid: string;
  obligation_id: string;
  check_id: string;
  retrieval_id: string;
  comparison_id: string;
  previous_hash: string;
  current_hash: string;
  comparison_event: 'NO_CHANGE' | 'CHANGE_DETECTED' | 'CHECK_FAILED' | 'PARSER_REPLAY_CHECK';
  observed_url: string;
  source_origin?: 'LIVE_NETWORK' | 'DURABLE_SNAPSHOT_FIXTURE';
  status_code?: number;
  error_message?: string;
  timestamp: string;
}

export interface DurableGapRecord {
  gap_id: string;
  seat_uuid: string;
  person_uuid?: string;
  office_type: string;
  missing_scope: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  auto_generated_job_type?: string;
  status: 'PENDING' | 'JOB_CREATED' | 'RESOLVED';
  job_uuid?: string;
  created_at: string;
  resolved_at?: string;
}

export interface DurableAcademyObservationRecord {
  observation_id: string;
  source_id: string;
  parser_id: string;
  incident_type: string;
  observed_payload_sample: string;
  observed_sha256: string;
  error_message?: string;
  created_at: string;
}

export interface DurableAcademyCaseRecord {
  case_id: string;
  observation_id: string;
  case_title: string;
  proposed_rule?: string;
  state: 'OBSERVED' | 'CASE_CREATED' | 'PROPOSAL_GENERATED' | 'TESTED_LOCALLY' | 'PROMOTION_APPROVED' | 'PROMOTION_DEPLOYED' | 'REJECTED';
  test_result?: 'PASS' | 'FAIL';
  created_at: string;
  tested_at?: string;
  promoted_at?: string;
  promotion_authority?: string;
}

export interface DurableAutonomousProofRecord {
  proof_uuid: string;
  work_id: string;
  lease_id: string;
  worker_id: string;
  retrieval_id: string;
  artifact_id: string;
  next_work_id: string;
  verifier_self_dispatches: false;
  proven_at: string;
}

export interface DurableMonitoringProofRecord {
  proof_uuid: string;
  obligation_id: string;
  check_id: string;
  retrieval_id: string;
  comparison_id: string;
  source_origin?: 'LIVE_NETWORK' | 'DURABLE_SNAPSHOT_FIXTURE';
  verifier_executes_fetch: false;
  proven_at: string;
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
  monitoring_events: MonitoringEventRecord[];
  durable_gaps: DurableGapRecord[];
  academy_observations: DurableAcademyObservationRecord[];
  academy_cases: DurableAcademyCaseRecord[];
  autonomous_proof_records: DurableAutonomousProofRecord[];
  monitoring_proof_records: DurableMonitoringProofRecord[];
  domain_rate_limits: Record<string, {
    max_req_per_sec: number;
    tokens_available: number;
    last_refill_at: number;
  }>;
}

class HermesBackendStore {
  private dbFilePath: string;
  private db: HermesPersistentSchema;
  private dataDir: string;

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || process.env.CIVICSLENZZ_DATA_DIR || path.join(process.cwd(), 'data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    this.dbFilePath = path.join(this.dataDir, 'hermes_persistent_db.json');
    this.db = this.loadDatabase();
    this.seedInitialFloridaSourcesAndSeats();
    this.ensureProvenanceClassifications();
  }

  public reinitialize(customDataDir?: string) {
    this.dataDir = customDataDir || process.env.CIVICSLENZZ_DATA_DIR || path.join(process.cwd(), 'data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    this.dbFilePath = path.join(this.dataDir, 'hermes_persistent_db.json');
    this.db = this.loadDatabase();
    this.seedInitialFloridaSourcesAndSeats();
    this.ensureProvenanceClassifications();
  }

  public getDataDir(): string {
    return this.dataDir;
  }

  private loadDatabase(): HermesPersistentSchema {
    if (fs.existsSync(this.dbFilePath)) {
      try {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        parsed.monitoring_events = parsed.monitoring_events || [];
        parsed.durable_gaps = parsed.durable_gaps || [];
        parsed.academy_observations = parsed.academy_observations || [];
        parsed.academy_cases = parsed.academy_cases || [];
        parsed.autonomous_proof_records = parsed.autonomous_proof_records || [];
        parsed.monitoring_proof_records = parsed.monitoring_proof_records || [];
        parsed.hermes_jobs = parsed.hermes_jobs || [];
        parsed.hermes_job_attempts = parsed.hermes_job_attempts || [];
        parsed.hermes_worker_leases = parsed.hermes_worker_leases || [];
        parsed.hermes_checkpoints = parsed.hermes_checkpoints || [];
        parsed.hermes_source_registry = parsed.hermes_source_registry || [];
        parsed.raw_source_snapshots = parsed.raw_source_snapshots || [];
        parsed.raw_evidence_objects = parsed.raw_evidence_objects || [];
        parsed.research_contract_status = parsed.research_contract_status || [];
        parsed.seat_coverage_status = parsed.seat_coverage_status || [];
        parsed.person_coverage_status = parsed.person_coverage_status || [];
        parsed.dead_letter_jobs = parsed.dead_letter_jobs || [];
        parsed.domain_rate_limits = parsed.domain_rate_limits || {};
        return parsed;
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
      monitoring_events: [],
      durable_gaps: [],
      academy_observations: [],
      academy_cases: [],
      autonomous_proof_records: [],
      monitoring_proof_records: [],
      domain_rate_limits: {}
    };

    this.saveDatabase(defaultDb);
    return defaultDb;
  }

  private saveDatabase(dataToSave?: HermesPersistentSchema) {
    const target = dataToSave || this.db;
    target.last_updated_at = new Date().toISOString();
    
    const dataDir = path.dirname(this.dbFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

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
          status: 'UNKNOWN',
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
          status: 'UNKNOWN',
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
          status: 'UNKNOWN',
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
          status: 'UNKNOWN',
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
          status: 'UNKNOWN',
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
          status: 'UNKNOWN',
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
          status: 'UNKNOWN',
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
          status: 'UNKNOWN',
          consecutive_failures: 0,
          circuit_opens_count: 0
        }
      ];

      this.db.hermes_source_registry = defaultSources;
      modified = true;
    }

    // 2. Seed Florida Priority Seats (Structural definitions ONLY; no pre-seeded factual civic research)
    if (this.db.seat_coverage_status.length === 0) {
      const prioritySeats: SeatCoverageStatusRecord[] = [
        {
          seat_uuid: 'fl_governor_seat_01',
          office_name: 'Governor of Florida',
          office_type: 'STATE_EXECUTIVE',
          jurisdiction: 'State of Florida',
          government_level: 'State',
          current_official_person_uuid: undefined,
          current_official_name: undefined,
          is_vacant: 'UNKNOWN',
          vacancy_status: 'UNKNOWN',
          tenure_years: null,
          term_start: null,
          term_end: null,
          next_election_date: null,
          in_active_election_cycle: false,
          completeness_percentage: 0,
          coverage_status: 'NOT_YET_RESEARCHED',
          verification_state: 'RESEARCH_PENDING',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_us_senate_seat_01',
          office_name: 'U.S. Senator (Florida - Seat A)',
          office_type: 'FEDERAL_LEGISLATOR',
          jurisdiction: 'State of Florida',
          government_level: 'Federal',
          current_official_person_uuid: undefined,
          current_official_name: undefined,
          is_vacant: 'UNKNOWN',
          vacancy_status: 'UNKNOWN',
          tenure_years: null,
          term_start: null,
          term_end: null,
          next_election_date: null,
          in_active_election_cycle: false,
          completeness_percentage: 0,
          coverage_status: 'NOT_YET_RESEARCHED',
          verification_state: 'RESEARCH_PENDING',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_us_senate_seat_02',
          office_name: 'U.S. Senator (Florida - Seat B)',
          office_type: 'FEDERAL_LEGISLATOR',
          jurisdiction: 'State of Florida',
          government_level: 'Federal',
          current_official_person_uuid: undefined,
          current_official_name: undefined,
          is_vacant: 'UNKNOWN',
          vacancy_status: 'UNKNOWN',
          tenure_years: null,
          term_start: null,
          term_end: null,
          next_election_date: null,
          in_active_election_cycle: false,
          completeness_percentage: 0,
          coverage_status: 'NOT_YET_RESEARCHED',
          verification_state: 'RESEARCH_PENDING',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_miami_dade_mayor_seat_01',
          office_name: 'Miami-Dade County Mayor',
          office_type: 'COUNTY_EXECUTIVE',
          jurisdiction: 'Miami-Dade County',
          county_fips: '12086',
          government_level: 'County',
          current_official_person_uuid: undefined,
          current_official_name: undefined,
          is_vacant: 'UNKNOWN',
          vacancy_status: 'UNKNOWN',
          tenure_years: null,
          term_start: null,
          term_end: null,
          next_election_date: null,
          in_active_election_cycle: false,
          completeness_percentage: 0,
          coverage_status: 'NOT_YET_RESEARCHED',
          verification_state: 'RESEARCH_PENDING',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_senate_dist_34',
          office_name: 'Florida State Senator - District 34',
          office_type: 'STATE_LEGISLATOR',
          jurisdiction: 'Miami-Dade & Broward',
          district_number: '34',
          government_level: 'State',
          current_official_person_uuid: undefined,
          current_official_name: undefined,
          is_vacant: 'UNKNOWN',
          vacancy_status: 'UNKNOWN',
          tenure_years: null,
          term_start: null,
          term_end: null,
          next_election_date: null,
          in_active_election_cycle: false,
          completeness_percentage: 0,
          coverage_status: 'NOT_YET_RESEARCHED',
          verification_state: 'RESEARCH_PENDING',
          last_updated_at: new Date().toISOString()
        },
        {
          seat_uuid: 'fl_senate_dist_35',
          office_name: 'Florida State Senator - District 35',
          office_type: 'STATE_LEGISLATOR',
          jurisdiction: 'Broward County',
          district_number: '35',
          government_level: 'State',
          current_official_person_uuid: undefined,
          current_official_name: undefined,
          is_vacant: 'UNKNOWN',
          vacancy_status: 'UNKNOWN',
          tenure_years: null,
          term_start: null,
          term_end: null,
          next_election_date: null,
          in_active_election_cycle: false,
          completeness_percentage: 0,
          coverage_status: 'NOT_YET_RESEARCHED',
          verification_state: 'RESEARCH_PENDING',
          last_updated_at: new Date().toISOString()
        }
      ];

      this.db.seat_coverage_status = prioritySeats;
      modified = true;
    } else {
      // Sanitize legacy loaded records
      for (const seat of this.db.seat_coverage_status) {
        if (seat.coverage_status === ('BASELINE_COMPLETE' as any) || seat.coverage_status === ('UNREVIEWED_RESEARCH_INGESTED' as any)) {
          seat.coverage_status = 'NOT_YET_RESEARCHED';
          seat.completeness_percentage = 0;
          modified = true;
        }
        if (seat.is_vacant !== 'UNKNOWN' as any && typeof seat.is_vacant === 'boolean') {
          (seat as any).is_vacant = 'UNKNOWN';
          seat.vacancy_status = 'UNKNOWN';
          modified = true;
        }
        if (seat.tenure_years !== undefined && seat.tenure_years !== null) {
          seat.tenure_years = null;
          modified = true;
        }
        if (seat.next_election_date !== null && seat.next_election_date !== undefined) {
          seat.next_election_date = null;
          modified = true;
        }
        if (seat.term_start !== null && seat.term_start !== undefined) {
          seat.term_start = null;
          modified = true;
        }
        if (seat.term_end !== null && seat.term_end !== undefined) {
          seat.term_end = null;
          modified = true;
        }
        if (seat.verification_state !== 'RESEARCH_PENDING') {
          seat.verification_state = 'RESEARCH_PENDING';
          modified = true;
        }
        if (seat.current_official_name) {
          seat.current_official_name = undefined;
          seat.current_official_person_uuid = undefined;
          modified = true;
        }
      }
      for (const src of this.db.hermes_source_registry) {
        if (src.status === 'HEALTHY' && !src.last_checked_at) {
          src.status = 'UNKNOWN';
          modified = true;
        }
      }
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

  public storeRawSnapshot(snapshot: {
    source_uuid: string;
    target_url: string;
    http_status: number;
    content_type: string;
    charset?: string;
    byte_length?: number;
    parser_version: string;
    raw_bytes?: Buffer | Uint8Array | string;
    raw_payload?: string;
    raw_bytes_path?: string;
  }): RawSourceSnapshot {
    const nowIso = new Date().toISOString();
    
    const rawBuffer = Buffer.isBuffer(snapshot.raw_bytes)
      ? snapshot.raw_bytes
      : typeof snapshot.raw_bytes === 'string'
      ? Buffer.from(snapshot.raw_bytes, 'utf-8')
      : snapshot.raw_payload
      ? Buffer.from(snapshot.raw_payload, 'utf-8')
      : Buffer.alloc(0);

    const hash = crypto.createHash('sha256').update(rawBuffer).digest('hex');
    const snapshotUuid = `snap_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    // Exact byte durable storage (Directive 11 & 12: Exact byte sequence preserved without re-encoding)
    const retrievalsDir = path.join(this.dataDir, 'artifacts', 'retrievals');
    if (!fs.existsSync(retrievalsDir)) {
      fs.mkdirSync(retrievalsDir, { recursive: true });
    }
    const rawFilePath = path.join(retrievalsDir, `${snapshotUuid}.raw`);
    fs.writeFileSync(rawFilePath, rawBuffer);

    const textSample = rawBuffer.toString('utf-8');
    const challengeCheck = detectAccessChallenge(snapshot.http_status, textSample);

    const isSynthetic =
      snapshot.parser_version === 'v2.1' ||
      snapshot.parser_version === 'DETERMINISTIC_PARSER_V2' ||
      snapshot.target_url?.includes('synthetic') ||
      snapshot.target_url?.includes('mock');

    const initialProvenance: EvidenceProvenance = isSynthetic
      ? 'LEGACY_SYNTHETIC'
      : snapshot.http_status === 200 && !challengeCheck.isChallenge
      ? 'REAL_PROVEN'
      : 'LEGACY_UNPROVEN';

    // Metadata store retains path, content type, byte length, SHA-256, charset, retrieval time, URL, HTTP status
    // Entire binary payload is NOT placed into JSON
    const record: RawSourceSnapshot = {
      snapshot_uuid: snapshotUuid,
      source_uuid: snapshot.source_uuid,
      target_url: snapshot.target_url,
      http_status: snapshot.http_status,
      content_type: snapshot.content_type,
      charset: snapshot.charset || 'utf-8',
      byte_length: rawBuffer.length,
      payload_sha256: hash,
      raw_bytes_path: rawFilePath,
      retrieved_at: nowIso,
      parser_version: snapshot.parser_version,
      provenance_classification: initialProvenance
    };

    this.db.raw_source_snapshots.push(record);
    if (this.db.raw_source_snapshots.length > 200) {
      this.db.raw_source_snapshots.shift();
    }

    this.saveDatabase();
    return record;
  }

  public getRawSnapshotBytes(snapshotUuid: string): Buffer | null {
    const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === snapshotUuid);
    if (!snap || !snap.raw_bytes_path || !fs.existsSync(snap.raw_bytes_path)) return null;
    return fs.readFileSync(snap.raw_bytes_path);
  }

  public classifySnapshot(snap: RawSourceSnapshot): EvidenceProvenance {
    if (!snap) return 'UNKNOWN';
    if (
      snap.parser_version === 'v2.1' ||
      snap.parser_version === 'DETERMINISTIC_PARSER_V2' ||
      (snap as any).source_name === 'SYNTHETIC_GENERATOR' ||
      (snap as any).source_name?.includes('SYNTHETIC') ||
      snap.target_url?.includes('synthetic') ||
      snap.target_url?.includes('mock') ||
      (snap as any).raw_payload_text?.includes('STUB') ||
      (snap as any).raw_payload?.includes('STUB')
    ) {
      return 'LEGACY_SYNTHETIC';
    }
    if (snap.target_url?.includes('fixture') || snap.target_url?.includes('test')) {
      return 'TEST_FIXTURE';
    }
    if (
      snap.raw_bytes_path &&
      fs.existsSync(snap.raw_bytes_path) &&
      snap.target_url &&
      snap.http_status === 200 &&
      snap.retrieved_at &&
      snap.parser_version &&
      snap.parser_version !== 'v2.1' &&
      snap.parser_version !== 'DETERMINISTIC_PARSER_V2'
    ) {
      try {
        const fileBytes = fs.readFileSync(snap.raw_bytes_path);
        const computedSha = crypto.createHash('sha256').update(fileBytes).digest('hex');
        const lengthMatches = snap.byte_length !== undefined ? fileBytes.length === snap.byte_length : true;
        const textSample = fileBytes.toString('utf-8');
        const challengeCheck = detectAccessChallenge(snap.http_status, textSample);
        if (computedSha === snap.payload_sha256 && lengthMatches && !challengeCheck.isChallenge) {
          return 'REAL_PROVEN';
        }
      } catch {
        return 'LEGACY_UNPROVEN';
      }
    }
    return 'LEGACY_UNPROVEN';
  }

  public classifyEvidence(ev: RawEvidenceObject, snapClass?: EvidenceProvenance): EvidenceProvenance {
    if (!ev) return 'UNKNOWN';
    if (ev.provenance_classification && ev.provenance_classification !== 'UNKNOWN') {
      return ev.provenance_classification;
    }
    if (
      ev.parser_version === 'v2.1' ||
      ev.parser_version === 'DETERMINISTIC_PARSER_V2' ||
      ev.extraction_method === 'DETERMINISTIC_PARSER_V2' ||
      (ev as any).source_name?.includes('SYNTHETIC') ||
      ev.source_url?.includes('synthetic') ||
      ev.source_url?.includes('mock') ||
      (ev as any).content_to_hash
    ) {
      return 'LEGACY_SYNTHETIC';
    }
    if (ev.source_url?.includes('fixture') || ev.source_url?.includes('test')) {
      return 'TEST_FIXTURE';
    }
    if (snapClass) {
      if (snapClass === 'REAL_PROVEN') return 'REAL_PROVEN';
      if (snapClass === 'LEGACY_SYNTHETIC') return 'LEGACY_SYNTHETIC';
      if (snapClass === 'TEST_FIXTURE') return 'TEST_FIXTURE';
      return 'LEGACY_UNPROVEN';
    }
    if (ev.raw_snapshot_uuid) {
      const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === ev.raw_snapshot_uuid);
      if (snap) {
        const sClass = this.classifySnapshot(snap);
        return sClass === 'REAL_PROVEN' ? 'REAL_PROVEN' : sClass;
      }
    }
    return 'LEGACY_UNPROVEN';
  }

  public ensureProvenanceClassifications() {
    let modified = false;
    for (const snap of this.db.raw_source_snapshots) {
      const classification = this.classifySnapshot(snap);
      if (snap.provenance_classification !== classification) {
        snap.provenance_classification = classification;
        modified = true;
      }
    }
    for (const ev of this.db.raw_evidence_objects) {
      let snapClass: EvidenceProvenance | undefined;
      if (ev.raw_snapshot_uuid) {
        const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === ev.raw_snapshot_uuid);
        if (snap) snapClass = snap.provenance_classification || this.classifySnapshot(snap);
      }
      const classification = this.classifyEvidence(ev, snapClass);
      if (ev.provenance_classification !== classification) {
        ev.provenance_classification = classification;
        modified = true;
      }
    }
    if (modified) {
      this.saveDatabase();
    }
  }

  public createEvidenceObject(evidenceData: Omit<RawEvidenceObject, 'evidence_uuid' | 'retrieved_at' | 'content_hash'> & {
    content_to_hash?: Buffer | string;
    retrieval_content_sha256?: string;
    claim_fingerprint?: string;
  }): RawEvidenceObject {
    const nowIso = new Date().toISOString();
    // Directive 11: Separate retrieval content sha256 from claim fingerprint
    const retrievalSha256 = evidenceData.retrieval_content_sha256 ||
      (evidenceData.content_to_hash 
        ? (Buffer.isBuffer(evidenceData.content_to_hash) 
            ? crypto.createHash('sha256').update(evidenceData.content_to_hash).digest('hex')
            : crypto.createHash('sha256').update(evidenceData.content_to_hash).digest('hex'))
        : crypto.createHash('sha256').update(`${evidenceData.source_url}_${evidenceData.extracted_value}_${nowIso}`).digest('hex'));
    
    const claimFingerprint = evidenceData.claim_fingerprint || 
      crypto.createHash('sha256').update(`${evidenceData.source_url}_${evidenceData.seat_uuid || ''}_${evidenceData.field_key || ''}_${evidenceData.extracted_value || ''}`).digest('hex');

    let snapClass: EvidenceProvenance | undefined;
    if (evidenceData.raw_snapshot_uuid) {
      const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === evidenceData.raw_snapshot_uuid);
      if (snap) snapClass = this.classifySnapshot(snap);
    }
    const provenanceClass = evidenceData.provenance_classification || this.classifyEvidence(evidenceData as any, snapClass);

    const evidence: RawEvidenceObject = {
      ...evidenceData,
      evidence_uuid: `evi_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      retrieval_content_sha256: retrievalSha256,
      claim_fingerprint: claimFingerprint,
      content_hash: retrievalSha256, // Stable backward compatible field representing exact raw bytes hash
      verification_state: 'EXTRACTED_UNREVIEWED', // Producer evidence is strictly unreviewed!
      retrieved_at: nowIso,
      provenance_classification: provenanceClass
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
    const snapshotsCount = this.db.raw_source_snapshots.length;
    const structuralSeatsTotal = this.db.seat_coverage_status.length;

    // Requirement 9: baseline_complete_seats is NOT reported unless backed by an evaluated research contract and evidence
    const baselineCompleteSeats = this.db.seat_coverage_status.filter(s => {
      if (s.coverage_status !== 'BASELINE_COMPLETE') return false;
      const contract = this.db.research_contract_status.find(c => c.seat_uuid === s.seat_uuid);
      const evidence = this.db.raw_evidence_objects.filter(e => e.seat_uuid === s.seat_uuid);
      return Boolean(contract && contract.completeness_percentage >= 100 && evidence.length > 0);
    }).length;

    const unreviewedEvidenceCount = this.db.raw_evidence_objects.filter(e => e.verification_state === 'EXTRACTED_UNREVIEWED').length;

    return {
      version: this.db.version,
      last_updated_at: this.db.last_updated_at,
      total_jobs_in_db: this.db.hermes_jobs.length,
      completed_jobs: completedJobs,
      queued_jobs: queuedJobs,
      dead_letter_jobs: deadLetterCount,
      active_leases: this.db.hermes_worker_leases.length,
      raw_snapshots_stored: snapshotsCount,
      raw_evidence_records: evidenceCount,
      unreviewed_evidence_objects_extracted: unreviewedEvidenceCount,
      structural_seats_known: structuralSeatsTotal,
      total_seats_tracked: structuralSeatsTotal,
      baseline_complete_seats: baselineCompleteSeats,
      gatekeeper_accepted_canonical_records: 0,
      coverage_percentage: structuralSeatsTotal > 0 ? Math.round((baselineCompleteSeats / structuralSeatsTotal) * 100) : 0,
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

  public getJob(jobUuid: string): PersistentHermesJob | undefined {
    return this.db.hermes_jobs.find(j => j.job_uuid === jobUuid);
  }

  public getJobAttempts(jobUuid?: string): HermesJobAttempt[] {
    if (jobUuid) {
      return this.db.hermes_job_attempts.filter(a => a.job_uuid === jobUuid);
    }
    return [...this.db.hermes_job_attempts];
  }

  public getWorkerLeases(): HermesWorkerLease[] {
    return [...this.db.hermes_worker_leases];
  }

  public getRawSnapshots(): RawSourceSnapshot[] {
    return [...this.db.raw_source_snapshots];
  }

  public getRawSnapshot(snapshotUuid: string): RawSourceSnapshot | null {
    return this.db.raw_source_snapshots.find(s => s.snapshot_uuid === snapshotUuid) || null;
  }

  public getSnapshot(snapshotUuid: string): RawSourceSnapshot | null {
    return this.getRawSnapshot(snapshotUuid);
  }

  public getRealProvenSnapshots(): RawSourceSnapshot[] {
    return this.db.raw_source_snapshots.filter(s => this.classifySnapshot(s) === 'REAL_PROVEN');
  }

  public getLegacyUnprovenSnapshots(): RawSourceSnapshot[] {
    return this.db.raw_source_snapshots.filter(s => this.classifySnapshot(s) === 'LEGACY_UNPROVEN');
  }

  public getLegacySyntheticSnapshots(): RawSourceSnapshot[] {
    return this.db.raw_source_snapshots.filter(s => this.classifySnapshot(s) === 'LEGACY_SYNTHETIC');
  }

  public getTestFixtureSnapshots(): RawSourceSnapshot[] {
    return this.db.raw_source_snapshots.filter(s => this.classifySnapshot(s) === 'TEST_FIXTURE');
  }

  public getUnknownSnapshots(): RawSourceSnapshot[] {
    return this.db.raw_source_snapshots.filter(s => this.classifySnapshot(s) === 'UNKNOWN');
  }

  public getRealProvenEvidence(): RawEvidenceObject[] {
    return this.db.raw_evidence_objects.filter(e => {
      let snapClass: EvidenceProvenance | undefined;
      if (e.raw_snapshot_uuid) {
        const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === e.raw_snapshot_uuid);
        if (snap) snapClass = this.classifySnapshot(snap);
      }
      return this.classifyEvidence(e, snapClass) === 'REAL_PROVEN';
    });
  }

  public getLegacySyntheticEvidence(): RawEvidenceObject[] {
    return this.db.raw_evidence_objects.filter(e => {
      let snapClass: EvidenceProvenance | undefined;
      if (e.raw_snapshot_uuid) {
        const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === e.raw_snapshot_uuid);
        if (snap) snapClass = this.classifySnapshot(snap);
      }
      return this.classifyEvidence(e, snapClass) === 'LEGACY_SYNTHETIC';
    });
  }

  public getLegacyUnprovenEvidence(): RawEvidenceObject[] {
    return this.db.raw_evidence_objects.filter(e => {
      let snapClass: EvidenceProvenance | undefined;
      if (e.raw_snapshot_uuid) {
        const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === e.raw_snapshot_uuid);
        if (snap) snapClass = this.classifySnapshot(snap);
      }
      return this.classifyEvidence(e, snapClass) === 'LEGACY_UNPROVEN';
    });
  }

  public getTestFixtureEvidence(): RawEvidenceObject[] {
    return this.db.raw_evidence_objects.filter(e => {
      let snapClass: EvidenceProvenance | undefined;
      if (e.raw_snapshot_uuid) {
        const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === e.raw_snapshot_uuid);
        if (snap) snapClass = this.classifySnapshot(snap);
      }
      return this.classifyEvidence(e, snapClass) === 'TEST_FIXTURE';
    });
  }

  public getUnknownEvidence(): RawEvidenceObject[] {
    return this.db.raw_evidence_objects.filter(e => {
      let snapClass: EvidenceProvenance | undefined;
      if (e.raw_snapshot_uuid) {
        const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === e.raw_snapshot_uuid);
        if (snap) snapClass = this.classifySnapshot(snap);
      }
      return this.classifyEvidence(e, snapClass) === 'UNKNOWN';
    });
  }

  public getPublicEligibleEvidence(): RawEvidenceObject[] {
    return this.getRealProvenEvidence();
  }

  public getBridgeEligibleEvidence(): RawEvidenceObject[] {
    return this.getRealProvenEvidence();
  }

  public getQuarantinedEvidence(): RawEvidenceObject[] {
    return this.db.raw_evidence_objects.filter(e => {
      let snapClass: EvidenceProvenance | undefined;
      if (e.raw_snapshot_uuid) {
        const snap = this.db.raw_source_snapshots.find(s => s.snapshot_uuid === e.raw_snapshot_uuid);
        if (snap) snapClass = this.classifySnapshot(snap);
      }
      return this.classifyEvidence(e, snapClass) !== 'REAL_PROVEN';
    });
  }

  public getDeadLetterJobs(): DeadLetterJobRecord[] {
    return [...this.db.dead_letter_jobs];
  }

  public getSourceRegistry(): SourceRegistryEntry[] {
    return [...this.db.hermes_source_registry];
  }

  // =========================================================================
  // MONITORING, GAPS, ACADEMY, AND PROOF PERSISTENCE METHODS
  // =========================================================================

  public recordMonitoringEvent(event: Omit<MonitoringEventRecord, 'event_uuid' | 'timestamp'>): MonitoringEventRecord {
    const fullEvent: MonitoringEventRecord = {
      ...event,
      event_uuid: `monev_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString()
    };
    this.db.monitoring_events.push(fullEvent);
    if (this.db.monitoring_events.length > 500) {
      this.db.monitoring_events.shift();
    }
    this.saveDatabase();
    return fullEvent;
  }

  public getMonitoringEvents(obligationId?: string): MonitoringEventRecord[] {
    if (obligationId) {
      return this.db.monitoring_events.filter(e => e.obligation_id === obligationId);
    }
    return [...this.db.monitoring_events];
  }

  public recordDurableGap(gap: Omit<DurableGapRecord, 'gap_id' | 'created_at'>): DurableGapRecord {
    const fullGap: DurableGapRecord = {
      ...gap,
      gap_id: `gap_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      created_at: new Date().toISOString()
    };
    this.db.durable_gaps.push(fullGap);
    this.saveDatabase();
    return fullGap;
  }

  public getDurableGaps(status?: 'PENDING' | 'JOB_CREATED' | 'RESOLVED'): DurableGapRecord[] {
    if (status) {
      return this.db.durable_gaps.filter(g => g.status === status);
    }
    return [...this.db.durable_gaps];
  }

  public updateDurableGap(gapId: string, updates: Partial<DurableGapRecord>): DurableGapRecord | null {
    const target = this.db.durable_gaps.find(g => g.gap_id === gapId);
    if (!target) return null;
    Object.assign(target, updates);
    this.saveDatabase();
    return target;
  }

  public resolveDurableGap(gapId: string): DurableGapRecord | null {
    return this.updateDurableGap(gapId, { status: 'RESOLVED', resolved_at: new Date().toISOString() });
  }

  public recordAcademyObservation(obs: Omit<DurableAcademyObservationRecord, 'observation_id' | 'created_at'>): DurableAcademyObservationRecord {
    const fullObs: DurableAcademyObservationRecord = {
      ...obs,
      observation_id: `obs_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      created_at: new Date().toISOString()
    };
    this.db.academy_observations.push(fullObs);
    this.saveDatabase();
    return fullObs;
  }

  public getAcademyObservations(): DurableAcademyObservationRecord[] {
    return [...this.db.academy_observations];
  }

  public recordAcademyCase(caseRecord: Omit<DurableAcademyCaseRecord, 'case_id' | 'created_at'>): DurableAcademyCaseRecord {
    const fullCase: DurableAcademyCaseRecord = {
      ...caseRecord,
      case_id: `case_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      created_at: new Date().toISOString()
    };
    this.db.academy_cases.push(fullCase);
    this.saveDatabase();
    return fullCase;
  }

  public getAcademyCases(): DurableAcademyCaseRecord[] {
    return [...this.db.academy_cases];
  }

  public updateAcademyCase(caseId: string, updates: Partial<DurableAcademyCaseRecord>): DurableAcademyCaseRecord | null {
    const target = this.db.academy_cases.find(c => c.case_id === caseId);
    if (!target) return null;
    Object.assign(target, updates);
    this.saveDatabase();
    return target;
  }

  public recordAutonomousProof(proof: Omit<DurableAutonomousProofRecord, 'proof_uuid' | 'proven_at'>): DurableAutonomousProofRecord {
    const fullProof: DurableAutonomousProofRecord = {
      ...proof,
      proof_uuid: `proof_auto_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      proven_at: new Date().toISOString()
    };
    this.db.autonomous_proof_records.push(fullProof);
    this.saveDatabase();
    return fullProof;
  }

  public getAutonomousProofRecords(): DurableAutonomousProofRecord[] {
    return [...this.db.autonomous_proof_records];
  }

  public recordMonitoringProof(proof: Omit<DurableMonitoringProofRecord, 'proof_uuid' | 'proven_at'>): DurableMonitoringProofRecord {
    const fullProof: DurableMonitoringProofRecord = {
      ...proof,
      proof_uuid: `proof_mon_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      proven_at: new Date().toISOString()
    };
    this.db.monitoring_proof_records.push(fullProof);
    this.saveDatabase();
    return fullProof;
  }

  public getMonitoringProofRecords(): DurableMonitoringProofRecord[] {
    return [...this.db.monitoring_proof_records];
  }

  public getStorageMode(): 'CLOUD_SQL_POSTGRES' | 'FAIL_CLOSED_NO_DB' {
    if (process.env.SQL_HOST && process.env.SQL_DB_NAME && process.env.SQL_USER) {
      return 'CLOUD_SQL_POSTGRES';
    }
    return 'FAIL_CLOSED_NO_DB';
  }
}

export const hermesBackendStore = new HermesBackendStore();
