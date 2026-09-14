import re

with open("src/lib/demo-data.ts", "r") as f:
    text = f.read()

# Replace addressSuggestions
suggestions_match = re.search(r'export const addressSuggestions = \[.*?\];', text, flags=re.DOTALL)
if suggestions_match:
    new_suggestions = """export const addressSuggestions = [
  '8310 Byron Ave, Miami Beach, FL 33141',
  '1600 Pennsylvania Avenue NW, Washington, DC 20500',
  '500 S Orange Ave, Orlando, FL 32801',
];"""
    text = text[:suggestions_match.start()] + new_suggestions + text[suggestions_match.end():]

# Replace demoOfficials
officials_match = re.search(r'export const demoOfficials: DemoOfficial\[\] = \[.*?\];', text, flags=re.DOTALL)
if officials_match:
    new_officials = """export const demoOfficials: DemoOfficial[] = [
  { slug: 'joe-biden', name: 'Joe Biden', title: 'President of the United States', level: 'Federal', party: 'Democratic', district: 'United States', color: '#2563eb', initials: 'JB', score: 85, promises: 54, bills: 0, votes: 0, detail: '46th President of the United States.', office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'president@whitehouse.gov', nextElection: 'November 5, 2024' },
  { slug: 'kamala-harris', name: 'Kamala Harris', title: 'Vice President of the United States', level: 'Federal', party: 'Democratic', district: 'United States', color: '#2563eb', initials: 'KH', score: 88, promises: 30, bills: 0, votes: 5, detail: '49th Vice President of the United States.', office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'vp@whitehouse.gov', nextElection: 'November 5, 2024' },
  { slug: 'marco-rubio', name: 'Marco Rubio', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Florida', color: '#dc2626', initials: 'MR', score: 71, promises: 25, bills: 60, votes: 980, detail: 'Serving as the senior United States senator from Florida since 2011.', office: '284 Russell Senate Office Building', phone: '(202) 224-3041', email: 'contact@rubio.senate.gov', nextElection: 'November 7, 2028' },
  { slug: 'rick-scott', name: 'Rick Scott', title: 'U.S. Senator', level: 'Federal', party: 'Republican', district: 'Florida', color: '#dc2626', initials: 'RS', score: 68, promises: 22, bills: 45, votes: 910, detail: 'Serving as the junior United States senator from Florida since 2019.', office: '502 Hart Senate Office Building', phone: '(202) 224-5274', email: 'contact@rickscott.senate.gov', nextElection: 'November 5, 2024' },
  { slug: 'frederica-wilson', name: 'Frederica Wilson', title: 'U.S. Representative', level: 'Federal', party: 'Democratic', district: 'Florida · District 24', color: '#2563eb', initials: 'FW', score: 82, promises: 15, bills: 28, votes: 750, detail: 'Serving as the U.S. representative for Florida\\'s 24th congressional district.', office: '2080 Rayburn House Office Building', phone: '(202) 225-4506', email: 'contact@wilson.house.gov', nextElection: 'November 5, 2024' },
  { slug: 'ron-desantis', name: 'Ron DeSantis', title: 'Governor of Florida', level: 'State', party: 'Republican', district: 'Florida', color: '#dc2626', initials: 'RD', score: 65, promises: 40, bills: 0, votes: 0, detail: '46th governor of Florida, serving since 2019.', office: 'The Capitol, 400 S. Monroe St.', phone: '(850) 717-9337', email: 'governor@florida.gov', nextElection: 'November 3, 2026' },
  { slug: 'shevrin-jones', name: 'Shevrin Jones', title: 'State Senator', level: 'State', party: 'Democratic', district: 'Florida · District 34', color: '#2563eb', initials: 'SJ', score: 86, promises: 18, bills: 32, votes: 215, detail: 'Serving as a member of the Florida Senate representing the 34th district.', office: '214 Senate Building, Tallahassee, FL', phone: '(850) 487-5034', email: 'jones.shevrin.web@flsenate.gov', nextElection: 'November 5, 2024' },
  { slug: 'fabian-basabe', name: 'Fabian Basabe', title: 'State Representative', level: 'State', party: 'Republican', district: 'Florida · District 106', color: '#dc2626', initials: 'FB', score: 69, promises: 12, bills: 10, votes: 112, detail: 'Serving as a member of the Florida House of Representatives.', office: '1302 The Capitol, Tallahassee, FL', phone: '(850) 717-5106', email: 'fabian.basabe@myfloridahouse.gov', nextElection: 'November 5, 2024' },
  { slug: 'daniella-levine-cava', name: 'Daniella Levine Cava', title: 'Mayor', level: 'Local', party: 'Democratic', district: 'Miami-Dade County', color: '#2563eb', initials: 'DLC', score: 85, promises: 30, bills: 0, votes: 0, detail: 'Mayor of Miami-Dade County, serving since 2020.', office: '111 NW 1st St, Miami, FL', phone: '(305) 375-5071', email: 'mayor@miamidade.gov', nextElection: 'August 20, 2024' },
  { slug: 'steven-meiner', name: 'Steven Meiner', title: 'Mayor', level: 'Local', party: 'Nonpartisan', district: 'Miami Beach', color: '#64748b', initials: 'SM', score: 76, promises: 10, bills: 0, votes: 0, detail: 'Mayor of Miami Beach.', office: '1700 Convention Center Drive, Miami Beach, FL', phone: '(305) 673-7030', email: 'stevenmeiner@miamibeachfl.gov', nextElection: 'November 2025' },
  { slug: 'alex-fernandez', name: 'Alex Fernandez', title: 'City Commissioner', level: 'Local', party: 'Nonpartisan', district: 'Miami Beach · Group 3', color: '#64748b', initials: 'AF', score: 79, promises: 8, bills: 0, votes: 0, detail: 'Commissioner for the City of Miami Beach.', office: '1700 Convention Center Drive, Miami Beach, FL', phone: '(305) 673-7030', email: 'alexfernandez@miamibeachfl.gov', nextElection: 'November 2025' },
  { slug: 'lucia-baez-geller', name: 'Lucia Baez-Geller', title: 'School Board Member', level: 'School Board', party: 'Nonpartisan', district: 'Miami-Dade · District 3', color: '#64748b', initials: 'LBG', score: 81, promises: 14, bills: 0, votes: 45, detail: 'Member of the Miami-Dade County School Board.', office: '1450 NE 2nd Ave, Miami, FL', phone: '(305) 995-1334', email: 'district3@dadeschools.net', nextElection: 'November 5, 2024' },
];"""
    text = text[:officials_match.start()] + new_officials + text[officials_match.end():]

with open("src/lib/demo-data.ts", "w") as f:
    f.write(text)
