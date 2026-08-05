export type GovernmentLevel = 'Federal' | 'State' | 'Local' | 'School Board';

export type MapCoverage = {
  type: 'national' | 'state' | 'county' | 'city' | 'district';
  identifier: string; // e.g. "US", "FL", "Miami-Dade"
};

export type PromiseRecord = {
  id: string;
  title: string;
  description: string;
  status: 'Kept' | 'Broken' | 'In Progress' | 'Stalled';
  sourceUrl: string;
  sourceLabel: string;
  date: string;
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
  donors?: { name: string; amount: number; isPac: boolean }[];
  endorsements?: { name: string; type: string }[];
  electionHistory?: { year: number; office: string; opponents: string[]; outcome: string; votePercentage: string }[];
  
  // Legal & Controversies
  legalHistory?: { caseName: string; date: string; outcome: string; description: string }[];
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
  socialMedia?: { platform: string; handle: string; url: string }[];
  
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
    slug: 'donald-trump', name: 'Donald Trump', title: 'President of the United States', level: 'Federal', party: 'Republican', district: 'United States', color: '#dc2626', initials: 'DT', score: 85, promises: 54, bills: 6, votes: 0,
    detail: '47th President of the United States. Served previously as the 45th President.',
    office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'president@whitehouse.gov', nextElection: 'November 7, 2028',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
    coverage: { type: 'national', identifier: 'US' },
    coordinates: [-77.0369, 38.9072],
    approvalRating: { approve: 48, disapprove: 51, source: 'https://news.gallup.com/poll/116677/presidential-approval-ratings-gallup-historical-statistics-trends.aspx', date: 'March 2026' },
    fullLegalName: 'Donald John Trump',
    nicknames: ['45', '47', 'The Donald', 'DJT'],
    dateOfBirth: 'June 14, 1946',
    placeOfBirth: 'Queens, New York City, NY',
    nationality: 'American',
    militaryService: 'None (Received medical deferment in 1968)',
    education: [
      'University of Pennsylvania, Wharton School (B.S. in Economics, 1968)',
      'Fordham University (Attended 1964-1966)',
      'New York Military Academy (High School Diploma, 1964)'
    ],
    biography: [
      "Donald John Trump is an American politician, media personality, and businessman who is the 47th president of the United States. He also served as the 45th president from 2017 to 2021. Born and raised in Queens, New York City, Trump graduated from the Wharton School of the University of Pennsylvania with a bachelor's degree in 1968.",
      "He became president of his father Fred Trump's real estate business in 1971 and renamed it the Trump Organization. He expanded the company's operations to building and renovating skyscrapers, hotels, casinos, and golf courses. He later started side ventures, mostly by licensing his name. From 2004 to 2015, he co-produced and hosted the reality television series The Apprentice.",
      "Trump's political positions have been described as populist, protectionist, isolationist, and nationalist. He entered the 2016 presidential race as a Republican and defeated Democratic nominee Hillary Clinton. His first term included passing the Tax Cuts and Jobs Act of 2017, appointing three conservative Supreme Court justices, and withdrawing from the Paris Agreement and the Iran nuclear deal.",
      "After losing the 2020 election, Trump successfully sought the presidency again in 2024, becoming only the second president in U.S. history (after Grover Cleveland) to serve non-consecutive terms."
    ],
    family: [
      'Melania Trump (Spouse, m. 2005)',
      'Marla Maples (Former Spouse, m. 1993-1999)',
      'Ivana Trump (Former Spouse, m. 1977-1992)',
      'Donald Trump Jr. (Son)',
      'Ivanka Trump (Daughter)',
      'Eric Trump (Son)',
      'Tiffany Trump (Daughter)',
      'Barron Trump (Son)',
      'Fred Trump (Father, 1905-1999)',
      'Mary Anne MacLeod Trump (Mother, 1912-2000)'
    ],
    relationships: [
      { name: 'Elon Musk', relationType: 'Key Advisor / Donor', description: 'Headed the Department of Government Efficiency (DOGE) in the second term.' },
      { name: 'Vladimir Putin', relationType: 'Foreign Leader', description: 'Expressed admiration; faced scrutiny over relations during first term.' },
      { name: 'JD Vance', relationType: 'Vice President', description: 'Selected as running mate for the 2024 presidential election.' }
    ],
    keyStaff: [
      { name: 'Susie Wiles', role: 'White House Chief of Staff' },
      { name: 'Stephen Miller', role: 'Deputy Chief of Staff for Policy' },
      { name: 'Dan Scavino', role: 'Deputy Chief of Staff' }
    ]
  },
  { slug: 'jd-vance', name: 'JD Vance', title: 'Vice President of the United States', level: 'Federal', party: 'Republican', district: 'United States', color: '#dc2626', initials: 'JV', score: 88, promises: 30, bills: 0, votes: 5, detail: '50th Vice President of the United States.', office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'vp@whitehouse.gov', nextElection: 'November 7, 2028', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/J._D._Vance_official_portrait_118th_Congress.jpg', coordinates: [-77.0369, 38.9072] },
  { slug: 'marco-rubio', name: 'Marco Rubio', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Florida', color: '#dc2626', initials: 'MR', score: 71, promises: 25, bills: 60, votes: 980, detail: 'Serving as the senior United States senator from Florida since 2011.', office: '284 Russell Senate Office Building', phone: '(202) 224-3041', email: 'contact@rubio.senate.gov', nextElection: 'November 7, 2028', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Senator_Rubio_official_portrait.jpg', coordinates: [-81.5158, 27.6648] },
  { slug: 'rick-scott', name: 'Rick Scott', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Florida', color: '#dc2626', initials: 'RS', score: 68, promises: 22, bills: 45, votes: 910, detail: 'Serving as the junior United States senator from Florida since 2019.', office: '502 Hart Senate Office Building', phone: '(202) 224-5274', email: 'contact@rickscott.senate.gov', nextElection: 'November 5, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Senator_Rick_Scott_official_portrait_2019.jpg', coordinates: [-81.5158, 27.6648] },
  { slug: 'frederica-wilson', name: 'Frederica Wilson', title: 'U.S. Representative', level: 'Federal', party: 'Democratic', district: 'Florida · District 24', color: '#2563eb', initials: 'FW', score: 82, promises: 15, bills: 28, votes: 750, detail: 'Serving as the U.S. representative for Florida\'s 24th congressional district.', office: '2080 Rayburn House Office Building', phone: '(202) 225-4506', email: 'contact@wilson.house.gov', nextElection: 'November 5, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Frederica_Wilson%2C_official_portrait%2C_112th_Congress.jpg', coordinates: [-80.1918, 25.7617] },
  { slug: 'chuck-schumer', name: 'Chuck Schumer', title: 'U.S. Senator', level: 'Federal', party: 'Democratic', district: 'New York', color: '#2563eb', initials: 'CS', score: 82, promises: 45, bills: 120, votes: 1500, detail: 'Senate Majority Leader from New York.', office: '322 Hart Senate Office Building', phone: '(202) 224-6542', email: 'senator@schumer.senate.gov', nextElection: 'November 7, 2028', coordinates: [-73.9352, 40.7306] },
  { slug: 'mitch-mcconnell', name: 'Mitch McConnell', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Kentucky', color: '#dc2626', initials: 'MM', score: 70, promises: 30, bills: 80, votes: 1800, detail: 'Senate Minority Leader from Kentucky.', office: '317 Russell Senate Office Building', phone: '(202) 224-2541', email: 'senator@mcconnell.senate.gov', nextElection: 'November 3, 2026', coordinates: [-84.8733, 37.8393] },
  { slug: 'nancy-pelosi', name: 'Nancy Pelosi', title: 'U.S. Representative', level: 'Federal', party: 'Democratic', district: 'California · District 11', color: '#2563eb', initials: 'NP', score: 85, promises: 50, bills: 200, votes: 2000, detail: 'Representative from California.', office: '1236 Longworth House Office Building', phone: '(202) 225-4965', email: 'contact@pelosi.house.gov', nextElection: 'November 5, 2024', coordinates: [-122.4194, 37.7749] },
  { slug: 'kevin-mccarthy', name: 'Kevin McCarthy', title: 'U.S. Representative', level: 'Federal', party: 'Republican', district: 'California · District 20', color: '#dc2626', initials: 'KM', score: 68, promises: 35, bills: 100, votes: 1600, detail: 'Representative from California.', office: '2468 Rayburn House Office Building', phone: '(202) 225-2915', email: 'contact@mccarthy.house.gov', nextElection: 'November 5, 2024', coordinates: [-119.0187, 35.3733] },
  { slug: 'ted-cruz', name: 'Ted Cruz', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Texas', color: '#dc2626', initials: 'TC', score: 75, promises: 40, bills: 90, votes: 1200, detail: 'Senator from Texas.', office: '127A Russell Senate Office Building', phone: '(202) 224-5922', email: 'contact@cruz.senate.gov', nextElection: 'November 5, 2024', coordinates: [-97.7431, 30.2672] },
  { slug: 'alexandria-ocasio-cortez', name: 'Alexandria Ocasio-Cortez', title: 'U.S. Representative', level: 'Federal', party: 'Democratic', district: 'New York · District 14', color: '#2563eb', initials: 'AOC', score: 90, promises: 60, bills: 150, votes: 800, detail: 'Representative from New York.', office: '229 Cannon House Office Building', phone: '(202) 225-3965', email: 'contact@ocasio-cortez.house.gov', nextElection: 'November 5, 2024', coordinates: [-73.8449, 40.8448] },
  { slug: 'bernie-sanders', name: 'Bernie Sanders', title: 'U.S. Senator', level: 'Federal', party: 'Independent', district: 'Vermont', color: '#10b981', initials: 'BS', score: 88, promises: 55, bills: 130, votes: 1900, detail: 'Senator from Vermont.', office: '332 Dirksen Senate Office Building', phone: '(202) 224-5141', email: 'contact@sanders.senate.gov', nextElection: 'November 5, 2024', coordinates: [-72.5778, 44.2601] },
  { slug: 'elizabeth-warren', name: 'Elizabeth Warren', title: 'U.S. Senator', level: 'Federal', party: 'Democratic', district: 'Massachusetts', color: '#2563eb', initials: 'EW', score: 86, promises: 48, bills: 110, votes: 1400, detail: 'Senator from Massachusetts.', office: '309 Hart Senate Office Building', phone: '(202) 224-4543', email: 'contact@warren.senate.gov', nextElection: 'November 5, 2024', coordinates: [-71.0589, 42.3601] },
  { slug: 'mitt-romney', name: 'Mitt Romney', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Utah', color: '#dc2626', initials: 'MR', score: 72, promises: 28, bills: 75, votes: 1100, detail: 'Senator from Utah.', office: '354 Russell Senate Office Building', phone: '(202) 224-5251', email: 'contact@romney.senate.gov', nextElection: 'November 5, 2024', coordinates: [-111.8910, 40.7608] },
  { slug: 'cory-booker', name: 'Cory Booker', title: 'U.S. Senator', level: 'Federal', party: 'Democratic', district: 'New Jersey', color: '#2563eb', initials: 'CB', score: 84, promises: 42, bills: 105, votes: 1300, detail: 'Senator from New Jersey.', office: '717 Hart Senate Office Building', phone: '(202) 224-3224', email: 'contact@booker.senate.gov', nextElection: 'November 5, 2024', coordinates: [-74.1724, 40.7357] },
  { slug: 'rand-paul', name: 'Rand Paul', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Kentucky', color: '#dc2626', initials: 'RP', score: 74, promises: 38, bills: 85, votes: 1250, detail: 'Senator from Kentucky.', office: '167 Russell Senate Office Building', phone: '(202) 224-4343', email: 'contact@paul.senate.gov', nextElection: 'November 5, 2024', coordinates: [-84.5204, 38.0315] },
  { slug: 'amy-klobuchar', name: 'Amy Klobuchar', title: 'U.S. Senator', level: 'Federal', party: 'Democratic', district: 'Minnesota', color: '#2563eb', initials: 'AK', score: 83, promises: 40, bills: 115, votes: 1350, detail: 'Senator from Minnesota.', office: '425 Dirksen Senate Office Building', phone: '(202) 224-3244', email: 'contact@klobuchar.senate.gov', nextElection: 'November 5, 2024', coordinates: [-93.2650, 44.9778] },
  { slug: 'gavin-newsom', name: 'Gavin Newsom', title: 'Governor of California', level: 'State', party: 'Democratic', district: 'California', color: '#2563eb', initials: 'GN', score: 70, promises: 45, bills: 0, votes: 0, detail: '40th governor of California, serving since 2019.', office: '1021 O Street, Suite 9000, Sacramento, CA', phone: '(916) 445-2841', email: 'governor@california.gov', nextElection: 'November 3, 2026', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Gavin_Newsom_official_portrait_2019.jpg', coordinates: [-121.4944, 38.5816] },
  { slug: 'ron-desantis', name: 'Ron DeSantis', title: 'Governor of Florida', level: 'State', party: 'Republican', district: 'Florida', color: '#dc2626', initials: 'RD', score: 65, promises: 40, bills: 0, votes: 0, detail: '46th governor of Florida, serving since 2019.', office: 'The Capitol, 400 S. Monroe St.', phone: '(850) 717-9337', email: 'governor@florida.gov', nextElection: 'November 3, 2026', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Ron_DeSantis_official_gubernatorial_portrait.jpg', coordinates: [-84.2807, 30.4383] },
  { slug: 'shevrin-jones', name: 'Shevrin Jones', title: 'State Senator', level: 'State', party: 'Democratic', district: 'Florida · District 34', color: '#2563eb', initials: 'SJ', score: 86, promises: 18, bills: 32, votes: 215, detail: 'Serving as a member of the Florida Senate representing the 34th district.', office: '214 Senate Building, Tallahassee, FL', phone: '(850) 487-5034', email: 'jones.shevrin.web@flsenate.gov', nextElection: 'November 5, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Shevrin_Jones_%28cropped%29.jpg', coordinates: [-80.2500, 25.8000] },
  { slug: 'fabian-basabe', name: 'Fabian Basabe', title: 'State Representative', level: 'State', party: 'Republican', district: 'Florida · District 106', color: '#dc2626', initials: 'FB', score: 69, promises: 12, bills: 10, votes: 112, detail: 'Serving as a member of the Florida House of Representatives.', office: '1302 The Capitol, Tallahassee, FL', phone: '(850) 717-5106', email: 'fabian.basabe@myfloridahouse.gov', nextElection: 'November 5, 2024', coordinates: [-80.1300, 25.7900] },
  { slug: 'daniella-levine-cava', name: 'Daniella Levine Cava', title: 'Mayor', level: 'Local', party: 'Democratic', district: 'Miami-Dade County', color: '#2563eb', initials: 'DLC', score: 85, promises: 30, bills: 0, votes: 0, detail: 'Mayor of Miami-Dade County, serving since 2020.', office: '111 NW 1st St, Miami, FL', phone: '(305) 375-5071', email: 'mayor@miamidade.gov', nextElection: 'August 20, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Daniella_Levine_Cava_portrait.jpg', coordinates: [-80.1918, 25.7617] },
  { slug: 'steven-meiner', name: 'Steven Meiner', title: 'Mayor', level: 'Local', party: 'Nonpartisan', district: 'Miami Beach', color: '#64748b', initials: 'SM', score: 76, promises: 10, bills: 0, votes: 0, detail: 'Mayor of Miami Beach.', office: '1700 Convention Center Drive, Miami Beach, FL', phone: '(305) 673-7030', email: 'stevenmeiner@miamibeachfl.gov', nextElection: 'November 2025', coordinates: [-80.1300, 25.7900] },
  { slug: 'alex-fernandez', name: 'Alex Fernandez', title: 'City Commissioner', level: 'Local', party: 'Nonpartisan', district: 'Miami Beach · Group 3', color: '#64748b', initials: 'AF', score: 79, promises: 8, bills: 0, votes: 0, detail: 'Commissioner for the City of Miami Beach.', office: '1700 Convention Center Drive, Miami Beach, FL', phone: '(305) 673-7030', email: 'alexfernandez@miamibeachfl.gov', nextElection: 'November 2025', coordinates: [-80.1300, 25.7900] },
  { slug: 'lucia-baez-geller', name: 'Lucia Baez-Geller', title: 'School Board Member', level: 'School Board', party: 'Nonpartisan', district: 'Miami-Dade · District 3', color: '#64748b', initials: 'LBG', score: 81, promises: 14, bills: 0, votes: 45, detail: 'Member of the Miami-Dade County School Board.', office: '1450 NE 2nd Ave, Miami, FL', phone: '(305) 995-1334', email: 'district3@dadeschools.net', nextElection: 'November 5, 2024', coordinates: [-80.1918, 25.7617] }
];



export type ActivityItem = {
  title: string;
  date: string;
  type: string;
  tone: string;
  details?: string;
  link?: string;
};

export const activityItems: ActivityItem[] = [
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
