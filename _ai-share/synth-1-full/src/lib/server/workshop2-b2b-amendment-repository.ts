import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import {
  isWorkshop2B2bAmendmentStatus,
  type Workshop2B2bAmendmentRecord,
  type Workshop2B2bAmendmentStatus,
} from '@/lib/production/workshop2-b2b-amendment';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';

const memoryByOrder = new Map<string, Workshop2B2bAmendmentRecord[]>();
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-b2b-amendments.json');
let fileHydrated = false;

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test' && !isWorkshop2PgOnlyMode();
}

function hydrateFileIfNeeded(): void {
  if (fileHydrated) return;
  fileHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) as Record<
      string,
      Workshop2B2bAmendmentRecord[]
    >;
    if (parsed && typeof parsed === 'object') {
      for (const [orderId, rows] of Object.entries(parsed)) {
        if (Array.isArray(rows)) memoryByOrder.set(orderId, rows);
      }
    }
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    const obj = Object.fromEntries(memoryByOrder.entries());
    fs.writeFileSync(STORE_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

function sortNewestFirst(rows: Workshop2B2bAmendmentRecord[]): Workshop2B2bAmendmentRecord[] {
  return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listWorkshop2B2bAmendmentsForOrder(
  orderId: string
): Promise<Workshop2B2bAmendmentRecord[]> {
  const id = orderId.trim();
  if (!id) return [];
  hydrateFileIfNeeded();
  return sortNewestFirst(memoryByOrder.get(id) ?? []);
}

export async function getWorkshop2B2bAmendmentById(
  orderId: string,
  amendmentId: string
): Promise<Workshop2B2bAmendmentRecord | null> {
  const rows = await listWorkshop2B2bAmendmentsForOrder(orderId);
  return rows.find((r) => r.id === amendmentId.trim()) ?? null;
}

export async function getPendingWorkshop2B2bAmendment(
  orderId: string
): Promise<Workshop2B2bAmendmentRecord | null> {
  const rows = await listWorkshop2B2bAmendmentsForOrder(orderId);
  return rows.find((r) => r.status === 'pending') ?? null;
}

export async function createWorkshop2B2bAmendment(
  record: Workshop2B2bAmendmentRecord
): Promise<Workshop2B2bAmendmentRecord> {
  hydrateFileIfNeeded();
  const orderId = record.orderId.trim();
  const existing = memoryByOrder.get(orderId) ?? [];
  memoryByOrder.set(orderId, [record, ...existing]);
  flushFile();
  return record;
}

export async function patchWorkshop2B2bAmendment(input: {
  orderId: string;
  amendmentId: string;
  status: Workshop2B2bAmendmentStatus;
  resolvedBy?: string;
  resolutionNoteRu?: string;
}): Promise<Workshop2B2bAmendmentRecord | null> {
  hydrateFileIfNeeded();
  const orderId = input.orderId.trim();
  const amendmentId = input.amendmentId.trim();
  if (!isWorkshop2B2bAmendmentStatus(input.status)) return null;

  const rows = memoryByOrder.get(orderId) ?? [];
  const idx = rows.findIndex((r) => r.id === amendmentId);
  if (idx < 0) return null;

  const now = new Date().toISOString();
  const next: Workshop2B2bAmendmentRecord = {
    ...rows[idx]!,
    status: input.status,
    updatedAt: now,
    resolvedBy: input.resolvedBy?.trim() || rows[idx]!.resolvedBy,
    resolutionNoteRu: input.resolutionNoteRu?.trim() || rows[idx]!.resolutionNoteRu,
  };
  const updated = [...rows];
  updated[idx] = next;
  memoryByOrder.set(orderId, updated);
  flushFile();
  return next;
}
