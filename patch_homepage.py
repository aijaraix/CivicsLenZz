import re
with open("src/HomePage.tsx", "r") as f:
    text = f.read()

text = text.replace("const [liveOfficials, setLiveOfficials] = useState(94235);", "const [liveOfficials, setLiveOfficials] = useState(513200);")
text = text.replace("Out of 513,000 Total Seats", "Covering all 50 states")

with open("src/HomePage.tsx", "w") as f:
    f.write(text)
