import re
with open("src/components/map-visual.tsx", "r") as f:
    text = f.read()

# Grab everything from {/* Legend */} down to {!compact
pattern = r"\{/\* Legend \*/\}.*?\{!compact && \("
replacement = """{/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-[1000]">
        {/* Total Count Legend */}
        {totalCount !== undefined && (
          <div className="bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-slate-200">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Mapped</div>
             <div className="text-xl font-black text-blue-600">{totalCount.toLocaleString()}{totalCount >= 20000 && levelFilter !== 'All' ? '+' : ''}</div>
             <div className="text-xs text-slate-600 font-medium">{levelFilter === 'All' ? 'Officials verified' : `${levelFilter} officials`}</div>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur px-3 py-3 rounded-xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Level Legend</span>
            <div className="flex flex-col gap-2">
               {Object.entries(levelColors).map(([level, color]) => (
                 <div key={level} className="flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}></span>
                   <span className="text-xs font-medium text-slate-700">{level}</span>
                 </div>
               ))}
                 <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-200">
                   <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#000' }}></span>
                   <span className="text-xs font-medium text-slate-700">Searched Address</span>
                 </div>
            </div>
        </div>
      </div>
      
      {!compact && ("""

text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open("src/components/map-visual.tsx", "w") as f:
    f.write(text)
