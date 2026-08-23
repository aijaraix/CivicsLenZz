# FLORIDA AUTHORITATIVE SOURCE ADAPTERS
**CivicLenZ / HERMES Ingestion & Adapter Specifications**

---

## 1. Priority Source Adapter Hierarchy

Each authoritative Florida data source is assigned a dedicated adapter module defining authority tiering, rate limits, timeouts, parsers, and SHA-256 evidence snapshot generation.

### Tier A: Primary Government Portals (Official Authority)
1. **`FloridaDOSDivisionOfElectionsAdapter`**:
   - **Base URL**: `https://dos.elections.myflorida.com/candidates/`
   - **Scope**: Candidate tracking, qualification statuses, election dates, campaign finance filings.
   - **Rate Limit**: 5 requests/sec with jittered exponential backoff.
   - **Timeout**: Connect 15s, Read 30s.

2. **`FloridaSenateAdapter`**:
   - **Base URL**: `https://flsenate.gov/Senators/` & `https://flsenate.gov/Session/Bills/`
   - **Scope**: All 40 Florida Senators, committee assignments, sponsored bills, roll call vote tallies.
   - **Rate Limit**: 4 requests/sec.
   - **Timeout**: Connect 15s, Read 30s.

3. **`FloridaHouseAdapter`**:
   - **Base URL**: `https://myfloridahouse.gov/Representatives` & `https://myfloridahouse.gov/Session/Bills`
   - **Scope**: All 120 Florida House members, committee rosters, legislation sponsorship, floor votes.
   - **Rate Limit**: 4 requests/sec.
   - **Timeout**: Connect 15s, Read 30s.

4. **`FloridaCountySOEAdapter`**:
   - **Base URLs**:
     - Miami-Dade: `https://www.miamidade.gov/elections/`
     - Broward: `https://www.browardvotes.gov/`
     - Palm Beach: `https://www.pbcelections.org/`
     - Hillsborough: `https://www.hillsboroughvotes.gov/`
     - Orange: `https://www.ocfelections.com/`
     - Pinellas, Duval, Lee, Polk, Brevard, Volusia, Pasco, Seminole, etc. (67 counties total)
   - **Scope**: Precinct maps, local candidate filings, sample ballots, municipal election dates.
   - **Rate Limit**: 3 requests/sec per county domain bucket.

5. **`CongressFloridaDelegationAdapter`**:
   - **Base URL**: `https://api.congress.gov/v3/member/state/FL`
   - **Scope**: Florida's 2 U.S. Senators and 28 U.S. House Representatives, voting records, bill co-sponsorships.
   - **Rate Limit**: 2 requests/sec (API Key supported).

6. **`FECFloridaCampaignFinanceAdapter`**:
   - **Base URL**: `https://api.open.fec.gov/v1/candidates/?state=FL`
   - **Scope**: Federal campaign committee filings, itemized contributions, financial totals.
   - **Rate Limit**: 2 requests/sec.

7. **`FloridaCommissionOnEthicsAdapter`**:
   - **Base URL**: `https://ethics.state.fl.us/` & Form 6 E-Disclosure
   - **Scope**: Financial disclosures, ethics complaints, advisory opinions, lobbyist registrations.
   - **Rate Limit**: 2 requests/sec.

8. **`FloridaSunbizCorporationsAdapter`**:
   - **Base URL**: `https://search.sunbiz.org/`
   - **Scope**: Officer & director records, registered agents, business entity linkages for officials.
   - **Rate Limit**: 2 requests/sec.

9. **`FloridaExecutiveGovernorAdapter`**:
   - **Base URL**: `https://www.flgov.com/`
   - **Scope**: Executive orders, judicial appointments, board commissions, official press statements.
   - **Rate Limit**: 3 requests/sec.

10. **`CensusTigerGISAdapter`**:
    - **Base URL**: `https://www2.census.gov/geo/tiger/` & Florida Department of Transportation GIS
    - **Scope**: State legislative districts, county boundaries, municipal boundaries GeoJSON.
    - **Rate Limit**: 5 requests/sec.

---

## 2. Source Adapter Contract Specification

Every source adapter implements the following interface:
```ts
export interface SourceAdapter {
  source_id: string;
  source_name: string;
  authority_tier: 'TIER_A' | 'TIER_B' | 'TIER_C' | 'TIER_D';
  base_url: string;
  jurisdiction: string;
  supported_record_types: string[];
  request_method: 'GET' | 'POST';
  rate_limit_req_per_sec: number;
  connect_timeout_ms: number;
  read_timeout_ms: number;
  fetchAndParse(targetUrl: string, params?: Record<string, any>): Promise<AdapterResult>;
}
```
