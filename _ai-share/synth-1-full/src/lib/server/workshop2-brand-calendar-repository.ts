import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type { Workshop2BrandCalendarSyncEvent } from '@/lib/production/workshop2-brand-calendar-sync';
import { shouldWorkshop2PgOnlySkipFileFallback } from '@/lib/production/workshop2-hub-pg-only-policy';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const memoryEvents = new Map<string, Workshop2BrandCalendarSyncEvent[]>();
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-brand-calendar-events.json');
let fileHydrated = false;

function articleKey(collectionId: string, articleId: string): string {
  return `${collectionId.trim()}::${articleId.trim()}`;
}

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test';
}

function hydrateFileIfNeeded(): void {
  if (fileHydrated) return;
  fileHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, Workshop2BrandCalendarSyncEvent[]>;
    if (parsed && typeof parsed === 'object') {
      for (const [k, v] of Object.entries(parsed)) {
        if (Array.isArray(v)) memoryEvents.set(k, v);
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
    fs.writeFileSync(STORE_FILE, JSON.stringify(Object.fromEntries(memoryEvents), null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

export async function replaceWorkshop2BrandCalendarEventsForArticle(input: {
  collectionId: string;
  articleId: string;
  events: Workshop2BrandCalendarSyncEvent[];
  organizationId?: string;
}): Promise<{ synced: number }> {
  const key = articleKey(input.collectionId, input.articleId);
  const org = input.organizationId ?? 'org-brand-001';
  const syncedAt = new Date().toISOString();

  if (!isWorkshop2PostgresEnabled()) {
    if (shouldWorkshop2PgOnlySkipFileFallback()) {
      throw new Error('WORKSHOP2_PG_ONLY: brand calendar sync requires PostgreSQL');
    }
    hydrateFileIfNeeded();
    memoryEvents.set(
      key,
      input.events.map((e) => ({ ...e }))
    );
    flushFile();
    return { synced: input.events.length };
  }

  await ensureWorkshop2PgSchema();
  const client = await getWorkshop2PgPool().connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `DELETE FROM workshop2_brand_calendar_events
       WHERE organization_id = $1 AND collection_id = $2 AND article_id = $3`,
      [org, input.collectionId.trim(), input.articleId.trim()]
    );
    for (const e of input.events) {
      await client.query(
        `INSERT INTO workshop2_brand_calendar_events
           (id, organization_id, collection_id, article_id, source_kind, title,
            start_at, end_at, is_blocker, blocker_kind, linked_milestone_id, payload, synced_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz, $9, $10, $11, $12::jsonb, $13::timestamptz)`,
        [
          e.id,
          org,
          e.collectionId,
          e.articleId,
          e.sourceKind,
          e.title,
          e.startAt,
          e.endAt,
          e.isBlocker,
          e.blockerKind ?? null,
          e.linkedMilestoneId ?? null,
          JSON.stringify({ href: e.href, priority: e.priority, dependsOn: e.dependsOn }),
          syncedAt,
        ]
      );
    }
    await client.query('COMMIT');
    return { synced: input.events.length };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function listWorkshop2BrandCalendarEventsForArticle(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
}): Promise<Workshop2BrandCalendarSyncEvent[]> {
  const key = articleKey(input.collectionId, input.articleId);

  if (!isWorkshop2PostgresEnabled()) {
    if (shouldWorkshop2PgOnlySkipFileFallback()) return [];
    hydrateFileIfNeeded();
    return [...(memoryEvents.get(key) ?? [])];
  }

  await ensureWorkshop2PgSchema();
  const org = input.organizationId ?? 'org-brand-001';
  const res = await getWorkshop2PgPool().query<{
    id: string;
    collection_id: string;
    article_id: string;
    source_kind: string;
    title: string;
    start_at: Date;
    end_at: Date;
    is_blocker: boolean;
    blocker_kind: string | null;
    linked_milestone_id: string | null;
    payload: { href?: string; priority?: string; dependsOn?: string };
  }>(
    `SELECT id, collection_id, article_id, source_kind, title, start_at, end_at,
            is_blocker, blocker_kind, linked_milestone_id, payload
     FROM workshop2_brand_calendar_events
     WHERE organization_id = $1 AND collection_id = $2 AND article_id = $3
     ORDER BY start_at ASC`,
    [org, input.collectionId.trim(), input.articleId.trim()]
  );

  return res.rows.map((r) => mapBrandCalendarRow(r));
}

function mapBrandCalendarRow(r: {
  id: string;
  collection_id: string;
  article_id: string;
  source_kind: string;
  title: string;
  start_at: Date;
  end_at: Date;
  is_blocker: boolean;
  blocker_kind: string | null;
  linked_milestone_id: string | null;
  payload: { href?: string; priority?: string; dependsOn?: string };
}): Workshop2BrandCalendarSyncEvent {
  return {
    id: r.id,
    collectionId: r.collection_id,
    articleId: r.article_id,
    sourceKind: r.source_kind as Workshop2BrandCalendarSyncEvent['sourceKind'],
    title: r.title,
    startAt: r.start_at.toISOString(),
    endAt: r.end_at.toISOString(),
    isBlocker: r.is_blocker,
    blockerKind: (r.blocker_kind as Workshop2BrandCalendarSyncEvent['blockerKind']) ?? undefined,
    linkedMilestoneId: r.linked_milestone_id ?? undefined,
    dependsOn: r.payload?.dependsOn,
    href: r.payload?.href,
    priority: (r.payload?.priority as Workshop2BrandCalendarSyncEvent['priority']) ?? undefined,
  };
}

export async function listWorkshop2BrandCalendarEventsForCollection(input: {
  collectionId: string;
  organizationId?: string;
}): Promise<Workshop2BrandCalendarSyncEvent[]> {
  const cid = input.collectionId.trim();
  if (!cid) return [];

  if (!isWorkshop2PostgresEnabled()) {
    if (shouldWorkshop2PgOnlySkipFileFallback()) return [];
    hydrateFileIfNeeded();
    return [...memoryEvents.values()].flat().filter((e) => e.collectionId === cid);
  }

  await ensureWorkshop2PgSchema();
  const org = input.organizationId ?? 'org-brand-001';
  const res = await getWorkshop2PgPool().query<{
    id: string;
    collection_id: string;
    article_id: string;
    source_kind: string;
    title: string;
    start_at: Date;
    end_at: Date;
    is_blocker: boolean;
    blocker_kind: string | null;
    linked_milestone_id: string | null;
    payload: { href?: string; priority?: string; dependsOn?: string };
  }>(
    `SELECT id, collection_id, article_id, source_kind, title, start_at, end_at,
            is_blocker, blocker_kind, linked_milestone_id, payload
     FROM workshop2_brand_calendar_events
     WHERE organization_id = $1 AND collection_id = $2
     ORDER BY start_at ASC`,
    [org, cid]
  );
  return res.rows.map((r) => mapBrandCalendarRow(r));
}

export async function listAllWorkshop2BrandCalendarEvents(
  organizationId = 'org-brand-001'
): Promise<Workshop2BrandCalendarSyncEvent[]> {
  if (!isWorkshop2PostgresEnabled()) {
    if (shouldWorkshop2PgOnlySkipFileFallback()) return [];
    hydrateFileIfNeeded();
    return [...memoryEvents.values()].flat();
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    id: string;
    collection_id: string;
    article_id: string;
    source_kind: string;
    title: string;
    start_at: Date;
    end_at: Date;
    is_blocker: boolean;
    blocker_kind: string | null;
    linked_milestone_id: string | null;
    payload: { href?: string; priority?: string; dependsOn?: string };
  }>(
    `SELECT id, collection_id, article_id, source_kind, title, start_at, end_at,
            is_blocker, blocker_kind, linked_milestone_id, payload
     FROM workshop2_brand_calendar_events
     WHERE organization_id = $1
     ORDER BY start_at ASC`,
    [organizationId]
  );

  return res.rows.map((r) => mapBrandCalendarRow(r));
}

export function clearWorkshop2BrandCalendarMemoryForTests(): void {
  memoryEvents.clear();
  fileHydrated = false;
}

export function isWorkshop2BrandCalendarSyncConfigured(): boolean {
  if (isWorkshop2PostgresEnabled()) return true;
  return canUseDiskPersistence();
}
