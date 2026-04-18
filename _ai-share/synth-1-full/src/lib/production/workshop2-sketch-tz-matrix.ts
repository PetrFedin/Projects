import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type {
  Workshop2SketchAnnotationType,
  Workshop2TzPanelSectionId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { TZ_PANEL_SECTION_LABELS } from '@/lib/production/workshop2-visual-excellence';

/**
 * Частые атрибуты секции «Визуал» (цвет/силуэт/палитра) — подсветка и быстрые ссылки к полям ТЗ
 * при выборе метки конструкции, материала, посадки, отделки, фурнитуры, ОТК.
 */
const VISUAL_AXIS_ATTR_IDS = [
  'color',
  'sil',
  'primaryColorFamilyOptions',
  'colorReferenceSystemOptions',
] as const;

function withVisualAxes(ids: readonly string[]): string[] {
  return [...new Set([...ids, ...VISUAL_AXIS_ATTR_IDS])];
}

/** Подписи типов меток (как в CategorySketchAnnotator). */
export const SKETCH_ANNOTATION_TYPE_LABELS: Record<Workshop2SketchAnnotationType, string> = {
  construction: 'Конструкция',
  material: 'Материал',
  fit: 'Посадка',
  finishing: 'Обработка',
  hardware: 'Фурнитура',
  labeling: 'Маркировка',
  qc: 'ОТК',
};

const SKETCH_TYPE_TZ_MATRIX: Record<
  Workshop2SketchAnnotationType,
  {
    section: Workshop2TzPanelSectionId;
    managerHint: string;
    /** Подсказки привязки к полям каталога (attributeId), если они есть в ТЗ. */
    suggestedAttributeIds: string[];
  }
> = {
  construction: {
    section: 'construction',
    managerHint: 'Узел закрепить в «Конструкция»: швы, лекала, форма деталей.',
    suggestedAttributeIds: withVisualAxes([
      'collarOptionsByCategory',
      'sleeveOptionsByCategory',
      'pocketOptions',
      'seamOptionsByCategory',
      'fasteningOptionsByCategory',
      'shoulderOptionsByCategory',
      'hemTypeOptionsByCategory',
      'backDetailOptionsByCategory',
    ]),
  },
  material: {
    section: 'material',
    managerHint: 'Связать с BOM: состав, назначение материала, ограничения.',
    suggestedAttributeIds: withVisualAxes([
      'mat',
      'composition',
      'fabricCompositionPresetOptions',
      'fabricCompositionDetailClassOptions',
      'fabricWeightGsmPresetOptions',
      'fabricTextureOptions',
      'liningOptionsByCategory',
      'insulationMaterialOptions',
    ]),
  },
  fit: {
    section: 'construction',
    managerHint: 'Посадка → табель мер и допуски по затрагиваемым линиям (вкладка «Конструкция»).',
    suggestedAttributeIds: withVisualAxes([
      'sampleBaseSize',
      'clothingFitOptions',
      'fitToleranceSpec',
      'garmentLengthApparelOptions',
    ]),
  },
  finishing: {
    section: 'construction',
    managerHint: 'Обработки и отделка — в конструктиве; при необходимости дубли в материалах.',
    suggestedAttributeIds: withVisualAxes([
      'hemFinishOptionsByCategory',
      'processingTechOptionsByCategory',
      'stitchingOptionsByCategory',
      'decorationSpec',
    ]),
  },
  hardware: {
    section: 'material',
    managerHint: 'Фурнитура — позиции BOM, типоразмер, цвет, установка.',
    suggestedAttributeIds: withVisualAxes([
      'hardwareOptionsByCategory',
      'fasteningOptionsByCategory',
    ]),
  },
  labeling: {
    section: 'material',
    managerHint: 'Маркировка, составник, комплектация — в «Материалы (BOM)».',
    suggestedAttributeIds: [
      'onProductMarkingSpec',
      'nationalMarkingTraceabilityOptions',
      'certificationMarksOptions',
      'productBarcodeTypeOptions',
      'packagingInstruction',
    ],
  },
  qc: {
    section: 'construction',
    managerHint: 'Критерий ОТК / зона контроля; ключевые мерки при необходимости.',
    suggestedAttributeIds: withVisualAxes([
      'qcCheckpoint',
      'preQcGates',
      'sampleCosmeticTolerance',
    ]),
  },
};

/** attributeId из каталога для быстрой привязки метки к полю ТЗ. */
export function suggestedTzAttributeIdsForSketchType(
  t: Workshop2SketchAnnotationType | undefined
): string[] {
  if (!t) return [];
  return SKETCH_TYPE_TZ_MATRIX[t]?.suggestedAttributeIds ?? [];
}

export type VisualCatalogSketchLinkRow = Pick<
  AttributeCatalogAttribute,
  'attributeId' | 'sketchHighlightForPinTypes'
>;

/**
 * Матрица типов меток + опционально поля каталога с `sketchHighlightForPinTypes` (секция «Визуал»).
 */
export function mergeSuggestedTzAttributeIdsForSketchType(
  t: Workshop2SketchAnnotationType | undefined,
  visualsCatalogLinks: VisualCatalogSketchLinkRow[] | undefined
): string[] {
  const base = suggestedTzAttributeIdsForSketchType(t);
  if (!t || !visualsCatalogLinks?.length) return base;
  const extra: string[] = [];
  for (const row of visualsCatalogLinks) {
    const pins = row.sketchHighlightForPinTypes;
    if (pins?.includes(t)) extra.push(row.attributeId);
  }
  return [...new Set([...base, ...extra])];
}

export function recommendedTzSectionForSketchType(
  t: Workshop2SketchAnnotationType | undefined
): Workshop2TzPanelSectionId | undefined {
  if (!t) return undefined;
  return SKETCH_TYPE_TZ_MATRIX[t]?.section;
}

export function sketchTypeTzMatrixHint(
  t: Workshop2SketchAnnotationType | undefined
): string | undefined {
  if (!t) return undefined;
  return SKETCH_TYPE_TZ_MATRIX[t]?.managerHint;
}

export type SketchTzMatrixRow = {
  annotationType: Workshop2SketchAnnotationType;
  typeLabel: string;
  section: Workshop2TzPanelSectionId;
  sectionLabel: string;
  managerHint: string;
  suggestedAttributeIds: string[];
};

export const SKETCH_TZ_MATRIX_ROWS: SketchTzMatrixRow[] = (
  Object.keys(SKETCH_TYPE_TZ_MATRIX) as Workshop2SketchAnnotationType[]
).map((annotationType) => {
  const m = SKETCH_TYPE_TZ_MATRIX[annotationType];
  return {
    annotationType,
    typeLabel: SKETCH_ANNOTATION_TYPE_LABELS[annotationType],
    section: m.section,
    sectionLabel: TZ_PANEL_SECTION_LABELS[m.section],
    managerHint: m.managerHint,
    suggestedAttributeIds: m.suggestedAttributeIds,
  };
});
