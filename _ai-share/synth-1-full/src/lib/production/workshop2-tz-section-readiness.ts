/**
 * Готовность вкладок ТЗ по набору строк атрибутов текущего шага (фаза 1 / 2 / 3).
 * Строки должны совпадать с `rowsToShow` / `rowsToShowPhase2` / `rowsToShowPhase3` в досье.
 */

import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import { getAttributeById, type ResolvedPhase1AttributeRow } from './attribute-catalog';
import { type DossierSection, resolveAttributeSection } from './dossier-readiness-engine';

export type WorkshopTzReadinessPhase = '1' | '2' | '3';

export type WorkshopTzSectionReadinessOptions = {
  tzPhase?: WorkshopTzReadinessPhase;
};

/** Ручной маппинг attributeId → секция навигации ТЗ (поверх каталога и groupId). */
export const WORKSHOP_TZ_ATTR_SECTION_MAP: Record<string, DossierSection> = {
  // General (Block 1 + Identity)
  sku: 'general',
  name: 'general',
  audience: 'general',
  l1: 'general',
  l2: 'general',
  l3: 'general',
  color: 'general',
  collection: 'general',
  season: 'general',
  brand: 'general',
  styleOccasionOptions: 'general',
  primaryColorFamilyOptions: 'general',
  colorReferenceSystemOptions: 'general',
  fabricCompositionDetailClassOptions: 'material',
  countryOfOriginMarketOptions: 'general',
  certificationMarksOptions: 'sample_intake',
  customsHsDeclarationOptions: 'general',
  customsProductGroupOptions: 'general',
  customsTnvedCodePrimary: 'general',
  customsTnvedCodeSecondary: 'general',
  customsTnvedCodeTertiary: 'general',
  customsTnvedPreliminaryCode: 'general',
  customsTnvedShipmentApprovedCode: 'sample_intake',
  customsClassificationRationale: 'general',
  okpd2CodeNote: 'sample_intake',
  countryOfGoodsOriginOptions: 'sample_intake',
  nationalMarkingTraceabilityOptions: 'sample_intake',
  technicalRegulationEaeskOptions: 'sample_intake',
  technicalRegulationDocReference: 'sample_intake',
  customsValueIncotermsNote: 'general',
  productBarcodeTypeOptions: 'general',
  fabricCompositionPresetOptions: 'material',
  /** Уход / температура — этикетка и маркировка, не паспорт артикула. */
  careWashingClassOptions: 'material',
  temperatureOptions: 'material',
  /** Утеплитель и термо-технологии слоёв — BOM / сырьё. */
  insulationMaterialOptions: 'material',
  thermoTechOptions: 'material',
  /** Класс утепления изделия — конструктивное решение. */
  insulationLevelOptions: 'construction',
  /** Посадка и длина — конструкция / силуэт. */
  clothingFitOptions: 'construction',
  garmentLengthApparelOptions: 'construction',

  // Material (BOM): основной материал, состав и связанные справочники
  mat: 'material',
  composition: 'material',

  // Табель мер — в одной вкладке с конструкцией (отдельная вкладка ТЗ убрана).
  sampleBaseSize: 'construction',

  // Construction (силуэт, длина изделия, узлы)
  len: 'construction',

  // Construction (Block 2 - Construction related)
  silh: 'construction',
  neck: 'construction',
  sleeve: 'construction',
  pocket: 'construction',
  closure: 'construction',
  fit_type: 'construction',
  techPackRef: 'construction',
  waistbandOptionsByCategory: 'construction',
  processingTechOptionsByCategory: 'construction',
  backDetailOptionsByCategory: 'construction',
  collarOptionsByCategory: 'construction',
  combinationOptionsByCategory: 'construction',
  cuffOptionsByCategory: 'construction',
  decorOptionsByCategory: 'construction',
  draperyOptionsByCategory: 'construction',
  fasteningOptionsByCategory: 'construction',
  hardwareOptionsByCategory: 'construction',
  hemFinishOptionsByCategory: 'construction',
  hemTypeOptionsByCategory: 'construction',
  liningOptionsByCategory: 'construction',
  pocketOptions: 'construction',
  reinforcementOptionsByCategory: 'construction',
  seamOptionsByCategory: 'construction',
  shoulderOptionsByCategory: 'construction',
  sleeveOptionsByCategory: 'construction',
  specialNeedsOptions: 'construction',
  stitchingOptionsByCategory: 'construction',
  transformationOptionsByCategory: 'construction',
  waistOptionsByCategory: 'construction',

  // Visuals
  visual_refs: 'visuals',
  sketches: 'visuals',

  // Упаковка / маркировка — в материалах (BOM), отдельная вкладка ТЗ убрана.
  packaging: 'material',
  labeling: 'material',
  barcode: 'material',
  packagingDimensionsClassOptions: 'material',
  articleWeightPackagingClassOptions: 'material',
};

function normalizeCatalogDossierSection(raw: string | undefined): DossierSection | undefined {
  if (!raw) return undefined;
  if (raw === 'measurements') return 'construction';
  if (raw === 'packaging') return 'material';
  if (
    raw === 'general' ||
    raw === 'visuals' ||
    raw === 'material' ||
    raw === 'construction' ||
    raw === 'sample_intake'
  ) {
    return raw;
  }
  return undefined;
}

