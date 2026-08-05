import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

text = text.replace("export function MapVisual({ compact, officials = [], levelFilter = 'All' }: { compact?: boolean, officials?: TrackedOfficial[], levelFilter?: string }) {", "export function MapVisual({ compact, officials = [], levelFilter = 'All', userAddress }: { compact?: boolean, officials?: TrackedOfficial[], levelFilter?: string, userAddress?: string }) {")

# We want to add userLocation state
insert_state = """  const [usGeoJSON, setUsGeoJSON] = useState<any>(null);
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
  }, [userAddress]);"""

text = text.replace("  const [usGeoJSON, setUsGeoJSON] = useState<any>(null);", insert_state)

# Now inject the marker for the user
# Find the map markers rendering:
marker_replace = """        {mapData.markers.map((m) => (
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
        )}"""

text = re.sub(r"\{mapData\.markers\.map\(\(m\) => \(\s*<Marker.*?</Marker>\s*\)\)\}", marker_replace, text, flags=re.DOTALL)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
