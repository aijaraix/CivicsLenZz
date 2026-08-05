import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

pattern = r'// Component to dynamically fit bounds\nfunction MapFitter.*?\n\}'

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

text = re.sub(pattern, replacement, text, flags=re.DOTALL)
text = text.replace("<MapFitter officials={officials} userLocation={userLocation} />", "<MapFitter userLocation={userLocation} />")

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
