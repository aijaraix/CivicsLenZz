/**
 * CIVICLENZ MASTER HERMES ARCHITECTURE SCHEMA (v2)
 *
 * Implements Sections III, V, X, XI, XII, XV, XVI, XXI, XXII, XXIII, XXIV, and XXVI
 * of the CivicLenZ Master Specification.
 *
 * Fundamental Organizing Principle: SEAT (Public office existing independently of occupant).
 */

// Source Classification Tiers (Section XI)
export type SourceTier =
  | 'TIER_A' // Authoritative Primary (Government filings, legislative/election/court records)
  | 'TIER_B' // First Party (Official candidate/campaign site, government bio, press releases)
  | 'TIER_C' // Credible Independent (Established journalism, authenticated interviews, universities)
  | 'TIER_D' // Secondary (Professional bios, advocacy aggregators - require attribution)
  | 'TIER_E'; // Discovery Only (Search snippets, unverified social - triggers research only)

// Fact vs Claim Classification (Section XII)
export type AssertionClassification =
  | 'VERIFIED_FACT'
  | 'FIRST_PARTY_CLAIM'
  | 'THIRD_PARTY_CLAIM'
  | 'ALLEGATION'
  | 'OPINION'
  | 'ANALYSIS'
  | 'AI_ASSESSMENT';

// Promise Allowed Statuses (Section XIV)
export type MasterPromiseStatus =
  | 'FULFILLED'
  | 'PARTIALLY_FULFILLED'
  | 'ACTION_UNDERWAY'
  | 'NO_MEASURABLE_ACTION'
  | 'BLOCKED_OR_FAILED'
  | 'REVERSED'
  | 'NOT_YET_ASSESSABLE'
  | 'INSUFFICIENT_EVIDENCE';

// Person Match Resolution States (Section V)
export type EntityMatchStatus = 'MATCH_CONFIRMED' | 'PROBABLE_MATCH' | 'AMBIGUOUS' | 'NO_MATCH';

/**
 * 1. SEAT MASTER RECORD (Section III)
 * Represents a public office/position that exists independently of the individual occupying it.
 */
export type SeatMasterRecord = {
  seat_uuid: string;
  seat_name: string; // e.g., "United States Senator - Florida Seat A" or "U.S. House - FL District 24"
  office_type: string; // e.g., "Senator", "Representative", "Governor", "Mayor", "School Board Member"
  government_level: 'Federal' | 'State' | 'County' | 'Municipal' | 'School Board' | 'Special District' | 'Judicial';
  jurisdiction: string; // e.g., "United States", "Florida", "Miami-Dade County", "City of Miami"
  district?: string;
  district_number?: string;
  county?: string;
  municipality?: string;
  state: string;
  country: string;

  // Occupancy Tracking
  current_officeholder_person_uuid?: string;
  occupancy_status: 'occupied' | 'vacant' | 'disputed' | 'acting' | 'unknown';
  term_start?: string;
  term_end?: string;
  term_length_years?: number;

  // Election Schedule
  election_cycle: string; // e.g., "2-year", "4-year staggered", "6-year"
  next_election_date: string;
  primary_date?: string;
  general_date?: string;
  qualifying_period?: string;
  partisan_status: 'Partisan' | 'Nonpartisan';
  election_method?: string;

  // Geospatial & Boundaries
  boundary_id?: string;
  boundary_source?: string;

  // Election Authorities
  election_authority: string; // e.g., "Florida Division of Elections", "Miami-Dade SOE"
  filing_authority?: string;
  results_authority?: string;

  official_source_urls: string[];
  created_at: string;
  last_verified_at: string;
  verification_status: 'VERIFIED' | 'UNVERIFIED' | 'REQUIRES_REVIEW';
  evidence_coverage_score: number; // 0 to 100%
};

/**
 * 2. PERSON MASTER RECORD (Section V)
 * Follows an individual throughout their civic/political history.
 */
