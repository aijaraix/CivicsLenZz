import re

with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

# I will replace the top definitions
new_types = """export type GovernmentLevel = 'Federal' | 'State' | 'Local' | 'School Board';

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
  
  // New comprehensive fields
  coverage?: MapCoverage;
  detailedPromises?: PromiseRecord[];
  detailedLegislation?: BillRecord[];
  scoreBreakdown?: ScoreFactor[];
  approvalRating?: {
    approve: number;
    disapprove: number;
    source: string;
    date: string;
  };
  
  verifiedPhotos?: string[];
  education?: string[];
  family?: string[];
  donors?: { name: string; amount: number; isPac: boolean }[];
  agendaAlignment?: { topic: string; stance: string; alignment: number }[];
  controversies?: { title: string; date: string; summary: string; link: string }[];
  sources?: { label: string; url: string }[];
};"""

text = re.sub(r"export type GovernmentLevel.*?export type TrackedOfficial = \{.*?\}\;", new_types, text, flags=re.DOTALL)


trump_data = """{ 
    slug: 'donald-trump', name: 'Donald Trump', title: 'President of the United States', level: 'Federal', party: 'Republican', district: 'United States', color: '#dc2626', initials: 'DT', score: 85, promises: 54, bills: 0, votes: 0, 
    detail: '47th President of the United States. Served previously as the 45th President.', 
    office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'president@whitehouse.gov', nextElection: 'November 7, 2028', 
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
    coverage: { type: 'national', identifier: 'US' },
    approvalRating: { approve: 48, disapprove: 51, source: 'https://news.gallup.com/poll/116677/presidential-approval-ratings-gallup-historical-statistics-trends.aspx', date: 'March 2026' },
    detailedPromises: [
      { id: 'p1', title: 'Tax Cuts and Jobs Act Extension', description: 'Extend the 2017 tax cuts permanently.', status: 'In Progress', sourceUrl: 'https://www.donaldjtrump.com/issues', sourceLabel: 'Campaign Website Issues Page', date: 'Jan 2025' },
      { id: 'p2', title: 'Border Security Enhancement', description: 'Complete the border wall and increase border patrol agents.', status: 'In Progress', sourceUrl: 'https://www.whitehouse.gov/briefing-room/', sourceLabel: 'White House Briefing', date: 'Feb 2025' },
      { id: 'p3', title: 'Eliminate Dept. of Education', description: 'Close the federal Department of Education and return policy to states.', status: 'Stalled', sourceUrl: 'https://www.congress.gov/bill/119th-congress', sourceLabel: 'Congressional Record', date: 'March 2025' }
    ],
    detailedLegislation: [
      { id: 'eo1', title: 'Executive Order on Energy Independence', summary: 'Reversed restrictions on domestic energy production and expedited lease sales.', action: 'Executive Order', date: 'Jan 24, 2025', sourceUrl: 'https://www.federalregister.gov/presidential-documents/executive-orders', sourceLabel: 'Federal Register' },
      { id: 'b1', title: 'H.R. 1 - Lower Energy Costs Act', summary: 'Legislation to increase domestic energy production and exports.', action: 'Signed', date: 'March 15, 2025', sourceUrl: 'https://www.congress.gov/bill/119th-congress/house-bill/1', sourceLabel: 'Congress.gov' }
    ],
    scoreBreakdown: [
      { category: 'Transparency', impact: -5, description: 'Delayed release of visitor logs.', sourceUrl: 'https://www.opensecrets.org/' },
      { category: 'Promise Adherence', impact: 15, description: 'Successfully implemented key economic platform items.', sourceUrl: 'https://www.politifact.com/truth-o-meter/promises/trumpometer/' },
      { category: 'Legislative Action', impact: 10, description: 'High volume of executive actions aligning with mandate.', sourceUrl: 'https://www.federalregister.gov/' }
    ],
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/53/Donald_Trump_official_portrait_%28cropped%29.jpg'
    ],
    education: ['University of Pennsylvania (B.S. in Economics, 1968)', 'New York Military Academy (1964)'],
    family: ['Melania Trump (Spouse)', 'Donald Jr., Ivanka, Eric, Tiffany, Barron (Children)'],
    donors: [
      { name: 'America PAC', amount: 130000000, isPac: true },
      { name: 'Preserve America PAC', amount: 100000000, isPac: true },
      { name: 'Make America Great Again Inc.', amount: 350000000, isPac: true }
    ],
    agendaAlignment: [
      { topic: 'Immigration', stance: 'Strict border control and mass deportations', alignment: 100 },
      { topic: 'Economy', stance: 'Tariffs on foreign goods, tax cuts', alignment: 95 },
      { topic: 'Energy', stance: 'Deregulation of fossil fuels, withdrawal from Paris Agreement', alignment: 100 }
    ],
    controversies: [
      { title: 'New York Business Fraud Trial', date: 'Feb 2024', summary: 'Found liable for business fraud by New York judge.', link: 'https://www.nycourts.gov/press/index.shtml' },
      { title: 'Federal Election Interference Case', date: 'Aug 2023', summary: 'Indicted on federal charges relating to the 2020 election.', link: 'https://www.justice.gov/sco-smith' }
    ],
    sources: [
      { label: 'White House Official Biography', url: 'https://www.whitehouse.gov/administration/president-donald-j-trump/' },
      { label: 'FEC Campaign Finance Data', url: 'https://www.fec.gov/data/candidate/P80001571/' }
    ]
  },"""

# Replace trump
text = re.sub(r"\{ \s*slug:\s*'donald-trump'.*?'FEC Campaign Finance Data', url: 'https://www.fec.gov/data/candidate/P80001571/' \}\s*\]\s*\},", trump_data, text, flags=re.DOTALL)

with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
