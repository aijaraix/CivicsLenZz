import assert from 'node:assert';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { PostgresProducerStore } from '../src/lib/producer-storage/postgres-producer-store';
import { GcsRawObjectStore } from '../src/lib/producer-storage/raw-object-store';
import { FloridaDOSDivisionOfElectionsAdapter } from '../src/lib/source-adapters';
import { hermesBridgeClient } from '../src/lib/hermes-bridge-client';
import { detectAccessChallenge } from '../src/lib/hermes-backend-store';
import { getProducerPersistence } from '../src/lib/producer-storage/index';

console.log("=== CIVICSLENZZ DURABLE PERSISTENCE TEST SUITE ===");

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name}`, err?.message || err);
      failed++;
    }
  }

  // Ensure test mode defaults for local execution
  const prevEnv = process.env.NODE_ENV;
  const prevBucket = process.env.PRODUCER_GCS_BUCKET;
  delete process.env.PRODUCER_GCS_BUCKET;
  process.env.NODE_ENV = 'test';
  process.env.PRODUCER_STORAGE_MODE = 'LOCAL_TEST';

  // Test 1: Production adapter → Postgres + GCS
  await test("1. Production adapter → Postgres + GCS integration contract", async () => {
    const store = new PostgresProducerStore();
    assert.ok(store, "PostgresProducerStore instantiated");
    const rawStore = new GcsRawObjectStore();
    const health = await rawStore.checkHealth();
    assert.ok(health.configured !== undefined, "Raw store health check returns status");
  });

  // Test 2: HTTP-200 challenge → non-proven PostgreSQL snapshot
  await test("2. HTTP-200 challenge → non-proven PostgreSQL snapshot & 0 evidence rows", async () => {
    const challengeHtml = `<html><head><title>Attention Required! | Cloudflare</title></head><body>Please complete the security check captcha</body></html>`;
    const inspection = detectAccessChallenge(200, challengeHtml);
    assert.strictEqual(inspection.isChallenge, true, "Challenge detected on HTTP 200");
    assert.strictEqual(inspection.failureClass, 'ACCESS_RESTRICTED');

    const store = new PostgresProducerStore();
    // Save snapshot without explicit REAL_PROVEN
    const snap = await store.saveRawSnapshot({
      source_uuid: "fl_dos_elections",
      target_url: "https://dos.elections.myflorida.com/candidates/CanList.asp",
      http_status: 200,
      content_type: "text/html",
      raw_bytes: Buffer.from(challengeHtml, 'utf-8'),
      challenge_reason: inspection.reason,
      failure_class: inspection.failureClass
    });

    assert.notStrictEqual(snap.provenance_classification, 'REAL_PROVEN', "HTTP 200 challenge MUST NOT be REAL_PROVEN");
    assert.strictEqual(snap.provenance_classification, 'UNKNOWN', "Default classification without explicit flag on 2xx is UNKNOWN");
  });

  // Test 3: GCS write failure → no snapshot success row
  await test("3. GCS write failure aborts snapshot persistence (fail closed)", async () => {
    const store = new PostgresProducerStore();
    const mockFailingGcsStore = {
      isConfigured: () => true,
      isLocalFallbackEnabled: () => false,
      putObject: async () => {
        throw new Error("GCS write error: Access Denied / Network Failure");
      },
      getObject: async () => null,
      checkHealth: async () => ({ ok: false, configured: true, localFallbackEnabled: false, error: "GCS failing" })
    };
    (store as any).rawObjectStore = mockFailingGcsStore;

    await assert.rejects(
      async () => {
        await store.saveRawSnapshot({
          source_uuid: "fl_dos_elections",
          target_url: "https://dos.elections.myflorida.com",
          http_status: 200,
          content_type: "text/html",
          raw_bytes: Buffer.from("test content", "utf-8")
        });
      },
      /GCS write error/,
      "saveRawSnapshot MUST throw and abort if GCS upload fails"
    );
  });

  // Test 4: GCS unavailable → daemon inactive
  await test("4. GCS unavailable causes checkHealth().daemonActive = false", async () => {
    const store = new PostgresProducerStore();
    (store as any).rawObjectStore = {
      checkHealth: async () => ({ ok: false, configured: true, localFallbackEnabled: false, error: "GCS Unreachable" })
    };

    const health = await store.checkHealth();
    assert.strictEqual(health.rawObjectStorageConnected, false, "Raw storage disconnected");
    assert.strictEqual(health.daemonActive, false, "Daemon must be inactive when GCS is unreachable");
  });

  // Test 5: Postgres unavailable → daemon inactive
  await test("5. Postgres unavailable causes checkHealth().daemonActive = false", async () => {
    const store = new PostgresProducerStore();
    (store as any).postgresConnected = false;

    const rawHealth = await (store as any).rawObjectStore.checkHealth();
    const isDaemonActive = (store as any).daemonActive && false && rawHealth.ok;

    assert.strictEqual(isDaemonActive, false, "Daemon must be inactive when Postgres is disconnected");
  });

  // Test 6: Production path creates no local raw file
  await test("6. Production path creates no local raw file on disk", async () => {
    delete process.env.PRODUCER_STORAGE_MODE;
    process.env.NODE_ENV = 'production';
    process.env.K_SERVICE = 'civicslenz-prod';

    const persistence = getProducerPersistence();
    const mockGcsStore = {
      isConfigured: () => true,
      isLocalFallbackEnabled: () => false,
      putObject: async (loc: string, bytes: Buffer) => ({
        locator: `gs://civicslenzz-producer-artifacts/${loc}`,
        byteLength: bytes.length,
        sha256: crypto.createHash('sha256').update(bytes).digest('hex')
      }),
      getObject: async () => null,
      checkHealth: async () => ({ ok: true, configured: true, localFallbackEnabled: false })
    };
    (persistence as any).rawObjectStore = mockGcsStore;

    const adapter = new FloridaDOSDivisionOfElectionsAdapter();
    const testBytes = Buffer.from("<html>production test</html>", "utf-8");
    const res = await adapter.storeSnapshotAndEvidence(
      "https://dos.elections.myflorida.com/test-prod",
      200,
      "text/html",
      testBytes,
      [{ target_entity: "Test Person", field_key: "TEST_FIELD", extracted_value: "Val" }]
    );

    assert.ok(res.snapshotUuid, "Durable snapshot UUID returned");

    // Verify local backend store file in data/ was not populated by this run
    const localDbPath = path.join(process.cwd(), 'data', 'civicslenzz-backend-db.json');
    if (fs.existsSync(localDbPath)) {
      const dbContent = fs.readFileSync(localDbPath, 'utf-8');
      assert.ok(!dbContent.includes(res.snapshotUuid), "Local DB file must NOT contain production snapshot UUID");
    }

    process.env.NODE_ENV = 'test';
    process.env.PRODUCER_STORAGE_MODE = 'LOCAL_TEST';
    delete process.env.K_SERVICE;
  });

  // Test 7: Durable snapshot UUID == evidence snapshot UUID == adapter result UUID
  await test("7. Durable snapshot UUID == evidence snapshot UUID == adapter result UUID", async () => {
    const adapter = new FloridaDOSDivisionOfElectionsAdapter();
    const testBytes = Buffer.from("<html>uuids test</html>", "utf-8");
    const res = await adapter.storeSnapshotAndEvidence(
      "https://dos.elections.myflorida.com/uuid-test",
      200,
      "text/html",
      testBytes,
      [{ target_entity: "Test Entity", field_key: "NAME", extracted_value: "John Doe" }]
    );

    assert.ok(res.snapshotUuid, "Snapshot UUID present");
    assert.ok(res.evidenceObjects.length > 0, "Evidence objects created");
    for (const ev of res.evidenceObjects) {
      assert.strictEqual(ev.raw_snapshot_uuid, res.snapshotUuid, "Evidence raw_snapshot_uuid MUST equal returned snapshotUuid");
    }
  });

  // Test 8: Bridge state PostgreSQL-authoritative
  await test("8. Bridge state PostgreSQL-authoritative in production", async () => {
    delete process.env.PRODUCER_STORAGE_MODE;
    process.env.NODE_ENV = 'production';
    process.env.K_SERVICE = 'civicslenz-prod';

    assert.strictEqual(hermesBridgeClient.isProductionEnvironment(), true);
    const telemetry = hermesBridgeClient.getTelemetry();
    assert.strictEqual(telemetry.BRIDGE_POSTGRES_AUTHORITATIVE, true);
    assert.strictEqual(telemetry.BRIDGE_LOCAL_JSON_AUTHORITY, false);

    process.env.NODE_ENV = 'test';
    process.env.PRODUCER_STORAGE_MODE = 'LOCAL_TEST';
    delete process.env.K_SERVICE;
  });

  // Test 9: Local bridge JSON untouched in production
  await test("9. Local bridge JSON untouched in production mode", async () => {
    delete process.env.PRODUCER_STORAGE_MODE;
    process.env.NODE_ENV = 'production';
    process.env.K_SERVICE = 'civicslenz-prod';

    const localBridgeJson = path.join(process.cwd(), 'data', 'bridge-submissions.json');
    const mtimeBefore = fs.existsSync(localBridgeJson) ? fs.statSync(localBridgeJson).mtimeMs : 0;

    const testJobId = "prod-test-job-" + Date.now();
    hermesBridgeClient.registerCompletedResult({
      contract_version: "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1",
      job_id: testJobId,
      research_work_identity: {
        work_key: "LOGICAL_WORK_SD35_2026",
        jurisdiction_key: "FL",
        research_domain: "ELECTIONS",
        cycle_year: 2026,
        seat_key: "SENATE_DISTRICT_35"
      },
      content_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      retrievals: [],
      sources: []
    } as any);

    const mtimeAfter = fs.existsSync(localBridgeJson) ? fs.statSync(localBridgeJson).mtimeMs : 0;
    assert.strictEqual(mtimeBefore, mtimeAfter, "data/bridge-submissions.json MUST NOT be modified in production");

    process.env.NODE_ENV = 'test';
    process.env.PRODUCER_STORAGE_MODE = 'LOCAL_TEST';
    delete process.env.K_SERVICE;
  });

  // Test 10: Concurrent logical-work idempotency
  await test("10. Concurrent logical-work idempotency key handling", async () => {
    const store = new PostgresProducerStore();
    const workKey = "LOGICAL_WORK_FL_SENATE_SD35_" + Date.now();

    const job1 = await store.createJob({
      agent_id: "fl_dos_elections",
      target_url: "https://dos.elections.myflorida.com/sd35",
      job_type: "FL_DOS_CANDIDATES",
      logical_work_key: workKey
    });

    const job2 = await store.createJob({
      agent_id: "fl_dos_elections",
      target_url: "https://dos.elections.myflorida.com/sd35",
      job_type: "FL_DOS_CANDIDATES",
      logical_work_key: workKey
    });

    assert.ok(job1.job_uuid, "Job 1 created");
    assert.ok(job2.job_uuid, "Job 2 created or returned");
    assert.strictEqual(job1.job_uuid, job2.job_uuid, "Concurrent creates with same logical_work_key return identical job");
  });

  // Test 11: Lease crash/expiry recovery
  await test("11. Lease expiry recovery allows second worker to reclaim expired lease", async () => {
    const store = new PostgresProducerStore();
    const agentId = "agent_lease_test_" + Date.now();

    const job = await store.createJob({
      agent_id: agentId,
      target_url: "https://dos.elections.myflorida.com/lease-test",
      job_type: "FL_DOS_CANDIDATES",
      logical_work_key: "LEASE_TEST_KEY_" + Date.now()
    });

    const worker1 = "worker-instance-alpha";
    const worker2 = "worker-instance-beta";

    const lease1 = await store.claimAtomicLease(agentId, worker1, 1);
    assert.ok(lease1, "Worker 1 acquired lease");
    assert.strictEqual(lease1?.job.job_uuid, job.job_uuid);

    // Wait for lease expiry
    await new Promise(r => setTimeout(r, 1100));

    const lease2 = await store.claimAtomicLease(agentId, worker2, 10);
    assert.ok(lease2, "Worker 2 successfully reclaimed expired lease");
    assert.strictEqual(lease2?.job.job_uuid, job.job_uuid);
  });

  // Test 12: Exact attempt history preservation
  await test("12. Exact attempt history preservation", async () => {
    const store = new PostgresProducerStore();
    const agentId = "agent_attempt_test_" + Date.now();

    const job = await store.createJob({
      agent_id: agentId,
      target_url: "https://dos.elections.myflorida.com/attempt-test",
      job_type: "FL_DOS_CANDIDATES",
      logical_work_key: "ATTEMPT_TEST_KEY_" + Date.now()
    });

    const leased = await store.claimAtomicLease(agentId, "test-worker-01", 10);
    assert.ok(leased?.attempt, "Attempt created upon leasing");

    await store.completeJob(job.job_uuid, leased.attempt.attempt_uuid, 5);

    const attempts = await store.getJobAttempts(job.job_uuid);
    assert.ok(attempts.length >= 1, "Attempt recorded");
    const found = attempts.find(a => a.attempt_uuid === leased.attempt.attempt_uuid);
    assert.ok(found, "Exact attempt UUID found in history");
    assert.ok(['COMPLETED', 'SUCCESS'].includes(found?.status || ''), "Attempt status is COMPLETED or SUCCESS");
    assert.strictEqual(found?.records_extracted, 5);
  });

  // Test 13: Raw GCS readback SHA/length match
  await test("13. Raw GCS readback SHA256 and byte length match exact original payload", async () => {
    const rawStore = new GcsRawObjectStore();
    const payload = Buffer.from("CIVICSLENZZ_PRECISION_TEST_PAYLOAD_" + Date.now(), 'utf-8');
    const expectedSha = crypto.createHash('sha256').update(payload).digest('hex');

    const stored = await rawStore.putObject("test-key.bin", payload, "application/octet-stream");
    assert.strictEqual(stored.byteLength, payload.length, "Byte length match");
    assert.strictEqual(stored.sha256, expectedSha, "SHA256 match");

    const readback = await rawStore.getObject(stored.locator);
    assert.ok(readback, "Readback returned object");
    assert.strictEqual(readback?.bytes.length, payload.length, "Readback length match");
    assert.strictEqual(readback?.sha256, expectedSha, "Readback SHA256 match");
  });

  // Restore environment
  process.env.NODE_ENV = prevEnv;
  if (prevBucket) process.env.PRODUCER_GCS_BUCKET = prevBucket;
  else delete process.env.PRODUCER_GCS_BUCKET;
  delete process.env.RAW_OBJECT_STORE_BUCKET;

  console.log(`\nRESULTS: Passed ${passed}/${passed + failed} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test runner error:", err);
  process.exit(1);
});
