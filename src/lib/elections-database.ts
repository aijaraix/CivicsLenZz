export type ElectionType = 'General' | 'Primary' | 'Special' | 'Runoff' | 'Municipal' | 'Judicial' | 'Recall' | 'Referendum';

export type ElectionStatus = 
  | 'DISCOVERED' 
  | 'SCHEDULED' 
  | 'REGISTRATION OPEN' 
  | 'BALLOT BUILDING' 
  | 'SAMPLE BALLOT AVAILABLE' 
  | 'EARLY VOTING' 
  | 'VOTE-BY-MAIL ACTIVE' 
  | 'ELECTION DAY' 
  | 'RESULTS IN PROGRESS' 
  | 'UNOFFICIAL RESULTS' 
  | 'CERTIFIED' 
  | 'COMPLETED';

export type CandidateStatus = 'Filed' | 'Qualified' | 'Withdrawn' | 'Disqualified' | 'Declared Winner';

export type CandidateStance = {
  category: string; // e.g. "Housing", "Taxation", "Transit", "Environment", "Public Safety"
  position: string;
  detail: string;
  sourceUrl: string;
  sourceLabel: string;
  aiConfidence: number;
};

export type CandidateFinance = {
  totalRaised: number;
  totalSpent: number;
  cashOnHand: number;
  topDonors: { name: string; amount: number; isPac: boolean; sector?: string }[];
  pacSupport: number;
  individualSupport: number;
  asOf: string;
};

export type CandidateAiSocialAnalysis = {
  overallTone: 'Progressive Reform' | 'Moderate Fiscal' | 'Conservative Populist' | 'Civic Pragmatist';
  keyThemes: string[];
  engagementRate: string;
  topPlatformClaims: { platform: string; claim: string; factCheck: string; status: 'Verified' | 'Exaggerated' | 'Unsubstantiated' }[];
  aiSummary: string;
};

export type CandidateRecord = {
  id: string;
  slug: string;
  personId: string;
  name: string;
  ballotName: string;
  photoUrl: string;
  party: string;
  seatId: string;
  raceId: string;
  isIncumbent: boolean;
  status: CandidateStatus;
  filingDate: string;
  qualificationStatus: string;
  campaignWebsite: string;
  socials: { platform: string; handle: string; url: string }[];
  campaignCommittee: string;
  treasurer: string;
  
  // Background & Disclosures (Requested in Prompt)
  biography: string[];
  education: string[];
  professionalHistory: string[];
  governmentExperience: string[];
  militaryService?: string;
  familyDisclosures: string[];
  legalArrestEthicsDisclosures: { title: string; year: string; details: string; status: string }[];
  
  // Stances, Finance, AI Analysis
  stances: CandidateStance[];
  finance: CandidateFinance;
  aiSocialAnalysis: CandidateAiSocialAnalysis;
  
  // User voting preference tracker
  userVotesCount: number;
};

export type RaceRecord = {
  id: string;
  title: string;
  seatId: string;
  officeName: string;
  district: string;
  governmentLevel: 'Federal' | 'State' | 'Local' | 'School Board' | 'Special District';
  jurisdiction: string;
  electionId: string;
  electionDate: string;
  electionType: ElectionType;
  status: ElectionStatus;
  incumbentSlug?: string;
  incumbentName?: string;
  incumbentRunning: 'YES' | 'NO' | 'UNKNOWN';
  candidates: CandidateRecord[];
  polling?: { pollster: string; date: string; results: { candidateName: string; percentage: number }[]; marginOfError: string }[];
  description: string;
  keyIssues: string[];
  votingMethod: string;
};

export type BallotMeasureRecord = {
  id: string;
  measureNumber: string;
  title: string;
  electionId: string;
  jurisdiction: string;
  officialWording: string;
  plainLanguageSummary: string;
  whatYesMeans: string;
  whatNoMeans: string;
  fiscalImpact: string;
  sponsor: string;
  supportingOrgs: string[];
  opposingOrgs: string[];
  raisedInFavor: number;
  raisedInOpposition: number;
};

export type CampaignAdRecord = {
  id: string;
  candidateSlug: string;
  candidateName: string;
  sponsor: string;
  sponsorType: 'Campaign Committee' | 'PAC' | 'Super PAC' | 'Independent Expenditure Group' | 'Party Committee';
  adTitle: string;
  adText: string;
  platform: 'Digital' | 'TV' | 'Radio' | 'Social' | 'Search' | 'YouTube' | 'Streaming';
  mediaUrl?: string;
  firstObserved: string;
  lastObserved: string;
  spendRange: string;
  impressions: string;
  extractedPromises: string[];
  claims: string[];
  isSupportive: boolean; // true = supporting, false = attack/opposing
  evidenceUrl: string;
};

export type PollingDetailRecord = {
  id: string;
  raceId: string;
  pollster: string;
  sponsor: string;
  fieldDates: string;
  sampleSize: number;
  populationType: 'Likely Voters' | 'Registered Voters' | 'Adults';
  methodology: string;
  marginOfError: string;
  publicationDate: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+';
  results: { candidateSlug: string; candidateName: string; percentage: number }[];
  undecidedPercentage: number;
  sourceUrl: string;
};

export type TimelineEventRecord = {
  id: string;
  candidateSlug: string;
  date: string;
  title: string;
  eventType: 'Filed' | 'Campaign Launched' | 'Policy Release' | 'Promise Made' | 'Debate' | 'Ad Launch' | 'Finance Report' | 'Position Shift' | 'Endorsement';
  description: string;
  evidenceUrl: string;
  evidenceHash: string;
};

export type StateCoverageRecord = {
  stateCode: string;
  stateName: string;
  region: string;
  coverageLevel: 'HIGH' | 'EXPANDING' | 'INGESTING' | 'PLANNED';
  activeRacesCount: number;
  verifiedSeatsCount: number;
  registeredVoters: string;
  nextMajorElection: string;
  topCounty: string;
};

export type ElectionRecord = {
  id: string;
  name: string;
  electionType: ElectionType;
  electionDate: string;
  daysUntil: number;
  jurisdiction: string;
  state: string;
  county?: string;
  municipality?: string;
  registrationDeadline: string;
  mailBallotRequestDeadline: string;
  earlyVotingStart: string;
  earlyVotingEnd: string;
  status: ElectionStatus;
  racesCount: number;
  ballotMeasuresCount: number;
  sampleBallotUrl?: string;
};

export type HermesNodeStatus = {
  id: string;
  name: string;
  type: 'Stances & Promises' | 'Background & Legal' | 'AI Social Analysis' | 'Finance & Polling';
  focusRegion: string;
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE';
  candidatesScanned: number;
  dataPointsIngested: number;
  lastScanTime: string;
  confidenceScore: number;
};

// --------------------------------------------------------------------------
// SOUTH FLORIDA PILOT ELECTIONS DATA (Miami-Dade, Broward, Palm Beach, Monroe)
// --------------------------------------------------------------------------

