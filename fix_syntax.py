import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

# Just strip the extra </div>
text = text.replace("        </div>\n        </div>\n      </div>", "      </div>\n      </div>")

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
