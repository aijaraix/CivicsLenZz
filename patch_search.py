import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# Pass the level-filtered officials to the map, not the search-filtered ones.
target = """                    <MapVisual 
                        officials={result} 
                        levelFilter={level} 
                        userAddress={submittedAddress} 
                        totalCount={getDisplayCount()}
                    />"""

replacement = """                    <MapVisual 
                        officials={trackedOfficials.filter(o => level === 'All' || o.level === level)} 
                        levelFilter={level} 
                        userAddress={submittedAddress} 
                        totalCount={getDisplayCount()}
                    />"""

text = text.replace(target, replacement)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
