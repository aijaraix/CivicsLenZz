import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

count_old = '{(search.trim() || spatialSlugs || level !== "All") ? result.length : "90,432+"} found'
count_new = """{
                    search.trim() || spatialSlugs 
                    ? result.length 
                    : (level === "All" ? "90,432+" 
                        : level === "Federal" ? "537" 
                        : level === "State" ? "7,383" 
                        : level === "Local" ? "60,000+" 
                        : "20,000+")
                 } found"""

text = text.replace(count_old, count_new)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
