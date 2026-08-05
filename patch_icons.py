import re
with open("src/components/icons.tsx", "r") as f:
    text = f.read()

text = text.replace("| 'book' | 'loader-2';", "| 'book' | 'loader-2' | 'info' | 'alert-circle';")
text = text.replace("'check-circle': <circle", "'info': <path d=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>,\n  'alert-circle': <path d=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z\"/><path d=\"M12 8v4\"/><path d=\"M12 16h.01\"/>,\n  'check-circle': <circle")
text = text.replace("info: <path", "'info': <path")

with open("src/components/icons.tsx", "w") as f:
    f.write(text)
