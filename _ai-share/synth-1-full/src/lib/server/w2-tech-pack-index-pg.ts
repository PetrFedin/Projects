import pg from 'pg';

type Pool = pg.Pool;

let pool: Pool | null = null;
let inited = false;

export function w2TechPackIndexPgEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function getPool(): Pool | null {
  if (!w2TechPackIndexPgEnabled()) return null;
  if (pool) return pool;
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 20_000,
    });
    return pool;
  } catch {
    return null;
  }
}

export type W2TechPackIndexRow = {
  collectionId: string;
  articleId: string;
  attachmentId: string;
  objectKey: string;
  contentSha256Hex: string;
  etag: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  uploadedBy: string | null;
  handoffStatus: string;
  packageRevision: string | null;
  updatedAt: string;
};

const DDL = `
CREATE TABLE IF NOT EXISTS w2_techpack_attachment_index (
  collection_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  attachment_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  content_sha256_hex TEXT NOT NULL,
  etag TEXT,
  content_type TEXT,
  size_bytes BIGINT,
  uploaded_by TEXT,
  handoff_status TEXT NOT NULL DEFAULT 'none',
  package_revision TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, article_id, attachment_id)
);
CREATE INDEX IF NOT EXISTS w2_techpack_index_article
  ON w2_techpack_attachment_index (collection_id, article_id);
`;

export async function initW2TechPackIndexTableIfNeeded(): Promise<void> {
  if (inited) return;
  const p = getPool();
  if (!p) return;
  try {
    await p.query(DDL);
    inited = true;
  } catch (e) {
    console.error('[w2_techpack_index]', e);
  }
}

export async function upsertW2TechPackIndexRow(
  row: Omit<W2TechPackIndexRow, 'updatedAt'> & { updatedAt?: string }
): Promise<void> {
  const p = getPool();
  if (!p) {
    throw new Error('pg_pool_unavailable');
  }
  await initW2TechPackIndexTableIfNeeded();
  const updatedAt = row.updatedAt ?? new Date().toISOString();
  await p.query(
    `INSERT INTO w2_techpack_attachment_index (
      collection_id, article_id, attachment_id, object_key, content_sha256_hex, etag, content_type, size_bytes, uploaded_by, handoff_status, package_revision, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (collection_id, article_id, attachment_id) DO UPDATE SET
      object_key = EXCLUDED.object_key,
      content_sha256_hex = EXCLUDED.content_sha256_hex,
      etag = EXCLUDED.etag,
      content_type = EXCLUDED.content_type,
      size_bytes = EXCLUDED.size_bytes,
      uploaded_by = EXCLUDED.uploaded_by,
      handoff_status = EXCLUDED.handoff_status,
      package_revision = EXCLUDED.package_revision,
      updated_at = EXCLUDED.updated_at`,
    [
      row.collectionId,
      row.articleId,
      row.attachmentId,
      row.objectKey,
      row.contentSha256Hex,
      row.etag,
      row.contentType,
      row.sizeBytes,
      row.uploadedBy,
      row.handoffStatus,
      row.packageRevision,
      updatedAt,
    ]
  );
}

export async function getW2TechPackIndexRow(
  collectionId: string,
  articleId: string,
  attachmentId: string
): Promise<W2TechPackIndexRow | null> {
  const p = getPool();
  if (!p) return null;
  await initW2TechPackIndexTableIfNeeded();
  const r = await p.query(
    `SELECT collection_id, article_id, attachment_id, object_key, content_sha256_hex, etag, content_type, size_bytes, uploaded_by, handoff_status, package_revision, updated_at
     FROM w2_techpack_attachment_index
     WHERE collection_id = $1 AND article_id = $2 AND attachment_id = $3`,
    [collectionId, articleId, attachmentId]
  );
  if (r.rows.length === 0) return null;
  const o = r.rows[0] as Record<string, unknown>;
  return {
    collectionId: String(o.collection_id),
    articleId: String(o.article_id),
    attachmentId: String(o.attachment_id),
    objectKey: String(o.object_key),
    contentSha256Hex: String(o.content_sha256_hex),
    etag: o.etag != null ? String(o.etag) : null,
    contentType: o.content_type != null ? String(o.content_type) : null,
    sizeBytes: o.size_bytes != null ? Number(o.size_bytes) : null,
    uploadedBy: o.uploaded_by != null ? String(o.uploaded_by) : null,
    handoffStatus: String(o.handoff_status),
    packageRevision: o.package_revision != null ? String(o.package_revision) : null,
    updatedAt: new Date(o.updated_at as string).toISOString(),
  };
}

export async function listW2TechPackIndexForArticle(
  collectionId: string,
  articleId: string
): Promise<W2TechPackIndexRow[]> {
  const p = getPool();
  if (!p) return [];
  await initW2TechPackIndexTableIfNeeded();
  const r = await p.query(
    `SELECT collection_id, article_id, attachment_id, object_key, content_sha256_hex, etag, content_type, size_bytes, uploaded_by, handoff_status, package_revision, updated_at
     FROM w2_techpack_attachment_index
     WHERE collection_id = $1 AND article_id = $2
     ORDER BY updated_at DESC`,
    [collectionId, articleId]
  );
  return r.rows.map((o) => {
    const x = o as Record<string, unknown>;
    return {
      collectionId: String(x.collection_id),
      articleId: String(x.article_id),
      attachmentId: String(x.attachment_id),
      objectKey: String(x.object_key),
      contentSha256Hex: String(x.content_sha256_hex),
      etag: x.etag != null ? String(x.etag) : null,
      contentType: x.content_type != null ? String(x.content_type) : null,
      sizeBytes: x.size_bytes != null ? Number(x.size_bytes) : null,
      uploadedBy: x.uploaded_by != null ? String(x.uploaded_by) : null,
      handoffStatus: String(x.handoff_status),
      packageRevision: x.package_revision != null ? String(x.package_revision) : null,
      updatedAt: new Date(x.updated_at as string).toISOString(),
    };
  });
}

export async function updateHandoffOnIndex(
  collectionId: string,
  articleId: string,
  attachmentId: string,
  handoffStatus: string,
  packageRevision?: string | null
): Promise<void> {
  const p = getPool();
  if (!p) {
    throw new Error('pg_pool_unavailable');
  }
  await initW2TechPackIndexTableIfNeeded();
  await p.query(
    `UPDATE w2_techpack_attachment_index
     SET handoff_status = $4, package_revision = COALESCE($5, package_revision), updated_at = NOW()
     WHERE collection_id = $1 AND article_id = $2 AND attachment_id = $3`,
    [collectionId, articleId, attachmentId, handoffStatus, packageRevision ?? null]
  );
}
