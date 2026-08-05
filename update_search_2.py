import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# Replace the count label to show the large mocked count if not searching
count_old = '{result.length} found'
count_new = '{(search.trim() || spatialSlugs || level !== "All") ? result.length : "90,432+"} found'

text = text.replace(count_old, count_new)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
