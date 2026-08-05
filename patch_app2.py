import re
with open("src/App.tsx", "r") as f:
    text = f.read()

import_statement = "import { ContactExperience } from './components/contact-experience';\n"
text = text.replace("import { PetitionsExperience }", import_statement + "import { PetitionsExperience }")

route_statement = '            <Route path="/contact-official" element={<ContactExperience />} />\n'
text = text.replace('            <Route path="/petitions" element={<PetitionsExperience />} />', route_statement + '            <Route path="/petitions" element={<PetitionsExperience />} />')

with open("src/App.tsx", "w") as f:
    f.write(text)
