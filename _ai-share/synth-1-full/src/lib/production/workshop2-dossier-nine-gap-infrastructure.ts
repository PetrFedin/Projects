/**
 * Инфраструктура «до 9 баллов» по разделам ТЗ без API: хелперы, константы, бэклог P0/P1.
 * Состыкуется с `workshop2-dossier-view-infrastructure` и существующими полями досье.
 */

import { W2_ARTICLE_SECTION_DOM, workshop2ArticleHrefQueryToSearchParams } from '@/lib/production/workshop2-url';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { W2_PASSPORT_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-passport-check';
import { W2_VISUAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-visual-section-warnings';
import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchAnnotationType,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  W2_FACTORY_BOM_EXPORT_COLUMNS,
  W2_PASSPORT_AUDIT_SUMMARY_KEYWORDS,
  W2_SKETCH_PIN_LINK_FIELD_DOC,
  W2_VISUAL_HANDOFF_TARGETS,
  type W2SketchExportSurface,
  type W2VisualHandoffTarget,
  type Workshop2BomSampleDeltaKind,
  type Workshop2DossierViewProfile,
  type Workshop2MaterialAlternativeStatus,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

const W2_MATERIAL_ALT_STATUS_LABEL_RU: Record<Workshop2MaterialAlternativeStatus, string> = {
  proposed: 'предложена',
  approved: 'согласована',
  rejected: 'отклонена',
  superseded: 'снята заменой',
};

/** Область сводки «чего не хватает до 9». */
export type W2NineGapArea = 'passport' | 'visual' | 'sketch' | 'material' | 'bom' | 'construction';

export type W2NineGapBacklogItem = {
  id: string;
  area: W2NineGapArea;
  priority: 'P0' | 'P1';
  /** Короткий заголовок для трекера */
  title: string;
  /** Что уже заложено в коде (константы / URL / типы) */
  infraReady: string[];
  /**
   * Продуктовый пробел на P0 (ещё не закрыт инфрой / UX) — показывается в стрипе «Конструктор».
   */
  productGapP0?: string[];
  /** Якорь ТЗ для кнопки «Перейти к блоку» в UI стрипа. */
  dossierJump?: { section: Workshop2TzSignoffSectionKey; anchorId: string };
};

/**
 * Приоритизированный бэклог (один список — фильтруйте по `area` / `priority`).
 * Реализация UI поверх этого — без нового API.
 */
export const W2_NINE_GAP_BACKLOG: readonly W2NineGapBacklogItem[] = [
  {
    id: 'passport-audit',
    area: 'passport',
    priority: 'P0',
    title: 'Аудит / фильтр критичных полей паспорта',
    infraReady: ['W2_PASSPORT_AUDIT_SUMMARY_KEYWORDS', 'filterPassportCriticalAuditLines'],
    productGapP0: [
      'Продуктовый stop-the-line: не считать ТЗ «чистым» для выдачи, пока аудит не пуст и не подтверждён ответственной ролью (сейчас — фильтр и подсветка без жёсткого гейта).',
    ],
    dossierJump: { section: 'general', anchorId: W2_PASSPORT_SUBPAGE_ANCHORS.audit },
  },
  {
    id: 'passport-dense',
    area: 'passport',
    priority: 'P0',
    title: 'Сжатые представления паспорта по роли',
    infraReady: [
      'w2view',
      'WORKSHOP2_DOSSIER_VIEW_PRIMARY_SECTIONS',
      'data-w2-dossier-view',
      'parse/param · resolve URL · persist · workshop2DossierViewUiCaps',
    ],
    dossierJump: { section: 'general', anchorId: W2_PASSPORT_SUBPAGE_ANCHORS.denseView },
  },
  {
    id: 'passport-readonly',
    area: 'passport',
    priority: 'P1',
    title: 'Внешняя read-only выдача (ссылка)',
    infraReady: [
      'buildWorkshop2ExternalReadOnlyParams',
      'w2view=factory',
      'sketchFloor',
      'копирование ссылки в хабе паспорта',
      'P1 пробел: токены/TTL/журнал на сервере (пока только query)',
    ],
    dossierJump: { section: 'general', anchorId: W2_PASSPORT_SUBPAGE_ANCHORS.readOnly },
  },
  {
    id: 'sketch-links',
    area: 'sketch',
    priority: 'P0',
    title: 'Связь метка ↔ материал / QC',
    infraReady: ['W2_SKETCH_PIN_LINK_FIELD_DOC', 'validateSketchPinRequiredLinks'],
    productGapP0: [
      'Сквозная синхронизация BOM/QC при изменении метки без ручного догона и единый список «висячих» связей по артикулу.',
    ],
    dossierJump: { section: 'visuals', anchorId: W2_VISUAL_SUBPAGE_ANCHORS.sketchLinkFields },
  },
  {
    id: 'sketch-templates',
    area: 'sketch',
    priority: 'P0',
    title: 'Шаблоны меток и пресеты по типу',
    infraReady: ['W2_SKETCH_PIN_TYPE_PRESETS', 'sketchPinTemplates в досье', 'sketch-org-templates-repository'],
    productGapP0: [
      'Версионирование шаблонов по коллекции/бренду и принудительное применение пресета при смене типа метки на доске (сейчас — выбор вручную).',
    ],
    dossierJump: { section: 'construction', anchorId: W2_VISUAL_SUBPAGE_ANCHORS.sketchTemplates },
  },
  {
    id: 'visual-canon',
    area: 'visual',
    priority: 'P0',
    title: 'Версии канона и журнал визуала',
    infraReady: ['W2_VISUAL_VERSION_FIELD_CONTRACT', 'поля досье: visualVersionLog, canonicalMainSketchTarget'],
    productGapP0: [
      'Визуальное сравнение ревизий канона (не только текст журнала) и жёсткий гейт handoff при расхождении фото/скетч и подписи версии.',
    ],
    dossierJump: { section: 'visuals', anchorId: W2_VISUAL_SUBPAGE_ANCHORS.canonVersion },
  },
  {
    id: 'visual-handoff',
    area: 'visual',
    priority: 'P0',
    title: 'Handoff визуала в ОТК / цех / снабжение',
    infraReady: ['W2_VISUAL_HANDOFF_TARGETS', 'W2_VISUAL_HANDOFF_EXTENDED', 'getVisualHandoffTargetsForProfile'],
    productGapP0: [
      'Подтверждение получения handoff ролями (цех/ОТК/снабжение) в маршруте, а не только ссылка, JSON и печать.',
    ],
    dossierJump: { section: 'visuals', anchorId: W2_VISUAL_SUBPAGE_ANCHORS.handoff },
  },
  {
    id: 'sketch-print',
    area: 'sketch',
    priority: 'P1',
    title: 'Печать / мерч-вид',
    infraReady: ['W2_SKETCH_EXPORT_SURFACE_LABELS', 'W2_SKETCH_PIN_VISIBILITY_BY_SURFACE'],
    dossierJump: { section: 'visuals', anchorId: W2_VISUAL_SUBPAGE_ANCHORS.sketchExportSurfaces },
  },
  {
    id: 'bom-delta',
    area: 'bom',
    priority: 'P0',
    title: 'Дельта BOM к образцу / серии',
    infraReady: ['Workshop2BomLineDeltaDraft', 'Workshop2BomSampleDeltaKind'],
    productGapP0: [
      'Сквозной статус «дельта согласована с фабрикой/образцом» и жёсткий гейт серии без подтверждённой дельты (сейчас — локальные черновики и ручное закрытие).',
    ],
    dossierJump: { section: 'material', anchorId: W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsDelta },
  },
  {
    id: 'bom-factory-export',
    area: 'bom',
    priority: 'P0',
    title: 'Фабричный экспорт (колонки)',
    infraReady: ['W2_FACTORY_BOM_EXPORT_COLUMNS', 'formatFactoryBomCsvHeaderRow'],
    productGapP0: [
      'Профили колонок по фабрике из UI и выгрузка в канал производства без ручной сборки CSV (сейчас — формат и копирование из экрана).',
    ],
    dossierJump: { section: 'material', anchorId: W2_MATERIAL_SUBPAGE_ANCHORS.factoryExport },
  },
  {
    id: 'material-alt',
    area: 'material',
    priority: 'P0',
    title: 'Альтернативы и согласование замен',
    infraReady: ['Workshop2MaterialAlternativeDraft', 'W2_MATERIAL_ALTERNATIVE_STATUS_FLOW'],
    productGapP0: [
      'Уведомления ответственным и блокировка следующего шага закупки/производства при несогласованной замене до финального статуса в потоке.',
    ],
    dossierJump: { section: 'material', anchorId: W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsAlts },
  },
  {
    id: 'material-compliance',
    area: 'material',
    priority: 'P0',
    title: 'Сертификаты и комплаенс в одном потоке с материалами',
    infraReady: ['W2_MATERIAL_COMPLIANCE_FLOW_STEPS'],
    productGapP0: [
      'Автоконтроль сроков сертификатов/деклараций и гейт отгрузки или партии при просрочке (сейчас — чеклист и ручная сверка).',
    ],
    dossierJump: { section: 'material', anchorId: W2_MATERIAL_SUBPAGE_ANCHORS.compliance },
  },
  {
    id: 'bom-costing',
    area: 'bom',
    priority: 'P1',
    title: 'Связка с costing (локальные подсказки)',
    infraReady: ['Workshop2BomLineCostingHint', 'mergeCostingHintsByLineRef'],
    dossierJump: { section: 'material', anchorId: W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsCosting },
  },
  {
    id: 'bom-norms',
    area: 'bom',
    priority: 'P1',
    title: 'Производственные нормы и потери',
    infraReady: ['W2_BOM_PRODUCTION_NORM_FIELDS'],
    dossierJump: { section: 'material', anchorId: W2_MATERIAL_SUBPAGE_ANCHORS.bomNorms },
  },
  {
    id: 'construction-bom-measurements',
    area: 'construction',
    priority: 'P0',
    title: 'Один контур: конструкция ↔ мерки ↔ BOM (без противоречий по слоям и длинам)',
    infraReady: ['sectionReadiness', 'GROUP_TO_DOSSIER_SECTION', 'mat ↔ sketch ref'],
    productGapP0: [
      'Автоматический гейт противоречий слой/длина между мерки · mat · узлами каталога (сейчас — ручная сверка и подсказки в UI).',
    ],
    dossierJump: { section: 'construction', anchorId: W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour },
  },
  {
    id: 'construction-sketch-trace',
    area: 'construction',
    priority: 'P0',
    title: 'Узлы конструкции согласованы с метками скетча (construction / qc)',
    infraReady: ['validateSketchPinRequiredLinks', 'CategorySketchAnnotator'],
    productGapP0: [
      'Блокирующий гейт перед выгрузкой: все критичные узлы закрыты метками construction/qc на доске (сейчас — точечная валидация, не полный stop-the-line).',
    ],
    dossierJump: { section: 'construction', anchorId: W2_VISUAL_SUBPAGE_ANCHORS.sketch },
  },
  {
    id: 'construction-export',
    area: 'construction',
    priority: 'P1',
    title: 'Выгрузка листа узлов / ТК для цеха (PDF или таблица)',
    infraReady: ['tech-pack / export routes — вне этого экрана'],
    dossierJump: { section: 'construction', anchorId: W2_CONSTRUCTION_SUBPAGE_ANCHORS.export },
  },
  {
    id: 'construction-signoff',
    area: 'construction',
    priority: 'P1',
    title: 'Подпись блока конструкции в линии ТЗ (как у прочих секций)',
    infraReady: ['dossier signoff meta по секциям', 'Workshop2TzDigitalSignoffRow по секциям ТЗ'],
    dossierJump: { section: 'construction', anchorId: W2_CONSTRUCTION_SUBPAGE_ANCHORS.signoff },
  },
] as const;

/**
 * Дорожная карта «Визуал / эскиз» (5 пунктов): связи и шаблоны → канон и журнал → handoff → печать.
 * В UI стрип с заголовком «Визуал»; у P0 — `productGapP0`.
 */
export const W2_NINE_GAP_VISUAL_SKETCH_ROADMAP_IDS = [
  'sketch-links',
  'sketch-templates',
  'visual-canon',
  'visual-handoff',
  'sketch-print',
] as const;

export const W2_NINE_GAP_VISUAL_SKETCH_ROADMAP: readonly W2NineGapBacklogItem[] =
  W2_NINE_GAP_VISUAL_SKETCH_ROADMAP_IDS.map((id) => {
    const row = W2_NINE_GAP_BACKLOG.find((x) => x.id === id);
    if (!row) throw new Error(`[W2_NINE_GAP_VISUAL_SKETCH_ROADMAP] missing backlog id: ${String(id)}`);
    return row;
  });

/**
 * Дорожная карта «Материалы / BOM» (6 пунктов): дельта и фабрика → альтернативы и комплаенс → costing → нормы.
 * В UI стрип с заголовком «Материалы»; у P0 — `productGapP0` (что ещё не закрыто продуктом).
 */
export const W2_NINE_GAP_MATERIAL_BOM_ROADMAP_IDS = [
  'bom-delta',
  'bom-factory-export',
  'material-alt',
  'material-compliance',
  'bom-costing',
  'bom-norms',
] as const;

export const W2_NINE_GAP_MATERIAL_BOM_ROADMAP: readonly W2NineGapBacklogItem[] =
  W2_NINE_GAP_MATERIAL_BOM_ROADMAP_IDS.map((id) => {
    const row = W2_NINE_GAP_BACKLOG.find((x) => x.id === id);
    if (!row) throw new Error(`[W2_NINE_GAP_MATERIAL_BOM_ROADMAP] missing backlog id: ${String(id)}`);
    return row;
  });

/**
 * Дорожная карта «Конструкция / конструктор» (4 пункта): контур → скетч → выгрузка → подпись секции.
 * В UI стрип с заголовком «Конструктор»; у P0 дополнительно `productGapP0` — что ещё не закрыто продуктом.
 */
export const W2_NINE_GAP_CONSTRUCTION_ROADMAP_IDS = [
  'construction-bom-measurements',
  'construction-sketch-trace',
  'construction-export',
  'construction-signoff',
] as const;

export const W2_NINE_GAP_CONSTRUCTION_ROADMAP: readonly W2NineGapBacklogItem[] =
  W2_NINE_GAP_CONSTRUCTION_ROADMAP_IDS.map((id) => {
    const row = W2_NINE_GAP_BACKLOG.find((x) => x.id === id);
    if (!row) throw new Error(`[W2_NINE_GAP_CONSTRUCTION_ROADMAP] missing backlog id: ${String(id)}`);
    return row;
  });

export function nineGapBacklogByArea(area: W2NineGapArea): readonly W2NineGapBacklogItem[] {
  return W2_NINE_GAP_BACKLOG.filter((x) => x.area === area);
}

/** Несколько областей (например визуал + эскиз) — P0 выше P1, порядок стабильный. */
export function nineGapBacklogByAreas(areas: readonly W2NineGapArea[]): readonly W2NineGapBacklogItem[] {
  const want = new Set(areas);
  const rows = W2_NINE_GAP_BACKLOG.filter((x) => want.has(x.area));
  return [...rows].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === 'P0' ? -1 : 1;
    return a.id.localeCompare(b.id);
  });
}