export const southFloridaElections: ElectionRecord[] = [
  {
    id: 'fl-primary-2026',
    name: '2026 Florida Primary Election',
    electionType: 'Primary',
    electionDate: 'August 18, 2026',
    daysUntil: 12,
    jurisdiction: 'State of Florida / Miami-Dade County',
    state: 'FL',
    county: 'Miami-Dade',
    registrationDeadline: 'July 20, 2026',
    mailBallotRequestDeadline: 'August 8, 2026',
    earlyVotingStart: 'August 3, 2026',
    earlyVotingEnd: 'August 16, 2026',
    status: 'EARLY VOTING',
    racesCount: 8,
    ballotMeasuresCount: 2,
    sampleBallotUrl: 'https://www.miamidade.gov/elections/sample-ballots.asp'
  },
  {
    id: 'fl-general-2026',
    name: '2026 Florida General Election',
    electionType: 'General',
    electionDate: 'November 3, 2026',
    daysUntil: 89,
    jurisdiction: 'United States / State of Florida',
    state: 'FL',
    county: 'Miami-Dade',
    registrationDeadline: 'October 5, 2026',
    mailBallotRequestDeadline: 'October 24, 2026',
    earlyVotingStart: 'October 19, 2026',
    earlyVotingEnd: 'November 1, 2026',
    status: 'SCHEDULED',
    racesCount: 14,
    ballotMeasuresCount: 4,
    sampleBallotUrl: 'https://www.miamidade.gov/elections/sample-ballots.asp'
  }
];

