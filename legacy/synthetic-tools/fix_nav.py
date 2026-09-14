import re

with open("src/components/site-chrome.tsx", "r") as f:
    text = f.read()

# Add Coverage to mainLinks
old_mainLinks = """const mainLinks = [
  { label: 'How It Works', href: '/how-it-works/' },
  { label: 'Features', href: '/features/' },
  { label: 'About', href: '/about/' },
  { label: 'Petitions', href: '/petitions/' },
];"""

new_mainLinks = """const mainLinks = [
  { label: 'How It Works', href: '/how-it-works/' },
  { label: 'Features', href: '/features/' },
  { label: 'Coverage', href: '/coverage/' },
  { label: 'About', href: '/about/' },
  { label: 'Petitions', href: '/petitions/' },
];"""

text = text.replace(old_mainLinks, new_mainLinks)

with open("src/components/site-chrome.tsx", "w") as f:
    f.write(text)
