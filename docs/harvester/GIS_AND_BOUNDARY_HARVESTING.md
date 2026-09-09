# GIS AND BOUNDARY HARVESTING — Census vs. Local GIS

Accurate civic boundary delineation requires strict source demarcation. CivicsLenZz adheres to the boundary architecture established in canonical CivicLenZ.

---

## 1. Direct Census Layers vs. Local GIS Requirements

```
┌────────────────────────────────────────────────────────────────────────┐
│             TIER 1: DIRECT U.S. CENSUS BUREAU TIGER/WEB                │
│                                                                        │
│  • Nation, State (FIPS 12 - Florida)                                   │
│  • County Boundaries (67 Florida Counties)                             │
│  • Congressional Districts (119th Congress)                            │
│  • State Legislative Districts - Upper Chamber (FL Senate Districts)   │
│  • State Legislative Districts - Lower Chamber (FL House Districts)    │
│  • Incorporated Places & Census Designated Places (CDPs)               │
│                                                                        │
│  ==> Authoritative via: https://geocoding.geo.census.gov/geocoder/     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             TIER 2: LOCAL COUNTY & MUNICIPAL GIS PORTALS               │
│             (Mandatory for Sub-County Single-Member Districts)         │
│                                                                        │
│  • Board of County Commissioners Single-Member Districts               │
│  • District School Board Member Districts                              │
│  • Municipal City Council / Commission Wards                           │
│  • Special Taxing & Water Management Districts (SFWMD, etc.)           │
│                                                                        │
│  ==> Source: County GIS Portals & Supervisors of Elections             │
│  ==> INVARIANT: Unsupported boundaries must NEVER be inferred!         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Invariant: Never Infer Unsupported Boundaries

* **No Synthetic Geometries**: The Harvester must never draw bounding boxes or interpolate district polygons when an authoritative shapefile is missing.
* **Status Tagging**: Sub-county seats must be tagged as `PENDING_LOCAL_GIS` until the official County GIS or Supervisor of Elections precinct shapefile is captured and hashed.

---

## 3. Real Address Resolution Engine

The Harvester provides `/api/geo/resolve` powered by the US Census Bureau Geocoder:

* **Endpoint**: `GET /api/geo/resolve?address=100+S+Monroe+St,+Tallahassee,+FL+32301`
* **Returns**:
  - Exact coordinates: `Latitude`, `Longitude`
  - Census Block FIPS, Tract, County FIPS
  - State Legislative Upper (Senate District)
  - State Legislative Lower (House District)
  - Congressional District
  - Explicit list of remaining local layers requiring county/municipal GIS shapefiles.
