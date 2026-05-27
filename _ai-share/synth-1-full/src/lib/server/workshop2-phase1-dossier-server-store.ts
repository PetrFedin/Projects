import type {
  Workshop2DossierPhase1,
  Workshop2FinalExportSnapshotMeta,
  Workshop2FinalExportSnapshotRecord,
} from '@/lib/production/workshop2-dossier-phase1.types';
import fs from 'node:fs';
import path from 'node:path';
import { Pool, type PoolClient } from 'pg';
import { buildWorkshop2FileStoreDemoDossier } from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

type Key = `${string}::${string}`;

export type Workshop2ServerDossierRecord = {
  collectionId: string;
  articleId: string;
  version: number;
  updatedAt: string;
  dossier: Workshop2DossierPhase1;
};

export type Workshop2ServerDossierEventRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  version: number;
  eventType: string;
  eventPayload: Record<string, unknown>;
  createdAt: string;
};

export type Workshop2ServerDossierVersionRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  version: number;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
};

const DOSSIER_STORE = new Map<Key, Workshop2ServerDossierRecord>();
let hydratedFromDisk = false;
const STORE_FILE_PATH = path.join(process.cwd(), 'data', 'workshop2-phase1-server-store.json');
const DATABASE_URL =
  process.env.WORKSHOP2_DOSSIER_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
const USE_POSTGRES = DATABASE_URL.length > 0;
let pgPool: Pool | null = null;
let pgReadyPromise: Promise<void> | null = null;

export function getWorkshop2ServerDossierStoreMode(): 'server_postgres' | 'server_file_persist' {
  return USE_POSTGRES ? 'server_postgres' : 'server_file_persist';
}

function keyOf(collectionId: string, articleId: string): Key {
  return `${collectionId}::${articleId}`;
}

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test';
}

function hydrateFromDiskIfNeeded(): void {
  if (hydratedFromDisk) return;
  hydratedFromDisk = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE_PATH)) return;
    const raw = fs.readFileSync(STORE_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
    for (const [k, v] of Object.entries(parsed as Record<string, Workshop2ServerDossierRecord>)) {
      if (!v || typeof v !== 'object') continue;
      if (typeof v.collectionId !== 'string' || typeof v.articleId !== 'string') continue;
      if (typeof v.version !== 'number' || typeof v.updatedAt !== 'string') continue;
      if (!v.dossier || !Array.isArray(v.dossier.assignments)) continue;
      DOSSIER_STORE.set(k as Key, v);
    }
  } catch {
    // Best-effort hydration; corrupted store should not break runtime.
  }
}

function flushToDisk(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE_PATH), { recursive: true });
    const data = JSON.stringify(Object.fromEntries(DOSSIER_STORE), null, 2);
    fs.writeFileSync(STORE_FILE_PATH, data, 'utf8');
  } catch {
    // Best-effort persistence; in-memory state remains primary runtime cache.
  }
}

/** Wave P — demo SS27 dossier seed в file-store (PG off). */
function ensureWorkshop2FileStoreDemoDossierRecord(
  collectionId: string,
  articleId: string
): Workshop2ServerDossierRecord | null {
  const demo = buildWorkshop2FileStoreDemoDossier({ collectionId, articleId });
  if (!demo) return null;
  const nowIso = new Date().toISOString();
  const next: Workshop2ServerDossierRecord = {
    collectionId,
    articleId,
    version: 1,
    updatedAt: nowIso,
    dossier: demo,
  };
  DOSSIER_STORE.set(keyOf(collectionId, articleId), next);
  flushToDisk();
  return next;
}

export function getWorkshop2ServerDossierRecord(
  collectionId: string,
  articleId: string
): Promise<Workshop2ServerDossierRecord | null> {
  if (isWorkshop2PostgresEnabled())
    return getWorkshop2ServerDossierRecordFromPg(collectionId, articleId);
  hydrateFromDiskIfNeeded();
  const existing = DOSSIER_STORE.get(keyOf(collectionId, articleId)) ?? null;
  if (existing) return Promise.resolve(existing);
  return Promise.resolve(ensureWorkshop2FileStoreDemoDossierRecord(collectionId, articleId));
}