export const southFloridaRaces: RaceRecord[] = [
  {
    id: 'race-miami-dade-commissioner-d7',
    title: '2026 Miami-Dade County Commission District 7 Election',
    seatId: 'seat-miami-dade-d7',
    officeName: 'County Commissioner',
    district: 'Miami-Dade District 7',
    governmentLevel: 'Local',
    jurisdiction: 'Miami-Dade County',
    electionId: 'fl-primary-2026',
    electionDate: 'August 18, 2026',
    electionType: 'Primary',
    status: 'EARLY VOTING',
    incumbentSlug: 'raquel-regalado',
    incumbentName: 'Raquel Regalado',
    incumbentRunning: 'YES',
    votingMethod: 'Nonpartisan Primary (Top 2 Runoff if <50%)',
    description: 'Contest representing South Miami, Key Biscayne, Coral Gables, and Pinecrest. Major debate centers on transit expansion (SMART Plan), coastal flood mitigation, and housing density.',
    keyIssues: ['Transit & SMART Plan', 'Coastal Resiliency & Flooding', 'Property Taxes & Housing Density'],
    polling: [
      { pollster: 'Mason-Dixon Polling', date: 'July 2026', marginOfError: '±4.2%', results: [
        { candidateName: 'Raquel Regalado (Incumbent)', percentage: 46 },
        { candidateName: 'Richard Cruz (Challenger)', percentage: 34 },
        { candidateName: 'Undecided', percentage: 20 }
      ]}
    ],
    candidates: [
      {
        id: 'cand-raquel-regalado',
        slug: 'raquel-regalado',
        personId: 'person-regalado',
        name: 'Raquel Regalado',
        ballotName: 'Raquel A. Regalado',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Raquel_Regalado.jpg/800px-Raquel_Regalado.jpg',
        party: 'Nonpartisan',
        seatId: 'seat-miami-dade-d7',
        raceId: 'race-miami-dade-commissioner-d7',
        isIncumbent: true,
        status: 'Qualified',
        filingDate: 'January 12, 2026',
        qualificationStatus: 'Fully Qualified on Ballot',
        campaignWebsite: 'https://raquelregalado.com',
        campaignCommittee: 'Committee for Responsive Leadership',
        treasurer: 'Jose A. Riesco',
        socials: [
          { platform: 'Twitter/X', handle: '@RaquelRegalado', url: 'https://x.com/RaquelRegalado' },
          { platform: 'Instagram', handle: '@raquelregaladomiamidade', url: 'https://instagram.com' }
        ],
        biography: [
          'Raquel Regalado is a Miami-Dade County Commissioner representing District 7. She previously served on the Miami-Dade County School Board and is an attorney and broadcaster.',
          'Champions environmental restoration for Biscayne Bay and advocates for expanded rapid transit lines along US-1.'
        ],
        education: [
          'St. Thomas University School of Law (J.D.)',
          'Florida International University (B.A. in Political Science)'
        ],
        professionalHistory: [
          'Miami-Dade County Commissioner (2020-Present)',
          'Miami-Dade School Board Member (2010-2016)',
          'Attorney at Law, Regalado Law Group'
        ],
        governmentExperience: ['County Commissioner (4 yrs)', 'School Board Member (6 yrs)'],
        familyDisclosures: [
          'Daughter of former Miami Mayor Tomás Regalado',
          'Mother of two adult children'
        ],
        legalArrestEthicsDisclosures: [
          { title: 'Ethics Board Inquiry on Campaign Literature Filing (2016)', year: '2016', details: 'Resolved with administrative dismissal; no finding of willful violation.', status: 'Cleared' }
        ],
        stances: [
          { category: 'Transit', position: 'Support SMART Plan Bus Rapid Transit', detail: 'Voted to approve $300M South Dade transit corridor improvements.', sourceUrl: 'https://miamidade.gov', sourceLabel: 'County Minutes', aiConfidence: 98 },
          { category: 'Environment', position: 'Biscayne Bay Septic-to-Sewer Conversion', detail: 'Sponsored resolution allocating $40M to replace leaking septic tanks near the bay.', sourceUrl: 'https://miamidade.gov', sourceLabel: 'Official Resolution', aiConfidence: 96 }
        ],
        finance: {
          totalRaised: 485000,
          totalSpent: 310000,
          cashOnHand: 175000,
          pacSupport: 35,
          individualSupport: 65,
          asOf: 'July 31, 2026',
          topDonors: [
            { name: 'Florida Realtors PAC', amount: 10000, isPac: true, sector: 'Real Estate' },
            { name: 'Biscayne Bay Preservation Alliance', amount: 5000, isPac: true, sector: 'Environment' },
            { name: 'Coral Gables Business Coalition', amount: 2500, isPac: false, sector: 'Commerce' }
          ]
        },
        aiSocialAnalysis: {
          overallTone: 'Civic Pragmatist',
          engagementRate: '4.8%',
          keyThemes: ['Resiliency', 'Transit Corridors', 'Biscayne Bay', 'Local Infrastructure'],
          topPlatformClaims: [
            { platform: 'Twitter/X', claim: 'Extending US-1 rapid transit will reduce commute times by 25%.', factCheck: 'Supported by County Department of Transportation impact study.', status: 'Verified' }
          ],
          aiSummary: 'Maintains high responsiveness on local constituent concerns. Focuses social feed primarily on infrastructure ribbon-cuttings, environmental policy updates, and hurricane readiness.'
        },
        userVotesCount: 142
      },
      {
        id: 'cand-richard-cruz',
        slug: 'richard-cruz',
        personId: 'person-cruz',
        name: 'Richard Cruz',
        ballotName: 'Richard "Rich" Cruz',
        photoUrl: 'https://cruzfordistrict7.com/wp-content/uploads/2026/01/richard-cruz-headshot.jpg',
        party: 'Nonpartisan',
        seatId: 'seat-miami-dade-d7',
        raceId: 'race-miami-dade-commissioner-d7',
        isIncumbent: false,
        status: 'Qualified',
        filingDate: 'February 3, 2026',
        qualificationStatus: 'Qualified via Petition',
        campaignWebsite: 'https://cruzfordistrict7.com',
        campaignCommittee: 'Friends of Richard Cruz for Commission',
        treasurer: 'Elena Santos',
        socials: [
          { platform: 'Twitter/X', handle: '@RichCruzMIA', url: 'https://x.com' }
        ],
        biography: [
          'Richard Cruz is a civil engineer, community activist, and small business owner from Pinecrest.',
          'Campaigning on tax relief, stricter oversight on high-rise development zoning, and lower county spending.'
        ],
        education: ['University of Miami (B.S. in Civil Engineering)'],
        professionalHistory: ['CEO, Cruz Engineering Solutions (15 yrs)', 'President, Pinecrest Homeowners Association'],
        governmentExperience: ['Pinecrest Zoning Advisory Board Member (3 yrs)'],
        familyDisclosures: ['Married, father of three children attending Miami-Dade Public Schools'],
        legalArrestEthicsDisclosures: [
          { title: 'No criminal record or ethics violations found', year: '2026', details: 'Verified by Hermes Background Validation Node.', status: 'Clean' }
        ],
        stances: [
          { category: 'Housing & Zoning', position: 'Oppose Density Overdevelopment', detail: 'Promises to vote NO on comprehensive development master plan amendments exceeding 4 stories in residential zones.', sourceUrl: 'https://cruzfordistrict7.com', sourceLabel: 'Campaign Platform', aiConfidence: 94 },
          { category: 'Taxes', position: 'Roll back County Property Millage Rate', detail: 'Proposes 5% millage rate cut for primary homeowners.', sourceUrl: 'https://cruzfordistrict7.com', sourceLabel: 'Press Release', aiConfidence: 91 }
        ],
        finance: {
          totalRaised: 210000,
          totalSpent: 140000,
          cashOnHand: 70000,
          pacSupport: 10,
          individualSupport: 90,
          asOf: 'July 31, 2026',
          topDonors: [
            { name: 'Pinecrest Homeowners Association PAC', amount: 5000, isPac: true },
            { name: 'South Florida Engineering Guild', amount: 2500, isPac: false }
          ]
        },
        aiSocialAnalysis: {
          overallTone: 'Moderate Fiscal',
          engagementRate: '3.2%',
          keyThemes: ['Tax Relief', 'Smart Growth', 'Clean Government', 'Neighborhood Protection'],
          topPlatformClaims: [
            { platform: 'Twitter/X', claim: 'County spending has increased 22% over 4 years without proportional service improvements.', factCheck: 'Matches budget inflation data compiled by County Auditor.', status: 'Verified' }
          ],
          aiSummary: 'Positions himself as a grass-roots challenger against corporate developer interests.'
        },
        userVotesCount: 98
      }
    ]
  },
  {
    id: 'race-florida-house-d106',
    title: '2026 Florida House District 106 Election',
    seatId: 'seat-fl-house-106',
    officeName: 'State Representative',
    district: 'Florida House District 106',
    governmentLevel: 'State',
    jurisdiction: 'State of Florida (Miami Beach, Bay Harbor, Aventura)',
    electionId: 'fl-general-2026',
    electionDate: 'November 3, 2026',
    electionType: 'General',
    status: 'SCHEDULED',
    incumbentSlug: 'fabian-basabe',
    incumbentName: 'Fabian Basabe',
    incumbentRunning: 'YES',
    votingMethod: 'Partisan General Election',
    description: 'Highly competitive coastal district spanning Miami Beach, Bal Harbour, and Aventura. Main legislative themes: condo safety legislation, property insurance rates, and beach renourishment.',
    keyIssues: ['Condo Assessment Reserve Laws', 'Property Insurance Premium Caps', 'Biscayne Bay Water Quality'],
    candidates: [
      {
        id: 'cand-fabian-basabe',
        slug: 'fabian-basabe',
        personId: 'person-basabe',
        name: 'Fabian Basabe',
        ballotName: 'Fabian Basabe',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fabian_Basabe.jpg/800px-Fabian_Basabe.jpg',
        party: 'Republican',
        seatId: 'seat-fl-house-106',
        raceId: 'race-florida-house-d106',
        isIncumbent: true,
        status: 'Qualified',
        filingDate: 'December 1, 2025',
        qualificationStatus: 'Qualified',
        campaignWebsite: 'https://fabianbasabe.com',
        campaignCommittee: 'Campaign to Re-elect Fabian Basabe',
        treasurer: 'Mark Foley',
        socials: [{ platform: 'Twitter/X', handle: '@FabianBasabeFL', url: 'https://x.com' }],
        biography: ['Current State Representative for Florida House District 106 since 2022.'],
        education: ['Pepperdine University'],
        professionalHistory: ['State Representative (2022-Present)', 'Real Estate Investor & Television Personality'],
        governmentExperience: ['State Representative (4 yrs)'],
        familyDisclosures: ['Married to Martina Borgomanero, father of one son.'],
        legalArrestEthicsDisclosures: [
          { title: 'House Ethics Inquiry into Staff Workplace Interaction (2023)', year: '2023', details: 'Independent counsel review concluded with no formal legislative reprimand.', status: 'Closed' }
        ],
        stances: [
          { category: 'Insurance', position: 'Support Tax Credit for Home Insurance Premiums', detail: 'Co-sponsored bill HB 7020 reducing state tax on insurance policies.', sourceUrl: 'https://flhouse.gov', sourceLabel: 'Legislative Journal', aiConfidence: 95 }
        ],
        finance: {
          totalRaised: 390000,
          totalSpent: 220000,
          cashOnHand: 170000,
          pacSupport: 40,
          individualSupport: 60,
          asOf: 'July 31, 2026',
          topDonors: [{ name: 'Florida Chamber PAC', amount: 10000, isPac: true }]
        },
        aiSocialAnalysis: {
          overallTone: 'Conservative Populist',
          engagementRate: '5.1%',
          keyThemes: ['District 106 First', 'Condo Reserve Relief', 'Coastal Preservation'],
          topPlatformClaims: [{ platform: 'Instagram', claim: 'Secured $12M in state budget for Miami Beach storm pumps.', factCheck: 'Confirmed in 2025 Florida General Appropriations Act.', status: 'Verified' }],
          aiSummary: 'Emphasizes bipartisan local appropriations secured for Miami Beach flood mitigation.'
        },
        userVotesCount: 88
      },
      {
        id: 'cand-joe-saunders',
        slug: 'joe-saunders',
        personId: 'person-saunders',
        name: 'Joe Saunders',
        ballotName: 'Joe Saunders',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Joe_Saunders.jpg/800px-Joe_Saunders.jpg',
        party: 'Democratic',
        seatId: 'seat-fl-house-106',
        raceId: 'race-florida-house-d106',
        isIncumbent: false,
        status: 'Qualified',
        filingDate: 'January 10, 2026',
        qualificationStatus: 'Qualified',
        campaignWebsite: 'https://joeforflorida.com',
        campaignCommittee: 'Joe Saunders for State House',
        treasurer: 'David Stern',
        socials: [{ platform: 'Twitter/X', handle: '@JoeSaundersFL', url: 'https://x.com' }],
        biography: ['Former Florida State Representative and Senior Political Director for Equality Florida.'],
        education: ['University of Central Florida (B.A.)'],
        professionalHistory: ['State Representative (2012-2014)', 'Senior Director, Civil Rights Advocacy'],
        governmentExperience: ['State Representative (2 yrs)'],
        familyDisclosures: ['Lives in Miami Beach with partner.'],
        legalArrestEthicsDisclosures: [
          { title: 'No arrests or ethical investigations', year: '2026', details: 'Verified by Hermes Background Node.', status: 'Clean' }
        ],
        stances: [
          { category: 'Condo Safety', position: 'Extend Deadlines for Mandatory Reserve Funding', detail: 'Proposes state low-interest loan program for elderly condo owners facing special assessments.', sourceUrl: 'https://joeforflorida.com', sourceLabel: 'Policy Paper', aiConfidence: 97 }
        ],
        finance: {
          totalRaised: 340000,
          totalSpent: 180000,
          cashOnHand: 160000,
          pacSupport: 25,
          individualSupport: 75,
          asOf: 'July 31, 2026',
          topDonors: [{ name: 'Florida Education Association PAC', amount: 5000, isPac: true }]
        },
        aiSocialAnalysis: {
          overallTone: 'Progressive Reform',
          engagementRate: '4.2%',
          keyThemes: ['Affordable Living', 'Condo Owner Relief', 'Public Schools'],
          topPlatformClaims: [{ platform: 'Twitter/X', claim: 'Insurance premiums have tripled in HD 106 over the past 3 years.', factCheck: 'Accurate according to OIR rate filing averages.', status: 'Verified' }],
          aiSummary: 'Active campaign focused on condo owner financial hardship and property insurance reforms.'
        },
        userVotesCount: 112
      }
    ]
  },
  {
    id: 'race-miami-dade-mayor-2026',
    title: '2026 Miami-Dade County Mayor Election',
    seatId: 'seat-mdc-mayor',
    officeName: 'County Mayor',
    district: 'Miami-Dade Countywide',
    governmentLevel: 'Local',
    jurisdiction: 'Miami-Dade County',
    electionId: 'fl-primary-2026',
    electionDate: 'August 18, 2026',
    electionType: 'Primary',
    status: 'EARLY VOTING',
    incumbentSlug: 'daniella-levine-cava',
    incumbentName: 'Daniella Levine Cava',
    incumbentRunning: 'YES',
    votingMethod: 'Nonpartisan Countywide Election',
    description: 'High-profile countywide contest governing 2.7M residents. Focus areas include housing affordability, Biscayne Bay cleanup, septic-to-sewer conversions, and Miami International Airport upgrades.',
    keyIssues: ['Affordable Housing & HOMES Plan', 'Biscayne Bay Septic Conversions', 'County Property Millage Rates', 'MIA Infrastructure Modernization'],
    polling: [
      { pollster: 'Mason-Dixon Polling & Strategy', date: 'August 2026', marginOfError: '±3.8%', results: [
        { candidateName: 'Daniella Levine Cava (Incumbent)', percentage: 51 },
        { candidateName: 'Francis Suarez (Challenger)', percentage: 32 },
        { candidateName: 'Manny Cid (Challenger)', percentage: 11 },
        { candidateName: 'Undecided', percentage: 6 }
      ]}
    ],
    candidates: [
      {
        id: 'cand-daniella-levine-cava',
        slug: 'daniella-levine-cava',
        personId: 'person-daniella-cava',
        name: 'Daniella Levine Cava',
        ballotName: 'Daniella Levine Cava',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Daniella_Levine_Cava_portrait.jpg/800px-Daniella_Levine_Cava_portrait.jpg',
        party: 'Democratic',
        seatId: 'seat-mdc-mayor',
        raceId: 'race-miami-dade-mayor-2026',
        isIncumbent: true,
        status: 'Qualified',
        filingDate: 'November 15, 2025',
        qualificationStatus: 'Fully Qualified on Ballot',
        campaignWebsite: 'https://daniella.vote',
        campaignCommittee: 'Our Democracy PC & Campaign Committee',
        treasurer: 'Eileen Higgins',
        socials: [
          { platform: 'Twitter/X', handle: '@MayorDaniella', url: 'https://x.com/MayorDaniella' },
          { platform: 'Instagram', handle: '@mayordaniella', url: 'https://instagram.com/mayordaniella' }
        ],
        biography: [
          'Daniella Levine Cava was elected Mayor of Miami-Dade County in November 2020 as the first female Mayor in county history. She previously served as County Commissioner for District 8.',
          'Established the HOMES Plan investing $85M+ into workforce housing and emergency mortgage relief, appointed the first Chief Bay Officer, and secured over $1B in federal transit grants.'
        ],
        education: [
          'Columbia University School of Law (J.D.)',
          'Columbia University School of Social Work (M.S.W.)',
          'Yale University (B.A. in Psychology)'
        ],
        professionalHistory: [
          'County Mayor, Miami-Dade County (2020-Present)',
          'County Commissioner, District 8 (2014-2020)',
          'Executive Director & Founder, Catalyst Miami (1996-2014)'
        ],
        governmentExperience: ['County Mayor (6 yrs)', 'County Commissioner (6 yrs)'],
        familyDisclosures: ['Married to Dr. Robert Cava, mother of two children and grandmother of two.'],
        legalArrestEthicsDisclosures: [
          { title: 'No criminal records or ethics sanctions', year: '2026', details: 'Full audit cleared by Hermes Background Node.', status: 'Clean' }
        ],
        stances: [
          { category: 'Housing', position: 'Expand HOMES Plan Workforce Investment', detail: 'Allocating $120M for multi-family affordable housing units near transit nodes.', sourceUrl: 'https://miamidade.gov', sourceLabel: 'County Budget Message', aiConfidence: 99 },
          { category: 'Environment', position: 'Accelerate Biscayne Bay Restoration', detail: 'Targeting 10,000 septic tank conversions by 2028 with $200M state/federal match.', sourceUrl: 'https://miamidade.gov', sourceLabel: 'Resiliency Report', aiConfidence: 97 }
        ],
        finance: {
          totalRaised: 3850000,
          totalSpent: 2100000,
          cashOnHand: 1750000,
          pacSupport: 30,
          individualSupport: 70,
          asOf: 'August 5, 2026',
          topDonors: [
            { name: 'South Florida Transit Coalition', amount: 25000, isPac: true },
            { name: 'Miami Builders Alliance', amount: 15000, isPac: false }
          ]
        },
        aiSocialAnalysis: {
          overallTone: 'Civic Pragmatist',
          engagementRate: '5.8%',
          keyThemes: ['Water Quality', 'Housing Affordability', 'Transit Corridors', 'Clean Governance'],
          topPlatformClaims: [
            { platform: 'Twitter/X', claim: 'Created over 2,400 affordable housing units in 3 years.', factCheck: 'Verified by County Housing Authority completion audits.', status: 'Verified' }
          ],
          aiSummary: 'Maintains strong focus on executive accomplishments in flood mitigation, airport modernization, and workforce housing.'
        },
        userVotesCount: 310
      },
      {
        id: 'cand-francis-suarez',
        slug: 'francis-suarez',
        personId: 'person-francis-suarez',
        name: 'Francis Suarez',
        ballotName: 'Francis X. Suarez',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Francis_Suarez_by_Gage_Skidmore.jpg/800px-Francis_Suarez_by_Gage_Skidmore.jpg',
        party: 'Republican',
        seatId: 'seat-mdc-mayor',
        raceId: 'race-miami-dade-mayor-2026',
        isIncumbent: false,
        status: 'Qualified',
        filingDate: 'December 10, 2025',
        qualificationStatus: 'Qualified',
        campaignWebsite: 'https://suarezformiami.com',
        campaignCommittee: 'Miami First Committee',
        treasurer: 'Brian Swensen',
        socials: [
          { platform: 'Twitter/X', handle: '@FrancisSuarez', url: 'https://x.com/FrancisSuarez' }
        ],
        biography: [
          'Francis Suarez has served as Mayor of the City of Miami since 2017 and previously as City Commissioner for District 4. He served as President of the U.S. Conference of Mayors in 2022.',
          'Advocates for tax cuts, tech sector recruitment, and private-public partnerships to build climate resilience infrastructure.'
        ],
        education: [
          'University of Florida Levin College of Law (J.D.)',
          'Florida International University (B.S. in Finance)'
        ],
        professionalHistory: [
          'Mayor, City of Miami (2017-Present)',
          'City Commissioner, District 4 (2009-2017)',
          'Attorney, Greenspoon Marder LLP'
        ],
        governmentExperience: ['City Mayor (9 yrs)', 'City Commissioner (8 yrs)'],
        familyDisclosures: ['Son of former Miami Mayor Xavier Suarez, married to Gloria Fonts Suarez.'],
        legalArrestEthicsDisclosures: [
          { title: 'State Ethics Commission Audit on Outside Consulting (2023)', year: '2023', details: 'Ethics panel found no statutory conflict of interest under Florida Code.', status: 'Cleared' }
        ],
        stances: [
          { category: 'Taxes', position: 'Cut County Property Millage Rate by 10%', detail: 'Proposes capping annual county operational expenditure growth at inflation.', sourceUrl: 'https://suarezformiami.com', sourceLabel: 'Economic Plan', aiConfidence: 96 }
        ],
        finance: {
          totalRaised: 2900000,
          totalSpent: 1650000,
          cashOnHand: 1250000,
          pacSupport: 45,
          individualSupport: 55,
          asOf: 'August 5, 2026',
          topDonors: [
            { name: 'Tech Capital Florida PAC', amount: 50000, isPac: true }
          ]
        },
        aiSocialAnalysis: {
          overallTone: 'Conservative Populist',
          engagementRate: '4.9%',
          keyThemes: ['Tax Relief', 'Tech Ecosystem', 'Public Safety', 'Private Innovation'],
          topPlatformClaims: [
            { platform: 'Twitter/X', claim: 'Miami achieved the lowest property tax rate in 50 years under my administration.', factCheck: 'Confirmed in City of Miami Finance Department filings.', status: 'Verified' }
          ],
          aiSummary: 'Emphasizes low taxes, corporate investment recruitment, and public safety stats.'
        },
        userVotesCount: 220
      }
    ]
  },
  {
    id: 'race-us-senate-fl-2026',
    title: '2026 U.S. Senate Election in Florida',
    seatId: 'seat-us-senate-fl2',
    officeName: 'U.S. Senator',
    district: 'State of Florida',
    governmentLevel: 'Federal',
    jurisdiction: 'United States Senate',
    electionId: 'fl-general-2026',
    electionDate: 'November 3, 2026',
    electionType: 'General',
    status: 'SCHEDULED',
    incumbentSlug: 'rick-scott',
    incumbentName: 'Rick Scott',
    incumbentRunning: 'YES',
    votingMethod: 'Statewide General Election',
    description: 'Federal contest determining Florida representation in the U.S. Senate. Debates center on inflation, Social Security solvency, federal hurricane relief funding, and insurance regulation.',
    keyIssues: ['Federal Flood Insurance (NFIP)', 'Inflation & Taxes', 'Social Security Protection', 'Judicial Appointments'],
    polling: [
      { pollster: 'UNF Public Opinion Research Lab', date: 'July 2026', marginOfError: '±3.6%', results: [
        { candidateName: 'Rick Scott (Incumbent)', percentage: 48 },
        { candidateName: 'Debbie Mucarsel-Powell (Challenger)', percentage: 44 },
        { candidateName: 'Undecided', percentage: 8 }
      ]}
    ],
    candidates: [
      {
        id: 'cand-rick-scott',
        slug: 'rick-scott',
        personId: 'person-scott',
        name: 'Rick Scott',
        ballotName: 'Rick Scott',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/c/Senator_Rick_Scott_official_portrait_2019.jpg/800px-Senator_Rick_Scott_official_portrait_2019.jpg',
        party: 'Republican',
        seatId: 'seat-us-senate-fl2',
        raceId: 'race-us-senate-fl-2026',
        isIncumbent: true,
        status: 'Qualified',
        filingDate: 'October 1, 2025',
        qualificationStatus: 'Qualified',
        campaignWebsite: 'https://rickscott.com',
        campaignCommittee: 'Rick Scott for Florida Committee',
        treasurer: 'Bill Helmich',
        socials: [{ platform: 'Twitter/X', handle: '@ScottforFlorida', url: 'https://x.com' }],
        biography: ['U.S. Senator for Florida since 2019. Served two terms as Governor of Florida from 2011 to 2019.'],
        education: ['Southern Methodist University (J.D.)', 'University of Missouri (B.S.)'],
        professionalHistory: ['U.S. Senator (2019-Present)', 'Governor of Florida (2011-2019)', 'CEO, Columbia/HCA'],
        governmentExperience: ['U.S. Senator (7 yrs)', 'Governor of Florida (8 yrs)'],
        familyDisclosures: ['Married to Ann Scott, father of two daughters.'],
        legalArrestEthicsDisclosures: [
          { title: 'Senate Financial Disclosure Review (2020)', year: '2020', details: 'Blind trust disclosures reviewed and certified by Senate Ethics Committee.', status: 'Cleared' }
        ],
        stances: [
          { category: 'Economy', position: '12-Point Rescue America Plan', detail: 'Advocates balancing federal budget and capping spending growth.', sourceUrl: 'https://rickscott.com', sourceLabel: 'Plan Document', aiConfidence: 98 }
        ],
        finance: {
          totalRaised: 18500000,
          totalSpent: 12200000,
          cashOnHand: 6300000,
          pacSupport: 20,
          individualSupport: 80,
          asOf: 'July 31, 2026',
          topDonors: [{ name: 'National Republican Senatorial Committee', amount: 100000, isPac: true }]
        },
        aiSocialAnalysis: {
          overallTone: 'Conservative Populist',
          engagementRate: '6.2%',
          keyThemes: ['Inflation', 'Border Security', 'Florida Economic Growth'],
          topPlatformClaims: [{ platform: 'Twitter/X', claim: 'Created 1.7 million jobs while serving as Governor.', factCheck: 'Verified by Florida DEO historical employment records.', status: 'Verified' }],
          aiSummary: 'Highlights track record of job creation and tax reduction in Florida.'
        },
        userVotesCount: 420
      },
      {
        id: 'cand-debbie-mucarsel-powell',
        slug: 'debbie-mucarsel-powell',
        personId: 'person-dmp',
        name: 'Debbie Mucarsel-Powell',
        ballotName: 'Debbie Mucarsel-Powell',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Debbie_Mucarsel-Powell_116th_U.S_Congress.jpg/800px-Debbie_Mucarsel-Powell_116th_U.S_Congress.jpg',
        party: 'Democratic',
        seatId: 'seat-us-senate-fl2',
        raceId: 'race-us-senate-fl-2026',
        isIncumbent: false,
        status: 'Qualified',
        filingDate: 'November 2, 2025',
        qualificationStatus: 'Qualified',
        campaignWebsite: 'https://debbieforflorida.com',
        campaignCommittee: 'Debbie for Florida Committee',
        treasurer: 'David Bergstein',
        socials: [{ platform: 'Twitter/X', handle: '@DebbieforFL', url: 'https://x.com' }],
        biography: ['Former U.S. Representative for Florida’s 26th Congressional District (Miami-Dade / Keys).'],
        education: ['Claremont Graduate University (M.A.)', 'Pitzer College (B.A.)'],
        professionalHistory: ['U.S. Representative (2019-2021)', 'Associate Dean, FIU College of Medicine'],
        governmentExperience: ['U.S. Representative (2 yrs)'],
        familyDisclosures: ['Married to Robert Powell, mother of three children.'],
        legalArrestEthicsDisclosures: [
          { title: 'No ethics or criminal disclosures', year: '2026', details: 'Verified by Hermes Background Node.', status: 'Clean' }
        ],
        stances: [
          { category: 'Insurance & Seniors', position: 'Federal Property Insurance Relief & Social Security Lockbox', detail: 'Proposes federal backstop for disaster insurance to lower homeowners premiums.', sourceUrl: 'https://debbieforflorida.com', sourceLabel: 'Policy Release', aiConfidence: 96 }
        ],
        finance: {
          totalRaised: 14200000,
          totalSpent: 9800000,
          cashOnHand: 4400000,
          pacSupport: 15,
          individualSupport: 85,
          asOf: 'July 31, 2026',
          topDonors: [{ name: 'DSCC Grassroots Victory Fund', amount: 100000, isPac: true }]
        },
        aiSocialAnalysis: {
          overallTone: 'Progressive Reform',
          engagementRate: '5.4%',
          keyThemes: ['Property Insurance', 'Social Security', 'Everglades Restoration', 'Reproductive Rights'],
          topPlatformClaims: [{ platform: 'Twitter/X', claim: 'Everglades restoration received record federal funding under 116th Congress.', factCheck: 'Confirmed in WRDA legislation grants.', status: 'Verified' }],
          aiSummary: 'Focuses heavily on property insurance reform, healthcare access, and Everglades conservation.'
        },
        userVotesCount: 380
      }
    ]
  }
];

