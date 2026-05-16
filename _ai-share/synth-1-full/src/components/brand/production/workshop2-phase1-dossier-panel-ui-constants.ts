/** Tailwind / UI string tokens for {@link Workshop2Phase1DossierPanel} (pure data, no React). */

export const WORKSHOP_FIELD_LABEL_CLASS = 'text-sm font-semibold text-text-primary';

export const WORKSHOP_HINT_TOOLTIP_CLASS =
  'max-w-[min(22rem,calc(100vw-2rem))] space-y-1.5 border border-border-default bg-white px-3 py-2 text-left text-[11px] leading-snug text-text-primary shadow-md';

export const WORKSHOP_REQUIRED_BADGE_TODO_CLASS =
  'text-[9px] font-semibold text-red-950 bg-red-50/90 border border-red-500/85 rounded px-1.5 py-0.5';

export const WORKSHOP_REQUIRED_BADGE_DONE_CLASS =
  'text-[9px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5';

/** Подписи групп каталога, которые в UI совпадают с бейджем «Обязательный» (как на шаге 1). */
export const WORKSHOP_GROUP_LABEL_AMBER = new Set(['Обязательно', 'Фаза 3 (не в форме фазы 1)']);

/** Секция «Материалы»: состав + атрибуты каталога без второй полосы «МАТЕРИАЛЫ». */
export const WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL = 'Верхняя одежда · материалы';

/** Подсказки к полям вынесены в единый блок у состава — не дублируем под каждым атрибутом. */
export const MATERIAL_GUIDE_ATTR_IDS = new Set([
  'fabricWeightGsmPresetOptions',
  'temperatureOptions',
  'insulationMaterialOptions',
  'insulationLevelOptions',
  'thermoTechOptions',
  'careWashingClassOptions',
]);

export const WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_GROUP_IDS = new Set(['outerwear', 'material']);

export const WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_LABELS = new Set(['Верхняя одежда', 'Материалы']);

/** Служебный ключ одной колонки без подзаголовков групп каталога (блок «Визуальные оси»). */
export const WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY = '__w2_flat_catalog__';

/** Если есть связка mat + composition в BOM, пресеты/формат состава из каталога только дублируют таблицу. */
export const REDUNDANT_WHEN_MAT_COMPOSITION_LINKED = new Set([
  'fabricCompositionPresetOptions',
  'fabricCompositionDetailClassOptions',
]);
