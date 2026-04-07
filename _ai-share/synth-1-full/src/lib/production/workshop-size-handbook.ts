/**
 * Размерные шкалы и габариты для Цеха 2 из справочника производства (`production-params`)
 * + базовая EU-сетка обхватов (верхняя одежда, женская линия).
 */
import type { HandbookCategoryLeaf } from './category-handbook-leaves';
import type { AttributeCatalogParameter } from './attribute-catalog.types';
import {
  type CategoryProductionParams,
  PRODUCTION_PARAMS_BY_CATEGORY,
} from '@/lib/data/production-params';

/** EU → альфа + базовые обхваты см (типовая сетка верхней одежды). */
export const WOMEN_OUTERWEAR_BODY_GRID_CM: {
  eu: string;
  alpha: string;
  chest: number;
  waist: number;
  hips: number;
}[] = [
  { eu: 'EU 32', alpha: 'XXS', chest: 80, waist: 62, hips: 86 },
  { eu: 'EU 34', alpha: 'XS', chest: 84, waist: 64, hips: 88 },
  { eu: 'EU 36', alpha: 'S', chest: 88, waist: 68, hips: 92 },
  { eu: 'EU 38', alpha: 'M', chest: 92, waist: 72, hips: 96 },
  { eu: 'EU 40', alpha: 'L', chest: 96, waist: 76, hips: 100 },
  { eu: 'EU 42', alpha: 'XL', chest: 100, waist: 80, hips: 104 },
];

export const MEN_OUTERWEAR_BODY_GRID_CM: {
  eu: string;
  alpha: string;
  chest: number;
  waist: number;
  hips: number;
}[] = [
  { eu: 'EU 44', alpha: 'XS', chest: 88, waist: 76, hips: 94 },
  { eu: 'EU 46', alpha: 'S', chest: 92, waist: 82, hips: 98 },
  { eu: 'EU 48', alpha: 'M', chest: 96, waist: 88, hips: 102 },
  { eu: 'EU 50', alpha: 'L', chest: 100, waist: 92, hips: 106 },
  { eu: 'EU 52', alpha: 'XL', chest: 104, waist: 96, hips: 110 },
  { eu: 'EU 54', alpha: 'XXL', chest: 108, waist: 100, hips: 114 },
];

const BODY_GRID_SCALE_ID = '__BODY_GRID';

function safeSizeToken(s: string): string {
  return encodeURIComponent(s.replace(/\s+/g, ' ').trim());
}

/** Маппинг листа категорий (аудитория + ур. 1) → id блока в `PRODUCTION_PARAMS_BY_CATEGORY`. */
export function handbookCatL1FromLeaf(leaf: HandbookCategoryLeaf | undefined): string | undefined {
  if (!leaf) return undefined;
  const a = leaf.audienceId;
  const l1 = leaf.l1Name.trim();
  const table: Record<string, Partial<Record<string, string>>> = {
    Одежда: {
      men: 'men-apparel',
      women: 'women-apparel',
      kids: 'kids-apparel',
      unisex: 'unisex-apparel',
      catalog: 'women-apparel',
    },
    Обувь: {
      men: 'men-shoes',
      women: 'women-shoes',
      kids: 'kids-shoes',
      unisex: 'unisex-shoes',
      catalog: 'women-shoes',
    },
    Аксессуары: {
      men: 'men-accessories',
      women: 'women-accessories',
      kids: 'kids-accessories',
      unisex: 'women-accessories',
      catalog: 'women-accessories',
    },
    'Головные уборы': {
      men: 'men-headwear',
      women: 'women-headwear',
      kids: 'women-headwear',
      unisex: 'men-headwear',
      catalog: 'women-headwear',
    },
    'Меховые изделия': {
      men: 'men-fur',
      women: 'women-fur',
      kids: 'women-fur',
      unisex: 'men-fur',
      catalog: 'women-fur',
    },
    Сумки: {
      men: 'men-bags',
      women: 'women-bags',
      kids: 'kids-bags',
      unisex: 'women-bags',
      catalog: 'women-bags',
    },
    'Аксессуары для новорождённых': {
      men: 'newborn-accessories',
      women: 'newborn-accessories',
      kids: 'newborn-accessories',
      unisex: 'newborn-accessories',
      catalog: 'newborn-accessories',
    },
    'Игрушки (детские)': {
      men: 'women-accessories',
      women: 'women-accessories',
      kids: 'women-accessories',
      unisex: 'women-accessories',
      catalog: 'women-accessories',
    },
    'Красота и уход': {
      men: 'beauty-care',
      women: 'beauty-care',
      kids: 'beauty-care',
      unisex: 'beauty-care',
      catalog: 'beauty-care',
    },
    'Дом и стиль жизни': {
      men: 'home-lifestyle',
      women: 'home-lifestyle',
      kids: 'home-lifestyle',
      unisex: 'home-lifestyle',
      catalog: 'home-lifestyle',
    },
    'Носочно-чулочные': {
      men: 'men-accessories',
      women: 'women-accessories',
      kids: 'women-accessories',
      unisex: 'women-accessories',
      catalog: 'women-accessories',
    },
  };
  return table[l1]?.[a];
}

