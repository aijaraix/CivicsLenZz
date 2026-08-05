import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

text = text.replace("import MarkerClusterGroup from 'react-leaflet-cluster';", "// @ts-ignore\nimport MarkerClusterGroup from 'react-leaflet-cluster';")

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
