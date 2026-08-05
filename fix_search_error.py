import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

bad_text = """<Link to={`/officials/${official.slug}/`} className="profile-arrow" aria-label={`View ${official.name} profile`}><Icon name="chevron-right" size={20} /></Link></article>)}
              </div>"""

text = text.replace(bad_text, "")

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
