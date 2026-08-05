import re

with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

# Replace activityItems
activity_match = re.search(r'export const activityItems = \[.*?\];', text, flags=re.DOTALL)
if activity_match:
    new_activity = """export type ActivityItem = { type: string; title: string; date: string; tone: string; details: string; link: string; };
export const activityItems: ActivityItem[] = [
  { type: 'Vote', title: 'Voted on H.R. 204 — Community Schools Act', date: 'May 7, 2026', tone: 'blue', details: 'A bill to provide funding for community school programs. Voted YEA in accordance with party lines.', link: 'https://congress.gov/bill/hr204' },
  { type: 'Promise', title: 'Status changed: affordable housing commitment', date: 'May 5, 2026', tone: 'orange', details: 'Campaign promise to build 1 million affordable homes shifted from "In Progress" to "Stalled".', link: 'https://example.com/promise-tracker' },
  { type: 'Statement', title: 'Public statement added to the record', date: 'May 2, 2026', tone: 'purple', details: 'Issued a press release concerning the recent international trade agreements.', link: 'https://whitehouse.gov/press-release' },
  { type: 'Bill', title: 'Co-sponsored S. 617 — Protect Our Seniors Act', date: 'April 29, 2026', tone: 'green', details: 'Added as a co-sponsor to legislation aiming to protect Medicare funding.', link: 'https://congress.gov/bill/s617' },
];"""
    text = text[:activity_match.start()] + new_activity + text[activity_match.end():]

with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
