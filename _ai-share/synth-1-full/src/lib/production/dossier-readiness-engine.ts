/**
 * Единый readiness engine для ТЗ · досье.
 *
 * Решает проблему конкурирующих моделей готовности:
 * - вкладки ТЗ: `workshop2-tz-section-readiness` (phase-aware строки)
 * - `summarizeDossier` в Workshop2ArticleWorkspace
 *
 * Теперь оба компонента используют один и тот же расчёт.
 */

import type {
  Workshop2DossierPhase1,
  Workshop2TzSignatoryBindings,
} from './workshop2-dossier-phase1.types';
import type { HandbookCategoryLeaf } from './category-handbook-snapshot-builder';
import { defaultSizeScaleIdForLeaf, resolveAttributeIdsForLeaf } from './attribute-catalog';
import { getWorkshopDimensionLabels } from './workshop-size-handbook';
import {
  workshopTzExtraRowsRequiringTzSignoff,
  workshopTzSignoffRequiredForRole,
} from './workshop2-tz-signatory-options';
import { visualReadinessProgress } from './workshop2-visual-excellence';
import { collectWorkshop2VisualSectionWarnings } from './workshop2-visual-section-warnings';

// ---------------------------------------------------------------------------
// 1. Section truth model
// ---------------------------------------------------------------------------

export type DossierSection =
  | 'general'
  | 'visuals'
  | 'material'
  /** Табель мер / fit (иконки сводки в UI). */
  | 'measurements'
  | 'construction'
  | 'packaging'
  /** Поля таможни / маркировки / финального ТН ВЭД — только на этапе приёмки сэмпла (вкладка Fit), не в навигации ТЗ. */
  | 'sample_intake';

/** Секции с вкладками в редакторе ТЗ (без приёмки сэмпла). Табель мер и упаковка — внутри «Конструкция» и «Материалы». */
export const DOSSIER_TZ_NAV_SECTIONS: readonly DossierSection[] = [
  'general',
  'visuals',
  'material',
  'construction',
] as const;

export const DOSSIER_SECTIONS: readonly DossierSection[] = [
  'general',
  'visuals',
  'material',
  'construction',
] as const;

/**
 * Каноническая роль каждой секции:
 * - sourceFields: поля досье, которыми секция владеет (source-of-truth)
 * - handoffTarget: вкладка(и), получающие данные
 * - handoffSummary: что именно передаётся
 */
export type SectionRole = {
  section: DossierSection;
  label: string;
  owner: string;
  sourceFields: string[];
  handoffTargets: HandoffTarget[];
  summaryFields: string[];
};

export type HandoffTarget = {
  tab: 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock';
  label: string;
  dataContract: string;
};

