import re

with open("src/lib/demo-data.ts", "r") as f:
    text = f.read()

text = text.replace(
    "{ slug: 'joe-biden', name: 'Joe Biden', title: 'President of the United States', level: 'Federal', party: 'Democratic', district: 'United States', color: '#2563eb', initials: 'JB', score: 85, promises: 54, bills: 0, votes: 0, detail: '46th President of the United States.', office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'president@whitehouse.gov', nextElection: 'November 5, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Joe_Biden_presidential_portrait.jpg' }",
    "{ slug: 'donald-trump', name: 'Donald Trump', title: 'President of the United States', level: 'Federal', party: 'Republican', district: 'United States', color: '#dc2626', initials: 'DT', score: 85, promises: 54, bills: 0, votes: 0, detail: '47th President of the United States.', office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'president@whitehouse.gov', nextElection: 'November 7, 2028', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg' }"
)

text = text.replace(
    "{ slug: 'kamala-harris', name: 'Kamala Harris', title: 'Vice President of the United States', level: 'Federal', party: 'Democratic', district: 'United States', color: '#2563eb', initials: 'KH', score: 88, promises: 30, bills: 0, votes: 5, detail: '49th Vice President of the United States.', office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'vp@whitehouse.gov', nextElection: 'November 5, 2024', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Kamala_Harris_Vice_Presidential_Portrait.jpg' }",
    "{ slug: 'jd-vance', name: 'JD Vance', title: 'Vice President of the United States', level: 'Federal', party: 'Republican', district: 'United States', color: '#dc2626', initials: 'JV', score: 88, promises: 30, bills: 0, votes: 5, detail: '50th Vice President of the United States.', office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'vp@whitehouse.gov', nextElection: 'November 7, 2028', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/J._D._Vance_official_portrait_118th_Congress.jpg' }"
)

with open("src/lib/demo-data.ts", "w") as f:
    f.write(text)
