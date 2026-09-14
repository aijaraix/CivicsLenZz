/**
 * LEGACY_SYNTHETIC_NON_PRODUCTION_DO_NOT_EXECUTE
 * 
 * QUARANTINED HISTORICAL MODULE:
 * In accordance with CivicsLenZz Zero-Synthetic Master Production Directive,
 * this generator is permanently decommissioned and quarantined from all production paths.
 * CivicsLenZz is an autonomous zero-synthetic research producer.
 * No civic profiles, scores, or claims may ever be manufactured synthetically.
 */

export interface Complete100FieldOfficialProfile {
  // Category 1: Identity & Contact (12 fields)
  slug: string;
  id: string;
  name: string;
  legalName: string;
  preferredName?: string;
  title: string;
  headshotUrl: string;
  verifiedPhotos: string[];
  governmentDomain: string;
  officialEmail: string;
  officialPhone: string;
  officeAddress: string;
  socialHandles: {
    twitter?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    ballotpedia?: string;
  };

  // Category 2: Office & Jurisdiction (14 fields)
  level: 'Federal' | 'State' | 'County' | 'Municipal' | 'School Board';
  party: 'Democrat' | 'Republican' | 'Independent' | 'Nonpartisan';
  stateCode: string;
  stateName: string;
  countyName?: string;
  countyFips?: string;
  municipality?: string;
  district?: string;
  seatId: string;
  termStartDate: string;
  termEndDate: string;
  nextElection: string;
  filingDocketId: string;
  qualificationStatus: 'QUALIFIED' | 'INCUMBENT' | 'CERTIFIED';
  incumbencyStatus: 'INCUMBENT' | 'OPEN_SEAT' | 'CHALLENGER';
  termLimitsRemaining: string;

  // Category 3: Biography, Education & Career (12 fields)
  verifiedBiography: string;
  birthplace: string;
  birthDate?: string;
  undergraduateDegree: string;
  lawOrGraduateDegree?: string;
  militaryService: boolean;
  militaryBranch?: string;
  priorElectedOffices: string[];
  yearsInPublicOffice: number;
  careerMilestones: string[];
  spouseName?: string;
  childrenCount?: number;

  // Category 4: Campaign Finance & Outside Money (18 fields)
  campaignFinance: {
    totalRaised: number;
    totalSpent: number;
    cashOnHand: number;
    pacPercentage: number;
    smallIndividualPercentage: number;
    largeIndividualPercentage: number;
    corporatePacTotal: number;
    fecOrStateFilingId: string;
    reportingPeriod: string;
    cashBurnRateMonthly: number;
    debtOutstanding: number;
    medianDonorContribution: number;
    grassrootsDonorCount: number;
    outOfStateDonationPercent: number;
    superPacSupportingEstimate: number;
    superPacOpposingEstimate: number;
  };
  donors: Array<{
    name: string;
    amount: number;
    isPac: boolean;
    industry?: string;
    cityState?: string;
  }>;

  // Category 5: Platform Promises & Policy Pledges (15 fields)
  detailedPromises: Array<{
    id: string;
    title: string;
    description: string;
    category: 'Economy & Taxes' | 'Infrastructure' | 'Public Safety' | 'Education' | 'Environment' | 'Healthcare' | 'Governance & Ethics';
    status: 'Kept' | 'In Progress' | 'Broken' | 'Stalled' | 'Pending';
    statedDate: string;
    exactQuote: string;
    sourceUrl: string;
    sourceLabel: string;
    legislativeDocketRef?: string;
    dateLastAudited: string;
    progressPercentage: number;
  }>;

  // Category 6: Roll-Call Votes & Legislative Record (15 fields)
  legislativeRecord: {
    totalBillsSponsored: number;
    billsPassedIntoLaw: number;
    attendanceRate: number;
    missedVoteRate: number;
    partisanAlignmentScore: number;
    bipartisanCoSponsorshipRate: number;
    committeeAssignments: string[];
    committeeChairs: string[];
    keyRollCallVotes: Array<{
      billNumber: string;
      billTitle: string;
      vote: 'Yea' | 'Nay' | 'Abstain';
      date: string;
      result: string;
      sourceUrl: string;
    }>;
  };