export const southFloridaBallotMeasures: BallotMeasureRecord[] = [
  {
    id: 'measure-mdc-1',
    measureNumber: 'County Referendum No. 1',
    title: 'Miami-Dade County Rapid Transit Extension Bond Issue',
    electionId: 'fl-primary-2026',
    jurisdiction: 'Miami-Dade County',
    officialWording: 'Shall Miami-Dade County issue General Obligation Bonds in a principal amount not exceeding $250,000,000 to finance the expansion of zero-emission rapid transit corridors, smart traffic signaling, and pedestrian safety infrastructure throughout the county, backed by ad valorem taxes?',
    plainLanguageSummary: 'This referendum authorizes the county to borrow $250 Million through bond sales to build new rapid transit lines and upgrade traffic signals across Miami-Dade.',
    whatYesMeans: 'A YES vote approves issuing $250M in bonds for transit expansion, costing the average homeowner approximately $14 per year in property tax.',
    whatNoMeans: 'A NO vote rejects the bond issue, keeping property tax rates unchanged and requiring county transit projects to rely on existing revenues.',
    fiscalImpact: '$250M principal plus interest over 20 years; estimated $14.20/yr per $100k assessed property value.',
    sponsor: 'Miami-Dade County Board of County Commissioners',
    supportingOrgs: ['Transit Alliance Miami', 'Greater Miami Chamber of Commerce', 'Sierra Club Miami'],
    opposingOrgs: ['Miami Taxpayers Association', 'Citizens for Responsible Spending'],
    raisedInFavor: 185000,
    raisedInOpposition: 42000
  },
  {
    id: 'measure-fl-amendment-1',
    measureNumber: 'Constitutional Amendment 1',
    title: 'Florida Clean Waterways & Coastal Resilience Fund',
    electionId: 'fl-general-2026',
    jurisdiction: 'State of Florida',
    officialWording: 'Proposing an amendment to the State Constitution to dedicate 1% of annual documentary stamp tax revenues directly to the Protection of Water Resources and Everglades Restoration Fund.',
    plainLanguageSummary: 'Dedicates a fixed percentage of existing real estate transfer taxes directly into coastal protection and clean water infrastructure without raising taxes.',
    whatYesMeans: 'A YES vote locks in permanent state funding for clean water, lagoon cleanup, and Everglades restoration.',
    whatNoMeans: 'A NO vote leaves funding decisions for water infrastructure to annual legislative budget negotiations.',
    fiscalImpact: 'Reallocates approximately $180M annually from general revenues to dedicated environmental protection.',
    sponsor: 'Florida Water Defenders Committee',
    supportingOrgs: ['Everglades Foundation', 'Biscayne Bay Keepers', 'Florida Wildlife Federation'],
    opposingOrgs: ['Americans for Prosperity - Florida'],
    raisedInFavor: 3200000,
    raisedInOpposition: 410000
  }
];

