import re

with open("src/HomePage.tsx", "r") as f:
    text = f.read()

# Add AnimatedStat component
animated_stat_code = """
import { useState, useEffect } from 'react';

function AnimatedStat({ targetNumber, prefix = "", suffix = "", decimals = 0 }: { targetNumber: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = count;
    const end = targetNumber;
    if (start === end) return;
    
    const duration = Math.abs(end - start) > 100 ? 1500 : 500;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetNumber]);

  return <>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}
"""

if "function AnimatedStat" not in text:
    # insert after imports
    text = re.sub(r'(import { dataSources } from \'./lib/demo-data\';)', r'\1' + '\n' + animated_stat_code, text)

# Add the grid
grid_code = """
      <section className="how-section hermes-stats" style={{ backgroundColor: '#f4f7fb', padding: '60px 0', borderBottom: '1px solid #e1e7ef' }}>
        <div className="site-width mt-12 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="home-analytics-counters-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px'}}>
              {[
                { label: "Officials Verified & Tracked", target: 94235, prefix: "", suffix: "", decimals: 0, change: `Out of 513,000 Total Seats`, color: "#102035" },
                { label: "Public Promises Tracked", target: 1243500, prefix: "", suffix: "+ Actions", decimals: 0, change: "Mapped across federal & state levels", color: "#16a36a" },
                { label: "Public Grants Indexed", target: 350.5, prefix: "$", suffix: "B", decimals: 1, change: "USASpending & State Contract Feeds", color: "#2563eb" },
                { label: "Ingestion Accuracy", target: 99.4, prefix: "", suffix: "%", decimals: 1, change: "Cross-Validated Government Archives", color: "#6366f1" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[120px]" id={`stat-box-${idx}`} style={{background: '#fff', border: '1px solid #e4e8ee', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <p className="text-3xs font-mono text-slate-500 font-bold uppercase tracking-wider leading-relaxed" style={{fontSize: '11px', color: '#687586', letterSpacing: '0.05em', fontWeight: 700}}>{stat.label}</p>
                  <p className="text-2xl font-display font-bold my-1 tracking-tight" style={{fontSize: '28px', fontWeight: 800, margin: '8px 0', color: stat.color}}>
                    <AnimatedStat targetNumber={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                  </p>
                  <p className="text-2xs text-slate-500 font-sans font-medium line-clamp-1" style={{fontSize: '12px', color: '#687586'}}>{stat.change}</p>
                </div>
              ))}
            </div>
        </div>
      </section>
"""

if "home-analytics-counters-grid" not in text:
    text = text.replace('      <section className="how-section">', grid_code + '\n      <section className="how-section">')

with open("src/HomePage.tsx", "w") as f:
    f.write(text)