export function getWorkshopTzSectionForAttribute(attributeId: string, groupId?: string): DossierSection {
  const catAttr = getAttributeById(attributeId);
  /** Только явное поле в JSON; устаревшие measurements/packaging сводим к construction/material. */
  const catalogSection = normalizeCatalogDossierSection(catAttr?.dossierSection);
  const manualOverride = WORKSHOP_TZ_ATTR_SECTION_MAP[attributeId] as DossierSection | undefined;
  return resolveAttributeSection(attributeId, groupId, catalogSection, manualOverride).section;
}

function sectionRowsForCompletion(
  section: DossierSection,
  attributeRows: ResolvedPhase1AttributeRow[]
): ResolvedPhase1AttributeRow[] {
  return attributeRows.filter(
    (r) => getWorkshopTzSectionForAttribute(r.attribute.attributeId, r.group?.groupId) === section
  );
}

/**
 * На шагах ТЗ 2–3 в наборе строк нет атрибутов секции → на этом шаге нечего добивать по полям каталога.
 * Визуал и конструкция (вкл. табель мер) считаются по досье независимо от узкого списка строк на шагах 2–3.
 */
function isNarrowEmptyForNonInitialPhase(
  section: DossierSection,
  sectionRows: ResolvedPhase1AttributeRow[],
  tzPhase: WorkshopTzReadinessPhase
): boolean {
  if (tzPhase === '1') return false;
  if (section === 'visuals' || section === 'construction') return false;
  return sectionRows.length === 0;
}

export function calculateWorkshopTzSectionCompletion(
  section: DossierSection,
  dossier: Workshop2DossierPhase1,
  attributeRows: ResolvedPhase1AttributeRow[],
  opts?: WorkshopTzSectionReadinessOptions
): { done: number; total: number; pct: number } {
  const tzPhase: WorkshopTzReadinessPhase = opts?.tzPhase ?? '1';
  const sectionRows = sectionRowsForCompletion(section, attributeRows);

  if (isNarrowEmptyForNonInitialPhase(section, sectionRows, tzPhase)) {
    return { done: 1, total: 1, pct: 100 };
  }

  if (section === 'general') {
    const total = sectionRows.length + 2;
    const done = sectionRows.filter((r) => {
      const assignment = dossier.assignments.find((a) => a.attributeId === r.attribute.attributeId);
      return assignment && assignment.values.length > 0;
    }).length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  if (section === 'visuals') {
    const attrRows = attributeRows.filter(
      (r) => getWorkshopTzSectionForAttribute(r.attribute.attributeId, r.group?.groupId) === 'visuals'
    );
    const attrDone = attrRows.filter((r) => {
      const assignment = dossier.assignments.find((a) => a.attributeId === r.attribute.attributeId);
      return assignment && assignment.values.length > 0;
    }).length;
    const attrTotal = attrRows.length;
    const baseTotal = 2 + attrTotal;
    let done = attrDone;
    if (dossier.categorySketchImageDataUrl || (dossier.categorySketchAnnotations?.length ?? 0) > 0) done++;
    if ((dossier.visualReferences?.length ?? 0) > 0) done++;
    return { done, total: Math.max(baseTotal, 1), pct: Math.round((done / Math.max(baseTotal, 1)) * 100) };
  }

  if (section === 'material') {
    const total = sectionRows.length || 1;
    const done = sectionRows.filter((r) =>
      dossier.assignments.some((a) => a.attributeId === r.attribute.attributeId)
    ).length;
    return { done, total, pct: Math.round((done / total) * 100) };
  }

  if (section === 'construction') {
    const totalRows = sectionRows.length || 1;
    const doneRows = sectionRows.filter((r) =>
      dossier.assignments.some((a) => a.attributeId === r.attribute.attributeId)
    ).length;
    const dimTotal = 1;
    const dimDone = dossier.sampleBasePerSizeDimensions ? 1 : 0;
    const total = totalRows + dimTotal;
    const done = doneRows + dimDone;
    return { done, total, pct: Math.round((done / Math.max(total, 1)) * 100) };
  }

  const total = sectionRows.length || 1;
  const done = sectionRows.filter((r) =>
    dossier.assignments.some((a) => a.attributeId === r.attribute.attributeId)
  ).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function getWorkshopTzSectionStatusLabel(
  section: DossierSection,
  dossier: Workshop2DossierPhase1,
  attributeRows: ResolvedPhase1AttributeRow[],
  opts?: WorkshopTzSectionReadinessOptions
): 'Пусто' | 'В работе' | 'Заполнено' | 'Проверено' {
  const completion = calculateWorkshopTzSectionCompletion(section, dossier, attributeRows, opts);
  if (section === 'visuals' && dossier.isVerifiedByDesigner) return 'Проверено';
  if (completion.done === 0) return 'Пусто';
  if (completion.pct >= 100) return 'Заполнено';
  return 'В работе';
}
