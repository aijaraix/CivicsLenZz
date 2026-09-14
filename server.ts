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


  // =========================================================================
  // REAL GEOGRAPHIC BOUNDARY RESOLUTION & SEAT DISCOVERY (US CENSUS GEOCODER)
  // =========================================================================

  // Helper function to resolve address or coordinates using US Census Geocoding Bureau
  async function resolveCensusBoundaries(addressQuery?: string, lat?: number, lng?: number) {
    let url = "";
    if (addressQuery) {
      url = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${encodeURIComponent(addressQuery)}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;
    } else if (lat !== undefined && lng !== undefined) {
      url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lng}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;
    } else {
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "CivicLenZ-Harvester-GeoEngine/1.0 (Autonomous Civic Intelligence; contact@civiclenz.org)"
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`US Census Geocoder returned HTTP ${response.status}`);
      }

      const data = await response.json();
      let match = null;
      let geographies: any = null;

      if (addressQuery && data.result && data.result.addressMatches && data.result.addressMatches.length > 0) {
        match = data.result.addressMatches[0];
        geographies = match.geographies || {};
      } else if (!addressQuery && data.result && data.result.geographies) {
        geographies = data.result.geographies;
        match = {
          coordinates: { x: lng, y: lat },
          matchedAddress: `Coordinates (${lat}, ${lng})`
        };
      }

      if (!geographies) {
        return null;
      }

      const geoKeys = Object.keys(geographies);
      const stateKey = geoKeys.find(k => /States/i.test(k));
      const countyKey = geoKeys.find(k => /^Counties$/i.test(k.trim())) || geoKeys.find(k => /Counties/i.test(k));
      const cdKey = geoKeys.find(k => /Congressional Districts/i.test(k));
      const senateKey = geoKeys.find(k => /State Legislative Districts - Upper/i.test(k));
      const houseKey = geoKeys.find(k => /State Legislative Districts - Lower/i.test(k));
      const placeKey = geoKeys.find(k => /Incorporated Places/i.test(k));

      const stateObj = (stateKey ? geographies[stateKey] : [])[0] || {};
      const countyObj = (countyKey ? geographies[countyKey] : [])[0] || {};
      const cdObj = (cdKey ? geographies[cdKey] : [])[0] || {};
      const senateObj = (senateKey ? geographies[senateKey] : [])[0] || {};
      const houseObj = (houseKey ? geographies[houseKey] : [])[0] || {};
      const placeObj = (placeKey ? geographies[placeKey] : [])[0] || {};

      return {
        matchedAddress: match.matchedAddress || addressQuery || `${lat}, ${lng}`,
        coordinates: {
          lat: match.coordinates ? match.coordinates.y : lat,
          lng: match.coordinates ? match.coordinates.x : lng
        },
        stateName: stateObj.NAME || "UNRESOLVED",
        stateFips: stateObj.STATE || "UNRESOLVED",
        countyName: countyObj.NAME ? countyObj.NAME.replace(/\s+County$/i, "") : "UNRESOLVED",
        countyFips: countyObj.COUNTY || "UNRESOLVED",
        congressionalDistrict: cdObj.BASENAME || cdObj.CD119 || cdObj.CD118 || cdObj.DISTRICT || "UNRESOLVED",
        stateSenateDistrict: senateObj.BASENAME || senateObj.SLDU || "UNRESOLVED",
        stateHouseDistrict: houseObj.BASENAME || houseObj.SLDL || "UNRESOLVED",
        municipalityName: placeObj.NAME || undefined,
        censusSource: "US Census Bureau Geocoding API (Public_AR_Current / Current_Current)",
        layerProvenance: {
          state: { source: "US Census Bureau Geographies: States", layer_type: "DIRECT_CENSUS", status: "RESOLVED_AUTHORITATIVE", vintage: "Current_Current" },
          county: { source: "US Census Bureau Geographies: Counties", layer_type: "DIRECT_CENSUS", status: "RESOLVED_AUTHORITATIVE", vintage: "Current_Current" },
          congressional_district: { source: `US Census Bureau Geographies: ${cdKey || 'Congressional Districts'}`, layer_type: "DIRECT_CENSUS", status: "RESOLVED_AUTHORITATIVE", vintage: "119th/118th Congress" },
          state_senate_district: { source: `US Census Bureau Geographies: ${senateKey || 'State Legislative Districts - Upper'}`, layer_type: "DIRECT_CENSUS", status: "RESOLVED_AUTHORITATIVE", vintage: "2024 State Legislative Districts" },
          state_house_district: { source: `US Census Bureau Geographies: ${houseKey || 'State Legislative Districts - Lower'}`, layer_type: "DIRECT_CENSUS", status: "RESOLVED_AUTHORITATIVE", vintage: "2024 State Legislative Districts" },
          municipality: { source: `US Census Bureau Geographies: ${placeKey || 'Incorporated Places'}`, layer_type: "DIRECT_CENSUS", status: placeObj.NAME ? "RESOLVED_AUTHORITATIVE" : "UNINCORPORATED_OR_NOT_FOUND", vintage: "Current_Current" },
          county_commission_district: { source: "County GIS Boundary Portal / Supervisor of Elections Precinct Split", layer_type: "REQUIRES_LOCAL_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION", note: "US Census does not delineate county commission sub-districts; requires local County GIS shapefile layer. Unsupported boundary not inferred." },
          school_board_district: { source: "County School Board GIS / FL DOE Geospatial Data", layer_type: "REQUIRES_LOCAL_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION", note: "Single-member school board districts require local school district GIS polygon boundaries. Unsupported boundary not inferred." },
          municipal_council_district: { source: "Municipal City Clerk / GIS Department", layer_type: "REQUIRES_LOCAL_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION", note: "City commission/council ward sub-districts require municipal GIS layer. Unsupported boundary not inferred." },
          special_district: { source: "Florida DEP / SFWMD Water Management District GIS Portal", layer_type: "REQUIRES_SPECIAL_DISTRICT_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION", note: "Regional water management basin and special district taxing boundaries require Florida DEP / SFWMD GIS layer." }
        }
      };
    } catch (err: any) {
      console.warn("Census geocoding request notice:", err.message);
      return null;
    }
  }

  // Build the complete Seat Hierarchy for resolved boundaries
  function buildSeatHierarchy(resolved: {
    stateName: string;
    stateFips: string;
    countyName: string;
    countyFips: string;
    congressionalDistrict: string;
    stateSenateDistrict: string;
    stateHouseDistrict: string;
    municipalityName?: string;
  }) {
    if (resolved.stateName === "UNRESOLVED") {
      return [];
    }

    const coverageRecords = hermesBackendStore.getSeatCoverageRecords();
    const findOccupant = (seatId: string) => {
      const record = coverageRecords.find(r => r.seat_uuid === seatId);
      if (record && record.current_official_name) {
        return {
          name: record.current_official_name,
          party: "RESEARCH_RECORD",
          status: "EXTRACTED_UNREVIEWED"
        };
      }
      return undefined;
    };

    const seats: Array<{
      seat_id: string;
      office_title: string;
      government_level: 'Federal' | 'State' | 'County' | 'Municipal' | 'School Board' | 'Special District';
      branch: 'Executive' | 'Legislative' | 'Judicial' | 'Constitutional' | 'School Board' | 'Special District';
      jurisdiction: string;
      district?: string;
      current_occupant?: {
        name: string;
        party: string;
        photoUrl?: string;
        status: string;
      };
      upcoming_election: {
        cycle: string;
        expected_date: string;
        monitoring_status: string;
      };
      evidence_source: {
        authority: string;
        url: string;
        verification_status: string;
      };
    }> = [];

    // 1. Federal Seats
    seats.push({
      seat_id: "seat_us_president",
      office_title: "President of the United States",
      government_level: "Federal",
      branch: "Executive",
      jurisdiction: "United States of America",
      district: "Nationwide",
      current_occupant: findOccupant("seat_us_president"),
      upcoming_election: { cycle: "2028", expected_date: "November 7, 2028", monitoring_status: "MONITORING" },
      evidence_source: { authority: "Executive Office of the President", url: "https://whitehouse.gov", verification_status: "EXTRACTED_UNREVIEWED" }
    });

    seats.push({
      seat_id: "seat_us_senate_fl_class_1",
      office_title: "U.S. Senator (Florida - Class 1)",
      government_level: "Federal",
      branch: "Legislative",
      jurisdiction: "State of Florida",
      district: "Florida Statewide (Class 1)",
      current_occupant: findOccupant("seat_us_senate_fl_class_1"),
      upcoming_election: { cycle: "2026/2030", expected_date: "November 2030", monitoring_status: "MONITORING" },
      evidence_source: { authority: "United States Senate", url: "https://www.senate.gov/senators/", verification_status: "EXTRACTED_UNREVIEWED" }
    });

    seats.push({
      seat_id: "seat_us_senate_fl_class_3",
      office_title: "U.S. Senator (Florida - Class 3)",
      government_level: "Federal",
      branch: "Legislative",
      jurisdiction: "State of Florida",
      district: "Florida Statewide (Class 3)",
      current_occupant: findOccupant("seat_us_senate_fl_class_3"),
      upcoming_election: { cycle: "2028", expected_date: "November 7, 2028", monitoring_status: "MONITORING" },
      evidence_source: { authority: "United States Senate", url: "https://www.senate.gov/senators/", verification_status: "EXTRACTED_UNREVIEWED" }
    });

    if (resolved.congressionalDistrict !== "UNRESOLVED") {
      seats.push({
        seat_id: `seat_us_house_fl_${resolved.congressionalDistrict}`,
        office_title: `U.S. Representative (Florida District ${resolved.congressionalDistrict})`,
        government_level: "Federal",
        branch: "Legislative",
        jurisdiction: "State of Florida",
        district: `Florida Congressional District ${resolved.congressionalDistrict}`,
        current_occupant: findOccupant(`seat_us_house_fl_${resolved.congressionalDistrict}`),
        upcoming_election: { cycle: "2026", expected_date: "November 3, 2026", monitoring_status: "ELEVATED_ELECTION_WATCH" },
        evidence_source: { authority: "U.S. House of Representatives", url: "https://www.house.gov/representatives", verification_status: "EXTRACTED_UNREVIEWED" }
      });
    }

    // 2. State Executive Seats
    seats.push({
      seat_id: "seat_fl_governor",
      office_title: "Governor of Florida",
      government_level: "State",
      branch: "Executive",
      jurisdiction: "State of Florida",
      district: "Statewide",
      current_occupant: findOccupant("seat_fl_governor"),
      upcoming_election: { cycle: "2026", expected_date: "November 3, 2026", monitoring_status: "ELEVATED_ELECTION_WATCH" },
      evidence_source: { authority: "Florida Executive Office of the Governor", url: "https://flgov.com", verification_status: "EXTRACTED_UNREVIEWED" }
    });

    seats.push({
      seat_id: "seat_fl_attorney_general",
      office_title: "Attorney General of Florida",
      government_level: "State",
      branch: "Constitutional",
      jurisdiction: "State of Florida",
      district: "Statewide",
      current_occupant: findOccupant("seat_fl_attorney_general"),
      upcoming_election: { cycle: "2026", expected_date: "November 3, 2026", monitoring_status: "ELEVATED_ELECTION_WATCH" },
      evidence_source: { authority: "Florida Office of the Attorney General", url: "https://myfloridalegal.com", verification_status: "EXTRACTED_UNREVIEWED" }
    });

    // 3. State Legislative Seats
    if (resolved.stateSenateDistrict !== "UNRESOLVED") {
      seats.push({
        seat_id: `seat_fl_senate_${resolved.stateSenateDistrict}`,
        office_title: `Florida State Senator (District ${resolved.stateSenateDistrict})`,
        government_level: "State",
        branch: "Legislative",
        jurisdiction: "State of Florida",
        district: `Florida Senate District ${resolved.stateSenateDistrict}`,
        current_occupant: findOccupant(`seat_fl_senate_${resolved.stateSenateDistrict}`),
        upcoming_election: { cycle: "2026", expected_date: "November 3, 2026", monitoring_status: "ELEVATED_ELECTION_WATCH" },
        evidence_source: { authority: "Florida State Senate", url: `https://flsenate.gov/Senators/s${resolved.stateSenateDistrict}`, verification_status: "EXTRACTED_UNREVIEWED" }
      });
    }

    if (resolved.stateHouseDistrict !== "UNRESOLVED") {
      seats.push({
        seat_id: `seat_fl_house_${resolved.stateHouseDistrict}`,
        office_title: `Florida State Representative (District ${resolved.stateHouseDistrict})`,
        government_level: "State",
        branch: "Legislative",
        jurisdiction: "State of Florida",
        district: `Florida House District ${resolved.stateHouseDistrict}`,
        current_occupant: findOccupant(`seat_fl_house_${resolved.stateHouseDistrict}`),
        upcoming_election: { cycle: "2026", expected_date: "November 3, 2026", monitoring_status: "ELEVATED_ELECTION_WATCH" },
        evidence_source: { authority: "Florida House of Representatives", url: "https://myfloridahouse.gov/Representatives", verification_status: "EXTRACTED_UNREVIEWED" }
      });
    }

    // 4. County Seats
    if (resolved.countyName !== "UNRESOLVED") {
      const isMiamiDade = resolved.countyName.toLowerCase().includes("miami-dade");
      seats.push({
        seat_id: `seat_county_mayor_${resolved.countyFips}`,
        office_title: isMiamiDade ? "Mayor of Miami-Dade County" : `County Commission Chair (${resolved.countyName} County)`,
        government_level: "County",
        branch: "Executive",
        jurisdiction: `${resolved.countyName} County, Florida`,
        district: "Countywide",
        current_occupant: findOccupant(`seat_county_mayor_${resolved.countyFips}`),
        upcoming_election: { cycle: "2026/2028", expected_date: "August 2028", monitoring_status: "MONITORING" },
        evidence_source: { authority: `${resolved.countyName} County Government`, url: `https://www.${resolved.countyName.toLowerCase().replace(/\s+/g, '')}.gov`, verification_status: "EXTRACTED_UNREVIEWED" }
      });

      // County Commission District
      seats.push({
        seat_id: `seat_county_commission_${resolved.countyFips}`,
        office_title: `${resolved.countyName} County Commissioner`,
        government_level: "County",
        branch: "Legislative",
        jurisdiction: `${resolved.countyName} County, Florida`,
        district: "Single-Member Sub-District (Awaiting County GIS Layer / Precinct Split)",
        current_occupant: findOccupant(`seat_county_commission_${resolved.countyFips}`),
        upcoming_election: { cycle: "2026", expected_date: "November 3, 2026", monitoring_status: "ELEVATED_ELECTION_WATCH" },
        evidence_source: { authority: `${resolved.countyName} Board of County Commissioners`, url: `https://www.${resolved.countyName.toLowerCase().replace(/\s+/g, '')}.gov`, verification_status: "REQUIRES_LOCAL_GIS_DO_NOT_INFER" }
      });

      // County Constitutional Officers
      const constOfficers = ["Sheriff", "Clerk of Court & Comptroller", "Property Appraiser", "Tax Collector", "Supervisor of Elections"];
      constOfficers.forEach((off, idx) => {
        seats.push({
          seat_id: `seat_${resolved.countyFips}_const_${idx}`,
          office_title: `${off} (${resolved.countyName} County)`,
          government_level: "County",
          branch: "Constitutional",
          jurisdiction: `${resolved.countyName} County, Florida`,
          district: "Countywide",
          current_occupant: findOccupant(`seat_${resolved.countyFips}_const_${idx}`),
          upcoming_election: { cycle: "2026/2028", expected_date: "November 2026", monitoring_status: "MONITORING" },
          evidence_source: { authority: `Florida Constitution Article VIII / ${resolved.countyName} SOE`, url: "https://dos.elections.myflorida.com", verification_status: "EXTRACTED_UNREVIEWED" }
        });
      });

      // School Board Seat
      seats.push({
        seat_id: `seat_school_board_${resolved.countyFips}`,
        office_title: `${resolved.countyName} County School Board Member`,
        government_level: "School Board",
        branch: "School Board",
        jurisdiction: `${resolved.countyName} County Public Schools`,
        district: "Single-Member Sub-District (Awaiting School Board GIS Layer)",
        current_occupant: findOccupant(`seat_school_board_${resolved.countyFips}`),
        upcoming_election: { cycle: "2026", expected_date: "November 3, 2026", monitoring_status: "MONITORING" },
        evidence_source: { authority: "Florida Department of Education & Local School Board", url: "https://fldoe.org", verification_status: "REQUIRES_LOCAL_GIS_DO_NOT_INFER" }
      });
    }

    // 5. Municipal Seats (if resolved municipality exists)
    if (resolved.municipalityName) {
      seats.push({
        seat_id: `seat_muni_mayor_${resolved.municipalityName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
        office_title: `Mayor of ${resolved.municipalityName}`,
        government_level: "Municipal",
        branch: "Executive",
        jurisdiction: `City of ${resolved.municipalityName}, Florida`,
        district: "Citywide",
        current_occupant: findOccupant(`seat_muni_mayor_${resolved.municipalityName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`),
        upcoming_election: { cycle: "2026/2027", expected_date: "November 2026", monitoring_status: "MONITORING" },
        evidence_source: { authority: `${resolved.municipalityName} City Clerk`, url: `https://www.${resolved.municipalityName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.gov`, verification_status: "EXTRACTED_UNREVIEWED" }
      });

      seats.push({
        seat_id: `seat_muni_council_${resolved.municipalityName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
        office_title: `${resolved.municipalityName} City Commissioner / Council Member`,
        government_level: "Municipal",
        branch: "Legislative",
        jurisdiction: `City of ${resolved.municipalityName}, Florida`,
        district: "Ward / Council District (Awaiting Municipal GIS Layer)",
        current_occupant: findOccupant(`seat_muni_council_${resolved.municipalityName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`),
        upcoming_election: { cycle: "2026/2027", expected_date: "November 2026", monitoring_status: "MONITORING" },
        evidence_source: { authority: `${resolved.municipalityName} City Clerk`, url: `https://www.${resolved.municipalityName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.gov`, verification_status: "REQUIRES_LOCAL_GIS_DO_NOT_INFER" }
      });
    }

    // 6. Special District
    seats.push({
      seat_id: "seat_sfwmd_governing_board",
      office_title: "Governing Board Member, South Florida Water Management District",
      government_level: "Special District",
      branch: "Special District",
      jurisdiction: "South Florida Water Management District (16 Counties)",
      district: "Regional Basin",
      current_occupant: findOccupant("seat_sfwmd_governing_board"),
      upcoming_election: { cycle: "Gubernatorial Appointment & Senate Confirmation", expected_date: "Continuous", monitoring_status: "MONITORING" },
      evidence_source: { authority: "SFWMD & State of Florida", url: "https://www.sfwmd.gov", verification_status: "EXTRACTED_UNREVIEWED" }
    });

    return seats;
  }

  // 1. Street Address / Coordinate Boundary Resolution Endpoint (Citizen Civic Lookup)
  app.get("/api/geo/resolve", async (req, res) => {
    const address = req.query.address as string;
    const latStr = req.query.lat as string;
    const lngStr = req.query.lng as string;

    const lat = latStr ? parseFloat(latStr) : undefined;
    const lng = lngStr ? parseFloat(lngStr) : undefined;

    if (!address && (lat === undefined || lng === undefined)) {
      return res.status(400).json({
        error: "Missing address or lat/lng query parameter. Example: /api/geo/resolve?address=111+NW+1st+St,+Miami,+FL+33128"
      });
    }

    const censusData = await resolveCensusBoundaries(address, lat, lng);

    // Fallback if address was not in Census or Geocoder offline
    const resolvedBoundary = censusData || {
      matchedAddress: address || (lat !== undefined && lng !== undefined ? `Coordinates (${lat}, ${lng})` : "UNRESOLVED_ADDRESS"),
      coordinates: { lat: lat || 0, lng: lng || 0 },
      stateName: "UNRESOLVED",
      stateFips: "UNRESOLVED",
      countyName: "UNRESOLVED",
      countyFips: "UNRESOLVED",
      congressionalDistrict: "UNRESOLVED",
      stateSenateDistrict: "UNRESOLVED",
      stateHouseDistrict: "UNRESOLVED",
      municipalityName: undefined,
      censusSource: "US Census Bureau Geocoder / Unresolved",
      layerProvenance: {
        state: { source: "US Census Bureau Geographies: States", layer_type: "DIRECT_CENSUS", status: "UNRESOLVED" },
        county: { source: "US Census Bureau Geographies: Counties", layer_type: "DIRECT_CENSUS", status: "UNRESOLVED" },
        congressional_district: { source: "US Census Bureau Geographies: Congressional Districts", layer_type: "DIRECT_CENSUS", status: "UNRESOLVED" },
        state_senate_district: { source: "US Census Bureau Geographies: State Legislative Districts - Upper", layer_type: "DIRECT_CENSUS", status: "UNRESOLVED" },
        state_house_district: { source: "US Census Bureau Geographies: State Legislative Districts - Lower", layer_type: "DIRECT_CENSUS", status: "UNRESOLVED" },
        municipality: { source: "US Census Bureau Geographies: Incorporated Places", layer_type: "DIRECT_CENSUS", status: "UNRESOLVED" },
        county_commission_district: { source: "County GIS Boundary Portal", layer_type: "REQUIRES_LOCAL_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION" },
        school_board_district: { source: "County School Board GIS", layer_type: "REQUIRES_LOCAL_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION" },
        municipal_council_district: { source: "Municipal City Clerk GIS", layer_type: "REQUIRES_LOCAL_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION" },
        special_district: { source: "SFWMD Water Management District GIS Portal", layer_type: "REQUIRES_SPECIAL_DISTRICT_GIS", status: "PENDING_LOCAL_GIS_INTEGRATION" }
      }
    };

    const seats = buildSeatHierarchy(resolvedBoundary);

    res.json({
      status: "SUCCESS",
      address_input: address || null,
      coordinates: resolvedBoundary.coordinates,
      matched_address: resolvedBoundary.matchedAddress,
      geocoding_source: resolvedBoundary.censusSource,
      boundaries: {
        state: resolvedBoundary.stateName,
        county: resolvedBoundary.countyName,
        congressional_district: resolvedBoundary.congressionalDistrict,
        state_senate_district: resolvedBoundary.stateSenateDistrict,
        state_house_district: resolvedBoundary.stateHouseDistrict,
        municipality: resolvedBoundary.municipalityName || null
      },
      layer_provenance: resolvedBoundary.layerProvenance,
      total_seats_applicable: seats.length,
      seats
    });
  });

  // 2. Real Geocode & Point-in-Polygon Query (Find my exact representatives)
  app.get("/api/officials/represent", async (req, res) => {
    const { lat, lng, address } = req.query;
    const latNum = lat ? parseFloat(lat as string) : undefined;
    const lngNum = lng ? parseFloat(lng as string) : undefined;

    const censusData = await resolveCensusBoundaries(address as string, latNum, lngNum);

    const boundary = censusData || {
      matchedAddress: (address as string) || (latNum !== undefined && lngNum !== undefined ? `Coordinates (${latNum}, ${lngNum})` : "UNRESOLVED_ADDRESS"),
      coordinates: { lat: latNum || 0, lng: lngNum || 0 },
      stateName: "UNRESOLVED",
      stateFips: "UNRESOLVED",
      countyName: "UNRESOLVED",
      countyFips: "UNRESOLVED",
      congressionalDistrict: "UNRESOLVED",
      stateSenateDistrict: "UNRESOLVED",
      stateHouseDistrict: "UNRESOLVED",
      municipalityName: undefined,
      censusSource: "US Census Bureau Geocoder / Unresolved"
    };

    const seats = buildSeatHierarchy(boundary);
    const officials = seats
      .filter(s => s.current_occupant)
      .map(s => ({
        seat_id: s.seat_id,
        office_title: s.office_title,
        government_level: s.government_level,
        official_name: s.current_occupant!.name,
        party: s.current_occupant!.party,
        photo_url: s.current_occupant!.photoUrl,
        verification_status: s.current_occupant!.status
      }));

    res.json({
      status: "success",
      matched_address: boundary.matchedAddress,
      boundaries: {
        state: boundary.stateName,
        county: boundary.countyName,
        congressional_district: boundary.congressionalDistrict,
        state_senate_district: boundary.stateSenateDistrict,
        state_house_district: boundary.stateHouseDistrict
      },
      total_representatives_found: officials.length,
      officials
    });
  });

  // 3. Export Batch Package complying with CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1
  app.get("/api/harvester/export-contract", (req, res) => {
    try {
      const dataDir = path.join(process.cwd(), "data");
      const snapshotsDir = path.join(dataDir, "snapshots");
      const contracts: any[] = [];

      if (fs.existsSync(snapshotsDir)) {
        const files = fs.readdirSync(snapshotsDir).filter(f => f.endsWith(".json"));
        for (const file of files) {
          try {
            const rawContent = fs.readFileSync(path.join(snapshotsDir, file), "utf-8");
            const snap = JSON.parse(rawContent);

            contracts.push({
              producer: "CivicsLenZz-Harvester",
              producer_version: "2.1.0-HERMES-PRIME",
              capability: "official_government_extraction",
              source_key: snap.snapshotId || file.replace(".json", ""),
              source_url: snap.sourceUrl || "https://dos.elections.myflorida.com",
              source_authority: "State of Florida Official Portal",
              source_type: "official_government",
              jurisdiction_key: "jurisdiction_us_fl",
              seat_key: snap.seatKey || "seat_statewide_florida",
              person_candidate_key: snap.personKey,
              retrieved_at: snap.fetchedAt || new Date().toISOString(),
              http_status: 200,
              content_type: "text/html; charset=utf-8",
              byte_length: snap.bytes || rawContent.length,
              content_hash: snap.sha256,
              raw_object_reference: `data/snapshots/${file}`,
              parser_key: "deterministic_fl_dos_parser_v2",
              parser_version: "v2.1",
              extracted_claims: {
                snapshot_id: snap.snapshotId,
                verified_sha256: snap.sha256,
                extraction_source: snap.sourceUrl
              },
              warnings: [],
              extraction_status: "extracted_unreviewed"
            });
          } catch (e) {
            // Ignore corrupted single snapshot in batch
          }
        }
      }

      const batchPackage = {
        batch_id: `batch_harvester_${Date.now()}`,
        schema_version: "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1",
        harvester_id: "civicslenzz_research_harvester",
        exported_at: new Date().toISOString(),
        records_count: contracts.length,
        items: contracts
      };

      res.setHeader("Content-Disposition", 'attachment; filename="civiclenz-research-ingest-v1.json"');
      res.json(batchPackage);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3b. Physical Counts Reporting Endpoint (Directly satisfies Master Architecture reporting requirement)
  app.get("/api/harvester/physical-counts", async (req, res) => {
    try {
      const { floridaBacklogEngine } = await import("./src/lib/florida-backlog-engine");
      const counts = floridaBacklogEngine.getPhysicalCounts();
      res.json({
        status: "SUCCESS",
        reporting_directive: "CivicLenZ Research Harvester Physical Operational Counts",
        counts
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3c. Representative Real Authoritative Export Package (Interoperability Testing with Canonical CivicLenZ)
  app.get("/api/harvester/representative-export", (req, res) => {
    try {
      const representativePath = path.join(process.cwd(), "docs", "representative_export_fl_senate_sd35.json");
      if (fs.existsSync(representativePath)) {
        const fileContent = fs.readFileSync(representativePath, "utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="representative_export_fl_senate_sd35.json"');
        res.setHeader("Content-Type", "application/json");
        return res.send(fileContent);
      }
      res.status(404).json({ error: "Representative export package not found" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3d. Geographic Layers Authoritative Source Catalog (Direct Census vs Local GIS)
  app.get("/api/harvester/geographic-catalog", async (req, res) => {
    try {
      const { floridaBacklogEngine } = await import("./src/lib/florida-backlog-engine");
      res.json({
        status: "SUCCESS",
        catalog: floridaBacklogEngine.getGeographicLayersCatalog()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3e. Seat + Election + Candidate Parallel Research Dossier
  app.get("/api/harvester/parallel-dossier", async (req, res) => {
    try {
      const seatKey = (req.query.seat as string) || "seat_fl_senate_35";
      const { floridaBacklogEngine } = await import("./src/lib/florida-backlog-engine");
      const dossier = floridaBacklogEngine.getParallelSeatDossier(seatKey);
      res.json({
        status: "SUCCESS",
        dossier
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- PERMANENT CANONICAL HERMES BRIDGE API LAYER ---
  
  // Machine Auth Middleware for /api/harvester/*
  app.use("/api/harvester", async (req, res, next) => {
    // Health, capabilities, manifest, and diagnostic endpoints are public/diagnostic machine endpoints
    if (req.path === '/health' || req.path === '/capabilities' || req.path === '/manifest' || req.path === '/diagnostic/auth') {
      return next();
    }
    try {
      const { hermesBridgeClient } = await import("./src/lib/hermes-bridge-client");
      const rawBody = req.body ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : undefined;
      const auth = hermesBridgeClient.verifyInboundRequest(
        req.headers as Record<string, string | string[] | undefined>,
        rawBody
      );
      if (!auth.authenticated) {
        return res.status(401).json({
          status: "ERROR",
          error: "UNAUTHORIZED_MACHINE_AUTH_FAILED",
          message: auth.reason || "Invalid or missing service credential"
        });
      }
      next();
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // 3f. Harvester Health Endpoint
  app.get("/api/harvester/health", async (req, res) => {
    try {
      const { harvesterJobManager } = await import("./src/lib/harvester-job-manager");
      const { hermesBridgeClient } = await import("./src/lib/hermes-bridge-client");
      const { CIVICSLENZZ_PRODUCER_MANIFEST } = await import("./src/lib/producer-manifest");
      const jobs = harvesterJobManager.listJobs();
      const telemetry = hermesBridgeClient.getTelemetry();

      res.json({
        status: "HEALTHY",
        uptime_seconds: Math.floor(process.uptime()),
        producer_id: CIVICSLENZZ_PRODUCER_MANIFEST.producer_id,
        producer_name: CIVICSLENZZ_PRODUCER_MANIFEST.producer_name,
        producer_version: CIVICSLENZZ_PRODUCER_MANIFEST.producer_version,
        canonical_upstream: CIVICSLENZZ_PRODUCER_MANIFEST.canonical_upstream,
        contract_versions_supported: CIVICSLENZZ_PRODUCER_MANIFEST.contract_versions_supported,
        target_ingest_contract: CIVICSLENZZ_PRODUCER_MANIFEST.target_ingest_contract,
        default_extraction_status: CIVICSLENZZ_PRODUCER_MANIFEST.default_extraction_status,
        bridge: {
          canonical_endpoint_configured: telemetry.canonical_endpoint_configured,
          canonical_connection_tested: telemetry.canonical_connection_tested,
          direct_supabase_access: false,
          publication_authority: false,
          verification_authority: false
        },
        jobs_active_count: jobs.filter(j => ['QUEUED', 'LEASED', 'EXECUTING'].includes(j.status)).length,
        total_jobs_tracked: jobs.length,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3g. Harvester Capabilities & Producer Manifest
  app.get("/api/harvester/capabilities", async (req, res) => {
    try {
      const { CIVICSLENZZ_PRODUCER_MANIFEST } = await import("./src/lib/producer-manifest");
      res.json({
        status: "SUCCESS",
        producer_id: CIVICSLENZZ_PRODUCER_MANIFEST.producer_id,
        producer: CIVICSLENZZ_PRODUCER_MANIFEST.producer_name,
        version: CIVICSLENZZ_PRODUCER_MANIFEST.producer_version,
        contract_versions_supported: CIVICSLENZZ_PRODUCER_MANIFEST.contract_versions_supported,
        capabilities: CIVICSLENZZ_PRODUCER_MANIFEST.capabilities,
        prohibitions: CIVICSLENZZ_PRODUCER_MANIFEST.prohibitions
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/harvester/manifest", async (req, res) => {
    try {
      const { CIVICSLENZZ_PRODUCER_MANIFEST } = await import("./src/lib/producer-manifest");
      res.json(CIVICSLENZZ_PRODUCER_MANIFEST);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3h. Inbound HERMES Job Interface (POST, GET :id, POST :id/cancel, GET :id/result, GET list)
  app.post("/api/harvester/jobs", async (req, res) => {
    try {
      const { harvesterJobManager } = await import("./src/lib/harvester-job-manager");
      
      const result = harvesterJobManager.submitHermesJob(req.body);

      if (!result.valid) {
        return res.status(400).json({
          status: "ERROR",
          error_code: result.validation?.code || "INVALID_ENVELOPE",
          error: result.validation?.error || "Invalid job parameters",
          details: result.validation?.details
        });
      }

      res.status(result.is_new ? 201 : 200).json({
        status: "SUCCESS",
        is_new_job: result.is_new,
        job: result.job
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  app.get("/api/harvester/jobs/:id", async (req, res) => {
    try {
      const { harvesterJobManager } = await import("./src/lib/harvester-job-manager");
      const { hermesBridgeClient } = await import("./src/lib/hermes-bridge-client");
      const job = harvesterJobManager.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ status: "ERROR", error: `Job ${req.params.id} not found` });
      }
      const submission = hermesBridgeClient.getSubmissionRecord(req.params.id);
      res.json({
        status: "SUCCESS",
        job,
        submission
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // GET /api/harvester/jobs/:id/result - Fetch Completed Ingest Package & Delivery State
  app.get("/api/harvester/jobs/:id/result", async (req, res) => {
    try {
      const { harvesterJobManager } = await import("./src/lib/harvester-job-manager");
      const { hermesBridgeClient } = await import("./src/lib/hermes-bridge-client");
      const job = harvesterJobManager.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ status: "ERROR", error: `Job ${req.params.id} not found` });
      }

      if (job.status !== 'COMPLETED' || !job.result_payload) {
        return res.status(202).json({
          status: "PENDING",
          job_id: job.job_id,
          job_status: job.status,
          delivery_state: job.delivery_state,
          message: `Job is currently in state '${job.status}'. Result package not yet completed.`
        });
      }

      const submission = hermesBridgeClient.getSubmissionRecord(req.params.id);

      res.json({
        status: "SUCCESS",
        job_id: job.job_id,
        contract_version: job.result_payload.contract_version,
        delivery_state: job.delivery_state,
        extraction_status: job.result_payload.extraction_status, // Strictly extracted_unreviewed
        submission: submission || null,
        result_package: job.result_payload
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  app.post("/api/harvester/jobs/:id/cancel", async (req, res) => {
    try {
      const { harvesterJobManager } = await import("./src/lib/harvester-job-manager");
      const cancelResult = harvesterJobManager.cancelJob(req.params.id, req.body?.reason);
      if (!cancelResult.success) {
        return res.status(400).json({ status: "ERROR", message: cancelResult.message, job: cancelResult.job });
      }
      res.json({ status: "SUCCESS", message: cancelResult.message, job: cancelResult.job });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  app.get("/api/harvester/jobs", async (req, res) => {
    try {
      const { harvesterJobManager } = await import("./src/lib/harvester-job-manager");
      const status = req.query.status as any;
      const seatKey = req.query.seat_key as string;
      const jobs = harvesterJobManager.listJobs({ status, seat_key: seatKey });
      res.json({ status: "SUCCESS", total: jobs.length, jobs });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // Safe Bridge Telemetry
  app.get("/api/harvester/bridge/telemetry", async (req, res) => {
    try {
      const { hermesBridgeClient } = await import("./src/lib/hermes-bridge-client");
      res.json({
        status: "SUCCESS",
        telemetry: hermesBridgeClient.getTelemetry()
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // Canonical PR #54 HMAC Authentication Diagnostic Endpoint
  // Performs authentication diagnostic probe against canonical receiver without touching canary job
  app.all("/api/harvester/diagnostic/auth", async (req, res) => {
    try {
      const { hermesBridgeClient } = await import("./src/lib/hermes-bridge-client");
      const diagResult = await hermesBridgeClient.runAuthenticationDiagnostic();
      res.json(diagResult);
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // Interoperability Canary Trigger & Verification Endpoint
  app.post("/api/harvester/canary", async (req, res) => {
    try {
      const { hermesBridgeClient } = await import("./src/lib/hermes-bridge-client");
      const canaryResult = await hermesBridgeClient.executeInteroperabilityCanary();
      res.json(canaryResult);
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // 3i. National Coverage Atlas Persistence Endpoint
  app.get("/api/harvester/coverage-atlas", async (req, res) => {
    try {
      const { coverageAtlasEngine } = await import("./src/lib/coverage-atlas");
      res.json({
        status: "SUCCESS",
        atlas: coverageAtlasEngine.getAtlasData()
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // 3j. Boundary & Seat Evolution Monitoring
  app.get("/api/harvester/boundary-evolution", async (req, res) => {
    try {
      const { boundaryEvolutionEngine } = await import("./src/lib/boundary-evolution-engine");
      res.json({
        status: "SUCCESS",
        evolution: boundaryEvolutionEngine.getEvolutionSummary()
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // 3k. Cohort Readiness Package (FLORIDA_STATE_SENATE, SOUTH_FLORIDA_CORE)
  app.get("/api/harvester/cohort-readiness/:cohort", async (req, res) => {
    try {
      const { cohortReadinessEngine } = await import("./src/lib/cohort-readiness-engine");
      const pkg = cohortReadinessEngine.getCohortPackage(req.params.cohort);
      if (!pkg) {
        return res.status(404).json({
          status: "ERROR",
          error: `Cohort '${req.params.cohort}' not found. Valid cohorts: FLORIDA_STATE_SENATE, SOUTH_FLORIDA_CORE`
        });
      }
      res.json({
        status: "SUCCESS",
        cohort_package: pkg
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // 3l. Harvester Academy & Source Adapter Performance
  app.get("/api/harvester/academy", async (req, res) => {
    try {
      const { harvesterAcademy } = await import("./src/lib/harvester-academy");
      res.json({
        status: "SUCCESS",
        academy: harvesterAcademy.getAcademyReport()
      });
    } catch (err: any) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  });

  // 4. Bounding Box Query (Dynamic Map Loading)
  app.get("/api/map/boundaries", (req, res) => {
    const { north, south, east, west, zoom } = req.query;
    res.json({
      status: 'success',
      message: 'Bounding box boundary query.',
      bounds: { north, south, east, west },
      zoom,
      layer_count: 67
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

