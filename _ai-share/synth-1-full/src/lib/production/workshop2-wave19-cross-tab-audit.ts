/**
 * Wave 19: аудит persist полей досье — local event bridge + POST events (cross-tab / hub).
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave19PersistField =
  | 'hub_onboarding_mirror'
  | 'hub_pg_overlay'
  | 'overview_snapshot'
  | 'dossier_layout'
  | 'stock_wms_ledger'
  | 'related_vault_count';

export function auditWorkshop2Wave19Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave19PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave19Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave19Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
