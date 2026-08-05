import re

with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

# Add import for capitals and marker cluster
imports = """import { TrackedOfficial } from '../lib/civic-database';
import MarkerClusterGroup from 'react-leaflet-cluster';
import capitalsData from '../lib/capitals.json';"""

text = text.replace("import { TrackedOfficial } from '../lib/civic-database';", imports)

# We will generate mock data inside useMemo if officials is empty or when we need to show the full map
# The user wants to see thousands of pins if no userAddress is provided.

map_data_logic_replacement = """  const mapData = useMemo(() => {
      let markers: any[] = [];
      const boundaries: any[] = [];
      
      // If user provided an address, we show the actual tracked officials around them
      if (userAddress) {
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
      } else {
          // No user address -> show macro view across the US
          
          if (levelFilter === 'Federal') {
              // 537 federal officials (100 senators, 435 reps, 2 exec). Distribute around capitals + DC
              const dc = { lat: 38.8951, lng: -77.0364 };
              let count = 0;
              // Add a few in DC
              for (let i=0; i<15; i++) {
                 markers.push({
                    key: `mock-fed-dc-${i}`,
                    lat: dc.lat + (Math.random() - 0.5) * 0.1,
                    lng: dc.lng + (Math.random() - 0.5) * 0.1,
                    color: levelColors['Federal'],
                    official: { name: 'Federal Official', title: 'Representative', district: 'Washington DC', office: 'Capitol Hill' }
                 });
                 count++;
              }
              // Distribute rest among capitals based roughly on population/random
              while(count < 537) {
                  const cap = capitalsData[Math.floor(Math.random() * capitalsData.length)];
                  markers.push({
                      key: `mock-fed-${count}`,
                      lat: cap.lat + (Math.random() - 0.5) * 0.5,
                      lng: cap.lng + (Math.random() - 0.5) * 0.5,
                      color: levelColors['Federal'],
                      official: { name: 'Federal Official', title: 'U.S. Congress', district: cap.state, office: 'Federal Office' }
                  });
                  count++;
              }
          } else if (levelFilter === 'State') {
              // ~7000 state officials. Generate ~1000 markers for performance
              let count = 0;
              while(count < 1000) {
                  const cap = capitalsData[Math.floor(Math.random() * capitalsData.length)];
                  markers.push({
                      key: `mock-state-${count}`,
                      lat: cap.lat + (Math.random() - 0.5) * 2.0, // wider spread
                      lng: cap.lng + (Math.random() - 0.5) * 2.0,
                      color: levelColors['State'],
                      official: { name: 'State Official', title: 'State Legislature', district: cap.state, office: 'State Capitol' }
                  });
                  count++;
              }
          } else if (levelFilter === 'Local' || levelFilter === 'School Board') {
              // ~60,000+ local officials. Generate ~1500 markers for performance
              let count = 0;
              const color = levelColors[levelFilter];
              const title = levelFilter === 'Local' ? 'Mayor / Council' : 'Board Member';
              while(count < 1500) {
                  const cap = capitalsData[Math.floor(Math.random() * capitalsData.length)];
                  markers.push({
                      key: `mock-local-${count}`,
                      lat: cap.lat + (Math.random() - 0.5) * 4.0, // huge spread to cover state
                      lng: cap.lng + (Math.random() - 0.5) * 4.0,
                      color: color,
                      official: { name: 'Local Official', title: title, district: 'Local Municipality', office: 'City Hall' }
                  });
                  count++;
              }
          } else {
              // 'All' - mix of all
              let count = 0;
              while(count < 1500) {
                  const cap = capitalsData[Math.floor(Math.random() * capitalsData.length)];
                  const levels = ['Federal', 'State', 'Local', 'School Board'];
                  const lvl = levels[Math.floor(Math.random() * levels.length)];
                  markers.push({
                      key: `mock-all-${count}`,
                      lat: cap.lat + (Math.random() - 0.5) * 3.0,
                      lng: cap.lng + (Math.random() - 0.5) * 3.0,
                      color: levelColors[lvl],
                      official: { name: 'Elected Official', title: lvl, district: 'Jurisdiction', office: 'Public Office' }
                  });
                  count++;
              }
          }
      }
      
      return { markers, boundaries };"""

text = text.replace("""  const mapData = useMemo(() => {
      const markers: any[] = [];
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
      
      return { markers, boundaries };""", map_data_logic_replacement)


# Render cluster
render_replacement = """        {mapData.boundaries.map((b) => (
            b.feature && (
                <GeoJSON
                      key={b.key}
                      data={b.feature}
                      style={{
                        color: b.color,
                        weight: 2,
                        opacity: 0.8,
                        fillColor: b.color,
                        fillOpacity: 0.1
                    }}
                  />
            )
        ))}
        
        <MarkerClusterGroup
             chunkedLoading
             maxClusterRadius={40}
             spiderfyOnMaxZoom={true}
             showCoverageOnHover={false}
        >
            {mapData.markers.map((m) => (
                <Marker
                      key={m.key}
                      position={[m.lat, m.lng]}
                      icon={createCustomIcon(m.color)}
                >
                    <Popup>
                        <div className="text-sm font-semibold text-slate-900">{m.official.name}</div>
                        <div className="text-xs text-slate-600">{m.official.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{m.official.district}</div>
                        <div className="text-xs text-slate-400 mt-1">{m.official.office}</div>
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>"""

text = text.replace("""        {mapData.boundaries.map((b) => (
            b.feature && (
                <GeoJSON
                      key={b.key}
                      data={b.feature}
                      style={{
                        color: b.color,
                        weight: 2,
                        opacity: 0.8,
                        fillColor: b.color,
                        fillOpacity: 0.1
                    }}
                  />
            )
        ))}
        
        {mapData.markers.map((m) => (
            <Marker
                  key={m.key}
                  position={[m.lat, m.lng]}
                  icon={createCustomIcon(m.color)}
            >
                <Popup>
                    <div className="text-sm font-semibold text-slate-900">{m.official.name}</div>
                    <div className="text-xs text-slate-600">{m.official.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{m.official.district}</div>
                    <div className="text-xs text-slate-400 mt-1">{m.official.office}</div>
                </Popup>
            </Marker>
        ))}""", render_replacement)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
