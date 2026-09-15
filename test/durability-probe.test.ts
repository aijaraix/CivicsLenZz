import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { createDurabilityProbeRouter, DURABILITY_PROBE_UUID } from '../src/lib/durability-probe';

const savedEnv = { ...process.env };
const payload = Buffer.from('CIVICSLENZZ_DURABILITY_PROBE_V1');
let row: any = null;
let bytes = Buffer.from(payload);
let writes = 0;
let reads = 0;
let fallback = false;
let writeFailure = false;
let readFailure = false;
const health = {
  storageMode: 'CLOUD_SQL_POSTGRES_R2', postgresConfigured: true,
  postgresConnected: true, postgresSchemaReady: true, rawObjectStorageConfigured: true,
  rawObjectStorageConnected: true, localFallbackEnabled: false, daemonActive: true,
};
const persistence = {
  checkHealth: async () => ({ ...health }),
  getRawSnapshot: async () => { reads++; return row && { ...row }; },
  saveRawSnapshot: async (input: any) => {
    writes++;
    if (writeFailure) throw new Error('secret-must-not-leak');
    assert.equal(input.snapshot_uuid, DURABILITY_PROBE_UUID);
    assert.equal(input.provenance_classification, 'UNKNOWN');
    assert.deepEqual(input.raw_bytes, payload);
    bytes = Buffer.from(input.raw_bytes);
    row = { ...input, raw_bytes: undefined, byte_length: bytes.length,
      payload_sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      object_locator: `r2://probe-test/${input.raw_bytes_path}`,
      raw_bytes_path: `r2://probe-test/${input.raw_bytes_path}` };
    // Must re-read persisted metadata instead of trusting the save return value.
    return { ...row, payload_sha256: 'incorrect-return-value' };
  },
};
const raw = {
  isLocalFallbackEnabled: () => fallback,
  getObject: async (locator: string) => {
    if (readFailure) throw new Error('secret-must-not-leak');
    assert.equal(locator, row.object_locator);
    return { bytes, contentType: 'application/octet-stream', sha256: 'not-trusted' };
  },
};
const app = express();
app.use(express.json());
app.use('/probe', createDurabilityProbeRouter(persistence, raw));
// New router instance shares durable fixtures, not in-process probe state.
app.use('/recovery', createDurabilityProbeRouter(persistence, raw));
const server = app.listen(0, '127.0.0.1');
await new Promise<void>(resolve => server.once('listening', resolve));
const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
async function request(path = '/probe', method = 'POST') {
  const response = await fetch(origin + path, { method,
    ...(method === 'POST' ? { headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ raw_bytes: 'CIVIC INPUT REJECTED', snapshot_uuid: 'other', target_url: 'https://invalid.test' }) } : {}),
  });
  return { status: response.status, body: await response.json() };
}
try {
  process.env.NODE_ENV = 'production';
  delete process.env.PRODUCER_STORAGE_MODE;
  process.env.R2_BUCKET = 'probe-test';
  delete process.env.DURABILITY_PROBE_ENABLED;
  assert.equal((await request()).status, 404);
  process.env.DURABILITY_PROBE_ENABLED = 'TRUE';
  assert.equal((await request()).status, 404);
  assert.equal(reads + writes, 0);
  process.env.DURABILITY_PROBE_ENABLED = 'true';
  assert.equal((await request('/probe/other', 'GET')).status, 404);
  assert.equal(reads, 0);
  assert.equal((await request(`/probe/${DURABILITY_PROBE_UUID}`, 'GET')).status, 404);
  assert.equal(writes, 0);
  for (const key of ['postgresConnected', 'postgresSchemaReady', 'rawObjectStorageConnected', 'daemonActive'] as const) {
    health[key] = false;
    assert.equal((await request()).status, 503);
    health[key] = true;
  }
  fallback = true;
  assert.equal((await request()).status, 503);
  fallback = false;
  process.env.PRODUCER_STORAGE_MODE = 'LOCAL_TEST';
  assert.equal((await request()).status, 503);
  delete process.env.PRODUCER_STORAGE_MODE;
  assert.equal(writes, 0);
  writeFailure = true;
  assert.deepEqual((await request()).body, { error: 'DURABILITY_PROBE_FAILED' });
  writeFailure = false;
  writes = 0;
  const results = await Promise.all(Array.from({ length: 8 }, () => request()));
  for (const result of results) {
    assert.equal(result.status, 200);
    assert.equal(result.body.byte_length_equal, true);
    assert.equal(result.body.sha256_equal, true);
    assert.equal(result.body.fixed_payload_equal, true);
    assert.equal(result.body.postgres_byte_length, payload.length);
    assert.equal(result.body.local_fallback_enabled, false);
  }
  assert.equal(writes, 1);
  assert.equal((await request()).status, 200);
  assert.equal((await request(`/recovery/${DURABILITY_PROBE_UUID}`, 'GET')).status, 200);
  assert.equal(writes, 1);
  const goodRow = { ...row };
  row.payload_sha256 = 'corrupt';
  assert.equal((await request()).status, 409);
  row = { ...goodRow, source_uuid: 'civic-source' };
  assert.deepEqual((await request()).body, { error: 'PROBE_LINEAGE_MISMATCH' });
  row = goodRow;
  bytes = Buffer.from('bad');
  assert.equal((await request()).status, 409);
  bytes = Buffer.from(payload);
  readFailure = true;
  assert.deepEqual((await request(`/probe/${DURABILITY_PROBE_UUID}`, 'GET')).body, { error: 'DURABILITY_PROBE_FAILED' });
  readFailure = false;
  process.env.DURABILITY_PROBE_ENABLED = 'false';
  assert.equal((await request()).status, 404);
  assert.equal((await request(`/probe/${DURABILITY_PROBE_UUID}`, 'GET')).status, 404);
  assert.equal(writes, 1);
  console.log('Durability probe focused tests PASS (isolated fixtures; not physical production proof).');
} finally {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
  Object.assign(process.env, savedEnv);
}
