import re

with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

# Add more EOs to Donald Trump
old_eo = """    executiveActions: [
      { type: 'Executive Order', title: 'Border Security and Immigration Enforcement Improvements', date: 'Jan 20, 2025', summary: 'Directed deployment of troops to border and expedited deportations.', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Promoting Energy Independence and Economic Growth', date: 'Jan 24, 2025', summary: 'Reversed restrictions on domestic energy production.', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Protecting the Nation from Foreign Terrorist Entry', date: 'Jan 27, 2017', summary: 'Travel ban on several majority-Muslim countries (Travel Ban 1.0).', url: 'https://www.federalregister.gov' }
    ],"""

new_eo = """    executiveActions: [
      { type: 'Executive Order', title: 'Border Security and Immigration Enforcement Improvements', date: 'Jan 20, 2025', summary: 'Directed deployment of troops to border and expedited deportations.', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Promoting Energy Independence and Economic Growth', date: 'Jan 24, 2025', summary: 'Reversed restrictions on domestic energy production.', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Protecting the Nation from Foreign Terrorist Entry', date: 'Jan 27, 2017', summary: 'Travel ban on several majority-Muslim countries (Travel Ban 1.0).', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Comprehensive Plan for Reorganizing the Executive Branch', date: 'Mar 13, 2017', summary: 'Proposed eliminating unnecessary agencies.', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Buy American and Hire American', date: 'Apr 18, 2017', summary: 'Promoted use of American-made goods and prioritized U.S. workers.', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Establishing the National Space Council', date: 'Jun 30, 2017', summary: 'Revived the National Space Council to coordinate space policy.', url: 'https://www.federalregister.gov' },
      { type: 'Executive Order', title: 'Combating Race and Sex Stereotyping', date: 'Sep 22, 2020', summary: 'Banned certain diversity training in federal agencies.', url: 'https://www.federalregister.gov' },
      { type: 'Presidential Memorandum', title: 'Memorandum on Creating a National Strategic Computing Initiative', date: 'Jul 2015', summary: 'Advancing computing for government use.', url: 'https://www.federalregister.gov' }
    ],"""

if old_eo in text:
    text = text.replace(old_eo, new_eo)
else:
    print("Could not find EO block")
    
with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
