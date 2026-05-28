import { workshop2CompositionLabelSpecHasExportableContent } from './workshop2-composition-label-spec-utils';
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import { normalizeSketchSheets } from './workshop2-sketch-sheets';
import { buildWorkshop2ProductionPreflightSnapshot } from './workshop2-production-preflight';
import { techPackAttachmentHasZipSourceBytes } from './workshop2-tech-pack-attachment-utils';
import { resolveWorkshop2TechPackHandoffChecklistRow } from './workshop2-tech-pack-handoff-resolve';
import { W2_SECTION_SIGNOFF_PCT_THRESHOLD } from './workshop2-tz-section-signoff-thresholds';
import { isWorkshop2TzSectionFullySignedWithPassport } from './workshop2-tz-signoff-complete';
import {
  cnodeBomIssueMessagesForSectionGate,
  materialWithoutNodeMessagesForGate,
  validateBomConstructionNodeIntegrity,
  validateRegisteredBomRefsHaveConstructionPin,
} from './workshop2-bom-construction-node-integrity';

export type Workshop2TzLifecycleState = 'draft' | 'review' | 'ready' | 'fixed';

export type Workshop2TzGateId =
  | 'sketch'
  | 'zip_bytes'
  | 'composition_label'
  | 'production_preflight'
  | 'section_minimums'
  | 'section_signoffs'
  | 'handoff_marks'
  | 'critical_comments';

export type Workshop2TzGateCommentLike = {
  status?: 'open' | 'resolved';
  severity?: 'normal' | 'critical';
};

export type Workshop2TzGateLine = {
  id: Workshop2TzGateId;
  label: string;
  ok: boolean;
  priority: number;
  detail: string;
};

export type Workshop2TzGateSnapshot = {
  state: Workshop2TzLifecycleState;
  lines: Workshop2TzGateLine[];
  blockers: Workshop2TzGateLine[];
  firstUnmet: Workshop2TzGateLine | null;
  sketchReady: boolean;
  techPackCount: number;
  techPackWithBytes: number;
  sectionSignoffsFull: number;
  hasHandoffMarks: boolean;
  openCriticalCommentsCount: number;
  /** Ошибки минимального стандарта по секциям (блокируют confirm/signoff). */
  sectionMinimumErrors: Record<'general' | 'material' | 'construction', string[]>;
};

export type W2GateSectionFillPct = Partial<
  Record<'general' | 'material' | 'construction' | 'visuals', number>
>;

function hasCanonicalAssignmentValue(
  dossier: Workshop2DossierPhase1,
  attributeId: string
): boolean {
  const a = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === attributeId
  );
  if (!a) return false;
  return a.values.some(
    (v) => (v.displayLabel?.trim() ?? '').length > 0 || (v.text?.trim() ?? '').length > 0
  );
}

function readCanonicalAssignmentTexts(
  dossier: Workshop2DossierPhase1,
  attributeId: string
): { labels: string[]; texts: string[] } {
  const a = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === attributeId
  );
  if (!a) return { labels: [], texts: [] };
  const labels = a.values.map((v) => v.displayLabel?.trim() ?? '').filter(Boolean);
  const texts = a.values.map((v) => v.text?.trim() ?? '').filter(Boolean);
  return { labels, texts };
}

function parseCompositionTotalFromTexts(texts: string[]): number | null {
  if (!texts.length) return null;
  const joined = texts.join(', ');

  const percentMatches = joined.match(/(\d{1,3}(?:[.,]\d+)?)%/g);
  if (percentMatches && percentMatches.length > 0) {
    const total = percentMatches.reduce(
      (sum, m) => sum + Number.parseFloat(m.replace('%', '').replace(',', '.')),
      0
    );
    return Number.isFinite(total) ? Math.round(total) : null;
  }

  const matches = joined.match(/\b\d{1,3}(?:[.,]\d+)?\b/g);
  if (!matches || !matches.length) return null;
  const total = matches.reduce((sum, m) => sum + Number.parseFloat(m.replace(',', '.')), 0);
  return Number.isFinite(total) ? Math.round(total) : null;
}

