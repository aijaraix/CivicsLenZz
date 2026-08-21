// CivicLenZ / HERMES Matrix V2 — Living Research Contract & Completeness Engine
// Implements Master Instruction Document Stage 3:
// - Field-by-field completeness derived from Office Type Templates
// - 6 Mandatory Field States (VERIFIED_VALUE, VERIFIED_NONE, NOT_APPLICABLE, CONFLICTING_EVIDENCE, INSUFFICIENT_EVIDENCE, RESEARCH_IN_PROGRESS)
// - Evidence Object Requirement with Source Authority Tiers (1-4)
// - First-Class Negative Research Support (VERIFIED_NONE + checked sources)
// - 15 Maximal Public Aggregation Categories

import { OfficeTypeTemplate } from './completeness-contract';

export type MandatoryFieldState =
  | 'VERIFIED_VALUE'          // Verified positive record found & evidence attached
  | 'VERIFIED_NONE'           // Negative research confirmed (checked required sources; verified no record exists)
  | 'NOT_APPLICABLE'          // Field does not apply to office type
  | 'CONFLICTING_EVIDENCE'    // Research complete, but authoritative sources disagree
  | 'INSUFFICIENT_EVIDENCE'   // Partial data found, but below verification threshold
  | 'RESEARCH_IN_PROGRESS';   // Default initial state, worker research underway

export type SourceAuthorityTier = 1 | 2 | 3 | 4;
// Tier 1: Official Government / Legislative / Court / Election Authority / Ethics Commission (.gov / .mil)
// Tier 2: Official Campaign / Official Officeholder Statement / Candidate Filings
// Tier 3: High-Quality Secondary (Reputable Major News / Policy Research / Nonpartisan Databases)
// Tier 4: Other Public Secondary Sources

export interface EvidenceObject {
  evidence_uuid: string;
  field_key: string;
  value: any;
  primary_source_url: string; // Deep link preferred
  source_authority_tier: SourceAuthorityTier;
  retrieval_timestamp: string;
  evidence_note: string;
  field_state: MandatoryFieldState;
}

export interface CheckedSourceRecord {
  source_name: string;
  source_url: string;
  searched_timestamp: string;
  search_method: string;
  findings_note: string;
}

export interface ResearchContractField {
  field_key: string;
  field_label: string;
  category: ResearchCategory;
  description: string;
  is_required: boolean;
  applicability: 'REQUIRED' | 'OPTIONAL' | 'NOT_APPLICABLE';
  current_state: MandatoryFieldState;
  evidence_objects: EvidenceObject[];
  checked_sources: CheckedSourceRecord[]; // Used when state is VERIFIED_NONE
  last_updated: string;
}

export type ResearchCategory =
  | 'CORE_IDENTITY_BIOGRAPHY'
  | 'SEAT_OFFICE_DETAILS'
  | 'EDUCATION_CAREER_HISTORY'
  | 'BUSINESS_INTERESTS'
  | 'ELECTION_HISTORY'
  | 'CAMPAIGN_FINANCE_ITEMIZED'
  | 'LEGISLATIVE_VOTING_RECORD'
  | 'BILLS_SPONSORED'
  | 'PUBLIC_PROMISES'
  | 'PUBLIC_STATEMENTS_POSITIONS'
  | 'ETHICS_FINANCIAL_DISCLOSURES'
  | 'PUBLIC_COURT_LEGAL_RECORDS'
  | 'COMMITTEE_WORK'
  | 'CONTACT_OFFICIAL_PRESENCE'
  | 'GEOSPATIAL_DISTRICT_INFO';

export const MAXIMAL_AGGREGATION_CATEGORIES: ResearchCategory[] = [
  'CORE_IDENTITY_BIOGRAPHY',
  'SEAT_OFFICE_DETAILS',
  'EDUCATION_CAREER_HISTORY',
  'BUSINESS_INTERESTS',
  'ELECTION_HISTORY',
  'CAMPAIGN_FINANCE_ITEMIZED',
  'LEGISLATIVE_VOTING_RECORD',
  'BILLS_SPONSORED',
  'PUBLIC_PROMISES',
  'PUBLIC_STATEMENTS_POSITIONS',
  'ETHICS_FINANCIAL_DISCLOSURES',
  'PUBLIC_COURT_LEGAL_RECORDS',
  'COMMITTEE_WORK',
  'CONTACT_OFFICIAL_PRESENCE',
  'GEOSPATIAL_DISTRICT_INFO'
];

