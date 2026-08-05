import re

with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace('import { HomePage, scrapersList, recentDiscoveries, liveTotalRecords } from \'./HomePage\';', 'import { HomePage } from \'./HomePage\';')
text = text.replace('<Route path="/" element={<HomePage scrapersList={scrapersList} recentDiscoveries={recentDiscoveries} liveTotalRecords={liveTotalRecords} />} />', '<Route path="/" element={<HomePage />} />')

with open("src/App.tsx", "w") as f:
    f.write(text)

