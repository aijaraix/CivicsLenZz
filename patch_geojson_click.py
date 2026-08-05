import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

target = """                <GeoJSON 
                    key={b.key}
                    data={b.feature}
                    style={{
                        color: b.color,
                        weight: 2,
                        opacity: 0.8,
                        fillColor: b.color,
                        fillOpacity: 0.1
                    }}
                />"""

replacement = """                <GeoJSON 
                    key={b.key}
                    data={b.feature}
                    style={{
                        color: b.color,
                        weight: 2,
                        opacity: 0.8,
                        fillColor: b.color,
                        fillOpacity: 0.1
                    }}
                    onEachFeature={(feature, layer) => {
                        layer.on({
                            click: (e) => {
                                const map = e.target._map;
                                map.fitBounds(e.target.getBounds());
                            }
                        });
                    }}
                />"""

text = text.replace(target, replacement)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
