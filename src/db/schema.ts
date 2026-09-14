import { pgTable, text, integer, boolean, timestamp, jsonb, primaryKey, uniqueIndex, index } from 'drizzle-orm/pg-core';

// 1. HERMES JOBS
export const hermesJobs = pgTable('hermes_jobs', {
  jobUuid: text('job_uuid').primaryKey(),
  agentId: text('agent_id').notNull(),
  logicalWorkKey: text('logical_work_key'),
  activeAttemptUuid: text('active_attempt_uuid'),
  missionUuid: text('mission_uuid'),
  seatUuid: text('seat_uuid'),
  personUuid: text('person_uuid'),
  raceUuid: text('race_uuid'),
  campaignUuid: text('campaign_uuid'),
  sourceUuid: text('source_uuid'),
  jobType: text('job_type').notNull(),
  priority: integer('priority').notNull().default(1),
  status: text('status').notNull().default('QUEUED'), // QUEUED, LEASED, RUNNING, CHECKPOINTED, COMPLETED, FAILED_RETRYABLE, FAILED_PERMANENT, BLOCKED_SOURCE, NEEDS_HUMAN_REVIEW, DEAD_LETTER
  attemptCount: integer('attempt_count').notNull().default(0),
  maxAttempts: integer('max_attempts').notNull().default(3),
  availableAt: text('available_at').notNull(),
  lockedAt: text('locked_at'),
  leaseExpiresAt: text('lease_expires_at'),
  workerInstance: text('worker_instance'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  failedAt: text('failed_at'),
  lastError: text('last_error'),
  checkpoint: jsonb('checkpoint'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('idx_hermes_jobs_status').on(table.status),
  index('idx_hermes_jobs_agent').on(table.agentId),
  index('idx_hermes_jobs_seat').on(table.seatUuid),
  index('idx_hermes_jobs_logical_key').on(table.logicalWorkKey),
]);

// 2. HERMES JOB ATTEMPTS
export const hermesJobAttempts = pgTable('hermes_job_attempts', {
  attemptUuid: text('attempt_uuid').primaryKey(),
  jobUuid: text('job_uuid').notNull().references(() => hermesJobs.jobUuid),
  workerInstance: text('worker_instance').notNull(),
  startedAt: text('started_at').notNull(),
  finishedAt: text('finished_at'),
  status: text('status').notNull(), // RUNNING, SUCCESS, FAILED_RETRYABLE, FAILED_PERMANENT, LEASE_EXPIRED, ABANDONED_WORKER
  errorMessage: text('error_message'),
  httpStatus: integer('http_status'),
  recordsExtracted: integer('records_extracted').notNull().default(0),
}, (table) => [
  index('idx_hermes_attempts_job').on(table.jobUuid),
]);

// 3. HERMES WORKER LEASES
export const hermesWorkerLeases = pgTable('hermes_worker_leases', {
  leaseUuid: text('lease_uuid').primaryKey(),
  jobUuid: text('job_uuid').notNull().unique().references(() => hermesJobs.jobUuid),
  attemptUuid: text('attempt_uuid'),
  workerInstance: text('worker_instance').notNull(),
  agentId: text('agent_id').notNull(),
  acquiredAt: text('acquired_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  lastHeartbeatAt: text('last_heartbeat_at').notNull(),
}, (table) => [
  index('idx_hermes_leases_worker').on(table.workerInstance),
]);

// 4. HERMES CHECKPOINTS
export const hermesCheckpoints = pgTable('hermes_checkpoints', {
  checkpointUuid: text('checkpoint_uuid').primaryKey(),
  jobUuid: text('job_uuid').notNull().references(() => hermesJobs.jobUuid),
  stepName: text('step_name').notNull(),
  recordsProcessed: integer('records_processed').notNull().default(0),
  lastProcessedId: text('last_processed_id'),
  stateData: jsonb('state_data').notNull(),
  savedAt: text('saved_at').notNull(),
}, (table) => [
  index('idx_hermes_checkpoints_job').on(table.jobUuid),
]);

// 5. SOURCE REGISTRY
export const hermesSourceRegistry = pgTable('hermes_source_registry', {
  sourceUuid: text('source_uuid').primaryKey(),
  sourceId: text('source_id').notNull().unique(),
  sourceName: text('source_name').notNull(),
  authorityTier: text('authority_tier').notNull(), // TIER_A, TIER_B, TIER_C, TIER_D
  baseUrl: text('base_url').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  rateLimitReqPerSec: integer('rate_limit_req_per_sec').notNull().default(2),
  status: text('status').notNull().default('UNKNOWN'), // HEALTHY, DEGRADED, BLOCKED_SOURCE, CIRCUIT_OPEN, UNKNOWN
  consecutiveFailures: integer('consecutive_failures').notNull().default(0),
  circuitOpensCount: integer('circuit_opens_count').notNull().default(0),
  circuitReopenAt: text('circuit_reopen_at'),
  lastSuccessAt: text('last_success_at'),
  lastFailureAt: text('last_failure_at'),
  lastError: text('last_error'),
  lastCheckedAt: text('last_checked_at'),
});

// 6. RAW SOURCE SNAPSHOTS
export const rawSourceSnapshots = pgTable('raw_source_snapshots', {
  snapshotUuid: text('snapshot_uuid').primaryKey(),
  sourceUuid: text('source_uuid').notNull(),
  targetUrl: text('target_url').notNull(),
  httpStatus: integer('http_status').notNull(),
  contentType: text('content_type').notNull(),
  charset: text('charset'),
  byteLength: integer('byte_length'),
  rawPayload: text('raw_payload'),
  payloadSha256: text('payload_sha256').notNull(),
  rawBytesPath: text('raw_bytes_path').notNull(),
  objectLocator: text('object_locator'),
  retrievedAt: text('retrieved_at').notNull(),
  parserVersion: text('parser_version').notNull(),
  provenanceClassification: text('provenance_classification').notNull().default('UNKNOWN'),
  challengeReason: text('challenge_reason'),
  failureClass: text('failure_class'),
}, (table) => [
  index('idx_raw_snapshots_sha').on(table.payloadSha256),
  index('idx_raw_snapshots_source').on(table.sourceUuid),
]);

// 7. RAW EVIDENCE OBJECTS
export const rawEvidenceObjects = pgTable('raw_evidence_objects', {
  evidenceUuid: text('evidence_uuid').primaryKey(),
  sourceUuid: text('source_uuid').notNull(),
  sourceUrl: text('source_url').notNull(),
  deepLink: text('deep_link'),
  documentTitle: text('document_title').notNull(),
  documentType: text('document_type').notNull(),
  retrievedAt: text('retrieved_at').notNull(),
  publishedAt: text('published_at'),
  sourceTier: text('source_tier').notNull(),
  rawSnapshotUuid: text('raw_snapshot_uuid'),
  retrievalContentSha256: text('retrieval_content_sha256'),
  claimFingerprint: text('claim_fingerprint'),
  contentHash: text('content_hash').notNull(),
  parserVersion: text('parser_version').notNull(),
  extractionMethod: text('extraction_method').notNull(),
  supportingLocator: text('supporting_locator'),
  verificationState: text('verification_state').notNull().default('EXTRACTED_UNREVIEWED'),
  seatUuid: text('seat_uuid'),
  personUuid: text('person_uuid'),
  fieldKey: text('field_key'),
  extractedValue: text('extracted_value'),
  provenanceClassification: text('provenance_classification').notNull().default('UNKNOWN'),
}, (table) => [
  index('idx_raw_evidence_seat').on(table.seatUuid),
  index('idx_raw_evidence_person').on(table.personUuid),
  index('idx_raw_evidence_sha').on(table.retrievalContentSha256),
]);

// 8. RESEARCH CONTRACT STATUS
export const researchContractStatuses = pgTable('research_contract_status', {
  contractUuid: text('contract_uuid').primaryKey(),
  seatUuid: text('seat_uuid').notNull().unique(),
  personUuid: text('person_uuid').notNull(),
  officeType: text('office_type').notNull(),
  totalRequiredFields: integer('total_required_fields').notNull().default(0),
  verifiedFieldsCount: integer('verified_fields_count').notNull().default(0),
  missingRequiredFieldsCount: integer('missing_required_fields_count').notNull().default(0),
  conflictingFieldsCount: integer('conflicting_fields_count').notNull().default(0),
  completenessPercentage: integer('completeness_percentage').notNull().default(0),
  fieldStates: jsonb('field_states').notNull(),
  lastEvaluatedAt: text('last_evaluated_at').notNull(),
});

// 9. SEAT COVERAGE STATUS
export const seatCoverageStatuses = pgTable('seat_coverage_status', {
  seatUuid: text('seat_uuid').primaryKey(),
  officeName: text('office_name').notNull(),
  officeType: text('office_type').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  countyFips: text('county_fips'),
  districtNumber: text('district_number'),
  governmentLevel: text('government_level').notNull(),
  currentOfficialPersonUuid: text('current_official_person_uuid'),
  currentOfficialName: text('current_official_name'),
  isVacant: text('is_vacant').notNull().default('UNKNOWN'), // boolean string or UNKNOWN
  vacancyStatus: text('vacancy_status').default('UNKNOWN'),
  tenureYears: integer('tenure_years'),
  termStart: text('term_start'),
  termEnd: text('term_end'),
  nextElectionDate: text('next_election_date'),
  inActiveElectionCycle: boolean('in_active_election_cycle').notNull().default(false),
  completenessPercentage: integer('completeness_percentage').notNull().default(0),
  coverageStatus: text('coverage_status').notNull().default('NOT_YET_RESEARCHED'),
  verificationState: text('verification_state').default('RESEARCH_PENDING'),
  lastUpdatedAt: text('last_updated_at').notNull(),
});

// 10. PERSON COVERAGE STATUS
export const personCoverageStatuses = pgTable('person_coverage_status', {
  personUuid: text('person_uuid').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  officeType: text('office_type').notNull(),
  party: text('party').notNull().default('UNKNOWN'),
  district: text('district').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  seatUuid: text('seat_uuid').notNull(),
  completenessPercentage: integer('completeness_percentage').notNull().default(0),
  researchState: text('research_state').notNull().default('NOT_YET_RESEARCHED'),
  lastAuditedAt: text('last_audited_at').notNull(),
});

// 11. DEAD LETTER JOBS
export const deadLetterJobs = pgTable('dead_letter_jobs', {
  deadLetterUuid: text('dead_letter_uuid').primaryKey(),
  jobUuid: text('job_uuid').notNull().unique(),
  agentId: text('agent_id').notNull(),
  jobType: text('job_type').notNull(),
  attemptsMade: integer('attempts_made').notNull().default(0),
  finalError: text('final_error').notNull(),
  sourceId: text('source_id'),
  payloadSnapshot: jsonb('payload_snapshot'),
  movedAt: text('moved_at').notNull(),
});

// 12. MONITORING EVENTS
export const monitoringEvents = pgTable('monitoring_events', {
  eventUuid: text('event_uuid').primaryKey(),
  obligationId: text('obligation_id').notNull(),
  checkId: text('check_id').notNull(),
  retrievalId: text('retrieval_id').notNull(),
  comparisonId: text('comparison_id').notNull(),
  previousHash: text('previous_hash').notNull(),
  currentHash: text('current_hash').notNull(),
  comparisonEvent: text('comparison_event').notNull(),
  observedUrl: text('observed_url').notNull(),
  sourceOrigin: text('source_origin').default('LIVE_NETWORK'),
  statusCode: integer('status_code'),
  errorMessage: text('error_message'),
  timestamp: text('timestamp').notNull(),
});

// 13. DURABLE GAPS
export const durableGaps = pgTable('durable_gaps', {
  gapId: text('gap_id').primaryKey(),
  seatUuid: text('seat_uuid').notNull(),
  personUuid: text('person_uuid'),
  officeType: text('office_type').notNull(),
  missingScope: text('missing_scope').notNull(),
  priority: text('priority').notNull().default('MEDIUM'),
  autoGeneratedJobType: text('auto_generated_job_type'),
  status: text('status').notNull().default('PENDING'),
  jobUuid: text('job_uuid'),
  createdAt: text('created_at').notNull(),
  resolvedAt: text('resolved_at'),
});

// 14. ACADEMY OBSERVATIONS
export const academyObservations = pgTable('academy_observations', {
  observationId: text('observation_id').primaryKey(),
  sourceId: text('source_id').notNull(),
  parserId: text('parser_id').notNull(),
  incidentType: text('incident_type').notNull(),
  observedPayloadSample: text('observed_payload_sample').notNull(),
  observedSha256: text('observed_sha256').notNull(),
  errorMessage: text('error_message'),
  createdAt: text('created_at').notNull(),
});

// 15. ACADEMY CASES
export const academyCases = pgTable('academy_cases', {
  caseId: text('case_id').primaryKey(),
  observationId: text('observation_id').notNull(),
  caseTitle: text('case_title').notNull(),
  proposedRule: text('proposed_rule'),
  state: text('state').notNull().default('OBSERVED'),
  testResult: text('test_result'),
  createdAt: text('created_at').notNull(),
  testedAt: text('tested_at'),
  promotedAt: text('promoted_at'),
  promotionAuthority: text('promotion_authority'),
});

// 16. AUTONOMOUS PROOF RECORDS
export const autonomousProofRecords = pgTable('autonomous_proof_records', {
  proofUuid: text('proof_uuid').primaryKey(),
  workId: text('work_id').notNull(),
  leaseId: text('lease_id').notNull(),
  workerId: text('worker_id').notNull(),
  retrievalId: text('retrieval_id').notNull(),
  artifactId: text('artifact_id').notNull(),
  nextWorkId: text('next_work_id').notNull(),
  verifierSelfDispatches: boolean('verifier_self_dispatches').notNull().default(false),
  provenAt: text('proven_at').notNull(),
});

// 17. MONITORING PROOF RECORDS
export const monitoringProofRecords = pgTable('monitoring_proof_records', {
  proofUuid: text('proof_uuid').primaryKey(),
  obligationId: text('obligation_id').notNull(),
  checkId: text('check_id').notNull(),
  retrievalId: text('retrieval_id').notNull(),
  comparisonId: text('comparison_id').notNull(),
  sourceOrigin: text('source_origin').default('LIVE_NETWORK'),
  verifierExecutesFetch: boolean('verifier_executes_fetch').notNull().default(false),
  provenAt: text('proven_at').notNull(),
});

// 18. BRIDGE SUBMISSIONS & IDEMPOTENCY
export const bridgeSubmissions = pgTable('bridge_submissions', {
  submissionId: text('submission_id').primaryKey(),
  jobId: text('job_id').notNull().unique(),
  idempotencyKey: text('idempotency_key').notNull().unique(),
  deliveryState: text('delivery_state').notNull().default('PENDING_SUBMISSION'),
  attempts: integer('attempts').notNull().default(0),
  maxAttempts: integer('max_attempts').notNull().default(10),
  nextRetryAt: text('next_retry_at'),
  lastAttemptAt: text('last_attempt_at'),
  lastError: text('last_error'),
  canonicalAckCode: text('canonical_ack_code'),
  canonicalCorrelationId: text('canonical_correlation_id'),
  acknowledgment: jsonb('acknowledgment'),
  resultPackage: jsonb('result_package'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('idx_bridge_sub_state').on(table.deliveryState),
]);

// 19. DOMAIN RATE LIMITS
export const domainRateLimits = pgTable('domain_rate_limits', {
  domain: text('domain').primaryKey(),
  maxReqPerSec: integer('max_req_per_sec').notNull().default(2),
  tokensAvailable: integer('tokens_available').notNull().default(2),
  lastRefillAt: text('last_refill_at').notNull(),
});

// 20. PRODUCER SYSTEM STATE
export const producerSystemState = pgTable('producer_system_state', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});
