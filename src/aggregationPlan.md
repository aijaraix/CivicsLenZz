# Node S5: Deep-Scrape Background & Extended Profile Architecture

## Objective
To ensure complete transparency into every elected official by extracting, aggregating, and structuring all publicly available personal, legal, financial, and historical data points.

## Node Topology & Integrations
This new aggregation pipeline (Node S5) runs asynchronously alongside standard legislative and campaign finance scrapers. It operates by cross-referencing multiple disparate public records:

### 1. Data Sources
- **Public Records Databases**: LexisNexis, Whitepages, municipal property appraiser APIs (for foreclosures and bankruptcies).
- **Court Dockets**: State and federal court scraping for civil lawsuits, criminal records, and divorce proceedings.
- **Ethics Commissions**: Direct pulls from state ethics investigation logs to track allegations, dismissed claims, and active reviews.
- **Archival Web & Socials**: The Wayback Machine, social network indexers, and local media archives to uncover deleted tweets, known associates, and historical statements.
- **Financial Registries**: STOCK Act disclosures and SEC filings to trace trades, asset liquidity, and potential conflicts of interest.
- **Educational Records**: Alumni databases and news archives to extract early life details (e.g., High School attended).

### 2. The Data Model (`extendedProfile`)
We have expanded our core `Official` interface to accommodate the deep scrape:
- **Family & Life**: `maritalStatus`, `numberOfMarriages`, `divorces`, `children`, `spouse`.
- **Education**: Detailed breakdowns including `highSchool` and `university` records.
- **Legal History**: Arrays capturing `foreclosures`, `bankruptcies`, `criminalRecords`, and `civilLawsuits`.
- **Ethics & Trading**: `ethicsInvestigations`, `stockTrading` volume and flags.
- **Professional & Social**: `staffTies` (to check revolving door lobbyists), `knownAssociates`, `keyVotes`, and `expandedSocials`.
- **Media Sentiment**: Unofficial sentiment tracking based on local and national journalism.

### 3. Implementation Steps & Rollout
1. **Schema Expansion**: (COMPLETED) The `types.ts` has been updated to support `extendedProfile`.
2. **UI Integration**: (COMPLETED) A new section, "Deep-Scrape Background & Extended Profile" rendered on the directory profile under Node S5 flag.
3. **Mock Demonstrations**: (COMPLETED) Inserted data for Brian Kemp and Ron DeSantis to visualize the UI handling.
4. **Scraper UI Monitoring**: (COMPLETED) Top bar updated to show scraper health, directly linking to the Scraper monitor where Node S5 is now tracked.
5. **Data Ingestion Engineering**: (PENDING) Build the actual Python/Node scripts that hit LexisNexis or public court APIs and populate our database. (This happens outside the React frontend).

### 4. Privacy & Compliance
All scraped data must adhere strictly to information that is publicly available under the Freedom of Information Act (FOIA), state sunshine laws, and standard public records. Disclaimers remain in the footer to note that civil lawsuits or ethics investigations are raw aggregated logs and do not imply guilt.
