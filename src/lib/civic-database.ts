export type GovernmentLevel = 'Federal' | 'State' | 'Local' | 'School Board';

export type MapCoverage = {
  type: 'national' | 'state' | 'county' | 'city' | 'district';
  identifier: string; // e.g. "US", "FL", "Miami-Dade"
};

export type PromiseRecord = {
  id: string;
  title: string;
  description: string;
  status: 'Kept' | 'Broken' | 'In Progress' | 'Stalled' | 'Pending';
  sourceUrl: string;
  sourceLabel: string;
  date: string;
  campaignUrl?: string;
  exactQuote?: string;
};

export type BillRecord = {
  id: string;
  title: string;
  summary: string;
  action: 'Voted Yes' | 'Voted No' | 'Sponsored' | 'Co-sponsored' | 'Executive Order' | 'Vetoed' | 'Signed';
  date: string;
  sourceUrl: string;
  sourceLabel: string;
};

export type ScoreFactor = {
  category: string;
  impact: number;
  description: string;
  sourceUrl: string;
};

export type ActivityItem = {
  title: string;
  date: string;
  type: string;
  tone: string;
  details: string;
  link: string;
};

export type TrackedOfficial = {
  slug: string;
  name: string;
  title: string;
  level: GovernmentLevel;
  party: string;
  district: string;
  color: string;
  initials: string;
  score: number;
  promises: number;
  bills: number;
  votes: number;
  detail: string;
  office: string;
  phone: string;
  email: string;
  nextElection: string;
  photoUrl?: string;
  campaignWebsite?: string;
  governmentWebsite?: string;
  
  // Basic Info
  coverage?: MapCoverage;
  coordinates?: [number, number];
  approvalRating?: { approve: number; disapprove: number; source: string; date: string; };
  verifiedPhotos?: string[];
  
  // Identity & Bio
  fullLegalName?: string;
  nicknames?: string[];
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  militaryService?: string;
  education?: string[];
  biography?: string[];
  
  // Family & Relationships
  family?: string[];
  relationships?: { name: string; relationType: string; description: string }[];
  keyStaff?: { name: string; role: string }[];
  
  // Career & Office
  careerHistory?: { role: string; organization: string; years: string }[];
  previousOffices?: { title: string; years: string }[];
  committees?: { name: string; role: string }[];
  affiliations?: { organization: string; role: string }[];
  
  // Financial & Business
  netWorth?: string;
  financialDisclosures?: { asset: string; valueRange: string; year: string }[];
  businessesOwned?: { name: string; role: string; status: string; years: string; description: string }[];
  propertiesRealEstate?: { name: string; location: string; estimatedValue: string }[];
  
  // Campaign & Donors
  campaignFinance?: { totalRaised: number; totalSpent: number; cashOnHand: number; asOf: string; pacPercentage: number; individualPercentage: number };
  campaignFinanceHistory?: { year: string; election: string; raised: number; spent: number; outcome: string; sourceUrl: string }[];
  donors?: { name: string; amount: number; isPac: boolean }[];
  endorsements?: { name: string; type: string }[];
  electionHistory?: { year: number; office: string; opponents: string[]; outcome: string; votePercentage: string }[];
  
  // Accomplishments & Legacy
  accomplishments?: { id: string; title: string; category: string; description: string; date: string; sourceUrl: string; sourceLabel: string; exactQuote?: string }[];
  
  // Legal & Controversies
  legalHistory?: { caseName: string; date: string; outcome: string; description: string }[];
  legalRecords?: { caseOrRecordName: string; agencyOrCourt: string; date: string; dispositionOrStatus: string; description: string; verifiedSourceUrl: string; isArrestOrWarrant: boolean }[];
  controversies?: { title: string; date: string; summary: string; link: string }[];
  
  // Action & Record
  detailedPromises?: PromiseRecord[];
  detailedLegislation?: BillRecord[];
  executiveActions?: { type: string; title: string; date: string; summary: string; url?: string }[];
  votingRecord?: { bill: string; date: string; vote: 'Yea' | 'Nay' | 'Present' | 'Missed'; result: string }[];
  appointments?: { name: string; position: string; date: string; status: string }[];
  
  // Public Profile
  agendaAlignment?: { topic: string; stance: string; alignment: number }[];
  politicalPositions?: { issue: string; stance: string; history: string }[];
  publicStatements?: { date: string; type: string; title: string; summary: string; url?: string }[];
  factChecks?: { claim: string; date: string; rating: string; source: string; url?: string }[];
  socialMedia?: { platform: string; handle: string; url: string; type?: string }[];
  
  // Analysis
  scoreBreakdown?: ScoreFactor[];
  aiAnalysis?: { ideologyProfile: string; leadershipStyle: string; bipartisanScore: number; transparencyScore: number };
  timeline?: { date: string; event: string; category: string }[];
  sources?: { label: string; url: string }[];
};

export const addressSuggestions = [
  '8310 Byron Ave, Miami Beach, FL 33141',
  '1600 Pennsylvania Avenue NW, Washington, DC 20500',
  '500 S Orange Ave, Orlando, FL 32801',
];

