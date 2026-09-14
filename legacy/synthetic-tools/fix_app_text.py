import re

with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('This prototype section is not fully wired yet.', 'This page is currently under maintenance.')

with open("src/App.tsx", "w") as f:
    f.write(text)
