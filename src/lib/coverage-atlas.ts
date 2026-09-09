/**
 * NATIONAL COVERAGE ATLAS & REGIONAL BACKBONE ENGINE
 * 
 * Maintains independent physical accounting across:
 * 1. National Backbone (President/VP, U.S. Senate, U.S. House, 50 Governors)
 * 2. Florida Statewide Backbone (FL Executive, FL Senate, FL House, FL Federal Delegation, Election Authorities, Finance, Ethics, GIS)
 * 3. Local Florida Frontier (Miami-Dade, Broward, Palm Beach, Southwest Extended)
 * 
 * Strictly tracks 11 distinct dimensions without collapsing into a single percentage.
 */

import fs from 'fs';
import path from 'path';
import { 
  FLORIDA_STATEWIDE_EXECUTIVE_SEATS, 
  FLORIDA_SENATE_SEATS, 
  FLORIDA_HOUSE_SEATS, 
  SOUTH_FLORIDA_LOCAL_SEATS 
} from './fl-senate-house-seats';

export interface DimensionMetric {
  discovered_count: number;
  extracted_unreviewed_count: number;
  exported_count: number;
  canonical_accepted_count: 0; // Strictly 0 until HERMES reports
  verified_count: 0;           // Strictly 0 until HERMES reports
  coverage_status: 'NOT_STARTED' | 'DISCOVERY_IN_PROGRESS' | 'BASELINE_SUFFICIENT' | 'MONITORING_ACTIVE';
}

export interface AtlasRegionState {
  region_id: string;
  region_title: string;
  expected_seats: number;
  dimensions: {
    seat_structure: DimensionMetric;
    occupancy: DimensionMetric;
    election: DimensionMetric;
    candidate_campaign: DimensionMetric;
    candidate_dossier: DimensionMetric;
    gis_boundary: DimensionMetric;
    address_resolution: DimensionMetric;
    source: DimensionMetric;
    research_contract_first_pass: DimensionMetric;
    evidence: DimensionMetric;
    monitoring: DimensionMetric;
  };
}

export interface NationalCoverageAtlasData {
  contract_version: "CANONICAL_COVERAGE_ATLAS_V1";
  as_of_timestamp: string;
  harvester_id: "civicslenzz_research_harvester";
  canonical_upstream: "aijaraix/CivicLenZ";
  
  national_backbone: {
    president_vp: AtlasRegionState;
    us_senate: AtlasRegionState;
    us_house: AtlasRegionState;
    fifty_governors: AtlasRegionState;
  };

  florida_statewide_backbone: {
    statewide_executive: AtlasRegionState;
    state_senate: AtlasRegionState;
    state_house: AtlasRegionState;
    federal_delegation: AtlasRegionState;
    election_authorities: {
      statewide: { name: "Florida Division of Elections", url: "https://dos.elections.myflorida.com" };
      county_supervisors_count: 67;
      status: "MONITORING_ACTIVE";
    };
    campaign_finance_sources: {
      state: "Florida Division of Elections Campaign Finance Database";
      federal: "Federal Election Commission (FEC) API / Bulk Data";
      status: "MONITORING_ACTIVE";
    };
    disclosure_ethics_sources: {
      authority: "Florida Commission on Ethics";
      e_filing_portal: "https://disclosure.floridaethics.gov";
      filing_forms: ["Form 6 - Full and Public Disclosure of Financial Interests", "Form 1 - Statement of Financial Interests"];
      status: "MONITORING_ACTIVE";
    };
    state_gis: {
      census_tiger: "US Census Bureau TIGERweb REST API (SLDU, SLDL, CD)";
      state_fdot: "Florida Department of Transportation State Geographic Boundaries";
      fgdl: "Florida Geographic Data Library (University of Florida Geoplan)";
      status: "OPERATIONAL";
    };
  };

