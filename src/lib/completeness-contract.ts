// CivicLenZ — Master Data Completeness & Seat Lifecycle Contract
// Implements the 59-Page Master Elected Official & Seat Data Completeness Specification

import { HermesWorkerId } from './hermes-matrix-v2';

// II. ALLOWED FIELD STATES (Page 2)
export type AllowedFieldState =
  | 'VERIFIED_VALUE'                        // Verified positive record found & evidence attached
  | 'VERIFIED_NO_PUBLIC_RECORD_FOUND'       // Searched required authoritative sources; verified no record exists
  | 'VERIFIED_NONE'                         // Confirmed no record applicable (e.g. 0 disciplinary actions)
  | 'NOT_APPLICABLE'                        // Field explicitly does not apply to office type (e.g. bills for Sheriff)
  | 'CONFLICTING_AUTHORITATIVE_SOURCES'     // Research completed, but official sources disagree
  | 'REQUIRES_HUMAN_REVIEW'                 // Flagged for human reviewer / gatekeeper inspection
  | 'PENDING_RESEARCH'                      // Enqueued for HERMES worker research mission
  | 'SOURCE_UNAVAILABLE'                    // Source portal offline or HTTP rate-limited
  | 'STALE'                                 // Verified in past, but expired beyond freshness threshold
  | 'UNVERIFIED';                           // Ingested data without full verification proof

// States that satisfy completeness criteria
export const TERMINAL_COMPLETENESS_STATES: AllowedFieldState[] = [
  'VERIFIED_VALUE',
  'VERIFIED_NO_PUBLIC_RECORD_FOUND',
  'VERIFIED_NONE',
  'NOT_APPLICABLE'
];

export type EntityType = 'PERSON' | 'SEAT' | 'ELECTION' | 'OFFICEHOLDER_TERM';

export type RequirementType = 'UNIVERSAL_REQUIRED' | 'CONDITIONAL_REQUIRED' | 'OPTIONAL_ENRICHMENT';

export type OfficeTypeTemplate =
  | 'FEDERAL_LEGISLATOR'
  | 'STATE_LEGISLATOR'
  | 'EXECUTIVE'
  | 'COUNTY_EXECUTIVE'
  | 'COUNTY_COMMISSIONER'
  | 'MUNICIPAL_EXECUTIVE'
  | 'MUNICIPAL_LEGISLATOR'
  | 'SCHOOL_BOARD'
  | 'JUDICIAL'
  | 'SHERIFF'
  | 'SPECIAL_DISTRICT'
  | 'OTHER_ELECTED_OFFICE';

// IV. FIELD DEFINITION SCHEMA
export interface FieldDefinition {
  field_id: string;
  field_name: string;
  category: string;
  sub_category: string;
  description: string;
  entity_type: EntityType;
  requirement_type: RequirementType;
  applicable_office_types: OfficeTypeTemplate[];
  responsible_HERMES_agent: HermesWorkerId;
  secondary_validation_agent?: HermesWorkerId;
  fallback_agent?: HermesWorkerId;
  authoritative_sources: string[];
  refresh_frequency_days: number;
  completion_weight: number; // For sub-score weighting
}

// Master Categories (A through AZ)
export const MASTER_CATEGORIES = [
  'CORE_IDENTITY',
  'CURRENT_PUBLIC_OFFICE',
  'SEAT_RELATIONSHIP',
  'ELECTION_HISTORY',
  'PRIOR_PUBLIC_SERVICE',
  'EDUCATION',
  'EMPLOYMENT_CAREER',
  'BUSINESS_CORPORATE',
  'PROFESSIONAL_LICENSES',
  'CAMPAIGN_FINANCE',
  'DONORS',
  'EXPENDITURES',
  'FINANCIAL_DISCLOSURES',
  'LEGISLATION',
  'ROLL_CALL_VOTES',
  'ATTENDANCE',
  'COMMITTEE_ACTIVITY',
  'EXECUTIVE_ACTIONS',
  'BUDGET_TAX_SPENDING',
  'APPOINTMENTS',
  'CAMPAIGN_PROMISES',
  'POLICY_POSITIONS',
  'PUBLIC_STATEMENTS',
  'CAMPAIGN_WEBSITE_HISTORY',
  'SOCIAL_MEDIA_DIGITAL',
  'ENDORSEMENT_RECORDS',
  'POLITICAL_ORGANIZATIONS',
  'LOBBYING_RELATIONSHIPS',
  'ETHICS_RECORDS',
  'COURTS_LEGAL',
  'REGULATORY_DISCIPLINARY',
  'AUDITS_INSPECTOR_GENERAL',
  'NEWS_MEDIA_COVERAGE',
  'FACT_CHECK_HISTORY',
  'AWARDS_RECOGNITION',
  'PUBLICATIONS_WRITINGS',
  'COMMUNITY_NONPROFIT',
  'MILITARY_SERVICE',
  'FAMILY_PUBLIC_RELATIONSHIPS',
  'DISTRICT_CONSTITUENCY',
  'CONSTITUENT_CONTACT',
  'STAFF_GOVERNMENT_TEAM',
  'PUBLIC_CALENDAR_MEETINGS',
  'GOVERNMENT_PROCUREMENT',
  'PROPERTY_FINANCIAL_INTERESTS',
  'POLICY_OUTCOMES',
  'CONTROVERSIES_DISPUTES',
  'CORRECTIONS_RETRACTIONS',
  'HISTORICAL_TIMELINE',
  'SOURCE_EVIDENCE_INVENTORY'
] as const;

