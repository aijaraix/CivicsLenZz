import os
import re

def process_file(filepath):
    with open(filepath, "r") as f:
        text = f.read()

    # Replace 'next/link' with 'react-router-dom'
    text = text.replace("import Link from 'next/link';", "import { Link } from 'react-router-dom';")
    
    # Replace 'next/navigation'
    if 'useRouter' in text or 'useSearchParams' in text or 'usePathname' in text:
        text = text.replace("import { useRouter } from 'next/navigation';", "import { useNavigate as useRouter } from 'react-router-dom';")
        text = text.replace("import { useSearchParams } from 'next/navigation';", "import { useSearchParams } from 'react-router-dom';")
        text = text.replace("import { usePathname } from 'next/navigation';", "import { useLocation } from 'react-router-dom';\nconst usePathname = () => useLocation().pathname;")
        text = text.replace("import { usePathname, useRouter } from 'next/navigation';", "import { useNavigate as useRouter, useLocation } from 'react-router-dom';\nconst usePathname = () => useLocation().pathname;")
        text = text.replace("import { useSearchParams, useRouter } from 'next/navigation';", "import { useSearchParams, useNavigate as useRouter } from 'react-router-dom';")
        text = text.replace("import { useRouter, useSearchParams } from 'next/navigation';", "import { useSearchParams, useNavigate as useRouter } from 'react-router-dom';")
        # In address-finder.tsx it's `import { useRouter } from 'next/navigation';`
        # In react-router, `useRouter()` is `useNavigate()`, and it returns `navigate`, not `router`.
        # Next.js `router.push('/path')` -> `navigate('/path')`
        text = re.sub(r'const router = useRouter\(\);', 'const navigate = useRouter();', text)
        text = re.sub(r'router\.push\(', 'navigate(', text)
        text = re.sub(r'router\.replace\(', 'navigate(', text)
        text = re.sub(r'router\.back\(', 'navigate(-1', text)

    # Replace 'use client'
    text = text.replace("'use client';\n", "")
    text = text.replace('"use client";\n', "")

    # Replace @/ imports with ./ or ../
    # Inside src/components, @/components/ -> ./, @/lib/ -> ../lib/
    text = text.replace("@/components/", "./")
    text = text.replace("@/lib/", "../lib/")

    # Also next/image
    text = text.replace("import Image from 'next/image';", "")
    text = re.sub(r'<Image([^>]*?)(/?)>', r'<img\1\2>', text)

    with open(filepath, "w") as f:
        f.write(text)

for root, dirs, files in os.walk("src/components"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            process_file(os.path.join(root, file))

for root, dirs, files in os.walk("src/lib"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            process_file(os.path.join(root, file))

print("Rewrite complete.")
