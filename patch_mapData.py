import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

# Replace the ENTIRE useMemo block
pattern = r'  const mapData = useMemo\(\(\) => \{.*?\n  \}, \[officials, usGeoJSON\]\);'

replacement = """  const mapData = useMemo(() => {
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
              const stateFeature = usGeoJSON.features.find((f: any) => f.properties.name === off.district);
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
  }, [officials, usGeoJSON]);"""

new_text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(new_text)
