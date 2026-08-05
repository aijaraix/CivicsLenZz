import os
import re

# Add import React to files
for root, dirs, files in os.walk("src/components"):
    for file in files:
        if file.endswith(".tsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                content = f.read()
            if "import React" not in content:
                content = "import React from 'react';\n" + content
            with open(filepath, "w") as f:
                f.write(content)

# Fix search-experience.tsx useSearchParams
with open("src/components/search-experience.tsx", "r") as f:
    se = f.read()
se = se.replace("const params = useSearchParams();", "const [params] = useSearchParams();")
with open("src/components/search-experience.tsx", "w") as f:
    f.write(se)

# Fix HomePage icon
with open("src/HomePage.tsx", "r") as f:
    hp = f.read()
hp = hp.replace('name="database"', 'name="file"')
with open("src/HomePage.tsx", "w") as f:
    f.write(hp)

