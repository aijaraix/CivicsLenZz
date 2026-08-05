import re

with open("src/App.tsx", "r") as f:
    text = f.read()

text = re.sub(r'function ProfileWrapper\(\) \{.*?\n\}', '', text, flags=re.DOTALL)
text = text.replace('<Route path="/officials/:slug" element={<ProfileWrapper />} />', '<Route path="/officials/:slug" element={<ProfileExperience />} />')

with open("src/App.tsx", "w") as f:
    f.write(text)
