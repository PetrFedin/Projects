/**
 * Wave D6 · P3-AIMS-ALLOC — allocation queue per wholesaleOrderId (pillar 3 brand post-confirm).
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

export type AllocationLine = {
  sku: string;
  qtyOrdered: number;
  qtyAllocated: number;
  locationId?: string;
  locationLabel?: string;
};

export type AllocationQueueRecord = {
  wholesaleOrderId: string;
  collectionId: string;
  status: 'queued' | 'in_progress' | 'allocated' | 'partial';
  platform: 'aims360' | 'syntha';
  lines: AllocationLine[];
  updatedAt: string;
};

type FileV1 = {
  schemaVersion: 1;
  byOrderId: Record<string, AllocationQueueRecord>;
  queueOrder: string[];
};

const EMPTY: FileV1 = { schemaVersion: 1, byOrderId: {}, queueOrder: [] };

function pathFile(): string {
  return (
    process.env.B2B_ALLOCATION_QUEUE_FILE?.trim() ||
    path.join(process.cwd(), 'data', 'b2b-allocation-queue.json')
  );
}

function load(): FileV1 {
  try {
    const j = JSON.parse(fs.readFileSync(pathFile(), 'utf8')) as FileV1;
    if (j?.schemaVersion !== 1) return { ...EMPTY };
    return {
      schemaVersion: 1,
      byOrderId: j.byOrderId ?? {},
      queueOrder: j.queueOrder ?? [],
    };
  } catch {
    return { ...EMPTY };
  }
}

function save(data: FileV1): void {
  const p = pathFile();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  void import('./spine-operational-persistence.pg')
    .then((m) => m.mirrorAllocationSnapshotToPg(data))
    .catch(() => {});
}

/** PG hydrate: replace full snapshot (idempotent). */
export function replaceAllocationQueueSnapshot(data: FileV1): void {
  save(data);
}

export function upsertAllocationQueue(record: AllocationQueueRecord): AllocationQueueRecord {
  const data = load();
  data.byOrderId[record.wholesaleOrderId] = record;
  if (!data.queueOrder.includes(record.wholesaleOrderId)) {
    data.queueOrder.unshift(record.wholesaleOrderId);
  }
  save(data);
  return record;
}

export function getAllocationQueue(wholesaleOrderId: string): AllocationQueueRecord | undefined {
  return load().byOrderId[wholesaleOrderId.trim()];
}

export function listAllocationQueue(limit = 20): AllocationQueueRecord[] {
  const data = load();
  return data.queueOrder
    .slice(0, limit)
    .map((id) => data.byOrderId[id])
    .filter(Boolean);
}
