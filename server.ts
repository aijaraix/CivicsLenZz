import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

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

