import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

target = """function generateMockBoundary(center: [number, number], level: string, isNational: boolean) {
    if (isNational) return null;
    let size = 0.05;
    if (level === 'State') size = 2.0;
    if (level === 'Federal') size = 1.0;
    if (level === 'Local') size = 0.1;
    if (level === 'School Board') size = 0.05;
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
}"""

replacement = """function generateMockBoundary(center: [number, number], level: string, isNational: boolean) {
    if (isNational) return null;
    let radius = 0.05;
    if (level === 'State') radius = 0.3;
    if (level === 'Federal') radius = 0.5;
    if (level === 'Local') radius = 0.1;
    if (level === 'School Board') radius = 0.05;
    
    const [lng, lat] = center;
    const points = [];
    for (let i = 0; i <= 8; i++) {
        const angle = (i * Math.PI) / 4;
        const r = radius * (0.8 + 0.4 * (Math.sin(i * 12345) * 0.5 + 0.5));
        points.push([
            lng + r * Math.cos(angle),
            lat + r * Math.sin(angle)
        ]);
    }
    
    return {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Polygon",
            coordinates: [points]
        }
    };
}"""

text = text.replace(target, replacement)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
