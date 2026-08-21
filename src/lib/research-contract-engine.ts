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

export const ALL_OFFICE_TYPES: OfficeTypeTemplate[] = [
  'FEDERAL_LEGISLATOR',
  'STATE_LEGISLATOR',
  'EXECUTIVE',
  'COUNTY_EXECUTIVE',
  'COUNTY_COMMISSIONER',
  'MUNICIPAL_EXECUTIVE',
  'MUNICIPAL_LEGISLATOR',
  'SCHOOL_BOARD',
  'JUDICIAL',
  'SHERIFF',
  'SPECIAL_DISTRICT',
  'OTHER_ELECTED_OFFICE'
];

export const LEGISLATIVE_OFFICE_TYPES: OfficeTypeTemplate[] = [
  'FEDERAL_LEGISLATOR',
  'STATE_LEGISLATOR',
  'COUNTY_COMMISSIONER',
  'MUNICIPAL_LEGISLATOR',
  'SCHOOL_BOARD'
];

export const EXECUTIVE_OFFICE_TYPES: OfficeTypeTemplate[] = [
  'EXECUTIVE',
  'COUNTY_EXECUTIVE',
  'MUNICIPAL_EXECUTIVE',
  'SHERIFF'
];

export const MASTER_CONTRACT_FIELD_SPECS: FieldTemplateSpec[] = [
  // ============================================================================
  // SECTION 1: CORE PERSON IDENTITY (14 fields)
  // ============================================================================
  { key: 'identity_full_name', label: 'Full Legal Name & Suffix', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Legal name verified from qualifying papers, voter ID, or court records', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_official_portrait', label: 'Official High-Res Portrait URL', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Verified official photo from .gov or campaign filing docket', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_party_affiliation', label: 'Party Registration & Affiliation History', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Registered party designation and party switch history', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_biography_summary', label: 'Verified Public Biography Narrative', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Structured narrative of life, upbringing, and public service background', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_birth_details', label: 'Date & Place of Birth Verification', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Verified birth date, birthplace, and citizenship documentation', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_residency_status', label: 'Legal District Residency Verification', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Primary residence compliance check within elected district boundaries', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_military_service', label: 'Military Service & Discharge Record', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Armed forces branch, service dates, rank, awards, and DD-214 verification', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_voter_registration_id', label: 'State Voter Registration Record', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'State voter registration ID number, precinct code, and registration status', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_languages_spoken', label: 'Verified Foreign Language Fluency', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Documented language capabilities for constituent communication', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_preferred_name_pronouns', label: 'Preferred Moniker & Pronouns', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Moniker used on ballots, preferred name, and pronouns', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_aliases_entity_resolution', label: 'Person Identity Aliases for Entity Resolution', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Name variations, nicknames, and database aliases for entity resolution', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_family_dynasty_links', label: 'Publicly Relevant Family & Dynasty Links', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Publicly identified spouse and relatives in public office', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_awards_honors', label: 'Civic Awards & Public Honors', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Civilian awards, honors, and public service recognitions', requiredFor: ALL_OFFICE_TYPES },
  { key: 'identity_organizations_memberships', label: 'Civic & Policy Organization Memberships', category: 'CORE_IDENTITY_BIOGRAPHY', description: 'Affiliations with civic, policy, professional, and community organizations', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 2 & 3: SEAT, OFFICE DETAILS, & SEAT HISTORY (16 fields)
  // ============================================================================
  { key: 'office_title_district', label: 'Official Seat Title & District Code', category: 'SEAT_OFFICE_DETAILS', description: 'Canonical title, seat designation, and governing jurisdiction code', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_authority_responsibilities', label: 'Constitutional / Charter Authority Basis', category: 'SEAT_OFFICE_DETAILS', description: 'Statutory or constitutional section defining powers and responsibilities of office', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_term_dates', label: 'Swearing-in & Term Expiration Dates', category: 'SEAT_OFFICE_DETAILS', description: 'Exact term tenure boundaries and swearing-in ceremony record', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_term_limits', label: 'Term Limit Eligibility Ledger', category: 'SEAT_OFFICE_DETAILS', description: 'Consecutive terms served, statutory term limit, and eligibility for re-election', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_salary_compensation', label: 'Statutory Salary & Benefits Schedule', category: 'SEAT_OFFICE_DETAILS', description: 'Official officeholder salary, per diem rates, and benefits disclosures', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_oath_record', label: 'Signed Oath of Office Docket', category: 'SEAT_OFFICE_DETAILS', description: 'Primary link to signed Oath of Office archived with Secretary of State/Clerk', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_predecessor_successor', label: 'Predecessor & Successor Links', category: 'SEAT_OFFICE_DETAILS', description: 'Immediate predecessor who held seat and successor upon transition', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_vacancy_creation_reason', label: 'Seat Vacancy Origin Record', category: 'SEAT_OFFICE_DETAILS', description: 'Reason seat became open (Resignation, Term Limit, Appointment, Special Election)', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_jurisdiction_bounds', label: 'Geographic & Statutory Jurisdiction Bounds', category: 'SEAT_OFFICE_DETAILS', description: 'Legal jurisdiction boundary definitions and statutory authority constraints', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_seat_history_lineage', label: 'Chronological Officeholder Lineage', category: 'SEAT_OFFICE_DETAILS', description: 'Historical lineage of past occupants holding seat since creation', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_seat_history_vacancies', label: 'Historical Vacancies & Special Elections', category: 'SEAT_OFFICE_DETAILS', description: 'Historical vacancies, interim appointments, and special election triggers', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_seat_redistricting_changes', label: 'Seat Redistricting & Renumbering Log', category: 'SEAT_OFFICE_DETAILS', description: 'Boundary changes, district renumbering, and consolidation history', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_constituency_population', label: 'Constituency Population & Demographics', category: 'SEAT_OFFICE_DETAILS', description: 'District census population count, voting age population, and demographics', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_election_method_rules', label: 'Method of Election & Partisan Rules', category: 'SEAT_OFFICE_DETAILS', description: 'Partisan/nonpartisan status, at-large vs single-member district rules', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_succession_recall_rules', label: 'Succession & Impeachment/Recall Rules', category: 'SEAT_OFFICE_DETAILS', description: 'Statutory rules governing gubernatorial/presidential succession, recall, or removal', requiredFor: ALL_OFFICE_TYPES },
  { key: 'office_attached_boards_caucuses', label: 'Leadership Roles & Attached Boards', category: 'SEAT_OFFICE_DETAILS', description: 'Caucus memberships, leadership roles, and ex-officio board directorships', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 5, 45, 50: CONTACT, DIGITAL PRESENCE, & SERVICES (12 fields)
  // ============================================================================
  { key: 'contact_official_presence', label: 'Official Government Contact & Website Portals', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Capitol and district office addresses, official phone, and .gov web pages', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_capitol_office_address', label: 'Capitol / Main Executive Office Location', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Official capitol building room number, suite, physical street address, and zip code', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_district_office_addresses', label: 'Local District Office Directory', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Full directory of local district constituent service office addresses and phone lines', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_official_phone_fax', label: 'Official Phone & Fax Line Directory', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Main office phone numbers, constituent service hotlines, and official fax lines', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_official_email_portal', label: 'Official Constituent Contact Portal', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Official .gov email address or online constituent message submission portal', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_official_website_url', label: 'Official Government Web Portal (.gov)', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Validated primary URL for official officeholder web portal', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_official_x_twitter', label: 'Verified Official X/Twitter Account', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Authenticated handle for official officeholder social media account', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_official_youtube_channel', label: 'Official Video / Live Stream Channel', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Official YouTube, Rumble, or state video portal channel for press conferences', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_social_media_accounts', label: 'Verified Official Social Accounts Directory', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Official Facebook, Instagram, LinkedIn, and TikTok handles with verification badges', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_website_change_archive', label: 'Official Website Change Archive History', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Wayback Machine & web archive snapshots capturing policy or bio claim edits', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_constituent_services_info', label: 'Constituent Services & Casework Directory', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Casework request channels, district office hours, and town hall schedules', requiredFor: ALL_OFFICE_TYPES },
  { key: 'contact_official_newsletter_feed', label: 'Official Newsletter & Press Distribution Feed', category: 'CONTACT_OFFICIAL_PRESENCE', description: 'Official constituent e-newsletter archive and press advisory distribution lists', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 6, 7, 8, 9: EDUCATION, CAREER, PRIOR SERVICE, & MILITARY (14 fields)
  // ============================================================================
  { key: 'education_undergraduate', label: 'Undergraduate Institution & Degree', category: 'EDUCATION_CAREER_HISTORY', description: 'College/University name, major, degree conferred, and graduation year', requiredFor: ALL_OFFICE_TYPES },
  { key: 'education_postgraduate_law', label: 'Graduate / Law School Degree', category: 'EDUCATION_CAREER_HISTORY', description: 'Graduate or law school institution, degree (JD, MPA, MBA, MD), and year', requiredFor: ALL_OFFICE_TYPES },
  { key: 'education_high_school', label: 'Secondary Education / High School', category: 'EDUCATION_CAREER_HISTORY', description: 'High school name, location, and diploma conferral year', requiredFor: ALL_OFFICE_TYPES },
  { key: 'education_degree_verification', label: 'Degree Primary Source Verification Seal', category: 'EDUCATION_CAREER_HISTORY', description: 'National Student Clearinghouse or university registrar verification seal', requiredFor: ALL_OFFICE_TYPES },
  { key: 'career_chronological_timeline', label: 'Full Chronological Career History', category: 'EDUCATION_CAREER_HISTORY', description: 'Unified chronological timeline of private, public, legal, and academic employment', requiredFor: ALL_OFFICE_TYPES },
  { key: 'career_public_sector', label: 'Public Sector Job & Appointed Office History', category: 'EDUCATION_CAREER_HISTORY', description: 'Chronological ledger of prior public employment, staff roles, and appointed boards', requiredFor: ALL_OFFICE_TYPES },
  { key: 'career_private_sector', label: 'Private Sector Employment & Executive Experience', category: 'EDUCATION_CAREER_HISTORY', description: 'Private sector career history, corporate management, and employment timeline', requiredFor: ALL_OFFICE_TYPES },
  { key: 'career_nonprofit_civic', label: 'Nonprofit & Civic Organization Leadership', category: 'EDUCATION_CAREER_HISTORY', description: 'Nonprofit executive roles, community board directorships, and volunteer service', requiredFor: ALL_OFFICE_TYPES },
  { key: 'career_academic_positions', label: 'Academic Appointments & Adjunct Positions', category: 'EDUCATION_CAREER_HISTORY', description: 'Professorships, lectureships, research fellowships, and academic affiliations', requiredFor: ALL_OFFICE_TYPES },
  { key: 'career_professional_licenses', label: 'Professional Licenses & Bar Admissions', category: 'EDUCATION_CAREER_HISTORY', description: 'Active or inactive state bar admissions, CPA, medical, or contractor licenses', requiredFor: ALL_OFFICE_TYPES },
  { key: 'career_license_disciplinary_check', label: 'Professional License Disciplinary Audit', category: 'EDUCATION_CAREER_HISTORY', description: 'State licensing board audit confirming clean standing or documenting actions', requiredFor: ALL_OFFICE_TYPES },
  { key: 'prior_govt_service_elected_offices', label: 'Prior Elected Offices Held Index', category: 'EDUCATION_CAREER_HISTORY', description: 'Federal, state, county, municipal, or school board offices previously held', requiredFor: ALL_OFFICE_TYPES },
  { key: 'prior_govt_service_executive_appointments', label: 'Gubernatorial / Executive Appointed Roles', category: 'EDUCATION_CAREER_HISTORY', description: 'Appointed state boards, commissions, task forces, and agency directorships', requiredFor: ALL_OFFICE_TYPES },
  { key: 'military_service_branch_rank', label: 'Military Service, Rank, & DD-214 Record', category: 'EDUCATION_CAREER_HISTORY', description: 'Armed forces branch, rank, active service dates, unit, and discharge status', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 10, 40, 41: BUSINESS INTERESTS & LOBBYING CONNECTIONS (12 fields)
  // ============================================================================
  { key: 'business_active_llc_corporations', label: 'Active Corporate Ownership & LLC Filings', category: 'BUSINESS_INTERESTS', description: 'Active Florida Sunbiz or state corporate registries, LLCs, and partnerships', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_past_enterprises', label: 'Inactive / Dissolved Corporate Entities', category: 'BUSINESS_INTERESTS', description: 'Past dissolved LLCs, bankrupt entities, or former business ventures', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_board_seats', label: 'For-Profit Corporate Board Directorships', category: 'BUSINESS_INTERESTS', description: 'Current and past corporate board seats and associated director compensation', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_real_estate_holdings', label: 'Commercial & Investment Real Estate Schedule', category: 'BUSINESS_INTERESTS', description: 'County property appraiser records for commercial and investment real estate', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_equity_stock_portfolio', label: 'Disclosed Stock Holdings & Equities Portfolio', category: 'BUSINESS_INTERESTS', description: 'Financial disclosure schedule of stocks, bonds, and business equity stakes', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_patents_trademarks', label: 'Intellectual Property, Patents, & Trademarks', category: 'BUSINESS_INTERESTS', description: 'USPTO registered patents, trademarks, and copyright assets held', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_lobbying_history', label: 'Past Registered Lobbyist History & Client List', category: 'BUSINESS_INTERESTS', description: 'Historical legislative or executive lobbyist registrations and representational clients', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_government_contracts', label: 'Public Contracts & Government Procurement Bids', category: 'BUSINESS_INTERESTS', description: 'State/local government contracts, grants, or procurement vendor awards', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_status_classification', label: 'Business Enterprise Status Classification', category: 'BUSINESS_INTERESTS', description: 'Current / Former / Disclosed / Alleged-Unverified enterprise classification', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_conflict_disclosures', label: 'Disclosed Business Conflict of Interest Ledger', category: 'BUSINESS_INTERESTS', description: 'Formal business conflict disclosures filed with ethics authorities', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_spousal_commercial_interests', label: 'Spousal Business & Commercial Ownerships', category: 'BUSINESS_INTERESTS', description: 'Publicly relevant spousal business ownerships and corporate roles', requiredFor: ALL_OFFICE_TYPES },
  { key: 'business_cooling_off_compliance', label: 'Lobbying Cooling-Off Period Audit', category: 'BUSINESS_INTERESTS', description: 'Compliance audit of statutory post-office lobbying prohibition periods', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 11, 35, 42, 43: ETHICS & FINANCIAL DISCLOSURES (14 fields)
  // ============================================================================
  { key: 'ethics_annual_form_filings', label: 'Ethics Commission Filings & Form 6 Net Worth', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Annual state/federal ethics filings, Form 6 disclosures, and net worth calculations', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_income_sources_breakdown', label: 'Primary & Secondary Earned Income Schedule', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Itemized primary employers, consulting income, and secondary business compensation', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_liabilities_debts', label: 'Disclosed Liabilities, Mortgages, & Debt Schedule', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'List of liabilities over statutory thresholds, mortgage lenders, and loan amounts', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_gift_disclosures', label: 'Disclosed Gifts, Honoraria, & Travel Expenses', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Quarterly gift disclosures, sponsored travel reimbursements, and event tickets', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_blind_trusts', label: 'Qualified Blind Trust Agreements', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Approved blind trust filings and trustee identification documents', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_complaints_allegations', label: 'Ethics Complaints & Regulatory Dockets', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Dockets of complaints filed with Ethics Commission (distinguishing unverified allegations)', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_commission_rulings', label: 'Ethics Commission Formal Rulings & Fines', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Formal probability cause findings, stipulated settlements, public reprimands, or fines', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_conflict_of_interest_recusals', label: 'Disclosed Financial Conflict Recusals', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Public abstentions and conflict disclosures filed during votes or official actions', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_spousal_financial_disclosures', label: 'Spousal Financial Interest Disclosures', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Spousal income or business interests requiring disclosure (filtered for civic relevance)', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_filing_timeliness_check', label: 'On-Time Ethics Filing Compliance Audit', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Audit confirming annual disclosure submitted prior to statutory deadline', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_property_valuation_ranges', label: 'Real Estate Valuation Schedule', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'County property appraiser assessed values and disclosure bracket ranges', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_tax_liens_judgments', label: 'Tax Liens, Judgments, & Bankruptcy Dockets', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'County clerk tax lien filings, civil money judgments, and bankruptcy dockets', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_campaign_enforcement_actions', label: 'Campaign Finance Enforcement Dockets', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'FEC or state Division of Elections campaign audit fines and enforcement actions', requiredFor: ALL_OFFICE_TYPES },
  { key: 'ethics_procedural_status_seal', label: 'Procedural Innocence Seal (Complaint ≠ Finding)', category: 'ETHICS_FINANCIAL_DISCLOSURES', description: 'Formal seal guaranteeing complaint allegations are distinguished from verified findings', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 12, 13, 14, 30, 31, 32, 33, 34, 49, 51, 52, 53: ELECTIONS & CAMPAIGNS (18 fields)
  // ============================================================================
  { key: 'election_current_filing_status', label: 'Active Cycle Filing & Qualifying Method', category: 'ELECTION_HISTORY', description: 'Filing date, qualifying fee vs petition signatures method, and ballot qualification status', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_historical_ledger', label: 'Full Historical Election Results Ledger', category: 'ELECTION_HISTORY', description: 'Chronological list of all federal, state, and local elections contested and outcomes', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_vote_totals_percentages', label: 'Primary & General Election Vote Totals', category: 'ELECTION_HISTORY', description: 'Raw vote counts, percentage margins, and voter turnout statistics across past races', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_precinct_level_breakdown', label: 'Precinct-Level Spatial Vote Margins', category: 'ELECTION_HISTORY', description: 'Sub-county precinct spatial vote distribution and turnout heatmaps', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_opponent_history', label: 'Opponents Faced & Partisan Margins', category: 'ELECTION_HISTORY', description: 'Names, party affiliations, and vote shares of all major-party and challenger opponents', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_ballot_access_petitions', label: 'Ballot Access Petition Signature Audit', category: 'ELECTION_HISTORY', description: 'Verified petition signatures gathered vs required statutory threshold', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_campaign_slogan_branding', label: 'Official Campaign Slogan & Branding Assets', category: 'ELECTION_HISTORY', description: 'Campaign slogan, primary logo asset, and official domain registration date', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_endorsement_roster', label: 'Major Organizational & Official Endorsements', category: 'ELECTION_HISTORY', description: 'Verified endorsements from labor unions, newspapers, PACs, and elected officials', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_polling_history', label: 'Historical Public Polling Aggregation', category: 'ELECTION_HISTORY', description: 'Public survey results, pollster ratings, and polling averages across campaigns', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_recount_challenge_history', label: 'Recounts, Canvassing Disputes, & Election Contests', category: 'ELECTION_HISTORY', description: 'Mandatory machine/manual recounts, canvassing board disputes, or court contests', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_campaign_committee_structure', label: 'Campaign Committee & Leadership Roster', category: 'ELECTION_HISTORY', description: 'Campaign committee registration, treasurer, office locations, and consultants', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_campaign_ads_creative', label: 'Campaign Advertising Creatives & Message Claims', category: 'ELECTION_HISTORY', description: 'TV, radio, and digital ad creative references, claims made, and ad targets', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_debates_forums_transcripts', label: 'Debates, Forums, & Town Halls Ledger', category: 'ELECTION_HISTORY', description: 'Debates, candidate forums, transcript URLs, and key video timestamps', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_petitions_civic_initiatives', label: 'Citizen Initiative Petitions & Referendums', category: 'ELECTION_HISTORY', description: 'Sponsorship of citizen petition initiatives and constitutional amendments', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_upcoming_cycle_roster', label: 'Upcoming Election Cycle Roster & Deadlines', category: 'ELECTION_HISTORY', description: 'Next scheduled election date, filing windows, and official candidate roster', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_candidate_incumbent_link', label: 'Candidate / Incumbent Entity Link', category: 'ELECTION_HISTORY', description: 'Entity resolution link connecting candidate filing records to incumbent seat records', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_redistricting_impact', label: 'Redistricting Boundary Impact Audit', category: 'ELECTION_HISTORY', description: 'Impact of district boundary shifts on voter composition and candidate eligibility', requiredFor: ALL_OFFICE_TYPES },
  { key: 'election_certification_evidence', label: 'Canvassing Board Official Certification Seal', category: 'ELECTION_HISTORY', description: 'Official Secretary of State / Canvassing Board election results certification seal', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 15, 16: CAMPAIGN FINANCE & OUTSIDE SPENDING (14 fields)
  // ============================================================================
  { key: 'finance_total_raised_spent', label: 'Authoritative Campaign Receipts & Spending', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Total contributions raised, total expenditures, net cash on hand, and total loans', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_itemized_contributions_above_100', label: 'Itemized Individual Contributions >= $100', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Detailed ledger of individual donor names, dates, amounts, employers, and occupations', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_top_donors_pac', label: 'Itemized PAC & Political Committee Transfers', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'List of contributing PACs, Super PACs, party committees, and transfer amounts', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_small_dollar_aggregate', label: 'Unitemized Small-Dollar Aggregate Total', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Cumulative small-dollar unitemized contributions (< $100)', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_self_funding_loans', label: 'Candidate Self-Funding & Personal Loans', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Candidate personal funds contributed, candidate loans, and loan repayment terms', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_outstanding_debts', label: 'Outstanding Campaign Debts & Liabilities', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Unpaid vendor invoices, campaign debt schedules, and loan obligations', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_expenditure_vendors', label: 'Top Vendor Disbursements & Media Spending', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Disbursements to campaign consultants, TV/digital media buyers, and polling firms', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_independent_expenditures_for', label: 'Independent Expenditures Supporting Candidate', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Third-party outside spending (Super PACs, 501c4s) expressly advocating FOR candidate', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_independent_expenditures_against', label: 'Independent Expenditures Opposing Candidate', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Third-party outside spending expressly advocating AGAINST candidate', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_electioneering_communications', label: 'Electioneering Communications Spending', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Broadcast media electioneering spending within statutory election windows', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_refunds_discrepancies', label: 'Contribution Refunds & Election Board Notices', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Excess contribution refunds, reattributions, and audit compliance notices', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_joint_fundraising_transfers', label: 'Joint Fundraising Committee Allocations', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Transfers received from federal or state joint fundraising committees', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_reconciliation_audit', label: 'Mathematical Campaign Finance Reconciliation', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Reconciliation audit matching transaction items to official summary total', requiredFor: ALL_OFFICE_TYPES },
  { key: 'finance_reporting_period_schedules', label: 'Filing Periods & Amendment History Ledger', category: 'CAMPAIGN_FINANCE_ITEMIZED', description: 'Reporting period submission dates, quarterly filings, and amendment logs', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 17, 18, 19, 20, 21, 22, 23, 25: LEGISLATIVE & EXECUTIVE ACTIONS (16 fields)
  // ============================================================================
  { key: 'legislative_roll_call_votes', label: 'Roll-Call Voting Record Ledger', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Complete roll-call voting record on motions, amendments, and final bill passages', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_voting_attendance_pct', label: 'Roll-Call Vote Attendance & Absence Rate', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Percentage of total roll call votes cast vs missed floor votes', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_party_line_alignment', label: 'Party-Line Alignment & Loyalty Percentage', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Percentage of votes cast in alignment with majority party caucus stance', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_bipartisan_voting_index', label: 'Bipartisan Co-Voting Index', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Frequency of voting across party lines on contested roll call votes', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_key_votes_breakdown', label: 'Key Votes on Major Budget & Policy Bills', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Curated votes on major state/federal appropriations, tax reforms, and policy mandates', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_abstentions_recusals', label: 'Abstentions, Recusals, & Conflict Notices', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Formal vote recusals filed due to financial or personal conflicts of interest', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_procedural_motions', label: 'Votes on Procedural & Rules Motions', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Votes on cloture, motion to table, discharge petitions, and floor rules', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_veto_override_votes', label: 'Votes on Executive Veto Overrides', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Roll call votes cast on motions to override gubernatorial or presidential vetoes', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_vote_reconciliation_total', label: 'Roll-Call Vote Reconciliation Audit', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Authoritative session vote total vs ingested roll-call records reconciliation', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_proxy_voting_record', label: 'Proxy / Remote Floor Voting Record', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Usage of proxy voting provisions during legislative emergency sessions', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'legislative_service_sessions', label: 'Legislative Sessions Served & Chamber Roles', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Chamber, district, session numbers, and leadership roles held', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'executive_orders_directives', label: 'Executive Orders & Proclamations Issued', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Executive orders, proclamations, emergency declarations, and administrative directives', requiredFor: EXECUTIVE_OFFICE_TYPES, notApplicableFor: LEGISLATIVE_OFFICE_TYPES },
  { key: 'executive_vetoes_appointments', label: 'Executive Vetoes & Confirmation Nominations', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Bill vetoes, line-item budget vetoes, gubernatorial appointments, and confirmations', requiredFor: EXECUTIVE_OFFICE_TYPES, notApplicableFor: LEGISLATIVE_OFFICE_TYPES },
  { key: 'judicial_opinions_retention_records', label: 'Judicial Opinions Authored & Retention Record', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Court opinions authored, concurrences, dissents, and retention election outcomes', requiredFor: ['JUDICIAL'], notApplicableFor: LEGISLATIVE_OFFICE_TYPES },
  { key: 'local_ordinances_resolutions_votes', label: 'Local Government Ordinances & Zoning Votes', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Municipal/County ordinance sponsorships, land-use votes, and contract approvals', requiredFor: ['COUNTY_COMMISSIONER', 'MUNICIPAL_LEGISLATOR', 'SCHOOL_BOARD'], notApplicableFor: ['FEDERAL_LEGISLATOR', 'STATE_LEGISLATOR'] },
  { key: 'budget_appropriations_tax_votes', label: 'Budget Appropriations, Taxes, & Debt Votes', category: 'LEGISLATIVE_VOTING_RECORD', description: 'Votes on state/local budgets, tax millage rates, bond issuances, and earmarks', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },

  // ============================================================================
  // SECTION 17: BILLS SPONSORED (8 fields)
  // ============================================================================
  { key: 'bills_sponsored_cosponsored', label: 'Prime Sponsored Legislation Index', category: 'BILLS_SPONSORED', description: 'Index of bills where legislator served as Prime / Chief Sponsor', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'bills_cosponsored_count', label: 'Co-Sponsored Legislation Index', category: 'BILLS_SPONSORED', description: 'Complete list of bills where legislator added name as Co-Sponsor', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'bills_enacted_into_law', label: 'Sponsored Bills Enacted Into Statutory Law', category: 'BILLS_SPONSORED', description: 'Prime-sponsored bills successfully passed by legislature and signed into law', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'bills_committee_passed', label: 'Sponsored Bills Reported Out of Committee', category: 'BILLS_SPONSORED', description: 'Sponsored legislation that successfully cleared assigned legislative committees', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'bills_resolutions_memorials', label: 'Sponsored Resolutions & Memorials', category: 'BILLS_SPONSORED', description: 'Non-binding resolutions, constitutional amendment proposals, and congressional memorials', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'bills_policy_category_breakdown', label: 'Sponsorship Policy Taxonomy Mapping', category: 'BILLS_SPONSORED', description: 'Distribution of sponsored bills across major policy topics (Tax, Education, Health)', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'bills_bipartisan_cosponsors', label: 'Cross-Party Co-Sponsorship Rate', category: 'BILLS_SPONSORED', description: 'Percentage of prime-sponsored bills attracting bipartisan co-sponsors', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'bills_reconciliation_total', label: 'Sponsorship Reconciliation Audit', category: 'BILLS_SPONSORED', description: 'Reconciliation of ingested bills against official legislative session docket count', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },

  // ============================================================================
  // SECTION 27, 28: PUBLIC PROMISES & PROMISE-ACTION LINKING (10 fields)
  // ============================================================================
  { key: 'public_promises_commitments', label: 'Extracted Campaign Promises Catalogue', category: 'PUBLIC_PROMISES', description: 'Structured catalog of explicit platform promises and policy commitments', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_source_links', label: 'Promise Deep Source Links & Verbatim Quotes', category: 'PUBLIC_PROMISES', description: 'Primary URLs, audio/video timestamps, and verbatim quotes for every promise', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_status_evaluation', label: '8-State Evaluated Promise Status', category: 'PUBLIC_PROMISES', description: 'Evaluated outcome status (Fulfilled, In Progress, Broken, Compromised, Stuck)', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_policy_topic_map', label: 'Promises Mapped to Policy Taxonomy', category: 'PUBLIC_PROMISES', description: 'Platform commitments indexed to standard civic policy taxonomy', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_signed_pledges', label: 'Signed Coalition & Advocacy Pledges', category: 'PUBLIC_PROMISES', description: 'Formal signed third-party pledge agreements (Taxpayer Protection, Term Limits)', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_target_deadlines', label: 'Stated Target Timelines / 100-Day Plan', category: 'PUBLIC_PROMISES', description: 'Target execution deadlines or 100-day executive agenda promises', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_legislative_action_link', label: 'Legislative / Executive Action Links', category: 'PUBLIC_PROMISES', description: 'Direct link connecting campaign promise to specific bill or executive order', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_revision_history', label: 'Promise Stance Revision & Modification Log', category: 'PUBLIC_PROMISES', description: 'Tracked modifications or reversals of platform promises over time', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_jurisdictional_authority', label: 'Promise Jurisdictional Feasibility Check', category: 'PUBLIC_PROMISES', description: 'Check evaluating whether promise falls under officeholder statutory authority', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },
  { key: 'public_promises_measurability_rating', label: 'Promise Measurability & Specificity Score', category: 'PUBLIC_PROMISES', description: 'Audit evaluating whether promise contains quantifiable metrics or deadlines', requiredFor: ALL_OFFICE_TYPES, notApplicableFor: ['JUDICIAL'] },

  // ============================================================================
  // SECTION 26, 29, 37, 38, 39, 44, 46, 47, 48: STATEMENTS, POSITIONS, & TIMELINE (18 fields)
  // ============================================================================
  { key: 'public_statements_positions', label: 'Policy Positions & Public Statements Archive', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Documented public positions across all major civic policy topics', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_tax_budget', label: 'Tax Policy & State Budget Stance Archive', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Statements and quotes regarding tax rates, state budget priorities, and millage', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_healthcare', label: 'Healthcare & Public Health Stance Archive', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Statements on Medicaid expansion, hospital regulation, and healthcare costs', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_education', label: 'Education & School Choice Stance Archive', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Statements on K-12 funding, school vouchers, university governance, and curriculum', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_public_safety', label: 'Law Enforcement & Public Safety Stance', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Statements regarding police funding, criminal penalties, bail reform, and corrections', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_economy_jobs', label: 'Economic Development & Jobs Policy Stance', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Statements on job creation, regulatory reform, minimum wage, and trade', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_environment_energy', label: 'Environment, Everglades, & Energy Stance', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Statements on Everglades restoration, water quality, energy grid, and coastal resilience', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_press_release_archive', label: 'Official Press Release Archive', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Ingested archive of all official press releases and constituent advisories', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_floor_speeches_transcripts', label: 'Floor Speeches & Hearing Remarks Transcripts', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Transcripts of legislative floor speeches, committee remarks, and press conferences', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_social_media_archive', label: 'Verified Social Media Policy Announcements', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Archived social media posts containing explicit policy position announcements', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_controversies_fact_checks', label: 'Neutral Claim & Fact-Checking Ledger', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Fact-check records and claim verifications (CLAIM / SUPPORTED / CONTRADICTED)', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_media_interview_history', label: 'Major Media Interviews & Briefings Archive', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Transcripts and video archives of major press briefings and media interviews', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_news_current_developments', label: 'News & Current Developments Discovery Feed', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'News reporting discovery items pointing to primary/authoritative sources', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_accountability_timeline', label: 'Unified Chronological Accountability Timeline', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Master chronological timeline connecting public statements, votes, and events', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_policy_evolution_log', label: 'Policy Position Shift & Evolution Log', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Tracked changes in public policy stances over consecutive office terms', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_debate_forum_quotes', label: 'Verbatim Debate & Forum Transcript Quotes', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Excerpted verbatim transcript quotes from public debates and forums', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_town_hall_constituent_responses', label: 'Town Hall & Constituent Meeting Responses', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Official responses and statements recorded during constituent town halls', requiredFor: ALL_OFFICE_TYPES },
  { key: 'public_statements_contextual_verification_seal', label: 'Tier 1-4 Provenance Seal on Quotes', category: 'PUBLIC_STATEMENTS_POSITIONS', description: 'Provenance verification seal validating context and primary link for quotes', requiredFor: ALL_OFFICE_TYPES },

  // ============================================================================
  // SECTION 21, 36: COURT & LEGAL RECORDS RELEVANT TO PUBLIC OFFICE (10 fields)
  // ============================================================================
  { key: 'public_court_legal_records', label: 'Public Court Dockets & Litigation History', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'Civil and criminal public court docket search across county, state, and federal courts', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_civil_litigation_history', label: 'Civil Litigation Docket History', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'Civil lawsuits filed by or against official (preserving Plaintiff vs Defendant roles)', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_criminal_record_audit', label: 'Criminal History & Warrant Audit', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'FDLE, NCIC, and county sheriff arrest warrant and criminal history audit', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_traffic_infraction_dockets', label: 'Traffic & Municipal Citation Ledger', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'County clerk traffic citations and local ordinance enforcement dockets', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_bankruptcy_filings', label: 'Corporate & Personal Bankruptcy Filings', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'U.S. Bankruptcy Court Chapter 7, 11, or 13 dockets and discharge orders', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_bar_standing_discipline', label: 'State Bar Disciplinary Audit', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'Supreme Court and State Bar grievance filings, suspensions, or reprimands', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_appeals_dockets', label: 'Appellate Court Proceedings & Amicus Briefs', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'District Court of Appeal or Supreme Court opinion dockets involving official', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_presumption_innocence_seal', label: 'Presumption of Innocence Status Seal', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'Formal attestation certifying no unproven legal liability or pending unverified charges', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_pacer_federal_dockets', label: 'PACER Federal Docket Search Index', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'Federal district court civil and criminal docket search via PACER', requiredFor: ALL_OFFICE_TYPES },
  { key: 'court_judicial_qualification_evaluations', label: 'Judicial Qualification Evaluations & Recusals', category: 'PUBLIC_COURT_LEGAL_RECORDS', description: 'Bar association judicial ratings, recusal notices, and qualification reviews', requiredFor: ['JUDICIAL'], notApplicableFor: LEGISLATIVE_OFFICE_TYPES },

  // ============================================================================
  // SECTION 24: COMMITTEE ACTIVITY (10 fields)
  // ============================================================================
  { key: 'committee_assignments', label: 'Committee Assignments & Chairmanships', category: 'COMMITTEE_WORK', description: 'Standing, select, and joint legislative or municipal committee memberships', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_chairmanships_leadership', label: 'Committee Leadership & Ranking Member Roles', category: 'COMMITTEE_WORK', description: 'Positions held as Committee Chairman, Vice Chairman, or Ranking Member', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_attendance_rate', label: 'Committee Hearing Attendance Record', category: 'COMMITTEE_WORK', description: 'Roll call attendance rate during scheduled committee meetings and markups', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_hearings_conducted', label: 'Public Hearings & Oversight Meetings Chaired', category: 'COMMITTEE_WORK', description: 'List of public oversight hearings, workshops, and markups led by official', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_witness_questioning', label: 'Key Witness Questioning Transcripts', category: 'COMMITTEE_WORK', description: 'Transcripts and video timestamps of witness questioning during committee hearings', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_reports_authored', label: 'Committee Reports & Investigations Authored', category: 'COMMITTEE_WORK', description: 'Official committee staff reports, oversight findings, and recommendations published', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_budget_jurisdiction', label: 'Appropriations Jurisdiction Budget Total', category: 'COMMITTEE_WORK', description: 'Total state/county budget allocation under direct committee oversight jurisdiction', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_reconciliation_total', label: 'Committee Membership Reconciliation Audit', category: 'COMMITTEE_WORK', description: 'Reconciliation of ingested committee roles against official legislative directory', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_subcommittee_memberships', label: 'Subcommittee Roster & Taskforce Roles', category: 'COMMITTEE_WORK', description: 'Subcommittee memberships, special taskforce assignments, and working groups', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },
  { key: 'committee_investigative_subpoenas', label: 'Committee Subpoenas & Oversight Mandates', category: 'COMMITTEE_WORK', description: 'Investigative subpoenas, agency audits, and formal oversight requests issued', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['JUDICIAL', 'SHERIFF'] },

  // ============================================================================
  // SECTION 4, 53: GEOSPATIAL & DISTRICT BOUNDARIES (12 fields)
  // ============================================================================
  { key: 'geospatial_district_boundary', label: 'District Boundary GeoJSON Polygon', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Validated boundary map geometry polygon file and SHA-256 spatial hash', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_total_population', label: 'District Total Census Population', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Official U.S. Census total population count for the district', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_voter_demographics', label: 'Registered Voter Party & Demographic Breakdown', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Division of Elections registered voters breakdown by party registration', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_county_coverage', label: 'Counties Included in District Jurisdiction', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'List of all counties fully or partially encompassed by district boundaries', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_municipality_coverage', label: 'Municipalities Within District Boundaries', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'List of cities, towns, and unincorporated census designated places in district', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_centroid_coordinates', label: 'District Geographic Centroid Coordinates', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Latitude and Longitude centroid point of district boundary polygon', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_census_tiger_link', label: 'Official Census TIGER/Line Shapefile Link', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Direct link to U.S. Census Bureau shapefile archive', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_redistricting_history', label: 'Post-2020 Redistricting Revision Record', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Redistricting enactment date, court litigation status, and map approval docket', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_precinct_boundaries', label: 'County Voting Precinct Boundary Polygons', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'County Supervisor of Elections voting precinct GIS polygon layers', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_address_resolution_chain', label: 'Full Address Resolution Chain Mapping', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'GIS geocoding spatial chain linking physical street address to exact district seats', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_district_renumbering_log', label: 'District Renumbering & Boundary Shift Log', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Historical record of district renumbering and boundary territory shifts', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] },
  { key: 'geospatial_gis_verification_seal', label: 'GIS Boundary SHA-256 Spatial Hash Seal', category: 'GEOSPATIAL_DISTRICT_INFO', description: 'Cryptographic SHA-256 spatial verification seal on district GeoJSON boundaries', requiredFor: LEGISLATIVE_OFFICE_TYPES, notApplicableFor: ['EXECUTIVE', 'COUNTY_EXECUTIVE', 'MUNICIPAL_EXECUTIVE', 'JUDICIAL', 'SHERIFF'] }
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
