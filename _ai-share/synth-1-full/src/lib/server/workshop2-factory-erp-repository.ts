import 'server-only';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { syncWorkshop2PurchaseOrdersToErp } from '@/lib/server/workshop2-purchase-order-erp-sync';

/**
 * Контракт ERP фабрики (WORKSHOP2_FACTORY_ERP_BASE_URL):
 *
 * POST {baseUrl}/purchase-orders
 * Request: { collectionId, articleId, purchaseOrderId, lineRef?, supplierId?, qty, ...payload }
 * Response 2xx: { erpOrderId?: string; externalId?: string; id?: string }
 *
 * GET {baseUrl}/health — опциональная проверка доступности (не считается успешной синхронизацией).
 */
export type Workshop2FactoryErpSyncStatus = 'not_configured' | 'configured' | 'synced' | 'error';

export type Workshop2FactoryErpState = {
  collectionId: string;
  articleId: string;
  syncStatus: Workshop2FactoryErpSyncStatus;
  lastSyncAt?: string;
  lastError?: string;
  baseUrlConfigured: boolean;
  baseUrl?: string;
  erpOrderId?: string;
  payloadPreview?: Record<string, unknown>;
};

const memoryErp = new Map<string, Workshop2FactoryErpState>();

function roomKey(collectionId: string, articleId: string): string {
  return `${collectionId}::${articleId}`;
}

export function resolveWorkshop2FactoryErpBaseUrl(): string | undefined {
  return process.env.WORKSHOP2_FACTORY_ERP_BASE_URL?.trim() || undefined;
}

function defaultState(input: {
  collectionId: string;
  articleId: string;
  baseUrl?: string;
  persisted?: Partial<Workshop2FactoryErpState>;
}): Workshop2FactoryErpState {
  const baseUrlConfigured = Boolean(input.baseUrl);
  let syncStatus: Workshop2FactoryErpSyncStatus = 'not_configured';
  if (baseUrlConfigured) {
    syncStatus = input.persisted?.syncStatus === 'synced' ? 'synced' : 'configured';
  }
  return {
    collectionId: input.collectionId,
    articleId: input.articleId,
    syncStatus: input.persisted?.syncStatus ?? syncStatus,
    lastSyncAt: input.persisted?.lastSyncAt,
    lastError: input.persisted?.lastError,
    baseUrlConfigured,
    baseUrl: input.baseUrl,
    erpOrderId: input.persisted?.erpOrderId,
    payloadPreview: input.persisted?.payloadPreview,
  };
}

export async function getWorkshop2FactoryErpState(input: {
  collectionId: string;
  articleId: string;
}): Promise<Workshop2FactoryErpState> {
  const baseUrl = resolveWorkshop2FactoryErpBaseUrl();

  if (!isWorkshop2PostgresEnabled()) {
    const mem = memoryErp.get(roomKey(input.collectionId, input.articleId));
    return sanitizeWorkshop2FactoryErpState(defaultState({ ...input, baseUrl, persisted: mem }));
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    sync_status: string;
    last_sync_at: Date | null;
    last_error: string | null;
    payload_preview: Record<string, unknown>;
  }>(
    `SELECT sync_status, last_sync_at, last_error, payload_preview
     FROM workshop2_factory_erp_sync
     WHERE collection_id = $1 AND article_id = $2`,
    [input.collectionId, input.articleId]
  );
  const row = res.rows[0];
  const preview = row?.payload_preview ?? {};
  return sanitizeWorkshop2FactoryErpState(
    defaultState({
      ...input,
      baseUrl,
      persisted: row
        ? {
            syncStatus: row.sync_status as Workshop2FactoryErpSyncStatus,
            lastSyncAt: row.last_sync_at?.toISOString(),
            lastError: row.last_error ?? undefined,
            erpOrderId: typeof preview.erpOrderId === 'string' ? preview.erpOrderId : undefined,
            payloadPreview: preview,
          }
        : undefined,
    })
  );
}

