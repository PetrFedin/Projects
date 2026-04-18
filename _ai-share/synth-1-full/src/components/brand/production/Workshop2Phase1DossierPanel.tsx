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
  countOpenVisualRefThreads,
  W2_VISUAL_SUBPAGE_ANCHORS,
} from '@/lib/production/workshop2-visual-section-warnings';
import {
  emptyWorkshop2DossierPhase1,
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildBomLinePickOptions } from '@/lib/production/workshop2-collection-dossier-analytics';
import {
  workshopTzExtraRowsRequiringTzSignoff,
  workshopTzParticipatesOnStage,
  workshopTzSignerAllowed,
  workshopTzSignoffRequiredForRole,
} from '@/lib/production/workshop2-tz-signatory-options';
import { BRANCH_CATALOG_SLOT_ROLE } from '@/lib/production/workshop2-tz-subcategory-sketches';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1AttributeAssignment,
  Workshop2Phase1AttributeValue,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1DimensionRangeCell,
  Workshop2Phase1TechPackAttachment,
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
  Workshop2VisualRefComment,
  Workshop2VisualRefCommentReactionType,
  Workshop2VisualRefTakeawayAspect,
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
  resolveMaterialCompositionPresets,
  type Workshop2MaterialCompositionPreset,
} from '@/lib/production/workshop2-material-composition-presets';
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
  WORKSHOP2_DOSSIER_VIEW_HINTS,
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
import { Workshop2DossierRolePulsePanel } from '@/components/brand/production/Workshop2DossierRolePulsePanel';
import { CategorySketchSheetsBlock } from '@/components/brand/production/CategorySketchSheetsBlock';
import { CategorySubcategorySketchesTzBlock } from '@/components/brand/production/CategorySubcategorySketchesTzBlock';
import { SketchViewModeToggle } from '@/components/brand/production/SketchViewModeToggle';
import { Workshop2VisualsExcellenceBlock } from '@/components/brand/production/Workshop2VisualsExcellenceBlock';
import { Workshop2VisualsTzStickySubnav } from '@/components/brand/production/Workshop2VisualsTzStickySubnav';
import { Workshop2MaterialHubPanel } from '@/components/brand/production/Workshop2MaterialHubPanel';
import { Workshop2DossierNineClosureSummary } from '@/components/brand/production/Workshop2DossierNineClosureSummary';
import { Workshop2NineGapBacklogStrip } from '@/components/brand/production/Workshop2NineGapBacklogStrip';
import { Workshop2DossierSupplyChainDraftsPanel } from '@/components/brand/production/Workshop2DossierSupplyChainDraftsPanel';
import { Workshop2MaterialTzStickySubnav } from '@/components/brand/production/Workshop2MaterialTzStickySubnav';
import { Workshop2PassportTzStickySubnav } from '@/components/brand/production/Workshop2PassportTzStickySubnav';
import { Workshop2PassportHubPanel } from '@/components/brand/production/Workshop2PassportHubPanel';
import { Workshop2MeasurementsTableHub } from '@/components/brand/production/Workshop2MeasurementsTableHub';
import { Workshop2TzSectionRolesPopover } from '@/components/brand/production/Workshop2TzSectionRolesPopover';
import { Workshop2PassportAttributeReferenceBlock } from '@/components/brand/production/Workshop2PassportAttributeReferenceBlock';
import {
  isSketchFloorInSearch,
  replaceSketchFloorInUrl,
  SKETCH_FLOOR_QUERY_PARAM,
} from '@/lib/production/sketch-floor-url';
import { isSketchFloorOnlyRole } from '@/lib/production/sketch-floor-rbac';
import { visualReadinessProgress } from '@/lib/production/workshop2-visual-excellence';

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

/** Подписи полей как у названия атрибута в карточке («Стиль, повод и активность»). */
const WORKSHOP_FIELD_LABEL_CLASS = 'text-sm font-semibold text-text-primary';

const WORKSHOP_HINT_TOOLTIP_CLASS =
  'max-w-[min(22rem,calc(100vw-2rem))] space-y-1.5 border border-border-default bg-white px-3 py-2 text-left text-[11px] leading-snug text-text-primary shadow-md';

/** Две одинаковые кнопки-справки: «Панель скетча» и «Скетч / узлы ветки». */
const SKETCH_PHASE1_HELP_BUTTON_CLASS =
  'inline-flex min-h-7 items-center gap-1.5 rounded-md border border-border-default bg-white px-2 py-0.5 text-left shadow-sm hover:bg-bg-surface2';