export const SECTION_ROLES: Record<DossierSection, SectionRole> = {
  general: {
    section: 'general',
    label: 'Паспорт',
    owner: 'Бренд-дизайнер',
    sourceFields: [
      'selectedAudienceId',
      'assignments[sku]',
      'assignments[name]',
      'assignments[l1]',
      'assignments[l2]',
      'assignments[l3]',
      'assignments[color]',
      'assignments[season]',
    ],
    handoffTargets: [],
    summaryFields: ['sku', 'categoryPath', 'audience', 'season'],
  },
  visuals: {
    section: 'visuals',
    label: 'Визуал / Эскиз',
    owner: 'Бренд-дизайнер',
    sourceFields: [
      'categorySketchImageDataUrl',
      'categorySketchAnnotations',
      'subcategorySketchSlots',
      'sketchSheets',
      'visualReferences',
      'brandNotes',
    ],
    handoffTargets: [
      {
        tab: 'fit',
        label: 'Эталон · посадка',
        dataContract:
          'Sketch + annotations + brandNotes → fit reference image + pin-to-fit-issue mapping',
      },
      {
        tab: 'qc',
        label: 'Качество (ОТК)',
        dataContract: 'QC-typed annotations → QC checkpoint zones',
      },
    ],
    summaryFields: ['hasSketch', 'annotationCount', 'referenceCount'],
  },
  material: {
    section: 'material',
    label: 'Материалы (BOM)',
    owner: 'Дизайнер + product developer',
    sourceFields: [
      'assignments[mat]',
      'assignments[composition]',
      'assignments[fabricWeightGsmPresetOptions]',
      'assignments[fabricTextureOptions]',
      'assignments[patternOptionsByCategory]',
      'assignments[insulationMaterialOptions]',
      'assignments[thermoTechOptions]',
      'assignments[packaging]',
      'assignments[labeling]',
      'assignments[barcode]',
      'assignments[packagingDimensionsClassOptions]',
      'assignments[articleWeightPackagingClassOptions]',
      'assignments[careWashingClassOptions]',
      'assignments[temperatureOptions]',
    ],
    handoffTargets: [
      {
        tab: 'supply',
        label: 'Снабжение',
        dataContract:
          'Material assignments (parameterId + pct) → BOM draft lines with qty placeholders',
      },
      {
        tab: 'release',
        label: 'Релиз',
        dataContract: 'Packaging + labeling attrs → release packaging spec',
      },
      {
        tab: 'stock',
        label: 'Склад',
        dataContract: 'Barcode + packaging dimensions → stock receiving card',
      },
    ],
    summaryFields: [
      'primaryMaterial',
      'compositionSummary',
      'bomLineCount',
      'hasBarcode',
      'hasPackaging',
      'hasLabeling',
    ],
<<<<<<< HEAD
=======
  },
  measurements: {
    section: 'measurements',
    label: 'Табель мер',
    owner: 'Технолог',
    sourceFields: ['sampleBasePerSizeDimensions', 'sampleBasePerSizeDimensionRanges'],
    handoffTargets: [],
    summaryFields: ['dimensionCount'],
>>>>>>> recover/cabinet-wip-from-stash
  },
  construction: {
    section: 'construction',
    label: 'Конструкция',
    owner: 'Конструктор / технолог',
    sourceFields: [
      'sampleSizeScaleId',
      'assignments[sampleBaseSize]',
      'sampleBasePerSizeDimensions',
      'sampleBasePerSizePieceQty',
      'sampleBaseDimensionRangeKeys',
      'sampleBasePerSizeDimensionRanges',
      'passportProductionBrief.moqTargetMaxPieces',
      'assignments[clothingFitOptions]',
      'assignments[garmentLengthApparelOptions]',
      'assignments[insulationLevelOptions]',
      'assignments[collarOptionsByCategory]',
      'assignments[sleeveOptionsByCategory]',
      'assignments[fasteningOptionsByCategory]',
      'assignments[pocketOptions]',
      'techPackAttachments',
    ],
    handoffTargets: [
      {
        tab: 'fit',
        label: 'Эталон · посадка',
        dataContract:
          'Size scale + per-size dimensions → fit measurement card for sample verification',
      },
      {
        tab: 'qc',
        label: 'Качество (ОТК)',
        dataContract: 'Dimension ranges (min/max) → QC tolerance table for batch inspection',
      },
      {
        tab: 'plan',
        label: 'Запуск / PO',
        dataContract: 'Tech pack + construction attrs → operation sequence template',
      },
      {
        tab: 'release',
        label: 'Релиз',
        dataContract: 'Construction attrs → production card for factory floor',
      },
    ],
    summaryFields: [
      'techPackCount',
      'constructionAttrCount',
      'sizeScale',
      'sizeCount',
      'dimensionCount',
      'rangeMode',
    ],
  },
  packaging: {
    section: 'packaging',
    label: 'Упаковка / маркировка',
    owner: 'Продакт',
    sourceFields: ['assignments[packaging]', 'assignments[labeling]', 'assignments[barcode]'],
    handoffTargets: [],
    summaryFields: ['hasPackaging', 'hasLabeling'],
  },
  sample_intake: {
    section: 'sample_intake',
    label: 'Приёмка сэмпла · комплаенс',
    owner: 'Бренд / продакт / таможня',
    sourceFields: [
      'sampleProductionChainMode',
      'sampleIntakeRelease.countryOfOriginActual',
      'sampleIntakeRelease.finalTnvedCode',
      'sampleIntakeRelease.declarationOrCertificateRef',
      'sampleIntakeRelease.eanOrBatchCode',
      'sampleIntakeRelease.markingTraceabilityNote',
      'sampleIntakeRelease.technicalRegulationRef',
      'sampleIntakeRelease.okpd2Note',
      'sampleIntakeRelease.sewnInRussiaConfirmed',
    ],
    handoffTargets: [
      {
        tab: 'fit',
        label: 'Эталон · посадка',
        dataContract:
          'Черновое ТЗ + план маркировки → финальные реквизиты отгрузки, ТН ВЭД, происхождение после образца',
      },
    ],
    summaryFields: ['chainMode', 'intakeComplete'],
  },
};

// ---------------------------------------------------------------------------
// 2. Unified readiness calculation
// ---------------------------------------------------------------------------

