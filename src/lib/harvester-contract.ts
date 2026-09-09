/**
 * CIVICLENZ RESEARCH INGEST CONTRACT V1
 * Canonical exchange format between CivicsLenZz (Harvester) and CivicLenZ (Production/Validation)
 * All harvested claims must enter the canonical system with extraction_status: "extracted_unreviewed"
 */

export type SourceType = 
  | 'official_government'
  | 'official_election'
  | 'official_legislature'
  | 'official_court'
  | 'official_disclosure'
  | 'official_agency'
  | 'campaign'
  | 'reporting'
  | 'discovery_search';

export type ExtractionStatus = 'extracted_unreviewed';

// Canonical Verification Levels per CANONICAL_RESEARCH_CONTRACT_PACKAGE.md
export type VerificationLevel =
  | 'V0_DISCOVERED'
  | 'V1_EXTRACTED'
  | 'V2_SOURCE_VALIDATED'
  | 'V3_INDEPENDENTLY_CORROBORATED'
  | 'V4_CANONICAL_PUBLICATION_ELIGIBLE';

// Canonical Currentness Statuses (Never a fake global 'COMPLETE')
export type CurrentnessStatus =
  | 'BASELINE_SUFFICIENT'
  | 'CURRENT_AS_OF'
  | 'SCOPE_RECONCILED_AS_OF'
  | 'DATASET_RECONCILED_THROUGH'
  | 'STALE'
  | 'RESEARCHING'
  | 'BLOCKED'
  | 'MONITORING_ACTIVE';

// Semantic Capability States (CAPABILITY_NOT_IMPLEMENTED is NEVER CHECKED_NO_AUTHORITATIVE_RESULT)
export type CapabilityOperationalState =
  | 'READY'
  | 'CAPABILITY_NOT_IMPLEMENTED'
  | 'CHECKED_NO_AUTHORITATIVE_RESULT';

export interface ResearchWorkIdentity {
  work_key: string;
  jurisdiction_key: string;
  seat_key: string;
  person_key?: string;
  election_key?: string;
  candidate_campaign_key?: string;
  research_domain: string;
  scope_cutoff_date?: string;
  created_at: string;
}

export interface ResearchReservation {
  reservation_id: string;
  work_identity: ResearchWorkIdentity;
  producer_id: string;
  leased_at: string;
  expires_at: string;
  status: 'ACTIVE' | 'EXPIRED' | 'RELEASED' | 'FULFILLED';
}

export interface ProducerManifest {
  producer: 'CivicsLenZz-Harvester';
  producer_version: string;
  supported_capabilities: string[];
  contract_package_version: 'CANONICAL_RESEARCH_CONTRACT_PACKAGE_V1';
  contact_endpoint: string;
}

// Statutory Florida Qualifying Period
// e.g. Second Qualifying Period: Noon June 8, 2026 - Noon June 12, 2026 (Section 99.061(2), F.S.)
export interface StatutoryQualifyingPeriod {
  start: string; // ISO-8601 with timezone (e.g. 2026-06-08T12:00:00-04:00)
  end: string;   // ISO-8601 with timezone (e.g. 2026-06-12T12:00:00-04:00)
  statutory_authority: string; // "Section 99.061(2), Florida Statutes"
  qualifying_status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
}

// Pre-Qualifying Document Acceptance Window
// Section 99.061(8), F.S.: Qualifying papers may begin being accepted not more than 14 days prior to qualifying period start
export interface PreQualifyingDocumentAcceptance {
  start: string; // ISO-8601 with timezone (e.g. 2026-05-25T08:00:00-04:00)
  end: string;   // ISO-8601 with timezone (e.g. 2026-06-08T12:00:00-04:00)
  statutory_authority: string; // "Section 99.061(8), Florida Statutes"
  acceptance_status: 'UPCOMING' | 'ACTIVE' | 'CONCLUDED';
}

// Candidate Filing Activity
// Section 106.021, F.S.: Candidate campaign depository and treasurer appointment (DS-DE 9) may be filed anytime prior to qualifying
export interface CandidateFilingActivity {
  candidate_filing_active: boolean;
  filing_status: 'ACTIVE_ACCEPTING_FILINGS' | 'CLOSED';
  statutory_authority: string; // "Section 106.021, Florida Statutes"
}

// Distinct Candidate Statuses
export type CandidateLifecycleStatus = 
  | 'FILED'        // Filed Form DS-DE 9 (Appointment of Campaign Treasurer)
  | 'QUALIFIED'    // Formally certified as qualified by filing officer during statutory qualifying period
  | 'ACTIVE'       // Active candidate campaign
  | 'WITHDRAWN'    // Formally withdrawn candidacy
  | 'DISQUALIFIED' // Disqualified or failed to qualify
  | 'UNVERIFIED';

