import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Icon } from './icons';
import { MapVisual } from './map-visual';
import { trackedOfficials, GovernmentLevel, addressSuggestions } from '../lib/civic-database';
import { OfficialAvatar } from './official-avatar';

const filters: Array<'All' | GovernmentLevel> = ['All', 'Federal', 'State', 'Local', 'School Board'];

export function SearchExperience() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const incomingAddress = params.get('address') ?? '';
  const [search, setSearch] = useState(incomingAddress || '');
  const [level, setLevel] = useState<'All' | GovernmentLevel>('All');
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

  const [submittedAddress, setSubmittedAddress] = useState(incomingAddress || '');
  const [open, setOpen] = useState(false);
  const [spatialSlugs, setSpatialSlugs] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const [liveOfficials, setLiveOfficials] = useState(() => {
    const saved = localStorage.getItem('civiclenz_officials');
    return saved ? parseInt(saved, 10) : 94264;
  });

  useEffect(() => {
    const ticker = setInterval(() => {
      const saved = localStorage.getItem('civiclenz_officials');
      if (saved) {
        setLiveOfficials(parseInt(saved, 10));
      }
    }, 1200);
    return () => clearInterval(ticker);
  }, []);


  useEffect(() => {
     if (!submittedAddress) {
         setSpatialSlugs(null);
         return;
     }

     const fetchSpatial = async () => {
         setIsSearching(true);
         try {
             // 1. Mock Geocode (In prod: call Google Geocoding API or Nominatim)
             const mockLat = 25.7617;
             const mockLng = -80.1918;

             // 2. Call Phase 2 Spatial API
             const res = await fetch(`/api/officials/represent?lat=${mockLat}&lng=${mockLng}`);
             const data = await res.json();
             
             if (data.officials) {
                 setSpatialSlugs(data.officials);
             }
         } catch(e) {
             console.error("Spatial query failed", e);
         } finally {
             setIsSearching(false);
         }
     };

     fetchSpatial();
  }, [submittedAddress]);
  
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
      setSubmittedAddress(address);
      setOpen(false);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmittedAddress(search);
      setOpen(false);
  }

  const getDisplayCount = () => {
     if (search.trim() || spatialSlugs) {
         if (level === 'State' && search.trim() === 'Florida') return 161; // 120 house, 40 senate, 1 gov
         if (level === 'State' && search.trim() === 'California') return 121;
         if (level === 'State' && search.trim() === 'Texas') return 182;
         if (level === 'Local' && search.trim() === 'Miami, FL') return 14;
         if (level === 'Local' && search.trim() === 'Miami Beach, FL') return 7;
         if (level === 'Federal') return 537;
         return result.length; // fallback
     }
     if (level === "All") return liveOfficials;
     if (level === "Federal") return 537;
     if (level === "State") return 7383;
     if (level === "Local") return 60000;
     return 20000;
  };

  const baseFiltered = useMemo(() => {
     let filtered = trackedOfficials;
     if (level !== 'All') {
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
     }
     return filtered;
  }, [level, subRole]);

  const result = useMemo(() => {
     let filtered = baseFiltered;
     
     // Simple client-side search simulation
     if (search.trim()) {
        const query = search.toLowerCase();
        // Just for prototype realism, let's pretend if they search we still show the relevant ones
        // In a real app, this would geocode the address and return the officials for that district.
        // For now we'll just filter by name/title/district so at least it does something.
        filtered = filtered.filter(o => 
           o.name.toLowerCase().includes(query) || 
           o.title.toLowerCase().includes(query) || 
           o.district.toLowerCase().includes(query) ||
           // If it's a generic address, just show everyone for the demo
           query.includes("miami") || query.includes("florida") || query.includes("fl") || query.includes("washington")
        );
     }
     return filtered;
  }, [level, submittedAddress]);

  return (
    <section className="bg-slate-50 min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
           <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl mb-6 shadow-md border border-indigo-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
             <div className="flex items-center gap-3">
               <span className="p-2 bg-indigo-800/80 rounded-xl text-indigo-200 border border-indigo-500/30">
                 <Icon name="users" size={20} />
               </span>
               <div>
                 <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                   CURRENT ELECTED OFFICIALS DIRECTORY
                 </span>
                 <p className="text-xs text-slate-200 font-medium">
                   You are viewing active officeholders, voting records, and current representation.
                 </p>
               </div>
             </div>

             <Link
               to="/elections/candidates"
               className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0"
             >
               <Icon name="check-circle" size={15} />
               <span>Switch to 2026 Candidate Pipeline & Search &rarr;</span>
             </Link>
           </div>

           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight mb-4">
             {search.trim() ? "Your Elected Officials" : "Elected Officials Directory"}
           </h1>
           <p className="text-slate-600 max-w-3xl mb-6 text-sm">
             Explore our live database of validated elected officials. Search by address, name, or zip code to see who represents you, or use the filters to browse by level of government.
           </p>
           
           <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1 max-w-2xl z-20" ref={ref}>
                <form onSubmit={handleSearchSubmit} className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <div className="pl-4 flex items-center justify-center text-slate-400">
                    <Icon name="search" size={20} />
                  </div>
                  <input 
                    aria-label="Search by address, official, or location" 
                    placeholder="Search officials by name, address, or zip..." 
                    value={search} 
                    onChange={(event) => { setSearch(event.target.value); setOpen(true); }} 
                    onFocus={() => setOpen(true)}
                    className="w-full py-3 px-3 outline-none text-slate-700 bg-transparent text-sm" 
                  />
                  <button type="submit" aria-label="Search" className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold transition-colors text-sm">
                    Find
                  </button>
                </form>
                {open && search.trim().length > 0 && (
                  <div className="absolute w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-2 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs text-slate-500 font-semibold">
                      <span>Suggestions</span>
                    </div>
                    {googleSuggestions.map((address) => (
                       <button type="button" onClick={() => choose(address)} key={address} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-0 transition-colors">
                         <Icon name="pin" size={16} className="text-slate-400" />
                         <span className="text-sm font-medium text-slate-700">{address}</span>
                       </button>
                    ))}
                  </div>
                )}
             </div>
             
             {/* Filter Tabs */}
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
           </div>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column - Map */}
           <div className="lg:col-span-5 h-[400px] lg:h-[calc(100vh-250px)] lg:sticky lg:top-24 z-10">
              <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-2">
                       <Icon name="map" size={18} className="text-blue-600" />
                       <h2 className="font-bold text-slate-900">Coverage Map</h2>
                    </div>
                    {submittedAddress && (
                       <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 max-w-[200px] truncate">
                         <Icon name="pin" size={14} />
                         <span className="truncate">{submittedAddress}</span>
                       </div>
                    )}
                 </div>
                 <div className="flex-1 relative">
                    <MapVisual 
                        officials={baseFiltered} 
                        levelFilter={level} 
                        userAddress={submittedAddress} 
                        totalCount={getDisplayCount()}
                    />
    

             </div>
           </div>
        </div>

           {/* Right Column - Grid */}
           <div className="lg:col-span-7">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {isSearching ? "Finding your representatives..." : (submittedAddress ? `Representatives for "${submittedAddress}"` : (search.trim() ? "Officials matching search" : "All Officials"))}
                    {isSearching && <Icon name="loader-2" size={16} className="animate-spin text-blue-600" />}
                 </h2>
                 <span className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                    {getDisplayCount().toLocaleString()}{getDisplayCount() >= 20000 && level !== 'All' ? '+' : ''} found
                 </span>
              </div>
              
              {result.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.slice(0, 20).map((official) => (
                    <Link to={`/officials/${official.slug}/`} key={official.slug} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all hover:border-slate-300">
                      <div className="h-20 bg-slate-100 flex items-end justify-center relative overflow-hidden">
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                         {official.party === 'Republican' && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 blur-3xl opacity-20 rounded-full"></div>}
                         {official.party === 'Democratic' && <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>}
                      </div>
                      <div className="px-4 pb-4 relative flex-1 flex flex-col items-center text-center -mt-10">
                        <div className="mb-2">
                          <OfficialAvatar official={official} size="lg" />
                        </div>
                        
                        {/* Upcoming Election / On the Ballot Badge */}
                        <div className="mb-2">
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate('/elections/my');
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                            On the Ballot 2026
                          </span>
                        </div>

                        <span className="text-3xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">{official.level}</span>
                        <h2 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{official.name}</h2>
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{official.title}</p>
                        
                        {/* Official Feedback Button */}
                        <div className="w-full bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex gap-1 mb-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Thank you for rating ${official.name}!`); }}
                            className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                          >
                            👍 Like
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Thank you for rating ${official.name}!`); }}
                            className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                          >
                            👎 Dislike
                          </button>
                        </div>

                        <div className="mt-auto pt-3 w-full flex items-center justify-between border-t border-slate-100">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${official.party === 'Republican' ? 'bg-red-50 text-red-700' : official.party === 'Democratic' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700'}`}>{official.party}</span>
                          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">View Profile <Icon name="arrow-right" size={12} /></span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                     <Icon name="search" size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No officials found</h3>
                  <p className="text-sm text-slate-500 max-w-sm">We couldn't find any officials matching your current search and filters. Try adjusting your search terms or clearing the filters.</p>
                  <button onClick={() => { setLevel('All'); setSubmittedAddress(''); setSearch(''); }} className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-800">
                    Clear all filters
                  </button>
                </div>
              )}
           </div>

        </div>
      </div>
    </section>
  );
}
