/**
 * Wave 22: аудит persist полей досье — events + local bridge.
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave22PersistField =
  | 'hub_filter_mirror'
  | 'visual_references_mirror'
  | 'smart_routing_mirror'
  | 'purchase_order_erp_mirror'
  | 'fit_sessions_mirror'
  | 'logistics_shipment_mirror';

export function auditWorkshop2Wave22Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave22PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave22Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave22Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
