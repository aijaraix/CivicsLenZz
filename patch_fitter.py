import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

target = """// Component to dynamically fit bounds
function MapFitter({ officials, userLocation }: { officials: TrackedOfficial[], userLocation: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
        // Only trigger an auto-fit if the user explicitly searched an address, 
        // OR if they selected a single state filter. 
        // We do NOT want to auto-zoom to a tiny cluster if they just clicked "Local" nationwide.
        if (!userLocation) {
            // Default to US View if no specific location is searched
            map.setView([39.8, -98.5], 4);
            return;
        }
        
        const bounds = L.latLngBounds([]);
        let hasValidCoords = false;
        
        if (userLocation) {
            bounds.extend([userLocation[1], userLocation[0]]);
            hasValidCoords = true;
        }
        
        officials.forEach(off => {
            if (off.coordinates) {
                bounds.extend([off.coordinates[1], off.coordinates[0]]);
                hasValidCoords = true;
            }
        });
        
        if (hasValidCoords && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }, [officials, map, userLocation]);

    return null;
}"""

replacement = """// Component to dynamically fit bounds
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
}"""

text = text.replace(target, replacement)

# We also need to update how MapFitter is called in MapVisual
text = text.replace("<MapFitter officials={officials} userLocation={userLocation} />", "<MapFitter userLocation={userLocation} />")

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
