import * as LucideIcons from 'lucide-react';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

/** Вкладки навигации ТЗ (без отдельной «Визуал» — замысел/рефы/цвет в паспорте, скетиз и подпись визуала в конструкции). */
/** Вкладки навигации ТЗ: только контур спецификации образца (календарь T&A, эко, B2B — в других шагах «Разработка»). */
export const TZ_TAB_SECTIONS: {
  id: Workshop2TzSignoffSectionKey;
  label: string;
  icon: keyof typeof LucideIcons;
}[] = [
  { id: 'general', label: 'Паспорт', icon: 'Info' },
  { id: 'material', label: 'Материалы', icon: 'Layers' },
  { id: 'construction', label: 'Конструкция', icon: 'Scissors' },
  { id: 'assignment', label: 'Задание', icon: 'ClipboardList' },
];

/** Секции с расчётом % и подписью по ТЗ. */
export const TZ_READINESS_SECTION_KEYS: readonly Workshop2TzSignoffSectionKey[] = [
  'general',
  'material',
  'construction',
  'assignment',
];

export const SECTION_LABEL_BY_ID: Record<DossierSection, string> = {
  ...(Object.fromEntries(TZ_TAB_SECTIONS.map((s) => [s.id, s.label])) as Record<
    (typeof TZ_TAB_SECTIONS)[number]['id'],
    string
  >),
  visuals: 'Визуал',
  measurements: 'Табель мер',
  packaging: 'Упаковка',
  sample_intake: 'Приёмка сэмпла',
  b2b_sales: 'B2B и продажи',
};

/** Короткие шаги до зелёной цепочки «Отправка» — подсказка на вкладке ТЗ (без новой логики). */
export const SECTION_TAB_ROLE_HINT: Record<string, string> = {
  general:
    'До зелёной цепочки: карточка артикула и предстартовая проверка; секция «Паспорт» — бренд и технолог (по правилам ролей).',
  visuals:
    'Подпись визуального контура и остаточные поля каталога — на вкладке «Конструкция»; замысел и цвет — в паспорте.',
  material: 'Состав, BOM, маркировка; подписи бренда и технолога (по правилам секции).',
  construction: 'CAD/ZIP, мерки; подписывает технолог (роль в правилах секции).',
  assignment:
    'Все роли: чеклист «Задание», итоговое ТЗ, передача пакета в цех; расширенная таможня каталога — вверху блока; ворота совпадают с таблицей в экспортируемом HTML.',
  time_and_action:
    'Сроки и этапы после утверждения подрядчика — в шаге «План заказа» разработки артикула.',
  sustainability: 'Эко-показатели и цифровой паспорт изделия (DPP) — в шаге «Снабжение и закупка».',
  b2b_sales: 'Оптовые предзаказы и витрина B2B — в шаге «План заказа» разработки артикула.',
};

/** Паспорт: основной цвет + референс + палитра/оттенок — один блок «Цвет». */
export const PASSPORT_COLOR_BUNDLE_IDS = new Set<string>([
  'primaryColorFamilyOptions',
  'colorReferenceSystemOptions',
  'color',
]);

export const PASSPORT_COLOR_BUNDLE_ORDER: readonly string[] = [
  'primaryColorFamilyOptions',
  'colorReferenceSystemOptions',
  'color',
];

/** Не id каталога: отложенное поле `passportProductionBrief.plannedLaunchCustomNote` (localStorage w2). */
export const W2_BRIEF_DEFER_ID_PLANNED_LAUNCH_CUSTOM = 'w2-brief-planned-launch-custom' as const;

/** Не id каталога: блок «Скетчи» на конструкции — «Позже» в localStorage w2. */
export const W2_CONSTRUCTION_SKETCHES_DEFER_ID = 'w2-construction-sketches' as const;

/** Не id каталога: блок «Лекала и фабричный CAD» — «Позже» в localStorage w2. */
export const W2_CONSTRUCTION_CAD_DEFER_ID = 'w2-construction-cad' as const;

/** Синтетические ключи «Позже» для полей паспорта / brief (не id каталога). */
export const W2_BRIEF_DEFER_BRAND_NOTES = 'w2-brief-brand-notes' as const;
export const W2_BRIEF_DEFER_TARGET_RETAIL_PRICE = 'w2-brief-target-retail-price' as const;
export const W2_BRIEF_DEFER_TARGET_MARGIN_PCT = 'w2-brief-target-margin-pct' as const;
export const W2_BRIEF_DEFER_TARGET_FOB = 'w2-brief-target-fob' as const;
export const W2_BRIEF_DEFER_PACKAGING_NOTE = 'w2-brief-packaging-note' as const;
export const W2_BRIEF_DEFER_WEIGHT_DIMS = 'w2-brief-weight-dims' as const;
export const W2_BRIEF_DEFER_LIFECYCLE_TA = 'w2-brief-lifecycle-ta' as const;
export const W2_BRIEF_DEFER_PRODUCTION_STRATEGY = 'w2-brief-production-strategy' as const;
