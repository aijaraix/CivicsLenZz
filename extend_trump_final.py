import re

with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

new_trump_block = """    slug: 'donald-trump', name: 'Donald Trump', title: 'President of the United States', level: 'Federal', party: 'Republican', district: 'United States', color: '#dc2626', initials: 'DT', score: 85, promises: 54, bills: 6, votes: 0, 
    detail: '47th President of the United States. Served previously as the 45th President.', 
    office: '1600 Pennsylvania Ave NW, Washington, DC', phone: '(202) 456-1111', email: 'president@whitehouse.gov', nextElection: 'November 7, 2028', 
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
    coverage: { type: 'national', identifier: 'US' },
    approvalRating: { approve: 48, disapprove: 51, source: 'https://news.gallup.com/poll/116677/presidential-approval-ratings-gallup-historical-statistics-trends.aspx', date: 'March 2026' },
    detailedPromises: [
      { id: 'p1', title: 'Tax Cuts and Jobs Act Extension', description: 'Extend the 2017 tax cuts permanently.', status: 'In Progress', sourceUrl: 'https://www.donaldjtrump.com/issues', sourceLabel: 'Campaign Website Issues Page', date: 'Jan 2025' },
      { id: 'p2', title: 'Border Security Enhancement', description: 'Complete the border wall, deploy military to the border, and increase border patrol agents. Execute largest domestic deportation operation in history.', status: 'In Progress', sourceUrl: 'https://www.whitehouse.gov/briefing-room/', sourceLabel: 'White House Briefing', date: 'Feb 2025' },
      { id: 'p3', title: 'Eliminate Dept. of Education', description: 'Close the federal Department of Education and return policy and funding control to states.', status: 'Stalled', sourceUrl: 'https://www.congress.gov/bill/119th-congress', sourceLabel: 'Congressional Record', date: 'March 2025' },
      { id: 'p4', title: 'Energy Independence', description: 'Increase drilling on federal lands and exit the Paris Climate Accords again.', status: 'Kept', sourceUrl: 'https://www.whitehouse.gov/', sourceLabel: 'White House Actions', date: 'Jan 2025' },
      { id: 'p5', title: 'End Taxes on Tips and Overtime', description: 'Pass legislation to remove federal income taxes from tips and overtime pay.', status: 'In Progress', sourceUrl: 'https://www.congress.gov/', sourceLabel: 'Congressional Record', date: 'Feb 2025' }
    ],
    detailedLegislation: [
      { id: 'eo1', title: 'Executive Order on Energy Independence', summary: 'Reversed restrictions on domestic energy production and expedited lease sales.', action: 'Executive Order', date: 'Jan 24, 2025', sourceUrl: 'https://www.federalregister.gov/presidential-documents/executive-orders', sourceLabel: 'Federal Register' },
      { id: 'eo2', title: 'Executive Order on Border Security', summary: 'Directed the deployment of National Guard troops to the southern border and ordered expedited deportations.', action: 'Executive Order', date: 'Jan 20, 2025', sourceUrl: 'https://www.federalregister.gov/', sourceLabel: 'Federal Register' },
      { id: 'b1', title: 'H.R. 1 - Lower Energy Costs Act', summary: 'Legislation to increase domestic energy production and exports.', action: 'Signed', date: 'March 15, 2025', sourceUrl: 'https://www.congress.gov/bill/119th-congress/house-bill/1', sourceLabel: 'Congress.gov' },
      { id: 'b2', title: 'First Step Act (Previous Term)', summary: 'Comprehensive criminal justice reform bill aimed at reducing recidivism and reforming federal prisons.', action: 'Signed', date: 'Dec 21, 2018', sourceUrl: 'https://www.congress.gov/bill/115th-congress/senate-bill/756', sourceLabel: 'Congress.gov' },
      { id: 'b3', title: 'Tax Cuts and Jobs Act (Previous Term)', summary: 'Major overhaul of the tax code, significantly lowering corporate tax rates.', action: 'Signed', date: 'Dec 22, 2017', sourceUrl: 'https://www.congress.gov/bill/115th-congress/house-bill/1', sourceLabel: 'Congress.gov' },
      { id: 'b4', title: 'USMCA (Previous Term)', summary: 'United States-Mexico-Canada Agreement, replacing NAFTA.', action: 'Signed', date: 'Jan 29, 2020', sourceUrl: 'https://www.congress.gov/bill/116th-congress/house-bill/5430', sourceLabel: 'Congress.gov' }
    ],
    scoreBreakdown: [
      { category: 'Transparency', impact: -5, description: 'Delayed release of visitor logs and personal tax records.', sourceUrl: 'https://www.opensecrets.org/' },
      { category: 'Promise Adherence', impact: 15, description: 'Successfully implemented key economic and judicial platform items.', sourceUrl: 'https://www.politifact.com/truth-o-meter/promises/trumpometer/' },
      { category: 'Legislative Action', impact: 10, description: 'High volume of executive actions aligning with mandate.', sourceUrl: 'https://www.federalregister.gov/' }
    ],
    verifiedPhotos: [
      'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/53/Donald_Trump_official_portrait_%28cropped%29.jpg'
    ],
    education: [
      'University of Pennsylvania, Wharton School (B.S. in Economics, 1968)',
      'Fordham University (Attended 1964-1966)',
      'New York Military Academy (High School Diploma, 1964)',
      'Kew-Forest School (Attended until 7th Grade)'
    ],
    family: [
      'Melania Trump (Spouse, m. 2005)',
      'Marla Maples (Former Spouse, m. 1993-1999)',
      'Ivana Trump (Former Spouse, m. 1977-1992)',
      'Donald Trump Jr. (Son, b. 1977)',
      'Ivanka Trump (Daughter, b. 1981)',
      'Eric Trump (Son, b. 1984)',
      'Tiffany Trump (Daughter, b. 1993)',
      'Barron Trump (Son, b. 2006)',
      'Fred Trump (Father, 1905-1999)',
      'Mary Anne MacLeod Trump (Mother, 1912-2000)'
    ],
    donors: [
      { name: 'America PAC', amount: 130000000, isPac: true },
      { name: 'Preserve America PAC', amount: 100000000, isPac: true },
      { name: 'Make America Great Again Inc.', amount: 350000000, isPac: true },
      { name: 'Timothy Mellon', amount: 125000000, isPac: false },
      { name: 'Miriam Adelson', amount: 95000000, isPac: false }
    ],
    biography: [
      "Donald John Trump was born on June 14, 1946, in Queens, New York, to Fred and Mary Anne MacLeod Trump. He was raised in the Jamaica Estates neighborhood and attended the Kew-Forest School before transferring to the New York Military Academy at age 13. He later attended Fordham University for two years before transferring to the Wharton School of the University of Pennsylvania, graduating with a Bachelor of Science in Economics in 1968.",
      "In 1971, Trump became president of his father's real estate business, which he renamed The Trump Organization. He expanded the company's operations from Queens and Brooklyn into Manhattan, embarking on large-scale building and renovation projects such as the Commodore Hotel (which became the Grand Hyatt New York) and Trump Tower on Fifth Avenue. Throughout the 1980s and 1990s, he expanded into casinos, golf courses, and hotels, overcoming corporate bankruptcies in the early 90s to rebuild his brand and empire.",
      "Trump became a household name beyond real estate largely through his co-production and hosting of the reality television series 'The Apprentice' from 2004 to 2015. His aggressive, populist brand of conservatism began to take shape politically during the early 2010s. In 2015, he launched his campaign for the Presidency of the United States.",
      "Winning the 2016 election against Hillary Clinton, Trump became the 45th President. His first term was marked by the passage of the Tax Cuts and Jobs Act, the appointment of three conservative Supreme Court justices (Gorsuch, Kavanaugh, Barrett), a renegotiation of NAFTA into the USMCA, the creation of the U.S. Space Force, and an 'America First' approach to foreign policy. He was impeached twice by the House of Representatives, being acquitted by the Senate both times.",
      "After losing the 2020 election to Joe Biden, Trump maintained immense influence over the Republican Party. He announced his 2024 presidential campaign in November 2022, securing the Republican nomination and ultimately winning a non-consecutive second term as the 47th President in November 2024, becoming only the second president in U.S. history to do so after Grover Cleveland."
    ],
    careerHistory: [
      { role: '47th President of the United States', organization: 'U.S. Federal Government', years: '2025 - Present' },
      { role: '45th President of the United States', organization: 'U.S. Federal Government', years: '2017 - 2021' },
      { role: 'Chairman and President', organization: 'The Trump Organization', years: '1971 - 2017' },
      { role: 'Executive Producer and Host', organization: 'The Apprentice', years: '2004 - 2015' },
      { role: 'Owner', organization: 'Miss Universe Organization', years: '1996 - 2015' },
      { role: 'Owner', organization: 'New Jersey Generals (USFL)', years: '1984 - 1985' }
    ],
    financialDisclosures: [
      { asset: 'Trump Tower (Commercial Real Estate)', valueRange: 'Over $50,000,000', year: '2024' },
      { asset: 'Mar-a-Lago Club (Resort)', valueRange: 'Over $50,000,000', year: '2024' },
      { asset: 'Trump National Doral Miami', valueRange: 'Over $50,000,000', year: '2024' },
      { asset: 'Trump Media & Technology Group Corp (DJT)', valueRange: 'Over $50,000,000', year: '2024' },
      { asset: 'Various Golf Courses (U.S., UK, Ireland)', valueRange: 'Over $50,000,000', year: '2024' }
    ],
    socialMedia: [
      { platform: 'Truth Social', handle: '@realDonaldTrump', url: 'https://truthsocial.com/@realDonaldTrump' },
      { platform: 'X', handle: '@realDonaldTrump', url: 'https://x.com/realDonaldTrump' },
      { platform: 'Official Website', handle: 'donaldjtrump.com', url: 'https://www.donaldjtrump.com' }
    ],
    endorsements: [
      { name: 'National Rifle Association (NRA)', type: 'Organization' },
      { name: 'Police Benevolent Association', type: 'Organization' },
      { name: 'Elon Musk', type: 'Individual' },
      { name: 'Robert F. Kennedy Jr.', type: 'Individual' },
      { name: 'Tulsi Gabbard', type: 'Individual' }
    ],
    keyStaff: [
      { name: 'Susie Wiles', role: 'White House Chief of Staff' },
      { name: 'JD Vance', role: 'Vice President' },
      { name: 'Stephen Miller', role: 'Deputy Chief of Staff for Policy' },
      { name: 'Dan Scavino', role: 'Deputy Chief of Staff' },
      { name: 'James Blair', role: 'Deputy Chief of Staff for Legislative, Political and Public Affairs' }
    ],
    agendaAlignment: [
      { topic: 'Immigration', stance: 'Strict border control, construction of physical barriers, and mass deportations of undocumented immigrants', alignment: 100 },
      { topic: 'Economy', stance: 'High tariffs on foreign goods, extension of the 2017 tax cuts, and deregulation of industry', alignment: 95 },
      { topic: 'Energy', stance: 'Deregulation of fossil fuels, withdrawal from Paris Agreement, and increasing domestic oil drilling', alignment: 100 },
      { topic: 'Judiciary', stance: 'Appointment of conservative judges to federal courts', alignment: 100 }
    ],
    controversies: [
      { title: 'First Impeachment', date: 'Dec 2019', summary: 'Impeached by the House for abuse of power and obstruction of Congress regarding military aid to Ukraine. Acquitted by the Senate.', link: 'https://www.congress.gov/bill/116th-congress/house-resolution/755' },
      { title: 'Second Impeachment', date: 'Jan 2021', summary: 'Impeached by the House for incitement of insurrection following the January 6 Capitol attack. Acquitted by the Senate.', link: 'https://www.congress.gov/bill/117th-congress/house-resolution/24' },
      { title: 'New York Business Fraud Trial', date: 'Feb 2024', summary: 'Found liable for civil fraud by a New York judge regarding the valuation of his properties.', link: 'https://ag.ny.gov/press-release/2024/attorney-general-james-wins-landmark-victory-case-against-donald-trump' },
      { title: 'Federal Election Interference Case', date: 'Aug 2023', summary: 'Indicted by a federal grand jury on four charges related to alleged efforts to overturn the 2020 election.', link: 'https://www.justice.gov/sco-smith' },
      { title: 'Classified Documents Case', date: 'Jun 2023', summary: 'Indicted on federal charges related to the retention of classified documents at Mar-a-Lago.', link: 'https://www.justice.gov/sco-smith' }
    ],
    sources: [
      { label: 'White House Official Biography', url: 'https://www.whitehouse.gov/administration/president-donald-j-trump/' },
      { label: 'FEC Campaign Finance Data', url: 'https://www.fec.gov/data/candidate/P80001571/' },
      { label: 'Congress.gov Legislative Record', url: 'https://www.congress.gov/member/donald-trump/T000493' }
    ]
  }"""

match = re.search(r"slug: 'donald-trump'.*?\},.*?\{ slug: 'jd-vance'", text, re.DOTALL)
if match:
    old_content = text[match.start():match.end() - 21] 
    text = text.replace(old_content, new_trump_block)

with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