export function getCategoryProductionParamsForLeaf(
  leaf: HandbookCategoryLeaf | undefined
): CategoryProductionParams | undefined {
  const id = handbookCatL1FromLeaf(leaf);
  if (!id) return undefined;
  return PRODUCTION_PARAMS_BY_CATEGORY.find((p) => p.catL1Id === id);
}

export type WorkshopSampleSizeScaleOption = {
  key: string;
  label: string;
  rule?: string;
};

function scaleKey(catL1Id: string, scaleId: string): string {
  return `${catL1Id}::${scaleId}`;
}

/** Все шкалы для листа: справочник производства + при одежде — сетка EU/габариты. */
export function getWorkshopSampleSizeScaleOptions(
  leaf: HandbookCategoryLeaf | undefined
): WorkshopSampleSizeScaleOption[] {
  const cat = handbookCatL1FromLeaf(leaf);
  if (!cat) return [];
  const params = PRODUCTION_PARAMS_BY_CATEGORY.find((p) => p.catL1Id === cat);
  const out: WorkshopSampleSizeScaleOption[] = [];

  if (cat === 'women-apparel' || cat === 'men-apparel') {
    out.push({
      key: scaleKey(cat, BODY_GRID_SCALE_ID),
      label:
        cat === 'women-apparel'
          ? 'EU · базовые габариты (женская верхняя одежда: грудь / талия / бёдра)'
          : 'EU · базовые габариты (мужская одежда: грудь / талия / бёдра)',
      rule: 'см, по типовой сетке; значения можно скорректировать ниже',
    });
  }

  if (params) {
    for (const s of params.sizeScales) {
      out.push({
        key: scaleKey(cat, s.id),
        label: `${s.label} — ${s.sizes.join(', ')}`,
        rule: s.rule,
      });
    }
  }
  return out;
}

export function defaultWorkshopSampleSizeScaleKey(leaf: HandbookCategoryLeaf | undefined): string {
  const opts = getWorkshopSampleSizeScaleOptions(leaf);
  return opts[0]?.key ?? 'apparel-alpha';
}

/** Подписи габаритов из справочника категории (редактируемые в досье). */
export function getWorkshopDimensionLabels(leaf: HandbookCategoryLeaf | undefined): string[] {
  const p = getCategoryProductionParamsForLeaf(leaf);
  return p?.dimensions?.length ? [...p.dimensions] : [];
}

function bodyGridRows(catL1Id: string) {
  return catL1Id === 'men-apparel' ? MEN_OUTERWEAR_BODY_GRID_CM : WOMEN_OUTERWEAR_BODY_GRID_CM;
}

function parametersFromBodyGrid(catL1Id: string): AttributeCatalogParameter[] {
  return bodyGridRows(catL1Id).map((row, i) => ({
    parameterId: `w2:${catL1Id}:${BODY_GRID_SCALE_ID}:${i}`,
    label: `${row.eu} / ${row.alpha}`,
    sortOrder: i,
  }));
}

function parametersFromProductionScale(
  catL1Id: string,
  scaleId: string,
  params: CategoryProductionParams
): AttributeCatalogParameter[] {
  const sc = params.sizeScales.find((s) => s.id === scaleId);
  if (!sc) return [];
  return sc.sizes.map((size, i) => ({
    parameterId: `w2:${catL1Id}:${scaleId}:${safeSizeToken(size)}`,
    label: size,
    sortOrder: i,
  }));
}

/** Соответствие строки EU-сетки обхватам; для EU/RU/INT шкал из production-params (одежда). */
function mapBodyRowToDimensionRecord(
  row: { chest: number; waist: number; hips: number },
  dimLabels?: string[]
): Record<string, string> {
  const labels: string[] =
    dimLabels != null && dimLabels.length > 0
      ? dimLabels
      : ['Обхват груди', 'Обхват талии', 'Обхват бёдер'];
  const out: Record<string, string> = {};
  for (const label of labels) {
    const low = label.toLowerCase();
    if (low.includes('груд')) out[label] = String(row.chest);
    else if (low.includes('тал')) out[label] = String(row.waist);
    else if (low.includes('бёдр') || low.includes('бедр')) out[label] = String(row.hips);
  }
  return out;
}

