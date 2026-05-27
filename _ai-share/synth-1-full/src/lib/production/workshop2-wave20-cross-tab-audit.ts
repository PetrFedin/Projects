/**
 * Wave 20: аудит persist полей досье — events + local bridge.
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave20PersistField =
  | 'plm_outbox_audit'
  | 'setup_health_mirror'
  | 'supplier_qc_snapshot'
  | 'hub_activity_mirror'
  | 'sustainability_lca_snapshot'
  | 'matchmaker_handoff_ack';

export function auditWorkshop2Wave20Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave20PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave20Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave20Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
