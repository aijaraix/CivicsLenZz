import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

text = text.replace('className="prototype-label profile-prototype"', 'className="live-stream-label profile-prototype"')

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
