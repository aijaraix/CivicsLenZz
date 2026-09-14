import re
with open("src/components/icons.tsx", "r") as f:
    text = f.read()

# I will replace the messy 'info' and 'alert-circle'
text = re.sub(r"'info': <path d=.*?,\n  'alert-circle': <path d=.*?,\n  ", "", text, flags=re.DOTALL)
text = text.replace("info: <><circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4M12 8h.01\" /></>,", "  'info': <><circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4M12 8h.01\" /></>,\n  'alert-circle': <><circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 8v4M12 16h.01\" /></>,")

with open("src/components/icons.tsx", "w") as f:
    f.write(text)
