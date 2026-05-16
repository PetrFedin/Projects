/**
 * Готовность вкладок ТЗ по набору строк атрибутов текущего шага (фаза 1 / 2 / 3).
 * Строки должны совпадать с `rowsToShow` / `rowsToShowPhase2` / `rowsToShowPhase3` в досье.
 *
 * Секция `assignment` — четыре воротных условия, синхронизированные с чеклистом «Задание» в
 * `Workshop2Phase1DossierPanel`: скетч только с изображением (канон или лист), все вложения CAD
 * с байтами для ZIP (включая session + `techPackZipSessionBlobById`), четыре секции ТЗ с парами
 * подписей по правилам секции (`workshop2-tz-signoff-complete`), передача по правилу последней полной
 * пары (`resolveWorkshop2TechPackHandoffChecklistRow`).
 */

import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import { getAttributeById, type ResolvedPhase1AttributeRow } from './attribute-catalog';
import { compositionLabelWorkflowProgress } from './workshop2-composition-label-from-tz';
import { workshop2CompositionLabelSpecHasExportableContent } from './workshop2-composition-label-spec-utils';
import { type DossierSection, resolveAttributeSection } from './dossier-readiness-engine';
import { normalizeSketchSheets } from './workshop2-sketch-sheets';
import { techPackAttachmentHasZipSourceBytes } from './workshop2-tech-pack-attachment-utils';
import { resolveWorkshop2TechPackHandoffChecklistRow } from './workshop2-tech-pack-handoff-resolve';
import { buildWorkshop2TzGateSnapshot } from './workshop2-tz-gates';
import { phase1FieldSatisfiedForUi } from './w2-dossier-field-presentation';

export { resolveWorkshop2TechPackHandoffChecklistRow };

export type WorkshopTzReadinessPhase = '1' | '2' | '3';

function w2ParseCompositionPctFromTexts(texts: string[]): number | null {
  if (!texts.length) return null;
  const joined = texts.join(', ');
  const matches = joined.match(/(\d{1,3})%/g);
  if (!matches?.length) return null;
  const total = matches.reduce((sum, m) => sum + Number.parseInt(m.replace('%', ''), 10), 0);
  return Number.isFinite(total) ? total : null;
}

export type WorkshopTzSectionReadinessOptions = {
  tzPhase?: WorkshopTzReadinessPhase;
  /**
   * ObjectURL по `attachmentId` для `byteStorage: 'session'` — та же карта, что у блока CAD;
   * передаётся из `Workshop2Phase1DossierPanel` вместе с `techPackSessionBlobById`.
   */
  techPackZipSessionBlobById?: Record<string, string>;
  /**
   * Учитывать коммерческие атрибуты паспорта (таможенная стоимость / Incoterms) в % готовности вкладки
   * «Общее». По умолчанию false — для производственного ТЗ поле не блокирует «Заполнено».
   */
  includeCommerceFieldsInGeneralReadiness?: boolean;
};

/** Атрибуты секции general, не входящие в обязательную готовность без флага `includeCommerceFieldsInGeneralReadiness`. */
export const W2_WORKSHOP_TZ_GENERAL_COMMERCE_OPTIONAL_ATTR_IDS = ['customsValueIncotermsNote'] as const;

