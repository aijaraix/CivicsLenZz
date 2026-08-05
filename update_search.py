import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# We need to add state for the spatial results
state_insert = """
  const [spatialSlugs, setSpatialSlugs] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
     if (!submittedAddress) {
         setSpatialSlugs(null);
         return;
     }

     const fetchSpatial = async () => {
         setIsSearching(true);
         try {
             // 1. Mock Geocode (In prod: call Google Geocoding API or Nominatim)
             const mockLat = 25.7617;
             const mockLng = -80.1918;

             // 2. Call Phase 2 Spatial API
             const res = await fetch(`/api/officials/represent?lat=${mockLat}&lng=${mockLng}`);
             const data = await res.json();
             
             if (data.officials) {
                 setSpatialSlugs(data.officials);
             }
         } catch(e) {
             console.error("Spatial query failed", e);
         } finally {
             setIsSearching(false);
         }
     };

     fetchSpatial();
  }, [submittedAddress]);
"""

# Find where to insert state
state_pos = text.find("  const [submittedAddress, setSubmittedAddress] = useState('');")
if state_pos != -1:
    text = text[:state_pos] + "  const [submittedAddress, setSubmittedAddress] = useState('');\n" + state_insert + text[state_pos + len("  const [submittedAddress, setSubmittedAddress] = useState('');"):]

# Update result useMemo
old_memo = """  const result = useMemo(() => {
     let filtered = trackedOfficials;
     if (level !== 'All') {
        filtered = filtered.filter(o => o.level === level);
     }
     
     // Simple client-side search simulation
     if (search.trim()) {
        const query = search.toLowerCase();
        // Just for prototype realism, let's pretend if they search we still show the relevant ones
        // In a real app, this would geocode the address and return the officials for that district.
        // For now we'll just filter by name/title/district so at least it does something.
        filtered = filtered.filter(o => 
           o.name.toLowerCase().includes(query) || 
           o.title.toLowerCase().includes(query) || 
           o.district.toLowerCase().includes(query) ||
           // If it's a generic address, just show everyone for the demo
           query.includes("miami") || query.includes("florida") || query.includes("fl") || query.includes("washington")
        );
     }
     return filtered;
  }, [search, level]);"""

new_memo = """  const result = useMemo(() => {
     let filtered = trackedOfficials;
     
     // 1. Apply spatial filter if we have point-in-polygon results
     if (spatialSlugs) {
         filtered = filtered.filter(o => spatialSlugs.includes(o.slug));
     } else if (search.trim()) {
         // Fallback basic text search
         const query = search.toLowerCase();
         filtered = filtered.filter(o => 
            o.name.toLowerCase().includes(query) || 
            o.title.toLowerCase().includes(query) || 
            o.district.toLowerCase().includes(query)
         );
     }

     // 2. Apply level filter
     if (level !== 'All') {
        filtered = filtered.filter(o => o.level === level);
     }
     
     return filtered;
  }, [search, level, spatialSlugs]);"""

text = text.replace(old_memo, new_memo)

# Add isSearching indicator
indicator_old = """                 <h2 className="text-lg font-bold text-slate-900">
                    {search.trim() ? "Officials matching search" : "All Officials"}
                 </h2>"""
indicator_new = """                 <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {isSearching ? "Finding your representatives..." : (submittedAddress ? `Representatives for "${submittedAddress}"` : (search.trim() ? "Officials matching search" : "All Officials"))}
                    {isSearching && <Icon name="loader-2" size={16} className="animate-spin text-blue-600" />}
                 </h2>"""

text = text.replace(indicator_old, indicator_new)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
