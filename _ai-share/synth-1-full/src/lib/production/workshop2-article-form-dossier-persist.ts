/**
 * Wave 25 #11: зеркало commit формы создания + gate sample-order.
 */
import type { Workshop2ArticleFormReadiness } from '@/lib/production/workshop2-article-form-readiness';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2ArticleFormMirror(input: {
  readiness: Workshop2ArticleFormReadiness;
  sku: string;
  categoryLeafId: string;
}): NonNullable<Workshop2DossierPhase1['articleFormMirror']> {
  const blockerSampleOrder = input.readiness.state === 'blocked' || !input.readiness.canSubmit;

  return {
    mirroredAt: new Date().toISOString(),
    sku: input.sku.trim(),
    categoryLeafId: input.categoryLeafId.trim(),
    formState: input.readiness.state,
    canSubmit: input.readiness.canSubmit,
    errorCount: input.readiness.errorCount,
    warningCount: input.readiness.warningCount,
    blockerSampleOrder,
    hintRu: input.readiness.hintRu,
  };
}

export function persistWorkshop2ArticleFormMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    readiness: Workshop2ArticleFormReadiness;
    sku: string;
    categoryLeafId: string;
  }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    articleFormMirror: buildWorkshop2ArticleFormMirror(input),
  };
}

export function evaluateWorkshop2ArticleFormMirrorSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.articleFormMirror;
  if (!mirror) {
    return {
      id: 'article.form.mirror_missing',
      severity: 'warning',
      messageRu:
        'Снимок формы создания не в PG — пересохраните артикул или откройте workspace для hydrate.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'article.form.not_ready',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? 'Форма создания была не готова к commit — проверьте SKU и категорию.',
    };
  }
  if (mirror.formState === 'warn') {
    return {
      id: 'article.form.warnings',
      severity: 'warning',
      messageRu:
        mirror.hintRu ??
        `При создании было ${mirror.warningCount} предупреждений формы — проверьте паспорт.`,
    };
  }
  return null;
}
