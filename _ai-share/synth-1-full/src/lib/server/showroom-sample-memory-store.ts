/**
 * Демо-хранилище бирок шоурума (in-memory).
 * В проде: заменить на БД (Postgres) + TTL; в serverless — Redis или Durable Object.
 */
import type { ShowroomSampleTagPayloadV1 } from '@/lib/fashion/showroom-sample-tag';

export type ShowroomSampleStoredRecord = {
  payload: ShowroomSampleTagPayloadV1;
  createdAtMs: number;
};

const MAX_ENTRIES = 5000;
const store = new Map<string, ShowroomSampleStoredRecord>();
/** Порядок вставки для вытеснения FIFO */
const order: string[] = [];

function evictIfNeeded() {
  while (store.size >= MAX_ENTRIES && order.length > 0) {
    const k = order.shift();
    if (k) store.delete(k);
  }
}

export function showroomSampleMemoryPut(id: string, payload: ShowroomSampleTagPayloadV1): void {
  evictIfNeeded();
  if (!store.has(id)) order.push(id);
  store.set(id, { payload, createdAtMs: Date.now() });
}

export function showroomSampleMemoryGet(id: string): ShowroomSampleStoredRecord | null {
  return store.get(id) ?? null;
}

export function showroomSampleMemorySize(): number {
  return store.size;
}