export function nineGapBacklogByPriority(p: 'P0' | 'P1'): readonly W2NineGapBacklogItem[] {
  return W2_NINE_GAP_BACKLOG.filter((x) => x.priority === p);
}

// --- Паспорт: критичный аудит (строки из summarizeWorkshop2PersistDiff / tzActionLog) ---

export function filterPassportCriticalAuditLines(summaries: string[]): string[] {
  if (summaries.length === 0) return [];
  return summaries.filter((line) =>
    W2_PASSPORT_AUDIT_SUMMARY_KEYWORDS.some((kw) => line.includes(kw))
  );
}

/**
 * Параметры «внешней» read-only сессии: только query, без токенов и API.
 * Подставляйте в URL страницы артикула после `?`.
 */
export type Workshop2ExternalReadOnlyParamsInput = {
  /** Режим `w2view` (обычно factory). */
  view: Exclude<Workshop2DossierViewProfile, 'full'>;
  /** Режим пола скетча — только просмотр. */
  sketchFloor?: boolean;
  /** Шаг карточки: 1 = досье. */
  w2step?: '1' | '2' | '3';
  /** Секция досье при открытии. */
  w2sec?: 'general' | 'visuals' | 'material';
  /** Вкладка карточки артикула (`w2pane`), чтобы сразу открыть ТЗ или этап маршрута. */
  w2pane?: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock';
};

