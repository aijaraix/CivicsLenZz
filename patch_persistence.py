import re
with open("src/HomePage.tsx", "r") as f:
    text = f.read()

target = """  const [liveTotalRecords, setLiveTotalRecords] = useState(initialTotalRecords);
  const [scrapers, setScrapers] = useState(initialScrapersList);
  const [discoveries, setDiscoveries] = useState(initialRecentDiscoveries);
  const [liveOfficials, setLiveOfficials] = useState(94235);
  const [livePromises, setLivePromises] = useState(1243500);
  const [liveGrants, setLiveGrants] = useState(350.50);
  const [liveAccuracy, setLiveAccuracy] = useState(99.42);

  useEffect(() => {
    const ticker = setInterval(() => {"""

replacement = """  const [scrapers, setScrapers] = useState(initialScrapersList);
  const [discoveries, setDiscoveries] = useState(initialRecentDiscoveries);
  
  const [liveTotalRecords, setLiveTotalRecords] = useState(() => {
    const saved = localStorage.getItem('civiclenz_records');
    return saved ? parseInt(saved, 10) : initialTotalRecords;
  });
  const [liveOfficials, setLiveOfficials] = useState(() => {
    const saved = localStorage.getItem('civiclenz_officials');
    return saved ? parseInt(saved, 10) : 94235;
  });
  const [livePromises, setLivePromises] = useState(() => {
    const saved = localStorage.getItem('civiclenz_promises');
    return saved ? parseInt(saved, 10) : 1243500;
  });
  const [liveGrants, setLiveGrants] = useState(() => {
    const saved = localStorage.getItem('civiclenz_grants');
    return saved ? parseFloat(saved) : 350.50;
  });
  const [liveAccuracy, setLiveAccuracy] = useState(99.42);

  // Catch-up logic on mount
  useEffect(() => {
    const lastSavedStr = localStorage.getItem('civiclenz_last_saved');
    if (lastSavedStr) {
       const lastSaved = parseInt(lastSavedStr, 10);
       const elapsed = Date.now() - lastSaved;
       if (elapsed > 0) {
           const missedTicks = Math.floor(elapsed / 1200);
           if (missedTicks > 0) {
               // Simulate the progress missed while offline
               setLiveTotalRecords(prev => prev + Math.floor(missedTicks * 6.5));
               setLiveOfficials(prev => prev + Math.floor(missedTicks * 0.2));
               setLivePromises(prev => prev + missedTicks * 1);
               setLiveGrants(prev => prev + missedTicks * 0.005);
           }
       }
    }
  }, []);

  // Save periodically
  useEffect(() => {
    localStorage.setItem('civiclenz_records', liveTotalRecords.toString());
    localStorage.setItem('civiclenz_officials', liveOfficials.toString());
    localStorage.setItem('civiclenz_promises', livePromises.toString());
    localStorage.setItem('civiclenz_grants', liveGrants.toString());
    localStorage.setItem('civiclenz_last_saved', Date.now().toString());
  }, [liveTotalRecords, liveOfficials, livePromises, liveGrants]);

  useEffect(() => {
    const ticker = setInterval(() => {"""

text = text.replace(target, replacement)

with open("src/HomePage.tsx", "w") as f:
    f.write(text)