// --------------------------------------------------------------------------
// 4 HERMES ELECTION ORCHESTRATION NODES (South Florida Focus)
// --------------------------------------------------------------------------

export const hermesElectionNodes: HermesNodeStatus[] = [
  {
    id: 'hermes-elections-node-1',
    name: 'Node 1: Campaign Promises & Stance Discovery',
    type: 'Stances & Promises',
    focusRegion: 'South Florida (Miami-Dade / Broward / Palm Beach / Monroe)',
    status: 'ACTIVE',
    candidatesScanned: 42,
    dataPointsIngested: 1840,
    lastScanTime: '12 SECS AGO',
    confidenceScore: 98.4
  },
  {
    id: 'hermes-elections-node-2',
    name: 'Node 2: Candidate Background, Family & Legal Disclosures',
    type: 'Background & Legal',
    focusRegion: 'South Florida (Miami-Dade / Broward / Palm Beach / Monroe)',
    status: 'ACTIVE',
    candidatesScanned: 42,
    dataPointsIngested: 620,
    lastScanTime: '24 SECS AGO',
    confidenceScore: 99.1
  },
  {
    id: 'hermes-elections-node-3',
    name: 'Node 3: AI Social Media & Stance Sentiment Analyzer',
    type: 'AI Social Analysis',
    focusRegion: 'South Florida (Miami-Dade / Broward / Palm Beach / Monroe)',
    status: 'ACTIVE',
    candidatesScanned: 42,
    dataPointsIngested: 4120,
    lastScanTime: '4 SECS AGO',
    confidenceScore: 96.8
  },
  {
    id: 'hermes-elections-node-4',
    name: 'Node 4: Campaign Finance, Donors & User Polling Feed',
    type: 'Finance & Polling',
    focusRegion: 'South Florida (Miami-Dade / Broward / Palm Beach / Monroe)',
    status: 'ACTIVE',
    candidatesScanned: 42,
    dataPointsIngested: 2950,
    lastScanTime: '8 SECS AGO',
    confidenceScore: 99.6
  }
];

