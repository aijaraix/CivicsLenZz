import re

with open("src/components/app-shell.tsx", "r") as f:
    text = f.read()

text = text.replace("import { MapVisual } from './map-visual';", "import { MapVisual } from './map-visual';\nimport { trackedOfficials } from '../lib/civic-database';")
text = text.replace("<MapVisual />", "<MapVisual compact officials={trackedOfficials} />")

with open("src/components/app-shell.tsx", "w") as f:
    f.write(text)
