import re
with open("src/App.tsx", "r") as f:
    text = f.read()

boundary_code = """
import React, { Component, ErrorInfo, ReactNode } from "react";
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Send it to a local endpoint so we can see it in terminal!
    fetch('/api/log-error', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ error: error.message, stack: error.stack, info: errorInfo.componentStack })
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check the terminal.</h1>;
    }
    return this.props.children;
  }
}
"""

if "ErrorBoundary" not in text:
    text = text.replace("export default function App() {", boundary_code + "\nexport default function App() {")
    text = text.replace("<BrowserRouter>", "<ErrorBoundary><BrowserRouter>")
    text = text.replace("</BrowserRouter>", "</BrowserRouter></ErrorBoundary>")
    
    with open("src/App.tsx", "w") as f:
        f.write(text)
