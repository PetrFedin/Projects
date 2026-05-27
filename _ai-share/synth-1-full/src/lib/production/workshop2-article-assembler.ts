/**
 * Сборка артикула Workshop2 по полу (аудитории) + категории L1/L2/L3.
 * Используется при создании и редактировании артикула: досье, шкала, T&A, атрибуты ТЗ, ТН ВЭД.
 */

import {
  findHandbookLeafById,
  resolveHandbookLeafId,
  type HandbookCategoryLeaf,
} from '@/lib/production/category-catalog';
import { workshop2AudienceLabelById } from '@/lib/production/workshop2-hub-card-display';
import { resolvePhase1AttributeRows } from '@/lib/production/attribute-catalog';
import { getResolvedLeafProductionProfile } from '@/lib/production/category-leaf-production';
import {
  defaultSampleSizeScaleIdForWorkshopLine,
  isApparelFootwearAccessoriesCategory,
  isWorkshop2ApparelAudienceId,
  resolveWorkshop2AttributeProfile,
  type Workshop2ApparelDomain,
} from '@/lib/production/workshop2-apparel-audience-domain';
import type {
  Workshop2CategoryBinding,
  Workshop2DossierPhase1,
  Workshop2Phase1AttributeAssignment,
  Workshop2PomTemplateSuggestion,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  applyLifecycleTaTemplateFromLeaf,
  resolveLifecycleTaTemplateIdFromLeaf,
} from '@/lib/production/workshop2-ta-templates';
import {
  defaultWorkshop2Phase1DeferredFieldKeys,
  mergeWorkshop2Phase1DeferredDefaults,
} from '@/lib/production/workshop2-phase1-field-deferral';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { prefillWorkshop2AssignmentsFromRequiredMatrix } from '@/lib/production/workshop2-infopick-matrix-prefill';
import { getWorkshop2PomTemplatesForLeaf } from '@/lib/production/workshop2-reference-seeds';
import { persistWorkshop2AssemblyPreviewMirrorToDossier } from '@/lib/production/workshop2-assembly-preview-dossier-persist';
import { persistWorkshop2ArticleFormMirrorToDossier } from '@/lib/production/workshop2-article-form-dossier-persist';
import type { Workshop2ArticleFormReadiness } from '@/lib/production/workshop2-article-form-readiness';
import {
  syncWorkshop2DossierFromArticleCategory,
  syncWorkshop2DossierFromArticleLine,
} from '@/lib/production/workshop2-article-line-dossier-sync';
import {
  getWorkshopSampleSizeScaleOptions,
  type WorkshopSampleSizeScaleOption,
} from '@/lib/production/workshop-size-handbook';
import type { Workshop2RefTnvedDto } from '@/lib/production/workshop2-references-client';

export type {
  Workshop2CategoryBinding,
  Workshop2PomTemplateSuggestion,
} from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2ArticleAssemblerInput = {
  audienceId: string;
  isUnisex?: boolean;
  categoryLeafId: string;
  l1Name?: string;
  l2Name?: string;
  l3Name?: string;
  sku?: string;
  name?: string;
  /** Подсказка ТН ВЭД из PG API (если уже загружена в форме). */
  tnvedRefItems?: Workshop2RefTnvedDto[] | null;
  updatedBy?: string;
  /** Снимок готовности формы при commit (wave 25 #11). */
  formReadiness?: Workshop2ArticleFormReadiness;
};

export type Workshop2ArticleAssemblyPreview = {
  scaleLabelRu: string;
  phase1AttributeCount: number;
  /** Сумма dimensionLabels по POM-шаблонам листа (честный preview, не «suggested» флаг). */
  pomTemplateRowCount: number;
  isUnisex: boolean;
  taTemplateId: string;
  apparelDomain: Workshop2ApparelDomain;
  audienceForbidden: boolean;
  audienceForbiddenReasonRu?: string;
  oneLineRu: string;
};

export type Workshop2ArticleAssemblyResult = {
  leaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  preview: Workshop2ArticleAssemblyPreview;
  categoryBinding: Workshop2CategoryBinding;
};

/** Предупреждения перед сохранением редактирования (смена категории / аудитории). */
export type Workshop2AssemblyMergeDiff = {
  hasChanges: boolean;
  warningsRu: string[];
  /** Заполненные canonical-атрибуты, не входящие в матрицу нового листа (останутся сиротами). */
  orphanFilledAttributeIds: string[];
};

