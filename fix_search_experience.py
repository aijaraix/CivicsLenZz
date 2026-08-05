import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# Replace imports
text = text.replace("import { demoOfficials, GovernmentLevel } from '../lib/demo-data';", "import { demoOfficials, GovernmentLevel, addressSuggestions } from '../lib/demo-data';")
text = text.replace("import { useMemo, useState } from 'react';", "import { useMemo, useState, useRef, useEffect } from 'react';")

# In SearchExperience, add dropdown logic
hook_injection = """  const [params] = useSearchParams();
  const incomingAddress = params.get('address') ?? '';
  const [search, setSearch] = useState(incomingAddress);
  const [level, setLevel] = useState<'All' | GovernmentLevel>('All');
  const [submitted, setSubmitted] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const googleSuggestions = search.trim() ? addressSuggestions.filter(addr => addr.toLowerCase().includes(search.toLowerCase())) : [];
  if (googleSuggestions.length === 0 && search.trim()) {
    googleSuggestions.push(`${search}, Miami, FL`);
  }

  const choose = (address: string) => { 
     setSearch(address); 
     setOpen(false); 
     setSubmitted(true);
  };
"""
text = re.sub(r'  const \[params\] = useSearchParams\(\);.*?const \[submitted, setSubmitted\] = useState\(true\);', hook_injection, text, flags=re.DOTALL)


# Replace search topbar input with autocomplete
form_match = re.search(r'<form.*?className="search-master-input">.*?</form>', text, flags=re.DOTALL)
if form_match:
    new_form = """<div ref={ref} style={{ position: 'relative', flex: 1 }}>
            <form onSubmit={(event) => { event.preventDefault(); setOpen(false); setSubmitted(true); }} className="search-master-input">
              <Icon name="search" size={18} />
              <input aria-label="Search by address, official, or location" placeholder="Search officials by name, address, or zip..." value={search} onChange={(event) => { setSearch(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
              <button type="submit" aria-label="Search"><Icon name="arrow-right" size={18} /></button>
            </form>
            {open && search.trim().length > 0 && (
              <div className="absolute w-full bg-white border border-slate-200 rounded-b-xl shadow-lg mt-1 z-50 overflow-hidden" style={{ top: '100%', left: 0 }}>
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs text-slate-500 font-semibold">
                  <span>Address Search</span>
                </div>
                {googleSuggestions.map((address) => (
                   <button type="button" onClick={() => choose(address)} key={address} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-0 transition-colors">
                     <Icon name="pin" size={16} className="text-slate-400" />
                     <span className="text-sm font-medium text-slate-700">{address}</span>
                   </button>
                ))}
              </div>
            )}
          </div>"""
    text = text[:form_match.start()] + new_form + text[form_match.end():]

# Replace official result list with grid layout
grid_match = re.search(r'<div className="official-result-list">.*?</div>', text, flags=re.DOTALL)
if grid_match:
    new_grid = """<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {submitted && result.map((official) => (
                  <Link to={`/officials/${official.slug}/`} key={official.slug} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all hover:border-slate-300">
                    <div className="h-20 bg-slate-100 flex items-end justify-center relative overflow-hidden">
                       <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="px-4 pb-4 relative flex-1 flex flex-col items-center text-center -mt-10">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(official.name)}&background=random&size=128`} alt={official.name} className="w-16 h-16 rounded-full border-4 border-white shadow-sm mb-2 bg-white" />
                      <span className="text-3xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">{official.level}</span>
                      <h2 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{official.name}</h2>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{official.title}</p>
                      <div className="mt-auto pt-3 w-full flex items-center justify-between border-t border-slate-100">
                        <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">{official.party}</span>
                        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">Profile <Icon name="arrow-right" size={12} /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>"""
    text = text[:grid_match.start()] + new_grid + text[grid_match.end():]

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
