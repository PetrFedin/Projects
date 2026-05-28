/**
 * Wave 31: аудит persist — visual refs, fit sessions, plan PO, supply risk, logistics, WMS.
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave31PersistField =
  | 'visual_references_mirror'
  | 'fit_sessions_mirror'
  | 'plan_po_bundle_snapshot'
  | 'supply_risk_snapshot'
  | 'logistics_shipment_mirror'
  | 'stock_wms_ledger';

export function auditWorkshop2Wave31Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave31PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave31Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave31Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
