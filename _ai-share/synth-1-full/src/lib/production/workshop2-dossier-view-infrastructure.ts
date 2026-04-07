/**
 * Инфраструктура режимов ТЗ без новых API: URL `w2view`, типы для будущих полей досье,
 * константы handoff / печати / экспорта. UI читает профиль из контекста и query.
 * Сводка «до 9 баллов» (бэклог P0/P1, аудит, handoff, метки, BOM): `workshop2-dossier-nine-gap-infrastructure.ts`.
 *
 * Разрешение профиля: явный `?w2view=` в URL → иначе localStorage (последний выбор) → иначе дефолт по `PlatformRole`.
 *
 * Закрыто ранее: профиль `qc` — вкладка паспорта (`general`) первая в `WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS`.
 * Production handoff из визуала — две цели: посадка (`fit`) и ОТК (`qc`); см. `getVisualHandoffTargetsForProfile('production')`
 * в `workshop2-dossier-nine-gap-infrastructure.ts`.
 *
 * Остаётся на потом (осознанно не трогали в этом слое):
 * — Построчный deep-link в BOM по каждому `lineRef` / `linkedBomLineRef` (нужны стабильные id строк mat/BOM или поиск по ref).
 * — Метрики next-step и подстройка `WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS` по данным досье — отдельная аналитическая задача.
 *
 * Продуктовый UI по местам гейтов (без новых полей матрицы здесь): компактная шапка паспорта в «Визуале» без вкладки
 * «Паспорт»; явные CTA «к строке BOM / узлу / зоне ОТК» по предупреждениям о разрывах — делать в компонентах предупреждений.
 *
 * Матрица `Workshop2DossierViewUiCaps`: новые флаги — поле в типе + строка на профиль в `WORKSHOP2_DOSSIER_VIEW_UI_CAPS`;
 * в панелях только `workshop2DossierViewUiCaps(profile)`, без дублирующих `useMemo` по профилю.
 */