export function buildWorkshop2ExternalReadOnlyParams(input: Workshop2ExternalReadOnlyParamsInput): URLSearchParams {
  return workshop2ArticleHrefQueryToSearchParams({
    w2view: input.view,
    sketchFloor: input.sketchFloor,
    w2step: input.w2step,
    w2sec: input.w2sec,
    w2pane: input.w2pane,
  });
}

// --- Визуал: контракт полей версий (уже в Workshop2DossierPhase1) ---

export const W2_VISUAL_VERSION_FIELD_CONTRACT = {
  versionLabel: 'currentVisualVersionLabel',
  log: 'visualVersionLog',
  canonicalSketch: 'canonicalMainSketchTarget',
  canonicalPhoto: 'canonicalMainPhotoRefId',
} as const;

// --- Handoff: расширение до снабжения (материал из визуала) ---
// Production / technologist / qc: см. тесты `production handoff` и `getVisualHandoffTargetsForProfile`.
// Отложено (визуал ↔ BOM по строке): см. шапку `workshop2-dossier-view-infrastructure.ts`.

export type W2VisualHandoffExtended = W2VisualHandoffTarget | {
  tab: 'supply';
  domId: string;
  label: string;
};

export const W2_VISUAL_HANDOFF_EXTENDED: readonly W2VisualHandoffExtended[] = [
  ...W2_VISUAL_HANDOFF_TARGETS,
  {
    tab: 'supply',
    domId: W2_ARTICLE_SECTION_DOM.supply,
    label: 'Снабжение · материал по канону / меткам fabric/hardware',
  },
];

