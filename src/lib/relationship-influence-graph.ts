/**
 * ORGANIZATION & RELATIONSHIP SOURCE DISCOVERY & PROMISE HARVESTING
 * 
 * Maps campaign committees, donors, PACs, lobbying registrations, corporate filings,
 * and extracts documented commitments/promises without inferring motive or judging fulfillment.
 */

export interface CivicRelationship {
  relationship_id: string;
  source_person_or_org_key: string;
  target_person_or_org_key: string;
  relationship_type: 
    | 'CAMPAIGN_TREASURER_OF'
    | 'REGISTERED_LOBBYIST_FOR'
    | 'DONOR_COMMITTEE_CONTRIBUTION'
    | 'CHAIR_OF_COMMITTEE'
    | 'DIRECTOR_OF_CORPORATION'
    | 'DISCLOSED_FINANCIAL_ASSET_HELD'
    | 'OFFICIAL_APPOINTMENT_TO';
  evidence_source_url: string;
  evidence_hash: string;
  filing_date: string;
  details: Record<string, any>;
  extraction_status: 'extracted_unreviewed';
}

export interface CandidateDocumentedPromise {
  promise_id: string;
  candidate_person_key: string;
  campaign_key: string;
  applicable_seat_key: string;
  issue_domain: 'HEALTHCARE' | 'EDUCATION' | 'HOUSING_INSURANCE' | 'INFRASTRUCTURE' | 'CRIME_SAFETY' | 'TAX_FISCAL';
  statement_verbatim: string;
  qualifying_context: string;
  source_page_url: string;
  retrieved_at: string;
  evidence_snapshot_path: string;
  evidence_hash: string;
  canonical_fulfillment_judgment: 'UNREVIEWED_RAW_RECORD'; // Harvester does not judge fulfillment
  extraction_status: 'extracted_unreviewed';
}

export const SAMPLE_DISCOVERED_RELATIONSHIPS: CivicRelationship[] = [
  {
    relationship_id: "rel_sharief_campaign_comm",
    source_person_or_org_key: "person_fl_senator_barbara_sharief",
    target_person_or_org_key: "org_sharief_campaign_committee_2026",
    relationship_type: "CHAIR_OF_COMMITTEE",
    evidence_source_url: "https://dos.elections.myflorida.com/candidates/canlist.asp",
    evidence_hash: "a3f5b7c891e234567890abcdef1234567890abcdef1234567890abcdef123456",
    filing_date: "2024-11-06",
    details: {
      committee_name: "Barbara Sharief Campaign Committee",
      treasurer_name: "Barbara Sharief",
      bank_depository: "Bank of America, Miramar FL"
    },
    extraction_status: "extracted_unreviewed"
  },
  {
    relationship_id: "rel_sharief_health_committee",
    source_person_or_org_key: "person_fl_senator_barbara_sharief",
    target_person_or_org_key: "org_fl_senate_health_policy_comm",
    relationship_type: "OFFICIAL_APPOINTMENT_TO",
    evidence_source_url: "https://flsenate.gov/Committees/Show/HP",
    evidence_hash: "c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef01234567",
    filing_date: "2024-11-20",
    details: {
      role: "Member",
      appointing_authority: "Florida Senate President"
    },
    extraction_status: "extracted_unreviewed"
  }
];

export const SAMPLE_DOCUMENTED_PROMISES: CandidateDocumentedPromise[] = [
  {
    promise_id: "prom_sharief_insurance_reform",
    candidate_person_key: "person_fl_senator_barbara_sharief",
    campaign_key: "election_fl_senate_35_2026",
    applicable_seat_key: "seat_fl_senate_35",
    issue_domain: "HOUSING_INSURANCE",
    statement_verbatim: "Sponsor legislative remedies to lower property insurance premiums and expand Citizens Property Insurance coverage caps for South Florida homeowners.",
    qualifying_context: "Official 2024-2026 legislative platform priorities published on official campaign issues section",
    source_page_url: "https://barbarasharief.com/issues/",
    retrieved_at: "2026-09-07T12:00:00Z",
    evidence_snapshot_path: "data/snapshots/sharief_platform_issues.html",
    evidence_hash: "d4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef0",
    canonical_fulfillment_judgment: "UNREVIEWED_RAW_RECORD",
    extraction_status: "extracted_unreviewed"
  },
  {
    promise_id: "prom_desantis_budget_surplus",
    candidate_person_key: "person_ron_desantis",
    campaign_key: "election_fl_governor_2022",
    applicable_seat_key: "seat_fl_governor",
    issue_domain: "TAX_FISCAL",
    statement_verbatim: "Maintain state budget reserves of at least $10 billion and deliver recurring toll relief to Florida commuters.",
    qualifying_context: "Gubernatorial budget recommendation message and executive action agenda",
    source_page_url: "https://www.flgov.com/governor-ron-desantis-priorities/",
    retrieved_at: "2026-09-07T12:00:00Z",
    evidence_snapshot_path: "data/snapshots/desantis_priorities.html",
    evidence_hash: "e5f6a1b2c3d47890123456789abcdef0123456789abcdef0123456789abcdef0",
    canonical_fulfillment_judgment: "UNREVIEWED_RAW_RECORD",
    extraction_status: "extracted_unreviewed"
  }
];
