import re

with open("src/HomePage.tsx", "r") as f:
    text = f.read()

# Add states inside HomePage
state_code = """
  const [liveTotalRecords, setLiveTotalRecords] = useState(initialTotalRecords);
  const [scrapers, setScrapers] = useState(initialScrapersList);
  const [discoveries, setDiscoveries] = useState(initialRecentDiscoveries);

  useEffect(() => {
    const ticker = setInterval(() => {
      const added = Math.floor(Math.random() * 12) + 1;
      setLiveTotalRecords(prev => prev + added);
      
      setScrapers(prev => prev.map(s => {
        return { ...s, recordsExtracted: s.recordsExtracted + Math.floor(Math.random() * 5) }
      }));

    }, 3000);
    return () => clearInterval(ticker);
  }, []);
"""

# Replace `export function HomePage({ liveTotalRecords, scrapersList, recentDiscoveries }: any) {`
text = text.replace('export function HomePage({ liveTotalRecords, scrapersList, recentDiscoveries }: any) {', 
"""
export function HomePage() {
""" + state_code)

# Replace usage of `scrapersList` with `scrapers` in HomePage
text = re.sub(r'scrapersList\.map', 'scrapers.map', text)
# Replace usage of `recentDiscoveries` with `discoveries` in HomePage
text = re.sub(r'recentDiscoveries\.length', 'discoveries.length', text)
text = re.sub(r'recentDiscoveries\.map', 'discoveries.map', text)

# Rename exports at the bottom
text = text.replace('export const scrapersList = [', 'const initialScrapersList = [')
text = text.replace('export const recentDiscoveries = [', 'const initialRecentDiscoveries = [')
text = text.replace('export const liveTotalRecords = scrapersList.reduce', 'const initialTotalRecords = initialScrapersList.reduce')

with open("src/HomePage.tsx", "w") as f:
    f.write(text)

