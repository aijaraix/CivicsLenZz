import re
with open("src/HomePage.tsx", "r") as f:
    text = f.read()

target = """function AnimatedStat({ targetNumber, prefix = "", suffix = "", decimals = 0 }: { targetNumber: number, prefix?: string, suffix?: string, decimals?: number }) {
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
}"""

replacement = """function AnimatedStat({ targetNumber, prefix = "", suffix = "", decimals = 0 }: { targetNumber: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(targetNumber);
  
  useEffect(() => {
    setCount(targetNumber);
  }, [targetNumber]);

  return <>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}"""

text = text.replace(target, replacement)

with open("src/HomePage.tsx", "w") as f:
    f.write(text)
