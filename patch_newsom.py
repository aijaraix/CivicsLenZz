import re
with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

newsom = """  { slug: 'gavin-newsom', name: 'Gavin Newsom', title: 'Governor of California', level: 'State', party: 'Democratic', district: 'California', color: '#2563eb', initials: 'GN', score: 70, promises: 45, bills: 0, votes: 0, detail: '40th governor of California, serving since 2019.', office: '1021 O Street, Suite 9000, Sacramento, CA', phone: '(916) 445-2841', email: 'governor@california.gov', nextElection: 'November 3, 2026', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Gavin_Newsom_official_portrait_2019.jpg', coordinates: [-121.4944, 38.5816] },
"""

text = text.replace("  { slug: 'ron-desantis',", newsom + "  { slug: 'ron-desantis',")

with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
