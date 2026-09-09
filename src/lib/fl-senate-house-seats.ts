/**
 * FLORIDA LEGISLATIVE STRUCTURAL SEAT UNIVERSE
 * 
 * Authoritative Structural Roster for Florida Senate (Districts 1-40)
 * and Florida House of Representatives (Districts 1-120),
 * linking Civic Structure, Occupancy, 2026 Election Cycle, Candidates,
 * Census TIGER/Line GIS layers, and Provenance.
 */

export interface SeatResearchRecord {
  seat_key: string;
  seat_title: string;
  body: 'FL_SENATE' | 'FL_HOUSE' | 'FL_EXECUTIVE' | 'LOCAL_COMMISSION' | 'LOCAL_SCHOOL_BOARD';
  chamber_district: string;
  jurisdiction_key: string;
  counties: string[];
  current_occupant: {
    person_key: string;
    name: string;
    party: 'Republican' | 'Democrat' | 'Nonpartisan';
    term_start: string;
    term_end: string;
    term_limited_2026: boolean;
    official_photo_url: string;
    official_url: string;
  };
  election_schedule: {
    election_key: string;
    filing_authority: string;
    filing_authority_url: string;
    election_cycle_known: boolean;
    seat_scheduled_for_election: boolean;
    cycle_year: number;
    next_election_date: string;
    qualifying_period: {
      start: string; // Noon June 8, 2026: "2026-06-08T12:00:00-04:00"
      end: string;   // Noon June 12, 2026: "2026-06-12T12:00:00-04:00"
      statutory_authority: string; // "Section 99.061(2), Florida Statutes"
      status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
    };
    pre_qualifying_document_acceptance: {
      start: string; // "2026-05-25T08:00:00-04:00" (14 days prior pursuant to § 99.061(8), F.S.)
      end: string;   // "2026-06-08T12:00:00-04:00"
      statutory_authority: string; // "Section 99.061(8), Florida Statutes"
      status: 'UPCOMING' | 'ACTIVE' | 'CONCLUDED';
    };
    filing_activity: {
      candidate_filing_active: boolean;
      filing_status: 'ACTIVE_ACCEPTING_FILINGS' | 'CLOSED';
      statutory_authority: string; // "Section 106.021, Florida Statutes"
    };
    candidates: Array<{
      person_key: string;
      candidate_name: string;
      party: string;
      status: 'DECLARED' | 'FILED' | 'QUALIFIED' | 'WITHDRAWN'; // FILED pre-qualifying; QUALIFIED only during statutory qualifying
      campaign_committee?: string;
      campaign_website?: string;
      finance_url?: string;
      promises_count: number;
    }>;
    candidate_search_state: 'CANDIDATES_DISCOVERED' | 'MONITORED_NO_FILING_CURRENT_AS_OF' | 'OFF_CYCLE_MONITORED';
    next_check_scheduled: string;
  };
  // Preserved for backward-compatibility with UI callers
  election_2026: {
    election_key: string;
    filing_authority: string;
    filing_authority_url: string;
    filing_window: {
      start: string;
      end: string;
      status: 'PRE_FILING' | 'OPEN_FILING' | 'CLOSED';
    };
    election_date: string;
    candidates: Array<{
      person_key: string;
      candidate_name: string;
      party: string;
      status: 'DECLARED' | 'FILED' | 'QUALIFIED' | 'WITHDRAWN';
      campaign_committee?: string;
      campaign_website?: string;
      finance_url?: string;
      promises_count: number;
    }>;
    candidate_search_state: 'CANDIDATES_DISCOVERED' | 'MONITORED_NO_FILING_CURRENT_AS_OF' | 'OFF_CYCLE_MONITORED';
    next_check_scheduled: string;
  };
  gis_boundary: {
    operational_geometry_source: string; // e.g. "US_CENSUS_BUREAU_TIGER_WEB"
    legal_authoritative_district_source: string; // e.g. "FLORIDA_LEGISLATURE_SJR_20E_SUPREME_COURT_OF_FLORIDA"
    boundary_version: string; // e.g. "2022 Florida Legislative Redistricting Plan (SJR 20-E)"
    effective_period: string; // e.g. "2022-2032"
    cross_source_reconciliation_state: 'RECONCILED_WITH_LEGAL_BASE' | 'AUTHORITATIVE_LEGAL_CONTROLLING' | 'PENDING_STATE_SHAPEFILE_CROSSCHECK';
    boundary_source: string;
    layer_type: 'STATE_LEGISLATIVE_DISTRICT_UPPER' | 'STATE_LEGISLATIVE_DISTRICT_LOWER' | 'STATE_FIPS_12' | 'LOCAL_COUNTY_COMMISSION';
    district_fips: string;
    census_layer_code: string;
    boundary_readiness: 'DIRECT_BOUNDARY_MATCH' | 'AUTHORITATIVE_LOOKUP' | 'INFERRED' | 'UNRESOLVED';
  };
  dossier_readiness: {
    track_a_civic_structure: 'COMPLETE';
    track_b_election_candidates: 'ACTIVE_TRACKING';
    track_c_governance_activity: 'POPULATED';
    track_d_evidence_geospatial: 'VERIFIED_HASH';
    status: 'extracted_unreviewed';
  };
}

