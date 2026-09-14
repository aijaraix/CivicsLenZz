import re

with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

# I will just write a python script to parse the list and fix it, or I can just use sed.
# It seems my regex was:
# re.sub(r"slug: '" + slug + r"'(.*?)(?=\n  \}|\n    //)", r"slug: '" + slug + r"'\1, coordinates: " + str(coords), content, flags=re.DOTALL)
# It ate all the brackets.