export function getVisualHandoffTargetsForProfile(profile: Workshop2DossierViewProfile): readonly W2VisualHandoffExtended[] {
  switch (profile) {
    case 'supply':
      return W2_VISUAL_HANDOFF_EXTENDED;
    case 'qc':
      return W2_VISUAL_HANDOFF_EXTENDED.filter((t) => t.tab === 'qc' || t.tab === 'fit');
    case 'production':
      /** Цех: посадка первично; ОТК — вторая ссылка для контекста зон qc/construction. */
      return W2_VISUAL_HANDOFF_EXTENDED.filter((t) => t.tab === 'fit' || t.tab === 'qc');
    case 'technologist':
      return W2_VISUAL_HANDOFF_EXTENDED.filter((t) => t.tab === 'fit' || t.tab === 'qc');
    case 'full':
    case 'manager':
    case 'designer':
    case 'merch':
    case 'compliance':
    case 'factory':
    case 'finance':
    default:
      return W2_VISUAL_HANDOFF_EXTENDED;
  }
}

// --- Эскиз: пресеты текста по типу метки (подсказка «добавить метку») ---

export type W2SketchPinTypePreset = {
  annotationType: Workshop2SketchAnnotationType;
  suggestedLabel: string;
  linkFocus: 'material' | 'qc' | 'general';
};

