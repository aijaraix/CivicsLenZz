import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { hermesBackendStore } from "./src/lib/hermes-backend-store";
import { hermesWorkerDaemon } from "./src/lib/hermes-worker-daemon";
import { masterFloridaLedger } from "./src/lib/florida-master-ledger";

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Start Real Server-Side HERMES Background Worker Daemon
  hermesWorkerDaemon.startDaemon();

  // =========================================================================
  // REAL HERMES SERVER REST API ENDPOINTS
  // =========================================================================

  // 1. Daemon Status & Worker Health
  app.get("/api/hermes/status", (req, res) => {
    res.json(hermesWorkerDaemon.getDaemonStatus());
  });

  // 2. Persistent Job Queue & Dead Letter Queue
  app.get("/api/hermes/jobs", (req, res) => {
    res.json({
      jobs: hermesBackendStore.getJobs(),
      dead_letters: hermesBackendStore.getDeadLetterJobs(),
      summary: hermesBackendStore.getDatabaseSummary()
    });
  });

  // 3. Florida Master Seat Ledger & 67-County Registry
  app.get("/api/hermes/florida-master-ledger", (req, res) => {
    res.json({
      summary: masterFloridaLedger.getMasterLedgerSummary(),
      seats: masterFloridaLedger.getSeatRecords(),
      counties: masterFloridaLedger.getCountyRecords(),
      municipalities: masterFloridaLedger.getMunicipalityRecords()
    });
  });

  // 4. Florida Seat Coverage Ledger
  app.get("/api/hermes/coverage", (req, res) => {
    res.json({
      seats: hermesBackendStore.getSeatCoverageRecords(),
      summary: hermesBackendStore.getDatabaseSummary()
    });
  });

  // 4. Raw Cryptographic Evidence Objects
  app.get("/api/hermes/evidence", (req, res) => {
    res.json({
      evidence_objects: hermesBackendStore.getRawEvidenceObjects()
    });
  });

  // 5. Forensic Reality Audit & Source Registry
  app.get("/api/hermes/audit", (req, res) => {
    res.json({
      reality_badge: "REAL_SERVER_SIDE",
      execution_mode: "Node Express Daemon (Background Process)",
      sources: hermesBackendStore.getSourceRegistry(),
      summary: hermesBackendStore.getDatabaseSummary()
    });
  });

  // 6. Trigger Real Research Job
  app.post("/api/hermes/trigger-seat", (req, res) => {
    const { seat_uuid, person_uuid, agent_id, job_type } = req.body;
    const newJob = hermesBackendStore.createJob({
      agent_id: agent_id || "H1",
      job_type: job_type || "RESEARCH_CONTRACT_COMPLETENESS_RUN",
      seat_uuid,
      person_uuid,
      priority: 9
    });
    res.json({ status: "queued", job: newJob });
  });

  // 7. Direct file stream of data/ directory from disk
  app.get("/api/data-files", (req, res) => {
    try {
      const dataDir = path.join(process.cwd(), "data");
      const files: { path: string; content: string }[] = [];

      function readDirRecursive(dir: string, baseRelative = "") {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = baseRelative ? `${baseRelative}/${entry.name}` : entry.name;
          if (entry.isDirectory()) {
            readDirRecursive(fullPath, relPath);
          } else if (entry.isFile()) {
            const content = fs.readFileSync(fullPath, "utf-8");
            files.push({ path: relPath, content });
          }
        }
      }

      readDirRecursive(dataDir);
      res.json({ files });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Image Proxy Endpoint to bypass browser CORS / Hotlink protection for official portraits
  app.get("/api/image-proxy", async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send("Missing image URL parameter");
    }

    try {
      // Decode URL if needed
      const targetUrl = decodeURIComponent(imageUrl);
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Referer": new URL(targetUrl).origin
        }
      });

      if (!response.ok) {
        return res.status(response.status).send(`Failed to fetch image from upstream: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400"); // Cache 24 hours
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(buffer);
    } catch (err: any) {
      console.error("Image proxy error:", err);
      res.status(500).send("Error fetching image");
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "CivicLenZ", time: new Date().toISOString() });
  });


  // Phase 2: Spatial API Endpoints (Simulated for 500k Architecture)
  
  // 1. Geocode & Point-in-Polygon Query (Find my exact representatives)
  app.get("/api/officials/represent", (req, res) => {
    const { lat, lng } = req.query;
    // In production, this would query PostGIS:
    // SELECT official.*, boundary.geojson FROM seats
    // JOIN boundaries ON seats.boundary_id = boundaries.id
    // JOIN officials ON seats.current_official_id = officials.id
    // WHERE ST_Contains(boundaries.geom, ST_SetSRID(ST_MakePoint(lng, lat), 4326));
    
    // Simulate returning a subset of officials for a specific point
    // This demonstrates the logic without needing a real PostGIS DB right now.
    res.json({
        status: 'success',
        message: 'Point-in-polygon spatial query simulated.',
        point: { lat, lng },
        // We will just return a mock response that the frontend will use to filter the DB
        officials: ['donald-trump', 'marco-rubio', 'ron-desantis', 'shevrin-jones', 'daniella-levine-cava'] 
    });
  });

  // 2. Bounding Box Query (Dynamic Map Loading)
  app.get("/api/map/boundaries", (req, res) => {
    const { north, south, east, west, zoom } = req.query;
    // In production, this would use PostGIS ST_MakeEnvelope and ST_Simplify:
    // SELECT id, name, level, 
    //   CASE WHEN zoom < 8 THEN ST_Simplify(geom, 0.1) ELSE geom END as geometry 
    // FROM boundaries WHERE geom && ST_MakeEnvelope(west, south, east, north, 4326);
    
    // Simulate dynamic loading: only return data if they zoom in enough, 
    // or return clustered points if zoomed out.
    res.json({
        status: 'success',
        message: 'Bounding box query simulated.',
        bounds: { north, south, east, west },
        zoom,
        note: "In production, this returns Vector Tiles or simplified GeoJSON within the bounds."
    });
  });

  // REST endpoint for AI actions - Replaced with Local Mock Engine to prevent API Rate Limit / Configuration Errors
  app.post("/api/gemini/action", async (req, res) => {
    const { action, payload } = req.body;
    try {
      let simulatedText = "";
      
      if (action === "explain_bill") {
        simulatedText = `### AI Analysis (Local Simulation)

**Practical Impact**: The proposed legislation modifies structural frameworks for energy grid modernization, allowing state utilities to pre-register infrastructure costs with a 4.2% rate adjustment cap.
**Who is Affected**: Residents of the affected districts, state utilities, and local environmental compliance officers.
**Key Deadlines & Fiscal Rules**: Implementation begins October 1, 2026. Review audits must be filed quarterly. Estimated fiscal impact is a $12M state-level reserve program allocating grants to rural county grids.`;
      } else if (action === "draft_action") {
        simulatedText = `### Draft Generated (Local Simulation)

Dear **${payload.officialName || "Representative"}**,

I am writing to express my perspective regarding **${payload.topic}**. As a registered voter in your district, I believe it is critical to address these matters with a focus on institutional efficiency and regional growth.

My position is: *${payload.stance}*.

Thank you for your service and leadership.

Sincerely,
**[Your Name]**
[Your Address]
[Your Email/Phone]`;
      } else if (action === "analyze_statements") {
        simulatedText = `### Statement Check (Local Simulation)

**Summary**: The official emphasizes a commitment to municipal public security funding adjustments.
**Detected Commitments**: "To lower local property assessment rates by 0.5% in the next fiscal cycle." (Specific / Measurable).
**Consistency Check**: Standard neutral analysis suggests this alignment matches voting history in Bills SB-104 and local property bills, though pending review of FY27 budget files.`;
      } else if (action === "identify_officials") {
        simulatedText = `### Identification Protocol (Local Simulation)

**Scope of Query**: Automated tracking aggregation for requested jurisdictions in Florida.

**Identified Scrape Targets & Positions**:
*   **Florida State Executive Branch**: Governor, Lieutenant Governor, Attorney General, Chief Financial Officer, Commissioner of Agriculture. (Source: flgov.com, myflorida.com)
*   **Florida Senate**: All 40 Senate district seats. (Source: flsenate.gov)
*   **Florida House of Representatives**: All 120 House district seats. (Source: myfloridahouse.gov)
*   **County & Municipal Levels**: Mayors, County Commissioners, School Board Members. (Sources: Specific County Supervisor of Elections sites, e.g., miamidade.gov/elections)

**Recommended Scraping Pipelines**:
1.  Initialize daily cron jobs tracking the Florida Division of Elections Candidate Tracking System.
2.  Deploy individual county-level scrapers targeted at local municipal websites for city council and county commissioner rosters.`
      } else {
        return res.status(400).json({ error: "Unknown action" });
      }
      
      // Artificial delay to simulate processing
      setTimeout(() => {
        res.json({ text: simulatedText, isSimulated: true });
      }, 1000);

    } catch (err: any) {
      console.error("Action error:", err);
      res.status(500).json({ error: err.message || "An error occurred with local generation." });
    }
  });

  // Serve static files in prod or use Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicLenZ server running on port ${PORT}`);
  });
}

startServer();