/** Подпись поля + иконка «i» с подсказкой (наведение). */
function WorkshopLabelWithHint({
  htmlFor,
  children,
  hint,
  labelClassName,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint: ReactNode;
  labelClassName?: string;
}) {
  const labelCls = cn(WORKSHOP_FIELD_LABEL_CLASS, labelClassName);
  return (
    <div className="flex items-center gap-1">
      {htmlFor ? (
        <Label htmlFor={htmlFor} className={labelCls}>
          {children}
        </Label>
      ) : (
        <span className={labelCls}>{children}</span>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-text-muted hover:bg-bg-surface2 hover:text-text-secondary focus-visible:ring-accent-primary inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2"
            aria-label="Справка по полю"
          >
            <LucideIcons.Info className="h-3 w-3" strokeWidth={2} aria-hidden />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className={WORKSHOP_HINT_TOOLTIP_CLASS}>
          {hint}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function attributeDetailHintBody(attribute: AttributeCatalogAttribute): ReactNode {
  const d = attribute.descriptionHint?.trim();
  const u = attribute.uiInformationHint?.trim();
  if (!d && !u) {
    return (
      <p>
        Поле «{attribute.name}»: выберите значение из справочника или введите текст, если поле это
        допускает. Подсказку для команды можно задать в каталоге атрибутов.
      </p>
    );
  }
  return (
    <div className="space-y-1.5">
      {d ? <p>{d}</p> : null}
      {u ? <p className="text-text-secondary">{u}</p> : null}
    </div>
  );
}

/** Иконка «i» с произвольным содержимым тултипа. */
function WorkshopInlineHintIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-text-muted hover:bg-bg-surface2 hover:text-text-secondary focus-visible:ring-accent-primary inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2"
          aria-label={`Подробнее: ${label}`}
        >
          <LucideIcons.Info className="h-3 w-3" strokeWidth={2} aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className={WORKSHOP_HINT_TOOLTIP_CLASS}>
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

function WorkshopAttributeHintIcon({ attribute }: { attribute: AttributeCatalogAttribute }) {
  return (
    <WorkshopInlineHintIcon label={attribute.name}>
      {attributeDetailHintBody(attribute)}
    </WorkshopInlineHintIcon>
  );
}

const WORKSHOP_REQUIRED_BADGE_TODO_CLASS =
  'text-[9px] font-semibold text-orange-900 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5';
const WORKSHOP_REQUIRED_BADGE_DONE_CLASS =
  'text-[9px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5';

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

function formatSignoffWhoWhen(meta: Workshop2DossierSignoffMeta | undefined): string | null {
  if (!meta?.at) return null;
  try {
    return `${meta.by} · ${new Date(meta.at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}`;
  } catch {
    return meta.by;
  }
}

function WorkshopTzDigitalSignoffRow({
  title,
  canSign,
  signoff,
  onSign,
  onRevoke,
  canRevoke,
  showNotifyResponsible,
  onNotifyResponsible,
  notifyResponsibleHighlighted,
  hasRoleCapability,
  signatoryMismatchHint,
  passportAssigneeName,
}: {
  title: string;
  canSign: boolean;
  signoff?: Workshop2DossierSignoffMeta;
  onSign: () => void;
  onRevoke: () => void;
  canRevoke: boolean;
  /** Пока роль не подписала — кнопка уведомления слева от «Подписать». Скрывается, когда все три подписи стоят. */
  showNotifyResponsible?: boolean;
  onNotifyResponsible?: () => void;
  /** Подсветка только у строки, для которой нажали «Уведомить ответственного». */
  notifyResponsibleHighlighted?: boolean;
  /** Есть ли право роли в команде (без учёта закрепления за лицом). */
  hasRoleCapability?: boolean;
  /** Коротко: закреплено за другим лицом (имя уже под заголовком роли). */
  signatoryMismatchHint?: string;
  passportAssigneeName?: string;
}) {
  const whoWhen = formatSignoffWhoWhen(signoff);
  return (
    <div className="border-border-subtle bg-bg-surface2/60 text-text-primary rounded-md border p-3 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-text-primary font-semibold">{title}</p>
          {passportAssigneeName?.trim() ? (
            <p className="text-text-secondary text-[10px] leading-snug">
              {passportAssigneeName.trim()}
            </p>
          ) : null}
          {!canSign && !signoff ? (
            signatoryMismatchHint ? (
              <p className="text-[10px] leading-snug text-amber-900/90">{signatoryMismatchHint}</p>
            ) : hasRoleCapability === false ? (
              <p className="text-text-secondary text-[10px] leading-snug">
                Нет права цифровой подписи для этого направления. Выдайте право в{' '}
                <Link
                  href={ROUTES.brand.teamPermissions}
                  className="text-accent-primary hover:text-accent-primary font-medium underline"
                >
                  Команда → права доступа
                </Link>
                .
              </p>
            ) : null
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {signoff ? (
            <>
              {whoWhen ? (
                <span className="text-text-secondary max-w-[min(100%,14rem)] text-right text-[10px] leading-snug sm:max-w-[18rem]">
                  {whoWhen}
                </span>
              ) : null}
              <span
                className="inline-flex h-9 items-center justify-center rounded-md border border-emerald-400 bg-emerald-50 px-3 text-xs font-semibold text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_0_16px_rgba(16,185,129,0.25)]"
                aria-live="polite"
              >
                Подписано
              </span>
              {canRevoke ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 px-3 text-xs"
                  onClick={onRevoke}
                >
                  Снять подпись
                </Button>
              ) : (
                <span className="text-text-muted max-w-[10rem] text-[9px] sm:max-w-none">
                  Снять может только руководитель из списка допущенных.
                </span>
              )}
            </>
          ) : (
            <>
              {showNotifyResponsible && onNotifyResponsible ? (
                <Button
                  type="button"
                  variant="outline"
                  aria-pressed={notifyResponsibleHighlighted === true}
                  className={cn(
                    'h-9 gap-1.5 px-2.5 text-[11px] font-medium sm:px-3 sm:text-xs',
                    notifyResponsibleHighlighted &&
                      'border-red-500 bg-red-50 text-red-800 shadow-[0_0_0_1px_rgba(239,68,68,0.25)] hover:border-red-600 hover:bg-red-100 hover:text-red-900'
                  )}
                  onClick={onNotifyResponsible}
                >
                  <LucideIcons.Bell className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="whitespace-nowrap">Уведомить ответственного</span>
                </Button>
              ) : null}
              <Button
                type="button"
                className="h-9 px-3 text-xs font-semibold"
                disabled={!canSign}
                title={
                  canSign
                    ? undefined
                    : 'Подписать может только исполнитель, закреплённый за эту роль в паспорте (и с нужным правом в команде).'
                }
                onClick={onSign}
              >
                Подписать
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Подпись значения справочника в UI: для сезона и устаревших латинских ярлыков подставляем label из каталога. */
function resolvedHandbookDisplayLabel(
  attributeId: string | undefined,
  parameterId: string | undefined,
  stored: string | undefined
): string {
  if (!parameterId) return stored?.trim() || '—';
  const attr = attributeId ? getAttributeById(attributeId) : undefined;
  const catalogParam = attr?.parameters.find((x) => x.parameterId === parameterId);
  const canon = catalogParam?.label?.trim();
  const st = stored?.trim() ?? '';

  if (attributeId === 'season' || parameterId.startsWith('season-')) {
    if (canon) return canon;
    return st || parameterId;
  }

  if (canon && (!st || st === parameterId)) return canon;

  if (canon && st && st !== canon && !/[а-яё]/i.test(st) && /^[a-z0-9,.\s/&+-]+$/i.test(st)) {
    return canon;
  }

  return st || canon || parameterId;
}

function canonicalPhaseAssignmentFilled(
  assignment: Workshop2Phase1AttributeAssignment | undefined,
  attr: AttributeCatalogAttribute
): boolean {
  if (!assignment || assignment.kind !== 'canonical') return false;
  const hb = assignment.values.filter((v) => v.valueSource === 'handbook_parameter').length;
  const hasFree = assignment.values.some(
    (v) => v.valueSource === 'free_text' && (v.text?.trim()?.length ?? 0) > 0
  );
  if (attr.type === 'text' && attr.parameters.length === 0) {
    return hasFree;
  }
  if (attr.allowMultipleDistinct || attr.type === 'multiselect') {
    return hb > 0 || (!!attr.allowFreeText && hasFree);
  }
  return hb > 0 || (!!attr.allowFreeText && hasFree);
}

/** Выпадающий список с чекбоксами (несколько значений справочника). */
function HandbookMultiSelectPopover({
  options,
  parts,
  onPartsChange,
  className,
  catalogAttributeId,
  maxSelections,
}: {
  options: { parameterId: string; label: string }[];
  parts: { parameterId: string; displayLabel: string }[];
  onPartsChange: (next: { parameterId: string; displayLabel: string }[]) => void;
  className?: string;
  /** Для корректных подписей в сводке кнопки (сезон и др.) при устаревшем displayLabel в досье. */
  catalogAttributeId?: string;
  /** Не больше стольких значений (остальные чекбоксы неактивны, пока не снимете выбор). */
  maxSelections?: number;
}) {
  const [open, setOpen] = useState(false);
  const [filterQ, setFilterQ] = useState('');
  const selected = new Set(parts.map((p) => p.parameterId));
  const summary =
    parts.length === 0
      ? '—'
      : parts.length <= 2
        ? parts
            .map((p) =>
              resolvedHandbookDisplayLabel(catalogAttributeId, p.parameterId, p.displayLabel)
            )
            .join(', ')
        : `${parts.length} выбрано`;

  const needle = filterQ.trim().toLowerCase();
  const filteredOptions =
    needle.length === 0
      ? options
      : options.filter(
          (o) =>
            o.label.toLowerCase().includes(needle) || o.parameterId.toLowerCase().includes(needle)
        );

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setFilterQ('');
  };

  const atCap =
    maxSelections != null &&
    Number.isFinite(maxSelections) &&
    maxSelections >= 0 &&
    selected.size >= maxSelections;

  const toggle = (parameterId: string) => {
    const next = new Set(selected);
    if (next.has(parameterId)) next.delete(parameterId);
    else {
      if (atCap) return;
      next.add(parameterId);
    }
    const ordered = options
      .filter((o) => next.has(o.parameterId))
      .map((o) => ({ parameterId: o.parameterId, displayLabel: o.label }));
    onPartsChange(ordered);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'text-text-primary h-9 w-full justify-between gap-2 px-2.5 text-left text-xs font-normal',
            className
          )}
        >
          <span className="truncate">{summary}</span>
          <LucideIcons.ChevronDown
            className="text-text-secondary h-3.5 w-3.5 shrink-0"
            aria-hidden
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(100vw-2rem,22rem)] p-0" align="start">
        <div className="border-border-subtle border-b p-2">
          <Input
            className="h-8 text-xs"
            placeholder="Поиск в фильтре…"
            value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div className="max-h-64 space-y-1 overflow-y-auto p-2">
          {maxSelections != null &&
          Number.isFinite(maxSelections) &&
          maxSelections >= 0 &&
          atCap ? (
            <p className="text-text-secondary px-2 py-1.5 text-[10px] leading-snug">
              Уже выбрано максимум размеров ({maxSelections}) по паспорту — снимите лишний, чтобы
              добавить другой.
            </p>
          ) : null}
          {options.length === 0 ? (
            <p className="text-text-secondary px-2 py-2 text-[11px]">Нет значений.</p>
          ) : filteredOptions.length === 0 ? (
            <p className="text-text-secondary px-2 py-2 text-[11px]">
              Ничего не найдено — измените запрос.
            </p>
          ) : (
            filteredOptions.map((o) => {
              const checked = selected.has(o.parameterId);
              const disableAdd = !checked && atCap;
              return (
                <label
                  key={o.parameterId}
                  className={cn(
                    'flex items-start gap-2 rounded-md py-1.5 pl-1 pr-2',
                    disableAdd
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-bg-surface2 cursor-pointer'
                  )}
                >
                  <Checkbox
                    checked={checked}
                    disabled={disableAdd}
                    onCheckedChange={() => toggle(o.parameterId)}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-text-primary text-xs leading-snug">{o.label}</span>
                </label>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function newUuid(): string {
  return globalThis.crypto.randomUUID();
}

function findCanonicalIndex(dossier: Workshop2DossierPhase1, attributeId: string): number {
  return dossier.assignments.findIndex(
    (a) => a.kind === 'canonical' && a.attributeId === attributeId
  );
}

function partitionHandbookAndFree(a: Workshop2Phase1AttributeAssignment | undefined) {
  const hbs =
    a?.values.filter(
      (v): v is Workshop2Phase1AttributeValue & { parameterId: string } =>
        v.valueSource === 'handbook_parameter' && !!v.parameterId
    ) ?? [];
  const ft = a?.values.find((v) => v.valueSource === 'free_text');
  return { hbs, ft };
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

function partitionValues(a: Workshop2Phase1AttributeAssignment | undefined) {
  const { hbs, ft } = partitionHandbookAndFree(a);
  return { hb: hbs[0], ft };
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

/** Ё→е: иначе «чёрный» не попадает в /черн/ и не матчится с подписями палитры. */
function normalizeRuColorMatch(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е');
}

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

/** Токены для сужения списка палитры по подписи основной группы и референса. */
function collectColorBundlePaletteNeedles(dossier: Workshop2DossierPhase1): string[] {
  const out: string[] = [];
  const pushTokens = (raw: string) => {
    for (const w of raw.split(/[\s,/·|()[\]#]+/)) {
      const t = normalizeRuColorMatch(w.trim());
      if (t.length >= 3 && !/^pantone$/i.test(t)) out.push(t);
    }
  };
  for (const aid of ['primaryColorFamilyOptions', 'colorReferenceSystemOptions'] as const) {
    const assign = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === aid);
    const { hbs } = partitionHandbookAndFree(assign);
    for (const v of hbs) {
      if (v.displayLabel) pushTokens(v.displayLabel);
    }
  }
  return [...new Set(out)].slice(0, 14);
}

function split100(n: number): number[] {
  if (n <= 0) return [];
  const base = Math.floor(100 / n);
  const arr = Array.from({ length: n }, () => base);
  let rem = 100 - base * n;
  for (let i = 0; i < rem; i++) arr[i % n] += 1;
  return arr;
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

function extractHex6(s: string): string | undefined {
  const m = s.match(/#([0-9A-Fa-f]{6})\b/);
  return m ? `#${m[1]!.toLowerCase()}` : undefined;
}

function extractTwoHexesFromCss(s: string): { a: string; b: string } | null {
  const matches = [...s.matchAll(/#([0-9A-Fa-f]{6})\b/gi)];
  if (matches.length >= 2) {
    return { a: `#${matches[0]![1]!.toLowerCase()}`, b: `#${matches[1]![1]!.toLowerCase()}` };
  }
  if (matches.length === 1) {
    const h = `#${matches[0]![1]!.toLowerCase()}`;
    return { a: h, b: h };
  }
  return null;
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
};

import { Badge } from '@/components/ui/badge';

const SECTIONS: {
  id: Workshop2TzSignoffSectionKey;
  label: string;
  icon: keyof typeof LucideIcons;
}[] = [
  { id: 'general', label: 'Паспорт', icon: 'Info' },
  { id: 'visuals', label: 'Визуал / Эскиз', icon: 'Image' },
  { id: 'material', label: 'Материалы (BOM)', icon: 'Layers' },
  { id: 'construction', label: 'Конструкция', icon: 'Scissors' },
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
      'Задаёт общую ось SKU для всего маршрута коллекции: аудитория, L1–L3, SKU, сезон и цвет; рынок сбыта и план по происхождению; предварительный ТН ВЭД, обоснование классификации, Incoterms и штрихкод. Финальные реквизиты под отгрузку и маркировку — на приёмке сэмпла (Fit).',
    owner: 'Бренд-дизайнер',
  },
  visuals: {
    step: 'Шаг 2',
    title: 'Соберите визуальную базу артикула',
    description:
      'Фиксирует образ для маршрута SKU: референсы и канон, замысел (текст), скетч с метками и поля каталога «Визуал» — общий язык для дизайна, технолога и цеха до образца.',
    owner: 'Бренд-дизайнер',
  },
  material: {
    step: 'Шаг 3',
    title: 'Материалы (BOM) и сопутствующие поля выпуска',
    description:
      'Когда образ понятен, переходите к BOM: основной материал, состав, подкладка и ограничения по сырью. Здесь же — упаковка, маркировка, штрихкод, уход и температура этикетки (раньше отдельная вкладка).',
    owner: 'Дизайнер + product developer',
  },
  measurements: {
    step: 'Шаг 4',
    title: 'Табель мер',
    description:
      'Размерная шкала, базовый размер и таблица мерок для образца и серии; синхронизация с конструкцией и ОТК.',
    owner: 'Технолог',
  },
  construction: {
    step: 'Шаг 5',
    title: 'Конструкция и табель мер',
    description:
      'Силуэт, длину, узлы, застежки, карманы и техрешения для лекал и пошива; размерная шкала, базовый размер и таблица мерок. Точка схода для дизайна, технолога, менеджера, снабжения, цеха, ОТК, комплаенса и мерча — см. «Роли» на этой вкладке.',
    owner: 'Технолог · дизайн · смежные роли',
  },
  packaging: {
    step: 'Шаг 6',
    title: 'Упаковка и маркировка',
    description: 'Спецификация упаковки, этикеток и штрихкода для выпуска и склада.',
    owner: 'Продакт',
  },
  sample_intake: {
    step: 'Fit',
    title: 'Приёмка сэмпла в коллекцию',
    description:
      'Не вкладка ТЗ: заполняется на маршруте Цеха 2 (Fit / gold) после образца — режим цепочки производства и финальный комплаенс-блок перед включением в коллекцию.',
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
    if (!skuDraft.trim()) warnings.push('SKU еще не подтвержден.');
    if (!nameDraft.trim()) warnings.push('Нет рабочего названия модели.');
    /** Замысел и эскиз — только вкладка «Визуал», не дублируем в баннере паспорта. */
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

type HandbookCheckSnapshot = {
  checkedAtIso: string;
  /** Раздел, по которому строился снимок (текущая вкладка при нажатии «Проверить»). */
  scopeSection: DossierSection;
  /** Те же контрольные пункты, что в полосе раздела — что именно сверялось. */
  checkAspects: { label: string; ok: boolean }[];
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
  checkAspects: { label: string; ok: boolean }[]
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

function renderHandbookCheckReportBlock(
  snapshot: HandbookCheckSnapshot,
  reportUi: { expanded: boolean; onToggleExpanded: () => void }
): ReactNode {
  const globals = snapshot.globalHandbookWarnings ?? [];
  const inSections = new Set(SECTIONS.flatMap((s) => snapshot.bySection[s.id] ?? []));
  const onlyGlobal = globals.filter((w) => !inSections.has(w));
  const hasSectionIssues = SECTIONS.some((s) => (snapshot.bySection[s.id]?.length ?? 0) > 0);
  const hasAny = hasSectionIssues || onlyGlobal.length > 0;
  const scopeLabel = SECTION_LABEL_BY_ID[snapshot.scopeSection];
  const { expanded, onToggleExpanded } = reportUi;

  const aspects = snapshot.checkAspects ?? [];
  const aspectsOk = aspects.filter((a) => a.ok).length;
  const aspectsTotal = aspects.length;

  const checklistBlock =
    aspectsTotal > 0 ? (
      <div className="border-border-default/90 space-y-1.5 rounded-md border bg-white/70 p-2.5">
        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">
          Что сверялось · {scopeLabel} · {aspectsOk}/{aspectsTotal} ок
        </p>
        <ul className="space-y-1" role="list">
          {aspects.map((a, i) => (
            <li key={`${a.label}-${i}`} className="flex gap-2 text-[11px] leading-snug">
              <span
                className={cn(
                  'w-4 shrink-0 text-center text-xs font-bold',
                  a.ok ? 'text-emerald-600' : 'text-amber-600'
                )}
                aria-hidden
              >
                {a.ok ? '✓' : '!'}
              </span>
              <span className={cn(a.ok ? 'text-text-primary' : 'font-medium text-amber-900')}>
                {a.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  const body = !hasAny ? (
    <p className="text-[11px] font-medium leading-snug text-emerald-700">
      {aspectsTotal > 0 ? 'По перечисленным пунктам замечаний нет.' : 'Расхождений не выявлено.'}
    </p>
  ) : (
    <div className="space-y-2">
      {SECTIONS.map((s) => {
        const ws = snapshot.bySection[s.id] ?? [];
        if (ws.length === 0) return null;
        return (
          <details
            key={s.id}
            open={s.id === snapshot.scopeSection}
            className="rounded-md border border-amber-100 bg-amber-50/50 text-amber-950"
          >
            <summary className="cursor-pointer select-none px-2 py-2 text-[11px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
              {s.label}
              <span className="ml-1 font-normal text-amber-800/80">
                ({ws.length}) · развернуть / свернуть
              </span>
            </summary>
            <ul className="space-y-1.5 border-t border-amber-100/80 px-2 pb-2 pt-2">
              {ws.map((warning, idx) => (
                <li
                  key={`${s.id}-${idx}-${warning.slice(0, 48)}`}
                  className="rounded-md border border-amber-100/90 bg-white/80 p-2 text-[11px] text-amber-900"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </details>
        );
      })}
      {onlyGlobal.length > 0 ? (
        <details className="border-border-default bg-bg-surface2/90 text-text-primary rounded-md border">
          <summary className="cursor-pointer select-none px-2 py-2 text-[11px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
            Сквозные проверки
            <span className="text-text-secondary ml-1 font-normal">
              ({onlyGlobal.length}) · мерки, подписи, визуал, материал…
            </span>
          </summary>
          <ul className="border-border-default space-y-1.5 border-t px-2 pb-2 pt-2">
            {onlyGlobal.map((warning, idx) => (
              <li
                key={`glob-${idx}-${warning.slice(0, 48)}`}
                className="border-border-subtle text-text-primary rounded-md border bg-white p-2 text-[11px]"
              >
                {warning}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );

  const checkedAtLabel = new Date(snapshot.checkedAtIso).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const collapsedSummary = !hasAny ? (
    <span className="font-medium text-emerald-700">
      {aspectsTotal > 0
        ? `${aspectsOk}/${aspectsTotal} пунктов без замечаний.`
        : 'Расхождений не выявлено.'}
    </span>
  ) : (
    <span className="font-medium text-amber-800">
      {aspectsTotal > 0
        ? `Замечания по разделу · ${aspectsOk}/${aspectsTotal} пунктов ок — разверните отчёт.`
        : 'Есть замечания — разверните отчёт.'}
    </span>
  );

  return (
    <div className="border-border-subtle bg-bg-surface2/70 space-y-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">
          Отчёт проверки · {scopeLabel}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-text-secondary hover:text-text-primary h-7 shrink-0 gap-1 px-2 text-[10px] font-semibold"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Свернуть
              <LucideIcons.ChevronUp className="h-3.5 w-3.5" aria-hidden />
            </>
          ) : (
            <>
              Развернуть
              <LucideIcons.ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </>
          )}
        </Button>
      </div>
      {expanded ? (
        <>
          {checklistBlock}
          {body}
          <p className="text-text-secondary text-[10px]">
            {checkedAtLabel}
            {hasAny ? ' · исправьте замечания и нажмите «Проверить» снова.' : null}
          </p>
        </>
      ) : (
        <p className="text-text-secondary text-[10px] leading-snug">
          {collapsedSummary} <span className="text-text-muted">· {checkedAtLabel}</span>
        </p>
      )}
    </div>
  );
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

/** Чекпоинты секции — та же логика, что у полосы контроля в центральной колонке. */
function buildSectionControlPoints(
  section: DossierSection,
  ctx: BuildControlPointsCtx
): { label: string; done: boolean }[] {
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

  switch (section) {
    case 'general': {
      const pb = dossier.passportProductionBrief;
      return [
        { label: 'Аудитория выбрана', done: Boolean(selectedAudienceLabel) },
        { label: 'Категория 1 / 2 / 3 подтверждена', done: Boolean(currentLeaf.pathLabel) },
        { label: 'SKU подтвержден', done: Boolean(skuDraft.trim()) },
        { label: 'Рабочее название модели есть', done: Boolean(nameDraft.trim()) },
        {
          label: 'Администратор модели (карточка артикула)',
          done: Boolean(pb?.articleCardOwnerName?.trim()),
        },
        {
          label: 'Тип запуска (цех / КНП / смешанный)',
          done: Boolean(pb?.plannedLaunchType && pb.plannedLaunchType !== 'undecided'),
        },
        {
          label: 'Срок образца / пилота',
          done: Boolean(pb?.targetSampleOrPilotDate?.trim()),
        },
        {
          label: 'Критичность срока (жёстко / гибко)',
          done: pb?.deadlineCriticality === 'hard' || pb?.deadlineCriticality === 'flexible',
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
        },
        {
          label: 'Есть метки на скетче',
          done: (dossier.categorySketchAnnotations?.length ?? 0) > 0,
        },
        { label: 'Замысел в «Визуал»', done: Boolean(dossier.brandNotes?.trim()) },
        { label: 'Референсы добавлены', done: (dossier.visualReferences?.length ?? 0) > 0 },
      ];
    case 'material':
      return [
        { label: 'Основной материал выбран', done: hasAssignmentValue('mat') },
        { label: 'Состав подтвержден', done: hasAssignmentValue('composition') },
        {
          label: 'Подкладка / дублирование описаны',
          done: hasAssignmentValue('lining') || hasAssignmentValue('fusing'),
        },
        {
          label: 'Критичные material notes учтены',
          done: hasAssignmentValue('fabric_weight') || hasAssignmentValue('lining_composition'),
        },
        { label: 'Тип упаковки указан', done: hasAssignmentValue('packaging') },
        { label: 'Маркировка описана', done: hasAssignmentValue('labeling') },
        { label: 'Штрихкод / кодировка указаны', done: hasAssignmentValue('barcode') },
      ];
    case 'construction':
      return [
        { label: 'Размерная шкала выбрана', done: Boolean(dossier.sampleSizeScaleId) },
        { label: 'Базовый размер выбран', done: hasAssignmentValue('sampleBaseSize') },
        {
          label: 'Табель мер заполнен',
          done: Boolean(
            dossier.sampleBasePerSizeDimensions &&
            Object.keys(dossier.sampleBasePerSizeDimensions).length > 0
          ),
        },
        {
          label: 'Нет критичных пропусков по меркам справочника',
          done: !handbookWarnings.some(
            (warning) => warning.includes('мерки') || warning.includes('Табель мер')
          ),
        },
        {
          label: 'Силуэт / посадка описаны',
          done: hasAssignmentValue('silh') || hasAssignmentValue('fit_type'),
        },
        {
          label: 'Ключевые узлы зафиксированы',
          done:
            hasAssignmentValue('closure') ||
            hasAssignmentValue('pocket') ||
            hasAssignmentValue('neck') ||
            hasAssignmentValue('sleeve'),
        },
        {
          label: 'Есть tech pack / ссылка на лекала',
          done: hasAssignmentValue('techPackRef') || (dossier.techPackAttachments?.length ?? 0) > 0,
        },
        { label: 'Раздел не пустой', done: secDone > 0 },
      ];
    default:
      return [];
  }
}

function DossierNavigator({
  activeSection,
  setActiveSection,
  sectionReadiness,
  handbookCheckBySection,
  dossierViewProfile,
  primarySections,
  secondarySections,
}: {
  activeSection: Workshop2TzSignoffSectionKey;
  setActiveSection: (s: Workshop2TzSignoffSectionKey) => void;
  sectionReadiness: Record<
    DossierSection,
    { done: number; total: number; pct: number; status: string }
  >;
  /** Если задан — индикаторы по результату последней проверки «Проверить»; иначе без подсветки расхождений. */
  handbookCheckBySection: Record<DossierSection, string[]> | null;
  dossierViewProfile: Workshop2DossierViewProfile;
  primarySections: typeof SECTIONS;
  secondarySections: typeof SECTIONS;
}) {
  const [extraNavOpen, setExtraNavOpen] = useState(() =>
    dossierViewProfile === 'full' ? false : secondarySections.some((s) => s.id === activeSection)
  );
  useEffect(() => {
    if (dossierViewProfile === 'full') {
      setExtraNavOpen(false);
      return;
    }
    setExtraNavOpen(secondarySections.some((s) => s.id === activeSection));
  }, [dossierViewProfile, activeSection, secondarySections]);

  const renderSectionButton = (s: (typeof SECTIONS)[number], primaryForView: boolean) => {
    const Icon = LucideIcons[s.icon] as any;
    const sr = sectionReadiness[s.id];
    const completion = { done: sr.done, total: sr.total, pct: sr.pct };
    const statusLabel = sr.status;
    const stepNumber = SECTIONS.findIndex((section) => section.id === s.id) + 1;
    const secProbe = handbookCheckBySection ? (handbookCheckBySection[s.id] ?? []) : [];
    const hasWarnings = handbookCheckBySection != null && secProbe.length > 0;

    return (
      <button
        key={s.id}
        type="button"
        title={
          primaryForView || activeSection === s.id ? undefined : 'Вторично для выбранного режима ТЗ'
        }
        onClick={() => setActiveSection(s.id)}
        className={cn(
          'group relative grid w-full grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-xl px-3 py-2.5 text-left transition-all',
          activeSection === s.id
            ? 'bg-accent-primary shadow-accent-primary/10 text-white shadow-lg'
            : 'hover:bg-bg-surface2 text-text-secondary hover:text-text-primary',
          !primaryForView &&
            activeSection !== s.id &&
            'ring-dashed ring-border-default/70 opacity-70 ring-1'
        )}
      >
        {hasWarnings && activeSection !== s.id && (
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          </span>
        )}
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black',
            activeSection === s.id
              ? 'bg-accent-primary text-white'
              : 'bg-bg-surface2 text-text-secondary'
          )}
        >
          {stepNumber}
        </span>
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            activeSection === s.id
              ? 'text-white'
              : 'text-text-muted group-hover:text-accent-primary'
          )}
        />
        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <span className="min-w-0 truncate text-[13px] font-bold leading-none">{s.label}</span>
          <span
            className={cn(
              'shrink-0 text-[10px] font-semibold tabular-nums leading-none',
              activeSection === s.id ? 'text-accent-primary/30' : 'text-text-muted'
            )}
          >
            {statusLabel} · {completion.done}/{completion.total}
          </span>
        </div>
        <div className="relative h-6 w-6 shrink-0 justify-self-end">
          <svg className="h-6 w-6 -rotate-90">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={activeSection === s.id ? 'text-accent-primary/30' : 'text-text-inverse'}
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={2 * Math.PI * 10}
              strokeDashoffset={2 * Math.PI * 10 * (1 - completion.pct / 100)}
              className={activeSection === s.id ? 'text-white' : 'text-accent-primary'}
            />
          </svg>
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center text-[7px] font-black',
              activeSection === s.id ? 'text-white' : 'text-accent-primary'
            )}
          >
            {completion.pct}%
          </span>
        </div>
      </button>
    );
  };

  return (
    <nav className="flex flex-col gap-1">
      {primarySections.map((s) =>
        renderSectionButton(
          s,
          dossierViewProfile === 'full' ||
            isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id)
        )
      )}
      {secondarySections.length > 0 ? (
        <Collapsible
          open={extraNavOpen}
          onOpenChange={setExtraNavOpen}
          className="border-border-default/90 bg-bg-surface2/80 rounded-xl border border-dashed"
        >
          <CollapsibleTrigger className="text-text-secondary hover:bg-bg-surface2/80 flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[11px] font-semibold">
            <span>Дополнительные разделы ({secondarySections.length})</span>
            <LucideIcons.ChevronsUpDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 px-0 pb-2 pt-1">
            {secondarySections.map((s) => renderSectionButton(s, false))}
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </nav>
  );
}

function SectionStageBoard({
  warnings,
  onJumpToVisualBrandNotes,
}: {
  warnings: string[];
  onJumpToVisualBrandNotes?: () => void;
}) {
  if (warnings.length === 0) return null;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="space-y-1 rounded-lg border border-amber-100 bg-amber-50/40 p-3">
        <ul className="space-y-1">
          {warnings.map((w, idx) => {
            const targetAttrId = w.includes('SKU')
              ? 'sku'
              : w.includes('назв')
                ? 'name'
                : w.includes('замыс')
                  ? 'brandNotes'
                  : w.includes('материал')
                    ? 'mat'
                    : w.includes('мерки')
                      ? 'sampleBaseSize'
                      : null;
            return (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-800">
                <LucideIcons.AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{w}</span>
                {targetAttrId && (
                  <button
                    type="button"
                    className="text-accent-primary ml-auto text-[10px] font-bold hover:underline"
                    onClick={() => {
                      if (targetAttrId === 'brandNotes' && onJumpToVisualBrandNotes) {
                        onJumpToVisualBrandNotes();
                        return;
                      }
                      const el = document.getElementById(`w2-attr-${targetAttrId}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    ПЕРЕЙТИ
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Футер стрипа «до 9»: ряд переходов, короткая подсказка, при разрыве BOM↔скетч — предупреждение и кнопки. */
function WorkshopNineGapRelatedFooterShell({
  children,
  matSketchBomGapRefs,
  onJumpMaterialHub,
  onJumpSketch,
  onJumpMaterialMatTable,
  onJumpConstructionContour,
  onJumpQcRoute,
  hint,
}: {
  children: ReactNode;
  matSketchBomGapRefs: readonly string[];
  onJumpMaterialHub: () => void;
  onJumpSketch: () => void;
  /** Якорь таблицы mat (`w2-material-mat`). */
  onJumpMaterialMatTable?: () => void;
  onJumpConstructionContour?: () => void;
  onJumpQcRoute?: () => void;
  hint?: string;
}) {
  const gapCount = matSketchBomGapRefs.length;
  const preview = matSketchBomGapRefs.slice(0, 4).join(', ');
  const more = gapCount > 4 ? '…' : '';
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">{children}</div>
      {hint ? <p className="text-text-secondary text-[9px] leading-snug">{hint}</p> : null}
      {gapCount > 0 ? (
        <div className="space-y-1.5 rounded-md border border-amber-300/80 bg-amber-50/65 px-2 py-1.5">
          <p className="text-[9px] font-bold uppercase tracking-wide text-amber-950">
            Разрыв BOM ↔ скетч
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
              onClick={onJumpMaterialHub}
            >
              К хабу материалов
            </Button>
            {onJumpMaterialMatTable ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
                onClick={onJumpMaterialMatTable}
              >
                К таблице mat
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
              onClick={onJumpSketch}
            >
              К скетчу · lineRef
            </Button>
            {onJumpConstructionContour ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
                onClick={onJumpConstructionContour}
              >
                Конструкция · контур
              </Button>
            ) : null}
            {onJumpQcRoute ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/90 bg-white text-[10px] text-amber-950 hover:bg-amber-50"
                onClick={onJumpQcRoute}
              >
                ОТК · вкладка
              </Button>
            ) : null}
          </div>
          <p className="text-[9px] leading-snug text-amber-950/95">
            <span className="font-semibold tabular-nums">{gapCount}</span> ref с меток или скетча не
            найдены в строках mat: <span className="break-all font-mono text-[8px]">{preview}</span>
            {more}
          </p>
        </div>
      ) : null}
    </div>
  );
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
  const [materialPreSupplyExpanded, setMaterialPreSupplyExpanded] = useState(
    () => !showMaterialSupplyDraftsNav
  );

  useEffect(() => {
    if (showMaterialSupplyDraftsNav) setMaterialPreSupplyExpanded(false);
    else setMaterialPreSupplyExpanded(true);
  }, [showMaterialSupplyDraftsNav]);

  useEffect(() => {
    materialPreSupplyNavExpandRef.current = (anchorId: string) => {
      if (W2_MATERIAL_PRE_SUPPLY_COLLAPSE_SCROLL_IDS.has(anchorId))
        setMaterialPreSupplyExpanded(true);
    };
  }, []);

  const [passportDriftLogDone, setPassportDriftLogDone] = useState(false);
  const [dossierMetricsTick, setDossierMetricsTick] = useState(0);
  const [sketchVisualCatalogHighlightIds, setSketchVisualCatalogHighlightIds] = useState<string[]>(
    []
  );
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
      /** Подписать может только закреплённый в паспорте исполнитель с правом роли. */
      const canSign = cap && hasAssignee && workshopTzSignerAllowed(updatedByLabel, d);
      const mismatch =
        cap && hasAssignee && !workshopTzSignerAllowed(updatedByLabel, d)
          ? 'Войдите под закреплённым в паспорте пользователем или смените закрепление.'
          : cap && !hasAssignee
            ? 'Закрепите исполнителя в паспорте — подписать может только он.'
            : undefined;
      rows.push({
        rowKey: role,
        title,
        passportAssigneeName: d || undefined,
        assigneeForNotify: d,
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
      const mismatch = !hasAssignee
        ? 'Закрепите исполнителя в паспорте — подписать может только он.'
        : !workshopTzSignerAllowed(updatedByLabel, name)
          ? 'Войдите под закреплённым в паспорте пользователем или смените закрепление.'
          : undefined;
      rows.push({
        rowKey: `extra:${ex.rowId}`,
        title: ex.roleTitle?.trim() || 'Роль',
        passportAssigneeName: name || undefined,
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
    setDossierInternal(raw);
    lastPersistedDossierRef.current = raw;
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

  const workshop2FactoryShareUrl = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const seg = workshop2ArticleUrlSegment(internalArticleCode, articleId);
    const rel = workshop2ArticleHref(collectionId, seg, {
      w2view: 'factory',
      sketchFloor: true,
      w2step: '1',
      w2sec: 'visuals',
      w2pane: 'tz',
      hash: 'w2-visuals-hub',
    });
    return `${window.location.origin}${rel}`;
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
        cap != null && Number.isFinite(cap) && cap >= 0 ? parts.slice(0, Math.floor(cap)) : parts;
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
        if (!canonicalPhaseAssignmentFilled(a, attr)) {
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
      return;
    }
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(prev, updatedByLabel, {
        type: 'dossier_edit',
        summaries: [`SKU артикула: ${next}`],
      })
    );
  }, [articleSku, onPatchArticleLine, skuDraft, updatedByLabel]);

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
      attribute.attributeId === 'techPackRef' ? (
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
        />
      ) : (
        editor
      );

    const showRequired =
      variant === 'base' &&
      ((workshopPhase === '1' && attribute.requiredForPhase1) ||
        (workshopPhase === '2' && attribute.requiredForPhase2));
    const assignment = dossier.assignments.find((a) => a.attributeId === attribute.attributeId);
    const isFilled = canonicalPhaseAssignmentFilled(assignment, attribute);
    const isMissingRequired = showRequired && !isFilled;

    const hideMaterialFlatGroupCrumb =
      activeSection === 'material' &&
      groupLabel &&
      (groupLabel === 'Доп. атрибуты' ||
        groupLabel === WORKSHOP_MERGED_OUTERWEAR_MATERIAL_TAB_LABEL);

    const header = (
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
        {showRequired ? (
          <span
            className={cn(
              isMissingRequired
                ? WORKSHOP_REQUIRED_BADGE_TODO_CLASS
                : WORKSHOP_REQUIRED_BADGE_DONE_CLASS,
              isMissingRequired && 'animate-pulse'
            )}
          >
            {isMissingRequired ? 'Заполните' : 'Обязательный'}
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
        <span className="inline-flex items-center gap-0.5">
          <span className="text-text-primary text-sm font-semibold">{attribute.name}</span>
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
            'border-border-subtle bg-bg-surface2/40 space-y-2 rounded-lg border p-3',
            showMaterialIntroAndGuides &&
              'border-accent-primary/30 from-accent-primary/10 to-bg-surface2/30 bg-gradient-to-b shadow-sm',
            matCompositionSumInvalid &&
              'ring-offset-bg-surface2/80 shadow-sm ring-2 ring-amber-400/90 ring-offset-2'
          )}
        >
          {showMaterialIntroAndGuides ? (
            <div className="border-accent-primary/30 flex gap-3 rounded-xl border bg-white/95 p-3 shadow-sm">
              <div className="bg-accent-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
                <LucideIcons.Layers className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-accent-primary text-[9px] font-black uppercase tracking-[0.2em]">
                  Раздел к заполнению
                </p>
                <h3 className="text-text-primary text-sm font-bold tracking-tight">Материалы</h3>
                <p className="text-text-secondary text-[11px] leading-snug">
                  Укажите материалы из справочника и доли в составе (при связке с composition — в
                  сумме 100&nbsp;%). Далее заполните плотность полотна, температурный режим,
                  утепление и уход — данные пойдут в BOM и на фабрику.
                </p>
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
            <span className="inline-flex items-center gap-0.5">
              <span className="text-text-primary text-sm font-semibold">Материал и состав</span>
              {showAttributeNameHintIcon ? (
                <WorkshopInlineHintIcon label="Материал и состав">
                  <p>
                    Укажите основной материал из справочника. Если включён состав — доли по строкам
                    должны в сумме давать 100%.
                  </p>
                  {currentLeaf.l2Name === 'Верхняя одежда' ? (
                    <p className="border-border-default mt-2 border-t pt-2">
                      Для верхней одежды разведите shell, подклад, утеплитель и фурнитуру по разным
                      строкам; типовые составы под категорию — быстрые кнопки ниже, когда список ещё
                      пуст.
                    </p>
                  ) : null}
                </WorkshopInlineHintIcon>
              ) : null}
            </span>
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
          {showMaterialIntroAndGuides ? (
            <MaterialSectionGuidesBeforeFields l2Name={currentLeaf.l2Name} />
          ) : null}
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
    if (cap != null && Number.isFinite(cap) && cap >= 0) {
      const sa = dossier.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs } = partitionHandbookAndFree(sa);
      if (hbs.length > cap) {
        warnings.push(
          'В справочнике отмечено размеров больше, чем количество образцов в паспорте — снимите лишние или увеличьте лимит.'
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
    const hasIssues =
      SECTIONS.some((s) => (handbookCheckSnapshot.bySection[s.id]?.length ?? 0) > 0) ||
      (handbookCheckSnapshot.globalHandbookWarnings?.length ?? 0) > 0;
    return !hasIssues;
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
    (rowKey: string, roleTitle: string, assignee?: string) => {
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
      const who = assignee?.trim() ? `${roleTitle} → ${assignee.trim()}` : roleTitle;
      void (async () => {
        try {
          if (url) await navigator.clipboard.writeText(url);
          toast({
            title: url ? 'Ссылка скопирована' : 'Запрос зафиксирован',
            description: url
              ? `Передайте ссылку ответственному: ${who}. Push — после подключения API.`
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
              `Запрос подписи ТЗ: ${who}. ${url ? `Ссылка: ${url}` : 'URL недоступен в среде.'}`,
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
      ({ label, done }) => ({
        label,
        ok: done,
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
    }
  ) => {
    if (rows.length === 0 && extras.length === 0) {
      return <p className="text-text-secondary text-sm">Для этого раздела пока нет атрибутов.</p>;
    }

    const showAttrHintIcons = opts?.showAttributeNameHintIcons === true;
    const flatCatalogGroups = opts?.flatCatalogGroups === true;

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
              groupName === 'Доп. атрибуты');
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
                <ul className="space-y-2">
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
          <>
            <Workshop2PassportTzStickySubnav
              activeAnchorId={activePassportSubNavId}
              onNavigate={(id) => {
                setActivePassportSubNavId(id);
                if (typeof document === 'undefined') return;
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
              }}
              onJumpToPulse={() => {
                document.getElementById('w2-dossier-role-pulse')?.scrollIntoView({
                  behavior: tzScrollBehavior,
                  block: 'start',
                });
              }}
              combinedPct={passportHubModel.combinedPct}
              gateOpenCount={passportHubModel.gateItems.length}
              tzPhase={currentPhase}
              auditHitCount={passportCriticalAuditSummaries.length}
              showReadOnlyNav
              dossierViewProfile={dossierViewProfile}
              sketchBomGapCount={matSketchBomGapRefs.length}
              sketchBomRefCount={sketchBomRefsUnion.length}
            />
            <Workshop2PassportHubPanel
              model={passportHubModel}
              skuDraft={skuDraft}
              nameDraft={nameDraft}
              internalArticleCodeDisplay={
                isWorkshop2InternalArticleCodeValid(internalArticleCode)
                  ? internalArticleCode
                  : formatWorkshop2InternalArticleCodePlaceholder()
              }
              categoryPathLabel={currentLeaf.pathLabel}
              onNavigate={(id) => {
                setActivePassportSubNavId(id);
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
              }}
              showPostSignoffDrift={
                Boolean(
                  dossier.isVerifiedByDesigner ||
                  dossier.isVerifiedByTechnologist ||
                  dossier.isVerifiedByManager
                ) && dossierUpdatedAfterLatestTzSignoff(dossier)
              }
              onLogPostSignoffReminder={appendPassportPostSignoffJournalNote}
              pulseLoggedReminder={passportDriftLogDone}
              onPulseLoggedReminder={() => setPassportDriftLogDone(true)}
              tzWriteDisabled={tzWriteDisabled}
              tzPhase={currentPhase}
              onJumpToVisualSection={() => jumpToTzSectionAnchor('visuals', 'w2-visuals-hub')}
              onJumpToMaterialSection={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
              onJumpToMaterialMatTable={jumpToMaterialMatTable}
              onJumpToSketchLineRefs={jumpToSketchLineRefs}
              onJumpToConstructionContour={jumpToConstructionContour}
              onJumpToQcRoute={onNavigateToTab ? jumpToQcArticleSection : undefined}
              dossierViewProfile={dossierViewProfile}
              passportCriticalAuditSummaries={passportCriticalAuditSummaries}
              readOnlyShareUrl={workshop2FactoryShareUrl}
              sketchLinkedBomRefs={sketchBomRefsUnion}
              matSketchBomGapRefs={matSketchBomGapRefs}
              nineGapTzGeneralSectionPct={sectionReadiness.general.pct}
              nineGapFooter={
                <WorkshopNineGapRelatedFooterShell
                  matSketchBomGapRefs={matSketchBomGapRefs}
                  onJumpMaterialHub={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
                  onJumpSketch={() =>
                    jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)
                  }
                  onJumpMaterialMatTable={jumpToMaterialMatTable}
                  onJumpConstructionContour={jumpToConstructionContour}
                  onJumpQcRoute={onNavigateToTab ? jumpToQcArticleSection : undefined}
                  hint="Опорные поля SKU и ветка L1–L3; визуал, BOM и конструкция наследуют тот же артикул."
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => jumpToTzSectionAnchor('visuals', 'w2-visuals-hub')}
                  >
                    Визуал / эскиз
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
                  >
                    Материалы и BOM
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => jumpToTzSectionAnchor('construction', 'w2-measurements-fields')}
                  >
                    Мерки
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => jumpToTzSectionAnchor('construction', 'w2-construction-hub')}
                  >
                    Конструкция
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.audit)
                    }
                  >
                    Аудит
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.denseView)
                    }
                  >
                    Режим ТЗ · w2view
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.readOnly)
                    }
                  >
                    Read-only
                  </Button>
                </WorkshopNineGapRelatedFooterShell>
              }
              nineGapOnDossierJump={jumpToTzSectionAnchor}
            />
          </>
          {isPhase1 ? (
            <>
              <Workshop2PassportAttributeReferenceBlock />
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
                      <h2 className="text-text-primary text-base font-semibold">
                        Паспорт артикула
                      </h2>
                      <p className="text-text-secondary text-xs leading-snug">
                        <span className="text-text-primary font-medium">Для маршрута SKU:</span>{' '}
                        опорные поля — аудитория, ветка L1–L3, артикул и название; от них строятся
                        визуал, материалы, мерки и конструкция. Менять аудиторию или категорию после
                        заполнения ТЗ стоит осознанно: часть значений справочника может устареть.
                      </p>
                    </div>
                  </div>
                  <Workshop2TzSectionRolesPopover section="passport" className="shrink-0" />
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
                            Пустое поле — без лимита. Если уменьшить число, лишние размеры в
                            справочнике отрежутся, табель и количества подстроятся.
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
                      min={0}
                      step={1}
                      className="h-9 text-sm"
                      placeholder="Без лимита"
                      value={
                        dossier.passportProductionBrief?.moqTargetMaxPieces != null
                          ? String(dossier.passportProductionBrief.moqTargetMaxPieces)
                          : ''
                      }
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        setDossier((p: Workshop2DossierPhase1) => {
                          const prevBrief = p.passportProductionBrief ?? {};
                          if (raw === '') {
                            return {
                              ...p,
                              passportProductionBrief: {
                                ...prevBrief,
                                moqTargetMaxPieces: undefined,
                              },
                            };
                          }
                          const num = Math.max(0, Math.floor(Number(raw)));
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
                      className="min-h-[56px] text-sm"
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
                    <h2 className="text-text-primary text-base font-semibold">Старт по каталогу</h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      Обязательные поля справочника (сезон, цвет и др.) вне рынка и ТН ВЭД — та же
                      рамка SKU для маршрута, что визуал и материалы. Заполните до перехода к
                      визуалу и материалам.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportStartRows,
                  currentPhase,
                  generalPassportStartExtras,
                  {
                    showAttributeNameHintIcons: true,
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
                    <h2 className="text-text-primary text-base font-semibold">
                      До образца: рынок и коды
                    </h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      Поля для РФ и рынка (ТН ВЭД, штрихкод, группа для таможни и др.). Их можно
                      дозаполнить позже, когда ясны силуэт и материал; на «готово к образцу» этот
                      блок обычно не влияет.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportPreSampleRows,
                  currentPhase,
                  generalPassportPreSampleExtras,
                  {
                    showAttributeNameHintIcons: true,
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
                    <h2 className="text-text-primary text-base font-semibold">Старт по каталогу</h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      Поля паспорта на шаге {currentPhase} ТЗ; обязательность совпадает с гейтом в
                      хабе выше.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportStartRows,
                  currentPhase,
                  generalPassportStartExtras,
                  {
                    showAttributeNameHintIcons: true,
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
                    <h2 className="text-text-primary text-base font-semibold">
                      До образца: рынок и коды
                    </h2>
                    <p className="text-text-secondary text-xs leading-snug">
                      Дозаполните по мере приближения к образцу и отгрузке.
                    </p>
                  </div>
                </div>
                {renderSectionRows(
                  generalPassportPreSampleRows,
                  currentPhase,
                  generalPassportPreSampleExtras,
                  {
                    showAttributeNameHintIcons: true,
                  }
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    if (activeSection === 'visuals') {
      const mediaRefIdsForCanon = (dossier.visualReferences ?? [])
        .filter(visualRefIsMediaPreview)
        .map((r) => r.refId);
      const visualGateItemsForSection = buildWorkshop2VisualGateItems(dossier, currentLeaf);
      const hasAssign = (attributeId: string) =>
        dossier.assignments.some(
          (a) => a.attributeId === attributeId && (a.values?.length ?? 0) > 0
        );
      let visualCatalogFieldDone = 0;
      let visualCatalogFieldTotal = 0;
      for (const r of sectionRowsCurrent) {
        visualCatalogFieldTotal++;
        if (hasAssign(r.attribute.attributeId)) visualCatalogFieldDone++;
      }
      for (const ex of extraRowsCurrent) {
        visualCatalogFieldTotal++;
        if (hasAssign(ex.attribute.attributeId)) visualCatalogFieldDone++;
      }
      const visualReadinessNav = visualReadinessProgress(dossier);
      const visualRefCount = dossier.visualReferences?.length ?? 0;
      const openRefThreadCount = countOpenVisualRefThreads(dossier.visualReferences);
      const sketchPinTotal =
        (dossier.categorySketchAnnotations?.length ?? 0) +
        (dossier.sketchSheets ?? []).reduce((acc, s) => acc + (s.annotations?.length ?? 0), 0);
      const sketchHasSubstrate =
        Boolean(dossier.categorySketchImageDataUrl) ||
        Boolean(dossier.sketchSheets?.some((s) => Boolean(s.imageDataUrl)));
      const sketchGateOk = sketchHasSubstrate || sketchPinTotal > 0;
      const scrollToVisualsAnchor = (id: string) => {
        const sketchAnchorsInConstruction = new Set<string>([
          W2_VISUALS_SKETCH_ANCHOR_ID,
          'w2-visuals-sketch-templates',
        ]);
        if (sketchAnchorsInConstruction.has(id)) {
          setConstructionTzHubOpen(true);
          setActiveSection('construction');
          setActiveVisualSubNavId(id);
          if (typeof document === 'undefined') return;
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
            });
          });
          return;
        }
        setActiveVisualSubNavId(id);
        if (typeof document === 'undefined') return;
        document.getElementById(id)?.scrollIntoView({ behavior: tzScrollBehavior, block: 'start' });
      };
      return (
        <div className="space-y-4">
          <Workshop2VisualsTzStickySubnav
            activeAnchorId={activeVisualSubNavId}
            onNavigate={scrollToVisualsAnchor}
            onJumpToPulse={() => {
              document.getElementById('w2-dossier-role-pulse')?.scrollIntoView({
                behavior: tzScrollBehavior,
                block: 'start',
              });
            }}
            checklistDone={visualReadinessNav.done}
            checklistTotal={visualReadinessNav.total}
            catalogFieldDone={visualCatalogFieldDone}
            catalogFieldTotal={visualCatalogFieldTotal}
            referenceCount={visualRefCount}
            sketchPinTotal={sketchPinTotal}
            sketchHasSubstrate={sketchHasSubstrate}
            sketchGateOk={sketchGateOk}
            visualGateOpenCount={visualGateItemsForSection.length}
            openRefThreadCount={openRefThreadCount}
            tzPhase={currentPhase}
            sectionReadinessPct={sectionReadiness.visuals.pct}
            sketchPinLinkIssueCount={sketchPinLinkAudit.length}
            routeHandoffActions={visualRouteHandoffActions}
            showSketchExportSurfacesNav={showVisualSketchExportSurfacesNav}
            showSketchLinkFieldsNav={showVisualSketchLinkFieldsNav}
            showSketchTemplatesNav={sketchSurface === 'master'}
            showVisualHandoffNav={visualRouteHandoffActions.length > 0}
          />
          <div id="w2-visuals-hub" className="scroll-mt-24">
            <Workshop2VisualsExcellenceBlock
              dossier={dossier}
              setDossier={setDossier}
              updatedByLabel={updatedByLabel}
              articleSku={skuDraft}
              articleName={nameDraft}
              mediaRefIds={mediaRefIdsForCanon}
              sheetOptions={(dossier.sketchSheets ?? []).map((s) => ({
                sheetId: s.sheetId,
                title: s.title?.trim() || s.viewKind || s.sheetId.slice(0, 8),
              }))}
              visualGateItems={visualGateItemsForSection}
              onJumpToVisualAnchor={scrollToVisualsAnchor}
              visualShareAbsoluteUrl={isPhase1 ? visualsShareAbsoluteUrl : undefined}
              sketchFloorInUrl={sketchViewFloor}
              tzPhase={currentPhase}
              onJumpToPassportSection={() => jumpToTzSectionAnchor('general', 'w2-passport-hub')}
              onJumpToMaterialSection={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
              dossierViewProfile={dossierViewProfile}
              onHandoffToRoute={handoffFromVisualToRoute}
              buildRouteHandoffAbsoluteUrl={isPhase1 ? buildRouteHandoffAbsoluteUrl : undefined}
              nineGapSectionPct={sectionReadiness.visuals.pct}
              nineGapFooter={
                <WorkshopNineGapRelatedFooterShell
                  matSketchBomGapRefs={matSketchBomGapRefs}
                  onJumpMaterialHub={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
                  onJumpSketch={() =>
                    jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)
                  }
                  onJumpMaterialMatTable={jumpToMaterialMatTable}
                  onJumpConstructionContour={jumpToConstructionContour}
                  onJumpQcRoute={onNavigateToTab ? jumpToQcArticleSection : undefined}
                  hint="Согласуйте lineRef на метках с каноническим скетчем и строками mat в BOM."
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
                    onClick={() => jumpToTzSectionAnchor('construction', 'w2-construction-hub')}
                  >
                    Конструкция
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => jumpToTzSectionAnchor('construction', 'w2-measurements-fields')}
                  >
                    Мерки
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('visuals', W2_VISUAL_SUBPAGE_ANCHORS.sketchLinkFields)
                    }
                  >
                    Связь меток
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor(
                        'construction',
                        W2_VISUAL_SUBPAGE_ANCHORS.sketchTemplates
                      )
                    }
                  >
                    Шаблоны
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
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
                    className="h-7 text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('visuals', W2_VISUAL_SUBPAGE_ANCHORS.handoff)
                    }
                  >
                    Handoff
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor(
                        'visuals',
                        W2_VISUAL_SUBPAGE_ANCHORS.sketchExportSurfaces
                      )
                    }
                  >
                    Печать / мерч-вид
                  </Button>
                </WorkshopNineGapRelatedFooterShell>
              }
              nineGapOnDossierJump={jumpToTzSectionAnchor}
            />
          </div>
          <div
            id="w2-visuals-attributes"
            className="border-border-default scroll-mt-24 rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start gap-3">
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.Palette className="h-4 w-4 shrink-0" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <h2 className="text-text-primary text-base font-semibold">
                  Визуальные оси каталога
                </h2>
                <p className="text-text-secondary text-sm leading-snug">
                  <span className="text-text-primary font-medium">SKU · visuals:</span> набор полей
                  листа от категории — здесь, у референсов; та же ось артикула, что и согласование
                  выше. Редактор скетча — в «Конструкция» → «Табель мер: хаб ТЗ».
                </p>
                <p className="text-text-secondary text-[11px] leading-snug">
                  Скетч ↔ поля: <span className="font-mono">linkedAttributeId</span> на метке;
                  подсветка по типу метки — матрица ТЗ + при необходимости{' '}
                  <span className="font-mono">sketchHighlightForPinTypes</span> в JSON каталога.
                </p>
              </div>
            </div>
            {renderSectionRows(sectionRowsCurrent, currentPhase, extraRowsCurrent, {
              flatCatalogGroups: true,
            })}
          </div>
          <div id="w2-visuals-refs" className="scroll-mt-24">
            <VisualReferencesBlock
              items={dossier.visualReferences ?? []}
              onChange={(next) =>
                setDossier((p: Workshop2DossierPhase1) => ({ ...p, visualReferences: next }))
              }
              currentUserLabel={updatedByLabel}
              threadAuthorLabel={
                (dossier.passportProductionBrief?.articleCardOwnerName ?? '').trim() ||
                updatedByLabel
              }
              canonicalMainPhotoRefId={dossier.canonicalMainPhotoRefId}
              onSetCanonicalMainPhoto={(refId) =>
                setDossier((p: Workshop2DossierPhase1) => ({
                  ...p,
                  canonicalMainPhotoRefId: refId ?? undefined,
                }))
              }
            />
          </div>
          <div
            id="w2-visuals-sketch-moved-hint"
            className="border-accent-primary/30 bg-accent-primary/10 scroll-mt-24 rounded-xl border border-dashed p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start gap-3">
              <div className="text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-text-primary text-sm font-semibold">
                  Скетч перенесён в контур ТЗ
                </p>
                <p className="text-text-secondary text-xs leading-snug">
                  Редактор меток и листов — в «Конструкция» → разверните «Табель мер: хаб ТЗ» и
                  прокрутите к блоку скетча (тот же якорь для переходов из материалов и «до 9»).
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-1 h-8 text-[11px]"
                  onClick={() => jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)}
                >
                  Открыть конструкцию → скетч
                </Button>
              </div>
            </div>
          </div>

          <div
            id="w2-attr-brandNotes"
            className="border-border-default space-y-4 rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="text-text-primary text-base font-semibold">Дизайнерский замысел</h2>
                <p className="text-text-secondary text-sm leading-snug">
                  Зафиксируйте образ для команды: что важно в силуэте, деталях и общем настроении —
                  это подхватят посадка, производство и ОТК.
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="w2-brand-manifesto" className="sr-only">
                Текст дизайнерского замысла
              </Label>
              <Textarea
                id="w2-brand-manifesto"
                className="min-h-[92px] text-sm"
                placeholder="Какой образ нужно защитить в посадке, производстве и ОТК."
                value={dossier.brandNotes ?? ''}
                onChange={(e) =>
                  setDossier((prev: Workshop2DossierPhase1) => ({
                    ...prev,
                    brandNotes: e.target.value,
                  }))
                }
              />
            </div>
            <div className="border-border-subtle flex flex-wrap items-center justify-end gap-2 border-t pt-3">
              <Button
                type="button"
                className="h-9 px-3 text-xs font-semibold"
                title="Записать досье в этом браузере (то же действие, что и «Сохранить» внизу страницы)."
                onClick={saveDraft}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
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
          })}
        </div>
      ) : (
        <>
          <div id="w2-material-mat" className="scroll-mt-24">
            {renderSectionRows(materialMatRows, currentPhase)}
          </div>
          <div id="w2-material-catalog" className="scroll-mt-24">
            {renderSectionRows(materialCatalogRows, currentPhase)}
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
            onJumpToPulse={() => {
              document.getElementById('w2-dossier-role-pulse')?.scrollIntoView({
                behavior: tzScrollBehavior,
                block: 'start',
              });
            }}
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
          <Workshop2DossierSupplyChainDraftsPanel
            dossier={dossier}
            setDossier={setDossier}
            dossierViewProfile={dossierViewProfile}
            tzWriteDisabled={tzWriteDisabled}
            updatedByLabel={updatedByLabel}
          />
          <Collapsible
            open={materialPreSupplyExpanded}
            onOpenChange={setMaterialPreSupplyExpanded}
            className="scroll-mt-24 rounded-xl border border-amber-200/80 bg-gradient-to-b from-amber-50/35 to-white shadow-sm"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition hover:bg-amber-100/50">
              <div className="min-w-0 pr-2">
                <p className="text-[11px] font-semibold text-amber-950">Материалы и BOM</p>
                <p className="text-text-secondary text-[10px] leading-snug">
                  Хаб, комплаенс, нормы, mat и поля каталога — ниже блока «Снабжение · дельта ·
                  costing»
                </p>
              </div>
              <LucideIcons.ChevronsUpDown
                className="text-text-secondary h-4 w-4 shrink-0"
                aria-hidden
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden border-t border-amber-200/70 px-0 pb-3 pt-3 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div id="w2-material-hub" className="scroll-mt-24 px-1 sm:px-2">
                <Workshop2MaterialHubPanel
                  model={materialBomHubModel}
                  l2Name={l2}
                  matHint={matHint}
                  categoryNotes={materialCategoryNotes}
                  sketchBomStrip={materialSketchBomStripModel}
                  bomExport={materialBomExportInput}
                  onNavigate={scrollMaterialAnchor}
                  onOpenVisualSketch={openSketchFromMaterialHub}
                  tzWriteDisabled={tzWriteDisabled}
                  onJumpToPassportSection={() =>
                    jumpToTzSectionAnchor('general', 'w2-passport-hub')
                  }
                  onJumpToVisualSection={() => jumpToTzSectionAnchor('visuals', 'w2-visuals-hub')}
                  articleScopedKey={`${collectionId}:${articleId}`}
                  materialComplianceChecklist={dossier.materialComplianceChecklist}
                  onMaterialComplianceChecklistChange={
                    tzWriteDisabled
                      ? undefined
                      : (next) =>
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            materialComplianceChecklist: next,
                          }))
                  }
                  dossierViewProfile={dossierViewProfile}
                  sketchLinkedBomRefs={sketchBomRefsUnion}
                  matSketchBomGapRefs={matSketchBomGapRefs}
                  onJumpToConstructionContour={jumpToConstructionContour}
                  onJumpToQcRoute={onNavigateToTab ? jumpToQcArticleSection : undefined}
                  nineGapSectionPct={sectionReadiness.material.pct}
                  nineGapFooter={
                    <WorkshopNineGapRelatedFooterShell
                      matSketchBomGapRefs={matSketchBomGapRefs}
                      onJumpMaterialHub={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
                      onJumpSketch={openSketchFromMaterialHub}
                      onJumpMaterialMatTable={jumpToMaterialMatTable}
                      onJumpConstructionContour={jumpToConstructionContour}
                      onJumpQcRoute={onNavigateToTab ? jumpToQcArticleSection : undefined}
                      hint="Строки mat с теми же linkedBomLineRef, что на метках скетча; дельта и альтернативы — в снабжении."
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
                        onClick={() => jumpToTzSectionAnchor('visuals', 'w2-visuals-hub')}
                      >
                        Визуал
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() => jumpToTzSectionAnchor('construction', 'w2-construction-hub')}
                      >
                        Конструкция
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          jumpToTzSectionAnchor(
                            'material',
                            W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts
                          )
                        }
                      >
                        Снабжение · черновики
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          jumpToTzSectionAnchor(
                            'material',
                            W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsDelta
                          )
                        }
                      >
                        Дельта BOM
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          jumpToTzSectionAnchor(
                            'material',
                            W2_MATERIAL_SUBPAGE_ANCHORS.factoryExport
                          )
                        }
                      >
                        Фабрика CSV
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          jumpToTzSectionAnchor(
                            'material',
                            W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsAlts
                          )
                        }
                      >
                        Альтернативы
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.compliance)
                        }
                      >
                        Комплаенс
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          jumpToTzSectionAnchor(
                            'material',
                            W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsCosting
                          )
                        }
                      >
                        Costing
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.bomNorms)
                        }
                      >
                        Нормы BOM
                      </Button>
                    </WorkshopNineGapRelatedFooterShell>
                  }
                  nineGapOnDossierJump={jumpToTzSectionAnchor}
                />
              </div>
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
        </div>
      );
    }

    if (activeSection === 'construction') {
      const l2 = currentLeaf.l2Name;
      const hint =
        l2 === 'Верхняя одежда'
          ? 'Ключевое: воротник/лацкан, борт, рукав, подкладка, утеплитель, длина, карманы. Проверьте ТЗ-скетч.'
          : l2 === 'Платья и сарафаны'
            ? 'Ключевое: силуэт, вырез, талия, молния/застежка, шлица, длина. Зафиксируйте прилегание.'
            : l2 === 'Брюки' || l2 === 'Джинсы'
              ? 'Ключевое: пояс, посадка (слонка), карманы, шаговый шов, низ брючин.'
              : l2 === 'Рубашки и блузы'
                ? 'Ключевое: воротник, манжеты, планка, вытачки, тип застежки.'
                : l2 === 'Юбки'
                  ? 'Ключевое: пояс, силуэт, застежка, длина, шлица.'
                  : l2 === 'Трикотаж'
                    ? 'Ключевое: тип вязки, горловина, манжеты, резинка, плотность полотна.'
                    : 'Конструктив, узлы и технический замысел без устных пояснений.';
      return (
        <div id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub} className="scroll-mt-24 space-y-4">
          <div
            id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour}
            className="scroll-mt-24 rounded-lg border border-teal-200/85 bg-teal-50/45 px-3 py-2.5 text-[11px] text-teal-950 shadow-sm"
          >
            <p className="text-[9px] font-black uppercase tracking-wide text-teal-900">
              Один контур: конструкция · мерки · BOM
            </p>
            <p className="mt-1 leading-snug text-teal-950/90">
              Слои и длины в узлах должны сходиться с таблицей мерок и строками mat. На этом контуре
              сходятся интересы дизайна, технолога, снабжения, цеха и ОТК — кнопка «Роли» справа
              перечисляет, что важно каждой стороне. Технически: готовность секций —{' '}
              <span className="font-mono text-[10px]">sectionReadiness</span>, маппинг групп
              каталога — <span className="font-mono text-[10px]">GROUP_TO_DOSSIER_SECTION</span>;
              mat ↔ метки скетча смотрите в паспорте и визуале.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() => jumpToTzSectionAnchor('construction', 'w2-measurements-fields')}
              >
                Мерки
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
                onClick={() => jumpToTzSectionAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)}
              >
                Скетч
              </Button>
            </div>
          </div>
          <div id="w2-measurements-fields" className="scroll-mt-24 space-y-3">
            <Workshop2MeasurementsTableHub
              dossier={dossier}
              currentLeaf={currentLeaf}
              handbookWarnings={handbookWarnings}
              onJumpToTzAnchor={jumpToTzSectionAnchor}
              constructionSectionPct={sectionReadiness.construction.pct}
            />
          </div>

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
                <span className="min-w-0">Дорожная карта и справка конструктора</span>
                <span className="ml-auto hidden shrink-0 text-[9px] font-normal text-teal-800/75 sm:inline">
                  до 9 · L2 · ТК · подпись
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="border-accent-primary/20 bg-accent-primary/10 min-w-0 flex-1 rounded-lg border px-3 py-2">
                  <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                    Конструктив: {l2}
                  </p>
                  <p className="text-text-secondary mt-1 text-[10px] leading-snug">
                    Узлы каталога ниже — зона дизайна и технолога; мерки и скетч связывают
                    менеджера, снабжение, цех и ОТК с одним артикулом. Подпись секции и выгрузка ТК
                    закрывают контур для производства и комплаенса.
                  </p>
                  <p className="text-text-primary mt-1 text-[11px] leading-snug">{hint}</p>
                </div>
                <Workshop2TzSectionRolesPopover section="construction" className="shrink-0" />
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
                    hint="Узлы каталога и метки скетча (construction / qc) согласуйте с мерки и строками mat."
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() =>
                        jumpToTzSectionAnchor(
                          'construction',
                          W2_CONSTRUCTION_SUBPAGE_ANCHORS.export
                        )
                      }
                    >
                      ТК / выгрузка
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() =>
                        jumpToTzSectionAnchor(
                          'construction',
                          W2_CONSTRUCTION_SUBPAGE_ANCHORS.signoff
                        )
                      }
                    >
                      Подпись
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
                  PDF листа узлов или табличная выгрузка техкарты подключаются маршрутами tech-pack
                  и экспорта <span className="font-semibold">вне этого экрана</span> — здесь
                  фиксируем согласованный контур данных для цеха.
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
                  Те же мета подписей, что у прочих секций ТЗ (brand / tech): чекбоксы в липкой
                  панели «Этап ТЗ» над полями при открытой вкладке «Конструкция».
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
                {renderSectionRows(sectionRowsCurrent, currentPhase, extraRowsCurrent)}
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
      {/* Horizontal Breadcrumb Bar — первичные секции для w2view + переход «до 9» (паспорт-dense) */}
      <div id={W2_PASSPORT_SUBPAGE_ANCHORS.denseView} className="scroll-mt-24">
        <div className="scrollbar-thin flex items-center gap-1 overflow-x-auto pb-1">
          {dossierNavPrimarySections.map((s, idx) => {
            const rd = sectionReadiness[s.id];
            const isActive = activeSection === s.id;
            const isDone = rd.pct === 100;
            const primaryForView =
              dossierViewProfile === 'full' ||
              isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id);
            return (
              <Fragment key={s.id}>
                {idx > 0 && (
                  <LucideIcons.ChevronRight className="text-text-muted h-3 w-3 shrink-0" />
                )}
                <button
                  type="button"
                  title={
                    primaryForView
                      ? undefined
                      : 'Вторично для выбранного режима ТЗ — откройте при необходимости'
                  }
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition-all',
                    isActive
                      ? 'bg-accent-primary text-white shadow-md'
                      : isDone
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-bg-surface2 text-text-secondary border-border-default hover:bg-bg-surface2 border',
                    !primaryForView &&
                      !isActive &&
                      'ring-dashed ring-border-default/80 opacity-65 ring-1'
                  )}
                >
                  {isDone && !isActive && <LucideIcons.Check className="h-3 w-3" />}
                  <span className="uppercase tracking-tight">{s.label}</span>
                  {!isActive && rd.pct > 0 && rd.pct < 100 && (
                    <span className="text-[8px] font-black opacity-60">{rd.pct}%</span>
                  )}
                </button>
              </Fragment>
            );
          })}
          {dossierNavSecondarySections.length > 0 ? (
            <Fragment>
              <LucideIcons.ChevronRight className="text-text-muted h-3 w-3 shrink-0" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 shrink-0 gap-1 rounded-full px-2.5 text-[9px] font-bold uppercase"
                  >
                    Ещё ({dossierNavSecondarySections.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-2">
                  <p className="text-text-secondary mb-1.5 text-[9px] font-bold uppercase tracking-wide">
                    Доп. разделы ТЗ
                  </p>
                  <div className="flex flex-col gap-1">
                    {dossierNavSecondarySections.map((s) => {
                      const rd = sectionReadiness[s.id];
                      const isActive = activeSection === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveSection(s.id)}
                          className={cn(
                            'rounded-md px-2 py-1.5 text-left text-[11px] font-semibold transition-colors',
                            isActive
                              ? 'bg-accent-primary text-white'
                              : 'bg-bg-surface2 text-text-primary hover:bg-bg-surface2'
                          )}
                        >
                          {s.label}
                          <span className="ml-1 text-[10px] font-normal tabular-nums opacity-80">
                            {rd.pct}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </Fragment>
          ) : null}
        </div>
      </div>

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

      {dossierViewProfile !== 'full' ? (
        <div
          className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary rounded-lg border px-3 py-2 text-xs leading-snug"
          role="note"
        >
          <span className="font-semibold">Режим просмотра:</span>{' '}
          {WORKSHOP2_DOSSIER_VIEW_OPTIONS.find((o) => o.value === dossierViewProfile)?.label ??
            dossierViewProfile}
          . {WORKSHOP2_DOSSIER_VIEW_HINTS[dossierViewProfile]}
        </div>
      ) : null}

      {isPhase1 && dossierViewProfile === 'factory' ? (
        <div className="border-border-default rounded-xl border-2 bg-white px-4 py-3 shadow-sm">
          <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
            Фабрика · с чего начать
          </p>
          <p className="text-text-secondary mt-1 text-xs">
            SKU → канон → эскиз → BOM без лишнего скролла.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 text-xs"
              onClick={() => jumpToTzSectionAnchor('general', 'w2-passport-hub')}
            >
              Паспорт / SKU
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 text-xs"
              onClick={() => jumpToTzSectionAnchor('visuals', 'w2-visuals-hub')}
            >
              Канон и эскиз
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 text-xs"
              onClick={() => jumpToTzSectionAnchor('material', 'w2-material-hub')}
            >
              BOM
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 text-xs"
              onClick={() => jumpToTzSectionAnchor('construction', 'w2-construction-hub')}
            >
              Конструкция
            </Button>
          </div>
        </div>
      ) : null}

      {isPhase1 ? (
        <Workshop2DossierNineClosureSummary
          passportPct={passportHubModel.combinedPct}
          passportGatesOpen={passportHubModel.gateItems.length}
          visualGatesOpen={visualGateOpenCountGlobal}
          materialPct={materialBomHubModel.combinedPct}
          materialGatesOpen={materialBomHubModel.gateItems.length}
          constructionPct={sectionReadiness.construction.pct}
          altDrafts={dossier.materialAlternativeDrafts?.length ?? 0}
          deltaDrafts={dossier.bomLineDeltaDrafts?.length ?? 0}
          costingRows={dossier.bomLineCostingHints?.length ?? 0}
          onJump={jumpToTzSectionAnchor}
        />
      ) : null}

      {isPhase1 ? (
        <div id="w2-dossier-role-pulse" className="scroll-mt-24">
          <Workshop2DossierRolePulsePanel
            dossier={dossier}
            currentLeaf={currentLeaf}
            setDossier={setDossier}
            setActiveSection={setActiveSection}
            onJumpToTzAnchor={jumpToTzSectionAnchor}
            onJumpToBrandNotes={() => {
              setActiveSection('visuals');
              queueMicrotask(() => {
                document
                  .getElementById('w2-attr-brandNotes')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
            }}
            onExportHandoffPdf={exportHandoffPdfOnly}
            handoffPdfBusy={handoffPdfBusy}
          />
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
        <aside className="space-y-4 self-start xl:sticky xl:top-4">
          <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2 pb-1">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <LucideIcons.LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-text-primary text-base font-semibold">Досье артикула</h2>
                  <p className="text-text-secondary text-xs leading-snug">
                    Разделы ТЗ и прогресс по маршруту SKU: от паспорта и визуала к материалам,
                    меркам и подписям без лишних переходов.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 shrink-0 gap-1.5 px-3 text-xs"
                onClick={() => setTzHistoryOpen(true)}
              >
                <LucideIcons.History className="h-3.5 w-3.5 shrink-0" aria-hidden />
                История действий
              </Button>
            </div>
            <div className="mt-4">
              <DossierNavigator
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                sectionReadiness={sectionReadiness}
                handbookCheckBySection={handbookCheckSnapshot?.bySection ?? null}
                dossierViewProfile={dossierViewProfile}
                primarySections={dossierNavPrimarySections}
                secondarySections={dossierNavSecondarySections}
              />
            </div>
            {dossierViewProfile === 'factory' ? (
              <div className="border-accent-primary/25 bg-accent-primary/10 mt-3 rounded-lg border p-2.5">
                <p className="text-text-primary/90 text-[9px] font-black uppercase tracking-widest">
                  Быстро · фабрика
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub)
                    }
                  >
                    Хаб конструкции
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                    onClick={jumpToConstructionContour}
                  >
                    Контур
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                    onClick={jumpToSketchLineRefs}
                  >
                    Скетч · метки
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-accent-primary/25 text-text-primary h-7 bg-white text-[10px]"
                    onClick={() =>
                      jumpToTzSectionAnchor('material', W2_MATERIAL_SUBPAGE_ANCHORS.hub)
                    }
                  >
                    BOM
                  </Button>
                </div>
              </div>
            ) : null}
            {dossierViewProfile === 'finance' ? (
              <div className="mt-3 rounded-lg border border-emerald-200/85 bg-emerald-50/40 p-2.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-900/85">
                  К образу · финансы
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 border-emerald-200 bg-white text-[10px] text-emerald-950"
                    onClick={() =>
                      jumpToTzSectionAnchor('visuals', W2_VISUAL_SUBPAGE_ANCHORS.canonVersion)
                    }
                  >
                    Канон и версия
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 border-emerald-200 bg-white text-[10px] text-emerald-950"
                    onClick={() => jumpToTzSectionAnchor('general', 'w2-passport-hub')}
                  >
                    Паспорт
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="border-border-subtle bg-bg-surface2/60 mt-4 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Готовность досье
                  </p>
                  <p className="text-text-primary mt-1 text-sm font-semibold">
                    {overallReadinessPct}% по всем секциям
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 text-[9px]',
                    tzReadyForSample
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                  )}
                >
                  {tzReadyForSample ? 'Готово к передаче' : 'Черновик'}
                </Badge>
              </div>
              <div className="bg-bg-surface2 mt-2 h-1.5 overflow-hidden rounded-full">
                <div
                  className="bg-accent-primary h-full rounded-full"
                  style={{ width: `${overallReadinessPct}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        <div
          id="w2-dossier-main"
          className={cn(
            'min-w-0 space-y-4 rounded-xl transition-[box-shadow] duration-300',
            dossierMainColumnFlash && 'ring-accent-primary ring-4 ring-offset-2 ring-offset-white'
          )}
        >
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
                  <h2 className="text-text-primary text-base font-semibold">Подтверждения ТЗ</h2>
                  <p className="text-text-secondary text-sm leading-snug">
                    Участники этапа «ТЗ» из паспорта: подпись и уведомление по строкам. Права ролей
                    — в{' '}
                    <Link
                      href={ROUTES.brand.teamPermissions}
                      className="text-accent-primary font-medium underline"
                    >
                      Команда → права доступа
                    </Link>
                    ; снять подпись — только у допущенных руководителей.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {tzDigitalSignoffRows.length === 0 ? (
                  <p className="border-border-subtle bg-bg-surface2/60 text-text-secondary rounded-md border px-3 py-2 text-[11px]">
                    В паспорте нет участников на этапе «ТЗ»: отметьте этап у ролей и закрепите
                    исполнителей в «Ответственные за подпись ТЗ».
                  </p>
                ) : (
                  tzDigitalSignoffRows.map((row) => (
                    <WorkshopTzDigitalSignoffRow
                      key={row.rowKey}
                      title={row.title}
                      passportAssigneeName={row.passportAssigneeName}
                      canSign={row.canSign}
                      hasRoleCapability={row.hasRoleCapability}
                      signatoryMismatchHint={row.signatoryMismatchHint}
                      signoff={row.signoff}
                      showNotifyResponsible={!row.signoff && !allTzDigitalSignoffsDone}
                      onNotifyResponsible={() =>
                        notifyResponsibleForTzRow(row.rowKey, row.title, row.assigneeForNotify)
                      }
                      notifyResponsibleHighlighted={tzNotifyHighlightRowKey === row.rowKey}
                      canRevoke={canRevokeTzSignoff(updatedByLabel, tzRevokersEffective)}
                      onSign={() => signTzDigitalRow(row.rowKey, row.title)}
                      onRevoke={() => revokeTzDigitalRow(row.rowKey, row.title)}
                    />
                  ))
                )}
              </div>
              {handbookCheckSnapshot
                ? renderHandbookCheckReportBlock(handbookCheckSnapshot, {
                    expanded: handbookCheckReportExpanded,
                    onToggleExpanded: () => setHandbookCheckReportExpanded((v) => !v),
                  })
                : null}
            </div>
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {dossier.updatedAt ? (
            <span className="text-text-secondary text-[10px]">
              Черновик в браузере: {new Date(dossier.updatedAt).toLocaleString('ru-RU')}
              {dossier.updatedBy ? ` · ${dossier.updatedBy}` : ''}
            </span>
          ) : null}
          {savedHint ? (
            <span className="text-[11px] font-medium text-emerald-700">{savedHint}</span>
          ) : null}
          {saveError ? (
            <span className="text-[11px] font-medium text-red-600">{saveError}</span>
          ) : null}
        </div>
        {dossierMetricsFooterLine ? (
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

type MatHandbookParam = AttributeCatalogAttribute['parameters'][number];

/** Единый блок подсказок в секции «Материалы» — без подзаголовков «Доп. атрибуты» / «Верхняя одежда · материалы». */
function MaterialSectionGuidesBeforeFields({ l2Name }: { l2Name?: string }) {
  const outer = l2Name === 'Верхняя одежда';
  return (
    <div
      className="border-border-default space-y-3 rounded-xl border bg-white/95 p-3 shadow-sm"
      role="region"
      aria-label="Подсказки к полям материалов"
    >
      <p className="text-text-secondary text-[9px] font-black uppercase tracking-[0.2em]">
        Подсказки к полям ниже
      </p>
      <div className="space-y-3">
        <div>
          <p className="text-text-primary text-[11px] font-semibold">Плотность полотна (г/м²)</p>
          <p className="border-accent-primary/30 bg-accent-primary/10 text-text-primary mt-1 rounded-r-md border-l-2 py-1.5 pl-2 text-[10px] leading-snug">
            Несколько тканей: укажите г/м² <span className="font-semibold">основного</span> полотна
            (наибольшая доля в составе) или <span className="font-semibold">лицевой</span> ткани
            корпуса. Подклад и утеплитель — отдельные строки в BOM; при необходимости добавьте
            плотность второго слоя в комментарии к строке материала.
            {outer ? (
              <span className="text-accent-primary/90 mt-1 block">
                Для пуховиков и парок: здесь — плотность{' '}
                <span className="font-semibold">оболочки</span>; граммы наполнителя и FP/down — в
                полях утеплителя и в строках BOM, согласованных со скетчем.
              </span>
            ) : null}
          </p>
        </div>
        <div>
          <p className="text-text-primary text-[11px] font-semibold">Температурный режим</p>
          <p className="text-text-secondary mt-1 text-[10px] leading-snug">
            Укажите целевой диапазон носки или класс по гайду бренда; согласуйте с утеплителем и
            сценарием использования изделия.
          </p>
        </div>
        {outer ? (
          <>
            <div>
              <p className="text-text-primary text-[11px] font-semibold">Материал утеплителя</p>
              <p className="text-text-primary mt-1 rounded-r-md border-l-2 border-amber-200 bg-amber-50/40 py-1.5 pl-2 text-[10px] leading-snug">
                Совместите с отдельной строкой «утеплитель» в справочнике материалов и при
                необходимости с меткой <span className="font-semibold">material</span> на скетче —
                чтобы закупка и конструкция ссылались на одно наименование.
              </p>
            </div>
            <div>
              <p className="text-text-primary text-[11px] font-semibold">Уровень утепления</p>
              <p className="text-text-primary mt-1 rounded-r-md border-l-2 border-amber-200 bg-amber-50/40 py-1.5 pl-2 text-[10px] leading-snug">
                Уровень утепления согласуйте с сценарием носки (город / активный отдых) и с
                плотностью shell; при спорных значениях зафиксируйте решение в комментарии к
                материалу или в техпаке.
              </p>
            </div>
            <div>
              <p className="text-text-primary text-[11px] font-semibold">Термо-технологии</p>
              <p className="text-text-primary mt-1 rounded-r-md border-l-2 border-teal-200 bg-teal-50/40 py-1.5 pl-2 text-[10px] leading-snug">
                Мембраны, отражающие слои и маркетинговые названия — продублируйте исполнимые
                параметры (уход, паропроницаемость, стирка) в BOM или вложении техпака, чтобы
                фабрика не гадала по бренду на вешалке.
              </p>
            </div>
          </>
        ) : null}
        <div>
          <p className="text-text-primary text-[11px] font-semibold">
            Уход: стирка и обработка (ТЗ)
          </p>
          <p className="text-text-secondary mt-1 text-[10px] leading-snug">
            Зафиксируйте класс ухода и ограничения, совместимые с подобранными материалами;
            критичное продублируйте в BOM или вложении техпака.
          </p>
        </div>
      </div>
    </div>
  );
}

function MaterialHandbookPicker({
  sortedParams,
  excludeIds,
  onPick,
}: {
  sortedParams: MatHandbookParam[];
  excludeIds: Set<string>;
  onPick: (p: MatHandbookParam) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const available = sortedParams.filter(
    (p) => !excludeIds.has(p.parameterId) && (!needle || p.label.toLowerCase().includes(needle))
  );
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 text-xs"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Скрыть справочник материалов' : '+ Добавить материал из справочника'}
      </Button>
      {open ? (
        <div className="border-border-default rounded-lg border bg-white p-2 shadow-sm">
          <Input
            className="mb-2 h-9 text-sm"
            placeholder="Фильтр по названию…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="border-border-subtle divide-border-subtle max-h-48 divide-y overflow-y-auto rounded-md border">
            {available.length === 0 ? (
              <p className="text-text-secondary p-3 text-[11px]">
                Нет позиций — измените фильтр или все материалы уже в строке состава.
              </p>
            ) : (
              available.map((p) => (
                <button
                  key={p.parameterId}
                  type="button"
                  className="hover:bg-bg-surface2 w-full px-2 py-2 text-left text-sm"
                  onClick={() => {
                    onPick(p);
                    setQ('');
                    setOpen(false);
                  }}
                >
                  {p.label}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MaterialPresetsStrip({
  presets,
  l2Name,
  l3Name,
  linkedComposition,
  visible,
  onApplyLinked,
  onApplySolo,
}: {
  presets: Workshop2MaterialCompositionPreset[];
  l2Name?: string;
  l3Name?: string;
  linkedComposition: boolean;
  visible: boolean;
  onApplyLinked: (rows: MatPctRow[]) => void;
  onApplySolo: (parts: { parameterId: string; displayLabel: string }[]) => void;
}) {
  if (!visible || presets.length === 0) return null;
  const l3ok = l3Name && l3Name.trim() && l3Name !== '—';
  return (
    <div className="border-accent-primary/20 bg-accent-primary/10 space-y-2 rounded-lg border p-3">
      <p className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
        Типовые составы{l2Name ? ` · ${l2Name}` : ''}
      </p>
      {l3ok ? (
        <p className="text-accent-primary/90 text-[9px] font-semibold uppercase tracking-wide">
          Подтип листа: {l3Name}
        </p>
      ) : null}
      <p className="text-accent-primary/85 text-[10px] leading-snug">
        {linkedComposition
          ? 'Подставит строки материала и распределит доли (при необходимости поправьте % вручную до 100%).'
          : 'Добавит выбранные волокна в список без долей — дальше уточните состав в каталоге или включите связку mat ↔ composition.'}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            type="button"
            variant="outline"
            size="sm"
            className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 h-auto min-h-7 max-w-full whitespace-normal py-1 text-left text-[10px]"
            title={preset.rows.map((r) => `${r.label} ${r.pct}%`).join(' · ')}
            onClick={() =>
              linkedComposition
                ? onApplyLinked(preset.rows)
                : onApplySolo(
                    preset.rows.map((r) => ({ parameterId: r.parameterId, displayLabel: r.label }))
                  )
            }
          >
            <LucideIcons.Sparkles className="mr-1 inline h-3 w-3 shrink-0" aria-hidden />
            <span className="font-semibold">{preset.label}</span>
            <span className="text-accent-primary/95 mt-0.5 block text-[9px] font-normal">
              {preset.rows.map((r) => `${r.label} ${r.pct}%`).join(' + ')}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

function MaterialCompositionBlock({
  dossier,
  matAttribute,
  linkedComposition,
  onApplyRows,
  onApplySoloParts,
  showMaterialRequiredHint,
  l2Name,
  leafId,
  l3Name,
}: {
  dossier: Workshop2DossierPhase1;
  matAttribute: AttributeCatalogAttribute;
  linkedComposition: boolean;
  onApplyRows: (rows: MatPctRow[]) => void;
  onApplySoloParts: (parts: { parameterId: string; displayLabel: string }[]) => void;
  showMaterialRequiredHint?: boolean;
  l2Name?: string;
  leafId: string;
  l3Name?: string;
}) {
  const compositionPresets = useMemo(
    () =>
      resolveMaterialCompositionPresets({
        leafId,
        l2Name: l2Name ?? '',
        l3Name,
      }),
    [leafId, l2Name, l3Name]
  );

  const paramLabelById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of matAttribute.parameters) m.set(p.parameterId, p.label);
    return m;
  }, [matAttribute.parameters]);

  const sortedParams = useMemo(
    () => [...matAttribute.parameters].sort((x, y) => x.sortOrder - y.sortOrder),
    [matAttribute.parameters]
  );

  const rows = useMemo(
    () => parseMatRowsFromDossier(dossier, paramLabelById),
    [dossier, paramLabelById]
  );

  if (!linkedComposition) {
    const a = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'mat');
    const selected = new Set(
      (a?.values ?? [])
        .filter((v) => v.valueSource === 'handbook_parameter')
        .map((v) => v.parameterId)
        .filter(Boolean) as string[]
    );
    const pushSolo = (nextSel: Set<string>) => {
      const parts = sortedParams
        .filter((p) => nextSel.has(p.parameterId))
        .map((p) => ({ parameterId: p.parameterId, displayLabel: p.label }));
      onApplySoloParts(parts);
    };
    const addSolo = (pid: string) => {
      if (selected.has(pid)) return;
      const next = new Set(selected);
      next.add(pid);
      pushSolo(next);
    };
    const removeSolo = (pid: string) => {
      const next = new Set(selected);
      next.delete(pid);
      pushSolo(next);
    };
    const selectedRows = sortedParams.filter((p) => selected.has(p.parameterId));
    return (
      <div id="w2-material-composition" className="scroll-mt-20 space-y-3">
        {showMaterialRequiredHint ? (
          <p className="text-[11px] font-medium text-amber-700">Выберите материал.</p>
        ) : null}
        <MaterialHandbookPicker
          sortedParams={sortedParams}
          excludeIds={selected}
          onPick={(p) => addSolo(p.parameterId)}
        />
        <MaterialPresetsStrip
          presets={compositionPresets}
          l2Name={l2Name}
          l3Name={l3Name}
          linkedComposition={false}
          visible={selected.size === 0}
          onApplySolo={(parts) => onApplySoloParts(parts)}
          onApplyLinked={() => {}}
        />
        <div>
          <p className="text-text-secondary mb-1.5 text-[10px] font-semibold uppercase">
            Выбранные материалы
          </p>
          {selectedRows.length === 0 ? (
            <p className="text-text-secondary text-[11px]">
              Пока пусто — откройте «+ Добавить материал из справочника» выше или выберите типовой
              состав для категории.
            </p>
          ) : (
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-min flex-nowrap items-stretch gap-2 sm:flex-wrap">
                {selectedRows.map((p) => (
                  <div
                    key={p.parameterId}
                    className="border-border-default flex h-9 shrink-0 items-center gap-2 rounded-md border bg-white px-2 text-sm"
                  >
                    <span
                      className="max-w-[10rem] truncate whitespace-nowrap leading-none"
                      title={p.label}
                    >
                      {p.label}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 shrink-0 p-0 text-sm text-red-600"
                      onClick={() => removeSolo(p.parameterId)}
                      aria-label={`Убрать ${p.label}`}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const pctByPid = Object.fromEntries(rows.map((r) => [r.parameterId, r.pct])) as Record<
    string,
    number
  >;
  const sum = rows.reduce((s, r) => s + r.pct, 0);
  const selectedIds = new Set(rows.map((r) => r.parameterId));

  const addLinked = (pid: string, label: string) => {
    if (rows.some((r) => r.parameterId === pid)) return;
    const next = [...rows, { parameterId: pid, label, pct: 0 }];
    const parts = split100(next.length);
    onApplyRows(next.map((r, i) => ({ ...r, pct: parts[i]! })));
  };

  const removeLinked = (pid: string) => {
    let next = rows.filter((r) => r.parameterId !== pid);
    if (next.length === 1) next[0] = { ...next[0]!, pct: 100 };
    else if (next.length > 1) {
      const parts = split100(next.length);
      next = next.map((r, i) => ({ ...r, pct: parts[i]! }));
    }
    onApplyRows(next);
  };

  const setPctFor = (pid: string, label: string, raw: string) => {
    const n = parseInt(raw.replace(/\D/g, ''), 10);
    const pct = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
    const next = rows.map((r) => (r.parameterId === pid ? { ...r, label, pct } : r));
    onApplyRows(next);
  };

  const selectedRows = rows;

  return (
    <div id="w2-material-composition" className="scroll-mt-20 space-y-3">
      {showMaterialRequiredHint ? (
        <p className="text-[11px] font-medium text-amber-700">Выберите материал.</p>
      ) : null}
      <MaterialHandbookPicker
        sortedParams={sortedParams}
        excludeIds={selectedIds}
        onPick={(p) => addLinked(p.parameterId, p.label)}
      />

      <MaterialPresetsStrip
        presets={compositionPresets}
        l2Name={l2Name}
        l3Name={l3Name}
        linkedComposition
        visible={rows.length === 0}
        onApplyLinked={onApplyRows}
        onApplySolo={() => {}}
      />

      <div>
        <p className="text-text-secondary mb-1.5 text-[10px] font-semibold uppercase">
          Выбранные материалы
        </p>
        {selectedRows.length === 0 ? (
          <p className="text-text-secondary text-[11px]">
            Пока пусто — добавьте позиции из справочника
            {l2Name ? ` или примените типовой состав для «${l2Name}».` : '.'}
          </p>
        ) : (
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-min flex-nowrap items-center gap-2 sm:flex-wrap">
              {selectedRows.map((r) => (
                <div
                  key={r.parameterId}
                  className="border-border-default flex h-9 shrink-0 items-center gap-1.5 rounded-md border bg-white px-2"
                >
                  <span
                    className="max-w-[9rem] truncate whitespace-nowrap text-sm leading-none sm:max-w-[11rem]"
                    title={r.label}
                  >
                    {r.label}
                  </span>
                  <Input
                    className={cn(
                      'h-9 w-12 px-1.5 text-sm',
                      sum !== 100 && rows.length > 0 && 'border-amber-400 ring-1 ring-amber-200/80'
                    )}
                    inputMode="numeric"
                    value={String(pctByPid[r.parameterId] ?? 0)}
                    onChange={(e) => setPctFor(r.parameterId, r.label, e.target.value)}
                    aria-label={`Процент для ${r.label}`}
                    aria-invalid={sum !== 100 && rows.length > 0 ? true : undefined}
                  />
                  <span className="text-text-secondary pr-0.5 text-xs leading-none">%</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 shrink-0 p-0 text-sm text-red-600"
                    onClick={() => removeLinked(r.parameterId)}
                    aria-label={`Убрать ${r.label}`}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {sum !== 100 && rows.length > 0 ? (
        <div
          className="rounded-md border border-amber-400/90 bg-amber-50/95 px-2.5 py-2 text-[11px] leading-snug text-amber-950 shadow-sm"
          role="alert"
        >
          <span className="font-semibold">Состав не сходится до 100%.</span> Сейчас сумма{' '}
          <span className="font-bold tabular-nums">{sum}%</span> — поправьте доли до сохранения ТЗ
          (комплаенс, BOM, экспорт).
        </div>
      ) : null}
      <p className={cn('text-xs font-medium', sum === 100 ? 'text-emerald-700' : 'text-amber-700')}>
        Всего: {sum}%
      </p>
    </div>
  );
}

const MAX_TECH_PACK_FILES = 5;

function readFileAsDataUrlLimited(file: File, maxChars = 900_000): Promise<string | undefined> {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result ?? '');
      resolve(s.length <= maxChars ? s : undefined);
    };
    fr.onerror = () => resolve(undefined);
    fr.readAsDataURL(file);
  });
}

const MAX_VISUAL_REF_IMAGE_DATA_URL_CHARS = 900_000;
const MAX_VISUAL_REF_VIDEO_DATA_URL_CHARS = 5_000_000;
/** Референсы модели в ТЗ: до 6 файлов (общий реф — сетка 2×3). */
const MAX_VISUAL_REFERENCES = 6;

function readVisualRefFileAsDataUrl(file: File): Promise<string | undefined> {
  const t = file.type?.trim() ?? '';
  const isVideo =
    t.startsWith('video/') || (!t && /\.(mp4|m4v|webm|mov|mkv|ogv)$/i.test(file.name));
  const max = isVideo ? MAX_VISUAL_REF_VIDEO_DATA_URL_CHARS : MAX_VISUAL_REF_IMAGE_DATA_URL_CHARS;
  return readFileAsDataUrlLimited(file, max);
}

function mimeFromDataUrl(dataUrl: string): string | undefined {
  const m = /^data:([^;,]+)/i.exec(dataUrl);
  return m?.[1]?.trim() || undefined;
}

function inferMimeTypeForVisualRef(file: File, dataUrl?: string): string {
  if (file.type?.trim()) return file.type;
  const fromData = dataUrl ? mimeFromDataUrl(dataUrl) : undefined;
  if (fromData) return fromData;
  const n = file.name.toLowerCase();
  if (/\.(jpe?g)$/.test(n)) return 'image/jpeg';
  if (/\.png$/.test(n)) return 'image/png';
  if (/\.webp$/.test(n)) return 'image/webp';
  if (/\.gif$/.test(n)) return 'image/gif';
  if (/\.(mp4|m4v)$/.test(n)) return 'video/mp4';
  if (/\.webm$/.test(n)) return 'video/webm';
  if (/\.mov$/.test(n)) return 'video/quicktime';
  return 'image/jpeg';
}

function effectiveVisualRefMime(r: Workshop2Phase1VisualReference): string {
  const t = r.mimeType?.trim();
  if (t) return t;
  if (r.previewDataUrl) return mimeFromDataUrl(r.previewDataUrl) ?? '';
  return '';
}

function TechPackAttachmentsBlock({
  attachments,
  onChange,
}: {
  attachments: Workshop2Phase1TechPackAttachment[];
  onChange: (next: Workshop2Phase1TechPackAttachment[]) => void;
}) {
  const remaining = MAX_TECH_PACK_FILES - attachments.length;

  const updateRevision = (id: string, revisionNote: string) => {
    onChange(attachments.map((a) => (a.attachmentId === id ? { ...a, revisionNote } : a)));
  };

  const removeOne = (id: string) => {
    onChange(attachments.filter((a) => a.attachmentId !== id));
  };

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    e.target.value = '';
    if (!list?.length) return;
    let cur = [...attachments];
    for (let i = 0; i < list.length && cur.length < MAX_TECH_PACK_FILES; i++) {
      const file = list[i]!;
      const previewDataUrl = await readFileAsDataUrlLimited(file);
      cur.push({
        attachmentId: newUuid(),
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || undefined,
        previewDataUrl,
      });
    }
    onChange(cur.slice(0, MAX_TECH_PACK_FILES));
  };

  return (
    <div className="border-border-default space-y-2 rounded-md border bg-white p-2">
      <p className="text-text-secondary text-[10px] font-semibold uppercase">Вложения</p>
      {attachments.length > 0 ? (
        <ul className="space-y-2">
          {attachments.map((a) => (
            <li
              key={a.attachmentId}
              className="border-border-subtle flex flex-col gap-2 rounded border p-2 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="text-text-primary truncate text-sm font-medium" title={a.fileName}>
                  {a.fileName}
                </div>
                <p className="text-text-secondary text-[10px]">
                  {a.fileSize != null ? `${Math.round(a.fileSize / 1024)} KB` : ''}
                  {!a.previewDataUrl
                    ? ' · без сохранения содержимого (слишком большой или ошибка чтения)'
                    : ''}
                </p>
                <Input
                  className="h-8 text-xs"
                  placeholder="Ревизия файла (R1, v2…)"
                  value={a.revisionNote ?? ''}
                  onChange={(e) => updateRevision(a.attachmentId, e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 text-xs text-red-600"
                onClick={() => removeOne(a.attachmentId)}
              >
                Удалить
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {remaining > 0 ? (
        <div className="w-full min-w-0 space-y-1 py-2">
          <div className="border-border-default flex h-9 w-full items-center rounded-md border bg-white px-2">
            <Input
              type="file"
              multiple
              className="file:text-text-primary h-9 min-h-9 w-full cursor-pointer border-0 bg-transparent px-0 py-0 text-sm leading-9 shadow-none file:mr-3 file:inline-flex file:h-9 file:items-center file:border-0 file:bg-transparent file:px-0 file:py-0 file:text-sm file:font-medium file:leading-9"
              onChange={onPick}
            />
          </div>
          <p className="text-text-secondary text-left text-[10px]">Слотов: {remaining}.</p>
        </div>
      ) : (
        <p className="text-text-secondary text-[11px]">
          Достигнут лимит {MAX_TECH_PACK_FILES} вложений.
        </p>
      )}
    </div>
  );
}

function visualRefIsMediaPreview(r: Workshop2Phase1VisualReference): boolean {
  if (!r.previewDataUrl) return false;
  const mt = effectiveVisualRefMime(r).toLowerCase();
  return mt.startsWith('image/') || mt.startsWith('video/');
}

function visualRefSameUser(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Клик по img с object-contain: точка внутри нарисованного изображения (без полей letterbox). */
function visualRefImageClickToFocusPx(
  el: HTMLImageElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  let x = clientX - rect.left;
  let y = clientY - rect.top;
  const nw = el.naturalWidth;
  const nh = el.naturalHeight;
  if (nw <= 0 || nh <= 0) return { x, y };
  const ew = el.clientWidth;
  const eh = el.clientHeight;
  const s = Math.min(ew / nw, eh / nh);
  const dw = nw * s;
  const dh = nh * s;
  const ox = (ew - dw) / 2;
  const oy = (eh - dh) / 2;
  return {
    x: Math.min(Math.max(x, ox), ox + dw),
    y: Math.min(Math.max(y, oy), oy + dh),
  };
}

const VISUAL_REF_TAKEAWAY_LABELS: Record<Workshop2VisualRefTakeawayAspect, string> = {
  silhouette: 'Силуэт',
  color: 'Цвет',
  hardware: 'Фурнитура',
  fit: 'Посадка',
  fabric: 'Ткань',
  mood: 'Mood',
  other: 'Другое',
};

function VisualReferencesBlock({
  items,
  onChange,
  currentUserLabel,
  threadAuthorLabel,
  canonicalMainPhotoRefId,
  onSetCanonicalMainPhoto,
}: {
  items: Workshop2Phase1VisualReference[];
  onChange: (next: Workshop2Phase1VisualReference[]) => void;
  currentUserLabel: string;
  /** Сообщения этого участника — слева; остальные — справа (как в мессенджере). */
  threadAuthorLabel: string;
  canonicalMainPhotoRefId?: string;
  onSetCanonicalMainPhoto?: (refId: string | null) => void;
}) {
  const { toast } = useToast();
  const [lightboxRefId, setLightboxRefId] = useState<string | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  /** Точка масштаба в координатах элемента img (px); null = центр. */
  const [lightboxZoomFocusPx, setLightboxZoomFocusPx] = useState<{ x: number; y: number } | null>(
    null
  );
  /** После включения лупы следующий клик по фото задаёт фокус увеличения. */
  const [lightboxLoupeArmed, setLightboxLoupeArmed] = useState(false);
  const [refViewMode, setRefViewMode] = useState<'compact' | 'board'>('board');
  const [draftComment, setDraftComment] = useState('');
  const [refEditorOpen, setRefEditorOpen] = useState(false);
  const [refEditorId, setRefEditorId] = useState<string | null>(null);
  const [refEditorTitle, setRefEditorTitle] = useState('');
  const [refEditorDesc, setRefEditorDesc] = useState('');
  const [refEditorUrl, setRefEditorUrl] = useState('');
  const [refEditorTakeawayAspects, setRefEditorTakeawayAspects] = useState<
    Workshop2VisualRefTakeawayAspect[]
  >([]);
  const [refEditorTakeawayNote, setRefEditorTakeawayNote] = useState('');
  const refEditorFileInputRef = useRef<HTMLInputElement>(null);
  /** Вся тёмная зона просмотра — колесо зума (ref после открытия диалога). */
  const lightboxWheelAreaRef = useRef<HTMLDivElement>(null);

  const mediaRefs = useMemo(() => items.filter(visualRefIsMediaPreview), [items]);
  const openRefDiscussionCount = useMemo(() => {
    let n = 0;
    for (const r of items) {
      const cs = r.comments ?? [];
      if (cs.length > 0 && cs.some((c) => !c.resolved)) n++;
    }
    return n;
  }, [items]);

  const lightboxRef = lightboxRefId ? items.find((r) => r.refId === lightboxRefId) : undefined;
  const lightboxMediaIndex = lightboxRefId
    ? mediaRefs.findIndex((r) => r.refId === lightboxRefId)
    : -1;

  const openLightbox = useCallback((id: string, opts?: { zoom?: number; armLoupe?: boolean }) => {
    setLightboxRefId(id);
    setLightboxZoom(typeof opts?.zoom === 'number' ? opts.zoom : 1);
    setLightboxZoomFocusPx(null);
    setLightboxLoupeArmed(Boolean(opts?.armLoupe));
  }, []);

  const resetLightboxView = useCallback(() => {
    setLightboxZoom(1);
    setLightboxZoomFocusPx(null);
    setLightboxLoupeArmed(false);
  }, []);

  useEffect(() => {
    if (lightboxZoom <= 1) setLightboxZoomFocusPx(null);
  }, [lightboxZoom]);

  const lightboxIsImage = useMemo(() => {
    if (!lightboxRef) return false;
    if (!visualRefIsMediaPreview(lightboxRef)) return false;
    return !effectiveVisualRefMime(lightboxRef).startsWith('video/');
  }, [lightboxRef]);

  useEffect(() => {
    if (!lightboxIsImage || !lightboxRefId) return;
    let cancelled = false;
    let removeWheel: (() => void) | undefined;
    let innerRaf = 0;
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => {
        if (cancelled) return;
        const el = lightboxWheelAreaRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const zoomIn = e.deltaY < 0;
          const step = 0.1 * (e.ctrlKey || e.metaKey ? 1.35 : 1);
          setLightboxZoom((prev) => {
            const next = zoomIn ? prev + step : prev - step;
            return Math.min(5, Math.max(1, Math.round(next * 100) / 100));
          });
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        removeWheel = () => el.removeEventListener('wheel', onWheel);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(outerRaf);
      if (innerRaf) cancelAnimationFrame(innerRaf);
      removeWheel?.();
    };
  }, [lightboxIsImage, lightboxRefId]);

  const update = (id: string, patch: Partial<Workshop2Phase1VisualReference>) => {
    onChange(items.map((x) => (x.refId === id ? { ...x, ...patch } : x)));
  };
  const removeOne = (id: string) => {
    onChange(items.filter((x) => x.refId !== id));
    if (lightboxRefId === id) setLightboxRefId(null);
  };

  const swapRefOrder = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= items.length || from === to) return;
      const next = [...items];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      onChange(next);
    },
    [items, onChange]
  );

  const openRefEditorNew = () => {
    if (items.length >= MAX_VISUAL_REFERENCES) {
      toast({
        title: 'Лимит референсов',
        description: `Не больше ${MAX_VISUAL_REFERENCES} файлов на модель. Удалите лишнее или замените в карточке.`,
        variant: 'destructive',
      });
      return;
    }
    setRefEditorId(null);
    setRefEditorTitle('');
    setRefEditorDesc('');
    setRefEditorUrl('');
    setRefEditorTakeawayAspects([]);
    setRefEditorTakeawayNote('');
    if (refEditorFileInputRef.current) refEditorFileInputRef.current.value = '';
    setRefEditorOpen(true);
  };

  const openRefEditorEdit = (r: Workshop2Phase1VisualReference) => {
    setRefEditorId(r.refId);
    setRefEditorTitle(r.title ?? '');
    setRefEditorDesc(r.description ?? '');
    setRefEditorUrl(r.externalUrl ?? '');
    setRefEditorTakeawayAspects([...(r.takeawayAspects ?? [])]);
    setRefEditorTakeawayNote(r.takeawayNote ?? '');
    if (refEditorFileInputRef.current) refEditorFileInputRef.current.value = '';
    setRefEditorOpen(true);
  };

  const saveRefEditor = useCallback(async () => {
    const file = refEditorFileInputRef.current?.files?.[0];
    const id = refEditorId ?? newUuid();
    const existing = refEditorId ? items.find((x) => x.refId === refEditorId) : undefined;

    let previewDataUrl = existing?.previewDataUrl;
    let mimeType = existing?.mimeType;
    let fileName = existing?.fileName;

    if (file) {
      const ft = file.type?.trim() ?? '';
      const looksImage =
        ft.startsWith('image/') ||
        (!ft && /\.(jpe?g|png|gif|webp|bmp|heic|avif)$/i.test(file.name));
      const looksVideo =
        ft.startsWith('video/') || (!ft && /\.(mp4|m4v|webm|mov|mkv|ogv)$/i.test(file.name));
      if (!looksImage && !looksVideo) {
        toast({
          title: 'Неподдерживаемый тип',
          description: 'Выберите файл изображения или видео.',
          variant: 'destructive',
        });
        return;
      }
      const u = await readVisualRefFileAsDataUrl(file);
      if (!u) {
        toast({
          title: 'Файл не сохранён',
          description:
            'Слишком большой объём для локального досье. Сожмите файл или выберите другой.',
          variant: 'destructive',
        });
        return;
      }
      previewDataUrl = u;
      mimeType = inferMimeTypeForVisualRef(file, u);
      fileName = file.name;
    }

    const title = refEditorTitle.trim();
    const description = refEditorDesc.trim() || undefined;
    const externalUrl = refEditorUrl.trim() || undefined;

    if (!previewDataUrl && !externalUrl && !title) {
      toast({
        title: 'Заполните референс',
        description: 'Укажите название, ссылку или прикрепите фото/видео.',
        variant: 'destructive',
      });
      return;
    }

    if (!refEditorId && items.length >= MAX_VISUAL_REFERENCES) {
      toast({
        title: 'Лимит референсов',
        description: `Не больше ${MAX_VISUAL_REFERENCES} файлов на модель.`,
        variant: 'destructive',
      });
      return;
    }

    const takeawayAspects = refEditorTakeawayAspects.length
      ? [...new Set(refEditorTakeawayAspects)]
      : undefined;
    const takeawayNote = refEditorTakeawayNote.trim() || undefined;

    const nextRow: Workshop2Phase1VisualReference = {
      refId: id,
      title,
      description,
      externalUrl,
      fileName,
      mimeType,
      previewDataUrl,
      comments: existing?.comments,
      takeawayAspects,
      takeawayNote,
    };

    if (refEditorId) {
      onChange(items.map((x) => (x.refId === id ? { ...x, ...nextRow } : x)));
    } else {
      onChange([...items, nextRow]);
    }
    setRefEditorOpen(false);
  }, [
    items,
    onChange,
    refEditorDesc,
    refEditorId,
    refEditorTakeawayAspects,
    refEditorTakeawayNote,
    refEditorTitle,
    refEditorUrl,
    toast,
  ]);

  const onFile = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const ft = f.type?.trim() ?? '';
    const ok =
      ft.startsWith('image/') ||
      ft.startsWith('video/') ||
      (!ft && /\.(jpe?g|png|gif|webp|mp4|webm|mov|m4v|mkv)$/i.test(f.name));
    if (!ok) return;
    const previewDataUrl = await readVisualRefFileAsDataUrl(f);
    if (!previewDataUrl) {
      toast({
        title: 'Файл не сохранён',
        description: 'Слишком большой объём для локального досье.',
        variant: 'destructive',
      });
      return;
    }
    update(id, {
      fileName: f.name,
      mimeType: inferMimeTypeForVisualRef(f, previewDataUrl),
      previewDataUrl,
    });
  };

  const addComment = () => {
    const t = draftComment.trim();
    if (!lightboxRefId || !t) return;
    const comment: Workshop2VisualRefComment = {
      commentId: newUuid(),
      by: currentUserLabel.slice(0, 256),
      at: new Date().toISOString(),
      text: t.slice(0, 4000),
    };
    onChange(
      items.map((r) =>
        r.refId === lightboxRefId ? { ...r, comments: [...(r.comments ?? []), comment] } : r
      )
    );
    setDraftComment('');
  };

  const toggleReaction = (
    refId: string,
    commentId: string,
    type: Workshop2VisualRefCommentReactionType
  ) => {
    const by = currentUserLabel.slice(0, 256);
    onChange(
      items.map((r) => {
        if (r.refId !== refId) return r;
        return {
          ...r,
          comments: (r.comments ?? []).map((c) => {
            if (c.commentId !== commentId) return c;
            const rel = [...(c.reactions ?? [])];
            const idx = rel.findIndex((x) => visualRefSameUser(x.by, by));
            if (idx >= 0 && rel[idx]!.type === type) {
              rel.splice(idx, 1);
              return { ...c, reactions: rel };
            }
            const next = rel.filter((x) => !visualRefSameUser(x.by, by));
            next.push({ by, type });
            return { ...c, reactions: next };
          }),
        };
      })
    );
  };

  const toggleCommentResolved = (refId: string, commentId: string) => {
    onChange(
      items.map((r) => {
        if (r.refId !== refId) return r;
        return {
          ...r,
          comments: (r.comments ?? []).map((c) =>
            c.commentId === commentId ? { ...c, resolved: !c.resolved } : c
          ),
        };
      })
    );
  };

  const goPrevMedia = () => {
    if (lightboxMediaIndex <= 0) return;
    setLightboxRefId(mediaRefs[lightboxMediaIndex - 1]!.refId);
    resetLightboxView();
  };
  const goNextMedia = () => {
    if (lightboxMediaIndex < 0 || lightboxMediaIndex >= mediaRefs.length - 1) return;
    setLightboxRefId(mediaRefs[lightboxMediaIndex + 1]!.refId);
    resetLightboxView();
  };

  const sortedComments = useMemo(() => {
    const list = [...(lightboxRef?.comments ?? [])];
    list.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
    return list;
  }, [lightboxRef?.comments]);

  return (
    <div className="border-border-default space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Images className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-text-primary text-base font-semibold">Референсы</h2>
          <p className="text-text-secondary text-sm leading-snug">
            До {MAX_VISUAL_REFERENCES} файлов; в карточке — что берёте с рефа. Звезда — канон;
            комментарии — в полноэкране.
          </p>
          {openRefDiscussionCount > 0 ? (
            <p className="text-[11px] font-medium text-rose-700">
              Открытых тредов по рефам: {openRefDiscussionCount} — закройте в просмотре или отметьте
              resolved.
            </p>
          ) : null}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-text-secondary text-[10px] font-semibold uppercase tracking-wide">
            Вид сетки
          </span>
          <Button
            type="button"
            variant={refViewMode === 'board' ? 'secondary' : 'outline'}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setRefViewMode('board')}
          >
            <LucideIcons.Columns2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Общий реф (2 в ряд)
          </Button>
          <Button
            type="button"
            variant={refViewMode === 'compact' ? 'secondary' : 'outline'}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setRefViewMode('compact')}
          >
            <LucideIcons.LayoutGrid className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Компактно
          </Button>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="border-border-subtle space-y-2 border-t pt-3">
          <p className="rounded-md border border-amber-200/90 bg-amber-50/85 px-3 py-2 text-[11px] leading-snug text-amber-950">
            Без референсов не закрывается{' '}
            <span className="font-semibold">обязательный контур визуала</span> и проверка «готово к
            образцу» по этому блоку. Добавьте хотя бы одно превью или ссылку с пояснением, что
            берёте с рефа.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 text-xs"
            onClick={openRefEditorNew}
          >
            + Референс
          </Button>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div
          className={cn(
            'grid w-full min-w-0',
            refViewMode === 'board' ? 'grid-cols-2 gap-3 sm:gap-4' : 'grid-cols-5 gap-1 sm:gap-1.5'
          )}
        >
          {items.map((r, index) => {
            const hasComments = (r.comments?.length ?? 0) > 0;
            const tileAspect = refViewMode === 'board' ? 'aspect-[4/3]' : 'aspect-square';
            if (visualRefIsMediaPreview(r)) {
              const isVideo = effectiveVisualRefMime(r).startsWith('video/');
              const isMainPhoto = Boolean(
                canonicalMainPhotoRefId && canonicalMainPhotoRefId === r.refId
              );
              return (
                <div key={r.refId} className="min-w-0">
                  <div className="relative min-w-0">
                    <button
                      type="button"
                      className={cn(
                        'border-border-default ring-accent-primary/60 group relative w-full overflow-hidden rounded-md border bg-white shadow-sm outline-none transition hover:ring-2 focus-visible:ring-2',
                        tileAspect,
                        isMainPhoto && 'ring-2 ring-amber-400/80'
                      )}
                      onClick={() => openLightbox(r.refId)}
                      aria-label={`Открыть референс: ${r.title || 'без названия'}`}
                    >
                      {isVideo ? (
                        <video
                          src={r.previewDataUrl!}
                          className="h-full w-full object-cover transition group-hover:opacity-95"
                          muted
                          playsInline
                          preload="metadata"
                          aria-hidden
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element -- data URL из локального досье */
                        <img
                          src={r.previewDataUrl!}
                          alt=""
                          className="h-full w-full object-cover transition group-hover:opacity-95"
                        />
                      )}
                      {isVideo ? (
                        <span
                          className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-md"
                          aria-hidden
                        >
                          <LucideIcons.Play
                            className="h-4 w-4 translate-x-px"
                            fill="currentColor"
                          />
                        </span>
                      ) : null}
                      {hasComments ? (
                        <span
                          className="text-accent-primary ring-accent-primary/30 absolute bottom-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1"
                          title="Есть комментарии"
                          aria-hidden
                        >
                          <LucideIcons.MessageCircle className="h-3 w-3" />
                        </span>
                      ) : null}
                    </button>
                    {onSetCanonicalMainPhoto && !isVideo ? (
                      <button
                        type="button"
                        className="absolute left-6 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-white/95 text-amber-600 shadow-sm ring-1 ring-amber-200/90 transition hover:bg-amber-50"
                        title={isMainPhoto ? 'Снять «главное фото»' : 'Сделать главным фото модели'}
                        aria-label={isMainPhoto ? 'Снять главное фото' : 'Главное фото модели'}
                        aria-pressed={isMainPhoto}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSetCanonicalMainPhoto(isMainPhoto ? null : r.refId);
                        }}
                      >
                        <LucideIcons.Star
                          className={cn(
                            'h-3.5 w-3.5',
                            isMainPhoto && 'fill-amber-400 text-amber-600'
                          )}
                          aria-hidden
                        />
                      </button>
                    ) : null}
                    {!isVideo ? (
                      <button
                        type="button"
                        className="text-accent-primary ring-accent-primary/30 hover:bg-accent-primary/10 absolute right-0.5 top-0.5 z-10 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition"
                        title="Открыть окно: затем клик по фото для лупы"
                        aria-label="Открыть просмотр с режимом лупы"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openLightbox(r.refId, { armLoupe: true });
                        }}
                      >
                        <LucideIcons.ZoomIn className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    ) : null}
                    <div className="absolute bottom-0.5 right-0.5 z-10 flex gap-0.5">
                      <button
                        type="button"
                        className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                        title="Сдвинуть раньше"
                        aria-label="Сдвинуть раньше в списке"
                        disabled={index <= 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          swapRefOrder(index, index - 1);
                        }}
                      >
                        <LucideIcons.ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                        title="Сдвинуть позже"
                        aria-label="Сдвинуть позже в списке"
                        disabled={index >= items.length - 1}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          swapRefOrder(index, index + 1);
                        }}
                      >
                        <LucideIcons.ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="absolute left-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-white/95 text-red-500 shadow-sm ring-1 ring-red-200/80 transition hover:bg-red-50 hover:text-red-700"
                      title="Удалить референс"
                      aria-label="Удалить референс"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeOne(r.refId);
                      }}
                    >
                      <LucideIcons.X className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                  {(() => {
                    const asp = (r.takeawayAspects ?? [])
                      .map((a) => VISUAL_REF_TAKEAWAY_LABELS[a])
                      .join(' · ');
                    const note = r.takeawayNote?.trim() ?? '';
                    if (!asp && !note) return null;
                    return (
                      <p
                        className="text-text-secondary mt-1 line-clamp-2 text-[9px] leading-snug"
                        title={note || asp}
                      >
                        {[asp, note].filter(Boolean).join(' — ')}
                      </p>
                    );
                  })()}
                </div>
              );
            }
            return (
              <div key={r.refId} className="relative min-w-0">
                <button
                  type="button"
                  className={cn(
                    'border-border-default bg-bg-surface2/90 ring-accent-primary/40 hover:bg-bg-surface2 flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed p-1 text-center outline-none transition hover:ring-2 focus-visible:ring-2',
                    tileAspect
                  )}
                  onClick={() => openRefEditorEdit(r)}
                  aria-label={`Редактировать референс: ${r.title || 'черновик'}`}
                >
                  <LucideIcons.ImageOff className="text-text-muted h-6 w-6 shrink-0" aria-hidden />
                  <span className="text-text-secondary line-clamp-3 w-full text-[9px] font-medium leading-tight">
                    {r.title?.trim() || r.externalUrl?.trim() || 'Добавьте файл или ссылку'}
                  </span>
                </button>
                <div className="absolute bottom-0.5 right-0.5 z-10 flex gap-0.5">
                  <button
                    type="button"
                    className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                    title="Сдвинуть раньше"
                    disabled={index <= 0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      swapRefOrder(index, index - 1);
                    }}
                  >
                    <LucideIcons.ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                    title="Сдвинуть позже"
                    disabled={index >= items.length - 1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      swapRefOrder(index, index + 1);
                    }}
                  >
                    <LucideIcons.ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  className="absolute left-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-white/95 text-red-500 shadow-sm ring-1 ring-red-200/80 transition hover:bg-red-50 hover:text-red-700"
                  title="Удалить"
                  aria-label="Удалить референс"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeOne(r.refId);
                  }}
                >
                  <LucideIcons.X className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            );
          })}
          {items.length < MAX_VISUAL_REFERENCES ? (
            <button
              type="button"
              className={cn(
                'border-border-default bg-bg-surface2 text-text-secondary hover:bg-bg-surface2 flex min-h-0 w-full items-center justify-center rounded-md border border-dashed text-lg font-bold leading-none transition',
                refViewMode === 'board'
                  ? 'aspect-[4/3] max-h-[200px]'
                  : 'aspect-square max-h-[120px]'
              )}
              onClick={openRefEditorNew}
              title="Добавить референс"
              aria-label="Добавить референс"
            >
              +
            </button>
          ) : null}
        </div>
      ) : null}

      <Dialog
        open={Boolean(lightboxRef && visualRefIsMediaPreview(lightboxRef))}
        onOpenChange={(o) => {
          if (!o) {
            setLightboxRefId(null);
            setLightboxZoom(1);
            setLightboxZoomFocusPx(null);
            setLightboxLoupeArmed(false);
          }
        }}
      >
        <DialogContent
          className="flex max-h-[min(92vh,880px)] w-[min(96vw,720px)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:rounded-xl"
          aria-describedby={undefined}
        >
          {lightboxRef && lightboxRef.previewDataUrl && visualRefIsMediaPreview(lightboxRef) ? (
            <>
              <div
                ref={lightboxWheelAreaRef}
                className="relative flex min-h-0 flex-1 flex-col bg-black/90"
              >
                <button
                  type="button"
                  className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 disabled:opacity-25"
                  onClick={goPrevMedia}
                  disabled={lightboxMediaIndex <= 0}
                  aria-label="Предыдущий файл"
                >
                  <LucideIcons.ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 disabled:opacity-25"
                  onClick={goNextMedia}
                  disabled={lightboxMediaIndex < 0 || lightboxMediaIndex >= mediaRefs.length - 1}
                  aria-label="Следующий файл"
                >
                  <LucideIcons.ChevronRight className="h-6 w-6" />
                </button>
                {effectiveVisualRefMime(lightboxRef).startsWith('video/') ? (
                  <div className="flex flex-1 items-center justify-center px-10 py-4">
                    <video
                      src={lightboxRef.previewDataUrl}
                      controls
                      playsInline
                      className="max-h-[min(52vh,480px)] max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-0.5 rounded-full border border-white/20 bg-black/70 px-1.5 py-1 shadow-lg sm:gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
                        title="Уменьшить (то же, что колесо вниз)"
                        aria-label="Уменьшить масштаб"
                        onClick={() =>
                          setLightboxZoom((z) => Math.max(1, Math.round((z - 0.15) * 100) / 100))
                        }
                      >
                        <LucideIcons.Minus className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
                        title="Увеличить (то же, что колесо вверх)"
                        aria-label="Увеличить масштаб"
                        onClick={() =>
                          setLightboxZoom((z) => Math.min(5, Math.round((z + 0.15) * 100) / 100))
                        }
                      >
                        <LucideIcons.Plus className="h-4 w-4" aria-hidden />
                      </Button>
                      <span className="mx-0.5 hidden h-5 w-px bg-white/25 sm:inline" aria-hidden />
                      <Button
                        type="button"
                        variant={lightboxLoupeArmed ? 'secondary' : 'ghost'}
                        size="icon"
                        className={cn(
                          'h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white',
                          lightboxLoupeArmed &&
                            'bg-amber-500/90 text-amber-950 hover:bg-amber-400 hover:text-amber-950'
                        )}
                        title="Лупа: клики по фото — точка увеличения. Повторное нажатие — снять режим и вернуть масштаб 100%"
                        aria-label="Режим лупы"
                        aria-pressed={lightboxLoupeArmed}
                        onClick={() => {
                          if (lightboxLoupeArmed) {
                            setLightboxLoupeArmed(false);
                            setLightboxZoom(1);
                            setLightboxZoomFocusPx(null);
                          } else {
                            setLightboxLoupeArmed(true);
                          }
                        }}
                      >
                        <LucideIcons.ZoomIn className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
                        title="Сброс масштаба и лупы"
                        aria-label="Сбросить масштаб"
                        onClick={resetLightboxView}
                      >
                        <LucideIcons.Maximize2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                    {lightboxLoupeArmed ? (
                      <p className="absolute left-1/2 top-[3.25rem] z-20 max-w-[min(92vw,28rem)] -translate-x-1/2 rounded-md bg-amber-500/95 px-3 py-1.5 text-center text-[11px] font-medium leading-snug text-amber-950 shadow-md">
                        Клик по фото — откуда увеличивать. Крупнее / мельче — только кнопки − / +
                        или колесо. Повторно иконка лупы — выключить режим и сбросить масштаб.
                      </p>
                    ) : (
                      <p className="absolute left-1/2 top-[3.25rem] z-20 max-w-[min(92vw,26rem)] -translate-x-1/2 rounded-md bg-black/55 px-2.5 py-1.5 text-center text-[10px] leading-snug text-white/90">
                        <span className="font-semibold text-white">Масштаб:</span> − / + или колесо
                        по тёмной области. Лупа — точка увеличения по клику; снова лупа — сброс
                        вида.
                      </p>
                    )}
                    <div
                      className={cn(
                        'flex max-h-[min(58vh,560px)] min-h-[12rem] w-full flex-1 justify-center overflow-auto px-6 pb-4',
                        lightboxLoupeArmed ? 'pt-24' : 'pt-16',
                        lightboxLoupeArmed && 'cursor-crosshair'
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- data URL из локального досье */}
                      <img
                        src={lightboxRef.previewDataUrl}
                        alt=""
                        role="presentation"
                        className={cn(
                          'max-h-[min(52vh,500px)] max-w-full select-none object-contain transition-transform duration-200 ease-out',
                          lightboxLoupeArmed &&
                            'cursor-crosshair ring-2 ring-amber-400/80 ring-offset-2 ring-offset-black/90'
                        )}
                        style={{
                          transform: `scale(${lightboxZoom})`,
                          transformOrigin: lightboxZoomFocusPx
                            ? `${lightboxZoomFocusPx.x}px ${lightboxZoomFocusPx.y}px`
                            : 'center center',
                        }}
                        onClick={(e) => {
                          if (!lightboxLoupeArmed) return;
                          e.preventDefault();
                          const pt = visualRefImageClickToFocusPx(
                            e.currentTarget,
                            e.clientX,
                            e.clientY
                          );
                          setLightboxZoomFocusPx(pt);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="border-border-default max-h-[40vh] space-y-3 overflow-y-auto border-t bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-text-secondary text-xs font-semibold">
                    {lightboxMediaIndex + 1} / {mediaRefs.length}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-red-600"
                    onClick={() => removeOne(lightboxRef.refId)}
                  >
                    Удалить референс
                  </Button>
                </div>
                <Input
                  className="h-9 text-sm"
                  placeholder="Название"
                  value={lightboxRef.title}
                  onChange={(e) => update(lightboxRef.refId, { title: e.target.value })}
                />
                <Textarea
                  className="min-h-[56px] text-sm"
                  placeholder="Что смотреть на референсе…"
                  value={lightboxRef.description ?? ''}
                  onChange={(e) => update(lightboxRef.refId, { description: e.target.value })}
                />
                <Input
                  className="h-9 text-sm"
                  type="url"
                  placeholder="Ссылка https://…"
                  value={lightboxRef.externalUrl ?? ''}
                  onChange={(e) => update(lightboxRef.refId, { externalUrl: e.target.value })}
                />
                <div className="space-y-1">
                  <Label className="text-text-secondary text-[10px]">Заменить файл</Label>
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    className="h-9 cursor-pointer text-xs"
                    onChange={(e) => void onFile(lightboxRef.refId, e)}
                  />
                </div>

                <div className="border-border-subtle space-y-2 border-t pt-3">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-wider">
                    Обсуждение
                  </p>
                  <div className="border-border-subtle bg-bg-surface2/80 flex max-h-52 flex-col gap-2 overflow-y-auto rounded-lg border p-2">
                    {sortedComments.length === 0 ? (
                      <p className="text-text-secondary text-center text-[11px]">
                        Пока нет сообщений.
                      </p>
                    ) : (
                      sortedComments.map((c) => {
                        const isAuthorSide = visualRefSameUser(c.by, threadAuthorLabel);
                        const likes = (c.reactions ?? []).filter((x) => x.type === 'like').length;
                        const dislikes = (c.reactions ?? []).filter(
                          (x) => x.type === 'dislike'
                        ).length;
                        const mine = (c.reactions ?? []).find((x) =>
                          visualRefSameUser(x.by, currentUserLabel)
                        );
                        return (
                          <div
                            key={c.commentId}
                            className={cn(
                              'flex w-full flex-col gap-1',
                              isAuthorSide ? 'items-start' : 'items-end'
                            )}
                          >
                            <div
                              className={cn(
                                'max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm',
                                isAuthorSide
                                  ? 'text-text-primary ring-border-default rounded-tl-sm bg-white ring-1'
                                  : 'bg-accent-primary rounded-tr-sm text-white'
                              )}
                            >
                              <p>{c.text}</p>
                              <p
                                className={cn(
                                  'mt-1 text-[10px]',
                                  isAuthorSide ? 'text-text-secondary' : 'text-accent-primary/30'
                                )}
                              >
                                {c.by} ·{' '}
                                {new Date(c.at).toLocaleString('ru-RU', {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                })}
                              </p>
                            </div>
                            <div
                              className={cn(
                                'flex flex-wrap items-center gap-1 px-1',
                                isAuthorSide ? 'justify-start' : 'justify-end'
                              )}
                            >
                              <button
                                type="button"
                                className={cn(
                                  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                                  mine?.type === 'like'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
                                )}
                                onClick={() =>
                                  toggleReaction(lightboxRef.refId, c.commentId, 'like')
                                }
                              >
                                <LucideIcons.ThumbsUp className="h-3 w-3" />
                                {likes || ''}
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                                  mine?.type === 'dislike'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
                                )}
                                onClick={() =>
                                  toggleReaction(lightboxRef.refId, c.commentId, 'dislike')
                                }
                              >
                                <LucideIcons.ThumbsDown className="h-3 w-3" />
                                {dislikes || ''}
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  'inline-flex min-h-8 min-w-[4.5rem] items-center justify-center rounded-md px-2 py-1 text-[10px] font-semibold',
                                  c.resolved
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
                                )}
                                aria-pressed={c.resolved === true}
                                onClick={() =>
                                  toggleCommentResolved(lightboxRef.refId, c.commentId)
                                }
                              >
                                {c.resolved ? 'Решено' : 'Открыто'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      className="min-h-[44px] flex-1 text-sm"
                      placeholder="Сообщение…"
                      value={draftComment}
                      onChange={(e) => setDraftComment(e.target.value)}
                    />
                    <Button
                      type="button"
                      className="h-9 shrink-0 self-end text-xs"
                      onClick={addComment}
                    >
                      Отправить
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={refEditorOpen}
        onOpenChange={(o) => {
          setRefEditorOpen(o);
          if (!o) setRefEditorId(null);
        }}
      >
        <DialogContent className="max-h-[min(90vh,640px)] w-[min(96vw,440px)] max-w-none gap-0 overflow-y-auto p-0 sm:rounded-xl">
          <div className="border-border-subtle border-b p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.Images className="h-4 w-4 shrink-0" aria-hidden />
              </div>
              <DialogHeader className="m-0 flex-1 space-y-1 p-0 text-left">
                <DialogTitle>{refEditorId ? 'Референс' : 'Новый референс'}</DialogTitle>
                <DialogDescription className="text-sm leading-snug">
                  Название, пояснение и ссылка — по желанию; фото или видео дадут превью в сетке.
                  Окно поверх страницы, как раньше.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
          <div className="space-y-3 p-4 sm:p-5">
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-title" className="text-xs">
                Краткое название
              </Label>
              <Input
                id="w2-vref-editor-title"
                className="h-9 text-sm"
                placeholder="Например: референс посадки"
                value={refEditorTitle}
                onChange={(e) => setRefEditorTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-desc" className="text-xs">
                Что смотреть на референсе
              </Label>
              <Textarea
                id="w2-vref-editor-desc"
                className="min-h-[72px] text-sm"
                placeholder="Акценты силуэта, фактура, детали…"
                value={refEditorDesc}
                onChange={(e) => setRefEditorDesc(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-url" className="text-xs">
                Ссылка (необязательно)
              </Label>
              <Input
                id="w2-vref-editor-url"
                className="h-9 text-sm"
                type="url"
                inputMode="url"
                placeholder="https://…"
                value={refEditorUrl}
                onChange={(e) => setRefEditorUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Что берём с рефа</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  Object.keys(VISUAL_REF_TAKEAWAY_LABELS) as Workshop2VisualRefTakeawayAspect[]
                ).map((aspect) => {
                  const on = refEditorTakeawayAspects.includes(aspect);
                  return (
                    <label
                      key={aspect}
                      className={cn(
                        'flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition',
                        on
                          ? 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary'
                          : 'border-border-default text-text-primary bg-white'
                      )}
                    >
                      <input
                        type="checkbox"
                        className="border-border-default h-3.5 w-3.5 rounded"
                        checked={on}
                        onChange={() => {
                          setRefEditorTakeawayAspects((prev) =>
                            prev.includes(aspect)
                              ? prev.filter((x) => x !== aspect)
                              : [...prev, aspect]
                          );
                        }}
                      />
                      {VISUAL_REF_TAKEAWAY_LABELS[aspect]}
                    </label>
                  );
                })}
              </div>
              <Textarea
                className="min-h-[52px] text-sm"
                placeholder="Уточнение решения (необязательно): например «только линия плеча»"
                value={refEditorTakeawayNote}
                onChange={(e) => setRefEditorTakeawayNote(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-file" className="text-xs">
                Файл фото или видео
              </Label>
              <Input
                id="w2-vref-editor-file"
                ref={refEditorFileInputRef}
                type="file"
                accept="image/*,video/*"
                className="h-9 cursor-pointer text-xs"
              />
              {refEditorId ? (
                <p className="text-text-secondary text-[10px]">
                  Оставьте поле пустым, чтобы сохранить текущий файл.
                </p>
              ) : null}
            </div>
          </div>
          <DialogFooter className="border-border-subtle border-t px-4 py-3 sm:px-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRefEditorOpen(false)}
            >
              Отмена
            </Button>
            <Button type="button" size="sm" onClick={() => void saveRefEditor()}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SampleBaseSizeBlock({
  attribute,
  currentLeaf,
  dossier,
  setDossier,
  setDossierInternal,
  tzWriteDisabled,
  onFreeTextSide,
}: {
  attribute: AttributeCatalogAttribute;
  currentLeaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  tzWriteDisabled: boolean;
  onFreeTextSide: (attributeId: string, text: string) => void;
}) {
  const scaleRows = useMemo(() => getWorkshopSampleSizeScaleOptions(currentLeaf), [currentLeaf]);
  const dimLabels = useMemo(() => getWorkshopDimensionLabels(currentLeaf), [currentLeaf]);
  const effectiveScaleId =
    dossier.sampleSizeScaleId ?? scaleRows[0]?.key ?? defaultSizeScaleIdForLeaf(currentLeaf);
  const sizeParams = useMemo(
    () => resolveSampleBaseSizeParametersForLeaf(attribute, currentLeaf, effectiveScaleId),
    [attribute, currentLeaf, effectiveScaleId]
  );

  const sampleAssign = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
  );
  const { hbs, ft } = partitionHandbookAndFree(sampleAssign);
  const handbookParts = useMemo(
    () =>
      hbs.map((v) => ({
        parameterId: v.parameterId!,
        displayLabel: resolvedHandbookDisplayLabel(
          'sampleBaseSize',
          v.parameterId!,
          v.displayLabel
        ),
      })),
    [sampleAssign]
  );
  const freeStr = ft?.text ?? '';

  const selectOptions = useMemo(() => {
    const list = [...sizeParams];
    for (const v of hbs) {
      const pid = v.parameterId;
      if (pid && !list.some((p) => p.parameterId === pid)) {
        list.unshift({
          parameterId: pid,
          label: v.displayLabel || pid,
          sortOrder: -1,
        });
      }
    }
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [sizeParams, hbs]);

  const hiddenDimSet = useMemo(
    () => new Set(dossier.sampleBaseHiddenDimensionKeys ?? []),
    [dossier.sampleBaseHiddenDimensionKeys]
  );
  const visibleDimLabels = useMemo(
    () => dimLabels.filter((d) => !hiddenDimSet.has(d)),
    [dimLabels, hiddenDimSet]
  );

  const extras = dossier.sampleBaseExtraDimensions ?? [];

  function dimValue(pid: string, label: string, rowIndex: number) {
    return (
      dossier.sampleBasePerSizeDimensions?.[pid]?.[label] ??
      (rowIndex === 0 ? dossier.sampleBaseDimensionOverrides?.[label] : undefined) ??
      ''
    );
  }

  const rangeMode = !!dossier.sampleBaseDimensionRangeMode;
  const rangeKeys = dossier.sampleBaseDimensionRangeKeys ?? [];
  const rangeKeysSet = useMemo(() => new Set(rangeKeys), [rangeKeys]);

  const dimensionKeysAll = useMemo(
    () => [...visibleDimLabels, ...extras.map((ex) => `__extra:${ex.id}`)],
    [visibleDimLabels, extras]
  );

  const dimsWithSuggestionRange = useMemo(
    () =>
      dimensionKeysAll.filter((key) =>
        handbookParts.some((part, idx) =>
          cellLooksLikeNumericRange(dimValue(part.parameterId, key, idx))
        )
      ),
    [
      dimensionKeysAll,
      handbookParts,
      dossier.sampleBasePerSizeDimensions,
      dossier.sampleBaseDimensionOverrides,
    ]
  );

  const moqCap = dossier.passportProductionBrief?.moqTargetMaxPieces;
  const capActive = moqCap != null && Number.isFinite(moqCap) && moqCap >= 0;
  const pieceQtyMap = dossier.sampleBasePerSizePieceQty ?? {};

  const tablePieceSum = useMemo(
    () =>
      handbookParts.reduce((s, part) => {
        const v = pieceQtyMap[part.parameterId];
        if (typeof v === 'number' && Number.isFinite(v) && v > 0) return s + Math.floor(v);
        return s;
      }, 0),
    [handbookParts, pieceQtyMap]
  );

  const maxPiecesForPid = (pid: string) => {
    if (!capActive || moqCap == null) return undefined;
    const others = handbookParts.reduce((s, part) => {
      if (part.parameterId === pid) return s;
      const v = pieceQtyMap[part.parameterId];
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) return s + Math.floor(v);
      return s;
    }, 0);
    return Math.max(0, Math.floor(moqCap) - others);
  };

  const patchPieceQty = (pid: string, raw: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const assign = p.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs } = partitionHandbookAndFree(assign);
      const cap = p.passportProductionBrief?.moqTargetMaxPieces;
      const digits = raw.replace(/\D/g, '');
      let v = digits === '' ? 0 : Math.max(0, Math.floor(Number(digits)));
      const prev = { ...(p.sampleBasePerSizePieceQty ?? {}) };
      let others = 0;
      for (const hb of hbs) {
        const opid = hb.parameterId!;
        if (opid === pid) continue;
        const n = prev[opid];
        if (typeof n === 'number' && Number.isFinite(n) && n > 0) others += Math.floor(n);
      }
      if (cap != null && Number.isFinite(cap) && cap >= 0) {
        v = Math.min(v, Math.max(0, Math.floor(cap) - others));
      }
      const next = { ...prev };
      if (v === 0) delete next[pid];
      else next[pid] = v;
      return {
        ...p,
        sampleBasePerSizePieceQty: Object.keys(next).length ? next : undefined,
      };
    });
  };

  const enableRangeForDimensionKey = (canon: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const keys = [...new Set([...(p.sampleBaseDimensionRangeKeys ?? []), canon])];
      const nextRanges = { ...(p.sampleBasePerSizeDimensionRanges ?? {}) };
      const nextPer: Record<string, Record<string, string>> = {
        ...(p.sampleBasePerSizeDimensions ?? {}),
      };
      for (let idx = 0; idx < handbookParts.length; idx++) {
        const part = handbookParts[idx]!;
        const pid = part.parameterId;
        const raw =
          p.sampleBasePerSizeDimensions?.[pid]?.[canon] ??
          (idx === 0 ? p.sampleBaseDimensionOverrides?.[canon] : undefined) ??
          '';
        const parsed = parseDimensionValueToRange(String(raw));
        const cell: Workshop2Phase1DimensionRangeCell = { min: parsed.min, max: parsed.max };
        nextRanges[pid] = { ...(nextRanges[pid] ?? {}), [canon]: cell };
        nextPer[pid] = {
          ...(nextPer[pid] ?? {}),
          [canon]: formatRangeToDimensionCell(cell.min, cell.max),
        };
      }
      return {
        ...p,
        sampleBaseDimensionRangeKeys: keys,
        sampleBasePerSizeDimensionRanges: nextRanges,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
      };
    });
  };

  const disableRangeForDimensionKey = (canon: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const keys = (p.sampleBaseDimensionRangeKeys ?? []).filter((k) => k !== canon);
      const nextRanges: Record<string, Record<string, Workshop2Phase1DimensionRangeCell>> = {
        ...(p.sampleBasePerSizeDimensionRanges ?? {}),
      };
      const nextPer: Record<string, Record<string, string>> = {
        ...(p.sampleBasePerSizeDimensions ?? {}),
      };
      for (const part of handbookParts) {
        const pid = part.parameterId;
        const cell = nextRanges[pid]?.[canon];
        if (cell) {
          nextPer[pid] = {
            ...(nextPer[pid] ?? {}),
            [canon]: formatRangeToDimensionCell(cell.min, cell.max),
          };
        }
        if (nextRanges[pid]) {
          const { [canon]: _removed, ...rest } = nextRanges[pid]!;
          if (Object.keys(rest).length) nextRanges[pid] = rest;
          else delete nextRanges[pid];
        }
      }
      return {
        ...p,
        sampleBaseDimensionRangeKeys: keys.length ? keys : undefined,
        sampleBasePerSizeDimensionRanges: Object.keys(nextRanges).length ? nextRanges : undefined,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
      };
    });
  };

  const addAllSuggestedRangeDimensions = () => {
    setDossier((p: Workshop2DossierPhase1) => {
      let next = p;
      for (const k of dimsWithSuggestionRange) {
        const curKeys = new Set(next.sampleBaseDimensionRangeKeys ?? []);
        if (curKeys.has(k)) continue;
        const keys = [...curKeys, k];
        const nextRanges = { ...(next.sampleBasePerSizeDimensionRanges ?? {}) };
        const nextPer: Record<string, Record<string, string>> = {
          ...(next.sampleBasePerSizeDimensions ?? {}),
        };
        for (let idx = 0; idx < handbookParts.length; idx++) {
          const part = handbookParts[idx]!;
          const pid = part.parameterId;
          const raw =
            next.sampleBasePerSizeDimensions?.[pid]?.[k] ??
            (idx === 0 ? next.sampleBaseDimensionOverrides?.[k] : undefined) ??
            '';
          const parsed = parseDimensionValueToRange(String(raw));
          const cell: Workshop2Phase1DimensionRangeCell = { min: parsed.min, max: parsed.max };
          nextRanges[pid] = { ...(nextRanges[pid] ?? {}), [k]: cell };
          nextPer[pid] = {
            ...(nextPer[pid] ?? {}),
            [k]: formatRangeToDimensionCell(cell.min, cell.max),
          };
        }
        next = {
          ...next,
          sampleBaseDimensionRangeKeys: keys,
          sampleBasePerSizeDimensionRanges: nextRanges,
          sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
        };
      }
      return next;
    });
  };

  useEffect(() => {
    if (tzWriteDisabled) return;
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const hidden = new Set(prev.sampleBaseHiddenDimensionKeys ?? []);
      const a = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs: list } = partitionHandbookAndFree(a);
      if (!list.length) return prev;
      let nextPer = { ...prev.sampleBasePerSizeDimensions };
      let changed = false;
      for (const v of list) {
        const pid = v.parameterId!;
        const sug = getSuggestedDimensionCmForParameterId(pid, dimLabels);
        if (!sug) continue;
        const row = { ...(nextPer[pid] ?? {}) };
        let rowTouch = false;
        for (const [k, val] of Object.entries(sug)) {
          if (hidden.has(k)) continue;
          if (!row[k]) {
            row[k] = val;
            rowTouch = true;
          }
        }
        if (rowTouch) {
          nextPer[pid] = row;
          changed = true;
        }
      }
      return changed ? { ...prev, sampleBasePerSizeDimensions: nextPer } : prev;
    });
  }, [dossier.assignments, dimLabels, tzWriteDisabled]);

  useEffect(() => {
    if (tzWriteDisabled) return;
    if (currentLeaf.l1Name !== 'Сумки') return;
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const bagA = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'bag-type'
      );
      const btPid = bagA?.values.find(
        (v) => v.valueSource === 'handbook_parameter' && v.parameterId
      )?.parameterId;
      const sug = getSuggestedBagDimensionsForBagTypeParameterId(btPid);
      if (!sug || !Object.keys(sug).length) return prev;
      const hidden = new Set(prev.sampleBaseHiddenDimensionKeys ?? []);
      const a = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs: list } = partitionHandbookAndFree(a);
      if (!list.length) return prev;
      let nextPer = { ...prev.sampleBasePerSizeDimensions };
      let changed = false;
      for (const v of list) {
        const pid = v.parameterId!;
        const row = { ...(nextPer[pid] ?? {}) };
        let rowTouch = false;
        for (const [k, val] of Object.entries(sug)) {
          if (!dimLabels.includes(k)) continue;
          if (hidden.has(k)) continue;
          if (!row[k]) {
            row[k] = val;
            rowTouch = true;
          }
        }
        if (rowTouch) {
          nextPer[pid] = row;
          changed = true;
        }
      }
      return changed ? { ...prev, sampleBasePerSizeDimensions: nextPer } : prev;
    });
  }, [currentLeaf.l1Name, dossier.assignments, dimLabels, tzWriteDisabled]);

  const selectCls =
    'h-9 min-w-0 rounded-md border border-border-default bg-white px-2 text-sm text-text-primary';

  const extraDimStorageKey = (id: string) => `__extra:${id}`;

  const addExtraDimension = () => {
    setDossier((p: Workshop2DossierPhase1) => ({
      ...p,
      sampleBaseExtraDimensions: [
        ...(p.sampleBaseExtraDimensions ?? []),
        { id: newUuid(), label: '' },
      ],
    }));
  };

  const removeExtraDimension = (id: string) => {
    const storageKey = extraDimStorageKey(id);
    setDossier((p: Workshop2DossierPhase1) => {
      const raw = p.sampleBasePerSizeDimensions;
      const nextExtras = (p.sampleBaseExtraDimensions ?? []).filter((x) => x.id !== id);
      const nextRangeKeys = (p.sampleBaseDimensionRangeKeys ?? []).filter((k) => k !== storageKey);
      const nextRangesRaw = { ...(p.sampleBasePerSizeDimensionRanges ?? {}) };
      for (const pid of Object.keys(nextRangesRaw)) {
        const rec = nextRangesRaw[pid];
        if (!rec?.[storageKey]) continue;
        const { [storageKey]: _r, ...restR } = rec;
        if (Object.keys(restR).length) nextRangesRaw[pid] = restR;
        else delete nextRangesRaw[pid];
      }
      if (!raw) {
        return {
          ...p,
          sampleBaseExtraDimensions: nextExtras.length ? nextExtras : undefined,
          sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
          sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
            ? nextRangesRaw
            : undefined,
        };
      }
      const nextPer: Record<string, Record<string, string>> = {};
      for (const [pid, rec] of Object.entries(raw) as [string, Record<string, string>][]) {
        const copy = { ...rec };
        delete copy[storageKey];
        nextPer[pid] = copy;
      }
      return {
        ...p,
        sampleBaseExtraDimensions: nextExtras.length ? nextExtras : undefined,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
        sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
        sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
          ? nextRangesRaw
          : undefined,
      };
    });
  };

  const removeStandardDimension = (canonKey: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const nextHidden = [...new Set([...(p.sampleBaseHiddenDimensionKeys ?? []), canonKey])];
      const raw = p.sampleBasePerSizeDimensions;
      const nextOv = { ...(p.sampleBaseDimensionLabelOverrides ?? {}) };
      delete nextOv[canonKey];
      const nextRangeKeys = (p.sampleBaseDimensionRangeKeys ?? []).filter((k) => k !== canonKey);
      const nextRangesRaw = { ...(p.sampleBasePerSizeDimensionRanges ?? {}) };
      for (const pid of Object.keys(nextRangesRaw)) {
        const rec = nextRangesRaw[pid];
        if (!rec?.[canonKey]) continue;
        const { [canonKey]: _r, ...restR } = rec;
        if (Object.keys(restR).length) nextRangesRaw[pid] = restR;
        else delete nextRangesRaw[pid];
      }
      if (!raw) {
        return {
          ...p,
          sampleBaseHiddenDimensionKeys: nextHidden,
          sampleBaseDimensionLabelOverrides: Object.keys(nextOv).length > 0 ? nextOv : undefined,
          sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
          sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
            ? nextRangesRaw
            : undefined,
        };
      }
      const nextPer: Record<string, Record<string, string>> = {};
      for (const [pid, rec] of Object.entries(raw) as [string, Record<string, string>][]) {
        const copy = { ...rec };
        delete copy[canonKey];
        nextPer[pid] = copy;
      }
      return {
        ...p,
        sampleBaseHiddenDimensionKeys: nextHidden,
        sampleBaseDimensionLabelOverrides: Object.keys(nextOv).length > 0 ? nextOv : undefined,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
        sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
        sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
          ? nextRangesRaw
          : undefined,
      };
    });
  };

  const setStandardLabelOverride = (canonKey: string, display: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const next = { ...(p.sampleBaseDimensionLabelOverrides ?? {}) };
      const t = display.trim();
      if (!t || t === canonKey) delete next[canonKey];
      else next[canonKey] = t;
      return {
        ...p,
        sampleBaseDimensionLabelOverrides: Object.keys(next).length ? next : undefined,
      };
    });
  };

  const optList = selectOptions.map((p) => ({ parameterId: p.parameterId, label: p.label }));

  const sizeLineForPart = (part: { parameterId: string; displayLabel: string }) =>
    selectOptions.find((o) => o.parameterId === part.parameterId)?.label ?? part.displayLabel;

  const dimensionKeyLabel = (k: string) => {
    if (k.startsWith('__extra:')) {
      const id = k.slice('__extra:'.length);
      return extras.find((x) => x.id === id)?.label?.trim() || 'Доп. мерка';
    }
    return dossier.sampleBaseDimensionLabelOverrides?.[k] ?? k;
  };

  function rangeForCell(pid: string, canon: string, rowIndex: number) {
    const stored = dossier.sampleBasePerSizeDimensionRanges?.[pid]?.[canon];
    if (stored) {
      return {
        min: stored.min,
        max: stored.max,
        nominal: stored.nominal ?? '',
      };
    }
    const parsed = parseDimensionValueToRange(dimValue(pid, canon, rowIndex));
    return { ...parsed, nominal: '' };
  }

  const patchRangeCell = (
    pid: string,
    canon: string,
    field: 'min' | 'max' | 'nominal',
    v: string
  ) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const rowIndex = handbookParts.findIndex((x) => x.parameterId === pid);
      const curFlat =
        p.sampleBasePerSizeDimensions?.[pid]?.[canon] ??
        (rowIndex === 0 ? p.sampleBaseDimensionOverrides?.[canon] : undefined) ??
        '';
      const existing = p.sampleBasePerSizeDimensionRanges?.[pid]?.[canon];
      const base = existing ?? parseDimensionValueToRange(String(curFlat));
      const next: Workshop2Phase1DimensionRangeCell = {
        min: field === 'min' ? v : base.min,
        max: field === 'max' ? v : base.max,
      };
      if (field === 'nominal') {
        const t = v.trim();
        if (t) next.nominal = t;
      } else if (existing?.nominal?.trim()) {
        next.nominal = existing.nominal;
      }
      return {
        ...p,
        sampleBasePerSizeDimensionRanges: {
          ...p.sampleBasePerSizeDimensionRanges,
          [pid]: {
            ...(p.sampleBasePerSizeDimensionRanges?.[pid] ?? {}),
            [canon]: next,
          },
        },
        sampleBasePerSizeDimensions: {
          ...p.sampleBasePerSizeDimensions,
          [pid]: {
            ...(p.sampleBasePerSizeDimensions?.[pid] ?? {}),
            [canon]: formatRangeToDimensionCell(next.min, next.max),
          },
        },
      };
    });
  };

  const fillSuggestionsForPart = (part: { parameterId: string; displayLabel: string }) => {
    const suggested = getSuggestedDimensionCmForParameterId(part.parameterId, visibleDimLabels);
    if (!suggested) return;
    setDossier((p: Workshop2DossierPhase1) => {
      const nextPer = { ...(p.sampleBasePerSizeDimensions ?? {}) };
      nextPer[part.parameterId] = { ...(nextPer[part.parameterId] ?? {}), ...suggested };
      return { ...p, sampleBasePerSizeDimensions: nextPer };
    });
  };

  const fillAllSuggestions = () => {
    setDossier((p: Workshop2DossierPhase1) => {
      const nextPer = { ...(p.sampleBasePerSizeDimensions ?? {}) };
      for (const part of handbookParts) {
        const suggested = getSuggestedDimensionCmForParameterId(part.parameterId, visibleDimLabels);
        if (suggested) {
          nextPer[part.parameterId] = { ...(nextPer[part.parameterId] ?? {}), ...suggested };
        }
      }
      return { ...p, sampleBasePerSizeDimensions: nextPer };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <Label className="text-text-muted text-[10px] font-bold uppercase">Шкала размеров</Label>
          <select
            className={cn(selectCls, 'h-9 w-full')}
            value={effectiveScaleId}
            onChange={(e) => {
              const sid = e.target.value;
              setDossier((prev: Workshop2DossierPhase1) => {
                const next: Workshop2DossierPhase1 = { ...prev, sampleSizeScaleId: sid };
                const params = resolveSampleBaseSizeParametersForLeaf(attribute, currentLeaf, sid);
                const allow = new Set(params.map((p) => p.parameterId));
                const a = prev.assignments.find(
                  (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
                );
                const { hbs: hbList, ft: ftt } = partitionHandbookAndFree(a);
                if (!hbList.length) return next;
                const keep = hbList.filter((hb) => hb.parameterId && allow.has(hb.parameterId));
                if (keep.length === hbList.length) return next;
                const parts = keep.map((v) => ({
                  parameterId: v.parameterId!,
                  displayLabel: v.displayLabel ?? '',
                }));
                const cap = next.passportProductionBrief?.moqTargetMaxPieces;
                const capped =
                  cap != null && Number.isFinite(cap) && cap >= 0
                    ? parts.slice(0, Math.floor(cap))
                    : parts;
                return syncSampleBaseSizePartsAndPruneDims(next, capped, ftt?.text ?? '');
              });
            }}
          >
            {scaleRows.length ? (
              scaleRows.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))
            ) : (
              <option value={defaultSizeScaleIdForLeaf(currentLeaf)}>—</option>
            )}
          </select>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Label className="text-text-muted text-[10px] font-bold uppercase">
            Свой размер (через запятую)
          </Label>
          <Input
            className="h-9 w-full min-w-0 text-sm"
            value={freeStr}
            onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
            placeholder={attribute.uiPlaceholder ?? 'S, M, L...'}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-text-muted text-[10px] font-bold uppercase">
          Выбор из справочника
        </Label>
        <HandbookMultiSelectPopover
          options={optList}
          parts={handbookParts}
          catalogAttributeId="sampleBaseSize"
          maxSelections={capActive ? moqCap : undefined}
          onPartsChange={(nextParts) => {
            setDossier((prev: Workshop2DossierPhase1) => {
              const a = prev.assignments.find(
                (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
              );
              const ftText = partitionHandbookAndFree(a).ft?.text ?? '';
              const cap = prev.passportProductionBrief?.moqTargetMaxPieces;
              const trimmed =
                cap != null && Number.isFinite(cap) && cap >= 0
                  ? nextParts.slice(0, Math.floor(cap))
                  : nextParts;
              return syncSampleBaseSizePartsAndPruneDims(prev, trimmed, ftText);
            });
          }}
        />
      </div>

      {handbookParts.length > 0 ? (
        <p className="border-border-subtle bg-bg-surface2/90 text-text-secondary rounded-lg border px-3 py-2 text-[11px] leading-snug">
          Нужны мерки вне стандартного справочника (объём капюшона, шаг плеча бренда, длина по
          боковому шву и т.п.)? В таблице ниже нажмите «+» справа от заголовков — добавьте колонку,
          задайте подпись и заполните значения по размерам. Лишние стандартные мерки можно скрыть
          крестиком на колонке.
        </p>
      ) : null}

      {handbookParts.length > 0 && (visibleDimLabels.length > 0 || extras.length > 0) ? (
        <div className="border-border-default min-w-0 max-w-full rounded-xl border bg-white p-1 shadow-sm">
          {capActive && tablePieceSum > moqCap! ? (
            <p className="mx-1 mb-2 rounded-md border border-amber-200 bg-amber-50/90 px-2 py-1.5 text-[11px] text-amber-900">
              Сумма «Кол-во, шт» ({tablePieceSum}) больше количества образцов в паспорте ({moqCap}).
              Уменьшите количества или увеличьте лимит.
            </p>
          ) : null}
          <div className="border-border-subtle bg-bg-surface2/90 text-text-primary mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-xs">
            <label className="text-text-primary flex cursor-pointer items-center gap-2 font-medium">
              <Checkbox
                checked={rangeMode}
                onCheckedChange={(v) =>
                  setDossier((p: Workshop2DossierPhase1) => ({
                    ...p,
                    sampleBaseDimensionRangeMode: v === true ? true : undefined,
                  }))
                }
              />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Диапазоны (мин–макс)
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10 h-7 bg-white text-[10px] shadow-sm"
                onClick={fillAllSuggestions}
              >
                <LucideIcons.Sparkles className="mr-1 h-3 w-3" />
                Заполнить по справочнику (EU)
              </Button>
              {rangeMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 shrink-0 bg-white text-[10px] shadow-sm"
                  disabled={dimsWithSuggestionRange.every((k) => rangeKeysSet.has(k))}
                  onClick={() => addAllSuggestedRangeDimensions()}
                >
                  <LucideIcons.Sparkles className="text-accent-primary mr-1 h-3 w-3" />
                  Все мерки с «число–число»
                </Button>
              )}
            </div>
          </div>
          <div className="max-w-full overflow-x-auto pb-1">
            <div className="min-w-max space-y-3 px-2">
              <div className="border-border-subtle flex flex-nowrap items-end gap-x-2 gap-y-2 border-b pb-2">
                <div className="min-w-[5rem] max-w-[9rem] shrink-0 pb-2" aria-hidden>
                  <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Размер
                  </span>
                </div>
                {visibleDimLabels.map((canon) => {
                  const display = dossier.sampleBaseDimensionLabelOverrides?.[canon] ?? canon;
                  const colRange = rangeMode && rangeKeysSet.has(canon);
                  return (
                    <div
                      key={`hdr-${canon}`}
                      className={cn('relative shrink-0', colRange ? 'w-[8.25rem]' : 'w-[5rem]')}
                    >
                      <button
                        type="button"
                        className="absolute -right-1 -top-1 z-[1] flex h-5 w-5 items-center justify-center rounded text-base leading-none text-red-600 hover:bg-red-50"
                        aria-label={`Удалить колонку «${canon}»`}
                        onClick={() => removeStandardDimension(canon)}
                      >
                        ×
                      </button>
                      <Input
                        className="text-text-secondary h-8 w-full px-1 pr-4 text-[9px] font-medium leading-tight"
                        value={display}
                        onChange={(e) => setStandardLabelOverride(canon, e.target.value)}
                        aria-label="Подпись мерки"
                      />
                      {rangeMode ? (
                        <label className="mt-1 flex cursor-pointer items-center gap-1">
                          <Checkbox
                            checked={rangeKeysSet.has(canon)}
                            onCheckedChange={(c) => {
                              if (c === true) enableRangeForDimensionKey(canon);
                              else disableRangeForDimensionKey(canon);
                            }}
                            className="h-3 w-3"
                          />
                          <span className="text-text-secondary text-[8px] leading-none">
                            мин–макс
                          </span>
                        </label>
                      ) : null}
                    </div>
                  );
                })}
                {extras.map((ex) => {
                  const ek = extraDimStorageKey(ex.id);
                  const colRange = rangeMode && rangeKeysSet.has(ek);
                  return (
                    <div
                      key={ex.id}
                      className={cn('relative shrink-0', colRange ? 'w-[8.25rem]' : 'w-[5.5rem]')}
                    >
                      <button
                        type="button"
                        className="absolute -right-1 -top-1 z-[1] flex h-5 w-5 items-center justify-center rounded text-base leading-none text-red-600 hover:bg-red-50"
                        aria-label="Удалить мерку"
                        onClick={() => removeExtraDimension(ex.id)}
                      >
                        ×
                      </button>
                      <Input
                        className="text-text-secondary h-8 w-full px-1 pr-4 text-[9px] font-medium leading-tight"
                        value={ex.label}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            sampleBaseExtraDimensions: (p.sampleBaseExtraDimensions ?? []).map(
                              (x) => (x.id === ex.id ? { ...x, label: v } : x)
                            ),
                          }));
                        }}
                        aria-label="Подпись мерки"
                      />
                      {rangeMode ? (
                        <label className="mt-1 flex cursor-pointer items-center gap-1">
                          <Checkbox
                            checked={rangeKeysSet.has(ek)}
                            onCheckedChange={(c) => {
                              if (c === true) enableRangeForDimensionKey(ek);
                              else disableRangeForDimensionKey(ek);
                            }}
                            className="h-3 w-3"
                          />
                          <span className="text-text-secondary text-[8px] leading-none">
                            мин–макс
                          </span>
                        </label>
                      ) : null}
                    </div>
                  );
                })}
                <div className="w-[4.5rem] shrink-0 pb-2">
                  <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Кол-во, шт
                  </span>
                </div>
                <div className="w-9 shrink-0" aria-hidden />
              </div>
              {handbookParts.map((part, idx) => (
                <div
                  key={part.parameterId}
                  className="border-border-subtle flex flex-nowrap items-center gap-x-2 gap-y-2 border-b pb-3 last:border-0 last:pb-0"
                  aria-label={sizeLineForPart(part)}
                >
                  <div className="flex min-h-9 min-w-[4.5rem] max-w-[9rem] shrink-0 items-center">
                    <span className="text-text-primary text-sm font-medium leading-snug">
                      {sizeLineForPart(part)}
                    </span>
                  </div>
                  {visibleDimLabels.map((canon) => {
                    const aria = dossier.sampleBaseDimensionLabelOverrides?.[canon] ?? canon;
                    const useRange = rangeMode && rangeKeysSet.has(canon);
                    const rc = rangeForCell(part.parameterId, canon, idx);
                    return (
                      <div
                        key={`${part.parameterId}-${canon}`}
                        className={cn('shrink-0', useRange ? 'w-[8.25rem]' : 'w-[5rem]')}
                      >
                        {useRange ? (
                          <div className="flex flex-col gap-0.5">
                            <Input
                              className="h-8 px-1.5 text-[10px]"
                              inputMode="decimal"
                              placeholder="мин"
                              title={`${aria} — мин`}
                              aria-label={`${aria}, мин`}
                              value={rc.min}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, canon, 'min', e.target.value)
                              }
                            />
                            <Input
                              className="h-8 px-1.5 text-[10px]"
                              inputMode="decimal"
                              placeholder="макс"
                              title={`${aria} — макс`}
                              aria-label={`${aria}, макс`}
                              value={rc.max}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, canon, 'max', e.target.value)
                              }
                            />
                            <Input
                              className="h-8 px-1.5 text-[10px]"
                              inputMode="text"
                              placeholder="номинал"
                              title={`${aria} — номинал для артикула`}
                              aria-label={`${aria}, номинал для артикула`}
                              value={rc.nominal}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, canon, 'nominal', e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-text-secondary h-6 px-1 text-[9px]"
                              disabled={!midpointNominalSuggestion(rc.min, rc.max)}
                              onClick={() => {
                                const m = midpointNominalSuggestion(rc.min, rc.max);
                                if (m) patchRangeCell(part.parameterId, canon, 'nominal', m);
                              }}
                            >
                              середина
                            </Button>
                          </div>
                        ) : (
                          <Input
                            className="h-9 px-2 text-xs"
                            inputMode="decimal"
                            placeholder="см"
                            title={aria}
                            aria-label={aria}
                            value={dimValue(part.parameterId, canon, idx)}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDossier((p: Workshop2DossierPhase1) => ({
                                ...p,
                                sampleBasePerSizeDimensions: {
                                  ...p.sampleBasePerSizeDimensions,
                                  [part.parameterId]: {
                                    ...(p.sampleBasePerSizeDimensions?.[part.parameterId] ?? {}),
                                    [canon]: v,
                                  },
                                },
                              }));
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                  {extras.map((ex) => {
                    const ek = extraDimStorageKey(ex.id);
                    const useRange = rangeMode && rangeKeysSet.has(ek);
                    const rc = rangeForCell(part.parameterId, ek, idx);
                    const ariaEx = ex.label.trim() || 'Доп. мерка';
                    return (
                      <div
                        key={`${part.parameterId}-${ex.id}`}
                        className={cn('shrink-0', useRange ? 'w-[8.25rem]' : 'w-[5.5rem]')}
                      >
                        {useRange ? (
                          <div className="flex flex-col gap-0.5">
                            <Input
                              className="h-8 px-1.5 text-[10px]"
                              inputMode="decimal"
                              placeholder="мин"
                              aria-label={`${ariaEx}, мин`}
                              value={rc.min}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, ek, 'min', e.target.value)
                              }
                            />
                            <Input
                              className="h-8 px-1.5 text-[10px]"
                              inputMode="decimal"
                              placeholder="макс"
                              aria-label={`${ariaEx}, макс`}
                              value={rc.max}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, ek, 'max', e.target.value)
                              }
                            />
                            <Input
                              className="h-8 px-1.5 text-[10px]"
                              inputMode="text"
                              placeholder="номинал"
                              aria-label={`${ariaEx}, номинал для артикула`}
                              value={rc.nominal}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, ek, 'nominal', e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-text-secondary h-6 px-1 text-[9px]"
                              disabled={!midpointNominalSuggestion(rc.min, rc.max)}
                              onClick={() => {
                                const m = midpointNominalSuggestion(rc.min, rc.max);
                                if (m) patchRangeCell(part.parameterId, ek, 'nominal', m);
                              }}
                            >
                              середина
                            </Button>
                          </div>
                        ) : (
                          <Input
                            className="h-9 px-2 text-xs"
                            inputMode="decimal"
                            placeholder="см"
                            aria-label={ariaEx}
                            value={dimValue(part.parameterId, ek, idx)}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDossier((p: Workshop2DossierPhase1) => ({
                                ...p,
                                sampleBasePerSizeDimensions: {
                                  ...p.sampleBasePerSizeDimensions,
                                  [part.parameterId]: {
                                    ...(p.sampleBasePerSizeDimensions?.[part.parameterId] ?? {}),
                                    [ek]: v,
                                  },
                                },
                              }));
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                  <div className="w-[4.5rem] shrink-0">
                    <Input
                      className="h-9 px-1.5 text-center text-xs"
                      inputMode="numeric"
                      placeholder="—"
                      aria-label={`Количество шт, ${sizeLineForPart(part)}`}
                      title={
                        capActive
                          ? `Максимум для этой строки: ${maxPiecesForPid(part.parameterId) ?? 0}`
                          : 'Лимит задаётся в паспорте: «Лимит шт по размерам»'
                      }
                      value={
                        pieceQtyMap[part.parameterId] != null && pieceQtyMap[part.parameterId]! > 0
                          ? String(pieceQtyMap[part.parameterId])
                          : ''
                      }
                      onChange={(e) => patchPieceQty(part.parameterId, e.target.value)}
                      min={0}
                      max={maxPiecesForPid(part.parameterId)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 shrink-0 p-0 text-lg font-medium leading-none"
                    onClick={addExtraDimension}
                    aria-label="Добавить мерку"
                  >
                    +
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AttributeRowEditor({
  attribute,
  dossier,
  allowMultiHandbook,
  onSetHandbookParameters,
  onFreeTextSide,
  patchColor,
}: {
  attribute: AttributeCatalogAttribute;
  dossier: Workshop2DossierPhase1;
  allowMultiHandbook: boolean;
  onSetHandbookParameters: (
    attributeId: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  patchColor?: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
}) {
  const handbookParts = useMemo(() => {
    const assign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
    );
    const { hbs: list } = partitionHandbookAndFree(assign);
    const aid = attribute.attributeId;
    return list.map((v) => ({
      parameterId: v.parameterId!,
      displayLabel: resolvedHandbookDisplayLabel(aid, v.parameterId!, v.displayLabel),
    }));
  }, [dossier.assignments, attribute.attributeId]);

  const sortedParams = useMemo(
    () => [...attribute.parameters].sort((x, y) => x.sortOrder - y.sortOrder),
    [attribute.parameters]
  );

  const selectOptions = useMemo(() => {
    const assign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
    );
    const { hbs: hbList } = partitionHandbookAndFree(assign);
    const list = [...sortedParams];
    for (const v of hbList) {
      const pid = v.parameterId;
      if (pid && !list.some((p) => p.parameterId === pid)) {
        list.unshift({
          parameterId: pid,
          label: v.displayLabel || pid,
          sortOrder: -1,
        });
      }
    }
    return list;
  }, [sortedParams, dossier.assignments, attribute.attributeId]);

  if (attribute.attributeId === 'color' && patchColor) {
    return <ColorAttributeRow attribute={attribute} dossier={dossier} patchColor={patchColor} />;
  }

  const a = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
  );
  const { hbs, ft } = partitionHandbookAndFree(a);
  const freeStr = ft?.text ?? '';

  if (attribute.type === 'text') {
    return (
      <Input
        className="h-9 w-full min-w-0 text-sm"
        value={freeStr}
        onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
        placeholder={attribute.uiPlaceholder ?? 'Свой текст'}
      />
    );
  }

  if (allowMultiHandbook) {
    const optList = selectOptions.map((p) => ({ parameterId: p.parameterId, label: p.label }));
    return (
      <div className="grid gap-2 sm:grid-cols-2 sm:items-start sm:gap-3">
        <HandbookMultiSelectPopover
          options={optList}
          parts={handbookParts}
          catalogAttributeId={attribute.attributeId}
          onPartsChange={(parts) => onSetHandbookParameters(attribute.attributeId, parts)}
        />
        <Input
          className="h-9 min-w-0 text-sm"
          value={freeStr}
          onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
          placeholder={attribute.uiPlaceholder ?? 'Свой текст'}
        />
      </div>
    );
  }

  const currentPid = hbs[0]?.parameterId ?? '';

  return (
    <div className="grid gap-2 sm:grid-cols-2 sm:items-start">
      <select
        className="border-border-default text-text-primary h-9 w-full min-w-0 rounded-md border bg-white px-2 text-sm"
        value={currentPid}
        onChange={(e) => {
          const pid = e.target.value;
          const p = attribute.parameters.find((x) => x.parameterId === pid);
          onSetHandbookParameters(
            attribute.attributeId,
            pid && p ? [{ parameterId: pid, displayLabel: p.label }] : []
          );
        }}
      >
        <option value="">Не выбрано из справочника</option>
        {selectOptions.map((p) => (
          <option key={p.parameterId} value={p.parameterId}>
            {p.label}
          </option>
        ))}
      </select>
      <Input
        className="h-9 min-w-0 text-sm"
        value={freeStr}
        onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
        placeholder={attribute.uiPlaceholder ?? 'Свой текст'}
      />
    </div>
  );
}

function ColorAttributeRow({
  attribute,
  dossier,
  patchColor,
  embedded = false,
  paletteCrossNeedles,
}: {
  attribute: AttributeCatalogAttribute;
  dossier: Workshop2DossierPhase1;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  /** Внутри блока «Цвет» паспорта — без внешней рамки. */
  embedded?: boolean;
  /** Сузить палитру по токенам из основной группы и референса (паспорт). */
  paletteCrossNeedles?: string[];
}) {
  const a = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
  );
  const { hb, ft } = partitionValues(a);
  const currentPid = hb?.parameterId ?? '';
  const freeStr = ft?.text ?? '';

  const sorted = useMemo(
    () => [...attribute.parameters].sort((x, y) => x.sortOrder - y.sortOrder),
    [attribute.parameters]
  );

  const [gradA, setGradA] = useState('#6366f1');
  const [gradB, setGradB] = useState('#ec4899');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [palFilter, setPalFilter] = useState('');
  const [ignorePaletteCross, setIgnorePaletteCross] = useState(false);

  useEffect(() => {
    const p = sorted.find((x) => x.parameterId === currentPid);
    if (p?.colorHex) {
      setGradA(p.colorHex);
      setGradB(p.colorHex);
      return;
    }
    if (p?.gradientCss) {
      const pair = extractTwoHexesFromCss(p.gradientCss);
      if (pair) {
        setGradA(pair.a);
        setGradB(pair.b);
        return;
      }
    }
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) {
      const pair = extractTwoHexesFromCss(t);
      if (pair) {
        setGradA(pair.a);
        setGradB(pair.b);
      }
    }
  }, [currentPid, freeStr, sorted]);

  const hexFromText = extractHex6(freeStr);
  const colorInputValue = hexFromText ?? gradA;

  const mergeFreeWithHex = (hex: string) => {
    setGradA(hex);
    setGradB(hex);
    const without = freeStr
      .replace(/#([0-9A-Fa-f]{6})\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    patchColor({ freeText: without ? `${hex} · ${without}` : hex });
  };

  const previewCss = freeStr.trim().startsWith('linear-gradient')
    ? freeStr.trim()
    : `linear-gradient(90deg, ${gradA}, ${gradB})`;

  const pickHandbook = (pid: string, label: string) => {
    if (pid && label)
      patchColor({ handbook: { parameterId: pid, displayLabel: label }, freeText: '' });
    else patchColor({ handbook: null, freeText: '' });
  };

  const current = sorted.find((x) => x.parameterId === currentPid);
  const needle = palFilter.trim().toLowerCase();
  const activeCross =
    !ignorePaletteCross && paletteCrossNeedles && paletteCrossNeedles.length > 0
      ? paletteCrossNeedles
      : [];
  const filteredPalette = sorted.filter((p) => {
    const lbNorm = normalizeRuColorMatch(p.label);
    const byName = !needle || lbNorm.includes(normalizeRuColorMatch(needle));
    const byCross =
      activeCross.length === 0 || activeCross.some((n) => n.length >= 2 && lbNorm.includes(n));
    return byName && byCross;
  });

  const summaryLabel = (() => {
    if (currentPid && current) return current.label;
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) return 'Свой градиент (сохранён)';
    if (extractHex6(freeStr)) return 'Свой оттенок / текст';
    return 'Выберите цвет из палитры';
  })();

  const summarySwatchStyle: CSSProperties = (() => {
    if (current?.colorHex) return { backgroundColor: current.colorHex };
    if (current?.gradientCss) return { background: current.gradientCss };
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) return { background: t };
    const hx = extractHex6(freeStr);
    if (hx) return { backgroundColor: hx };
    return { background: previewCss };
  })();

  const onFreeTextChange = (raw: string) => {
    patchColor({ freeText: raw });
    const t = raw.trim();
    if (!t.startsWith('linear-gradient')) {
      const hx = extractHex6(raw);
      if (hx) {
        setGradA(hx);
        setGradB(hx);
      }
    }
  };

  /** Единый размер «квадратов»: как прежний блок «Свой оттенок» (h-4), +50% → h-6/w-6. */
  const colorWellClass =
    'h-6 w-6 shrink-0 cursor-pointer rounded-md border border-border-default bg-white p-0 box-border';

  /** Превью в квадрате «Свой оттенок»: сплошной или сохранённый linear-gradient из текста. */
  const shadeSwatchStyle: CSSProperties = (() => {
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) return { background: t };
    return summarySwatchStyle;
  })();

  return (
    <div
      className={cn(
        'space-y-3',
        embedded
          ? 'border-accent-primary/20 rounded-md border bg-white p-3'
          : 'border-border-default bg-bg-surface2/30 rounded-lg border px-3 pb-5 pt-5'
      )}
    >
      {/* sm+: заголовки в одной строке, строка контролов ниже — на одной высоте */}
      <div
        className={cn(
          'grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3',
          embedded ? 'mb-4' : 'mb-6'
        )}
      >
        <p className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-accent-primary leading-tight')}>
          Палитра и градиент
        </p>
        <Label
          className={cn(
            WORKSHOP_FIELD_LABEL_CLASS,
            'text-accent-primary sm:border-accent-primary/20 leading-tight sm:border-l sm:pl-3'
          )}
        >
          Свой оттенок
        </Label>

        <div className="border-accent-primary/20 min-w-0 overflow-hidden rounded-md border bg-white sm:self-start">
          <button
            type="button"
            className="hover:bg-bg-surface2/80 flex h-9 w-full items-center gap-2 px-2 text-left text-sm"
            onClick={() => setPaletteOpen((o) => !o)}
          >
            <span
              className="border-border-default h-2.5 w-2.5 shrink-0 rounded-full border shadow-sm"
              style={summarySwatchStyle}
            />
            <span className="text-text-primary min-w-0 flex-1 truncate font-medium leading-none">
              {summaryLabel}
            </span>
            <span className="text-text-muted shrink-0 text-[10px]">{paletteOpen ? '▲' : '▼'}</span>
          </button>
          {paletteOpen ? (
            <div className="border-accent-primary/20 bg-accent-primary/10 border-t p-2">
              <Input
                className="border-accent-primary/20 mb-2 h-9 text-sm"
                placeholder="Фильтр по названию цвета…"
                value={palFilter}
                onChange={(e) => setPalFilter(e.target.value)}
              />
              {paletteCrossNeedles && paletteCrossNeedles.length > 0 ? (
                <button
                  type="button"
                  className="text-accent-primary decoration-accent-primary/40 hover:text-accent-primary mb-2 text-left text-[10px] font-semibold underline underline-offset-2"
                  onClick={() => setIgnorePaletteCross((v) => !v)}
                >
                  {ignorePaletteCross
                    ? 'Сузить список по основной группе и референсу'
                    : 'Показать всю палитру'}
                </button>
              ) : null}
              <div className="divide-accent-primary/20 border-accent-primary/20 max-h-52 divide-y overflow-y-auto rounded-md border bg-white">
                <button
                  type="button"
                  className="hover:bg-bg-surface2 flex h-9 w-full items-center gap-2 px-2 text-left text-sm"
                  onClick={() => {
                    pickHandbook('', '');
                    setPaletteOpen(false);
                    setPalFilter('');
                  }}
                >
                  <span className="border-border-default bg-bg-surface2 h-2.5 w-2.5 shrink-0 rounded-full border border-dashed" />
                  <span className="text-text-secondary leading-none">
                    Не выбрано из справочника
                  </span>
                </button>
                {filteredPalette.map((p) => (
                  <button
                    key={p.parameterId}
                    type="button"
                    className={cn(
                      'hover:bg-bg-surface2 flex h-9 w-full items-center gap-2 px-2 text-left text-sm',
                      currentPid === p.parameterId && 'bg-accent-primary/15'
                    )}
                    onClick={() => {
                      pickHandbook(p.parameterId, p.label);
                      setPaletteOpen(false);
                      setPalFilter('');
                    }}
                  >
                    <span
                      className="border-border-default h-2.5 w-2.5 shrink-0 rounded-full border shadow-inner"
                      style={
                        p.colorHex
                          ? { backgroundColor: p.colorHex }
                          : p.gradientCss
                            ? { background: p.gradientCss }
                            : { background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)' }
                      }
                    />
                    <span className="min-w-0 flex-1 truncate leading-none">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            'sm:border-accent-primary/20 flex min-w-0 items-center gap-2 sm:self-start sm:border-l sm:pl-3'
          )}
        >
          <div
            className="border-border-default relative h-9 w-9 shrink-0 overflow-hidden rounded-md border bg-white shadow-inner"
            title="Превью: при сохранённом градиенте показывается полоса; клик — выбор сплошного цвета"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={shadeSwatchStyle}
              aria-hidden
            />
            <input
              type="color"
              value={colorInputValue}
              onChange={(e) => mergeFreeWithHex(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Выбор оттенка"
            />
          </div>
          <Input
            className="h-9 min-w-0 flex-1 text-sm"
            value={freeStr}
            onChange={(e) => onFreeTextChange(e.target.value)}
            placeholder={attribute.uiPlaceholder ?? 'Пантон, RAL, комментарий к цвету…'}
          />
        </div>
      </div>

      <div
        className={cn(
          'space-y-2',
          embedded
            ? 'border-accent-primary/20 bg-accent-primary/10 border-t pt-4'
            : 'border-accent-primary/20 bg-accent-primary/10 rounded-md border p-3 pt-5'
        )}
      >
        <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-accent-primary')}>
          Свой градиент
        </Label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="color"
            value={gradA}
            onChange={(e) => setGradA(e.target.value)}
            className={colorWellClass}
            aria-label="Цвет начала градиента"
          />
          <span className="text-text-secondary text-[10px]">→</span>
          <input
            type="color"
            value={gradB}
            onChange={(e) => setGradB(e.target.value)}
            className={colorWellClass}
            aria-label="Цвет конца градиента"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-9 text-xs"
            onClick={() =>
              patchColor({
                handbook: null,
                freeText: `linear-gradient(90deg, ${gradA}, ${gradB})`,
              })
            }
          >
            Записать градиент в цвет
          </Button>
        </div>
        <div
          className="border-accent-primary/30 h-2.5 rounded border shadow-inner"
          style={{ background: previewCss }}
        />
      </div>
    </div>
  );
}

function WorkshopPassportColorBundle({
  bundleRows,
  dossier,
  currentLeaf,
  phase,
  allowMultiHandbook,
  patchColor,
  showAttributeHintIcons = false,
  onSetHandbookParameters,
  onFreeTextSide,
}: {
  bundleRows: ResolvedPhase1AttributeRow[];
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  phase: '1' | '2' | '3';
  allowMultiHandbook: boolean;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  onSetHandbookParameters: (
    attributeId: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  showAttributeHintIcons?: boolean;
}) {
  const primary = bundleRows.find((r) => r.attribute.attributeId === 'primaryColorFamilyOptions');
  const refRow = bundleRows.find((r) => r.attribute.attributeId === 'colorReferenceSystemOptions');
  const colorRow = bundleRows.find((r) => r.attribute.attributeId === 'color');

  const attrRequired = (attr: AttributeCatalogAttribute) =>
    (phase === '1' && attr.requiredForPhase1) || (phase === '2' && attr.requiredForPhase2);

  const isMissingRequired = (attr: AttributeCatalogAttribute | undefined) => {
    if (!attr || !attrRequired(attr)) return false;
    const assignment = dossier.assignments.find((a) => a.attributeId === attr.attributeId);
    return !canonicalPhaseAssignmentFilled(assignment, attr);
  };

  let anyShowReq = false;
  let anyMissing = false;
  for (const r of bundleRows) {
    if (attrRequired(r.attribute)) {
      anyShowReq = true;
      if (isMissingRequired(r.attribute)) anyMissing = true;
    }
  }

  const paletteCrossNeedles = useMemo(
    () => collectColorBundlePaletteNeedles(dossier),
    [dossier.assignments]
  );

  return (
    <li
      id="w2-passport-color-bundle"
      className={cn(
        'scroll-mt-24 space-y-3 transition-all',
        anyShowReq && anyMissing && 'ring-2 ring-amber-200/90 ring-offset-1 ring-offset-white'
      )}
    >
      {anyShowReq ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span
            className={cn(
              anyMissing ? WORKSHOP_REQUIRED_BADGE_TODO_CLASS : WORKSHOP_REQUIRED_BADGE_DONE_CLASS,
              anyMissing && 'animate-pulse'
            )}
          >
            {anyMissing ? 'Заполните' : 'Обязательный'}
          </span>
        </div>
      ) : null}
      <div className="border-border-default space-y-4 rounded-md border bg-white p-3 shadow-sm">
        {primary ? (
          <div className="border-border-subtle bg-bg-surface2/40 space-y-2 rounded-md border p-3">
            <div className="flex items-center gap-1">
              <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-accent-primary')}>
                {primary.attribute.name}
              </Label>
              {showAttributeHintIcons ? (
                <WorkshopAttributeHintIcon attribute={primary.attribute} />
              ) : null}
            </div>
            <AttributeRowEditor
              attribute={{
                ...primary.attribute,
                parameters: resolveEffectiveParametersForLeaf(primary.attribute, currentLeaf),
              }}
              dossier={dossier}
              allowMultiHandbook={allowMultiHandbook}
              onSetHandbookParameters={onSetHandbookParameters}
              onFreeTextSide={onFreeTextSide}
            />
          </div>
        ) : null}
        {refRow ? (
          <div className="border-border-subtle bg-bg-surface2/40 space-y-2 rounded-md border p-3 pt-4">
            <div className="flex items-center gap-1">
              <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-accent-primary')}>
                {refRow.attribute.name}
              </Label>
              {showAttributeHintIcons ? (
                <WorkshopAttributeHintIcon attribute={refRow.attribute} />
              ) : null}
            </div>
            <AttributeRowEditor
              attribute={{
                ...refRow.attribute,
                parameters: resolveEffectiveParametersForLeaf(refRow.attribute, currentLeaf),
              }}
              dossier={dossier}
              allowMultiHandbook={allowMultiHandbook}
              onSetHandbookParameters={onSetHandbookParameters}
              onFreeTextSide={onFreeTextSide}
            />
          </div>
        ) : null}
        {colorRow ? (
          <div className="border-border-subtle space-y-2 border-t pt-4">
            {showAttributeHintIcons ? (
              <div className="flex items-center gap-1">
                <span className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-accent-primary')}>
                  {colorRow.attribute.name}
                </span>
                <WorkshopAttributeHintIcon attribute={colorRow.attribute} />
              </div>
            ) : null}
            <ColorAttributeRow
              attribute={{
                ...colorRow.attribute,
                parameters: resolveEffectiveParametersForLeaf(colorRow.attribute, currentLeaf),
              }}
              dossier={dossier}
              patchColor={patchColor}
              embedded
              paletteCrossNeedles={paletteCrossNeedles}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}
