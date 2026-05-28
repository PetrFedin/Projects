import type { Workshop2CompositionLabelPhysicalKind } from '@/lib/production/workshop2-dossier-phase1.types';

export type {
  W2CompositionLabelCareSymbolGroup,
  Workshop2CompositionLabelCareSymbolCatalogEntry,
} from '@/lib/production/workshop2-composition-label-care-symbols-catalog';
export {
  W2_COMPOSITION_LABEL_CARE_GROUP_LABELS,
  W2_COMPOSITION_LABEL_CARE_GROUP_ORDER,
  W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG,
  W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR,
} from '@/lib/production/workshop2-composition-label-care-symbols-catalog';

export const W2_COMPOSITION_LABEL_PHYSICAL_OPTIONS: {
  id: Workshop2CompositionLabelPhysicalKind | 'unset';
  label: string;
  hint: string;
}[] = [
  { id: 'unset', label: 'Не задано', hint: '' },
  {
    id: 'satin',
    label: 'Сатин',
    hint: '',
  },
  {
    id: 'nylon',
    label: 'Нейлон',
    hint: '',
  },
  {
    id: 'jacquard',
    label: 'Жаккард',
    hint: '',
  },
  {
    id: 'polyester',
    label: 'Полиэстер',
    hint: 'Часто для печатных и термотрансферных бирок.',
  },
  {
    id: 'cotton',
    label: 'Хлопок',
    hint: 'Натуральное полотно, хорошо переносит контакт с кожей.',
  },
  {
    id: 'other',
    label: 'Другое',
    hint: 'Уточните справа в поле своего текста.',
  },
];

/** Типовые габариты бирки (мм) — подстановка в ширину/высоту и превью. */
export const W2_COMPOSITION_LABEL_SIZE_PRESETS: {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  hint: string;
}[] = [
  {
    id: 'swing_15x50',
    label: 'Вшивная 15×50',
    widthMm: 15,
    heightMm: 50,
    hint: 'Узкая, швы/воротник',
  },
  { id: 'swing_20x60', label: 'Вшивная 20×60', widthMm: 20, heightMm: 60, hint: 'Частый стандарт' },
  { id: 'swing_25x80', label: 'Вшивная 25×80', widthMm: 25, heightMm: 80, hint: 'Верхняя одежда' },
  { id: 'care_40x90', label: 'Care 40×90', widthMm: 40, heightMm: 90, hint: 'Состав + уход' },
  { id: 'care_50x110', label: 'Care 50×110', widthMm: 50, heightMm: 110, hint: 'Расширенный блок' },
  {
    id: 'hang_30x120',
    label: 'Подвесная 30×120',
    widthMm: 30,
    heightMm: 120,
    hint: 'Длинная бирка',
  },
];

/** Справочник волокон для конструктора (RU/EN для мультиязычного макета). */
export const W2_COMPOSITION_LABEL_FIBER_CATALOG: {
  id: string;
  labelRu: string;
  labelEn: string;
}[] = [
  { id: 'cotton', labelRu: 'хлопок', labelEn: 'cotton' },
  { id: 'polyester', labelRu: 'полиэстер', labelEn: 'polyester' },
  { id: 'elastane', labelRu: 'эластан', labelEn: 'elastane' },
  { id: 'polyamide', labelRu: 'полиамид', labelEn: 'polyamide' },
  { id: 'viscose', labelRu: 'вискоза', labelEn: 'viscose' },
  { id: 'wool', labelRu: 'шерсть', labelEn: 'wool' },
  { id: 'linen', labelRu: 'лён', labelEn: 'linen' },
  { id: 'acrylic', labelRu: 'акрил', labelEn: 'acrylic' },
  { id: 'polyurethane', labelRu: 'полиуретан', labelEn: 'polyurethane' },
  { id: 'silk', labelRu: 'шёлк', labelEn: 'silk' },
  { id: 'cashmere', labelRu: 'кашемир', labelEn: 'cashmere' },
  { id: 'metal_fiber', labelRu: 'металлизированное волокно', labelEn: 'metal fibre' },
  { id: 'modal', labelRu: 'модал', labelEn: 'modal' },
  { id: 'bamboo', labelRu: 'бамбук', labelEn: 'bamboo' },
  { id: 'other', labelRu: 'иное', labelEn: 'other' },
];

/** Страна / формулировка «сделано в…» для блока метаданных. */
export const W2_COMPOSITION_LABEL_ORIGIN_PRESETS: {
  id: string;
  label: string;
  lineRu: string;
  lineEn: string;
}[] = [
  { id: 'unset', label: 'Не задано', lineRu: '', lineEn: '' },
  {
    id: 'made_ru',
    label: 'Сделано в России',
    lineRu: 'Сделано в России',
    lineEn: 'Made in Russia',
  },
  {
    id: 'made_ru_bilingual',
    label: 'RU + EN (одна строка)',
    lineRu: 'Сделано в России / Made in Russia',
    lineEn: 'Made in Russia / Сделано в России',
  },
  {
    id: 'imported',
    label: 'Импорт',
    lineRu: 'Импорт',
    lineEn: 'Imported',
  },
];

export const W2_COMPOSITION_LABEL_FONT_PRESETS: {
  id: '' | 'system_sans' | 'system_serif' | 'condensed' | 'custom';
  label: string;
  cssStack: string;
}[] = [
  { id: '', label: 'По умолчанию UI', cssStack: 'system-ui, sans-serif' },
  {
    id: 'system_sans',
    label: 'Sans (system)',
    cssStack: 'system-ui, Segoe UI, Roboto, sans-serif',
  },
  { id: 'system_serif', label: 'Serif', cssStack: 'Georgia, Times New Roman, serif' },
  {
    id: 'condensed',
    label: 'Condensed',
    cssStack: 'Arial Narrow, Helvetica Neue Condensed, sans-serif',
  },
  { id: 'custom', label: 'Своя гарнитура', cssStack: 'system-ui, sans-serif' },
];

export const W2_COMPOSITION_LABEL_SHEET_LAYOUT_OPTIONS: {
  id: '' | 'single' | 'two_sheets' | 'three_sheets';
  label: string;
}[] = [
  { id: '', label: 'Не задано' },
  { id: 'single', label: 'Один сегмент / одна сторона' },
  { id: 'two_sheets', label: 'Два листа / две панели' },
  { id: 'three_sheets', label: 'Три листа / три панели' },
];
