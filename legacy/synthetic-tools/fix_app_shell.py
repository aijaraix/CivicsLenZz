with open("src/components/app-shell.tsx", "r") as f:
    text = f.read()

text = text.replace("/`} className=\"watchlist-card\" key={official.slug}><OfficialAvatar official={official} size=\"lg\" /><div><span className=\"small-label\">{official.level}</span><h2>{official.name}</h2><p>{official.title}</p><span className=\"watch-score\"><Icon name=\"sparkles\" size={15} /> {official.score}/100 accountability score</span></div><Icon name=\"chevron-right\" size={20} /></Link>)}</section>; }", "")

with open("src/components/app-shell.tsx", "w") as f:
    f.write(text)
