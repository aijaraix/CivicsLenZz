import re

with open("src/components/petitions-experience.tsx", "r") as f:
    text = f.read()

text = re.sub(r'<div className="prototype-label">.*?</div>', '', text)

with open("src/components/petitions-experience.tsx", "w") as f:
    f.write(text)
