import re

with open("src/HomePage.tsx", "r") as f:
    text = f.read()

# Update initialScrapersList to include the two new nodes
old_scrapers = """const initialScrapersList = [
  { id: "h-alpha", name: "Federal Register Crawler", source: "federalregister.gov", recordsExtracted: 842100 },
  { id: "h-beta", name: "State Legislation DB", source: "flsenate.gov/flhouse.gov", recordsExtracted: 315420 },
  { id: "h-gamma", name: "FEC Finance Logs", source: "fec.gov/data", recordsExtracted: 1205050 },
  { id: "h-delta", name: "Local Council Minutes (Miami-Dade)", source: "miamidade.gov", recordsExtracted: 45200 },
  { id: "h-epsilon", name: "GovTrack Roll Call Sync", source: "govtrack.us", recordsExtracted: 89010 },
  { id: "h-zeta", name: "News Sentiment Analyzer", source: "NewsAPI (Local + National)", recordsExtracted: 215300 },
];"""

new_scrapers = """const initialScrapersList = [
  { id: "h-alpha", name: "Federal Register Crawler", source: "federalregister.gov", recordsExtracted: 842100 },
  { id: "h-beta", name: "State Legislation DB", source: "flsenate.gov/flhouse.gov", recordsExtracted: 315420 },
  { id: "h-gamma", name: "FEC Finance Logs", source: "fec.gov/data", recordsExtracted: 1205050 },
  { id: "h-delta", name: "Local Council Minutes (Miami-Dade)", source: "miamidade.gov", recordsExtracted: 45200 },
  { id: "h-epsilon", name: "GovTrack Roll Call Sync", source: "govtrack.us", recordsExtracted: 89010 },
  { id: "h-zeta", name: "News Sentiment Analyzer", source: "NewsAPI (Local + National)", recordsExtracted: 215300 },
  { id: "h-eta", name: "Identity Validation Matrix", source: "Official .gov / Campaigns", recordsExtracted: 142050 },
  { id: "h-theta", name: "PAC & NGO Finance Tracker", source: "FEC / IRS 990 / OpenSecrets", recordsExtracted: 624100 },
];"""

text = text.replace(old_scrapers, new_scrapers)

# Update node count references
text = text.replace("Hermes Nodes 1-6", "Hermes Nodes 1-8")
text = text.replace("6 active Hermes indexing nodes", "8 active Hermes indexing nodes")

# Speed up the update interval for more visible "live" feeling
text = text.replace("}, 3000);", "}, 1200);")

with open("src/HomePage.tsx", "w") as f:
    f.write(text)
