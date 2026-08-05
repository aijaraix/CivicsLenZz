import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

target = """  const result = useMemo(() => {
     let filtered = trackedOfficials;
     if (level !== 'All') {
        filtered = filtered.filter(o => o.level === level);
        
        if (subRole !== 'All') {
            filtered = filtered.filter(o => {
                const title = o.title.toLowerCase();
                const role = subRole.toLowerCase();
                if (role.includes('senate')) return title.includes('senator') || title.includes('senate');
                if (role.includes('house')) return title.includes('representative') || title.includes('house');
                if (role.includes('governor')) return title.includes('governor');
                if (role.includes('mayor')) return title.includes('mayor');
                if (role.includes('council')) return title.includes('commissioner') || title.includes('council');
                if (role.includes('board')) return title.includes('board');
                return title.includes(role);
            });
        }
     }
     
     // Simple client-side search simulation
     if (search.trim()) {"""

replacement = """  const baseFiltered = useMemo(() => {
     let filtered = trackedOfficials;
     if (level !== 'All') {
        filtered = filtered.filter(o => o.level === level);
        
        if (subRole !== 'All') {
            filtered = filtered.filter(o => {
                const title = o.title.toLowerCase();
                const role = subRole.toLowerCase();
                if (role.includes('senate')) return title.includes('senator') || title.includes('senate');
                if (role.includes('house')) return title.includes('representative') || title.includes('house');
                if (role.includes('governor')) return title.includes('governor');
                if (role.includes('mayor')) return title.includes('mayor');
                if (role.includes('council')) return title.includes('commissioner') || title.includes('council');
                if (role.includes('board')) return title.includes('board');
                return title.includes(role);
            });
        }
     }
     return filtered;
  }, [level, subRole]);

  const result = useMemo(() => {
     let filtered = baseFiltered;
     
     // Simple client-side search simulation
     if (search.trim()) {"""

text = text.replace(target, replacement)

# Now update the MapVisual props
target_map = """                    <MapVisual 
                        officials={trackedOfficials.filter(o => level === 'All' || o.level === level)} 
                        levelFilter={level} 
                        userAddress={submittedAddress} 
                        totalCount={getDisplayCount()}
                    />"""

replacement_map = """                    <MapVisual 
                        officials={baseFiltered} 
                        levelFilter={level} 
                        userAddress={submittedAddress} 
                        totalCount={getDisplayCount()}
                    />"""

text = text.replace(target_map, replacement_map)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
