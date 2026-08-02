/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpecSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
}

export const civicLenzSpecs: SpecSection[] = [
  {
    id: "spec-product",
    title: "1. Product Specification",
    subtitle: "Architecture, Vision, Stack & Compliance",
    content: `### CivicLenZ (CivicLenZ.ai)
**Vision Statement**: CivicLenZ is the public accountability and intelligence layer for global democracy. It is a nonpartisan, politically neutral, fact-driven, source-first platform that organizes, monitors, and explains the actions of public officials, government spending, voting records, and public promises.

---

### Technical Architecture Overview
CivicLenZ is constructed as a modern Full-Stack Web App, scaling from an MVP to an enterprise national intelligence network.
\`\`\`
+--------------------------------------------------------------+
|                         REACTION SPA                         |
|      (Tailwind CSS, Recharts Visualization, Motion UX)       |
+--------------------------------------------------------------+
                               |
                               | (HTTPS / REST & SSE)
                               v
+--------------------------------------------------------------+
|                    REST API ROUTER (NodeJS)                  |
|          - Route Guards     - Auth Middleware                |
+--------------------------------------------------------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
+-----------------------+              +-----------------------+
|  GEMINI COGNITIVE APP |              | DATA INTEGRITY ENGINE |
| (gemini-3.5-flash text |              | - Postgres Database   |
|   processing, promise |              | - Redis Cache Layer   |
|   mining, explainers) |              | - Object Document Store|
+-----------------------+              +-----------------------+
            |                                     |
            v                                     v
+--------------------------------------------------------------+
|             FEDERATED AUTOMATION SCRAPER FLEET               |
|  - federal (Congress.gov) - state (FL Legislature)           |
|  - county/local (Miami-Dade / Orange COE)                     |
+--------------------------------------------------------------+
\`\`\`

---

### Core Tech Stack
1. **Frontend**: React (v19) configured on Vite with Tailwind CSS. It features a desktop-first, highly responsive multi-density layout adopting the **"Slate-Grey Neutral"** typography and design hierarchy.
2. **Backend**: Node.js Express server acting as the secure gateway Proxy.
3. **Database**: PostgreSQL with PostGIS extensions to manage geographical jurisdiction polygons (federal districts down to school board and transit boundaries) + MongoDB / Document DB for unstructured statement transcripts and PDF attachments.
4. **Cache & Queues**: Redis for cache matching of heavy legislator profiles, and BullMQ for managing scraper jobs across the USA.
5. **AI Cognitive Core**: Google GenAI SDK powered by **Gemini 3.5 Flash** for rapid text parsing, metadata mapping, and promise extraction pipelines.

---

### Key Product Principles
- **Polished Trust**: Never use partisan colors (red/blue dominating). Represent Republican and Democratic designations neutrally. Emphasize source citations for all claims.
- **Fact-Based Verification**: Include a "Source Panel" for every single bill, vote, statement, and donation.
- **Institutional Scale**: Architected to ingest up to 500,000 officeholders across 10,000+ local jurisdictions.`
  },
  {
    id: "spec-sitemap",
    title: "2. Visual Sitemap",
    subtitle: "Complete Page Hierarchy & Navigation Paths",
    content: `### CivicLenZ Navigation Tree & Sitemap Path

1. **Root Public Domain / Gateway (/)**
   - **Main Landing (Home)**: Hero messaging, quick ZIP/Address locator, value proposition, pillars, security disclosures, and pricing tiers.
   - **About Platform (/about)**: Methodology, funding guidelines, conflict of interest reports, team, and contact channels.
   - **Trust & Neutrality (/trust)**: Fact-checking guides, citation guidelines, and manual data correction submission forms.
   - **Pricing (/pricing)**: Commercial configurations (Citizen Pro, Org Pro, Watchdog, API access).

2. **Search Workspace Portal (/search)**
   - **Search Home**: Advanced keyword query framework allowing filter tags matching:
     - Officials (Name, Level, Location, Affiliation)
     - Legislation (Chamber, Topic, Sponsor, Status)
     - Spending (Obligated Grants, Vendor contracts, Jurisdictions)
     - Citizen Actions (Tool selection)

3. **Official Profile System (/official/:id)**
   - **Comprehensive Profiler**:
     - *Overview Panel*: Bio, core statistics, district metadata, current status.
     - *Voting Records Drawer & Legislation*: Table of votes, sponsorship timeline, comparison charts.
     - *Promises Matrix*: Pledge status logs (Completed, Partially Fulfilled, Broken, Unclear).
     - *Statements & transcripts*: Indexed media files and verified social links.
     - *Ethics & Campaign Finance*: Contribution maps, asset folders, lobbyst disclosures.
     - *Action Center Overlay*: Document generation pipelines.

4. **Jurisdictional Analytics (/jurisdiction/:id)**
   - **Jurisdictional Profile**: Local map layout, listing all overlapping elected boards, fiscal state budgets, meeting schedules, active federal contracts.

5. **Legislation Tracker (/bill/:id)**
   - Simple explainers, vote tallies, companion bills, and citizen draft buttons.

6. **Citizen Action Hub (/action-center)**
   - Interface for script drafts, letter templates, and testimony formulation algorithms.

7. **SaaS User Dashboard (/dashboard)**
   - Custom follow watchlist, trigger settings, saved search alerts, API billing panel.

8. **Internal Administrative Console (/admin)**
   - Crawler pipelines management, AI extraction QA audits, dispute requests, system alerts.`
  },
  {
    id: "spec-schema",
    title: "3. Complete Database Schema",
    subtitle: "50+ Interlinked Tables with Confidence Meta-layers",
    content: `### Complete Relational & Document Schema Definition
All tables are initialized with high-level source mapping infrastructure to establish credibility. Key columns like \`source_id\`, \`confidence_score\`, \`verification_status\`, and \`last_verified_at\` are enforced on all entities interacting with AI-extracted content.

#### 1. Core Users & Subscriptions
- **\`users\`**:
  - \`id\` UUID PRIMARY KEY, \`email\` VARCHAR UNIQUE, \`password_hash\` VARCHAR, \`created_at\` TIMESTAMP, \`updated_at\` TIMESTAMP
- **\`user_profiles\`**:
  - \`id\` UUID PRIMARY KEY, \`user_id\` UUID REFERENCES \`users\`, \`first_name\`, \`last_name\`, \`zip_code\`, \`state\`, \`onboarding_completed\` BOOLEAN
- **\`subscriptions\`**:
  - \`id\` UUID, \`user_id\` REFERENCES \`users\`, \`tier\` VARCHAR (Free, Citizen Pro, Guard, Org), \`status\` (Active, Unpaid, Canceled), \`expires_at\` TIMESTAMP
- **\`watchlists\`**:
  - \`id\` UUID, \`user_id\` REFERENCES \`users\`, \`name\` VARCHAR
- **\`watchlist_items\`**:
  - \`id\` UUID, \`watchlist_id\` REFERENCES \`watchlists\`, \`target_type\` VARCHAR (Official, Bill, Jurisdiction, Promise), \`target_id\` UUID
- **\`alerts\`**:
  - \`id\` UUID, \`user_id\`, \`alert_type\` VARCHAR, \`trigger_payload\` JSON, \`is_read\` BOOLEAN, \`sent_at\` TIMESTAMP

#### 2. Jurisdictions & Entities
- **\`jurisdictions\`**:
  - \`id\` UUID PRIMARY KEY, \`name\` VARCHAR, \`level\` VARCHAR (Federal, State, County, Municipal, Special), \`parent_id\` UUID, \`boundary_gis\` GEOMETRY, \`population_served\` INTEGER, \`median_income\` DECIMAL
- **\`districts\`**:
  - \`id\` UUID, \`jurisdiction_id\` REFERENCES \`jurisdictions\`, \`number\` VARCHAR, \`geographic_boundary\` JSON
- **\`agencies\`**:
  - \`id\` UUID, \`name\` VARCHAR, \`jurisdiction_id\` REFERENCES \`jurisdictions\`, \`budget\` DECIMAL, \`chief_official_id\` UUID

#### 3. Officials & Officeholders
- **\`officials\`**:
  - \`id\` UUID PRIMARY KEY, \`legal_name\` VARCHAR, \`common_name\` VARCHAR, \`photo_url\` VARCHAR, \`current_title\` VARCHAR, \`party_affiliation\` VARCHAR, \`is_nonpartisan\` BOOLEAN, \`dob\` DATE, \`bio_text\` TEXT, \`contact_email\`, \`contact_phone\`, \`office_address\`
- **\`terms\`**:
  - \`id\` UUID, \`official_id\` REFERENCES \`officials\`, \`title\` VARCHAR, \`start_date\` DATE, \`end_date\` DATE, \`entry_method\` VARCHAR (Elected, Appointed), \`status\` VARCHAR (Active, Former, Suspended)
- **\`elections\`**:
  - \`id\` UUID, \`jurisdiction_id\` REFERENCES \`jurisdictions\`, \`election_date\` DATE, \`type\` VARCHAR (Primary, General, Runoff)
- **\`candidates\`**:
  - \`id\` UUID, \`official_id\` REFERENCES \`officials\`, \`election_id\` REFERENCES \`elections\`, \`filing_status\` VARCHAR, \`is_incumbent\` BOOLEAN
- **\`election_results\`**:
  - \`id\` UUID, \`candidate_id\` REFERENCES \`candidates\`, \`vote_total\` INTEGER, \`vote_percentage\` DECIMAL

#### 4. Legislative Operations
- **\`bills\`**:
  - \`id\` UUID PRIMARY KEY, \`bill_number\` VARCHAR, \`session\` VARCHAR, \`title\` TEXT, \`synopsis\` TEXT, \`full_text_link\` VARCHAR, \`chamber\` VARCHAR, \`status\` VARCHAR, \`fiscal_impact_simulated\` TEXT, \`source_id\` REFERENCES \`sources\`
- \`bill_sponsors\` / \`bill_versions\` / \`committees\` / \`committee_members\`
- **\`votes\`**:
  - \`id\` UUID PRIMARY KEY, \`bill_id\` REFERENCES \`bills\`, \`official_id\` REFERENCES \`officials\`, \`vote_position\` (Yes, No, Abstain, Absent), \`vote_date\` DATE, \`is_party_line\` BOOLEAN

#### 5. Public Statements, Promises & Verification
- **\`public_statements\`**:
  - \`id\` UUID PRIMARY KEY, \`official_id\` REFERENCES \`officials\`, \`quote_text\` TEXT, \`medium\` VARCHAR (Press Release, Social, Video, Transcript), \`source_url\` VARCHAR, \`published_at\` DATE, \`topic\` VARCHAR, \`is_promise\` BOOLEAN, \`sentiment_tone\` VARCHAR
- **\`promises\`**:
  - \`id\` UUID PRIMARY KEY, \`official_id\` REFERENCES \`officials\`, \`title\` VARCHAR, \`description\` TEXT, \`source_statement_id\` UUID REFERENCES \`public_statements\`, \`status\` VARCHAR (Not Started, In Progress, Completed, Broken, Partially Fulfilled, Unclear), \`confidence_score\` DECIMAL, \`verification_status\` VARCHAR, \`last_verified_at\` TIMESTAMP
- **\`promise_evidence\`**:
  - \`id\` UUID, \`promise_id\` REFERENCES \`promises\`, \`evidence_type\` (BillVote, BudgetAllocation, NewsArticle), \`details\` TEXT, \`source_url\` VARCHAR

#### 6. Campaign Finance, Ethic Reports & Financial Disclosures
- **\`campaign_finance_filings\`**:
  - \`id\`, \`official_id\` REFERENCES \`officials\`, \`period\` VARCHAR, \`total_received\` DECIMAL, \`total_expended\` DECIMAL, \`cash_on_hand\` DECIMAL
- \`donors\` / \`contributions\` / \`expenditures\`
- **\`financial_disclosures\`**:
  - \`id\`, \`official_id\` REFERENCES \`officials\`, \`filing_year\` INTEGER, \`assets_range_json\` JSON, \`liabilities_range_json\` JSON, \`outside_income\` DECIMAL

#### 7. Grants, Procurements & Spend Tracking
- \`grants\` / \`contracts\` / \`contractors\` / \`procurement_records\` / \`budgets\` / \`spending_records\`

#### 8. Local Public Meetings (Agendas & Transcripts)
- \`meetings\` / \`agendas\` / \`agenda_items\` / \`minutes\` / \`public_comments\` / \`news_articles\` / \`social_posts\`

#### 9. Scrapers, AI Logs & Diagnostics
- **\`sources\`**:
  - \`id\` UUID PRIMARY KEY, \`name\`, \`url\`, \`credibility_rating\` DECIMAL, \`status\` VARCHAR
- **\`scraper_jobs\`**:
  - \`id\` UUID, \`scraper_name\`, \`last_run_at\`, \`status\`, \`records_extracted\`
- **\`ai_confidence_scores\`**:
  - \`id\`, \`target_table\` VARCHAR, \`target_id\` UUID, \`extractor_model\` VARCHAR, \`score\` DECIMAL
- \`data_conflicts\` / \`data_quality_flags\` / \`user_reports\` / \`civic_actions\` / \`audit_logs\` / \`api_keys\``
  },
  {
    id: "spec-homepage",
    title: "4. Homepage Copy",
    subtitle: "Public Accountability Messaging & Neutrality Positioning",
    content: `### Main Copy Framework for CivicLenZ Landing Page

#### 1. Header Navigation Menu
- Logo: **CivicLenZ.ai**
- Links: \`Explore Directory\`, \`Promise Tracker\`, \`Money flow\`, \`Citizen Tools\`, \`Trust & Methodology\`, \`Pricing\`
- Button: \`Enter Platform\` (CTA)

---

#### 2. Hero Section
- **Primary Header**: "CivicLenZ is the AI-powered accountability layer for democracy."
- **Secondary Text (The Promise)**: "Track elected officials, promises, legislative votes, public money, local council agendas, and civic outcomes in your district — all with pristine, politically neutral source-first records."
- **CTAs**:
  - Button \`Explore Florida First (Active MVP)\` (Primary, Solid Indigo accent)
  - Button \`Request National Expansion\` (Secondary, Neutral slate border)
  - ZIP Code Search input box inside hero frame: *"Enter ZIP or Address to see who represents you..."*

---

#### 3. Core Trust Assertion Banner
*"Politically neutral. Source-first. Human audited. CivicLenZ.ai aggregates data exclusively from official government registers, ethics filings, and verified transcripts."*

---

#### 4. Landing Marketing Grid (Three Pillars)
- **For Citizens**:
  - Title: "Understand Your Representative Without the Noise"
  - Copy: "We digest hundreds of pages of legalese and draft records into simple, plain English. Filter by what they promised vs. how they voted."
- **For Watchdogs, Journalists & Researchers**:
  - Title: "Professional Grade Audit Frameworks"
  - Copy: "Export campaign finances, map lobbyst ties, crawl special district contracts, and build collaborative investigations with secure white-label dashboards."
- **For Government Executives & Policy Teams**:
  - Title: "Infrastructure & Funding Tracking"
  - Copy: "Monitor grant allocations from obligated federal reserves down to local county distribution. Assess agency bottlenecks and project timelines."`
  },
  {
    id: "spec-profile",
    title: "5. Official Profile Structure",
    subtitle: "Multi-tab Layout and High-Density Visual Sections",
    content: `### Specification for the Official's Public Profile Page
This view aggregates identity, voting actions, campaigns, promises, and money flows on one layout.

#### Header Summary Cards
- **Photo Column**: High-transparency professional headshot.
- **Identity Details**: Full name, current office title, party pill (colors balanced: dark slate for Independent, neutral deep red/blue with standard text labels for major parties), term limits left, next election deadline.
- **Accountability Overview Matrix (Bento Cards)**:
  - *Attendance Rating*: e.g., **98%** (out of standard legislative sessions).
  - *Voting Coherence Score*: e.g., **12%** divergent from party average, indicating level of independent alignment.
  - *Pledge Progress Arc*: Circle chart tracking the official's promise status ratios.
  - *Data Freshness & Confidence Flag*: e.g. **Verified (99% Confidence)**, updated "2 hours ago".

---

#### Section Tabs (Responsive Deck Layout)
1. **Overview**: Key issues, brief official background, official contacts, and district geographic boundary polygon mapping.
2. **Promise Tracker**:
   - Filterable table featuring: *Promise*, *Source*, *Date*, *Status Pill* (Completed, Partially Fulfilled, Unclear, Broken, In Progress), and *AI Evidence Summaries* linking back to exact budget lines or votes.
3. **Voting History**:
   - Lists bills with sponsors, chamber, exact voting position (Yes, No, Abstain, Absent), comparative stats, and an "Explain Bill" button which fires Gemini.
4. **Campaign Finance & Disclosures**:
   - Dynamic charts tracking raised vs. spent assets, Pac vs. grassroots contributions, outside stock portfolios, and potential conflict flags.
5. **Spending & Contracts**:
   - Flow metrics tracking federal/state expenditures allocated directly to the legislator's jurisdiction.`
  },
  {
    id: "spec-user-dash",
    title: "6. User Dashboard Structure",
    subtitle: "Follow Lists, Watchlists, Custom Alerts Management",
    content: `### Portal Specification: SaaS User Dashboard
Designed to organize follow workflows for citizens and professional researchers alike.

#### Left Rails: Navigation Map
- Profile Overview
- Active Watchlists (e.g., "Florida Senate Oversight", "My Local Representatives")
- Citizen Action Log (Archive of generated letters and testimonies)
- Alerts & Subscriptions (Email daily dispatch/SMS triggers)
- Settings & API Access Keys

---

#### Main Panel: Action Center
- **Dynamic Watchlist Table**:
  - Aggregates tracked officials, active bills, local zoning ordinances, or tracked special taxing districts.
- **Trigger Activity Feed**:
  - "Governor DeSantis signed SB-104 into law today; matches your tracked topic: State Land Use."
  - "Representative Marco Rubio introduced a companion senate amendment."
- **Interactive Action Workspace**:
  - Allows quick dispatch matching of watchlisted officials. "Select 3 officials on your list -> Draft custom testimony concerning zoning regulation CS/SB 250."`
  },
  {
    id: "spec-admin-dash",
    title: "7. Admin Dashboard Structure",
    subtitle: "Crawler Operations, AI Verification, and Dispute Resolution",
    content: `### Portal Specification: Administrative & Integrity Console
The control center ensuring platform credibility, neutral audits, and crawler health.

#### Crawler Supervision Frame
1. **Active Scrapers Table**:
   - Shows crawlers pulling from Congress.gov, FL Senate API, Supervisor of Elections databases, and Local county RSS boards. Tracks rate limits, status, and health meters.
2. **AI Verification Queue**:
   - Lists records extracted automatically by Gemini with a confidence score < 85%. Admin can review, manually edit text, and mark "Approve to Public Directory".
3. **User Dispute Intake Drawer**:
   - Since CivicLenZ is an architecture of absolute neutrality, officials, PR teams, or citizens can submit "Dispute Records" with supporting source PDFs. Admin manages active reviews, keeping audit trails.
4. **Data Conflict Flags Log**:
   - Flags duplication or conflicting statement dates for manual resolution.`
  },
  {
    id: "spec-collection",
    title: "8. Data Collection Strategy",
    subtitle: "Official Scrapers, Schedules, & Parsing Frameworks",
    content: `### Civic Data Collection & Pipeline Architecture
To avoid inaccurate assumptions of public actions, CivicLenZ establishes a multi-tiered ingestion priority structure:

#### Priority Ingestion Hierarchy
1. **Tier 1 (Official Registers)**: Congress.gov API, Federal Register, FEC FTP databases, State Legislative journals, Ethics Commission databases.
2. **Tier 2 (County / Local Portals)**: City council agenda APIs, local court dockets, municipal procurement journals, property appraisers.
3. **Tier 3 (Public Statements & Media)**: RSS Feeds from credible press networks, verified social feeds, official transcripts.

---

#### Crawler Throttling & Scheduling Schedules
- **Legislation & Votes Crawling**: Runs continuously on custom cron triggers every 6 hours. High-speed parsing of session votes.
- **Meeting Agendas**: Scraped nightly from county council portals to ensure upcoming meeting dockets are captured 3 days before assembly.
- **Ethics & Finance Filings**: Periodically crawled on a weekly cycle or in alignment with institutional disclosure quarters (Q1-Q4).
- **Rate Throttling & Proxy Rotation**: Crawlers enforce standard politeness protocols (delay interval between requests >= 1.5 seconds) and rotate user-agent headers to minimize system disruptions behind firewalls.`
  },
  {
    id: "spec-ai-features",
    title: "9. AI System Intelligence Features",
    subtitle: "Cognitive Pipelines, Prompt Architecture, and Fact Grounding",
    content: `### Complete Specification of CivicLenZ AI Engines
Powered by **Gemini 3.5 Flash**, the platform translates dense legislative infrastructure into public knowledge without introducing partisan bias.

#### Defined Cognitive Pipelines
1. **Legislation Explainer**: Takes legal bills, parses the sections, assesses budgetary allocations, and produces structured plain-English summaries outlining "What this means to you," "Who is affected," and "Financial implications."
2. **Promise Mining & Analysis**: Scrapes transcript files, detects expressions of commitment (e.g., *"I will construct..."*, *"I vow to vote..."*), assigns an outcome criterion (e.g., deadline, budget, numeric metric), and flags it inside the official's promise log with standard confidence ratings.
3. **Dynamic Citizen Action Center**: Helps users draft letters, petitions, or testimony. To ensure political neutrality, the engine analyzes the user's selected stance (e.g., *"In support of bill XX because..."* or *"Opposed because of..."*) and structures an argument utilizing highly professional, factual, and respectful language.
4. **Statement Contradiction Analyzer**: Scrapes previous statements, cross-references with legislative voting patterns, and flags consistency gaps. Includes strict analytical disclaimers stating that all flags are informational based on public records.`
  },
  {
    id: "spec-fl-mvp",
    title: "10. Florida-First MVP Build Plan",
    subtitle: "Grounding the Platform with High-Integrity Local Data",
    content: `### Architectural Blueprint for the Florida Ingest MVP
Why Florida first? Florida has rich public accountability structures (Sunshine Laws) and covers a diverse mix of agricultural, coastal, and urban municipal districts.

#### Key Florida MVP Scraping Targets
- **State Legislature (Online Sunshine on flsenate.gov / myfloridahouse.gov)**: Ingest all 40 State Senators, 120 State Representatives, bills, and historic voting records.
- **Florida Commission on Ethics (ethics.state.fl.us)**: Periodic download of financial disclosure Forms 1 and 6 for state/county officials.
- **Florida Division of Elections (dos.myflorida.com/elections)**: Campaign finance reports and filings.
- **County Focus (Miami-Dade / Orange County / Leon County)**:
  - Miami-Dade County Board of County Commissioners meeting dockets, planning zoning dockets, and local sheriff commitments.
  - Orange County Government meeting minutes, county manager procurement filings.

---

#### MVP Deliverables
- Fully working database schema for Florida entities.
- Live-simulated API endpoints demonstrating actual historical Florida data (Ron DeSantis, Marco Rubio, Florida Senate Bill CS/SB 256).
- Working "Citizen Action Center" allowing live drafting of letters directly targetable to actual Florida leaders.`
  },
  {
    id: "spec-national-scale",
    title: "11. National Scaling Blueprint",
    subtitle: "Expanding to 500,000+ Officials Across 50 States",
    content: `### Roadmap for USA National Intelligence Scale-out
Scaling from the Florida MVP to a comprehensive nationwide transparency matrix:

#### Federated Ingestion Pipelines
To handle 10,000+ local municipal bodies, school districts, and special water management boards, CivicLenZ institutes **Federated Scraping Microservices**:
\`\`\`
                       [ CENTRAL COGNITIVE SERVER ]
                                     ^
                                     | (JSON Records)
                     +---------------+---------------+
                     |               |               |
                     v               v               v
               [REGION SE-A]   [REGION NE-B]   [REGION NW-C]
               Florida/Georgia NY/Mass/Penn    Oregon/Wash/ID
\`\`\`
Each state registry is mapped into state-level clusters. Central data engines resolve naming duplicates (e.g., matching "John Smith" local county commissioner vs. "John Smith" congressional candidate) via entity-resolution matching logic that weighs jurisdiction, party, and date of birth.

---

#### Distributed Search & CDN caching
- Implement global ElasticSearch / Algolia engines for instant official locates (by ZIP, address, or bill context).
- Heavy read states are cached on Redis clusters with 1-hour expiration. Write routes bypass cache to log scrape transactions directly.`
  },
  {
    id: "spec-replit-instructions",
    title: "12. Replit & Deployment Blueprint",
    subtitle: "Step-by-Step Configuration, Dependencies, & Commands",
    content: `### Implementation-Ready Setup Manual
Instructions for initializing this platform in your workspace or local Docker sandbox.

#### 1. Setup Environment Variables
Create a \`.env\` file in the root containing:
\`\`\`env
# Core Server Configuration
PORT=3000
NODE_ENV=development

# AI Cognitive Core (Obtained via Google AI Studio secrets)
GEMINI_API_KEY=your_gemini_api_key_here

# App URL (Self-referential endpoints and webhooks)
APP_URL=http://localhost:3000
\`\`\`

---

#### 2. Execute Local Setup & Dependencies
Install dependencies defined in \`package.json\`:
\`\`\`bash
npm install
\`\`\`

---

#### 3. Run Development Server
To launch the full-stack server (Vite middleware proxying backend API express routes on port 3000):
\`\`\`bash
npm run dev
\`\`\`

---

#### 4. Compile and Build for Production
Prepares compiled single bundlings of the state database servers inside \`dist/\` using our bundlers:
\`\`\`bash
npm run build
npm run start
\`\`\``
  },
  {
    id: "spec-roadmap",
    title: "13. Phased Roadmap to V4.0",
    subtitle: "Milestones, Scaling Horizons, Funding, & Trust Goals",
    content: `### Long-Term Platform Growth Strategy (M1 - M24)

#### Horizon 1: The Florida Sunshine MVP (Months 1 - 3)
- **Status**: active.
- **Deliverables**: Ingest of Florida federal/state reps, financial filings database, campaign contributions matching dashboard, core legislation explanations with Gemini.
- **Goal**: Establish the first 10,000 processed profiles and launch beta tester watchlists.

---

#### Horizon 2: Regional Cohorts (Months 4 - 8)
- **Deliverables**: Expand scrapers to include Texas, California, New York, and Ohio legislative systems. Ingest all congressional records and Federal Election commission data.
- **Goal**: Reach 100,000 officeholders; launch paid Citizen Pro tier ($49.99/yr) allowing premium watchlist alerts.

---

#### Horizon 3: Municipal Deep Integration (Months 9 - 15)
- **Deliverables**: Deploy Federated scraping modules targeting the top 200 US cities, county sheriffs, school districts. Launch "Professional / Enterprise" dashboards for advocacy, law firms, and research networks.
- **Goal**: Reach 250,000 officeholders and establish the standard "Public Funding Tracker" for federal grants.

---

#### Horizon 4: Unified Civic Intelligence Network (Months 16 - 24)
- **Deliverables**: Complete national coverage across all 50 states (500,000+ elected/appointed positions, special boards, utility boards). Secure corporate API data licensing program.
- **Goal**: Become the legally credible accountability layer of global democracy and maintain self-funding platform operations.`
  }
];
