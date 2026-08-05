import re

with open("src/components/coverage-map.tsx", "r") as f:
    text = f.read()

new_logic = """        let q = query.split('·')[0].trim();
        if (level === 'Federal' && query === 'United States') q = 'United States';
        else if (level === 'Federal' || level === 'State') q = `${q}, USA`;
        else if (level === 'Local' || level === 'School Board') q = `${q}, Florida, USA`; // Hardcoded for this demo since local reps are FL"""

text = text.replace("""        let q = query;
        if (level === 'Federal') q = 'United States';
        else if (level === 'State') q = `${query}, USA`;
        // For Local, q is likely just the city/county name which should work okay if we add state. 
        // For our demo, the query comes from district.""", new_logic)

with open("src/components/coverage-map.tsx", "w") as f:
    f.write(text)