/** POST purchase-order sync в ERP; health ping не считается успехом. */
export async function runWorkshop2FactoryErpSync(input: {
  collectionId: string;
  articleId: string;
  sku?: string;
}): Promise<Workshop2FactoryErpState> {
  const baseUrl = resolveWorkshop2FactoryErpBaseUrl();
  const now = new Date().toISOString();

  if (!baseUrl) {
    const state: Workshop2FactoryErpState = {
      collectionId: input.collectionId,
      articleId: input.articleId,
      syncStatus: 'not_configured',
      baseUrlConfigured: false,
      lastError: 'WORKSHOP2_FACTORY_ERP_BASE_URL не задан',
    };
    await persistFactoryErpState(state);
    return state;
  }

  let syncStatus: Workshop2FactoryErpSyncStatus = 'error';
  let lastError: string | undefined;
  let erpOrderId: string | undefined;
  const payloadPreview: Record<string, unknown> = {
    articleId: input.articleId,
    collectionId: input.collectionId,
    ...(input.sku ? { sku: input.sku } : {}),
    syncedAt: now,
    transport: 'purchase_orders_post',
  };

  try {
    const poResult = await syncWorkshop2PurchaseOrdersToErp({
      collectionId: input.collectionId,
      articleId: input.articleId,
    });

    payloadPreview.purchaseOrders = {
      synced: poResult.synced,
      failed: poResult.failed,
      skipped: poResult.skipped,
    };

    const syncedPo = poResult.orders.find((o) => o.status === 'synced' && o.erpExternalId);
    if (syncedPo?.erpExternalId) {
      syncStatus = 'synced';
      erpOrderId = syncedPo.erpExternalId;
      payloadPreview.erpOrderId = erpOrderId;
      payloadPreview.purchaseOrderId = syncedPo.id;
    } else if (poResult.failed > 0) {
      syncStatus = 'error';
      lastError = 'erp_po_sync_failed';
    } else if (poResult.synced > 0 && !syncedPo?.erpExternalId) {
      syncStatus = 'error';
      lastError = 'erp_missing_order_id';
    } else {
      // Нет PO — style-level POST (контракт ERP)
      const stylePayload = {
        collectionId: input.collectionId,
        articleId: input.articleId,
        sku: input.sku,
        event: 'style.sync',
      };
      const url = baseUrl.replace(/\/$/, '') + '/purchase-orders';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stylePayload),
        signal: AbortSignal.timeout(12_000),
      });
      payloadPreview.erpResponseStatus = res.status;
      if (!res.ok) {
        syncStatus = 'error';
        lastError = `erp_http_${res.status}`;
      } else {
        let json: Record<string, unknown> = {};
        try {
          json = (await res.json()) as Record<string, unknown>;
        } catch {
          /* empty body */
        }
        erpOrderId = resolveErpOrderIdFromResponse(json);
        if (erpOrderId) {
          syncStatus = 'synced';
          payloadPreview.erpOrderId = erpOrderId;
        } else {
          syncStatus = 'error';
          lastError = 'erp_missing_order_id';
        }
      }
    }
  } catch (e) {
    syncStatus = 'error';
    lastError = e instanceof Error ? e.message : 'erp_unreachable';
  }

  const state: Workshop2FactoryErpState = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    syncStatus,
    lastSyncAt: syncStatus === 'synced' || syncStatus === 'error' ? now : undefined,
    lastError,
    baseUrlConfigured: true,
    baseUrl,
    erpOrderId,
    payloadPreview,
  };

  const sanitized = sanitizeWorkshop2FactoryErpState(state);
  await persistFactoryErpState(sanitized);
  return sanitized;
}

export function resolveErpOrderIdFromResponse(json: Record<string, unknown>): string | undefined {
  const candidates = [json.erpOrderId, json.externalId, json.id];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return undefined;
}

/**
 * «Синхронизирован» только при реальном erpOrderId из POST /purchase-orders.
 * Иначе UI не должен показывать успех (честная деградация configured/error).
 */
export function sanitizeWorkshop2FactoryErpState(
  state: Workshop2FactoryErpState
): Workshop2FactoryErpState {
  if (state.syncStatus !== 'synced') return state;
  const id = state.erpOrderId?.trim();
  if (id) return state;
  return {
    ...state,
    syncStatus: state.baseUrlConfigured ? 'configured' : 'not_configured',
    lastError: state.lastError ?? 'erp_missing_order_id',
    erpOrderId: undefined,
  };
}

async function persistFactoryErpState(state: Workshop2FactoryErpState): Promise<void> {
  if (!isWorkshop2PostgresEnabled()) {
    memoryErp.set(roomKey(state.collectionId, state.articleId), state);
    return;
  }

  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_factory_erp_sync
      (collection_id, article_id, sync_status, last_sync_at, last_error, payload_preview, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())
     ON CONFLICT (collection_id, article_id)
     DO UPDATE SET sync_status = EXCLUDED.sync_status,
       last_sync_at = EXCLUDED.last_sync_at,
       last_error = EXCLUDED.last_error,
       payload_preview = EXCLUDED.payload_preview,
       updated_at = NOW()`,
    [
      state.collectionId,
      state.articleId,
      state.syncStatus,
      state.lastSyncAt ?? null,
      state.lastError ?? null,
      JSON.stringify(state.payloadPreview ?? {}),
    ]
  );
}

export function clearWorkshop2FactoryErpMemoryForTests(): void {
  memoryErp.clear();
}
