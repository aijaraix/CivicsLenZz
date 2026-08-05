import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

# 1. Add sub-role state
target_state = """  const [level, setLevel] = useState<'All' | GovernmentLevel>('All');"""
replacement_state = """  const [level, setLevel] = useState<'All' | GovernmentLevel>('All');
  const [subRole, setSubRole] = useState<string>('All');

  // Reset sub-role when level changes
  useEffect(() => {
      setSubRole('All');
  }, [level]);

  const roleFilters: Record<string, string[]> = {
      'Federal': ['All', 'President', 'U.S. Senate', 'U.S. House'],
      'State': ['All', 'Governor', 'State Senate', 'State House'],
      'Local': ['All', 'Mayor', 'City Council', 'Sheriff'],
      'School Board': ['All', 'Board Member', 'Superintendent']
  };
"""
text = text.replace(target_state, replacement_state)

# 2. Update filtering logic to use subRole
target_filter = """     if (level !== 'All') {
        filtered = filtered.filter(o => o.level === level);
     }"""
replacement_filter = """     if (level !== 'All') {
        filtered = filtered.filter(o => o.level === level);
        
        if (subRole !== 'All') {
            filtered = filtered.filter(o => {
                const title = o.title.toLowerCase();
                const role = subRole.toLowerCase();
                if (role.includes('senate')) return title.includes('senator') || title.includes('senate');
                if (role.includes('house')) return title.includes('representative') || title.includes('house');
                if (role.includes('governor')) return title.includes('governor');
                if (role.includes('mayor')) return title.includes('mayor');
                if (role.includes('council')) return title.includes('commissioner') || title.includes('council');
                if (role.includes('board')) return title.includes('board');
                return title.includes(role);
            });
        }
     }"""
text = text.replace(target_filter, replacement_filter)

# 3. Add the sub-filter UI below the main filters
target_ui = """             <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0 items-center">
                {filters.map((filter) => (
                   <button
                      key={filter}
                      type="button"
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                       filter === level
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                     }`}
                      onClick={() => setLevel(filter)}
                   >
                     {filter}
                   </button>
                ))}
             </div>"""
replacement_ui = """             <div className="flex flex-col gap-3">
                 <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0 items-center">
                    {filters.map((filter) => (
                       <button
                          key={filter}
                          type="button"
                          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                           filter === level
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                         }`}
                          onClick={() => setLevel(filter)}
                       >
                         {filter}
                       </button>
                    ))}
                 </div>
                 
                 {level !== 'All' && roleFilters[level] && (
                     <div className="flex overflow-x-auto hide-scrollbar gap-2 items-center pb-2 md:pb-0">
                         <Icon name="filter" size={14} className="text-slate-400 mr-1" />
                         {roleFilters[level].map(role => (
                            <button
                                key={role}
                                type="button"
                                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                                 role === subRole
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                               }`}
                                onClick={() => setSubRole(role)}
                            >
                               {role}
                            </button>
                         ))}
                     </div>
                 )}
             </div>"""
text = text.replace(target_ui, replacement_ui)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
