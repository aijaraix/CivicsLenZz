import re
with open("src/App.tsx", "r") as f:
    text = f.read()

import_statement = "import { MonitorExperience } from './components/monitor-experience';\n"
text = text.replace("import { DashboardView, MonitorView } from './components/app-shell';", "import { DashboardView } from './components/app-shell';\n" + import_statement)

text = text.replace('element={<MonitorView ', 'element={<MonitorExperience ')

with open("src/App.tsx", "w") as f:
    f.write(text)

with open("src/components/app-shell.tsx", "r") as f:
    text = f.read()

# Remove MonitorView and related components from app-shell to clean it up
text = re.sub(r'export function MonitorView.*?WatchlistContent\(\) \{.*?\}', '', text, flags=re.DOTALL)

with open("src/components/app-shell.tsx", "w") as f:
    f.write(text)

