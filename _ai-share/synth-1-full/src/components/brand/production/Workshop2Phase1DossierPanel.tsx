'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import * as LucideIcons from 'lucide-react';
import {
  attributeInWorkflowPhase,
  defaultSizeScaleIdForLeaf,
  getAttributeById,
  getSortedGroups,
  getWorkshop2ConstructionTabMergedGroupIds,
  resolveAttributeIdsForLeaf,
  resolveEffectiveParametersForLeaf,
  resolvePhase1AttributeRows,
  resolvePhase2OnlyAttributeRows,
  resolvePhase3OnlyAttributeRows,
  resolveSampleBaseSizeParametersForLeaf,
  workshop2ConstructionMergedStackTitle,
  type ResolvedPhase1AttributeRow,
} from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import {
  loadW2FieldDeferralSet,
  phase1FieldSatisfiedForUi,
  saveW2FieldDeferralSet,
} from '@/lib/production/w2-dossier-field-presentation';
import { partitionHandbookAndFree } from '@/lib/production/workshop2-phase1-attribute-partition';
import { extractHex6 } from '@/lib/production/workshop2-passport-color-hex';
import { normalizeRuColorMatch } from '@/lib/production/workshop2-passport-color-normalize';
import { resolvedHandbookDisplayLabel } from '@/lib/production/workshop2-resolved-handbook-display-label';
import {
  getSuggestedDimensionCmForParameterId,
  getWorkshopDimensionLabels,
  getWorkshopSampleSizeScaleOptions,
} from '@/lib/production/workshop-size-handbook';
import { getSuggestedBagDimensionsForBagTypeParameterId } from '@/lib/production/workshop-bag-type-defaults';
import {
  cellLooksLikeNumericRange,
  formatRangeToDimensionCell,
  midpointNominalSuggestion,
  parseDimensionValueToRange,
} from '@/lib/production/workshop-dimension-range';
import {
  formatWorkshop2InternalArticleCodePlaceholder,
  isWorkshop2InternalArticleCodeValid,
  type Workshop2ArticleLinePatch,
} from '@/lib/production/local-collection-inventory';
import {
  findHandbookLeafById,
  getHandbookAudiencesWorkshop2,
  getHandbookCategoryLeaves,
  handbookL1OptionsForAudience,
  handbookL2OptionsForAudience,
  handbookL3OptionsForAudience,
  handbookLeafIdFromL123,
  resolveWorkshop2EffectiveAudienceId,
} from '@/lib/production/category-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import {
  buildWorkshop2VisualGateItems,
  collectWorkshop2VisualSectionWarnings,
  W2_VISUAL_SUBPAGE_ANCHORS,
} from '@/lib/production/workshop2-visual-section-warnings';
import {
  emptyWorkshop2DossierPhase1,
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildBomLinePickOptions } from '@/lib/production/workshop2-collection-dossier-analytics';
import {
  workshopTzAssigneeBelongsToBrandOrg,
  workshopTzAssigneeOrganizationName,
  workshopTzExtraRowsRequiringTzSignoff,
  workshopTzParticipatesOnStage,
  workshopTzSignerAllowed,
  workshopTzSignoffRequiredForRole,
} from '@/lib/production/workshop2-tz-signatory-options';
import {
  w2TzDossierSectionShowsExtraSignerRow,
  w2TzDossierSectionShowsSignerBaseRole,
} from '@/lib/production/w2-tz-section-signer-filter';
import { BRANCH_CATALOG_SLOT_ROLE } from '@/lib/production/workshop2-tz-subcategory-sketches';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1AttributeAssignment,
  Workshop2Phase1AttributeValue,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1DimensionRangeCell,
  Workshop2Phase1VisualReference,
  Workshop2DossierSignoffMeta,
  Workshop2PassportDeadlineCriticality,
  Workshop2PassportPlannedLaunchType,
  Workshop2SketchLabelsSnapshot,
  Workshop2TzActionLogEntry,
  Workshop2TzActionLogPayload,
  Workshop2TzPerRoleStageFlags,
  Workshop2TzSignoffSectionKey,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { VisualCatalogSketchLinkRow } from '@/lib/production/workshop2-sketch-tz-matrix';
import {
  buildMaterialBomHubModel,
  buildMaterialCategoryNotes,
  W2_MATERIAL_SUBPAGE_ANCHORS,
} from '@/lib/production/workshop2-material-bom-check';
import {
  buildMaterialSketchBomStrip,
  W2_VISUALS_SKETCH_ANCHOR_ID,
} from '@/lib/production/workshop2-material-bom-sketch-strip';
import type { MaterialBomExportInput } from '@/lib/production/workshop2-material-bom-export';
import {
  matCompositionPctState,
  parseMatRowsFromDossier,
  type MatPctRow,
} from '@/lib/production/workshop2-material-mat-rows';
import {
  buildPassportHubModel,
  partitionGeneralPassportExtras,
  partitionGeneralPassportRows,
  W2_PASSPORT_SUBPAGE_ANCHORS,
} from '@/lib/production/workshop2-passport-check';
import {
  W2_CONSTRUCTION_SUBPAGE_ANCHORS,
  W2_TZ_SECTION_STAGE_DOM_ID,
} from '@/lib/production/workshop2-construction-dossier-anchors';
import { useAuth } from '@/providers/auth-provider';
import {
  flushW2DossierMetricsToServer,
  warmupW2MetricsStamp,
  type Workshop2DossierMetricsFlushContext,
} from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  formatW2DossierMetricsFooterLine,
  maybeRecordW2PassportRoute100,
  maybeRecordW2TzSampleReady,
  maybeRecordW2VisualGateCleared,
  recordW2DossierAbandonIfNoSaveYet,
  recordW2DossierPersistSuccess,
  touchW2DossierSessionOpenedAt,
} from '@/lib/production/workshop2-dossier-session-metrics';
import { dossierUpdatedAfterLatestTzSignoff } from '@/lib/production/workshop2-tz-signoff-audit';
import { workshop2SketchTechnologistGaps } from '@/lib/production/workshop2-sketch-technologist-gaps';
import { ROUTES } from '@/lib/routes';
import {
  W2_ARTICLE_SECTION_DOM,
  WORKSHOP2_ARTICLE_PANE_PARAM,
  workshop2ArticleHref,
  workshop2ArticleUrlSegment,
} from '@/lib/production/workshop2-url';
import { useWorkshop2DossierView } from '@/components/brand/production/workshop2-dossier-view-context';
import {
  defaultSketchExportSurfaceForDossierView,
  isWorkshop2DossierViewPrimarySection,
  workshop2DossierViewUiCaps,
  WORKSHOP2_DOSSIER_VIEW_OPTIONS,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import {
  filterPassportCriticalAuditLines,
  getVisualHandoffTargetsForProfile,
  validateSketchPinRequiredLinks,
  W2_NINE_GAP_CONSTRUCTION_ROADMAP,
  W2_SKETCH_PIN_TYPE_PRESETS,
} from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import { summarizeWorkshop2PersistDiff } from '@/lib/production/workshop2-dossier-activity-log';
import { diffMasterSketchAnnotations } from '@/lib/production/sketch-labels-diff';
import {
  computeWorkshop2TzSignatureDigest,
  WORKSHOP2_TZ_DIGITAL_SIGNOFF_DEFAULT_CAPABILITIES,
  type Workshop2TzDigitalSignoffCapabilities,
} from '@/lib/production/workshop2-tz-digital-signoff';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { useToast } from '@/hooks/use-toast';
import { useRbac } from '@/hooks/useRbac';
import { CategorySketchAnnotator } from '@/components/brand/production/CategorySketchAnnotator';
import { SubcategorySketchTasksRibbon } from '@/components/brand/production/SubcategorySketchTasksRibbon';
import {
  createEmptySketchSheet,
  DEFAULT_MASTER_PIN_SNIPPETS,
  MAX_SKETCH_SHEETS,
  normalizeSketchSheets,
  SKETCH_SHEET_VIEW_LABELS,
} from '@/lib/production/workshop2-sketch-sheets';
import { CategorySketchSheetsBlock } from '@/components/brand/production/CategorySketchSheetsBlock';
import { CategorySubcategorySketchesTzBlock } from '@/components/brand/production/CategorySubcategorySketchesTzBlock';
import { Workshop2DossierNavigator as DossierNavigator } from '@/components/brand/production/Workshop2DossierNavigator';
import {
  WORKSHOP_FIELD_LABEL_CLASS,
  WorkshopAttributeHintIcon,
  WorkshopInlineHintIcon,
  WorkshopLabelWithHint,
} from '@/components/brand/production/WorkshopFieldHints';
import {
  AttributeRowEditor,
  WorkshopPassportColorBundle,
} from '@/components/brand/production/Workshop2PassportAttributeRowEditors';
import { Workshop2SampleBaseSizeBlock as SampleBaseSizeBlock } from '@/components/brand/production/Workshop2SampleBaseSizeBlock';
import { Workshop2HandbookMultiSelectPopover as HandbookMultiSelectPopover } from '@/components/brand/production/Workshop2HandbookMultiSelectPopover';
import { Workshop2MaterialCompositionBlock as MaterialCompositionBlock } from '@/components/brand/production/Workshop2MaterialCompositionBlock';
import { SketchViewModeToggle } from '@/components/brand/production/SketchViewModeToggle';
import { Workshop2NineGapRelatedFooterShell as WorkshopNineGapRelatedFooterShell } from '@/components/brand/production/Workshop2NineGapRelatedFooterShell';
import { Workshop2SectionStageBoard as SectionStageBoard } from '@/components/brand/production/Workshop2SectionStageBoard';
import { Workshop2TechPackAttachmentsBlock as TechPackAttachmentsBlock } from '@/components/brand/production/Workshop2TechPackAttachmentsBlock';
import { Workshop2TzDigitalSignoffRow } from '@/components/brand/production/Workshop2TzDigitalSignoffRow';
import { Workshop2VisualsExcellenceBlock } from '@/components/brand/production/Workshop2VisualsExcellenceBlock';
import { Workshop2MaterialHubPanel } from '@/components/brand/production/Workshop2MaterialHubPanel';
import { Workshop2NineGapBacklogStrip } from '@/components/brand/production/Workshop2NineGapBacklogStrip';
import { Workshop2DossierSupplyChainDraftsPanel } from '@/components/brand/production/Workshop2DossierSupplyChainDraftsPanel';
import { Workshop2VisualsDossierSection } from '@/components/brand/production/Workshop2VisualsDossierSection';
import { Workshop2HandbookCheckReportBlock } from '@/components/brand/production/Workshop2HandbookCheckReportBlock';
import { Workshop2MaterialTzStickySubnav } from '@/components/brand/production/Workshop2MaterialTzStickySubnav';
import { Workshop2MeasurementsTableHub } from '@/components/brand/production/Workshop2MeasurementsTableHub';
import {
  isSketchFloorInSearch,
  replaceSketchFloorInUrl,
  SKETCH_FLOOR_QUERY_PARAM,
} from '@/lib/production/sketch-floor-url';
import { isSketchFloorOnlyRole } from '@/lib/production/sketch-floor-rbac';

/** Метка скетча «этап маршрута» → вкладка артикула в воркспейсе. */
const SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB: Record<
  Workshop2TzSignoffStageId,
  'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock' | 'overview'
> = {
  tz: 'tz',
  sample: 'fit',
  supply: 'supply',
  fit: 'fit',
  plan: 'plan',
  release: 'release',
  qc: 'qc',
};
import {
  appendOrgSketchPinTemplate,
  readOrgSketchPinTemplatesSync,
  removeOrgSketchPinTemplate,
} from '@/lib/production/sketch-org-templates-repository';
import {
  appendSketchPinTemplate,
  applySketchPinTemplateToMaster,
  createSketchPinTemplateRecord,
  removeSketchPinTemplate,
  resolveSketchPinTemplatePick,
} from '@/lib/production/workshop2-sketch-pin-templates';
import {
  appendSketchLabelSnapshot,
  restoreSketchLabelsSnapshot,
} from '@/lib/production/workshop2-sketch-snapshots';
import { appendCategorySketchRevisionSnapshot } from '@/lib/production/sketch-plm-revisions';
import { bomRefsUnionFromSketchSurfaces } from '@/lib/production/sketch-bom-integrity';
import { sketchBomRefsMissingFromMatLines } from '@/lib/production/workshop2-mat-sketch-bom-crosscheck';
import { mergeSketchMasterAuditLog } from '@/lib/production/sketch-annotation-audit';
import {
  exportSketchVisualBundle,
  exportTzHandoffPdfOnly,
} from '@/lib/production/sketch-visual-bundle-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type DossierSection } from '@/lib/production/dossier-readiness-engine';
import {
  calculateWorkshopTzSectionCompletion,
  getWorkshopTzSectionForAttribute as getSectionForAttr,
  getWorkshopTzSectionStatusLabel,
} from '@/lib/production/workshop2-tz-section-readiness';

const WORKSHOP_ATTR_GROUP_UI_LS_KEY = 'w2-dossier-attr-group-ui-v2';
const WORKSHOP_BRANCH_LEVELS_DETAILS_LS_KEY = 'w2-dossier-branch-levels-details-open';
const WORKSHOP_ATTR_GROUP_UI_LS_LEGACY = 'w2-dossier-collapsed-attr-groups-v1';

function persistWorkshopAttrGroupUi(pinned: Set<string>, collapsed: Set<string>) {
  const collapsedPersisted = [...collapsed].filter((k) => pinned.has(k));
  try {
    localStorage.setItem(
      WORKSHOP_ATTR_GROUP_UI_LS_KEY,
      JSON.stringify({ pinned: [...pinned], collapsed: collapsedPersisted })
    );
  } catch {
    /* ignore */
  }
}

function loadWorkshopAttrGroupUi(): { pinned: Set<string>; collapsed: Set<string> } {
  try {
    const v2 = localStorage.getItem(WORKSHOP_ATTR_GROUP_UI_LS_KEY);
    if (v2) {
      const o = JSON.parse(v2) as { pinned?: unknown; collapsed?: unknown };
      const pinned =
        Array.isArray(o.pinned) && o.pinned.every((x) => typeof x === 'string')
          ? (o.pinned as string[])
          : [];
      const collapsed =
        Array.isArray(o.collapsed) && o.collapsed.every((x) => typeof x === 'string')
          ? (o.collapsed as string[])
          : [];
      return { pinned: new Set(pinned), collapsed: new Set(collapsed) };
    }
    const leg = localStorage.getItem(WORKSHOP_ATTR_GROUP_UI_LS_LEGACY);
    if (leg) {
      const arr = JSON.parse(leg) as unknown;
      if (Array.isArray(arr) && arr.every((x) => typeof x === 'string')) {
        const s = arr as string[];
        return { pinned: new Set(s), collapsed: new Set(s) };
      }
    }
  } catch {
    /* ignore */
  }
  return { pinned: new Set(), collapsed: new Set() };
}

/** Две одинаковые кнопки-справки: «Панель скетча» и «Скетч / узлы ветки». */
const SKETCH_PHASE1_HELP_BUTTON_CLASS =
  'inline-flex min-h-7 items-center gap-1.5 rounded-md border border-border-default bg-white px-2 py-0.5 text-left shadow-sm hover:bg-bg-surface2';

const WORKSHOP_REQUIRED_BADGE_TODO_CLASS =
  'text-[9px] font-semibold text-orange-900 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5';
const WORKSHOP_REQUIRED_BADGE_DONE_CLASS =
  'text-[9px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5';
const WORKSHOP_REQUIRED_BADGE_DEFER_CLASS =
  'text-[9px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5';

/** Подписи групп каталога, которые в UI совпадают с бейджем «Обязательный» (как на шаге 1). */
const WORKSHOP_GROUP_LABEL_AMBER = new Set(['Обязательно', 'Фаза 3 (не в форме фазы 1)']);

/** Секция «Материалы»: состав + атрибуты каталога без второй полосы «МАТЕРИАЛЫ». */
const WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL = 'Верхняя одежда · материалы';

/** Подсказки к полям вынесены в единый блок у состава — не дублируем под каждым атрибутом. */
const MATERIAL_GUIDE_ATTR_IDS = new Set([
  'fabricWeightGsmPresetOptions',
  'insulationMaterialOptions',
  'insulationLevelOptions',
  'thermoTechOptions',
]);

const WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_GROUP_IDS = new Set(['outerwear', 'material']);

const WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_LABELS = new Set(['Верхняя одежда', 'Материалы']);

/** Служебный ключ одной колонки без подзаголовков групп каталога (блок «Визуальные оси»). */
const WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY = '__w2_flat_catalog__';

/** Якоря хаба и полей «Материалы / BOM» (свёрнуты до блока снабжения — раскрываем обёртку при переходе). */
const W2_MATERIAL_PRE_SUPPLY_COLLAPSE_SCROLL_IDS: ReadonlySet<string> = new Set([
  W2_MATERIAL_SUBPAGE_ANCHORS.hub,
  W2_MATERIAL_SUBPAGE_ANCHORS.fields,
  W2_MATERIAL_SUBPAGE_ANCHORS.mat,
  W2_MATERIAL_SUBPAGE_ANCHORS.catalog,
  W2_MATERIAL_SUBPAGE_ANCHORS.composition,
  W2_MATERIAL_SUBPAGE_ANCHORS.compliance,
  W2_MATERIAL_SUBPAGE_ANCHORS.bomNorms,
  W2_MATERIAL_SUBPAGE_ANCHORS.supplyRoute,
  W2_MATERIAL_SUBPAGE_ANCHORS.costingHints,
  W2_MATERIAL_SUBPAGE_ANCHORS.factoryExport,
  W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts,
  W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsDelta,
  W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsAlts,
  W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsCosting,
  W2_MATERIAL_SUBPAGE_ANCHORS.matSketchGap,
]);

/**
 * Заголовок группы атрибутов внутри секции досье (полоска с подписью).
 * В секции «Паспорт» для групп каталога «Паспорт» / «Свойства» заголовок не показываем — см. `hidePassportCatalogGroupHeader`.
 */
function workshopGroupSectionTitle(catalogGroupLabel: string): string {
  if (catalogGroupLabel === 'Паспорт') {
    return 'Доп. атрибуты';
  }
  return catalogGroupLabel;
}

/** Если есть связка mat + composition в BOM, пресеты/формат состава из каталога только дублируют таблицу. */
const REDUNDANT_WHEN_MAT_COMPOSITION_LINKED = new Set([
  'fabricCompositionPresetOptions',
  'fabricCompositionDetailClassOptions',
]);

function formatDossierSignoffRu(
  meta: Workshop2DossierSignoffMeta | { by: string; at: string } | undefined
): string | null {
  if (!meta?.at) return null;
  try {
    const base = `${meta.by} · ${new Date(meta.at).toLocaleString('ru-RU')}`;
    const dig =
      'signatureDigest' in meta && meta.signatureDigest ? ` · ЦП ${meta.signatureDigest}` : '';
    return base + dig;
  } catch {
    return meta.by;
  }
}

function newUuid(): string {
  return globalThis.crypto.randomUUID();
}

function findCanonicalIndex(dossier: Workshop2DossierPhase1, attributeId: string): number {
  return dossier.assignments.findIndex(
    (a) => a.kind === 'canonical' && a.attributeId === attributeId
  );
}

function sumSampleBasePieceQtyForPids(
  qty: Record<string, number> | undefined,
  pids: Set<string>
): number {
  if (!qty) return 0;
  let s = 0;
  for (const pid of pids) {
    const v = qty[pid];
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) s += Math.floor(v);
  }
  return s;
}

/** Уменьшает количества по размерам так, чтобы сумма не превышала cap (приоритет — сохранить большие строки). */
function clampSampleBasePieceQtyToCap(
  qty: Record<string, number> | undefined,
  cap: number
): Record<string, number> | undefined {
  if (!qty || !Object.keys(qty).length) return undefined;
  const capFloor = Math.max(0, Math.floor(cap));
  const entries = Object.entries(qty)
    .map(
      ([k, v]) =>
        [k, Math.max(0, Math.floor(typeof v === 'number' && Number.isFinite(v) ? v : 0))] as const
    )
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  let left = capFloor;
  const nq: Record<string, number> = {};
  for (const [k, val] of entries) {
    const assign = Math.min(val, left);
    if (assign > 0) nq[k] = assign;
    left -= assign;
    if (left <= 0) break;
  }
  return Object.keys(nq).length ? nq : undefined;
}

function normalizeSampleCountValue(v: number | undefined): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? Math.floor(v) : 1;
  return Math.max(1, n);
}

function normalizeDossierSampleCount(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  const normalized = normalizeSampleCountValue(dossier.passportProductionBrief?.moqTargetMaxPieces);
  if (dossier.passportProductionBrief?.moqTargetMaxPieces === normalized) return dossier;
  return {
    ...dossier,
    passportProductionBrief: {
      ...(dossier.passportProductionBrief ?? {}),
      moqTargetMaxPieces: normalized,
    },
  };
}

function upsertCanonicalMultiHandbookAndFree(
  dossier: Workshop2DossierPhase1,
  attributeId: string,
  handbookParts: { parameterId: string; displayLabel: string }[],
  freeTextRaw: string
): Workshop2DossierPhase1 {
  const idx = findCanonicalIndex(dossier, attributeId);
  const prev = idx >= 0 ? dossier.assignments[idx]! : null;
  const values: Workshop2Phase1AttributeValue[] = [];
  const seen = new Set<string>();
  for (const h of handbookParts) {
    const pid = h.parameterId?.trim();
    if (!pid || seen.has(pid)) continue;
    seen.add(pid);
    values.push({
      valueId: newUuid(),
      valueSource: 'handbook_parameter',
      parameterId: pid,
      displayLabel: (h.displayLabel || pid).slice(0, 512),
    });
  }
  const t = freeTextRaw.trim();
  if (t) {
    values.push({
      valueId: newUuid(),
      valueSource: 'free_text',
      text: t,
      displayLabel: t.slice(0, 512),
    });
  }
  if (values.length === 0) {
    if (idx < 0) return dossier;
    return {
      ...dossier,
      assignments: dossier.assignments.filter((_, i) => i !== idx),
    };
  }
  const nextAssign: Workshop2Phase1AttributeAssignment = {
    assignmentId: prev?.assignmentId ?? newUuid(),
    kind: 'canonical',
    attributeId,
    values,
  };
  const assignments = [...dossier.assignments];
  if (idx >= 0) assignments[idx] = nextAssign;
  else assignments.push(nextAssign);
  return { ...dossier, assignments };
}

/** Синхронизация выбранных размеров и обрезка табеля/кол-ва по строкам, которых больше нет в справочнике. */
function syncSampleBaseSizePartsAndPruneDims(
  prev: Workshop2DossierPhase1,
  parts: { parameterId: string; displayLabel: string }[],
  ftRaw: string
): Workshop2DossierPhase1 {
  const allow = new Set(parts.map((p) => p.parameterId));
  const merged = upsertCanonicalMultiHandbookAndFree(prev, 'sampleBaseSize', parts, ftRaw);
  const cur = merged.sampleBasePerSizeDimensions;
  const curRanges = merged.sampleBasePerSizeDimensionRanges;
  const curQty = merged.sampleBasePerSizePieceQty;
  const nextPer: Record<string, Record<string, string>> = {};
  if (cur) {
    for (const k of Object.keys(cur)) {
      if (allow.has(k)) nextPer[k] = cur[k]!;
    }
  }
  const nextRanges: Record<string, Record<string, Workshop2Phase1DimensionRangeCell>> = {};
  if (curRanges) {
    for (const k of Object.keys(curRanges)) {
      if (allow.has(k)) nextRanges[k] = curRanges[k]!;
    }
  }
  const nextQty: Record<string, number> = {};
  if (curQty) {
    for (const k of Object.keys(curQty)) {
      if (allow.has(k)) nextQty[k] = curQty[k]!;
    }
  }
  return {
    ...merged,
    sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
    sampleBasePerSizeDimensionRanges: Object.keys(nextRanges).length ? nextRanges : undefined,
    sampleBasePerSizePieceQty: Object.keys(nextQty).length ? nextQty : undefined,
  };
}

function upsertCanonicalDual(
  dossier: Workshop2DossierPhase1,
  attributeId: string,
  handbook: { parameterId: string; displayLabel: string } | null,
  freeTextRaw: string
): Workshop2DossierPhase1 {
  const parts = handbook?.parameterId ? [handbook] : [];
  return upsertCanonicalMultiHandbookAndFree(dossier, attributeId, parts, freeTextRaw);
}

function upsertCanonicalHandbookValues(
  dossier: Workshop2DossierPhase1,
  attributeId: string,
  handbookParts: { parameterId: string; displayLabel: string }[]
): Workshop2DossierPhase1 {
  const idx = findCanonicalIndex(dossier, attributeId);
  const prev = idx >= 0 ? dossier.assignments[idx]! : null;
  if (handbookParts.length === 0) {
    if (idx < 0) return dossier;
    return { ...dossier, assignments: dossier.assignments.filter((_, i) => i !== idx) };
  }
  const values: Workshop2Phase1AttributeValue[] = handbookParts.map((h) => ({
    valueId: newUuid(),
    valueSource: 'handbook_parameter',
    parameterId: h.parameterId,
    displayLabel: h.displayLabel,
  }));
  const nextAssign: Workshop2Phase1AttributeAssignment = {
    assignmentId: prev?.assignmentId ?? newUuid(),
    kind: 'canonical',
    attributeId,
    values,
  };
  const assignments = [...dossier.assignments];
  if (idx >= 0) assignments[idx] = nextAssign;
  else assignments.push(nextAssign);
  return { ...dossier, assignments };
}

const PRIMARY_FAMILY_TO_PALETTE_KEYWORDS: [RegExp, string[]][] = [
  [/черн|black/i, ['черн', 'black']],
  [/бел|white|молочн|кремов/i, ['бел', 'white', 'молочн', 'кремов']],
  [/син|navy|индиго|ультрамарин/i, ['син', 'navy', 'индиго', 'ультрамарин']],
  [/красн|бордо|burgundy|малин/i, ['красн', 'бордо', 'red', 'малин']],
  [/зел|olive|хаки|khaki/i, ['зел', 'olive', 'хаки']],
  [/розов|fuchsia|фукс/i, ['розов', 'fuchsia']],
  [/сер|grey|gray/i, ['сер', 'grey', 'gray']],
  [/беж|camel|песочн/i, ['беж', 'camel', 'песочн']],
  [/коричн|brown|шоколад/i, ['коричн', 'brown', 'шоколад']],
  [/оранж|terracotta|терракот/i, ['оранж', 'terracotta']],
  [/жёлт|yellow|горчич/i, ['жёлт', 'yellow', 'горчич']],
  [/фиолет|purple|лилов/i, ['фиолет', 'purple', 'лилов']],
  [/золот|gold|серебр|silver|металлик/i, ['золот', 'gold', 'серебр', 'silver', 'металлик']],
];

/** Тот же порядок семейств, что у PRIMARY_FAMILY_TO_PALETTE_KEYWORDS — fallback hex для «Свой оттенок». */
const PRIMARY_FAMILY_FALLBACK_HEX: [RegExp, string][] = [
  [/черн|black/i, '#0f172a'],
  [/бел|white|молочн|кремов/i, '#f8fafc'],
  [/син|navy|индиго|ультрамарин/i, '#1e3a8a'],
  [/красн|бордо|burgundy|малин/i, '#7f1d1d'],
  [/зел|olive|хаки|khaki/i, '#14532d'],
  [/розов|fuchsia|фукс/i, '#be185d'],
  [/сер|grey|gray/i, '#475569'],
  [/беж|camel|песочн/i, '#d6c4b0'],
  [/коричн|brown|шоколад/i, '#422006'],
  [/оранж|terracotta|терракот/i, '#c2410c'],
  [/жёлт|yellow|горчич/i, '#ca8a04'],
  [/фиолет|purple|лилов/i, '#5b21b6'],
  [/золот|gold|серебр|silver|металлик/i, '#b45309'],
];

function suggestPaletteFromPrimaryLabels(
  primaryLabels: string[],
  colorParams: { parameterId: string; label: string }[]
): { parameterId: string; displayLabel: string } | null {
  const blob = normalizeRuColorMatch(primaryLabels.join(' '));
  for (const [re, needles] of PRIMARY_FAMILY_TO_PALETTE_KEYWORDS) {
    if (re.test(blob)) {
      for (const n of needles) {
        const nn = normalizeRuColorMatch(n);
        const hit = colorParams.find((p) => normalizeRuColorMatch(p.label).includes(nn));
        if (hit) return { parameterId: hit.parameterId, displayLabel: hit.label };
      }
    }
  }
  return null;
}

function suggestHexFromPrimaryLabels(primaryLabels: string[]): string | null {
  const blob = normalizeRuColorMatch(primaryLabels.join(' '));
  for (const [re, hex] of PRIMARY_FAMILY_FALLBACK_HEX) {
    if (re.test(blob)) return hex;
  }
  return null;
}

const PALETTE_TO_PRIMARY: [RegExp, RegExp][] = [
  [/черн|black/i, /черн/i],
  [/бел|white|молочн|кремов|слонов/i, /бел|молочн|крем|слонов/i],
  [/син|navy|индиго|ультрамарин|джинс/i, /син|navy|индиго/i],
  [/красн|red|бордо|burgundy|малин/i, /красн|бордо|малин/i],
  [/зел|olive|хаки|khaki|мят/i, /зел|olive|хаки|мят/i],
  [/розов|fuchsia|фукс|коралл/i, /розов|фукс|коралл/i],
  [/сер|grey|gray|графит/i, /сер|графит|steel/i],
  [/беж|camel|песочн|пудр/i, /беж|camel|песочн|пудр/i],
  [/коричн|brown|шоколад|кофе/i, /коричн|шоколад|кофе/i],
  [/оранж|terracotta|терракот|морков/i, /оранж|терракот/i],
  [/жёлт|yellow|горчич|лимон/i, /жёлт|горчич|лимон/i],
  [/фиолет|purple|лилав|сиренев/i, /фиолет|лилав|сиренев/i],
];

function suggestPrimaryFamilyFromPaletteLabel(
  paletteLabel: string,
  primaryParams: { parameterId: string; label: string }[]
): { parameterId: string; displayLabel: string } | null {
  const normPal = normalizeRuColorMatch(paletteLabel);
  for (const [palRe, primRe] of PALETTE_TO_PRIMARY) {
    if (palRe.test(normPal)) {
      const hit = primaryParams.find((p) => primRe.test(normalizeRuColorMatch(p.label)));
      if (hit) return { parameterId: hit.parameterId, displayLabel: hit.label };
    }
  }
  return null;
}

