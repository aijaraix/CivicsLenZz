import re

with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

# Expand the interface
type_def_match = re.search(r'export type TrackedOfficial = \{.*?\};', text, flags=re.DOTALL)
if type_def_match:
    new_type_def = """export type TrackedOfficial = {
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
  verifiedPhotos?: string[];
  education?: string[];
  family?: string[];
  donors?: { name: string; amount: number; isPac: boolean }[];
  agendaAlignment?: { topic: string; stance: string; alignment: number }[];
  controversies?: { title: string; date: string; summary: string; link: string }[];
  sources?: { label: string; url: string }[];
};"""
    text = text[:type_def_match.start()] + new_type_def + text[type_def_match.end():]

# Expand Trump's object specifically
trump_match = re.search(r"\{ slug: 'donald-trump'.*?'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg' \},", text)
if trump_match:
    new_trump = """{ 
    slug: 'donald-trump', name: 'Donald Trump', title: 'President of the United States', level: 'Federal', party: 'Republican', district: 'United States', color: '#dc2626', initials: 'DT', score: 85, promises: 54, bills: 0, votes: 0, 
    detail: '47th President of the United States. Served previously as the 45th President.', 
    office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'president@whitehouse.gov', nextElection: 'November 7, 2028', 
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
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
      { title: 'New York Business Fraud Trial', date: 'Feb 2024', summary: 'Found liable for business fraud by New York judge.', link: 'https://example.com/ny-trial' },
      { title: 'Federal Election Interference Case', date: 'Aug 2023', summary: 'Indicted on federal charges relating to the 2020 election.', link: 'https://example.com/election-case' }
    ],
    sources: [
      { label: 'White House Official Biography', url: 'https://www.whitehouse.gov/administration/president-donald-j-trump/' },
      { label: 'FEC Campaign Finance Data', url: 'https://www.fec.gov/data/candidate/P80001571/' }
    ]
  },"""
    text = text[:trump_match.start()] + new_trump + text[trump_match.end():]


with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
