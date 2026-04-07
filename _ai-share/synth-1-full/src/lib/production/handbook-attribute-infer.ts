/**
 * Доп. атрибуты канонического каталога по пути справочника категорий (L1→L2),
 * когда в `attribute-catalog.instance.json` нет `leafBindings` для `catalog-*` листьев.
 * Соответствует смыслу групп: outerwear/dress/footwear в JSON.
 */

const APPAREL_LEN_MAT_L2 = new Set([
  'Верхняя одежда',
  'Костюмы и жакеты',
  'Юбки',
  'Рубашки и блузы',
  'Топы и футболки',
  'Джинсы',
  'Брюки',
  'Трикотаж',
  'Нижнее бельё',
  'Спортивная одежда',
  'Пляжная мода',
  'Пижамы и домашняя одежда',
]);

/** Порядок атрибутов фазы 1 для обуви (ТЗ): материал верха, подошва, конструкция, стелька, подкладка и т.д. */
/** Порядок атрибутов фазы 1 для сумок: тип → материал и далее по каталогу. */
export const BAGS_PHASE1_ATTRIBUTE_IDS: string[] = ['bag-type', 'mat'];

export const APPAREL_CONSTRUCTION_ATTRS: string[] = [
  'clothingFitOptions',
  'garmentLengthApparelOptions',
  'sleeveOptionsByCategory',
  'collarOptionsByCategory',
  'cuffOptionsByCategory',
  'waistbandOptionsByCategory',
  'fabricWeightGsmPresetOptions',
  'pocketOptions',
  'fasteningOptionsByCategory',
  'liningOptionsByCategory',
  'stitchingOptionsByCategory',
  'decorOptionsByCategory',
  'patternOptionsByCategory',
  'processingTechOptionsByCategory',
  'backDetailOptionsByCategory',
  'combinationOptionsByCategory',
  'draperyOptionsByCategory',
  'hemFinishOptionsByCategory',
  'hemTypeOptionsByCategory',
  'reinforcementOptionsByCategory',
  'seamOptionsByCategory',
  'shoulderOptionsByCategory',
  'transformationOptionsByCategory',
  'waistOptionsByCategory',
  'specialNeedsOptions',
  'temperatureOptions',
  'insulationMaterialOptions',
  'insulationLevelOptions',
  'thermoTechOptions',
];

export const FOOTWEAR_PHASE1_ATTRIBUTE_IDS: string[] = [
  'mat',
  'sole',
  'shoe-toe-opening',
  'shoe-heel-counter',
  'shoe-toe-shape',
  'shoe-heel-shape',
  'shoe-closure',
  'shoe-decoration',
  'shoe-insole-material',
  'shoe-insole-type',
  'shoe-lining',
  'shoe-fill',
  'shoe-shaft-height',
  'shoe-outsole-tread',
  'shoe-purpose',
];

const COMMON_APPAREL_ATTRS: string[] = [
  'clothingFitOptions',
  'garmentLengthApparelOptions',
  'fabricWeightGsmPresetOptions',
  'stitchingOptionsByCategory',
  'seamOptionsByCategory',
  'patternOptionsByCategory',
  'processingTechOptionsByCategory',
];

const TOP_HALF_ATTRS: string[] = [
  'collarOptionsByCategory',
  'sleeveOptionsByCategory',
  'cuffOptionsByCategory',
  'shoulderOptionsByCategory',
  'backDetailOptionsByCategory',
];

const BOTTOM_HALF_ATTRS: string[] = [
  'waistOptionsByCategory',
  'waistbandOptionsByCategory',
  'hemTypeOptionsByCategory',
  'hemFinishOptionsByCategory',
];

const OUTERWEAR_SPECIFIC_ATTRS: string[] = [
  'temperatureOptions',
  'insulationMaterialOptions',
  'insulationLevelOptions',
  'thermoTechOptions',
  'liningOptionsByCategory',
];

const DETAIL_ATTRS: string[] = [
  'pocketOptions',
  'fasteningOptionsByCategory',
  'decorOptionsByCategory',
  'hardwareOptionsByCategory',
  'draperyOptionsByCategory',
  'reinforcementOptionsByCategory',
  'transformationOptionsByCategory',
  'combinationOptionsByCategory',
  'specialNeedsOptions',
];

/**
 * Идентификаторы атрибутов из инстанса (не глобальные — их добавляет `resolveAttributeIdsForLeaf`).
 */
export function inferExtraAttributeIdsForHandbookPath(
  l1Name: string,
  l2Name: string,
  _l3Name: string
): string[] {
  const l1 = l1Name.trim();
  const l2 = l2Name.trim();

  if (l1 === 'Обувь') {
    return [...FOOTWEAR_PHASE1_ATTRIBUTE_IDS];
  }

  if (l1 === 'Одежда') {
    const isOuter = l2 === 'Верхняя одежда';
    const isDress = l2 === 'Платья и сарафаны';
    const isBottom = l2 === 'Брюки' || l2 === 'Джинсы' || l2 === 'Юбки';
    const isTop =
      l2 === 'Рубашки и блузы' ||
      l2 === 'Топы и футболки' ||
      l2 === 'Трикотаж' ||
      l2 === 'Костюмы и жакеты';

    const attrs = [...COMMON_APPAREL_ATTRS, ...DETAIL_ATTRS];

    if (isOuter) {
      attrs.push(...TOP_HALF_ATTRS, ...OUTERWEAR_SPECIFIC_ATTRS);
    } else if (isDress) {
      attrs.push(...TOP_HALF_ATTRS, 'sil');
    } else if (isTop) {
      attrs.push(...TOP_HALF_ATTRS);
    } else if (isBottom) {
      attrs.push(...BOTTOM_HALF_ATTRS);
    }

    // Always include material and length brief
    if (APPAREL_LEN_MAT_L2.has(l2)) {
      if (!attrs.includes('len')) attrs.unshift('len');
      if (!attrs.includes('mat')) attrs.unshift('mat');
    }

    return Array.from(new Set(attrs));
  }

  if (l1 === 'Сумки') {
    return [...BAGS_PHASE1_ATTRIBUTE_IDS];
  }

  if (
    l1 === 'Аксессуары' ||
    l1 === 'Головные уборы' ||
    l1 === 'Носочно-чулочные' ||
    l1 === 'Аксессуары для новорождённых'
  ) {
    return ['mat'];
  }

  return [];
}