function buildSectionMinimumErrors(
  dossier: Workshop2DossierPhase1,
  activeCategoryLeafId: string | undefined
): Record<'general' | 'material' | 'construction', string[]> {
  const out: Record<'general' | 'material' | 'construction', string[]> = {
    general: [],
    material: [],
    construction: [],
  };

  if (!hasCanonicalAssignmentValue(dossier, 'sku')) {
    out.general.push('SKU не заполнен.');
  }
  if (!hasCanonicalAssignmentValue(dossier, 'name')) {
    out.general.push('Название модели не заполнено.');
  }
  if (!activeCategoryLeafId) {
    out.general.push('Категория L1/L2/L3 не выбрана.');
  }
  if (!dossier.passportProductionBrief?.targetSampleOrPilotDate) {
    out.general.push('Целевая дата или окно образца не указаны.');
  }
  if (
    !hasCanonicalAssignmentValue(dossier, 'plannedLaunchOptions') &&
    !dossier.passportProductionBrief?.plannedLaunchCustomNote
  ) {
    out.general.push('Тип запуска (сезон/дроп) не указан.');
  }

  const visualRefsCount = dossier.visualReferences?.length ?? 0;
  if (visualRefsCount < 1) {
    out.construction.push('[Визуал] Добавьте минимум 1 референс.');
  }
  if (!hasCanonicalAssignmentValue(dossier, 'primaryColorFamilyOptions')) {
    out.general.push('Выберите основной цвет.');
  }
  if (!hasCanonicalAssignmentValue(dossier, 'colorReferenceSystemOptions')) {
    out.general.push('Укажите референс цвета (Pantone/RAL/код).');
  }

  const matRows = readCanonicalAssignmentTexts(dossier, 'mat');
  const materialsCount = matRows.labels.filter(Boolean).length;
  if (!hasCanonicalAssignmentValue(dossier, 'mat')) {
    out.material.push('В строке BOM не выбран материал.');
  } else if (materialsCount < 2) {
    /** Спека W2: минимум две строки mat (корпус + подклад/утеплитель и т.п.). */
    out.material.push('Добавьте минимум 2 материала.');
  }
  if (!hasCanonicalAssignmentValue(dossier, 'composition')) {
    out.material.push('Состав материала не заполнен.');
  }
  const compositionTexts = readCanonicalAssignmentTexts(dossier, 'composition').texts;
  const compositionTotal = parseCompositionTotalFromTexts(compositionTexts);
  if (compositionTotal != null && compositionTotal !== 100) {
    out.material.push(`Сумма состава должна быть 100% (сейчас ${compositionTotal}%).`);
  }

  const matSketchSymmetry = validateRegisteredBomRefsHaveConstructionPin(
    dossier,
    activeCategoryLeafId
  );
  out.material.push(...materialWithoutNodeMessagesForGate(matSketchSymmetry));

  const closureAttrIds = [
    'closure',
    'closureOptionsByCategory',
    'zipperPlacement',
    'zipperType',
    'fastenerOptionsByCategory',
  ] as const;
  const hasClosure = closureAttrIds.some((id) => hasCanonicalAssignmentValue(dossier, id));
  if (!hasClosure) {
    out.construction.push('Укажите тип застежки.');
  }

  if (
    !hasCanonicalAssignmentValue(dossier, 'silh') &&
    !hasCanonicalAssignmentValue(dossier, 'fit_type')
  ) {
    out.construction.push('Выберите базовый силуэт.');
  }

  const nodeLikeCount = (dossier.categorySketchAnnotations ?? []).filter(
    (a) => (a.linkedAttributeId?.trim() ?? '').length > 0
  ).length;
  if (nodeLikeCount < 3) {
    out.construction.push(
      `Для конструктивных узлов нужно минимум 3 позиции (сейчас ${nodeLikeCount}).`
    );
  }

  const pocketAssignments = dossier.assignments.filter((a) => {
    const id = a.attributeId ?? '';
    return a.kind === 'canonical' && id.length > 0 && /pocket/i.test(id) && a.values.length > 0;
  });
  if (pocketAssignments.length > 0) {
    const hasPocketDescription = pocketAssignments.some((a) =>
      a.values.some((v) => (v.text?.trim() ?? '').length > 0)
    );
    if (!hasPocketDescription) {
      out.construction.push('Для кармана заполните описание и обработку.');
    }
  }

  const cnodeIssues = validateBomConstructionNodeIntegrity(dossier, activeCategoryLeafId);
  out.construction.push(...cnodeBomIssueMessagesForSectionGate(cnodeIssues));

  return out;
}