export const W2_SKETCH_PIN_TYPE_PRESETS: readonly W2SketchPinTypePreset[] = [
  { annotationType: 'material', suggestedLabel: 'Основная ткань / состав', linkFocus: 'material' },
  { annotationType: 'hardware', suggestedLabel: 'Фурнитура / крепёж', linkFocus: 'material' },
  { annotationType: 'construction', suggestedLabel: 'Узел / шов / усиление', linkFocus: 'qc' },
  { annotationType: 'qc', suggestedLabel: 'Зона контроля ОТК', linkFocus: 'qc' },
  { annotationType: 'fit', suggestedLabel: 'Посадка / допуск', linkFocus: 'qc' },
  { annotationType: 'finishing', suggestedLabel: 'Отделка / край', linkFocus: 'general' },
  { annotationType: 'labeling', suggestedLabel: 'Маркировка / уход', linkFocus: 'general' },
];

/** Какие поля метки показывать в режиме экспорта (инфраструктура для печати). */
export const W2_SKETCH_PIN_VISIBILITY_BY_SURFACE: Record<
  W2SketchExportSurface,
  { showTechnicalPins: boolean; showQcCodes: boolean }
> = {
  workshop_floor: { showTechnicalPins: true, showQcCodes: true },
  merch_clean: { showTechnicalPins: false, showQcCodes: false },
  compliance_packet: { showTechnicalPins: true, showQcCodes: true },
};

