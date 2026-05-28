/**
 * Тонкий мост Workshop2 ↔ внешний PLM (`plm-system` в monorepo — подключить transport позже).
 * События сериализуются в JSON для очереди / webhook без переписывания event-bridge.
 */

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2PlmBridgeEventType = 'plm.dossier.saved' | 'plm.article.updated';

export type Workshop2PlmBridgeEnvelope = {
  type: Workshop2PlmBridgeEventType;
  emittedAt: string;
  source: 'workshop2';
  payload: Record<string, unknown>;
};

export function serializeWorkshop2PlmBridgeEvent(env: Workshop2PlmBridgeEnvelope): string {
  return JSON.stringify(env);
}

/** После успешного PUT досье на сервер — зеркало в PLM. */
export function mapWorkshop2DossierSavedToPlm(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  version: number;
  tzOverallPctHint?: number;
}): Workshop2PlmBridgeEnvelope {
  const leaf =
    input.dossier.categoryBindings?.find((b) => b.categoryLeafId?.trim())?.categoryLeafId?.trim() ??
    undefined;
  return {
    type: 'plm.dossier.saved',
    source: 'workshop2',
    emittedAt: input.dossier.updatedAt ?? new Date().toISOString(),
    payload: {
      collectionId: input.collectionId,
      articleId: input.articleId,
      dossierVersion: input.version,
      updatedBy: input.dossier.updatedBy,
      lifecycleState: input.dossier.lifecycleState,
      ...(leaf ? { categoryLeafId: leaf } : {}),
      ...(typeof input.tzOverallPctHint === 'number'
        ? { tzOverallPctHint: input.tzOverallPctHint }
        : {}),
    },
  };
}

/** Смена SKU/метаданных карточки артикула. */
export function mapWorkshop2ArticleUpdatedToPlm(input: {
  collectionId: string;
  articleId: string;
  sku?: string;
  name?: string;
}): Workshop2PlmBridgeEnvelope {
  return {
    type: 'plm.article.updated',
    source: 'workshop2',
    emittedAt: new Date().toISOString(),
    payload: {
      collectionId: input.collectionId,
      articleId: input.articleId,
      ...(input.sku ? { sku: input.sku } : {}),
      ...(input.name ? { name: input.name } : {}),
    },
  };
}

/** Dev hook: лог в консоль до появления реального PLM transport. */
export function publishWorkshop2PlmBridgeEvent(env: Workshop2PlmBridgeEnvelope): void {
  if (process.env.NODE_ENV === 'production') return;
  // eslint-disable-next-line no-console
  console.debug(
    '[workshop2-plm-bridge]',
    env.type,
    env.payload.collectionId,
    env.payload.articleId
  );
}
