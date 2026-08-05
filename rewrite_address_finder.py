import re

with open("src/components/address-finder.tsx", "r") as f:
    text = f.read()

new_address_finder = """import React from 'react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate as useRouter } from 'react-router-dom';
import { Icon } from './icons';
import { DemoAvatar } from './demo-avatar';
import { demoOfficials } from '../lib/demo-data';

export function AddressFinder({ dark = false }: { dark?: boolean }) {
  const navigate = useRouter();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Simulate Google Autocomplete suggestions
  const googleSuggestions = value.trim() ? [
    `${value}, Miami, FL`,
    `${value}, Orlando, FL`,
    `${value}, Tampa, FL`
  ] : [];

  // Simulated IP-based location officials (e.g. Miami)
  const localOfficials = demoOfficials.slice(0, 3);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    navigate(`/search/?address=${encodeURIComponent(value)}`);
  };

  const choose = (address: string) => { 
    setValue(address); 
    setOpen(false); 
    navigate(`/search/?address=${encodeURIComponent(address)}`); 
  };

  return (
    <div className={`address-finder ${dark ? 'address-finder-dark' : ''}`} ref={ref}>
      <form onSubmit={submit} className="address-form" style={{ position: 'relative', zIndex: 50 }}>
        <Icon name="pin" size={19} />
        <input 
          aria-label="Enter your home address" 
          value={value} 
          onChange={(event) => { setValue(event.target.value); setOpen(true); }} 
          onFocus={() => setOpen(true)} 
          placeholder="Enter your full address (Google AutoFill enabled)" 
          style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'transparent', outline: 'none' }}
        />
        <button type="submit" aria-label="Find my officials" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px' }}>
          <Icon name="arrow-right" size={19} />
        </button>
      </form>
      
      {open && value.trim().length > 0 ? (
        <div className="address-suggestions absolute w-full bg-white border border-slate-200 rounded-b-xl shadow-lg mt-1 z-40 overflow-hidden" role="listbox" style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
          <div className="suggestion-heading px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs text-slate-500 font-semibold">
            <span>Google Places Autocomplete</span>
          </div>
          {googleSuggestions.map((address) => (
             <button type="button" role="option" onClick={() => choose(address)} key={address} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-0 transition-colors">
               <Icon name="pin" size={16} className="text-slate-400" />
               <span className="text-sm font-medium text-slate-700">{address}</span>
             </button>
          ))}
        </div>
      ) : open && value.trim().length === 0 ? (
        <div className="address-suggestions absolute w-full bg-white border border-slate-200 rounded-b-xl shadow-lg mt-1 z-40 overflow-hidden" style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detected Location: Miami, FL</span>
            <span className="text-3xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">LIVE</span>
          </div>
          <div className="divide-y divide-slate-100">
             {localOfficials.map(official => (
                <button type="button" key={official.slug} onClick={() => navigate(`/officials/${official.slug}/`)} className="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <DemoAvatar official={official} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{official.name}</p>
                    <p className="text-xs text-slate-500 truncate">{official.title}</p>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-slate-300" />
                </button>
             ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
"""

with open("src/components/address-finder.tsx", "w") as f:
    f.write(new_address_finder)