function cloneDossierForPreview(dossier: Workshop2DossierPhase1): Workshop2DossierPhase1 {
  return JSON.parse(JSON.stringify(dossier)) as Workshop2DossierPhase1;
}

/** Сравнивает текущее досье с результатом merge assembler — для диалога подтверждения (без мутации existing). */
export function previewWorkshop2ArticleAssemblyMerge(
  existing: Workshop2DossierPhase1 | null | undefined,
  input: Workshop2ArticleAssemblerInput
): Workshop2AssemblyMergeDiff {
  const empty: Workshop2AssemblyMergeDiff = {
    hasChanges: false,
    warningsRu: [],
    orphanFilledAttributeIds: [],
  };
  if (!existing) return empty;
  const built = assembleWorkshop2ArticleFromTaxonomy(input);
  if (!built) return empty;

  const warningsRu: string[] = [];
  const oldScale = existing.sampleSizeScaleId;
  const newScale = built.dossier.sampleSizeScaleId;
  if (oldScale !== newScale) {
    const oldLabel = formatWorkshop2AssemblyScaleLabelRu(
      built.leaf,
      existing.selectedAudienceId ?? input.audienceId,
      existing.isUnisex,
      oldScale
    );
    warningsRu.push(`Шкала: ${oldLabel} → ${built.preview.scaleLabelRu}`);
  }

  const newLeafIds = new Set(
    resolvePhase1AttributeRows(built.leaf.leafId).map((r) => r.attribute.attributeId)
  );
  const orphanFilledAttributeIds = (existing.assignments ?? [])
    .filter(
      (a) =>
        a.kind === 'canonical' &&
        a.attributeId &&
        assignmentHasFilledValues(a) &&
        !newLeafIds.has(a.attributeId)
    )
    .map((a) => a.attributeId as string);
  if (orphanFilledAttributeIds.length) {
    const shown = orphanFilledAttributeIds.slice(0, 5).join(', ');
    warningsRu.push(
      `Заполненные атрибуты вне матрицы нового листа (${orphanFilledAttributeIds.length}): ${shown}${
        orphanFilledAttributeIds.length > 5 ? '…' : ''
      } — останутся в досье, но не в основных слотах.`
    );
  }

  const oldAttrIds = new Set(
    (existing.assignments ?? [])
      .filter((a) => a.kind === 'canonical' && a.attributeId)
      .map((a) => a.attributeId as string)
  );
  const scaffolded = scaffoldPhase1AssignmentsForLeaf(
    built.leaf.leafId,
    existing.assignments ?? []
  );
  const newSlots = scaffolded
    .filter((a) => a.attributeId && !oldAttrIds.has(a.attributeId))
    .map((a) => a.attributeId as string);
  if (newSlots.length) {
    const shown = newSlots.slice(0, 5).join(', ');
    warningsRu.push(
      `Новые слоты ТЗ (${newSlots.length}): ${shown}${newSlots.length > 5 ? '…' : ''}`
    );
  }

  const oldTa = existing.passportProductionBrief?.lifecycleTaTemplateId;
  const newTa = built.dossier.passportProductionBrief?.lifecycleTaTemplateId;
  if (oldTa !== newTa && newTa) {
    warningsRu.push(`Шаблон T&A: ${oldTa ?? '—'} → ${newTa}`);
  }

  // Sanity: merge на клоне не должен ломать preview (existing не трогаем).
  const scratch = cloneDossierForPreview(existing);
  mergeAssembledDossierIntoExisting(scratch, built.dossier, built.leaf);

  return {
    hasChanges: warningsRu.length > 0,
    warningsRu,
    orphanFilledAttributeIds,
  };
}

function assignmentHasFilledValues(a: Workshop2Phase1AttributeAssignment): boolean {
  return (a.values ?? []).some((v) => {
    const t = v.text?.trim();
    const d = v.displayLabel?.trim();
    return Boolean(t || d || v.parameterId || v.handbookEntryId);
  });
}

