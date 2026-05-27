import 'server-only';
import type {
  Workshop2DossierPhase1,
  Workshop2FinalExportSnapshotMeta,
  Workshop2FinalExportSnapshotRecord,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { PoolClient } from 'pg';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2DossierRecord = {
  collectionId: string;
  articleId: string;
  version: number;
  updatedAt: string;
  updatedBy?: string;
  organizationId?: string;
  dossier: Workshop2DossierPhase1;
};

export type Workshop2DossierEventRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  version: number;
  eventType: string;
  eventPayload: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
};

export type Workshop2DossierVersionRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  version: number;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
};

export type Workshop2VaultDocumentRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  documentId: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  storagePath?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
};

let schemaReadyPromise: Promise<void> | null = null;

/** Применяет DDL из db/migrations (идемпотентно). */
export async function ensureWorkshop2PgSchema(): Promise<void> {
  if (!isWorkshop2PostgresEnabled()) return;
  if (schemaReadyPromise) return schemaReadyPromise;
  schemaReadyPromise = (async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const dir = path.join(process.cwd(), 'db/migrations');
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.sql'))
      .sort();
    for (const file of files) {
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await getWorkshop2PgPool().query(sql);
    }
  })();
  return schemaReadyPromise;
}

export async function getWorkshop2DossierFromPg(
  collectionId: string,
  articleId: string,
  organizationId?: string
): Promise<Workshop2DossierRecord | null> {
  await ensureWorkshop2PgSchema();
  const params: string[] = [collectionId, articleId];
  let orgFilter = '';
  if (organizationId?.trim()) {
    params.push(organizationId.trim());
    orgFilter = ' AND organization_id = $3';
  }
  const res = await getWorkshop2PgPool().query<{
    version: number;
    updated_at: Date;
    updated_by: string | null;
    organization_id: string;
    dossier_json: Workshop2DossierPhase1;
  }>(
    `SELECT version, updated_at, updated_by, organization_id, dossier_json
     FROM workshop2_dossiers
     WHERE collection_id = $1 AND article_id = $2${orgFilter}`,
    params
  );
  const row = res.rows[0];
  if (!row) return null;
  return {
    collectionId,
    articleId,
    version: row.version,
    updatedAt: row.updated_at.toISOString(),
    updatedBy: row.updated_by ?? undefined,
    organizationId: row.organization_id,
    dossier: row.dossier_json,
  };
}

export async function putWorkshop2DossierToPg(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  baseVersion?: number;
  updatedBy?: string;
  organizationId?: string;
  txMeta?: {
    eventType?: string;
    eventPayload?: Record<string, unknown>;
    finalExportSnapshotRecord?: Workshop2FinalExportSnapshotRecord;
  };
}): Promise<
  | { ok: true; record: Workshop2DossierRecord }
  | { ok: false; error: 'version_conflict'; currentVersion: number }