function findApparelBodyGridRowByScaleSize(
  cat: 'women-apparel' | 'men-apparel',
  scaleId: string,
  token: string
):
  | { eu: string; alpha: string; chest: number; waist: number; hips: number }
  | undefined {
  const rows = bodyGridRows(cat);
  const t = token.trim();
  if (scaleId === 'EU') {
    const byAlpha = rows.find((r) => r.alpha.toLowerCase() === t.toLowerCase());
    if (byAlpha) return byAlpha;
    const norm = t.replace(/^eu\s*/i, '').trim();
    const byEu = rows.find((r) => {
      const euNum = r.eu.replace(/^EU\s*/i, '').trim();
      return euNum === norm || r.eu === t || r.eu.replace(/\s+/g, ' ') === t;
    });
    if (byEu) return byEu;
    return undefined;
  }
  if (scaleId === 'RU') {
    const idx =
      cat === 'women-apparel'
        ? (
            {
              '42': 1,
              '44': 2,
              '46': 3,
              '48': 4,
              '50': 5,
              '52': 5,
            } as Record<string, number>
          )[t]
        : (
            {
              '44': 0,
              '46': 1,
              '48': 2,
              '50': 3,
              '52': 4,
              '54': 5,
            } as Record<string, number>
          )[t];
    if (idx === undefined) return undefined;
    return rows[idx];
  }
  if (scaleId === 'INT') {
    const n = parseInt(t, 10);
    if (Number.isNaN(n)) return undefined;
    if (cat === 'women-apparel') {
      const mapW: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 };
      const i = mapW[n];
      return i !== undefined ? rows[i] : undefined;
    }
    const mapM: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 };
    const j = mapM[n];
    return j !== undefined ? rows[j] : undefined;
  }
  return undefined;
}

/**
 * Параметры выпадающего списка «базовый размер» для выбранной шкалы.
 */
export function getWorkshopParametersForSampleScale(
  leaf: HandbookCategoryLeaf | undefined,
  scaleKeyVal: string | undefined
): AttributeCatalogParameter[] {
  if (!leaf || !scaleKeyVal) return [];
  const cat = handbookCatL1FromLeaf(leaf);
  if (!cat) return [];
  const parts = scaleKeyVal.split('::');
  if (parts.length < 2) return [];
  const catL1Id = parts[0]!;
  const scaleId = parts.slice(1).join('::');
  if (catL1Id !== cat) return [];

  if (scaleId === BODY_GRID_SCALE_ID) {
    if (cat === 'women-apparel' || cat === 'men-apparel') {
      return parametersFromBodyGrid(cat);
    }
    return [];
  }

  const p = PRODUCTION_PARAMS_BY_CATEGORY.find((x) => x.catL1Id === catL1Id);
  if (!p) return [];
  return parametersFromProductionScale(catL1Id, scaleId, p);
}

/**
 * Подсказки см для габаритов: EU-сетка по индексу; для шкал EU/RU/INT (одежда) — та же сетка по размеру.
 * `dimLabels` — подписи из справочника категории (ключи полей в досье).
 */
export function getSuggestedDimensionCmForParameterId(
  parameterId: string | undefined,
  dimLabels?: string[]
): Record<string, string> | undefined {
  if (!parameterId) return undefined;
  const gridIdx = parameterId.match(/^w2:(women-apparel|men-apparel):__BODY_GRID:(\d+)$/);
  if (gridIdx) {
    const cat = gridIdx[1] as 'women-apparel' | 'men-apparel';
    const idx = parseInt(gridIdx[2]!, 10);
    const row = bodyGridRows(cat)[idx];
    if (!row) return undefined;
    return mapBodyRowToDimensionRecord(row, dimLabels);
  }
  const m = parameterId.match(/^w2:(women-apparel|men-apparel):([^:]+):(.+)$/);
  if (!m) return undefined;
  const cat = m[1] as 'women-apparel' | 'men-apparel';
  const scaleId = m[2]!;
  let token = m[3]!;
  try {
    token = decodeURIComponent(token);
  } catch {
    /* keep raw */
  }
  if (scaleId === BODY_GRID_SCALE_ID) return undefined;
  const row = findApparelBodyGridRowByScaleSize(cat, scaleId, token);
  if (!row) return undefined;
  return mapBodyRowToDimensionRecord(row, dimLabels);
}
