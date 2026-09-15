/**
 * HERMES MACHINE-TO-MACHINE BRIDGE TYPES & CONTRACTS
 * 
 * Defines formal machine-enforced contracts:
 * - Inbound: HERMES_RESEARCH_JOB_V1
 * - Outbound Ingest: CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1
 * - Acknowledgment: CanonicalIngestAcknowledgment
 * - Delivery & Lifecycle states
 */

export type InboundJobContractVersion = 'HERMES_RESEARCH_JOB_V1';
export type OutboundResultContractVersion = 'CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1';

export type JobLifecycleStatus = 
  | 'QUEUED' 
  | 'LEASED' 
  | 'EXECUTING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export type ResultDeliveryState =
  | 'RESULT_READY'
  | 'SUBMISSION_PENDING'
  | 'SUBMITTING'
  | 'SUBMITTED'
  | 'ACCEPTED_FOR_VALIDATION'
  | 'DUPLICATE'
  | 'NEEDS_RESOLUTION'
  | 'RETRYABLE'
  | 'REJECTED'
  | 'SUPERSEDED_AUDIT_ONLY';

export type CanonicalAckCode =
  | 'ACCEPTED_FOR_VALIDATION'
  | 'DUPLICATE'
  | 'NEEDS_IDENTITY_RESOLUTION'
  | 'NEEDS_MORE_EVIDENCE'
  | 'PARTIALLY_ACCEPTED'
  | 'REJECTED_SCHEMA'
  | 'REJECTED_POLICY'
  | 'RETRY_LATER'
  | 'CANONICAL_CONFLICT';

export interface ResearchWorkIdentity {
  work_key: string;
  jurisdiction_key: string;
  seat_key?: string;
  person_key?: string;
  election_key?: string;
  research_domain: string;
  cycle_year: number;
}

/**
 * Versioned Inbound HERMES Job Envelope: HERMES_RESEARCH_JOB_V1
 */
export interface HermesResearchJobEnvelope {
  job_id: string;
  research_work_identity: ResearchWorkIdentity;
  research_reservation_id: string;
  contract_version: InboundJobContractVersion;
  producer_target: string; // "civicslenzz-gemini-harvester" or "*"
  priority: number;
  capability: string;
  cohort: string;
  jurisdiction: string;
  seat_key?: string;
  person_identity?: string;
  candidate_identity?: string;
  election_key?: string;
  research_scope: string | Record<string, any>;
  dataset_period?: string | { start_date?: string; end_date?: string; cutoff?: string };
  source_constraints?: string[];
  deadline?: string;
  attempt: number;
  created_at: string;
  trace_id?: string;
  correlation_id?: string;
}

export interface RawEvidenceRetrievalMetadata {
  retrieval_id: string;
  url: string;
  retrieved_at: string;
  http_status: number;
  mime_type: string;
  byte_length: number;
  sha256_hash: string;
  parser_method: string;
  parser_version: string;
  source_authority: string;
  dataset_period: string;
  raw_artifact_reference: string;
}

/**
 * Result Envelope: CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1
 */
export interface ResearchIngestPackage {
  contract_version: OutboundResultContractVersion;
  producer: string; // "civicslenzz-gemini-harvester"
  producer_version: string; // "2.2.0-HERMES-BRIDGE"
  job_id: string;
  research_work_identity: ResearchWorkIdentity;
  research_reservation_id: string;
  cohort: string;
  capability: string;
  jurisdiction: string;
  seat_candidate_key?: string;
  person_identity_candidates?: any[];
  election_identity_candidates?: any[];
  sources: Array<{
    source_id: string;
    source_name: string;
    agency: string;
    url: string;
    authority_scope: string;
  }>;
  retrievals: RawEvidenceRetrievalMetadata[];
  raw_evidence_metadata: {
    total_artifacts: number;
    sealed_hashes: string[];
    harvester_retrieval_endpoint?: string;
  };
  content_hash: string;
  parser_method: string;
  parser_version: string;
  claims: any[];
  relationships: any[];
  dataset_units: any[];
  boundary_objects: any[];
  warnings: string[];
  known_gaps: string[];
  current_as_of: string;
  monitoring_recommendations: string[];
  extraction_status: 'extracted_unreviewed'; // Strictly unreviewed!
  canonical_validation_required: true;
}

export interface CanonicalIngestAcknowledgment {
  status: 'ACCEPTED' | 'REJECTED' | 'RETRYABLE' | 'NEEDS_RESOLUTION';
  code: CanonicalAckCode;
  job_id: string;
  research_work_identity_key: string;
  acknowledged_at: string;
  ingest_receipt_id?: string;
  message: string;
  details?: Record<string, any>;
  retry_after_seconds?: number;
}

export interface BridgeTelemetry {
  jobs_received: number;
  jobs_running: number;
  results_ready: number;
  submissions_pending: number;
  accepted_for_validation: number;
  duplicates: number;
  needs_resolution: number;
  retryable_failures: number;
  terminal_rejections: number;
  last_successful_canonical_contact: string | null;
  contract_version: OutboundResultContractVersion;
  inbound_job_contract_version: InboundJobContractVersion;
  producer_id: string;
  producer_version: string;
  canonical_endpoint_configured: boolean;
  canonical_connection_tested: boolean;
  direct_supabase_access: false;
  publication_authority: false;
  verification_authority: false;
  BRIDGE_POSTGRES_AUTHORITATIVE?: boolean;
  BRIDGE_LOCAL_JSON_AUTHORITY?: boolean;
  bridge_postgres_authoritative?: boolean;
  bridge_local_json_authority?: boolean;
}
