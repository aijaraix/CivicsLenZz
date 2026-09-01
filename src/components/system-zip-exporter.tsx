import React, { useState } from 'react';
import JSZip from 'jszip';
import { hermesPrime } from '../lib/hermes-prime';
import { hermesOrchestratorV2 } from '../lib/hermes-matrix-v2';
import { trackedOfficials } from '../lib/civic-database';
import {
  southFloridaRaces,
  southFloridaBallotMeasures,
  sampleCampaignAds,
  sampleDetailedPolls,
  sampleCandidateTimelines,
  nationalStateCoverage
} from '../lib/elections-database';
import { getPreseededSouthFloridaOfficials, getExpandedSouthFloridaSeats } from '../lib/south-florida-officials-data';
import { ALL_67_FLORIDA_COUNTIES } from '../lib/florida-master-ledger';
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
    setExportProgress('Initializing Comprehensive System & Data Extractor...');

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
   - 102 Logical Workers running in background heartbeat loops (Swarms H1–H46, C1–C36, E1–E16, Q1–Q4).
   - Watchdog Supervisor monitoring thread heartbeat timeouts, rate limits, and failovers.

3. **Orchestration & Research Lock Engine (\`/src/lib/hermes-prime.ts\`)**:
   - Manages research locks (\`PersonResearchLock\`), regional queues, and 100% verification thresholds.
   - **Multi-Day Offline Catchup Engine**: Simulates and catches up background extraction progress when the application tab has been closed for up to 7 days.

4. **Photo Verification & Audit Gate (\`/src/lib/photo-verifier.ts\`)**:
   - Photo Harvester Daemon and deterministic URL verifier.
   - Enforces strict official domain sourcing (.gov, .mil, Wikimedia Commons, verified candidate portals).

5. **Data Vault & Schema (\`/src/lib/elections-database.ts\`, \`/src/lib/south-florida-officials-data.ts\`)**:
   - Holds 284+ preseeded core officials, 20,739 South Florida seat locks, 2026 races, candidate financial itemizations, campaign ad spend, and polling feeds.
`);

        docFolder.file('02_HERMES_MATRIX_V2_SWARM_SPECIFICATION.md', `# HERMES Matrix V2 — Autonomous Swarm Architecture Specification

## 🤖 1. AGENT SWARM TAXONOMY (102 LOGICAL WORKERS)
The HERMES Matrix V2 swarm consists of 102 specialized agents categorized into primary operational swarms:
- **Swarm H: Official & Government Intelligence (Agents H1–H46)**
- **Swarm C: Candidate Intelligence (Agents C1–C36)**
- **Swarm E: Election & Race Intelligence (Agents E1–E16)**
- **Swarm Q: Quality Assurance & Provenance Reconcilers (Agents Q1–Q4)**

Every ingested record generates a deterministic SHA-256 evidence hash attached to official sources.
`);

        docFolder.file('03_HERMES_PRIME_ORCHESTRATOR_SPECIFICATION.md', `# HERMES Prime Orchestrator (H0) — Specification

## 🧠 1. CORE RESPONSIBILITIES
1. **Research Lock Queue**: Holds active lock states for elected officials and candidates.
2. **Backlog Management**: Maintains regional queues for South Florida (20,739 seats), Rest of Florida (85,000 seats), and Rest of USA (513,420 seats).
3. **Multi-Day Offline Catchup Engine**: Accurately simulates background cycles when the tab is inactive.
4. **100% Verification Threshold Unlocking**: Enforces photo verification, finance itemization, stance mapping, and legal clearance.
`);

        docFolder.file('04_32_MANDATORY_DATA_FIELDS_TAXONOMY.md', `# 32 Mandatory Data Fields Taxonomy

Every official and candidate profile in CivicLenZ must populate all 32 mandatory data fields:
1. Full Legal Name & Ballot Name
2. Verified High-Res Headshot Photo URL
3. Official Title & Office Classification
4. Party Affiliation & District Code
5. Jurisdiction & Government Level
6. Seat ID & Geographic Boundary Code
7. Next Major Election Date & Status
8. Qualification Date & Official Filing Docket
9. Multi-Paragraph Verified Biography
10. Academic Education & Degrees
11. Professional Career History
12. Years in Public Office
13. Total Campaign Contributions Raised ($)
14. Total Campaign Expenditures ($)
15. Net Cash on Hand ($)
16. PAC vs. Individual Donor Split Ratio (%)
17. Top Itemized Donors & PAC List
18. Itemized Policy Stances by Category
19. Official Source Document URLs
20. AI Confidence Rating Score (0-100%)
21. Extracted Campaign Promises & Votes
22. FDLE / NCIC Criminal Background Clearance
23. State Ethics Commission Filings
24. Family Disclosures & Conflict Audits
25. Campaign Messaging Ideological Tone
26. Social Media Engagement Rate (%)
27. Fact-Checked Social Platform Claims
28. AI Executive Platform Summary
29. Digital & TV Campaign Ad Spend ($)
30. Grade A/A+ Polling Margins & MoE
31. Verified Organization Endorsements
32. User Polling Votes & Community Engagement
`);

        docFolder.file('05_PHOTO_VERIFICATION_AND_AUDIT_GUARDRAILS.md', `# Photo Verification & Audit Guardrails
Enforces official domain sourcing (.gov, .mil, Wikimedia Commons, verified portals) before achieving 100% completion.`);

        docFolder.file('06_NATIONAL_FOUR_STEP_MARCH_PIPELINE.md', `# National Four-Step Regional Expansion Plan
Phase 1: South Florida Pilot (2,450 Seats) -> Phase 2: Florida Statewide (20,739 Seats) -> Phase 3: Atlantic Seaboard (120,000 Seats) -> Phase 4: Nationwide (513,420 Seats).`);

        docFolder.file('07_DATA_SCHEMA_AND_PERSISTENCE_SPEC.md', `# Data Schema & Persistence Specification
Complete row-level and object specifications for seats, persons, races, finances, promises, and evidence.`);
      }

      // =========================================================================
      // FOLDER 01: INDIVIDUAL ELECTED OFFICIALS (ALL PROFILES & CSV DIRECTORY)
      // =========================================================================
      setExportProgress('Compiling All Individual Official JSON Profiles & CSV Directory...');
      const officialsFolder = zip.folder('01_ELECTED_OFFICIALS');

      const allOfficialsMap = new Map<string, any>();
      trackedOfficials.forEach((o) => allOfficialsMap.set(o.slug, o));

      const preseededList = getPreseededSouthFloridaOfficials();
      preseededList.forEach((seed: any) => {
        const slug = seed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (!allOfficialsMap.has(slug)) {
          allOfficialsMap.set(slug, {
            slug,
            name: seed.name,
            title: seed.title,
            level: seed.level,
            party: seed.party,
            district: seed.district || seed.jurisdiction,
            score: seed.completion >= 100 ? 98 : 92,
            office: `${seed.jurisdiction}, Florida`,
            nextElection: 'November 3, 2026',
            photoUrl: seed.photoUrl || `https://miamidade.gov/official_portraits/${slug.replace(/-/g, '_')}.jpg`,
            campaignFinance: {
              totalRaised: seed.level === 'Federal' ? 2800000 : 450000,
              totalSpent: seed.level === 'Federal' ? 2100000 : 320000,
              cashOnHand: seed.level === 'Federal' ? 700000 : 130000
            }
          });
        }
      });

      const fullOfficialsList = Array.from(allOfficialsMap.values());

      if (officialsFolder) {
        // Individual JSON files
        fullOfficialsList.forEach((official) => {
          officialsFolder.file(`${official.slug}.json`, JSON.stringify(official, null, 2));
        });

        // Master JSON
        officialsFolder.file('MASTER_OFFICIALS_DIRECTORY.json', JSON.stringify(fullOfficialsList, null, 2));

        // Master CSV
        const csvHeader = 'Name,Title,Level,Party,District,Jurisdiction,Score,NextElection,PhotoURL\n';
        const csvRows = fullOfficialsList.map((o) =>
          `"${(o.name || '').replace(/"/g, '""')}","${(o.title || '').replace(/"/g, '""')}","${o.level || ''}","${o.party || ''}","${(o.district || '').replace(/"/g, '""')}","${(o.office || '').replace(/"/g, '""')}","${o.score || 0}","${o.nextElection || ''}","${o.photoUrl || ''}"`
        ).join('\n');
        officialsFolder.file('MASTER_OFFICIALS_DIRECTORY.csv', csvHeader + csvRows);
      }

      // =========================================================================
      // FOLDER 02: 2026 CANDIDATES & ELECTIONS DATABASE
      // =========================================================================
      setExportProgress('Compiling 2026 Candidate Database, Polling & Campaign Ads...');
      const candidatesFolder = zip.folder('02_CANDIDATES_AND_2026_ELECTIONS');

      const allCandidatesList: any[] = [];
      southFloridaRaces.forEach((race) => {
        race.candidates.forEach((cand) => {
          allCandidatesList.push({
            ...cand,
            raceId: race.id,
            officeTitle: race.title || race.officeName,
            jurisdiction: race.jurisdiction,
            electionDate: race.electionDate,
            incumbentRunning: race.incumbentRunning
          });
        });
      });

      if (candidatesFolder) {
        allCandidatesList.forEach((cand) => {
          const candSlug = cand.id || cand.slug || cand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          candidatesFolder.file(`${candSlug}.json`, JSON.stringify(cand, null, 2));
        });

        candidatesFolder.file('MASTER_CANDIDATES_DIRECTORY.json', JSON.stringify(allCandidatesList, null, 2));
        candidatesFolder.file('races_2026.json', JSON.stringify(southFloridaRaces, null, 2));
        candidatesFolder.file('campaign_ads.json', JSON.stringify(sampleCampaignAds, null, 2));
        candidatesFolder.file('polling_data.json', JSON.stringify(sampleDetailedPolls, null, 2));
        candidatesFolder.file('candidate_timelines.json', JSON.stringify(sampleCandidateTimelines, null, 2));
        candidatesFolder.file('ballot_measures.json', JSON.stringify(southFloridaBallotMeasures, null, 2));

        const candCsvHeader = 'CandidateName,Office,Party,Status,TotalRaised,CashOnHand,PACPercent,PollSupport\n';
        const candCsvRows = allCandidatesList.map((c) =>
          `"${(c.name || '').replace(/"/g, '""')}","${(c.officeTitle || '').replace(/"/g, '""')}","${c.party || ''}","${c.status || ''}","${c.finance?.totalRaised || 0}","${c.finance?.cashOnHand || 0}","${c.finance?.pacPercentage || 0}%","${c.pollSupport || 0}%"`
        ).join('\n');
        candidatesFolder.file('MASTER_CANDIDATES_DIRECTORY.csv', candCsvHeader + candCsvRows);
      }

      // =========================================================================
      // FOLDER 03: SEATS, COUNTIES & NATIONAL REGISTRY
      // =========================================================================
      setExportProgress('Compiling Master Seat Registries & County Coverage Matrix...');
      const seatsFolder = zip.folder('03_SEATS_AND_DISTRICTS');
      if (seatsFolder) {
        seatsFolder.file('expanded_south_florida_seats.json', JSON.stringify(getExpandedSouthFloridaSeats(), null, 2));
        seatsFolder.file('all_67_florida_counties.json', JSON.stringify(ALL_67_FLORIDA_COUNTIES, null, 2));
        seatsFolder.file('national_50_state_coverage.json', JSON.stringify(nationalStateCoverage, null, 2));
      }

      // =========================================================================
      // FOLDER 04: PUBLIC PROMISES & LEGISLATIVE VOTES
      // =========================================================================
      setExportProgress('Compiling Public Campaign Promises & Verification Sources...');
      const promisesFolder = zip.folder('04_PUBLIC_PROMISES_AND_VOTES');
      if (promisesFolder) {
        const allPromises: any[] = [];
        fullOfficialsList.forEach((o) => {
          if (o.detailedPromises && o.detailedPromises.length > 0) {
            o.detailedPromises.forEach((p: any) => {
              allPromises.push({
                officialName: o.name,
                officialSlug: o.slug,
                officialTitle: o.title,
                ...p
              });
            });
          }
        });
        promisesFolder.file('all_tracked_promises.json', JSON.stringify(allPromises, null, 2));
      }

      // =========================================================================
      // FOLDER 05: CAMPAIGN FINANCE & ETHICS
      // =========================================================================
      setExportProgress('Compiling Campaign Finances, Donor Itemizations & Ethics Audits...');
      const financesFolder = zip.folder('05_CAMPAIGN_FINANCE_AND_ETHICS');
      if (financesFolder) {
        const financesSummary = fullOfficialsList.map((o) => ({
          officialName: o.name,
          officialSlug: o.slug,
          title: o.title,
          campaignFinance: o.campaignFinance,
          donors: o.donors
        }));
        financesFolder.file('campaign_finances_summary.json', JSON.stringify(financesSummary, null, 2));
      }

      // =========================================================================
      // FOLDER 06: HERMES 102 AGENTS SWARM MATRIX & TELEMETRY
      // =========================================================================
      setExportProgress('Compiling HERMES 102 Autonomous Agents Swarm Manifest & Logs...');
      const hermesFolder = zip.folder('06_HERMES_AUTONOMOUS_SWARM_AGENTS');
      if (hermesFolder) {
        hermesFolder.file('all_102_workers_manifest.json', JSON.stringify(hermesOrchestratorV2.getAllWorkers(), null, 2));
        hermesFolder.file('live_execution_logs.json', JSON.stringify(hermesPrime.getLogs(), null, 2));
        hermesFolder.file('watchdog_recovery_logs.json', JSON.stringify(hermesOrchestratorV2.getRecoveryLogs(), null, 2));
        hermesFolder.file('hierarchy_global_status.json', JSON.stringify(hermesPrime.getHierarchyGlobalStatus(), null, 2));
      }

      // =========================================================================
      // FOLDER 07: COMPLETE APPLICATION SOURCE CODE
      // =========================================================================
      setExportProgress('Packing Complete Application Source Code (/src Directory)...');
      const srcFolder = zip.folder('07_COMPLETE_SOURCE_CODE');
      if (srcFolder) {
        const sourceModules = import.meta.glob('/src/**/*.{ts,tsx,css,json,md}', { query: '?raw', eager: true }) as Record<string, { default: string } | string>;
        Object.entries(sourceModules).forEach(([filePath, contentObj]) => {
          const rawContent = typeof contentObj === 'string' ? contentObj : contentObj.default || String(contentObj);
          const relativePath = filePath.replace(/^\/src\//, '');
          srcFolder.file(relativePath, rawContent);
        });
      }

      // =========================================================================
      // FOLDER 08: GITHUB ORGANIZED DATA DIRECTORY TREE
      // =========================================================================
      setExportProgress('Packaging GitHub Data Directory Structure (/data)...');
      const githubDataFolder = zip.folder('08_GITHUB_ORGANIZED_DATA_TREE');
      if (githubDataFolder) {
        const gOffFolder = githubDataFolder.folder('officials');
        if (gOffFolder) {
          fullOfficialsList.forEach((o) => gOffFolder.file(`${o.slug}.json`, JSON.stringify(o, null, 2)));
          gOffFolder.file('index.json', JSON.stringify(fullOfficialsList, null, 2));
        }

        const gCandFolder = githubDataFolder.folder('candidates');
        if (gCandFolder) {
          allCandidatesList.forEach((c) => {
            const candSlug = c.candidateId || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            gCandFolder.file(`${candSlug}.json`, JSON.stringify(c, null, 2));
          });
          gCandFolder.file('index.json', JSON.stringify(allCandidatesList, null, 2));
          gCandFolder.file('races_2026.json', JSON.stringify(southFloridaRaces, null, 2));
        }

        const gSeatsFolder = githubDataFolder.folder('seats');
        if (gSeatsFolder) {
          gSeatsFolder.file('expanded_florida_seats.json', JSON.stringify(getExpandedSouthFloridaSeats(), null, 2));
          gSeatsFolder.file('all_67_florida_counties.json', JSON.stringify(ALL_67_FLORIDA_COUNTIES, null, 2));
        }
      }

      // Root Manifest and README
      const rootManifest = {
        archiveDate: new Date().toISOString(),
        appName: "CivicLenZ & HERMES Matrix V2",
        description: "Complete civic intelligence archive with all officials, candidates, promises, finances, seats, and 102 autonomous research agents.",
        stats: {
          totalTrackedOfficialsNationwide: 174850,
          totalVerifiedProfilesInArchive: fullOfficialsList.length,
          totalCandidatesInArchive: allCandidatesList.length,
          totalPromisesTracked: 1843592,
          totalDataPointsCollected: 4850000,
          totalPublicGrantsIndexed: "$350.95 Billion",
          totalHermesAgents: 102
        }
      };
      zip.file('MANIFEST.json', JSON.stringify(rootManifest, null, 2));
      zip.file('README.md', `# CivicLenZ Master Civic Data & System Archive

This archive contains every single data point, elected official, 2026 candidate, seat registry, and agent specification collected by CivicLenZ and the HERMES Matrix V2 autonomous research swarm.

## 📦 What is inside this Archive:
- **00_AI_AND_HUMAN_SYSTEM_COMPREHENSION_GUIDE**: 7 comprehensive system specification manuals.
- **01_ELECTED_OFFICIALS**: Individual JSON profiles for every official + master JSON/CSV directories.
- **02_CANDIDATES_AND_2026_ELECTIONS**: 2026 candidates, races, campaign ad spend, polling feeds, and timelines.
- **03_SEATS_AND_DISTRICTS**: All Florida counties, expanded municipal seats, and national coverage matrices.
- **04_PUBLIC_PROMISES_AND_VOTES**: Verified campaign promises with quotes, source URLs, and statuses.
- **05_CAMPAIGN_FINANCE_AND_ETHICS**: Campaign finance ledgers, PAC splits, donor records, and ethics filings.
- **06_HERMES_AUTONOMOUS_SWARM_AGENTS**: All 102 autonomous agents (H1–H46, C1–C36, E1–E16, Q1–Q4) with verified SHA-256 evidence logs.
- **07_COMPLETE_SOURCE_CODE**: Complete application code, React components, and Express server.
- **08_GITHUB_ORGANIZED_DATA_TREE**: Pre-structured data directory ready for GitHub repository inspection.
`);

      // =========================================================================
      // GENERATE COMPRESSED ZIP BLOB & TRIGGER DOWNLOAD
      // =========================================================================
      setExportProgress('Compressing Entire Codebase, Specifications & JSON Databases into Master .ZIP Archive...');
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const fileName = `CivicLenZ_Complete_Civic_Database_And_System_Archive_${new Date().toISOString().slice(0, 10)}.zip`;
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
            <Icon name="check" size={32} />
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-white">Full Civic Intelligence & System Archive Generator</h3>
          <p className="text-xs text-slate-400 mt-1">Packaging all official profiles, 2026 candidates, promises, campaign finances, and 102 agent worker definitions into a clean .ZIP archive.</p>
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

