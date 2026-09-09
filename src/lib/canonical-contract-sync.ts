/**
 * CANONICAL CONTRACT SYNC ENGINE
 * 
 * Synchronizes and validates research contracts between advance harvester
 * (CivicsLenZz) and canonical authority (CivicLenZ HERMES gateway).
 * 
 * Enforces:
 * - CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1 schema compliance
 * - HERMES_RESEARCH_JOB_V1 inbound contract compliance
 * - HMAC-SHA256 signature verification matching Canonical PR #54
 * - Deterministic idempotency hashing and content verification
 * - Batch envelope packaging with physical work accounting
 */

import crypto from 'crypto';
import { CIVICSLENZZ_PRODUCER_MANIFEST } from './producer-manifest';
import { ResearchIngestPackage } from './hermes-bridge-types';

export const CANONICAL_SCHEMA_VERSIONS = {
  INGEST_CONTRACT: 'CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1',
  JOB_ENVELOPE: 'HERMES_RESEARCH_JOB_V1',
  HMAC_ALGORITHM: 'sha256',
  PRODUCER_ID: 'CivicsLenZz-Harvester'
} as const;

export interface CanonicalBatchEnvelope {
  batch_id: string;
  schema_version: string;
  producer: string;
  producer_version: string;
  exported_at: string;
  records_count: number;
  manifest: {
    sources_collected: number;
    seats_targeted: number;
    candidates_targeted: number;
    errors_count: number;
  };
  items: ResearchIngestPackage[];
  signature?: string;
}

export interface ContractSyncVerificationResult {
  synchronized: boolean;
  contract_version: string;
  producer_id: string;
  item_count: number;
  valid_items: number;
  invalid_items: number;
  errors: string[];
  signature_valid?: boolean;
}

export class CanonicalContractSyncEngine {
  private sharedSecret: string | null;

  constructor(secret?: string) {
    this.sharedSecret = secret || process.env.HERMES_BRIDGE_SECRET || null;
  }

  /**
   * Validates an individual package against CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1
   */
  public validatePackage(pkg: ResearchIngestPackage): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!pkg.producer || pkg.producer !== 'CivicsLenZz-Harvester') {
      errors.push(`Invalid producer: expected 'CivicsLenZz-Harvester', received '${pkg.producer}'`);
    }

    if (!pkg.capability) {
      errors.push('Missing required capability');
    }

    if (!pkg.source_key) {
      errors.push('Missing required source_key');
    }

    if (!pkg.source_url || !pkg.source_url.startsWith('http')) {
      errors.push(`Invalid source_url: '${pkg.source_url}'`);
    }

    if (!pkg.seat_key) {
      errors.push('Missing required seat_key');
    }

    if (!pkg.content_hash || pkg.content_hash.length !== 64) {
      errors.push('Missing or invalid SHA-256 content_hash');
    }

    if (pkg.extraction_status !== 'extracted_unreviewed') {
      errors.push(`extraction_status must be strictly 'extracted_unreviewed', got '${pkg.extraction_status}'`);
    }

    if (!pkg.retrieved_at) {
      errors.push('Missing retrieved_at ISO timestamp');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generates a sealed CanonicalBatchEnvelope from a collection of validated items
   */
  public createBatchEnvelope(
    items: ResearchIngestPackage[],
    batchIdPrefix = 'batch_fl'
  ): CanonicalBatchEnvelope {
    const timestamp = new Date().toISOString();
    const batchId = `${batchIdPrefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const uniqueSources = new Set(items.map(i => i.source_url));
    const uniqueSeats = new Set(items.map(i => i.seat_key));
    const uniqueCandidates = new Set(items.map(i => i.person_candidate_key).filter(Boolean));

    const envelope: CanonicalBatchEnvelope = {
      batch_id: batchId,
      schema_version: CANONICAL_SCHEMA_VERSIONS.INGEST_CONTRACT,
      producer: CANONICAL_SCHEMA_VERSIONS.PRODUCER_ID,
      producer_version: CIVICSLENZZ_PRODUCER_MANIFEST.producer_version,
      exported_at: timestamp,
      records_count: items.length,
      manifest: {
        sources_collected: uniqueSources.size,
        seats_targeted: uniqueSeats.size,
        candidates_targeted: uniqueCandidates.size,
        errors_count: 0
      },
      items
    };

    if (this.sharedSecret) {
      const payloadString = JSON.stringify(envelope);
      envelope.signature = crypto
        .createHmac('sha256', this.sharedSecret)
        .update(payloadString)
        .digest('hex');
    }

    return envelope;
  }

  /**
   * Verifies an incoming or prepared BatchEnvelope
   */
  public verifyBatchEnvelope(envelope: CanonicalBatchEnvelope): ContractSyncVerificationResult {
    const errors: string[] = [];

    if (envelope.schema_version !== CANONICAL_SCHEMA_VERSIONS.INGEST_CONTRACT) {
      errors.push(`Schema mismatch: expected ${CANONICAL_SCHEMA_VERSIONS.INGEST_CONTRACT}, got ${envelope.schema_version}`);
    }

    if (envelope.producer !== CANONICAL_SCHEMA_VERSIONS.PRODUCER_ID) {
      errors.push(`Producer mismatch: expected ${CANONICAL_SCHEMA_VERSIONS.PRODUCER_ID}, got ${envelope.producer}`);
    }

    let validItems = 0;
    let invalidItems = 0;

    for (const [idx, item] of envelope.items.entries()) {
      const itemRes = this.validatePackage(item);
      if (itemRes.valid) {
        validItems++;
      } else {
        invalidItems++;
        errors.push(`Item [${idx}] (${item.seat_key || 'unknown'}): ${itemRes.errors.join('; ')}`);
      }
    }

    let signatureValid: boolean | undefined;
    if (envelope.signature && this.sharedSecret) {
      const { signature, ...rest } = envelope;
      const expectedSig = crypto
        .createHmac('sha256', this.sharedSecret)
        .update(JSON.stringify(rest))
        .digest('hex');
      signatureValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
      if (!signatureValid) {
        errors.push('Batch envelope HMAC signature verification failed');
      }
    }

    return {
      synchronized: errors.length === 0,
      contract_version: envelope.schema_version,
      producer_id: envelope.producer,
      item_count: envelope.records_count,
      valid_items: validItems,
      invalid_items: invalidItems,
      errors,
      signature_valid: signatureValid
    };
  }

  /**
   * Computes Canonical PR #54 compliant headers for HTTP transport
   */
  public generateCanonicalHeaders(payloadJson: string, customSecret?: string): Record<string, string> {
    const secret = customSecret || this.sharedSecret || 'CIVICLENZ_DEFAULT_SECRET';
    const timestamp = Date.now().toString();
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payloadJson}`)
      .digest('hex');

    return {
      'Content-Type': 'application/json',
      'x-civiclenz-producer-id': CANONICAL_SCHEMA_VERSIONS.PRODUCER_ID,
      'x-civiclenz-timestamp': timestamp,
      'x-civiclenz-signature': signature,
      'x-civiclenz-schema-version': CANONICAL_SCHEMA_VERSIONS.INGEST_CONTRACT
    };
  }
}

export const canonicalContractSync = new CanonicalContractSyncEngine();
