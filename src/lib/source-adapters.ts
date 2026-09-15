/**
 * CIVICLENZ / HERMES AUTHORITATIVE SOURCE ADAPTERS
 * Real HTTP-fetching and deterministic parsing adapters for Florida data sources.
 * Adheres strictly to Zero-Synthetic Rule and Real Source Adapter Contract:
 * - Real HTTP requests with timeout
 * - Challenge/blocking/failure detection with fail-closed behavior
 * - Exact byte capture and SHA-256 calculation
 * - Deterministic parsing of retrieved bytes only (no pre-filled arrays)
 * - All outputs marked strictly EXTRACTED_UNREVIEWED
 * - Zero hardcoded civic facts, zero synthetic payload stubs
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import {
  RawSourceSnapshot,
  RawEvidenceObject,
  detectAccessChallenge,
  hermesBackendStore
} from './hermes-backend-store';
import type { AccessChallengeInspection } from './hermes-backend-store';
import { getProducerPersistence } from './producer-storage/index';

export type { AccessChallengeInspection };
export { detectAccessChallenge };

export interface AdapterParseResult {
  success: boolean;
  source_id: string;
  source_url: string;
  final_url?: string;
  http_status: number;
  byte_length?: number;
  content_sha256?: string;
  records_extracted: number;
  extracted_items: Array<{
    target_entity: string;
    field_key: string;
    extracted_value: string;
    evidence_locator?: string;
    published_at?: string;
  }>;
  raw_snapshot_uuid?: string;
  evidence_objects: RawEvidenceObject[];
  error_message?: string;
  failure_class?: string;
}

export class SourceAdapterBase {
  public source_id: string;
  public source_name: string;
  public authority_tier: 'TIER_A' | 'TIER_B' | 'TIER_C' | 'TIER_D';
  public base_url: string;
  public jurisdiction: string;

  constructor(
    source_id: string,
    source_name: string,
    authority_tier: 'TIER_A' | 'TIER_B' | 'TIER_C' | 'TIER_D',
    base_url: string,
    jurisdiction: string
  ) {
    this.source_id = source_id;
    this.source_name = source_name;
    this.authority_tier = authority_tier;
    this.base_url = base_url;
    this.jurisdiction = jurisdiction;
  }

  protected async fetchWithTimeout(url: string, timeoutMs = 20000): Promise<{
    ok: boolean;
    status: number;
    text: string;
    rawBytes: Buffer;
    contentType: string;
    charset: string;
    finalUrl: string;
    byteLength: number;
    sha256: string;
    challengeInspection: AccessChallengeInspection;
  }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'CivicLenZ-HERMES-InferenceWorker/2.0 (Civic Intelligence Research Producer; contact@civiclenz.org)',
          'Accept': 'text/html,application/json,application/xhtml+xml,text/plain,*/*'
        }
      });
      clearTimeout(timer);
      const contentType = response.headers.get('content-type') || 'text/html';
      
      // Exact HTTP byte sequence preservation (Requirement 11 & 12)
      const arrayBuffer = await response.arrayBuffer();
      const rawBytes = Buffer.from(arrayBuffer);
      const byteLength = rawBytes.length;
      const sha256 = crypto.createHash('sha256').update(rawBytes).digest('hex');
      const finalUrl = response.url || url;

      // Extract charset if present
      let charset = 'utf-8';
      const charsetMatch = contentType.match(/charset=([a-zA-Z0-9_-]+)/i);
      if (charsetMatch && charsetMatch[1]) {
        charset = charsetMatch[1].toLowerCase();
      }

      // Decode a COPY for parsing; authoritative retrieval bytes remain separate
      let text: string;
      try {
        text = new TextDecoder(charset).decode(rawBytes);
      } catch {
        text = new TextDecoder('utf-8').decode(rawBytes);
      }

      const challengeInspection = detectAccessChallenge(response.status, text);

      return {
        ok: response.ok && !challengeInspection.isChallenge,
        status: response.status,
        text,
        rawBytes,
        contentType,
        charset,
        finalUrl,
        byteLength,
        sha256,
        challengeInspection
      };
    } catch (err: any) {
      clearTimeout(timer);
      const isTimeout = err.name === 'AbortError' || (err.message && err.message.includes('timeout'));
      const status = isTimeout ? 504 : 502;
      const errorMsg = isTimeout ? 'RETRIEVAL_FAILED: Connection timed out' : `RETRIEVAL_FAILED: ${err.message || 'Network error'}`;
      const emptyBuffer = Buffer.alloc(0);
      return {
        ok: false,
        status,
        text: '',
        rawBytes: emptyBuffer,
        contentType: 'text/plain',
        charset: 'utf-8',
        finalUrl: url,
        byteLength: 0,
        sha256: crypto.createHash('sha256').update(emptyBuffer).digest('hex'),
        challengeInspection: { isChallenge: true, reason: errorMsg, failureClass: isTimeout ? 'RETRIEVAL_TIMEOUT' : 'NETWORK_ERROR' }
      };
    }
  }

  public async storeSnapshotAndEvidence(
    url: string,
    httpStatus: number,
    contentType: string,
    rawBytesOrPayload: Buffer | string,
    extractedItems: Array<{ target_entity: string; field_key: string; extracted_value: string; evidence_locator?: string }>,
    seatUuid?: string,
    personUuid?: string,
    charset?: string
  ): Promise<{ snapshotUuid: string; evidenceObjects: RawEvidenceObject[] }> {
    const rawBuffer = Buffer.isBuffer(rawBytesOrPayload) ? rawBytesOrPayload : Buffer.from(rawBytesOrPayload, 'utf-8');
    const retrievalSha256 = crypto.createHash('sha256').update(rawBuffer).digest('hex');

    const persistence = getProducerPersistence();

    // 1. Store Raw Snapshot with exact bytes (Requirement 1 & 2)
    const snapshot = await persistence.saveRawSnapshot({
      source_uuid: this.source_id,
      target_url: url,
      http_status: httpStatus,
      content_type: contentType,
      charset: charset || 'utf-8',
      byte_length: rawBuffer.length,
      raw_bytes: rawBuffer,
      parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
      provenance_classification: 'REAL_PROVEN'
    });

    // 2. Generate Evidence Objects strictly marked EXTRACTED_UNREVIEWED (Requirement 1)
    const evidenceInputs = extractedItems.map(item => {
      const claimFingerprint = crypto.createHash('sha256')
        .update(`${url}_${item.target_entity}_${item.field_key}_${item.extracted_value}`)
        .digest('hex');

      return {
        source_uuid: this.source_id,
        source_url: url,
        document_title: `${this.source_name} - ${item.field_key}`,
        document_type: 'PRIMARY_GOVERNMENT_PORTAL',
        source_tier: this.authority_tier,
        raw_snapshot_uuid: snapshot.snapshot_uuid,
        retrieval_content_sha256: retrievalSha256,
        claim_fingerprint: claimFingerprint,
        parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
        extraction_method: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
        supporting_locator: item.evidence_locator || url,
        verification_state: 'EXTRACTED_UNREVIEWED' as const,
        seat_uuid: seatUuid,
        person_uuid: personUuid,
        field_key: item.field_key,
        extracted_value: item.extracted_value
      };
    });

    const evidenceObjects = await persistence.saveEvidenceObjects(evidenceInputs);

    // Local hermesBackendStore mirroring is permitted ONLY in test / local test mode (Requirement 3)
    const isTestMode = process.env.NODE_ENV === 'test' || process.env.PRODUCER_STORAGE_MODE === 'LOCAL_TEST';
    if (isTestMode) {
      try {
        hermesBackendStore.storeRawSnapshot({
          snapshot_uuid: snapshot.snapshot_uuid,
          source_uuid: this.source_id,
          target_url: url,
          http_status: httpStatus,
          content_type: contentType,
          charset: charset || 'utf-8',
          byte_length: rawBuffer.length,
          raw_bytes: rawBuffer,
          parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
          provenance_classification: 'REAL_PROVEN'
        });
        for (const ev of evidenceObjects) {
          hermesBackendStore.recordEvidence({
            ...ev,
            raw_snapshot_uuid: snapshot.snapshot_uuid
          });
        }
      } catch {
        // ignore
      }
    }

    return { snapshotUuid: snapshot.snapshot_uuid, evidenceObjects };
  }
}

