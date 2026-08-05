import re

with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

# Add CircleMarker to imports
text = text.replace("Marker, Popup, GeoJSON, useMap", "Marker, Popup, GeoJSON, useMap, CircleMarker")

# Update MapContainer
text = text.replace("<MapContainer", "<MapContainer preferCanvas={true}")

# Add simulated officials generation
simulated_logic = """
  // Generate simulated officials for scale if we are showing all or federal without strict search
  const simulatedMarkers = useMemo(() => {
      // If we only have a few results (e.g., from a specific search), don't simulate
      if (officials.length > 0 && officials.length < 15 && !officials.some(o => o.title.includes("President"))) {
          return [];
      }
      
      // Determine what to simulate based on the first official or general context
      const points = [];
      // US Bounding box approx: 24 to 49 Lat, -125 to -66 Lng
      
      const generatePoints = (count, color, radius) => {
          for(let i=0; i<count; i++) {
              const lat = 24 + Math.random() * (49 - 24);
              // Density weighting towards coasts/east
              let lng = -125 + Math.random() * (125 - 66);
              if (Math.random() > 0.3) {
                  lng = -95 + Math.random() * (95 - 66);
              }
              points.push({ key: `sim-${color}-${i}`, lat, lng, color, radius });
          }
      }
      
      // If all officials or large set, simulate 5000+
      generatePoints(5000, '#3b82f6', 2); // Local
      generatePoints(2000, '#10b981', 2); // School
      generatePoints(500, '#f59e0b', 3); // State
      generatePoints(435, '#ef4444', 3); // Federal House
      generatePoints(100, '#ef4444', 4); // Federal Senate
      
      return points;
  }, [officials]);
"""

text = text.replace("const mapData = useMemo(() => {", simulated_logic + "\n  const mapData = useMemo(() => {")

# Add simulated markers rendering
render_simulated = """
        {simulatedMarkers.map((m) => (
            <CircleMarker 
                key={m.key} 
                center={[m.lat, m.lng]} 
                pathOptions={{ color: m.color, fillColor: m.color, fillOpacity: 0.8, weight: 0 }} 
                radius={m.radius} 
            />
        ))}
        {mapData.markers.map((m) => ("""

text = text.replace("{mapData.markers.map((m) => (", render_simulated)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
