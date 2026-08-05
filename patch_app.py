import re
with open("src/App.tsx", "r") as f:
    text = f.read()

import_statement = "import { PromisesExperience } from './components/promises-experience';\n"
text = text.replace("import { PetitionsExperience }", import_statement + "import { PetitionsExperience }")

route_statement = '            <Route path="/promises" element={<PromisesExperience />} />\n'
text = text.replace('            <Route path="/petitions" element={<PetitionsExperience />} />', route_statement + '            <Route path="/petitions" element={<PetitionsExperience />} />')

with open("src/App.tsx", "w") as f:
    f.write(text)
