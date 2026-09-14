import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Replace AccordionItem props definition
text = re.sub(r'function AccordionItem.*?\{', 'function AccordionItem({ title, subtitle, icon, rightElement, children }: { title: string, subtitle?: string, icon?: import("./icons").IconName, rightElement?: React.ReactNode, children: React.ReactNode }) {', text, count=1)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
