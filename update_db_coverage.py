import re

with open("src/lib/civic-database.ts", "r") as f:
    content = f.read()

# I'll just find trackedOfficials and inject `coverage` in them.
# The user wants "The map should reflect the locations of these officials based on their state, and similar functionality should apply to state-level selections."
# We'll map coordinates for each:
# Donald Trump / JD Vance: National [ -98.5795, 39.8283 ] (center of US) or DC [ -77.0369, 38.9072 ]
# Rubio / Scott / Wilson: FL [ -81.5158, 27.6648 ] or DC for senators? DC is good for federal, or FL. Let's do DC for federal. Actually, they represent FL, so maybe put a marker in FL. Wait, the user said "federal official currently within the system in the United States. The map should reflect the locations of these officials based on their state". So Federal -> state they represent.
# If they are US President, maybe DC.
# Ron DeSantis, Shevrin Jones, Fabian Basabe: FL
# Daniella, Steven, Alex, Lucia: Miami

# Let's add coordinates to the TrackedOfficial type.
content = content.replace("coverage?: MapCoverage;", "coverage?: MapCoverage;\n  coordinates?: [number, number];")

def add_coords(slug, coords):
    global content
    content = re.sub(r"slug: '" + slug + r"'(.*?)(?=\n  \}|\n    //)", r"slug: '" + slug + r"'\1, coordinates: " + str(coords), content, flags=re.DOTALL)

add_coords('donald-trump', [-77.0369, 38.9072])
add_coords('jd-vance', [-77.0369, 38.9072])
add_coords('marco-rubio', [-81.5158, 27.6648]) # FL
add_coords('rick-scott', [-81.5158, 27.6648]) # FL
add_coords('frederica-wilson', [-80.1918, 25.7617]) # Miami
add_coords('ron-desantis', [-84.2807, 30.4383]) # Tallahassee
add_coords('shevrin-jones', [-80.2500, 25.8000]) # Miamiish
add_coords('fabian-basabe', [-80.1300, 25.7900]) # Miami Beach
add_coords('daniella-levine-cava', [-80.1918, 25.7617]) # Miami
add_coords('steven-meiner', [-80.1300, 25.7900]) # Miami Beach
add_coords('alex-fernandez', [-80.1300, 25.7900]) # Miami Beach
add_coords('lucia-baez-geller', [-80.1918, 25.7617]) # Miami

with open("src/lib/civic-database.ts", "w") as f:
    f.write(content)
