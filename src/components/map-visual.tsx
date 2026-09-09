import React, { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrackedOfficial } from '../lib/civic-database';
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-cluster';

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

// Component to dynamically fit bounds
function MapFitter({ userLocation }: { userLocation: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
        if (!userLocation) {
            // Default to US View if no specific location is searched
            map.setView([39.8, -98.5], 4);
            return;
        }
        
        // When a user searches, fly to that specific location with an appropriate zoom
        map.flyTo([userLocation[1], userLocation[0]], 10, {
            duration: 1.5
        });
        
    }, [map, userLocation]);

    return null;
}

export function MapVisual({ compact, officials = [], levelFilter = 'All', userAddress, totalCount }: { compact?: boolean, officials?: TrackedOfficial[], levelFilter?: string, userAddress?: string, totalCount?: number }) {
  const [usGeoJSON, setUsGeoJSON] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!userAddress || userAddress.trim() === '') {
        setUserLocation(null);
        return;
    }
    
    // Check if it's Florida or California as a shortcut
    if (userAddress.toLowerCase().includes('florida')) {
        setUserLocation([-81.5158, 27.6648]);
        return;
    } else if (userAddress.toLowerCase().includes('california')) {
        setUserLocation([-119.4179, 36.7783]);
        return;
    }

    const q = userAddress + ", USA";
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`)
      .then(res => res.json())
      .then(data => {
          if (data && data.length > 0) {
              setUserLocation([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
          } else {
              setUserLocation(null);
          }
      })
      .catch(err => {
          console.error("Geocoding failed", err);
          setUserLocation(null);
      });
  }, [userAddress]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(res => res.json())
      .then(data => setUsGeoJSON(data))
      .catch(err => console.error("Could not load states map", err));
  }, []);

  const mapData = useMemo(() => {
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
              }
          } else if (usGeoJSON && isNational) {
              boundaries.push({
                  key: `bound-${off.slug}-${index}`,
                  feature: usGeoJSON,
                  color
              });
          }
          // Sub-state districts without loaded local GIS shapefiles display as exact geocoded markers without synthetic boundary hulls
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
         preferCanvas={true}
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
                    <div className="text-xs text-slate-400 mt-1">{m.official.office}</div>
                </Popup>
            </Marker>
        ))}
        {userLocation && (
            <Marker position={[userLocation[1], userLocation[0]]} icon={L.divIcon({
                className: 'custom-user-marker',
                html: `<div style="background-color: #000; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.4);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            })}>
                <Popup>
                    <div className="text-sm font-semibold text-slate-900">Searched Location</div>
                    <div className="text-xs text-slate-600">{userAddress}</div>
                </Popup>
            </Marker>
        )}
        
        {!compact && <MapFitter userLocation={userLocation} />}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-[1000]">
        {/* Total Count Legend */}
        {totalCount !== undefined && (
          <div className="bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-slate-200">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Mapped</div>
             <div className="text-xl font-black text-blue-600">{totalCount.toLocaleString()}{totalCount >= 20000 && levelFilter !== 'All' ? '+' : ''}</div>
             <div className="text-xs text-slate-600 font-medium">{levelFilter === 'All' ? 'Officials verified' : `${levelFilter} officials`}</div>
          </div>
        )}

                <div className="bg-white/95 backdrop-blur px-3 py-3 rounded-xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Level Legend</span>
            <div className="flex flex-col gap-3">
               {Object.entries(levelColors).map(([level, color]) => (
                 <div key={level} className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}></span>
                     <span className="text-xs font-semibold text-slate-900">{level}</span>
                   </div>
                   <div className="text-[10px] text-slate-500 ml-5 leading-tight">
                     {level === 'Federal' && 'President, Congress, etc.'}
                     {level === 'State' && 'Governors, State Legislators'}
                     {level === 'Local' && 'Mayors, City Councils, Sheriffs'}
                     {level === 'School Board' && 'District Board Members'}
                   </div>
                 </div>
               ))}
                 <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-200">
                   <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#000' }}></span>
                   <span className="text-xs font-medium text-slate-700">Searched Address</span>
                 </div>
            </div>
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
