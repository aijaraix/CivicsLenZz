/**
 * CIVICSLENZZ UNIFIED PRODUCER PERSISTENCE MODULE
 * 
 * Single authoritative factory for the producer storage engine.
 * Ensures production uses ONLY PostgresProducerStore + R2RawObjectStore.
 */

import type { ProducerPersistence, StorageHealthInfo } from './storage-interface';
import { PostgresProducerStore } from './postgres-producer-store';
import { GcsRawObjectStore, type RawObjectStore } from './raw-object-store';

import { R2RawObjectStore } from './r2-raw-object-store';

let producerStoreInstance: ProducerPersistence | null = null;
let rawObjectStoreInstance: RawObjectStore | null = null;

export function getRawObjectStore(): RawObjectStore {
  if (!rawObjectStoreInstance) {
    rawObjectStoreInstance = new R2RawObjectStore();
  }
  return rawObjectStoreInstance;
}

export function getProducerPersistence(): ProducerPersistence {
  if (!producerStoreInstance) {
    const rawStore = getRawObjectStore();
    producerStoreInstance = new PostgresProducerStore(rawStore);
  }
  return producerStoreInstance;
}

export type {
  ProducerPersistence,
  StorageHealthInfo,
  RawObjectStore
};

export {
  PostgresProducerStore,
  GcsRawObjectStore,
  R2RawObjectStore
};
