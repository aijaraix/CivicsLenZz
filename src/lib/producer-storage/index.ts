/**
 * CIVICSLENZZ UNIFIED PRODUCER PERSISTENCE MODULE
 * 
 * Single authoritative factory for the producer storage engine.
 * Ensures production uses ONLY PostgresProducerStore + GcsRawObjectStore.
 */

import type { ProducerPersistence, StorageHealthInfo } from './storage-interface';
import { PostgresProducerStore } from './postgres-producer-store';
import { GcsRawObjectStore, type RawObjectStore } from './raw-object-store';

let producerStoreInstance: ProducerPersistence | null = null;
let rawObjectStoreInstance: RawObjectStore | null = null;

export function getRawObjectStore(): RawObjectStore {
  if (!rawObjectStoreInstance) {
    rawObjectStoreInstance = new GcsRawObjectStore();
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
  GcsRawObjectStore
};