export type MasterCategory = typeof MASTER_CATEGORIES[number];

// Individual Evaluated Data Point Evaluation Record
export interface EvaluatedFieldPoint {
  field_id: string;
  field_name: string;
  category: string;
  state: AllowedFieldState;
  value: any;
  last_evaluated_timestamp: string;
  responsible_agent: HermesWorkerId;
  evidence_hash?: string;
  source_url?: string;
  conflict_details?: string;
}

// OFFICE-SPECIFIC REQUIREMENT TEMPLATES DEFINITION (Section VII)
export interface ProfileRequirementTemplate {
  office_type: OfficeTypeTemplate;
  title: string;
  required_field_ids: string[];
  not_applicable_field_ids: string[];
}

// Default Field Definitions Master Catalog
export const MASTER_FIELD_DEFINITIONS: FieldDefinition[] = [
  // CORE IDENTITY (A)
  {
    field_id: 'identity_full_legal_name',
    field_name: 'Full Legal Name',
    category: 'CORE_IDENTITY',
    sub_category: 'Legal Name',
    description: 'Verified legal first, middle, last, and suffix from qualifying documents',
    entity_type: 'PERSON',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H1',
    secondary_validation_agent: 'H5',
    authoritative_sources: ['dos.elections.myflorida.com/candidates', 'fec.gov'],
    refresh_frequency_days: 30,
    completion_weight: 10
  },
  {
    field_id: 'identity_official_portrait',
    field_name: 'Official Photo Portrait',
    category: 'CORE_IDENTITY',
    sub_category: 'Imagery',
    description: 'Validated high-resolution headshot with non-stock face confidence',
    entity_type: 'PERSON',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H4',
    authoritative_sources: ['flsenate.gov', 'house.gov', 'miamidade.gov'],
    refresh_frequency_days: 60,
    completion_weight: 5
  },
  {
    field_id: 'identity_person_uuid',
    field_name: 'Permanent Person UUID Resolution',
    category: 'CORE_IDENTITY',
    sub_category: 'Identity Key',
    description: 'Single canonical UUID resolution tied to state voter ID / election filing',
    entity_type: 'PERSON',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H5',
    authoritative_sources: ['civiclenz_identity_matrix'],
    refresh_frequency_days: 365,
    completion_weight: 10
  },

  // CURRENT PUBLIC OFFICE (B) & SEAT (C)
  {
    field_id: 'office_seat_title',
    field_name: 'Verified Seat Title & District',
    category: 'CURRENT_PUBLIC_OFFICE',
    sub_category: 'Office Title',
    description: 'Official seat title, district number, and government jurisdiction level',
    entity_type: 'SEAT',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H1',
    secondary_validation_agent: 'H10',
    authoritative_sources: ['dos.elections.myflorida.com', 'census.gov/tiger'],
    refresh_frequency_days: 14,
    completion_weight: 10
  },
  {
    field_id: 'office_term_dates',
    field_name: 'Official Term Start & End Dates',
    category: 'CURRENT_PUBLIC_OFFICE',
    sub_category: 'Tenure',
    description: 'Exact swearing-in date and certified term expiration date',
    entity_type: 'OFFICEHOLDER_TERM',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H30',
    authoritative_sources: ['dos.elections.myflorida.com', 'county_clerk_dockets'],
    refresh_frequency_days: 30,
    completion_weight: 10
  },
  {
    field_id: 'office_district_boundary_gis',
    field_name: 'District Polygon Shapefile & Address Resolution',
    category: 'DISTRICT_CONSTITUENCY',
    sub_category: 'GIS Geometry',
    description: 'Validated GeoJSON/Shapefile boundary polygon with address resolution test pass',
    entity_type: 'SEAT',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'SPECIAL_DISTRICT'],
    responsible_HERMES_agent: 'H10',
    authoritative_sources: ['census.gov/tiger/line', 'florida_gis_clearinghouse'],
    refresh_frequency_days: 90,
    completion_weight: 10
  },

  // LEGISLATION (N) & ROLL CALL VOTES (O)
  {
    field_id: 'legislation_roll_call_votes',
    field_name: 'Complete Service Roll-Call Voting Record',
    category: 'ROLL_CALL_VOTES',
    sub_category: 'Legislative Votes',
    description: 'Every roll-call vote during active tenure linked to underlying bill_uuid and motion',
    entity_type: 'PERSON',
    requirement_type: 'CONDITIONAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD'],
    responsible_HERMES_agent: 'H13',
    secondary_validation_agent: 'H24',
    authoritative_sources: ['senate.gov/votes', 'flsenate.gov/session/votes'],
    refresh_frequency_days: 7,
    completion_weight: 15
  },
  {
    field_id: 'legislation_bills_sponsored',
    field_name: 'Sponsored & Co-Sponsored Legislation Index',
    category: 'LEGISLATION',
    sub_category: 'Bill Index',
    description: 'Exhaustive index of bills sponsored, co-sponsored, and amendments introduced',
    entity_type: 'PERSON',
    requirement_type: 'CONDITIONAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR'],
    responsible_HERMES_agent: 'H13',
    authoritative_sources: ['congress.gov', 'flsenate.gov'],
    refresh_frequency_days: 7,
    completion_weight: 10
  },

  // EXECUTIVE ACTIONS (R)
  {
    field_id: 'executive_orders_vetoes',
    field_name: 'Executive Orders, Vetoes & Appointments Index',
    category: 'EXECUTIVE_ACTIONS',
    sub_category: 'Directives',
    description: 'All executive orders issued, vetoes, line-item budget actions, and board appointments',
    entity_type: 'PERSON',
    requirement_type: 'CONDITIONAL_REQUIRED',
    applicable_office_types: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'SHERIFF'],
    responsible_HERMES_agent: 'H30',
    secondary_validation_agent: 'H19',
    authoritative_sources: ['flgov.com/orders', 'miamidade.gov/mayor'],
    refresh_frequency_days: 14,
    completion_weight: 15
  },

  // CAMPAIGN FINANCE (J, K, L)
  {
    field_id: 'finance_reconciled_receipts',
    field_name: 'Campaign Contributions Reconciled Ledger',
    category: 'CAMPAIGN_FINANCE',
    sub_category: 'Contributions',
    description: 'Complete itemized contributions reconciled against official campaign filing totals',
    entity_type: 'PERSON',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H6',
    secondary_validation_agent: 'H24',
    authoritative_sources: ['fec.gov', 'dos.elections.myflorida.com/campaign-finance'],
    refresh_frequency_days: 14,
    completion_weight: 15
  },
  {
    field_id: 'finance_ethics_form6_disclosures',
    field_name: 'Financial Disclosures & Form 6 Net Worth Filings',
    category: 'FINANCIAL_DISCLOSURES',
    sub_category: 'Public Disclosures',
    description: 'Commission on Ethics annual Form 6 filings, liabilities, assets, and business interests',
    entity_type: 'PERSON',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H19',
    authoritative_sources: ['ethics.state.fl.us', 'house.gov/disclosures'],
    refresh_frequency_days: 30,
    completion_weight: 10
  },

  // CAMPAIGN PROMISES & POSITIONS (U, V)
  {
    field_id: 'promises_classified_commitments',
    field_name: 'Campaign Promises & Policy Stance Ledger',
    category: 'CAMPAIGN_PROMISES',
    sub_category: 'Promises',
    description: 'Individual promise_uuid records evaluated with 8-state classification and source quotes',
    entity_type: 'PERSON',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H14',
    secondary_validation_agent: 'H15',
    authoritative_sources: ['campaign_policy_archives', 'speech_transcripts'],
    refresh_frequency_days: 30,
    completion_weight: 10
  },

  // ETHICS & COURTS (AC, AD)
  {
    field_id: 'ethics_court_public_dockets',
    field_name: 'Ethics Complaints & Court Proceedings Inventory',
    category: 'ETHICS_RECORDS',
    sub_category: 'Procedural Records',
    description: 'Verified ethics commission findings and court case_uuid records preserving procedural status',
    entity_type: 'PERSON',
    requirement_type: 'UNIVERSAL_REQUIRED',
    applicable_office_types: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'],
    responsible_HERMES_agent: 'H19',
    secondary_validation_agent: 'H20',
    authoritative_sources: ['ethics.state.fl.us', 'pacer.uscourts.gov'],
    refresh_frequency_days: 30,
    completion_weight: 5
  }
];
