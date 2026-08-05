import re

with open("src/HomePage.tsx", "r") as f:
    text = f.read()

text = re.sub(r'<div className="prototype-label">.*?</div>', '', text)

with open("src/HomePage.tsx", "w") as f:
    f.write(text)
