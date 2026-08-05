import re

with open("src/HomePage.tsx", "r") as f:
    text = f.read()

assert 'scrapers.map' in text
assert 'discoveries.map' in text
assert 'liveTotalRecords.toLocaleString()' in text

print("All assertions passed.")