  // Category 7: Legal, Ethics & Financial Disclosures (12 fields)
  legalAndEthics: {
    mandatoryEthicsFilingStatus: 'COMPLIANT' | 'FILED_WITH_EXEMPTIONS' | 'UNDER_REVIEW';
    netWorthEstimateRange: string;
    primaryOutsideIncome: string;
    realEstateHoldingsSummary: string;
    familyBusinessInterestsSummary?: string;
    criminalBackgroundNcicClearance: 'CLEARED - NO FELONY RECORD' | 'VERIFIED';
    fdleOrStatePoliceClearanceDate: string;
    courtDocketsAndClearances: Array<{
      caseOrRecordName: string;
      agencyOrCourt: string;
      date: string;
      dispositionOrStatus: string;
      verifiedSourceUrl: string;
    }>;
  };

  // Category 8: Campaign Advertising & Polling (10 fields)
  campaignAdsAndPolling: {
    metaAdLibrary90DaySpend: number;
    googlePoliticalAdSpend: number;
    broadcastTvMediaBuyEstimate: number;
    latestPollingSupport: number;
    pollingMarginOfError: number;
    pollingFirm: string;
    pollingSampleSize: number;
    favorabilityRating: number;
    unfavorabilityRating: number;
  };

  // Category 9: Public Stances & Ideology (8 fields)
  publicStancesAndIdeology: {
    aiExecutivePlatformSummary: string;
    economicIdeologyScore: number; // -10.0 (Far Left) to +10.0 (Far Right)
    socialIdeologyScore: number;
    highProfileEndorsements: string[];
    communityApprovalScore: number;
    publicTownHallsHeldLast12Months: number;
  };

  // Category 10: Cryptographic Provenance & Telemetry (6 fields)
  cryptographicProvenance: {
    responsibleHermesAgentId: string;
    verificationTimestamp: string;
    sha256EvidenceSeal: string;
    primaryDocketVerificationUrl: string;
    ingestionVersion: string;
    dataIntegrityScore: number; // 0-100%
  };

  // Compatibility fields
  score: number;
  promises?: number;
  bills?: number;
  votes?: number;
  color?: string;
  initials?: string;
  office?: string;
  photoUrl: string;
}

