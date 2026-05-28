/**
 * Домен Workshop2: одежда / обувь / аксессуары vs прочие категории.
 *
 * L1 в `category-handbook.snapshot.json` (audienceId справочника = `catalog`):
 * - **Одежда** — `catalog-apparel-*`
 * - **Обувь** — `catalog-shoes-*`
 * - **Аксессуары** — `catalog-accessories-*`
 *
 * Поле «Аудитория» в форме артикула (women, men, girls, …) — сегмент изделия,
 * не путать с `leaf.audienceId` таксономии. «Остальное» (`other`) допустимо
 * только вне домена одежды/обуви/аксессуаров.
 *
 * Унисекс — отдельный флаг; влияет на шкалу размеров и оси ТЗ, не заменяет аудиторию.
 */

import { findHandbookLeafById, type HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import { defaultWorkshopSampleSizeScaleKey } from '@/lib/production/workshop-size-handbook';

/** L1-названия домена «модный ассортимент» (одежда, обувь, аксессуары). */
export const APPAREL_FOOTWEAR_ACCESSORIES_L1_NAMES = ['Одежда', 'Обувь', 'Аксессуары'] as const;

/** Префиксы leafId в каталожной таксономии. */
export const APPAREL_FOOTWEAR_ACCESSORIES_LEAF_PREFIXES = [
  'catalog-apparel',
  'catalog-shoes',
  'catalog-accessories',
] as const;

/** Аудитории формы для домена одежды/обуви/аксессуаров (без «Остальное»). */
export const WORKSHOP2_APPAREL_AUDIENCE_IDS = ['women', 'men', 'girls', 'boys', 'newborn'] as const;

/** Аудитории вне домена модного ассортимента. */
export const WORKSHOP2_NON_APPAREL_AUDIENCE_IDS = ['other', 'newborn'] as const;

export type Workshop2ApparelDomain = 'apparel' | 'footwear' | 'accessories' | 'other';

export type Workshop2AttributeProfile = {
  domain: Workshop2ApparelDomain;
  /** Ключ для подсказок UI / синхронизации шкалы (women | men | kids | unisex-dual | generic). */
  measurementPresetId: string;
  showApparelConstructionAxes: boolean;
  showFootwearAxes: boolean;
  showAccessoriesAxes: boolean;
  /** Унисекс: двойная шкала / merged POM в ТЗ. */
  dualSizeScale: boolean;
  sizeScaleHintRu: string;
};

export function isApparelFootwearAccessoriesL1Name(l1Name: string | null | undefined): boolean {
  const l1 = (l1Name ?? '').trim();
  return (APPAREL_FOOTWEAR_ACCESSORIES_L1_NAMES as readonly string[]).includes(l1);
}

/**
 * Лист или L1 относится к одежде, обуви или аксессуарам.
 * Принимает `leafId` (например `catalog-shoes-g0-l0`) и/или `l1Name`.
 */
export function isApparelFootwearAccessoriesCategory(input: {
  leafId?: string | null;
  l1Name?: string | null;
}): boolean {
  if (isApparelFootwearAccessoriesL1Name(input.l1Name)) return true;
  const leaf = (input.leafId ?? '').trim().toLowerCase();
  if (!leaf) return false;
  return APPAREL_FOOTWEAR_ACCESSORIES_LEAF_PREFIXES.some((p) => leaf.startsWith(p));
}

export function resolveApparelDomainFromL1(
  l1Name: string | null | undefined
): Workshop2ApparelDomain {
  const l1 = (l1Name ?? '').trim();
  if (l1 === 'Одежда') return 'apparel';
  if (l1 === 'Обувь') return 'footwear';
  if (l1 === 'Аксессуары') return 'accessories';
  return 'other';
}

export function resolveL1NameForCategoryInput(input: {
  leafId?: string | null;
  l1Name?: string | null;
}): string | null {
  if (input.l1Name?.trim()) return input.l1Name.trim();
  const leaf = input.leafId ? findHandbookLeafById(input.leafId) : undefined;
  return leaf?.l1Name?.trim() ?? null;
}

export function isWorkshop2ApparelAudienceId(audienceId: string | null | undefined): boolean {
  const id = (audienceId ?? '').trim().toLowerCase();
  return (WORKSHOP2_APPAREL_AUDIENCE_IDS as readonly string[]).includes(id);
}

/** Детские id формы → `kids` в `production-params` / шкалах. */
export function normalizeWorkshopAudienceForProductionParams(
  audienceId: string | null | undefined,
  isUnisex?: boolean
): string {
  const id = (audienceId ?? '').trim().toLowerCase();
  if (!id) return 'catalog';
  if (isUnisex && (id === 'men' || id === 'women')) return 'unisex';
  if (id === 'girls' || id === 'boys' || id === 'newborn') return 'kids';
  return id;
}

/** Лист справочника с подставленной аудиторией из формы Workshop2 (для шкал и габаритов). */
export function handbookLeafWithWorkshopAudience(
  leaf: HandbookCategoryLeaf | undefined,
  workshopAudienceId: string | null | undefined
): HandbookCategoryLeaf | undefined {
  if (!leaf) return undefined;
  const aud = normalizeWorkshopAudienceForProductionParams(workshopAudienceId);
  if (!aud || aud === leaf.audienceId) return leaf;
  return { ...leaf, audienceId: aud };
}

export function filterWorkshop2AudiencesForCategory(
  allAudiences: readonly { id: string; name: string }[],
  isApparelDomain: boolean
): { id: string; name: string }[] {
  if (isApparelDomain) {
    return allAudiences.filter((a) => isWorkshop2ApparelAudienceId(a.id));
  }
  const allowed = new Set<string>(WORKSHOP2_NON_APPAREL_AUDIENCE_IDS);
  return allAudiences.filter((a) => allowed.has(a.id));
}

/** Аудитория по умолчанию для SKU с сегментом U (унисекс), не «Остальное». */
export function defaultAudienceIdForUnisexSku(): string {
  return 'men';
}

export function resolveWorkshop2AttributeProfile(input: {
  leafId?: string | null;
  l1Name?: string | null;
  audienceId?: string | null;
  isUnisex?: boolean;
}): Workshop2AttributeProfile {
  const l1 = resolveL1NameForCategoryInput(input);
  const domain = resolveApparelDomainFromL1(l1);
  const audience = normalizeWorkshopAudienceForProductionParams(input.audienceId, input.isUnisex);
  const isUnisex = input.isUnisex === true;

  let measurementPresetId = 'generic';
  if (audience === 'women') measurementPresetId = 'women';
  else if (audience === 'men') measurementPresetId = 'men';
  else if (audience === 'kids') measurementPresetId = 'kids';
  else if (audience === 'unisex') measurementPresetId = 'unisex-dual';

  const dualSizeScale =
    isUnisex && (domain === 'apparel' || domain === 'footwear' || domain === 'accessories');

  let sizeScaleHintRu = 'Шкала по категории и аудитории';
  if (domain === 'apparel') {
    sizeScaleHintRu = isUnisex
      ? 'Унисекс: двойная EU-сетка / габариты; оси конструкции одежды'
      : audience === 'men'
        ? 'Мужская сетка размеров и POM'
        : audience === 'kids'
          ? 'Детская сетка размеров'
          : 'Женская сетка размеров и POM';
  } else if (domain === 'footwear') {
    sizeScaleHintRu = isUnisex
      ? 'Унисекс: шкала обуви + атрибуты closure/lining/outsole'
      : 'Шкала обуви по выбранной аудитории';
  } else if (domain === 'accessories') {
    sizeScaleHintRu = 'Аксессуары: фурнитура и материал; размер — по типу изделия';
  }

  return {
    domain,
    measurementPresetId,
    showApparelConstructionAxes: domain === 'apparel',
    showFootwearAxes: domain === 'footwear',
    showAccessoriesAxes: domain === 'accessories',
    dualSizeScale,
    sizeScaleHintRu,
  };
}

export function defaultSampleSizeScaleIdForWorkshopLine(
  leaf: HandbookCategoryLeaf | undefined,
  workshopAudienceId: string | null | undefined,
  isUnisex?: boolean
): string | undefined {
  const effectiveLeaf = handbookLeafWithWorkshopAudience(leaf, workshopAudienceId);
  const key = defaultWorkshopSampleSizeScaleKey(effectiveLeaf, isUnisex);
  return key === 'apparel-alpha' ? undefined : key;
}
