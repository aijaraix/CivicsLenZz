import re
with open("server.ts", "r") as f:
    text = f.read()

if "/api/log-error" not in text:
    route = """
  app.post("/api/log-error", express.json(), (req, res) => {
    console.log("============= FRONTEND ERROR =============");
    console.log("Message:", req.body.error);
    console.log("Stack:", req.body.stack);
    console.log("Component Stack:", req.body.info);
    console.log("==========================================");
    res.json({ ok: true });
  });
"""
    text = text.replace("// Vite middleware for development", route + "\n  // Vite middleware for development")
    with open("server.ts", "w") as f:
        f.write(text)
