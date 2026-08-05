import re
with open("src/HomePage.tsx", "r") as f:
    text = f.read()

pattern = r"function AnimatedStat\(\{.*?return <>{prefix}\{count.toLocaleString\(undefined, \{ minimumFractionDigits: decimals, maximumFractionDigits: decimals \}\)\}\{suffix\}</>;\n\}"

replacement = """function AnimatedStat({ targetNumber, prefix = "", suffix = "", decimals = 0 }: { targetNumber: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(targetNumber);
  
  // Update state immediately when targetNumber changes
  if (count !== targetNumber) {
    setCount(targetNumber);
  }

  return <>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}"""

text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open("src/HomePage.tsx", "w") as f:
    f.write(text)
