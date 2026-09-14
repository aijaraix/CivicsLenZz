import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# Replace the img src
text = text.replace(
    '<img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(official.name)}&background=random&size=128`} alt={official.name} className="w-16 h-16 rounded-full border-4 border-white shadow-sm mb-2 bg-white" />',
    '<img src={official.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(official.name)}&background=random&size=128`} alt={official.name} className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-sm mb-2 bg-white" />'
)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
