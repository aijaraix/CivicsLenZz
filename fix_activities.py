with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

import re

# Find activityItems array
start = text.find("export const activityItems: ActivityItem[] = [")

if start != -1:
    new_array = """export const activityItems: ActivityItem[] = [
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
];"""
    
    text = text[:start] + new_array + "\n"
    
    with open("src/lib/civic-database.ts", "w") as f:
        f.write(text)
