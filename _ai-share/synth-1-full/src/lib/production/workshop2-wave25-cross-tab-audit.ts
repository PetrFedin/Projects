/**
 * Wave 25: аудит persist — push ≥9.0 (form, pulse handoff, grading handoff, CR, lab dip, docs index).
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave25PersistField =
  | 'article_form_mirror'
  | 'readiness_pulse_handoff_refresh'
  | 'grading_apply_handoff_refresh'
  | 'change_request_mirror'
  | 'lab_dip_mirror'
  | 'documents_index_mirror';

export function auditWorkshop2Wave25Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave25PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave25Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave25Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