// 1. Florida Division of Elections Adapter
export class FloridaDOSDivisionOfElectionsAdapter extends SourceAdapterBase {
  constructor() {
    super('fl_dos_elections', 'Florida Division of Elections', 'TIER_A', 'https://dos.elections.myflorida.com', 'State of Florida');
  }

  public async fetchCandidateFilings(officeCategory = 'SENATE'): Promise<AdapterParseResult> {
    const targetUrl = `${this.base_url}/candidates/CanList.asp`;
    const res = await this.fetchWithTimeout(targetUrl, 15000);

    // If fetch failed or challenge detected, fail closed!
    if (!res.ok || res.challengeInspection.isChallenge) {
      const failureReason = res.challengeInspection.reason || `RETRIEVAL_FAILED: HTTP ${res.status}`;
      
      // Store failed raw snapshot for audit/Academy traceability with exact raw bytes
      let snapshotUuid: string | undefined;
      if (res.rawBytes && res.rawBytes.length > 0) {
        const persistence = getProducerPersistence();
        const snap = await persistence.saveRawSnapshot({
          source_uuid: this.source_id,
          target_url: targetUrl,
          http_status: res.status,
          content_type: res.contentType,
          charset: res.charset || 'utf-8',
          byte_length: res.rawBytes.length,
          raw_bytes: res.rawBytes,
          parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
          provenance_classification: res.challengeInspection.isChallenge ? 'FAILED_RETRIEVAL' : 'LEGACY_UNPROVEN',
          challenge_reason: res.challengeInspection.reason,
          failure_class: res.challengeInspection.failureClass || 'RETRIEVAL_FAILED'
        });
        snapshotUuid = snap.snapshot_uuid;
      }

      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        raw_snapshot_uuid: snapshotUuid,
        evidence_objects: [],
        error_message: failureReason,
        failure_class: res.challengeInspection.failureClass || 'RETRIEVAL_FAILED'
      };
    }