export const ALL_50_STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', region: 'South', totalSeats: 8940, capital: 'Montgomery' },
  { code: 'AK', name: 'Alaska', slug: 'alaska', region: 'West', totalSeats: 3120, capital: 'Juneau' },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', region: 'West', totalSeats: 11450, capital: 'Phoenix' },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas', region: 'South', totalSeats: 7890, capital: 'Little Rock' },
  { code: 'CA', name: 'California', slug: 'california', region: 'West', totalSeats: 26400, capital: 'Sacramento' },
  { code: 'CO', name: 'Colorado', slug: 'colorado', region: 'West', totalSeats: 9850, capital: 'Denver' },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut', region: 'Northeast', totalSeats: 6420, capital: 'Hartford' },
  { code: 'DE', name: 'Delaware', slug: 'delaware', region: 'Northeast', totalSeats: 2150, capital: 'Dover' },
  { code: 'FL', name: 'Florida', slug: 'florida', region: 'South', totalSeats: 20739, capital: 'Tallahassee' },
  { code: 'GA', name: 'Georgia', slug: 'georgia', region: 'South', totalSeats: 15200, capital: 'Atlanta' },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii', region: 'West', totalSeats: 1980, capital: 'Honolulu' },
  { code: 'ID', name: 'Idaho', slug: 'idaho', region: 'West', totalSeats: 5840, capital: 'Boise' },
  { code: 'IL', name: 'Illinois', slug: 'illinois', region: 'Midwest', totalSeats: 23100, capital: 'Springfield' },
  { code: 'IN', name: 'Indiana', slug: 'indiana', region: 'Midwest', totalSeats: 12800, capital: 'Indianapolis' },
  { code: 'IA', name: 'Iowa', slug: 'iowa', region: 'Midwest', totalSeats: 9400, capital: 'Des Moines' },
  { code: 'KS', name: 'Kansas', slug: 'kansas', region: 'Midwest', totalSeats: 8200, capital: 'Topeka' },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky', region: 'South', totalSeats: 9100, capital: 'Frankfort' },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana', region: 'South', totalSeats: 8750, capital: 'Baton Rouge' },
  { code: 'ME', name: 'Maine', slug: 'maine', region: 'Northeast', totalSeats: 4900, capital: 'Augusta' },
  { code: 'MD', name: 'Maryland', slug: 'maryland', region: 'Northeast', totalSeats: 8100, capital: 'Annapolis' },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts', region: 'Northeast', totalSeats: 10200, capital: 'Boston' },
  { code: 'MI', name: 'Michigan', slug: 'michigan', region: 'Midwest', totalSeats: 16900, capital: 'Lansing' },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota', region: 'Midwest', totalSeats: 14500, capital: 'St. Paul' },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi', region: 'South', totalSeats: 7600, capital: 'Jackson' },
  { code: 'MO', name: 'Missouri', slug: 'missouri', region: 'Midwest', totalSeats: 13200, capital: 'Jefferson City' },
  { code: 'MT', name: 'Montana', slug: 'montana', region: 'West', totalSeats: 4500, capital: 'Helena' },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska', region: 'Midwest', totalSeats: 6800, capital: 'Lincoln' },
  { code: 'NV', name: 'Nevada', slug: 'nevada', region: 'West', totalSeats: 5400, capital: 'Carson City' },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire', region: 'Northeast', totalSeats: 4800, capital: 'Concord' },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey', region: 'Northeast', totalSeats: 13900, capital: 'Trenton' },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico', region: 'West', totalSeats: 6100, capital: 'Santa Fe' },
  { code: 'NY', name: 'New York', slug: 'new-york', region: 'Northeast', totalSeats: 22400, capital: 'Albany' },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina', region: 'South', totalSeats: 15800, capital: 'Raleigh' },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota', region: 'Midwest', totalSeats: 3900, capital: 'Bismarck' },
  { code: 'OH', name: 'Ohio', slug: 'ohio', region: 'Midwest', totalSeats: 18400, capital: 'Columbus' },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma', region: 'South', totalSeats: 9200, capital: 'Oklahoma City' },
  { code: 'OR', name: 'Oregon', slug: 'oregon', region: 'West', totalSeats: 8900, capital: 'Salem' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', region: 'Northeast', totalSeats: 20100, capital: 'Harrisburg' },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island', region: 'Northeast', totalSeats: 2400, capital: 'Providence' },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina', region: 'South', totalSeats: 9600, capital: 'Columbia' },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota', region: 'Midwest', totalSeats: 4100, capital: 'Pierre' },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee', region: 'South', totalSeats: 11900, capital: 'Nashville' },
  { code: 'TX', name: 'Texas', slug: 'texas', region: 'South', totalSeats: 28900, capital: 'Austin' },
  { code: 'UT', name: 'Utah', slug: 'utah', region: 'West', totalSeats: 6700, capital: 'Salt Lake City' },
  { code: 'VT', name: 'Vermont', slug: 'vermont', region: 'Northeast', totalSeats: 2900, capital: 'Montpelier' },
  { code: 'VA', name: 'Virginia', slug: 'virginia', region: 'South', totalSeats: 12500, capital: 'Richmond' },
  { code: 'WA', name: 'Washington', slug: 'washington', region: 'West', totalSeats: 13400, capital: 'Olympia' },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia', region: 'South', totalSeats: 5100, capital: 'Charleston' },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin', region: 'Midwest', totalSeats: 14200, capital: 'Madison' },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming', region: 'West', totalSeats: 2800, capital: 'Cheyenne' }
];

export function generateDeterministic100FieldProfile(_seed: any): Complete100FieldOfficialProfile {
  throw new Error(
    "SYNTHETIC_CIVIC_DATA_GENERATION_PROHIBITED: CivicsLenZz is a zero-synthetic research producer. " +
    "Synthetic profile generation has been decommissioned. Ingest real evidence via HermesBackendStore."
  );
}

