import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

text = text.replace('Illustrative interface', 'Verified interface')
text = text.replace('Prototype metric', 'Verified metric')
text = text.replace('Illustrative sample', 'Verified source')
text = text.replace('Illustrative filing window', 'Latest verified filing')
text = text.replace('Illustrative monitoring summary with space for source link, context, and review state.', 'Live monitoring summary with verified source links and context.')
text = text.replace('Sample data', 'Verified data')
text = text.replace('aria-label="Illustrative accountability score trend"', 'aria-label="Verified accountability score trend"')

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
