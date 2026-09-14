with open("src/lib/civic-database.ts", "r") as f:
    lines = f.readlines()

new_array = """export const trackedOfficials: TrackedOfficial[] = [
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
  { slug: 'ron-desantis', name: 'Ron DeSantis', title: 'Governor of Florida', level: 'State', party: 'Republican', district: 'Florida', color: '#dc2626', initials: 'RD', score: 65, promises: 40, bills: 0, votes: 0, detail: '46th governor of Florida, serving since 2019.', office: 'The Capitol, 400 S. Monroe St.', phone: '(850) 717-9337', email: 'governor@florida.gov', nextElection: 'November 3, 2026', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Ron_DeSantis_official_gubernatorial_portrait.jpg', coordinates: [-84.2807, 30.4383] },
  { slug: 'shevrin-jones', name: 'Shevrin Jones', title: 'State Senator', level: 'State', party: 'Democratic', district: 'Florida · District 34', color: '#2563eb', initials: 'SJ', score: 86, promises: 18, bills: 32, votes: 215, detail: 'Serving as a member of the Florida Senate representing the 34th district.', office: '214 Senate Building, Tallahassee, FL', phone: '(850) 487-5034', email: 'jones.shevrin.web@flsenate.gov', nextElection: 'November 5, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Shevrin_Jones_%28cropped%29.jpg', coordinates: [-80.2500, 25.8000] },
  { slug: 'fabian-basabe', name: 'Fabian Basabe', title: 'State Representative', level: 'State', party: 'Republican', district: 'Florida · District 106', color: '#dc2626', initials: 'FB', score: 69, promises: 12, bills: 10, votes: 112, detail: 'Serving as a member of the Florida House of Representatives.', office: '1302 The Capitol, Tallahassee, FL', phone: '(850) 717-5106', email: 'fabian.basabe@myfloridahouse.gov', nextElection: 'November 5, 2024', coordinates: [-80.1300, 25.7900] },
  { slug: 'daniella-levine-cava', name: 'Daniella Levine Cava', title: 'Mayor', level: 'Local', party: 'Democratic', district: 'Miami-Dade County', color: '#2563eb', initials: 'DLC', score: 85, promises: 30, bills: 0, votes: 0, detail: 'Mayor of Miami-Dade County, serving since 2020.', office: '111 NW 1st St, Miami, FL', phone: '(305) 375-5071', email: 'mayor@miamidade.gov', nextElection: 'August 20, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Daniella_Levine_Cava_portrait.jpg', coordinates: [-80.1918, 25.7617] },
  { slug: 'steven-meiner', name: 'Steven Meiner', title: 'Mayor', level: 'Local', party: 'Nonpartisan', district: 'Miami Beach', color: '#64748b', initials: 'SM', score: 76, promises: 10, bills: 0, votes: 0, detail: 'Mayor of Miami Beach.', office: '1700 Convention Center Drive, Miami Beach, FL', phone: '(305) 673-7030', email: 'stevenmeiner@miamibeachfl.gov', nextElection: 'November 2025', coordinates: [-80.1300, 25.7900] },
  { slug: 'alex-fernandez', name: 'Alex Fernandez', title: 'City Commissioner', level: 'Local', party: 'Nonpartisan', district: 'Miami Beach · Group 3', color: '#64748b', initials: 'AF', score: 79, promises: 8, bills: 0, votes: 0, detail: 'Commissioner for the City of Miami Beach.', office: '1700 Convention Center Drive, Miami Beach, FL', phone: '(305) 673-7030', email: 'alexfernandez@miamibeachfl.gov', nextElection: 'November 2025', coordinates: [-80.1300, 25.7900] },
  { slug: 'lucia-baez-geller', name: 'Lucia Baez-Geller', title: 'School Board Member', level: 'School Board', party: 'Nonpartisan', district: 'Miami-Dade · District 3', color: '#64748b', initials: 'LBG', score: 81, promises: 14, bills: 0, votes: 45, detail: 'Member of the Miami-Dade County School Board.', office: '1450 NE 2nd Ave, Miami, FL', phone: '(305) 995-1334', email: 'district3@dadeschools.net', nextElection: 'November 5, 2024', coordinates: [-80.1918, 25.7617] }
];
"""

with open("src/lib/civic-database.ts", "w") as f:
    f.writelines(lines[:123])
    f.write(new_array + "\n")
    f.writelines(lines[331:])

