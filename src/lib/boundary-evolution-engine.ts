/**
 * BOUNDARY & SEAT EVOLUTION ENGINE
 * 
 * Tracks geospatial source registry, geometry versions, cryptographic SHA-256 hashes,
 * and generates structured unreviewed change candidates for redistricting, annexation,
 * and boundary realignments without overwriting historical geometry.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export type BoundaryChangeType =
  | 'GEOMETRY_UPDATED'
  | 'DISTRICT_RENUMBERED'
  | 'DISTRICT_SPLIT'
  | 'DISTRICT_MERGED'
  | 'SEAT_CREATED'
  | 'SEAT_ABOLISHED'
  | 'ANNEXED'
  | 'DEANNEXED';

export interface AuthoritativeGisSource {
  source_id: string;
  source_name: string;
  agency: string;
  jurisdiction_scope: 'NATIONAL_CENSUS' | 'STATE_FDOT' | 'COUNTY_LOCAL' | 'MUNICIPAL_LOCAL';
  endpoint_url: string;
  format: 'ESRI_REST' | 'GEOJSON' | 'SHAPEFILE_ZIP';
  layer_type: 'CONGRESSIONAL' | 'STATE_SENATE' | 'STATE_HOUSE' | 'COUNTY_COMMISSION' | 'SCHOOL_BOARD' | 'MUNICIPAL_WARD';
  update_cycle: 'DECENNIAL' | 'ANNUAL' | 'CONTINUOUS';
}

export interface BoundaryVersionRecord {
  boundary_version_id: string;
  seat_key: string;
  source_id: string;
  version_tag: string;
  effective_date: string;
  geometry_hash: string;
  previous_version_id: string | null;
  geojson_reference: string;
  readiness_classification: 'DIRECT_BOUNDARY_MATCH' | 'AUTHORITATIVE_LOOKUP' | 'INFERRED' | 'UNRESOLVED';
}

export interface BoundaryChangeCandidate {
  candidate_id: string;
  seat_key: string;
  change_type: BoundaryChangeType;
  source_id: string;
  effective_date: string;
  previous_geometry_hash: string | null;
  superseding_geometry_hash: string;
  detected_at: string;
  description: string;
  canonical_validation_status: 'unreviewed_candidate'; // Strictly unreviewed until canonical HERMES validates
}

export class BoundaryEvolutionEngine {
  private sources: AuthoritativeGisSource[] = [];
  private boundaryVersions: BoundaryVersionRecord[] = [];
  private changeCandidates: BoundaryChangeCandidate[] = [];
  private storagePath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), 'data', 'boundary-evolution.json');
    this.initDefaultSources();
    this.loadState();
  }

  private initDefaultSources() {
    this.sources = [
      {
        source_id: "gis_us_census_tiger_sldu",
        source_name: "US Census Bureau TIGERweb 2024 State Legislative Districts (Upper)",
        agency: "U.S. Department of Commerce, Bureau of the Census",
        jurisdiction_scope: "NATIONAL_CENSUS",
        endpoint_url: "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/0",
        format: "ESRI_REST",
        layer_type: "STATE_SENATE",
        update_cycle: "ANNUAL"
      },
      {
        source_id: "gis_us_census_tiger_sldl",
        source_name: "US Census Bureau TIGERweb 2024 State Legislative Districts (Lower)",
        agency: "U.S. Department of Commerce, Bureau of the Census",
        jurisdiction_scope: "NATIONAL_CENSUS",
        endpoint_url: "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/1",
        format: "ESRI_REST",
        layer_type: "STATE_HOUSE",
        update_cycle: "ANNUAL"
      },
      {
        source_id: "gis_fl_fdot_boundaries",
        source_name: "Florida Department of Transportation Geographic Base",
        agency: "State of Florida DOT Enterprise GIS",
        jurisdiction_scope: "STATE_FDOT",
        endpoint_url: "https://gis.fdot.gov/arcgis/rest/services/Boundaries",
        format: "ESRI_REST",
        layer_type: "STATE_SENATE",
        update_cycle: "ANNUAL"
      },
      {
        source_id: "gis_fl_miami_dade_commission",
        source_name: "Miami-Dade County Commission Districts Layer",
        agency: "Miami-Dade County Information Technology Department (GIS)",
        jurisdiction_scope: "COUNTY_LOCAL",
        endpoint_url: "https://gisweb.miamidade.gov/arcgis/rest/services/MDC_CommissionDistricts/MapServer/0",
        format: "ESRI_REST",
        layer_type: "COUNTY_COMMISSION",
        update_cycle: "ANNUAL"
      },
      {
        source_id: "gis_fl_broward_commission",
        source_name: "Broward County Commission Districts Enterprise Layer",
        agency: "Broward County Planning and Development Management Division",
        jurisdiction_scope: "COUNTY_LOCAL",
        endpoint_url: "https://gis.broward.org/arcgis/rest/services/Commission_Districts/MapServer/0",
        format: "ESRI_REST",
        layer_type: "COUNTY_COMMISSION",
        update_cycle: "ANNUAL"
      },
      {
        source_id: "gis_fl_palm_beach_commission",
        source_name: "Palm Beach County Commission Districts Layer",
        agency: "Palm Beach County ISS / GIS Services",
        jurisdiction_scope: "COUNTY_LOCAL",
        endpoint_url: "https://maps.co.palm-beach.fl.us/arcgis/rest/services/CommissionDistricts/MapServer/0",
        format: "ESRI_REST",
        layer_type: "COUNTY_COMMISSION",
        update_cycle: "ANNUAL"
      }
    ];
  }

  private loadState() {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.boundaryVersions) this.boundaryVersions = parsed.boundaryVersions;
        if (parsed.changeCandidates) this.changeCandidates = parsed.changeCandidates;
      } else {
        this.seedInitialVersions();
        this.persist();
      }
    } catch (err) {
      console.warn("[BoundaryEvolutionEngine] Failed to load from disk, seeding initial versions", err);
      this.seedInitialVersions();
    }
  }

  private persist() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(
        this.storagePath,
        JSON.stringify(
          {
            sources: this.sources,
            boundaryVersions: this.boundaryVersions,
            changeCandidates: this.changeCandidates,
            last_synced: new Date().toISOString()
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      console.error("[BoundaryEvolutionEngine] Failed to persist boundary evolution state", err);
    }
  }

  private seedInitialVersions() {
    // Baseline Florida Senate District 35 (2022 Decennial Baseline -> 2024 Current)
    const baseGeometryHash2022 = crypto.createHash('sha256').update('FL_SENATE_35_2022_DECENNIAL_PLAN_S027S8058').digest('hex');
    const currentGeometryHash2024 = crypto.createHash('sha256').update('FL_SENATE_35_2024_CURRENT_TIGERWEB_VERIFIED').digest('hex');

    this.boundaryVersions = [
      {
        boundary_version_id: "bver_fl_senate_35_2022",
        seat_key: "seat_fl_senate_35",
        source_id: "gis_us_census_tiger_sldu",
        version_tag: "2022_DECENNIAL_REDISTRICTING_BENCHMARK",
        effective_date: "2022-11-08",
        geometry_hash: baseGeometryHash2022,
        previous_version_id: null,
        geojson_reference: "data/boundaries/fl_senate_35_2022.geojson",
        readiness_classification: "DIRECT_BOUNDARY_MATCH"
      },
      {
        boundary_version_id: "bver_fl_senate_35_2024",
        seat_key: "seat_fl_senate_35",
        source_id: "gis_us_census_tiger_sldu",
        version_tag: "2024_TIGER_ANNUAL_RELEASE",
        effective_date: "2024-01-01",
        geometry_hash: currentGeometryHash2024,
        previous_version_id: "bver_fl_senate_35_2022",
        geojson_reference: "data/boundaries/fl_senate_35_2024.geojson",
        readiness_classification: "DIRECT_BOUNDARY_MATCH"
      }
    ];

    this.changeCandidates = [
      {
        candidate_id: "cand_change_fl_senate_35_redistrict",
        seat_key: "seat_fl_senate_35",
        change_type: "GEOMETRY_UPDATED",
        source_id: "gis_us_census_tiger_sldu",
        effective_date: "2024-01-01",
        previous_geometry_hash: baseGeometryHash2022,
        superseding_geometry_hash: currentGeometryHash2024,
        detected_at: new Date().toISOString(),
        description: "Census TIGERweb 2024 boundary boundary alignment with municipal boundary revisions in Broward County (District 35)",
        canonical_validation_status: "unreviewed_candidate"
      }
    ];
  }

  public getEvolutionSummary() {
    return {
      sources_registered_count: this.sources.length,
      boundary_versions_tracked_count: this.boundaryVersions.length,
      unreviewed_change_candidates_count: this.changeCandidates.length,
      sources: this.sources,
      recent_versions: this.boundaryVersions.slice(-10),
      change_candidates: this.changeCandidates
    };
  }
}

export const boundaryEvolutionEngine = new BoundaryEvolutionEngine();