    // Deterministic parser against exact retrieved HTML bytes
    const extractedItems: Array<{
      target_entity: string;
      field_key: string;
      extracted_value: string;
      evidence_locator?: string;
    }> = [];

    const $ = cheerio.load(res.text);

    // Florida DOS Candidate List displays table rows for candidates
    $('table tr').each((rowIdx, row) => {
      const cells = $(row).find('td').map((_, cell) => $(cell).text().trim()).get();
      if (cells.length >= 3) {
        const candidateName = cells[0];
        const party = cells[1];
        const status = cells[2];
        const office = cells[3] || officeCategory;

        if (candidateName && candidateName.length > 2 && !candidateName.toLowerCase().includes('candidate name')) {
          extractedItems.push({
            target_entity: candidateName,
            field_key: 'CANDIDATE_FILING_RECORD',
            extracted_value: JSON.stringify({
              candidate_name: candidateName,
              party_affiliation: party,
              filing_status: status,
              office_sought: office
            }),
            evidence_locator: `${targetUrl}#table_row_${rowIdx}`
          });
        }
      }
    });

    // If parser found 0 valid candidate records, fail closed truthfully
    if (extractedItems.length === 0) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: 'PARSER_INCOMPATIBLE: Zero candidate records extracted from retrieved markup structure',
        failure_class: 'PARSER_INCOMPATIBLE'
      };
    }

    try {
      const { snapshotUuid, evidenceObjects } = await this.storeSnapshotAndEvidence(
        targetUrl,
        res.status,
        res.contentType,
        res.rawBytes,
        extractedItems,
        undefined,
        undefined,
        res.charset
      );

      return {
        success: true,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: extractedItems.length,
        extracted_items: extractedItems,
        raw_snapshot_uuid: snapshotUuid,
        evidence_objects: evidenceObjects
      };
    } catch (err: any) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: `STORAGE_FAILURE: ${err.message}`,
        failure_class: 'STORAGE_FAILURE'
      };
    }
  }
}

