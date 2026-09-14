import re

with open("src/App.tsx", "r") as f:
    text = f.read()

# Add import
text = text.replace("import { PetitionsExperience } from './components/petitions-experience';", "import { PetitionsExperience } from './components/petitions-experience';\nimport { CoverageExperience } from './components/coverage-experience';")

# Add Route
text = text.replace('<Route path="/petitions" element={<PetitionsExperience />} />', '<Route path="/petitions" element={<PetitionsExperience />} />\n            <Route path="/coverage" element={<CoverageExperience />} />')

with open("src/App.tsx", "w") as f:
    f.write(text)