/** Ручной маппинг attributeId → секция навигации ТЗ (поверх каталога и groupId). */
export const WORKSHOP_TZ_ATTR_SECTION_MAP: Record<string, DossierSection> = {
  // General (Block 1 + Identity)
  sku: 'general',
  name: 'general',
  audience: 'general',
  l1: 'general',
  l2: 'general',
  l3: 'general',
  collection: 'general',
  season: 'general',
  /** Тег коллекции (SS/FW, капсула, дроп) — маркетинговая метка; не путать с «сезонностью изделия» и датой подборки. */
  collectionSeasonTagOptions: 'general',
  brand: 'general',
  styleOccasionOptions: 'general',
  /** Цвет и палитра — блок паспорта «Образ и цвет» (не карточка каталога артикула). */
  color: 'general',
  primaryColorFamilyOptions: 'general',
  colorReferenceSystemOptions: 'general',
  fabricCompositionDetailClassOptions: 'material',
  countryOfOriginMarketOptions: 'general',
  certificationMarksOptions: 'sample_intake',
  /** Декларация HS и расширенные коды — после образца / приёмка, не карточка артикула ТЗ. */
  customsHsDeclarationOptions: 'sample_intake',
  /** В паспорте ТЗ остаётся ориентир по группе и основной 10-значный код; остальное — приёмка. */
  customsProductGroupOptions: 'general',
  customsTnvedCodePrimary: 'general',
  customsTnvedCodeSecondary: 'sample_intake',
  customsTnvedCodeTertiary: 'sample_intake',
  customsTnvedPreliminaryCode: 'sample_intake',
  customsTnvedShipmentApprovedCode: 'sample_intake',
  customsClassificationRationale: 'sample_intake',
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
  /** Уровень утепления и комбинации слоёв — согласование с BOM / сырьём (та же вкладка «Материалы»). */
  insulationLevelOptions: 'material',
  /** Посадка — конструкция / силуэт. */
  clothingFitOptions: 'construction',

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
  combinationOptionsByCategory: 'material',
  cuffOptionsByCategory: 'construction',
  /** Силуэт поверхности / длина для лекала и образца — «Конструкция», базовый блок сэмпла. */
  decorOptionsByCategory: 'construction',
  draperyOptionsByCategory: 'construction',
  garmentLengthApparelOptions: 'construction',
  patternOptionsByCategory: 'construction',
  fasteningOptionsByCategory: 'construction',
  hardwareOptionsByCategory: 'construction',
  hemFinishOptionsByCategory: 'construction',
  hemTypeOptionsByCategory: 'construction',
  liningOptionsByCategory: 'material',
  pocketOptions: 'construction',
  reinforcementOptionsByCategory: 'construction',
  seamOptionsByCategory: 'construction',
  shoulderOptionsByCategory: 'construction',
  sleeveOptionsByCategory: 'construction',
  specialNeedsOptions: 'construction',
  stitchingOptionsByCategory: 'construction',
  transformationOptionsByCategory: 'construction',
  waistOptionsByCategory: 'construction',

  // Визуальные поля каталога — вместе со скетчем на вкладке «Конструкция» (отдельной «Визуал» нет).
  visual_refs: 'construction',
  sketches: 'construction',

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
  if (raw === 'visuals') return 'construction';
  if (
    raw === 'general' ||
    raw === 'material' ||
    raw === 'construction' ||
    raw === 'assignment' ||
    raw === 'sample_intake'
  ) {
    return raw;
  }
  return undefined;
}

export function getWorkshopTzSectionForAttribute(
  attributeId: string,
  groupId?: string
): DossierSection {
  const manualOverride = WORKSHOP_TZ_ATTR_SECTION_MAP[attributeId] as DossierSection | undefined;
  /** Ручной маппинг ТЗ важнее поля каталога (например tech pack → «Конструкция»). */
  if (manualOverride) {
    return resolveAttributeSection(attributeId, groupId, undefined, manualOverride).section;
  }
  const catAttr = getAttributeById(attributeId);
  const catalogSection = normalizeCatalogDossierSection(catAttr?.dossierSection);
  return resolveAttributeSection(attributeId, groupId, catalogSection, undefined).section;
}

/** Строки каталога, относящиеся к вкладке ТЗ (для экспорта и отчётов). */
export function workshop2TzSectionRowsForCompletion(
  section: DossierSection,
  attributeRows: ResolvedPhase1AttributeRow[]
): ResolvedPhase1AttributeRow[] {
  return attributeRows.filter(
    (r) => getWorkshopTzSectionForAttribute(r.attribute.attributeId, r.group?.groupId) === section
  );
}

export function workshop2TzCatalogRowFilled(
  dossier: Workshop2DossierPhase1,
  row: ResolvedPhase1AttributeRow
): boolean {
  const assignment = dossier.assignments.find((a) => a.attributeId === row.attribute.attributeId);
  return phase1FieldSatisfiedForUi(row.attribute, assignment);
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
  if (
    section === 'visuals' ||
    section === 'construction' ||
    section === 'assignment' ||
    section === 'material'
  ) {
    return false;
  }
  return sectionRows.length === 0;
}