// --------------------------------------------------------------------------
// NATIONAL STATE COVERAGE REGISTRY (50 STATES + US TERRITORIES)
// --------------------------------------------------------------------------

export const nationalStateCoverage: StateCoverageRecord[] = [
  { stateCode: 'FL', stateName: 'Florida', region: 'South / Southeast', coverageLevel: 'HIGH', activeRacesCount: 22, verifiedSeatsCount: 22450, registeredVoters: '14.4M', nextMajorElection: 'Aug 18, 2026', topCounty: 'Miami-Dade' },
  { stateCode: 'CA', stateName: 'California', region: 'West', coverageLevel: 'EXPANDING', activeRacesCount: 54, verifiedSeatsCount: 420, registeredVoters: '22.1M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Los Angeles' },
  { stateCode: 'TX', stateName: 'Texas', region: 'South / Central', coverageLevel: 'EXPANDING', activeRacesCount: 38, verifiedSeatsCount: 310, registeredVoters: '17.9M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Harris' },
  { stateCode: 'NY', stateName: 'New York', region: 'Northeast', coverageLevel: 'EXPANDING', activeRacesCount: 31, verifiedSeatsCount: 280, registeredVoters: '13.2M', nextMajorElection: 'Nov 3, 2026', topCounty: 'New York' },
  { stateCode: 'OH', stateName: 'Ohio', region: 'Midwest', coverageLevel: 'INGESTING', activeRacesCount: 18, verifiedSeatsCount: 140, registeredVoters: '8.0M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Cuyahoga' },
  { stateCode: 'PA', stateName: 'Pennsylvania', region: 'Northeast', coverageLevel: 'INGESTING', activeRacesCount: 24, verifiedSeatsCount: 210, registeredVoters: '8.7M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Philadelphia' },
  { stateCode: 'GA', stateName: 'Georgia', region: 'Southeast', coverageLevel: 'INGESTING', activeRacesCount: 20, verifiedSeatsCount: 165, registeredVoters: '7.8M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Fulton' },
  { stateCode: 'NC', stateName: 'North Carolina', region: 'Southeast', coverageLevel: 'INGESTING', activeRacesCount: 19, verifiedSeatsCount: 155, registeredVoters: '7.4M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Wake' },
  { stateCode: 'MI', stateName: 'Michigan', region: 'Midwest', coverageLevel: 'INGESTING', activeRacesCount: 17, verifiedSeatsCount: 145, registeredVoters: '8.2M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Wayne' },
  { stateCode: 'AZ', stateName: 'Arizona', region: 'West', coverageLevel: 'PLANNED', activeRacesCount: 12, verifiedSeatsCount: 110, registeredVoters: '4.2M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Maricopa' },
  { stateCode: 'NV', stateName: 'Nevada', region: 'West', coverageLevel: 'PLANNED', activeRacesCount: 10, verifiedSeatsCount: 85, registeredVoters: '1.9M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Clark' },
  { stateCode: 'WI', stateName: 'Wisconsin', region: 'Midwest', coverageLevel: 'PLANNED', activeRacesCount: 11, verifiedSeatsCount: 95, registeredVoters: '3.6M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Milwaukee' },
  { stateCode: 'IL', stateName: 'Illinois', region: 'Midwest', coverageLevel: 'PLANNED', activeRacesCount: 22, verifiedSeatsCount: 190, registeredVoters: '8.1M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Cook' },
  { stateCode: 'VA', stateName: 'Virginia', region: 'Mid-Atlantic', coverageLevel: 'PLANNED', activeRacesCount: 15, verifiedSeatsCount: 130, registeredVoters: '6.1M', nextMajorElection: 'Nov 3, 2026', topCounty: 'Fairfax' },
  { stateCode: 'PR', stateName: 'Puerto Rico', region: 'Territory', coverageLevel: 'PLANNED', activeRacesCount: 8, verifiedSeatsCount: 60, registeredVoters: '2.2M', nextMajorElection: 'Nov 3, 2026', topCounty: 'San Juan' }
];

