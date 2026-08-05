import re
with open("src/components/icons.tsx", "r") as f:
    text = f.read()

text = text.replace("import React from 'react';", "import React from 'react';")

# Replace the incorrect imports if they exist
text = text.replace("import { AlertCircle, Info } from 'lucide-react';\n", "")

# We need to add the icon paths
text = text.replace("    'alert-circle': AlertCircle,", "")
text = text.replace("    info: Info,", "")

new_paths = """    info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
    'alert-circle': <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,"""

text = text.replace("    'chevron-right': <path d=\"m9 18 6-6-6-6\" />,", "    'chevron-right': <path d=\"m9 18 6-6-6-6\" />,\n" + new_paths)

with open("src/components/icons.tsx", "w") as f:
    f.write(text)
