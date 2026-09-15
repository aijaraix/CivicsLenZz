import { Router } from 'express';
import crypto from 'node:crypto';
import type { ProducerPersistence } from './producer-storage/storage-interface';
import type { RawObjectStore } from './producer-storage/raw-object-store';

const PAYLOAD = 'CIVICSLENZZ_DURABILITY_PROBE_V1';
const BYTES = Buffer.from(PAYLOAD, 'utf8');
const SHA = crypto.createHash('sha256').update(BYTES).digest('hex');
// Deterministic UUID-shaped identity reserved solely for this infrastructure probe.
export const DURABILITY_PROBE_UUID = `${SHA.slice(0, 8)}-${SHA.slice(8, 12)}-8${SHA.slice(13, 16)}-a${SHA.slice(17, 20)}-${SHA.slice(20, 32)}`;
const SOURCE = 'infra-durability-probe-v1';
const TARGET = 'urn:civicslenzz:infrastructure:durability-probe:v1';
const KEY = `infrastructure/durability-probe/${DURABILITY_PROBE_UUID}.raw`;

// Dependencies deliberately expose no evidence, job, bridge, or canonical operations.
export function createDurabilityProbeRouter(
  persistence: Pick<ProducerPersistence, 'checkHealth' | 'getRawSnapshot' | 'saveRawSnapshot'>,
  raw: Pick<RawObjectStore, 'getObject' | 'isLocalFallbackEnabled'>,
) {
  const router = Router();
  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    if (process.env.DURABILITY_PROBE_ENABLED !== 'true') {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    next();
  });

  async function requireProduction() {
    if (process.env.NODE_ENV === 'test' || process.env.PRODUCER_STORAGE_MODE === 'LOCAL_TEST'
      || raw.isLocalFallbackEnabled()) throw new Error('PRODUCTION_STORAGE_REQUIRED');
    const h = await persistence.checkHealth();
    if (h.storageMode !== 'CLOUD_SQL_POSTGRES_R2' || !h.postgresConnected
      || !h.postgresSchemaReady || !h.rawObjectStorageConnected || h.localFallbackEnabled
      || !h.daemonActive) throw new Error('PRODUCTION_STORAGE_REQUIRED');
  }

  async function verify(create: boolean) {
    await requireProduction();
    let snapshot = await persistence.getRawSnapshot(DURABILITY_PROBE_UUID);
    if (!snapshot && create) {
      await persistence.saveRawSnapshot({
        snapshot_uuid: DURABILITY_PROBE_UUID,
        source_uuid: SOURCE,
        target_url: TARGET,
        http_status: 200,
        content_type: 'application/octet-stream',
        charset: 'utf-8',
        parser_version: PAYLOAD,
        provenance_classification: 'UNKNOWN',
        raw_bytes_path: KEY,
        raw_bytes: Buffer.from(BYTES),
      });
      // Read PostgreSQL back; never report an uncommitted input as database proof.
      snapshot = await persistence.getRawSnapshot(DURABILITY_PROBE_UUID);
    }
    if (!snapshot) return { status: 404, body: { error: 'PROBE_NOT_FOUND' } };
    const expectedLocator = `r2://${process.env.R2_BUCKET}/${KEY}`;
    if (snapshot.snapshot_uuid !== DURABILITY_PROBE_UUID || snapshot.source_uuid !== SOURCE
      || snapshot.target_url !== TARGET || snapshot.parser_version !== PAYLOAD
      || snapshot.provenance_classification !== 'UNKNOWN'
      || snapshot.object_locator !== expectedLocator || snapshot.raw_bytes_path !== expectedLocator) {
      return { status: 409, body: { error: 'PROBE_LINEAGE_MISMATCH' } };
    }
    const object = await raw.getObject(expectedLocator);
    if (!object) throw new Error('PROBE_READ_FAILED');
    const readbackSha = crypto.createHash('sha256').update(object.bytes).digest('hex');
    const byteEqual = snapshot.byte_length === object.bytes.length;
    const hashEqual = snapshot.payload_sha256 === readbackSha;
    const fixedPayloadEqual = object.bytes.equals(BYTES) && readbackSha === SHA;
    const ok = byteEqual && hashEqual && fixedPayloadEqual;
    return { status: ok ? 200 : 409, body: {
      snapshot_uuid: snapshot.snapshot_uuid,
      r2_object_locator: snapshot.object_locator,
      postgres_byte_length: snapshot.byte_length,
      postgres_sha256: snapshot.payload_sha256,
      r2_readback_byte_length: object.bytes.length,
      r2_readback_sha256: readbackSha,
      byte_length_equal: byteEqual,
      sha256_equal: hashEqual,
      fixed_payload_equal: fixedPayloadEqual,
      local_fallback_enabled: false,
      status: ok ? 'VERIFIED' : 'INTEGRITY_MISMATCH',
      service: process.env.K_SERVICE || 'UNKNOWN',
      revision: process.env.K_REVISION || 'UNKNOWN',
      git_sha: process.env.CIVICSLENZZ_GIT_SHA || process.env.GIT_SHA || process.env.VITE_GIT_SHA || 'UNKNOWN',
    } };
  }

  // Coalesce concurrent requests within a process. Across replicas the same key,
  // payload, and PostgreSQL primary key keep cardinality bounded to one each.
  let inFlight: ReturnType<typeof verify> | undefined;
  router.post('/', async (_req, res) => {
    try {
      const operation = inFlight || (inFlight = verify(true));
      try {
        const result = await operation;
        res.status(result.status).json(result.body);
      } finally {
        if (inFlight === operation) inFlight = undefined;
      }
    } catch {
      res.status(503).json({ error: 'DURABILITY_PROBE_FAILED' });
    }
  });
  router.get('/:snapshot_uuid', async (req, res) => {
    if (req.params.snapshot_uuid !== DURABILITY_PROBE_UUID) {
      res.status(404).json({ error: 'PROBE_NOT_FOUND' });
      return;
    }
    try {
      const result = await verify(false);
      res.status(result.status).json(result.body);
    } catch {
      res.status(503).json({ error: 'DURABILITY_PROBE_FAILED' });
    }
  });
  return router;
}
