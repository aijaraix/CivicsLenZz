import re

with open("src/components/address-finder.tsx", "r") as f:
    text = f.read()

text = text.replace('const localOfficials = demoOfficials.slice(0, 3);', 'const localOfficials = demoOfficials.slice(0, 6);')
text = text.replace('Google Places Autocomplete', 'Address Search')

with open("src/components/address-finder.tsx", "w") as f:
    f.write(text)
