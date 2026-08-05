import os
import re

for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                content = f.read()
            
            # Replace <Link href="..." with <Link to="..."
            new_content = re.sub(r'<Link([^>]*)href=', r'<Link\1to=', content)
            
            if content != new_content:
                with open(filepath, "w") as f:
                    f.write(new_content)

