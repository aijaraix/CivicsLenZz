/**
 * LEGACY_SYNTHETIC_NON_PRODUCTION_DO_NOT_EXECUTE
 * 
 * HISTORICAL SCRIPT REFACTORED FOR ZERO-SYNTHETIC PRODUCTION RECONCILIATION.
 * In accordance with CivicsLenZz Zero-Synthetic Master Production Directive,
 * synthetic civic profile manufacturing is permanently decommissioned.
 * 
 * This export utility only archives authentic physical master ledger seats
 * and genuine durable evidence records from HermesBackendStore.
 */

import fs from 'fs';
import path from 'path';
import { masterFloridaLedger } from '../src/lib/florida-master-ledger';
import { hermesBackendStore } from '../src/lib/hermes-backend-store';

export function exportAuthenticCivicData() {
  console.log('📦 Exporting authentic physical civic data from durable storage...');

  const dataDir = process.env.CIVICSLENZZ_DATA_DIR || path.join(process.cwd(), 'data');
  const exportDir = path.join(dataDir, 'export');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // 1. Export physical Florida ledger seats (5,508 structural seats)
  const seats = masterFloridaLedger.getSeatRecords();
  const seatsExportPath = path.join(exportDir, 'florida_master_seats_ledger.json');
  fs.writeFileSync(seatsExportPath, JSON.stringify(seats, null, 2), 'utf8');
  console.log(`  ✓ Exported ${seats.length} authentic structural seats to ${seatsExportPath}`);

  // 2. Export physical evidence records
  const evidence = hermesBackendStore.getRawEvidenceObjects();
  const evidenceExportPath = path.join(exportDir, 'durable_evidence_records.json');
  fs.writeFileSync(evidenceExportPath, JSON.stringify(evidence, null, 2), 'utf8');
  console.log(`  ✓ Exported ${evidence.length} physical evidence records to ${evidenceExportPath}`);

  // 3. Export raw snapshots manifest
  const snapshots = hermesBackendStore.getRawSnapshots();
  const snapshotsExportPath = path.join(exportDir, 'raw_snapshots_manifest.json');
  fs.writeFileSync(snapshotsExportPath, JSON.stringify(snapshots, null, 2), 'utf8');
  console.log(`  ✓ Exported ${snapshots.length} raw snapshot manifests to ${snapshotsExportPath}`);

  console.log('✅ Authentic civic data export complete. ZERO synthetic records generated.');
}

// Only execute when run directly
if (process.argv[1] && (process.argv[1].endsWith('export_all_civic_data.ts') || process.argv[1].endsWith('export_all_civic_data.js'))) {
  exportAuthenticCivicData();
}
