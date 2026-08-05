import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrackedOfficial } from '../lib/civic-database';

function MapFitter({ geojsonData }: { geojsonData: any }) {
  const map = useMap();
  useEffect(() => {
    if (geojsonData) {
      const layer = L.geoJSON(geojsonData);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 });
      }
    }
  }, [geojsonData, map]);
  return null;
}

function generateDistrictPolygon(center: [number, number], level: string) {
    const [lng, lat] = center;
    let radius = 0.05; // default size
    if (level === 'State') radius = 0.15;
    if (level === 'Federal') radius = 0.3;
    
    // Create an octagon around the center
    const points = [];
    for (let i = 0; i <= 8; i++) {
        const angle = (i * Math.PI) / 4;
        // add a bit of randomness to make it look like a district
        const r = radius * (0.8 + 0.4 * (Math.sin(i * 12345) * 0.5 + 0.5));
        points.push([
            lng + r * Math.cos(angle),
            lat + r * Math.sin(angle)
        ]);
    }
    
    return {
        type: "Feature",
        properties: { name: "District Boundary" },
        geometry: {
            type: "Polygon",
            coordinates: [points]
        }
    };
}

export function CoverageMap({ official }: { official: TrackedOfficial }) {
  const { district, level, coordinates } = official;
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!district) return;
    let isMounted = true;
    
    async function fetchBoundary() {
      setLoading(true);
      setError(false);
      
      // Check if it's a district
      if (district.toLowerCase().includes('district') || district.toLowerCase().includes('group')) {
         if (coordinates) {
             setGeojsonData(generateDistrictPolygon(coordinates, level));
             setLoading(false);
             return;
         }
      }

      try {
        let q = district.split('·')[0].trim();
        if (level === 'Federal' && district === 'United States') q = 'United States';
        else if (level === 'Federal' || level === 'State') q = `${q}, USA`;
        else if (level === 'Local' || level === 'School Board') q = `${q}, Florida, USA`;
        
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=geojson&polygon_geojson=1&limit=1`, {
          headers: {
            'User-Agent': 'CivicAI-Preview-App/1.0'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (!isMounted) return;
        
        if (data.features && data.features.length > 0) {
          setGeojsonData(data.features[0]);
        } else if (coordinates) {
          // fallback to mock polygon
          setGeojsonData(generateDistrictPolygon(coordinates, level));
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load boundary:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchBoundary();
    
    return () => { isMounted = false; };
  }, [district, level, coordinates]);

  const style = {
    fillColor: '#2563eb',
    fillOpacity: 0.15,
    color: '#2563eb',
    weight: 2
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={3}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {geojsonData && (
          <>
            <GeoJSON data={geojsonData} style={style} />
            <MapFitter geojsonData={geojsonData} />
          </>
        )}
      </MapContainer>
      
      {loading && (
        <div className="absolute inset-0 bg-slate-50/80 z-20 flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading boundary...
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-slate-50/80 z-20 flex items-center justify-center text-sm font-semibold text-red-500">
          Could not load exact boundary.
        </div>
      )}
    </div>
  );
}