export type W2SketchPinLinkValidationMode = 'material' | 'qc' | 'strict';

export type W2SketchPinLinkIssue = { code: 'missing_material_link' | 'missing_qc_link'; message: string };

/**
 * Проверка «жёсткой» связи метки с материалом и/или QC (локально, до API).
 * `strict`: для типов material/hardware — нужен след материала; для qc/construction — след QC.
 */
export function validateSketchPinRequiredLinks(
  pin: Pick<
    Workshop2Phase1CategorySketchAnnotation,
    'annotationType' | 'linkedBomLineRef' | 'linkedMaterialNote' | 'linkedQcZoneId' | 'mesDefectCode'
  >,
  mode: W2SketchPinLinkValidationMode
): { ok: boolean; issues: W2SketchPinLinkIssue[] } {
  const issues: W2SketchPinLinkIssue[] = [];
  const t = pin.annotationType;
  const hasMat = Boolean((pin.linkedBomLineRef ?? '').trim() || (pin.linkedMaterialNote ?? '').trim());
  const hasQc = Boolean((pin.linkedQcZoneId ?? '').trim() || (pin.mesDefectCode ?? '').trim());

  const needsMaterial = t === 'material' || t === 'hardware';
  const needsQc = t === 'qc' || t === 'construction';

  if (mode === 'material' || mode === 'strict') {
    if (needsMaterial && !hasMat) {
      issues.push({
        code: 'missing_material_link',
        message: 'Укажите связь с материалом/BOM (код строки или текст узла).',
      });
    }
  }
  if (mode === 'qc' || mode === 'strict') {
    if (needsQc && !hasQc) {
      issues.push({
        code: 'missing_qc_link',
        message: 'Укажите зону QC или код дефекта.',
      });
    }
  }
  return { ok: issues.length === 0, issues };
}

// --- Материалы: комплаенс-шаги и статусы альтернатив ---

export const W2_MATERIAL_COMPLIANCE_FLOW_STEPS = [
  { stepId: 'composition_locked', labelRu: 'Состав и доли зафиксированы' },
  { stepId: 'restricted_substances', labelRu: 'Ограничения / REACH и аналоги проверены' },
  { stepId: 'certificates', labelRu: 'Сертификаты (если нужны) приложены или запрошены' },
  { stepId: 'origin_trace', labelRu: 'Происхождение волокна / страна для таможни' },
] as const;

export const W2_MATERIAL_ALTERNATIVE_STATUS_FLOW: Record<
  Workshop2MaterialAlternativeStatus,
  readonly Workshop2MaterialAlternativeStatus[]
> = {
  proposed: ['approved', 'rejected', 'superseded'],
  approved: ['superseded'],
  rejected: ['proposed'],
  superseded: [],
};

// --- BOM: нормы и CSV ---

export const W2_BOM_PRODUCTION_NORM_FIELDS = [
  { key: 'qtyPerGarment', labelRu: 'Норма на изделие' },
  { key: 'wastePct', labelRu: 'Потери / отход %' },
  { key: 'unit', labelRu: 'Единица учёта' },
] as const;