import { W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { PlatformRole } from '@/lib/rbac';

/** Вкладки воркспейса артикула, куда тянем handoff из визуала (совместимо с MainTab в UI). */
export type W2HandoffArticleTab = 'fit' | 'qc';

/** Профиль сжатого/ролевого просмотра досье (значение query `w2view`). */
export type Workshop2DossierViewProfile =
  | 'full'
  | 'manager'
  | 'designer'
  | 'technologist'
  | 'supply'
  | 'production'
  | 'qc'
  | 'merch'
  | 'compliance'
  | 'factory'
  | 'finance';

const VALID_PROFILES = new Set<string>([
  'full',
  'manager',
  'designer',
  'technologist',
  'supply',
  'production',
  'qc',
  'merch',
  'compliance',
  'factory',
  'finance',
]);

export function parseWorkshop2DossierViewParam(raw: string | null | undefined): Workshop2DossierViewProfile {
  const s = (raw ?? '').trim().toLowerCase();
  if (!s || s === 'full') return 'full';
  return VALID_PROFILES.has(s) ? (s as Workshop2DossierViewProfile) : 'full';
}

export const WORKSHOP2_DOSSIER_VIEW_OPTIONS: { value: Workshop2DossierViewProfile; label: string }[] = [
  { value: 'full', label: 'Полный (все роли)' },
  { value: 'manager', label: 'Менеджер / продакт' },
  { value: 'designer', label: 'Бренд-дизайнер' },
  { value: 'technologist', label: 'Технолог' },
  { value: 'supply', label: 'Снабжение / PD' },
  { value: 'production', label: 'Производство / цех' },
  { value: 'qc', label: 'ОТК' },
  { value: 'merch', label: 'Мерч / e-com' },
  { value: 'compliance', label: 'Комплаенс / таможня' },
  { value: 'factory', label: 'Фабрика (минимум шума)' },
  { value: 'finance', label: 'Финансы / costing' },
];

/** Короткая подсказка под режим (баннер в досье). */
export const WORKSHOP2_DOSSIER_VIEW_HINTS: Record<Exclude<Workshop2DossierViewProfile, 'full'>, string> = {
  manager:
    'Акцент на статусы, готовность шагов и блокеры; детали каталога по запросу.',
  designer:
    'Визуал, эскиз, референсы и замысел; конструкция и материалы в той же полосе вкладок (мерки и узлы для передачи в образец).',
  technologist:
    'Мерки, конструкция, привязки меток к BOM; паспорт и визуал доступны для согласования контура.',
  supply:
    'Материалы, BOM, ограничения по сырью; визуал — только канон и метки, влияющие на закупку.',
  production:
    'Эскиз, задачи цеха, BOM-карта; урезанный паспорт для швейного контура.',
  qc:
    'Паспорт (SKU, коды, ТН ВЭД) в первичных секциях; метки qc/construction, канон и handoff в маршрут ОТК.',
  merch:
    'Паспорт и визуал в приоритете; материалы и конструкция в общей полосе вкладок; экспорт скетча без техметок по умолчанию.',
  compliance:
    'Паспорт (рынок, коды, происхождение), комплаенс скетча, сертификаты в материалах.',
  factory:
    'Конструкция и узлы рядом с каноном и BOM; минимум шума; ссылка ?w2view=factory копируема.',
  finance:
    'Состав и costing; канон и версия визуала в первичных секциях для привязки цифр к образу.',
};

/** Секции ТЗ, которые профиль считает первичными (остальные можно сворачивать в последующих итерациях UI). */
export const WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS: Record<Workshop2DossierViewProfile, DossierSection[]> = {
  full: ['general', 'visuals', 'material', 'construction'],
  /** Все четыре вкладки в основной полосе навигации (конструкция — 4-я после материалов). */
  manager: ['general', 'visuals', 'material', 'construction'],
  designer: ['general', 'visuals', 'material', 'construction'],
  technologist: ['general', 'visuals', 'material', 'construction'],
  supply: ['material', 'visuals', 'general', 'construction'],
  production: ['visuals', 'material', 'construction'],
  /** Паспорт в начале: артикул, состав, коды для приёмки. */
  qc: ['general', 'visuals', 'construction', 'material'],
  merch: ['general', 'visuals', 'material', 'construction'],
  compliance: ['general', 'material', 'visuals', 'construction'],
  /** Конструкция первой: узлы/швы для выдачи на пол. */
  factory: ['construction', 'visuals', 'material', 'general'],
  /** Визуал с каноном — к costing без отдельного API превью. */
  finance: ['material', 'visuals', 'general', 'construction'],
};

/** localStorage: последний выбранный `w2view` (включая `full`). */
export const W2_DOSSIER_VIEW_PREF_LS_KEY = 'w2-dossier-view-pref-v1';

export function readPersistedWorkshop2DossierView(): Workshop2DossierViewProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(W2_DOSSIER_VIEW_PREF_LS_KEY)?.trim().toLowerCase();
    if (!raw) return null;
    if (raw === 'full') return 'full';
    return VALID_PROFILES.has(raw) ? (raw as Workshop2DossierViewProfile) : null;
  } catch {
    return null;
  }
}

