with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()
text = text.replace("Florida's", "Florida\\'s")
with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
