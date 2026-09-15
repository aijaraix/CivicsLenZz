/**
 * PRODUCER-OWNED RAW OBJECT STORAGE (GCS)
 * 
 * Manages raw retrieval byte streams in Google Cloud Storage.
 * Retains exact raw bytes, computes SHA-256, and returns durable object locators.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Storage } from '@google-cloud/storage';

export interface RawObjectStore {
  putObject(
    locator: string,
    bytes: Buffer,
    contentType?: string
  ): Promise<{ locator: string; byteLength: number; sha256: string }>;

  getObject(locator: string): Promise<{ bytes: Buffer; contentType: string; sha256: string } | null>;

  checkHealth(): Promise<{ ok: boolean; configured: boolean; bucketName?: string; localFallbackEnabled: boolean; error?: string }>;

  isLocalFallbackEnabled(): boolean;
  isConfigured(): boolean;
}

export class GcsRawObjectStore implements RawObjectStore {
  private storage: Storage | null = null;
  private bucketName: string;
  private localFallbackDir: string | null = null;
  private configured: boolean = false;

  constructor() {
    this.bucketName = (process.env.PRODUCER_GCS_BUCKET || process.env.GCS_BUCKET || 'civicslenzz-producer-artifacts').trim();

    if (this.isProductionEnvironment()) {
      try {
        this.storage = new Storage();
        this.configured = Boolean(process.env.PRODUCER_GCS_BUCKET || process.env.GCS_BUCKET || process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE);
      } catch (e: any) {
        console.warn('[GcsRawObjectStore] Cloud Storage SDK initialization warning:', e.message);
        this.configured = false;
      }
    } else {
      // Local / test mode only
      const dataDir = process.env.CIVICSLENZZ_DATA_DIR || path.join(process.cwd(), 'data');
      this.localFallbackDir = path.join(dataDir, 'artifacts', 'retrievals');
      if (!fs.existsSync(this.localFallbackDir)) {
        fs.mkdirSync(this.localFallbackDir, { recursive: true });
      }
      this.configured = true;
    }
  }

  public isProductionEnvironment(): boolean {
    if (process.env.NODE_ENV === 'test' || process.env.PRODUCER_STORAGE_MODE === 'LOCAL_TEST') {
      return false;
    }
    return process.env.NODE_ENV === 'production' || Boolean(process.env.K_SERVICE || process.env.K_REVISION || process.env.PRODUCER_GCS_BUCKET);
  }

  public isConfigured(): boolean {
    return this.configured;
  }

  public isLocalFallbackEnabled(): boolean {
    return !this.isProductionEnvironment();
  }

  public async putObject(
    locator: string,
    bytes: Buffer,
    contentType: string = 'text/html'
  ): Promise<{ locator: string; byteLength: number; sha256: string }> {
    const byteLength = bytes.length;
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const cleanLocator = locator.replace(/^gs:\/\/[^/]+\//, '').replace(/^\/+/, '');

    if (this.isProductionEnvironment()) {
      if (!this.storage || !this.configured) {
        throw new Error(`[GcsRawObjectStore] PRODUCTION FAIL-CLOSED: GCS storage is not configured (bucket=${this.bucketName})`);
      }

      try {
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(cleanLocator);
        await file.save(bytes, {
          contentType,
          metadata: {
            sha256,
            byteLength: String(byteLength),
            uploadedAt: new Date().toISOString()
          },
          resumable: false
        });

        return {
          locator: `gs://${this.bucketName}/${cleanLocator}`,
          byteLength,
          sha256
        };
      } catch (err: any) {
        console.error(`[GcsRawObjectStore] PRODUCTION GCS put failed:`, err.message);
        throw new Error(`[GcsRawObjectStore] PRODUCTION FAIL-CLOSED: GCS object write failed for ${cleanLocator}: ${err.message}`);
      }
    }

    // Local persistent artifact fallback for tests / local dev ONLY
    const targetDir = this.localFallbackDir || path.join(process.cwd(), 'data', 'artifacts', 'retrievals');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const filename = path.basename(cleanLocator);
    const localPath = path.join(targetDir, filename);
    fs.writeFileSync(localPath, bytes);

    return {
      locator: `artifacts/retrievals/${filename}`,
      byteLength,
      sha256
    };
  }

  public async getObject(locator: string): Promise<{ bytes: Buffer; contentType: string; sha256: string } | null> {
    const cleanLocator = locator.replace(/^gs:\/\/[^/]+\//, '').replace(/^\/+/, '');

    if (this.isProductionEnvironment()) {
      if (!this.storage || !this.configured) {
        throw new Error(`[GcsRawObjectStore] PRODUCTION FAIL-CLOSED: GCS storage not configured`);
      }
      try {
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(cleanLocator);
        const [content] = await file.download();
        const [metadata] = await file.getMetadata().catch(() => [{}]);
        const sha256 = crypto.createHash('sha256').update(content).digest('hex');
        return {
          bytes: content,
          contentType: (metadata as any)?.contentType || 'application/octet-stream',
          sha256
        };
      } catch (err: any) {
        console.warn(`[GcsRawObjectStore] GCS get failed for ${cleanLocator}:`, err.message);
        return null;
      }
    }

    // Local read for tests / dev
    const targetDir = this.localFallbackDir || path.join(process.cwd(), 'data', 'artifacts', 'retrievals');
    const filename = path.basename(cleanLocator);
    const localPath = path.join(targetDir, filename);
    if (fs.existsSync(localPath)) {
      const bytes = fs.readFileSync(localPath);
      const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
      return {
        bytes,
        contentType: 'text/html',
        sha256
      };
    }

    return null;
  }

  public async checkHealth(): Promise<{ ok: boolean; configured: boolean; bucketName?: string; localFallbackEnabled: boolean; error?: string }> {
    const localFallbackEnabled = this.isLocalFallbackEnabled();

    if (this.isProductionEnvironment()) {
      if (!this.storage || !this.configured) {
        return {
          ok: false,
          configured: false,
          bucketName: this.bucketName,
          localFallbackEnabled: false,
          error: 'GCS Storage SDK not configured or credentials missing in production'
        };
      }

      try {
        const [exists] = await this.storage.bucket(this.bucketName).exists();
        if (!exists) {
          return {
            ok: false,
            configured: true,
            bucketName: this.bucketName,
            localFallbackEnabled: false,
            error: `Bucket gs://${this.bucketName} does not exist or is inaccessible`
          };
        }
        return {
          ok: true,
          configured: true,
          bucketName: this.bucketName,
          localFallbackEnabled: false
        };
      } catch (err: any) {
        return {
          ok: false,
          configured: true,
          bucketName: this.bucketName,
          localFallbackEnabled: false,
          error: `GCS bucket probe error: ${err.message}`
        };
      }
    }

    // In local / test mode
    return {
      ok: true,
      configured: true,
      bucketName: 'local_test_bucket',
      localFallbackEnabled: true
    };
  }
}
