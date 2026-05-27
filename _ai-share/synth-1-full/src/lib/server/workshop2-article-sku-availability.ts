import 'server-only';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { normalizeLocalSkuCode } from '@/lib/production/local-collection-inventory';

export type Workshop2SkuConflict = {
  collectionId: string;
  articleId: string;
  sku: string;
};

/** Ищет дубликат SKU в PG-досье (assignments attributeId=sku). */
export async function findWorkshop2PgSkuConflict(input: {
  sku: string;
  collectionId: string;
  excludeArticleId?: string;
  organizationId?: string;
}): Promise<Workshop2SkuConflict | null> {
  const normalized = normalizeLocalSkuCode(input.sku);
  const collectionId = input.collectionId.trim();
  if (!normalized || !collectionId) return null;

  if (!isWorkshop2PostgresEnabled()) {
    return null;
  }

  await ensureWorkshop2PgSchema();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  const excludeArticleId = input.excludeArticleId?.trim() ?? '';
  const res = await getWorkshop2PgPool().query<{
    collection_id: string;
    article_id: string;
    sku_text: string;
  }>(
    `SELECT d.collection_id, d.article_id, v.value->>'text' AS sku_text
     FROM workshop2_dossiers d
     CROSS JOIN LATERAL jsonb_array_elements(COALESCE(d.dossier_json->'assignments', '[]'::jsonb)) a
     CROSS JOIN LATERAL jsonb_array_elements(COALESCE(a->'values', '[]'::jsonb)) v
     WHERE d.organization_id = $1
       AND d.collection_id = $2
       AND a->>'attributeId' = 'sku'
       AND upper(trim(v.value->>'text')) = $3
       AND ($4 = '' OR d.article_id <> $4)
     LIMIT 1`,
    [orgId, collectionId, normalized, excludeArticleId]
  );

  const row = res.rows[0];
  if (!row) return null;
  return {
    collectionId: String(row.collection_id),
    articleId: String(row.article_id),
    sku: String(row.sku_text ?? normalized),
  };
}