export async function putWorkshop2ServerDossierRecord(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  baseVersion?: number;
  txMeta?: {
    eventType?: string;
    eventPayload?: Record<string, unknown>;
    finalExportSnapshotRecord?: Workshop2FinalExportSnapshotRecord;
  };
}): Promise<
  | { ok: true; record: Workshop2ServerDossierRecord }
  | { ok: false; error: 'version_conflict'; currentVersion: number }
> {
  if (USE_POSTGRES) return putWorkshop2ServerDossierRecordToPg(input);
  hydrateFromDiskIfNeeded();
  const nowIso = new Date().toISOString();
  const cur = DOSSIER_STORE.get(keyOf(input.collectionId, input.articleId)) ?? null;
  if (!cur) {
    const next: Workshop2ServerDossierRecord = {
      collectionId: input.collectionId,
      articleId: input.articleId,
      version: 1,
      updatedAt: nowIso,
      dossier: input.dossier,
    };
    DOSSIER_STORE.set(keyOf(input.collectionId, input.articleId), next);
    flushToDisk();
    return { ok: true, record: next };
  }
  const expected = input.baseVersion ?? cur.version;
  if (expected !== cur.version) {
    return { ok: false, error: 'version_conflict', currentVersion: cur.version };
  }
  const next: Workshop2ServerDossierRecord = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    version: cur.version + 1,
    updatedAt: nowIso,
    dossier: input.dossier,
  };
  DOSSIER_STORE.set(keyOf(input.collectionId, input.articleId), next);
  flushToDisk();
  return { ok: true, record: next };
}

export async function __clearWorkshop2ServerDossierStoreForTests() {
  if (USE_POSTGRES) {
    await ensurePgReady();
    if (pgPool) {
      await pgPool.query(
        'TRUNCATE TABLE workshop2_dossier_events, workshop2_dossier_versions, workshop2_dossiers, workshop2_dossier_snapshots RESTART IDENTITY'
      );
    }
  }
  DOSSIER_STORE.clear();
  hydratedFromDisk = false;
  if (!canUseDiskPersistence()) return;
  try {
    if (fs.existsSync(STORE_FILE_PATH)) fs.unlinkSync(STORE_FILE_PATH);
  } catch {
    // ignore cleanup errors in helper
  }
}

export async function saveWorkshop2FinalExportSnapshotRecord(input: {
  collectionId: string;
  articleId: string;
  snapshot: Workshop2FinalExportSnapshotRecord;
}): Promise<void> {
  if (!USE_POSTGRES) return;
  await ensurePgReady();
  await getPgPool().query(
    `INSERT INTO workshop2_dossier_snapshots
      (collection_id, article_id, snapshot_id, version, created_at, dossier_json)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)
     ON CONFLICT (collection_id, article_id, snapshot_id)
     DO UPDATE SET version = EXCLUDED.version, created_at = EXCLUDED.created_at, dossier_json = EXCLUDED.dossier_json`,
    [
      input.collectionId,
      input.articleId,
      input.snapshot.snapshotId,
      input.snapshot.dossierVersion,
      input.snapshot.createdAt,
      JSON.stringify(input.snapshot),
    ]
  );
}

export async function getWorkshop2FinalExportSnapshotRecord(input: {
  collectionId: string;
  articleId: string;
  snapshotId: string;
}): Promise<Workshop2FinalExportSnapshotRecord | null> {
  if (USE_POSTGRES) {
    await ensurePgReady();
    const res = await getPgPool().query<{ dossier_json: Workshop2FinalExportSnapshotRecord }>(
      `SELECT dossier_json
       FROM workshop2_dossier_snapshots
       WHERE collection_id = $1 AND article_id = $2 AND snapshot_id = $3
       LIMIT 1`,
      [input.collectionId, input.articleId, input.snapshotId]
    );
    const row = res.rows[0];
    if (row?.dossier_json) return row.dossier_json;
  }
  const record = await getWorkshop2ServerDossierRecord(input.collectionId, input.articleId);
  if (!record) return null;
  return (
    (record.dossier.finalExportSnapshotRecords ?? []).find(
      (s) => s.snapshotId === input.snapshotId
    ) ?? null
  );
}

