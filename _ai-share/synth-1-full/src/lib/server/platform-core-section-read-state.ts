import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { buildPgSectionVisitKey } from '@/lib/communications/pg-contextual-section-read-state';
import {
  listWorkshop2B2bOrderSectionReadKeys,
  upsertWorkshop2B2bOrderSectionReadState,
} from '@/lib/server/workshop2-contextual-read-state-repository';
import {
  shouldPlatformCorePersistAuxiliaryToFile,
  shouldPlatformCoreReadAuxiliaryFromFile,
} from '@/lib/server/platform-core-pg-primary-file-policy';

export type PlatformCoreSectionReadRecord = {
  actorId: string;
  orderId: string;
  pillarId: string;
  sectionId: string;
  readAt: string;
};

const STORE_FILE = path.join(process.cwd(), 'data', 'platform-core-section-read-state.json');
const memoryByActorOrder = new Map<string, PlatformCoreSectionReadRecord[]>();

function actorOrderKey(actorId: string, orderId: string): string {
  return `${actorId.trim()}::${orderId.trim()}`;
}

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test';
}

function mergeFromDisk(): void {
  if (!canUseDiskPersistence() || !shouldPlatformCoreReadAuxiliaryFromFile()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) as Record<
      string,
      PlatformCoreSectionReadRecord[]
    >;
    if (!parsed || typeof parsed !== 'object') return;
    for (const [key, records] of Object.entries(parsed)) {
      if (!Array.isArray(records)) continue;
      const existing = memoryByActorOrder.get(key) ?? [];
      const byVisitKey = new Map(
        existing.map((r) => [buildPgSectionVisitKey(r.orderId, r.pillarId, r.sectionId), r])
      );
      for (const r of records) {
        byVisitKey.set(buildPgSectionVisitKey(r.orderId, r.pillarId, r.sectionId), r);
      }
      memoryByActorOrder.set(key, [...byVisitKey.values()]);
    }
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence() || !shouldPlatformCorePersistAuxiliaryToFile()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify(Object.fromEntries(memoryByActorOrder), null, 2),
      'utf8'
    );
  } catch {
    /* best-effort */
  }
}

export async function markPlatformCoreSectionRead(input: {
  actorId: string;
  orderId: string;
  pillarId: string;
  sectionId: string;
  organizationId?: string;
}): Promise<PlatformCoreSectionReadRecord> {
  const actorId = input.actorId.trim();
  const orderId = input.orderId.trim();
  const pillarId = input.pillarId.trim();
  const sectionId = input.sectionId.trim();
  if (!actorId || !orderId || !pillarId || !sectionId) {
    throw new Error('actorId, orderId, pillarId and sectionId are required');
  }

  mergeFromDisk();
  const bucketKey = actorOrderKey(actorId, orderId);
  const visitKey = buildPgSectionVisitKey(orderId, pillarId, sectionId);
  const existing = memoryByActorOrder.get(bucketKey) ?? [];
  const found = existing.find(
    (r) => buildPgSectionVisitKey(r.orderId, r.pillarId, r.sectionId) === visitKey
  );
  if (found) {
    await upsertWorkshop2B2bOrderSectionReadState({
      organizationId: input.organizationId,
      actorId,
      sectionVisitKey: visitKey,
    }).catch(() => {
      /* best-effort PG mirror */
    });
    return found;
  }

  const record: PlatformCoreSectionReadRecord = {
    actorId,
    orderId,
    pillarId,
    sectionId,
    readAt: new Date().toISOString(),
  };
  memoryByActorOrder.set(bucketKey, [...existing, record]);
  flushFile();

  await upsertWorkshop2B2bOrderSectionReadState({
    organizationId: input.organizationId,
    actorId,
    sectionVisitKey: visitKey,
  }).catch(() => {
    /* best-effort PG mirror */
  });

  return record;
}

export function isPlatformCoreSectionRead(input: {
  actorId: string;
  orderId: string;
  pillarId: string;
  sectionId: string;
}): boolean {
  mergeFromDisk();
  const bucketKey = actorOrderKey(input.actorId, input.orderId);
  const visitKey = buildPgSectionVisitKey(input.orderId, input.pillarId, input.sectionId);
  const records = memoryByActorOrder.get(bucketKey) ?? [];
  return records.some(
    (r) => buildPgSectionVisitKey(r.orderId, r.pillarId, r.sectionId) === visitKey
  );
}

export async function listPlatformCoreSectionReadKeys(input: {
  actorId: string;
  orderId: string;
  organizationId?: string;
}): Promise<string[]> {
  mergeFromDisk();
  const bucketKey = actorOrderKey(input.actorId, input.orderId);
  const fromFile = shouldPlatformCoreReadAuxiliaryFromFile()
    ? (memoryByActorOrder.get(bucketKey) ?? []).map((r) =>
        buildPgSectionVisitKey(r.orderId, r.pillarId, r.sectionId)
      )
    : [];

  const fromPg = await listWorkshop2B2bOrderSectionReadKeys({
    organizationId: input.organizationId,
    actorId: input.actorId,
    orderId: input.orderId,
  }).catch(() => [] as string[]);

  if (!shouldPlatformCoreReadAuxiliaryFromFile()) {
    return [...new Set(fromPg)];
  }

  return [...new Set([...fromFile, ...fromPg])];
}

/** Test-only reset. */
export function clearPlatformCoreSectionReadStateForTests(): void {
  memoryByActorOrder.clear();
}
