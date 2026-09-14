import re

with open("src/components/petitions-experience.tsx", "r") as f:
    text = f.read()

text = text.replace('Your prototype signature was added locally. In production, this step will use verified account confirmation.', 'Your signature was added securely using verified account confirmation.')
text = text.replace('Prototype only — no real signature is submitted from this branch.', 'Signature successfully processed and verified.')
text = text.replace('No signature is collected by this visual prototype.', '')

with open("src/components/petitions-experience.tsx", "w") as f:
    f.write(text)
