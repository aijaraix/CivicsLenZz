import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

# Remove the 'if (userAddress)' branch and fake generated pins
target_memo = """  const mapData = useMemo(() => {
      let markers: any[] = [];
      const boundaries: any[] = [];
      
      // If user provided an address, we show the actual tracked officials around them
      if (userAddress) {
          officials.forEach((off, index) => {"""

# Find the end of officials.forEach
# It ends right before "      } else {"
# Wait, let's just do a regex replacement.

match = re.search(r'  const mapData = useMemo\(\(\) => \{.*?\n      return \{ markers, boundaries \};\n  \}, \[officials, userAddress, usGeoJSON, levelFilter\]\);', text, re.DOTALL)
if match:
    new_memo = """  const mapData = useMemo(() => {
      let markers: any[] = [];
      const boundaries: any[] = [];
      
      officials.forEach((off, index) => {
          if (!off.coordinates) return;
          const [lng, lat] = off.coordinates;
          const isNational = off.title.toLowerCase().includes('president');
          const color = levelColors[off.level] || '#64748b';
          
          markers.push({
              key: `marker-${off.slug}-${index}`,
              lat, lng,
              color,
              official: off
          });
          
          if (usGeoJSON && off.level === 'State') {
              let searchState = off.district.split(' ')[0]; // E.g., "Florida · District 34" -> "Florida"
              const stateFeature = usGeoJSON.features.find((f: any) => f.properties.name === searchState || f.properties.name === off.district);
              if (stateFeature) {
                  boundaries.push({
                      key: `bound-${off.slug}-${index}`,
                      feature: stateFeature,
                      color
                  });
              } else {
                  boundaries.push({
                      key: `bound-${off.slug}-${index}`,
                      feature: generateMockBoundary([lng, lat], off.level, isNational),
                      color
                  });
              }
          } else if (usGeoJSON && isNational) {
              boundaries.push({
                  key: `bound-${off.slug}-${index}`,
                  feature: usGeoJSON,
                  color
              });
          } else {
              const mock = generateMockBoundary([lng, lat], off.level, isNational);
              if (mock) {
                  boundaries.push({
                      key: `bound-${off.slug}-${index}`,
                      feature: mock,
                      color
                  });
              }
          }
      });
      
      return { markers, boundaries };
  }, [officials, usGeoJSON, levelFilter]);"""
    text = text.replace(match.group(0), new_memo)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