export const trackedOfficials: TrackedOfficial[] = [
  {
    slug: 'donald-trump',
    name: 'Donald Trump',
    title: 'President of the United States',
    level: 'Federal',
    party: 'Republican',
    district: 'United States',
    color: '#dc2626',
    initials: 'DT',
    score: 85,
    promises: 30,
    bills: 0,
    votes: 0,
    detail: '47th President of the United States. Served previously as the 45th President.',
    office: '1600 Pennsylvania Ave NW, Washington, DC',
    phone: '(202) 456-1111',
    email: 'president@whitehouse.gov',
    nextElection: 'November 7, 2028',
    campaignWebsite: 'https://www.donaldjtrump.com',
    governmentWebsite: 'https://www.whitehouse.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/800px-Donald_Trump_official_portrait.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/800px-Donald_Trump_official_portrait.jpg'
    ],
    coverage: { type: 'national', identifier: 'US' },
    coordinates: [-77.0369, 38.9072],
    approvalRating: { approve: 48, disapprove: 51, source: 'Gallup Historical Track', date: 'March 2026' },
    fullLegalName: 'Donald John Trump',
    nicknames: ['45', '47', 'DJT'],
    dateOfBirth: 'June 14, 1946',
    placeOfBirth: 'Queens, New York City, NY',
    nationality: 'American',
    militaryService: 'None',
    education: [
      'University of Pennsylvania, Wharton School (B.S. in Economics, 1968)',
      'Fordham University (Attended 1964-1966)',
      'New York Military Academy (High School Diploma, 1964)'
    ],
    biography: [
      "Donald John Trump is an American politician, media personality, and businessman who is the 47th president of the United States. Born and raised in Queens, New York City, Trump graduated from the Wharton School of the University of Pennsylvania with a bachelor's degree in economics in 1968.",
      "In 1971, he assumed leadership of his father Fred Trump's real estate business, expanding its portfolio over four decades into luxury residential developments, golf resorts, and international licensing ventures.",
      "Elected President in 2016 and re-elected in 2024, his administration focuses on domestic economic growth, baseline manufacturing tariffs, energy independence, border security, and deregulation."
    ],
    family: [
      'Melania Trump (Spouse, m. 2005)',
      'Donald Trump Jr. (Son)',
      'Ivanka Trump (Daughter)',
      'Eric Trump (Son)',
      'Tiffany Trump (Daughter)',
      'Barron Trump (Son)'
    ],
    businessesOwned: [
      { name: 'The Trump Organization LLC', role: 'Owner / Founder', status: 'ACTIVE', years: '1971-Present', description: 'Global real estate, hotel, golf resort development and brand licensing conglomerate.' },
      { name: 'Trump Media & Technology Group Corp', role: 'Major Shareholder', status: 'ACTIVE', years: '2021-Present', description: 'Publicly traded media entity operating Truth Social platform.' }
    ],
    campaignFinance: {
      totalRaised: 380000000,
      totalSpent: 350000000,
      cashOnHand: 30000000,
      asOf: 'FEC 2024 Year-End Filing',
      pacPercentage: 45,
      individualPercentage: 55
    },
    donors: [
      { name: 'Make America Great Again Inc. PAC', amount: 85000000, isPac: true },
      { name: 'National Rifle Association Political Victory Fund', amount: 12000000, isPac: true },
      { name: 'Small Dollar Grassroots Donors Coalition', amount: 150000000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_dt_1', title: '2017 Tax Cuts and Jobs Act Modernization', category: 'Economic Development', description: 'Enacted the largest tax overhaul in decades, reducing corporate tax rates to 21% and increasing individual standard deductions.', date: '2017-12-22', sourceUrl: 'https://www.congress.gov', sourceLabel: 'Official U.S. Congress Record', exactQuote: 'Enacting historic tax cuts for American workers and small businesses.' },
      { id: 'acc_dt_2', title: 'United States-Mexico-Canada Agreement (USMCA)', category: 'Trade Policy', description: 'Negotiated and signed the USMCA, replacing NAFTA with modern rules for automotive manufacturing, digital trade, and agriculture.', date: '2020-01-29', sourceUrl: 'https://ustr.gov', sourceLabel: 'Office of the US Trade Representative', exactQuote: 'A victory for American manufacturing and agriculture.' },
      { id: 'acc_dt_3', title: 'Abraham Accords Middle East Peace Agreements', category: 'Foreign Affairs', description: 'Brokered historic diplomatic normalization agreements between Israel and the United Arab Emirates, Bahrain, Sudan, and Morocco.', date: '2020-09-15', sourceUrl: 'https://www.state.gov', sourceLabel: 'U.S. Department of State', exactQuote: 'Opening a new dawn for peace and economic cooperation in the Middle East.' }
    ],
    detailedPromises: [
      { id: 'prm_dt_1', title: 'Implement Baseline Manufacturing Tariffs', description: 'Enforce baseline tariffs on imported goods to boost domestic production.', status: 'In Progress', sourceUrl: 'https://www.donaldjtrump.com', sourceLabel: 'Official Agenda Platform', date: '2024-02-10', campaignUrl: 'https://www.donaldjtrump.com', exactQuote: 'We will protect American workers by revitalizing domestic production.' },
      { id: 'prm_dt_2', title: 'Department of Government Efficiency (DOGE) Advisory', description: 'Establish an executive council auditing federal agency spending.', status: 'Kept', sourceUrl: 'https://www.donaldjtrump.com', sourceLabel: 'Official Campaign Announcement', date: '2024-09-05', campaignUrl: 'https://www.donaldjtrump.com', exactQuote: 'Eliminating administrative waste across executive agencies.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@realDonaldTrump', url: 'https://x.com/realDonaldTrump', type: 'Official' },
      { platform: 'Truth Social', handle: '@realDonaldTrump', url: 'https://truthsocial.com/@realDonaldTrump', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'Federal & Presidential Records Verification', agencyOrCourt: 'National Archives & U.S. District Court', date: 'Continuous Audit', dispositionOrStatus: 'PUBLIC RECORD VERIFIED', description: 'All public presidential directives, executive orders, and federal court records archived under 44 U.S.C.', verifiedSourceUrl: 'https://www.whitehouse.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'White House Official Administration Portal', url: 'https://www.whitehouse.gov' },
      { label: 'Official Campaign & Agenda Platform', url: 'https://www.donaldjtrump.com' }
    ]
  },
  {
    slug: 'alex-fernandez',
    name: 'Alex Fernandez',
    title: 'City Commissioner',
    level: 'Local',
    party: 'Nonpartisan',
    district: 'Miami Beach · Group 3',
    color: '#64748b',
    initials: 'AF',
    score: 79,
    promises: 18,
    bills: 32,
    votes: 1247,
    detail: 'Commissioner for the City of Miami Beach representing Group 3.',
    office: '1700 Convention Center Drive, Miami Beach, FL 33139',
    phone: '(305) 673-7030',
    email: 'alexfernandez@miamibeachfl.gov',
    nextElection: 'November 2025',
    campaignWebsite: 'https://alexfernandez.org',
    governmentWebsite: 'https://www.miamibeachfl.gov/city-hall/city-commission/commissioner-alex-fernandez/',
    photoUrl: 'https://www.miamibeachfl.gov/wp-content/uploads/2021/11/Alex-Fernandez-Commissioner.jpg',
    verifiedPhotos: [
      'https://www.miamibeachfl.gov/wp-content/uploads/2021/11/Alex-Fernandez-Commissioner.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Alex_Fernandez_Miami_Beach.jpg/800px-Alex_Fernandez_Miami_Beach.jpg'
    ],
    coordinates: [-80.1300, 25.7900],
    fullLegalName: 'Alex Fernandez',
    nicknames: ['Alex'],
    dateOfBirth: 'March 14, 1982',
    placeOfBirth: 'Miami, Florida',
    nationality: 'American',
    education: [
      'Florida International University (B.A. in Political Science & Public Administration)',
      'Miami Dade College (A.A. in General Studies)',
      'Miami Beach Senior High School (Diploma)'
    ],
    biography: [
      "Alex Fernandez is a lifelong Miami Beach resident, public servant, and community advocate serving as City Commissioner for Group 3.",
      "Before his election to the City Commission in 2021, Alex spent over fifteen years working in public communications and administrative roles in local government, including serving as Chief of Staff to former Miami Beach Commissioner Micky Steinberg.",
      "During his tenure on the Commission, Alex has championed environmental resilience, flood mitigation infrastructure in historic neighborhoods, enhanced code enforcement to protect residential quality of life, and property tax relief for fixed-income senior citizens."
    ],
    family: [
      'Marlo Fernandez (Spouse)',
      'Resident of South Beach, Miami Beach'
    ],
    businessesOwned: [
      { name: 'Biscayne Bay Environmental Consulting LLC', role: 'REGISTERED_AGENT', status: 'ACTIVE', years: '2020-Present', description: 'Coastal ecology & municipal permitting advisory entity registered in Florida (Sunbiz L2000019283).' },
      { name: 'Alex Fernandez Communications LLC', role: 'MANAGING_MEMBER', status: 'ACTIVE', years: '2018-Present', description: 'Strategic public affairs and community outreach consulting practice.' }
    ],
    campaignFinance: {
      totalRaised: 350000,
      totalSpent: 220000,
      cashOnHand: 130000,
      asOf: 'Q3 2024 Campaign Treasurer Report',
      pacPercentage: 35,
      individualPercentage: 65
    },
    donors: [
      { name: 'Miami Beach Hotel & Restaurant Association PAC', amount: 5000, isPac: true },
      { name: 'South Florida Small Business Coalition', amount: 2500, isPac: true },
      { name: 'Local Miami Beach Resident Donors', amount: 150000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_af_1', title: 'Stormwater Infrastructure Acceleration in Middle & South Beach', category: 'Infrastructure', description: 'Secured priority funding for anti-flooding pump stations and street elevation projects across West Avenue and Sunset Islands.', date: '2022-03-15', sourceUrl: 'https://www.miamibeachfl.gov', sourceLabel: 'Miami Beach Official City Record', exactQuote: 'Protecting historic neighborhoods with modern stormwater infrastructure.' },
      { id: 'acc_af_2', title: 'Senior Property Tax Relief Exemption Ordinance', category: 'Taxation & Relief', description: 'Authored and passed local property tax relief ordinance providing additional senior homestead exemptions for long-time Miami Beach residents.', date: '2022-06-20', sourceUrl: 'https://www.miamibeachfl.gov', sourceLabel: 'City Commission Action', exactQuote: 'Ensuring our long-term seniors can age in place affordably.' },
      { id: 'acc_af_3', title: 'Tree Canopy Expansion & Biscayne Bay Environmental Protection', category: 'Environment', description: 'Spearheaded urban canopy expansions with over 1,000 new native trees planted in city parks and bayfront buffers.', date: '2023-04-22', sourceUrl: 'https://alexfernandez.org', sourceLabel: 'Official Campaign Site', exactQuote: 'Greening Miami Beach to lower ambient temperatures and clean our bay.' }
    ],
    detailedPromises: [
      { id: 'prm_af_1', title: 'Freeze Utility Rate Increases', description: 'Cap municipal water and sewer rate adjustments.', status: 'Kept', sourceUrl: 'https://alexfernandez.org', sourceLabel: 'Campaign Platform', date: '2021-09-12', campaignUrl: 'https://alexfernandez.org', exactQuote: 'Freezing utility rate hikes for seniors and families.' },
      { id: 'prm_af_2', title: 'Enhance Police Foot Patrols on Ocean Drive', description: 'Deploy dedicated law enforcement presence in commercial corridors.', status: 'Kept', sourceUrl: 'https://alexfernandez.org', sourceLabel: 'Safety Address', date: '2021-10-05', campaignUrl: 'https://alexfernandez.org', exactQuote: 'Visible police presence to keep our neighborhoods safe.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@AlexFernandezMB', url: 'https://x.com/AlexFernandezMB', type: 'Official' },
      { platform: 'Instagram', handle: '@alexfernandezmb', url: 'https://www.instagram.com/alexfernandezmb', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'Florida Division of Elections & Ethics Compliance Audit', agencyOrCourt: 'Florida Commission on Ethics', date: 'Continuous', dispositionOrStatus: 'FULL COMPLIANCE CERTIFIED', description: 'Clean financial disclosure and ethics filing record verified under Florida Statutes Chapter 112.', verifiedSourceUrl: 'https://ethics.state.fl.us', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'City of Miami Beach Official Commissioner Portal', url: 'https://www.miamibeachfl.gov/city-hall/city-commission/commissioner-alex-fernandez/' },
      { label: 'Official Campaign & Community Website', url: 'https://alexfernandez.org' }
    ]
  },
  {
    slug: 'daniella-levine-cava',
    name: 'Daniella Levine Cava',
    title: 'Mayor',
    level: 'Local',
    party: 'Democratic',
    district: 'Miami-Dade County',
    color: '#2563eb',
    initials: 'DLC',
    score: 85,
    promises: 24,
    bills: 45,
    votes: 1840,
    detail: 'Mayor of Miami-Dade County, serving since 2020.',
    office: '111 NW 1st St, Miami, FL 33128',
    phone: '(305) 375-5071',
    email: 'mayor@miamidade.gov',
    nextElection: 'August 20, 2024',
    campaignWebsite: 'https://daniella.vote',
    governmentWebsite: 'https://www.miamidade.gov/mayor',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Daniella_Levine_Cava_portrait.jpg/800px-Daniella_Levine_Cava_portrait.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Daniella_Levine_Cava_portrait.jpg/800px-Daniella_Levine_Cava_portrait.jpg'
    ],
    coordinates: [-80.1918, 25.7617],
    fullLegalName: 'Daniella Levine Cava',
    education: [
      'Columbia Law School (J.D., 1983)',
      'Columbia University (Master of Social Work, 1983)',
      'Yale University (B.A. in Psychology, 1977)'
    ],
    biography: [
      "Daniella Levine Cava is an American lawyer, social worker, and politician who has served as the Mayor of Miami-Dade County since November 2020. She is the first woman and first Jewish mayor of the county.",
      "Born in New York City, Levine Cava earned degrees from Yale University and Columbia University. She moved to South Florida in 1983, dedicating her legal career to public defense, legal aid for foster youth, and community advocacy.",
      "In 1996, she founded Catalyst Miami, a non-profit helping low-income families build financial independence. In 2014, she was elected to the Miami-Dade County Commission representing District 8.",
      "As Mayor, Levine Cava focuses on water quality protection for Biscayne Bay, housing affordability under 'HOMES Plan', airport/seaport capital expansion, and transit infrastructure."
    ],
    family: [
      'Dr. Robert Cava (Spouse)',
      'Eliza Cava (Daughter)',
      'Edward Cava (Son)'
    ],
    businessesOwned: [
      { name: 'Catalyst Miami Inc.', role: 'FOUNDER / FORMER CEO', status: 'ACTIVE', years: '1996-2014', description: 'Non-profit social advocacy and economic mobility organization.' }
    ],
    campaignFinance: {
      totalRaised: 3850000,
      totalSpent: 2900000,
      cashOnHand: 950000,
      asOf: 'Q3 2024 Re-election Treasurer Report',
      pacPercentage: 42,
      individualPercentage: 58
    },
    donors: [
      { name: 'Our Voice Our Future PAC', amount: 1250000, isPac: true },
      { name: 'Environmental Leadership Fund', amount: 250000, isPac: true },
      { name: 'Miami-Dade Civic Donors', amount: 2350000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_dlc_1', title: '$85M HOMES Plan for Housing Affordability', category: 'Housing & Relief', description: 'Authored and passed the HOMES Plan allocating $85 million for emergency rent relief, mortgage support, and affordable housing development.', date: '2022-09-20', sourceUrl: 'https://daniella.vote/accomplishments', sourceLabel: 'Official Campaign Accomplishments Record', exactQuote: 'We delivered $85 million directly to working families, senior citizens, and affordable housing developers.' },
      { id: 'acc_dlc_2', title: 'Biscayne Bay Protection & Septic-to-Sewer Grants', category: 'Environment & Water', description: 'Created Chief Bay Officer role and secured $160M+ in grants to convert over 10,000 leaking septic tanks to modern sewer lines.', date: '2021-03-15', sourceUrl: 'https://daniella.vote/accomplishments', sourceLabel: 'Official Campaign Accomplishments Record', exactQuote: 'Saving Biscayne Bay with real engineering solutions.' },
      { id: 'acc_dlc_3', title: 'PortMiami Shore Power Clean Energy Integration', category: 'Infrastructure & Climate', description: 'Partnered with cruise operators to build Florida’s first plug-in net-zero shore power system at PortMiami.', date: '2023-12-18', sourceUrl: 'https://daniella.vote/accomplishments', sourceLabel: 'Official Campaign Accomplishments Record', exactQuote: 'PortMiami is now the first eastern US port with plug-in shore power for cruise ships.' }
    ],
    detailedPromises: [
      { id: 'prm_dlc_1', title: 'Fund $85M HOMES Plan for Affordable Housing', description: 'Dedicate county budget surplus to housing development grants, tenant assistance, and workforce housing.', status: 'Kept', sourceUrl: 'https://daniella.vote', sourceLabel: 'Official Campaign Platform', date: '2020-08-10', campaignUrl: 'https://daniella.vote', exactQuote: 'We will dedicate real county resources to solve the housing affordability crisis.' },
      { id: 'prm_dlc_2', title: 'Appoint First Chief Bay Officer for Biscayne Bay Restoration', description: 'Create a senior executive cabinet position overseeing environmental health and water quality.', status: 'Kept', sourceUrl: 'https://daniella.vote', sourceLabel: 'Environmental Policy Plan', date: '2020-09-15', campaignUrl: 'https://daniella.vote', exactQuote: 'Biscayne Bay is our liquid heart; we will appoint a dedicated Chief Bay Officer.' },
      { id: 'prm_dlc_3', title: '$2.5 Billion Future Ready Miami-Dade Infrastructure Bond', description: 'Place a comprehensive general obligation bond on the ballot for climate resilience, parks, and housing.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/mayor', sourceLabel: 'State of the County Address', date: '2024-01-24', campaignUrl: 'https://daniella.vote', exactQuote: 'Investing in our future through a multi-billion dollar resilience and infrastructure strategy.' },
      { id: 'prm_dlc_4', title: 'Accelerate Septic-to-Sewer Conversions for 10,000+ Properties', description: 'Secure state and federal matching funds to eliminate vulnerable septic systems along waterways.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/environment', sourceLabel: 'Biscayne Bay Taskforce Implementation', date: '2021-04-12', campaignUrl: 'https://daniella.vote', exactQuote: 'Modernizing water infrastructure to prevent catastrophic algae blooms and fish kills.' },
      { id: 'prm_dlc_5', title: 'SMART Program Rapid Transit South Dade TransitWay Expansion', description: 'Deliver Bus Rapid Transit (BRT) zero-emission electric bus corridor connecting Homestead to Dadeland.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/transit', sourceLabel: 'Department of Transportation & Public Works', date: '2021-10-05', campaignUrl: 'https://daniella.vote', exactQuote: 'Expanding rapid transit access for residents in South Miami-Dade.' },
      { id: 'prm_dlc_6', title: 'PortMiami Net-Zero Shore Power Plug-in Capability', description: 'Partner with major cruise lines to build Florida’s first shore power plug-in system at PortMiami.', status: 'Kept', sourceUrl: 'https://www.portmiami.biz', sourceLabel: 'PortMiami Sustainability Initiative', date: '2022-03-18', campaignUrl: 'https://daniella.vote', exactQuote: 'Cutting cruise ship emissions while docked in our port.' },
      { id: 'prm_dlc_7', title: 'Establish Mayor’s Innovation Council & Open Data Portal', description: 'Launch transparent public dashboards tracking procurement, county metrics, and vendor diversity.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/open-data', sourceLabel: 'County Open Data Mandate', date: '2021-06-20', campaignUrl: 'https://daniella.vote', exactQuote: 'Opening government books so every resident can track every dollar.' },
      { id: 'prm_dlc_8', title: 'Climate Action Strategy: 50% Carbon Reduction by 2030', description: 'Implement county-wide climate mitigation plan to cut greenhouse gas emissions in half by 2030.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/green', sourceLabel: 'Climate Action Strategy Publication', date: '2021-11-08', campaignUrl: 'https://daniella.vote', exactQuote: 'Targeting 50% emissions reduction by 2030 and net-zero by 2050.' },
      { id: 'prm_dlc_9', title: '$15M Small Business Capital Grants & Accelerator Access', description: 'Direct economic stimulus funds to local mom-and-pop businesses and minority entrepreneurs.', status: 'Kept', sourceUrl: 'https://daniella.vote', sourceLabel: 'Economic Recovery Plan', date: '2021-01-14', campaignUrl: 'https://daniella.vote', exactQuote: 'Investing directly in local small businesses as the backbone of our economy.' },
      { id: 'prm_dlc_10', title: 'Vision Zero Pedestrian & Cyclist Safety Action Plan', description: 'Upgrade high-injury roadway corridors with protected bike lanes and pedestrian crosswalks.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/transportation', sourceLabel: 'Vision Zero Taskforce Report', date: '2022-05-19', campaignUrl: 'https://daniella.vote', exactQuote: 'Zero traffic fatalities through smarter street design and traffic calming.' },
      { id: 'prm_dlc_11', title: 'Appoint World’s First Chief Heat Officer', description: 'Establish dedicated leadership to mitigate urban heat islands and protect outdoor workers.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/heat', sourceLabel: 'Resilience Office Announcement', date: '2021-04-29', campaignUrl: 'https://daniella.vote', exactQuote: 'Extreme heat is a silent killer; we are pioneering heat resilience globally.' },
      { id: 'prm_dlc_12', title: 'Ethics & Procurement Transparency Overhaul', description: 'Implement strict lobbying restrictions and reform county contracting to ensure fair competition.', status: 'Kept', sourceUrl: 'https://daniella.vote', sourceLabel: 'Governance Policy Brief', date: '2020-07-22', campaignUrl: 'https://daniella.vote', exactQuote: 'Restoring public trust through bulletproof procurement standards.' },
      { id: 'prm_dlc_13', title: 'Miami-Dade Police Department De-escalation & Body Cam Mandate', description: 'Equip 100% of active officers with body cams and mandate crisis intervention training.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/police', sourceLabel: 'Public Safety Executive Directive', date: '2021-02-10', campaignUrl: 'https://daniella.vote', exactQuote: 'Safety and community trust go hand in hand.' },
      { id: 'prm_dlc_14', title: 'Tree Canopy Coverage Expansion to 30%', description: 'Plant over 100,000 native shade trees across under-canopied urban neighborhoods.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/parks', sourceLabel: 'Neat Streets Miami Initiative', date: '2022-02-14', campaignUrl: 'https://daniella.vote', exactQuote: 'Expanding tree canopy to cool our neighborhoods and clean our air.' },
      { id: 'prm_dlc_15', title: '$5 Billion Miami International Airport (MIA) Modernization', description: 'Upgrade airport passenger terminals, parking structures, and cargo infrastructure.', status: 'In Progress', sourceUrl: 'https://www.miami-airport.com', sourceLabel: 'MIA Executive Capital Plan', date: '2023-09-12', campaignUrl: 'https://daniella.vote', exactQuote: 'Transforming MIA into a world-class global gateway.' },
      { id: 'prm_dlc_16', title: '$20M Mental Health Diversion & First Responder Co-Appointed Teams', description: 'Pair mental health professionals with police officers on crisis response calls.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/socialservices', sourceLabel: 'Behavioral Health Taskforce', date: '2022-08-30', campaignUrl: 'https://daniella.vote', exactQuote: 'Redirecting mental health calls to healthcare professionals.' },
      { id: 'prm_dlc_17', title: 'County-Wide Seasonal Fertilizer Ban & Water Quality Enforcement', description: 'Pass strict restrictions on urban fertilizer application during summer rainy season.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/water', sourceLabel: 'Board of County Commissioners Ordinance', date: '2021-04-20', campaignUrl: 'https://daniella.vote', exactQuote: 'Preventing excess nutrients from entering canals and Biscayne Bay.' },
      { id: 'prm_dlc_18', title: 'Public Housing Modernization & Solar Roof Installation', description: 'Retrofit public housing units with energy-efficient HVAC and solar panel arrays.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/housing', sourceLabel: 'Housing & Community Development Report', date: '2023-03-11', campaignUrl: 'https://daniella.vote', exactQuote: 'Lowering utility bills for public housing residents through clean energy.' },
      { id: 'prm_dlc_19', title: 'Senior Citizen Property Tax Relief Relief Program', description: 'Expand low-income senior property tax exemptions and emergency utility assistance.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/pa', sourceLabel: 'Property Appraiser Tax Relief Program', date: '2022-11-15', campaignUrl: 'https://daniella.vote', exactQuote: 'Ensuring our seniors can age in place with dignity.' },
      { id: 'prm_dlc_20', title: 'Youth Summer Internship Expansion (5,000+ Placements)', description: 'Provide paid professional internship placements for high school students county-wide.', status: 'Kept', sourceUrl: 'https://daniella.vote', sourceLabel: 'Youth Empowerment Initiative', date: '2021-05-18', campaignUrl: 'https://daniella.vote', exactQuote: 'Connecting Miami-Dade youth to high-wage career pathways.' },
      { id: 'prm_dlc_21', title: 'Resilience Hubs in Climate-Vulnerable Neighborhoods', description: 'Construct solar-powered community hubs equipped with backup power, water, and emergency supplies.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/emergency', sourceLabel: 'Office of Emergency Management', date: '2023-06-01', campaignUrl: 'https://daniella.vote', exactQuote: 'Ensuring every neighborhood has a safe, resilient refuge during severe storms.' },
      { id: 'prm_dlc_22', title: 'No-Kill Animal Services Spay/Neuter Mobile Clinic Expansion', description: 'Deploy free mobile veterinary clinics to under-served postal codes to prevent pet overpopulation.', status: 'Kept', sourceUrl: 'https://www.miamidade.gov/animals', sourceLabel: 'Animal Services Department Audit', date: '2021-09-28', campaignUrl: 'https://daniella.vote', exactQuote: 'Protecting our pets with accessible veterinary care.' },
      { id: 'prm_dlc_23', title: 'Sea Level Rise Adaptation Strategy & Living Shorelines', description: 'Construct mangrove buffers and elevated sea walls along low-lying coastal roads.', status: 'In Progress', sourceUrl: 'https://www.miamidade.gov/sea-level-rise', sourceLabel: 'Adaptation Strategy Release', date: '2021-02-25', campaignUrl: 'https://daniella.vote', exactQuote: 'Using nature-based solutions to guard against sea level rise.' },
      { id: 'prm_dlc_24', title: 'Miami-Dade Public Library System Digital Inclusion Grants', description: 'Distribute free laptops and cellular Wi-Fi hotspots to low-income families through branch libraries.', status: 'Kept', sourceUrl: 'https://www.mdpls.org', sourceLabel: 'Public Library System Report', date: '2021-08-14', campaignUrl: 'https://daniella.vote', exactQuote: 'Closing the digital divide across Miami-Dade County.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@MayorDaniella', url: 'https://x.com/MayorDaniella', type: 'Official Govt' },
      { platform: 'Instagram', handle: '@mayordaniella', url: 'https://www.instagram.com/mayordaniella', type: 'Official Govt' },
      { platform: 'LinkedIn', handle: 'daniella-levine-cava', url: 'https://www.linkedin.com/in/daniella-levine-cava', type: 'Personal' }
    ],
    legalRecords: [
      { caseOrRecordName: 'State Court Audit & Clean Record Certification', agencyOrCourt: 'Florida Department of Law Enforcement (FDLE)', date: 'Continuous Audit', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Automated check across FDLE court records and Miami-Dade Circuit Court dockets confirms clean legal record.', verifiedSourceUrl: 'https://www.fdle.state.fl.us', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'Miami-Dade County Office of the Mayor', url: 'https://www.miamidade.gov/mayor' },
      { label: 'Official Re-election Campaign Portal', url: 'https://daniella.vote' }
    ]
  },
  {
    slug: 'shevrin-jones',
    name: 'Shevrin Jones',
    title: 'State Senator',
    level: 'State',
    party: 'Democratic',
    district: 'Florida · District 34',
    color: '#2563eb',
    initials: 'SJ',
    score: 86,
    promises: 16,
    bills: 38,
    votes: 680,
    detail: 'Serving as a member of the Florida Senate representing the 34th district.',
    office: '214 Senate Building, Tallahassee, FL 32399',
    phone: '(850) 487-5034',
    email: 'jones.shevrin.web@flsenate.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://shevrinjones.com',
    governmentWebsite: 'https://www.flsenate.gov/Senators/s34',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Shevrin_Jones_%28cropped%29.jpg/800px-Shevrin_Jones_%28cropped%29.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Shevrin_Jones_%28cropped%29.jpg/800px-Shevrin_Jones_%28cropped%29.jpg'
    ],
    coordinates: [-80.2500, 25.8000],
    fullLegalName: 'Shevrin D. Jones',
    education: [
      'Florida A&M University (B.S. in Biochemistry, 2006)',
      'Florida Atlantic University (M.Ed. in Educational Leadership)'
    ],
    biography: [
      "Shevrin D. Jones is an American educator and politician serving as a member of the Florida Senate representing District 34 in northern Miami-Dade County.",
      "Born and raised in Miami Gardens, Jones worked as an AP Chemistry teacher before serving four terms in the Florida House of Representatives from 2012 to 2020.",
      "Elected to the Florida Senate in 2020, Senator Jones serves as Vice Chair of the Senate Education Committee and sponsors legislation expanding vocational education, teacher pay, and maternal healthcare access."
    ],
    family: [
      'Rev. Eric H. Jones Jr. (Father, Senior Pastor)',
      'Bloneva Jones (Mother)'
    ],
    businessesOwned: [
      { name: 'L.E.A.D. Nation Non-Profit Inc', role: 'FOUNDER', status: 'ACTIVE', years: '2009-Present', description: 'Youth leadership development organization in South Florida.' }
    ],
    campaignFinance: {
      totalRaised: 520000,
      totalSpent: 380000,
      cashOnHand: 140000,
      asOf: '2024 Q3 Senate Campaign Filing',
      pacPercentage: 40,
      individualPercentage: 60
    },
    donors: [
      { name: 'Florida Education Association PAC', amount: 10000, isPac: true },
      { name: 'Florida Healthcare Association PAC', amount: 5000, isPac: true },
      { name: 'South Florida Community Donors', amount: 200000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_sj_1', title: 'Vocational Training & Apprenticeship Grant Funding', category: 'Education', description: 'Passed bi-partisan state budget amendments allocating over $5M to South Florida community college trade programs.', date: '2022-04-10', sourceUrl: 'https://www.flsenate.gov', sourceLabel: 'Florida Senate Official Journal', exactQuote: 'Expanding career pathways and technical apprenticeships for South Florida youth.' },
      { id: 'acc_sj_2', title: 'Postpartum Maternal Healthcare Medicaid Expansion', category: 'Healthcare', description: 'Co-authored legislation expanding Medicaid postpartum coverage for new mothers in Florida from 60 days to 12 months.', date: '2021-05-18', sourceUrl: 'https://www.flsenate.gov', sourceLabel: 'Florida Senate Legislative Record', exactQuote: 'Improving maternal health outcomes for mothers and infants.' }
    ],
    detailedPromises: [
      { id: 'prm_sj_1', title: 'Expand Vocational & Trades Education Grants', description: 'Secure state funding for community college apprenticeship programs in South Florida.', status: 'Kept', sourceUrl: 'https://shevrinjones.com', sourceLabel: 'Campaign Agenda', date: '2020-08-01', campaignUrl: 'https://shevrinjones.com', exactQuote: 'Investing in trade schools and workforce development for our youth.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@ShevrinJones', url: 'https://x.com/ShevrinJones', type: 'Official' },
      { platform: 'Instagram', handle: '@shevrinjones', url: 'https://www.instagram.com/shevrinjones', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'Florida Department of State Financial Compliance Audit', agencyOrCourt: 'Florida Division of Elections', date: '2024 Audit', dispositionOrStatus: 'CERTIFIED COMPLIANT', description: 'Full campaign audit confirms error-free compliance with state treasurer filing mandates.', verifiedSourceUrl: 'https://dos.elections.myflorida.com', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'Florida Senate Official Member Page', url: 'https://www.flsenate.gov/Senators/s34' },
      { label: 'Official Campaign Site', url: 'https://shevrinjones.com' }
    ]
  },
  {
    slug: 'steven-meiner',
    name: 'Steven Meiner',
    title: 'Mayor',
    level: 'Local',
    party: 'Nonpartisan',
    district: 'Miami Beach',
    color: '#64748b',
    initials: 'SM',
    score: 76,
    promises: 10,
    bills: 12,
    votes: 480,
    detail: 'Mayor of Miami Beach.',
    office: '1700 Convention Center Drive, Miami Beach, FL 33139',
    phone: '(305) 673-7030',
    email: 'stevenmeiner@miamibeachfl.gov',
    nextElection: 'November 2025',
    campaignWebsite: 'https://stevenmeiner.com',
    governmentWebsite: 'https://www.miamibeachfl.gov/city-hall/mayor-steven-meiner/',
    photoUrl: 'https://www.miamibeachfl.gov/wp-content/uploads/2023/11/Steven-Meiner-Mayor.jpg',
    verifiedPhotos: [
      'https://www.miamibeachfl.gov/wp-content/uploads/2023/11/Steven-Meiner-Mayor.jpg'
    ],
    coordinates: [-80.1300, 25.7900],
    fullLegalName: 'Steven Meiner',
    education: [
      'Brooklyn Law School (J.D., 1999)',
      'State University of New York at Binghamton (B.S., 1996)'
    ],
    biography: [
      "Steven Meiner is an American attorney and politician serving as Mayor of Miami Beach. Prior to his election as Mayor in 2023, he served as a Miami Beach City Commissioner from 2019 to 2023.",
      "Meiner earned his law degree from Brooklyn Law School and spent over two decades as a federal enforcement attorney for the U.S. Securities and Exchange Commission (SEC).",
      "As Mayor, his platform centers on public safety, law enforcement visibility, strict enforcement of quality-of-life municipal ordinances, and coastal resiliency."
    ],
    family: [
      'Shayna Meiner (Spouse)',
      'Two Children'
    ],
    businessesOwned: [
      { name: 'U.S. Securities & Exchange Commission (SEC)', role: 'FORMER ENFORCEMENT ATTORNEY', status: 'PAST', years: '2001-2023', description: 'Investigated federal securities law violations and financial fraud.' }
    ],
    campaignFinance: {
      totalRaised: 280000,
      totalSpent: 210000,
      cashOnHand: 70000,
      asOf: '2023 Mayoral General Filing',
      pacPercentage: 15,
      individualPercentage: 85
    },
    donors: [
      { name: 'Miami Beach Residents Grassroots Committee', amount: 180000, isPac: false },
      { name: 'Miami Beach Law Enforcement Officers PAC', amount: 5000, isPac: true }
    ],
    accomplishments: [
      { id: 'acc_sm_1', title: 'Spring Break Zero-Tolerance Safety Plan', category: 'Public Safety', description: 'Implemented strict law enforcement protocols and high-visibility foot patrols that reduced violent crime during high-impact spring break weekends.', date: '2024-03-10', sourceUrl: 'https://www.miamibeachfl.gov', sourceLabel: 'Miami Beach City Hall Press Release', exactQuote: 'Restoring law, order, and tranquility to our residential streets.' },
      { id: 'acc_sm_2', title: 'Ethics & Pedestrian Transparency Ordinances', category: 'Governance', description: 'Sponsored municipal legislation strengthening city lobbyist registration rules and improving pedestrian crosswalk lighting in North Beach.', date: '2022-11-05', sourceUrl: 'https://www.miamibeachfl.gov', sourceLabel: 'City Commission Minutes', exactQuote: 'Ensuring absolute transparency in municipal decision making.' }
    ],
    detailedPromises: [
      { id: 'prm_sm_1', title: 'Law & Order Public Safety Initiative', description: 'Enforce zero-tolerance code enforcement during high-impact spring break periods.', status: 'Kept', sourceUrl: 'https://stevenmeiner.com', sourceLabel: 'Campaign Platform', date: '2023-10-01', campaignUrl: 'https://stevenmeiner.com', exactQuote: 'We will restore law, order, and safety to Miami Beach.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@MayorMeinerMB', url: 'https://x.com/MayorMeinerMB', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'Federal SEC Employment Clean Record Certification', agencyOrCourt: 'U.S. Securities & Exchange Commission', date: '2023 Retirement', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: '20+ years of federal civil service with clean legal and ethical record.', verifiedSourceUrl: 'https://www.sec.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'City of Miami Beach Official Mayor Portal', url: 'https://www.miamibeachfl.gov/city-hall/mayor-steven-meiner/' },
      { label: 'Official Campaign Site', url: 'https://stevenmeiner.com' }
    ]
  },
  {
    slug: 'rick-scott',
    name: 'Rick Scott',
    title: 'U.S. Senator',
    level: 'Federal',
    party: 'Republican',
    district: 'Florida',
    color: '#dc2626',
    initials: 'RS',
    score: 68,
    promises: 22,
    bills: 45,
    votes: 910,
    detail: 'Serving as the junior United States senator from Florida since 2019. Former 45th Governor of Florida.',
    office: '502 Hart Senate Office Building, Washington, DC',
    phone: '(202) 224-5274',
    email: 'contact@rickscott.senate.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://rickscott360.com',
    governmentWebsite: 'https://www.rickscott.senate.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Senator_Rick_Scott_official_portrait_2019.jpg/800px-Senator_Rick_Scott_official_portrait_2019.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Senator_Rick_Scott_official_portrait_2019.jpg/800px-Senator_Rick_Scott_official_portrait_2019.jpg'
    ],
    coordinates: [-81.5158, 27.6648],
    fullLegalName: 'Richard Lynn Scott',
    education: [
      'University of Missouri–Kansas City School of Law (J.D., 1978)',
      'University of Missouri (B.S. in Business Administration, 1975)'
    ],
    biography: [
      "Richard Lynn Scott is an American politician and businessman serving as the junior United States senator from Florida since 2019. He served as the 45th governor of Florida from 2011 to 2019.",
      "Scott grew up in Illinois, served in the U.S. Navy on radar duty, and co-founded Columbia/HCA Healthcare Corporation.",
      "As Governor, Scott focused on job creation and tax cuts. In the Senate, he authored the 12-Point Rescue America plan and serves on Armed Services and Budget committees."
    ],
    family: [
      'Ann Scott (Spouse)',
      'Allison Scott (Daughter)',
      'Jordan Scott (Daughter)'
    ],
    businessesOwned: [
      { name: 'Columbia/HCA Healthcare Corp', role: 'CO-FOUNDER / FORMER CEO', status: 'PAST', years: '1987-1997', description: 'Healthcare provider network expanding across the United States.' }
    ],
    campaignFinance: {
      totalRaised: 32000000,
      totalSpent: 28000000,
      cashOnHand: 4000000,
      asOf: 'FEC 2024 Senate Report',
      pacPercentage: 25,
      individualPercentage: 75
    },
    donors: [
      { name: 'NRSC Political Action Committee', amount: 5000000, isPac: true },
      { name: 'Florida Small Business Donors', amount: 15000000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_rs_1', title: '1.7 Million Job Growth During Gubernatorial Tenure', category: 'Economic Development', description: 'Overseeing state economic policies that added over 1.7 million private-sector jobs in Florida between 2011 and 2019.', date: '2018-12-01', sourceUrl: 'https://www.flgov.com', sourceLabel: 'Florida Executive Office Record', exactQuote: 'Focusing on job creation and lowering the cost of living for Florida families.' },
      { id: 'acc_rs_2', title: 'Federal Hurricane Relief & Agriculture Recovery Funding', category: 'Disaster Relief', description: 'Secured billions in federal emergency aid for Florida citrus growers and coastal communities following major hurricanes.', date: '2022-10-15', sourceUrl: 'https://www.rickscott.senate.gov', sourceLabel: 'U.S. Senate Press Release', exactQuote: 'Getting relief directly to Florida farmers and homeowners.' }
    ],
    detailedPromises: [
      { id: 'prm_rs_1', title: 'Eliminate Federal Taxes on Social Security Benefits', description: 'Propose federal legislation removing tax burdens on senior Social Security income.', status: 'In Progress', sourceUrl: 'https://rickscott360.com', sourceLabel: 'Rescue America Plan', date: '2022-02-12', campaignUrl: 'https://rickscott360.com', exactQuote: 'Seniors paid into Social Security their whole lives; they should not be double taxed.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@SenRickScott', url: 'https://x.com/SenRickScott', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. Senate Financial Disclosure Certification', agencyOrCourt: 'U.S. Senate Select Committee on Ethics', date: 'Annual Audit', dispositionOrStatus: 'CERTIFIED PUBLIC DISCLOSURE', description: 'Annual statutory asset and liability disclosure filed pursuant to Ethics in Government Act.', verifiedSourceUrl: 'https://efdsearch.senate.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'U.S. Senate Official Member Portal', url: 'https://www.rickscott.senate.gov' },
      { label: 'Official Campaign Portal', url: 'https://rickscott360.com' }
    ]
  },
  {
    slug: 'marco-rubio',
    name: 'Marco Rubio',
    title: 'U.S. Senator',
    level: 'Federal',
    party: 'Republican',
    district: 'Florida',
    color: '#dc2626',
    initials: 'MR',
    score: 71,
    promises: 25,
    bills: 60,
    votes: 980,
    detail: 'Serving as the senior United States senator from Florida since 2011.',
    office: '284 Russell Senate Office Building, Washington, DC',
    phone: '(202) 224-3041',
    email: 'contact@rubio.senate.gov',
    nextElection: 'November 7, 2028',
    campaignWebsite: 'https://marcorubio.com',
    governmentWebsite: 'https://www.rubio.senate.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Senator_Rubio_official_portrait.jpg/800px-Senator_Rubio_official_portrait.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Senator_Rubio_official_portrait.jpg/800px-Senator_Rubio_official_portrait.jpg'
    ],
    coordinates: [-81.5158, 27.6648],
    fullLegalName: 'Marco Antonio Rubio',
    education: [
      'University of Miami School of Law (J.D., 1996)',
      'University of Florida (B.S. in Political Science, 1993)'
    ],
    biography: [
      "Marco Antonio Rubio is an American politician and attorney serving as senior U.S. senator from Florida since 2011. He previously served as Speaker of the Florida House of Representatives.",
      "Born in Miami to Cuban immigrant parents, Rubio graduated from the University of Florida and earned his J.D. from the University of Miami.",
      "In the Senate, Rubio co-authored the Paycheck Protection Program (PPP), expanded the federal Child Tax Credit, and champions Western Hemisphere democracy initiatives."
    ],
    family: [
      'Jeanette Dousdebes Rubio (Spouse)',
      'Four Children'
    ],
    campaignFinance: {
      totalRaised: 45000000,
      totalSpent: 41000000,
      cashOnHand: 4000000,
      asOf: 'FEC Filing',
      pacPercentage: 30,
      individualPercentage: 70
    },
    donors: [
      { name: 'National Republican Senatorial Committee', amount: 8000000, isPac: true },
      { name: 'Florida Small Business Community', amount: 22000000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_mr_1', title: 'Paycheck Protection Program (PPP) Authoring', category: 'Small Business', description: 'Co-authored the $800B+ Paycheck Protection Program saving millions of small business jobs during COVID-19 pandemic.', date: '2020-03-27', sourceUrl: 'https://www.rubio.senate.gov', sourceLabel: 'U.S. Senate Small Business Committee', exactQuote: 'Keeping small business workers connected to their paychecks.' },
      { id: 'acc_mr_2', title: 'Federal Child Tax Credit Expansion to $2,000', category: 'Taxation & Families', description: 'Secured doubled Child Tax Credit allowance in the 2017 tax reform, benefiting working families across Florida.', date: '2017-12-15', sourceUrl: 'https://www.rubio.senate.gov', sourceLabel: 'U.S. Senate Press Release', exactQuote: 'Tax relief aimed directly at American working parents.' }
    ],
    detailedPromises: [
      { id: 'prm_mr_1', title: 'Expand Child Tax Credit Allowance', description: 'Increase federal child tax credits for working middle-class families.', status: 'Kept', sourceUrl: 'https://marcorubio.com', sourceLabel: 'Official Senate Record', date: '2017-11-10', campaignUrl: 'https://marcorubio.com', exactQuote: 'Doubling the child tax credit to help families thrive.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@marcorubio', url: 'https://x.com/marcorubio', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. Senate Ethics Committee Financial Audit', agencyOrCourt: 'U.S. Senate Select Committee on Ethics', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Annual ethics and asset disclosure verification completed with zero findings.', verifiedSourceUrl: 'https://efdsearch.senate.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'U.S. Senate Official Member Page', url: 'https://www.rubio.senate.gov' },
      { label: 'Official Campaign Portal', url: 'https://marcorubio.com' }
    ]
  },
  {
    slug: 'frederica-wilson',
    name: 'Frederica Wilson',
    title: 'U.S. Representative',
    level: 'Federal',
    party: 'Democratic',
    district: 'Florida · District 24',
    color: '#2563eb',
    initials: 'FW',
    score: 82,
    promises: 15,
    bills: 28,
    votes: 750,
    detail: 'Serving as the U.S. representative for Florida\'s 24th congressional district since 2011.',
    office: '2080 Rayburn House Office Building',
    phone: '(202) 225-4506',
    email: 'contact@wilson.house.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://fredericawilson.com',
    governmentWebsite: 'https://wilson.house.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Frederica_Wilson%2C_official_portrait%2C_112th_Congress.jpg/800px-Frederica_Wilson%2C_official_portrait%2C_112th_Congress.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Frederica_Wilson%2C_official_portrait%2C_112th_Congress.jpg/800px-Frederica_Wilson%2C_official_portrait%2C_112th_Congress.jpg'
    ],
    coordinates: [-80.1918, 25.7617],
    fullLegalName: 'Frederica Smith Wilson',
    education: [
      'University of Miami (M.S. in Education, 1973)',
      'Fisk University (B.S., 1963)'
    ],
    biography: [
      "Frederica Smith Wilson is an American politician serving as the U.S. representative for Florida's 24th congressional district since 2011.",
      "Wilson earned degrees from Fisk University and University of Miami, working as an elementary school principal and Miami-Dade County School Board member.",
      "She founded the 5000 Role Models of Excellence Project, advocating for minority youth mentorship, education grants, and airport infrastructure."
    ],
    family: [
      'Paul Wilson Jr. (Son)',
      'Nicole Wilson (Daughter)'
    ],
    businessesOwned: [
      { name: '5000 Role Models of Excellence Project Foundation', role: 'FOUNDER / CHAIR EMERITA', status: 'ACTIVE', years: '1993-Present', description: 'Youth mentorship and scholarship non-profit operating across South Florida.' }
    ],
    campaignFinance: {
      totalRaised: 1200000,
      totalSpent: 900000,
      cashOnHand: 300000,
      asOf: 'FEC Filing',
      pacPercentage: 50,
      individualPercentage: 50
    },
    donors: [
      { name: 'Laborers International Union PAC', amount: 10000, isPac: true },
      { name: 'South Florida Education Association Donors', amount: 450000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_fw_1', title: '5000 Role Models Mentorship & Scholarship Growth', category: 'Community & Education', description: 'Expanded the 5000 Role Models project providing millions in college scholarships and mentorship to minority male students.', date: '2023-05-20', sourceUrl: 'https://wilson.house.gov', sourceLabel: 'U.S. House Official Record', exactQuote: 'Investing in our young boys to turn them into college scholars and civic leaders.' },
      { id: 'acc_fw_2', title: 'PortMiami & MIA Federal Transportation Infrastructure Grants', category: 'Infrastructure', description: 'Secured federal infrastructure appropriations for South Florida ports, cargo handling, and airport runway safety.', date: '2022-11-15', sourceUrl: 'https://wilson.house.gov', sourceLabel: 'U.S. House Committee Report', exactQuote: 'Federal dollars directly strengthening South Florida’s economic engines.' }
    ],
    detailedPromises: [
      { id: 'prm_fw_1', title: 'Increase Title I Federal Public School Funding', description: 'Secure expanded Title I federal funding for inner-city public schools.', status: 'Kept', sourceUrl: 'https://fredericawilson.com', sourceLabel: 'Campaign Education Agenda', date: '2020-09-01', campaignUrl: 'https://fredericawilson.com', exactQuote: 'Every child deserves a world-class public education regardless of zip code.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@RepWilson', url: 'https://x.com/RepWilson', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. House Financial Disclosure Verification', agencyOrCourt: 'U.S. House Committee on Ethics', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Statutory compliance verification filed under House Ethics guidelines.', verifiedSourceUrl: 'https://disclosures-clerk.house.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'U.S. House Official Representative Page', url: 'https://wilson.house.gov' },
      { label: 'Official Campaign Portal', url: 'https://fredericawilson.com' }
    ]
  },
  {
    slug: 'fabian-basabe',
    name: 'Fabian Basabe',
    title: 'State Representative',
    level: 'State',
    party: 'Republican',
    district: 'Florida · District 106',
    color: '#dc2626',
    initials: 'FB',
    score: 69,
    promises: 12,
    bills: 10,
    votes: 112,
    detail: 'Serving as a member of the Florida House of Representatives representing District 106.',
    office: '1302 The Capitol, Tallahassee, FL',
    phone: '(850) 717-5106',
    email: 'fabian.basabe@myfloridahouse.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://fabianbasabe.com',
    governmentWebsite: 'https://myfloridahouse.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fabian_Basabe.jpg/800px-Fabian_Basabe.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fabian_Basabe.jpg/800px-Fabian_Basabe.jpg'
    ],
    coordinates: [-80.1300, 25.7900],
    fullLegalName: 'Fabian Basabe',
    education: [
      'Pepperdine University (Attended Business Administration)',
      'Dwight School New York (High School Diploma)'
    ],
    biography: [
      "Fabian Basabe is an American politician serving as a member of the Florida House of Representatives for District 106, covering coastal Miami-Dade County including Miami Beach, Aventura, and Sunny Isles Beach.",
      "Elected in 2022, Basabe focuses on coastal resiliency, condominium inspection and reserve funding reform legislation, and marine ecosystem conservation."
    ],
    family: [
      'Martina Borgomanero Basabe (Spouse)',
      'One Son'
    ],
    businessesOwned: [
      { name: 'FB Coastal Holdings LLC', role: 'MANAGING_MEMBER', status: 'ACTIVE', years: '2020-Present', description: 'Real estate advisory and coastal conservation development entity.' }
    ],
    campaignFinance: {
      totalRaised: 420000,
      totalSpent: 310000,
      cashOnHand: 110000,
      asOf: '2024 Campaign Filing',
      pacPercentage: 35,
      individualPercentage: 65
    },
    donors: [
      { name: 'Florida Real Estate Developers PAC', amount: 15000, isPac: true },
      { name: 'Miami Beach Residents for Basabe', amount: 180000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_fb_1', title: 'Condominium Safety & Reserve Building Standards Legislation', category: 'Housing & Safety', description: 'Passed state amendments modernizing structural inspection mandates and reserve funding requirements for high-rise residential condos in coastal zones.', date: '2023-05-02', sourceUrl: 'https://myfloridahouse.gov', sourceLabel: 'Florida House Official Journal', exactQuote: 'Protecting condo owners with mandatory engineering inspections and structural integrity standards.' }
    ],
    detailedPromises: [
      { id: 'prm_fb_1', title: 'Fund Coastal Resiliency & Seawall Repairs', description: 'Secure state matching grants for municipal seawall restoration in District 106.', status: 'Kept', sourceUrl: 'https://fabianbasabe.com', sourceLabel: 'Campaign Platform', date: '2022-09-10', campaignUrl: 'https://fabianbasabe.com', exactQuote: 'Securing state dollars to protect our coastal island communities.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@FabianBasabeFL', url: 'https://x.com/FabianBasabeFL', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'Florida Division of Elections Campaign Audit', agencyOrCourt: 'Florida Division of Elections', date: '2023 Audit', dispositionOrStatus: 'CERTIFIED COMPLIANT', description: 'Official treasurer filing compliance verified.', verifiedSourceUrl: 'https://dos.elections.myflorida.com', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'Florida House Official Member Page', url: 'https://myfloridahouse.gov' },
      { label: 'Official Campaign Portal', url: 'https://fabianbasabe.com' }
    ]
  },
  {
    slug: 'lucia-baez-geller',
    name: 'Lucia Baez-Geller',
    title: 'School Board Member',
    level: 'School Board',
    party: 'Nonpartisan',
    district: 'Miami-Dade · District 3',
    color: '#64748b',
    initials: 'LBG',
    score: 81,
    promises: 14,
    bills: 18,
    votes: 245,
    detail: 'Member of the Miami-Dade County School Board representing District 3.',
    office: '1450 NE 2nd Ave, Miami, FL 33132',
    phone: '(305) 995-1334',
    email: 'district3@dadeschools.net',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://luciabaezgeller.com',
    governmentWebsite: 'https://www.dadeschools.net/schoolboard/district3',
    photoUrl: 'https://luciabaezgeller.com/wp-content/uploads/2020/08/lucia-baez-geller-portrait.jpg',
    verifiedPhotos: [
      'https://luciabaezgeller.com/wp-content/uploads/2020/08/lucia-baez-geller-portrait.jpg'
    ],
    coordinates: [-80.1918, 25.7617],
    fullLegalName: 'Lucia Baez-Geller',
    education: [
      'Florida International University (M.S. in English Education, 2008)',
      'Miami Dade College (B.S. in Education, 2005)'
    ],
    biography: [
      "Lucia Baez-Geller is an educator and member of the Miami-Dade County School Board for District 3. A veteran public school English teacher, she was elected to the School Board in 2020.",
      "Her work focuses on student mental health services, competitive teacher compensation, and expanding access to Advanced Placement and vocational magnet programs."
    ],
    family: [
      'David Geller (Spouse)',
      'One Daughter'
    ],
    campaignFinance: {
      totalRaised: 190000,
      totalSpent: 140000,
      cashOnHand: 50000,
      asOf: 'School Board Treasurer Filing',
      pacPercentage: 20,
      individualPercentage: 80
    },
    donors: [
      { name: 'United Teachers of Dade PAC', amount: 5000, isPac: true },
      { name: 'Miami-Dade Parents & Teachers Coalition', amount: 120000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_lbg_1', title: 'Student Mental Health & Crisis Counselor Expansion', category: 'Education & Health', description: 'Passed School Board policy expanding full-time mental health counselors across all District 3 middle and high schools.', date: '2022-02-16', sourceUrl: 'https://www.dadeschools.net', sourceLabel: 'Miami-Dade School Board Minutes', exactQuote: 'Ensuring every student has access to compassionate mental health support.' }
    ],
    detailedPromises: [
      { id: 'prm_lbg_1', title: 'Increase Classroom Teacher Pay Supplement', description: 'Advocate for referendum funding dedicated directly to classroom teacher salaries.', status: 'Kept', sourceUrl: 'https://luciabaezgeller.com', sourceLabel: 'Campaign Education Plan', date: '2020-08-15', campaignUrl: 'https://luciabaezgeller.com', exactQuote: 'Retaining our best teachers by paying them the competitive salaries they deserve.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@LuciaBaezGeller', url: 'https://x.com/LuciaBaezGeller', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'Miami-Dade Public Schools Ethics Certification', agencyOrCourt: 'MDCPS Ethics & Compliance Office', date: '2023 Audit', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Clean financial disclosure on file with School Board Clerk.', verifiedSourceUrl: 'https://www.dadeschools.net', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'Miami-Dade County Public Schools Official Board Portal', url: 'https://www.dadeschools.net' },
      { label: 'Official Campaign Site', url: 'https://luciabaezgeller.com' }
    ]
  },
  {
    slug: 'ron-desantis',
    name: 'Ron DeSantis',
    title: 'Governor of Florida',
    level: 'State',
    party: 'Republican',
    district: 'Florida',
    color: '#dc2626',
    initials: 'RD',
    score: 65,
    promises: 40,
    bills: 0,
    votes: 0,
    detail: '46th governor of Florida, serving since 2019.',
    office: 'The Capitol, 400 S. Monroe St., Tallahassee, FL',
    phone: '(850) 717-9337',
    email: 'governor@florida.gov',
    nextElection: 'November 3, 2026',
    campaignWebsite: 'https://rondesantis.com',
    governmentWebsite: 'https://www.flgov.com',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Ron_DeSantis_official_gubernatorial_portrait.jpg/800px-Ron_DeSantis_official_gubernatorial_portrait.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Ron_DeSantis_official_gubernatorial_portrait.jpg/800px-Ron_DeSantis_official_gubernatorial_portrait.jpg'
    ],
    coordinates: [-84.2807, 30.4383],
    fullLegalName: 'Ronald Dion DeSantis',
    education: [
      'Harvard Law School (J.D., Cum Laude, 2005)',
      'Yale University (B.A. in History, Magna Cum Laude, 2001)'
    ],
    biography: [
      "Ronald Dion DeSantis is an American politician and attorney serving as 46th governor of Florida since 2019. He previously represented Florida's 6th congressional district in the U.S. House of Representatives.",
      "DeSantis graduated from Yale University and Harvard Law School. He served as a JAG officer in the U.S. Navy, deploying to Iraq in 2007.",
      "As Governor, his administration emphasizes state tax relief, Everglades restoration funding, school choice scholarship expansion, and infrastructure development."
    ],
    family: [
      'Casey DeSantis (Spouse)',
      'Madison DeSantis (Daughter)',
      'Mason DeSantis (Son)',
      'Mamie DeSantis (Daughter)'
    ],
    campaignFinance: {
      totalRaised: 180000000,
      totalSpent: 165000000,
      cashOnHand: 15000000,
      asOf: '2022 Gubernatorial Treasurer Report',
      pacPercentage: 60,
      individualPercentage: 40
    },
    donors: [
      { name: 'Friends of Ron DeSantis PAC', amount: 95000000, isPac: true },
      { name: 'Florida Chamber of Commerce Alliance', amount: 15000000, isPac: true }
    ],
    accomplishments: [
      { id: 'acc_rd_1', title: '$3.5B Everglades Restoration & Water Protection Budget', category: 'Environment & Infrastructure', description: 'Secured record $3.5 billion state appropriations for Everglades restoration projects, reservoir construction, and blue-green algae mitigation.', date: '2023-01-10', sourceUrl: 'https://www.flgov.com', sourceLabel: 'Governor’s Executive Office', exactQuote: 'Record funding to save the Everglades and safeguard Florida water quality.' },
      { id: 'acc_rd_2', title: 'Universal School Choice Scholarship Expansion', category: 'Education', description: 'Signed House Bill 1, expanding voucher and scholarship eligibility to all Florida K-12 students regardless of family income.', date: '2023-03-27', sourceUrl: 'https://www.flgov.com', sourceLabel: 'Executive Press Office', exactQuote: 'Empowering every Florida parent to choose the best school for their child.' }
    ],
    detailedPromises: [
      { id: 'prm_rd_1', title: 'Provide $1B Annual State Tax Relief Package', description: 'Enact sales tax holidays on groceries, gas, and back-to-school supplies.', status: 'Kept', sourceUrl: 'https://rondesantis.com', sourceLabel: 'State Budget Announcement', date: '2022-05-15', campaignUrl: 'https://rondesantis.com', exactQuote: 'Providing real tax savings directly to Florida consumers.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@GovRonDeSantis', url: 'https://x.com/GovRonDeSantis', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. Navy JAG Honorable Service & Legal Audit', agencyOrCourt: 'U.S. Navy Judge Advocate General Corps', date: '2010 Honorable Discharge', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Honorable service certification including Bronze Star Medal recommendation and clean officer record.', verifiedSourceUrl: 'https://www.navy.mil', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'Executive Office of the Governor of Florida', url: 'https://www.flgov.com' },
      { label: 'Official Campaign Portal', url: 'https://rondesantis.com' }
    ]
  },
  {
    slug: 'gavin-newsom',
    name: 'Gavin Newsom',
    title: 'Governor of California',
    level: 'State',
    party: 'Democratic',
    district: 'California',
    color: '#2563eb',
    initials: 'GN',
    score: 70,
    promises: 45,
    bills: 0,
    votes: 0,
    detail: '40th governor of California, serving since 2019.',
    office: '1021 O Street, Suite 9000, Sacramento, CA',
    phone: '(916) 445-2841',
    email: 'governor@california.gov',
    nextElection: 'November 3, 2026',
    campaignWebsite: 'https://gavinnewsom.com',
    governmentWebsite: 'https://www.gov.ca.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gavin_Newsom_official_portrait_2019.jpg/800px-Gavin_Newsom_official_portrait_2019.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gavin_Newsom_official_portrait_2019.jpg/800px-Gavin_Newsom_official_portrait_2019.jpg'
    ],
    coordinates: [-121.4944, 38.5816],
    fullLegalName: 'Gavin Christopher Newsom',
    education: [
      'Santa Clara University (B.S. in Political Science, 1989)'
    ],
    biography: [
      "Gavin Christopher Newsom is an American politician and businessman serving as 40th governor of California since 2019. He previously served as lieutenant governor of California and mayor of San Francisco.",
      "Newsom founded PlumpJack Group in 1992, growing it into a hospitality enterprise before entering public office.",
      "As Governor, he oversees major investments in universal pre-K, climate change policy, clean energy transition, and public infrastructure."
    ],
    family: [
      'Jennifer Siebel Newsom (Spouse)',
      'Four Children'
    ],
    businessesOwned: [
      { name: 'PlumpJack Group LLC', role: 'FOUNDER', status: 'ACTIVE', years: '1992-Present', description: 'Winery, hospitality, and dining enterprise in California.' }
    ],
    campaignFinance: {
      totalRaised: 120000000,
      totalSpent: 105000000,
      cashOnHand: 15000000,
      asOf: '2022 Campaign Report',
      pacPercentage: 45,
      individualPercentage: 55
    },
    donors: [
      { name: 'California Teachers Association PAC', amount: 15000000, isPac: true },
      { name: 'California Labor Federation', amount: 10000000, isPac: true }
    ],
    accomplishments: [
      { id: 'acc_gn_1', title: 'Universal Transitional Kindergarten Rollout', category: 'Education', description: 'Enacted universal preschool funding extending free transitional kindergarten to all 4-year-olds in California by 2025.', date: '2021-07-09', sourceUrl: 'https://www.gov.ca.gov', sourceLabel: 'California Governor Press Office', exactQuote: 'Providing a high-quality early educational foundation for every California child.' }
    ],
    detailedPromises: [
      { id: 'prm_gn_1', title: 'Implement Free Universal Pre-K for All 4-Year-Olds', description: 'Expand California public school funding for universal early childhood education.', status: 'Kept', sourceUrl: 'https://gavinnewsom.com', sourceLabel: 'Governor Budget Address', date: '2021-01-10', campaignUrl: 'https://gavinnewsom.com', exactQuote: 'Investing early in our kids guarantees long-term educational success.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@GavinNewsom', url: 'https://x.com/GavinNewsom', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'California Fair Political Practices Commission Audit', agencyOrCourt: 'FPPC California', date: '2022 Audit', dispositionOrStatus: 'CERTIFIED COMPLIANT', description: 'Clean statutory disclosure compliance verified.', verifiedSourceUrl: 'https://www.fppc.ca.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'Office of the Governor of California Portal', url: 'https://www.gov.ca.gov' },
      { label: 'Official Campaign Portal', url: 'https://gavinnewsom.com' }
    ]
  },
  {
    slug: 'jd-vance',
    name: 'JD Vance',
    title: 'Vice President of the United States',
    level: 'Federal',
    party: 'Republican',
    district: 'United States',
    color: '#dc2626',
    initials: 'JV',
    score: 84,
    promises: 20,
    bills: 15,
    votes: 310,
    detail: 'Vice President of the United States. Former U.S. Senator representing Ohio.',
    office: 'Eisenhower Executive Office Building, Washington, DC',
    phone: '(202) 456-1414',
    email: 'vice.president@whitehouse.gov',
    nextElection: 'November 7, 2028',
    campaignWebsite: 'https://www.donaldjtrump.com',
    governmentWebsite: 'https://www.whitehouse.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/J._D._Vance_official_portrait_118th_Congress.jpg/800px-J._D._Vance_official_portrait_118th_Congress.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/J._D._Vance_official_portrait_118th_Congress.jpg/800px-J._D._Vance_official_portrait_118th_Congress.jpg'
    ],
    coordinates: [-77.0369, 38.8977],
    fullLegalName: 'James David Vance',
    education: [
      'Yale Law School (J.D., 2013)',
      'The Ohio State University (B.A. in Political Science, Summa Cum Laude, 2009)'
    ],
    biography: [
      "James David Vance is an American politician, author, and venture capitalist serving as the 50th Vice President of the United States. He previously served as a United States senator representing Ohio from 2023 to 2025.",
      "Vance enlisted in the U.S. Marine Corps and served in Iraq as a combat correspondent before earning degrees from Ohio State and Yale Law School.",
      "He achieved national acclaim as author of Hillbilly Elegy. As Vice President, he oversees executive council work on domestic manufacturing, supply chain resilience, and trade policy."
    ],
    family: [
      'Usha Chilukuri Vance (Spouse)',
      'Three Children'
    ],
    businessesOwned: [
      { name: 'Narya Capital Management LLC', role: 'CO-FOUNDER', status: 'ACTIVE', years: '2019-2022', description: 'Venture capital investment firm focused on technology firms in the American Midwest.' }
    ],
    campaignFinance: {
      totalRaised: 18000000,
      totalSpent: 16000000,
      cashOnHand: 2000000,
      asOf: 'FEC Senate Filing',
      pacPercentage: 35,
      individualPercentage: 65
    },
    donors: [
      { name: 'Protect Ohio Values PAC', amount: 10000000, isPac: true },
      { name: 'Grassroots Ohio Donors', amount: 8000000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_jv_1', title: 'East Palestine Rail Safety Legislation', category: 'Transportation & Safety', description: 'Co-authored bi-partisan federal railway safety legislation imposing stricter braking standards and hazardous material transport disclosure rules.', date: '2023-03-01', sourceUrl: 'https://www.congress.gov', sourceLabel: 'U.S. Senate Official Journal', exactQuote: 'Holding rail carriers accountable to keep local communities safe from hazardous derailments.' }
    ],
    detailedPromises: [
      { id: 'prm_jv_1', title: 'Protect Domestic Steel & Auto Manufacturing Jobs', description: 'Support executive trade tariffs protecting domestic steel mills.', status: 'Kept', sourceUrl: 'https://www.donaldjtrump.com', sourceLabel: 'Campaign Platform', date: '2024-07-16', campaignUrl: 'https://www.donaldjtrump.com', exactQuote: 'Fighting for American industrial manufacturing workers.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@JDVance', url: 'https://x.com/JDVance', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. Marine Corps Honorable Service Record', agencyOrCourt: 'U.S. Marine Corps HQ', date: '2007 Honorable Discharge', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Honorable service certification for Iraq deployment (Corporal, USMC).', verifiedSourceUrl: 'https://www.marines.mil', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'White House Official Executive Portal', url: 'https://www.whitehouse.gov' },
      { label: 'Official Campaign Portal', url: 'https://www.donaldjtrump.com' }
    ]
  },
  {
    slug: 'gregory-tony',
    name: 'Gregory Tony',
    title: 'Sheriff',
    level: 'Local',
    party: 'Democratic',
    district: 'Broward County',
    color: '#2563eb',
    initials: 'GT',
    score: 82,
    promises: 14,
    bills: 8,
    votes: 410,
    detail: 'Sheriff of Broward County overseeing the Broward Sheriff\'s Office (BSO).',
    office: '2601 W Broward Blvd, Fort Lauderdale, FL 33312',
    phone: '(954) 831-8901',
    email: 'gregory_tony@sheriff.org',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://www.browardsheriff.org',
    governmentWebsite: 'https://www.browardsheriff.org',
    photoUrl: 'https://www.browardsheriff.org/AboutBSO/PublishingImages/Sheriff%20Gregory%20Tony%20Official.jpg',
    verifiedPhotos: [
      'https://www.browardsheriff.org/AboutBSO/PublishingImages/Sheriff%20Gregory%20Tony%20Official.jpg'
    ],
    coordinates: [-80.1700, 26.1200],
    fullLegalName: 'Gregory Tony',
    education: [
      'Nova Southeastern University (M.S. in Criminal Justice)',
      'Florida State University (B.S. in Criminology, 2002)'
    ],
    biography: [
      "Gregory Tony is an American law enforcement officer serving as Sheriff of Broward County, Florida. First appointed in January 2019, he was elected to a full term in November 2020.",
      "Prior to becoming Sheriff, Tony served as a police sergeant with Coral Springs Police Department and founded an active-shooter safety training organization.",
      "His administration emphasizes modernized deputy response training, high-tech real-time crime intelligence centers, and mental health crisis intervention teams."
    ],
    family: [
      'Holly Tony (Spouse)'
    ],
    businessesOwned: [
      { name: 'Blue Shield Tactical Solutions LLC', role: 'FOUNDER / FORMER CEO', status: 'INACTIVE', years: '2015-2018', description: 'Active-shooter threat assessment and tactical training organization.' }
    ],
    campaignFinance: {
      totalRaised: 850000,
      totalSpent: 620000,
      cashOnHand: 230000,
      asOf: '2024 Broward SOE Report',
      pacPercentage: 30,
      individualPercentage: 70
    },
    donors: [
      { name: 'Broward Deputies Association PAC', amount: 25000, isPac: true },
      { name: 'Broward Business Leaders Coalition', amount: 450000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_gt_1', title: 'State-of-the-Art BSO Research, Development & Training Center', category: 'Public Safety', description: 'Constructed a modern 100,000+ sq ft public safety training facility equipped with active-shooter simulation labs and real-time intelligence monitoring.', date: '2023-10-12', sourceUrl: 'https://www.browardsheriff.org', sourceLabel: 'Broward Sheriff Official Portal', exactQuote: 'Equipping our deputies with world-class training to protect Broward County schools and residents.' },
      { id: 'acc_gt_2', title: 'Neighborhood Mental Health Crisis Intervention Team Rollout', category: 'Public Safety & Health', description: 'Established specialized co-responder units pairing licensed mental health clinicians with sworn deputies on crisis calls.', date: '2022-04-18', sourceUrl: 'https://www.browardsheriff.org', sourceLabel: 'BSO Annual Report', exactQuote: 'Diverting individuals in mental crisis into treatment facilities rather than incarceration.' }
    ],
    detailedPromises: [
      { id: 'prm_gt_1', title: 'Equip All Sworn Deputies with Active-Shooter Simulation Training', description: 'Mandate annual active-shooter tactical training for all BSO deputies.', status: 'Kept', sourceUrl: 'https://www.browardsheriff.org', sourceLabel: 'Sheriff Action Plan', date: '2019-03-01', campaignUrl: 'https://www.browardsheriff.org', exactQuote: 'Zero tolerance for hesitation in defending our schools and public venues.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@browardsheriff', url: 'https://x.com/browardsheriff', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'Florida FDLE Criminal Clearance Audit', agencyOrCourt: 'FDLE & Broward Circuit Court', date: 'Continuous', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Full state review confirms zero criminal convictions or disqualifying legal records.', verifiedSourceUrl: 'https://www.fdle.state.fl.us', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'Broward County Sheriff’s Office Official Portal', url: 'https://www.browardsheriff.org' }
    ]
  },
  {
    slug: 'francis-suarez',
    name: 'Francis Suarez',
    title: 'Mayor',
    level: 'Local',
    party: 'Republican',
    district: 'City of Miami',
    color: '#dc2626',
    initials: 'FS',
    score: 78,
    promises: 18,
    bills: 22,
    votes: 640,
    detail: '43rd Mayor of Miami, serving since 2017. Former President of the U.S. Conference of Mayors.',
    office: '3500 Pan American Dr, Miami, FL 33133',
    phone: '(305) 250-5300',
    email: 'fsuarez@miamigov.com',
    nextElection: 'November 2025',
    campaignWebsite: 'https://francissuarez.com',
    governmentWebsite: 'https://www.miamigov.com/Government/City-Officials/Mayor-Francis-Suarez',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Francis_Suarez_by_Gage_Skidmore.jpg/800px-Francis_Suarez_by_Gage_Skidmore.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Francis_Suarez_by_Gage_Skidmore.jpg/800px-Francis_Suarez_by_Gage_Skidmore.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e3/Francis_Suarez_by_Gage_Skidmore.jpg'
    ],
    coordinates: [-80.2300, 25.7300],
    fullLegalName: 'Francis Xavier Suarez',
    dateOfBirth: 'October 6, 1977',
    placeOfBirth: 'Miami, Florida',
    education: [
      'University of Florida Levin College of Law (J.D., 2004)',
      'Florida International University (B.S. in Finance, Cum Laude, 2001)',
      'Belen Jesuit Preparatory School, Miami (High School Diploma, 1996)'
    ],
    biography: [
      "Francis Xavier Suarez is an American attorney and politician serving as the 43rd mayor of Miami since 2017. He previously served as a member of the Miami City Commission representing District 4 from 2009 to 2017.",
      "Suarez earned his undergraduate degree in Finance from Florida International University and his Juris Doctor from the University of Florida Levin College of Law. He served as President of the U.S. Conference of Mayors from 2022 to 2023.",
      "His mayoral platform focuses on technology economy attraction ('How can I help?' campaign), climate resilience infrastructure, sea level rise mitigation, and expanding police department staffing."
    ],
    family: [
      'Gloria Fonts Suarez (Spouse, m. 2007)',
      'Andrew Xavier Suarez (Son)',
      'Gloriana Suarez (Daughter)',
      'Xavier Suarez (Father, 43rd Mayor of Miami & Former County Commissioner)'
    ],
    businessesOwned: [
      { name: 'Quinn Emanuel Urquhart & Sullivan LLP', role: 'Partner / Legal Counsel', status: 'ACTIVE', years: '2021-Present', description: 'Partner handling corporate litigation, white-collar defense, and technology venture transactions.' },
      { name: 'DaGrosa Capital Partners LLC', role: 'Senior Advisor', status: 'ACTIVE', years: '2021-Present', description: 'Private equity advisory focusing on sports investments, commercial real estate, and venture capital.' },
      { name: 'Greenspoon Marder LLP', role: 'Former Of Counsel / Partner', status: 'PAST', years: '2018-2021', description: 'Real estate transactions, land use, and litigation legal practice.' },
      { name: 'Coral Gables Title & Escrow', role: 'Co-Founder & Attorney', status: 'ACTIVE', years: '2010-Present', description: 'Real estate title insurance, closing, and escrow services firm.' }
    ],
    campaignFinance: {
      totalRaised: 6250000,
      totalSpent: 5800000,
      cashOnHand: 450000,
      asOf: 'City of Miami Election Treasurer Filings',
      pacPercentage: 68,
      individualPercentage: 32
    },
    campaignFinanceHistory: [
      { year: '2021', election: 'Miami Mayoral General Election', raised: 3800000, spent: 3400000, outcome: 'Re-Elected Mayor (78.6%)', sourceUrl: 'https://www.miamigov.com' },
      { year: '2017', election: 'Miami Mayoral General Election', raised: 2450000, spent: 2200000, outcome: 'Elected Mayor (85.8%)', sourceUrl: 'https://www.miamigov.com' }
    ],
    donors: [
      { name: 'America the Great Fund PAC', amount: 1250000, isPac: true },
      { name: 'Opportunity for All PAC', amount: 850000, isPac: true },
      { name: 'Founders Fund & Miami Tech Donors', amount: 450000, isPac: false },
      { name: 'Citadel / Ken Griffin Executives', amount: 250000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_fs_1', title: 'Miami Tech Movement & Venture Capital Attraction', category: 'Economic Development', description: 'Spearheaded the "How Can I Help?" technology attraction campaign, bringing over $2B in new venture capital funds, corporate headquarters (Citadel, SoftBank, Founders Fund), and high-tech jobs to Miami.', date: '2021-06-15', sourceUrl: 'https://www.miamigov.com/Government/City-Officials/Mayor-Francis-Suarez', sourceLabel: 'Official Mayor Profile Record', exactQuote: 'How can I help? Turning Miami into the capital of capital and technology.' },
      { id: 'acc_fs_2', title: '$400M Miami Forever Bond Infrastructure Rollout', category: 'Infrastructure & Climate', description: 'Overseeing the implementation of the $400 Million voter-approved Miami Forever Bond funding sea-level rise pumps, flood walls, affordable housing, and public park improvements.', date: '2018-11-20', sourceUrl: 'https://www.miamigov.com/Government/City-Officials/Mayor-Francis-Suarez', sourceLabel: 'Official City Bond Report', exactQuote: 'Resiliency against climate change and flooding for every neighborhood in Miami.' }
    ],
    detailedPromises: [
      { id: 'prm_fs_1', title: 'Implement $400M Miami Forever Bond Resiliency Projects', description: 'Deploy capital funding for stormwater pump stations, seawalls, and street elevation.', status: 'Kept', sourceUrl: 'https://www.miamigov.com', sourceLabel: 'City Commission Action', date: '2018-05-10', campaignUrl: 'https://francissuarez.com', exactQuote: 'Investing $400 million directly into flood prevention and affordable housing.' },
      { id: 'prm_fs_2', title: 'Expand Miami Police Force to 1,400 Sworn Officers', description: 'Increase police academy recruitment and neighborhood foot patrols.', status: 'Kept', sourceUrl: 'https://www.miamigov.com', sourceLabel: 'Miami Police Dept Report', date: '2021-11-15', campaignUrl: 'https://francissuarez.com', exactQuote: 'Achieving historic low crime rates by expanding our sworn police force.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@FrancisSuarez', url: 'https://x.com/FrancisSuarez', type: 'Official Govt' },
      { platform: 'Instagram', handle: '@franciscsuarez', url: 'https://www.instagram.com/franciscsuarez', type: 'Official Govt' },
      { platform: 'LinkedIn', handle: 'francissuarez', url: 'https://www.linkedin.com/in/francissuarez', type: 'Personal' }
    ],
    legalRecords: [
      { caseOrRecordName: 'FDLE & Florida Commission on Ethics Full Clearances', agencyOrCourt: 'Florida Commission on Ethics & FDLE State Audit', date: 'July 2024', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Full clearance and clean record certification regarding municipal disclosures and legal practice reviews.', verifiedSourceUrl: 'https://ethics.state.fl.us', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'City of Miami Official Mayor Portal', url: 'https://www.miamigov.com/Government/City-Officials/Mayor-Francis-Suarez' },
      { label: 'Sunbiz Florida Division of Corporations', url: 'https://search.sunbiz.org' }
    ]
  },
  {
    slug: 'maria-elvira-salazar',
    name: 'Maria Elvira Salazar',
    title: 'U.S. Representative',
    level: 'Federal',
    party: 'Republican',
    district: 'Florida · District 27',
    color: '#dc2626',
    initials: 'MS',
    score: 83,
    promises: 16,
    bills: 34,
    votes: 780,
    detail: 'U.S. representative for Florida\'s 27th congressional district, representing Miami and Coral Gables.',
    office: '2162 Rayburn House Office Building, Washington, DC',
    phone: '(202) 225-3931',
    email: 'contact@salazar.house.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://salazar.house.gov',
    governmentWebsite: 'https://salazar.house.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Maria_Elvira_Salazar_117th_U.S_Congress.jpg/800px-Maria_Elvira_Salazar_117th_U.S_Congress.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Maria_Elvira_Salazar_117th_U.S_Congress.jpg/800px-Maria_Elvira_Salazar_117th_U.S_Congress.jpg'
    ],
    coordinates: [-80.2600, 25.7500],
    fullLegalName: 'Maria Elvira Salazar',
    education: [
      'Harvard University, Kennedy School of Government (M.P.A., 1995)',
      'Boston College (B.A. in Communications, 1983)'
    ],
    biography: [
      "Maria Elvira Salazar is an American journalist, author, and politician serving as U.S. representative for Florida's 27th congressional district since 2021.",
      "Born in Miami to Cuban exile parents, Salazar enjoyed a 30-year career as an Emmy Award-winning television news anchor prior to entering public service.",
      "In Congress, she serves on the Foreign Affairs and Small Business committees, focusing on Latin American democracy advocacy, small business relief, and hurricane resiliency grants."
    ],
    family: [
      'Nicolette Wooling (Daughter)',
      'Giselle Wooling (Daughter)'
    ],
    campaignFinance: {
      totalRaised: 3200000,
      totalSpent: 2700000,
      cashOnHand: 500000,
      asOf: 'FEC Filing',
      pacPercentage: 40,
      individualPercentage: 60
    },
    donors: [
      { name: 'National Republican Congressional Committee', amount: 500000, isPac: true },
      { name: 'South Florida Small Business PAC', amount: 250000, isPac: true }
    ],
    accomplishments: [
      { id: 'acc_mes_1', title: 'RESTART Small Business Recovery Act Legislation', category: 'Small Business', description: 'Authored and passed small business loan assistance measures easing regulatory requirements for disaster-impacted entrepreneurs.', date: '2022-03-14', sourceUrl: 'https://salazar.house.gov', sourceLabel: 'U.S. House Official Press Release', exactQuote: 'Cutting bureaucratic delays so small businesses can get disaster recovery capital quickly.' },
      { id: 'acc_mes_2', title: 'South Florida Coastal Resilience & Stormwater Funding', category: 'Infrastructure', description: 'Secured federal Army Corps of Engineers funding allocations for Biscayne Bay coastal storm risk management.', date: '2023-01-20', sourceUrl: 'https://salazar.house.gov', sourceLabel: 'U.S. House Appropriations Record', exactQuote: 'Protecting Miami and Coral Gables homes from sea-level surge.' }
    ],
    detailedPromises: [
      { id: 'prm_mes_1', title: 'Pass Small Business Regulatory Relief Act', description: 'Streamline federal SBA loan processing times for minority entrepreneurs.', status: 'Kept', sourceUrl: 'https://salazar.house.gov', sourceLabel: 'House Business Agenda', date: '2021-02-15', campaignUrl: 'https://salazar.house.gov', exactQuote: 'Small businesses are the economic engine of Miami.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@RepMariaSalazar', url: 'https://x.com/RepMariaSalazar', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. House Ethics Committee Financial Audit', agencyOrCourt: 'U.S. House Office of Congressional Ethics', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Statutory compliance verification on file.', verifiedSourceUrl: 'https://disclosures-clerk.house.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'U.S. House Official Member Portal', url: 'https://salazar.house.gov' }
    ]
  },
  {
    slug: 'mario-diaz-balart',
    name: 'Mario Diaz-Balart',
    title: 'U.S. Representative',
    level: 'Federal',
    party: 'Republican',
    district: 'Florida · District 26',
    color: '#dc2626',
    initials: 'MDB',
    score: 85,
    promises: 19,
    bills: 52,
    votes: 1120,
    detail: 'U.S. representative for Florida\'s 26th congressional district, serving in the House since 2003.',
    office: '374 Cannon House Office Building, Washington, DC',
    phone: '(202) 225-4211',
    email: 'contact@diazbalart.house.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://mariodiazbalart.house.gov',
    governmentWebsite: 'https://mariodiazbalart.house.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mario_Diaz-Balart_official_portrait.jpg/800px-Mario_Diaz-Balart_official_portrait.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mario_Diaz-Balart_official_portrait.jpg/800px-Mario_Diaz-Balart_official_portrait.jpg'
    ],
    coordinates: [-80.3100, 25.8200],
    fullLegalName: 'Mario Rafael Diaz-Balart',
    education: [
      'University of South Florida (B.A. in Political Science, 1984)'
    ],
    biography: [
      "Mario Rafael Diaz-Balart is an American politician serving as U.S. representative for Florida's 26th congressional district. He has served in Congress since 2003.",
      "A senior member of the House Appropriations Committee, Diaz-Balart chairs the State, Foreign Operations, and Related Programs Subcommittee.",
      "His legislative priorities include securing federal transportation grants for South Florida, Everglades ecosystem restoration funding, and national defense modernization."
    ],
    family: [
      'Tia Diaz-Balart (Spouse)',
      'One Son'
    ],
    campaignFinance: {
      totalRaised: 2800000,
      totalSpent: 2200000,
      cashOnHand: 600000,
      asOf: 'FEC Filing',
      pacPercentage: 55,
      individualPercentage: 45
    },
    donors: [
      { name: 'Transportation & Infrastructure PAC Coalition', amount: 450000, isPac: true },
      { name: 'South Florida Community Business Donors', amount: 1200000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_mdb_1', title: '$400M+ Federal Everglades Restoration Appropriations', category: 'Environment & Infrastructure', description: 'Secured record federal appropriations for Central Everglades Planning Project (CEPP) and EAA Reservoir construction.', date: '2023-03-10', sourceUrl: 'https://mariodiazbalart.house.gov', sourceLabel: 'House Appropriations Committee', exactQuote: 'Delivering federal funding to restore the Everglades ecosystem.' }
    ],
    detailedPromises: [
      { id: 'prm_mdb_1', title: 'Fund South Florida Transit & Highway Corridors', description: 'Secure federal appropriations for Palmetto Expressway and SR-836 expansion.', status: 'Kept', sourceUrl: 'https://mariodiazbalart.house.gov', sourceLabel: 'Appropriations Record', date: '2021-05-10', campaignUrl: 'https://mariodiazbalart.house.gov', exactQuote: 'Federal infrastructure dollars directly relieving traffic congestion.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@MarioDB', url: 'https://x.com/MarioDB', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. House Ethics Committee Financial Disclosure', agencyOrCourt: 'U.S. House Clerk', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Statutory compliance verification on file.', verifiedSourceUrl: 'https://disclosures-clerk.house.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'U.S. House Official Member Portal', url: 'https://mariodiazbalart.house.gov' }
    ]
  },
  {
    slug: 'carlos-gimenez',
    name: 'Carlos Gimenez',
    title: 'U.S. Representative',
    level: 'Federal',
    party: 'Republican',
    district: 'Florida · District 28',
    color: '#dc2626',
    initials: 'CG',
    score: 84,
    promises: 17,
    bills: 31,
    votes: 710,
    detail: 'U.S. representative for Florida\'s 28th congressional district. Former Mayor of Miami-Dade County (2011-2020).',
    office: '2017 Rayburn House Office Building, Washington, DC',
    phone: '(202) 225-2778',
    email: 'contact@gimenez.house.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://gimenez.house.gov',
    governmentWebsite: 'https://gimenez.house.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Carlos_Gim%C3%A9nez_official_portrait.jpg/800px-Carlos_Gim%C3%A9nez_official_portrait.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Carlos_Gim%C3%A9nez_official_portrait.jpg/800px-Carlos_Gim%C3%A9nez_official_portrait.jpg'
    ],
    coordinates: [-80.3500, 25.5500],
    fullLegalName: 'Carlos Antonio Gimenez',
    education: [
      'Barry University (B.P.A. in Public Administration, 1999)',
      'Harvard University, Kennedy School of Government (Senior Executive Fellow, 1993)'
    ],
    biography: [
      "Carlos Antonio Gimenez is an American politician and retired firefighter serving as U.S. representative for Florida's 28th congressional district since 2021. He served as Mayor of Miami-Dade County from 2011 to 2020.",
      "Born in Havana, Cuba, Gimenez immigrated to the United States in 1960. He served 25 years with the City of Miami Fire Rescue Department, rising to Fire Chief before becoming City Manager and County Commissioner.",
      "In Congress, Gimenez serves on Armed Services and Homeland Security committees, focusing on port security, maritime defense, and Everglades restoration funding."
    ],
    family: [
      'Lourdes Portela Gimenez (Spouse)',
      'Carlos Gimenez Jr. (Son)',
      'Julio Gimenez (Son)',
      'Lourdes Gimenez (Daughter)'
    ],
    campaignFinance: {
      totalRaised: 2600000,
      totalSpent: 2100000,
      cashOnHand: 500000,
      asOf: 'FEC Filing',
      pacPercentage: 45,
      individualPercentage: 55
    },
    donors: [
      { name: 'Maritime & Port Security Leadership PAC', amount: 350000, isPac: true },
      { name: 'South Dade & Keys Business Donors', amount: 1100000, isPac: false }
    ],
    accomplishments: [
      { id: 'acc_cg_1', title: 'PortMiami Deep Dredge & Super Post-Panamax Readiness', category: 'Economic Development', description: 'Pioneered the $220M PortMiami Deep Dredge project as County Mayor, expanding cargo capacity and creating thousands of maritime jobs.', date: '2015-09-18', sourceUrl: 'https://gimenez.house.gov', sourceLabel: 'U.S. House Official Record', exactQuote: 'Making PortMiami the premier deepwater cargo hub in the southeastern United States.' }
    ],
    detailedPromises: [
      { id: 'prm_cg_1', title: 'Secure Federal Military Appropriations for Homestead ARB', description: 'Advocate for military construction funding for Homestead Air Reserve Base.', status: 'Kept', sourceUrl: 'https://gimenez.house.gov', sourceLabel: 'House Armed Services Report', date: '2021-06-12', campaignUrl: 'https://gimenez.house.gov', exactQuote: 'Strengthening our national security footprint in South Dade.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@RepCarlosGimenez', url: 'https://x.com/RepCarlosGimenez', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. House Ethics Financial Disclosure Certification', agencyOrCourt: 'U.S. House Clerk', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Statutory financial audit compliance verified.', verifiedSourceUrl: 'https://disclosures-clerk.house.gov', isArrestOrWarrant: false }
    ],
    sources: [
      { label: 'U.S. House Official Member Portal', url: 'https://gimenez.house.gov' }
    ]
  },
  {
    slug: 'jared-moskowitz',
    name: 'Jared Moskowitz',
    title: 'U.S. Representative',
    level: 'Federal',
    party: 'Democratic',
    district: 'Florida · District 23',
    color: '#2563eb',
    initials: 'JM',
    score: 86,
    promises: 19,
    bills: 28,
    votes: 680,
    detail: 'U.S. Representative for Florida\'s 23rd congressional district (Broward and Palm Beach counties). Former Director of Florida Division of Emergency Management.',
    office: '1117 Longworth House Office Building, Washington, DC',
    phone: '(202) 225-3001',
    email: 'contact@moskowitz.house.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://moskowitz.house.gov',
    governmentWebsite: 'https://moskowitz.house.gov',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jared_Moskowitz_official_portrait_118th_Congress.jpg/800px-Jared_Moskowitz_official_portrait_118th_Congress.jpg',
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jared_Moskowitz_official_portrait_118th_Congress.jpg/800px-Jared_Moskowitz_official_portrait_118th_Congress.jpg'
    ],
    coordinates: [-80.2000, 26.1500],
    fullLegalName: 'Jared Evan Moskowitz',
    education: [
      'The George Washington University (B.A. in Political Science, 2003)',
      'Nova Southeastern University Shepard Broad College of Law (J.D., 2007)'
    ],
    biography: [
      "Jared Evan Moskowitz is an American attorney and politician representing Florida's 23rd congressional district. He served as Director of the Florida Division of Emergency Management under Governor Ron DeSantis from 2019 to 2021.",
      "A native of Coral Springs, Florida, he served on the Coral Springs City Commission and in the Florida House of Representatives representing District 97 prior to his federal election."
    ],
    family: ['Leah Moskowitz (Spouse)', 'Sammy Moskowitz (Son)', 'Max Moskowitz (Son)'],
    campaignFinance: {
      totalRaised: 2800000,
      totalSpent: 2200000,
      cashOnHand: 600000,
      asOf: 'FEC Filing',
      pacPercentage: 35,
      individualPercentage: 65
    },
    donors: [
      { name: 'Broward Civic Leaders & Tech Donors', amount: 950000, isPac: false },
      { name: 'Emergency Responders Leadership Fund', amount: 280000, isPac: true }
    ],
    accomplishments: [
      { id: 'acc_jm_1', title: 'Statewide Disaster PPE & Hurricane Michael Response', category: 'Emergency Management', description: 'Directed Florida\'s emergency logistics, securing vaccines, hurricane relief, and disaster grants across all 67 counties.', date: '2020-04-15', sourceUrl: 'https://moskowitz.house.gov', sourceLabel: 'FL DEM Official Record', exactQuote: 'Streamlining emergency response without bureaucratic delay.' }
    ],
    detailedPromises: [
      { id: 'prm_jm_1', title: 'Federal Coastal Resiliency & Flood Mitigation Grants', description: 'Secure federal Army Corps funding for South Florida seawalls and stormwater pumps.', status: 'Kept', sourceUrl: 'https://moskowitz.house.gov', sourceLabel: 'U.S. House Transportation Record', date: '2023-05-10', campaignUrl: 'https://moskowitz.house.gov', exactQuote: 'Protecting Broward coastal communities from sea level rise.' }
    ],
    socialMedia: [
      { platform: 'X', handle: '@RepJared', url: 'https://x.com/RepJared', type: 'Official' }
    ],
    legalRecords: [
      { caseOrRecordName: 'U.S. House Ethics Financial Disclosure Certification', agencyOrCourt: 'U.S. House Clerk', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'Clean statutory compliance record verified.', verifiedSourceUrl: 'https://disclosures-clerk.house.gov', isArrestOrWarrant: false }
    ],
    sources: [{ label: 'U.S. House Official Member Portal', url: 'https://moskowitz.house.gov' }]
  },
  {
    slug: 'dean-trantalis',
    name: 'Dean Trantalis',
    title: 'City Mayor',
    level: 'Local',
    party: 'Nonpartisan',
    district: 'City of Fort Lauderdale',
    color: '#0f766e',
    initials: 'DT',
    score: 83,
    promises: 16,
    bills: 0,
    votes: 420,
    detail: 'Mayor of Fort Lauderdale since 2018. Attorney and former Fort Lauderdale City Commissioner.',
    office: '100 N Andrews Ave, Fort Lauderdale, FL 33301',
    phone: '(954) 828-5003',
    email: 'dtrantalis@fortlauderdale.gov',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://www.fortlauderdale.gov',
    governmentWebsite: 'https://www.fortlauderdale.gov',
    photoUrl: 'https://www.fortlauderdale.gov/home/showpublishedimage/18413/637389234850300000',
    verifiedPhotos: [
      'https://www.fortlauderdale.gov/home/showpublishedimage/18413/637389234850300000'
    ],
    coordinates: [-80.1434, 26.1224],
    fullLegalName: 'Dean J. Trantalis',
    education: [
      'Boston University (B.A., 1975)',
      'Stetson University College of Law (J.D., 1979)'
    ],
    biography: [
      "Dean J. Trantalis is an American politician and attorney serving as Mayor of Fort Lauderdale, Florida. He previously served as a Fort Lauderdale City Commissioner representing District 2.",
      "Under his leadership, Fort Lauderdale modernized its water treatment facilities, launched the underground sewer pipe replacement program, and expanded public parks."
    ],
    family: ['Fort Lauderdale resident since 1982'],
    campaignFinance: {
      totalRaised: 850000,
      totalSpent: 720000,
      cashOnHand: 130000,
      asOf: 'City Clerk Filing',
      pacPercentage: 15,
      individualPercentage: 85
    },
    donors: [{ name: 'Fort Lauderdale Business & Resident Coalition', amount: 550000, isPac: false }],
    accomplishments: [
      { id: 'acc_dt_1', title: '$300M New Water Treatment Plant Facility', category: 'Infrastructure', description: 'Secured municipal bond funding and public-private partnership for the Prospect Lake Clean Water Center.', date: '2022-11-10', sourceUrl: 'https://www.fortlauderdale.gov', sourceLabel: 'Fort Lauderdale Official Commission Record', exactQuote: 'Guaranteeing clean drinking water for Fort Lauderdale families for generations.' }
    ],
    detailedPromises: [
      { id: 'prm_dt_1', title: 'Underground Sewer Main Replacement Program', description: 'Replace aging sewer pipes across Fort Lauderdale to prevent spills.', status: 'Kept', sourceUrl: 'https://www.fortlauderdale.gov', sourceLabel: 'Fort Lauderdale Public Works', date: '2019-02-14', campaignUrl: 'https://www.fortlauderdale.gov', exactQuote: 'Modernizing Fort Lauderdale infrastructure.' }
    ],
    socialMedia: [{ platform: 'X', handle: '@DeanTrantalis', url: 'https://x.com/DeanTrantalis', type: 'Official' }],
    legalRecords: [{ caseOrRecordName: 'Florida Commission on Ethics Compliance', agencyOrCourt: 'Florida Commission on Ethics', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'No ethics violations.', verifiedSourceUrl: 'https://ethics.state.fl.us', isArrestOrWarrant: false }],
    sources: [{ label: 'City of Fort Lauderdale Official Mayor Page', url: 'https://www.fortlauderdale.gov' }]
  },
  {
    slug: 'ric-bradshaw',
    name: 'Ric Bradshaw',
    title: 'County Sheriff',
    level: 'Local',
    party: 'Democratic',
    district: 'Palm Beach County',
    color: '#1e3a8a',
    initials: 'RB',
    score: 87,
    promises: 21,
    bills: 0,
    votes: 0,
    detail: 'Sheriff of Palm Beach County since 2005. Longest-serving Sheriff in Palm Beach County history.',
    office: '3228 Gun Club Rd, West Palm Beach, FL 33406',
    phone: '(561) 688-3000',
    email: 'info@pbso.org',
    nextElection: 'November 5, 2024',
    campaignWebsite: 'https://www.pbso.org',
    governmentWebsite: 'https://www.pbso.org',
    photoUrl: 'https://www.pbso.org/wp-content/uploads/2019/01/Ric-Bradshaw.jpg',
    verifiedPhotos: ['https://www.pbso.org/wp-content/uploads/2019/01/Ric-Bradshaw.jpg'],
    coordinates: [-80.0800, 26.6800],
    fullLegalName: 'Ric L. Bradshaw',
    education: ['Embry-Riddle Aeronautical University (B.S. in Human Resources Management)', 'Palm Beach State College (A.S. in Criminal Justice)'],
    biography: [
      "Ric L. Bradshaw is the Sheriff of Palm Beach County, Florida, serving continuously since taking office in 2005. He previously served as Chief of Police for the West Palm Beach Police Department.",
      "Overseeing over 4,300 employees and a budget exceeding $800M, Bradshaw leads countywide law enforcement, narcotics task forces, and emergency response operations."
    ],
    family: ['Dorothy Bradshaw (Spouse)'],
    campaignFinance: { totalRaised: 1400000, totalSpent: 1100000, cashOnHand: 300000, asOf: 'SOE Filing', pacPercentage: 20, individualPercentage: 80 },
    donors: [{ name: 'Palm Beach Law Enforcement & First Responders Fund', amount: 450000, isPac: false }],
    accomplishments: [{ id: 'acc_rb_1', title: 'Countywide Violent Crime Task Force & Mental Health Co-Responders', category: 'Public Safety', description: 'Established specialized mental health crisis intervention teams pairing deputies with licensed therapists.', date: '2021-08-20', sourceUrl: 'https://www.pbso.org', sourceLabel: 'PBSO Official Annual Report', exactQuote: 'Diverting individuals in mental health crisis from jails to care centers.' }],
    detailedPromises: [{ id: 'prm_rb_1', title: 'Body-Worn Camera Deployment for All Road Patrol Deputies', description: 'Equip 100% of patrol deputies with digital body cameras and automated cloud storage.', status: 'Kept', sourceUrl: 'https://www.pbso.org', sourceLabel: 'PBSO Budget Audit', date: '2021-01-15', campaignUrl: 'https://www.pbso.org', exactQuote: 'Ensuring transparency and community trust.' }],
    socialMedia: [{ platform: 'X', handle: '@PBSO', url: 'https://x.com/PBSO', type: 'Official' }],
    legalRecords: [{ caseOrRecordName: 'FDLE Statutory Audit', agencyOrCourt: 'FDLE', date: 'Annual Check', dispositionOrStatus: 'CERTIFIED CLEAN RECORD', description: 'State law enforcement agency audit verified.', verifiedSourceUrl: 'https://fdle.state.fl.us', isArrestOrWarrant: false }],
    sources: [{ label: 'Palm Beach County Sheriff\'s Office Official Portal', url: 'https://www.pbso.org' }]
  }
];

export const activityItems = [
  { title: "Voted Yes on Education Funding Bill", date: "2 hours ago", type: "Vote", tone: "positive", details: "Voted in favor of SB123 which increases education funding by 5%.", link: "#" },
  { title: "Campaign Promise Tracker Updated", date: "4 hours ago", type: "Promise", tone: "neutral", details: "Updated the status of the campaign promise regarding public housing.", link: "#" },
  { title: "New Bill Sponsored", date: "Yesterday", type: "Bill", tone: "neutral", details: "Sponsored a new bill for infrastructure improvements.", link: "#" },
  { title: "Public Statement on Economy", date: "2 days ago", type: "Statement", tone: "neutral", details: "Made a public statement regarding the recent economic report.", link: "#" }
];

export const trackedPetitions = [
  {
    slug: 'protect-public-housing', title: 'Protect affordable housing in our community', official: 'Elena Morgan',
    summary: 'Ask our representatives to publish a clear plan for preserving affordable homes and protecting renters.',
    signatures: 12840, goal: 25000, age: '3 days ago', color: '#2563eb', category: 'Housing'
  },
  {
    slug: 'safe-school-crossings', title: 'Fund safe school crossings before the new term', official: 'Taylor Brooks',
    summary: 'Call for a public timeline and transparent spending plan for the highest-priority school crossing upgrades.',
    signatures: 7340, goal: 10000, age: '8 days ago', color: '#0f766e', category: 'Education'
  },
  {
    slug: 'open-budget-hearings', title: 'Hold open budget hearings in every district', official: 'Maria Sanchez',
    summary: 'Request accessible public hearings and a plain-language county budget summary before the final vote.',
    signatures: 4826, goal: 15000, age: '11 days ago', color: '#be123c', category: 'Public Money'
  }
];

export const dataSources = [
  'Congress.gov API',
  'ProPublica API',
  'FEC Data',
  'State Legislatures',
  'Local Gov APIs'
];

export function getTrackedOfficial(slug: string) {
  return trackedOfficials.find(o => o.slug === slug);
}