/** Пустой каркас canonical-назначений по листу (без значений). */
export function scaffoldPhase1AssignmentsForLeaf(
  leafId: string,
  existing: Workshop2Phase1AttributeAssignment[] = []
): Workshop2Phase1AttributeAssignment[] {
  const rows = resolvePhase1AttributeRows(leafId);
  const byAttrId = new Map<string, Workshop2Phase1AttributeAssignment>();
  for (const a of existing) {
    if (a.kind === 'canonical' && a.attributeId) {
      byAttrId.set(a.attributeId, a);
    }
  }
  const out: Workshop2Phase1AttributeAssignment[] = [];
  for (const row of rows) {
    const id = row.attribute.attributeId;
    const prev = byAttrId.get(id);
    if (prev) {
      out.push(prev);
      continue;
    }
    out.push({
      assignmentId: `w2-asm-${id}`,
      kind: 'canonical',
      attributeId: id,
      values: [],
    });
  }
  for (const a of existing) {
    if (a.kind !== 'canonical' || !a.attributeId) continue;
    if (rows.some((r) => r.attribute.attributeId === a.attributeId)) continue;
    if (assignmentHasFilledValues(a)) out.push(a);
  }
  return out;
}

function defaultDeferredAttrIdsForDomain(domain: Workshop2ApparelDomain): string[] {
  const base = defaultWorkshop2Phase1DeferredFieldKeys();
  if (domain === 'footwear') {
    return [...new Set([...base, 'w2-construction-cad', 'w2-construction-sketches'])];
  }
  if (domain === 'accessories') {
    return [...new Set([...base, 'w2-construction-sketches'])];
  }
  if (domain === 'other') {
    return [...new Set([...base, 'sampleBaseSize', 'w2-construction-cad'])];
  }
  return base;
}

function resolveTnvedPreliminaryCode(
  leaf: HandbookCategoryLeaf,
  tnvedRefItems?: Workshop2RefTnvedDto[] | null
): string | undefined {
  const fromApi = tnvedRefItems?.find((i) => i.code?.trim())?.code?.trim();
  if (fromApi) return fromApi;
  const profile = getResolvedLeafProductionProfile(leaf);
  const hint = profile.externalClassifiers.tnvedEaEuCodeHints?.[0]?.trim();
  if (hint) return hint;
  const chapter = profile.externalClassifiers.tnvedEaEuChapterHint?.trim();
  return chapter ? `${chapter}000000` : undefined;
}

function applyTnvedPreliminaryToDossier(
  dossier: Workshop2DossierPhase1,
  code: string | undefined
): Workshop2DossierPhase1 {
  if (!code?.trim()) return dossier;
  const attrId = 'customsTnvedPreliminaryCode';
  const idx = dossier.assignments.findIndex((a) => a.attributeId === attrId);
  const nextVal = {
    valueId: `w2-asm-tnved-${Date.now().toString(36)}`,
    valueSource: 'free_text' as const,
    text: code.trim(),
    displayLabel: code.trim(),
  };
  if (idx >= 0) {
    const prev = dossier.assignments[idx]!;
    if (assignmentHasFilledValues(prev)) return dossier;
    const assignments = [...dossier.assignments];
    assignments[idx] = { ...prev, values: [nextVal] };
    return { ...dossier, assignments };
  }
  return {
    ...dossier,
    assignments: [
      ...dossier.assignments,
      {
        assignmentId: `w2-asm-${attrId}`,
        kind: 'canonical',
        attributeId: attrId,
        values: [nextVal],
      },
    ],
  };
}

function shortenScaleLabelRu(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('мужск')) return 'EU муж.';
  if (l.includes('женск')) return 'EU жен.';
  if (l.includes('дет')) return 'EU дет.';
  if (l.includes('унисекс') || l.includes('unisex')) return 'EU унисекс';
  if (l.includes('обув')) return 'обувь';
  const short = label.split('—')[0]?.trim() ?? label;
  return short.length > 28 ? `${short.slice(0, 25)}…` : short;
}

export function formatWorkshop2AssemblyScaleLabelRu(
  leaf: HandbookCategoryLeaf | undefined,
  workshopAudienceId: string,
  isUnisex?: boolean,
  scaleId?: string
): string {
  const effectiveScale =
    scaleId ?? defaultSampleSizeScaleIdForWorkshopLine(leaf, workshopAudienceId, isUnisex);
  if (!effectiveScale) return 'по умолчанию';
  const opts: WorkshopSampleSizeScaleOption[] = getWorkshopSampleSizeScaleOptions(leaf, isUnisex);
  const hit = opts.find((o) => o.key === effectiveScale);
  if (hit) return shortenScaleLabelRu(hit.label);
  if (effectiveScale.includes('men-apparel')) return 'EU муж.';
  if (effectiveScale.includes('women-apparel')) return 'EU жен.';
  if (effectiveScale.includes('unisex')) return 'EU унисекс';
  if (effectiveScale.includes('shoes')) return 'обувь';
  return effectiveScale.split('::').pop() ?? effectiveScale;
}

