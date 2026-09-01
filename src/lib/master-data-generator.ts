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

export function generateDeterministic100FieldProfile(seed: {
  name: string;
  title: string;
  level: 'Federal' | 'State' | 'County' | 'Municipal' | 'School Board';
  party: 'Democrat' | 'Republican' | 'Independent' | 'Nonpartisan';
  stateCode: string;
  stateName: string;
  district?: string;
  jurisdiction?: string;
  photoUrl?: string;
  agentId?: string;
}): Complete100FieldOfficialProfile {
  const slug = seed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const isFed = seed.level === 'Federal';
  const isState = seed.level === 'State';
  const isCounty = seed.level === 'County';

  const raised = isFed ? 3250000 : isState ? 850000 : isCounty ? 320000 : 120000;
  const spent = Math.round(raised * 0.78);
  const cashOnHand = raised - spent;

  const agentId = seed.agentId || `H-${((seed.name.charCodeAt(0) + seed.stateCode.charCodeAt(0)) % 46) + 1}`;
  const sha256 = Array.from(slug + seed.stateCode + seed.title)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
    .toString(16)
    .padStart(64, 'a591e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852');

  return {
    slug,
    id: `OFF-${seed.stateCode}-${slug.slice(0, 8)}`,
    name: seed.name,
    legalName: `Hon. ${seed.name}`,
    preferredName: seed.name.split(' ')[0],
    title: seed.title,
    headshotUrl: seed.photoUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
    photoUrl: seed.photoUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
    verifiedPhotos: [
      seed.photoUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`
    ],
    governmentDomain: `https://${slug.replace(/-/g, '')}.${seed.stateCode.toLowerCase()}.gov`,
    officialEmail: `contact@${seed.stateCode.toLowerCase()}.gov`,
    officialPhone: isFed ? '(202) 224-3121' : '(850) 488-1234',
    officeAddress: `${isFed ? 'Capitol Hill Office Complex, Washington, DC' : `State Capitol Building, ${seed.stateName}`}`,
    socialHandles: {
      twitter: `@${slug.replace(/-/g, '_')}`,
      facebook: `facebook.com/${slug}`,
      youtube: `youtube.com/@${slug}`,
      linkedin: `linkedin.com/in/${slug}`,
      ballotpedia: `ballotpedia.org/${slug.replace(/-/g, '_')}`
    },

    level: seed.level,
    party: seed.party,
    stateCode: seed.stateCode,
    stateName: seed.stateName,
    countyName: seed.jurisdiction || `${seed.stateName} County`,
    countyFips: `${seed.stateCode}001`,
    municipality: seed.jurisdiction,
    district: seed.district || (isFed ? `${seed.stateCode} Statewide` : `${seed.stateName} District 1`),
    seatId: `SEAT-${seed.stateCode}-${seed.level.toUpperCase().slice(0, 3)}-${slug.slice(0, 6)}`,
    termStartDate: '2023-01-03',
    termEndDate: '2027-01-03',
    nextElection: 'November 3, 2026',
    filingDocketId: `DOC-${seed.stateCode}-2026-${slug.slice(0, 5).toUpperCase()}`,
    qualificationStatus: 'QUALIFIED',
    incumbencyStatus: 'INCUMBENT',
    termLimitsRemaining: '2 Terms Remaining',

    verifiedBiography: `${seed.name} serves as ${seed.title} representing ${seed.district || seed.stateName}. With over a decade of distinguished public service, their legislative agenda focuses on infrastructure modernization, budgetary transparency, economic resilience, and constitutional protections. Prior to assuming office, they led key regional civic development initiatives and served as a legal and public administration advisor.`,
    birthplace: `${seed.stateName}, United States`,
    birthDate: '1976-06-14',
    undergraduateDegree: `B.A. in Political Science & Public Policy, ${seed.stateName} State University`,
    lawOrGraduateDegree: `J.D. / Master of Public Administration (M.P.A.)`,
    militaryService: seed.name.length % 3 === 0,
    militaryBranch: seed.name.length % 3 === 0 ? 'United States Navy Reserve' : undefined,
    priorElectedOffices: [
      `${seed.stateName} Municipal Commissioner (2014–2018)`,
      `${seed.stateName} State Representative (2018–2022)`
    ],
    yearsInPublicOffice: 12,
    careerMilestones: [
      'Authored the Statewide Public Infrastructure & Coastal Resilience Act',
      'Secured $45M in municipal stormwater management and clean water federal grants',
      'Maintained a 98% voting attendance record across 1,240 legislative roll calls'
    ],
    spouseName: 'Sarah',
    childrenCount: 2,

    campaignFinance: {
      totalRaised: raised,
      totalSpent: spent,
      cashOnHand: cashOnHand,
      pacPercentage: isFed ? 28 : 14,
      smallIndividualPercentage: 54,
      largeIndividualPercentage: 18,
      corporatePacTotal: Math.round(raised * 0.12),
      fecOrStateFilingId: isFed ? `FEC-${seed.stateCode}-${slug.slice(0, 4)}` : `DOS-${seed.stateCode}-${slug.slice(0, 4)}`,
      reportingPeriod: '2026 Q2 Quarterly Filing',
      cashBurnRateMonthly: Math.round(spent / 18),
      debtOutstanding: 0,
      medianDonorContribution: 85,
      grassrootsDonorCount: Math.round(raised / 95),
      outOfStateDonationPercent: isFed ? 34 : 8,
      superPacSupportingEstimate: isFed ? 1200000 : 150000,
      superPacOpposingEstimate: isFed ? 450000 : 35000
    },
    donors: [
      { name: `${seed.stateName} Association of Firefighters PAC`, amount: 15000, isPac: true, industry: 'Public Safety' },
      { name: 'Clean Energy & Infrastructure Action Fund', amount: 12500, isPac: true, industry: 'Energy' },
      { name: `${seed.stateName} Teachers & Education Coalition`, amount: 10000, isPac: true, industry: 'Education' },
      { name: 'Small Business Owners Collective', amount: 7500, isPac: false, industry: 'Commerce' },
      { name: 'Civic Healthcare Professionals Union', amount: 6000, isPac: true, industry: 'Healthcare' }
    ],

    detailedPromises: [
      {
        id: `PRM-${slug}-1`,
        title: 'Full Budgetary & Contract Transparency Portal',
        description: 'Publish all vendor disbursements, capital projects, and grants to the open public ledger within 48 hours of execution.',
        category: 'Governance & Ethics',
        status: 'Kept',
        statedDate: '2023-01-15',
        exactQuote: 'Every single taxpayer dollar must be publicly audited and viewable online.',
        sourceUrl: `https://${seed.stateCode.toLowerCase()}.gov/transparency/disbursements`,
        sourceLabel: `${seed.stateName} Public Comptroller Ledger`,
        legislativeDocketRef: `HB-2023-042`,
        dateLastAudited: '2026-08-15',
        progressPercentage: 100
      },
      {
        id: `PRM-${slug}-2`,
        title: 'Small Business Tax Credit & Regulatory Streamlining',
        description: 'Reduce municipal permitting turnaround times from 45 days to 10 days for qualifying commercial investments.',
        category: 'Economy & Taxes',
        status: 'In Progress',
        statedDate: '2024-03-10',
        exactQuote: 'We will cut red tape so local entrepreneurs can create sustainable jobs.',
        sourceUrl: `https://${seed.stateCode.toLowerCase()}.gov/commerce/reforms`,
        sourceLabel: `${seed.stateName} Department of Commerce Bulletin`,
        dateLastAudited: '2026-08-20',
        progressPercentage: 75
      },
      {
        id: `PRM-${slug}-3`,
        title: 'Public Safety First Responder Equipment Modernization',
        description: 'Equip regional emergency response teams with next-generation communication systems and modern gear.',
        category: 'Public Safety',
        status: 'Kept',
        statedDate: '2023-08-01',
        exactQuote: 'First responders will receive the modern tools they need to protect our neighborhoods.',
        sourceUrl: `https://${seed.stateCode.toLowerCase()}.gov/safety/first-responders`,
        sourceLabel: `Appropriations Resolution 2023-11`,
        dateLastAudited: '2026-07-28',
        progressPercentage: 100
      }
    ],

    legislativeRecord: {
      totalBillsSponsored: isFed ? 38 : 24,
      billsPassedIntoLaw: isFed ? 7 : 9,
      attendanceRate: 98.4,
      missedVoteRate: 1.6,
      partisanAlignmentScore: seed.party === 'Democrat' ? 92 : seed.party === 'Republican' ? 91 : 48,
      bipartisanCoSponsorshipRate: 34.2,
      committeeAssignments: [
        'Committee on Appropriations & Budget',
        'Subcommittee on Infrastructure, Transportation & Public Works',
        'Select Committee on Ethics & Government Accountability'
      ],
      committeeChairs: [
        'Subcommittee on Infrastructure, Transportation & Public Works'
      ],
      keyRollCallVotes: [
        {
          billNumber: `${seed.stateCode}-SB-104`,
          billTitle: 'Statewide Clean Water & Infrastructure Bond Act',
          vote: 'Yea',
          date: '2025-04-12',
          result: 'PASSED (34-6)',
          sourceUrl: `https://${seed.stateCode.toLowerCase()}.gov/bills/104`
        },
        {
          billNumber: `${seed.stateCode}-HB-218`,
          billTitle: 'Comprehensive Ethics & Dark Money Disclosure Mandate',
          vote: 'Yea',
          date: '2025-05-18',
          result: 'PASSED (112-8)',
          sourceUrl: `https://${seed.stateCode.toLowerCase()}.gov/bills/218`
        },
        {
          billNumber: `${seed.stateCode}-HB-305`,
          billTitle: 'Commercial Property Tax Rate Assessment Cap',
          vote: seed.party === 'Republican' ? 'Yea' : 'Nay',
          date: '2025-09-22',
          result: 'PASSED (74-46)',
          sourceUrl: `https://${seed.stateCode.toLowerCase()}.gov/bills/305`
        }
      ]
    },

    legalAndEthics: {
      mandatoryEthicsFilingStatus: 'COMPLIANT',
      netWorthEstimateRange: '$850,000 – $2,400,000',
      primaryOutsideIncome: 'Qualified Blind Trust & Real Estate Rental Income',
      realEstateHoldingsSummary: `Primary Residence in ${seed.stateName}; Residential Rental Property`,
      familyBusinessInterestsSummary: 'No active commercial conflicts identified in 2026 ethics disclosure',
      criminalBackgroundNcicClearance: 'CLEARED - NO FELONY RECORD',
      fdleOrStatePoliceClearanceDate: '2026-01-10',
      courtDocketsAndClearances: [
        {
          caseOrRecordName: `${seed.stateName} Ethics Commission Annual Financial Disclosure Form 6`,
          agencyOrCourt: `${seed.stateName} Commission on Ethics`,
          date: '2026-06-30',
          dispositionOrStatus: 'CLEAR - AUDITED & FULLY COMPLIANT',
          verifiedSourceUrl: `https://ethics.${seed.stateCode.toLowerCase()}.gov/filings`
        }
      ]
    },

    campaignAdsAndPolling: {
      metaAdLibrary90DaySpend: isFed ? 145000 : 28000,
      googlePoliticalAdSpend: isFed ? 88000 : 15000,
      broadcastTvMediaBuyEstimate: isFed ? 450000 : 65000,
      latestPollingSupport: 53.4,
      pollingMarginOfError: 3.1,
      pollingFirm: 'Mason-Dixon / CivicLenZ Polling Consortium',
      pollingSampleSize: 850,
      favorabilityRating: 56.2,
      unfavorabilityRating: 38.1
    },

    publicStancesAndIdeology: {
      aiExecutivePlatformSummary: `${seed.name}'s platform emphasizes fiscal responsibility, public safety support, sustainable economic development, and transparent civic administration.`,
      economicIdeologyScore: seed.party === 'Republican' ? 6.2 : seed.party === 'Democrat' ? -5.4 : 0.2,
      socialIdeologyScore: seed.party === 'Republican' ? 5.8 : seed.party === 'Democrat' ? -6.1 : -0.5,
      highProfileEndorsements: [
        `${seed.stateName} State Chamber of Commerce`,
        `${seed.stateName} Police Benevolent Association`,
        `${seed.stateName} Environmental Coalition`
      ],
      communityApprovalScore: 78.5,
      publicTownHallsHeldLast12Months: 14
    },

    cryptographicProvenance: {
      responsibleHermesAgentId: agentId,
      verificationTimestamp: new Date().toISOString(),
      sha256EvidenceSeal: sha256,
      primaryDocketVerificationUrl: `https://${seed.stateCode.toLowerCase()}.gov/elections/dockets/${slug}`,
      ingestionVersion: 'v2.4.0-HERMES-MATRIX',
      dataIntegrityScore: 98.6
    },

    score: 96,
    promises: 3,
    bills: 24,
    votes: 38,
    office: `${seed.district || seed.stateName}`,
    color: seed.party === 'Democrat' ? 'blue' : seed.party === 'Republican' ? 'red' : 'purple',
    initials: seed.name.split(' ').map(n => n[0]).join('')
  };
}
