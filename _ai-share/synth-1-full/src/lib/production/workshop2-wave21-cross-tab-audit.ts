/**
 * Wave 21: аудит persist полей досье — events + local bridge.
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave21PersistField =
  | 'hub_collection_rollup_mirror'
  | 'references_mirror'
  | 'backend_health_mirror'
  | 'article_sku_validation_mirror'
  | 'plan_po_bundle_snapshot'
  | 'supply_risk_snapshot';

export function auditWorkshop2Wave21Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave21PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave21Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave21Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