export function buildWorkshop2ArticleAssemblyPreview(
  input: Workshop2ArticleAssemblerInput,
  leaf: HandbookCategoryLeaf
): Workshop2ArticleAssemblyPreview {
  const audienceId = input.audienceId.trim();
  const isUnisex = input.isUnisex === true;
  const apparelDomain = isApparelFootwearAccessoriesCategory({
    leafId: leaf.leafId,
    l1Name: leaf.l1Name,
  });
  let audienceForbidden = false;
  let audienceForbiddenReasonRu: string | undefined;
  if (apparelDomain) {
    if (audienceId === 'other' || !isWorkshop2ApparelAudienceId(audienceId)) {
      audienceForbidden = true;
      audienceForbiddenReasonRu =
        'Для одежды, обуви и аксессуаров выберите женскую, мужскую или детскую аудиторию — не «Остальное».';
    }
  }
  const profile = resolveWorkshop2AttributeProfile({
    leafId: leaf.leafId,
    l1Name: leaf.l1Name,
    audienceId,
    isUnisex,
  });
  const scaleLabelRu = formatWorkshop2AssemblyScaleLabelRu(leaf, audienceId, isUnisex);
  const phase1AttributeCount = resolvePhase1AttributeRows(leaf.leafId).length;
  const taTemplateId = resolveLifecycleTaTemplateIdFromLeaf(leaf);
  const pomTemplateRowCount = getWorkshop2PomTemplatesForLeaf(leaf.leafId).reduce(
    (acc, tpl) => acc + tpl.dimensionLabels.length,
    0
  );
  const unisexRu = isUnisex ? 'да' : 'нет';
  const pomRu = pomTemplateRowCount > 0 ? ` · POM: ${pomTemplateRowCount} мерок` : '';
  const oneLineRu = `Шкала: ${scaleLabelRu} · Атрибутов в ТЗ: ${phase1AttributeCount}${pomRu} · Унисекс: ${unisexRu}`;
  return {
    scaleLabelRu,
    phase1AttributeCount,
    pomTemplateRowCount,
    isUnisex,
    taTemplateId,
    apparelDomain: profile.domain,
    audienceForbidden,
    audienceForbiddenReasonRu,
    oneLineRu,
  };
}

/**
 * Полная сборка досье и метаданных по таксономии (новый артикул или смена категории).
 */
export function assembleWorkshop2ArticleFromTaxonomy(
  input: Workshop2ArticleAssemblerInput
): Workshop2ArticleAssemblyResult | null {
  const leafId = resolveHandbookLeafId(input.categoryLeafId.trim());
  const leaf = findHandbookLeafById(leafId);
  if (!leaf) return null;

  const audienceId = input.audienceId.trim();
  const isUnisex = input.isUnisex === true;
  const now = new Date().toISOString();
  const by = input.updatedBy?.trim().slice(0, 120);
  const preview = buildWorkshop2ArticleAssemblyPreview(input, leaf);

  const categoryBinding: Workshop2CategoryBinding = {
    categoryLeafId: leaf.leafId,
    l1Name: input.l1Name?.trim() || leaf.l1Name,
    l2Name: input.l2Name?.trim() || leaf.l2Name,
    l3Name: input.l3Name?.trim() || leaf.l3Name,
    pathLabel: leaf.pathLabel,
    boundAt: now,
  };

  let dossier = mergeWorkshop2Phase1DeferredDefaults(emptyWorkshop2DossierPhase1());
  dossier = {
    ...dossier,
    categoryBindings: [categoryBinding],
    selectedAudienceId: audienceId && audienceId !== 'unisex' ? audienceId : undefined,
    isUnisex,
    deferredAttrIds: defaultDeferredAttrIdsForDomain(preview.apparelDomain),
    assignments: scaffoldPhase1AssignmentsForLeaf(leaf.leafId),
    pomTemplateSuggested: {
      leafId: leaf.leafId,
      suggestedAt: now,
      preMergeAvailable: true,
    },
    updatedAt: now,
    ...(by ? { updatedBy: by } : {}),
  };

  const scaleId = defaultSampleSizeScaleIdForWorkshopLine(leaf, audienceId, isUnisex);
  if (scaleId) dossier = { ...dossier, sampleSizeScaleId: scaleId };

  dossier = applyLifecycleTaTemplateFromLeaf(dossier, leaf);
  dossier = syncWorkshop2DossierFromArticleLine(dossier, { audienceId, isUnisex, leaf }, by);

  const tnved = resolveTnvedPreliminaryCode(leaf, input.tnvedRefItems);
  dossier = applyTnvedPreliminaryToDossier(dossier, tnved);

  const prefilled = prefillWorkshop2AssignmentsFromRequiredMatrix(dossier, leaf.leafId);
  dossier = prefilled.dossier;
  dossier = persistWorkshop2AssemblyPreviewMirrorToDossier(dossier, {
    preview,
    categoryLeafId: leaf.leafId,
  });
  dossier = persistWorkshop2ArticleFormMirrorToDossier(dossier, {
    readiness: input.formReadiness ?? {
      state: 'ready',
      canSubmit: true,
      errorCount: 0,
      warningCount: 0,
    },
    sku: input.sku?.trim() ?? '',
    categoryLeafId: leaf.leafId,
  });

  return { leaf, dossier, preview, categoryBinding };
}

