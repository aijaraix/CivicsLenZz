import re

with open("vite.config.ts", "r") as f:
    text = f.read()

define_block = """    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },"""

if "define:" not in text:
    text = text.replace("plugins: [react(), tailwindcss()],", "plugins: [react(), tailwindcss()],\n" + define_block)
    with open("vite.config.ts", "w") as f:
        f.write(text)