export async function listWorkshop2FinalExportSnapshotMetas(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<Workshop2FinalExportSnapshotMeta[]> {
  const limit = Math.min(Math.max(Math.floor(input.limit ?? 30), 1), 100);
  if (USE_POSTGRES) {
    await ensurePgReady();
    const res = await getPgPool().query<{ dossier_json: Workshop2FinalExportSnapshotRecord }>(
      `SELECT dossier_json
       FROM workshop2_dossier_snapshots
       WHERE collection_id = $1 AND article_id = $2
       ORDER BY created_at DESC
       LIMIT $3`,
      [input.collectionId, input.articleId, limit]
    );
    return res.rows
      .map((r) => r.dossier_json)
      .filter(Boolean)
      .map((s) => ({
        snapshotId: s.snapshotId,
        createdAt: s.createdAt,
        createdBy: s.createdBy,
        dossierVersion: s.dossierVersion,
        dossierUpdatedAtSnapshot: s.dossierUpdatedAtSnapshot,
        lifecycleState: s.lifecycleState,
      }));
  }
  const record = await getWorkshop2ServerDossierRecord(input.collectionId, input.articleId);
  if (!record) return [];
  return (record.dossier.finalExportSnapshots ?? []).slice(0, limit);
}

export async function getWorkshop2FinalExportSnapshotMeta(input: {
  collectionId: string;
  articleId: string;
  snapshotId: string;
}): Promise<Workshop2FinalExportSnapshotMeta | null> {
  if (USE_POSTGRES) {
    await ensurePgReady();
    const res = await getPgPool().query<{ dossier_json: Workshop2FinalExportSnapshotRecord }>(
      `SELECT dossier_json
       FROM workshop2_dossier_snapshots
       WHERE collection_id = $1 AND article_id = $2 AND snapshot_id = $3
       LIMIT 1`,
      [input.collectionId, input.articleId, input.snapshotId]
    );
    const row = res.rows[0];
    if (row?.dossier_json) {
      const s = row.dossier_json;
      return {
        snapshotId: s.snapshotId,
        createdAt: s.createdAt,
        createdBy: s.createdBy,
        dossierVersion: s.dossierVersion,
        dossierUpdatedAtSnapshot: s.dossierUpdatedAtSnapshot,
        lifecycleState: s.lifecycleState,
      };
    }
  }
  const record = await getWorkshop2ServerDossierRecord(input.collectionId, input.articleId);
  if (!record) return null;
  return (
    (record.dossier.finalExportSnapshots ?? []).find((s) => s.snapshotId === input.snapshotId) ??
    null
  );
}

export async function listWorkshop2DossierEvents(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
  eventType?: string;
}): Promise<Workshop2ServerDossierEventRecord[]> {
  const limit = Math.min(Math.max(Math.floor(input.limit ?? 40), 1), 200);
  if (USE_POSTGRES) {
    await ensurePgReady();
    const hasType = (input.eventType?.trim() ?? '').length > 0;
    const sql = hasType
      ? `SELECT id, collection_id, article_id, version, event_type, event_payload, created_at
         FROM workshop2_dossier_events
         WHERE collection_id = $1 AND article_id = $2 AND event_type = $3
         ORDER BY created_at DESC
         LIMIT $4`
      : `SELECT id, collection_id, article_id, version, event_type, event_payload, created_at
         FROM workshop2_dossier_events
         WHERE collection_id = $1 AND article_id = $2
         ORDER BY created_at DESC
         LIMIT $3`;
    const params = hasType
      ? [input.collectionId, input.articleId, input.eventType!.trim(), limit]
      : [input.collectionId, input.articleId, limit];
    const res = await getPgPool().query<{
      id: number;
      collection_id: string;
      article_id: string;
      version: number;
      event_type: string;
      event_payload: Record<string, unknown>;
      created_at: Date;
    }>(sql, params);
    return res.rows.map((r) => ({
      id: String(r.id),
      collectionId: r.collection_id,
      articleId: r.article_id,
      version: r.version,
      eventType: r.event_type,
      eventPayload: r.event_payload ?? {},
      createdAt: r.created_at.toISOString(),
    }));
  }
  const record = await getWorkshop2ServerDossierRecord(input.collectionId, input.articleId);
  if (!record) return [];
  const typeFilter = (input.eventType ?? '').trim();
  const rows = (record.dossier.tzActionLog ?? []).map((e, idx) => ({
    id: e.entryId || `legacy-${idx + 1}`,
    collectionId: input.collectionId,
    articleId: input.articleId,
    version: record.version,
    eventType: `legacy_${e.action.type}`,
    eventPayload: { by: e.by, at: e.at, action: e.action },
    createdAt: e.at || record.updatedAt,
  }));
  const filtered = typeFilter ? rows.filter((r) => r.eventType === typeFilter) : rows;
  return filtered.slice(0, limit);
}