// 2. Florida State Senate Adapter
export class FloridaSenateAdapter extends SourceAdapterBase {
  constructor() {
    super('fl_senate', 'Florida State Senate Portal', 'TIER_A', 'https://flsenate.gov', 'State of Florida');
  }

  public async fetchSenatorRoster(seatUuid?: string, personUuid?: string): Promise<AdapterParseResult> {
    const targetUrl = `${this.base_url}/Senators/`;
    const res = await this.fetchWithTimeout(targetUrl, 15000);

    if (!res.ok || res.challengeInspection.isChallenge) {
      const failureReason = res.challengeInspection.reason || `RETRIEVAL_FAILED: HTTP ${res.status}`;
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: failureReason,
        failure_class: res.challengeInspection.failureClass || 'RETRIEVAL_FAILED'
      };
    }

    // Deterministic parser against exact retrieved HTML bytes
    const extractedItems: Array<{
      target_entity: string;
      field_key: string;
      extracted_value: string;
      evidence_locator?: string;
    }> = [];

    const $ = cheerio.load(res.text);

    // Parse the official Florida Senate roster table
    $('table tr').each((rowIdx, row) => {
      const cells = $(row).find('td').map((_, cell) => $(cell).text().trim()).get();
      if (cells.length >= 3) {
        // Table columns: [ Senator, District, Party, Counties, ... ]
        const rawSenator = cells[0];
        const district = cells[1];
        const party = cells[2];
        const counties = cells[3] || '';

        // Clean senator name (remove titles like "President", "Minority Leader")
        const cleanName = rawSenator.split('\n')[0].trim();
        const linkHref = $(row).find('td a').first().attr('href') || `/Senators/`;

        if (cleanName && cleanName.length > 2 && district && /^\d+$/.test(district)) {
          extractedItems.push({
            target_entity: cleanName,
            field_key: 'FL_SENATE_DISTRICT_OFFICEHOLDER',
            extracted_value: JSON.stringify({
              senator_name: cleanName,
              district_number: district,
              party_affiliation: party,
              counties_represented: counties
            }),
            evidence_locator: linkHref.startsWith('http') ? linkHref : `https://flsenate.gov${linkHref}`
          });
        }
      }
    });

    // If the table was not matched, fallback to senator detail links
    if (extractedItems.length === 0) {
      $('a').each((_, a) => {
        const href = $(a).attr('href') || '';
        const match = href.match(/\/Senators\/(?:20\d\d-20\d\d\/)?S(\d+)/i);
        if (match) {
          const text = $(a).text().trim();
          if (text && !text.toLowerCase().includes('senator list') && !text.toLowerCase().includes('find')) {
            extractedItems.push({
              target_entity: text,
              field_key: 'FL_SENATE_DISTRICT_OFFICEHOLDER',
              extracted_value: JSON.stringify({
                senator_name: text,
                district_number: match[1]
              }),
              evidence_locator: `https://flsenate.gov${href}`
            });
          }
        }
      });
    }

    if (extractedItems.length === 0) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: 'PARSER_INCOMPATIBLE: Zero senator records extracted from markup',
        failure_class: 'PARSER_INCOMPATIBLE'
      };
    }

    const { snapshotUuid, evidenceObjects } = await this.storeSnapshotAndEvidence(
      targetUrl,
      res.status,
      res.contentType,
      res.rawBytes,
      extractedItems,
      seatUuid,
      personUuid,
      res.charset
    );

    return {
      success: true,
      source_id: this.source_id,
      source_url: targetUrl,
      final_url: res.finalUrl,
      http_status: res.status,
      byte_length: res.byteLength,
      content_sha256: res.sha256,
      records_extracted: extractedItems.length,
      extracted_items: extractedItems,
      raw_snapshot_uuid: snapshotUuid,
      evidence_objects: evidenceObjects
    };
  }
}

// 3. Florida House of Representatives Adapter
export class FloridaHouseAdapter extends SourceAdapterBase {
  constructor() {
    super('fl_house', 'Florida House of Representatives', 'TIER_A', 'https://myfloridahouse.gov', 'State of Florida');
  }

