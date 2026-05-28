/**
 * Wave 21 #12: аудит server SKU check в досье + gate sample-order.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2SkuAvailabilityResult } from '@/lib/production/workshop2-article-sku-availability-client';

export function buildWorkshop2ArticleSkuValidationMirror(input: {
  sku: string;
  result: Workshop2SkuAvailabilityResult;
}): NonNullable<Workshop2DossierPhase1['articleSkuValidationMirror']> {
  const blockerSampleOrder = !input.result.available && input.result.source === 'postgres';

  let hintRu = input.result.messageRu;
  if (!hintRu && blockerSampleOrder) {
    hintRu = `SKU «${input.sku}» занят в PG — разрешите конфликт перед образцом.`;
  }

  const blockerHandoff = blockerSampleOrder;

  return {
    mirroredAt: new Date().toISOString(),
    sku: input.sku.trim(),
    available: input.result.available,
    source: input.result.source,
    blockerSampleOrder,
    blockerHandoff,
    hintRu,
  };
}

export function evaluateWorkshop2SkuValidationHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.articleSkuValidationMirror;
  if (!mirror) {
    return {
      id: 'article.sku.mirror_missing_handoff',
      severity: 'warning',
      messageRu: 'Server-проверка SKU не зафиксирована — обновите аудит SKU перед handoff.',
    };
  }
  if (mirror.blockerHandoff) {
    return {
      id: 'article.sku.conflict_handoff',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'SKU конфликтует в PG — handoff commit заблокирован.',
    };
  }
  return null;
}

export function persistWorkshop2ArticleSkuValidationMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: { sku: string; result: Workshop2SkuAvailabilityResult }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    articleSkuValidationMirror: buildWorkshop2ArticleSkuValidationMirror(input),
  };
}

export function evaluateWorkshop2SkuValidationSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.articleSkuValidationMirror;
  if (!mirror) {
    return {
      id: 'article.sku.mirror_missing',
      severity: 'warning',
      messageRu: 'Server-проверка SKU не зафиксирована в досье — обновите аудит SKU.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'article.sku.conflict',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'SKU конфликтует в PG — заказ образца заблокирован.',
    };
  }
  if (mirror.source === 'local_only' && !mirror.available) {
    return {
      id: 'article.sku.local_duplicate',
      severity: 'warning',
      messageRu: mirror.hintRu ?? 'SKU дублируется в local inventory.',
    };
  }
  return null;
}
