# FLORIDA MASTER SEAT & COVERAGE LEDGER
**CivicLenZ / HERMES Reality Conversion — Florida Baseline Master**

---

## 1. Master Florida Seat Ledger Structure

Every expected seat in Florida is assigned a stable `seat_uuid` and tracked at the row level in `seat_coverage_status`.

### Florida Seat Breakdown by Office Level:

1. **Statewide Executive (6 Seats)**:
   - Governor
   - Lieutenant Governor
   - Attorney General
   - Chief Financial Officer
   - Commissioner of Agriculture
   - Statewide Special Commission Executive

2. **Federal Officials Representing Florida (30 Seats)**:
   - U.S. Senator (Seat A)
   - U.S. Senator (Seat B)
   - U.S. Representative (Districts 1 through 28)

3. **State Legislature (160 Seats)**:
   - Florida State Senate (Districts 1 through 40)
   - Florida House of Representatives (Districts 1 through 120)

4. **Major County & Constitutional Officers (67 Counties, ~670 Seats)**:
   - County Mayors / Commission Chairs
   - County Commissioners (Districts 1–7 per county)
   - Sheriffs (67 counties)
   - Supervisors of Elections (67 counties)
   - Clerks of Circuit Court (67 counties)
   - Property Appraisers (67 counties)
   - Tax Collectors (67 counties)

5. **Municipal / City Officers (411 Incorporated Municipalities, ~2,050 Seats)**:
   - Major City Mayors (Miami, Tampa, Orlando, Jacksonville, Fort Lauderdale, St. Petersburg, Hialeah, Tallahassee, Gainesville, Pensacola, etc.)
   - City Commissioners / Council Members (411 municipalities)

6. **School Boards (67 Districts, ~335 Seats)**:
   - County School Board Members (Districts 1–5 per county)

7. **Judicial & Special Districts (~500 Seats)**:
   - Florida Supreme Court Justices & District Court of Appeal Judges (Retention Seats)
   - Circuit Court Judges (Elected)
   - Water Management District Governing Boards & Special Taxing Districts

---

## 2. Row-Level Seat Schema

Each seat record tracks:
```ts
export interface SeatCoverageStatus {
  seat_uuid: string;
  office_name: string;
  office_type: 'FEDERAL_LEGISLATOR' | 'STATE_LEGISLATOR' | 'STATE_EXECUTIVE' | 'COUNTY_EXECUTIVE' | 'COUNTY_LEGISLATOR' | 'MUNICIPAL_EXECUTIVE' | 'MUNICIPAL_LEGISLATOR' | 'SCHOOL_BOARD' | 'JUDICIAL' | 'SHERIFF';
  jurisdiction: string;
  county_fips?: string;
  district_number?: string;
  government_level: 'Federal' | 'State' | 'County' | 'Municipal' | 'School Board' | 'Judicial';
  current_official_person_uuid?: string;
  current_official_name?: string;
  is_vacant: boolean;
  term_start?: string;
  term_end?: string;
  next_election_date?: string;
  in_active_election_cycle: boolean;
  research_contract_uuid?: string;
  completeness_percentage: number;
  coverage_status: 'NOT_YET_RESEARCHED' | 'RESEARCH_IN_PROGRESS' | 'BASELINE_COMPLETE' | 'MONITORING';
  last_updated_at: string;
}
```

---

## 3. Real Coverage Metric Calculation

All operational metrics for Florida coverage are calculated directly from backend database queries over `seat_coverage_status` and `research_contract_status`:

$$\text{Coverage \%} = \frac{\sum \text{completeness\_percentage of all seats}}{\text{Total Identified Seats}}$$

$$\text{Baseline Complete Seats} = \text{COUNT}(\text{seats where coverage\_status} = \text{'BASELINE\_COMPLETE'})$$

$$\text{Monitoring Active Seats} = \text{COUNT}(\text{seats where coverage\_status} = \text{'MONITORING'})$$

Zero simulated percentages, zero arbitrary multipliers, zero fake progress metrics.
