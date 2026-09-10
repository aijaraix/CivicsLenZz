/**
 * PHYSICAL CONTROL PLANE PROOF & AUDIT TEST
 * 
 * Tests the physical proofs required by sections 1-12:
 * 1. Physical Manifest Audit (from required_documents array directly)
 * 2. Distinction between Commit SHA, Blob SHA, and Content Hash
 * 3. Work Ledger JSON Path & Derivation Lineage
 * 4. Current Occupancy Reality Audit (Sharief, Moody, SD39 vacancy)
 * 5. Person Role Classification (CURRENT_OFFICIAL, FORMER_OFFICIAL, etc.)
 * 6. Disclosure Applicability by Legal/Source Regime
 * 7. Relationship Research Depth
 * 8. Monitoring Depth Breakout
 * 9. Canonical Deep-Dossier Qualification
 * 10. New Deterministic 10-Subject Sample Provenance Traces
 */

import assert from 'assert';
import { physicalControlPlaneEngine } from '../src/lib/physical-control-plane-engine';
import { controlPlaneReconciliationEngine } from '../src/lib/control-plane-reconciliation-engine';

let passed = 0;
let failed = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res.then(() => {
        passed++;
        console.log(`  ✓ PASS: ${name}`);
      }).catch(err => {
        failed++;
        console.error(`  ✗ FAIL: ${name}`, err);
      });
    } else {
      passed++;
      console.log(`  ✓ PASS: ${name}`);
    }
  } catch (err) {
    failed++;
    console.error(`  ✗ FAIL: ${name}`, err);
  }
}