/** Поля черновика costing-подсказки по строке BOM (`Workshop2BomLineCostingHint`). */
export const W2_BOM_COSTING_HINT_FIELDS = [
  { key: 'lineRef', labelRu: 'Ссылка на строку BOM (код / ref)' },
  { key: 'unitHint', labelRu: 'Условная единица учёта (м, кг, шт, м²…)' },
  { key: 'qtyPerGarment', labelRu: 'Количество на изделие' },
  { key: 'financeNote', labelRu: 'Заметка для costing / финконтроля' },
] as const;

/** Подписи видов дельты BOM (образец vs серия) — для UI и буфера без API. */
export const W2_BOM_SAMPLE_DELTA_KIND_LABELS: Record<Workshop2BomSampleDeltaKind, string> = {
  tz_baseline: 'Утверждённое ТЗ (базовая спецификация)',
  sample_actual: 'Факт по образцу / прототипу',
  production_series: 'Серийное производство',
};

/** Текстовое описание переходов статуса альтернативы (согласование замен). */
export function formatMaterialAlternativeStatusFlowPlainText(): string {
  const lines = [
    'Альтернатива материала · допустимые переходы статуса (локально, до записи в API):',
    '',
  ];
  (Object.entries(W2_MATERIAL_ALTERNATIVE_STATUS_FLOW) as [Workshop2MaterialAlternativeStatus, readonly Workshop2MaterialAlternativeStatus[]][]).forEach(
    ([from, tos]) => {
      const fromRu = W2_MATERIAL_ALT_STATUS_LABEL_RU[from];
      if (tos.length === 0) {
        lines.push(`· ${fromRu} — конечный статус`);
      } else {
        const dest = tos.map((t) => W2_MATERIAL_ALT_STATUS_LABEL_RU[t]).join(' · ');
        lines.push(`· ${fromRu} → ${dest}`);
      }
    }
  );
  return lines.join('\n');
}

export function formatBomSampleDeltaGuidePlainText(): string {
  const lines = [
    'BOM · фиксация дельты к образцу / серии (черновик для переписки и таблицы):',
    '',
    ...(
      Object.entries(W2_BOM_SAMPLE_DELTA_KIND_LABELS) as [Workshop2BomSampleDeltaKind, string][]
    ).map(([kind, label]) => `· [${kind}] ${label}`),
    '',
    'Зафиксируйте для каждой изменённой строки: поле (материал / кол-во / поставщик / цвет), было → стало, дата, кто согласовал.',
  ];
  return lines.join('\n');
}

/** Текст для буфера: какие поля метки тянуть к материалу, QC и ТЗ. */
export function formatSketchPinLinkFieldsPlainText(): string {
  const d = W2_SKETCH_PIN_LINK_FIELD_DOC;
  return [
    'Метка на скетче · поля связей (тип Workshop2Phase1CategorySketchAnnotation):',
    '',
    'К материалу / BOM:',
    ...d.toMaterial.map((f) => `  · ${f}`),
    '',
    'К QC / MES:',
    ...d.toQc.map((f) => `  · ${f}`),
    '',
    'К разделу ТЗ / этапу маршрута:',
    ...d.toTzSection.map((f) => `  · ${f}`),
  ].join('\n');
}

export function formatCostingHintsGuidePlainText(): string {
  return [
    'Локальные costing-подсказки по строке BOM (тип Workshop2BomLineCostingHint, без API):',
    '',
    ...W2_BOM_COSTING_HINT_FIELDS.map((x) => `· ${x.key}: ${x.labelRu}`),
    '',
    'Сшивка строк в таблице: mergeCostingHintsByLineRef по lineRef.',
  ].join('\n');
}

export function formatFactoryBomCsvHeaderRow(delimiter: ',' | ';' = ','): string {
  return W2_FACTORY_BOM_EXPORT_COLUMNS.map((c) => c.headerRu).join(delimiter);
}

/** Слияние costing-подсказок по одному lineRef (для локальных таблиц UI). */
export function mergeCostingHintsByLineRef<T extends { lineRef: string }>(rows: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const r of rows) {
    m.set(r.lineRef.trim(), r);
  }
  return m;
}
