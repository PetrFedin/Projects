import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

/**
 * Выключает UI библиотеки подложек: `NEXT_PUBLIC_WORKSHOP2_SKETCH_UNDERLAY_LIBRARY=0`.
 * По умолчанию включено, чтобы блок «Подложка из справочника» был доступен в dev.
 */
export const WORKSHOP2_SKETCH_UNDERLAY_LIBRARY_UI_ENABLED = false;

export type Workshop2SketchUnderlayPreset = {
  id: string;
  labelRu: string;
  /** Путь под `public/`, например `/w2-sketch-underlays/generic.svg`. */
  href: string;
};

const PRESETS: Workshop2SketchUnderlayPreset[] = [
  { id: 'generic', labelRu: 'Силуэт — универсально', href: '/w2-sketch-underlays/generic.svg' },
  { id: 'outerwear', labelRu: 'Верхняя одежда', href: '/w2-sketch-underlays/outerwear.svg' },
  { id: 'shirt-top', labelRu: 'Рубашка / верх', href: '/w2-sketch-underlays/shirt-top.svg' },
  { id: 'pants', labelRu: 'Брюки', href: '/w2-sketch-underlays/pants.svg' },
  { id: 'dress-skirt', labelRu: 'Платье / юбка', href: '/w2-sketch-underlays/dress-skirt.svg' },
  { id: 'shoes', labelRu: 'Обувь', href: '/w2-sketch-underlays/shoes.svg' },
  { id: 'bags', labelRu: 'Сумки', href: '/w2-sketch-underlays/bags.svg' },
  { id: 'headwear', labelRu: 'Головной убор', href: '/w2-sketch-underlays/headwear.svg' },
];

/** Список пресетов для текущего листа каталога (пока без жёсткой фильтрации по ветке). */
export function listWorkshop2SketchUnderlayPresets(
  _leaf: HandbookCategoryLeaf
): Workshop2SketchUnderlayPreset[] {
  return PRESETS;
}