async function runPhysicalControlPlaneTests() {
  console.log("\n=======================================================");
  console.log("RUNNING PHYSICAL CONTROL PLANE PROOF TEST SUITE");
  console.log("=======================================================\n");

  // 1. Manifest Required Documents Array & Blob SHA
  runTest("Physical manifest audit counts required_documents array directly and separates Blob SHA from Commit SHA", () => {
    const manifest = physicalControlPlaneEngine.auditManifest();
    assert.strictEqual(manifest.canonical_branch_head_sha, '6462ef06b837d64f13967188d9d74341da5080f6');
    assert.strictEqual(manifest.manifest_version, '1.1.0');
    assert.strictEqual(manifest.required_document_count, 46);
    assert.strictEqual(manifest.read_and_reconciled_count, 46);
    assert.strictEqual(manifest.missing_count, 0);
    assert.strictEqual(manifest.contradiction_count, 0);
    assert.ok(manifest.manifest_blob_sha.length === 40); // Valid git blob sha1
    assert.ok(manifest.manifest_content_hash.length === 64); // Valid sha256
    assert.notStrictEqual(manifest.canonical_branch_head_sha, manifest.manifest_blob_sha);
  });

  // 2. Work Ledger Lineage
  runTest("Work ledger lineage explicitly identifies JSON paths and derivations for all counters", () => {
    const lineage = physicalControlPlaneEngine.proveWorkLedgerLineage();
    assert.ok(lineage.research_need_rows.json_path.includes('research_contract_status'));
    assert.strictEqual(lineage.research_need_rows.count, 4646);
    assert.strictEqual(lineage.job_rows.json_path, '$.hermes_jobs');
    assert.ok(lineage.job_rows.count >= 1);
    assert.strictEqual(lineage.run_rows.json_path, '$.hermes_job_attempts');
    assert.strictEqual(lineage.lease_rows.json_path, '$.hermes_worker_leases');
    assert.strictEqual(lineage.retry_rows.json_path, '$.dead_letter_jobs');
    assert.strictEqual(lineage.monitoring_rows.json_path, '$.hermes_source_registry');
    assert.strictEqual(lineage.academy_rows.json_path, '$.hermes_checkpoints');
  });

  // 3. Occupancy Reality Audit
  runTest("Occupancy audit reconciles Barbara Sharief, Moody (Senate), Uthmeier (AG), SD39 vacancy, Pizzo, and Garcia", () => {
    const occAudit = physicalControlPlaneEngine.auditOccupancies();
    assert.strictEqual(occAudit.current_occupancies_audited, 165);
    assert.strictEqual(occAudit.currentness_errors_found, 5);
    assert.strictEqual(occAudit.records_regenerated, 5);
    assert.strictEqual(occAudit.reconciled_cases.length, 6);
    
    // Check Sharief
    const sharief = occAudit.reconciled_cases.find(c => c.subject_or_seat.includes('Sharief'));
    assert.ok(sharief);
    assert.ok(sharief.current_projection.includes('CURRENT_OFFICIAL occupying Florida Senate District 35'));

    // Check SD39
    const sd39 = occAudit.reconciled_cases.find(c => c.subject_or_seat.includes('District 39'));
    assert.ok(sd39);
    assert.ok(sd39.current_projection.includes('VACANT_SEAT'));

    // Check Moody
    const moody = occAudit.reconciled_cases.find(c => c.subject_or_seat.includes('Moody'));
    assert.ok(moody);
    assert.ok(moody.current_projection.includes('CURRENT_OFFICIAL occupying U.S. Senate'));
  });

  // 4. Disclosure Applicability by Regime
  runTest("Disclosure applicability reflects statutory regimes instead of blanket population count", () => {
    const disclosures = physicalControlPlaneEngine.auditDisclosures();
    assert.strictEqual(disclosures.length, 6);
    
    const form6 = disclosures.find(d => d.regime === 'FL_STATE_FORM6');
    assert.ok(form6);
    assert.strictEqual(form6.applicable, 205);
    assert.strictEqual(form6.researched, 205);

    const form1 = disclosures.find(d => d.regime === 'FL_STATE_FORM1');
    assert.ok(form1);
    assert.strictEqual(form1.applicable, 1420);

    const fed = disclosures.find(d => d.regime === 'FEDERAL_DISCLOSURE');
    assert.ok(fed);
    assert.strictEqual(fed.applicable, 30);
    assert.strictEqual(fed.current_with_evidence, 30);

    const notApp = disclosures.find(d => d.regime === 'NOT_APPLICABLE');
    assert.ok(notApp);
    assert.strictEqual(notApp.applicable, 1645);
  });

  // 5. Relationship Depth Metrics
  runTest("Relationship metrics separate baseline structural ties from deep verified research", () => {
    const rel = physicalControlPlaneEngine.auditRelationships();
    assert.strictEqual(rel.baseline_structural, 4940);
    assert.strictEqual(rel.deep_relationship_research, 324);
    assert.ok(rel.campaign_finance_relationships > 0);
    assert.ok(rel.board_organization_research > 0);
    assert.ok(rel.lobbying_pac_research > 0);
    assert.ok(rel.contract_grant_research > 0);
    assert.ok(rel.disclosed_business_interest_research > 0);
  });

  // 6. Monitoring Depth Metrics
  runTest("Monitoring depth breaks out individual surveillance channels across dynamic scopes", () => {
    const mon = physicalControlPlaneEngine.auditMonitoringDepth();
    assert.strictEqual(mon.any_monitored_parent_source, 4940);
    assert.ok(mon.occupancy_monitoring > 0);
    assert.ok(mon.election_monitoring > 0);
    assert.ok(mon.finance_monitoring > 0);
    assert.ok(mon.disclosure_monitoring > 0);
    assert.ok(mon.vote_legislation_monitoring > 0);
    assert.ok(mon.campaign_site_monitoring > 0);
    assert.strictEqual(mon.all_applicable_dynamic_scopes_monitored, 324);
  });

  // 7. Canonical Deep-Dossier Recalculation
  runTest("Deep-dossier recalculation conforms to 10-family standard and recalculates physical count", () => {
    const dd = physicalControlPlaneEngine.auditDeepDossierRecalculation();
    assert.strictEqual(dd.old_definition_count, 324);
    assert.strictEqual(dd.canonical_definition_count, 142);
    assert.strictEqual(dd.required_scope_families.length, 10);
    assert.ok(dd.minimum_scope_standard.includes('DEEP_DOSSIER_QUALIFIED'));
  });

  // 8. Deterministic New 10-Subject Sample Provenance Traces
  runTest("New 10-subject deterministic sample proves 3 material claims with strict role separation", () => {
    const subjects = physicalControlPlaneEngine.auditNewSampleSubjects();
    assert.strictEqual(subjects.length, 10);
    
    // Check role separation
    const sharief = subjects.find(s => s.person_uuid === 'person_barbara_sharief');
    assert.ok(sharief);
    assert.strictEqual(sharief.current_role, 'CURRENT_OFFICIAL');
    assert.ok(sharief.current_occupancy?.includes('Senate District 35'));

    const avila = subjects.find(s => s.person_uuid === 'person_bryan_avila');
    assert.ok(avila);
    assert.strictEqual(avila.current_role, 'FORMER_OFFICIAL');
    assert.strictEqual(avila.current_occupancy, null);

    const luna = subjects.find(s => s.person_uuid === 'person_anna_paulina_luna');
    assert.ok(luna);
    assert.strictEqual(luna.current_role, 'MULTIPLE_OF_THESE_HISTORICALLY');
    assert.ok(luna.current_candidate_campaigns.length > 0);

    for (const s of subjects) {
      assert.strictEqual(s.provenance_traces.length, 3);
      for (const t of s.provenance_traces) {
        assert.ok(t.artifact_hash.length === 64);
        assert.ok(t.retrieval_id.startsWith('ret_'));
        assert.ok(t.persisted_state.startsWith('data/'));
      }
    }
  });

  console.log("\n=======================================================");
  console.log(`PHYSICAL CONTROL PLANE TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhysicalControlPlaneTests().catch(err => {
  console.error("Physical control plane test runner failed:", err);
  process.exit(1);
});
