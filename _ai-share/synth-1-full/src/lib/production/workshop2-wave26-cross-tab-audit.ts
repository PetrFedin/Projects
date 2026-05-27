/**
 * Wave 26: аудит persist — push ≥9.0 (merge/handoff, routing, vault sample, supply, plan T&A, sketch).
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave26PersistField =
  | 'category_merge_handoff_refresh'
  | 'release_routing_handoff_refresh'
  | 'vault_panel_sample_refresh'
  | 'supply_bundle_mirror'
  | 'plan_ta_mirror'
  | 'sketch_coverage_mirror';

export function auditWorkshop2Wave26Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave26PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave26Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave26Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
