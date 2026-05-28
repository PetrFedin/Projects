/**
 * Отложенное заполнение полей ТЗ фазы 1 («Позже (лок.)»).
 *
 * Модель:
 * - `deferredAttrIds` — явно отложено (не блокирует % готовности на шаге 1).
 * - `fillNowAttrIds` — необязательные поля каталога, которые пользователь решил заполнить сейчас
 *   (по умолчанию необязательные на шаге 1 не входят в знаменатель готовности).
 */

import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS } from '@/lib/production/workshop2-passport-check';
import {
  W2_BRIEF_DEFER_ID_PLANNED_LAUNCH_CUSTOM,
  W2_BRIEF_DEFER_BRAND_NOTES,
  W2_BRIEF_DEFER_LIFECYCLE_TA,
  W2_BRIEF_DEFER_PACKAGING_NOTE,
  W2_BRIEF_DEFER_PRODUCTION_STRATEGY,
  W2_BRIEF_DEFER_TARGET_FOB,
  W2_BRIEF_DEFER_TARGET_MARGIN_PCT,
  W2_BRIEF_DEFER_TARGET_RETAIL_PRICE,
  W2_BRIEF_DEFER_WEIGHT_DIMS,
  W2_CONSTRUCTION_CAD_DEFER_ID,
  W2_CONSTRUCTION_SKETCHES_DEFER_ID,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';

export type Workshop2TzDeferPhase = '1' | '2' | '3';

export type Workshop2FieldDeferMode = 'later' | 'now';

/** Синтетические ключи и необязательные атрибуты — «Позже» в новом пустом досье по умолчанию. */
export const W2_PHASE1_DEFAULT_DEFERRED_FIELD_KEYS: readonly string[] = [
  W2_BRIEF_DEFER_ID_PLANNED_LAUNCH_CUSTOM,
  W2_BRIEF_DEFER_TARGET_RETAIL_PRICE,
  W2_BRIEF_DEFER_TARGET_MARGIN_PCT,
  W2_BRIEF_DEFER_TARGET_FOB,
  W2_BRIEF_DEFER_PACKAGING_NOTE,
  W2_BRIEF_DEFER_WEIGHT_DIMS,
  W2_BRIEF_DEFER_LIFECYCLE_TA,
  W2_BRIEF_DEFER_PRODUCTION_STRATEGY,
  W2_BRIEF_DEFER_BRAND_NOTES,
  W2_CONSTRUCTION_CAD_DEFER_ID,
  W2_CONSTRUCTION_SKETCHES_DEFER_ID,
  'customsValueIncotermsNote',
  ...PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS,
];

export function resolveWorkshop2DeferredAttrIdSet(dossier: Workshop2DossierPhase1): Set<string> {
  return new Set(dossier.deferredAttrIds ?? []);
}

export function resolveWorkshop2FillNowAttrIdSet(dossier: Workshop2DossierPhase1): Set<string> {
  return new Set(dossier.fillNowAttrIds ?? []);
}

/** Набор отложенных ключей для нового досье (копия, без мутаций). */
export function defaultWorkshop2Phase1DeferredFieldKeys(): string[] {
  return [...W2_PHASE1_DEFAULT_DEFERRED_FIELD_KEYS];
}

export function isWorkshop2CatalogRowRequiredForPhase1Readiness(
  row: ResolvedPhase1AttributeRow,
  tzPhase: Workshop2TzDeferPhase,
  deferredSet: ReadonlySet<string>,
  fillNowSet: ReadonlySet<string>
): boolean {
  const id = row.attribute.attributeId;
  if (deferredSet.has(id)) return false;
  if (tzPhase !== '1') return true;
  if (row.attribute.requiredForPhase1) return true;
  return fillNowSet.has(id);
}

export function isWorkshop2DeferLaterChecked(
  fieldKey: string,
  dossier: Workshop2DossierPhase1,
  opts?: { requiredForPhase1?: boolean; tzPhase?: Workshop2TzDeferPhase }
): boolean {
  const tzPhase = opts?.tzPhase ?? '1';
  const deferredSet = resolveWorkshop2DeferredAttrIdSet(dossier);
  const fillNowSet = resolveWorkshop2FillNowAttrIdSet(dossier);
  if (deferredSet.has(fieldKey)) return true;
  if (tzPhase === '1' && opts?.requiredForPhase1 === false && !fillNowSet.has(fieldKey)) {
    return true;
  }
  return false;
}

/** Переключение «Позже (лок.)» с учётом необязательных полей каталога. */
export function applyWorkshop2DeferLaterToggle(
  dossier: Workshop2DossierPhase1,
  fieldKey: string,
  opts?: { requiredForPhase1?: boolean; tzPhase?: Workshop2TzDeferPhase }
): Workshop2DossierPhase1 {
  const tzPhase = opts?.tzPhase ?? '1';
  const currentlyLater = isWorkshop2DeferLaterChecked(fieldKey, dossier, opts);
  const deferredSet = new Set(dossier.deferredAttrIds ?? []);
  const fillNowSet = new Set(dossier.fillNowAttrIds ?? []);
  const optionalCatalog = tzPhase === '1' && opts?.requiredForPhase1 === false;

  if (currentlyLater) {
    deferredSet.delete(fieldKey);
    if (optionalCatalog) fillNowSet.add(fieldKey);
  } else {
    deferredSet.add(fieldKey);
    fillNowSet.delete(fieldKey);
  }

  return {
    ...dossier,
    deferredAttrIds: [...deferredSet],
    fillNowAttrIds: fillNowSet.size > 0 ? [...fillNowSet] : undefined,
  };
}

export function mergeWorkshop2Phase1DeferredDefaults(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  if ((dossier.deferredAttrIds?.length ?? 0) > 0) return dossier;
  return {
    ...dossier,
    deferredAttrIds: defaultWorkshop2Phase1DeferredFieldKeys(),
  };
}

export function catalogAttributeRequiredForPhase1(
  attr: AttributeCatalogAttribute | undefined
): boolean {
  return Boolean(attr?.requiredForPhase1);
}
