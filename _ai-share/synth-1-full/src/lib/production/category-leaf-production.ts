/**
 * Профиль производства по листу категории (L1›L2›L3, `leafId`).
 *
 * **Источники правды (согласованность):**
 * - Дерево категорий и `leafId` — `src/lib/data/category-handbook.ts` → снимок `category-handbook.snapshot.json`.
 * - Оси атрибутов карточки / ТЗ для подборки — `info-pick-attribute-keys.ts` + `product-attributes` + матрица `tz-leaf-requirements`.
 * - Опционально узловые `CategoryNode.attributes` в справочнике — для узких кейсов; тогда `attributeBinding: hybrid` в переопределении.
 * - Профиль производства (этот модуль) — дефолты по L1/L2/L3 + `LEAF_PRODUCTION_PROFILE_OVERRIDES` по `leafId`.
 * - Версии таксономии — `taxonomyAliases` в снимке + `resolveHandbookLeafId` при чтении артикулов.
 */
import type { HandbookCategoryLeaf } from './category-handbook-snapshot-builder';
import { deriveDefaultLeafProductionProfile } from './category-leaf-production-defaults';
import { LEAF_PRODUCTION_PROFILE_OVERRIDES } from './category-leaf-production-overrides';
import type { LeafProductionProfile } from './category-leaf-production-types';
import { handbookCatL1FromLeaf } from './workshop-size-handbook';

export type { LeafProductionProfile } from './category-leaf-production-types';
export { LEAF_PRODUCTION_PROFILE_OVERRIDES } from './category-leaf-production-overrides';
export { TAXONOMY_LEAF_ALIASES, resolveCanonicalLeafId } from './category-taxonomy-aliases';

function mergeProfile(
  base: LeafProductionProfile,
  over: Partial<LeafProductionProfile>
): LeafProductionProfile {
  return {
    ...base,
    ...over,
    complianceTags: over.complianceTags ?? base.complianceTags,
    externalClassifiers: { ...base.externalClassifiers, ...over.externalClassifiers },
    marketplaceRefs: over.marketplaceRefs ?? base.marketplaceRefs,
    requiredDocuments: over.requiredDocuments ?? base.requiredDocuments,
    labelLocalesDefault: over.labelLocalesDefault ?? base.labelLocalesDefault,
    mandatoryLabelBlocks: over.mandatoryLabelBlocks ?? base.mandatoryLabelBlocks,
  };
}

export function getResolvedLeafProductionProfile(
  leaf: HandbookCategoryLeaf
): LeafProductionProfile {
  const base = deriveDefaultLeafProductionProfile(leaf);
  const sizeHint = handbookCatL1FromLeaf(leaf);
  const withSize: LeafProductionProfile = {
    ...base,
    ...(sizeHint ? { sizeParameterProfileId: sizeHint } : {}),
  };
  const over = LEAF_PRODUCTION_PROFILE_OVERRIDES[leaf.leafId] ?? {};
  return mergeProfile(withSize, over);
}

/** Короткая подпись для таблиц (RU). */
export function formatStockUnitRu(kind: LeafProductionProfile['stockUnitDefault']): string {
  const m: Record<LeafProductionProfile['stockUnitDefault'], string> = {
    piece: 'шт',
    pair: 'пара',
    set: 'компл.',
    volume_ml: 'мл',
    weight_g: 'г',
    length_m: 'м',
  };
  return m[kind] ?? kind;
}

const COMPLIANCE_ABBR: Partial<Record<string, string>> = {
  kids_product_tr_ts_007: 'дет.ТР',
  toy_tr_ts_008: 'игрушка',
  cosmetics_tr_ts_009: 'косм.',
  perfumery_tr_ts_009: 'парф.',
  textile_light_industry_tr_ts_017: 'лёгпром',
  footwear_tr_ts_017: 'обувь',
  electrical_low_voltage_tr_ts_004: 'низк.напр.',
  radio_emc_tr_ts_020: 'ЭМС',
  ppe_or_medical_context: 'СИЗ/мед.',
  general_consumer: 'потреб.',
};

export function formatComplianceSummary(tags: string[]): string {
  return tags.map((t) => COMPLIANCE_ABBR[t] ?? t).join(', ');
}