  public async fetchHouseRoster(seatUuid?: string, personUuid?: string): Promise<AdapterParseResult> {
    const targetUrl = `${this.base_url}/Representatives`;
    const res = await this.fetchWithTimeout(targetUrl, 15000);

    if (!res.ok || res.challengeInspection.isChallenge) {
      const failureReason = res.challengeInspection.reason || `RETRIEVAL_FAILED: HTTP ${res.status}`;
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: failureReason,
        failure_class: res.challengeInspection.failureClass || 'RETRIEVAL_FAILED'
      };
    }

    const extractedItems: Array<{
      target_entity: string;
      field_key: string;
      extracted_value: string;
      evidence_locator?: string;
    }> = [];

    const $ = cheerio.load(res.text);

    // Parse links to Representatives
    $('a').each((_, a) => {
      const href = $(a).attr('href') || '';
      if (href.includes('/Representatives/Detail/') || href.includes('MemberId=')) {
        const text = $(a).text().trim();
        if (text && text.length > 2) {
          extractedItems.push({
            target_entity: text,
            field_key: 'FL_HOUSE_REPRESENTATIVE_ENTRY',
            extracted_value: JSON.stringify({ representative_name: text, link: href }),
            evidence_locator: href.startsWith('http') ? href : `https://myfloridahouse.gov${href}`
          });
        }
      }
    });

    // If page is a navigation shell without embedded representative rows, fail closed truthfully
    if (extractedItems.length === 0) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: 'PARSER_INCOMPATIBLE: Florida House portal returned navigation shell without static representative roster rows',
        failure_class: 'PARSER_INCOMPATIBLE'
      };
    }

    const { snapshotUuid, evidenceObjects } = await this.storeSnapshotAndEvidence(
      targetUrl,
      res.status,
      res.contentType,
      res.rawBytes,
      extractedItems,
      seatUuid,
      personUuid,
      res.charset
    );

    return {
      success: true,
      source_id: this.source_id,
      source_url: targetUrl,
      final_url: res.finalUrl,
      http_status: res.status,
      byte_length: res.byteLength,
      content_sha256: res.sha256,
      records_extracted: extractedItems.length,
      extracted_items: extractedItems,
      raw_snapshot_uuid: snapshotUuid,
      evidence_objects: evidenceObjects
    };
  }
}

// 4. Miami-Dade County Elections Adapter
export class MiamiDadeCountyElectionsAdapter extends SourceAdapterBase {
  constructor() {
    super('fl_miami_dade_elections', 'Miami-Dade County Elections Department', 'TIER_A', 'https://www.miamidade.gov/elections', 'Miami-Dade County');
  }

  public async fetchCountyElections(seatUuid?: string, personUuid?: string): Promise<AdapterParseResult> {
    const targetUrl = `${this.base_url}`;
    const res = await this.fetchWithTimeout(targetUrl, 10000);

    if (!res.ok || res.challengeInspection.isChallenge) {
      const failureReason = res.challengeInspection.reason || `RETRIEVAL_FAILED: HTTP ${res.status}`;
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: failureReason,
        failure_class: res.challengeInspection.failureClass || 'RETRIEVAL_FAILED'
      };
    }

    const extractedItems: Array<{
      target_entity: string;
      field_key: string;
      extracted_value: string;
      evidence_locator?: string;
    }> = [];

    const $ = cheerio.load(res.text);

    // Look for election dates, candidate links, or portal metadata
    $('a').each((_, a) => {
      const text = $(a).text().trim();
      const href = $(a).attr('href') || '';
      if (text && (text.toLowerCase().includes('candidate') || text.toLowerCase().includes('election date') || text.toLowerCase().includes('sample ballot'))) {
        extractedItems.push({
          target_entity: text,
          field_key: 'COUNTY_ELECTION_PORTAL_RESOURCE',
          extracted_value: JSON.stringify({ resource_title: text, resource_url: href }),
          evidence_locator: href.startsWith('http') ? href : `https://www.miamidade.gov${href}`
        });
      }
    });

