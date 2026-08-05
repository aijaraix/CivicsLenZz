import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

text = text.replace("import capitalsData from '../lib/capitals.json';\n", "")

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
