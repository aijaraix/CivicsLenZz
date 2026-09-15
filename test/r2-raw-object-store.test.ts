import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { R2RawObjectStore } from '../src/lib/producer-storage/r2-raw-object-store';

const saved = { ...process.env };
const originalSend = S3Client.prototype.send;
let object: any;
let fail = false;
let corrupt = false;
let writes = 0;
try {
  process.env.NODE_ENV = 'production';
  delete process.env.PRODUCER_STORAGE_MODE;
  process.env.R2_ACCOUNT_ID = 'a'.repeat(32);
  process.env.R2_ENDPOINT = 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com';
  process.env.R2_BUCKET = 'civicslenzz-producer-evidence';
  process.env.R2_ACCESS_KEY_ID = 'test-only-access-key';
  process.env.R2_SECRET_ACCESS_KEY = 'test-only-secret';

  // SDK transport fixture only; these tests are NOT physical R2 acceptance.
  (S3Client.prototype as any).send = async (command: any) => {
    if (fail) throw new Error('SIMULATED_ACCESS_DENIED_SECRET_MUST_NOT_ESCAPE');
    if (command instanceof HeadBucketCommand) return {};
    if (command instanceof PutObjectCommand) {
      writes++;
      object = { ...command.input, Body: Buffer.from(command.input.Body) };
      return {};
    }
    if (command instanceof GetObjectCommand) return {
      ContentLength: object.Body.length,
      ContentType: object.ContentType,
      Metadata: object.Metadata,
      Body: { transformToByteArray: async () => corrupt ? Buffer.from('corrupt') : object.Body }
    };
    throw new Error('Unexpected command');
  };

  const store = new R2RawObjectStore();
  assert.equal(store.isConfigured(), true);
  assert.equal(store.isLocalFallbackEnabled(), false);
  assert.equal((await store.checkHealth()).ok, true);
  const bytes = Buffer.from([0, 255, 128, 13, 10, 65, 0]);
  const digest = crypto.createHash('sha256').update(bytes).digest('hex');
  const uuid = crypto.randomUUID();
  const result = await store.putObject('snapshots/' + uuid + '.raw', bytes);
  assert.equal(result.locator, 'r2://civicslenzz-producer-evidence/snapshots/' + uuid + '.raw');
  assert.equal(result.byteLength, bytes.length);
  assert.equal(result.sha256, digest);
  const readback = await store.getObject(result.locator);
  assert.deepEqual(readback?.bytes, bytes);
  assert.equal(readback?.sha256, digest);
  assert.equal(writes, 1);

  corrupt = true;
  await assert.rejects(store.putObject('corrupt.raw', bytes), /write\/readback verification failed/);
  await assert.rejects(store.getObject(result.locator), /integrity verification failed/);
  corrupt = false;

  fail = true;
  assert.equal((await store.checkHealth()).ok, false);
  await assert.rejects(store.putObject('denied.raw', bytes), /write\/readback verification failed/);
  await assert.rejects(store.getObject(result.locator), /read or integrity verification failed/);
  fail = false;
  await assert.rejects(store.getObject('r2://another-bucket/test'), /bucket mismatch/);
  await assert.rejects(store.putObject('../escape', bytes), /Invalid R2 object key/);
  await assert.rejects(store.getObject('gs://old-bucket/test'), /Invalid R2 object key/);

  for (const key of ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ENDPOINT']) {
    const value = process.env[key];
    delete process.env[key];
    const missing = new R2RawObjectStore();
    assert.equal(missing.isConfigured(), false);
    assert.equal(missing.isLocalFallbackEnabled(), false);
    assert.equal((await missing.checkHealth()).ok, false);
    await assert.rejects(missing.putObject('missing.raw', bytes), /fail-closed/);
    await assert.rejects(missing.getObject('missing.raw'), /fail-closed/);
    process.env[key] = value;
  }
  process.env.R2_ENDPOINT = 'https://example.invalid';
  assert.equal(new R2RawObjectStore().isConfigured(), false);
  console.log('R2 transport fixture checks passed; physical R2 proof remains required.');
} finally {
  S3Client.prototype.send = originalSend;
  for (const key of Object.keys(process.env)) if (!(key in saved)) delete process.env[key];
  Object.assign(process.env, saved);
}