function normalizeCatalogHex(hex: string | undefined): string | undefined {
  if (!hex?.trim()) return undefined;
  const h = hex.trim().replace(/^#/, '').toLowerCase();
  if (h.length !== 6 || !/^[0-9a-f]+$/.test(h)) return undefined;
  return `#${h}`;
}

function applyMatComposition(
  dossier: Workshop2DossierPhase1,
  rows: MatPctRow[],
  syncComposition: boolean
): Workshop2DossierPhase1 {
  const handbookParts = rows.map((r) => ({
    parameterId: r.parameterId,
    displayLabel: `${r.label} ${r.pct}%`,
  }));
  const compText = rows.map((r) => `${r.label} ${r.pct}%`).join(', ');
  let next = upsertCanonicalHandbookValues(dossier, 'mat', handbookParts);
  if (syncComposition) next = upsertCanonicalDual(next, 'composition', null, compText);
  return next;
}

export type Workshop2DossierPanelVariant = 'phase1' | 'phase2' | 'phase3';

type Props = {
  collectionId: string;
  articleId: string;
  /** Внутренний 6-значный номер из инвентаря; не редактируется в ТЗ. */
  internalArticleCode?: string;
  articleSku: string;
  articleName: string;
  categoryLeafId: string;
  updatedByLabel: string;
  onPatchArticleLine: (patch: Workshop2ArticleLinePatch) => boolean;
  /** Шаг 1: «Назад» к списку артикулов. */
  onBack?: () => void;
  /** Шаг 2–3: «Назад» к предыдущему шагу (без выхода к списку). */
  onPreviousStep?: () => void;
  /** `phase1` — досье; `phase2`/`phase3` — атрибуты соответствующей фазы каталога. */
  variant?: Workshop2DossierPanelVariant;
  /** Шаг 1 → 2 (после проверок при «Следующее»). */
  onContinueToNextStep?: () => void;
  /** Шаг 2 → 3. */
  onContinueToStep3?: () => void;
  /** Шаг 3: «Готово» — сохранить и выйти к списку. */
  onFinishWorkshop?: () => void;
  onNavigateToTab?: (
    tab: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock',
    opts?: { dossierSection?: DossierSection; scrollDomId?: string }
  ) => void;
  /** Открыть конкретный раздел досье (например, с обзора по query `w2sec`). */
  focusDossierSection?: DossierSection | null;
  /** Подсветка основной колонки ТЗ после перехода с обзора (~3 c, держит родитель). */
  flashDossier?: null | { mode: 'main' } | { mode: 'section'; section: DossierSection };
  /**
   * Подписи (как в профиле), которым разрешено снимать цифровые подписи подтверждений ТЗ.
   * Сравнение без учёта регистра. Пустой список — снять нельзя никому.
   */
  tzSignoffRevokerLabels?: string[];
  /**
   * Кто может ставить цифровую подпись по направлениям (задаётся в разделе Команда).
   * Если не передано — разрешены все три роли (демо).
   */
  tzDigitalSignoffCapabilities?: Workshop2TzDigitalSignoffCapabilities;
  /** Внешняя перезагрузка досье из storage (например правка подписантов в паспорте). */
  dossierHydrateKey?: number;
  /** Открыть модалку «Пульс» из разделов ТЗ. `materialHints` — показать подсказки по полям материалов в диалоге. */
  onOpenPulse?: (ctx?: { materialHints?: boolean }) => void;
};

import { Badge } from '@/components/ui/badge';

const SECTIONS: {
  id: Workshop2TzSignoffSectionKey;
  label: string;
  icon: keyof typeof LucideIcons;
}[] = [
  { id: 'general', label: 'Паспорт', icon: 'Info' },
  { id: 'visuals', label: 'Визуал', icon: 'Image' },
  { id: 'construction', label: 'Конструкции', icon: 'Scissors' },
  { id: 'material', label: 'Материал', icon: 'Layers' },
];

const SECTION_LABEL_BY_ID: Record<DossierSection, string> = {
  ...(Object.fromEntries(SECTIONS.map((s) => [s.id, s.label])) as Record<
    (typeof SECTIONS)[number]['id'],
    string
  >),
  measurements: 'Табель мер',
  packaging: 'Упаковка',
  sample_intake: 'Приёмка сэмпла',
};

const TZ_ACTION_LOG_MAX = 400;

function normTzActorLabel(s: string): string {
  return s.trim().toLowerCase();
}

function canRevokeTzSignoff(actorLabel: string, revokerLabels: string[]): boolean {
  const a = normTzActorLabel(actorLabel);
  if (!a) return false;
  return revokerLabels.some((r) => normTzActorLabel(r) === a);
}

function pushTzActionLog(
  dossier: Workshop2DossierPhase1,
  by: string,
  action: Workshop2TzActionLogPayload
): Workshop2DossierPhase1 {
  const entry: Workshop2TzActionLogEntry = {
    entryId: newUuid(),
    at: new Date().toISOString(),
    by: by.slice(0, 200),
    action,
  };
  const prev = dossier.tzActionLog ?? [];
  const next = [...prev, entry];
  const overflow = next.length - TZ_ACTION_LOG_MAX;
  if (overflow > 0) next.splice(0, overflow);
  return { ...dossier, tzActionLog: next };
}

function formatTzLogTimestamp(at: string): string {
  try {
    return new Date(at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return at;
  }
}

function formatTzActionLogDetailRu(e: Workshop2TzActionLogEntry): {
  when: string;
  author: string;
  text: string;
} {
  const when = formatTzLogTimestamp(e.at);
  const author = e.by;
  if (e.action.type === 'dossier_edit') {
    const parts = e.action.summaries.filter(Boolean);
    const text =
      parts.length > 0 ? `Изменения данных: ${parts.join('; ')}` : 'Изменения данных (сохранение)';
    return { when, author, text };
  }
  if (e.action.type === 'sketch_labels_snapshot') {
    const lab = e.action.label?.trim() ? ` «${e.action.label.trim()}»` : '';
    return {
      when,
      author,
      text: `Снимок меток скетча${lab}: общий ${e.action.masterPins}, по листам ${e.action.sheetPinsTotal}`,
    };
  }
  if (e.action.type === 'sketch_labels_restore') {
    const lab = e.action.label?.trim() ? ` «${e.action.label.trim()}»` : '';
    const whenSnap = formatTzLogTimestamp(e.action.snapshotAt);
    return {
      when,
      author,
      text: `Восстановление меток из снимка${lab} (снимок от ${whenSnap})`,
    };
  }
  if (e.action.type === 'tz_global_signoff') {
    const who =
      e.action.role === 'designer'
        ? '«Цифровая подпись дизайнера»'
        : e.action.role === 'technologist'
          ? '«Цифровая подпись технолога»'
          : '«Цифровая подпись менеджера»';
    const verb = e.action.set ? 'проставлено' : 'снято';
    return { when, author, text: `${who} — ${verb}` };
  }
  if (e.action.type === 'tz_extra_signoff') {
    const verb = e.action.set ? 'проставлено' : 'снято';
    return {
      when,
      author,
      text: `Цифровая подпись ТЗ, роль «${e.action.roleTitle}» (${e.action.rowId}) — ${verb}`,
    };
  }
  const sec = SECTION_LABEL_BY_ID[e.action.section];
  const side = e.action.role === 'brand' ? 'бренд (дизайн / продакт)' : 'технолог';
  const verb = e.action.set ? 'подтверждение' : 'снятие подтверждения';
  return { when, author, text: `Секция «${sec}», ${side} — ${verb}` };
}

const SECTION_GUIDANCE: Record<
  DossierSection,
  {
    step: string;
    title: string;
    description: string;
    owner: string;
  }
> = {
  general: {
    step: 'Шаг 1',
    title: 'Паспорт артикула',
    description:
      'SKU, категория, аудитория и базовые коды — ось для визуала, BOM и мерок.',
    owner: 'Бренд-дизайнер',
  },
  visuals: {
    step: 'Шаг 2',
    title: 'Соберите визуальную базу артикула',
    description:
      'Референсы, канон, замысел, скетч с метками и поля «Визуал».',
    owner: 'Бренд-дизайнер',
  },
  material: {
    step: 'Шаг 3',
    title: 'Материалы (BOM) и сопутствующие поля выпуска',
    description: 'Состав, mat-строки, упаковка и маркировка в одном контуре.',
    owner: 'Дизайнер + product developer',
  },
  measurements: {
    step: 'Шаг 4',
    title: 'Табель мер',
    description: 'Шкала, база и мерки для образца и серии.',
    owner: 'Технолог',
  },
  construction: {
    step: 'Шаг 5',
    title: 'Конструкция и табель мер',
    description: 'Узлы, силуэт, мерки и скетч — одна площадка с ОТК и цехом.',
    owner: 'Технолог · дизайн · смежные роли',
  },
  packaging: {
    step: 'Шаг 6',
    title: 'Упаковка и маркировка',
    description: 'Упаковка и этикетки для серии.',
    owner: 'Продакт',
  },
  sample_intake: {
    step: 'Fit',
    title: 'Приёмка сэмпла в коллекцию',
    description: 'По маршруту коллекции после образца, не отдельная вкладка ТЗ.',
    owner: 'Бренд / продакт',
  },
};

/** Паспорт: основной цвет + референс + палитра/оттенок — один блок «Цвет». */
const PASSPORT_COLOR_BUNDLE_IDS = new Set<string>([
  'primaryColorFamilyOptions',
  'colorReferenceSystemOptions',
  'color',
]);

const PASSPORT_COLOR_BUNDLE_ORDER: readonly string[] = [
  'primaryColorFamilyOptions',
  'colorReferenceSystemOptions',
  'color',
];

function getSectionWarnings(
  section: DossierSection,
  dossier: Workshop2DossierPhase1,
  currentLeaf: HandbookCategoryLeaf,
  skuDraft: string,
  nameDraft: string,
  handbookWarnings: string[],
  sectionReadiness: Record<
    DossierSection,
    { done: number; total: number; pct: number; status: string }
  >
): string[] {
  if (section === 'general') {
    const warnings: string[] = [];
    const pb = dossier.passportProductionBrief;
    if (!dossier.selectedAudienceId?.trim()) warnings.push('Не выбрана аудитория.');
    if (!currentLeaf?.pathLabel?.trim()) warnings.push('Не зафиксирована ветка каталога (L1–L3).');
    if (!skuDraft.trim()) warnings.push('SKU еще не подтвержден.');
    if (!nameDraft.trim()) warnings.push('Нет рабочего названия модели.');
    if (!pb?.articleCardOwnerName?.trim()) {
      warnings.push('Укажите ответственного за карточку артикула (администратор модели).');
    }
    if (!pb?.plannedLaunchType || pb.plannedLaunchType === 'undecided') {
      warnings.push('Выберите планируемый тип запуска (своё производство / КНП / смешанный).');
    }
    if (!pb?.targetSampleOrPilotDate?.trim()) {
      warnings.push('Задайте целевую дату образца или пилотной партии.');
    }
    if (pb?.deadlineCriticality !== 'hard' && pb?.deadlineCriticality !== 'flexible') {
      warnings.push('Укажите критичность срока: жёсткий дедлайн или гибкий ориентир.');
    }
    const moq = pb?.moqTargetMaxPieces;
    const moqOk =
      moq != null && Number.isFinite(moq) && moq >= 1;
    if (!moqOk) {
      warnings.push(
        'Укажите целевое количество образцов (шт) в брифе — лимит для выбора размеров и суммы «Кол-во, шт» в табеле мерок.'
      );
    }
    return warnings;
  }
  if (section === 'visuals') {
    return collectWorkshop2VisualSectionWarnings(dossier, currentLeaf);
  }
  if (section === 'material') {
    const warnings: string[] = [];
    if (!dossier.assignments.some((a) => a.attributeId === 'mat' && a.values.length > 0)) {
      warnings.push('Основной материал не выбран.');
    }
    if (!dossier.assignments.some((a) => a.attributeId === 'composition' && a.values.length > 0)) {
      warnings.push('Состав материала не подтвержден.');
    }
    return warnings;
  }
  if (section === 'construction') {
    const dimWarnings = handbookWarnings.filter(
      (warning) =>
        warning.includes('Размерная шкала') ||
        warning.includes('Табель мер') ||
        warning.includes('мерки') ||
        warning.includes('лимит') ||
        warning.includes('количеств по размерам')
    );
    const base =
      sectionReadiness.construction.done === 0
        ? ['Конструктивные параметры и табель мер ещё не закрыты.']
        : [];
    return [...base, ...dimWarnings];
  }
  return [];
}

type HandbookCheckAspectRow = {
  label: string;
  ok: boolean;
  jumpSection?: Workshop2TzSignoffSectionKey;
  jumpAnchorId?: string;
};

type HandbookCheckSnapshot = {
  checkedAtIso: string;
  /** Раздел, по которому строился снимок (текущая вкладка при нажатии «Проверить»). */
  scopeSection: DossierSection;
  /** Те же контрольные пункты, что в полосе раздела — что именно сверялось. */
  checkAspects: HandbookCheckAspectRow[];
  /** Строки с префиксом названия раздела. */
  lines: string[];
  bySection: Record<DossierSection, string[]>;
  /** Для снимка по одной вкладке не заполняем — сквозной блок в сайдбаре скрыт. */
  globalHandbookWarnings: string[];
};

function buildHandbookCheckSnapshot(
  dossier: Workshop2DossierPhase1,
  currentLeaf: HandbookCategoryLeaf,
  skuDraft: string,
  nameDraft: string,
  handbookWarnings: string[],
  sectionReadiness: Record<
    DossierSection,
    { done: number; total: number; pct: number; status: string }
  >,
  scopeSection: DossierSection,
  checkAspects: HandbookCheckAspectRow[]
): HandbookCheckSnapshot {
  const bySection = {} as Record<DossierSection, string[]>;
  for (const s of SECTIONS) {
    bySection[s.id] =
      s.id === scopeSection
        ? getSectionWarnings(
            s.id,
            dossier,
            currentLeaf,
            skuDraft,
            nameDraft,
            handbookWarnings,
            sectionReadiness
          )
        : [];
  }
  const lineSet = new Set<string>();
  const label = SECTION_LABEL_BY_ID[scopeSection];
  for (const w of bySection[scopeSection]) {
    lineSet.add(`${label}: ${w}`);
  }
  return {
    checkedAtIso: new Date().toISOString(),
    scopeSection,
    checkAspects,
    lines: [...lineSet],
    bySection,
    globalHandbookWarnings: [],
  };
}

type BuildControlPointsCtx = {
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  skuDraft: string;
  nameDraft: string;
  handbookWarnings: string[];
  sectionReadiness: Record<
    DossierSection,
    { done: number; total: number; pct: number; status: string }
  >;
  selectedAudienceLabel: string;
  hasAssignmentValue: (attributeId: string) => boolean;
};

type Workshop2HandbookSectionControlPoint = {
  label: string;
  done: boolean;
  jump?: { section: Workshop2TzSignoffSectionKey; anchorId: string };
};

/** Чекпоинты секции — та же логика, что у полосы контроля в центральной колонке. */
function buildSectionControlPoints(
  section: DossierSection,
  ctx: BuildControlPointsCtx
): Workshop2HandbookSectionControlPoint[] {
  const {
    dossier,
    currentLeaf,
    skuDraft,
    nameDraft,
    handbookWarnings,
    sectionReadiness,
    selectedAudienceLabel,
    hasAssignmentValue,
  } = ctx;
  const secDone = sectionReadiness[section].done;
  const P = W2_PASSPORT_SUBPAGE_ANCHORS;
  const M = W2_MATERIAL_SUBPAGE_ANCHORS;
  const C = W2_CONSTRUCTION_SUBPAGE_ANCHORS;
  const V = W2_VISUAL_SUBPAGE_ANCHORS;
  const j = (s: Workshop2TzSignoffSectionKey, anchorId: string) => ({ section: s, anchorId });

  switch (section) {
    case 'general': {
      const pb = dossier.passportProductionBrief;
      const audienceOk = Boolean(dossier.selectedAudienceId?.trim() || selectedAudienceLabel);
      const moq = pb?.moqTargetMaxPieces;
      const moqOk = moq != null && Number.isFinite(moq) && moq >= 1;
      return [
        { label: 'Аудитория выбрана', done: audienceOk, jump: j('general', P.identity) },
        { label: 'Категория 1 / 2 / 3 подтверждена', done: Boolean(currentLeaf.pathLabel), jump: j('general', P.identity) },
        { label: 'SKU подтвержден', done: Boolean(skuDraft.trim()), jump: j('general', P.identity) },
        { label: 'Рабочее название модели есть', done: Boolean(nameDraft.trim()), jump: j('general', P.identity) },
        {
          label: 'Администратор модели (карточка артикула)',
          done: Boolean(pb?.articleCardOwnerName?.trim()),
          jump: j('general', P.brief),
        },
        {
          label: 'Тип запуска (цех / КНП / смешанный)',
          done: Boolean(pb?.plannedLaunchType && pb.plannedLaunchType !== 'undecided'),
          jump: j('general', P.brief),
        },
        {
          label: 'Срок образца / пилота',
          done: Boolean(pb?.targetSampleOrPilotDate?.trim()),
          jump: j('general', P.brief),
        },
        {
          label: 'Количество образцов (шт, лимит для табеля)',
          done: moqOk,
          jump: j('general', P.brief),
        },
        {
          label: 'Критичность срока (жёстко / гибко)',
          done: pb?.deadlineCriticality === 'hard' || pb?.deadlineCriticality === 'flexible',
          jump: j('general', P.brief),
        },
      ];
    }
    case 'visuals':
      return [
        {
          label: 'Основной эскиз собран',
          done: Boolean(
            dossier.categorySketchImageDataUrl ||
            (dossier.categorySketchAnnotations?.length ?? 0) > 0
          ),
          jump: j('construction', W2_VISUALS_SKETCH_ANCHOR_ID),
        },
        {
          label: 'Есть метки на скетче',
          done: (dossier.categorySketchAnnotations?.length ?? 0) > 0,
          jump: j('construction', W2_VISUALS_SKETCH_ANCHOR_ID),
        },
        { label: 'Замысел в «Визуал»', done: Boolean(dossier.brandNotes?.trim()), jump: j('visuals', V.hub) },
        {
          label: 'Референсы добавлены',
          done: (dossier.visualReferences?.length ?? 0) > 0,
          jump: j('visuals', V.refs),
        },
      ];
    case 'material':
      return [
        { label: 'Основной материал выбран', done: hasAssignmentValue('mat'), jump: j('material', M.mat) },
        {
          label: 'Состав подтвержден',
          done: hasAssignmentValue('composition'),
          jump: j('material', M.composition),
        },
        {
          label: 'Подкладка / дублирование описаны',
          done: hasAssignmentValue('lining') || hasAssignmentValue('fusing'),
          jump: j('material', M.hub),
        },
        {
          label: 'Критичные material notes учтены',
          done: hasAssignmentValue('fabric_weight') || hasAssignmentValue('lining_composition'),
          jump: j('material', M.fields),
        },
        { label: 'Тип упаковки указан', done: hasAssignmentValue('packaging'), jump: j('material', M.compliance) },
        { label: 'Маркировка описана', done: hasAssignmentValue('labeling'), jump: j('material', M.compliance) },
        { label: 'Штрихкод / кодировка указаны', done: hasAssignmentValue('barcode'), jump: j('material', M.compliance) },
      ];
    case 'construction':
      return [
        {
          label: 'Размерная шкала выбрана',
          done: Boolean(dossier.sampleSizeScaleId),
          jump: j('construction', 'w2-measurements-fields'),
        },
        {
          label: 'Базовый размер выбран',
          done: hasAssignmentValue('sampleBaseSize'),
          jump: j('construction', 'w2-measurements-fields'),
        },
        {
          label: 'Табель мер заполнен',
          done: Boolean(
            dossier.sampleBasePerSizeDimensions &&
            Object.keys(dossier.sampleBasePerSizeDimensions).length > 0
          ),
          jump: j('construction', 'w2-measurements-fields'),
        },
        {
          label: 'Нет критичных пропусков по меркам справочника',
          done: !handbookWarnings.some(
            (warning) => warning.includes('мерки') || warning.includes('Табель мер')
          ),
          jump: j('construction', 'w2-measurements-fields'),
        },
        {
          label: 'Силуэт / посадка описаны',
          done: hasAssignmentValue('silh') || hasAssignmentValue('fit_type'),
          jump: j('construction', C.hub),
        },
        {
          label: 'Ключевые узлы зафиксированы',
          done:
            hasAssignmentValue('closure') ||
            hasAssignmentValue('pocket') ||
            hasAssignmentValue('neck') ||
            hasAssignmentValue('sleeve'),
          jump: j('construction', C.hub),
        },
        {
          label: 'Есть tech pack / ссылка на лекала',
          done: hasAssignmentValue('techPackRef') || (dossier.techPackAttachments?.length ?? 0) > 0,
          jump: j('construction', C.hub),
        },
        { label: 'Раздел не пустой', done: secDone > 0, jump: j('construction', C.hub) },
      ];
    default:
      return [];
  }
}

export function Workshop2Phase1DossierPanel({
  collectionId,
  articleId,
  internalArticleCode,
  articleSku,
  articleName,
  categoryLeafId,
  updatedByLabel,
  onPatchArticleLine,
  onBack,
  onPreviousStep,
  variant = 'phase1',
  onContinueToNextStep,
  onContinueToStep3,
  onFinishWorkshop,
  onNavigateToTab,
  focusDossierSection,
  flashDossier,
  tzSignoffRevokerLabels,
  tzDigitalSignoffCapabilities,
  dossierHydrateKey = 0,
  onOpenPulse,
}: Props) {
  const { toast } = useToast();
  const { user } = useAuth();
  /** SKU для flush метрик: ref обновляется после `skuDraft`, объект ctx — рано (без TDZ). */
  const w2MetricsSkuRef = useRef<string | null>(null);
  const w2DossierMetricsCtx = useMemo<Workshop2DossierMetricsFlushContext>(
    () => ({
      appUserUid: user?.uid ?? null,
      orgId: user?.activeOrganizationId ?? null,
      get sku() {
        return w2MetricsSkuRef.current;
      },
    }),
    [user?.uid, user?.activeOrganizationId]
  );
  const { role, can } = useRbac();
  const { profile: dossierViewProfile } = useWorkshop2DossierView();
  /** Совпадает с видимостью `Workshop2DossierSupplyChainDraftsPanel` (альтернативы / дельта / costing). */
  const showMaterialSupplyDraftsNav = useMemo(() => {
    const p = dossierViewProfile;
    const showAlts =
      p === 'full' ||
      p === 'supply' ||
      p === 'compliance' ||
      p === 'manager' ||
      p === 'technologist' ||
      p === 'production' ||
      p === 'qc';
    const showDelta =
      p === 'full' ||
      p === 'supply' ||
      p === 'technologist' ||
      p === 'production' ||
      p === 'manager';
    const showCosting =
      p === 'full' || p === 'finance' || p === 'manager' || p === 'supply' || p === 'technologist';
    return showAlts || showDelta || showCosting;
  }, [dossierViewProfile]);
  /** Нет права production:edit — досье и скетч только для чтения (без API, матрица rbac.ts). */
  const tzWriteDisabled = !can('production', 'edit');
  const lockedSketchFloorOnly = isSketchFloorOnlyRole(role);

  const [sketchViewFloor, setSketchViewFloor] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => {
      if (lockedSketchFloorOnly) {
        setSketchViewFloor(true);
        return;
      }
      setSketchViewFloor(isSketchFloorInSearch(window.location.search));
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [lockedSketchFloorOnly]);

  useEffect(() => {
    if (!lockedSketchFloorOnly || typeof window === 'undefined') return;
    replaceSketchFloorInUrl(true);
  }, [lockedSketchFloorOnly]);

  const sketchEditsLocked = sketchViewFloor || tzWriteDisabled;

  const copySketchFloorLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set(SKETCH_FLOOR_QUERY_PARAM, '1');
    url.searchParams.set(WORKSHOP2_ARTICLE_PANE_PARAM, 'tz');
    void navigator.clipboard.writeText(url.toString()).then(
      () =>
        toast({
          title: 'Ссылка для цеха скопирована',
          description: 'Откройте её на рабочем месте — сразу режим просмотра (?sketchFloor=1).',
        }),
      () =>
        toast({
          title: 'Не удалось скопировать',
          description: 'Скопируйте адрес страницы вручную и добавьте ?sketchFloor=1',
          variant: 'destructive',
        })
    );
  }, [toast]);

  const setSketchFloorMode = useCallback(
    (floor: boolean) => {
      if (lockedSketchFloorOnly && !floor) {
        toast({
          title: 'Режим ТЗ недоступен',
          description: 'Для вашей роли скетч только для просмотра (цех).',
          variant: 'destructive',
        });
        return;
      }
      if (tzWriteDisabled && !floor) {
        toast({
          title: 'Редактирование недоступно',
          description: 'Нет права «Редактировать производство» — скетч только для просмотра.',
          variant: 'destructive',
        });
        return;
      }
      setSketchViewFloor(floor);
      replaceSketchFloorInUrl(floor);
      toast({
        title: floor ? 'Режим цеха' : 'Режим ТЗ и правок',
        description: floor
          ? 'Метки и подложки не редактируются; экспорт и печать доступны.'
          : 'Можно ставить метки и менять шаблоны.',
      });
    },
    [lockedSketchFloorOnly, toast, tzWriteDisabled]
  );

  const isPhase1 = variant === 'phase1';
  const isPhase2 = variant === 'phase2';
  const isPhase3 = variant === 'phase3';

  const visualsShareAbsoluteUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const seg = workshop2ArticleUrlSegment(internalArticleCode, articleId);
    const rel = workshop2ArticleHref(collectionId, seg, {
      w2step: '1',
      w2sec: 'visuals',
      w2pane: 'tz',
      hash: 'w2-visuals-hub',
    });
    return `${window.location.origin}${rel}`;
  }, [articleId, collectionId, internalArticleCode]);

  const buildRouteHandoffAbsoluteUrl = useCallback(
    (tab: 'fit' | 'qc' | 'supply', domId: string) => {
      if (typeof window === 'undefined') return '';
      const seg = workshop2ArticleUrlSegment(internalArticleCode, articleId);
      const id = domId.replace(/^#/, '');
      const rel = workshop2ArticleHref(collectionId, seg, { w2pane: tab, hash: id });
      return `${window.location.origin}${rel}`;
    },
    [articleId, collectionId, internalArticleCode]
  );

  const passportStep1BriefHref = useMemo(() => {
    const seg = workshop2ArticleUrlSegment(internalArticleCode, articleId);
    return workshop2ArticleHref(collectionId, seg, {
      w2step: '1',
      w2sec: 'general',
      w2pane: 'tz',
      hash: 'w2-passport-brief',
    });
  }, [articleId, collectionId, internalArticleCode]);

  const [tzScrollBehavior, setTzScrollBehavior] = useState<ScrollBehavior>('smooth');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setTzScrollBehavior(mq.matches ? 'auto' : 'smooth');
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const [activeSection, setActiveSection] = useState<Workshop2TzSignoffSectionKey>('general');
  const [constructionTzHubOpen, setConstructionTzHubOpen] = useState(false);
  const [dossierMainColumnFlash, setDossierMainColumnFlash] = useState(false);
  const materialPreSupplyNavExpandRef = useRef<(anchorId: string) => void>(() => {});

  const jumpToTzSectionAnchor = useCallback(
    (section: Workshop2TzSignoffSectionKey, anchorId: string) => {
      const id = anchorId.replace(/^#/, '');
      if (section === 'material') materialPreSupplyNavExpandRef.current(id);
      if (section === 'construction') {
        const expandTzHub = new Set<string>([
          W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub,
          'w2-measurements-fields',
          W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour,
          W2_CONSTRUCTION_SUBPAGE_ANCHORS.export,
          W2_CONSTRUCTION_SUBPAGE_ANCHORS.signoff,
          W2_VISUALS_SKETCH_ANCHOR_ID,
          'w2-visuals-sketch-templates',
        ]);
        if (expandTzHub.has(id)) setConstructionTzHubOpen(true);
      }
      setActiveSection(section);
      if (onNavigateToTab) {
        onNavigateToTab('tz', { dossierSection: section, scrollDomId: id });
        return;
      }
      const scroll = () => {
        document.getElementById(id)?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
        if (typeof window !== 'undefined') {
          const { pathname, search } = window.location;
          window.history.replaceState(null, '', `${pathname}${search}#${id}`);
        }
      };
      if (typeof window === 'undefined') return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scroll);
      });
    },
    [tzScrollBehavior, onNavigateToTab]
  );

  const jumpToMaterialMatTable = useCallback(
    () => jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.mat),
    [jumpToTzSectionAnchor]
  );
  const jumpToConstructionContour = useCallback(
    () => jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour),
    [jumpToTzSectionAnchor]
  );
  const jumpToSketchLineRefs = useCallback(
    () => jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID),
    [jumpToTzSectionAnchor]
  );
  const jumpToQcArticleSection = useCallback(() => {
    onNavigateToTab?.('qc', { scrollDomId: W2_ARTICLE_SECTION_DOM.qc });
  }, [onNavigateToTab]);

  useEffect(() => {
    if (!isPhase1 || !focusDossierSection) return;
    if (SECTIONS.some((s) => s.id === focusDossierSection)) {
      setActiveSection(focusDossierSection as Workshop2TzSignoffSectionKey);
    }
  }, [focusDossierSection, isPhase1]);

  const validVisualSubpageHashes = useMemo(
    () => new Set<string>(Object.values(W2_VISUAL_SUBPAGE_ANCHORS)),
    []
  );

  /** Hash из списка визуала, но цель в DOM только на «Конструкция» (скетч и шаблоны master). */
  const visualHashTargetsConstructionOnly = useMemo(
    () => new Set<string>([W2_VISUALS_SKETCH_ANCHOR_ID, W2_VISUAL_SUBPAGE_ANCHORS.sketchTemplates]),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isPhase1 || activeSection !== 'visuals') return;
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw || !validVisualSubpageHashes.has(raw)) return;
    const tid = window.setTimeout(() => {
      if (visualHashTargetsConstructionOnly.has(raw)) {
        jumpToTzSectionAnchor('construction', raw);
        return;
      }
      document.getElementById(raw)?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
    }, 200);
    return () => window.clearTimeout(tid);
  }, [
    activeSection,
    dossierHydrateKey,
    focusDossierSection,
    isPhase1,
    jumpToTzSectionAnchor,
    tzScrollBehavior,
    validVisualSubpageHashes,
    visualHashTargetsConstructionOnly,
  ]);

  const visualSubnavAnchorIds = useMemo(
    () => Object.values(W2_VISUAL_SUBPAGE_ANCHORS) as string[],
    []
  );
  const [activeVisualSubNavId, setActiveVisualSubNavId] = useState<string | null>(null);
  const passportSubnavAnchorIds = useMemo(
    () =>
      [
        W2_PASSPORT_SUBPAGE_ANCHORS.hub,
        W2_PASSPORT_SUBPAGE_ANCHORS.identity,
        W2_PASSPORT_SUBPAGE_ANCHORS.brief,
        W2_PASSPORT_SUBPAGE_ANCHORS.start,
        W2_PASSPORT_SUBPAGE_ANCHORS.market,
      ] as string[],
    []
  );
  const [activePassportSubNavId, setActivePassportSubNavId] = useState<string | null>(null);
  const materialSubnavAnchorIds = useMemo(
    () =>
      [
        W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts,
        W2_MATERIAL_SUBPAGE_ANCHORS.hub,
        W2_MATERIAL_SUBPAGE_ANCHORS.mat,
        W2_MATERIAL_SUBPAGE_ANCHORS.composition,
        W2_MATERIAL_SUBPAGE_ANCHORS.catalog,
      ] as string[],
    []
  );
  const [activeMaterialSubNavId, setActiveMaterialSubNavId] = useState<string | null>(null);
  const [materialPreSupplyExpanded, setMaterialPreSupplyExpanded] = useState(true);

  useEffect(() => {
    materialPreSupplyNavExpandRef.current = (anchorId: string) => {
      if (W2_MATERIAL_PRE_SUPPLY_COLLAPSE_SCROLL_IDS.has(anchorId))
        setMaterialPreSupplyExpanded(true);
    };
  }, []);

  const [passportDriftLogDone, setPassportDriftLogDone] = useState(false);
  const [dossierMetricsTick, setDossierMetricsTick] = useState(0);
  /** Avoid hydration mismatch: metrics read session/localStorage, absent on the server. */
  const [dossierMetricsFooterMounted, setDossierMetricsFooterMounted] = useState(false);
  const [sketchVisualCatalogHighlightIds, setSketchVisualCatalogHighlightIds] = useState<string[]>(
    []
  );
  useEffect(() => {
    setDossierMetricsFooterMounted(true);
  }, []);
  const sketchVisualCatalogHighlightSet = useMemo(
    () => new Set(sketchVisualCatalogHighlightIds),
    [sketchVisualCatalogHighlightIds]
  );

  const onVisualCatalogSuggestFromSketch = useCallback((ids: string[]) => {
    setSketchVisualCatalogHighlightIds(ids);
  }, []);

  useEffect(() => {
    if (activeSection !== 'visuals') {
      setActiveVisualSubNavId(null);
      return;
    }
    setActiveVisualSubNavId((prev) => prev ?? 'w2-visuals-hub');
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'visuals') setSketchVisualCatalogHighlightIds([]);
  }, [activeSection]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    if (activeSection !== 'visuals') return;

    const elements = visualSubnavAnchorIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const ratios = new Map<Element, number>();
    const pickBest = () => {
      let bestEl: HTMLElement | null = null;
      let best = 0;
      for (const el of elements) {
        const r = ratios.get(el) ?? 0;
        if (r > best) {
          best = r;
          bestEl = el;
        }
      }
      if (bestEl?.id) setActiveVisualSubNavId(bestEl.id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        }
        pickBest();
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0, 0.05, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    for (const el of elements) {
      ratios.set(el, 0);
      observer.observe(el);
    }
    pickBest();

    return () => observer.disconnect();
  }, [activeSection, dossierHydrateKey, visualSubnavAnchorIds]);

  useEffect(() => {
    setPassportDriftLogDone(false);
  }, [articleId]);

  useEffect(() => {
    if (activeSection !== 'general') {
      setActivePassportSubNavId(null);
      return;
    }
    setActivePassportSubNavId((prev) => prev ?? W2_PASSPORT_SUBPAGE_ANCHORS.hub);
  }, [activeSection]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    if (activeSection !== 'general') return;

    const elements = passportSubnavAnchorIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const ratios = new Map<Element, number>();
    const pickBest = () => {
      let bestEl: HTMLElement | null = null;
      let best = 0;
      for (const el of elements) {
        const r = ratios.get(el) ?? 0;
        if (r > best) {
          best = r;
          bestEl = el;
        }
      }
      if (bestEl?.id) setActivePassportSubNavId(bestEl.id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        }
        pickBest();
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0, 0.05, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    for (const el of elements) {
      ratios.set(el, 0);
      observer.observe(el);
    }
    pickBest();

    return () => observer.disconnect();
  }, [activeSection, dossierHydrateKey, passportSubnavAnchorIds]);

  useEffect(() => {
    if (activeSection !== 'material') {
      setActiveMaterialSubNavId(null);
      return;
    }
    setActiveMaterialSubNavId(
      (prev) =>
        prev ??
        (showMaterialSupplyDraftsNav
          ? W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts
          : W2_MATERIAL_SUBPAGE_ANCHORS.hub)
    );
  }, [activeSection, showMaterialSupplyDraftsNav]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    if (activeSection !== 'material') return;

    const elements = materialSubnavAnchorIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const ratios = new Map<Element, number>();
    const pickBest = () => {
      let bestEl: HTMLElement | null = null;
      let best = 0;
      for (const el of elements) {
        const r = ratios.get(el) ?? 0;
        if (r > best) {
          best = r;
          bestEl = el;
        }
      }
      if (bestEl?.id) setActiveMaterialSubNavId(bestEl.id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        }
        pickBest();
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0, 0.05, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    for (const el of elements) {
      ratios.set(el, 0);
      observer.observe(el);
    }
    pickBest();

    return () => observer.disconnect();
  }, [activeSection, dossierHydrateKey, materialSubnavAnchorIds]);

  useEffect(() => {
    setHandbookCheckSnapshot(null);
  }, [activeSection]);

  useEffect(() => {
    setTzNotifyHighlightRowKey(null);
  }, [articleId, collectionId]);

  useEffect(() => {
    if (!flashDossier) {
      setDossierMainColumnFlash(false);
      return;
    }
    const match =
      flashDossier.mode === 'main' ||
      (flashDossier.mode === 'section' && flashDossier.section === activeSection);
    setDossierMainColumnFlash(match);
  }, [flashDossier, activeSection]);

  /** Без чтения localStorage в initializer — иначе SSR и первый paint клиента расходятся. */
  const [dossier, setDossierInternal] = useState<Workshop2DossierPhase1>(() =>
    emptyWorkshop2DossierPhase1()
  );
  const setDossier = useCallback(
    (u: React.SetStateAction<Workshop2DossierPhase1>) => {
      if (tzWriteDisabled) {
        toast({
          title: 'Только просмотр',
          description: 'Недостаточно права «Редактировать производство» для этой учётной записи.',
          variant: 'destructive',
        });
        return;
      }
      setDossierInternal(u);
    },
    [tzWriteDisabled, toast]
  );

  const [fieldDeferralIds, setFieldDeferralIds] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    setFieldDeferralIds(loadW2FieldDeferralSet(collectionId, articleId));
  }, [collectionId, articleId]);

  const toggleFieldDeferral = useCallback(
    (attributeId: string, checked: boolean) => {
      setFieldDeferralIds((prev) => {
        const next = new Set(prev);
        if (checked) next.add(attributeId);
        else next.delete(attributeId);
        saveW2FieldDeferralSet(collectionId, articleId, next);
        return next;
      });
    },
    [collectionId, articleId]
  );

  /** Снимок последнего сохранённого досье (для диффа в журнале при «Сохранить» / шагах). */
  const lastPersistedDossierRef = useRef<Workshop2DossierPhase1 | null>(null);
  const lastPersistSuccessToastAtRef = useRef(0);
  const [skuDraft, setSkuDraft] = useState(articleSku);
  w2MetricsSkuRef.current = skuDraft.trim() || articleSku.trim() || null;

  useEffect(() => {
    if (!isPhase1) return;
    touchW2DossierSessionOpenedAt(collectionId, articleId);
    setDossierMetricsTick((n) => n + 1);
    warmupW2MetricsStamp(w2DossierMetricsCtx);
  }, [isPhase1, collectionId, articleId, w2DossierMetricsCtx]);

  useEffect(() => {
    if (!isPhase1 || typeof document === 'undefined') return;
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        recordW2DossierAbandonIfNoSaveYet(collectionId, articleId);
        flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [isPhase1, collectionId, articleId, w2DossierMetricsCtx]);

  useEffect(() => {
    if (!isPhase1) return;
    const t = window.setInterval(() => setDossierMetricsTick((n) => n + 1), 45_000);
    return () => clearInterval(t);
  }, [isPhase1]);

  const [nameDraft, setNameDraft] = useState(articleName);
  const [savedHint, setSavedHint] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tzHistoryOpen, setTzHistoryOpen] = useState(false);
  const [tzRevokeDeniedHint, setTzRevokeDeniedHint] = useState<string | null>(null);
  const [handbookCheckSnapshot, setHandbookCheckSnapshot] = useState<HandbookCheckSnapshot | null>(
    null
  );
  const [handbookCheckReportExpanded, setHandbookCheckReportExpanded] = useState(true);
  const [tzNotifyHighlightRowKey, setTzNotifyHighlightRowKey] = useState<string | null>(null);
  const [sketchWorkspaceTab, setSketchWorkspaceTab] = useState<'sketch' | 'sublevels'>('sketch');
  const [sketchSurface, setSketchSurface] = useState<'master' | 'sheets'>('master');
  const [sketchSheetPickerId, setSketchSheetPickerId] = useState<string | null>(null);
  const [subcategorySketchActiveLevel, setSubcategorySketchActiveLevel] = useState<1 | 2 | 3>(3);
  const [branchLevelsDetailsOpen, setBranchLevelsDetailsOpen] = useState(false);
  const [sketchBundleBusy, setSketchBundleBusy] = useState(false);
  const [handoffPdfBusy, setHandoffPdfBusy] = useState(false);
  const [sketchPinLibraryOpen, setSketchPinLibraryOpen] = useState(false);
  const [sketchSnapshotDiffA, setSketchSnapshotDiffA] = useState('');
  const [sketchSnapshotDiffB, setSketchSnapshotDiffB] = useState('');
  const [sketchSnapshotDiffSummary, setSketchSnapshotDiffSummary] = useState<string | null>(null);
  const [sketchMasterTemplateId, setSketchMasterTemplateId] = useState('');
  const [orgSketchLibraryRevision, setOrgSketchLibraryRevision] = useState(0);

  const tzRevokersEffective = tzSignoffRevokerLabels ?? [];
  const tzSignCaps =
    tzDigitalSignoffCapabilities ?? WORKSHOP2_TZ_DIGITAL_SIGNOFF_DEFAULT_CAPABILITIES;
  const tzDigitalSignoffRows = useMemo(() => {
    const b = dossier.tzSignatoryBindings;
    const rows: {
      rowKey: string;
      title: string;
      passportAssigneeName?: string;
      passportAssigneeOrgLabel?: string;
      assigneeForNotify?: string;
      canSign: boolean;
      hasRoleCapability: boolean;
      signatoryMismatchHint?: string;
      signoff?: Workshop2DossierSignoffMeta;
    }[] = [];
    const pushBase = (
      role: 'designer' | 'technologist' | 'manager',
      title: string,
      cap: boolean,
      designated: string | undefined,
      flags: Workshop2TzPerRoleStageFlags | undefined,
      signoff: Workshop2DossierSignoffMeta | undefined
    ) => {
      if (!workshopTzParticipatesOnStage(flags, 'tz')) return;
      const d = designated?.trim();
      const hasAssignee = Boolean(d);
      const assigneeOrgName = workshopTzAssigneeOrganizationName(d);
      const assigneeIsBrand = workshopTzAssigneeBelongsToBrandOrg(d);
      const effectiveAssignee = assigneeIsBrand ? d : undefined;
      const hasEffectiveAssignee = Boolean(effectiveAssignee);
      /** Подписать может только закреплённый в паспорте исполнитель с правом роли. */
      const canSign = cap && hasEffectiveAssignee && workshopTzSignerAllowed(updatedByLabel, effectiveAssignee);
      const mismatch =
        cap && hasAssignee && !assigneeIsBrand
          ? `Для роли «${title}» нужен сотрудник бренда. Сейчас закреплено: ${d}${assigneeOrgName ? ` (${assigneeOrgName})` : ''}.`
          : cap && hasEffectiveAssignee && !workshopTzSignerAllowed(updatedByLabel, effectiveAssignee)
          ? 'Войдите под закреплённым в паспорте пользователем или смените закрепление.'
          : cap && !hasEffectiveAssignee
            ? 'Закрепите исполнителя в паспорте — подписать может только он.'
            : undefined;
      rows.push({
        rowKey: role,
        title,
        passportAssigneeName: effectiveAssignee || undefined,
        passportAssigneeOrgLabel: assigneeOrgName,
        assigneeForNotify: effectiveAssignee,
        canSign,
        hasRoleCapability: cap,
        signatoryMismatchHint: mismatch,
        signoff,
      });
    };
    pushBase(
      'designer',
      'Дизайн',
      tzSignCaps.designer,
      b?.designerDisplayLabel,
      b?.designerSignStages,
      dossier.designerSignoff
    );
    pushBase(
      'technologist',
      'Технолог',
      tzSignCaps.technologist,
      b?.technologistDisplayLabel,
      b?.technologistSignStages,
      dossier.technologistSignoff
    );
    pushBase(
      'manager',
      'Менеджер',
      tzSignCaps.manager,
      b?.managerDisplayLabel,
      b?.managerSignStages,
      dossier.managerSignoff
    );
    for (const ex of workshopTzExtraRowsRequiringTzSignoff(b)) {
      const name = ex.assigneeDisplayLabel?.trim() ?? '';
      const hasAssignee = Boolean(name);
      const canSign = hasAssignee && workshopTzSignerAllowed(updatedByLabel, name);
      const assigneeOrgName = workshopTzAssigneeOrganizationName(name);
      const mismatch = !hasAssignee
        ? 'Закрепите исполнителя в паспорте — подписать может только он.'
        : !workshopTzSignerAllowed(updatedByLabel, name)
          ? 'Войдите под закреплённым в паспорте пользователем или смените закрепление.'
          : undefined;
      rows.push({
        rowKey: `extra:${ex.rowId}`,
        title: ex.roleTitle?.trim() || 'Роль',
        passportAssigneeName: name || undefined,
        passportAssigneeOrgLabel: assigneeOrgName,
        assigneeForNotify: name || undefined,
        canSign,
        hasRoleCapability: true,
        signatoryMismatchHint: mismatch,
        signoff: dossier.extraTzSignoffsByRowId?.[ex.rowId],
      });
    }
    return rows;
  }, [
    dossier.tzSignatoryBindings,
    dossier.designerSignoff,
    dossier.technologistSignoff,
    dossier.managerSignoff,
    dossier.extraTzSignoffsByRowId,
    tzSignCaps.designer,
    tzSignCaps.technologist,
    tzSignCaps.manager,
    updatedByLabel,
  ]);

  const tzDigitalSignoffRowsForActiveSection = useMemo(() => {
    return tzDigitalSignoffRows.filter((row) => {
      if (row.rowKey.startsWith('extra:')) {
        return w2TzDossierSectionShowsExtraSignerRow(activeSection);
      }
      if (row.rowKey === 'designer' || row.rowKey === 'technologist' || row.rowKey === 'manager') {
        return w2TzDossierSectionShowsSignerBaseRole(activeSection, row.rowKey);
      }
      return true;
    });
  }, [tzDigitalSignoffRows, activeSection]);

  const onTzRevokeDenied = useCallback(() => {
    setTzRevokeDeniedHint(
      'Снять цифровую подпись могут только пользователи из списка руководителей (гендиректор, руководитель бренда, зам и т.п.). Обратитесь к администратору.'
    );
    window.setTimeout(() => setTzRevokeDeniedHint(null), 7000);
  }, []);

  /** Ключи `раздел::подписьГруппыКаталога`. Свернутость без «гвоздика» не пишется в LS. */
  const [pinnedAttrGroups, setPinnedAttrGroups] = useState<Set<string>>(() => new Set());
  const [collapsedAttrGroups, setCollapsedAttrGroups] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const { pinned, collapsed } = loadWorkshopAttrGroupUi();
    setPinnedAttrGroups(pinned);
    setCollapsedAttrGroups(collapsed);
    try {
      if (localStorage.getItem(WORKSHOP_ATTR_GROUP_UI_LS_LEGACY)) {
        persistWorkshopAttrGroupUi(pinned, collapsed);
        localStorage.removeItem(WORKSHOP_ATTR_GROUP_UI_LS_LEGACY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleAttrGroupCollapsed = useCallback(
    (groupName: string) => {
      const key = `${activeSection}::${groupName}`;
      setCollapsedAttrGroups((prevCollapsed) => {
        const nextCollapsed = new Set(prevCollapsed);
        if (nextCollapsed.has(key)) nextCollapsed.delete(key);
        else nextCollapsed.add(key);
        setPinnedAttrGroups((prevPinned) => {
          if (prevPinned.has(key)) persistWorkshopAttrGroupUi(prevPinned, nextCollapsed);
          return prevPinned;
        });
        return nextCollapsed;
      });
    },
    [activeSection]
  );

  const toggleAttrGroupPinned = useCallback(
    (groupName: string) => {
      const key = `${activeSection}::${groupName}`;
      setPinnedAttrGroups((prevPinned) => {
        const nextPinned = new Set(prevPinned);
        const wasPinned = nextPinned.has(key);
        if (wasPinned) nextPinned.delete(key);
        else nextPinned.add(key);
        setCollapsedAttrGroups((prevCollapsed) => {
          const nextCollapsed = new Set(prevCollapsed);
          if (wasPinned) nextCollapsed.delete(key);
          persistWorkshopAttrGroupUi(nextPinned, nextCollapsed);
          return nextCollapsed;
        });
        return nextPinned;
      });
    },
    [activeSection]
  );

  useEffect(() => {
    const raw = getWorkshop2Phase1Dossier(collectionId, articleId) ?? emptyWorkshop2DossierPhase1();
    const normalized = normalizeDossierSampleCount(raw);
    setDossierInternal(normalized);
    lastPersistedDossierRef.current = normalized;
    setHandbookCheckSnapshot(null);
  }, [collectionId, articleId, dossierHydrateKey]);

  useEffect(() => {
    setSkuDraft(articleSku);
  }, [articleSku]);

  useEffect(() => {
    setNameDraft(articleName);
  }, [articleName]);

  const leaves = useMemo(() => getHandbookCategoryLeaves(), []);
  const audiences = useMemo(() => getHandbookAudiencesWorkshop2(), []);

  const currentLeaf = useMemo(() => {
    const t = categoryLeafId?.trim();
    if (t && findHandbookLeafById(t)) return findHandbookLeafById(t)!;
    return leaves[0]!;
  }, [categoryLeafId, leaves]);

  useEffect(() => {
    setSketchWorkspaceTab('sketch');
    setSketchSurface('master');
  }, [currentLeaf.leafId]);

  const normalizedSketchSheets = useMemo(
    () => normalizeSketchSheets(dossier.sketchSheets),
    [dossier.sketchSheets]
  );

  useEffect(() => {
    if (normalizedSketchSheets.length === 0) {
      setSketchSheetPickerId(null);
      return;
    }
    setSketchSheetPickerId((prev) => {
      if (prev && normalizedSketchSheets.some((s) => s.sheetId === prev)) return prev;
      return normalizedSketchSheets[0]!.sheetId;
    });
  }, [normalizedSketchSheets]);

  useEffect(() => {
    setSubcategorySketchActiveLevel(3);
  }, [currentLeaf.leafId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setBranchLevelsDetailsOpen(
        localStorage.getItem(WORKSHOP_BRANCH_LEVELS_DETAILS_LS_KEY) === '1'
      );
    } catch {
      /* ignore */
    }
  }, []);

  const prevBranchSlotLevelRef = useRef<1 | 2 | 3>(3);
  useEffect(() => {
    const prev = prevBranchSlotLevelRef.current;
    if (prev === 3 && subcategorySketchActiveLevel !== 3) {
      setBranchLevelsDetailsOpen(true);
    }
    prevBranchSlotLevelRef.current = subcategorySketchActiveLevel;
  }, [subcategorySketchActiveLevel]);

  const sketchWorkspaceStats = useMemo(() => {
    const leafId = currentLeaf.leafId;
    const masterPins = (dossier.categorySketchAnnotations ?? []).filter(
      (a) => a.categoryLeafId === leafId
    ).length;
    const sh = normalizeSketchSheets(dossier.sketchSheets);
    const sheetCount = sh.length;
    const sheetPins = sh.reduce(
      (acc, s) => acc + s.annotations.filter((a) => a.categoryLeafId === leafId).length,
      0
    );
    const sheetsWithImage = sh.filter((s) => Boolean(s.imageDataUrl)).length;
    const slots = dossier.subcategorySketchSlots ?? [];
    const sublevelPins = slots.reduce(
      (acc, s) => acc + s.annotations.filter((a) => a.categoryLeafId === leafId).length,
      0
    );
    return { masterPins, sheetCount, sheetPins, sheetsWithImage, sublevelPins };
  }, [
    currentLeaf.leafId,
    dossier.categorySketchAnnotations,
    dossier.sketchSheets,
    dossier.subcategorySketchSlots,
  ]);

  const passportCriticalAuditSummaries = useMemo(() => {
    const acc: string[] = [];
    for (const e of dossier.tzActionLog ?? []) {
      if (e.action.type === 'dossier_edit') acc.push(...e.action.summaries);
    }
    return [...new Set(filterPassportCriticalAuditLines(acc))];
  }, [dossier.tzActionLog]);

  const dvCaps = useMemo(
    () => workshop2DossierViewUiCaps(dossierViewProfile),
    [dossierViewProfile]
  );
  const showMaterialComplianceNav = dvCaps.materialComplianceStrip;
  const showMaterialBomNormsNav = dvCaps.materialBomNormsStrip;
  const showMaterialSupplyRouteNav = dvCaps.materialSupplyRouteStrip;
  const showVisualSketchExportSurfacesNav = dvCaps.visualSketchExportSurfacesStrip;
  const showVisualSketchLinkFieldsNav = dvCaps.visualSketchPinLinkFieldsStrip;
  const showMaterialCostingHintsNav = dvCaps.materialCostingHintsStrip;

  /** Относительный href — одинаков на SSR и клиенте (избегаем hydration mismatch). */
  const workshop2FactoryShareUrl = useMemo(() => {
    const seg = workshop2ArticleUrlSegment(internalArticleCode, articleId);
    return workshop2ArticleHref(collectionId, seg, {
      w2view: 'factory',
      sketchFloor: true,
      w2step: '1',
      w2sec: 'visuals',
      w2pane: 'tz',
      hash: 'w2-visuals-hub',
    });
  }, [articleId, collectionId, internalArticleCode]);

  const sketchPinLinkAudit = useMemo(() => {
    const leafId = currentLeaf.leafId;
    const master = (dossier.categorySketchAnnotations ?? []).filter(
      (a) => a.categoryLeafId === leafId
    );
    const sh = normalizeSketchSheets(dossier.sketchSheets);
    const sheetPins = sh.flatMap((s) => s.annotations.filter((a) => a.categoryLeafId === leafId));
    const pins = [...master, ...sheetPins];
    if (!showVisualSketchLinkFieldsNav) {
      return [] as { id: string; messages: string[] }[];
    }
    const mode: 'material' | 'qc' | 'strict' =
      dossierViewProfile === 'supply'
        ? 'material'
        : dossierViewProfile === 'qc'
          ? 'qc'
          : dossierViewProfile === 'designer'
            ? 'material'
            : 'strict';
    const out: { id: string; messages: string[] }[] = [];
    for (const pin of pins) {
      const { ok, issues } = validateSketchPinRequiredLinks(pin, mode);
      if (!ok) out.push({ id: pin.annotationId, messages: issues.map((i) => i.message) });
    }
    return out;
  }, [
    currentLeaf.leafId,
    dossier.categorySketchAnnotations,
    dossier.sketchSheets,
    dossierViewProfile,
    showVisualSketchLinkFieldsNav,
  ]);

  const handoffFromVisualToRoute = useCallback(
    (tab: 'fit' | 'qc' | 'supply', domId: string) => {
      onNavigateToTab?.(tab, { scrollDomId: domId });
    },
    [onNavigateToTab]
  );

  const visualRouteHandoffActions = useMemo(
    () =>
      getVisualHandoffTargetsForProfile(dossierViewProfile).map((t) => ({
        id: `w2-vh-${t.tab}`,
        label: t.tab === 'fit' ? 'Посадка' : t.tab === 'qc' ? 'ОТК' : 'Снабжение',
        onClick: () => handoffFromVisualToRoute(t.tab, t.domId),
      })),
    [dossierViewProfile, handoffFromVisualToRoute]
  );

  const appendSketchSheet = useCallback(() => {
    let newId: string | null = null;
    setDossier((p: Workshop2DossierPhase1) => {
      const cur = normalizeSketchSheets(p.sketchSheets);
      if (cur.length >= MAX_SKETCH_SHEETS) return p;
      const sheet = createEmptySketchSheet(`Лист ${cur.length + 1}`);
      newId = sheet.sheetId;
      return { ...p, sketchSheets: [...cur, sheet] };
    });
    if (newId) {
      setSketchSurface('sheets');
      setSketchSheetPickerId(newId);
    }
  }, [setDossier]);

  const selectedAudienceId =
    dossier.selectedAudienceId ??
    (audiences.some((a) => a.id === currentLeaf.audienceId)
      ? currentLeaf.audienceId
      : (audiences[0]?.id ?? currentLeaf.audienceId));
  const effectiveAudienceId = useMemo(
    () => resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId),
    [leaves, selectedAudienceId]
  );

  const baseRows = useMemo(
    () => resolvePhase1AttributeRows(currentLeaf.leafId),
    [currentLeaf.leafId]
  );

  const leafPhase1Ids = useMemo(
    () => resolveAttributeIdsForLeaf(currentLeaf.leafId, 1),
    [currentLeaf.leafId]
  );
  const leafPhase2Ids = useMemo(
    () => resolveAttributeIdsForLeaf(currentLeaf.leafId, 2),
    [currentLeaf.leafId]
  );
  const leafPhase3Ids = useMemo(
    () => resolveAttributeIdsForLeaf(currentLeaf.leafId, 3),
    [currentLeaf.leafId]
  );
  const baseRowsPhase2 = useMemo(
    () => resolvePhase2OnlyAttributeRows(currentLeaf.leafId),
    [currentLeaf.leafId]
  );
  const baseRowsPhase3 = useMemo(
    () => resolvePhase3OnlyAttributeRows(currentLeaf.leafId),
    [currentLeaf.leafId]
  );
  const linkedMatComposition =
    leafPhase1Ids.includes('mat') && leafPhase1Ids.includes('composition');
  const linkedMatCompositionPhase2 =
    leafPhase2Ids.includes('mat') && leafPhase2Ids.includes('composition');
  const linkedMatCompositionPhase3 =
    leafPhase3Ids.includes('mat') && leafPhase3Ids.includes('composition');

  const rowsToShow = useMemo(
    () =>
      baseRows.filter((r) => {
        const id = r.attribute.attributeId;
        if (linkedMatComposition && id === 'composition') return false;
        if (linkedMatComposition && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id)) return false;
        return true;
      }),
    [baseRows, linkedMatComposition]
  );

  const rowsToShowPhase2 = useMemo(
    () =>
      baseRowsPhase2.filter((r) => {
        const id = r.attribute.attributeId;
        if (linkedMatCompositionPhase2 && id === 'composition') return false;
        if (linkedMatCompositionPhase2 && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id))
          return false;
        return true;
      }),
    [baseRowsPhase2, linkedMatCompositionPhase2]
  );

  const rowsToShowPhase3 = useMemo(
    () =>
      baseRowsPhase3.filter((r) => {
        const id = r.attribute.attributeId;
        if (linkedMatCompositionPhase3 && id === 'composition') return false;
        if (linkedMatCompositionPhase3 && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id))
          return false;
        return true;
      }),
    [baseRowsPhase3, linkedMatCompositionPhase3]
  );

  const inferredExtras = useMemo(() => {
    const baseIds = new Set(baseRows.map((r) => r.attribute.attributeId));
    const out: string[] = [];
    for (const a of dossier.assignments) {
      if (a.kind !== 'canonical' || !a.attributeId || baseIds.has(a.attributeId)) continue;
      if (!out.includes(a.attributeId)) out.push(a.attributeId);
    }
    return out;
  }, [dossier.assignments, baseRows]);

  const extraIds = useMemo(() => [...new Set(inferredExtras)], [inferredExtras]);

  const baseAttributeIdSet = useMemo(
    () => new Set(baseRows.map((r) => r.attribute.attributeId)),
    [baseRows]
  );

  const groupById = useMemo(() => {
    const m = new Map<string, string>();
    for (const g of getSortedGroups()) {
      m.set(g.groupId, g.label);
    }
    return m;
  }, []);

  const extraRows = useMemo(() => {
    const rows: { attribute: AttributeCatalogAttribute; groupLabel: string }[] = [];
    for (const id of extraIds) {
      if (baseAttributeIdSet.has(id)) continue;
      if (linkedMatComposition && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id)) continue;
      const attribute = getAttributeById(id);
      if (!attribute || !attributeInWorkflowPhase(attribute, 1)) continue;
      rows.push({
        attribute,
        groupLabel: groupById.get(attribute.groupId) ?? '—',
      });
    }
    rows.sort(
      (a, b) =>
        (groupById.get(a.attribute.groupId) ?? '').localeCompare(
          groupById.get(b.attribute.groupId) ?? '',
          'ru'
        ) || a.attribute.sortOrder - b.attribute.sortOrder
    );
    return rows;
  }, [baseAttributeIdSet, extraIds, groupById, linkedMatComposition]);

  const customAssignments = useMemo(
    () => dossier.assignments.filter((a) => a.kind === 'custom_proposed'),
    [dossier.assignments]
  );

  const persist = useCallback(
    (next: Workshop2DossierPhase1) => {
      if (tzWriteDisabled) {
        toast({
          title: 'Только просмотр',
          description: 'Сохранение недоступно без права «Редактировать производство».',
          variant: 'destructive',
        });
        return;
      }
      let stamped: Workshop2DossierPhase1 = {
        ...next,
        schemaVersion: 1,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedByLabel.slice(0, 256),
      };
      const prevSnap = lastPersistedDossierRef.current;
      if (prevSnap) {
        const summaries = summarizeWorkshop2PersistDiff(prevSnap, stamped);
        if (summaries.length > 0) {
          stamped = pushTzActionLog(stamped, updatedByLabel, { type: 'dossier_edit', summaries });
        }
      }
      lastPersistedDossierRef.current = stamped;
      const savedOk = setWorkshop2Phase1Dossier(collectionId, articleId, stamped);
      setDossierInternal(stamped);
      if (!savedOk) {
        setSaveError(
          'Не удалось сохранить в localStorage (квота или приватный режим). Сожмите фото в референсах/скетче или вынесите в ссылки.'
        );
        toast({
          title: 'Сохранение не записано',
          description: 'Браузер отклонил запись — уменьшите объём вложений в досье.',
          variant: 'destructive',
        });
        return;
      }
      setSaveError(null);
      recordW2DossierPersistSuccess(collectionId, articleId);
      setDossierMetricsTick((n) => n + 1);
      flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
      const toastAt = Date.now();
      if (toastAt - lastPersistSuccessToastAtRef.current >= 3500) {
        lastPersistSuccessToastAtRef.current = toastAt;
        toast({
          title: 'Черновик сохранён',
          description: 'Запись в браузере на этом устройстве.',
        });
      }
      setSavedHint('Черновик сохранён');
      window.setTimeout(() => setSavedHint(null), 4000);
    },
    [collectionId, articleId, updatedByLabel, tzWriteDisabled, toast, w2DossierMetricsCtx]
  );

  const appendPassportPostSignoffJournalNote = useCallback(() => {
    if (tzWriteDisabled) {
      toast({
        title: 'Только просмотр',
        description: 'Запись в журнал недоступна без права редактирования.',
        variant: 'destructive',
      });
      return;
    }
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const withLog = pushTzActionLog(prev, updatedByLabel, {
        type: 'dossier_edit',
        summaries: [
          'Напоминание: досье изменено после подписи ТЗ — пересмотреть подтверждение при существенных правках паспорта / брифа.',
        ],
      });
      const stamped: Workshop2DossierPhase1 = {
        ...withLog,
        schemaVersion: 1,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedByLabel.slice(0, 256),
      };
      lastPersistedDossierRef.current = stamped;
      if (!setWorkshop2Phase1Dossier(collectionId, articleId, stamped)) {
        toast({
          title: 'Запись не сохранена',
          description: 'localStorage переполнен.',
          variant: 'destructive',
        });
        return prev;
      }
      setSaveError(null);
      recordW2DossierPersistSuccess(collectionId, articleId);
      setDossierMetricsTick((n) => n + 1);
      flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
      toast({ title: 'Запись добавлена', description: 'Строка в журнале действий ТЗ.' });
      return stamped;
    });
  }, [collectionId, articleId, toast, tzWriteDisabled, updatedByLabel, w2DossierMetricsCtx]);

  const appendTzSessionJournalNote = useCallback(
    (summary: string) => {
      if (tzWriteDisabled) return;
      setDossierInternal((prev: Workshop2DossierPhase1) => {
        const withLog = pushTzActionLog(prev, updatedByLabel, {
          type: 'dossier_edit',
          summaries: [summary],
        });
        const stamped: Workshop2DossierPhase1 = {
          ...withLog,
          schemaVersion: 1,
          updatedAt: new Date().toISOString(),
          updatedBy: updatedByLabel.slice(0, 256),
        };
        lastPersistedDossierRef.current = stamped;
        if (!setWorkshop2Phase1Dossier(collectionId, articleId, stamped)) {
          return prev;
        }
        return stamped;
      });
    },
    [collectionId, articleId, tzWriteDisabled, updatedByLabel]
  );

  const matAttrDef = getAttributeById('mat');
  const matAttrForLeaf = useMemo(() => {
    if (!matAttrDef) return undefined;
    return {
      ...matAttrDef,
      parameters: resolveEffectiveParametersForLeaf(matAttrDef, currentLeaf),
    };
  }, [matAttrDef, currentLeaf]);

  const matLabelById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of matAttrDef?.parameters ?? []) m.set(p.parameterId, p.label);
    return m;
  }, [matAttrDef]);

  const bomLinePickOptions = useMemo(() => buildBomLinePickOptions(dossier), [dossier]);

  useEffect(() => {
    if (tzWriteDisabled) return;
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const opts = getWorkshopSampleSizeScaleOptions(currentLeaf);
      if (opts.length === 0) {
        if (prev.sampleSizeScaleId?.includes('::')) {
          return { ...prev, sampleSizeScaleId: undefined };
        }
        return prev;
      }
      const valid = new Set(opts.map((o) => o.key));
      if (prev.sampleSizeScaleId && !valid.has(prev.sampleSizeScaleId)) {
        return { ...prev, sampleSizeScaleId: undefined };
      }
      return prev;
    });
  }, [currentLeaf.leafId, tzWriteDisabled]);

  useEffect(() => {
    if (tzWriteDisabled) return;
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const attr = getAttributeById('sampleBaseSize');
      if (!attr) return prev;
      const scale = prev.sampleSizeScaleId ?? defaultSizeScaleIdForLeaf(currentLeaf);
      const params = resolveSampleBaseSizeParametersForLeaf(attr, currentLeaf, scale);
      const allow = new Set(params.map((p) => p.parameterId));
      const a = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      if (!a) return prev;
      const { hbs, ft } = partitionHandbookAndFree(a);
      if (!hbs.length) return prev;
      const keep = hbs.filter((hb) => hb.parameterId && allow.has(hb.parameterId));
      if (keep.length === hbs.length) return prev;
      const parts = keep.map((v) => ({
        parameterId: v.parameterId!,
        displayLabel: v.displayLabel ?? '',
      }));
      const cap = prev.passportProductionBrief?.moqTargetMaxPieces;
      const capped =
        cap != null && Number.isFinite(cap) && cap >= 1 ? parts.slice(0, Math.floor(cap)) : parts;
      return syncSampleBaseSizePartsAndPruneDims(prev, capped, ft?.text ?? '');
    });
  }, [currentLeaf.leafId, tzWriteDisabled]);

  /** Сумки: сузить тип по листу L2/L3 и при одном варианте — выбрать автоматически. */
  useEffect(() => {
    if (tzWriteDisabled) return;
    if (currentLeaf.l1Name !== 'Сумки') return;
    const attr = getAttributeById('bag-type');
    if (!attr) return;
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const allowed = resolveEffectiveParametersForLeaf(attr, currentLeaf);
      const allowSet = new Set(allowed.map((p) => p.parameterId));
      const a = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'bag-type'
      );
      const { hbs, ft } = partitionHandbookAndFree(a);
      const ftText = ft?.text ?? '';
      if (hbs.length) {
        const keep = hbs.filter((h) => h.parameterId && allowSet.has(h.parameterId));
        if (keep.length !== hbs.length) {
          return upsertCanonicalMultiHandbookAndFree(prev, 'bag-type', keep, ftText);
        }
        return prev;
      }
      if (allowed.length === 1) {
        const p = allowed[0]!;
        return upsertCanonicalDual(
          prev,
          'bag-type',
          { parameterId: p.parameterId, displayLabel: p.label },
          ftText
        );
      }
      return prev;
    });
  }, [
    currentLeaf.leafId,
    currentLeaf.l1Name,
    currentLeaf.l2Name,
    currentLeaf.l3Name,
    tzWriteDisabled,
  ]);

  const matRequiredUnset = useMemo(() => {
    if (!isPhase1) return false;
    if (!leafPhase1Ids.includes('mat') || !matAttrDef?.requiredForPhase1) return false;
    const matAssign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === 'mat'
    );
    const hbCount =
      matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
    return hbCount === 0;
  }, [isPhase1, leafPhase1Ids, matAttrDef?.requiredForPhase1, dossier.assignments]);

  /** Сохранить черновик без проверок и без смены шага. */
  const saveDraft = useCallback(() => {
    setSaveError(null);
    persist(dossier);
  }, [dossier, persist]);

  const saveSketchLabelsSnapshot = useCallback(() => {
    const label = window.prompt('Подпись снимка (необязательно)', '')?.trim();
    setDossier((prev: Workshop2DossierPhase1) => {
      const lid = currentLeaf.leafId;
      const masterPins = (prev.categorySketchAnnotations ?? []).filter(
        (a) => a.categoryLeafId === lid
      ).length;
      const sheetPinsTotal = normalizeSketchSheets(prev.sketchSheets).reduce(
        (acc, s) => acc + s.annotations.filter((a) => a.categoryLeafId === lid).length,
        0
      );
      const { dossier: next } = appendSketchLabelSnapshot(
        prev,
        updatedByLabel.slice(0, 200),
        label || undefined
      );
      return pushTzActionLog(next, updatedByLabel, {
        type: 'sketch_labels_snapshot',
        label: label || undefined,
        masterPins,
        sheetPinsTotal,
      });
    });
    toast({ title: 'Снимок меток сохранён', description: 'В досье и в журнале ТЗ.' });
  }, [currentLeaf.leafId, toast, updatedByLabel]);

  const exportSketchVisualBundleZip = useCallback(async () => {
    const openVisualGates = buildWorkshop2VisualGateItems(dossier, currentLeaf).length;
    if (openVisualGates > 0) {
      const ok = window.confirm(
        `Визуальный контур не закрыт (${openVisualGates} ${openVisualGates === 1 ? 'пункт' : 'пункта'}). Экспорт может увести в цех неполный пакет. Продолжить?`
      );
      if (!ok) return;
    }
    setSketchBundleBusy(true);
    try {
      await exportSketchVisualBundle({
        dossier,
        leafId: currentLeaf.leafId,
        pathLabel: currentLeaf.pathLabel,
        articleSku: skuDraft,
        articlePageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        exportSurface: defaultSketchExportSurfaceForDossierView(dossierViewProfile),
      });
      toast({ title: 'Скачан архив', description: 'ZIP: PNG по доскам и PDF паспорт визуала.' });
    } catch {
      toast({ title: 'Не удалось сформировать архив', variant: 'destructive' });
    } finally {
      setSketchBundleBusy(false);
    }
  }, [currentLeaf, dossier, dossierViewProfile, skuDraft, toast]);

  const exportHandoffPdfOnly = useCallback(async () => {
    const openVisualGates = buildWorkshop2VisualGateItems(dossier, currentLeaf).length;
    if (openVisualGates > 0) {
      const ok = window.confirm(
        `Визуальный контур не закрыт (${openVisualGates} ${openVisualGates === 1 ? 'пункт' : 'пункта'}). PDF может не отражать согласованный минимум. Продолжить?`
      );
      if (!ok) return;
    }
    setHandoffPdfBusy(true);
    try {
      await exportTzHandoffPdfOnly({
        dossier,
        leafId: currentLeaf.leafId,
        pathLabel: currentLeaf.pathLabel,
        articleSku: skuDraft,
        articlePageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        exportSurface: defaultSketchExportSurfaceForDossierView(dossierViewProfile),
      });
      toast({
        title: 'Скачан PDF',
        description: 'Паспорт визуала: общий скетч и листы одним файлом.',
      });
    } catch {
      toast({ title: 'Не удалось сформировать PDF', variant: 'destructive' });
    } finally {
      setHandoffPdfBusy(false);
    }
  }, [currentLeaf, dossier, dossierViewProfile, skuDraft, toast]);

  const restoreSketchLabelsFromSnapshot = useCallback(
    (snap: Workshop2SketchLabelsSnapshot) => {
      if (
        !window.confirm(
          'Вернуть метки общего скетча и листов из этого снимка? Для листов, которые есть и в снимке, и сейчас, метки заменятся; новые листы без записи в снимке не меняются.'
        )
      ) {
        return;
      }
      setDossier((prev: Workshop2DossierPhase1) => {
        const restored = restoreSketchLabelsSnapshot(prev, snap);
        return pushTzActionLog(restored, updatedByLabel, {
          type: 'sketch_labels_restore',
          label: snap.label,
          snapshotAt: snap.at,
        });
      });
      toast({ title: 'Метки восстановлены из снимка' });
      setSketchPinLibraryOpen(false);
    },
    [setDossier, toast, updatedByLabel]
  );

  const saveMasterSketchPinTemplate = useCallback(() => {
    const name = window.prompt('Название шаблона меток', '')?.trim();
    if (!name) return;
    const lid = currentLeaf.leafId;
    const anns = dossier.categorySketchAnnotations ?? [];
    const own = anns.filter((a) => a.categoryLeafId === lid);
    if (own.length === 0) {
      toast({
        title: 'Нет меток',
        description: 'На общей доске нет меток для этой ветки каталога.',
        variant: 'destructive',
      });
      return;
    }
    setDossier(
      (p: Workshop2DossierPhase1) =>
        appendSketchPinTemplate(p, { name, sourceLeafId: lid, annotations: anns }).dossier
    );
    toast({ title: 'Шаблон сохранён', description: name });
  }, [currentLeaf.leafId, dossier.categorySketchAnnotations, setDossier, toast]);

  const applyMasterSketchPinTemplate = useCallback(
    (mode: 'merge' | 'replace') => {
      const tid = sketchMasterTemplateId.trim();
      if (!tid) return;
      const org = readOrgSketchPinTemplatesSync(collectionId);
      const t = resolveSketchPinTemplatePick(tid, dossier, org);
      if (!t) return;
      setDossier((p: Workshop2DossierPhase1) =>
        applySketchPinTemplateToMaster(p, t, currentLeaf.leafId, mode)
      );
      toast({
        title: mode === 'merge' ? 'Метки добавлены из шаблона' : 'Метки заменены шаблоном',
        description: t.name,
      });
    },
    [collectionId, currentLeaf.leafId, dossier, setDossier, sketchMasterTemplateId, toast]
  );

  const deleteSketchPinTemplateById = useCallback(
    (templateId: string) => {
      if (!window.confirm('Удалить этот шаблон меток?')) return;
      setDossier((p: Workshop2DossierPhase1) => removeSketchPinTemplate(p, templateId));
      setSketchMasterTemplateId((cur) =>
        cur === `d:${templateId}` || cur === templateId ? '' : cur
      );
      toast({ title: 'Шаблон удалён' });
    },
    [setDossier, toast]
  );

  const saveMasterSketchPinTemplateToOrg = useCallback(() => {
    const cid = String(collectionId ?? '').trim();
    if (!cid) {
      toast({
        title: 'Нет коллекции',
        description: 'Нужен id коллекции, чтобы писать в общую библиотеку этого браузера.',
        variant: 'destructive',
      });
      return;
    }
    const name = window.prompt('Имя в библиотеке коллекции (этот браузер)', '')?.trim();
    if (!name) return;
    const lid = currentLeaf.leafId;
    const anns = dossier.categorySketchAnnotations ?? [];
    const own = anns.filter((a) => a.categoryLeafId === lid);
    if (own.length === 0) {
      toast({
        title: 'Нет меток',
        description: 'На общей доске нет меток для этой ветки каталога.',
        variant: 'destructive',
      });
      return;
    }
    const t = createSketchPinTemplateRecord({ name, sourceLeafId: lid, annotations: anns });
    void appendOrgSketchPinTemplate(cid, t).then(() => {
      setOrgSketchLibraryRevision((n) => n + 1);
      toast({ title: 'Сохранено в библиотеке коллекции', description: name });
    });
  }, [collectionId, currentLeaf.leafId, dossier.categorySketchAnnotations, toast]);

  const deleteOrgSketchPinTemplateById = useCallback(
    (templateId: string) => {
      const cid = String(collectionId ?? '').trim();
      if (!cid) return;
      if (!window.confirm('Удалить шаблон из библиотеки коллекции в этом браузере?')) return;
      void removeOrgSketchPinTemplate(cid, templateId).then(() => {
        setOrgSketchLibraryRevision((n) => n + 1);
        setSketchMasterTemplateId((cur) => (cur === `o:${templateId}` ? '' : cur));
        toast({ title: 'Удалено из библиотеки коллекции' });
      });
    },
    [collectionId, toast]
  );

  const sketchSnapshotsNewestFirst = useMemo(
    () => [...(dossier.sketchLabelSnapshots ?? [])].reverse(),
    [dossier.sketchLabelSnapshots]
  );

  const orgSketchTemplatesList = useMemo(
    () => readOrgSketchPinTemplatesSync(collectionId),
    [collectionId, orgSketchLibraryRevision]
  );

  /** «Следующее» / «Готово»: проверки только на шаге 1, затем сохранение и переход. */
  const handleContinue = useCallback(() => {
    setSaveError(null);
    if (isPhase1) {
      if (leafPhase1Ids.includes('mat') && matAttrDef?.requiredForPhase1) {
        const matAssign = dossier.assignments.find(
          (x) => x.kind === 'canonical' && x.attributeId === 'mat'
        );
        const hbCount =
          matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
        if (hbCount === 0) {
          setSaveError('Выберите материал.');
          return;
        }
        if (linkedMatComposition) {
          const rows = parseMatRowsFromDossier(dossier, matLabelById);
          const sum = rows.reduce((s, r) => s + r.pct, 0);
          if (sum !== 100) {
            setSaveError(`Сумма процентов состава должна быть ровно 100% (сейчас ${sum}%).`);
            return;
          }
        }
      }
      persist(dossier);
      onContinueToNextStep?.();
      return;
    }
    if (isPhase2) {
      if (leafPhase2Ids.includes('mat') && matAttrDef?.requiredForPhase2) {
        const matAssign = dossier.assignments.find(
          (x) => x.kind === 'canonical' && x.attributeId === 'mat'
        );
        const hbCount =
          matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
        if (hbCount === 0) {
          setSaveError('Выберите материал.');
          return;
        }
        if (linkedMatCompositionPhase2) {
          const rows = parseMatRowsFromDossier(dossier, matLabelById);
          const sum = rows.reduce((s, r) => s + r.pct, 0);
          if (sum !== 100) {
            setSaveError(`Сумма процентов состава должна быть ровно 100% (сейчас ${sum}%).`);
            return;
          }
        }
      }
      for (const id of leafPhase2Ids) {
        if (id === 'mat') continue;
        const attr = getAttributeById(id);
        if (!attr?.requiredForPhase2) continue;
        const a = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === id);
        if (!phase1FieldSatisfiedForUi(attr, a)) {
          setSaveError(`Заполните поле «${attr.name}».`);
          return;
        }
      }
      persist(dossier);
      onContinueToStep3?.();
      return;
    }
    if (isPhase3) {
      persist(dossier);
      onFinishWorkshop?.();
    }
  }, [
    dossier,
    isPhase1,
    isPhase2,
    isPhase3,
    leafPhase1Ids,
    leafPhase2Ids,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    matAttrDef?.requiredForPhase1,
    matAttrDef?.requiredForPhase2,
    matLabelById,
    onContinueToNextStep,
    onContinueToStep3,
    onFinishWorkshop,
    persist,
  ]);

  const onSetHandbookParameters = useCallback(
    (attributeId: string, parts: { parameterId: string; displayLabel: string }[]) => {
      setDossier((prev: Workshop2DossierPhase1) => {
        const a = prev.assignments.find(
          (x) => x.kind === 'canonical' && x.attributeId === attributeId
        );
        const { ft } = partitionHandbookAndFree(a);
        return upsertCanonicalMultiHandbookAndFree(prev, attributeId, parts, ft?.text ?? '');
      });
    },
    []
  );

  /** Синхронизация блока «Цвет»: primary → палитра; референс → оттенок/градиент и при пустой группе — основная группа. */
  const onSetHandbookParametersWithColorBundleSync = useCallback(
    (attributeId: string, parts: { parameterId: string; displayLabel: string }[]) => {
      setDossier((prev: Workshop2DossierPhase1) => {
        const a = prev.assignments.find(
          (x) => x.kind === 'canonical' && x.attributeId === attributeId
        );
        const { ft } = partitionHandbookAndFree(a);
        let next = upsertCanonicalMultiHandbookAndFree(prev, attributeId, parts, ft?.text ?? '');

        if (attributeId === 'primaryColorFamilyOptions') {
          const colorAttr = getAttributeById('color');
          if (colorAttr) {
            const effColor = resolveEffectiveParametersForLeaf(colorAttr, currentLeaf);
            const cA = next.assignments.find(
              (x) => x.kind === 'canonical' && x.attributeId === 'color'
            );
            const { hbs: chb, ft: cFt } = partitionHandbookAndFree(cA);
            if (chb.length === 0) {
              const labels = parts.map((p) => p.displayLabel);
              const sug = suggestPaletteFromPrimaryLabels(labels, effColor);
              if (sug) {
                next = upsertCanonicalDual(next, 'color', sug, cFt?.text ?? '');
              } else {
                const hx = suggestHexFromPrimaryLabels(labels);
                /** Не затираем уже введённый «Свой оттенок» / градиент. */
                if (hx && !(cFt?.text ?? '').trim()) {
                  next = upsertCanonicalDual(next, 'color', null, hx);
                }
              }
            }
          }
        }

        if (attributeId === 'colorReferenceSystemOptions' && parts.length > 0) {
          const refAttr = getAttributeById('colorReferenceSystemOptions');
          const sel = refAttr?.parameters.find((x) => x.parameterId === parts[0]!.parameterId);
          const colorAttr = getAttributeById('color');
          if (colorAttr) {
            const effColor = resolveEffectiveParametersForLeaf(colorAttr, currentLeaf);
            const hx = normalizeCatalogHex(sel?.colorHex) ?? extractHex6(parts[0]!.displayLabel);
            if (sel?.gradientCss?.trim()) {
              next = upsertCanonicalDual(next, 'color', null, sel.gradientCss.trim());
            } else if (hx) {
              const match = effColor.find((ep) => normalizeCatalogHex(ep.colorHex) === hx);
              if (match) {
                next = upsertCanonicalDual(
                  next,
                  'color',
                  { parameterId: match.parameterId, displayLabel: match.label },
                  ''
                );
              } else {
                next = upsertCanonicalDual(next, 'color', null, hx);
              }
            }
          }
          const primaryAttr = getAttributeById('primaryColorFamilyOptions');
          if (primaryAttr) {
            const effPrimary = resolveEffectiveParametersForLeaf(primaryAttr, currentLeaf);
            const pA = next.assignments.find(
              (x) => x.kind === 'canonical' && x.attributeId === 'primaryColorFamilyOptions'
            );
            const { hbs: phb, ft: pFt } = partitionHandbookAndFree(pA);
            if (phb.length === 0) {
              const sug = suggestPrimaryFamilyFromPaletteLabel(parts[0]!.displayLabel, effPrimary);
              if (sug) {
                next = upsertCanonicalMultiHandbookAndFree(
                  next,
                  'primaryColorFamilyOptions',
                  [sug],
                  pFt?.text ?? ''
                );
              }
            }
          }
        }

        return next;
      });
    },
    [currentLeaf]
  );

  const onFreeTextSide = useCallback((attributeId: string, text: string) => {
    setDossier((prev: Workshop2DossierPhase1) => {
      const a = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === attributeId
      );
      const { hbs } = partitionHandbookAndFree(a);
      const parts = hbs.map((v) => ({
        parameterId: v.parameterId!,
        displayLabel: v.displayLabel ?? v.parameterId!,
      }));
      return upsertCanonicalMultiHandbookAndFree(prev, attributeId, parts, text);
    });
  }, []);

  const removeCustom = useCallback((assignmentId: string) => {
    setDossier((prev: Workshop2DossierPhase1) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.assignmentId !== assignmentId),
    }));
  }, []);

  const l1Opts = handbookL1OptionsForAudience(leaves, effectiveAudienceId);
  const l2Opts = handbookL2OptionsForAudience(leaves, effectiveAudienceId, currentLeaf.l1Name);
  const l3Opts = handbookL3OptionsForAudience(
    leaves,
    effectiveAudienceId,
    currentLeaf.l1Name,
    currentLeaf.l2Name
  );

  const applyLeaf = useCallback(
    (leafId: string) => {
      const ok = onPatchArticleLine({ categoryLeafId: leafId });
      if (!ok) return;
      const path = findHandbookLeafById(leafId)?.pathLabel ?? leafId;
      setDossier((prev: Workshop2DossierPhase1) =>
        pushTzActionLog(prev, updatedByLabel, {
          type: 'dossier_edit',
          summaries: [`Путь в каталоге: ${path}`],
        })
      );
    },
    [onPatchArticleLine, updatedByLabel]
  );

  const onAudienceSelect = useCallback(
    (audienceId: string) => {
      setDossier((prev: Workshop2DossierPhase1) => ({ ...prev, selectedAudienceId: audienceId }));
      const effective = resolveWorkshop2EffectiveAudienceId(leaves, audienceId);
      const keepCurrentPath =
        leaves.find(
          (l) =>
            l.audienceId === effective &&
            l.l1Name === currentLeaf.l1Name &&
            l.l2Name === currentLeaf.l2Name &&
            l.l3Name === currentLeaf.l3Name
        ) ?? leaves.find((l) => l.audienceId === effective);
      if (keepCurrentPath && keepCurrentPath.leafId !== currentLeaf.leafId)
        applyLeaf(keepCurrentPath.leafId);
    },
    [
      applyLeaf,
      currentLeaf.leafId,
      currentLeaf.l1Name,
      currentLeaf.l2Name,
      currentLeaf.l3Name,
      leaves,
    ]
  );

  const onL1Select = useCallback(
    (l1: string) => {
      const matchAudience = resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId);
      const first = leaves.find((l) => l.audienceId === matchAudience && l.l1Name === l1);
      if (first) applyLeaf(first.leafId);
    },
    [applyLeaf, leaves, selectedAudienceId]
  );

  const onL2Select = useCallback(
    (l2: string) => {
      const matchAudience = resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId);
      const first = leaves.find(
        (l) => l.audienceId === matchAudience && l.l1Name === currentLeaf.l1Name && l.l2Name === l2
      );
      if (first) applyLeaf(first.leafId);
    },
    [applyLeaf, currentLeaf.l1Name, leaves, selectedAudienceId]
  );

  const onL3Select = useCallback(
    (l3: string) => {
      const id = handbookLeafIdFromL123(
        leaves,
        resolveWorkshop2EffectiveAudienceId(leaves, selectedAudienceId),
        currentLeaf.l1Name,
        currentLeaf.l2Name,
        l3
      );
      if (id) applyLeaf(id);
    },
    [applyLeaf, currentLeaf.l1Name, currentLeaf.l2Name, leaves, selectedAudienceId]
  );

  const commitSku = useCallback(() => {
    const next = skuDraft.trim();
    if (!next || next === articleSku) return;
    const ok = onPatchArticleLine({ sku: next });
    if (!ok) {
      setSkuDraft(articleSku);
      toast({
        title: 'Артикул уже используется',
        description: 'В этой подборке уже есть строка с таким нормализованным кодом (SKU).',
        variant: 'destructive',
      });
      return;
    }
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(prev, updatedByLabel, {
        type: 'dossier_edit',
        summaries: [`SKU артикула: ${next}`],
      })
    );
  }, [articleSku, onPatchArticleLine, skuDraft, toast, updatedByLabel]);

  const commitName = useCallback(() => {
    const next = nameDraft.trim();
    if (next === articleName.trim()) return;
    const ok = onPatchArticleLine({ name: next });
    if (!ok) {
      setNameDraft(articleName);
      return;
    }
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(prev, updatedByLabel, {
        type: 'dossier_edit',
        summaries: [`Название артикула: ${next.slice(0, 120)}${next.length > 120 ? '…' : ''}`],
      })
    );
  }, [articleName, onPatchArticleLine, nameDraft, updatedByLabel]);

  const applyMatRows = useCallback(
    (rows: MatPctRow[]) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        applyMatComposition(prev, rows, linkedMatComposition)
      );
    },
    [linkedMatComposition]
  );

  const applyMatSoloParts = useCallback(
    (parts: { parameterId: string; displayLabel: string }[]) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        upsertCanonicalHandbookValues(prev, 'mat', parts)
      );
    },
    []
  );

  const patchColor = useCallback(
    (u: { handbook?: { parameterId: string; displayLabel: string } | null; freeText?: string }) => {
      setDossier((prev: Workshop2DossierPhase1) => {
        const a = prev.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'color');
        const { hbs, ft } = partitionHandbookAndFree(a);
        const hb = hbs[0];
        const nextHb =
          u.handbook !== undefined
            ? u.handbook
            : hb?.parameterId
              ? { parameterId: hb.parameterId, displayLabel: hb.displayLabel ?? '' }
              : null;
        const nextFt = u.freeText !== undefined ? u.freeText : (ft?.text ?? '');
        let next = upsertCanonicalDual(prev, 'color', nextHb, nextFt);

        if (u.handbook !== undefined && nextHb?.displayLabel) {
          const primaryAttr = getAttributeById('primaryColorFamilyOptions');
          if (primaryAttr) {
            const effPrimary = resolveEffectiveParametersForLeaf(primaryAttr, currentLeaf);
            const pA = next.assignments.find(
              (x) => x.kind === 'canonical' && x.attributeId === 'primaryColorFamilyOptions'
            );
            const { hbs: phb } = partitionHandbookAndFree(pA);
            if (phb.length === 0) {
              const sug = suggestPrimaryFamilyFromPaletteLabel(nextHb.displayLabel, effPrimary);
              if (sug) {
                const { ft: pFt } = partitionHandbookAndFree(pA);
                next = upsertCanonicalMultiHandbookAndFree(
                  next,
                  'primaryColorFamilyOptions',
                  [sug],
                  pFt?.text ?? ''
                );
              }
            }
          }
        }
        return next;
      });
    },
    [currentLeaf]
  );

  const allowMultiHandbook = isPhase1 || isPhase2 || isPhase3;

  const attributeIdsLinkedOnSketch = useMemo(() => {
    const lid = currentLeaf.leafId;
    const ids = new Set<string>();
    const visit = (anns: Workshop2Phase1CategorySketchAnnotation[] | undefined) => {
      for (const a of anns ?? []) {
        if (a.categoryLeafId !== lid) continue;
        const aid = a.linkedAttributeId?.trim();
        if (aid) ids.add(aid);
      }
    };
    visit(dossier.categorySketchAnnotations);
    for (const sh of dossier.sketchSheets ?? []) visit(sh.annotations);
    return ids;
  }, [currentLeaf.leafId, dossier.categorySketchAnnotations, dossier.sketchSheets]);

  const renderAttributeCard = (
    attribute: AttributeCatalogAttribute,
    groupLabel: string | undefined,
    variant: 'base' | 'extra',
    frame: 'card' | 'plain' = 'card',
    workshopPhase?: '1' | '2' | '3',
    showAttributeNameHintIcon = false
  ) => {
    const effParams = resolveEffectiveParametersForLeaf(attribute, currentLeaf);
    const attrForEditor: AttributeCatalogAttribute = { ...attribute, parameters: effParams };
    const editor = (
      <AttributeRowEditor
        attribute={attrForEditor}
        dossier={dossier}
        allowMultiHandbook={allowMultiHandbook}
        onSetHandbookParameters={onSetHandbookParameters}
        onFreeTextSide={onFreeTextSide}
        patchColor={attribute.attributeId === 'color' ? patchColor : undefined}
      />
    );
    const suppressCatalogInlineDescriptions =
      (activeSection === 'general' &&
        (groupLabel === 'Паспорт' || groupLabel === 'Доп. атрибуты')) ||
      (activeSection === 'material' &&
        currentLeaf.l2Name === 'Верхняя одежда' &&
        groupLabel === WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL) ||
      (activeSection === 'material' && MATERIAL_GUIDE_ATTR_IDS.has(attribute.attributeId)) ||
      (activeSection === 'construction' &&
        getWorkshop2ConstructionTabMergedGroupIds().has(attribute.groupId));

    const body =
      attribute.attributeId === 'techPackRef' && activeSection !== 'construction' ? null : attribute.attributeId === 'techPackRef' ? (
        <div className="space-y-3">
          <TechPackAttachmentsBlock
            attachments={dossier.techPackAttachments ?? []}
            onChange={(next) =>
              setDossier((p: Workshop2DossierPhase1) => ({ ...p, techPackAttachments: next }))
            }
          />
          {editor}
        </div>
      ) : attribute.attributeId === 'sampleBaseSize' ? (
        <SampleBaseSizeBlock
          attribute={attribute}
          currentLeaf={currentLeaf}
          dossier={dossier}
          setDossier={setDossier}
          setDossierInternal={setDossierInternal}
          tzWriteDisabled={tzWriteDisabled}
          onFreeTextSide={onFreeTextSide}
          syncSampleBaseSizePartsAndPruneDims={syncSampleBaseSizePartsAndPruneDims}
        />
      ) : (
        editor
      );

    const showRequired =
      (workshopPhase === '1' && attribute.requiredForPhase1) ||
      (workshopPhase === '2' && attribute.requiredForPhase2);
    const assignment = dossier.assignments.find((a) => a.attributeId === attribute.attributeId);
    const isDeferred = fieldDeferralIds.has(attribute.attributeId);
    const isFilled = phase1FieldSatisfiedForUi(attribute, assignment);
    const isMissingRequired = showRequired && !isFilled && !isDeferred;

    const hideMaterialFlatGroupCrumb =
      activeSection === 'material' &&
      groupLabel &&
      (groupLabel === 'Доп. атрибуты' ||
        groupLabel === 'Материалы' ||
        groupLabel === WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL);

    const fieldDeferId = `w2-field-defer-${attribute.attributeId}`;
    const header = (
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <div className="min-w-0 flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-0">
          {showRequired ? (
            <span
              className={cn(
                isDeferred
                  ? WORKSHOP_REQUIRED_BADGE_DEFER_CLASS
                  : isMissingRequired
                    ? WORKSHOP_REQUIRED_BADGE_TODO_CLASS
                    : WORKSHOP_REQUIRED_BADGE_DONE_CLASS,
                isMissingRequired && 'animate-pulse'
              )}
            >
              {isDeferred ? 'Позже' : isMissingRequired ? 'Заполните' : 'Обязательный'}
            </span>
          ) : null}
          {frame === 'card' &&
          groupLabel &&
          groupLabel !== 'Паспорт' &&
          !hideMaterialFlatGroupCrumb ? (
            <span
              className={cn(
                'text-[9px] font-semibold uppercase tracking-tight',
                groupLabel && WORKSHOP_GROUP_LABEL_AMBER.has(groupLabel)
                  ? 'text-orange-800'
                  : variant === 'base'
                    ? 'text-text-muted font-bold'
                    : 'text-accent-primary font-bold'
              )}
            >
              {groupLabel}
            </span>
          ) : null}
          <span className="inline-flex min-w-0 items-center gap-0.5">
            <span
              className={cn(
                'text-sm font-semibold',
                showRequired
                  ? isDeferred
                    ? 'text-text-secondary'
                    : isMissingRequired
                      ? 'text-red-600'
                      : 'text-emerald-700'
                  : isDeferred
                    ? 'text-text-secondary'
                    : 'text-text-primary'
              )}
            >
              {attribute.name}
            </span>
            {showAttributeNameHintIcon ? <WorkshopAttributeHintIcon attribute={attribute} /> : null}
            {attributeIdsLinkedOnSketch.has(attribute.attributeId) ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex rounded-full bg-teal-100 p-0.5 text-teal-700"
                    aria-label="Есть метка на скетче"
                  >
                    <LucideIcons.MapPin className="h-3 w-3 shrink-0" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[240px] text-xs">
                  К атрибуту привязана метка на общем скетче или скетч-листе
                </TooltipContent>
              </Tooltip>
            ) : null}
          </span>
        </div>
        <div className="border-border-subtle text-text-secondary flex shrink-0 items-center gap-1.5 rounded-md border bg-bg-surface2/50 px-1.5 py-0.5">
          <Checkbox
            id={fieldDeferId}
            checked={isDeferred}
            onCheckedChange={(v) => toggleFieldDeferral(attribute.attributeId, v === true)}
            disabled={tzWriteDisabled}
            className="h-3.5 w-3.5"
            aria-label="Временно не требовать заполнения"
          />
          <label
            htmlFor={fieldDeferId}
            className="text-text-secondary cursor-pointer select-none text-[10px] leading-tight"
          >
            Позже
          </label>
        </div>
      </div>
    );

    if (frame === 'plain') {
      return (
        <div key={attribute.attributeId} className="space-y-2">
          {header}
          {body}
        </div>
      );
    }

    return (
      <li
        id={
          attribute.attributeId === 'sampleBaseSize'
            ? 'w2-measurements-table'
            : `w2-attr-${attribute.attributeId}`
        }
        key={attribute.attributeId}
        className={cn(
          'scroll-mt-24 space-y-2 rounded-lg border p-3 transition-all',
          variant === 'base'
            ? isMissingRequired
              ? 'border-amber-200 bg-amber-50/30 ring-1 ring-amber-100'
              : 'border-border-subtle bg-bg-surface2/40'
            : 'border-accent-primary/20 bg-accent-primary/10',
          activeSection === 'visuals' &&
            sketchVisualCatalogHighlightSet.has(attribute.attributeId) &&
            'ring-accent-primary/90 ring-2 ring-offset-2 ring-offset-white'
        )}
      >
        {header}
        {attribute.uiInformationHint &&
        !showAttributeNameHintIcon &&
        !suppressCatalogInlineDescriptions ? (
          <p className="border-border-subtle bg-bg-surface2/80 text-text-secondary rounded-md border px-2 py-1.5 text-[10px] leading-snug">
            {attribute.uiInformationHint}
          </p>
        ) : null}
        {body}
      </li>
    );
  };

  const renderPhaseRow = (
    row: ResolvedPhase1AttributeRow,
    phase: '1' | '2' | '3',
    showAttributeNameHintIcon = false
  ) => {
    if (row.attribute.attributeId === 'mat' && matAttrDef && matAttrForLeaf) {
      const linked =
        phase === '1'
          ? linkedMatComposition
          : phase === '2'
            ? linkedMatCompositionPhase2
            : linkedMatCompositionPhase3;
      const liKey =
        phase === '1'
          ? 'mat-composition'
          : phase === '2'
            ? 'mat-composition-p2'
            : 'mat-composition-p3';
      const matAssign = dossier.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'mat'
      );
      const matHbCount =
        matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
      const matUnset =
        (phase === '1' && matAttrDef.requiredForPhase1 && matHbCount === 0) ||
        (phase === '2' && matAttrDef.requiredForPhase2 && matHbCount === 0);
      const matShowReq =
        (phase === '1' && matAttrDef.requiredForPhase1) ||
        (phase === '2' && matAttrDef.requiredForPhase2);
      const matPctState = matCompositionPctState(dossier, matAttrForLeaf, linked);
      const matCompositionSumInvalid = linked && matPctState.invalid;
      const showMaterialIntroAndGuides = activeSection === 'material' && phase === '1';

      return (
        <li
          key={liKey}
          id={showMaterialIntroAndGuides ? 'w2-material-required-section' : undefined}
          className={cn(
            'border-border-default space-y-3 rounded-lg border bg-white p-4 shadow-sm',
            matCompositionSumInvalid &&
              'ring-offset-bg-surface2/80 shadow-sm ring-2 ring-amber-400/90 ring-offset-2'
          )}
        >
          {showMaterialIntroAndGuides ? (
            <div className="border-border-default rounded-lg border bg-white p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-text-primary text-sm font-semibold">Материалы</h3>
                  <p className="text-text-secondary text-[11px] leading-snug">
                    Состав и параметры полотна — в BOM и на фабрику. Подсказки к полям — в пульсе
                    раздела (кнопка выше).
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
            {matShowReq ? (
              <span
                className={
                  matUnset ? WORKSHOP_REQUIRED_BADGE_TODO_CLASS : WORKSHOP_REQUIRED_BADGE_DONE_CLASS
                }
              >
                {matUnset ? 'Заполните' : 'Обязательный'}
              </span>
            ) : null}
          </div>
          <MaterialCompositionBlock
            dossier={dossier}
            matAttribute={matAttrForLeaf}
            linkedComposition={linked}
            onApplyRows={applyMatRows}
            onApplySoloParts={applyMatSoloParts}
            showMaterialRequiredHint={phase === '1' && matRequiredUnset}
            l2Name={currentLeaf.l2Name}
            leafId={currentLeaf.leafId}
            l3Name={currentLeaf.l3Name}
          />
        </li>
      );
    }
    return renderAttributeCard(
      row.attribute,
      row.group?.label,
      'base',
      'card',
      phase,
      showAttributeNameHintIcon
    );
  };

  const sketchAttributeOptions = useMemo(
    () =>
      baseRows
        .map((row) => ({ id: row.attribute.attributeId, label: row.attribute.name }))
        .sort((a, b) => a.label.localeCompare(b.label, 'ru')),
    [baseRows]
  );

  const currentPhase: '1' | '2' | '3' = isPhase2 ? '2' : isPhase3 ? '3' : '1';
  const phaseRowsCurrent = isPhase2 ? rowsToShowPhase2 : isPhase3 ? rowsToShowPhase3 : rowsToShow;
  const sectionRowsCurrent = phaseRowsCurrent.filter(
    (row) => getSectionForAttr(row.attribute.attributeId, row.group?.groupId) === activeSection
  );
  const extraRowsCurrent = !isPhase1
    ? []
    : extraRows.filter(
        ({ attribute }) =>
          getSectionForAttr(attribute.attributeId, attribute.groupId) === activeSection
      );

  const sketchTechGaps = useMemo(
    () => workshop2SketchTechnologistGaps(dossier, currentLeaf.leafId),
    [dossier, currentLeaf.leafId]
  );

  const visualsCatalogAttributeIdsForSketch = useMemo(() => {
    const phaseRows = isPhase2 ? rowsToShowPhase2 : isPhase3 ? rowsToShowPhase3 : rowsToShow;
    const base = phaseRows
      .filter(
        (row) => getSectionForAttr(row.attribute.attributeId, row.group?.groupId) === 'visuals'
      )
      .map((r) => r.attribute.attributeId);
    const ex = isPhase1
      ? extraRows
          .filter(
            ({ attribute }) =>
              getSectionForAttr(attribute.attributeId, attribute.groupId) === 'visuals'
          )
          .map((e) => e.attribute.attributeId)
      : [];
    return [...new Set([...base, ...ex])];
  }, [isPhase1, isPhase2, isPhase3, extraRows, rowsToShow, rowsToShowPhase2, rowsToShowPhase3]);

  const visualsCatalogSketchLinksForPins = useMemo((): VisualCatalogSketchLinkRow[] => {
    const phaseRows = isPhase2 ? rowsToShowPhase2 : isPhase3 ? rowsToShowPhase3 : rowsToShow;
    const raw: VisualCatalogSketchLinkRow[] = [];
    for (const row of phaseRows) {
      if (getSectionForAttr(row.attribute.attributeId, row.group?.groupId) !== 'visuals') continue;
      raw.push({
        attributeId: row.attribute.attributeId,
        sketchHighlightForPinTypes: row.attribute.sketchHighlightForPinTypes,
      });
    }
    if (isPhase1) {
      for (const { attribute } of extraRows) {
        if (getSectionForAttr(attribute.attributeId, attribute.groupId) !== 'visuals') continue;
        raw.push({
          attributeId: attribute.attributeId,
          sketchHighlightForPinTypes: attribute.sketchHighlightForPinTypes,
        });
      }
    }
    const byId = new Map<string, VisualCatalogSketchLinkRow>();
    for (const x of raw) {
      const prev = byId.get(x.attributeId);
      if (!prev) {
        byId.set(x.attributeId, x);
        continue;
      }
      const mergedPins = [
        ...new Set([
          ...(prev.sketchHighlightForPinTypes ?? []),
          ...(x.sketchHighlightForPinTypes ?? []),
        ]),
      ];
      byId.set(x.attributeId, {
        attributeId: x.attributeId,
        sketchHighlightForPinTypes: mergedPins.length ? mergedPins : undefined,
      });
    }
    return [...byId.values()];
  }, [isPhase1, isPhase2, isPhase3, extraRows, rowsToShow, rowsToShowPhase2, rowsToShowPhase3]);

  const generalRowsForPassport = useMemo(
    () =>
      phaseRowsCurrent.filter(
        (row) => getSectionForAttr(row.attribute.attributeId, row.group?.groupId) === 'general'
      ),
    [phaseRowsCurrent]
  );

  const generalPassportExtraRows = useMemo(
    () =>
      isPhase1
        ? extraRows.filter(
            ({ attribute }) =>
              getSectionForAttr(attribute.attributeId, attribute.groupId) === 'general'
          )
        : [],
    [extraRows, isPhase1]
  );

  const { startRows: generalPassportStartRows, preSampleRows: generalPassportPreSampleRows } =
    useMemo(() => partitionGeneralPassportRows(generalRowsForPassport), [generalRowsForPassport]);

  const {
    startExtras: generalPassportStartExtras,
    preSampleExtras: generalPassportPreSampleExtras,
  } = useMemo(
    () => partitionGeneralPassportExtras(generalPassportExtraRows),
    [generalPassportExtraRows]
  );

  const passportHubModel = useMemo(
    () =>
      buildPassportHubModel(
        dossier,
        skuDraft,
        nameDraft,
        selectedAudienceId,
        currentLeaf,
        generalPassportStartRows,
        generalPassportPreSampleRows,
        currentPhase
      ),
    [
      dossier,
      skuDraft,
      nameDraft,
      selectedAudienceId,
      currentLeaf,
      generalPassportStartRows,
      generalPassportPreSampleRows,
      currentPhase,
    ]
  );

  const visualGateOpenCountGlobal = useMemo(
    () => buildWorkshop2VisualGateItems(dossier, currentLeaf).length,
    [dossier, currentLeaf]
  );

  const dossierMetricsFooterLine = useMemo(
    () => (isPhase1 ? formatW2DossierMetricsFooterLine(collectionId, articleId) : null),
    [isPhase1, collectionId, articleId, dossierMetricsTick, dossier.updatedAt]
  );

  const expectedScaleId = defaultSizeScaleIdForLeaf(currentLeaf);
  const dimensionLabels = getWorkshopDimensionLabels(currentLeaf);
  const handbookWarnings = useMemo(() => {
    const warnings: string[] = [];
    const hasVisuals = Boolean(
      dossier.categorySketchImageDataUrl ||
      dossier.categorySketchAnnotations?.length ||
      dossier.visualReferences?.length ||
      dossier.brandNotes?.trim()
    );
    if (!hasVisuals)
      warnings.push(
        'Нет визуального замысла: добавьте основной эскиз, референсы или описание замысла.'
      );
    if (!dossier.sampleSizeScaleId)
      warnings.push(`Размерная шкала не выбрана. Для этой категории ожидается ${expectedScaleId}.`);
    if (dossier.sampleSizeScaleId && dossier.sampleSizeScaleId !== expectedScaleId) {
      warnings.push(
        `Текущая размерная шкала (${dossier.sampleSizeScaleId}) отличается от ожидаемой по справочнику (${expectedScaleId}).`
      );
    }
    if (
      !dossier.sampleBasePerSizeDimensions ||
      Object.keys(dossier.sampleBasePerSizeDimensions).length === 0
    ) {
      warnings.push('Табель мер пуст: для передачи в образец нужны размеры и габариты.');
    }
    if (dimensionLabels.length > 0 && dossier.sampleBasePerSizeDimensions) {
      const missingDimLabels = new Set<string>();
      for (const sizeRow of Object.values(dossier.sampleBasePerSizeDimensions)) {
        for (const label of dimensionLabels) {
          if (!sizeRow[label]?.trim()) missingDimLabels.add(label);
        }
      }
      if (missingDimLabels.size > 0) {
        warnings.push(
          `Не заполнены handbook-мерки: ${[...missingDimLabels].slice(0, 4).join(', ')}${missingDimLabels.size > 4 ? '…' : ''}.`
        );
      }
    }
    if (
      leafPhase1Ids.includes('mat') &&
      !dossier.assignments.some((a) => a.attributeId === 'mat' && a.values.length > 0)
    ) {
      warnings.push('Основной материал не подтвержден в ТЗ.');
    }
    const reqD = workshopTzSignoffRequiredForRole(dossier.tzSignatoryBindings, 'designer');
    const reqT = workshopTzSignoffRequiredForRole(dossier.tzSignatoryBindings, 'technologist');
    const reqM = workshopTzSignoffRequiredForRole(dossier.tzSignatoryBindings, 'manager');
    if (reqD && !dossier.isVerifiedByDesigner) warnings.push('Нет цифровой подписи дизайнера.');
    if (reqT && !dossier.isVerifiedByTechnologist) warnings.push('Нет цифровой подписи технолога.');
    if (reqM && !dossier.isVerifiedByManager) warnings.push('Нет цифровой подписи менеджера.');
    for (const ex of workshopTzExtraRowsRequiringTzSignoff(dossier.tzSignatoryBindings)) {
      if (!dossier.extraTzSignoffsByRowId?.[ex.rowId]) {
        warnings.push(
          `Нет цифровой подписи для роли «${ex.roleTitle?.trim() || 'Роль'}» (этап ТЗ).`
        );
      }
    }
    const cap = dossier.passportProductionBrief?.moqTargetMaxPieces;
    if (cap != null && Number.isFinite(cap) && cap >= 1) {
      const sa = dossier.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs } = partitionHandbookAndFree(sa);
      if (hbs.length !== cap) {
        warnings.push(
          `Выберите в справочнике ровно ${cap} размер(а/ов) — по количеству образцов в паспорте.`
        );
      }
      const pids = new Set(hbs.map((v) => v.parameterId!));
      const sum = sumSampleBasePieceQtyForPids(dossier.sampleBasePerSizePieceQty, pids);
      if (sum > cap) {
        warnings.push('Сумма «Кол-во, шт» в табеле превышает количество образцов в паспорте.');
      }
    }
    return warnings;
  }, [dimensionLabels, dossier, expectedScaleId, leafPhase1Ids]);

  const sectionReadiness = useMemo(() => {
    const values = Object.fromEntries(
      SECTIONS.map((section) => {
        const completion = calculateWorkshopTzSectionCompletion(
          section.id,
          dossier,
          phaseRowsCurrent,
          {
            tzPhase: currentPhase,
          }
        );
        const status = getWorkshopTzSectionStatusLabel(section.id, dossier, phaseRowsCurrent, {
          tzPhase: currentPhase,
        });
        return [section.id, { ...completion, status }];
      })
    ) as Record<DossierSection, { done: number; total: number; pct: number; status: string }>;
    return values;
  }, [phaseRowsCurrent, dossier, currentPhase]);

  const dossierNavPrimarySections = useMemo(
    () =>
      dossierViewProfile === 'full'
        ? SECTIONS
        : SECTIONS.filter((s) => isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id)),
    [dossierViewProfile]
  );
  const dossierNavSecondarySections = useMemo(
    () =>
      dossierViewProfile === 'full'
        ? []
        : SECTIONS.filter((s) => !isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id)),
    [dossierViewProfile]
  );

  const w2ViewPrevForSectionSyncRef = useRef<Workshop2DossierViewProfile | null>(null);
  useEffect(() => {
    if (!isPhase1) return;
    const prev = w2ViewPrevForSectionSyncRef.current;
    w2ViewPrevForSectionSyncRef.current = dossierViewProfile;
    if (prev === null) return;
    if (prev === dossierViewProfile) return;
    if (dossierViewProfile === 'full') return;
    if (isWorkshop2DossierViewPrimarySection(dossierViewProfile, activeSection)) return;
    const nextSec = dossierNavPrimarySections[0]?.id;
    if (nextSec) setActiveSection(nextSec);
  }, [dossierViewProfile, isPhase1, activeSection, dossierNavPrimarySections]);

  useEffect(() => {
    if (!isPhase1 || typeof window === 'undefined') return;
    const scoped = `${collectionId}:${articleId}`;
    try {
      const raw = sessionStorage.getItem(`w2-mat-comp:${scoped}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      if (!parsed || typeof parsed !== 'object') return;
      setDossierInternal((p) => {
        const cur = p.materialComplianceChecklist;
        if (cur && Object.keys(cur).length > 0) return p;
        return { ...p, materialComplianceChecklist: parsed };
      });
      sessionStorage.removeItem(`w2-mat-comp:${scoped}`);
    } catch {
      /* ignore */
    }
  }, [isPhase1, collectionId, articleId, dossierHydrateKey]);

  const materialBomHubModel = useMemo(() => {
    const matOnLeaf =
      currentPhase === '1'
        ? leafPhase1Ids.includes('mat')
        : currentPhase === '2'
          ? leafPhase2Ids.includes('mat')
          : leafPhase3Ids.includes('mat');
    const matRequired =
      currentPhase === '1'
        ? Boolean(matOnLeaf && matAttrDef?.requiredForPhase1)
        : currentPhase === '2'
          ? Boolean(matOnLeaf && matAttrDef?.requiredForPhase2)
          : false;
    const linkedMatForPhase =
      currentPhase === '1'
        ? linkedMatComposition
        : currentPhase === '2'
          ? linkedMatCompositionPhase2
          : linkedMatCompositionPhase3;
    const matAssign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === 'mat'
    );
    const hbCount =
      matAssign?.values.filter((v) => v.valueSource === 'handbook_parameter').length ?? 0;
    let compSum: number | null = null;
    if (linkedMatForPhase) {
      const rows = parseMatRowsFromDossier(dossier, matLabelById);
      compSum = rows.reduce((s, r) => s + r.pct, 0);
    }
    return buildMaterialBomHubModel({
      matRequired,
      matHandbookLineCount: hbCount,
      linkedMatComposition: linkedMatForPhase,
      compositionPctSum: compSum,
      materialSectionPct: sectionReadiness.material.pct,
    });
  }, [
    currentPhase,
    leafPhase1Ids,
    leafPhase2Ids,
    leafPhase3Ids,
    matAttrDef?.requiredForPhase1,
    matAttrDef?.requiredForPhase2,
    dossier,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    linkedMatCompositionPhase3,
    matLabelById,
    sectionReadiness.material.pct,
  ]);

  const materialSketchBomStripModel = useMemo(
    () =>
      buildMaterialSketchBomStrip(
        currentLeaf.leafId,
        dossier.categorySketchAnnotations,
        dossier.categorySketchRevisionSnapshots
      ),
    [currentLeaf.leafId, dossier.categorySketchAnnotations, dossier.categorySketchRevisionSnapshots]
  );

  const materialBomExportInput = useMemo((): MaterialBomExportInput => {
    const matAssign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === 'mat'
    );
    const matLines = (matAssign?.values ?? [])
      .filter((v) => v.valueSource === 'handbook_parameter')
      .map((v) => v.displayLabel.trim())
      .filter(Boolean);
    const rows = parseMatRowsFromDossier(dossier, matLabelById);
    const linked =
      currentPhase === '1'
        ? linkedMatComposition
        : currentPhase === '2'
          ? linkedMatCompositionPhase2
          : linkedMatCompositionPhase3;
    return {
      sku: skuDraft.trim() || articleId,
      productName: nameDraft.trim() || currentLeaf.pathLabel,
      l2Name: currentLeaf.l2Name,
      tzPhase: currentPhase,
      matLines,
      composition: rows.map((r) => ({ label: r.label, pct: r.pct })),
      linkedComposition: linked,
    };
  }, [
    currentPhase,
    dossier,
    matLabelById,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    linkedMatCompositionPhase3,
    skuDraft,
    articleId,
    nameDraft,
    currentLeaf.pathLabel,
    currentLeaf.l2Name,
  ]);

  const sketchBomRefsUnion = useMemo(
    () =>
      bomRefsUnionFromSketchSurfaces(
        dossier.categorySketchAnnotations,
        normalizeSketchSheets(dossier.sketchSheets),
        currentLeaf.leafId
      ),
    [currentLeaf.leafId, dossier.categorySketchAnnotations, dossier.sketchSheets]
  );

  const matSketchBomGapRefs = useMemo(
    () => sketchBomRefsMissingFromMatLines(sketchBomRefsUnion, materialBomExportInput.matLines),
    [sketchBomRefsUnion, materialBomExportInput.matLines]
  );

  const materialCategoryNotes = useMemo(
    () => buildMaterialCategoryNotes(currentLeaf.l2Name),
    [currentLeaf.l2Name]
  );

  const openSketchFromMaterialHub = useCallback(() => {
    setConstructionTzHubOpen(true);
    setActiveSection('construction');
    window.setTimeout(() => {
      document.getElementById(W2_VISUALS_SKETCH_ANCHOR_ID)?.scrollIntoView({
        behavior: tzScrollBehavior,
        block: 'start',
      });
    }, 120);
  }, [tzScrollBehavior]);

  const overallReadinessPct = Math.round(
    SECTIONS.reduce((sum, section) => sum + sectionReadiness[section.id].pct, 0) / SECTIONS.length
  );
  const selectedAudienceLabel =
    audiences.find((audience) => audience.id === selectedAudienceId)?.name ?? selectedAudienceId;
  const reqDesigner = workshopTzSignoffRequiredForRole(dossier.tzSignatoryBindings, 'designer');
  const reqTechnologist = workshopTzSignoffRequiredForRole(
    dossier.tzSignatoryBindings,
    'technologist'
  );
  const reqManager = workshopTzSignoffRequiredForRole(dossier.tzSignatoryBindings, 'manager');
  const extrasReqTzSignoff = workshopTzExtraRowsRequiringTzSignoff(dossier.tzSignatoryBindings);
  const approvalsDone =
    Number(!reqDesigner || Boolean(dossier.isVerifiedByDesigner)) +
    Number(!reqTechnologist || Boolean(dossier.isVerifiedByTechnologist)) +
    Number(!reqManager || Boolean(dossier.isVerifiedByManager)) +
    extrasReqTzSignoff.reduce(
      (n, ex) => n + Number(Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId])),
      0
    );
  const allTzDigitalSignoffsDone =
    (!reqDesigner || Boolean(dossier.isVerifiedByDesigner)) &&
    (!reqTechnologist || Boolean(dossier.isVerifiedByTechnologist)) &&
    (!reqManager || Boolean(dossier.isVerifiedByManager)) &&
    extrasReqTzSignoff.every((ex) => Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId]));
  const handbookCheckClean = useMemo(() => {
    if (!handbookCheckSnapshot) return false;
    const hasSectionOrGlobal =
      SECTIONS.some((s) => (handbookCheckSnapshot.bySection[s.id]?.length ?? 0) > 0) ||
      (handbookCheckSnapshot.globalHandbookWarnings?.length ?? 0) > 0;
    const hasAspectFailures = (handbookCheckSnapshot.checkAspects ?? []).some((a) => !a.ok);
    return !(hasSectionOrGlobal || hasAspectFailures);
  }, [handbookCheckSnapshot]);
  const stageBoardHandbookWarnings = handbookCheckSnapshot?.bySection[activeSection] ?? [];

  useEffect(() => {
    if (!handbookCheckSnapshot) return;
    setHandbookCheckReportExpanded(true);
  }, [handbookCheckSnapshot?.checkedAtIso]);

  useEffect(() => {
    if (!handbookCheckSnapshot || !handbookCheckClean) return;
    const id = window.setTimeout(() => setHandbookCheckReportExpanded(false), 5000);
    return () => window.clearTimeout(id);
  }, [handbookCheckSnapshot?.checkedAtIso, handbookCheckClean]);

  const notifyResponsibleForTzRow = useCallback(
    (
      rowKey: string,
      roleTitle: string,
      assignee: string | undefined,
      section: Workshop2TzSignoffSectionKey
    ) => {
      setTzNotifyHighlightRowKey(rowKey);
      let url = typeof window !== 'undefined' ? window.location.href : '';
      if (url) {
        try {
          const u = new URL(url);
          if (!u.searchParams.get(WORKSHOP2_ARTICLE_PANE_PARAM)) {
            u.searchParams.set(WORKSHOP2_ARTICLE_PANE_PARAM, 'tz');
          }
          url = u.toString();
        } catch {
          /* keep raw href */
        }
      }
      const sectionLabel = SECTION_LABEL_BY_ID[section];
      const who = assignee?.trim() ? `${roleTitle} → ${assignee.trim()}` : roleTitle;
      const target = `Раздел «${sectionLabel}»: ${who}`;
      void (async () => {
        try {
          if (url) await navigator.clipboard.writeText(url);
          toast({
            title: url ? 'Ссылка скопирована' : 'Запрос зафиксирован',
            description: url
              ? `Передайте ссылку на подпись: ${target}. Push — после подключения API.`
              : 'Запись добавлена в журнал; передайте ссылку на ТЗ вручную.',
          });
        } catch {
          toast({
            title: 'Не удалось скопировать',
            description: url || 'Скопируйте адрес страницы вручную.',
            variant: 'destructive',
          });
        }
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(prev, updatedByLabel.slice(0, 200), {
            type: 'dossier_edit',
            summaries: [
              `Запрос подписи ТЗ: ${target}. ${url ? `Ссылка: ${url}` : 'URL недоступен в среде.'}`,
            ],
          })
        );
      })();
    },
    [toast, updatedByLabel]
  );

  const signTzDigitalRow = useCallback(
    (rowKey: string, extraRoleTitle?: string) => {
      const at = new Date().toISOString();
      const by = updatedByLabel.slice(0, 120);
      if (rowKey === 'designer') {
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(
            {
              ...prev,
              isVerifiedByDesigner: true,
              designerSignoff: {
                by,
                at,
                signatureDigest: computeWorkshop2TzSignatureDigest({
                  role: 'designer',
                  signerLabel: by,
                  collectionId,
                  articleId,
                  articleSku,
                  signedAtIso: at,
                }),
              },
            },
            updatedByLabel,
            { type: 'tz_global_signoff', role: 'designer', set: true }
          )
        );
        return;
      }
      if (rowKey === 'technologist') {
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(
            {
              ...prev,
              isVerifiedByTechnologist: true,
              technologistSignoff: {
                by,
                at,
                signatureDigest: computeWorkshop2TzSignatureDigest({
                  role: 'technologist',
                  signerLabel: by,
                  collectionId,
                  articleId,
                  articleSku,
                  signedAtIso: at,
                }),
              },
            },
            updatedByLabel,
            { type: 'tz_global_signoff', role: 'technologist', set: true }
          )
        );
        return;
      }
      if (rowKey === 'manager') {
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(
            {
              ...prev,
              isVerifiedByManager: true,
              managerSignoff: {
                by,
                at,
                signatureDigest: computeWorkshop2TzSignatureDigest({
                  role: 'manager',
                  signerLabel: by,
                  collectionId,
                  articleId,
                  articleSku,
                  signedAtIso: at,
                }),
              },
            },
            updatedByLabel,
            { type: 'tz_global_signoff', role: 'manager', set: true }
          )
        );
        return;
      }
      if (rowKey.startsWith('extra:')) {
        const rowId = rowKey.slice('extra:'.length);
        const rt = extraRoleTitle?.trim() || 'Роль';
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(
            {
              ...prev,
              extraTzSignoffsByRowId: {
                ...(prev.extraTzSignoffsByRowId ?? {}),
                [rowId]: {
                  by,
                  at,
                  signatureDigest: computeWorkshop2TzSignatureDigest({
                    role: `extra:${rowId}`,
                    signerLabel: by,
                    collectionId,
                    articleId,
                    articleSku,
                    signedAtIso: at,
                  }),
                },
              },
            },
            updatedByLabel,
            { type: 'tz_extra_signoff', rowId, roleTitle: rt, set: true }
          )
        );
      }
    },
    [articleId, articleSku, collectionId, updatedByLabel]
  );

  const revokeTzDigitalRow = useCallback(
    (rowKey: string, extraRoleTitle?: string) => {
      if (!canRevokeTzSignoff(updatedByLabel, tzRevokersEffective)) {
        onTzRevokeDenied();
        return;
      }
      if (rowKey === 'designer') {
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(
            { ...prev, isVerifiedByDesigner: false, designerSignoff: undefined },
            updatedByLabel,
            { type: 'tz_global_signoff', role: 'designer', set: false }
          )
        );
        return;
      }
      if (rowKey === 'technologist') {
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(
            { ...prev, isVerifiedByTechnologist: false, technologistSignoff: undefined },
            updatedByLabel,
            { type: 'tz_global_signoff', role: 'technologist', set: false }
          )
        );
        return;
      }
      if (rowKey === 'manager') {
        setDossier((prev: Workshop2DossierPhase1) =>
          pushTzActionLog(
            { ...prev, isVerifiedByManager: false, managerSignoff: undefined },
            updatedByLabel,
            { type: 'tz_global_signoff', role: 'manager', set: false }
          )
        );
        return;
      }
      if (rowKey.startsWith('extra:')) {
        const rowId = rowKey.slice('extra:'.length);
        const rt = extraRoleTitle?.trim() || 'Роль';
        setDossier((prev: Workshop2DossierPhase1) => {
          const cur = { ...(prev.extraTzSignoffsByRowId ?? {}) };
          delete cur[rowId];
          const next = Object.keys(cur).length ? cur : undefined;
          return pushTzActionLog({ ...prev, extraTzSignoffsByRowId: next }, updatedByLabel, {
            type: 'tz_extra_signoff',
            rowId,
            roleTitle: rt,
            set: false,
          });
        });
      }
    },
    [onTzRevokeDenied, updatedByLabel, tzRevokersEffective]
  );

  const tzReadyForSample =
    sectionReadiness.general.pct >= 60 &&
    sectionReadiness.visuals.pct >= 50 &&
    sectionReadiness.material.pct >= 50 &&
    sectionReadiness.construction.pct >= 100 &&
    (!reqDesigner || dossier.isVerifiedByDesigner) &&
    (!reqTechnologist || dossier.isVerifiedByTechnologist) &&
    (!reqManager || dossier.isVerifiedByManager) &&
    extrasReqTzSignoff.every((ex) => Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId])) &&
    handbookWarnings.length === 0;

  useEffect(() => {
    if (!passportHubModel) return;
    if (maybeRecordW2PassportRoute100(collectionId, articleId, passportHubModel.combinedPct)) {
      setDossierMetricsTick((t) => t + 1);
    }
  }, [collectionId, articleId, passportHubModel]);

  useEffect(() => {
    if (maybeRecordW2VisualGateCleared(collectionId, articleId, visualGateOpenCountGlobal)) {
      setDossierMetricsTick((t) => t + 1);
    }
  }, [collectionId, articleId, visualGateOpenCountGlobal]);

  useEffect(() => {
    if (!isPhase1) return;
    if (maybeRecordW2TzSampleReady(collectionId, articleId, Boolean(tzReadyForSample))) {
      setDossierMetricsTick((t) => t + 1);
    }
  }, [isPhase1, collectionId, articleId, tzReadyForSample]);

  useEffect(() => {
    if (!isPhase1) return;
    appendTzSessionJournalNote('Вход в ТЗ.');
    let lastExitMarkAt = 0;
    const markExit = () => {
      const now = Date.now();
      if (now - lastExitMarkAt < 2000) return;
      lastExitMarkAt = now;
      appendTzSessionJournalNote('Выход из ТЗ.');
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') markExit();
    };
    window.addEventListener('pagehide', markExit);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pagehide', markExit);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isPhase1, appendTzSessionJournalNote]);

  useEffect(() => {
    if (!isPhase1 || !tzHistoryOpen) return;
    appendTzSessionJournalNote('Просмотр истории действий ТЗ.');
  }, [isPhase1, tzHistoryOpen, appendTzSessionJournalNote]);

  const hasAssignmentValue = useCallback(
    (attributeId: string) =>
      dossier.assignments.some((a) => a.attributeId === attributeId && a.values.length > 0),
    [dossier.assignments]
  );
  const controlPointsCtx: BuildControlPointsCtx = useMemo(
    () => ({
      dossier,
      currentLeaf,
      skuDraft,
      nameDraft,
      handbookWarnings,
      sectionReadiness,
      selectedAudienceLabel,
      hasAssignmentValue,
    }),
    [
      dossier,
      currentLeaf,
      skuDraft,
      nameDraft,
      handbookWarnings,
      sectionReadiness,
      selectedAudienceLabel,
      hasAssignmentValue,
    ]
  );

  const runHandbookCheck = useCallback(() => {
    const aspects = buildSectionControlPoints(activeSection, controlPointsCtx).map(
      ({ label, done, jump }) => ({
        label,
        ok: done,
        jumpSection: jump?.section,
        jumpAnchorId: jump?.anchorId,
      })
    );
    setHandbookCheckSnapshot(
      buildHandbookCheckSnapshot(
        dossier,
        currentLeaf,
        skuDraft,
        nameDraft,
        handbookWarnings,
        sectionReadiness,
        activeSection,
        aspects
      )
    );
  }, [
    dossier,
    currentLeaf,
    skuDraft,
    nameDraft,
    handbookWarnings,
    sectionReadiness,
    activeSection,
    controlPointsCtx,
  ]);

  const renderSectionRows = (
    rows: ResolvedPhase1AttributeRow[],
    phase: '1' | '2' | '3',
    extras: { attribute: AttributeCatalogAttribute; groupLabel: string }[] = [],
    opts?: {
      showAttributeNameHintIcons?: boolean;
      /** После блока «Материал и состав» — якорь для поднавигации «Каталог» при объединённом BOM. */
      materialCatalogAnchorAfterMat?: string | null;
      /** Без полос «Верхняя одежда / Материалы / …» — один список атрибутов (вкладка «Визуал»). */
      flatCatalogGroups?: boolean;
      /** Сетка 2×N для паспортных полей (не колонка). */
      fieldLayout?: 'stack' | 'grid2';
    }
  ) => {
    if (rows.length === 0 && extras.length === 0) {
      return <p className="text-text-secondary text-sm">Для этого раздела пока нет атрибутов.</p>;
    }

    const showAttrHintIcons = opts?.showAttributeNameHintIcons === true;
    const flatCatalogGroups = opts?.flatCatalogGroups === true;
    const fieldLayout = opts?.fieldLayout ?? 'stack';

    const mergeOuterwearMaterialTab =
      activeSection === 'material' && currentLeaf?.l2Name === 'Верхняя одежда';
    const mergeConstructionCategoryStack = activeSection === 'construction';
    const mergedConstructionStackLabel = mergeConstructionCategoryStack
      ? workshop2ConstructionMergedStackTitle(currentLeaf)
      : '';
    const constructionMergedGroupIds = mergeConstructionCategoryStack
      ? getWorkshop2ConstructionTabMergedGroupIds()
      : null;

    const catalogGroupKeyForRow = (row: ResolvedPhase1AttributeRow): string => {
      if (flatCatalogGroups) return WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY;
      const fallback = row.group?.label || 'Разное';
      const gid = row.attribute.groupId;
      if (mergeOuterwearMaterialTab && WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_GROUP_IDS.has(gid)) {
        return WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL;
      }
      if (mergeConstructionCategoryStack && constructionMergedGroupIds?.has(gid)) {
        return mergedConstructionStackLabel;
      }
      return fallback;
    };

    const catalogGroupKeyForExtra = (ex: {
      attribute: AttributeCatalogAttribute;
      groupLabel: string;
    }): string => {
      if (flatCatalogGroups) return WORKSHOP_FLAT_CATALOG_SINGLE_GROUP_KEY;
      const base = ex.groupLabel || 'Доп. атрибуты';
      const gid = ex.attribute.groupId;
      if (mergeOuterwearMaterialTab && WORKSHOP_MERGE_OUTERWEAR_MATERIAL_TAB_LABELS.has(base)) {
        return WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL;
      }
      if (mergeConstructionCategoryStack && constructionMergedGroupIds?.has(gid)) {
        return mergedConstructionStackLabel;
      }
      return base;
    };

    // Grouping logic for cleaner construction view
    const groupedBase: Record<string, ResolvedPhase1AttributeRow[]> = {};
    for (const row of rows) {
      const g = catalogGroupKeyForRow(row);
      if (!groupedBase[g]) groupedBase[g] = [];
      groupedBase[g].push(row);
    }

    const groupedExtras: Record<
      string,
      { attribute: AttributeCatalogAttribute; groupLabel: string }[]
    > = {};
    for (const ex of extras) {
      const g = catalogGroupKeyForExtra(ex);
      if (!groupedExtras[g]) groupedExtras[g] = [];
      groupedExtras[g].push(ex);
    }

    const allGroupNames = Array.from(
      new Set([...Object.keys(groupedBase), ...Object.keys(groupedExtras)])
    );

    return (
      <div className="space-y-3">
        {allGroupNames.map((groupName) => {
          const collapseKey = `${activeSection}::${groupName}`;
          const isCollapsed = collapsedAttrGroups.has(collapseKey);
          const isPinned = pinnedAttrGroups.has(collapseKey);
          /** В карточках паспорта («Старт по каталогу», «До образца…») без полоски «Атрибуты» — заголовок группы не нужен. */
          const hidePassportCatalogGroupHeader =
            activeSection === 'general' && (groupName === 'Паспорт' || groupName === 'Свойства');
          /** В «Материалы» без подсекций «Доп. атрибуты» / «Верхняя одежда · материалы» — один общий блок сверху. */
          const hideMaterialSubsectionStripe =
            activeSection === 'material' &&
            (groupName === WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL ||
              groupName === 'Доп. атрибуты' ||
              workshopGroupSectionTitle(groupName) === 'Доп. атрибуты');
          const showGroupHeader =
            !hidePassportCatalogGroupHeader && !flatCatalogGroups && !hideMaterialSubsectionStripe;
          const contentCollapsed = flatCatalogGroups
            ? false
            : hidePassportCatalogGroupHeader
              ? false
              : isCollapsed;
          return (
            <div key={groupName} className="space-y-1.5">
              {showGroupHeader ? (
                <div className="flex items-center gap-2 px-1">
                  <h3 className="text-text-muted flex min-w-0 flex-1 items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-bg-surface2 h-px min-w-[1rem] flex-1" />
                    <span className="shrink-0">{workshopGroupSectionTitle(groupName)}</span>
                    <span className="bg-bg-surface2 h-px min-w-[1rem] flex-1" />
                  </h3>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleAttrGroupPinned(groupName)}
                      className={cn(
                        'hover:border-border-default hover:bg-bg-surface2 flex h-7 w-7 items-center justify-center rounded-md border bg-white shadow-sm transition',
                        isPinned
                          ? 'border-accent-primary/30 text-accent-primary'
                          : 'border-border-default text-text-muted hover:text-text-primary'
                      )}
                      title={
                        isPinned
                          ? 'Открепить: свёрнутость не сохранится после перезагрузки'
                          : 'Закрепить: сохранять свёрнуто или развёрнуто'
                      }
                      aria-pressed={isPinned}
                      aria-label={isPinned ? 'Открепить группу' : 'Закрепить группу'}
                    >
                      <LucideIcons.Pin
                        className={cn('h-3.5 w-3.5', isPinned && 'fill-current')}
                        aria-hidden
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAttrGroupCollapsed(groupName)}
                      className="border-border-default text-text-secondary hover:border-border-default hover:bg-bg-surface2 hover:text-text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-white shadow-sm transition"
                      aria-expanded={!isCollapsed}
                      title={isCollapsed ? 'Развернуть' : 'Свернуть'}
                      aria-label={isCollapsed ? 'Развернуть группу' : 'Свернуть группу'}
                    >
                      {isCollapsed ? (
                        <LucideIcons.ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <LucideIcons.ChevronDown className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
              {contentCollapsed ? null : (
                <ul
                  className={cn(
                    fieldLayout === 'grid2'
                      ? 'm-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2'
                      : 'space-y-2'
                  )}
                >
                  {(() => {
                    const inGroup = groupedBase[groupName] ?? [];
                    const bundleOrdered =
                      activeSection === 'general' && groupName === 'Паспорт'
                        ? PASSPORT_COLOR_BUNDLE_ORDER.map((id) =>
                            inGroup.find((r) => r.attribute.attributeId === id)
                          ).filter((r): r is ResolvedPhase1AttributeRow => Boolean(r))
                        : [];
                    const hasColorBundle = bundleOrdered.length > 0;
                    const restBase = hasColorBundle
                      ? inGroup.filter(
                          (r) => !PASSPORT_COLOR_BUNDLE_IDS.has(r.attribute.attributeId)
                        )
                      : inGroup;
                    return (
                      <>
                        {hasColorBundle ? (
                          <WorkshopPassportColorBundle
                            listItemClassName={fieldLayout === 'grid2' ? 'col-span-1 sm:col-span-2' : undefined}
                            bundleRows={bundleOrdered}
                            dossier={dossier}
                            currentLeaf={currentLeaf}
                            phase={phase}
                            allowMultiHandbook={allowMultiHandbook}
                            patchColor={patchColor}
                            showAttributeHintIcons={showAttrHintIcons}
                            onSetHandbookParameters={(id, parts) =>
                              id === 'primaryColorFamilyOptions' ||
                              id === 'colorReferenceSystemOptions'
                                ? onSetHandbookParametersWithColorBundleSync(id, parts)
                                : onSetHandbookParameters(id, parts)
                            }
                            onFreeTextSide={onFreeTextSide}
                          />
                        ) : null}
                        {restBase.map((row) => (
                          <Fragment key={row.attribute.attributeId}>
                            {renderPhaseRow(row, phase, showAttrHintIcons)}
                            {opts?.materialCatalogAnchorAfterMat &&
                            row.attribute.attributeId === 'mat' ? (
                              <li
                                key={`${row.attribute.attributeId}-catalog-nav`}
                                id={opts.materialCatalogAnchorAfterMat}
                                className="!m-0 !mb-0 !mt-0 !h-0 !min-h-0 scroll-mt-24 list-none overflow-hidden border-0 !p-0"
                                aria-hidden
                              />
                            ) : null}
                          </Fragment>
                        ))}
                      </>
                    );
                  })()}
                  {groupedExtras[groupName]?.map(({ attribute, groupLabel }) =>
                    renderAttributeCard(
                      attribute,
                      groupLabel,
                      'extra',
                      'card',
                      phase,
                      showAttrHintIcons
                    )
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        const idx = SECTIONS.findIndex((s) => s.id === activeSection);
        if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1]!.id);
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        const idx = SECTIONS.findIndex((s) => s.id === activeSection);
        if (idx > 0) setActiveSection(SECTIONS[idx - 1]!.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeSection, setActiveSection]);

  const sectionBody = (() => {
    if (activeSection === 'general') {
      return (
        <div className="space-y-4">
          <div id="w2-passport-hub" className="h-0 scroll-mt-20" aria-hidden="true" />
          {isPhase1 ? (
            <>
              <div
                id="w2-passport-identity"
                className="border-border-default scroll-mt-24 space-y-3 rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 pb-1">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                      <LucideIcons.Fingerprint className="h-4 w-4 shrink-0" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h2 className="text-text-primary text-base font-semibold">Паспорт артикула</h2>
                      <p className="text-text-secondary text-xs leading-snug">
                        Информация о продукте.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      htmlFor="w2-p1-internal-code"
                      hint={
                        <>
                          <p>
                            Внутренний порядковый номер артикула в коллекции. Присваивается при
                            создании строки и дальше не редактируется — удобно для ссылок в
                            переписке и журналах.
                          </p>
                        </>
                      }
                    >
                      Внутренний артикул
                    </WorkshopLabelWithHint>
                    <Input
                      id="w2-p1-internal-code"
                      readOnly
                      value={
                        isWorkshop2InternalArticleCodeValid(internalArticleCode)
                          ? internalArticleCode
                          : formatWorkshop2InternalArticleCodePlaceholder()
                      }
                      className="bg-bg-surface2 text-text-primary h-9 cursor-not-allowed font-mono text-sm"
                      title="Номер присваивается автоматически при создании артикула в коллекции и не меняется"
                      aria-readonly
                    />
                  </div>
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      htmlFor="w2-p1-sku"
                      hint={
                        <>
                          <p>
                            Публичный код модели: этикетки, заказы, интеграции. Сохраняется при
                            выходе из поля (on blur).
                          </p>
                          <p className="text-text-secondary">
                            Держите SKU стабильным после запуска в производство или обмен данными.
                          </p>
                        </>
                      }
                    >
                      Артикул (SKU)
                    </WorkshopLabelWithHint>
                    <Input
                      id="w2-p1-sku"
                      value={skuDraft}
                      onChange={(e) => setSkuDraft(e.target.value)}
                      onBlur={commitSku}
                      className="h-9 font-mono text-sm"
                      spellCheck={false}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <WorkshopLabelWithHint
                      htmlFor="w2-p1-desc"
                      hint={
                        <>
                          <p>
                            Человекочитаемое имя для команды: не путать с SKU. Сохраняется при
                            выходе из поля.
                          </p>
                          <p className="text-text-secondary">
                            Используется в заголовках и сводках, пока нет финального маркетингового
                            названия.
                          </p>
                        </>
                      }
                    >
                      Рабочее название модели
                    </WorkshopLabelWithHint>
                    <Input
                      id="w2-p1-desc"
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      onBlur={commitName}
                      className="h-9 text-sm"
                      placeholder="Например: Пальто прямого силуэта с поясом"
                    />
                  </div>
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      hint={
                        <>
                          <p>
                            Сегмент справочника (женская, мужская и т.д.): от него зависят доступные
                            значения атрибутов.
                          </p>
                          <p className="text-text-secondary">
                            Смена аудитории может сузить или расширить списки в других секциях ТЗ.
                          </p>
                        </>
                      }
                    >
                      Аудитория
                    </WorkshopLabelWithHint>
                    <select
                      className="border-border-default h-9 w-full rounded-md border bg-white px-2 text-sm"
                      value={selectedAudienceId}
                      onChange={(e) => onAudienceSelect(e.target.value)}
                    >
                      {audiences.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      hint={
                        <>
                          <p>
                            Раздел верхнего уровня в справочнике (например, «Одежда»). Задаёт
                            базовые правила и набор атрибутов.
                          </p>
                        </>
                      }
                    >
                      Раздел каталога (L1)
                    </WorkshopLabelWithHint>
                    <select
                      className="border-border-default h-9 w-full rounded-md border bg-white px-2 text-sm"
                      value={currentLeaf.l1Name}
                      onChange={(e) => onL1Select(e.target.value)}
                    >
                      {l1Opts.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:col-span-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <WorkshopLabelWithHint
                        hint={
                          <>
                            <p>Группа внутри раздела (например, «Верхняя одежда»).</p>
                            <p className="text-text-secondary">
                              От неё зависят варианты карточки модели (L3).
                            </p>
                          </>
                        }
                      >
                        Подтип / группа (L2)
                      </WorkshopLabelWithHint>
                      <select
                        className="border-border-default h-9 w-full rounded-md border bg-white px-2 text-sm"
                        value={currentLeaf.l2Name}
                        onChange={(e) => onL2Select(e.target.value)}
                      >
                        {l2Opts.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <WorkshopLabelWithHint
                        hint={
                          <>
                            <p>
                              Карточка модели в справочнике (например, «Пальто») — соответствует
                              листу артикула.
                            </p>
                            <p className="text-text-secondary">
                              Если для ветки нет L3, в списке может быть один технический вариант.
                            </p>
                          </>
                        }
                      >
                        Карточка модели в справочнике (L3)
                      </WorkshopLabelWithHint>
                      <select
                        className="border-border-default h-9 w-full rounded-md border bg-white px-2 text-sm"
                        value={currentLeaf.l3Name}
                        onChange={(e) => onL3Select(e.target.value)}
                      >
                        {l3Opts.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:col-span-2"
                    role="group"
                    aria-label="Унисекс"
                  >
                    <WorkshopLabelWithHint
                      labelClassName="mb-0"
                      hint={
                        <>
                          <p>
                            Флаг паспорта: модель позиционируется как унисекс. Влияет на подсказки и
                            контекст в блоках ТЗ.
                          </p>
                        </>
                      }
                    >
                      Унисекс
                    </WorkshopLabelWithHint>
                    <div className="border-border-default bg-bg-surface2/80 inline-flex shrink-0 rounded-md border p-px">
                      <button
                        type="button"
                        className={cn(
                          'h-[1.4rem] min-w-[1.8rem] rounded-sm px-1.5 text-[10px] font-medium leading-none transition',
                          !dossier.isUnisex
                            ? 'text-text-primary bg-white shadow-sm'
                            : 'text-text-secondary hover:text-text-primary'
                        )}
                        onClick={() =>
                          setDossier((p: Workshop2DossierPhase1) => ({ ...p, isUnisex: false }))
                        }
                      >
                        Нет
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'h-[1.4rem] min-w-[1.8rem] rounded-sm px-1.5 text-[10px] font-medium leading-none transition',
                          dossier.isUnisex === true
                            ? 'text-text-primary bg-white shadow-sm'
                            : 'text-text-secondary hover:text-text-primary'
                        )}
                        onClick={() =>
                          setDossier((p: Workshop2DossierPhase1) => ({ ...p, isUnisex: true }))
                        }
                      >
                        Да
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="w2-passport-brief"
                className="border-border-default scroll-mt-24 space-y-3 rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      htmlFor="w2-passport-sample-date"
                      hint={
                        <>
                          <p>
                            Когда ожидается готовность образца или пилотной партии — якорь для
                            планирования и чеклиста.
                          </p>
                          <p className="text-text-secondary">
                            Учитывается в проверках готовности паспорта вместе с другими полями.
                          </p>
                        </>
                      }
                    >
                      Целевая дата образца / пилота
                    </WorkshopLabelWithHint>
                    <Input
                      id="w2-passport-sample-date"
                      type="date"
                      className="h-9 text-sm"
                      value={dossier.passportProductionBrief?.targetSampleOrPilotDate ?? ''}
                      onChange={(e) =>
                        setDossier((p: Workshop2DossierPhase1) => ({
                          ...p,
                          passportProductionBrief: {
                            ...(p.passportProductionBrief ?? {}),
                            targetSampleOrPilotDate: e.target.value || undefined,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      htmlFor="w2-passport-moq-max"
                      hint={
                        <>
                          <p>
                            Ограничивает, сколько размеров можно отметить в блоке «Базовый размер» →
                            «Выбор из справочника», и верхнюю границу суммы по колонке «Кол-во, шт»
                            в табеле мерок.
                          </p>
                          <p className="text-text-secondary">
                            Значение обязательно: минимум 1. Если уменьшить число, лишние размеры в
                            справочнике отрежутся, табель и количества подстроятся под новый лимит.
                          </p>
                          <p className="text-text-secondary">
                            Следите, чтобы сумма «Кол-во, шт» по строкам не превышала это значение —
                            иначе появится предупреждение в досье.
                          </p>
                        </>
                      }
                    >
                      Кол-во образцов (размеров из справочника)
                    </WorkshopLabelWithHint>
                    <Input
                      id="w2-passport-moq-max"
                      type="number"
                      min={1}
                      step={1}
                      className="h-9 text-sm"
                      placeholder="1"
                      value={
                        dossier.passportProductionBrief?.moqTargetMaxPieces != null
                          ? String(dossier.passportProductionBrief.moqTargetMaxPieces)
                          : '1'
                      }
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        setDossier((p: Workshop2DossierPhase1) => {
                          const prevBrief = p.passportProductionBrief ?? {};
                          const num = raw === '' ? 1 : Math.max(1, Math.floor(Number(raw)));
                          if (!Number.isFinite(num)) return p;
                          let next: Workshop2DossierPhase1 = {
                            ...p,
                            passportProductionBrief: { ...prevBrief, moqTargetMaxPieces: num },
                          };
                          const sa = next.assignments.find(
                            (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
                          );
                          const { hbs, ft } = partitionHandbookAndFree(sa);
                          if (hbs.length > num) {
                            const parts = hbs.slice(0, num).map((v) => ({
                              parameterId: v.parameterId!,
                              displayLabel: v.displayLabel ?? '',
                            }));
                            next = syncSampleBaseSizePartsAndPruneDims(next, parts, ft?.text ?? '');
                          }
                          return {
                            ...next,
                            passportProductionBrief: {
                              ...(next.passportProductionBrief ?? {}),
                              moqTargetMaxPieces: num,
                            },
                            sampleBasePerSizePieceQty: clampSampleBasePieceQtyToCap(
                              next.sampleBasePerSizePieceQty,
                              num
                            ),
                          };
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      htmlFor="w2-passport-deadline-crit"
                      hint={
                        <>
                          <p>
                            «Жёсткий дедлайн» — срок нельзя сдвигать без согласования; «Гибкий
                            ориентир» — допустимы корректировки.
                          </p>
                          <p className="text-text-secondary">
                            «Пока не определено» оставляет статус открытым до уточнения с брендом.
                          </p>
                        </>
                      }
                    >
                      Критичность срока
                    </WorkshopLabelWithHint>
                    <select
                      id="w2-passport-deadline-crit"
                      className="border-border-default h-9 w-full rounded-md border bg-white px-2 text-sm"
                      value={dossier.passportProductionBrief?.deadlineCriticality ?? 'tbd'}
                      onChange={(e) =>
                        setDossier((p: Workshop2DossierPhase1) => ({
                          ...p,
                          passportProductionBrief: {
                            ...(p.passportProductionBrief ?? {}),
                            deadlineCriticality: e.target
                              .value as Workshop2PassportDeadlineCriticality,
                          },
                        }))
                      }
                    >
                      <option value="tbd">Пока не определено</option>
                      <option value="hard">Жёсткий дедлайн</option>
                      <option value="flexible">Гибкий ориентир</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <WorkshopLabelWithHint
                      htmlFor="w2-passport-launch"
                      hint={
                        <>
                          <p>
                            Где планируется шить: свой цех, КНП/подряд или смешанная схема —
                            подсказка для маршрута и снабжения.
                          </p>
                          <p className="text-text-secondary">
                            Не определяет юридическую форму; при смене стратегии обновите значение.
                          </p>
                        </>
                      }
                    >
                      Планируемый тип запуска
                    </WorkshopLabelWithHint>
                    <select
                      id="w2-passport-launch"
                      className="border-border-default h-9 w-full rounded-md border bg-white px-2 text-sm"
                      value={dossier.passportProductionBrief?.plannedLaunchType ?? 'undecided'}
                      onChange={(e) =>
                        setDossier((p: Workshop2DossierPhase1) => ({
                          ...p,
                          passportProductionBrief: {
                            ...(p.passportProductionBrief ?? {}),
                            plannedLaunchType: e.target.value as Workshop2PassportPlannedLaunchType,
                          },
                        }))
                      }
                    >
                      <option value="undecided">Ещё не решено</option>
                      <option value="own_floor">Своё производство</option>
                      <option value="cmt">КНП / подряд</option>
                      <option value="mixed">Смешанный</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <WorkshopLabelWithHint
                      htmlFor="w2-passport-sewing-region"
                      hint={
                        <>
                          <p>
                            Свободный текст: где планируется пошив (регион, цех, КНП). Нужен для
                            внутреннего планирования, не дублирует страну происхождения товара в
                            комплаенсе.
                          </p>
                          <p className="text-text-secondary">
                            После фиксации фабрики уточните финальные поля в соответствующих шагах
                            ТЗ.
                          </p>
                        </>
                      }
                    >
                      Регион / контур пошива (план)
                    </WorkshopLabelWithHint>
                    <Textarea
                      id="w2-passport-sewing-region"
                      rows={2}
                      className="min-h-[28px] resize-y py-1.5 text-sm leading-snug"
                      placeholder="Например: Московская область, собственный цех; или Киргизия КНП — без смешения со страной происхождения товара в комплаенсе."
                      value={dossier.passportProductionBrief?.sewingRegionPlanNote ?? ''}
                      onChange={(e) =>
                        setDossier((p: Workshop2DossierPhase1) => ({
                          ...p,
                          passportProductionBrief: {
                            ...(p.passportProductionBrief ?? {}),
                            sewingRegionPlanNote: e.target.value || undefined,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              id="w2-passport-identity"
              className="border-border-default scroll-mt-24 space-y-1 rounded-lg border bg-white p-4 shadow-sm"
            >
              <p className="flex flex-wrap items-baseline gap-x-1">
                <span
                  className={
                    isPhase2
                      ? 'text-[9px] font-semibold text-orange-800'
                      : 'text-text-secondary text-[9px] font-semibold'
                  }
                >
                  {isPhase2 ? 'Обязательный' : 'ОТК / приёмка'}
                </span>
                <span className="text-text-primary text-sm font-semibold">
                  {isPhase2 ? 'Шаг 2' : 'Шаг 3'}
                </span>
              </p>
              <p className="text-text-primary font-mono text-sm font-semibold">{articleSku}</p>
              <p className="text-text-secondary text-[10px] leading-snug">
                {currentLeaf.pathLabel}
              </p>
              <p className="text-text-secondary text-[10px] leading-snug">
                Полная идентификация и аудитория — на шаге 1 ТЗ; здесь дозаполнение полей паспорта
                для текущего шага.
              </p>
            </div>
          )}
          {isPhase1 ? (
            <>
              <div
                id="w2-passport-start"
                className="border-border-default scroll-mt-24 space-y-3 rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 pb-1">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <LucideIcons.LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-text-primary text-base font-semibold">Справочник</h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      Сезон, цвет и атрибуты по ветке.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportStartRows,
                  currentPhase,
                  generalPassportStartExtras,
                  {
                    showAttributeNameHintIcons: true,
                    fieldLayout: 'grid2',
                  }
                )}
              </div>
              <div
                id="w2-passport-market"
                className="border-border-default scroll-mt-24 space-y-3 rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 pb-1">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <LucideIcons.Globe2 className="h-4 w-4 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-text-primary text-base font-semibold">Идентификация</h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      Коды, маркировка, обязательные реквизиты.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportPreSampleRows,
                  currentPhase,
                  generalPassportPreSampleExtras,
                  {
                    showAttributeNameHintIcons: true,
                    fieldLayout: 'grid2',
                  }
                )}
              </div>
            </>
          ) : (
            <>
              <div
                id="w2-passport-brief"
                className="border-accent-primary/20 bg-accent-primary/10 scroll-mt-24 rounded-lg border p-4 shadow-sm"
              >
                <p className="text-text-primary text-sm font-semibold">Бриф до образца</p>
                <p className="text-text-secondary mt-1 text-xs leading-snug">
                  Ответственный за карточку, тип запуска, целевая дата и критичность срока задаются
                  на шаге 1 ТЗ. Ниже — поля каталога для шага {currentPhase}; переход к брифу
                  открывает ту же страницу артикула.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2 h-8 text-[10px]">
                  <Link href={passportStep1BriefHref}>Шаг 1 ТЗ → блок брифа</Link>
                </Button>
              </div>
              <div
                id="w2-passport-start"
                className="border-border-default scroll-mt-24 space-y-3 rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 pb-1">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <LucideIcons.LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-text-primary text-base font-semibold">Справочник</h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      Поля паспорта на шаге {currentPhase}.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportStartRows,
                  currentPhase,
                  generalPassportStartExtras,
                  {
                    showAttributeNameHintIcons: true,
                    fieldLayout: 'grid2',
                  }
                )}
              </div>
              <div
                id="w2-passport-market"
                className="border-border-default scroll-mt-24 space-y-3 rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 pb-1">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <LucideIcons.Globe2 className="h-4 w-4 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-text-primary text-base font-semibold">Идентификация</h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      К образцу и отгрузке.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportPreSampleRows,
                  currentPhase,
                  generalPassportPreSampleExtras,
                  {
                    showAttributeNameHintIcons: true,
                    fieldLayout: 'grid2',
                  }
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    if (activeSection === 'visuals') {
      const visualRowsForRender = sectionRowsCurrent.filter((row) => {
        if (row.attribute.attributeId === 'techPackRef') return false;
        if (currentLeaf.l2Name !== 'Верхняя одежда') return true;
        return !/длина изделия/i.test(row.attribute.name.trim());
      });
      return (
        <Workshop2VisualsDossierSection
          dossier={dossier}
          setDossier={setDossier}
          saveDraft={saveDraft}
          updatedByLabel={updatedByLabel}
          catalogFieldsSlot={renderSectionRows(visualRowsForRender, currentPhase, extraRowsCurrent, {
            flatCatalogGroups: true,
            fieldLayout: 'grid2',
          })}
        />
      );
    }

    if (activeSection === 'material') {
      const l2 = currentLeaf.l2Name;
      const matHint =
        l2 === 'Верхняя одежда'
          ? 'Зафиксируйте основную ткань (shell), подкладку, утеплитель, дублирин и фурнитуру.'
          : l2 === 'Платья и сарафаны'
            ? 'Укажите основную ткань, подкладку (если есть) и фурнитуру (молния, пуговицы).'
            : 'Материальная рамка для передачи в снабжение. Указывайте состав в процентах.';
      const materialMatRows = sectionRowsCurrent.filter((r) => r.attribute.attributeId === 'mat');
      const materialCatalogRows = sectionRowsCurrent.filter(
        (r) => r.attribute.attributeId !== 'mat'
      );
      const materialOuterwearUnified = l2 === 'Верхняя одежда';
      const materialUnifiedFieldRows = [...materialMatRows, ...materialCatalogRows];
      const materialFieldsBlocks = materialOuterwearUnified ? (
        <div id="w2-material-mat" className="scroll-mt-24">
          {renderSectionRows(materialUnifiedFieldRows, currentPhase, [], {
            materialCatalogAnchorAfterMat: W2_MATERIAL_SUBPAGE_ANCHORS.catalog,
            fieldLayout: 'grid2',
          })}
        </div>
      ) : (
        <>
          <div id="w2-material-mat" className="scroll-mt-24">
            {renderSectionRows(materialMatRows, currentPhase, [], { fieldLayout: 'grid2' })}
          </div>
          <div id="w2-material-catalog" className="scroll-mt-24">
            {renderSectionRows(materialCatalogRows, currentPhase, [], { fieldLayout: 'grid2' })}
          </div>
        </>
      );
      const scrollMaterialAnchor = (id: string) => {
        setActiveMaterialSubNavId(id);
        if (W2_MATERIAL_PRE_SUPPLY_COLLAPSE_SCROLL_IDS.has(id)) setMaterialPreSupplyExpanded(true);
        if (typeof document === 'undefined') return;
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            document
              .getElementById(id)
              ?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
          });
        });
      };
      return (
        <div className="space-y-4">
          <Workshop2MaterialTzStickySubnav
            activeAnchorId={activeMaterialSubNavId}
            onNavigate={scrollMaterialAnchor}
            onJumpToPulse={onOpenPulse ? () => onOpenPulse({ materialHints: true }) : undefined}
            combinedPct={materialBomHubModel.combinedPct}
            gateOpenCount={materialBomHubModel.gateItems.length}
            tzPhase={currentPhase}
            showComplianceNav={showMaterialComplianceNav}
            dossierViewProfile={dossierViewProfile}
            matSketchGapCount={matSketchBomGapRefs.length}
            showBomNormsNav={showMaterialBomNormsNav}
            showSupplyRouteNav={showMaterialSupplyRouteNav}
            showCostingHintsNav={showMaterialCostingHintsNav}
            showSupplyDraftsNav={showMaterialSupplyDraftsNav}
          />
          <Collapsible
            open={materialPreSupplyExpanded}
            onOpenChange={setMaterialPreSupplyExpanded}
            className="scroll-mt-24 rounded-lg border border-border-default bg-white p-0 shadow-sm"
          >
            <CollapsibleTrigger className="hover:bg-bg-surface2/60 flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left transition">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-text-primary text-sm font-semibold">Материалы и каталог ТЗ</p>
                  <p className="text-text-secondary text-xs leading-snug">
                    Состав, атрибуты полотна и снабжение — разверните блок.
                  </p>
                </div>
              </div>
              <LucideIcons.ChevronsUpDown
                className="text-text-secondary h-4 w-4 shrink-0"
                aria-hidden
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-border-subtle overflow-hidden border-t px-0 pb-4 pt-3 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div id="w2-material-hub" className="h-0 scroll-mt-24" aria-hidden />
              {dossierViewProfile === 'merch' ? (
                <Collapsible
                  defaultOpen={false}
                  className="border-border-default bg-bg-surface2/40 mx-1 scroll-mt-4 rounded-lg border sm:mx-2"
                >
                  <CollapsibleTrigger className="text-text-primary hover:bg-bg-surface2/80 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold">
                    <span>Полный каталог материалов ТЗ (редактирование атрибутов)</span>
                    <LucideIcons.ChevronsUpDown
                      className="h-4 w-4 shrink-0 opacity-60"
                      aria-hidden
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div
                      id="w2-material-fields"
                      className="border-border-default/80 space-y-4 border-t px-3 pb-3 pt-3"
                    >
                      {materialFieldsBlocks}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <div id="w2-material-fields" className="scroll-mt-4 space-y-4 px-1 sm:px-2">
                  {materialFieldsBlocks}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
          <Workshop2DossierSupplyChainDraftsPanel
            dossier={dossier}
            setDossier={setDossier}
            dossierViewProfile={dossierViewProfile}
            tzWriteDisabled={tzWriteDisabled}
            updatedByLabel={updatedByLabel}
            currentLeaf={currentLeaf}
          />
        </div>
      );
    }

    if (activeSection === 'construction') {
      const constructionRowsToRender = (() => {
        const movedRows = phaseRowsCurrent.filter((row) => {
          const sid = getSectionForAttr(row.attribute.attributeId, row.group?.groupId);
          if (sid === 'construction') return false;
          if (row.attribute.attributeId === 'techPackRef') return true;
          return currentLeaf.l2Name === 'Верхняя одежда' && /длина изделия/i.test(row.attribute.name);
        });
        const byAttr = new Map<string, ResolvedPhase1AttributeRow>();
        for (const row of [...sectionRowsCurrent, ...movedRows]) {
          byAttr.set(row.attribute.attributeId, row);
        }
        return [...byAttr.values()];
      })();
      const l2 = currentLeaf.l2Name?.trim() || 'категория';
      const hint =
        l2 === 'Верхняя одежда'
          ? 'Проверьте силуэт, ключевые узлы, табель мер и метки скетча перед передачей в цех.'
          : l2 === 'Платья и сарафаны'
            ? 'Согласуйте посадку, длины и обработку узлов, чтобы лекала и пошив шли без расхождений.'
            : 'Соберите узлы, мерки и скетч в едином контуре перед передачей в производство.';
      return (
        <div id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub} className="scroll-mt-24 space-y-4">
          <div id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour} className="h-0 scroll-mt-24" aria-hidden />
          <div id="w2-measurements-fields" className="h-0 scroll-mt-24" aria-hidden />
          {onOpenPulse ? (
            <div className="border-border-default rounded-lg border bg-white p-2 shadow-sm">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-[11px]"
                onClick={() => onOpenPulse?.()}
              >
                <LucideIcons.Activity className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Пульс раздела: Конструкции
              </Button>
            </div>
          ) : null}

          <div
            id={W2_VISUALS_SKETCH_ANCHOR_ID}
            className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm"
          >
            {isPhase1 ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-text-primary text-base font-semibold">Скетчи</h2>
                    <p className="text-text-secondary text-sm leading-snug">
                      Базовый путь: режим ТЗ/цех → метки на подложке. Расширенные действия — в
                      «Дополнительно».
                    </p>
                    <div className="border-border-default/90 sticky top-2 z-20 mt-3 flex flex-col gap-1.5 rounded-lg border bg-white p-1.5 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                      <div className="border-border-default/90 flex w-fit max-w-full flex-wrap items-center gap-1 rounded-md border bg-white px-1 py-0.5 shadow-sm">
                        <SketchViewModeToggle
                          floor={sketchViewFloor}
                          onFloorChange={setSketchFloorMode}
                          lockedToFloor={lockedSketchFloorOnly || tzWriteDisabled}
                          onCopyFloorLink={copySketchFloorLink}
                          className="border-0 bg-transparent shadow-none"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-border-default h-7 gap-1 bg-white px-2 text-[10px] font-medium shadow-none"
                          >
                            <LucideIcons.Settings2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            Дополнительно
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem onClick={() => setSketchPinLibraryOpen(true)}>
                            <LucideIcons.Library className="mr-2 h-4 w-4" aria-hidden />
                            Шаблоны и снимки
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={saveSketchLabelsSnapshot}>
                            <LucideIcons.Camera className="mr-2 h-4 w-4" aria-hidden />
                            Снимок меток
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={sketchBundleBusy}
                            onClick={() => void exportSketchVisualBundleZip()}
                          >
                            <LucideIcons.FileArchive className="mr-2 h-4 w-4" aria-hidden />
                            {sketchBundleBusy ? 'Архив…' : 'ZIP PNG + PDF'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="flex flex-wrap items-center gap-1 sm:ml-auto">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className={cn(
                                SKETCH_PHASE1_HELP_BUTTON_CLASS,
                                'text-text-primary max-w-[11rem]'
                              )}
                            >
                              <LucideIcons.CircleHelp
                                className="text-accent-primary h-3.5 w-3.5 shrink-0"
                                aria-hidden
                              />
                              <span className="min-w-0">
                                <span className="block text-[10px] font-semibold leading-tight">
                                  Панель скетча
                                </span>
                                <span className="text-text-secondary mt-0.5 block text-[8px] font-normal leading-tight">
                                  режим, ссылка, шаблоны
                                </span>
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="max-h-[min(32rem,70vh)] w-[min(calc(100vw-1.5rem),24rem)] overflow-y-auto p-0"
                            sideOffset={6}
                          >
                            <div className="border-border-subtle bg-bg-surface2/80 border-b px-4 py-3">
                              <p className="text-text-primary text-sm font-semibold">
                                Панель над скетчем
                              </p>
                              <p className="text-text-secondary mt-1 text-xs leading-snug">
                                Кнопки слева от вкладок «Скетч / Узлы ветки»: режим работы, ссылка
                                для цеха, библиотека и дополнительные действия.
                              </p>
                            </div>
                            <div className="text-text-primary space-y-4 p-4 text-xs leading-relaxed">
                              <section>
                                <p className="text-text-primary font-semibold">Режим · ТЗ</p>
                                <p className="text-text-secondary mt-1">
                                  Полное редактирование: ставите и правите метки, приоритеты, этапы,
                                  связи с задачами по ветке каталога и полями ТЗ. Так готовят
                                  материалы для согласований и передачи в производство.
                                </p>
                              </section>
                              <section>
                                <p className="text-text-primary font-semibold">Режим · Цех</p>
                                <p className="text-text-secondary mt-1">
                                  Просмотр для линии: крупные номера меток без правок, чтобы открыть
                                  карточку на планшете или у машины и сразу видеть доску. Не
                                  заменяет подписи и права в паспорте — только интерфейс скетча.
                                </p>
                              </section>
                              <section>
                                <p className="text-text-primary font-semibold">Ссылка цеха</p>
                                <p className="text-text-secondary mt-1">
                                  Копирует адрес этой страницы с параметром{' '}
                                  <code className="bg-bg-surface2 rounded px-1 py-0.5 font-mono text-[10px]">
                                    ?sketchFloor=1
                                  </code>
                                  . Получатель откроет тот же артикул уже в режиме цеха — без
                                  ручного переключения «ТЗ / Цех».
                                </p>
                              </section>
                              <section>
                                <p className="text-text-primary font-semibold">Шаблоны и снимки</p>
                                <p className="text-text-secondary mt-1">
                                  Библиотека шаблонов меток и эталонных снимков: подставить набор
                                  точек, сравнить подложку с фото, сохранить свой шаблон в досье или
                                  в коллекции (если доступно).
                                </p>
                              </section>
                              <section>
                                <p className="text-text-primary font-semibold">Ещё</p>
                                <p className="text-text-secondary mt-1">
                                  Снимок меток в PNG и выгрузка ZIP с картинками и PDF для архива
                                  или переписки. Библиотека шаблонов — только кнопка «Шаблоны и
                                  снимки».
                                </p>
                              </section>
                              <section>
                                <p className="text-text-primary font-semibold">Только цех</p>
                                <p className="text-text-secondary mt-1">
                                  Если у роли нет прав на правки, вместо переключателя показывается
                                  подсказка «Только цех» и остаётся доступна копия ссылки — разметку
                                  меняют пользователи с доступом к ТЗ.
                                </p>
                              </section>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
                {sketchViewFloor ? (
                  <p className="border-border-default bg-bg-surface2/90 text-text-primary rounded-md border px-3 py-2 text-[10px] leading-snug">
                    <span className="text-text-primary font-semibold">Режим цеха:</span>{' '}
                    ориентируйтесь на канон-скетч и эталон подложки на доске. Печать и QR — в
                    «Дополнительно»; общий пакет для передачи — PDF из пульса или экспорт пакета
                    визуала в блоке согласования.
                  </p>
                ) : sketchTechGaps.pinsWithoutAttrOrBom > 0 ||
                  sketchTechGaps.criticalPinsWithoutDue > 0 ? (
                  <div className="rounded-md border border-teal-200 bg-teal-50/85 px-3 py-2 text-[11px] leading-snug text-teal-950">
                    <p className="font-semibold text-teal-900">Для технолога</p>
                    <ul className="mt-1 list-disc pl-4">
                      {sketchTechGaps.pinsWithoutAttrOrBom > 0 ? (
                        <li>
                          Меток без привязки к атрибуту или BOM:{' '}
                          <span className="font-mono font-semibold">
                            {sketchTechGaps.pinsWithoutAttrOrBom}
                          </span>
                        </li>
                      ) : null}
                      {sketchTechGaps.criticalPinsWithoutDue > 0 ? (
                        <li>
                          Критичных меток без срока:{' '}
                          <span className="font-mono font-semibold">
                            {sketchTechGaps.criticalPinsWithoutDue}
                          </span>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ) : null}
                <Tabs
                  value={sketchWorkspaceTab}
                  onValueChange={(v) => setSketchWorkspaceTab(v as typeof sketchWorkspaceTab)}
                  className="w-full"
                >
                  <div className="mb-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                    {/* cabinetSurface v1 */}
                    <TabsList
                      className={cn(
                        cabinetSurface.tabsList,
                        'grid min-h-8 w-full min-w-0 flex-1 grid-cols-1 gap-0.5 p-0.5 sm:grid-cols-2'
                      )}
                    >
                      <TabsTrigger
                        value="sketch"
                        className={cn(
                          cabinetSurface.tabsTrigger,
                          'text-text-secondary data-[state=active]:text-text-primary min-h-8 justify-center px-2 py-1 text-xs font-semibold normal-case tracking-normal'
                        )}
                      >
                        <span className="flex flex-wrap items-center justify-center gap-1.5">
                          <span>Скетч</span>
                          {sketchWorkspaceStats.masterPins > 0 ? (
                            <Badge
                              variant="secondary"
                              className="border-border-default/80 bg-bg-surface2 h-4 min-w-4 border px-1 text-[9px] font-bold tabular-nums"
                              title="Меток на общей доске"
                            >
                              {sketchWorkspaceStats.masterPins}
                            </Badge>
                          ) : null}
                          {sketchWorkspaceStats.sheetCount > 0 ? (
                            <Badge
                              variant="secondary"
                              className="border-border-default/80 bg-bg-surface2 h-4 min-w-4 border px-1 text-[9px] font-bold tabular-nums"
                              title="Скетч-листов"
                            >
                              {sketchWorkspaceStats.sheetCount}л
                            </Badge>
                          ) : null}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="sublevels"
                        className={cn(
                          cabinetSurface.tabsTrigger,
                          'text-text-secondary data-[state=active]:text-text-primary min-h-8 justify-center px-2 py-1 text-xs font-semibold normal-case tracking-normal'
                        )}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Узлы ветки
                          {sketchWorkspaceStats.sublevelPins > 0 ? (
                            <Badge
                              variant="secondary"
                              className="border-border-default/80 bg-bg-surface2 h-4 min-w-4 border px-1 text-[9px] font-bold tabular-nums"
                            >
                              {sketchWorkspaceStats.sublevelPins}
                            </Badge>
                          ) : null}
                        </span>
                      </TabsTrigger>
                    </TabsList>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={cn(
                            SKETCH_PHASE1_HELP_BUTTON_CLASS,
                            'text-text-primary max-w-[11rem]'
                          )}
                        >
                          <LucideIcons.CircleHelp
                            className="text-accent-primary h-3.5 w-3.5 shrink-0"
                            aria-hidden
                          />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-semibold leading-tight">
                              Скетч и узлы ветки
                            </span>
                            <span className="text-text-secondary mt-0.5 block text-[8px] font-normal leading-tight">
                              как устроено
                            </span>
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="max-h-[min(32rem,70vh)] w-[min(calc(100vw-1.5rem),24rem)] overflow-y-auto p-0"
                        sideOffset={6}
                      >
                        <div className="border-border-subtle bg-bg-surface2/80 border-b px-4 py-3">
                          <p className="text-text-primary text-sm font-semibold">
                            Две зоны: скетч артикула и узлы ветки
                          </p>
                          <p className="text-text-secondary mt-1 text-xs leading-snug">
                            Во вкладке «Скетч» переключатель «Общий / Листы» и кнопка «Создать лист»
                            — одна модель, разные доски. На основной вкладке бейджи: метки на общей
                            доске и число листов.
                          </p>
                        </div>
                        <div className="text-text-primary space-y-4 p-4 text-xs leading-relaxed">
                          <section>
                            <p className="text-text-primary font-semibold">Вкладка «Скетч»</p>
                            <p className="text-text-secondary mt-1">
                              <strong className="text-text-primary font-medium">Общий:</strong>{' '}
                              главная доска — силуэт или фото изделия целиком, ключевые метки,
                              экспорт и согласование.{' '}
                              <strong className="text-text-primary font-medium">Листы:</strong>{' '}
                              отдельные ракурсы (анфас, спина, деталь, фото) со своей подложкой и
                              метками; «Создать лист» добавляет лист и переключает на ленту листов.
                              Метки с общей доски можно копировать на лист и в слоты узлов ветки.
                            </p>
                          </section>
                          <section>
                            <p className="text-text-primary font-semibold">
                              Узлы ветки — зачем и что делать
                            </p>
                            <p className="text-text-secondary mt-1">
                              Три слота названы по{' '}
                              <strong className="text-text-primary font-medium">роли узла</strong> в
                              справочнике: <strong>Линия</strong> (весь раздел, напр. Одежда),{' '}
                              <strong>Группа</strong> (подтип, напр. Верхняя одежда),{' '}
                              <strong>Модель</strong> (карточка этого артикула, напр. Пальто). Это{' '}
                              <strong>один путь к вашему SKU</strong>, не три артикула.
                            </p>
                            <p className="text-text-secondary mt-1.5">
                              <strong className="text-text-primary font-medium">
                                Чем отличается от вкладки «Скетч»:
                              </strong>{' '}
                              там — главная картинка и виды изделия. Здесь — отдельные мини-скетчи и
                              блоки задач, если нужно формулировать требования{' '}
                              <em>с разной ширины ветки</em> (на всю линию, на группу, на карточку)
                              и наследовать текст с «Линия» → «Группа» → «Модель». Если вашему
                              процессу это не нужно — слоты можно не заполнять.
                            </p>
                          </section>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <TabsContent value="sketch" className="mt-0 outline-none focus-visible:ring-0">
                    {sketchPinLinkAudit.length > 0 ? (
                      <div
                        className="mb-3 rounded-lg border border-amber-300/90 bg-amber-50/95 px-3 py-2 text-[11px] text-amber-950"
                        role="status"
                      >
                        <p className="font-semibold">
                          Связи меток (режим {dossierViewProfile}): заполните BOM / QC там, где
                          требуется
                        </p>
                        <ul className="mt-1 list-inside list-disc space-y-0.5">
                          {sketchPinLinkAudit.slice(0, 8).map((row) => (
                            <li key={row.id}>
                              <span className="font-mono text-[10px]">{row.id.slice(0, 8)}…</span>{' '}
                              {row.messages.join(' · ')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {(
                      [
                        'full',
                        'designer',
                        'technologist',
                        'supply',
                        'production',
                      ] as Workshop2DossierViewProfile[]
                    ).includes(dossierViewProfile) ? (
                      <div className="border-accent-primary/20 bg-accent-primary/10 mb-3 flex flex-wrap items-center gap-1.5 rounded-lg border px-2 py-2">
                        <span className="text-accent-primary shrink-0 text-[9px] font-bold uppercase tracking-wide">
                          Текст метки
                        </span>
                        {W2_SKETCH_PIN_TYPE_PRESETS.map((pr) => (
                          <Button
                            key={pr.annotationType}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[9px] capitalize"
                            title={`Скопировать: ${pr.suggestedLabel}`}
                            onClick={() => {
                              void navigator.clipboard.writeText(pr.suggestedLabel).then(
                                () =>
                                  toast({
                                    title: 'Текст в буфере',
                                    description: 'Вставьте в новую метку на скетче.',
                                  }),
                                () =>
                                  toast({ title: 'Не удалось скопировать', variant: 'destructive' })
                              );
                            }}
                          >
                            {pr.annotationType}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                    <div className="border-border-subtle mb-3 flex flex-col gap-2 border-b pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* cabinetSurface v1 */}
                        <div
                          className={cn(cabinetSurface.groupTabList, 'rounded-lg p-0.5')}
                          role="tablist"
                          aria-label="Общий скетч или листы"
                        >
                          <button
                            type="button"
                            role="tab"
                            aria-selected={sketchSurface === 'master'}
                            className={cn(
                              cabinetSurface.groupTabButton,
                              'rounded-md px-3 py-1.5 text-xs font-semibold',
                              sketchSurface === 'master' && cabinetSurface.groupTabButtonActive
                            )}
                            onClick={() => setSketchSurface('master')}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              Общий
                              {sketchWorkspaceStats.masterPins > 0 ? (
                                <Badge
                                  variant="secondary"
                                  className="border-border-default/80 bg-bg-surface2 h-4 min-w-4 border px-1 text-[9px] font-bold tabular-nums"
                                >
                                  {sketchWorkspaceStats.masterPins}
                                </Badge>
                              ) : null}
                            </span>
                          </button>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={sketchSurface === 'sheets'}
                            className={cn(
                              cabinetSurface.groupTabButton,
                              'rounded-md px-3 py-1.5 text-xs font-semibold',
                              sketchSurface === 'sheets' && cabinetSurface.groupTabButtonActive
                            )}
                            onClick={() => setSketchSurface('sheets')}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              Листы
                              {sketchWorkspaceStats.sheetCount > 0 ? (
                                <Badge
                                  variant="secondary"
                                  className="border-border-default/80 bg-bg-surface2 h-4 min-w-4 border px-1 text-[9px] font-bold tabular-nums"
                                >
                                  {sketchWorkspaceStats.sheetCount}
                                </Badge>
                              ) : null}
                            </span>
                          </button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          disabled={
                            sketchEditsLocked || normalizedSketchSheets.length >= MAX_SKETCH_SHEETS
                          }
                          title={
                            normalizedSketchSheets.length >= MAX_SKETCH_SHEETS
                              ? `Не более ${MAX_SKETCH_SHEETS} листов`
                              : 'Добавить скетч-лист и перейти к листам'
                          }
                          onClick={appendSketchSheet}
                        >
                          <LucideIcons.Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          Создать лист
                        </Button>
                      </div>
                      <p className="text-text-secondary max-w-md text-[10px] leading-snug">
                        Общий — главный вид модели; листы — дополнительные ракурсы и детали.
                      </p>
                    </div>
                    {sketchSurface === 'master' ? (
                      <>
                        <div id="w2-visuals-sketch-templates" className="scroll-mt-24">
                          <details className="border-border-default bg-bg-surface2/40 mb-3 rounded-lg border">
                            <summary className="text-text-primary cursor-pointer list-none px-3 py-2.5 text-xs font-medium [&::-webkit-details-marker]:hidden">
                              Дополнительно: шаблоны меток на общую доску
                            </summary>
                            <div className="border-border-subtle flex flex-col gap-2 border-t px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center">
                              <select
                                className="border-border-default h-9 min-w-[200px] flex-1 rounded-md border bg-white px-2 text-sm disabled:opacity-60"
                                value={sketchMasterTemplateId}
                                disabled={sketchEditsLocked}
                                onChange={(e) => setSketchMasterTemplateId(e.target.value)}
                                aria-label="Выбор шаблона меток"
                              >
                                <option value="">Выберите шаблон…</option>
                                {(dossier.sketchPinTemplates ?? []).length > 0 ? (
                                  <optgroup label="В этом досье">
                                    {(dossier.sketchPinTemplates ?? []).map((t) => (
                                      <option key={`d:${t.templateId}`} value={`d:${t.templateId}`}>
                                        {t.name} ({t.annotations.length} мет.
                                        {t.viewKind
                                          ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}`
                                          : ''}
                                        )
                                      </option>
                                    ))}
                                  </optgroup>
                                ) : null}
                                {orgSketchTemplatesList.length > 0 ? (
                                  <optgroup label="Библиотека коллекции">
                                    {orgSketchTemplatesList.map((t) => (
                                      <option key={`o:${t.templateId}`} value={`o:${t.templateId}`}>
                                        {t.name} ({t.annotations.length} мет.
                                        {t.viewKind
                                          ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}`
                                          : ''}
                                        )
                                      </option>
                                    ))}
                                  </optgroup>
                                ) : null}
                              </select>
                              <div className="flex flex-wrap gap-1.5">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs"
                                  disabled={!sketchMasterTemplateId || sketchEditsLocked}
                                  onClick={() => applyMasterSketchPinTemplate('merge')}
                                >
                                  Добавить к доске
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs"
                                  disabled={!sketchMasterTemplateId || sketchEditsLocked}
                                  onClick={() => applyMasterSketchPinTemplate('replace')}
                                >
                                  Заменить все метки
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 text-xs"
                                  disabled={sketchEditsLocked}
                                  onClick={saveMasterSketchPinTemplate}
                                >
                                  Сохранить в досье
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 text-xs"
                                  disabled={sketchEditsLocked}
                                  onClick={saveMasterSketchPinTemplateToOrg}
                                >
                                  В библиотеку
                                </Button>
                              </div>
                            </div>
                          </details>
                        </div>
                        <CategorySketchAnnotator
                          currentLeaf={currentLeaf}
                          imageDataUrl={dossier.categorySketchImageDataUrl}
                          imageFileName={dossier.categorySketchImageFileName}
                          annotations={dossier.categorySketchAnnotations ?? []}
                          attributeOptions={sketchAttributeOptions}
                          bomLinePickOptions={bomLinePickOptions}
                          sketchContext={{
                            audienceId: selectedAudienceId,
                            audienceName: selectedAudienceLabel,
                            isUnisex: dossier.isUnisex,
                          }}
                          onNavigateStage={(stage) => onNavigateToTab?.(stage)}
                          onJumpToDossierSection={(sec) => setActiveSection(sec)}
                          onNavigateRouteStage={(st) =>
                            onNavigateToTab?.(SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB[st])
                          }
                          onPatch={(patch) =>
                            setDossier((p: Workshop2DossierPhase1) => ({ ...p, ...patch }))
                          }
                          showPassportSectionHeader={false}
                          pinTextSnippets={DEFAULT_MASTER_PIN_SNIPPETS}
                          exportFileNameStem={`master-${skuDraft.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-').slice(0, 48)}`}
                          articleSku={skuDraft}
                          viewMode={sketchEditsLocked ? 'floor' : 'edit'}
                          subcategorySketchSlots={dossier.subcategorySketchSlots ?? []}
                          categorySketchCompareOverlayDataUrl={
                            dossier.categorySketchCompareOverlayDataUrl ?? undefined
                          }
                          categorySketchCompareOverlayFileName={
                            dossier.categorySketchCompareOverlayFileName ?? undefined
                          }
                          categorySketchCompareOverlayOpacityPct={
                            dossier.categorySketchCompareOverlayOpacityPct
                          }
                          categorySketchCompareOverlayScalePct={
                            dossier.categorySketchCompareOverlayScalePct
                          }
                          categorySketchCompareOffsetXPct={dossier.categorySketchCompareOffsetXPct}
                          categorySketchCompareOffsetYPct={dossier.categorySketchCompareOffsetYPct}
                          sketchPropagatedDrafts={dossier.sketchPropagatedDrafts ?? []}
                          auditActor={updatedByLabel}
                          categorySketchRevisionLabel={dossier.categorySketchRevisionLabel}
                          categorySketchFreezeUntilDate={dossier.categorySketchFreezeUntilDate}
                          categorySketchProductionApproved={
                            dossier.categorySketchProductionApproved
                          }
                          categorySketchCompliance={dossier.categorySketchCompliance}
                          sketchBrandbookConstraints={dossier.sketchBrandbookConstraints}
                          sketchMasterAnnotationAuditLog={
                            dossier.sketchMasterAnnotationAuditLog ?? []
                          }
                          categorySketchRevisionSnapshots={
                            dossier.categorySketchRevisionSnapshots ?? []
                          }
                          categorySketchSceneId={dossier.categorySketchSceneId}
                          categorySketchSceneView={dossier.categorySketchSceneView}
                          sketchMesDefectCatalog={dossier.sketchMesDefectCatalog}
                          onAppendSketchRevisionSnapshot={() => {
                            setDossier((p: Workshop2DossierPhase1) => {
                              const next = appendCategorySketchRevisionSnapshot(p, {
                                leafId: currentLeaf.leafId,
                                by: updatedByLabel,
                                revisionLabel: p.categorySketchRevisionLabel ?? 'snapshot',
                                annotations: p.categorySketchAnnotations ?? [],
                                compliance: p.categorySketchCompliance,
                              });
                              const snap = next.categorySketchRevisionSnapshots?.at(-1);
                              const pinCount = snap?.annotations.length ?? 0;
                              const audit = mergeSketchMasterAuditLog(
                                next.sketchMasterAnnotationAuditLog ?? [],
                                [
                                  {
                                    entryId:
                                      typeof crypto !== 'undefined' && crypto.randomUUID
                                        ? crypto.randomUUID()
                                        : `e-${Date.now()}`,
                                    at: new Date().toISOString(),
                                    by: updatedByLabel,
                                    annotationId: '__plm_snapshot__',
                                    action: 'revision_snapshot',
                                    summary: `Архив PLM: снимок «${p.categorySketchRevisionLabel ?? 'snapshot'}», ${pinCount} мет.`,
                                  },
                                ]
                              );
                              return { ...next, sketchMasterAnnotationAuditLog: audit };
                            });
                          }}
                          sketchTasksPanel={
                            <SubcategorySketchTasksRibbon
                              currentLeaf={currentLeaf}
                              dossier={dossier}
                              articleSku={skuDraft}
                              articleName={nameDraft}
                              setDossier={setDossier}
                              sketchContext={{
                                audienceId: selectedAudienceId,
                                audienceName: selectedAudienceLabel,
                                isUnisex: dossier.isUnisex,
                              }}
                            />
                          }
                          onSavePinTemplateToDossier={saveMasterSketchPinTemplate}
                          onSavePinTemplateToOrg={saveMasterSketchPinTemplateToOrg}
                          visualCatalogAttributeIds={visualsCatalogAttributeIdsForSketch}
                          visualCatalogSketchLinks={visualsCatalogSketchLinksForPins}
                          onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
                        />
                      </>
                    ) : (
                      <div className="border-border-default rounded-xl border bg-white p-3 shadow-sm">
                        <CategorySketchSheetsBlock
                          currentLeaf={currentLeaf}
                          dossier={dossier}
                          setDossier={setDossier}
                          bomLinePickOptions={bomLinePickOptions}
                          masterSketchAnnotations={dossier.categorySketchAnnotations ?? []}
                          sketchContext={{
                            audienceId: selectedAudienceId,
                            audienceName: selectedAudienceLabel,
                            isUnisex: dossier.isUnisex,
                          }}
                          articleSku={skuDraft}
                          collectionId={collectionId}
                          sketchOrgLibraryRevision={orgSketchLibraryRevision}
                          onOrgSketchTemplatesMutated={() =>
                            setOrgSketchLibraryRevision((n) => n + 1)
                          }
                          auditActor={updatedByLabel}
                          sketchViewFloor={sketchEditsLocked}
                          embeddedPicker={
                            normalizedSketchSheets.length > 0
                              ? {
                                  activeSheetId:
                                    sketchSheetPickerId ?? normalizedSketchSheets[0]!.sheetId,
                                  onActiveSheetChange: setSketchSheetPickerId,
                                }
                              : undefined
                          }
                          onJumpToDossierSection={(sec) => setActiveSection(sec)}
                          onNavigateRouteStage={(st) =>
                            onNavigateToTab?.(SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB[st])
                          }
                          visualCatalogAttributeIds={visualsCatalogAttributeIdsForSketch}
                          visualCatalogSketchLinks={visualsCatalogSketchLinksForPins}
                          onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
                        />
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="sublevels" className="mt-0 outline-none focus-visible:ring-0">
                    <div className="space-y-3">
                      <div className="border-border-default space-y-2 rounded-lg border bg-white p-2 shadow-sm">
                        <p className="text-text-secondary text-[10px] leading-snug">
                          <span className="text-text-primary font-semibold">Артикул:</span>{' '}
                          <span className="text-text-primary font-mono">
                            {skuDraft.trim() || '—'}
                          </span>
                          <span className="text-text-muted"> · </span>
                          <span className="text-text-primary font-semibold">
                            Аудитория каталога (L3):
                          </span>{' '}
                          <span className="text-text-primary">{selectedAudienceLabel}</span>
                          <span className="text-text-secondary mt-0.5 block">
                            Название в паспорте — отдельное поле; формулировки вроде «мужское» там
                            не меняют выбранную аудиторию листа.
                          </span>
                        </p>
                        <p className="text-text-primary text-[10px] leading-snug">
                          <span className="text-text-primary font-semibold">По умолчанию</span>{' '}
                          редактируется слот{' '}
                          <strong className="text-text-primary font-semibold">
                            «{BRANCH_CATALOG_SLOT_ROLE[3].label}»
                          </strong>{' '}
                          — требования и мини-скетч на уровне карточки артикула. Переключение на
                          линию или группу — только если процессу нужна отдельная формулировка на
                          весь раздел или подтип.
                        </p>
                        {subcategorySketchActiveLevel !== 3 ? (
                          <p className="rounded-md border border-amber-200 bg-amber-50/80 px-2 py-1.5 text-[10px] text-amber-950">
                            Сейчас открыт слот{' '}
                            <strong>
                              «{BRANCH_CATALOG_SLOT_ROLE[subcategorySketchActiveLevel].label}»
                            </strong>
                            . Вернуться к модели можно в блоке «Уровни ветки» ниже.
                          </p>
                        ) : null}
                        <Collapsible
                          open={branchLevelsDetailsOpen}
                          onOpenChange={(open) => {
                            setBranchLevelsDetailsOpen(open);
                            if (typeof window === 'undefined') return;
                            try {
                              localStorage.setItem(
                                WORKSHOP_BRANCH_LEVELS_DETAILS_LS_KEY,
                                open ? '1' : '0'
                              );
                            } catch {
                              /* ignore */
                            }
                          }}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-text-primary h-8 w-full justify-between gap-2 text-left text-[10px] font-medium sm:w-auto sm:min-w-[16rem]"
                              aria-expanded={branchLevelsDetailsOpen}
                            >
                              <span>Уровни ветки (линия · группа · модель)</span>
                              <LucideIcons.ChevronDown
                                className={cn(
                                  'text-text-secondary h-4 w-4 shrink-0 transition-transform',
                                  branchLevelsDetailsOpen && 'rotate-180'
                                )}
                                aria-hidden
                              />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                            <p className="text-text-secondary pt-2 text-[10px] leading-snug">
                              Три слота совпадают с узлами пути в справочнике; текст и метки в
                              каждом слоте раздельны. Наследование формулировок между слотами — в
                              блоке задач справа («Принять оттуда»).
                            </p>
                            {/* cabinetSurface v1 */}
                            <div
                              className={cn(
                                cabinetSurface.groupTabList,
                                'border-border-default/90 bg-bg-surface2/90 h-auto min-h-8 w-fit flex-wrap rounded-md p-0.5'
                              )}
                              role="tablist"
                              aria-label="Слот узла ветки"
                            >
                              {([1, 2, 3] as const).map((lv) => {
                                const nodeName =
                                  lv === 1
                                    ? currentLeaf.l1Name
                                    : lv === 2
                                      ? currentLeaf.l2Name
                                      : currentLeaf.l3Name;
                                const role = BRANCH_CATALOG_SLOT_ROLE[lv];
                                return (
                                  <Button
                                    key={lv}
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className={cn(
                                      cabinetSurface.groupTabButton,
                                      'text-text-secondary h-7 shrink-0 px-2.5 text-[10px] font-semibold',
                                      subcategorySketchActiveLevel === lv &&
                                        cn(
                                          cabinetSurface.groupTabButtonActive,
                                          'text-text-primary shadow-sm'
                                        )
                                    )}
                                    onClick={() => setSubcategorySketchActiveLevel(lv)}
                                    title={`Узел ветки: ${nodeName}. ${role.hint}`}
                                    aria-pressed={subcategorySketchActiveLevel === lv}
                                  >
                                    {role.label}
                                  </Button>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                      <div className="border-border-default rounded-xl border bg-white p-3 shadow-sm">
                        <CategorySubcategorySketchesTzBlock
                          currentLeaf={currentLeaf}
                          dossier={dossier}
                          articleSku={skuDraft}
                          articleName={nameDraft}
                          setDossier={setDossier}
                          sketchContext={{
                            audienceId: selectedAudienceId,
                            audienceName: selectedAudienceLabel,
                            isUnisex: dossier.isUnisex,
                          }}
                          masterSketchAnnotations={dossier.categorySketchAnnotations ?? []}
                          activeLevel={subcategorySketchActiveLevel}
                          sketchViewFloor={sketchEditsLocked}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <LucideIcons.Pencil className="h-4 w-4 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-text-primary text-base font-semibold">
                      Скетч по категории
                    </h2>
                    <p className="text-text-secondary text-sm leading-snug">
                      Один силуэт на выбранную ветку каталога: отметьте узлы на скетче, привяжите
                      метки к полям ТЗ.
                    </p>
                    <div className="border-border-subtle flex flex-col gap-2 border-t pt-2 sm:flex-row sm:flex-wrap sm:items-stretch">
                      <div className="flex flex-wrap items-center gap-2">
                        <SketchViewModeToggle
                          floor={sketchViewFloor}
                          onFloorChange={setSketchFloorMode}
                          lockedToFloor={lockedSketchFloorOnly || tzWriteDisabled}
                          onCopyFloorLink={copySketchFloorLink}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={saveSketchLabelsSnapshot}
                        >
                          Снимок меток
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          disabled={sketchBundleBusy}
                          onClick={() => void exportSketchVisualBundleZip()}
                        >
                          {sketchBundleBusy ? 'Архив…' : 'ZIP: PNG + PDF'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setSketchPinLibraryOpen(true)}
                        >
                          Снимки и шаблоны…
                        </Button>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-text-primary h-auto min-h-8 shrink-0 gap-2 px-3 py-2 text-left text-xs font-medium leading-snug sm:max-w-[12rem]"
                          >
                            <LucideIcons.CircleHelp
                              className="text-accent-primary h-4 w-4 shrink-0"
                              aria-hidden
                            />
                            <span>
                              Панель скетча
                              <span className="text-text-secondary mt-0.5 block text-[10px] font-normal">
                                как пользоваться
                              </span>
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="max-h-[min(32rem,70vh)] w-[min(calc(100vw-1.5rem),24rem)] overflow-y-auto p-0"
                          sideOffset={6}
                        >
                          <div className="border-border-subtle bg-bg-surface2/80 border-b px-4 py-3">
                            <p className="text-text-primary text-sm font-semibold">
                              Панель над скетчем
                            </p>
                            <p className="text-text-secondary mt-1 text-xs leading-snug">
                              Те же смыслы, что и в фазе 1: режим ТЗ/цех, ссылка для цеха,
                              библиотека и выгрузки.
                            </p>
                          </div>
                          <div className="text-text-primary space-y-4 p-4 text-xs leading-relaxed">
                            <section>
                              <p className="text-text-primary font-semibold">Режим · ТЗ / Цех</p>
                              <p className="text-text-secondary mt-1">
                                ТЗ — правки меток; цех — только просмотр крупных номеров. Ссылка
                                цеха копирует URL с{' '}
                                <code className="bg-bg-surface2 rounded px-1 py-0.5 font-mono text-[10px]">
                                  ?sketchFloor=1
                                </code>
                                .
                              </p>
                            </section>
                            <section>
                              <p className="text-text-primary font-semibold">Снимки и шаблоны</p>
                              <p className="text-text-secondary mt-1">
                                Открывает библиотеку шаблонов и эталонов. Снимок меток и ZIP —
                                быстрый экспорт без меню «Ещё».
                              </p>
                            </section>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className="border-border-subtle bg-bg-surface2/60 flex flex-col gap-2 rounded-lg border p-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <span className="text-text-secondary text-[10px] font-semibold uppercase tracking-wide">
                    Шаблоны меток
                  </span>
                  <select
                    className="border-border-default h-9 min-w-[200px] flex-1 rounded-md border bg-white px-2 text-sm disabled:opacity-60"
                    value={sketchMasterTemplateId}
                    disabled={sketchEditsLocked}
                    onChange={(e) => setSketchMasterTemplateId(e.target.value)}
                    aria-label="Выбор шаблона меток"
                  >
                    <option value="">— шаблон —</option>
                    {(dossier.sketchPinTemplates ?? []).length > 0 ? (
                      <optgroup label="Это досье">
                        {(dossier.sketchPinTemplates ?? []).map((t) => (
                          <option key={`d:${t.templateId}`} value={`d:${t.templateId}`}>
                            {t.name} ({t.annotations.length} пин.)
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                    {orgSketchTemplatesList.length > 0 ? (
                      <optgroup label="Библиотека коллекции (браузер)">
                        {orgSketchTemplatesList.map((t) => (
                          <option key={`o:${t.templateId}`} value={`o:${t.templateId}`}>
                            {t.name} ({t.annotations.length} пин.)
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                  </select>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={!sketchMasterTemplateId || sketchEditsLocked}
                      onClick={() => applyMasterSketchPinTemplate('merge')}
                    >
                      + К доске
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={!sketchMasterTemplateId || sketchEditsLocked}
                      onClick={() => applyMasterSketchPinTemplate('replace')}
                    >
                      Заменить
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={sketchEditsLocked}
                      onClick={saveMasterSketchPinTemplate}
                    >
                      В досье
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={sketchEditsLocked}
                      onClick={saveMasterSketchPinTemplateToOrg}
                    >
                      В коллекцию
                    </Button>
                  </div>
                </div>
                <CategorySketchAnnotator
                  currentLeaf={currentLeaf}
                  imageDataUrl={dossier.categorySketchImageDataUrl}
                  imageFileName={dossier.categorySketchImageFileName}
                  annotations={dossier.categorySketchAnnotations ?? []}
                  attributeOptions={sketchAttributeOptions}
                  sketchContext={{
                    audienceId: selectedAudienceId,
                    audienceName: selectedAudienceLabel,
                    isUnisex: dossier.isUnisex,
                  }}
                  onNavigateStage={(stage) => onNavigateToTab?.(stage)}
                  onJumpToDossierSection={(sec) => setActiveSection(sec)}
                  onNavigateRouteStage={(st) =>
                    onNavigateToTab?.(SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB[st])
                  }
                  onPatch={(patch) =>
                    setDossier((p: Workshop2DossierPhase1) => ({ ...p, ...patch }))
                  }
                  showPassportSectionHeader={false}
                  pinTextSnippets={DEFAULT_MASTER_PIN_SNIPPETS}
                  exportFileNameStem={`master-${skuDraft.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-').slice(0, 48)}`}
                  articleSku={skuDraft}
                  viewMode={sketchEditsLocked ? 'floor' : 'edit'}
                  subcategorySketchSlots={dossier.subcategorySketchSlots ?? []}
                  categorySketchCompareOverlayDataUrl={
                    dossier.categorySketchCompareOverlayDataUrl ?? undefined
                  }
                  categorySketchCompareOverlayFileName={
                    dossier.categorySketchCompareOverlayFileName ?? undefined
                  }
                  categorySketchCompareOverlayOpacityPct={
                    dossier.categorySketchCompareOverlayOpacityPct
                  }
                  categorySketchCompareOverlayScalePct={
                    dossier.categorySketchCompareOverlayScalePct
                  }
                  categorySketchCompareOffsetXPct={dossier.categorySketchCompareOffsetXPct}
                  categorySketchCompareOffsetYPct={dossier.categorySketchCompareOffsetYPct}
                  sketchPropagatedDrafts={dossier.sketchPropagatedDrafts ?? []}
                  auditActor={updatedByLabel}
                  categorySketchRevisionLabel={dossier.categorySketchRevisionLabel}
                  categorySketchFreezeUntilDate={dossier.categorySketchFreezeUntilDate}
                  categorySketchProductionApproved={dossier.categorySketchProductionApproved}
                  categorySketchCompliance={dossier.categorySketchCompliance}
                  sketchBrandbookConstraints={dossier.sketchBrandbookConstraints}
                  sketchMasterAnnotationAuditLog={dossier.sketchMasterAnnotationAuditLog ?? []}
                  categorySketchRevisionSnapshots={dossier.categorySketchRevisionSnapshots ?? []}
                  categorySketchSceneId={dossier.categorySketchSceneId}
                  categorySketchSceneView={dossier.categorySketchSceneView}
                  sketchMesDefectCatalog={dossier.sketchMesDefectCatalog}
                  onAppendSketchRevisionSnapshot={() => {
                    setDossier((p: Workshop2DossierPhase1) => {
                      const next = appendCategorySketchRevisionSnapshot(p, {
                        leafId: currentLeaf.leafId,
                        by: updatedByLabel,
                        revisionLabel: p.categorySketchRevisionLabel ?? 'snapshot',
                        annotations: p.categorySketchAnnotations ?? [],
                        compliance: p.categorySketchCompliance,
                      });
                      const snap = next.categorySketchRevisionSnapshots?.at(-1);
                      const pinCount = snap?.annotations.length ?? 0;
                      const audit = mergeSketchMasterAuditLog(
                        next.sketchMasterAnnotationAuditLog ?? [],
                        [
                          {
                            entryId:
                              typeof crypto !== 'undefined' && crypto.randomUUID
                                ? crypto.randomUUID()
                                : `e-${Date.now()}`,
                            at: new Date().toISOString(),
                            by: updatedByLabel,
                            annotationId: '__plm_snapshot__',
                            action: 'revision_snapshot',
                            summary: `Архив PLM: снимок «${p.categorySketchRevisionLabel ?? 'snapshot'}», ${pinCount} мет.`,
                          },
                        ]
                      );
                      return { ...next, sketchMasterAnnotationAuditLog: audit };
                    });
                  }}
                  sketchTasksPanel={
                    <SubcategorySketchTasksRibbon
                      currentLeaf={currentLeaf}
                      dossier={dossier}
                      articleSku={skuDraft}
                      articleName={nameDraft}
                      setDossier={setDossier}
                      sketchContext={{
                        audienceId: selectedAudienceId,
                        audienceName: selectedAudienceLabel,
                        isUnisex: dossier.isUnisex,
                      }}
                    />
                  }
                  onSavePinTemplateToDossier={saveMasterSketchPinTemplate}
                  onSavePinTemplateToOrg={saveMasterSketchPinTemplateToOrg}
                  visualCatalogAttributeIds={visualsCatalogAttributeIdsForSketch}
                  visualCatalogSketchLinks={visualsCatalogSketchLinksForPins}
                  onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
                />
              </>
            )}
          </div>
          <Collapsible
            open={constructionTzHubOpen}
            onOpenChange={setConstructionTzHubOpen}
            className="group/w2-construction-tz-hub space-y-4"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-teal-200/85 bg-teal-50/50 px-3 py-2 text-left text-[11px] font-semibold text-teal-950 shadow-sm transition hover:bg-teal-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
              >
                <LucideIcons.ChevronDown
                  className="h-4 w-4 shrink-0 text-teal-700 transition-transform duration-200 group-data-[state=open]/w2-construction-tz-hub:rotate-180"
                  aria-hidden
                />
                <span className="min-w-0">Справка и чеклист</span>
                <span className="ml-auto hidden shrink-0 text-[9px] font-normal text-teal-800/75 sm:inline">
                  мерки · скетч · узлы
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="border-accent-primary/20 bg-accent-primary/10 min-w-0 flex-1 rounded-lg border px-3 py-2">
                  <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                    Конструктив: {currentLeaf.l2Name?.trim() || 'категория'}
                  </p>
                  <p className="text-text-secondary mt-1 text-[10px] leading-snug">
                    Узлы, мерки и скетч — одна площадка для лекал и производства.
                  </p>
                  <p className="text-text-primary mt-1 text-[11px] leading-snug">{hint}</p>
                </div>
              </div>
              <Workshop2NineGapBacklogStrip
                backlogItems={W2_NINE_GAP_CONSTRUCTION_ROADMAP}
                stripTitle="Конструктор · дорожная карта"
                variant="purple"
                sectionPct={sectionReadiness.construction.pct}
                onDossierJump={jumpToTzSectionAnchor}
                footer={
                  <WorkshopNineGapRelatedFooterShell
                    matSketchBomGapRefs={matSketchBomGapRefs}
                    onJumpMaterialHub={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
                    onJumpSketch={() =>
                      jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)
                    }
                    onJumpMaterialMatTable={jumpToMaterialMatTable}
                    onJumpConstructionContour={jumpToConstructionContour}
                    onJumpQcRoute={onNavigateToTab ? jumpToQcArticleSection : undefined}
                    hint="Метки, мерки и mat — без разрывов."
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => jumpToTzSectionAnchor('general', 'w2-passport-hub')}
                    >
                      Паспорт
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() =>
                        jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)
                      }
                    >
                      Скетч
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
                    >
                      BOM
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() =>
                        jumpToTzSectionAnchor('construction', 'w2-measurements-fields')
                      }
                    >
                      Мерки
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() =>
                        jumpToTzSectionAnchor(
                          'construction',
                          W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour
                        )
                      }
                    >
                      Контур
                    </Button>
                  </WorkshopNineGapRelatedFooterShell>
                }
              />
              <div
                id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.export}
                className="border-border-default/90 bg-bg-surface2/80 text-text-primary scroll-mt-24 rounded-lg border px-3 py-2.5 text-[11px] shadow-sm"
              >
                <p className="text-text-secondary text-[9px] font-black uppercase tracking-wide">
                  Выгрузка узлов / ТК для цеха
                </p>
                <p className="text-text-primary mt-1 leading-snug">
                  Печать ТК — в маршруте вне этой карточки; здесь только согласованные данные.
                </p>
              </div>
              <div
                id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.signoff}
                className="border-accent-primary/25 bg-accent-primary/10 text-text-primary scroll-mt-24 rounded-lg border px-3 py-2.5 text-[11px] shadow-sm"
              >
                <p className="text-text-primary text-[9px] font-black uppercase tracking-wide">
                  Подпись блока конструкции
                </p>
                <p className="text-text-primary/90 mt-1 leading-snug">
                  Подписи — в панели «Этап ТЗ» вверху экрана.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-2 h-7 text-[10px]"
                  onClick={() =>
                    document.getElementById(W2_TZ_SECTION_STAGE_DOM_ID)?.scrollIntoView({
                      behavior: tzScrollBehavior,
                      block: 'start',
                    })
                  }
                >
                  К панели этапа ТЗ
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible
            defaultOpen={false}
            className="border-border-default bg-bg-surface2/40 mx-1 scroll-mt-4 rounded-lg border sm:mx-2"
          >
            <CollapsibleTrigger className="text-text-primary hover:bg-bg-surface2/80 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold">
              <span>Поля каталога: конструкция · мерки · доп. строки ТЗ</span>
              <LucideIcons.ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-border-default/80 space-y-4 border-t px-3 pb-3 pt-3">
                {renderSectionRows(constructionRowsToRender, currentPhase, extraRowsCurrent)}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    return renderSectionRows(sectionRowsCurrent, currentPhase);
  })();

  const internalArticleCodeDisplayForRibbon = isWorkshop2InternalArticleCodeValid(
    internalArticleCode
  )
    ? internalArticleCode
    : formatWorkshop2InternalArticleCodePlaceholder();

  const compactPassportContextRibbon =
    isPhase1 &&
    activeSection !== 'general' &&
    workshop2DossierViewUiCaps(dossierViewProfile).showCompactPassportContextRibbon ? (
      <div
        id="w2-tz-compact-passport-context"
        className="border-accent-primary/20 bg-accent-primary/10 text-text-primary rounded-lg border px-3 py-2 text-[11px] shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-accent-primary font-semibold tabular-nums">
            SKU: {skuDraft.trim() || '—'}
          </span>
          <span className="text-text-muted" aria-hidden>
            ·
          </span>
          <span className="text-text-primary font-mono text-[10px]">
            {internalArticleCodeDisplayForRibbon}
          </span>
          {(nameDraft || '').trim() ? (
            <>
              <span className="text-text-muted" aria-hidden>
                ·
              </span>
              <span
                className="text-text-secondary max-w-[min(320px,48vw)] truncate"
                title={(nameDraft || '').trim()}
              >
                {(nameDraft || '').trim()}
              </span>
            </>
          ) : null}
          <span className="min-[420px]:grow sm:grow" />
          <Button
            type="button"
            variant="link"
            className="text-accent-primary h-auto min-h-0 p-0 text-[10px] font-semibold"
            onClick={() => jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.hub)}
          >
            Паспорт · хаб
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-accent-primary h-auto min-h-0 p-0 text-[10px] font-semibold"
            onClick={() => jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.market)}
          >
            Рынок и коды
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-accent-primary h-auto min-h-0 p-0 text-[10px] font-semibold"
            onClick={() => jumpToTzSectionAnchor('visuals', W2_VISUAL_SUBPAGE_ANCHORS.canonVersion)}
          >
            Канон
          </Button>
        </div>
      </div>
    ) : null;

  return (
    <div className="w-full min-w-0 space-y-6 text-left" data-w2-dossier-view={dossierViewProfile}>
      {tzWriteDisabled ? (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
          role="status"
        >
          <span className="font-semibold">Только просмотр.</span> У этой роли нет права
          «Редактировать производство» — изменения ТЗ и скетча не сохраняются; экспорт и печать
          по-прежнему доступны.
        </div>
      ) : null}

      {isPhase1 && dossierViewProfile === 'factory' ? (
        <div className="border-border-default rounded-lg border bg-white px-3 py-2 shadow-sm">
          <p className="text-text-secondary text-[10px] font-semibold uppercase tracking-wide">
            Быстрый переход по ТЗ
          </p>
          <nav className="text-accent-primary mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium">
            <button
              type="button"
              className="hover:underline"
              onClick={() => jumpToTzSectionAnchor('general', 'w2-passport-hub')}
            >
              Паспорт
            </button>
            <span className="text-text-muted" aria-hidden>
              ·
            </span>
            <button
              type="button"
              className="hover:underline"
              onClick={() => jumpToTzSectionAnchor('visuals', 'w2-visuals-hub')}
            >
              Визуал
            </button>
            <span className="text-text-muted" aria-hidden>
              ·
            </span>
            <button
              type="button"
              className="hover:underline"
              onClick={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
            >
              Материал
            </button>
            <span className="text-text-muted" aria-hidden>
              ·
            </span>
            <button
              type="button"
              className="hover:underline"
              onClick={() => jumpToTzSectionAnchor('construction', 'w2-construction-hub')}
            >
              Конструкции
            </button>
          </nav>
        </div>
      ) : null}

      {isPhase1 ? (
        <div
          id={W2_PASSPORT_SUBPAGE_ANCHORS.denseView}
          className="min-w-0 w-full scroll-mt-20"
        >
          <div className="mr-auto w-full max-w-full">
            <DossierNavigator
              layout="horizontal"
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              sectionReadiness={sectionReadiness}
              handbookCheckBySection={handbookCheckSnapshot?.bySection ?? null}
              dossierViewProfile={dossierViewProfile}
              primarySections={dossierNavPrimarySections}
              secondarySections={dossierNavSecondarySections}
              allSections={SECTIONS}
            />
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div
          id="w2-dossier-main"
          className={cn(
            'min-w-0 space-y-4 rounded-xl transition-[box-shadow] duration-300',
            dossierMainColumnFlash && 'ring-accent-primary ring-4 ring-offset-2 ring-offset-white'
          )}
        >
          {isPhase1 && (dossierViewProfile === 'factory' || dossierViewProfile === 'finance') ? (
            <div className="bg-bg-surface2/60 space-y-2 rounded-lg p-0.5 shadow-sm">
              {dossierViewProfile === 'factory' ? (
                <div className="border-accent-primary/20 flex flex-wrap gap-1 border-t pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[9px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub)
                    }
                  >
                    Конструкция
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[9px]"
                    onClick={jumpToConstructionContour}
                  >
                    Контур
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[9px]"
                    onClick={jumpToSketchLineRefs}
                  >
                    Скетч
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[9px]"
                    onClick={() => jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.hub)}
                  >
                    BOM
                  </Button>
                </div>
              ) : null}
              {dossierViewProfile === 'finance' ? (
                <div className="flex flex-wrap gap-1 border-t border-emerald-200/60 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 border-emerald-200 text-[9px] text-emerald-950"
                    onClick={() =>
                      jumpToTzSectionAnchor('visuals', W2_VISUAL_SUBPAGE_ANCHORS.canonVersion)
                    }
                  >
                    Канон
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 border-emerald-200 text-[9px] text-emerald-950"
                    onClick={() => jumpToTzSectionAnchor('general', 'w2-passport-hub')}
                  >
                    Паспорт
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
          <div id={W2_TZ_SECTION_STAGE_DOM_ID} className="sticky top-4 z-20 scroll-mt-24 space-y-2">
            <SectionStageBoard
              warnings={stageBoardHandbookWarnings}
              onJumpToVisualBrandNotes={() => {
                setActiveSection('visuals');
                queueMicrotask(() => {
                  document
                    .getElementById('w2-attr-brandNotes')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
              }}
            />
            {tzRevokeDeniedHint ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-[11px] text-amber-900">
                {tzRevokeDeniedHint}
              </p>
            ) : null}
          </div>
          {dossierViewProfile !== 'full' &&
          !isWorkshop2DossierViewPrimarySection(dossierViewProfile, activeSection) ? (
            <div
              className="border-border-default bg-bg-surface2/95 text-text-primary flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2 text-[11px]"
              role="status"
            >
              <p className="min-w-0 leading-snug">
                <span className="font-semibold">Вторичный раздел</span> для режима «
                {WORKSHOP2_DOSSIER_VIEW_OPTIONS.find((o) => o.value === dossierViewProfile)
                  ?.label ?? dossierViewProfile}
                ». Первичные:{' '}
                {dossierNavPrimarySections.map((s) => SECTION_LABEL_BY_ID[s.id]).join(', ')}.
              </p>
              {dossierNavPrimarySections[0] ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 shrink-0 text-[10px]"
                  onClick={() => setActiveSection(dossierNavPrimarySections[0]!.id)}
                >
                  К: {SECTION_LABEL_BY_ID[dossierNavPrimarySections[0]!.id]}
                </Button>
              ) : null}
            </div>
          ) : null}
          {compactPassportContextRibbon}
          {sectionBody}

          <Dialog open={sketchPinLibraryOpen} onOpenChange={setSketchPinLibraryOpen}>
            <DialogContent className="max-h-[85vh] w-[min(560px,95vw)] max-w-[95vw] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Снимки и шаблоны меток</DialogTitle>
                <DialogDescription>
                  Снимки — полная копия меток master и листов. Шаблоны в досье и в библиотеке
                  коллекции (пока localStorage; позже — тот же контракт через API). QR для печати и
                  PDF генерируется локально в браузере.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="snapshots" className="w-full">
                {/* cabinetSurface v1 */}
                <TabsList
                  className={cn(
                    cabinetSurface.tabsList,
                    'mb-2 grid h-auto min-h-9 w-full grid-cols-3 gap-0.5 p-1'
                  )}
                >
                  <TabsTrigger
                    value="snapshots"
                    className={cn(
                      cabinetSurface.tabsTrigger,
                      'h-9 text-[10px] font-semibold normal-case tracking-normal sm:text-xs'
                    )}
                  >
                    Снимки
                  </TabsTrigger>
                  <TabsTrigger
                    value="templates"
                    className={cn(
                      cabinetSurface.tabsTrigger,
                      'h-9 text-[10px] font-semibold normal-case tracking-normal sm:text-xs'
                    )}
                  >
                    Досье
                  </TabsTrigger>
                  <TabsTrigger
                    value="collection"
                    className={cn(
                      cabinetSurface.tabsTrigger,
                      'h-9 text-[10px] font-semibold normal-case tracking-normal sm:text-xs'
                    )}
                  >
                    Коллекция
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="snapshots"
                  className="max-h-[50vh] space-y-2 overflow-y-auto pr-1"
                >
                  {sketchSnapshotsNewestFirst.length >= 2 ? (
                    <div className="border-accent-primary/20 bg-accent-primary/10 text-text-primary rounded-md border p-2 text-[11px]">
                      <p className="text-accent-primary font-medium">
                        Сравнить master между снимками
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <select
                          className="border-border-default h-8 min-w-[140px] flex-1 rounded border bg-white px-2 text-xs"
                          value={sketchSnapshotDiffA}
                          onChange={(e) => setSketchSnapshotDiffA(e.target.value)}
                          aria-label="Первый снимок"
                        >
                          <option value="">Снимок A</option>
                          {sketchSnapshotsNewestFirst.map((s) => (
                            <option key={`a-${s.snapshotId}`} value={s.snapshotId}>
                              {s.label?.trim() || 'Без подписи'} · {formatTzLogTimestamp(s.at)}
                            </option>
                          ))}
                        </select>
                        <select
                          className="border-border-default h-8 min-w-[140px] flex-1 rounded border bg-white px-2 text-xs"
                          value={sketchSnapshotDiffB}
                          onChange={(e) => setSketchSnapshotDiffB(e.target.value)}
                          aria-label="Второй снимок"
                        >
                          <option value="">Снимок B</option>
                          {sketchSnapshotsNewestFirst.map((s) => (
                            <option key={`b-${s.snapshotId}`} value={s.snapshotId}>
                              {s.label?.trim() || 'Без подписи'} · {formatTzLogTimestamp(s.at)}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-8 text-xs"
                          onClick={() => {
                            const sa = sketchSnapshotsNewestFirst.find(
                              (x) => x.snapshotId === sketchSnapshotDiffA
                            );
                            const sb = sketchSnapshotsNewestFirst.find(
                              (x) => x.snapshotId === sketchSnapshotDiffB
                            );
                            if (!sa || !sb) {
                              setSketchSnapshotDiffSummary('Выберите два разных снимка.');
                              return;
                            }
                            const d = diffMasterSketchAnnotations(
                              sa.masterAnnotations ?? [],
                              sb.masterAnnotations ?? []
                            );
                            const lines = [
                              `Добавлено меток: ${d.addedIds.length}${d.addedIds.length ? ` (${d.addedIds.slice(0, 6).join(', ')}${d.addedIds.length > 6 ? '…' : ''})` : ''}`,
                              `Удалено меток: ${d.removedIds.length}${d.removedIds.length ? ` (${d.removedIds.slice(0, 6).join(', ')}${d.removedIds.length > 6 ? '…' : ''})` : ''}`,
                              `Сдвинуто по полю: ${d.moved.length}`,
                              `Изменён текст: ${d.textChanged.length}`,
                            ];
                            setSketchSnapshotDiffSummary(lines.join('\n'));
                          }}
                        >
                          Сравнить
                        </Button>
                      </div>
                      {sketchSnapshotDiffSummary ? (
                        <pre className="border-accent-primary/20 text-text-primary mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded border bg-white p-2 text-[10px]">
                          {sketchSnapshotDiffSummary}
                        </pre>
                      ) : null}
                    </div>
                  ) : null}
                  {sketchSnapshotsNewestFirst.length === 0 ? (
                    <p className="text-text-secondary text-sm">
                      Пока нет снимков. Нажмите «Снимок меток» в шапке блока скетча.
                    </p>
                  ) : (
                    sketchSnapshotsNewestFirst.map((snap) => (
                      <div
                        key={snap.snapshotId}
                        className="border-border-default flex flex-wrap items-start justify-between gap-2 rounded-md border bg-white p-2 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="text-text-primary font-medium">
                            {snap.label?.trim() || 'Без подписи'}
                          </p>
                          <p className="text-text-secondary text-xs">
                            {formatTzLogTimestamp(snap.at)} · {snap.by}
                          </p>
                          <p className="text-text-secondary text-[11px]">
                            Master: {snap.masterAnnotations?.length ?? 0} · Листов в снимке:{' '}
                            {snap.sheets?.length ?? 0}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8 shrink-0 text-xs"
                          onClick={() => restoreSketchLabelsFromSnapshot(snap)}
                        >
                          Вернуть
                        </Button>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent
                  value="templates"
                  className="max-h-[50vh] space-y-2 overflow-y-auto pr-1"
                >
                  {(dossier.sketchPinTemplates ?? []).length === 0 ? (
                    <p className="text-text-secondary text-sm">
                      В досье нет шаблонов. Сохраните метки кнопкой «В досье» над доской или на
                      скетч-листе.
                    </p>
                  ) : (
                    (dossier.sketchPinTemplates ?? []).map((t) => (
                      <div
                        key={t.templateId}
                        className="border-border-default flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white p-2 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="text-text-primary font-medium">{t.name}</p>
                          <p className="text-text-secondary text-xs">
                            {formatTzLogTimestamp(t.createdAt)} · {t.annotations.length} меток
                            {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-rose-600 hover:text-rose-700"
                          onClick={() => deleteSketchPinTemplateById(t.templateId)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent
                  value="collection"
                  className="max-h-[50vh] space-y-2 overflow-y-auto pr-1"
                >
                  {!String(collectionId ?? '').trim() ? (
                    <p className="text-text-secondary text-sm">
                      Нет id коллекции — библиотека недоступна.
                    </p>
                  ) : orgSketchTemplatesList.length === 0 ? (
                    <p className="text-text-secondary text-sm">
                      В этом браузере для коллекции пока нет шаблонов. Сохраните метки кнопкой «В
                      коллекцию» над доской.
                    </p>
                  ) : (
                    orgSketchTemplatesList.map((t) => (
                      <div
                        key={t.templateId}
                        className="border-border-default flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white p-2 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="text-text-primary font-medium">{t.name}</p>
                          <p className="text-text-secondary text-xs">
                            {formatTzLogTimestamp(t.createdAt)} · {t.annotations.length} меток
                            {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-rose-600 hover:text-rose-700"
                          onClick={() => deleteOrgSketchPinTemplateById(t.templateId)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <aside className="space-y-4 self-start xl:sticky xl:top-4">
          <div className="border-border-default space-y-4 rounded-xl border bg-white p-4 shadow-sm">
            <div id="w2-tz-digital-signoffs" className="scroll-mt-24 space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <LucideIcons.BadgeCheck className="h-4 w-4 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-text-primary text-base font-semibold">
                    Подписи этапа ТЗ · {SECTION_LABEL_BY_ID[activeSection]}
                  </h2>
                  <p className="text-text-secondary text-xs leading-snug">
                    Подписи по текущему разделу. Права на подпись и отзыв — в разделе{' '}
                    <Link
                      href={ROUTES.brand.teamPermissions}
                      className="text-accent-primary font-medium underline"
                    >
                      Команда
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {tzDigitalSignoffRows.length === 0 ? (
                  <p className="border-border-subtle bg-bg-surface2/60 text-text-secondary rounded-md border px-3 py-2 text-[11px]">
                    В паспорте нет участников на этапе «ТЗ»: отметьте этап у ролей и закрепите
                    исполнителей в «Ответственные за подпись ТЗ».
                  </p>
                ) : tzDigitalSignoffRowsForActiveSection.length === 0 ? (
                  <p className="border-border-subtle bg-bg-surface2/60 text-text-secondary rounded-md border px-3 py-2 text-[11px]">
                    В этом разделе ТЗ отдельные подписи не показаны — переключитесь на другой раздел
                    или настройте матрицу в паспорте.
                  </p>
                ) : (
                  tzDigitalSignoffRowsForActiveSection.map((row) => (
                    <Workshop2TzDigitalSignoffRow
                      key={row.rowKey}
                      title={row.title}
                      passportAssigneeName={row.passportAssigneeName}
                      passportAssigneeOrgLabel={row.passportAssigneeOrgLabel}
                      canSign={row.canSign}
                      hasRoleCapability={row.hasRoleCapability}
                      signatoryMismatchHint={row.signatoryMismatchHint}
                      signoff={row.signoff}
                      showNotifyResponsible={!row.signoff}
                      onNotifyResponsible={() =>
                        notifyResponsibleForTzRow(
                          row.rowKey,
                          row.title,
                          row.assigneeForNotify,
                          activeSection
                        )
                      }
                      notifyResponsibleHighlighted={tzNotifyHighlightRowKey === row.rowKey}
                      canRevoke={canRevokeTzSignoff(updatedByLabel, tzRevokersEffective)}
                      onSign={() => signTzDigitalRow(row.rowKey, row.title)}
                      onRevoke={() => revokeTzDigitalRow(row.rowKey, row.title)}
                    />
                  ))
                )}
              </div>
              {handbookCheckSnapshot ? (
                <Workshop2HandbookCheckReportBlock
                  snapshot={handbookCheckSnapshot}
                  sections={SECTIONS}
                  scopeLabel={SECTION_LABEL_BY_ID[handbookCheckSnapshot.scopeSection]}
                  expanded={handbookCheckReportExpanded}
                  onToggleExpanded={() => setHandbookCheckReportExpanded((v) => !v)}
                  onJumpToHandbookCheckTarget={(t) => jumpToTzSectionAnchor(t.section, t.anchorId)}
                />
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {dossier.updatedAt ? (
            <span
              className="text-text-secondary text-[10px]"
              title={`Черновик в браузере: ${new Date(dossier.updatedAt).toLocaleString('ru-RU')}`}
            >
              В работе: {dossier.updatedBy ? dossier.updatedBy : 'без автора'}
            </span>
          ) : null}
          {savedHint ? (
            <span className="text-[11px] font-medium text-emerald-700">{savedHint}</span>
          ) : null}
          {saveError ? (
            <span className="text-[11px] font-medium text-red-600">{saveError}</span>
          ) : null}
        </div>
        {dossierMetricsFooterMounted && dossierMetricsFooterLine ? (
          <span
            className="text-text-muted text-[9px] leading-snug"
            title="Локально в этом браузере, для оценки сессии"
          >
            {dossierMetricsFooterLine}
          </span>
        ) : null}
      </div>

      {/** Нижняя панель: слева навигация и сохранение; по центру проверка и подписи; справа следующий шаг. */}
      <div className="border-border-subtle flex min-h-[2.25rem] flex-col gap-2 border-t pt-3">
        <div className="flex w-full flex-wrap items-center gap-y-2">
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {onBack ? (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="h-9 gap-1.5 px-3 text-xs"
              >
                <LucideIcons.ChevronLeft className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Назад
              </Button>
            ) : onPreviousStep ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onPreviousStep()}
                className="h-9 gap-1.5 px-3 text-xs"
              >
                <LucideIcons.ChevronLeft className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {isPhase3 ? 'Шаг 2' : 'Шаг 1'}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={saveDraft}
              className="h-9 gap-1.5 px-3 text-xs"
            >
              Сохранить
            </Button>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 px-2">
            <Button
              type="button"
              variant="outline"
              onClick={runHandbookCheck}
              className={cn(
                'h-9 text-xs font-semibold transition-colors',
                handbookCheckClean
                  ? 'w-9 border-emerald-400 bg-emerald-50 p-0 text-emerald-700 shadow-sm hover:bg-emerald-100'
                  : 'px-3'
              )}
              title={
                handbookCheckClean
                  ? 'Проверено — нажмите, чтобы перепроверить раздел'
                  : `Проверить только раздел «${SECTION_LABEL_BY_ID[activeSection]}»`
              }
            >
              {handbookCheckClean ? (
                <LucideIcons.CircleCheck className="h-5 w-5 shrink-0" aria-hidden />
              ) : (
                'Проверить'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'h-9 text-xs font-semibold transition-colors',
                allTzDigitalSignoffsDone
                  ? 'w-9 border-emerald-400 bg-emerald-50 p-0 text-emerald-700 shadow-sm ring-2 ring-emerald-300/50 hover:bg-emerald-100'
                  : 'gap-1.5 px-3'
              )}
              title={allTzDigitalSignoffsDone ? 'Все подписи проставлены' : 'Перейти к подписям ТЗ'}
              onClick={() => {
                document
                  .getElementById('w2-tz-digital-signoffs')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {allTzDigitalSignoffsDone ? (
                <LucideIcons.FileCheck2 className="h-5 w-5 shrink-0" aria-hidden />
              ) : (
                <>
                  <LucideIcons.BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Подписи
                </>
              )}
            </Button>
          </div>
          <div className="ml-auto flex shrink-0 items-center">
            <Button
              type="button"
              onClick={handleContinue}
              className="h-9 gap-1.5 px-3 text-xs font-medium"
            >
              {isPhase3 ? 'Готово >' : 'Следующее >'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={tzHistoryOpen} onOpenChange={setTzHistoryOpen}>
        <DialogContent
          className="flex max-h-[85vh] max-w-lg flex-col gap-3 overflow-hidden sm:max-w-lg"
          ariaTitle="История действий на странице ТЗ"
        >
          <DialogHeader>
            <DialogTitle className="text-base">История действий</DialogTitle>
            <DialogDescription>
              Подписи, подтверждения по секциям, сохранение досье и правки артикула (SKU, название,
              ветка каталога). Для каждой записи указаны автор, дата и суть изменения.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[58vh] min-h-0 space-y-2 overflow-y-auto pr-1">
            {!dossier.tzActionLog?.length ? (
              <p className="text-text-secondary text-sm">Пока нет записей.</p>
            ) : (
              [...dossier.tzActionLog].reverse().map((e) => {
                const d = formatTzActionLogDetailRu(e);
                return (
                  <div
                    key={e.entryId}
                    className="border-border-subtle bg-bg-surface2/90 rounded-md border p-2.5 text-left text-xs"
                  >
                    <p className="text-text-primary font-medium leading-snug">{d.text}</p>
                    <p className="text-text-secondary mt-1.5 text-[11px]">
                      <span className="text-text-primary font-semibold">{d.author}</span>
                      <span className="text-text-muted"> · </span>
                      <span>{d.when}</span>
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
