import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

text = text.replace("const [search, setSearch] = useState(incomingAddress);", "const [search, setSearch] = useState(incomingAddress || '');")
text = text.replace("const [submittedAddress, setSubmittedAddress] = useState(incomingAddress);", "const [submittedAddress, setSubmittedAddress] = useState(incomingAddress || '');")

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