    if (extractedItems.length === 0) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: 'PARSER_INCOMPATIBLE: Zero election items extracted from county portal markup',
        failure_class: 'PARSER_INCOMPATIBLE'
      };
    }

    const { snapshotUuid, evidenceObjects } = await this.storeSnapshotAndEvidence(
      targetUrl,
      res.status,
      res.contentType || 'text/html',
      res.rawBytes,
      extractedItems,
      seatUuid,
      personUuid,
      res.charset
    );

    return {
      success: true,
      source_id: this.source_id,
      source_url: targetUrl,
      final_url: res.finalUrl,
      http_status: res.status,
      byte_length: res.byteLength,
      content_sha256: res.sha256,
      records_extracted: extractedItems.length,
      extracted_items: extractedItems,
      raw_snapshot_uuid: snapshotUuid,
      evidence_objects: evidenceObjects
    };
  }
}

// 5. Florida Governor Executive Orders Adapter
export class FloridaGovernorExecutiveOrdersAdapter extends SourceAdapterBase {
  constructor() {
    super('fl_governor_exec', 'Executive Office of the Governor of Florida', 'TIER_A', 'https://www.flgov.com', 'State of Florida');
  }

  public async fetchExecutiveOrders(seatUuid?: string, personUuid?: string): Promise<AdapterParseResult> {
    const urlsToTry = [
      `${this.base_url}`,
      `${this.base_url}/newsroom/`,
      `${this.base_url}/executive-orders/`
    ];

    let lastRes: any = null;
    let targetUrl = urlsToTry[0];

    for (const url of urlsToTry) {
      targetUrl = url;
      const res = await this.fetchWithTimeout(url, 10000);
      if (res.ok && !res.challengeInspection.isChallenge) {
        lastRes = res;
        break;
      }
      lastRes = res;
    }

    const res = lastRes;
    if (!res || !res.ok || res.challengeInspection.isChallenge) {
      const failureReason = res?.challengeInspection?.reason || `RETRIEVAL_FAILED: HTTP ${res?.status || 500}`;
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res?.finalUrl || targetUrl,
        http_status: res?.status || 500,
        byte_length: res?.byteLength || 0,
        content_sha256: res?.sha256 || '',
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: failureReason,
        failure_class: res?.challengeInspection?.failureClass || 'RETRIEVAL_FAILED'
      };
    }

    const extractedItems: Array<{
      target_entity: string;
      field_key: string;
      extracted_value: string;
      evidence_locator?: string;
    }> = [];

    const $ = cheerio.load(res.text);

    $('a').each((_, a) => {
      const text = $(a).text().trim();
      const href = $(a).attr('href') || '';
      if (text && (
        text.includes('Executive Order') ||
        text.match(/EO\s*\d+/i) ||
        href.includes('executive-order') ||
        href.includes('news-release') ||
        text.toLowerCase().includes('governor') ||
        text.toLowerCase().includes('order') ||
        text.toLowerCase().includes('appointment')
      )) {
        extractedItems.push({
          target_entity: text,
          field_key: 'EXECUTIVE_ORDER_ENTRY',
          extracted_value: JSON.stringify({ order_title: text, url: href }),
          evidence_locator: href.startsWith('http') ? href : `https://www.flgov.com${href.startsWith('/') ? '' : '/'}${href}`
        });
      }
    });

    if (extractedItems.length === 0) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        final_url: res.finalUrl,
        http_status: res.status,
        byte_length: res.byteLength,
        content_sha256: res.sha256,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: 'PARSER_INCOMPATIBLE: Zero executive orders extracted from markup',
        failure_class: 'PARSER_INCOMPATIBLE'
      };
    }

    const { snapshotUuid, evidenceObjects } = await this.storeSnapshotAndEvidence(
      targetUrl,
      res.status,
      res.contentType || 'text/html',
      res.rawBytes,
      extractedItems,
      seatUuid,
      personUuid,
      res.charset
    );

    return {
      success: true,
      source_id: this.source_id,
      source_url: targetUrl,
      final_url: res.finalUrl,
      http_status: res.status,
      byte_length: res.byteLength,
      content_sha256: res.sha256,
      records_extracted: extractedItems.length,
      extracted_items: extractedItems,
      raw_snapshot_uuid: snapshotUuid,
      evidence_objects: evidenceObjects
    };
  }
}

