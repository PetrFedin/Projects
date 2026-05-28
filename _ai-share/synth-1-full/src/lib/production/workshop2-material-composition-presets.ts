/**
 * Типовые составы mat/composition: данные в JSON (как контракт будущего API),
 * резолв по L2 / L3 / leafId без сетевых вызовов.
 */

import rawCatalog from '@/lib/production/workshop2-material-composition-presets.json';

export type Workshop2MaterialCompositionPresetRow = {
  parameterId: string;
  label: string;
  pct: number;
};

export type Workshop2MaterialCompositionPreset = {
  id: string;
  label: string;
  l2Match: string[];
  /** Узкий таргет по L3 (название листа справочника). */
  l3Match?: string[];
  /** Точные leafId — когда API отдаёт пресеты по артикулу / листу. */
  leafIdMatch?: string[];
  /** Сортировка в ленте (меньше — выше). */
  sortOrder?: number;
  rows: Workshop2MaterialCompositionPresetRow[];
};

export type Workshop2MaterialCompositionPresetContext = {
  leafId: string;
  l2Name: string;
  /** Как в `HandbookCategoryLeaf.l3Name` (может быть «—»). */
  l3Name?: string;
};

type JsonCatalog = {
  contractVersion: number;
  presets: Workshop2MaterialCompositionPreset[];
};

function asCatalog(data: unknown): Workshop2MaterialCompositionPreset[] {
  if (!data || typeof data !== 'object') return [];
  const v = data as JsonCatalog;
  if (v.contractVersion !== 1 || !Array.isArray(v.presets)) return [];
  return v.presets;
}

/** Статический каталог (импорт JSON). Замените на ответ API, когда появится бэкенд. */
export const WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG: Workshop2MaterialCompositionPreset[] =
  asCatalog(rawCatalog);

/**
 * Заглушка под `GET …/material-composition-presets?leafId=…`.
 * Сейчас возвращает тот же JSON; позже — `fetch` + merge с дефолтами.
 */
export async function fetchMaterialCompositionPresetsCatalog(
  _leafId?: string
): Promise<Workshop2MaterialCompositionPreset[]> {
  return Promise.resolve(WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG);
}

export function presetMatchesMaterialCompositionContext(
  preset: Workshop2MaterialCompositionPreset,
  ctx: Workshop2MaterialCompositionPresetContext
): boolean {
  if (!ctx.l2Name || !preset.l2Match.includes(ctx.l2Name)) return false;
  if (preset.leafIdMatch && preset.leafIdMatch.length > 0) {
    return preset.leafIdMatch.includes(ctx.leafId);
  }
  if (preset.l3Match && preset.l3Match.length > 0) {
    const l3 = ctx.l3Name?.trim();
    if (!l3 || l3 === '—') return false;
    return preset.l3Match.includes(l3);
  }
  return true;
}

/** Пресеты для текущего листа: сначала leafId, иначе L3, иначе общие по L2. */
export function resolveMaterialCompositionPresets(
  ctx: Workshop2MaterialCompositionPresetContext,
  catalog: Workshop2MaterialCompositionPreset[] = WORKSHOP2_MATERIAL_COMPOSITION_PRESETS_CATALOG
): Workshop2MaterialCompositionPreset[] {
  const matched = catalog.filter((p) => presetMatchesMaterialCompositionContext(p, ctx));
  return [...matched].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
}