export type PersonMasterRecord = {
  person_uuid: string;
  full_legal_name: string;
  display_name: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  name_variations: string[];

  public_birth_year?: number;
  voter_registration_id?: string;
  candidate_filing_ids: string[];
  campaign_ids: string[];

  current_party?: string;
  current_office_title?: string;
  portrait_url?: string;
  portrait_verification_status?: 'VERIFIED_HEADSHOT' | 'FALLBACK_ICON' | 'UNVERIFIED';

  match_status: EntityMatchStatus;

  // References
  current_seat_uuid?: string;
  historical_seat_uuids: string[];

  official_biography_url?: string;
  official_campaign_url?: string;
  official_government_url?: string;
  official_social_accounts: Array<{ platform: string; handle: string; url: string }>;

  created_at: string;
  last_verified_at: string;
  evidence_coverage_score: number; // 0 to 100%
};

/**
 * 3. EVIDENCE OBJECT (Section XV)
 * Permanent evidence snapshot backing every material assertion in CivicLenZ.
 */
export type EvidenceObject = {
  evidence_uuid: string;
  source_uuid: string;
  source_url: string;
  canonical_url: string;
  publisher: string;
  document_title: string;
  document_type: 'government_filing' | 'legislative_record' | 'election_record' | 'court_record' | 'press_release' | 'campaign_page' | 'news_article';
  publication_date?: string;
  retrieved_at: string;

  raw_sha256: string;
  content_sha256: string;
  parser_version: string;
  agent_version: string;

  source_tier: SourceTier;
  evidence_strength: 'CONCLUSIVE' | 'STRONG' | 'CORROBORATED' | 'WEAK';

  supporting_text?: string;
  page_number?: number;
  section_title?: string;
  archived_snapshot_url?: string;

  first_observed: string;
  last_verified: string;
  is_superseded: boolean;
  superseded_at?: string;
};

/**
 * 4. ASSERTION RECORD (Section X)
 * Replaces mutable profile fields with versioned, traceable assertion entries.
 */
export type AssertionRecord = {
  assertion_uuid: string;
  person_uuid?: string;
  seat_uuid?: string;
  field_name: string; // e.g., "education", "party_affiliation", "position_on_bill_123"
  value: string | number | boolean | object;
  classification: AssertionClassification;

  confidence_score: number; // 0.0 to 1.0
  status: 'ACTIVE' | 'SUPERSEDED' | 'CONTRADICTED' | 'UNDER_REVIEW';

  valid_from: string;
  valid_to?: string;
  first_observed: string;
  last_verified: string;

  source_uuid: string;
  evidence_uuid: string;
  verification_method: 'DETERMINISTIC_SCRAPE' | 'HUMAN_VERIFIED' | 'CROSS_CORROBORATED';
  agent_id: string; // e.g., "H1", "H13", "H15"
  review_state: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED';
};

/**
 * 5. LEGISLATIVE VOTE RECORD (Section XIII)
 * Underlying drillable vote records backing aggregate vote metrics.
 */
export type VoteRecord = {
  vote_uuid: string;
  person_uuid: string;
  seat_uuid?: string;
  bill_number: string; // e.g., "HB 7013"
  bill_title: string;
  bill_summary: string;
  vote_date: string;
  person_vote: 'YES' | 'NO' | 'ABSTAIN' | 'ABSENT' | 'RECUSED';
  full_rollcall_result: string; // e.g., "Passed 78-38"
  legislative_chamber: 'FL House' | 'FL Senate' | 'U.S. House' | 'U.S. Senate' | 'County Commission' | 'City Council';
  bill_outcome: 'PASSED' | 'FAILED' | 'PENDING' | 'TABLED';
  official_legislative_source: string;
  evidence_uuid: string;
};

/**
 * 6. PROMISE ACCOUNTABILITY RECORD (Section XIV)
 * Underlying drillable promise records backing promise metrics.
 */
