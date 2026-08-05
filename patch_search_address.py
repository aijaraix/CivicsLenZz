import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

text = text.replace("<MapVisual officials={result} levelFilter={level} />", "<MapVisual officials={result} levelFilter={level} userAddress={submittedAddress} />")

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