// --------------------------------------------------------------------------
// CAMPAIGN AD INTELLIGENCE RECORDS (E5 Campaign Ad Agent Extraction)
// --------------------------------------------------------------------------

export const sampleCampaignAds: CampaignAdRecord[] = [
  {
    id: 'ad-cava-homes-001',
    candidateSlug: 'daniella-levine-cava',
    candidateName: 'Daniella Levine Cava',
    sponsor: 'Daniella Levine Cava Campaign Committee',
    sponsorType: 'Campaign Committee',
    adTitle: 'Building Affordable Housing Across Miami-Dade',
    adText: 'Under the HOMES Plan, we invested $85M in workforce housing and provided $12M in emergency homeowner tax relief. We are protecting Biscayne Bay and expanding transit line connections for every neighborhood.',
    platform: 'Digital',
    firstObserved: '2026-06-12',
    lastObserved: '2026-08-10',
    spendRange: '$45,000 - $60,000',
    impressions: '1.2M - 1.8M',
    extractedPromises: [
      'Expand HOMES Plan funding to $120M in 2027 budget',
      'Deploy 50 zero-emission electric buses on South Dade TransitWay',
      'Freeze residential property tax millage rate for 2027'
    ],
    claims: [
      '$85M invested in workforce housing units',
      '$12M direct emergency homeowner tax relief deployed',
      'Over 2,400 affordable housing units completed or under construction'
    ],
    isSupportive: true,
    evidenceUrl: 'https://adstransparency.google.com/advertiser/AR00018249'
  },
  {
    id: 'ad-cava-tv-002',
    candidateSlug: 'daniella-levine-cava',
    candidateName: 'Daniella Levine Cava',
    sponsor: 'Daniella Levine Cava Campaign Committee',
    sponsorType: 'Campaign Committee',
    adTitle: 'Clean Water & Biscayne Bay Resilience',
    adText: 'Biscayne Bay is our community’s lifeline. We appointed Miami-Dade’s first Chief Bay Officer, converted thousands of septic tanks to sewer, and preserved 4,000 acres of green space.',
    platform: 'TV',
    firstObserved: '2026-07-01',
    lastObserved: '2026-08-11',
    spendRange: '$120,000 - $180,000',
    impressions: '3.4M - 4.1M',
    extractedPromises: [
      'Eliminate 10,000 high-risk septic tanks by 2028',
      'Allocate $50M annually to Biscayne Bay water quality monitoring'
    ],
    claims: [
      'First Chief Bay Officer appointed in Miami-Dade history',
      '4,000 acres of coastal wetlands permanently protected'
    ],
    isSupportive: true,
    evidenceUrl: 'https://youtube.com/watch?v=sample_cava_ad'
  },
  {
    id: 'ad-cava-opp-003',
    candidateSlug: 'daniella-levine-cava',
    candidateName: 'Daniella Levine Cava',
    sponsor: 'Accountable Miami-Dade Super PAC',
    sponsorType: 'Super PAC',
    adTitle: 'Questions on County Budget Growth',
    adText: 'County government expenditures have grown over the past three years. Homeowners need stronger tax rate reductions to offset rising property valuations and insurance costs.',
    platform: 'Social',
    firstObserved: '2026-07-15',
    lastObserved: '2026-08-08',
    spendRange: '$15,000 - $25,000',
    impressions: '450K - 600K',
    extractedPromises: [],
    claims: [
      'County budget expanded from $9B to $11.7B',
      'Property valuations increased countywide'
    ],
    isSupportive: false,
    evidenceUrl: 'https://facebook.com/ads/library/sample_cava_opp'
  },
  {
    id: 'ad-suarez-city-001',
    candidateSlug: 'francis-suarez',
    candidateName: 'Francis Suarez',
    sponsor: 'Suarez for Miami Committee',
    sponsorType: 'Campaign Committee',
    adTitle: 'Lowest Millage Rate in 50 Years',
    adText: 'We lowered the City of Miami municipal property tax rate to the lowest level in over 50 years while creating thousands of tech and financial sector jobs.',
    platform: 'Digital',
    firstObserved: '2026-06-20',
    lastObserved: '2026-08-09',
    spendRange: '$30,000 - $45,000',
    impressions: '850K - 1.1M',
    extractedPromises: [
      'Maintain lowest municipal property tax millage rate in South Florida',
      'Expand City of Miami Police Department by 50 additional officers'
    ],
    claims: [
      'Municipal tax rate reduced to lowest level since 1964',
      'Over 12,000 high-wage technology jobs created in Miami'
    ],
    isSupportive: true,
    evidenceUrl: 'https://adstransparency.google.com/advertiser/AR0002910'
  }
];