export interface ResearchContract {
  contract_uuid: string;
  seat_uuid: string;
  office_type: OfficeTypeTemplate;
  version: string;
  created_at: string;
  last_recalculated_at: string;
  categories: ResearchCategory[];
  fields: Record<string, ResearchContractField>;
  
  // Real Calculated Metrics
  calculated_completeness_percent: number;
  total_required_applicable_fields: number;
  total_completed_required_fields: number; // VERIFIED_VALUE + VERIFIED_NONE
  total_not_applicable_fields: number;
  
  field_state_counts: {
    verified_value: number;
    verified_none: number;
    not_applicable: number;
    conflicting_evidence: number;
    insufficient_evidence: number;
    research_in_progress: number;
  };
  
  missing_category_labels: string[];
}

// ============================================================================
// TEMPLATE DEFINITIONS PER OFFICE TYPE
// ============================================================================

interface FieldTemplateSpec {
  key: string;
  label: string;
  category: ResearchCategory;
  description: string;
  requiredFor: OfficeTypeTemplate[];
  notApplicableFor?: OfficeTypeTemplate[];
}

export const MASTER_CONTRACT_FIELD_SPECS: FieldTemplateSpec[] = [
  // 1. CORE IDENTITY & BIOGRAPHY
  { key: 'identity_full_name', label: 'Full Legal Name & Suffix', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Legal name verified from qualifying papers or voter ID', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },
  { key: 'identity_official_portrait', label: 'Official High-Res Portrait URL', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Verified photo from .gov or official campaign docket', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },
  { key: 'identity_party_affiliation', label: 'Party Affiliation / Nonpartisan Status', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Registered party or nonpartisan designation', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },
  { key: 'identity_biography_summary', label: 'Verified Public Biography', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Structured narrative of life, upbringing, and background', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 2. SEAT & OFFICE DETAILS
  { key: 'office_title_district', label: 'Official Seat Title & District Code', category: 'SEAT_OFFICE_DETAILS', description: 'Canonical title, seat number, and jurisdiction', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },
  { key: 'office_term_dates', label: 'Swearing-in & Term Expiration Dates', category: 'SEAT_OFFICE_DETAILS', description: 'Exact term tenure boundaries', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 3. EDUCATION & CAREER HISTORY
  { key: 'education_degrees', label: 'Academic Education & Degrees', category: 'EDUCATION_CAREER_HISTORY', description: 'Colleges, universities, and degrees awarded', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },
  { key: 'career_employment_history', label: 'Professional Employment Career History', category: 'EDUCATION_CAREER_HISTORY', description: 'Prior private and public sector job positions held', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 4. BUSINESS INTERESTS
  { key: 'business_corporate_affiliations', label: 'Business Ownership & Corporate Boards', category: 'BUSINESS_INTERESTS', description: 'Active or past corporate directorships and LLC ownerships', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 5. ELECTION HISTORY
  { key: 'election_past_results', label: 'Full Historical Election Results Ledger', category: 'ELECTION_HISTORY', description: 'Historical vote totals, percentages, and opponents across past cycles', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 6. CAMPAIGN FINANCE ITEMIZED
  { key: 'finance_total_raised_spent', label: 'Campaign Finance Total Receipts & Expenditures', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Authoritative total receipts, spending, and cash on hand', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },
  { key: 'finance_top_donors_pac', label: 'Itemized Top Donors & PAC Contributions', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'List of top individual contributors and committee transfers', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 7. LEGISLATIVE / VOTING RECORD
  { key: 'legislative_roll_call_votes', label: 'Roll-Call Voting Record', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Full roll-call voting record on motions and bills', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD'], notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },

  // 8. BILLS SPONSORED
  { key: 'bills_sponsored_cosponsored', label: 'Sponsored & Co-Sponsored Legislation Index', category: 'BILLS_SPONSORED', description: 'Index of bills prime-sponsored or co-sponsored', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR'], notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },

  // 9. PUBLIC PROMISES
  { key: 'public_promises_commitments', label: 'Campaign Promises & Explicit Policy Commitments', category: 'PUBLIC_PROMISES', description: 'Extracted platform promises with source links', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'], notApplicableFor: ['JUDICIAL'] },

  // 10. PUBLIC STATEMENTS & POSITIONS
  { key: 'public_statements_positions', label: 'Policy Positions & Public Statements Archive', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Documented positions on key policy categories', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 11. ETHICS & FINANCIAL DISCLOSURES
  { key: 'ethics_annual_form_filings', label: 'Ethics Commission Filings & Form 6 Net Worth', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Annual state/federal ethics disclosures and asset listings', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 12. PUBLIC COURT / LEGAL RECORDS
  { key: 'public_court_legal_records', label: 'Public Court Dockets & Litigation History', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'Civil or criminal public court docket history', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 13. COMMITTEE WORK
  { key: 'committee_assignments', label: 'Committee Assignments & Chairmanships', category: 'COMMITTEE_WORK', description: 'Active legislative or executive board committees', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD'], notApplicableFor: ['JUDICIAL', 'SHERIFF'] },

  // 14. CONTACT & OFFICIAL PRESENCE
  { key: 'contact_official_presence', label: 'Official Government Contact & Website Portals', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Official office address, phone number, and .gov page', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'EXECUTIVE', 'COUNTY_EXECUTIVE', 'COUNTY_COMMISSIONER', 'MUNICIPAL_EXECUTIVE', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'JUDICIAL', 'SHERIFF', 'SPECIAL_DISTRICT', 'OTHER_ELECTED_OFFICE'] },

  // 15. GEOSPATIAL / DISTRICT INFO
  { key: 'geospatial_district_boundary', label: 'District Boundary Polygon & GIS Registry', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Validated boundary map geometry', requiredFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR', 'COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD', 'SPECIAL_DISTRICT'], notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] }
];

// ============================================================================
// RESEARCH CONTRACT ENGINE CLASS
// ============================================================================

export class ResearchContractEngine {
  
  // Factory: Create a living contract for a Seat based on office type
  public createContractForSeat(
    seatUuid: string,
    officeType: OfficeTypeTemplate
  ): ResearchContract {
    const contractUuid = `contract_${seatUuid}_v2_${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();

    const fieldsMap: Record<string, ResearchContractField> = {};

    MASTER_CONTRACT_FIELD_SPECS.forEach(spec => {
      let isNotApplicable = false;
      if (spec.notApplicableFor && spec.notApplicableFor.includes(officeType)) {
        isNotApplicable = true;
      }

      let isRequired = spec.requiredFor.includes(officeType);
      if (isNotApplicable) isRequired = false;

      const applicability: 'REQUIRED' | 'OPTIONAL' | 'NOT_APPLICABLE' = isNotApplicable
        ? 'NOT_APPLICABLE'
        : isRequired
        ? 'REQUIRED'
        : 'OPTIONAL';

      const initialState: MandatoryFieldState = isNotApplicable
        ? 'NOT_APPLICABLE'
        : 'RESEARCH_IN_PROGRESS';

      fieldsMap[spec.key] = {
        field_key: spec.key,
        field_label: spec.label,
        category: spec.category,
        description: spec.description,
        is_required: isRequired,
        applicability,
        current_state: initialState,
        evidence_objects: [],
        checked_sources: [],
        last_updated: nowIso
      };
    });

    const contract: ResearchContract = {
      contract_uuid: contractUuid,
      seat_uuid: seatUuid,
      office_type: officeType,
      version: '2026.1-STAGE3',
      created_at: nowIso,
      last_recalculated_at: nowIso,
      categories: [...MAXIMAL_AGGREGATION_CATEGORIES],
      fields: fieldsMap,
      calculated_completeness_percent: 0,
      total_required_applicable_fields: 0,
      total_completed_required_fields: 0,
      total_not_applicable_fields: 0,
      field_state_counts: {
        verified_value: 0,
        verified_none: 0,
        not_applicable: 0,
        conflicting_evidence: 0,
        insufficient_evidence: 0,
        research_in_progress: 0
      },
      missing_category_labels: []
    };

    return this.recalculateContractCompleteness(contract);
  }

  // Pure Math Calculation Engine
  // Completeness % = (VERIFIED_VALUE + VERIFIED_NONE) / (Applicable Required Fields) * 100
  public recalculateContractCompleteness(contract: ResearchContract): ResearchContract {
    const fields = Object.values(contract.fields);

    let totalApplicableRequired = 0;
    let totalCompletedRequired = 0;
    let totalNotApplicable = 0;

    const stateCounts = {
      verified_value: 0,
      verified_none: 0,
      not_applicable: 0,
      conflicting_evidence: 0,
      insufficient_evidence: 0,
      research_in_progress: 0
    };

    const missingCategoryMap: Map<string, boolean> = new Map();

    fields.forEach(field => {
      // Tally explicit states
      switch (field.current_state) {
        case 'VERIFIED_VALUE':
          stateCounts.verified_value++;
          break;
        case 'VERIFIED_NONE':
          stateCounts.verified_none++;
          break;
        case 'NOT_APPLICABLE':
          stateCounts.not_applicable++;
          totalNotApplicable++;
          break;
        case 'CONFLICTING_EVIDENCE':
          stateCounts.conflicting_evidence++;
          break;
        case 'INSUFFICIENT_EVIDENCE':
          stateCounts.insufficient_evidence++;
          break;
        case 'RESEARCH_IN_PROGRESS':
          stateCounts.research_in_progress++;
          break;
      }

      // Calculate required applicable denominator & completed numerator
      if (field.applicability === 'REQUIRED' && field.current_state !== 'NOT_APPLICABLE') {
        totalApplicableRequired++;

        if (field.current_state === 'VERIFIED_VALUE' || field.current_state === 'VERIFIED_NONE') {
          totalCompletedRequired++;
        } else {
          // Track missing categories
          missingCategoryMap.set(field.category, true);
        }
      }
    });

    const denominator = totalApplicableRequired || 1;
    const completenessPercent = Number(((totalCompletedRequired / denominator) * 100).toFixed(1));

    contract.calculated_completeness_percent = completenessPercent;
    contract.total_required_applicable_fields = totalApplicableRequired;
    contract.total_completed_required_fields = totalCompletedRequired;
    contract.total_not_applicable_fields = totalNotApplicable;
    contract.field_state_counts = stateCounts;
    contract.missing_category_labels = Array.from(missingCategoryMap.keys());
    contract.last_recalculated_at = new Date().toISOString();

    return contract;
  }

  // Attach Verified Value & Evidence Object to a Field
  public attachFieldEvidence(
    contract: ResearchContract,
    fieldKey: string,
    evidence: {
      value: any;
      primary_source_url: string;
      source_authority_tier: SourceAuthorityTier;
      evidence_note: string;
      field_state?: MandatoryFieldState;
    }
  ): ResearchContract {
    const field = contract.fields[fieldKey];
    if (!field) return contract;

    const state = evidence.field_state || 'VERIFIED_VALUE';
    const evUuid = `ev_${fieldKey}_${Date.now().toString(36)}`;

    const newEvidence: EvidenceObject = {
      evidence_uuid: evUuid,
      field_key: fieldKey,
      value: evidence.value,
      primary_source_url: evidence.primary_source_url,
      source_authority_tier: evidence.source_authority_tier,
      retrieval_timestamp: new Date().toISOString(),
      evidence_note: evidence.evidence_note,
      field_state: state
    };

    field.evidence_objects.unshift(newEvidence);
    field.current_state = state;
    field.last_updated = new Date().toISOString();

    return this.recalculateContractCompleteness(contract);
  }

  // Register First-Class Negative Research (VERIFIED_NONE)
  public recordNegativeResearch(
    contract: ResearchContract,
    fieldKey: string,
    checkedSource: {
      source_name: string;
      source_url: string;
      search_method: string;
      findings_note: string;
    }
  ): ResearchContract {
    const field = contract.fields[fieldKey];
    if (!field) return contract;

    const sourceRecord: CheckedSourceRecord = {
      source_name: checkedSource.source_name,
      source_url: checkedSource.source_url,
      searched_timestamp: new Date().toISOString(),
      search_method: checkedSource.search_method,
      findings_note: checkedSource.findings_note
    };

    field.checked_sources.unshift(sourceRecord);
    field.current_state = 'VERIFIED_NONE';
    field.last_updated = new Date().toISOString();

    return this.recalculateContractCompleteness(contract);
  }
}

export const researchContractEngine = new ResearchContractEngine();