/** Краткая подпись для хаба: «Мужчины · Пальто». */
export function buildWorkshop2AssemblySummaryRu(input: {
  audienceId: string;
  categoryLeafId: string;
  l3Name?: string;
}): string {
  const leaf = findHandbookLeafById(input.categoryLeafId.trim());
  const aud =
    workshop2AudienceLabelById(input.audienceId.trim()) ??
    (input.audienceId.trim() ? input.audienceId.trim() : '—');
  const cat =
    input.l3Name?.trim() || leaf?.l3Name?.trim() || leaf?.pathLabel?.split(' › ').pop() || '—';
  return `${aud} · ${cat}`;
}

/**
 * Слияние собранного досье с уже заполненным (редактирование / смена категории без потери значений).
 */
export function mergeAssembledDossierIntoExisting(
  existing: Workshop2DossierPhase1,
  assembled: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf,
  opts?: { clearOrphanAssignments?: boolean; updatedBy?: string }
): Workshop2DossierPhase1 {
  const mergedAssignments = scaffoldPhase1AssignmentsForLeaf(
    leaf.leafId,
    existing.assignments ?? []
  );
  let next: Workshop2DossierPhase1 = {
    ...existing,
    ...assembled,
    assignments: mergedAssignments,
    deferredAttrIds: [
      ...new Set([...(existing.deferredAttrIds ?? []), ...(assembled.deferredAttrIds ?? [])]),
    ],
    fillNowAttrIds: existing.fillNowAttrIds,
    attrComments: existing.attrComments,
    tzSignatoryBindings: existing.tzSignatoryBindings ?? assembled.tzSignatoryBindings,
    taMilestones:
      (existing.taMilestones?.length ?? 0) > 0 ? existing.taMilestones : assembled.taMilestones,
    passportProductionBrief: {
      ...(assembled.passportProductionBrief ?? {}),
      ...(existing.passportProductionBrief ?? {}),
      lifecycleTaTemplateId:
        existing.passportProductionBrief?.lifecycleTaTemplateId ??
        assembled.passportProductionBrief?.lifecycleTaTemplateId,
    },
    productionModel: existing.productionModel ?? assembled.productionModel,
    visualReferences: existing.visualReferences ?? assembled.visualReferences,
    techPackAttachments: existing.techPackAttachments ?? assembled.techPackAttachments,
    brandNotes: existing.brandNotes?.trim() ? existing.brandNotes : assembled.brandNotes,
    pomTemplateSuggested: assembled.pomTemplateSuggested ?? existing.pomTemplateSuggested,
  };

  if (!existing.sampleIntakeRelease?.finalTnvedCode?.trim()) {
    const asmTnved = assembled.assignments.find(
      (a) => a.attributeId === 'customsTnvedPreliminaryCode'
    );
    const exIdx = next.assignments.findIndex(
      (a) => a.attributeId === 'customsTnvedPreliminaryCode'
    );
    if (asmTnved?.values?.length && exIdx < 0) {
      next = applyTnvedPreliminaryToDossier(next, asmTnved.values[0]?.text);
    } else if (exIdx < 0 && asmTnved) {
      next = { ...next, assignments: [...next.assignments, asmTnved] };
    }
  }

  return syncWorkshop2DossierFromArticleCategory(
    next,
    leaf,
    opts?.updatedBy,
    {
      audienceId: assembled.selectedAudienceId,
      isUnisex: assembled.isUnisex,
    },
    { clearOrphanAssignments: opts?.clearOrphanAssignments === true }
  );
}
