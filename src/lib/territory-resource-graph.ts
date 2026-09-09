/**
 * TERRITORY & PUBLIC RESOURCE SOURCE DISCOVERY
 * 
 * Source-family discovery and adapter registry for constituency, demographic,
 * government finance, revenue, expenditure, procurement, and public resource indicators.
 * Strictly maps authoritative endpoints and provenance without speculative claims.
 */

export interface PublicResourceSourceFamily {
  family_id: string;
  category: 
    | 'CONSTITUENCY_DEMOGRAPHICS'
    | 'ECONOMIC_BUSINESS'
    | 'GOVERNMENT_FINANCE_BUDGET'
    | 'GRANTS_CONTRACTS_PROCUREMENT'
    | 'PUBLIC_DEBT_CAPITAL_PROJECTS'
    | 'AUDITS_OVERSIGHT'
    | 'PUBLIC_SAFETY_INDICATORS';
  title: string;
  authoritative_agency: string;
  source_url: string;
  coverage_scope: 'STATE_FLORIDA' | 'SOUTH_FLORIDA' | 'NATIONAL_BENCHMARK';
  adapter_key: string;
  ingest_format: 'JSON_API' | 'CSV_BULK' | 'HTML_DOCKET' | 'PDF_REPORT';
  harvest_cadence: 'ANNUAL' | 'QUARTERLY' | 'MONTHLY';
  status: 'DISCOVERED_ADAPTER_STAGED' | 'ACTIVE_MONITORING';
}

export const PUBLIC_RESOURCE_SOURCE_FAMILIES: PublicResourceSourceFamily[] = [
  {
    family_id: "res_census_acs_5yr",
    category: "CONSTITUENCY_DEMOGRAPHICS",
    title: "U.S. Census Bureau American Community Survey (ACS) 5-Year Estimates",
    authoritative_agency: "U.S. Census Bureau",
    source_url: "https://api.census.gov/data/2023/acs/acs5",
    coverage_scope: "STATE_FLORIDA",
    adapter_key: "adapter_census_acs_constituency",
    ingest_format: "JSON_API",
    harvest_cadence: "ANNUAL",
    status: "ACTIVE_MONITORING"
  },
  {
    family_id: "res_bea_regional_economic",
    category: "ECONOMIC_BUSINESS",
    title: "Bureau of Economic Analysis (BEA) Regional Economic Accounts",
    authoritative_agency: "U.S. Department of Commerce, BEA",
    source_url: "https://apps.bea.gov/api/data/",
    coverage_scope: "STATE_FLORIDA",
    adapter_key: "adapter_bea_regional_econ",
    ingest_format: "JSON_API",
    harvest_cadence: "ANNUAL",
    status: "DISCOVERED_ADAPTER_STAGED"
  },
  {
    family_id: "res_fl_transparency_finance",
    category: "GOVERNMENT_FINANCE_BUDGET",
    title: "Florida Open Financial Statement System (Transparency Florida)",
    authoritative_agency: "Florida Department of Financial Services (CFO Jimmy Patronis)",
    source_url: "https://transparencyflorida.gov/",
    coverage_scope: "STATE_FLORIDA",
    adapter_key: "adapter_fl_transparency_budget",
    ingest_format: "JSON_API",
    harvest_cadence: "MONTHLY",
    status: "ACTIVE_MONITORING"
  },
  {
    family_id: "res_fl_vendor_bid_procurement",
    category: "GRANTS_CONTRACTS_PROCUREMENT",
    title: "Florida Vendor Information Portal & State Term Contracts",
    authoritative_agency: "Florida Department of Management Services (DMS)",
    source_url: "https://vendor.myfloridamarketplace.com/",
    coverage_scope: "STATE_FLORIDA",
    adapter_key: "adapter_fl_dms_procurement",
    ingest_format: "HTML_DOCKET",
    harvest_cadence: "MONTHLY",
    status: "DISCOVERED_ADAPTER_STAGED"
  },
  {
    family_id: "res_fl_auditor_general",
    category: "AUDITS_OVERSIGHT",
    title: "Florida Auditor General Independent State & County Audits",
    authoritative_agency: "Office of the Auditor General of Florida",
    source_url: "https://flauditor.gov/pages/reports.html",
    coverage_scope: "STATE_FLORIDA",
    adapter_key: "adapter_fl_auditor_general",
    ingest_format: "PDF_REPORT",
    harvest_cadence: "MONTHLY",
    status: "ACTIVE_MONITORING"
  },
  {
    family_id: "res_miami_dade_budget_acfr",
    category: "PUBLIC_DEBT_CAPITAL_PROJECTS",
    title: "Miami-Dade County Annual Comprehensive Financial Report (ACFR)",
    authoritative_agency: "Miami-Dade Finance Department",
    source_url: "https://www.miamidade.gov/global/finance/annual-reports.page",
    coverage_scope: "SOUTH_FLORIDA",
    adapter_key: "adapter_miami_dade_acfr",
    ingest_format: "PDF_REPORT",
    harvest_cadence: "ANNUAL",
    status: "DISCOVERED_ADAPTER_STAGED"
  }
];
