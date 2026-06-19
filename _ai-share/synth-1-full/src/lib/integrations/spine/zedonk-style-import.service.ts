/**
 * Wave D4 · Zedonk style import → dossier costing hints (pillar 1 development).
 */
import 'server-only';

import { WORKSHOP2_ARTICLE_CONTEXT_TYPE } from '@/lib/production/workshop2-domain-event-types';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { upsertExternalRef } from './integration-external-refs-persistence.file';
import {
  upsertZedonkStyleEnrich,
  type ZedonkStyleEnrichRecord,
} from './zedonk-style-enrich-persistence.file';

export type ZedonkStyleImportPayload = {
  styleId: string;
  collectionId: string;
  articleId: string;
  makeCostUsd?: number;
  freightUsd?: number;
  dutyPct?: number;
};

export async function importZedonkStyle(
  payload: ZedonkStyleImportPayload,
  organizationId?: string
): Promise<ZedonkStyleEnrichRecord> {
  const org = organizationId?.trim() || 'org-brand-001';
  const record = upsertZedonkStyleEnrich({
    styleId: payload.styleId,
    collectionId: payload.collectionId,
    articleId: payload.articleId,
    makeCostUsd: payload.makeCostUsd ?? 42,
    freightUsd: payload.freightUsd ?? 6.5,
    dutyPct: payload.dutyPct ?? 12,
    currency: 'USD',
    importedAt: new Date().toISOString(),
  });

  upsertExternalRef({
    platform: 'zedonk',
    externalId: payload.styleId,
    synthaEntityType: 'article',
    synthaEntityId: payload.articleId,
    lastSyncedAt: new Date().toISOString(),
    syncDirection: 'inbound',
  });

  await appendWorkshop2ContextualSystemMessage({
    organizationId: org,
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: `${payload.collectionId}:${payload.articleId}`,
    message: `Агентская консолидация · себестоимость $${record.makeCostUsd} · freight $${record.freightUsd} · duty ${record.dutyPct}%.`,
  });

  return record;
}

export function formatZedonkCostingHintRu(record: ZedonkStyleEnrichRecord): string {
  return `Себестоимость $${record.makeCostUsd} + freight $${record.freightUsd} · duty ${record.dutyPct}%`;
}
