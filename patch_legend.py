import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

legend_replacement = """        <div className="bg-white/95 backdrop-blur px-3 py-3 rounded-xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Level Legend</span>
            <div className="flex flex-col gap-3">
               {Object.entries(levelColors).map(([level, color]) => (
                 <div key={level} className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}></span>
                     <span className="text-xs font-semibold text-slate-900">{level}</span>
                   </div>
                   <div className="text-[10px] text-slate-500 ml-5 leading-tight">
                     {level === 'Federal' && 'President, Congress, etc.'}
                     {level === 'State' && 'Governors, State Legislators'}
                     {level === 'Local' && 'Mayors, City Councils, Sheriffs'}
                     {level === 'School Board' && 'District Board Members'}
                   </div>
                 </div>
               ))}
                 <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-200">
                   <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#000' }}></span>
                   <span className="text-xs font-medium text-slate-700">Searched Address</span>
                 </div>
            </div>
        </div>"""

text = re.sub(
    r'<div className="bg-white/95 backdrop-blur px-3 py-3 rounded-xl shadow-sm border border-slate-200">.*?<span className="text-\[10px\] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Level Legend</span>.*?</div>\s*</div>', 
    legend_replacement, 
    text, 
    flags=re.DOTALL
)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
