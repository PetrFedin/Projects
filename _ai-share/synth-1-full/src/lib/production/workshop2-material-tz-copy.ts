/**
 * Единый копирайт подсказок ТЗ для вкладки «Материалы» (утепление, плотность, уход).
 * Разметку и условный блок «верхняя одежда» ренерит `Workshop2MaterialTzHintsPanel`.
 */

export type Workshop2MaterialTzHintsLayout = 'embedded' | 'standalone';

export const W2_MATERIAL_TZ_REGION_KICKER: Record<Workshop2MaterialTzHintsLayout, string> = {
  embedded: 'Подсказки к полям ниже',
  standalone: 'Подсказки к полям',
};

export const W2_MATERIAL_TZ_CARE_TITLE: Record<Workshop2MaterialTzHintsLayout, string> = {
  embedded: 'Уход: стирка и обработка (ТЗ)',
  standalone: 'Уход',
};

export const W2_MATERIAL_TZ_FABRIC_WEIGHT_TITLE = 'Плотность полотна (г/м²)';

/** Куски абзаца про г/м² — жирные вставки задаются в UI. */
export const W2_MATERIAL_TZ_FABRIC_WEIGHT_PARTS = {
  beforePrimary: 'Несколько тканей: укажите г/м² ',
  primaryBold: 'основного',
  betweenPrimaryAndFace: ' полотна (наибольшая доля в составе) или ',
  faceBold: 'лицевой',
  afterFace:
    ' ткани корпуса. Подклад и утеплитель — отдельные строки в BOM; при необходимости добавьте плотность второго слоя в комментарии к строке материала.',
  outerwearNoteLead: 'Для пуховиков и парок: здесь — плотность ',
  outerwearShellBold: 'оболочки',
  outerwearNoteTail:
    '; граммы наполнителя и FP/down — в полях утеплителя и в строках BOM, согласованных со скетчем.',
} as const;

export const W2_MATERIAL_TZ_TEMPERATURE_TITLE = 'Температурный режим';
export const W2_MATERIAL_TZ_TEMPERATURE_BODY =
  'Укажите целевой диапазон носки или класс по гайду бренда; согласуйте с утеплителем и сценарием использования изделия.';

export const W2_MATERIAL_TZ_INSULATION_MATERIAL_TITLE = 'Материал утеплителя';
export const W2_MATERIAL_TZ_INSULATION_MATERIAL_BODY_PARTS = {
  beforeBold:
    'Совместите с отдельной строкой «утеплитель» в справочнике материалов и при необходимости с меткой ',
  tagBold: 'material',
  afterBold: ' на скетче — чтобы закупка и конструкция ссылались на одно наименование.',
} as const;

export const W2_MATERIAL_TZ_INSULATION_LEVEL_TITLE = 'Уровень утепления';
export const W2_MATERIAL_TZ_INSULATION_LEVEL_BODY =
  'Уровень утепления согласуйте с сценарием носки (город / активный отдых) и с плотностью shell; при спорных значениях зафиксируйте решение в комментарии к материалу или в техпаке.';

export const W2_MATERIAL_TZ_THERMO_TECH_TITLE = 'Термо-технологии';
export const W2_MATERIAL_TZ_THERMO_TECH_BODY =
  'Мембраны, отражающие слои и маркетинговые названия — продублируйте исполнимые параметры (уход, паропроницаемость, стирка) в BOM или вложении техпака, чтобы фабрика не гадала по бренду на вешалке.';

export const W2_MATERIAL_TZ_CARE_BODY =
  'Зафиксируйте класс ухода и ограничения, совместимые с подобранными материалами; критичное продублируйте в BOM или вложении техпака.';
