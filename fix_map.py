import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Add import
text = text.replace("import { OfficialAvatar } from './official-avatar';", "import { OfficialAvatar } from './official-avatar';\nimport { CoverageMap } from './coverage-map';")

# Replace map
old_map = """              <div className="bg-slate-100 rounded-xl aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-slate-200">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
                <Icon name="map" size={48} className="text-slate-300 relative z-10" />
                <div className="absolute inset-4 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center animate-pulse">
                   <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">{official.district}</div>
                </div>
              </div>"""

new_map = """              <div className="bg-slate-100 rounded-xl aspect-[4/3] relative overflow-hidden border border-slate-200 isolation-isolate">
                <CoverageMap district={official.district} level={official.level} />
              </div>"""

text = text.replace(old_map, new_map)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