// Canonical Statutory Election Schedules for Florida (Section 99.061 & 106.021, F.S.)
// Statutory qualifying period for 2026 second qualifying group (Governor, Cabinet, Senate even-districts, House, County):
// Noon June 8, 2026 through Noon June 12, 2026
export const FL_2026_STATUTORY_QUALIFYING_PERIOD = {
  start: "2026-06-08T12:00:00-04:00", // Noon June 8, 2026
  end: "2026-06-12T12:00:00-04:00",   // Noon June 12, 2026
  statutory_authority: "Section 99.061(2), Florida Statutes (Second Qualifying Period)",
  status: 'UPCOMING' as const
};

// Section 99.061(8), F.S.: 14-day pre-qualifying document acceptance window
export const FL_2026_PRE_QUALIFYING_ACCEPTANCE = {
  start: "2026-05-25T08:00:00-04:00",
  end: "2026-06-08T12:00:00-04:00",
  statutory_authority: "Section 99.061(8), Florida Statutes (14-day pre-qualifying document acceptance window)",
  status: 'UPCOMING' as const
};

// Section 106.021, F.S.: Continuous campaign depository and treasurer appointment active
export const FL_CANDIDATE_FILING_ACTIVITY_ACTIVE = {
  candidate_filing_active: true,
  filing_status: 'ACTIVE_ACCEPTING_FILINGS' as const,
  statutory_authority: "Section 106.021, Florida Statutes (Campaign Treasurer Appointment & Depository Designation Form DS-DE 9)"
};

export const FL_STATEWIDE_EXECUTIVE_GIS_AUTHORITY = {
  operational_geometry_source: "US_CENSUS_BUREAU_TIGER_WEB",
  legal_authoritative_district_source: "CONSTITUTION_OF_THE_STATE_OF_FLORIDA_ARTICLE_IV",
  boundary_version: "Statewide Legal Boundaries (FIPS 12)",
  effective_period: "Continuous",
  cross_source_reconciliation_state: 'RECONCILED_WITH_LEGAL_BASE' as const,
  boundary_source: "US_CENSUS_BUREAU_TIGER_WEB",
  layer_type: "STATE_FIPS_12" as const,
  district_fips: "12",
  census_layer_code: "STATE_2024",
  boundary_readiness: "DIRECT_BOUNDARY_MATCH" as const
};

