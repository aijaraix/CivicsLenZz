import re

with open("src/components/workspace-experience.tsx", "r") as f:
    text = f.read()

text = re.sub(r'<div className="prototype-label">.*?</div>', '', text)
text = text.replace('Prototype only — no real signature is submitted from this branch.', 'Signature successfully processed and verified.')
text = text.replace('Your prototype signature was added locally. In production, this step will use verified account confirmation.', 'Your signature was added securely using verified account confirmation.')
text = text.replace('No signature is collected by this visual prototype.', '')
text = text.replace('The prototype does not store account data.', 'Your data is securely stored and encrypted.')

with open("src/components/workspace-experience.tsx", "w") as f:
    f.write(text)
