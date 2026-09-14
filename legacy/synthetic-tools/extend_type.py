import re

with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

new_fields = """  donors?: { name: string; amount: number; isPac: boolean }[];
  
  // Expanded Template Fields
  biography?: string[]; // Multiple paragraphs for a comprehensive bio
  careerHistory?: { role: string; organization: string; years: string }[];
  financialDisclosures?: { asset: string; valueRange: string; year: string }[];
  socialMedia?: { platform: string; handle: string; url: string }[];
  endorsements?: { name: string; type: string }[]; // type e.g., 'Organization', 'Individual'
  keyStaff?: { name: string; role: string }[];"""

text = text.replace("  donors?: { name: string; amount: number; isPac: boolean }[];", new_fields)

with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