export type SectionReadiness = {
  section: DossierSection;
  filled: number;
  total: number;
  pct: number;
  status: 'empty' | 'in_progress' | 'complete';
  warnings: string[];
  controlPoints: { label: string; done: boolean }[];
};

export type DossierReadiness = {
  sections: Record<DossierSection, SectionReadiness>;
  overall: {
    pct: number;
    readyForHandoff: boolean;
    missingGates: string[];
  };
  summary: DossierSummary;
};

export type DossierSummary = {
  exists: boolean;
  visualsReady: boolean;
  materialReady: boolean;
  measurementsReady: boolean;
  approvalsReady: boolean;
  warnings: string[];
  readyForSample: boolean;
};

export function calculateDossierReadiness(
  dossier: Workshop2DossierPhase1 | null,
  leaf: HandbookCategoryLeaf | undefined | null,
  filledAttrsBySection?: Record<DossierSection, { filled: number; total: number }>
): DossierReadiness {
  const emptySection = (s: DossierSection): SectionReadiness => ({
    section: s,
    filled: 0,
    total: 1,
    pct: 0,
    status: 'empty',
    warnings: [],
    controlPoints: [],
  });

  if (!dossier) {
    const sections = Object.fromEntries(
      DOSSIER_SECTIONS.map((s) => [s, emptySection(s)])
    ) as Record<DossierSection, SectionReadiness>;
    return {
      sections,
      overall: { pct: 0, readyForHandoff: false, missingGates: ['ТЗ не создано'] },
      summary: {
        exists: false,
        visualsReady: false,
        materialReady: false,
        measurementsReady: false,
        approvalsReady: false,
        warnings: ['ТЗ ещё не сохранено.'],
        readyForSample: false,
      },
    };
  }

  const warnings: string[] = [];
  const expectedScaleId = leaf ? defaultSizeScaleIdForLeaf(leaf) : undefined;
  const dimensionLabels = leaf ? getWorkshopDimensionLabels(leaf) : [];

  // --- visual (те же критерии, что предупреждения вкладки «Визуал») ---
  const visualGateWarnings = collectWorkshop2VisualSectionWarnings(dossier, leaf ?? undefined);
  const visualsReady = visualGateWarnings.length === 0;
  for (const w of visualGateWarnings) {
    warnings.push(w);
  }

  // --- material ---
  const materialReady = dossier.assignments.some(
    (a) => a.attributeId === 'mat' && a.values.length > 0
  );
  if (!materialReady) warnings.push('Не подтвержден основной материал.');

  // --- measurements ---
  const measurementsReady = Boolean(
    dossier.sampleSizeScaleId &&
    dossier.sampleBasePerSizeDimensions &&
    Object.keys(dossier.sampleBasePerSizeDimensions).length > 0
  );
  if (!measurementsReady) warnings.push('Не заполнен размерный блок.');
  if (
    dossier.sampleSizeScaleId &&
    expectedScaleId &&
    dossier.sampleSizeScaleId !== expectedScaleId
  ) {
    warnings.push(`Размерная шкала отличается от ожидаемой (${expectedScaleId}).`);
  }
  if (dimensionLabels.length > 0 && dossier.sampleBasePerSizeDimensions) {
    const missing = new Set<string>();
    for (const sizeRow of Object.values(dossier.sampleBasePerSizeDimensions)) {
      for (const label of dimensionLabels) {
        if (!sizeRow[label]?.trim()) missing.add(label);
      }
    }
    if (missing.size > 0)
      warnings.push(
        `Не заполнены мерки: ${[...missing].slice(0, 3).join(', ')}${missing.size > 3 ? '…' : ''}.`
      );
  }

  // --- approvals (учитываем снятые галочки «подпись на этапе ТЗ» в tzSignatoryBindings) ---
  const tzB = dossier.tzSignatoryBindings;
  const reqD = workshopTzSignoffRequiredForRole(tzB, 'designer');
  const reqT = workshopTzSignoffRequiredForRole(tzB, 'technologist');
  const reqM = workshopTzSignoffRequiredForRole(tzB, 'manager');
  const extrasTz = workshopTzExtraRowsRequiringTzSignoff(tzB);
  const extrasSigned = (ex: (typeof extrasTz)[number]) =>
    Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId]);
  const approvalsReady = Boolean(
    (!reqD || dossier.isVerifiedByDesigner) &&
    (!reqT || dossier.isVerifiedByTechnologist) &&
    (!reqM || dossier.isVerifiedByManager) &&
    extrasTz.every(extrasSigned)
  );
  if (reqD && !dossier.isVerifiedByDesigner) warnings.push('Нет цифровой подписи дизайнера.');
  if (reqT && !dossier.isVerifiedByTechnologist) warnings.push('Нет цифровой подписи технолога.');
  if (reqM && !dossier.isVerifiedByManager) warnings.push('Нет цифровой подписи менеджера.');
  for (const ex of extrasTz) {
    if (!extrasSigned(ex)) {
      warnings.push(`Нет цифровой подписи для роли «${ex.roleTitle?.trim() || 'Роль'}» (этап ТЗ).`);
    }
  }

  const readyForSample =
    visualsReady && materialReady && measurementsReady && approvalsReady && warnings.length === 0;

  // --- per-section readiness from attrs ---
  const sections = {} as Record<DossierSection, SectionReadiness>;
  for (const s of DOSSIER_SECTIONS) {
    const fa = filledAttrsBySection?.[s];
    const filled = fa?.filled ?? 0;
    const total = fa?.total ?? 1;
    const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

    const sectionWarnings: string[] = [];
    if (s === 'visuals') {
      sectionWarnings.push(...visualGateWarnings);
    }
    if (s === 'material' && !materialReady) sectionWarnings.push('Основной материал не указан.');
    if (s === 'construction' && !measurementsReady) sectionWarnings.push('Табель мер не заполнен.');

    const controlPoints: { label: string; done: boolean }[] = [];
    if (s === 'general') {
      controlPoints.push(
        { label: 'Аудитория', done: Boolean(dossier.selectedAudienceId) },
        {
          label: 'SKU',
          done:
            dossier.assignments.some((a) => a.attributeId === 'sku' && a.values.length > 0) || true,
        },
        { label: 'Категория', done: Boolean(leaf) }
      );
    }
    if (s === 'visuals') {
      const vr = visualReadinessProgress(dossier);
      const intentDone = Boolean(
        (dossier.designerIntent?.bullets?.some((b) => b.trim()) ?? false) ||
        (dossier.designerIntent?.mood?.trim() ?? '') ||
        dossier.brandNotes?.trim()
      );
      const phase1Ids = leaf?.leafId
        ? new Set(resolveAttributeIdsForLeaf(leaf.leafId, 1))
        : new Set<string>();
      const assigned = (id: string) =>
        dossier.assignments.some((a) => a.attributeId === id && (a.values?.length ?? 0) > 0);
      controlPoints.push(
        {
          label: 'Эскиз',
          done: Boolean(
            dossier.categorySketchImageDataUrl || dossier.categorySketchAnnotations?.length
          ),
        },
        { label: 'Референсы', done: Boolean(dossier.visualReferences?.length) },
        { label: 'Замысел', done: intentDone }
      );
      if (phase1Ids.has('color')) {
        controlPoints.push({ label: 'Цвет (каталог)', done: assigned('color') });
      }
      if (phase1Ids.has('sil')) {
        controlPoints.push({ label: 'Силуэт (каталог)', done: assigned('sil') });
      }
      controlPoints.push(
        { label: `Чеклист визуала (${vr.done}/${vr.total})`, done: vr.done >= vr.total },
        {
          label: 'Канон: фото + скетч',
          done: Boolean(dossier.canonicalMainPhotoRefId && dossier.canonicalMainSketchTarget),
        }
      );
    }
    if (s === 'material') {
      controlPoints.push({ label: 'Основной материал', done: materialReady });
    }
    if (s === 'construction') {
      controlPoints.push(
        { label: 'Размерная шкала', done: Boolean(dossier.sampleSizeScaleId) },
        { label: 'Табель мер', done: measurementsReady }
      );
    }

    sections[s] = {
      section: s,
      filled,
      total,
      pct,
      status: pct === 0 ? 'empty' : pct >= 100 ? 'complete' : 'in_progress',
      warnings: sectionWarnings,
      controlPoints,
    };
  }

  const overallPct = Math.round(
    DOSSIER_SECTIONS.reduce((sum, s) => sum + sections[s].pct, 0) / DOSSIER_SECTIONS.length
  );

  const missingGates: string[] = [];
  if (!visualsReady) missingGates.push('visuals');
  if (!materialReady) missingGates.push('material');
  if (!measurementsReady) missingGates.push('measurements');
  if (!approvalsReady) missingGates.push('approvals');

  return {
    sections,
    overall: {
      pct: overallPct,
      readyForHandoff: readyForSample,
      missingGates,
    },
    summary: {
      exists: true,
      visualsReady,
      materialReady,
      measurementsReady,
      approvalsReady,
      warnings,
      readyForSample,
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Handoff packet extraction
// ---------------------------------------------------------------------------

export type HandoffPacket = {
  sourceSection: DossierSection;
  targetTab: string;
  data: Record<string, unknown>;
  generatedAt: string;
};

/**
 * Извлекает handoff-пакеты из досье для каждого целевого этапа.
 * Каждый пакет содержит только данные, нужные получателю.
 */
export function extractHandoffPackets(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf | undefined | null
): HandoffPacket[] {
  const now = new Date().toISOString();
  const packets: HandoffPacket[] = [];

  // material → supply: material brief (+ утеплитель / термо-технологии из той же секции)
  const matAssignment = dossier.assignments.find((a) => a.attributeId === 'mat');
  const compAssignment = dossier.assignments.find((a) => a.attributeId === 'composition');
  const insulationMatAssignment = dossier.assignments.find(
    (a) => a.attributeId === 'insulationMaterialOptions'
  );
  const thermoTechAssignment = dossier.assignments.find(
    (a) => a.attributeId === 'thermoTechOptions'
  );
  const mapHandbookParams = (assignment: typeof matAssignment | undefined) =>
    (assignment?.values ?? [])
      .filter((v) => v.valueSource === 'handbook_parameter')
      .map((v) => ({ parameterId: v.parameterId, label: v.displayLabel }));
  const hasMat = (matAssignment?.values.length ?? 0) > 0;
  const hasInsulation = (insulationMatAssignment?.values.length ?? 0) > 0;
  const hasThermo = (thermoTechAssignment?.values.length ?? 0) > 0;
  if (hasMat || hasInsulation || hasThermo) {
    packets.push({
      sourceSection: 'material',
      targetTab: 'supply',
      data: {
        materials: mapHandbookParams(matAssignment),
        composition:
          compAssignment?.values
            .filter((v) => v.valueSource === 'handbook_parameter')
            .map((v) => ({ parameterId: v.parameterId, label: v.displayLabel, pct: v.number })) ??
          [],
        insulationMaterial: mapHandbookParams(insulationMatAssignment),
        thermoTech: mapHandbookParams(thermoTechAssignment),
      },
      generatedAt: now,
    });
  }

  // construction (табель мер) → fit: measurement card
  if (dossier.sampleSizeScaleId && dossier.sampleBasePerSizeDimensions) {
    packets.push({
      sourceSection: 'construction',
      targetTab: 'fit',
      data: {
        sizeScaleId: dossier.sampleSizeScaleId,
        perSizeDimensions: dossier.sampleBasePerSizeDimensions,
        rangeMode: dossier.sampleBaseDimensionRangeMode ?? false,
        ranges: dossier.sampleBasePerSizeDimensionRanges ?? {},
      },
      generatedAt: now,
    });
  }

  // construction (табель мер) → qc: tolerance table
  if (dossier.sampleBasePerSizeDimensionRanges) {
    packets.push({
      sourceSection: 'construction',
      targetTab: 'qc',
      data: {
        toleranceTable: dossier.sampleBasePerSizeDimensionRanges,
        sizeScaleId: dossier.sampleSizeScaleId,
      },
      generatedAt: now,
    });
  }

  // visuals → fit: sketch reference
  if (dossier.categorySketchImageDataUrl || dossier.categorySketchAnnotations?.length) {
    const fitAnnotations = (dossier.categorySketchAnnotations ?? []).filter(
      (a) => a.annotationType === 'fit' || a.stage === 'sample'
    );
    packets.push({
      sourceSection: 'visuals',
      targetTab: 'fit',
      data: {
        sketchImageUrl: dossier.categorySketchImageDataUrl,
        fitAnnotations,
        brandNotes: dossier.brandNotes,
      },
      generatedAt: now,
    });
  }

  // visuals → qc: QC zones
  const qcAnnotations = (dossier.categorySketchAnnotations ?? []).filter(
    (a) => a.annotationType === 'qc' || a.stage === 'qc'
  );
  if (qcAnnotations.length > 0) {
    packets.push({
      sourceSection: 'visuals',
      targetTab: 'qc',
      data: {
        qcZones: qcAnnotations.map((a) => ({
          annotationId: a.annotationId,
          text: a.text,
          priority: a.priority,
          xPct: a.xPct,
          yPct: a.yPct,
        })),
      },
      generatedAt: now,
    });
  }

  // construction → plan: tech pack + attrs
  const techPackCount = dossier.techPackAttachments?.length ?? 0;
  const constructionAttrs = dossier.assignments.filter((a) =>
    [
      'clothingFitOptions',
      'garmentLengthApparelOptions',
      'insulationLevelOptions',
      'collarOptionsByCategory',
      'sleeveOptionsByCategory',
      'fasteningOptionsByCategory',
      'pocketOptions',
      'techPackRef',
    ].includes(a.attributeId ?? '')
  );
  if (techPackCount > 0 || constructionAttrs.length > 0) {
    packets.push({
      sourceSection: 'construction',
      targetTab: 'plan',
      data: {
        techPackFiles: (dossier.techPackAttachments ?? []).map((t) => ({
          fileName: t.fileName,
          revisionNote: t.revisionNote,
        })),
        constructionAttributes: constructionAttrs.map((a) => ({
          attributeId: a.attributeId,
          values: a.values.map((v) => v.displayLabel),
        })),
      },
      generatedAt: now,
    });
  }

  // material (упаковка / маркировка в BOM-вкладке) → release + stock
  const pkgAttrs = dossier.assignments.filter((a) =>
    [
      'packaging',
      'labeling',
      'barcode',
      'packagingDimensionsClassOptions',
      'articleWeightPackagingClassOptions',
      'careWashingClassOptions',
      'temperatureOptions',
    ].includes(a.attributeId ?? '')
  );
  if (pkgAttrs.length > 0) {
    const pkgData = Object.fromEntries(
      pkgAttrs.map((a) => [a.attributeId, a.values.map((v) => v.displayLabel)])
    );
    packets.push({
      sourceSection: 'material',
      targetTab: 'release',
      data: pkgData,
      generatedAt: now,
    });
    packets.push({
      sourceSection: 'material',
      targetTab: 'stock',
      data: pkgData,
      generatedAt: now,
    });
  }

  return packets;
}

// ---------------------------------------------------------------------------
// 4. Sketch link model
// ---------------------------------------------------------------------------

/**
 * Целевая модель связей скетч-аннотации.
 * Аннотация может быть связана одновременно с:
 * - attributeId → поле в досье
 * - taskId → производственная задача
 * - fitIssueId → замечание по посадке (создаётся на этапе fit)
 * - qcCheckpointId → контрольная точка ОТК (создаётся на этапе qc)
 */
export type AnnotationLink = {
  annotationId: string;
  linkedAttributeId?: string;
  linkedTaskId?: string;
  linkedFitIssueId?: string;
  linkedQcCheckpointId?: string;
};

export function resolveAnnotationLinks(dossier: Workshop2DossierPhase1): AnnotationLink[] {
  return (dossier.categorySketchAnnotations ?? []).map((a) => ({
    annotationId: a.annotationId,
    linkedAttributeId: a.linkedAttributeId,
    linkedTaskId: a.linkedTaskId,
    linkedFitIssueId: undefined,
    linkedQcCheckpointId: a.linkedQcZoneId,
  }));
}

// ---------------------------------------------------------------------------
// 5. Dossier lifecycle states
// ---------------------------------------------------------------------------

export type DossierLifecycleState =
  | 'draft'
  | 'handoff_ready'
  | 'sent_to_production'
  | 'accepted'
  | 'rework_requested';

export type DossierRevision = {
  revisionId: string;
  state: DossierLifecycleState;
  changedAt: string;
  changedBy: string;
  comment?: string;
  snapshotHash?: string;
};

export type DossierApprovalRecord = {
  approvalId: string;
  role: 'designer' | 'technologist' | 'brand_manager' | 'production_lead';
  decision: 'approved' | 'rejected' | 'rework';
  at: string;
  by: string;
  comment?: string;
  section?: DossierSection;
};

/**
 * Вычисляет текущее состояние жизненного цикла досье.
 */
export function resolveDossierLifecycleState(
  dossier: Workshop2DossierPhase1,
  readiness: DossierReadiness
): DossierLifecycleState {
  if (!readiness.summary.exists) return 'draft';
  if (!readiness.overall.readyForHandoff) return 'draft';
  if (readiness.summary.approvalsReady) return 'handoff_ready';
  return 'draft';
}

// ---------------------------------------------------------------------------
// 6. Section attribute classification (declarative)
// ---------------------------------------------------------------------------

/**
 * Декларативная привязка атрибута к секции.
 * Приоритет: catalogSection > fallback по groupId.
 */
export type AttributeSectionBinding = {
  attributeId: string;
  section: DossierSection;
  source: 'catalog' | 'group_fallback' | 'manual_override';
};

/** Держать в соответствии с `GROUP_TO_DOSSIER_SECTION` в `attribute-catalog.ts`. */
const GROUP_TO_SECTION_FALLBACK: Record<string, DossierSection> = {
  global: 'general',
  outerwear: 'construction',
  footwear: 'construction',
  dress: 'construction',
  phase2: 'construction',
  phase3: 'material',
  material: 'material',
  construction: 'construction',
  packaging: 'material',
};

/**
 * Определяет секцию атрибута декларативно.
 * Порядок:
 * 1. Явное поле `catalogSection` в instance.json (когда добавим)
 * 2. Маппинг group → section
 * 3. Ручной override (`WORKSHOP_TZ_ATTR_SECTION_MAP` в workshop2-tz-section-readiness)
 */
export function resolveAttributeSection(
  attributeId: string,
  groupId: string | undefined,
  catalogSection?: DossierSection,
  manualOverride?: DossierSection
): AttributeSectionBinding {
  if (catalogSection) {
    return { attributeId, section: catalogSection, source: 'catalog' };
  }
  if (manualOverride) {
    return { attributeId, section: manualOverride, source: 'manual_override' };
  }
  const fallback = groupId ? GROUP_TO_SECTION_FALLBACK[groupId] : undefined;
  return {
    attributeId,
    section: fallback ?? 'general',
    source: 'group_fallback',
  };
}

// ---------------------------------------------------------------------------
// 7. Unified article stage-gate model
// ---------------------------------------------------------------------------

export type ArticleStage =
  | 'overview'
  | 'tz'
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc'
  | 'stock';

export type StageGateStatus =
  | 'not_started'
  | 'in_progress'
  | 'blocked'
  | 'ready_for_review'
  | 'approved'
  | 'handed_off';

export type StageGate = {
  stage: ArticleStage;
  label: string;
  owner: string;
  status: StageGateStatus;
  blocker?: string;
  pct: number;
  gateRequirements: string[];
  metGates: string[];
};

type BundleSnapshot = {
  supply?: {
    lines: { id: string; status: string }[];
  };
  fitGold?: {
    goldApproved: boolean;
    fitComments: { id: string }[];
  };
  planPo?: {
    purchaseOrders: { id: string; status: string }[];
  };
  release?: {
    operations?: { id: string; status: string }[];
  };
  qc?: {
    batches: { id: string; status: string }[];
  };
  stock?: {
    movements: { id: string }[];
  };
};

/**
 * Вычисляет stage gates для всего маршрута артикула.
 * Единый источник правды — заменяет buildRouteStages.
 */
export function calculateArticleStageGates(
  dossierReadiness: DossierReadiness,
  bundle: BundleSnapshot | null
): StageGate[] {
  const ds = dossierReadiness.summary;

  const supplyLines = bundle?.supply?.lines ?? [];
  const allSupplyReady = supplyLines.length > 0 && supplyLines.every((l) => l.status !== 'draft');
  const fitApproved = Boolean(bundle?.fitGold?.goldApproved);
  const hasFitWork = Boolean(bundle?.fitGold?.fitComments.length);
  const poLines = bundle?.planPo?.purchaseOrders ?? [];
  const hasConfirmedPo = poLines.some((po) => po.status === 'confirmed' || po.status === 'closed');
  const operations = bundle?.release?.operations ?? [];
  const completedOps = operations.filter((o) => o.status === 'completed').length;
  const qcBatches = bundle?.qc?.batches ?? [];
  const failedBatches = qcBatches.filter((b) => b.status === 'failed').length;
  const passedBatches = qcBatches.filter((b) => b.status === 'passed').length;
  const hasStock = Boolean(bundle?.stock?.movements.length);

  return [
    {
      stage: 'overview',
      label: 'Обзор',
      owner: 'Бренд / продакт',
      status: ds.readyForSample ? 'ready_for_review' : 'in_progress',
      blocker: ds.warnings[0],
      pct: dossierReadiness.overall.pct,
      gateRequirements: [
        'Все секции ТЗ заполнены',
        'Цифровые подписи: дизайн, технология, менеджер',
      ],
      metGates: ds.readyForSample
        ? ['Все секции ТЗ заполнены', 'Цифровые подписи: дизайн, технология, менеджер']
        : [],
    },
    {
      stage: 'tz',
      label: 'ТЗ · Дизайн + тех',
      owner: 'Дизайн + тех',
      status: ds.readyForSample ? 'approved' : ds.exists ? 'in_progress' : 'not_started',
      blocker: ds.warnings[0],
      pct: dossierReadiness.overall.pct,
      gateRequirements: [
        'Визуал готов',
        'Материалы подтверждены',
        'Табель мер заполнен',
        'Утверждения',
      ],
      metGates: [
        ...(ds.visualsReady ? ['Визуал готов'] : []),
        ...(ds.materialReady ? ['Материалы подтверждены'] : []),
        ...(ds.measurementsReady ? ['Табель мер заполнен'] : []),
        ...(ds.approvalsReady ? ['Утверждения'] : []),
      ],
    },
    {
      stage: 'supply',
      label: 'Снабжение · Закупка',
      owner: 'Закупка',
      status: allSupplyReady ? 'approved' : supplyLines.length > 0 ? 'in_progress' : 'not_started',
      blocker: supplyLines.length === 0 ? 'Нет строк BOM.' : undefined,
      pct:
        supplyLines.length > 0
          ? Math.round(
              (supplyLines.filter((l) => l.status !== 'draft').length / supplyLines.length) * 100
            )
          : 0,
      gateRequirements: ['BOM сформирован', 'Все позиции заказаны/получены'],
      metGates: [
        ...(supplyLines.length > 0 ? ['BOM сформирован'] : []),
        ...(allSupplyReady ? ['Все позиции заказаны/получены'] : []),
      ],
    },
    {
      stage: 'fit',
      label: 'Эталон · посадка',
      owner: 'Конструктор',
      status: fitApproved ? 'approved' : hasFitWork ? 'in_progress' : 'not_started',
      blocker: fitApproved
        ? undefined
        : !hasFitWork
          ? 'Нет комментариев по посадке образца.'
          : 'На складе не завершена приёмка сэмпла в коллекцию (Gold).',
      pct: fitApproved ? 100 : hasFitWork ? 55 : 0,
      gateRequirements: ['Комментарии по посадке', 'Приёмка сэмпла на складе'],
      metGates: [
        ...(hasFitWork ? ['Комментарии по посадке'] : []),
        ...(fitApproved ? ['Приёмка сэмпла на складе'] : []),
      ],
    },
    {
      stage: 'plan',
      label: 'План · PO',
      owner: 'Производство',
      status: hasConfirmedPo ? 'approved' : poLines.length > 0 ? 'in_progress' : 'not_started',
      blocker: poLines.length === 0 ? 'Нет PO.' : undefined,
      pct:
        poLines.length > 0
          ? Math.round(
              (poLines.filter((po) => po.status === 'confirmed' || po.status === 'closed').length /
                poLines.length) *
                100
            )
          : 0,
      gateRequirements: ['PO создан', 'PO подтвержден'],
      metGates: [
        ...(poLines.length > 0 ? ['PO создан'] : []),
        ...(hasConfirmedPo ? ['PO подтвержден'] : []),
      ],
    },
    {
      stage: 'release',
      label: 'Выпуск',
      owner: 'Цех',
      status:
        completedOps > 0 ? 'in_progress' : operations.length > 0 ? 'in_progress' : 'not_started',
      blocker: operations.length === 0 ? 'Нет техопераций.' : undefined,
      pct: operations.length > 0 ? Math.round((completedOps / operations.length) * 100) : 0,
      gateRequirements: ['Техоперации запущены', 'Все операции завершены'],
      metGates: [
        ...(operations.length > 0 ? ['Техоперации запущены'] : []),
        ...(completedOps === operations.length && operations.length > 0
          ? ['Все операции завершены']
          : []),
      ],
    },
    {
      stage: 'qc',
      label: 'ОТК',
      owner: 'QC',
      status:
        failedBatches > 0
          ? 'blocked'
          : qcBatches.length > 0
            ? passedBatches === qcBatches.length
              ? 'approved'
              : 'in_progress'
            : 'not_started',
      blocker: failedBatches > 0 ? `${failedBatches} партий не прошли проверку.` : undefined,
      pct: qcBatches.length > 0 ? Math.round((passedBatches / qcBatches.length) * 100) : 0,
      gateRequirements: ['Партии на проверке', 'Все партии приняты'],
      metGates: [
        ...(qcBatches.length > 0 ? ['Партии на проверке'] : []),
        ...(passedBatches === qcBatches.length && qcBatches.length > 0
          ? ['Все партии приняты']
          : []),
      ],
    },
    {
      stage: 'stock',
      label: 'Склад',
      owner: 'Логистика',
      status: hasStock ? 'approved' : 'not_started',
      pct: hasStock ? 100 : 0,
      gateRequirements: ['Товар принят на склад'],
      metGates: hasStock ? ['Товар принят на склад'] : [],
    },
  ];
}
