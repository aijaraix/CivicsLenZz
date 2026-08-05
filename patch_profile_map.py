import re
with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

text = text.replace("<CoverageMap district={official.district} level={official.level} />", "<CoverageMap official={official} />")

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
