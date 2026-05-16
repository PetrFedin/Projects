import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';

export const W2_TZ_ATTR_NAME_OVERRIDE: Record<string, string> = {
  garmentLengthApparelOptions: 'Длина изделия',
  draperyOptionsByCategory: 'Драпировка и складки',
  decorOptionsByCategory: 'Декор',
  patternOptionsByCategory: 'Узор',
  primaryColorFamilyOptions: 'Цвет основной',
  colorReferenceSystemOptions: 'Референс цвета',
  'w2-brief-planned-launch-custom': 'Планируемый тип запуска',
  'w2-construction-cad': 'Лекала и фабричный CAD',
  'w2-construction-sketches': 'Скетчи',
  'w2-gate-critical-comments': 'Критичные комментарии',
  'w2-block-assignment': 'Отправка',
  'w2-block-construction-sample': 'Базовые параметры сэмпла / лекало',
  'w2-block-material': 'Материал и состав',
  'w2-block-visual-refs': 'Референсы',
  'w2-block-brand-notes': 'Дизайнерский замысел',
  'w2-block-visuals': 'Визуал',
  'w2-block-passport': 'Паспорт артикула',
};

/** Декор, драпировка, длина, узор — сетка 2×2 в «Конструкция» → базовые параметры сэмпла / лекало. */
export const W2_VISUAL_QUAD_ATTR_ORDER = [
  'decorOptionsByCategory',
  'draperyOptionsByCategory',
  'garmentLengthApparelOptions',
  'patternOptionsByCategory',
] as const;

export const W2_VISUAL_QUAD_ATTR_IDS = new Set<string>(W2_VISUAL_QUAD_ATTR_ORDER);

export function w2TzAttributeDisplayName(attr: AttributeCatalogAttribute): string {
  if (W2_TZ_ATTR_NAME_OVERRIDE[attr.attributeId]) return W2_TZ_ATTR_NAME_OVERRIDE[attr.attributeId]!;
  const n = attr.name
    .replace(/^\s*Конструкция\s*[·:]\s*/i, '')
    .replace(/^\s*Конструкция\s+/i, '')
    .replace(/\s*Конструкция\s*[·:]\s*/gi, ' ')
    .replace(/\s*Конструкция\s+/gi, ' ');
  return n.trim().replace(/\s+/g, ' ') || attr.name;
}