> {
  await ensureWorkshop2PgSchema();
  const client = await getWorkshop2PgPool().connect();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  try {
    await client.query('BEGIN');
    await upsertWorkshop2CollectionArticleMeta(client, {
      collectionId: input.collectionId,
      articleId: input.articleId,
      organizationId: orgId,
    });
    const cur = await client.query<{ version: number }>(
      `SELECT version FROM workshop2_dossiers
       WHERE collection_id = $1 AND article_id = $2
       FOR UPDATE`,
      [input.collectionId, input.articleId]
    );
    const nowIso = new Date().toISOString();
    const updatedBy = input.updatedBy?.trim() || input.dossier.updatedBy;
    if (cur.rowCount === 0) {
      const next: Workshop2DossierRecord = {
        collectionId: input.collectionId,
        articleId: input.articleId,
        version: 1,
        updatedAt: nowIso,
        updatedBy,
        organizationId: orgId,
        dossier: input.dossier,
      };
      await writePgVersionedRecord(client, next, input.txMeta?.eventType ?? 'create', {
        ...input.txMeta?.eventPayload,
        updatedBy,
      });
      if (input.txMeta?.finalExportSnapshotRecord) {
        await writePgSnapshotRecord(
          client,
          next.collectionId,
          next.articleId,
          orgId,
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
    const next: Workshop2DossierRecord = {
      collectionId: input.collectionId,
      articleId: input.articleId,
      version: currentVersion + 1,
      updatedAt: nowIso,
      updatedBy,
      organizationId: orgId,
      dossier: input.dossier,
    };
    await writePgVersionedRecord(client, next, input.txMeta?.eventType ?? 'update', {
      ...input.txMeta?.eventPayload,
      updatedBy,
    });
    if (input.txMeta?.finalExportSnapshotRecord) {
      await writePgSnapshotRecord(
        client,
        next.collectionId,
        next.articleId,
        orgId,
        input.txMeta.finalExportSnapshotRecord
      );
    }
    await client.query('COMMIT');
    return { ok: true, record: next };
  } catch {
    await client.query('ROLLBACK');
    throw new Error('workshop2_dossier_repository_pg_write_failed');
  } finally {
    client.release();
  }
}

async function upsertWorkshop2CollectionArticleMeta(
  client: PoolClient,
  input: { collectionId: string; articleId: string; organizationId: string }
): Promise<void> {
  await client.query(
    `INSERT INTO workshop2_collections (id, organization_id, display_name, updated_at)
     VALUES ($1, $2, $1, NOW())
     ON CONFLICT (id) DO UPDATE SET updated_at = NOW()`,
    [input.collectionId, input.organizationId]
  );
  await client.query(
    `INSERT INTO workshop2_articles (id, collection_id, organization_id, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (collection_id, id) DO UPDATE SET updated_at = NOW()`,
    [input.articleId, input.collectionId, input.organizationId]
  );
}

export async function appendWorkshop2DossierEventToPg(input: {
  collectionId: string;
  articleId: string;
  version: number;
  eventType: string;
  eventPayload?: Record<string, unknown>;
  createdBy?: string;
  organizationId?: string;
}): Promise<{ id: string }> {
  await ensureWorkshop2PgSchema();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  const res = await getWorkshop2PgPool().query<{ id: number }>(
    `INSERT INTO workshop2_dossier_events
      (collection_id, article_id, organization_id, version, event_type, event_payload, created_by)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
     RETURNING id`,
    [
      input.collectionId,
      input.articleId,
      orgId,
      input.version,
      input.eventType,
      JSON.stringify(input.eventPayload ?? {}),
      input.createdBy ?? null,
    ]
  );
  return { id: String(res.rows[0]?.id ?? '') };
}

export async function listWorkshop2DossierEventsFromPg(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
  eventType?: string;
  organizationId?: string;
}): Promise<Workshop2DossierEventRecord[]> {
  await ensureWorkshop2PgSchema();
  const limit = Math.min(Math.max(Math.floor(input.limit ?? 40), 1), 200);
  const hasType = (input.eventType?.trim() ?? '').length > 0;
  const hasOrg = (input.organizationId?.trim() ?? '').length > 0;
  const params: (string | number)[] = [input.collectionId, input.articleId];
  const filters: string[] = [];
  if (hasOrg) {
    params.push(input.organizationId!.trim());
    filters.push(`organization_id = $${params.length}`);
  }
  if (hasType) {
    params.push(input.eventType!.trim());
    filters.push(`event_type = $${params.length}`);
  }
  params.push(limit);
  const whereExtra = filters.length ? ` AND ${filters.join(' AND ')}` : '';
  const res = await getWorkshop2PgPool().query<{
    id: number;
    collection_id: string;
    article_id: string;
    version: number;
    event_type: string;
    event_payload: Record<string, unknown>;
    created_at: Date;
    created_by: string | null;
  }>(
    `SELECT id, collection_id, article_id, version, event_type, event_payload, created_at, created_by
     FROM workshop2_dossier_events
     WHERE collection_id = $1 AND article_id = $2${whereExtra}
     ORDER BY created_at DESC
     LIMIT $${params.length}`,
    params
  );
  return res.rows.map((r) => ({
    id: String(r.id),
    collectionId: r.collection_id,
    articleId: r.article_id,
    version: r.version,
    eventType: r.event_type,
    eventPayload: r.event_payload ?? {},
    createdAt: r.created_at.toISOString(),
    createdBy: r.created_by ?? undefined,
  }));
}

export async function listWorkshop2DossierVersionsFromPg(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<Workshop2DossierVersionRecord[]> {
  await ensureWorkshop2PgSchema();
  const limit = Math.min(Math.max(Math.floor(input.limit ?? 40), 1), 200);
  const res = await getWorkshop2PgPool().query<{
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

export async function saveWorkshop2FinalExportSnapshotToPg(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
  snapshot: Workshop2FinalExportSnapshotRecord;
}): Promise<void> {
  await ensureWorkshop2PgSchema();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_dossier_snapshots
      (collection_id, article_id, organization_id, snapshot_id, version, created_at, dossier_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     ON CONFLICT (collection_id, article_id, snapshot_id)
     DO UPDATE SET version = EXCLUDED.version, created_at = EXCLUDED.created_at, dossier_json = EXCLUDED.dossier_json`,
    [
      input.collectionId,
      input.articleId,
      orgId,
      input.snapshot.snapshotId,
      input.snapshot.dossierVersion,
      input.snapshot.createdAt,
      JSON.stringify(input.snapshot),
    ]
  );
}

export async function getWorkshop2FinalExportSnapshotFromPg(input: {
  collectionId: string;
  articleId: string;
  snapshotId: string;
}): Promise<Workshop2FinalExportSnapshotRecord | null> {
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    dossier_json: Workshop2FinalExportSnapshotRecord;
  }>(
    `SELECT dossier_json FROM workshop2_dossier_snapshots
     WHERE collection_id = $1 AND article_id = $2 AND snapshot_id = $3 LIMIT 1`,
    [input.collectionId, input.articleId, input.snapshotId]
  );
  return res.rows[0]?.dossier_json ?? null;
}

export async function listWorkshop2FinalExportSnapshotMetasFromPg(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<Workshop2FinalExportSnapshotMeta[]> {
  await ensureWorkshop2PgSchema();
  const limit = Math.min(Math.max(Math.floor(input.limit ?? 30), 1), 100);
  const res = await getWorkshop2PgPool().query<{
    dossier_json: Workshop2FinalExportSnapshotRecord;
  }>(
    `SELECT dossier_json FROM workshop2_dossier_snapshots
     WHERE collection_id = $1 AND article_id = $2
     ORDER BY created_at DESC LIMIT $3`,
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

export async function upsertWorkshop2VaultDocumentToPg(input: {
  collectionId: string;
  articleId: string;
  documentId: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  storagePath?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  organizationId?: string;
}): Promise<Workshop2VaultDocumentRecord> {
  await ensureWorkshop2PgSchema();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  const res = await getWorkshop2PgPool().query<{
    id: number;
    created_at: Date;
  }>(
    `INSERT INTO workshop2_vault_documents
      (collection_id, article_id, organization_id, document_id, file_name, mime_type, size_bytes, storage_path, metadata, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
     ON CONFLICT (collection_id, article_id, document_id)
     DO UPDATE SET
       file_name = EXCLUDED.file_name,
       mime_type = EXCLUDED.mime_type,
       size_bytes = EXCLUDED.size_bytes,
       storage_path = EXCLUDED.storage_path,
       metadata = EXCLUDED.metadata
     RETURNING id, created_at`,
    [
      input.collectionId,
      input.articleId,
      orgId,
      input.documentId,
      input.fileName ?? null,
      input.mimeType ?? null,
      input.sizeBytes ?? null,
      input.storagePath ?? null,
      JSON.stringify(input.metadata ?? {}),
      input.createdBy ?? null,
    ]
  );
  const row = res.rows[0]!;
  return {
    id: String(row.id),
    collectionId: input.collectionId,
    articleId: input.articleId,
    documentId: input.documentId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    storagePath: input.storagePath,
    metadata: input.metadata ?? {},
    createdAt: row.created_at.toISOString(),
    createdBy: input.createdBy,
  };
}

export async function listWorkshop2VaultDocumentsFromPg(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
}): Promise<Workshop2VaultDocumentRecord[]> {
  await ensureWorkshop2PgSchema();
  const params: string[] = [input.collectionId, input.articleId];
  let orgFilter = '';
  if (input.organizationId?.trim()) {
    params.push(input.organizationId.trim());
    orgFilter = ' AND organization_id = $3';
  }
  const res = await getWorkshop2PgPool().query<{
    id: number;
    document_id: string;
    file_name: string | null;
    mime_type: string | null;
    size_bytes: number | null;
    storage_path: string | null;
    metadata: Record<string, unknown>;
    created_at: Date;
    created_by: string | null;
  }>(
    `SELECT id, document_id, file_name, mime_type, size_bytes, storage_path, metadata, created_at, created_by
     FROM workshop2_vault_documents
     WHERE collection_id = $1 AND article_id = $2${orgFilter}
     ORDER BY created_at DESC`,
    params
  );
  return res.rows.map((r) => ({
    id: String(r.id),
    collectionId: input.collectionId,
    articleId: input.articleId,
    documentId: r.document_id,
    fileName: r.file_name ?? undefined,
    mimeType: r.mime_type ?? undefined,
    sizeBytes: r.size_bytes ?? undefined,
    storagePath: r.storage_path ?? undefined,
    metadata: r.metadata ?? {},
    createdAt: r.created_at.toISOString(),
    createdBy: r.created_by ?? undefined,
  }));
}

export async function clearWorkshop2PgTablesForTests(): Promise<void> {
  if (!isWorkshop2PostgresEnabled()) return;
  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `TRUNCATE TABLE
      workshop2_showroom_campaigns,
      workshop2_logistics_shipments,
      workshop2_factory_erp_sync,
      workshop2_plm_outbox,
      workshop2_material_requisitions,
      workshop2_sample_orders,
      workshop2_vault_documents,
      workshop2_dossier_events,
      workshop2_dossier_versions,
      workshop2_dossier_snapshots,
      workshop2_dossiers,
      workshop2_articles,
      workshop2_collections
     RESTART IDENTITY`
  );
}

async function writePgSnapshotRecord(
  client: PoolClient,
  collectionId: string,
  articleId: string,
  organizationId: string,
  snapshot: Workshop2FinalExportSnapshotRecord
): Promise<void> {
  await client.query(
    `INSERT INTO workshop2_dossier_snapshots
      (collection_id, article_id, organization_id, snapshot_id, version, created_at, dossier_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     ON CONFLICT (collection_id, article_id, snapshot_id)
     DO UPDATE SET version = EXCLUDED.version, created_at = EXCLUDED.created_at, dossier_json = EXCLUDED.dossier_json`,
    [
      collectionId,
      articleId,
      organizationId,
      snapshot.snapshotId,
      snapshot.dossierVersion,
      snapshot.createdAt,
      JSON.stringify(snapshot),
    ]
  );
}

async function writePgVersionedRecord(
  client: PoolClient,
  record: Workshop2DossierRecord,
  eventType: string,
  eventPayload?: Record<string, unknown>
): Promise<void> {
  const orgId = record.organizationId ?? 'org-brand-001';
  await client.query(
    `INSERT INTO workshop2_dossiers
      (collection_id, article_id, organization_id, version, updated_at, updated_by, dossier_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     ON CONFLICT (collection_id, article_id)
     DO UPDATE SET
       organization_id = EXCLUDED.organization_id,
       version = EXCLUDED.version,
       updated_at = EXCLUDED.updated_at,
       updated_by = EXCLUDED.updated_by,
       dossier_json = EXCLUDED.dossier_json`,
    [
      record.collectionId,
      record.articleId,
      orgId,
      record.version,
      record.updatedAt,
      record.updatedBy ?? null,
      JSON.stringify(record.dossier),
    ]
  );
  await client.query(
    `INSERT INTO workshop2_dossier_versions
      (collection_id, article_id, organization_id, version, updated_by, dossier_json)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
    [
      record.collectionId,
      record.articleId,
      orgId,
      record.version,
      record.updatedBy ?? null,
      JSON.stringify(record.dossier),
    ]
  );
  await client.query(
    `INSERT INTO workshop2_dossier_events
      (collection_id, article_id, organization_id, version, event_type, event_payload, created_by)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)`,
    [
      record.collectionId,
      record.articleId,
      orgId,
      record.version,
      eventType,
      JSON.stringify({ updatedAt: record.updatedAt, ...(eventPayload ?? {}) }),
      record.updatedBy ?? null,
    ]
  );
}
