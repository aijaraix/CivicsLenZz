import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# Make search interactive without "Find" button
# Or at least filter immediately.
text = text.replace("const query = submittedAddress.toLowerCase();", "const query = search.toLowerCase();")
text = text.replace("if (submittedAddress) {", "if (search.trim()) {")
text = text.replace("{submittedAddress ? \"Your Elected Officials\" : \"Elected Officials Directory\"}", "{search.trim() ? \"Your Elected Officials\" : \"Elected Officials Directory\"}")
text = text.replace("{submittedAddress ? \"Officials matching search\" : \"All Officials\"}", "{search.trim() ? \"Officials matching search\" : \"All Officials\"}")

# Pass result to MapVisual
text = text.replace("<MapVisual />", "<MapVisual officials={result} />")

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
