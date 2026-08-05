import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# Make the result list be the first 20 randomly rotating, we can just slice to 20
text = text.replace('{result.map((official) => (', '{result.slice(0, 20).map((official) => (')

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