export type PromiseRecord = {
  promise_uuid: string;
  person_uuid: string;
  seat_uuid?: string;
  promise_title: string;
  promise_text: string;
  normalized_promise: string;
  topic: string;
  date_made: string;
  source_url: string;
  original_context: string;

  target_outcome?: string;
  measurement_method?: string;

  status: MasterPromiseStatus;
  status_reasoning: string;
  last_reviewed: string;

  supporting_action_uuids: string[];
  contradicting_action_uuids: string[];
  evidence_uuids: string[];
};

/**
 * 7. CORRECTION RECORD (Section XXVI)
 * Public error reporting and transparent historical supersession.
 */
export type CorrectionRecord = {
  correction_uuid: string;
  person_uuid?: string;
  seat_uuid?: string;
  assertion_uuid?: string;
  submitted_correction: string;
  submitted_evidence_url?: string;
  existing_evidence_uuid?: string;
  review_status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'DECLINED';
  reviewer?: string;
  decision_rationale?: string;
  resolution_date?: string;
  timestamps: { submitted_at: string; resolved_at?: string };
};

/**
 * 8. RELATIONSHIP GRAPH EDGE (Section XXII)
 * Evidence-backed relationships between entities in the CivicLenZ Knowledge Graph.
 */
export type RelationshipEdge = {
  relationship_uuid: string;
  source_type: 'PERSON' | 'SEAT' | 'CAMPAIGN' | 'COMMITTEE' | 'BUSINESS' | 'DONOR' | 'BILL';
  source_id: string;
  target_type: 'PERSON' | 'SEAT' | 'CAMPAIGN' | 'COMMITTEE' | 'BUSINESS' | 'DONOR' | 'BILL';
  target_id: string;
  relationship_type:
    | 'OCCUPIES_SEAT'
    | 'SEEKING_SEAT'
    | 'SPONSORED_BILL'
    | 'VOTED_ON_BILL'
    | 'CONTRIBUTED_TO'
    | 'ENDORSED_BY'
    | 'OFFICER_OF'
    | 'FAMILY_MEMBER';
  evidence_uuid: string;
  notes?: string;
};

/**
 * 9. ELECTION MASTER RECORD (Master Specification Section IV)
 * Tracks election events across all municipal, county, state, and federal levels.
 */
export type ElectionMasterRecord = {
  election_uuid: string;
  election_name: string; // e.g., "2026 Florida General Election"
  election_type: 'General' | 'Primary' | 'Runoff' | 'Special' | 'Municipal' | 'Presidential_Preference';
  jurisdiction: string; // e.g., "State of Florida", "Miami-Dade County"
  election_date: string; // YYYY-MM-DD
  qualifying_period_start?: string;
  qualifying_period_end?: string;
  voter_registration_deadline?: string;
  early_voting_start?: string;
  early_voting_end?: string;
  status: 'UPCOMING' | 'ACTIVE_QUALIFYING' | 'VOTING_OPEN' | 'CANVASSING' | 'CERTIFIED' | 'COMPLETED';
  official_authority: string;
  official_source_url: string;
  created_at: string;
  last_verified_at: string;
};

/**
 * 10. RACE MASTER RECORD (Master Specification Section IV & C2)
 * Connects an Election event to a specific Seat and candidate roster.
 */
export type RaceMasterRecord = {
  race_uuid: string;
  election_uuid: string;
  seat_uuid: string;
  race_name: string; // e.g., "2026 U.S. Senate Florida Race"
  office_title: string;
  district?: string;
  jurisdiction: string;
  race_type: 'Primary' | 'General' | 'Runoff' | 'Special';
  is_partisan: boolean;
  incumbent_person_uuid?: string;
  candidate_person_uuids: string[];
  status: 'PENDING' | 'CANDIDATE_QUALIFYING' | 'ACTIVE_CAMPAIGN' | 'VOTING' | 'RESULTS_CERTIFIED';
  certified_winner_person_uuid?: string;
  certification_date?: string;
  official_results_url?: string;
  evidence_uuid?: string;
};

