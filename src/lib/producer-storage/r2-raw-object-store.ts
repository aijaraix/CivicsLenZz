import crypto from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { GcsRawObjectStore, type RawObjectStore } from './raw-object-store';

// The legacy adapter is used exclusively for explicitly opted-in local tests.
export class R2RawObjectStore implements RawObjectStore {
  private readonly bucket = (process.env.R2_BUCKET || '').trim();
  private readonly local: RawObjectStore | null;
  private readonly client: S3Client | null;

  constructor() {
    const localAllowed = process.env.NODE_ENV === 'test' || process.env.PRODUCER_STORAGE_MODE === 'LOCAL_TEST';
    this.local = localAllowed ? new GcsRawObjectStore() : null;
    const account = (process.env.R2_ACCOUNT_ID || '').trim();
    const endpoint = (process.env.R2_ENDPOINT || '').trim();
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const valid = /^[a-f0-9]{32}$/i.test(account)
      && endpoint === 'https://' + account + '.r2.cloudflarestorage.com'
      && /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(this.bucket)
      && Boolean(accessKeyId && secretAccessKey);
    this.client = !localAllowed && valid ? new S3Client({
      endpoint, region: 'auto', maxAttempts: 2,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! }
    }) : null;
  }

  isConfigured(): boolean { return Boolean(this.local || this.client); }
  isLocalFallbackEnabled(): boolean { return this.local !== null; }

  private key(locator: string): string {
    let key = locator;
    if (key.startsWith('r2://')) {
      const prefix = 'r2://' + this.bucket + '/';
      if (!key.startsWith(prefix)) throw new Error('R2 locator bucket mismatch');
      key = key.slice(prefix.length);
    }
    if (!key || key.startsWith('/') || key.includes('://') || key.includes('\\')
      || key.split('/').some(part => part === '.' || part === '..')
      || /[\x00-\x1f]/.test(key)) throw new Error('Invalid R2 object key');
    return key;
  }

  private requiredClient(): S3Client {
    if (!this.client) throw new Error('R2 fail-closed: runtime configuration missing or invalid');
    return this.client;
  }

  async putObject(locator: string, bytes: Buffer, contentType = 'application/octet-stream') {
    if (this.local) return this.local.putObject(locator, bytes, contentType);
    const client = this.requiredClient();
    const key = this.key(locator);
    // Snapshot the caller buffer so mutations during await cannot change the payload.
    const payload = Buffer.from(bytes);
    const sha256 = crypto.createHash('sha256').update(payload).digest('hex');
    const byteLength = payload.length;
    const durableLocator = 'r2://' + this.bucket + '/' + key;
    try {
      await client.send(new PutObjectCommand({
        Bucket: this.bucket, Key: key, Body: payload,
        ContentType: contentType, ContentLength: byteLength,
        Metadata: { sha256, 'byte-length': String(byteLength) }
      }), { abortSignal: AbortSignal.timeout(30000) });
      const readback = await this.getObject(durableLocator);
      if (!readback || readback.bytes.length !== byteLength || readback.sha256 !== sha256) {
        throw new Error('Integrity mismatch');
      }
      return { locator: durableLocator, byteLength, sha256 };
    } catch {
      // Never propagate SDK errors containing request headers or credentials.
      throw new Error('R2 fail-closed: write/readback verification failed');
    }
  }

  async getObject(locator: string) {
    if (this.local) return this.local.getObject(locator);
    const client = this.requiredClient();
    const key = this.key(locator);
    try {
      const result = await client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { abortSignal: AbortSignal.timeout(30000) });
      if (!result.Body) throw new Error('Missing object body');
      const bytes = Buffer.from(await result.Body.transformToByteArray());
      const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
      if (result.ContentLength !== bytes.length
        || result.Metadata?.sha256 !== sha256
        || result.Metadata?.['byte-length'] !== String(bytes.length)) {
        throw new Error('Integrity mismatch');
      }
      return { bytes, sha256, contentType: result.ContentType || 'application/octet-stream' };
    } catch {
      throw new Error('R2 fail-closed: read or integrity verification failed');
    }
  }

  async checkHealth() {
    if (this.local) return this.local.checkHealth();
    const base = { configured: this.isConfigured(), bucketName: this.bucket, localFallbackEnabled: false };
    if (!this.client) return { ...base, ok: false, error: 'R2 runtime configuration missing or invalid' };
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }),
        { abortSignal: AbortSignal.timeout(10000) });
      return { ...base, ok: true };
    } catch {
      return { ...base, ok: false, error: 'R2 bucket inaccessible' };
    }
  }
}
