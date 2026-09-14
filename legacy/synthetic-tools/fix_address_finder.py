import re

with open("src/components/address-finder.tsx", "r") as f:
    text = f.read()

text = text.replace("import { demoOfficials } from '../lib/demo-data';", "import { demoOfficials, addressSuggestions } from '../lib/demo-data';")

match = re.search(r'const googleSuggestions = .*?\] : \[\];', text, flags=re.DOTALL)
if match:
    new_code = """const googleSuggestions = value.trim() ? addressSuggestions.filter(addr => addr.lower().includes(value.lower())) : [];
  if (googleSuggestions.length === 0 && value.trim()) {
     googleSuggestions.push(`${value}, Miami, FL`);
  }
"""
    # Using python string methods:
    new_code = """const googleSuggestions = value.trim() ? addressSuggestions.filter(addr => addr.toLowerCase().includes(value.toLowerCase())) : [];
  if (googleSuggestions.length === 0 && value.trim()) {
    googleSuggestions.push(`${value}, Miami, FL`, `${value}, Orlando, FL`, `${value}, Tampa, FL`);
  }"""
    text = text[:match.start()] + new_code + text[match.end():]

with open("src/components/address-finder.tsx", "w") as f:
    f.write(text)