export function calculateWorkshopTzSectionCompletion(
  section: DossierSection,
  dossier: Workshop2DossierPhase1,
  attributeRows: ResolvedPhase1AttributeRow[],
  opts?: WorkshopTzSectionReadinessOptions
): { done: number; total: number; pct: number } {
  const tzPhase: WorkshopTzReadinessPhase = opts?.tzPhase ?? '1';

  if (section === 'assignment') {
    const gate = buildWorkshop2TzGateSnapshot(dossier, {
      sessionBlobById: opts?.techPackZipSessionBlobById,
    });
    const total = 4;
    let done = 0;
    if (gate.sketchReady) done++;
    if (gate.techPackCount > 0 && gate.techPackWithBytes === gate.techPackCount) done++;
    if (gate.sectionSignoffsFull >= 4) done++;
    if (gate.hasHandoffMarks) done++;
    return { done, total, pct: Math.round((done / total) * 100) };
  }

  const sectionRows = workshop2TzSectionRowsForCompletion(section, attributeRows);

  if (isNarrowEmptyForNonInitialPhase(section, sectionRows, tzPhase)) {
    return { done: 1, total: 1, pct: 100 };
  }

  if (section === 'general') {
    const commerceOptional =
      opts?.includeCommerceFieldsInGeneralReadiness === true
        ? new Set<string>()
        : new Set<string>(W2_WORKSHOP_TZ_GENERAL_COMMERCE_OPTIONAL_ATTR_IDS);
    const countedRows = sectionRows.filter((r) => !commerceOptional.has(r.attribute.attributeId));
    const total = countedRows.length + 2;
    const doneRows = countedRows.filter((r) => workshop2TzCatalogRowFilled(dossier, r)).length;
    const doneSku = dossier.assignments.some((a) => a.attributeId === 'sku' && a.values.length > 0)
      ? 1
      : 0;
    const doneName = dossier.assignments.some((a) => a.attributeId === 'name' && a.values.length > 0)
      ? 1
      : 0;
    const done = doneRows + doneSku + doneName;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  if (section === 'visuals') {
    const attrRows = attributeRows.filter(
      (r) =>
        getWorkshopTzSectionForAttribute(r.attribute.attributeId, r.group?.groupId) === 'visuals'
    );
    const attrDone = attrRows.filter((r) => workshop2TzCatalogRowFilled(dossier, r)).length;
    const attrTotal = attrRows.length;
    const baseTotal = 2 + attrTotal;
    let done = attrDone;
    const sheetsNorm = normalizeSketchSheets(dossier.sketchSheets);
    const sketchImageReady =
      Boolean(dossier.categorySketchImageDataUrl?.trim()) ||
      sheetsNorm.some((sh) => Boolean(sh.imageDataUrl?.trim()));
    if (sketchImageReady) done++;
    if ((dossier.visualReferences?.length ?? 0) > 0) done++;
    return {
      done,
      total: Math.max(baseTotal, 1),
      pct: Math.round((done / Math.max(baseTotal, 1)) * 100),
    };
  }

  if (section === 'material') {
    const baseTotal = sectionRows.length || 1;
    const baseDone = sectionRows.filter((r) => workshop2TzCatalogRowFilled(dossier, r)).length;

    const matCanon = dossier.assignments.find((a) => a.kind === 'canonical' && a.attributeId === 'mat');
    const slotMat = Boolean(
      matCanon?.values?.some((v) => (v.displayLabel?.trim() || v.text?.trim() || '').length > 0)
    );

    const compCanon = dossier.assignments.find(
      (a) => a.kind === 'canonical' && a.attributeId === 'composition'
    );
    const compTexts =
      compCanon?.values.map((v) => v.text?.trim()).filter((t): t is string => Boolean(t && t.length)) ??
      [];
    const compTotal = w2ParseCompositionPctFromTexts(compTexts);
    const slotComposition =
      Boolean(compCanon?.values?.length) &&
      (compTotal === null ? compTexts.length > 0 : compTotal === 100);

    const labelWorkflowReady =
      compositionLabelWorkflowProgress(dossier, dossier.compositionLabelSpec).pct >= 100;
    const slotLabel =
      workshop2CompositionLabelSpecHasExportableContent(dossier.compositionLabelSpec) &&
      labelWorkflowReady;

    const hardTotal = 3;
    const hardDone = Number(slotMat) + Number(slotComposition) + Number(slotLabel);
    const total = baseTotal + hardTotal;
    const done = baseDone + hardDone;
    return { done, total, pct: Math.round((done / Math.max(total, 1)) * 100) };
  }

  if (section === 'construction') {
    const totalRows = sectionRows.length || 1;
    const doneRows = sectionRows.filter((r) => workshop2TzCatalogRowFilled(dossier, r)).length;
    const dimTotal = 1;
    const dimDone = dossier.sampleBasePerSizeDimensions ? 1 : 0;
    const total = totalRows + dimTotal;
    const done = doneRows + dimDone;
    return { done, total, pct: Math.round((done / Math.max(total, 1)) * 100) };
  }

  const total = sectionRows.length || 1;
  const done = sectionRows.filter((r) => workshop2TzCatalogRowFilled(dossier, r)).length;
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