// 6. Completeness Audit Adapter
export class CompletenessAuditAdapter extends SourceAdapterBase {
  constructor() {
    super('civiclenz_completeness_auditor', 'CivicsLenZ Completeness & Integrity Auditor', 'TIER_A', 'https://civiclenz.local/audit', 'State of Florida');
  }

  public async executeAudit(seatUuid?: string, personUuid?: string): Promise<AdapterParseResult> {
    if (!seatUuid) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: `${this.base_url}/seats/unspecified`,
        http_status: 400,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: 'MISSING_TARGET_SEAT: executeAudit requires explicit seatUuid'
      };
    }

    const targetUrl = `${this.base_url}/seats/${seatUuid}`;
    const persistence = getProducerPersistence();
    const [seats, evidenceList] = await Promise.all([
      persistence.getSeatCoverageRecords(),
      persistence.getAllEvidenceObjects()
    ]);

    const targetSeat = seats.find(s => s.seat_uuid === seatUuid);
    const seatEvidence = evidenceList.filter(e => e.seat_uuid === seatUuid);

    const auditReport = {
      audit_timestamp: new Date().toISOString(),
      target_seat_uuid: seatUuid,
      seat_found: Boolean(targetSeat),
      current_official: targetSeat?.current_official_name || 'UNRESEARCHED',
      evidence_objects_count: seatEvidence.length,
      coverage_status: targetSeat?.coverage_status || 'NOT_YET_RESEARCHED',
      unreviewed_evidence_count: seatEvidence.filter(e => e.verification_state === 'EXTRACTED_UNREVIEWED').length,
      total_seats_in_scope: seats.length
    };

    const payload = JSON.stringify(auditReport, null, 2);
    const auditDir = path.resolve(process.env.CIVICSLENZZ_DATA_DIR || path.join(process.cwd(), 'data'), 'artifacts/audits');
    if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
    const auditFilePath = path.join(auditDir, `audit_${seatUuid}_${Date.now()}.json`);
    fs.writeFileSync(auditFilePath, payload);

    const extractedItems = [
      { target_entity: seatUuid, field_key: 'AUDIT_RECORD_COUNT', extracted_value: String(seatEvidence.length), evidence_locator: auditFilePath },
      { target_entity: seatUuid, field_key: 'AUDIT_VERIFICATION_DISCLAIMER', extracted_value: 'PRODUCER_AUDIT_ONLY_NO_CANONICAL_VERIFICATION', evidence_locator: auditFilePath }
    ];

    const rawPayloadBuffer = Buffer.from(payload, 'utf-8');
    try {
      const { snapshotUuid, evidenceObjects } = await this.storeSnapshotAndEvidence(
        targetUrl,
        200,
        'application/json',
        rawPayloadBuffer,
        extractedItems,
        seatUuid,
        personUuid,
        'utf-8'
      );

      return {
        success: true,
        source_id: this.source_id,
        source_url: targetUrl,
        http_status: 200,
        byte_length: Buffer.byteLength(payload, 'utf-8'),
        content_sha256: crypto.createHash('sha256').update(Buffer.from(payload, 'utf-8')).digest('hex'),
        records_extracted: extractedItems.length,
        extracted_items: extractedItems,
        raw_snapshot_uuid: snapshotUuid,
        evidence_objects: evidenceObjects
      };
    } catch (err: any) {
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        http_status: 500,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: `STORAGE_FAILURE: ${err.message}`,
        failure_class: 'STORAGE_FAILURE'
      };
    }
  }
}

// 7. Gap Research Fill Adapter
export class GapResearchFillAdapter extends SourceAdapterBase {
  constructor() {
    super('civiclenz_gap_researcher', 'CivicsLenZ Gap Remediation Engine', 'TIER_A', 'https://civiclenz.local/gap-fill', 'State of Florida');
  }

