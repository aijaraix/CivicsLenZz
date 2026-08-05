import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

# Remove FastSimulatedDots
pattern = r"// Fast Canvas layer for simulating 90,000 dots without crashing React.*?return null;\n}\n"
text = re.sub(pattern, "", text, flags=re.DOTALL)

# Remove its invocation
text = text.replace("<FastSimulatedDots officials={officials} levelFilter={levelFilter} />", "")
text = text.replace("<FastSimulatedDots officials={officials} />", "")

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
