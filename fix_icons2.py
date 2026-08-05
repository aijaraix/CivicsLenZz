import re
with open("src/components/icons.tsx", "r") as f:
    text = f.read()

text = text.replace("'alert-circle': <><circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 8v4M12 16h.01\" /></>,\n  'alert-circle': <><circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 8v4M12 16h.01\" /></>,", "'alert-circle': <><circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 8v4M12 16h.01\" /></>,")

with open("src/components/icons.tsx", "w") as f:
    f.write(text)
