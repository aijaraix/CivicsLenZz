import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

text = text.replace('official.photo', 'official.photoUrl')
text = text.replace('name="image"', 'name="user"')

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
