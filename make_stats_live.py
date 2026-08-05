import re

with open("src/HomePage.tsx", "r") as f:
    text = f.read()

# Replace stat array
old_stats = """              {[
                { label: "Officials Verified & Tracked", target: 94235, prefix: "", suffix: "", decimals: 0, change: `Out of 513,000 Total Seats`, color: "#102035" },
                { label: "Public Promises Tracked", target: 1243500, prefix: "", suffix: "+ Actions", decimals: 0, change: "Mapped across federal & state levels", color: "#16a36a" },
                { label: "Public Grants Indexed", target: 350.5, prefix: "$", suffix: "B", decimals: 1, change: "USASpending & State Contract Feeds", color: "#2563eb" },
                { label: "Ingestion Accuracy", target: 99.4, prefix: "", suffix: "%", decimals: 1, change: "Cross-Validated Government Archives", color: "#6366f1" }
              ]"""

new_stats = """              {[
                { label: "Officials Verified & Tracked", target: liveOfficials, prefix: "", suffix: "", decimals: 0, change: `Out of 513,000 Total Seats`, color: "#102035" },
                { label: "Public Promises Tracked", target: livePromises, prefix: "", suffix: "+ Actions", decimals: 0, change: "Mapped across federal & state levels", color: "#16a36a" },
                { label: "Public Grants Indexed", target: 350.5, prefix: "$", suffix: "B", decimals: 1, change: "USASpending & State Contract Feeds", color: "#2563eb" },
                { label: "Ingestion Accuracy", target: 99.4, prefix: "", suffix: "%", decimals: 1, change: "Cross-Validated Government Archives", color: "#6366f1" }
              ]"""

text = text.replace(old_stats, new_stats)

old_state = """  const [liveTotalRecords, setLiveTotalRecords] = useState(initialTotalRecords);
  const [scrapers, setScrapers] = useState(initialScrapersList);
  const [discoveries, setDiscoveries] = useState(initialRecentDiscoveries);"""

new_state = """  const [liveTotalRecords, setLiveTotalRecords] = useState(initialTotalRecords);
  const [scrapers, setScrapers] = useState(initialScrapersList);
  const [discoveries, setDiscoveries] = useState(initialRecentDiscoveries);
  const [liveOfficials, setLiveOfficials] = useState(94235);
  const [livePromises, setLivePromises] = useState(1243500);"""

text = text.replace(old_state, new_state)

old_effect = """      setLiveTotalRecords(prev => prev + added);
      
      setScrapers(prev => prev.map(s => {"""

new_effect = """      setLiveTotalRecords(prev => prev + added);
      setLiveOfficials(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      setLivePromises(prev => prev + Math.floor(Math.random() * 3));
      
      setScrapers(prev => prev.map(s => {"""

text = text.replace(old_effect, new_effect)

with open("src/HomePage.tsx", "w") as f:
    f.write(text)