/**
 * 11. CANDIDATE MASTER RECORD (Master Specification Swarm B C1–C32)
 * Complete candidate tracking ledger linking Person to Race and Campaign.
 */
export type CandidateMasterRecord = {
  candidate_uuid: string;
  person_uuid: string; // Permanent individual UUID shared with current official swarm
  race_uuid: string;
  seat_uuid: string;
  election_uuid: string;
  campaign_uuid: string;

  candidate_name: string;
  party_affiliation: string;
  qualification_status: 'FILED' | 'QUALIFIED' | 'UNQUALIFIED' | 'WITHDRAWN' | 'DISQUALIFIED' | 'WRITE_IN' | 'BALLOT_CONFIRMED';
  is_incumbent: boolean;

  // Swarm B Research Completeness Score (0% to 100%)
  completeness_score: number;
  research_state: 'INITIAL_RESEARCH' | 'ACTIVE_RESEARCH' | 'MONITORING' | 'REOPENED_RESEARCH' | 'PUBLISHED';

  // Modular Data Aggregates with Provenance
  campaign_finance: {
    total_raised: number;
    total_spent: number;
    cash_on_hand: number;
    donor_count: number;
    last_filing_date: string;
    evidence_uuid: string;
  };

  photo_url?: string;
  photo_verification_status: 'VERIFIED_HEADSHOT' | 'REJECTED_LOGO' | 'UNVERIFIED';

  promises_count: number;
  policy_positions_count: number;
  endorsements_count: number;

  official_campaign_url?: string;
  filing_document_url?: string;
  last_verified_at: string;
};

/**
 * 12. CANDIDATE COMPLETENESS CONTRACT (Master Specification Section XII & C30)
 * Evaluates completion of required research checks without penalizing first-time candidates.
 */
export type CandidateCompletenessContract = {
  person_uuid: string;
  candidate_uuid: string;
  overall_percentage: number;
  check_breakdown: {
    identity_resolved: boolean;
    biography_complete: boolean;
    education_verified: boolean;
    career_history_verified: boolean;
    political_history_verified: boolean; // First-time candidate = VERIFIED_NONE (Completed)
    business_interests_checked: boolean;
    professional_licenses_checked: boolean;
    campaign_finance_exhausted: boolean;
    donor_intelligence_normalized: boolean;
    expenditures_processed: boolean;
    financial_disclosures_collected: boolean;
    campaign_website_archived: boolean;
    promises_extracted: boolean;
    policy_positions_structured: boolean;
    speeches_interviews_archived: boolean;
    debates_processed: boolean;
    social_media_monitored: boolean;
    endorsements_tracked: boolean;
    ethics_disclosures_checked: boolean;
    court_proceedings_checked: boolean;
    photo_validated: boolean;
    evidence_provenance_sealed: boolean;
    qa_contradictions_resolved: boolean;
  };
  active_agents_count: number;
  pending_checks_count: number;
  last_gap_analysis: string;
};

/**
 * 13. DATABASE WORK LOCK (Master Specification Section XIX)
 * Prevents duplicate AI research missions across Swarm A and Swarm B.
 */
export type DatabaseWorkLock = {
  mission_uuid: string;
  person_uuid?: string;
  seat_uuid?: string;
  race_uuid?: string;
  candidate_uuid?: string;
  mission_type: 'OFFICIAL_RESEARCH' | 'CANDIDATE_RESEARCH' | 'DELTA_RESEARCH' | 'GAP_ANALYSIS';
  research_state: 'LOCKED' | 'EXECUTING' | 'RELEASING' | 'COMPLETED';
  locked_at: string;
  lock_owner: string; // e.g. "HERMES_PRIME_WORKER_POOL_C6"
  last_heartbeat: string;
};