// --------------------------------------------------------------------------
// DETAILED POLLING RECORDS (E7 Polling & E8 Poll Quality Agent Extraction)
// --------------------------------------------------------------------------

export const sampleDetailedPolls: PollingDetailRecord[] = [
  {
    id: 'poll-miami-mayor-2026-01',
    raceId: 'race-miami-dade-commissioner-d7',
    pollster: 'Mason-Dixon Polling & Strategy',
    sponsor: 'South Florida Civic Research Consortium',
    fieldDates: 'August 1 - August 5, 2026',
    sampleSize: 625,
    populationType: 'Likely Voters',
    methodology: 'Live Telephone Interviews (Cellular & Landline) + Web Panel',
    marginOfError: '±3.9%',
    publicationDate: '2026-08-07',
    grade: 'A+',
    results: [
      { candidateSlug: 'daniella-levine-cava', candidateName: 'Daniella Levine Cava', percentage: 52 },
      { candidateSlug: 'francis-suarez', candidateName: 'Francis Suarez', percentage: 38 }
    ],
    undecidedPercentage: 10,
    sourceUrl: 'https://mason-dixon.com/polls/florida-august-2026'
  },
  {
    id: 'poll-miami-mayor-2026-02',
    raceId: 'race-miami-dade-commissioner-d7',
    pollster: 'Florida International University Public Policy Institute',
    sponsor: 'FIU School of International & Public Affairs',
    fieldDates: 'July 18 - July 24, 2026',
    sampleSize: 800,
    populationType: 'Registered Voters',
    methodology: 'Random Digit Dialing (RDD) Telephone Survey in English & Spanish',
    marginOfError: '±3.5%',
    publicationDate: '2026-07-28',
    grade: 'A',
    results: [
      { candidateSlug: 'daniella-levine-cava', candidateName: 'Daniella Levine Cava', percentage: 50 },
      { candidateSlug: 'francis-suarez', candidateName: 'Francis Suarez', percentage: 39 }
    ],
    undecidedPercentage: 11,
    sourceUrl: 'https://sipa.fiu.edu/research/polls/2026'
  }
];

// --------------------------------------------------------------------------
// CAMPAIGN MESSAGE TIMELINE RECORDS (E10 Message Change Agent)
// --------------------------------------------------------------------------

export const sampleCandidateTimelines: TimelineEventRecord[] = [
  {
    id: 'evt-cava-01',
    candidateSlug: 'daniella-levine-cava',
    date: 'Jan 15, 2026',
    title: 'Official Qualification & Campaign Filing',
    eventType: 'Filed',
    description: 'Submitted official qualification paperwork to the Miami-Dade Supervisor of Elections.',
    evidenceUrl: 'https://www.miamidade.gov/elections/candidate-filings',
    evidenceHash: 'sha256_evt_cava_filed_001'
  },
  {
    id: 'evt-cava-02',
    candidateSlug: 'daniella-levine-cava',
    date: 'Feb 10, 2026',
    title: 'HOMES Plan 2.0 Housing Platform Unveiled',
    eventType: 'Policy Release',
    description: 'Pledged $120M workforce housing fund expansion and $15M homeowner relief program.',
    evidenceUrl: 'https://daniella.vote/homes-2.0',
    evidenceHash: 'sha256_evt_cava_homes_002'
  },
  {
    id: 'evt-cava-03',
    candidateSlug: 'daniella-levine-cava',
    date: 'May 4, 2026',
    title: 'First Digital Campaign Ad Run Launched',
    eventType: 'Ad Launch',
    description: 'Launched $50K digital ad buy highlighting Biscayne Bay Chief Bay Officer achievements.',
    evidenceUrl: 'https://adstransparency.google.com',
    evidenceHash: 'sha256_evt_cava_ad_003'
  },
  {
    id: 'evt-cava-04',
    candidateSlug: 'daniella-levine-cava',
    date: 'Jul 22, 2026',
    title: 'Q2 Campaign Finance Disclosure Submitted',
    eventType: 'Finance Report',
    description: 'Reported $2.4M total raised with over 8,200 individual donor contributions.',
    evidenceUrl: 'https://dos.elections.myflorida.com',
    evidenceHash: 'sha256_evt_cava_fin_004'
  }
];

// Helper functions
export function getRaceById(id: string): RaceRecord | undefined {
  return southFloridaRaces.find(r => r.id === id);
}

export function getCandidateBySlug(slug: string): CandidateRecord | undefined {
  for (const race of southFloridaRaces) {
    const cand = race.candidates.find(c => c.slug === slug);
    if (cand) return cand;
  }
  return undefined;
}

export function getAdsForCandidate(candidateSlug: string): CampaignAdRecord[] {
  return sampleCampaignAds.filter(ad => ad.candidateSlug === candidateSlug);
}

export function getPollsForRace(raceId: string): PollingDetailRecord[] {
  return sampleDetailedPolls.filter(p => p.raceId === raceId);
}

export function getTimelineForCandidate(candidateSlug: string): TimelineEventRecord[] {
  return sampleCandidateTimelines.filter(t => t.candidateSlug === candidateSlug);
}

export function getNationalCoverageList(): StateCoverageRecord[] {
  return nationalStateCoverage;
}

export function getBallotMeasureById(id: string): BallotMeasureRecord | undefined {
  return southFloridaBallotMeasures.find(bm => bm.id === id);
}

export function getRaceForOfficial(officialSlug: string): RaceRecord | undefined {
  return southFloridaRaces.find(r => r.incumbentSlug === officialSlug || r.candidates.some(c => c.slug === officialSlug));
}

export function getAllRaces(): RaceRecord[] {
  return southFloridaRaces;
}

export function getAllCandidatesFromAllRaces(): (CandidateRecord & { raceTitle: string; officeName: string; jurisdiction: string; governmentLevel: string })[] {
  const list: (CandidateRecord & { raceTitle: string; officeName: string; jurisdiction: string; governmentLevel: string })[] = [];
  southFloridaRaces.forEach(race => {
    race.candidates.forEach(cand => {
      list.push({
        ...cand,
        raceTitle: race.title,
        officeName: race.officeName,
        jurisdiction: race.jurisdiction,
        governmentLevel: race.governmentLevel
      });
    });
  });
  return list;
}
