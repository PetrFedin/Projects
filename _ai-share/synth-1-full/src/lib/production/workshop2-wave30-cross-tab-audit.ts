/**
 * Wave 30: аудит persist — filter preset, R&D, CAD vault, routing, PO ERP, AQL.
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave30PersistField =
  | 'hub_filter_preset_mirror'
  | 'rnd_lifecycle_mirror'
  | 'cad_vault_link_mirror'
  | 'smart_routing_mirror'
  | 'purchase_order_erp_mirror'
  | 'qc_aql_mirror';

export function auditWorkshop2Wave30Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave30PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave30Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave30Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