export async function listWorkshop2DossierVersions(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<Workshop2ServerDossierVersionRecord[]> {
  const limit = Math.min(Math.max(Math.floor(input.limit ?? 40), 1), 200);
  if (USE_POSTGRES) {
    await ensurePgReady();
    const res = await getPgPool().query<{
      id: number;
      collection_id: string;
      article_id: string;
      version: number;
      created_at: Date;
      dossier_json: Workshop2DossierPhase1;
    }>(
      `SELECT id, collection_id, article_id, version, created_at, dossier_json
       FROM workshop2_dossier_versions
       WHERE collection_id = $1 AND article_id = $2
       ORDER BY version DESC
       LIMIT $3`,
      [input.collectionId, input.articleId, limit]
    );
    return res.rows.map((r) => ({
      id: String(r.id),
      collectionId: r.collection_id,
      articleId: r.article_id,
      version: r.version,
      createdAt: r.created_at.toISOString(),
      updatedBy: r.dossier_json?.updatedBy,
      updatedAt: r.dossier_json?.updatedAt,
    }));
  }
  const record = await getWorkshop2ServerDossierRecord(input.collectionId, input.articleId);
  if (!record) return [];
  return [
    {
      id: `legacy-v${record.version}`,
      collectionId: input.collectionId,
      articleId: input.articleId,
      version: record.version,
      createdAt: record.updatedAt,
      updatedBy: record.dossier.updatedBy,
      updatedAt: record.dossier.updatedAt,
    },
  ];
}

function getPgPool(): Pool {
  if (!pgPool) pgPool = new Pool({ connectionString: DATABASE_URL });
  return pgPool;
}

async function ensurePgReady(): Promise<void> {
  if (!USE_POSTGRES) return;
  if (pgReadyPromise) return pgReadyPromise;
  pgReadyPromise = (async () => {
    const pool = getPgPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workshop2_dossiers (
        collection_id TEXT NOT NULL,
        article_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        dossier_json JSONB NOT NULL,
        PRIMARY KEY (collection_id, article_id)
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workshop2_dossier_versions (
        id BIGSERIAL PRIMARY KEY,
        collection_id TEXT NOT NULL,
        article_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        dossier_json JSONB NOT NULL,
        UNIQUE (collection_id, article_id, version)
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workshop2_dossier_events (
        id BIGSERIAL PRIMARY KEY,
        collection_id TEXT NOT NULL,
        article_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        event_payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workshop2_dossier_snapshots (
        id BIGSERIAL PRIMARY KEY,
        collection_id TEXT NOT NULL,
        article_id TEXT NOT NULL,
        snapshot_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        dossier_json JSONB NOT NULL,
        UNIQUE (collection_id, article_id, snapshot_id)
      );
    `);
  })();
  return pgReadyPromise;
}

async function getWorkshop2ServerDossierRecordFromPg(
  collectionId: string,
  articleId: string
): Promise<Workshop2ServerDossierRecord | null> {
  await ensurePgReady();
  const res = await getPgPool().query<{
    version: number;
    updated_at: Date;
    dossier_json: Workshop2DossierPhase1;
  }>(
    `SELECT version, updated_at, dossier_json
     FROM workshop2_dossiers
     WHERE collection_id = $1 AND article_id = $2`,
    [collectionId, articleId]
  );
  const row = res.rows[0];
  if (!row) return null;
  return {
    collectionId,
    articleId,
    version: row.version,
    updatedAt: row.updated_at.toISOString(),
    dossier: row.dossier_json,
  };
}

async function putWorkshop2ServerDossierRecordToPg(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  baseVersion?: number;
  txMeta?: {
    eventType?: string;
    eventPayload?: Record<string, unknown>;
    finalExportSnapshotRecord?: Workshop2FinalExportSnapshotRecord;
  };
}): Promise<
  | { ok: true; record: Workshop2ServerDossierRecord }
  | { ok: false; error: 'version_conflict'; currentVersion: number }
> {
  await ensurePgReady();
  const client = await getPgPool().connect();
  try {
    await client.query('BEGIN');
    const cur = await client.query<{ version: number }>(
      `SELECT version FROM workshop2_dossiers
       WHERE collection_id = $1 AND article_id = $2
       FOR UPDATE`,
      [input.collectionId, input.articleId]
    );
    const nowIso = new Date().toISOString();
    if (cur.rowCount === 0) {
      const next: Workshop2ServerDossierRecord = {
        collectionId: input.collectionId,
        articleId: input.articleId,
        version: 1,
        updatedAt: nowIso,
        dossier: input.dossier,
      };
      await writePgVersionedRecord(
        client,
        next,
        input.txMeta?.eventType ?? 'create',
        input.txMeta?.eventPayload
      );
      if (input.txMeta?.finalExportSnapshotRecord) {
        await writePgSnapshotRecord(
          client,
          next.collectionId,
          next.articleId,
          input.txMeta.finalExportSnapshotRecord
        );
      }
      await client.query('COMMIT');
      return { ok: true, record: next };
    }
    const currentVersion = cur.rows[0]!.version;
    const expected = input.baseVersion ?? currentVersion;
    if (expected !== currentVersion) {
      await client.query('ROLLBACK');
      return { ok: false, error: 'version_conflict', currentVersion };
    }
    const next: Workshop2ServerDossierRecord = {
      collectionId: input.collectionId,
      articleId: input.articleId,
      version: currentVersion + 1,
      updatedAt: nowIso,
      dossier: input.dossier,
    };
    await writePgVersionedRecord(
      client,
      next,
      input.txMeta?.eventType ?? 'update',
      input.txMeta?.eventPayload
    );
    if (input.txMeta?.finalExportSnapshotRecord) {
      await writePgSnapshotRecord(
        client,
        next.collectionId,
        next.articleId,
        input.txMeta.finalExportSnapshotRecord
      );
    }
    await client.query('COMMIT');
    return { ok: true, record: next };
  } catch {
    await client.query('ROLLBACK');
    throw new Error('workshop2_dossier_store_pg_write_failed');
  } finally {
    client.release();
  }
}

async function writePgSnapshotRecord(
  client: PoolClient,
  collectionId: string,
  articleId: string,
  snapshot: Workshop2FinalExportSnapshotRecord
): Promise<void> {
  await client.query(
    `INSERT INTO workshop2_dossier_snapshots
      (collection_id, article_id, snapshot_id, version, created_at, dossier_json)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)
     ON CONFLICT (collection_id, article_id, snapshot_id)
     DO UPDATE SET version = EXCLUDED.version, created_at = EXCLUDED.created_at, dossier_json = EXCLUDED.dossier_json`,
    [
      collectionId,
      articleId,
      snapshot.snapshotId,
      snapshot.dossierVersion,
      snapshot.createdAt,
      JSON.stringify(snapshot),
    ]
  );
}

async function writePgVersionedRecord(
  client: PoolClient,
  record: Workshop2ServerDossierRecord,
  eventType: string,
  eventPayload?: Record<string, unknown>
): Promise<void> {
  await client.query(
    `INSERT INTO workshop2_dossiers (collection_id, article_id, version, updated_at, dossier_json)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     ON CONFLICT (collection_id, article_id)
     DO UPDATE SET version = EXCLUDED.version, updated_at = EXCLUDED.updated_at, dossier_json = EXCLUDED.dossier_json`,
    [
      record.collectionId,
      record.articleId,
      record.version,
      record.updatedAt,
      JSON.stringify(record.dossier),
    ]
  );
  await client.query(
    `INSERT INTO workshop2_dossier_versions (collection_id, article_id, version, dossier_json)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [record.collectionId, record.articleId, record.version, JSON.stringify(record.dossier)]
  );
  await client.query(
    `INSERT INTO workshop2_dossier_events (collection_id, article_id, version, event_type, event_payload)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [
      record.collectionId,
      record.articleId,
      record.version,
      eventType,
      JSON.stringify({ updatedAt: record.updatedAt, ...(eventPayload ?? {}) }),
    ]
  );
}
