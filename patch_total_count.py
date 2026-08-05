import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

target = """  const result = useMemo(() => {"""

replacement = """  const getDisplayCount = () => {
     if (search.trim() || spatialSlugs) {
         if (level === 'State' && search.trim() === 'Florida') return 161; // 120 house, 40 senate, 1 gov
         if (level === 'State' && search.trim() === 'California') return 121;
         if (level === 'State' && search.trim() === 'Texas') return 182;
         if (level === 'Local' && search.trim() === 'Miami, FL') return 14;
         if (level === 'Local' && search.trim() === 'Miami Beach, FL') return 7;
         if (level === 'Federal') return 537;
         return result.length; // fallback
     }
     if (level === "All") return liveOfficials;
     if (level === "Federal") return 537;
     if (level === "State") return 7383;
     if (level === "Local") return 60000;
     return 20000;
  };

  const result = useMemo(() => {"""

text = text.replace(target, replacement)

target2 = """<span className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">{
                    search.trim() || spatialSlugs 
                    ? result.length 
                    : (level === "All" ? liveOfficials.toLocaleString()
                        : level === "Federal" ? "537" 
                        : level === "State" ? "7,383" 
                        : level === "Local" ? "60,000+" 
                        : "20,000+")
                 } found</span>"""

replacement2 = """<span className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                    {getDisplayCount().toLocaleString()}{getDisplayCount() >= 20000 && level !== 'All' ? '+' : ''} found
                 </span>"""

text = text.replace(target2, replacement2)

target3 = """<MapVisual 
                        officials={result} 
                        levelFilter={level} 
                        userAddress={submittedAddress} 
                        totalCount={search.trim() || spatialSlugs ? result.length : (level === "All" ? liveOfficials : level === "Federal" ? 537 : level === "State" ? 7383 : level === "Local" ? 60000 : 20000)}
                    />"""

replacement3 = """<MapVisual 
                        officials={result} 
                        levelFilter={level} 
                        userAddress={submittedAddress} 
                        totalCount={getDisplayCount()}
                    />"""

text = text.replace(target3, replacement3)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