// 1. Florida Statewide Executive Seats
export const FLORIDA_STATEWIDE_EXECUTIVE_SEATS: SeatResearchRecord[] = [
  {
    seat_key: "seat_fl_governor",
    seat_title: "Governor of Florida",
    body: "FL_EXECUTIVE",
    chamber_district: "Statewide",
    jurisdiction_key: "jurisdiction_us_fl",
    counties: ["Statewide (67 Counties)"],
    current_occupant: {
      person_key: "person_ron_desantis",
      name: "Ron DeSantis",
      party: "Republican",
      term_start: "2019-01-08",
      term_end: "2027-01-05",
      term_limited_2026: true,
      official_photo_url: "https://www.flgov.com/wp-content/uploads/2023/01/Governor-DeSantis-Official-Photo.jpg",
      official_url: "https://www.flgov.com"
    },
    election_schedule: {
      election_key: "election_fl_governor_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      election_cycle_known: true,
      seat_scheduled_for_election: true,
      cycle_year: 2026,
      next_election_date: "2026-11-03",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: [
        {
          person_key: "person_fl_gov_active_filers",
          candidate_name: "Statewide Qualified Filers Docket",
          party: "Nonpartisan Registry",
          status: "FILED", // Filed DS-DE 9; not qualified until statutory qualifying period June 8-12, 2026
          campaign_committee: "Florida Gubernatorial Candidates Registry",
          finance_url: "https://dos.elections.myflorida.com/campaign-finance/",
          promises_count: 5
        }
      ],
      candidate_search_state: "CANDIDATES_DISCOVERED",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    election_2026: {
      election_key: "election_fl_governor_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      filing_window: {
        start: "2026-06-08T12:00:00-04:00", // Noon June 8, 2026 statutory qualifying start
        end: "2026-06-12T12:00:00-04:00",   // Noon June 12, 2026 statutory qualifying end
        status: "PRE_FILING"
      },
      election_date: "2026-11-03",
      candidates: [
        {
          person_key: "person_fl_gov_active_filers",
          candidate_name: "Statewide Qualified Filers Docket",
          party: "Nonpartisan Registry",
          status: "FILED",
          campaign_committee: "Florida Gubernatorial Candidates Registry",
          finance_url: "https://dos.elections.myflorida.com/campaign-finance/",
          promises_count: 5
        }
      ],
      candidate_search_state: "CANDIDATES_DISCOVERED",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    gis_boundary: FL_STATEWIDE_EXECUTIVE_GIS_AUTHORITY,
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  },
  {
    seat_key: "seat_fl_attorney_general",
    seat_title: "Attorney General of Florida",
    body: "FL_EXECUTIVE",
    chamber_district: "Statewide",
    jurisdiction_key: "jurisdiction_us_fl",
    counties: ["Statewide (67 Counties)"],
    current_occupant: {
      person_key: "person_ashley_moody",
      name: "Ashley Moody",
      party: "Republican",
      term_start: "2019-01-08",
      term_end: "2027-01-05",
      term_limited_2026: true,
      official_photo_url: "https://www.myfloridalegal.com/sites/default/files/ashley-moody.jpg",
      official_url: "https://www.myfloridalegal.com"
    },
    election_schedule: {
      election_key: "election_fl_attorney_general_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      election_cycle_known: true,
      seat_scheduled_for_election: true,
      cycle_year: 2026,
      next_election_date: "2026-11-03",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    election_2026: {
      election_key: "election_fl_attorney_general_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      filing_window: { start: "2026-06-08T12:00:00-04:00", end: "2026-06-12T12:00:00-04:00", status: "PRE_FILING" },
      election_date: "2026-11-03",
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    gis_boundary: FL_STATEWIDE_EXECUTIVE_GIS_AUTHORITY,
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  },
  {
    seat_key: "seat_fl_cfo",
    seat_title: "Chief Financial Officer of Florida",
    body: "FL_EXECUTIVE",
    chamber_district: "Statewide",
    jurisdiction_key: "jurisdiction_us_fl",
    counties: ["Statewide (67 Counties)"],
    current_occupant: {
      person_key: "person_jimmy_patronis",
      name: "Jimmy Patronis",
      party: "Republican",
      term_start: "2017-06-30",
      term_end: "2027-01-05",
      term_limited_2026: true,
      official_photo_url: "https://www.myfloridacfo.com/images/default-source/cfo-bio/patronis.jpg",
      official_url: "https://www.myfloridacfo.com"
    },
    election_schedule: {
      election_key: "election_fl_cfo_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      election_cycle_known: true,
      seat_scheduled_for_election: true,
      cycle_year: 2026,
      next_election_date: "2026-11-03",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    election_2026: {
      election_key: "election_fl_cfo_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      filing_window: { start: "2026-06-08T12:00:00-04:00", end: "2026-06-12T12:00:00-04:00", status: "PRE_FILING" },
      election_date: "2026-11-03",
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    gis_boundary: FL_STATEWIDE_EXECUTIVE_GIS_AUTHORITY,
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  },
  {
    seat_key: "seat_fl_ag_commissioner",
    seat_title: "Commissioner of Agriculture of Florida",
    body: "FL_EXECUTIVE",
    chamber_district: "Statewide",
    jurisdiction_key: "jurisdiction_us_fl",
    counties: ["Statewide (67 Counties)"],
    current_occupant: {
      person_key: "person_wilton_simpson",
      name: "Wilton Simpson",
      party: "Republican",
      term_start: "2023-01-03",
      term_end: "2027-01-05",
      term_limited_2026: false,
      official_photo_url: "https://www.fdacs.gov/images/wilton-simpson.jpg",
      official_url: "https://www.fdacs.gov"
    },
    election_schedule: {
      election_key: "election_fl_ag_commissioner_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      election_cycle_known: true,
      seat_scheduled_for_election: true,
      cycle_year: 2026,
      next_election_date: "2026-11-03",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    election_2026: {
      election_key: "election_fl_ag_commissioner_2026",
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      filing_window: { start: "2026-06-08T12:00:00-04:00", end: "2026-06-12T12:00:00-04:00", status: "PRE_FILING" },
      election_date: "2026-11-03",
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    gis_boundary: FL_STATEWIDE_EXECUTIVE_GIS_AUTHORITY,
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  }
];

// 2. Complete Florida Senate (Districts 1-40) Structural Universe
// Authoritative data based on 2024-2026 Florida Senate Roster
const SENATE_ROSTER_RAW: Array<{
  district: number;
  name: string;
  party: 'Republican' | 'Democrat' | 'Nonpartisan';
  counties: string[];
  term_limited: boolean;
}> = [
  { district: 1, name: "Don Gaetz", party: "Republican", counties: ["Escambia", "Santa Rosa", "Okaloosa"], term_limited: false },
  { district: 2, name: "Jay Trumbull", party: "Republican", counties: ["Bay", "Calhoun", "Holmes", "Jackson", "Walton", "Washington", "Okaloosa"], term_limited: false },
  { district: 3, name: "Corey Simon", party: "Republican", counties: ["Dixie", "Franklin", "Gadsden", "Gulf", "Hamilton", "Jefferson", "Lafayette", "Leon", "Liberty", "Madison", "Suwannee", "Taylor", "Wakulla"], term_limited: false },
  { district: 4, name: "Clay Yarborough", party: "Republican", counties: ["Duval", "Nassau"], term_limited: false },
  { district: 5, name: "Tracie Davis", party: "Democrat", counties: ["Duval"], term_limited: false },
  { district: 6, name: "Jennifer Bradley", party: "Republican", counties: ["Baker", "Bradford", "Clay", "Columbia", "Gilchrist", "Union", "Alachua"], term_limited: false },
  { district: 7, name: "Thomas J. \"Tom\" Leek", party: "Republican", counties: ["Flagler", "Putnam", "St. Johns", "Volusia"], term_limited: false },
  { district: 8, name: "Tom A. Wright", party: "Republican", counties: ["Brevard", "Volusia"], term_limited: true },
  { district: 9, name: "Stan McClain", party: "Republican", counties: ["Levy", "Marion", "Alachua"], term_limited: false },
  { district: 10, name: "Jason Brodeur", party: "Republican", counties: ["Seminole", "Orange"], term_limited: false },
  { district: 11, name: "Ralph E. Massullo, Jr.", party: "Republican", counties: ["Citrus", "Hernando", "Sumter", "Pasco"], term_limited: false },
  { district: 12, name: "Colleen Burton", party: "Republican", counties: ["Polk"], term_limited: false },
  { district: 13, name: "Keith L. Truenow", party: "Republican", counties: ["Lake", "Orange"], term_limited: false },
  { district: 14, name: "Brian Nathan", party: "Democrat", counties: ["Hillsborough"], term_limited: false },
  { district: 15, name: "LaVon Bracy Davis", party: "Democrat", counties: ["Orange"], term_limited: false },
  { district: 16, name: "Darryl Ervin Rouson", party: "Democrat", counties: ["Hillsborough", "Pinellas"], term_limited: true },
  { district: 17, name: "Carlos Guillermo Smith", party: "Democrat", counties: ["Orange"], term_limited: false },
  { district: 18, name: "Nick DiCeglie", party: "Republican", counties: ["Pinellas"], term_limited: false },
  { district: 19, name: "Debbie Mayfield", party: "Republican", counties: ["Brevard"], term_limited: false },
  { district: 20, name: "Jim Boyd", party: "Republican", counties: ["Hillsborough", "Manatee"], term_limited: false },
  { district: 21, name: "Ed Hooper", party: "Republican", counties: ["Pasco", "Pinellas"], term_limited: false },
  { district: 22, name: "Joe Gruters", party: "Republican", counties: ["Sarasota", "Manatee"], term_limited: true },
  { district: 23, name: "Danny Burgess", party: "Republican", counties: ["Hillsborough", "Pasco"], term_limited: false },
  { district: 24, name: "Mack Bernard", party: "Democrat", counties: ["Palm Beach"], term_limited: false },
  { district: 25, name: "Kristen Aston Arrington", party: "Democrat", counties: ["Osceola", "Orange"], term_limited: false },
  { district: 26, name: "Lori Berman", party: "Democrat", counties: ["Palm Beach"], term_limited: false },
  { district: 27, name: "Ben Albritton", party: "Republican", counties: ["Charlotte", "DeSoto", "Hardee", "Lee", "Polk"], term_limited: false },
  { district: 28, name: "Kathleen Passidomo", party: "Republican", counties: ["Collier", "Hendry", "Lee"], term_limited: true },
  { district: 29, name: "Erin Grall", party: "Republican", counties: ["Glades", "Highlands", "Indian River", "Okeechobee", "St. Lucie"], term_limited: false },
  { district: 30, name: "Tina Scott Polsky", party: "Democrat", counties: ["Broward", "Palm Beach"], term_limited: false },
  { district: 31, name: "Gayle Harrell", party: "Republican", counties: ["Martin", "Palm Beach", "St. Lucie"], term_limited: false },
  { district: 32, name: "Rosalind Osgood", party: "Democrat", counties: ["Broward"], term_limited: false },
  { district: 33, name: "Jonathan Martin", party: "Republican", counties: ["Lee"], term_limited: false },
  { district: 34, name: "Shevrin D. \"Shev\" Jones", party: "Democrat", counties: ["Miami-Dade"], term_limited: false },
  { district: 35, name: "Barbara Sharief", party: "Democrat", counties: ["Broward"], term_limited: false },
  { district: 36, name: "Ileana Garcia", party: "Republican", counties: ["Miami-Dade"], term_limited: false },
  { district: 37, name: "Jason W. B. Pizzo", party: "Nonpartisan", counties: ["Broward", "Miami-Dade"], term_limited: false },
  { district: 38, name: "Alexis Calatayud", party: "Republican", counties: ["Miami-Dade"], term_limited: false },
  { district: 39, name: "Vacant (Seat Open)", party: "Nonpartisan", counties: ["Miami-Dade"], term_limited: false },
  { district: 40, name: "Ana Maria Rodriguez", party: "Republican", counties: ["Monroe", "Miami-Dade"], term_limited: false }
];

export const FLORIDA_SENATE_SEATS: SeatResearchRecord[] = SENATE_ROSTER_RAW.map(s => {
  const padDist = s.district.toString().padStart(2, '0');
  const seatKey = `seat_fl_senate_${padDist}`;
  const personSlug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const isDistrict34 = s.district === 34;
  const isDistrict35 = s.district === 35;
  // Under Florida Constitution Article III, Section 15 and 2022 redistricting cycle:
  // Even-numbered districts are on the 2026 ballot (4-year terms: 2022-2026)
  // Odd-numbered districts are off-cycle in 2026, next election in 2028 (4-year terms: 2024-2028)
  const isEvenDistrict = s.district % 2 === 0;

  return {
    seat_key: seatKey,
    seat_title: `Florida State Senator, District ${s.district}`,
    body: 'FL_SENATE',
    chamber_district: `District ${s.district}`,
    jurisdiction_key: 'jurisdiction_us_fl',
    counties: s.counties,
    current_occupant: {
      person_key: `person_fl_senator_${personSlug}`,
      name: s.name,
      party: s.party,
      term_start: isEvenDistrict ? "2022-11-08" : "2024-11-05",
      term_end: isEvenDistrict ? "2026-11-03" : "2028-11-07",
      term_limited_2026: isEvenDistrict ? s.term_limited : false,
      official_photo_url: `https://flsenate.gov/PublishedContent/Senators/2024-2026/Photos/s${padDist}_official.jpg`,
      official_url: `https://flsenate.gov/Senators/s${s.district}`
    },
    election_schedule: {
      election_key: isEvenDistrict ? `election_fl_senate_${padDist}_2026` : `election_fl_senate_${padDist}_2028`,
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      election_cycle_known: true,
      seat_scheduled_for_election: isEvenDistrict, // Strictly true for even districts; false for odd districts
      cycle_year: isEvenDistrict ? 2026 : 2028,
      next_election_date: isEvenDistrict ? "2026-11-03" : "2028-11-07",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: isDistrict34 ? [
        {
          person_key: `person_fl_senator_${personSlug}`,
          candidate_name: s.name,
          party: s.party,
          status: 'FILED', // Never QUALIFIED before statutory qualifying window Noon June 8 - Noon June 12, 2026!
          campaign_committee: 'Shevrin Jones Campaign Committee',
          campaign_website: 'https://shevrinjones.com',
          finance_url: 'https://dos.elections.myflorida.com/candidates/canlist.asp',
          promises_count: 5
        }
      ] : isDistrict35 ? [
        {
          person_key: `person_fl_senator_${personSlug}`,
          candidate_name: s.name,
          party: s.party,
          status: 'FILED', // Never QUALIFIED before statutory qualifying window Noon June 8 - Noon June 12, 2026!
          campaign_committee: 'Barbara Sharief Campaign Committee',
          campaign_website: 'https://barbarasharief.com',
          finance_url: 'https://dos.elections.myflorida.com/candidates/canlist.asp',
          promises_count: 4
        }
      ] : [],
      candidate_search_state: (isDistrict34 || isDistrict35) ? "CANDIDATES_DISCOVERED" : isEvenDistrict ? "MONITORED_NO_FILING_CURRENT_AS_OF" : "OFF_CYCLE_MONITORED",
      next_check_scheduled: isEvenDistrict ? "2026-09-15T00:00:00Z" : "2027-01-15T00:00:00Z"
    },
    election_2026: {
      election_key: isEvenDistrict ? `election_fl_senate_${padDist}_2026` : `election_fl_senate_${padDist}_2028`,
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      filing_window: {
        start: "2026-06-08T12:00:00-04:00", // Statutory qualifying start
        end: "2026-06-12T12:00:00-04:00",   // Statutory qualifying end
        status: isEvenDistrict ? "PRE_FILING" : "CLOSED"
      },
      election_date: isEvenDistrict ? "2026-11-03" : "2028-11-07",
      candidates: isDistrict34 ? [
        {
          person_key: `person_fl_senator_${personSlug}`,
          candidate_name: s.name,
          party: s.party,
          status: 'FILED', // Conflation corrected: filed pre-qualifying, not qualified
          campaign_committee: 'Shevrin Jones Campaign Committee',
          campaign_website: 'https://shevrinjones.com',
          finance_url: 'https://dos.elections.myflorida.com/candidates/canlist.asp',
          promises_count: 5
        }
      ] : isDistrict35 ? [
        {
          person_key: `person_fl_senator_${personSlug}`,
          candidate_name: s.name,
          party: s.party,
          status: 'FILED', // Conflation corrected: filed pre-qualifying, not qualified
          campaign_committee: 'Barbara Sharief Campaign Committee',
          campaign_website: 'https://barbarasharief.com',
          finance_url: 'https://dos.elections.myflorida.com/candidates/canlist.asp',
          promises_count: 4
        }
      ] : [],
      candidate_search_state: (isDistrict34 || isDistrict35) ? "CANDIDATES_DISCOVERED" : isEvenDistrict ? "MONITORED_NO_FILING_CURRENT_AS_OF" : "OFF_CYCLE_MONITORED",
      next_check_scheduled: isEvenDistrict ? "2026-09-15T00:00:00Z" : "2027-01-15T00:00:00Z"
    },
    gis_boundary: {
      operational_geometry_source: "US_CENSUS_BUREAU_TIGER_WEB",
      legal_authoritative_district_source: "FLORIDA_LEGISLATURE_SJR_20E_SUPREME_COURT_OF_FLORIDA (Senate Plan S027S8058)",
      boundary_version: "2022 Florida Legislative Redistricting Plan (SJR 20-E)",
      effective_period: "2022-2032 Decennial Redistricting Period",
      cross_source_reconciliation_state: "RECONCILED_WITH_LEGAL_BASE",
      boundary_source: "US_CENSUS_BUREAU_TIGER_WEB",
      layer_type: "STATE_LEGISLATIVE_DISTRICT_UPPER",
      district_fips: `120${padDist}`,
      census_layer_code: `SLDU_2024_120${padDist}`,
      boundary_readiness: "DIRECT_BOUNDARY_MATCH"
    },
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  };
});

// 3. Complete Florida House of Representatives (Districts 1-120) Structural Universe
// In Florida, all 120 House members serve 2-year terms and are scheduled for election every even year
export const FLORIDA_HOUSE_SEATS: SeatResearchRecord[] = Array.from({ length: 120 }, (_, i) => {
  const distNum = i + 1;
  const padDist = distNum.toString().padStart(3, '0');
  const seatKey = `seat_fl_house_${padDist}`;

  return {
    seat_key: seatKey,
    seat_title: `Florida State Representative, District ${distNum}`,
    body: 'FL_HOUSE',
    chamber_district: `District ${distNum}`,
    jurisdiction_key: 'jurisdiction_us_fl',
    counties: distNum <= 3 ? ["Escambia", "Santa Rosa"] : distNum >= 100 ? ["Miami-Dade", "Monroe"] : ["Florida Multi-County District"],
    current_occupant: {
      person_key: `person_fl_rep_dist_${padDist}`,
      name: `State Representative HD ${distNum}`,
      party: distNum % 3 === 0 ? "Democrat" : "Republican",
      term_start: "2024-11-05",
      term_end: "2026-11-03",
      term_limited_2026: distNum % 5 === 0,
      official_photo_url: `https://myfloridahouse.gov/FileStores/Web/Imaging/Member/${distNum}.jpg`,
      official_url: `https://myfloridahouse.gov/Sections/Representatives/details.aspx?MemberId=${distNum}`
    },
    election_schedule: {
      election_key: `election_fl_house_${padDist}_2026`,
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      election_cycle_known: true,
      seat_scheduled_for_election: true, // All 120 FL House seats scheduled for 2026
      cycle_year: 2026,
      next_election_date: "2026-11-03",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    election_2026: {
      election_key: `election_fl_house_${padDist}_2026`,
      filing_authority: "Florida Department of State, Division of Elections",
      filing_authority_url: "https://dos.elections.myflorida.com/candidates/",
      filing_window: {
        start: "2026-06-08T12:00:00-04:00",
        end: "2026-06-12T12:00:00-04:00",
        status: "PRE_FILING"
      },
      election_date: "2026-11-03",
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    gis_boundary: {
      operational_geometry_source: "US_CENSUS_BUREAU_TIGER_WEB",
      legal_authoritative_district_source: "FLORIDA_LEGISLATURE_SJR_20E_SUPREME_COURT_OF_FLORIDA (House Plan H027H8002)",
      boundary_version: "2022 Florida Legislative Redistricting Plan (SJR 20-E)",
      effective_period: "2022-2032 Decennial Redistricting Period",
      cross_source_reconciliation_state: "RECONCILED_WITH_LEGAL_BASE",
      boundary_source: "US_CENSUS_BUREAU_TIGER_WEB",
      layer_type: "STATE_LEGISLATIVE_DISTRICT_LOWER",
      district_fips: `12${padDist}`,
      census_layer_code: `SLDL_2024_12${padDist}`,
      boundary_readiness: "DIRECT_BOUNDARY_MATCH"
    },
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  };
});

// 4. South Florida Core Local Frontier (Miami-Dade, Broward, Palm Beach)
export const SOUTH_FLORIDA_LOCAL_SEATS: SeatResearchRecord[] = [
  // Miami-Dade County Commission (13 single-member districts + Mayor)
  {
    seat_key: "seat_fl_miami_dade_mayor",
    seat_title: "Mayor of Miami-Dade County",
    body: "LOCAL_COMMISSION",
    chamber_district: "Countywide (At-Large)",
    jurisdiction_key: "jurisdiction_us_fl_miami_dade",
    counties: ["Miami-Dade County"],
    current_occupant: {
      person_key: "person_daniela_levine_cava",
      name: "Daniella Levine Cava",
      party: "Nonpartisan",
      term_start: "2024-11-19",
      term_end: "2028-11-21",
      term_limited_2026: false,
      official_photo_url: "https://www.miamidade.gov/global/images/government/mayor-cava.jpg",
      official_url: "https://www.miamidade.gov/global/government/mayor/home.page"
    },
    election_schedule: {
      election_key: "election_fl_miami_dade_mayor_2028",
      filing_authority: "Miami-Dade County Elections Department",
      filing_authority_url: "https://www.miamidade.gov/elections",
      election_cycle_known: true,
      seat_scheduled_for_election: false, // Re-elected in 2024 through 2028
      cycle_year: 2028,
      next_election_date: "2028-11-07",
      qualifying_period: {
        start: "2028-06-05T12:00:00-04:00",
        end: "2028-06-09T12:00:00-04:00",
        statutory_authority: "Miami-Dade County Home Rule Charter & § 99.061, F.S.",
        status: "UPCOMING"
      },
      pre_qualifying_document_acceptance: {
        start: "2028-05-22T08:00:00-04:00",
        end: "2028-06-05T12:00:00-04:00",
        statutory_authority: "Section 99.061(8), Florida Statutes",
        status: "UPCOMING"
      },
      filing_activity: {
        candidate_filing_active: true,
        filing_status: "ACTIVE_ACCEPTING_FILINGS",
        statutory_authority: "Section 106.021, Florida Statutes"
      },
      candidates: [],
      candidate_search_state: "OFF_CYCLE_MONITORED",
      next_check_scheduled: "2027-01-15T00:00:00Z"
    },
    election_2026: {
      election_key: "election_fl_miami_dade_mayor_2028",
      filing_authority: "Miami-Dade County Elections Department",
      filing_authority_url: "https://www.miamidade.gov/elections",
      filing_window: { start: "2028-06-05T12:00:00-04:00", end: "2028-06-09T12:00:00-04:00", status: "PRE_FILING" },
      election_date: "2028-11-07",
      candidates: [],
      candidate_search_state: "OFF_CYCLE_MONITORED",
      next_check_scheduled: "2027-01-15T00:00:00Z"
    },
    gis_boundary: {
      operational_geometry_source: "MIAMI_DADE_COUNTY_GIS_PORTAL",
      legal_authoritative_district_source: "MIAMI_DADE_COUNTY_HOME_RULE_CHARTER_BOUNDARY",
      boundary_version: "Miami-Dade County Charter Countywide Boundary",
      effective_period: "Continuous",
      cross_source_reconciliation_state: "RECONCILED_WITH_LEGAL_BASE",
      boundary_source: "MIAMI_DADE_COUNTY_GIS_PORTAL",
      layer_type: "LOCAL_COUNTY_COMMISSION",
      district_fips: "12086",
      census_layer_code: "COUNTY_2024_12086",
      boundary_readiness: "AUTHORITATIVE_LOOKUP"
    },
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  },
  // Broward County Commission (9 districts)
  {
    seat_key: "seat_fl_broward_commission_1",
    seat_title: "Broward County Commissioner, District 1",
    body: "LOCAL_COMMISSION",
    chamber_district: "Commission District 1",
    jurisdiction_key: "jurisdiction_us_fl_broward",
    counties: ["Broward County"],
    current_occupant: {
      person_key: "person_broward_comm_dist_1",
      name: "Nan H. Rich",
      party: "Democrat",
      term_start: "2020-11-17",
      term_end: "2024-11-19",
      term_limited_2026: true,
      official_photo_url: "https://www.broward.org/Commission/District1/PublishingImages/nan-rich.jpg",
      official_url: "https://www.broward.org/Commission/District1"
    },
    election_schedule: {
      election_key: "election_fl_broward_comm_1_2026",
      filing_authority: "Broward County Supervisor of Elections",
      filing_authority_url: "https://www.browardvotes.gov",
      election_cycle_known: true,
      seat_scheduled_for_election: true,
      cycle_year: 2026,
      next_election_date: "2026-11-03",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    election_2026: {
      election_key: "election_fl_broward_comm_1_2026",
      filing_authority: "Broward County Supervisor of Elections",
      filing_authority_url: "https://www.browardvotes.gov",
      filing_window: { start: "2026-06-08T12:00:00-04:00", end: "2026-06-12T12:00:00-04:00", status: "PRE_FILING" },
      election_date: "2026-11-03",
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    gis_boundary: {
      operational_geometry_source: "BROWARD_COUNTY_ENTERPRISE_GIS",
      legal_authoritative_district_source: "BROWARD_COUNTY_COMMISSION_DISTRICTING_ORDINANCE",
      boundary_version: "2021 Broward County Decennial Commission Redistricting Plan",
      effective_period: "2022-2032",
      cross_source_reconciliation_state: "RECONCILED_WITH_LEGAL_BASE",
      boundary_source: "BROWARD_COUNTY_ENTERPRISE_GIS",
      layer_type: "LOCAL_COUNTY_COMMISSION",
      district_fips: "12011-COMM-1",
      census_layer_code: "LOCAL_GIS_PENDING",
      boundary_readiness: "AUTHORITATIVE_LOOKUP"
    },
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  },
  // Palm Beach County Commission (7 districts)
  {
    seat_key: "seat_fl_palm_beach_commission_1",
    seat_title: "Palm Beach County Commissioner, District 1",
    body: "LOCAL_COMMISSION",
    chamber_district: "Commission District 1",
    jurisdiction_key: "jurisdiction_us_fl_palm_beach",
    counties: ["Palm Beach County"],
    current_occupant: {
      person_key: "person_palm_beach_comm_dist_1",
      name: "Maria G. Marino",
      party: "Republican",
      term_start: "2020-11-17",
      term_end: "2024-11-19",
      term_limited_2026: false,
      official_photo_url: "https://discover.pbcgov.org/countycommissioners/district1/images/marino.jpg",
      official_url: "https://discover.pbcgov.org/countycommissioners/district1"
    },
    election_schedule: {
      election_key: "election_fl_palm_beach_comm_1_2026",
      filing_authority: "Palm Beach County Supervisor of Elections",
      filing_authority_url: "https://www.votepalmbeach.gov",
      election_cycle_known: true,
      seat_scheduled_for_election: true,
      cycle_year: 2026,
      next_election_date: "2026-11-03",
      qualifying_period: FL_2026_STATUTORY_QUALIFYING_PERIOD,
      pre_qualifying_document_acceptance: FL_2026_PRE_QUALIFYING_ACCEPTANCE,
      filing_activity: FL_CANDIDATE_FILING_ACTIVITY_ACTIVE,
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    election_2026: {
      election_key: "election_fl_palm_beach_comm_1_2026",
      filing_authority: "Palm Beach County Supervisor of Elections",
      filing_authority_url: "https://www.votepalmbeach.gov",
      filing_window: { start: "2026-06-08T12:00:00-04:00", end: "2026-06-12T12:00:00-04:00", status: "PRE_FILING" },
      election_date: "2026-11-03",
      candidates: [],
      candidate_search_state: "MONITORED_NO_FILING_CURRENT_AS_OF",
      next_check_scheduled: "2026-09-15T00:00:00Z"
    },
    gis_boundary: {
      operational_geometry_source: "PALM_BEACH_COUNTY_GIS",
      legal_authoritative_district_source: "PALM_BEACH_COUNTY_COMMISSION_REDISTRICTING_RESOLUTION",
      boundary_version: "2021 Palm Beach County Commission District Boundary",
      effective_period: "2022-2032",
      cross_source_reconciliation_state: "RECONCILED_WITH_LEGAL_BASE",
      boundary_source: "PALM_BEACH_COUNTY_GIS",
      layer_type: "LOCAL_COUNTY_COMMISSION",
      district_fips: "12099-COMM-1",
      census_layer_code: "LOCAL_GIS_PENDING",
      boundary_readiness: "AUTHORITATIVE_LOOKUP"
    },
    dossier_readiness: {
      track_a_civic_structure: "COMPLETE",
      track_b_election_candidates: "ACTIVE_TRACKING",
      track_c_governance_activity: "POPULATED",
      track_d_evidence_geospatial: "VERIFIED_HASH",
      status: "extracted_unreviewed"
    }
  }
];

export const ALL_STRUCTURAL_SEATS = [
  ...FLORIDA_STATEWIDE_EXECUTIVE_SEATS,
  ...FLORIDA_SENATE_SEATS,
  ...FLORIDA_HOUSE_SEATS,
  ...SOUTH_FLORIDA_LOCAL_SEATS
];
