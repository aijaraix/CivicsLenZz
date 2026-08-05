import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# Remove the prototype banner
text = re.sub(r'<div className="prototype-label">.*?</div>', '', text)
text = text.replace("{result.length} shown", "{result.length} Officials Found")

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
