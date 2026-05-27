import 'server-only';

import { randomUUID } from 'node:crypto';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

/** Статус PO: draft → pending_erp → synced | error */
export type Workshop2PurchaseOrderStatus = 'draft' | 'pending_erp' | 'synced' | 'error';

export type Workshop2PurchaseOrderSource =
  | 'bom_requisition'
  | 'material_request'
  | 'sample_plan'
  | 'manual';

export type Workshop2PurchaseOrderRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  lineRef?: string;
  supplierId?: string;
  qty: number;
  status: Workshop2PurchaseOrderStatus;
  erpExternalId?: string;
  syncedAt?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

const memoryPos: Workshop2PurchaseOrderRecord[] = [];

function mapRow(row: {
  id: string;
  collection_id: string;
  article_id: string;
  line_ref: string | null;
  supplier_id: string | null;
  qty: string | number;
  status: string;
  erp_external_id: string | null;
  synced_at: Date | null;
  payload: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
}): Workshop2PurchaseOrderRecord {
  return {
    id: String(row.id),
    collectionId: String(row.collection_id),
    articleId: String(row.article_id),
    lineRef: row.line_ref != null ? String(row.line_ref) : undefined,
    supplierId: row.supplier_id != null ? String(row.supplier_id) : undefined,
    qty: Number(row.qty),
    status: row.status as Workshop2PurchaseOrderStatus,
    erpExternalId: row.erp_external_id != null ? String(row.erp_external_id) : undefined,
    syncedAt: row.synced_at?.toISOString(),
    payload: row.payload ?? {},
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

/** Все PO поставщика (для QC scorecard) — memory или PG. */
export async function listWorkshop2PurchaseOrdersBySupplier(
  supplierId: string,
  organizationId?: string
): Promise<Workshop2PurchaseOrderRecord[]> {
  const sid = supplierId.trim();
  if (!sid) return [];

  if (!isWorkshop2PostgresEnabled()) {
    return memoryPos.filter((p) => (p.supplierId ?? '').trim() === sid);
  }

  await ensureWorkshop2PgSchema();
  const orgId = organizationId?.trim() || 'org-brand-001';
  const res = await getWorkshop2PgPool().query(
    `SELECT id, collection_id, article_id, line_ref, supplier_id, qty, status,
            erp_external_id, synced_at, payload, created_at, updated_at
     FROM workshop2_purchase_orders
     WHERE organization_id = $1 AND supplier_id = $2
     ORDER BY created_at DESC`,
    [orgId, sid]
  );
  return res.rows.map(mapRow);
}

export async function listWorkshop2PurchaseOrders(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
}): Promise<Workshop2PurchaseOrderRecord[]> {
  if (!isWorkshop2PostgresEnabled()) {
    return memoryPos.filter(
      (p) => p.collectionId === input.collectionId && p.articleId === input.articleId
    );
  }
  await ensureWorkshop2PgSchema();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  const res = await getWorkshop2PgPool().query(
    `SELECT id, collection_id, article_id, line_ref, supplier_id, qty, status,
            erp_external_id, synced_at, payload, created_at, updated_at
     FROM workshop2_purchase_orders
     WHERE collection_id = $1 AND article_id = $2 AND organization_id = $3
     ORDER BY created_at DESC`,
    [input.collectionId, input.articleId, orgId]
  );
  return res.rows.map(mapRow);
}

export async function createWorkshop2PurchaseOrder(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
  lineRef?: string;
  supplierId?: string;
  qty: number;
  status?: Workshop2PurchaseOrderStatus;
  payload?: Record<string, unknown>;
}): Promise<Workshop2PurchaseOrderRecord> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const record: Workshop2PurchaseOrderRecord = {
    id,
    collectionId: input.collectionId,
    articleId: input.articleId,
    lineRef: input.lineRef,
    supplierId: input.supplierId,
    qty: input.qty,
    status: input.status ?? 'draft',
    payload: input.payload ?? {},
    createdAt: now,
    updatedAt: now,
  };

  if (!isWorkshop2PostgresEnabled()) {
    memoryPos.push(record);
    return record;
  }

  await ensureWorkshop2PgSchema();
  const orgId = input.organizationId?.trim() || 'org-brand-001';
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_purchase_orders
      (id, collection_id, article_id, organization_id, line_ref, supplier_id, qty, status, payload)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`,
    [
      id,
      input.collectionId,
      input.articleId,
      orgId,
      input.lineRef ?? null,
      input.supplierId ?? null,
      input.qty,
      record.status,
      JSON.stringify(record.payload),
    ]
  );
  return record;
}

export async function updateWorkshop2PurchaseOrderErpSync(input: {
  id: string;
  collectionId: string;
  articleId: string;
  status: Workshop2PurchaseOrderStatus;
  erpExternalId?: string;
  syncedAt?: string;
  lastError?: string;
  payloadPatch?: Record<string, unknown>;
}): Promise<Workshop2PurchaseOrderRecord | null> {
  const syncedAt = input.syncedAt ?? new Date().toISOString();

  if (!isWorkshop2PostgresEnabled()) {
    const idx = memoryPos.findIndex((p) => p.id === input.id);
    if (idx < 0) return null;
    const prev = memoryPos[idx]!;
    const next: Workshop2PurchaseOrderRecord = {
      ...prev,
      status: input.status,
      erpExternalId: input.erpExternalId ?? prev.erpExternalId,
      syncedAt: input.status === 'synced' ? syncedAt : prev.syncedAt,
      payload: {
        ...prev.payload,
        ...(input.payloadPatch ?? {}),
        ...(input.lastError ? { lastError: input.lastError } : {}),
      },
      updatedAt: new Date().toISOString(),
    };
    memoryPos[idx] = next;
    return next;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query(
    `UPDATE workshop2_purchase_orders
     SET status = $4,
         erp_external_id = COALESCE($5, erp_external_id),
         synced_at = CASE WHEN $4 = 'synced' THEN COALESCE($6::timestamptz, NOW()) ELSE synced_at END,
         payload = payload || $7::jsonb,
         updated_at = NOW()
     WHERE id = $1 AND collection_id = $2 AND article_id = $3
     RETURNING id, collection_id, article_id, line_ref, supplier_id, qty, status,
               erp_external_id, synced_at, payload, created_at, updated_at`,
    [
      input.id,
      input.collectionId,
      input.articleId,
      input.status,
      input.erpExternalId ?? null,
      input.status === 'synced' ? syncedAt : null,
      JSON.stringify({
        ...(input.payloadPatch ?? {}),
        ...(input.lastError ? { lastError: input.lastError } : {}),
      }),
    ]
  );
  const row = res.rows[0];
  return row ? mapRow(row) : null;
}

/** Создаёт PO из заявок на материал (BOM requisition / material request). */
export async function createWorkshop2PurchaseOrdersFromRequisitions(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
  lines: Array<{
    lineRef?: string;
    materialLabel?: string;
    quantity?: number;
    unit?: string;
    requisitionId?: string;
    supplierId?: string;
  }>;
}): Promise<Workshop2PurchaseOrderRecord[]> {
  const created: Workshop2PurchaseOrderRecord[] = [];
  for (const line of input.lines) {
    const qty = line.quantity ?? 1;
    if (qty <= 0) continue;
    const po = await createWorkshop2PurchaseOrder({
      collectionId: input.collectionId,
      articleId: input.articleId,
      organizationId: input.organizationId,
      lineRef: line.lineRef,
      supplierId: line.supplierId,
      qty,
      status: 'draft',
      payload: {
        source: 'material_request' as Workshop2PurchaseOrderSource,
        materialLabel: line.materialLabel,
        unit: line.unit,
        requisitionId: line.requisitionId,
      },
    });
    created.push(po);
  }
  return created;
}

export async function linkPurchaseOrdersToSampleOrder(input: {
  sampleOrderId: string;
  collectionId: string;
  articleId: string;
  purchaseOrderIds: string[];
}): Promise<void> {
  if (!isWorkshop2PostgresEnabled()) return;
  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `UPDATE workshop2_sample_orders
     SET purchase_order_ids = $4::jsonb, updated_at = NOW()
     WHERE id = $1 AND collection_id = $2 AND article_id = $3`,
    [
      input.sampleOrderId,
      input.collectionId,
      input.articleId,
      JSON.stringify(input.purchaseOrderIds),
    ]
  );
}

export function clearWorkshop2PurchaseOrdersMemoryForTests(): void {
  memoryPos.length = 0;
}
