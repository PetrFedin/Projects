/**
 * Умная градация: правила, шкала, frozen, связь с табелем.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { resolveWorkshop2GradingSizesFromDossier } from '@/lib/production/workshop2-grading-apply';

export type Workshop2GradingStatus = {
  ruleCount: number;
  sizeCount: number;
  frozenRuleCount: number;
  hasSampleScale: boolean;
  measurementPointCount: number;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

function measurementPointCountFromDossier(dossier: Workshop2DossierPhase1): number {
  const fromModel = dossier.productionModel?.measurements?.length ?? 0;
  if (fromModel > 0) return fromModel;
  const dims = dossier.sampleBasePerSizeDimensions ?? {};
  const firstSize = Object.keys(dims)[0];
  if (!firstSize) return 0;
  return Object.keys(dims[firstSize] ?? {}).length;
}

export function summarizeWorkshop2GradingStatus(
  dossier: Workshop2DossierPhase1,
  categoryLeaf?: HandbookCategoryLeaf | null
): Workshop2GradingStatus {
  const rules = dossier.gradingRules ?? [];
  const sizes = resolveWorkshop2GradingSizesFromDossier(dossier, categoryLeaf ?? null);
  const frozenRuleCount = rules.filter((r) => r.gradingFrozen).length;
  const hasSampleScale = Boolean(dossier.sampleSizeScaleId?.trim());
  const measurementPointCount = measurementPointCountFromDossier(dossier);

  let state: Workshop2GradingStatus['state'] = 'empty';
  if (rules.length > 0) {
    state =
      sizes.length >= 2 &&
      measurementPointCount > 0 &&
      rules.length >= Math.min(measurementPointCount, 1)
        ? 'ready'
        : 'partial';
  }

  let hintRu: string | undefined;
  if (rules.length === 0) {
    hintRu = 'Градация не применена — нажмите «Умная градация» или заполните табель образца.';
  } else if (!hasSampleScale) {
    hintRu =
      'Шкала размеров (sampleSizeScaleId) не задана — градация может не совпасть с фабрикой.';
  } else if (measurementPointCount === 0) {
    hintRu = 'Нет точек измерения в табеле — сначала заполните POM / sample base.';
  } else if (rules.length < measurementPointCount) {
    hintRu = `Правил градации ${rules.length} при ${measurementPointCount} POM — дозаполните матрицу.`;
  } else if (frozenRuleCount > 0 && frozenRuleCount < rules.length) {
    hintRu = `${frozenRuleCount} из ${rules.length} правил заморожены — пересчёт затронет только незамороженные.`;
  }

  return {
    ruleCount: rules.length,
    sizeCount: sizes.length,
    frozenRuleCount,
    hasSampleScale,
    measurementPointCount,
    state,
    hintRu,
  };
}

/** Wave U — blockers/readiness из gradingApplyMirror, не static demo sizes. */
export function summarizeWorkshop2GradingPanelDisplayFromMirror(input: {
  dossier: Workshop2DossierPhase1;
  live: Workshop2GradingStatus;
}): Workshop2GradingStatus & { mirrorBlockers: string[] } {
  const mirror = input.dossier.gradingApplyMirror;
  const mirrorBlockers: string[] = [];

  if (mirror?.blockerExport) {
    mirrorBlockers.push(
      mirror.hintRu ?? 'Шкала задана, но apply log отсутствует — export/handoff заблокирован.'
    );
  } else if (mirror?.state === 'partial' && mirror.hintRu) {
    mirrorBlockers.push(mirror.hintRu);
  } else if (!mirror?.mirroredAt && input.live.ruleCount > 0) {
    mirrorBlockers.push('Mirror градации не в PG — сохраните «Градация → PG».');
  }

  if (!mirror?.mirroredAt) {
    return { ...input.live, mirrorBlockers };
  }

  return {
    ruleCount: mirror.ruleCount ?? input.live.ruleCount,
    sizeCount: mirror.sizeCount ?? input.live.sizeCount,
    frozenRuleCount: input.live.frozenRuleCount,
    hasSampleScale: input.live.hasSampleScale,
    measurementPointCount: input.live.measurementPointCount,
    state: mirror.state ?? input.live.state,
    hintRu: mirror.hintRu ?? input.live.hintRu,
    mirrorBlockers,
  };
}