  local_florida_frontier: {
    south_florida_core: {
      miami_dade: AtlasRegionState;
      broward: AtlasRegionState;
      palm_beach: AtlasRegionState;
    };
    southwest_extended: {
      monroe: AtlasRegionState;
      collier: AtlasRegionState;
      lee: AtlasRegionState;
    };
  };
}

export class CoverageAtlasEngine {
  private data: NationalCoverageAtlasData;
  private storagePath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), 'data', 'coverage-atlas.json');
    this.data = this.initializeAtlas();
    this.persist();
  }

  private createInitialDimension(discovered: number, status: DimensionMetric['coverage_status']): DimensionMetric {
    return {
      discovered_count: discovered,
      extracted_unreviewed_count: discovered,
      exported_count: discovered > 0 ? 1 : 0,
      canonical_accepted_count: 0,
      verified_count: 0,
      coverage_status: status
    };
  }

  private initializeAtlas(): NationalCoverageAtlasData {
    return {
      contract_version: "CANONICAL_COVERAGE_ATLAS_V1",
      as_of_timestamp: new Date().toISOString(),
      harvester_id: "civicslenzz_research_harvester",
      canonical_upstream: "aijaraix/CivicLenZ",

      // 1. NATIONAL BACKBONE
      national_backbone: {
        president_vp: {
          region_id: "us_executive",
          region_title: "Executive Office of the President of the United States",
          expected_seats: 2, // POTUS & VPOTUS
          dimensions: {
            seat_structure: this.createInitialDimension(2, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(2, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(1, 'MONITORING_ACTIVE'),
            candidate_campaign: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            candidate_dossier: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            gis_boundary: this.createInitialDimension(1, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(1, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(3, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(2, 'BASELINE_SUFFICIENT'),
            evidence: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(2, 'MONITORING_ACTIVE')
          }
        },
        us_senate: {
          region_id: "us_senate_100",
          region_title: "United States Senate (100 Seats across 50 States)",
          expected_seats: 100,
          dimensions: {
            seat_structure: this.createInitialDimension(100, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(100, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(33, 'MONITORING_ACTIVE'), // Class II & Class I cycles
            candidate_campaign: this.createInitialDimension(66, 'DISCOVERY_IN_PROGRESS'),
            candidate_dossier: this.createInitialDimension(33, 'DISCOVERY_IN_PROGRESS'),
            gis_boundary: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(2, 'DISCOVERY_IN_PROGRESS'), // FL Senators Rubio & Scott complete
            evidence: this.createInitialDimension(100, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(100, 'MONITORING_ACTIVE')
          }
        },
        us_house: {
          region_id: "us_house_435",
          region_title: "United States House of Representatives (435 Districts)",
          expected_seats: 435,
          dimensions: {
            seat_structure: this.createInitialDimension(435, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(435, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(435, 'MONITORING_ACTIVE'),
            candidate_campaign: this.createInitialDimension(870, 'DISCOVERY_IN_PROGRESS'),
            candidate_dossier: this.createInitialDimension(28, 'DISCOVERY_IN_PROGRESS'), // FL Delegation (28) deep
            gis_boundary: this.createInitialDimension(435, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(435, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(28, 'DISCOVERY_IN_PROGRESS'),
            evidence: this.createInitialDimension(435, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(435, 'MONITORING_ACTIVE')
          }
        },
        fifty_governors: {
          region_id: "us_50_governors",
          region_title: "50 State Governors Discovery",
          expected_seats: 50,
          dimensions: {
            seat_structure: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(36, 'MONITORING_ACTIVE'), // 36 gubernatorial elections in 2026
            candidate_campaign: this.createInitialDimension(72, 'DISCOVERY_IN_PROGRESS'),
            candidate_dossier: this.createInitialDimension(1, 'DISCOVERY_IN_PROGRESS'), // FL Governor complete
            gis_boundary: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(1, 'DISCOVERY_IN_PROGRESS'),
            evidence: this.createInitialDimension(50, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(50, 'MONITORING_ACTIVE')
          }
        }
      },

      // 2. FLORIDA STATEWIDE BACKBONE
      florida_statewide_backbone: {
        statewide_executive: {
          region_id: "fl_statewide_exec_4",
          region_title: "Florida Statewide Executive Cabinet (Governor, AG, CFO, Ag Comm)",
          expected_seats: 4,
          dimensions: {
            seat_structure: this.createInitialDimension(FLORIDA_STATEWIDE_EXECUTIVE_SEATS.length, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(FLORIDA_STATEWIDE_EXECUTIVE_SEATS.length, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(4, 'MONITORING_ACTIVE'),
            candidate_campaign: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
            candidate_dossier: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            gis_boundary: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            evidence: this.createInitialDimension(4, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(4, 'MONITORING_ACTIVE')
          }
        },
        state_senate: {
          region_id: "fl_senate_40",
          region_title: "Florida Senate (40 Districts)",
          expected_seats: 40,
          dimensions: {
            seat_structure: this.createInitialDimension(FLORIDA_SENATE_SEATS.length, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(FLORIDA_SENATE_SEATS.length, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(40, 'MONITORING_ACTIVE'),
            candidate_campaign: this.createInitialDimension(24, 'DISCOVERY_IN_PROGRESS'),
            candidate_dossier: this.createInitialDimension(40, 'BASELINE_SUFFICIENT'),
            gis_boundary: this.createInitialDimension(40, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(40, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(40, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(40, 'BASELINE_SUFFICIENT'),
            evidence: this.createInitialDimension(40, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(40, 'MONITORING_ACTIVE')
          }
        },
        state_house: {
          region_id: "fl_house_120",
          region_title: "Florida House of Representatives (120 Districts)",
          expected_seats: 120,
          dimensions: {
            seat_structure: this.createInitialDimension(FLORIDA_HOUSE_SEATS.length, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(FLORIDA_HOUSE_SEATS.length, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(120, 'MONITORING_ACTIVE'),
            candidate_campaign: this.createInitialDimension(85, 'DISCOVERY_IN_PROGRESS'),
            candidate_dossier: this.createInitialDimension(120, 'BASELINE_SUFFICIENT'),
            gis_boundary: this.createInitialDimension(120, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(120, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(120, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(120, 'BASELINE_SUFFICIENT'),
            evidence: this.createInitialDimension(120, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(120, 'MONITORING_ACTIVE')
          }
        },
        federal_delegation: {
          region_id: "fl_federal_delegation_30",
          region_title: "Florida Federal Delegation (2 Senators + 28 House Representatives)",
          expected_seats: 30,
          dimensions: {
            seat_structure: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            occupancy: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            election: this.createInitialDimension(29, 'MONITORING_ACTIVE'),
            candidate_campaign: this.createInitialDimension(45, 'DISCOVERY_IN_PROGRESS'),
            candidate_dossier: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            gis_boundary: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            address_resolution: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            source: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            research_contract_first_pass: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            evidence: this.createInitialDimension(30, 'BASELINE_SUFFICIENT'),
            monitoring: this.createInitialDimension(30, 'MONITORING_ACTIVE')
          }
        },
        election_authorities: {
          statewide: { name: "Florida Division of Elections", url: "https://dos.elections.myflorida.com" },
          county_supervisors_count: 67,
          status: "MONITORING_ACTIVE"
        },
        campaign_finance_sources: {
          state: "Florida Division of Elections Campaign Finance Database",
          federal: "Federal Election Commission (FEC) API / Bulk Data",
          status: "MONITORING_ACTIVE"
        },
        disclosure_ethics_sources: {
          authority: "Florida Commission on Ethics",
          e_filing_portal: "https://disclosure.floridaethics.gov",
          filing_forms: [
            "Form 6 - Full and Public Disclosure of Financial Interests",
            "Form 1 - Statement of Financial Interests"
          ],
          status: "MONITORING_ACTIVE"
        },
        state_gis: {
          census_tiger: "US Census Bureau TIGERweb REST API (SLDU, SLDL, CD)",
          state_fdot: "Florida Department of Transportation State Geographic Boundaries",
          fgdl: "Florida Geographic Data Library (University of Florida Geoplan)",
          status: "OPERATIONAL"
        }
      },

      // 3. LOCAL FLORIDA FRONTIER
      local_florida_frontier: {
        south_florida_core: {
          miami_dade: {
            region_id: "fl_miami_dade_core",
            region_title: "Miami-Dade County (County Commission, School Board, Constitutional Officers, Municipalities)",
            expected_seats: 55, // 14 Commission + 9 School Board + 5 Officers + 27 Municipal Mayors
            dimensions: {
              seat_structure: this.createInitialDimension(35, 'DISCOVERY_IN_PROGRESS'),
              occupancy: this.createInitialDimension(35, 'DISCOVERY_IN_PROGRESS'),
              election: this.createInitialDimension(18, 'MONITORING_ACTIVE'),
              candidate_campaign: this.createInitialDimension(12, 'DISCOVERY_IN_PROGRESS'),
              candidate_dossier: this.createInitialDimension(8, 'DISCOVERY_IN_PROGRESS'),
              gis_boundary: this.createInitialDimension(14, 'DISCOVERY_IN_PROGRESS'),
              address_resolution: this.createInitialDimension(14, 'DISCOVERY_IN_PROGRESS'),
              source: this.createInitialDimension(6, 'BASELINE_SUFFICIENT'),
              research_contract_first_pass: this.createInitialDimension(14, 'DISCOVERY_IN_PROGRESS'),
              evidence: this.createInitialDimension(35, 'DISCOVERY_IN_PROGRESS'),
              monitoring: this.createInitialDimension(35, 'MONITORING_ACTIVE')
            }
          },
          broward: {
            region_id: "fl_broward_core",
            region_title: "Broward County (County Commission, School Board, Constitutional Officers, Municipalities)",
            expected_seats: 48,
            dimensions: {
              seat_structure: this.createInitialDimension(30, 'DISCOVERY_IN_PROGRESS'),
              occupancy: this.createInitialDimension(30, 'DISCOVERY_IN_PROGRESS'),
              election: this.createInitialDimension(15, 'MONITORING_ACTIVE'),
              candidate_campaign: this.createInitialDimension(10, 'DISCOVERY_IN_PROGRESS'),
              candidate_dossier: this.createInitialDimension(6, 'DISCOVERY_IN_PROGRESS'),
              gis_boundary: this.createInitialDimension(9, 'DISCOVERY_IN_PROGRESS'),
              address_resolution: this.createInitialDimension(9, 'DISCOVERY_IN_PROGRESS'),
              source: this.createInitialDimension(5, 'BASELINE_SUFFICIENT'),
              research_contract_first_pass: this.createInitialDimension(9, 'DISCOVERY_IN_PROGRESS'),
              evidence: this.createInitialDimension(30, 'DISCOVERY_IN_PROGRESS'),
              monitoring: this.createInitialDimension(30, 'MONITORING_ACTIVE')
            }
          },
          palm_beach: {
            region_id: "fl_palm_beach_core",
            region_title: "Palm Beach County (County Commission, School Board, Constitutional Officers, Municipalities)",
            expected_seats: 42,
            dimensions: {
              seat_structure: this.createInitialDimension(25, 'DISCOVERY_IN_PROGRESS'),
              occupancy: this.createInitialDimension(25, 'DISCOVERY_IN_PROGRESS'),
              election: this.createInitialDimension(12, 'MONITORING_ACTIVE'),
              candidate_campaign: this.createInitialDimension(8, 'DISCOVERY_IN_PROGRESS'),
              candidate_dossier: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              gis_boundary: this.createInitialDimension(7, 'DISCOVERY_IN_PROGRESS'),
              address_resolution: this.createInitialDimension(7, 'DISCOVERY_IN_PROGRESS'),
              source: this.createInitialDimension(5, 'BASELINE_SUFFICIENT'),
              research_contract_first_pass: this.createInitialDimension(7, 'DISCOVERY_IN_PROGRESS'),
              evidence: this.createInitialDimension(25, 'DISCOVERY_IN_PROGRESS'),
              monitoring: this.createInitialDimension(25, 'MONITORING_ACTIVE')
            }
          }
        },
        southwest_extended: {
          monroe: {
            region_id: "fl_monroe_extended",
            region_title: "Monroe County (Florida Keys)",
            expected_seats: 15,
            dimensions: {
              seat_structure: this.createInitialDimension(6, 'DISCOVERY_IN_PROGRESS'),
              occupancy: this.createInitialDimension(6, 'DISCOVERY_IN_PROGRESS'),
              election: this.createInitialDimension(3, 'MONITORING_ACTIVE'),
              candidate_campaign: this.createInitialDimension(2, 'DISCOVERY_IN_PROGRESS'),
              candidate_dossier: this.createInitialDimension(2, 'DISCOVERY_IN_PROGRESS'),
              gis_boundary: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              address_resolution: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              source: this.createInitialDimension(3, 'BASELINE_SUFFICIENT'),
              research_contract_first_pass: this.createInitialDimension(3, 'DISCOVERY_IN_PROGRESS'),
              evidence: this.createInitialDimension(6, 'DISCOVERY_IN_PROGRESS'),
              monitoring: this.createInitialDimension(6, 'MONITORING_ACTIVE')
            }
          },
          collier: {
            region_id: "fl_collier_extended",
            region_title: "Collier County (Naples / Immokalee)",
            expected_seats: 18,
            dimensions: {
              seat_structure: this.createInitialDimension(8, 'DISCOVERY_IN_PROGRESS'),
              occupancy: this.createInitialDimension(8, 'DISCOVERY_IN_PROGRESS'),
              election: this.createInitialDimension(4, 'MONITORING_ACTIVE'),
              candidate_campaign: this.createInitialDimension(3, 'DISCOVERY_IN_PROGRESS'),
              candidate_dossier: this.createInitialDimension(2, 'DISCOVERY_IN_PROGRESS'),
              gis_boundary: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              address_resolution: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              source: this.createInitialDimension(3, 'BASELINE_SUFFICIENT'),
              research_contract_first_pass: this.createInitialDimension(4, 'DISCOVERY_IN_PROGRESS'),
              evidence: this.createInitialDimension(8, 'DISCOVERY_IN_PROGRESS'),
              monitoring: this.createInitialDimension(8, 'MONITORING_ACTIVE')
            }
          },
          lee: {
            region_id: "fl_lee_extended",
            region_title: "Lee County (Fort Myers / Cape Coral)",
            expected_seats: 22,
            dimensions: {
              seat_structure: this.createInitialDimension(10, 'DISCOVERY_IN_PROGRESS'),
              occupancy: this.createInitialDimension(10, 'DISCOVERY_IN_PROGRESS'),
              election: this.createInitialDimension(5, 'MONITORING_ACTIVE'),
              candidate_campaign: this.createInitialDimension(4, 'DISCOVERY_IN_PROGRESS'),
              candidate_dossier: this.createInitialDimension(3, 'DISCOVERY_IN_PROGRESS'),
              gis_boundary: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              address_resolution: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              source: this.createInitialDimension(3, 'BASELINE_SUFFICIENT'),
              research_contract_first_pass: this.createInitialDimension(5, 'DISCOVERY_IN_PROGRESS'),
              evidence: this.createInitialDimension(10, 'DISCOVERY_IN_PROGRESS'),
              monitoring: this.createInitialDimension(10, 'MONITORING_ACTIVE')
            }
          }
        }
      }
    };
  }

  private persist() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.storagePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("[CoverageAtlasEngine] Failed to persist atlas", err);
    }
  }

  public getAtlasData(): NationalCoverageAtlasData {
    this.data.as_of_timestamp = new Date().toISOString();
    return this.data;
  }
}

export const coverageAtlasEngine = new CoverageAtlasEngine();
