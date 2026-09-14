/**
 * CIVICLENZ / HERMES — QUARANTINED SIMULATION MODULE
 * 
 * CLASSIFICATION: LEGACY_SIMULATION
 * 
 * CRITICAL DIRECTIVE:
 * This module has been decommissioned and quarantined under Section 2 & 7 of the
 * Final Public Truth-Layer Removal specification.
 * 
 * All production public UI components, App.tsx, and server.ts MUST import
 * evidence-backed civic records from:
 *   src/lib/civic-records.ts
 * 
 * The historical simulation database is preserved for research reference at:
 *   legacy/synthetic-tools/civic-database.ts
 */

export const IS_DECOMMISSIONED = true;

export function getTrackedOfficial(): never {
  throw new Error('LEGACY_SIMULATION_FORBIDDEN: civic-database.ts is decommissioned. Use src/lib/civic-records.ts.');
}

export const trackedOfficials: never[] = [];
export const activityItems: never[] = [];
export const trackedPetitions: never[] = [];
export const addressSuggestions: string[] = [];
export const dataSources: string[] = [];
