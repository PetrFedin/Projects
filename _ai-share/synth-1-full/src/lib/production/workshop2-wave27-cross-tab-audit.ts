/**
 * Wave 27: аудит persist — push ≥9.0 (overview, related, layout, operational TZ, tech pack, handoff PDF).
 */
import { postWorkshop2Event } from '@/lib/production/workshop2-api-client';
import { workshop2EventBridge } from '@/lib/production/workshop2-event-bridge';

export type Workshop2Wave27PersistField =
  | 'overview_mirror'
  | 'related_sections_mirror'
  | 'dossier_layout_mirror'
  | 'operational_tz_mirror'
  | 'tech_pack_visual_mirror'
  | 'handoff_pdf_mirror';

export function auditWorkshop2Wave27Persist(input: {
  collectionId: string;
  articleId: string;
  field: Workshop2Wave27PersistField;
  persistedAt: string;
  by?: string;
  meta?: Record<string, unknown>;
}): void {
  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    at: input.persistedAt,
    ...(input.by ? { by: input.by } : {}),
    meta: { wave27Field: input.field, persistedAt: input.persistedAt, ...input.meta },
  };
  workshop2EventBridge.emit('DOSSIER_SAVED', payload);
  void postWorkshop2Event({
    collectionId: input.collectionId,
    articleId: input.articleId,
    eventType: 'DOSSIER_SAVED',
    eventPayload: {
      at: input.persistedAt,
      wave27Field: input.field,
      ...(input.by ? { by: input.by } : {}),
      ...(input.meta ?? {}),
    },
  }).catch(() => undefined);
}