export function buildWorkshop2TzGateSnapshot(
  dossier: Workshop2DossierPhase1,
  opts?: {
    sessionBlobById?: Record<string, string>;
    commentsById?: Record<string, Workshop2TzGateCommentLike[]>;
    /** Если задано, «4 из 4» по подписям учитывает и порог заполнения секции (как на вкладках ТЗ). */
    sectionFillPct?: W2GateSectionFillPct;
    /** Лист каталога (L3): метки других листов и реестр BOM-ref по артикулю в привязке к конструкции. */
    activeCategoryLeafId?: string;
  }
): Workshop2TzGateSnapshot {
  const att = dossier.techPackAttachments ?? [];
  const sessionBlobById = opts?.sessionBlobById ?? {};
  const techPackWithBytes = att.filter((a) =>
    techPackAttachmentHasZipSourceBytes(a, sessionBlobById)
  ).length;
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  const sketchReady =
    Boolean(dossier.categorySketchImageDataUrl?.trim()) ||
    sheets.some((sh) => Boolean(sh.imageDataUrl?.trim()));

  const sec = dossier.sectionSignoffs;
  const sectionKeys = ['general', 'material', 'construction', 'visuals'] as const;
  let sectionSignoffsFull = 0;
  for (const k of sectionKeys) {
    if (!isWorkshop2TzSectionFullySignedWithPassport(k, sec, dossier)) continue;
    const pct = opts?.sectionFillPct?.[k];
    const min = W2_SECTION_SIGNOFF_PCT_THRESHOLD[k];
    if (pct != null && pct < min) continue;
    sectionSignoffsFull += 1;
  }

  const lastHandoff = resolveWorkshop2TechPackHandoffChecklistRow(dossier.techPackFactoryHandoffs);
  const hasHandoffMarks = Boolean(lastHandoff?.brandDispatchedAt && lastHandoff?.factoryReceivedAt);

  const comments = Object.values(opts?.commentsById ?? {}).flat();
  const openCriticalCommentsCount = comments.filter(
    (c) => (c.status ?? 'open') === 'open' && (c.severity ?? 'normal') === 'critical'
  ).length;

  const compositionLabelOk = workshop2CompositionLabelSpecHasExportableContent(
    dossier.compositionLabelSpec
  );
  const productionPreflight = buildWorkshop2ProductionPreflightSnapshot(dossier);
  const sectionMinimumErrors = buildSectionMinimumErrors(dossier, opts?.activeCategoryLeafId);
  const minimumErrorsList = Object.values(sectionMinimumErrors).flat();
  const sectionMinimumsOk = minimumErrorsList.length === 0;

  const aiWarnings = productionPreflight.issues.filter((i) => i.id.startsWith('ai.'));
  const aiWarningsOk = aiWarnings.length === 0;

  const launchType = dossier.passportProductionBrief?.plannedLaunchType;
  const skipCadForLaunchType = launchType === 'import_rtw' || launchType === 'made_to_order_mto';
  const zipBytesOk = skipCadForLaunchType
    ? true
    : att.length > 0 && techPackWithBytes === att.length;
  const zipBytesDetail = skipCadForLaunchType
    ? 'не требуется для типа запуска'
    : att.length === 0
      ? 'нет файлов CAD'
      : `${techPackWithBytes} из ${att.length} в ZIP`;

  const lines: Workshop2TzGateLine[] = [
    {
      id: 'sketch',
      label: 'Визуал / скетч',
      ok: sketchReady,
      priority: 10,
      detail: sketchReady ? 'канон или лист с изображением' : 'нужен канон или лист с изображением',
    },
    {
      id: 'zip_bytes',
      label: 'Файлы в пакете (ZIP)',
      ok: zipBytesOk,
      priority: 20,
      detail: zipBytesDetail,
    },
    {
      id: 'composition_label',
      label: 'Бирка / маркировка',
      ok: compositionLabelOk,
      priority: 25,
      detail: compositionLabelOk
        ? 'блок «Бирка состава» во вкладке «Материалы» заполнен'
        : 'опишите бирку (габариты, материал, флаги текста из ТЗ или примечания) — «Материалы», якорь «Бирка»',
    },
    {
      id: 'production_preflight',
      label: 'Производственный pre-flight',
      ok: productionPreflight.canSendToFactory && aiWarningsOk,
      priority: 27,
      detail:
        productionPreflight.canSendToFactory && aiWarningsOk
          ? `готово: ${productionPreflight.score}/100`
          : `${productionPreflight.blockers.length} блок., ${productionPreflight.warnings.length} предупр. · score ${productionPreflight.score}/100${!aiWarningsOk ? ` · ${aiWarnings.length} AI-предупр.` : ''}`,
    },
    {
      id: 'section_minimums',
      label: 'Минимальный стандарт ТЗ',
      ok: sectionMinimumsOk,
      priority: 28,
      detail: sectionMinimumsOk
        ? 'обязательный минимум по секциям выполнен'
        : `${minimumErrorsList.length} ошибок минимума`,
    },
    {
      id: 'section_signoffs',
      label: 'Секции ТЗ',
      ok: sectionSignoffsFull >= 4,
      priority: 30,
      detail: `${sectionSignoffsFull} из 4 (визуал, паспорт, материалы, конструкция)`,
    },
    {
      id: 'handoff_marks',
      label: 'Отметки передачи',
      ok: hasHandoffMarks,
      priority: 40,
      detail: hasHandoffMarks
        ? 'бренд: передано; цех: получено'
        : lastHandoff
          ? [
              lastHandoff.brandDispatchedAt ? 'бренд: передано' : 'бренд: не отмечено',
              lastHandoff.factoryReceivedAt ? 'цех: получено' : 'цех: не отмечено',
            ].join('; ')
          : 'нет записи — блок ниже',
    },
    {
      id: 'critical_comments',
      label: 'Критичные комментарии',
      ok: openCriticalCommentsCount === 0,
      priority: 50,
      detail:
        openCriticalCommentsCount === 0
          ? 'открытых критичных нет'
          : `${openCriticalCommentsCount} открытых критичных`,
    },
  ];

  const blockers = lines.filter((l) => !l.ok).sort((a, b) => a.priority - b.priority);
  const firstUnmet = blockers[0] ?? null;

  const lineOk = (id: Workshop2TzGateId) => lines.find((l) => l.id === id)?.ok ?? false;
  const progressGateIds: Workshop2TzGateId[] = [
    'sketch',
    'zip_bytes',
    'composition_label',
    'production_preflight',
    'section_minimums',
    'section_signoffs',
    'handoff_marks',
  ];
  const coreDone = progressGateIds.filter((id) => lineOk(id)).length;
  let state: Workshop2TzLifecycleState = 'draft';
  if (coreDone >= 2) state = 'review';
  if (
    lineOk('sketch') &&
    lineOk('zip_bytes') &&
    lineOk('composition_label') &&
    lineOk('production_preflight') &&
    lineOk('section_minimums') &&
    lineOk('section_signoffs') &&
    lineOk('critical_comments')
  ) {
    state = 'ready';
  }
  if (lines.every((l) => l.ok)) state = 'fixed';

  return {
    state,
    lines,
    blockers,
    firstUnmet,
    sketchReady,
    techPackCount: att.length,
    techPackWithBytes,
    sectionSignoffsFull,
    hasHandoffMarks,
    openCriticalCommentsCount,
    sectionMinimumErrors,
  };
}
