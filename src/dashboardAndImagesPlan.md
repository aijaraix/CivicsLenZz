# Feature Plan: Official Images, Node Dashboard, and Address Search

## 1. Verifiable Official Photography
**Problem**: The current implementation uses generic Unsplash placeholders for elected officials, which undermines trust and data validity. 
**Solution**:
- Remove all Unsplash image URLs.
- Integrate verified public domain / official government photo URLs (e.g., Wikimedia Commons repositories of official `.gov` portraits).
- For edge cases (local officials without digitized portraits), implement a clean initial-based fallback avatar rather than relying on stock photography.

## 2. Live Node & Pipeline Dashboard (Main Page)
**Problem**: The user has no visibility on the homepage into *how* the data is being collected across our 5 nodes.
**Solution**:
- Build a dedicated "System Health & Data Pipelines" dashboard on the home page.
- Showcase all 5 active nodes:
  1. **Federal Level Scraper** (Congress.gov API)
  2. **State Legislature Scraper** (State assemblies/Sunshine laws)
  3. **Campaign Finance & Ethics** (FEC/State Ethics)
  4. **Local/Municipal Scraper** (County/City boards)
  5. **Extended Profile Deep-Scrape** (Public records, LexisNexis, Court dockets)
- Display real-time telemetry for each node: Health percentage, Last Index Tick, Records Extracted, and Status.

## 3. Address Indexing & Search Matrix
**Problem**: The address search simulated logic needs to visually and functionally demonstrate that it aggregates officials from *all* overlapping districts (Federal, State, County, Municipal).
**Solution**:
- Upgrade the search input to accept a full address.
- Provide clear visual feedback when an address is processed, explicitly listing the overlapping jurisdictions it unlocked (e.g., "Matched: FL-27, Florida Senate District 39, Miami-Dade County Board").
- Ensure the search explicitly triggers a cross-reference across all 5 data nodes.
