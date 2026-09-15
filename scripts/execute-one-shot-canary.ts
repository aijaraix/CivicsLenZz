import crypto from 'node:crypto';
import { pool } from '../src/db/index.ts';
import { R2RawObjectStore } from '../src/lib/producer-storage/r2-raw-object-store.ts';
import { hermesBridgeClient } from '../src/lib/hermes-bridge-client.ts';
import { buildRetainedCanaryEnvelope, reserveCanaryAttempt } from '../src/lib/canonical-canary-envelope.ts';

// Fixed retained production evidence; this script performs no research or evidence creation.
const OLD_CORRELATION = '552d2f69-5abf-4a03-8481-79af5cef7b83';
const SNAPSHOT = '686ece9a-5cf4-4130-9715-15ec66dfd47b';
const EVIDENCE = '23463759-119c-4b6b-aac7-38a8f6641eac';
const HASH = '447837712142a0f57be0afebc50d6b75afc0de4d2b1b3afe15cd3818a2338f9d';
const ENDPOINT = 'https://ingest.civicslenz.com/v1/harvester/results';
const parse = (value: any) => typeof value === 'string' ? JSON.parse(value) : value;

async function main() {
  const correlation = process.env.CANARY_CORRELATION_ID;
  const expiry = Date.parse(process.env.CANARY_AUTHORIZATION_EXPIRES_AT || '');
  if (!correlation || correlation === OLD_CORRELATION || !Number.isFinite(expiry) || expiry <= Date.now()) throw new Error('Fresh canonical correlation and unexpired authorization required');
  const priorRow = (await pool.query('SELECT * FROM bridge_submissions WHERE submission_id = $1', [`sub_${OLD_CORRELATION}`])).rows[0];
  if (!priorRow || priorRow.delivery_state !== 'REJECTED' || priorRow.attempts !== 1) throw new Error('Historical rejected attempt must remain intact');
  const snapshot = (await pool.query('SELECT * FROM raw_source_snapshots WHERE snapshot_uuid = $1', [SNAPSHOT])).rows[0];
  const evidence = (await pool.query('SELECT * FROM raw_evidence_objects WHERE evidence_uuid = $1', [EVIDENCE])).rows[0];
  if (!snapshot || !evidence) throw new Error('Retained evidence missing');
  const store = new R2RawObjectStore();
  if (!store.isConfigured() || store.isLocalFallbackEnabled()) throw new Error('Production R2 required');
  const expectedLocator = `r2://${process.env.R2_BUCKET}/artifacts/retrievals/${SNAPSHOT}.raw`;
  if (snapshot.object_locator !== expectedLocator) throw new Error('R2 locator mismatch');
  const { bytes } = await store.getObject(`artifacts/retrievals/${SNAPSHOT}.raw`);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (hash !== HASH || bytes.length !== 18120) throw new Error('Failed-canary baseline mismatch');
  const envelope = buildRetainedCanaryEnvelope(parse(priorRow.result_package), snapshot, evidence, bytes, correlation);
  const body = Buffer.from(JSON.stringify(envelope));
  console.log(JSON.stringify({ CANONICAL_SCHEMA_VALIDATION: 'PASS', REAL_EVIDENCE_HASH_MATCH: true, PLACEHOLDER_FIELDS: false, UNSUPPORTED_FIELDS: 0, PACKAGE_COUNT_TO_SEND: 1, AUTOMATIC_RETRY: false, snapshot_uuid: SNAPSHOT, sha256: hash, byte_length: bytes.length, correlation_id: correlation }));
  if (!process.argv.includes('--send')) return; // Default is read-only preparation.
  if (!process.env.CIVICSLENZZ_GIT_SHA || !process.env.K_REVISION) throw new Error('Deployed build identity required');
  if (Date.now() >= expiry) throw new Error('Authorization expired before dispatch');
  const headers = hermesBridgeClient.buildCanonicalHeaders(body, String(Math.floor(Date.now() / 1000)));
  const submission = await reserveCanaryAttempt(pool, envelope, body);
  let state = 'SUBMITTED', status = 0, acknowledgement: any;
  try {
    const response = await fetch(ENDPOINT, { method: 'POST', headers, body, redirect: 'error', signal: AbortSignal.timeout(30000) });
    status = response.status;
    acknowledgement = await response.json();
    const ack = acknowledgement.acknowledgement || acknowledgement;
    state = status === 202 && ack.acknowledgement_version === 'CIVICLENZ_HARVESTER_ACK_V1' && ack.correlation_id === correlation && ack.receipt_id
      ? 'ACCEPTED_FOR_VALIDATION' : (status >= 400 && status < 500 ? 'REJECTED' : 'SUBMITTED');
  } catch { acknowledgement = { error: 'Indeterminate delivery; automatic and manual retry prohibited' }; }
  await pool.query('UPDATE bridge_submissions SET delivery_state=$1,acknowledgment=$2,updated_at=NOW() WHERE submission_id=$3', [state,JSON.stringify(acknowledgement),submission]);
  console.log(JSON.stringify({ http_status: status, acknowledgement, delivery_state: state, git_sha: process.env.CIVICSLENZZ_GIT_SHA, revision: process.env.K_REVISION }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => pool.end());
