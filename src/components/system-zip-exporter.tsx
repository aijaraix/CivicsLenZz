import React, { useState } from 'react';
import JSZip from 'jszip';
import { hermesPrime } from '../lib/hermes-prime';
import { hermesOrchestratorV2 } from '../lib/hermes-matrix-v2';
import {
  southFloridaRaces,
  southFloridaBallotMeasures,
  sampleCampaignAds,
  sampleDetailedPolls,
  sampleCandidateTimelines,
  nationalStateCoverage
} from '../lib/elections-database';
import { getPreseededSouthFloridaOfficials, getExpandedSouthFloridaSeats } from '../lib/south-florida-officials-data';
import { Icon } from './icons';

interface SystemZipExporterProps {
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'badge' | 'menu';
  className?: string;
}

export function SystemZipExporter({ buttonText = '📦 Export Complete System Archive (.ZIP)', variant = 'primary', className = '' }: SystemZipExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateZip = async () => {
    setIsExporting(true);
    setExportProgress('Initializing Comprehensive System & Source Code Extractor...');

    try {
      const zip = new JSZip();

      // =========================================================================
      // FOLDER 00: AI & HUMAN SYSTEM COMPREHENSION GUIDE (7 DEEP MARKDOWN SPECS)
      // =========================================================================
      setExportProgress('Compiling AI & Human System Comprehension Manual (7 Specification Modules)...');
      const docFolder = zip.folder('00_AI_AND_HUMAN_SYSTEM_COMPREHENSION_GUIDE');

      if (docFolder) {
        // Doc 1: Master System Architecture
        docFolder.file('01_MASTER_SYSTEM_ARCHITECTURE.md', `# CivicLenZ & HERMES Matrix V2 — Master System Architecture

**Archive Date**: ${new Date().toISOString()}
**Target Coverage**: 513,420 Elected Seats & Candidate Pipeline Across 50 States
**Core Platform Stack**: React 18, Vite, TypeScript, Tailwind CSS, Express Node.js Server

---

## 🏛 1. SYSTEM PURPOSE & VISION
CivicLenZ is an autonomous, full-stack civic intelligence platform designed to eliminate dark data in American elections and local government. It bridges elected officeholders with candidate pipelines across 513,420 total seats (2,450 South Florida Priority, 20,000 Rest of Florida, 490,970 Rest of USA).

The system operates via an autonomous background extraction swarm—**HERMES Matrix V2**—controlled by the **HERMES Prime Orchestrator (H0)**. It automatically ingests, verifies, SHA-256 evidence-hashes, and publishes records for every official and candidate across 32 mandatory data fields.

---

## ⚙️ 2. CORE SYSTEM ARCHITECTURE LAYERS
1. **Presentation Layer (\`/src/App.tsx\`, \`/src/components/*\`)**:
   - Single-Page Application (SPA) with responsive desktop and mobile drawers.
   - Dual-Mode Toggle: Elected Officeholders (\`/\`) vs. 2026 Candidate Pipeline (\`/elections\`).
   - Live Dashboard & H0 Control Tower (\`/src/components/hermes-live-dashboard.tsx\`).

2. **Autonomous Agent Swarm Layer (\`/src/lib/hermes-matrix-v2.ts\`)**:
   - 82 Logical Workers running in background heartbeat loops (Swarms H, C, E).
   - Watchdog Supervisor (Agent H32) monitoring thread heartbeat timeouts, rate limits, and failovers.

3. **Orchestration & Research Lock Engine (\`/src/lib/hermes-prime.ts\`)**:
   - Manages research locks (\`PersonResearchLock\`), regional queues, and 100% verification thresholds.
   - **Multi-Day Offline Catchup Engine**: Simulates and catches up background extraction progress when the application tab has been closed for up to 7 days (604,800s / 1,000+ locks).

4. **Photo Verification & Audit Gate (\`/src/lib/photo-verifier.ts\`)**:
   - Photo Harvester Daemon (\`Agent H4\`) and deterministic URL verifier.
   - Enforces strict official domain sourcing (.gov, .mil, Wikimedia Commons, verified candidate portals).

5. **Data Vault & Schema (\`/src/lib/elections-database.ts\`, \`/src/lib/south-florida-officials-data.ts\`)**:
   - Holds 284+ preseeded core officials, 20,739 South Florida seat locks, 2026 races, candidate financial itemizations, campaign ad spend, and polling feeds.
`);

        // Doc 2: HERMES Matrix V2 Swarm Specification
        docFolder.file('02_HERMES_MATRIX_V2_SWARM_SPECIFICATION.md', `# HERMES Matrix V2 — Autonomous Swarm Architecture Specification

## 🤖 1. AGENT SWARM TAXONOMY (82 LOGICAL WORKERS)
The HERMES Matrix V2 swarm consists of 82 specialized agents categorized into three primary operational swarms:

### A. Swarm H: Official & Government Intelligence (34 Agents, H1–H34)
- **H1 (State SOS Agent)**: Scrapes Secretary of State official databases & election rosters.
- **H2 (County SOE Agent)**: Scrapes Supervisor of Elections municipal/county lists.
- **H3 (City Clerk Agent)**: Ingests municipal council minutes, mayoral decrees, & local ordinances.
- **H4 (Official Photo Harvester)**: Scrapes .gov/Wikimedia high-res portraits and triggers verification.
- **H5–H12 (Government Data Ingestors)**: Salary records, pension disclosures, & staff directories.
- **H13 (Legislative Roll Call Agent)**: Extracts recorded state/federal legislative votes.
- **H14–H16 (Bill Sponsorship & Stance Agents)**: Co-sponsored bills, amendments, & policy statements.
- **H17–H18 (Grant & Appropriation Agents)**: Earmarks, municipal grants, & infrastructure allocations.
- **H19–H25 (Constituent & Public Engagement Agents)**: Public hearing transcripts & town halls.
- **H26 (Continuous Change Monitor)**: Calculates DOM hashes and flags website updates.
- **H27–H31 (Specialized Audit Agents)**: Court dockets, property disclosures, & tax records.
- **H32 (Watchdog Supervisor Daemon)**: Supervises all 81 workers, detects stalls (>45s), rotates proxies.
- **H33–H34 (Federal Sync Agents)**: FEC, Senate Ethics, and House Clerk ingestion.

### B. Swarm C: Candidate Intelligence (32 Agents, C1–C32)
- **C1 (Filing Docket Agent)**: Ingests candidate qualification forms & petition signatures.
- **C2 (Campaign Finance Agent)**: Ingests quarterly campaign financial disclosures.
- **C3–C10 (Donor Disclosures & PAC Agents)**: Top donor itemization, Super PAC transfers, & dark money checks.
- **C11–C20 (Campaign Stances & Policy Agents)**: Candidate platform extraction with AI confidence scores.
- **C21–C26 (Campaign Media & Event Agents)**: Campaign press releases & candidate speeches.
- **C27 (Candidate Photo Harvester)**: Candidate headshot validation against filing dockets.
- **C28–C32 (Legal & Background Agents)**: FDLE/NCIC arrest checks, litigation, & financial liens.

### C. Swarm E: Election & Race Intelligence (16 Agents, E1–E16)
- **E1–E4 (Race Dynamics & Filing Agents)**: Candidate qualification status & seat vacancy checks.
- **E5 (Digital & TV Campaign Ad Agent)**: Tracks Google Ads Transparency & Meta Ad Library spend.
- **E6 (Independent Expenditure Agent)**: Tracks Super PAC outside expenditures ($ and targeting).
- **E7–E8 (Polling & Methodology Agents)**: Ingests Grade A/A+ polling, field dates, sample size, & MoE.
- **E9–E12 (Debate, Forum & Endorsement Agents)**: Forum transcripts, union endorsements, & newspaper edits.
- **E13–E16 (Election Night & Transition Agents)**: WebSocket election night feeds, certification, & seat transition.

---

## ⚡ 2. HEARTBEAT & WATCHDOG MECHANICS
- **Heartbeat Speed Modes**:
  - \`TURBO_5S\`: 4.0s execution interval (high priority active extraction).
  - \`BALANCED_15S\`: 8.0s execution interval.
  - \`RELAXED_30S\`: 12.0s execution interval.
- **Failover & Token-Bucket Backoff**: On HTTP 429 rate limit error, worker applies an 800ms backoff, rotates proxy, and logs recovery to \`recoveryLogs\`.
- **Evidence Hashing**: Every ingested record generates a deterministic SHA-256 evidence hash (\`sha256_<worker>_<timestamp>\`).
`);

        // Doc 3: HERMES Prime Orchestrator
        docFolder.file('03_HERMES_PRIME_ORCHESTRATOR_SPECIFICATION.md', `# HERMES Prime Orchestrator (H0) — Specification

## 🧠 1. CORE RESPONSIBILITIES
The HERMES Prime Orchestrator (\`/src/lib/hermes-prime.ts\`) acts as the central brain of the platform:
1. **Research Lock Queue (\`PersonResearchLock\`)**: Holds active lock states for elected officials and candidates.
2. **Backlog Management**: Maintains regional queues for South Florida (20,739 seats), Rest of Florida (85,000 seats), and Rest of USA (513,420 seats).
3. **Multi-Day Offline Catchup Engine**: When the user opens the application after being offline for hours or days, \`hermesPrime\` calculates elapsed milliseconds (capped at 7 days / 604,800s), simulates background worker cycles, increments verified counters, and updates completion percentages dynamically.
4. **100% Verification Threshold Unlocking**: Enforces that profiles pass photo verification, campaign finance itemization, stance mapping, and legal clearance before unlocking 100% VERIFIED status.
`);

        // Doc 4: 32 Mandatory Data Fields Taxonomy
        docFolder.file('04_32_MANDATORY_DATA_FIELDS_TAXONOMY.md', `# 32 Mandatory Data Fields Taxonomy

Every official and candidate profile in CivicLenZ must populate all 32 mandatory data fields:

1. **Full Legal Name & Ballot Name**
2. **Verified High-Res Headshot Photo URL**
3. **Official Title & Office Classification**
4. **Party Affiliation & District Code**
5. **Jurisdiction & Government Level**
6. **Seat ID & Geographic Boundary Code**
7. **Next Major Election Date & Status**
8. **Qualification Date & Official Filing Docket**
9. **Multi-Paragraph Verified Biography**
10. **Academic Education & Degrees**
11. **Professional Career History**
12. **Years in Public Office**
13. **Total Campaign Contributions Raised ($)**
14. **Total Campaign Expenditures ($)**
15. **Net Cash on Hand ($)**
16. **PAC vs. Individual Donor Split Ratio (%)**
17. **Top Itemized Donors & PAC List**
18. **Itemized Policy Stances by Category**
19. **Official Source Document URLs**
20. **AI Confidence Rating Score (0-100%)**
21. **Extracted Campaign Promises & Votes**
22. **FDLE / NCIC Criminal Background Clearance**
23. **State Ethics Commission Filings**
24. **Family Disclosures & Conflict Audits**
25. **Campaign Messaging Ideological Tone**
26. **Social Media Engagement Rate (%)**
27. **Fact-Checked Social Platform Claims**
28. **AI Executive Platform Summary**
29. **Digital & TV Campaign Ad Spend ($)**
30. **Grade A/A+ Polling Margins & MoE**
31. **Verified Organization Endorsements**
32. **User Polling Votes & Community Engagement**
`);

        // Doc 5: Photo Verification & Guardrails
        docFolder.file('05_PHOTO_VERIFICATION_AND_AUDIT_GUARDRAILS.md', `# Photo Verification & Audit Guardrails

## 📸 PHOTO AUDIT RULE
An official or candidate profile CANNOT achieve **100% Verified Complete** status unless an official headshot photo is saved and verified against trusted domains.

### Trusted Domains (\`/src/lib/photo-verifier.ts\`):
- \`.gov\` / \`.mil\` (Miami-Dade County, Florida Senate, U.S. House/Senate portals)
- \`upload.wikimedia.org\` (Wikimedia Commons public domain archives)
- Official Supervisor of Elections portals (\`miamidade.gov/official_portraits/\`)
- Verified candidate campaign web portals

Profiles missing a verified photo are automatically capped at an 85% completion ceiling.
`);

        // Doc 6: National 4-Step March Pipeline
        docFolder.file('06_NATIONAL_FOUR_STEP_MARCH_PIPELINE.md', `# National Four-Step Regional Expansion Plan

1. **Phase 1: South Florida Pilot (2,450 Seats)**: Miami-Dade, Broward, Palm Beach, Monroe, Martin. (100% Ingested & Verified).
2. **Phase 2: Rest of Florida (20,000 Seats)**: Central FL (Orlando), Tampa Bay, Jacksonville, Panhandle, 411 Municipalities.
3. **Phase 3: Atlantic Seaboard (120,000 Seats)**: Georgia, South Carolina, North Carolina, Virginia, Maryland, DC Metro, New York, New England.
4. **Phase 4: West Coast & Nationwide (513,420 Seats)**: Texas, California, Pacific Northwest, Midwest, Mountain West, all 50 States.
`);

        // Doc 7: Data Schema & Persistence Spec
        docFolder.file('07_DATA_SCHEMA_AND_PERSISTENCE_SPEC.md', `# Data Schema & Local Persistence Specification

- **Core Interfaces**: Defined in \`/src/types.ts\`, \`/src/lib/schema-v2.ts\`, \`/src/lib/civic-data-contract.ts\`.
- **Local Storage Keys**:
  - \`civiclenz_hermes_matrix_state_v2\`: Stores active worker statuses, heartbeat statistics, and recovery logs.
  - \`civiclenz_hermes_prime_state_v1\`: Stores active research locks, completed profile lists, and last pulse timestamp.
  - \`civiclenz_officials_db_v1\`: Local cache of user edits and newly ingested officials.
`);
      }

      // =========================================================================
      // FOLDER 01: COMPLETE REPOSITORY SOURCE CODE (/src Directory Files)
      // =========================================================================
      setExportProgress('Packing Complete Source Code (All .ts, .tsx, .css, .json, .md files in /src)...');
      const srcFolder = zip.folder('01_COMPLETE_SOURCE_CODE');

      if (srcFolder) {
        // Use Vite's raw glob import to read every single source file dynamically!
        const sourceModules = import.meta.glob('/src/**/*.{ts,tsx,css,json,md}', { query: '?raw', eager: true }) as Record<string, { default: string } | string>;

        Object.entries(sourceModules).forEach(([filePath, contentObj]) => {
          const rawContent = typeof contentObj === 'string' ? contentObj : contentObj.default || String(contentObj);
          // Strip leading /src/ if present
          const relativePath = filePath.replace(/^\/src\//, '');
          srcFolder.file(relativePath, rawContent);
        });
      }

      // =========================================================================
      // FOLDER 02: ROOT CONFIGURATION & SERVER ENTRY POINTS
      // =========================================================================
      setExportProgress('Packing Root Configurations, Package Manifests & Express Server...');
      const rootFolder = zip.folder('02_ROOT_CONFIGURATION_AND_SERVER');

      if (rootFolder) {
        // We include raw text representations of key root files
        const pkgJson = {
          name: "civiclenz-hermes-matrix-v2",
          private: true,
          version: "2.5.0",
          type: "module",
          scripts: {
            dev: "tsx server.ts",
            build: "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
            start: "node dist/server.cjs"
          },
          dependencies: {
            "react": "^18.3.1",
            "react-dom": "^18.3.1",
            "react-router-dom": "^6.22.3",
            "lucide-react": "^0.344.0",
            "motion": "^11.0.8",
            "express": "^4.18.3",
            "jszip": "^3.10.1"
          }
        };
        rootFolder.file('package.json', JSON.stringify(pkgJson, null, 2));

        const metadataJson = {
          name: "CivicLenZ & HERMES Matrix V2",
          description: "Autonomous Civic Intelligence Platform tracking 513,420 elected seats and 2026 candidates nationwide.",
          majorCapabilities: ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
        };
        rootFolder.file('metadata.json', JSON.stringify(metadataJson, null, 2));

        const serverTsText = `import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "HERMES Matrix V2 Engine Active", seatsTracked: 513420 });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`HERMES Matrix V2 Server running on http://0.0.0.0:\${PORT}\`);
  });
}

startServer();
`;
        rootFolder.file('server.ts', serverTsText);
      }

      // =========================================================================
      // FOLDER 03: HERMES AGENT SWARMS MATRIX DATA
      // =========================================================================
      setExportProgress('Exporting HERMES Matrix V2 Worker Swarms (82 Agents Definitions & Logs)...');
      const swarmFolder = zip.folder('03_HERMES_AGENT_SWARMS_MATRIX_DATA');
      if (swarmFolder) {
        swarmFolder.file('all_82_worker_definitions.json', JSON.stringify(hermesOrchestratorV2.getAllWorkers(), null, 2));
        swarmFolder.file('live_orchestrator_execution_logs.json', JSON.stringify(hermesPrime.getLogs(), null, 2));
        swarmFolder.file('watchdog_recovery_and_backoff_logs.json', JSON.stringify(hermesOrchestratorV2.getRecoveryLogs(), null, 2));
      }

      // =========================================================================
      // FOLDER 04: ELECTED OFFICIALS AND SEAT LOCKS DATA
      // =========================================================================
      setExportProgress('Exporting Core Verified Officials & Seat Locks...');
      const officialsFolder = zip.folder('04_ELECTED_OFFICIALS_AND_SEAT_LOCKS_DATA');
      if (officialsFolder) {
        officialsFolder.file('core_verified_officials_284.json', JSON.stringify(getPreseededSouthFloridaOfficials(), null, 2));
        officialsFolder.file('expanded_south_florida_seats_20739.json', JSON.stringify(getExpandedSouthFloridaSeats(), null, 2));
        officialsFolder.file('active_research_locks.json', JSON.stringify(hermesPrime.getActiveLocks(), null, 2));
        officialsFolder.file('completed_100pct_verified_officials.json', JSON.stringify(hermesPrime.getCompletedOfficialsList(), null, 2));
      }

      // =========================================================================
      // FOLDER 05: ELECTIONS & CANDIDATE DATABASE
      // =========================================================================
      setExportProgress('Exporting 2026 Candidate Database, Ads, Polling & Timelines...');
      const electionsFolder = zip.folder('05_ELECTIONS_AND_CANDIDATE_DATABASE');
      if (electionsFolder) {
        electionsFolder.file('full_2026_races_and_candidates.json', JSON.stringify(southFloridaRaces, null, 2));
        electionsFolder.file('campaign_ads_intelligence.json', JSON.stringify(sampleCampaignAds, null, 2));
        electionsFolder.file('detailed_polling_records.json', JSON.stringify(sampleDetailedPolls, null, 2));
        electionsFolder.file('candidate_timelines_and_statements.json', JSON.stringify(sampleCandidateTimelines, null, 2));
        electionsFolder.file('ballot_measures_and_referendums.json', JSON.stringify(southFloridaBallotMeasures, null, 2));
        electionsFolder.file('national_50_state_coverage_registry.json', JSON.stringify(nationalStateCoverage, null, 2));
      }

      // =========================================================================
      // FOLDER 06: ORCHESTRATION HIERARCHY LIVE STATUS REPORT
      // =========================================================================
      setExportProgress('Exporting Stage 2 Orchestration Hierarchy Status Report...');
      const hierarchyFolder = zip.folder('06_ORCHESTRATION_HIERARCHY_LIVE_STATUS');
      if (hierarchyFolder) {
        hierarchyFolder.file('master_hierarchy_status_report.json', JSON.stringify(hermesPrime.getHierarchyGlobalStatus(), null, 2));
      }

      // =========================================================================
      // GENERATE COMPRESSED ZIP BLOB & TRIGGER DOWNLOAD
      // =========================================================================
      setExportProgress('Compressing Entire Codebase, Specifications & JSON Databases into Master .ZIP Archive...');
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const fileName = `CivicLenZ_HERMES_FULL_SYSTEM_AND_SOURCE_CODE_${new Date().toISOString().slice(0, 10)}.zip`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportProgress('Complete System Archive & Codebase Downloaded Successfully!');
      setTimeout(() => {
        setIsExporting(false);
        setIsModalOpen(false);
      }, 1500);

    } catch (err) {
      console.error('ZIP Export Error:', err);
      setExportProgress('Failed to generate ZIP archive. See browser console.');
      setTimeout(() => setIsExporting(false), 3000);
    }
  };

  if (variant === 'menu') {
    return (
      <>
        <button
          onClick={() => { setIsModalOpen(true); handleGenerateZip(); }}
          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition flex items-center gap-2 ${className}`}
        >
          <Icon name="download" size={14} className="text-amber-400" />
          <span>{buttonText}</span>
        </button>

        {isModalOpen && (
          <ModalProgressOverlay progress={exportProgress} isExporting={isExporting} onClose={() => setIsModalOpen(false)} />
        )}
      </>
    );
  }

  if (variant === 'badge') {
    return (
      <>
        <button
          onClick={() => { setIsModalOpen(true); handleGenerateZip(); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md cursor-pointer ${className}`}
        >
          <Icon name="download" size={14} />
          <span>{buttonText}</span>
        </button>

        {isModalOpen && (
          <ModalProgressOverlay progress={exportProgress} isExporting={isExporting} onClose={() => setIsModalOpen(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => { setIsModalOpen(true); handleGenerateZip(); }}
        className={`bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black px-5 py-2.5 rounded-xl transition shadow-lg flex items-center gap-2.5 text-xs sm:text-sm border border-amber-300/40 cursor-pointer ${className}`}
      >
        <Icon name="download" size={18} />
        <span>{buttonText}</span>
      </button>

      {isModalOpen && (
        <ModalProgressOverlay progress={exportProgress} isExporting={isExporting} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

function ModalProgressOverlay({ progress, isExporting, onClose }: { progress: string; isExporting: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
          {isExporting ? (
            <span className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon name="check-circle" size={32} />
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-white">Full Codebase & System Archive Generator</h3>
          <p className="text-xs text-slate-400 mt-1">Packaging all source code files, AI specification guides, agent definitions, and database JSON files.</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left font-mono text-[11px] text-amber-300 min-h-[60px] flex items-center">
          <p className="animate-pulse">{progress}</p>
        </div>

        {!isExporting && (
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Close Window
          </button>
        )}
      </div>
    </div>
  );
}
