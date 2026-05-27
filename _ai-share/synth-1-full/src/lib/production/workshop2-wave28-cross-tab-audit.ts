/**
 * Wave 28: аудит persist — hub onboarding/inventory, PLM, activity, rollup, matchmaker.
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave28PersistField =
  | 'hub_onboarding_mirror'
  | 'hub_inventory_mirror'
  | 'plm_outbox_mirror'
  | 'hub_activity_mirror'
  | 'hub_collection_rollup_mirror'
  | 'matchmaker_mirror';

export function auditWorkshop2Wave28Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave28PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave28Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave28Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
