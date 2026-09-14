with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

import re

# We will remove the old activityItems, trackedPetitions, dataSources and add them fresh.

start = text.find("export type ActivityItem")
if start != -1:
    text = text[:start]

new_content = """
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
"""

with open("src/lib/civic-database.ts", "w") as f:
    f.write(text + new_content)