// Authoritative Legislative GIS Boundary Hierarchy
export interface LegislativeGISAuthority {
  operational_geometry_source: string; // "US_CENSUS_BUREAU_TIGER_WEB"
  legal_authoritative_district_source: string; // "FLORIDA_LEGISLATURE_SJR_20E_SUPREME_COURT_OF_FLORIDA"
  boundary_version: string; // "2022 Florida Legislative Redistricting Plan (SJR 20-E)"
  effective_period: string; // "2022-2032"
  geometry_hash: string;
  cross_source_reconciliation_state: 'RECONCILED_WITH_LEGAL_BASE' | 'AUTHORITATIVE_LEGAL_CONTROLLING' | 'PENDING_STATE_SHAPEFILE_CROSSCHECK';
}

// Seat + Election + Candidate Parallel Graph Dossier
export interface SeatParallelResearchDossier {
  seat_key: string;
  jurisdiction_key: string;
  seat_title: string;
  currentness_state: CurrentnessStatus;
  
  // Branch A: Current Occupancy
  occupancy: {
    is_vacant: boolean;
    acting_status?: boolean;
    current_occupant_person_key?: string;
    current_occupant_name?: string;
    term_start?: string;
    term_end?: string;
    occupancy_claims_status: ExtractionStatus;
  };

  // Branch B: Election & Candidate Lifecycle (First-class parallel obligation)
  election_lifecycle: {
    election_key: string;
    election_authority: string;
    cycle_year: number;
    election_cycle_known: boolean;
    seat_scheduled_for_election: boolean;
    next_scheduled_election_date: string;
    qualifying_period: StatutoryQualifyingPeriod;
    pre_qualifying_document_acceptance: PreQualifyingDocumentAcceptance;
    filing_activity: CandidateFilingActivity;
    candidates: Array<{
      candidate_campaign_key: string;
      person_key: string;
      candidate_name: string;
      filing_party: string;
      qualification_status: CandidateLifecycleStatus;
      campaign_website?: string;
      campaign_committee?: string;
      finance_authority_link?: string;
      extracted_claims_status: ExtractionStatus;
    }>;
  };

  raw_evidence_references: string[];
  last_harvested_at: string;
}

export interface ExtractedClaimItem {
  field_key: string;
  field_label: string;
  field_value: any;
  context_snippet?: string;
  confidence?: number;
}

export interface CivicLenZResearchIngestContractV1 {
  producer: 'CivicsLenZz-Harvester';
  producer_version: string;
  capability: string;
  source_key: string;
  source_url: string;
  source_authority: string;
  source_type: SourceType;
  jurisdiction_key: string;
  seat_key: string;
  person_candidate_key?: string;
  election_key?: string;
  retrieved_at: string;
  http_status: number;
  content_type: string;
  byte_length: number;
  content_hash: string; // SHA-256 of raw fetched bytes
  raw_object_reference: string;
  parser_key: string;
  parser_version: string;
  extracted_claims: Record<string, any>;
  dataset_units?: any[];
  relationships?: {
    relationship_type: string;
    target_key: string;
    target_type: string;
  }[];
  warnings: string[];
  extraction_status: ExtractionStatus; // Strictly "extracted_unreviewed"
}

export interface HarvesterBatchPackage {
  batch_id: string;
  batch_timestamp: string;
  producer: 'CivicsLenZz-Harvester';
  records_count: number;
  records: CivicLenZResearchIngestContractV1[];
  manifest: {
    sources_collected: number;
    seats_targeted: number;
    candidates_targeted: number;
    errors_count: number;
  };
}

/**
 * Validates that a harvested payload strictly adheres to the Ingest Contract V1 rules
 */
export function validateIngestContract(record: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (record.producer !== 'CivicsLenZz-Harvester') {
    errors.push(`Invalid producer: expected 'CivicsLenZz-Harvester', got '${record.producer}'`);
  }
  if (!record.source_url || typeof record.source_url !== 'string' || !record.source_url.startsWith('http')) {
    errors.push(`Invalid source_url: must be a valid HTTP/HTTPS URL`);
  }
  if (!record.content_hash || typeof record.content_hash !== 'string' || record.content_hash.length !== 64) {
    errors.push(`Invalid content_hash: must be a 64-character SHA-256 hex string`);
  }
  if (typeof record.byte_length !== 'number' || record.byte_length <= 0) {
    errors.push(`Invalid byte_length: must be a positive integer`);
  }
  if (record.extraction_status !== 'extracted_unreviewed') {
    errors.push(`VIOLATION: extraction_status must be 'extracted_unreviewed', got '${record.extraction_status}'`);
  }
  if (!record.seat_key && !record.person_candidate_key) {
    errors.push(`Record must specify at least a seat_key or a person_candidate_key`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Creates a compliant Ingest Contract V1 item
 */
export function createIngestPacket(
  params: Omit<CivicLenZResearchIngestContractV1, 'producer' | 'extraction_status'>
): CivicLenZResearchIngestContractV1 {
  const packet: CivicLenZResearchIngestContractV1 = {
    ...params,
    producer: 'CivicsLenZz-Harvester',
    extraction_status: 'extracted_unreviewed'
  };

  const validation = validateIngestContract(packet);
  if (!validation.valid) {
    console.warn('Constructed IngestPacket has validation warnings:', validation.errors);
  }

  return packet;
}
