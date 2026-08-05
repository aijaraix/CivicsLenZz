import re

content = """import React, { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrackedOfficial } from '../lib/civic-database';

// Fix Leaflet icon missing issues
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const levelColors: Record<string, string> = {
  'Federal': '#ef4444', // Red
  'State': '#f59e0b',   // Amber
  'Local': '#3b82f6',   // Blue
  'School Board': '#10b981' // Green
};

function createCustomIcon(color: string) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

function generateMockBoundary(center: [number, number], level: string, isNational: boolean) {
    if (isNational) return null; // We will use a real US boundary or state boundaries if possible.
    
    // Simulate boundaries (in a real app, this is fetched from a GeoJSON API)
    // Degrees roughly (1 deg ~ 69 miles)
    let size = 0.05; // default small
    if (level === 'State') size = 2.0;
    if (level === 'Federal') size = 1.0; // Congressional district
    if (level === 'Local') size = 0.1;
    if (level === 'School Board') size = 0.05;

    // Create a rough polygon around the center
    const [lng, lat] = center;
    return {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Polygon",
            coordinates: [[
                [lng - size, lat - size],
                [lng + size, lat - size],
                [lng + size, lat + size],
                [lng - size, lat + size],
                [lng - size, lat - size]
            ]]
        }
    };
}

// Component to dynamically fit bounds
function MapFitter({ officials }: { officials: TrackedOfficial[] }) {
    const map = useMap();
    useEffect(() => {
        if (officials.length === 0) return;
        
        const bounds = L.latLngBounds([]);
        officials.forEach(off => {
            if (off.coordinates) {
                // Leaflet expects [lat, lng]
                bounds.extend([off.coordinates[1], off.coordinates[0]]);
            }
        });
        
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }, [officials, map]);
    return null;
}

export function MapVisual({ compact, officials = [] }: { compact?: boolean, officials?: TrackedOfficial[] }) {
  const [usGeoJSON, setUsGeoJSON] = useState<any>(null);

  // Fetch real US States GeoJSON for accurate state boundaries
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(res => res.json())
      .then(data => setUsGeoJSON(data))
      .catch(err => console.error("Could not load states map", err));
  }, []);

  const mapData = useMemo(() => {
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

          // If we have real GeoJSON and it's a state level, try to match it
          if (usGeoJSON && off.level === 'State') {
              const stateFeature = usGeoJSON.features.find((f: any) => f.properties.name === off.district);
              if (stateFeature) {
                  boundaries.push({
                      key: `bound-${off.slug}-${index}`,
                      feature: stateFeature,
                      color
                  });
              } else {
                  // Fallback to mock
                  boundaries.push({
                      key: `bound-${off.slug}-${index}`,
                      feature: generateMockBoundary([lng, lat], off.level, isNational),
                      color
                  });
              }
          } else if (usGeoJSON && isNational) {
              // Highlight all of US
              boundaries.push({
                  key: `bound-${off.slug}-${index}`,
                  feature: usGeoJSON,
                  color
              });
          } else {
              // Local, School Board, or Congressional District mock boundary
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
  }, [officials, usGeoJSON]);

  return (
    <div className="w-full h-full bg-blue-50 rounded-xl overflow-hidden relative border border-slate-200 z-10">
      <MapContainer 
        center={[39.8, -98.5]} 
        zoom={4} 
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        scrollWheelZoom={!compact}
        zoomControl={!compact}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {mapData.boundaries.map((b) => (
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
                </Popup>
            </Marker>
        ))}
        
        {!compact && <MapFitter officials={officials} />}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-3 py-3 rounded-xl shadow-sm border border-slate-200 z-[1000]">
        <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Map Legend</span>
        <div className="flex flex-col gap-2">
           {Object.entries(levelColors).map(([level, color]) => (
             <div key={level} className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}></span>
               <span className="text-xs font-medium text-slate-700">{level}</span>
             </div>
           ))}
        </div>
      </div>

      {!compact && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 z-[1000]">
          Interactive Coverage Map
        </div>
      )}
    </div>
  );
}
"""

with open("src/components/map-visual.tsx", "w") as f:
    f.write(content)
