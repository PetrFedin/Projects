import { partitionHandbookAndFree } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import {
  syncSampleBaseSizePartsAndPruneDims,
  upsertCanonicalDual,
  upsertCanonicalMultiHandbookAndFree,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import {
  defaultSizeScaleIdForLeaf,
  getAttributeById,
  resolveEffectiveParametersForLeaf,
  resolveSampleBaseSizeParametersForLeaf,
} from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { effectiveMoqTargetMaxPieces } from '@/lib/production/workshop2-phase1-dossier-storage';
import { getWorkshopSampleSizeScaleOptions } from '@/lib/production/workshop-size-handbook';

/** Сброс `sampleSizeScaleId`, если опции листа пусты или id не входит в список. */
export function pruneSampleSizeScaleForLeaf(
  prev: Workshop2DossierPhase1,
  currentLeaf: HandbookCategoryLeaf
): Workshop2DossierPhase1 {
  const opts = getWorkshopSampleSizeScaleOptions(currentLeaf);
  if (opts.length === 0) {
    if (prev.sampleSizeScaleId?.includes('::')) {
      return { ...prev, sampleSizeScaleId: undefined };
    }
    return prev;
  }
  const valid = new Set(opts.map((o) => o.key));
  if (prev.sampleSizeScaleId && !valid.has(prev.sampleSizeScaleId)) {
    return { ...prev, sampleSizeScaleId: undefined };
  }
  return prev;
}

/** Обрезка частей sample base size под допустимые параметры листа и MOQ. */
export function syncSampleBaseSizePartsForLeaf(
  prev: Workshop2DossierPhase1,
  currentLeaf: HandbookCategoryLeaf
): Workshop2DossierPhase1 {
  const attr = getAttributeById('sampleBaseSize');
  if (!attr) return prev;
  const scale = prev.sampleSizeScaleId ?? defaultSizeScaleIdForLeaf(currentLeaf);
  const params = resolveSampleBaseSizeParametersForLeaf(attr, currentLeaf, scale);
  const allow = new Set(params.map((p) => p.parameterId));
  const a = prev.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
  );
  if (!a) return prev;
  const { hbs, ft } = partitionHandbookAndFree(a);
  if (!hbs.length) return prev;
  const keep = hbs.filter((hb) => hb.parameterId && allow.has(hb.parameterId));
  if (keep.length === hbs.length) return prev;
  const parts = keep.map((v) => ({
    parameterId: v.parameterId!,
    displayLabel: v.displayLabel ?? '',
  }));
  const cap = effectiveMoqTargetMaxPieces(prev.passportProductionBrief);
  const capped = parts.slice(0, Math.floor(cap));
  return syncSampleBaseSizePartsAndPruneDims(prev, capped, ft?.text ?? '');
}

/**
 * Линия «Сумки»: сузить `bag-type` по L2/L3; при одном допустимом варианте — выбрать автоматически.
 * Вызывать только когда `currentLeaf.l1Name === 'Сумки'`.
 */
export function syncBagTypeAssignmentForBagsLeaf(
  prev: Workshop2DossierPhase1,
  currentLeaf: HandbookCategoryLeaf
): Workshop2DossierPhase1 {
  const attr = getAttributeById('bag-type');
  if (!attr) return prev;
  const allowed = resolveEffectiveParametersForLeaf(attr, currentLeaf);
  const allowSet = new Set(allowed.map((p) => p.parameterId));
  const a = prev.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'bag-type');
  const { hbs, ft } = partitionHandbookAndFree(a);
  const ftText = ft?.text ?? '';
  if (hbs.length) {
    const keep = hbs.filter((h) => h.parameterId && allowSet.has(h.parameterId));
    if (keep.length !== hbs.length) {
      return upsertCanonicalMultiHandbookAndFree(prev, 'bag-type', keep, ftText);
    }
    return prev;
  }
  if (allowed.length === 1) {
    const p = allowed[0]!;
    return upsertCanonicalDual(
      prev,
      'bag-type',
      { parameterId: p.parameterId, displayLabel: p.label },
      ftText
    );
  }
  return prev;
}