export function persistWorkshop2DossierViewPreference(profile: Workshop2DossierViewProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(W2_DOSSIER_VIEW_PREF_LS_KEY, profile);
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Стартовый режим ТЗ без `?w2view=` в URL (после сохранённого выбора — по роли платформы).
 */
export function defaultWorkshop2DossierViewForPlatformRole(role: PlatformRole): Workshop2DossierViewProfile {
  switch (role) {
    case 'designer':
      return 'designer';
    case 'technologist':
      return 'technologist';
    case 'manufacturer':
      return 'factory';
    case 'supplier':
      return 'supply';
    case 'production_manager':
      return 'production';
    case 'finance_manager':
      return 'finance';
    case 'merchandiser':
      return 'merch';
    case 'brand':
    case 'sales_rep':
      return 'manager';
    case 'admin':
      return 'full';
    default:
      return 'full';
  }
}

/** Явный query-параметр: непустая строка после trim (пустой `w2view=` считаем отсутствием). */
export function workshop2DossierViewUrlParamIsExplicit(raw: string | null | undefined): boolean {
  return raw != null && raw.trim() !== '';
}

/**
 * Профиль для воркспейса: непустой URL → парсинг; иначе LS → иначе роль.
 */
export function resolveWorkshop2DossierViewFromWorkspaceUrl(
  urlParamRaw: string | null | undefined,
  platformRole: PlatformRole
): Workshop2DossierViewProfile {
  if (workshop2DossierViewUrlParamIsExplicit(urlParamRaw)) {
    return parseWorkshop2DossierViewParam(urlParamRaw);
  }
  return readPersistedWorkshop2DossierView() ?? defaultWorkshop2DossierViewForPlatformRole(platformRole);
}

/**
 * Единая матрица «фича × профиль» для хабов ТЗ (паспорт / материалы / визуал).
 * Условия «есть данные» (например linkedBomRefs.length) остаются в компонентах.
 *
 * Расширение: добавить ключ в этот тип и строку для каждого профиля в `WORKSHOP2_DOSSIER_VIEW_UI_CAPS` ниже;
 * в UI читать через `workshop2DossierViewUiCaps(profile)`, не ветвить профиль локальными `useMemo`.
 */
export type Workshop2DossierViewUiCaps = {
  materialComplianceStrip: boolean;
  /** Стрип lineRef скетча ↔ mat в хабе материалов. */
  materialSketchBomRefsStrip: boolean;
  materialMatSketchGapStrip: boolean;
  materialBomNormsStrip: boolean;
  materialSupplyRouteStrip: boolean;
  materialCostingHintsStrip: boolean;
  /** Лента linkedBom в паспорт-хабе (роли шире, чем у mat-хаба). */
  passportSketchBomRefsRibbon: boolean;
  passportMatSketchGapRibbon: boolean;
  passportCriticalAuditStrip: boolean;
  visualSketchExportSurfacesStrip: boolean;
  visualSketchPinLinkFieldsStrip: boolean;
  /** Лента SKU/артикул над телом секции вне «Паспорт» (ОТК, финансы, цех, фабрика). */
  showCompactPassportContextRibbon: boolean;
};

const WORKSHOP2_DOSSIER_VIEW_UI_CAPS: Record<Workshop2DossierViewProfile, Workshop2DossierViewUiCaps> = {
  full: {
    materialComplianceStrip: true,
    materialSketchBomRefsStrip: true,
    materialMatSketchGapStrip: true,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: true,
    passportSketchBomRefsRibbon: true,
    passportMatSketchGapRibbon: true,
    passportCriticalAuditStrip: true,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: false,
  },
  manager: {
    materialComplianceStrip: true,
    materialSketchBomRefsStrip: false,
    materialMatSketchGapStrip: true,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: true,
    passportSketchBomRefsRibbon: true,
    passportMatSketchGapRibbon: true,
    passportCriticalAuditStrip: true,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: false,
  },
  designer: {
    materialComplianceStrip: false,
    materialSketchBomRefsStrip: false,
    materialMatSketchGapStrip: false,
    materialBomNormsStrip: false,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: false,
    passportSketchBomRefsRibbon: false,
    passportMatSketchGapRibbon: false,
    passportCriticalAuditStrip: false,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: false,
  },
  technologist: {
    materialComplianceStrip: true,
    materialSketchBomRefsStrip: true,
    materialMatSketchGapStrip: true,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: false,
    passportSketchBomRefsRibbon: true,
    passportMatSketchGapRibbon: true,
    passportCriticalAuditStrip: true,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: false,
  },
  supply: {
    materialComplianceStrip: true,
    materialSketchBomRefsStrip: true,
    materialMatSketchGapStrip: true,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: true,
    passportSketchBomRefsRibbon: true,
    passportMatSketchGapRibbon: true,
    passportCriticalAuditStrip: false,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: false,
  },
  production: {
    materialComplianceStrip: false,
    materialSketchBomRefsStrip: true,
    materialMatSketchGapStrip: true,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: false,
    passportSketchBomRefsRibbon: true,
    passportMatSketchGapRibbon: true,
    passportCriticalAuditStrip: false,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: true,
  },
  qc: {
    materialComplianceStrip: false,
    materialSketchBomRefsStrip: false,
    materialMatSketchGapStrip: false,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: false,
    passportSketchBomRefsRibbon: false,
    passportMatSketchGapRibbon: false,
    passportCriticalAuditStrip: false,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: true,
  },
  merch: {
    materialComplianceStrip: false,
    materialSketchBomRefsStrip: false,
    materialMatSketchGapStrip: false,
    materialBomNormsStrip: false,
    materialSupplyRouteStrip: false,
    materialCostingHintsStrip: false,
    passportSketchBomRefsRibbon: false,
    passportMatSketchGapRibbon: false,
    passportCriticalAuditStrip: false,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: false,
    showCompactPassportContextRibbon: false,
  },
  compliance: {
    materialComplianceStrip: true,
    materialSketchBomRefsStrip: false,
    materialMatSketchGapStrip: false,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: false,
    passportSketchBomRefsRibbon: false,
    passportMatSketchGapRibbon: false,
    passportCriticalAuditStrip: true,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: true,
  },
  factory: {
    materialComplianceStrip: false,
    materialSketchBomRefsStrip: true,
    materialMatSketchGapStrip: false,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: false,
    passportSketchBomRefsRibbon: false,
    passportMatSketchGapRibbon: false,
    passportCriticalAuditStrip: false,
    visualSketchExportSurfacesStrip: true,
    visualSketchPinLinkFieldsStrip: true,
    showCompactPassportContextRibbon: true,
  },
  finance: {
    materialComplianceStrip: true,
    materialSketchBomRefsStrip: true,
    materialMatSketchGapStrip: false,
    materialBomNormsStrip: true,
    materialSupplyRouteStrip: true,
    materialCostingHintsStrip: true,
    passportSketchBomRefsRibbon: true,
    passportMatSketchGapRibbon: false,
    passportCriticalAuditStrip: true,
    visualSketchExportSurfacesStrip: false,
    visualSketchPinLinkFieldsStrip: false,
    showCompactPassportContextRibbon: true,
  },
};

export function workshop2DossierViewUiCaps(profile: Workshop2DossierViewProfile): Readonly<Workshop2DossierViewUiCaps> {
  return WORKSHOP2_DOSSIER_VIEW_UI_CAPS[profile];
}

/** Ключевые слова в строках журнала сохранения (`summarizeWorkshop2PersistDiff` / tzActionLog) для фильтра «критичный паспорт». */
export const W2_PASSPORT_AUDIT_SUMMARY_KEYWORDS = [
  'Аудитория',
  'Унисекс',
  'Визуальные референсы',
  'Основной эскиз',
  'Метки на эскизе',
  'ТН ВЭД',
  'Incoterms',
  'штрихкод',
  'SKU',
  'артикул',
] as const;

/** Handoff визуала / эскиза в операционные вкладки (якоря DOM уже в воркспейсе). */
export type W2VisualHandoffTarget = {
  tab: W2HandoffArticleTab;
  domId: string;
  label: string;
};

export const W2_VISUAL_HANDOFF_TARGETS: W2VisualHandoffTarget[] = [
  { tab: 'fit', domId: W2_ARTICLE_SECTION_DOM.fit, label: 'Посадка · эталон из меток' },
  { tab: 'qc', domId: W2_ARTICLE_SECTION_DOM.qc, label: 'ОТК · зоны из меток qc/construction' },
];

/**
 * Рекомендуемые поля связи метки (уже в типе `Workshop2Phase1CategorySketchAnnotation`);
 * использовать в подсказках UI и валидаторах без нового API.
 */
export const W2_SKETCH_PIN_LINK_FIELD_DOC = {
  toMaterial: ['linkedBomLineRef', 'linkedMaterialNote', 'linkedAttributeId'] as const,
  toQc: ['linkedQcZoneId', 'mesDefectCode', 'annotationType'] as const,
  toTzSection: ['linkedTzSectionKey', 'linkedRouteStageId'] as const,
};

/** Режимы печати / мерча для UI (без серверного рендера). */
export type W2SketchExportSurface = 'workshop_floor' | 'merch_clean' | 'compliance_packet';

export const W2_SKETCH_EXPORT_SURFACE_LABELS: Record<W2SketchExportSurface, string> = {
  workshop_floor: 'Цех: скетч + легенда меток',
  merch_clean: 'Мерч: без технических меток',
  compliance_packet: 'Комплаенс: канон + ревизия + поля паспорта',
};

// --- Типы под будущую запись в досье (без расширения JSON-схемы в этом PR) ---

export type Workshop2MaterialAlternativeStatus = 'proposed' | 'approved' | 'rejected' | 'superseded';

/** Альтернатива материала / узла BOM (согласование замен на клиенте или позже в API). */
export type Workshop2MaterialAlternativeDraft = {
  altId: string;
  baseLabel: string;
  proposedLabel: string;
  reason?: string;
  status: Workshop2MaterialAlternativeStatus;
  /** ISO-8601 */
  decidedAt?: string;
  decidedBy?: string;
};

export type Workshop2BomLineCostingHint = {
  lineRef: string;
  /** Условная единица для калькуляции без ERP */
  unitHint?: string;
  qtyPerGarment?: number;
  /** Произвольная заметка для финансов */
  financeNote?: string;
};

export type Workshop2BomSampleDeltaKind = 'tz_baseline' | 'sample_actual' | 'production_series';

/** Дельта BOM: что изменилось относительно утверждённого ТЗ или образца. */
export type Workshop2BomLineDeltaDraft = {
  deltaId: string;
  kind: Workshop2BomSampleDeltaKind;
  lineRef: string;
  field: 'material' | 'qty' | 'supplier' | 'color' | 'other';
  beforeLabel: string;
  afterLabel: string;
  note?: string;
  /** ISO-8601 */
  at: string;
  by?: string;
};

export type Workshop2FactoryBomExportColumnKey =
  | 'position'
  | 'componentName'
  | 'materialCode'
  | 'composition'
  | 'qty'
  | 'unit'
  | 'supplier'
  | 'origin'
  | 'comment';

/** Колонки «фабричного» экспорта (CSV/XLS клиентом). */
export const W2_FACTORY_BOM_EXPORT_COLUMNS: { key: Workshop2FactoryBomExportColumnKey; headerRu: string }[] = [
  { key: 'position', headerRu: 'Поз.' },
  { key: 'componentName', headerRu: 'Узел / материал' },
  { key: 'materialCode', headerRu: 'Код' },
  { key: 'composition', headerRu: 'Состав %' },
  { key: 'qty', headerRu: 'Норма' },
  { key: 'unit', headerRu: 'Ед.' },
  { key: 'supplier', headerRu: 'Поставщик' },
  { key: 'origin', headerRu: 'Происхождение' },
  { key: 'comment', headerRu: 'Комментарий' },
];

/** Собрать query-суффикс для шаринга режима (вместе с остальными params страницы). */
export function workshop2DossierViewQueryValue(profile: Workshop2DossierViewProfile): string | null {
  if (profile === 'full') return null;
  return profile;
}

export function isWorkshop2DossierViewPrimarySection(
  profile: Workshop2DossierViewProfile,
  section: DossierSection
): boolean {
  return WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS[profile].includes(section);
}

/** Поверхность экспорта скетча по умолчанию для ролевого w2view (мерч — без техметок на PNG/PDF). */
export function defaultSketchExportSurfaceForDossierView(
  profile: Workshop2DossierViewProfile
): W2SketchExportSurface {
  return profile === 'merch' ? 'merch_clean' : 'workshop_floor';
}
