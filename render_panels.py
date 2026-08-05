import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Add to rendering
new_render = """            <FinancialsPanel official={official} />
            <CampaignFinancePanel official={official} />
            <BusinessEmpirePanel official={official} />
            <LegalCompliancePanel official={official} />"""

text = text.replace("<FinancialsPanel official={official} />", new_render)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
