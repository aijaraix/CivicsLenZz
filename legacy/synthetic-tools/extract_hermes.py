import re

with open("home_jsx.txt", "r") as f:
    text = f.read()

# Find the Live Data Pipeline Status section
# It is within the activeTab === "home" wrapper, let's just grab the whole row that contains Hermes.
# It seems to be a grid or flex row.
# Let's search for the start of the div that has "Live Data Pipeline Status"
match = re.search(r'(<div[^>]*?>\s*<div[^>]*?>\s*<h3[^>]*?>.*?Live Data Pipeline Status.*?</div>.*?)\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>', text, re.DOTALL | re.IGNORECASE)

if match:
    print("Found section")
    # print the first 200 chars to check
    print(match.group(1)[:200])
else:
    print("Not found")

