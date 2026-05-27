/**
 * Wave 29: аудит persist — setup, references, backend health, SKU, SSE, supplier QC.
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave29PersistField =
  | 'setup_health_mirror'
  | 'references_mirror'
  | 'backend_health_mirror'
  | 'article_sku_validation_mirror'
  | 'sse_realtime_mirror'
  | 'supplier_qc_mirror';

export function auditWorkshop2Wave29Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave29PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave29Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave29Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