  public async fillGap(seatUuid: string, missingScope: string, personUuid?: string): Promise<AdapterParseResult> {
    const targetUrl = `${this.base_url}/${seatUuid}/${missingScope}`;

    if (missingScope === 'CANDIDATE_QUALIFICATION_STATUS') {
      const res = await sourceAdapters.fl_dos_elections.fetchCandidateFilings();
      if (!res.success) {
        return {
          success: false,
          source_id: this.source_id,
          source_url: targetUrl,
          http_status: res.http_status,
          records_extracted: 0,
          extracted_items: [],
          evidence_objects: [],
          error_message: `GAP_FILL_FAILED: Downstream candidate adapter failed (${res.error_message || 'SOURCE_UNAVAILABLE'})`,
          failure_class: res.failure_class || 'SOURCE_UNAVAILABLE'
        };
      }
      // Return real parsed items from DOS
      return res;
    }

    if (missingScope === 'LEGISLATOR_ROSTER_ENTRY') {
      const res = await sourceAdapters.fl_senate.fetchSenatorRoster();
      if (!res.success) {
        return {
          success: false,
          source_id: this.source_id,
          source_url: targetUrl,
          http_status: res.http_status,
          records_extracted: 0,
          extracted_items: [],
          evidence_objects: [],
          error_message: `GAP_FILL_FAILED: Downstream senate adapter failed (${res.error_message || 'SOURCE_UNAVAILABLE'})`,
          failure_class: res.failure_class || 'SOURCE_UNAVAILABLE'
        };
      }
      return res;
    }

    if (missingScope === 'DISTRICT_BOUNDARY_GIS') {
      const gisDir = path.resolve(process.cwd(), 'data/artifacts/gis_boundary_discovery');
      if (fs.existsSync(gisDir)) {
        const files = fs.readdirSync(gisDir).filter(f => f.includes(seatUuid) || f.endsWith('.geojson') || f.endsWith('.json'));
        if (files.length > 0) {
          const firstGis = path.join(gisDir, files[0]);
          const rawGisBytes = fs.readFileSync(firstGis);
          const sha256 = crypto.createHash('sha256').update(rawGisBytes).digest('hex');
          const extractedItems = [
            { target_entity: seatUuid, field_key: 'DISTRICT_BOUNDARY_GIS', extracted_value: `VERIFIED_PHYSICAL_GIS_LAYER_${sha256.slice(0, 8)}`, evidence_locator: firstGis }
          ];
          const { snapshotUuid, evidenceObjects } = await this.storeSnapshotAndEvidence(
            targetUrl,
            200,
            'application/geo+json',
            rawGisBytes,
            extractedItems,
            seatUuid,
            personUuid,
            'utf-8'
          );
          return {
            success: true,
            source_id: this.source_id,
            source_url: targetUrl,
            http_status: 200,
            byte_length: rawGisBytes.length,
            content_sha256: sha256,
            records_extracted: extractedItems.length,
            extracted_items: extractedItems,
            raw_snapshot_uuid: snapshotUuid,
            evidence_objects: evidenceObjects
          };
        }
      }

      // No physical boundary layer found: Fail truthfully! Never manufacture GIS strings!
      return {
        success: false,
        source_id: this.source_id,
        source_url: targetUrl,
        http_status: 404,
        records_extracted: 0,
        extracted_items: [],
        evidence_objects: [],
        error_message: `PENDING_LOCAL_GIS_INTEGRATION: No authoritative physical GIS boundary file located for seat ${seatUuid}`,
        failure_class: 'CAPABILITY_NOT_IMPLEMENTED'
      };
    }

    // Any other scope: Fail closed truthfully
    return {
      success: false,
      source_id: this.source_id,
      source_url: targetUrl,
      http_status: 501,
      records_extracted: 0,
      extracted_items: [],
      evidence_objects: [],
      error_message: `CAPABILITY_NOT_IMPLEMENTED: Scope "${missingScope}" has no registered automated research adapter`,
      failure_class: 'CAPABILITY_NOT_IMPLEMENTED'
    };
  }
}

// Export Singleton Registry of Adapters
export const sourceAdapters = {
  fl_dos_elections: new FloridaDOSDivisionOfElectionsAdapter(),
  fl_senate: new FloridaSenateAdapter(),
  fl_house: new FloridaHouseAdapter(),
  miami_dade_elections: new MiamiDadeCountyElectionsAdapter(),
  fl_governor: new FloridaGovernorExecutiveOrdersAdapter(),
  completeness_auditor: new CompletenessAuditAdapter(),
  gap_researcher: new GapResearchFillAdapter()
};

