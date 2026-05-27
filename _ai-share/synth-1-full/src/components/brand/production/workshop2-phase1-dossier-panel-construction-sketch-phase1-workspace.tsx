'use client';

import type { Dispatch, ReactNode, Ref, RefObject, SetStateAction } from 'react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CategorySketchAnnotator,
  type CategorySketchAnnotatorHandle,
} from '@/components/brand/production/CategorySketchAnnotator';
import { CategorySketchSheetsBlock } from '@/components/brand/production/CategorySketchSheetsBlock';
import { CategorySubcategorySketchesTzBlock } from '@/components/brand/production/CategorySubcategorySketchesTzBlock';
import { SubcategorySketchTasksRibbon } from '@/components/brand/production/SubcategorySketchTasksRibbon';
import { Workshop2SketchUnderlayLibraryPicker } from '@/components/brand/production/Workshop2SketchUnderlayLibraryPicker';
import { W2SketchThumbRail } from '@/components/brand/production/workshop2-phase1-dossier-panel-sketch-thumb-rail';
import { useToast } from '@/hooks/use-toast';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1SketchSheet,
  Workshop2SketchPinTemplate,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffSectionKey,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { VisualCatalogSketchLinkRow } from '@/lib/production/workshop2-sketch-tz-matrix';
import { WORKSHOP_BRANCH_LEVELS_DETAILS_LS_KEY } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-group-storage';
import { BRANCH_CATALOG_SLOT_ROLE } from '@/lib/production/workshop2-tz-subcategory-sketches';
import {
  SKETCH_SHEET_VIEW_LABELS,
  DEFAULT_MASTER_PIN_SNIPPETS,
} from '@/lib/production/workshop2-sketch-sheets';
import { WORKSHOP2_MASTER_SKETCH_PIN_TEMPLATES_UI_ENABLED } from '@/lib/production/workshop2-sketch-pin-templates';
import { WORKSHOP2_SKETCH_UNDERLAY_LIBRARY_UI_ENABLED } from '@/lib/production/workshop2-sketch-underlay-presets';
import { appendCategorySketchRevisionSnapshot } from '@/lib/production/sketch-plm-revisions';
import { mergeSketchMasterAuditLog } from '@/lib/production/sketch-annotation-audit';
import { W2_CONSTRUCTION_SKETCHES_DEFER_ID } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import { cn } from '@/lib/utils';

type WorkshopSketchWorkspaceNavTab =
  | 'overview'
  | 'tz'
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc'
  | 'stock';

export type Workshop2SketchPhase1WorkspaceStats = {
  masterPins: number;
  sheetCount: number;
  sheetPins: number;
  sketchLeafPinTotal: number;
  sheetsWithImage: number;
  sublevelPins: number;
};

export function Workshop2DossierConstructionSketchPhase1Workspace({
  tzMinimalHideDeferCommentUi,
  deferredAttrIds,
  toggleDeferAttribute,
  openAttrComments,
  attrCommentsById,
  sketchPrimaryStatus,
  sketchWorkspaceTab,
  setSketchWorkspaceTab,
  sketchWorkspaceStats,
  sketchEditsLocked,
  canOpenSketchFromToolbar,
  sketchSurface,
  setSketchSurface,
  sketchSheetPickerId,
  setSketchSheetPickerId,
  dossier,
  dossierViewProfile,
  sketchPinLinkAudit,
  sketchMasterAnnotatorRef,
  sketchSheetAnnotatorRef,
  sketchMasterTemplateId,
  setSketchMasterTemplateId,
  orgSketchTemplatesList,
  applyMasterSketchPinTemplate,
  saveMasterSketchPinTemplate,
  saveMasterSketchPinTemplateToOrg,
  currentLeaf,
  sketchAttributeOptions,
  bomLinePickOptions,
  normalizedSketchSheets,
  appendSketchSheetFromUpload,
  selectedAudienceId,
  selectedAudienceLabel,
  onNavigateWorkspaceTab,
  onJumpToTzPanelSection,
  onNavigateSketchRouteStage,
  setDossier,
  skuDraft,
  nameDraft,
  updatedByLabel,
  collectionId,
  visualsCatalogAttributeIdsForSketch,
  visualsCatalogSketchLinksForPins,
  onVisualCatalogSuggestFromSketch,
  orgSketchLibraryRevision,
  setOrgSketchLibraryRevision,
  subcategorySketchActiveLevel,
  setSubcategorySketchActiveLevel,
  branchLevelsDetailsOpen,
  setBranchLevelsDetailsOpen,
}: {
  tzMinimalHideDeferCommentUi: boolean;
  deferredAttrIds: ReadonlySet<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  openAttrComments: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  sketchPrimaryStatus: ReactNode;
  sketchWorkspaceTab: 'sketch' | 'sublevels';
  setSketchWorkspaceTab: Dispatch<SetStateAction<'sketch' | 'sublevels'>>;
  sketchWorkspaceStats: Workshop2SketchPhase1WorkspaceStats;
  sketchEditsLocked: boolean;
  canOpenSketchFromToolbar: boolean;
  sketchSurface: 'master' | 'sheets';
  setSketchSurface: Dispatch<SetStateAction<'master' | 'sheets'>>;
  sketchSheetPickerId: string | null;
  setSketchSheetPickerId: Dispatch<SetStateAction<string | null>>;
  dossier: Workshop2DossierPhase1;
  dossierViewProfile: string;
  sketchPinLinkAudit: readonly { id: string; messages: readonly string[] }[];
  sketchMasterAnnotatorRef: RefObject<CategorySketchAnnotatorHandle | null>;
  sketchSheetAnnotatorRef: RefObject<CategorySketchAnnotatorHandle | null>;
  sketchMasterTemplateId: string;
  setSketchMasterTemplateId: Dispatch<SetStateAction<string>>;
  orgSketchTemplatesList: readonly Workshop2SketchPinTemplate[];
  applyMasterSketchPinTemplate: (mode: 'merge' | 'replace') => void;
  saveMasterSketchPinTemplate: () => void;
  saveMasterSketchPinTemplateToOrg: () => void;
  currentLeaf: HandbookCategoryLeaf;
  sketchAttributeOptions: { id: string; label: string }[];
  bomLinePickOptions: { value: string; label: string }[];
  normalizedSketchSheets: Workshop2Phase1SketchSheet[];
  appendSketchSheetFromUpload: (imageDataUrl: string, imageFileName?: string) => void;
  selectedAudienceId: string;
  selectedAudienceLabel: string;
  onNavigateWorkspaceTab?: (
    tab: WorkshopSketchWorkspaceNavTab,
    opts?: { dossierSection?: Workshop2TzSignoffSectionKey; scrollDomId?: string }
  ) => void;
  onJumpToTzPanelSection: (section: Workshop2TzPanelSectionId) => void;
  onNavigateSketchRouteStage: (stage: Workshop2TzSignoffStageId) => void;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  skuDraft: string;
  nameDraft: string;
  updatedByLabel: string;
  collectionId: string;
  visualsCatalogAttributeIdsForSketch: readonly string[];
  visualsCatalogSketchLinksForPins: readonly VisualCatalogSketchLinkRow[];
  onVisualCatalogSuggestFromSketch: (ids: string[]) => void;
  orgSketchLibraryRevision: number;
  setOrgSketchLibraryRevision: Dispatch<SetStateAction<number>>;
  subcategorySketchActiveLevel: 1 | 2 | 3;
  setSubcategorySketchActiveLevel: Dispatch<SetStateAction<1 | 2 | 3>>;
  branchLevelsDetailsOpen: boolean;
  setBranchLevelsDetailsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-sm">
          <LucideIcons.Layers className="h-4 w-4 shrink-0" aria-hidden />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <h2 className="text-text-primary text-base font-semibold">Скетчи</h2>
            </div>

            {!tzMinimalHideDeferCommentUi ? (
              <div className="flex shrink-0 items-center gap-1 pl-1">
                <label
                  className="text-text-muted hover:text-text-primary flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold"
                  title="Отложенное заполнение сохраняется только в браузере (для команды бренда)"
                >
                  <Checkbox
                    checked={deferredAttrIds.has(W2_CONSTRUCTION_SKETCHES_DEFER_ID)}
                    onCheckedChange={() => toggleDeferAttribute(W2_CONSTRUCTION_SKETCHES_DEFER_ID)}
                    className="border-border-default h-3.5 w-3.5 shrink-0"
                    aria-label={
                      deferredAttrIds.has(W2_CONSTRUCTION_SKETCHES_DEFER_ID)
                        ? 'Снять отложенное заполнение'
                        : 'Заполнить позже (только для бренда)'
                    }
                  />

                  <span className="hidden sm:inline">Позже (лок.)</span>
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-text-primary h-8 px-1.5 text-[10px] font-semibold"
                  onClick={() => openAttrComments(W2_CONSTRUCTION_SKETCHES_DEFER_ID)}
                >
                  Комментарий
                  {(attrCommentsById[W2_CONSTRUCTION_SKETCHES_DEFER_ID]?.length ?? 0) > 0 ? (
                    <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
                      {attrCommentsById[W2_CONSTRUCTION_SKETCHES_DEFER_ID]!.length}
                    </span>
                  ) : null}
                </Button>
              </div>
            ) : null}
          </div>

          <p className="text-text-secondary text-[11px] leading-snug">
            Подложка и метки на изделие для цеха: загрузите скетч, расставьте точки и привяжите их к
            полям ТЗ.
          </p>
        </div>
      </div>

      {sketchPrimaryStatus}

      <Tabs
        value={sketchWorkspaceTab}
        onValueChange={(v) => setSketchWorkspaceTab(v as typeof sketchWorkspaceTab)}
        className="w-full"
      >
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between sm:gap-2">
          <TabsList className="inline-flex h-9 min-h-9 w-full min-w-0 max-w-none shrink-0 gap-1 rounded-lg border border-input bg-background p-0.5 shadow-sm sm:w-auto">
            <TabsTrigger
              value="sketch"
              className={cn(
                'inline-flex h-9 min-h-9 min-w-[9.5rem] shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 text-xs font-medium !normal-case !tracking-normal',

                'text-text-secondary ring-offset-background transition-colors hover:bg-accent/60 hover:text-accent-foreground',

                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

                'data-[state=active]:border-border-default data-[state=active]:text-text-primary data-[state=active]:bg-white data-[state=active]:shadow-sm'
              )}
            >
              <span className="flex flex-nowrap items-center justify-center gap-1">
                <span className="shrink-0">Скетч</span>

                {sketchWorkspaceStats.sketchLeafPinTotal > 0 ? (
                  <Badge
                    variant="secondary"
                    className="border-border-default/80 bg-bg-surface2 h-3.5 min-w-3.5 border px-0.5 text-[8px] font-bold tabular-nums leading-none"
                    title="Меток: мастер, листы и подуровни (текущая ветка L3)"
                  >
                    {sketchWorkspaceStats.sketchLeafPinTotal}
                  </Badge>
                ) : null}

                {(() => {
                  const masterBoard = Boolean(dossier.categorySketchImageDataUrl?.trim()) ? 1 : 0;

                  const n = masterBoard + sketchWorkspaceStats.sheetCount;

                  return n > 1 ? (
                    <Badge
                      variant="secondary"
                      className="border-border-default/80 bg-bg-surface2 h-3.5 min-w-3.5 border px-0.5 text-[8px] font-bold tabular-nums leading-none"
                      title="Число листов в колонке слева (основной после загрузки файла + доп. листы)."
                    >
                      {n}д
                    </Badge>
                  ) : null;
                })()}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="sublevels"
              className={cn(
                'inline-flex h-9 min-h-9 min-w-[9.5rem] shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 text-xs font-medium !normal-case !tracking-normal',

                'text-text-secondary ring-offset-background transition-colors hover:bg-accent/60 hover:text-accent-foreground',

                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

                'data-[state=active]:border-border-default data-[state=active]:text-text-primary data-[state=active]:bg-white data-[state=active]:shadow-sm'
              )}
            >
              <span className="flex items-center justify-center gap-1">
                Узлы ветки
                {sketchWorkspaceStats.sublevelPins > 0 ? (
                  <Badge
                    variant="secondary"
                    className="border-border-default/80 bg-bg-surface2 h-3.5 min-w-3.5 border px-0.5 text-[8px] font-bold tabular-nums leading-none"
                  >
                    {sketchWorkspaceStats.sublevelPins}
                  </Badge>
                ) : null}
              </span>
            </TabsTrigger>
          </TabsList>

          {sketchWorkspaceTab === 'sketch' ? (
            <div className="flex h-9 min-h-9 w-full min-w-0 flex-nowrap items-center justify-end gap-2 sm:w-auto sm:flex-1 sm:justify-end sm:pl-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-w-[9.5rem] shrink-0 gap-1.5 text-xs"
                disabled={sketchEditsLocked}
                title={
                  sketchEditsLocked
                    ? 'В режиме цеха загрузка отключена'
                    : 'Загрузить или заменить изображение скетча'
                }
                onClick={() => sketchMasterAnnotatorRef.current?.openSketchUpload()}
              >
                <LucideIcons.Upload className="size-3.5 shrink-0" aria-hidden />
                Загрузить скетч
              </Button>

              <Button
                type="button"
                size="sm"
                className="h-9 min-w-[9.5rem] shrink-0 gap-1.5 text-xs"
                disabled={!canOpenSketchFromToolbar || sketchEditsLocked}
                title={
                  !canOpenSketchFromToolbar
                    ? 'Сначала загрузите изображение на основной доске или на выбранном листе'
                    : sketchEditsLocked
                      ? 'Просмотр меток (режим цеха)'
                      : sketchSurface === 'sheets'
                        ? 'Открыть редактор меток текущего листа'
                        : 'Открыть полный редактор меток'
                }
                onClick={() => {
                  if (sketchSurface === 'sheets') {
                    sketchSheetAnnotatorRef.current?.openSketchEditor();
                  } else {
                    sketchMasterAnnotatorRef.current?.openSketchEditor();
                  }
                }}
              >
                <LucideIcons.Expand className="size-3.5 shrink-0" aria-hidden />
                Открыть скетч
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 shrink-0 gap-1.5 border-slate-200 text-xs text-slate-500"
                disabled={true}
                title="Автоматическая разметка на основе ТЗ: в разработке"
              >
                <LucideIcons.Wand2 className="size-3.5 shrink-0" aria-hidden />
                <span className="hidden sm:inline">Авто-разметка (скоро)</span>
                <span className="sm:hidden">AI</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 shrink-0 gap-1.5 border-slate-200 text-xs text-slate-500"
                disabled={true}
                title="Экспорт сводки: в разработке"
              >
                <LucideIcons.Table className="size-3.5 shrink-0" aria-hidden />
                <span className="hidden sm:inline">Сводка деталей (скоро)</span>
                <span className="sm:hidden">Сводка</span>
              </Button>
            </div>
          ) : null}
        </div>

        <TabsContent value="sketch" className="mt-0 outline-none focus-visible:ring-0">
          {sketchPinLinkAudit.length > 0 ? (
            <div
              className="mb-3 rounded-lg border border-amber-300/90 bg-amber-50/95 px-3 py-2 text-[11px] text-amber-950"
              role="status"
            >
              <p className="font-semibold">
                Связи меток (режим {dossierViewProfile}): заполните BOM / QC там, где требуется
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

          <>
            <div
              className={cn(
                'flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-3',

                sketchSurface !== 'master' && 'hidden'
              )}
            >
              <W2SketchThumbRail
                masterImageUrl={dossier.categorySketchImageDataUrl}
                masterBoardOrientation={dossier.categorySketchBoardOrientation}
                masterPins={sketchWorkspaceStats.masterPins}
                sheets={normalizedSketchSheets}
                activeSheetId={sketchSheetPickerId}
                sketchSurface={sketchSurface}
                leafId={currentLeaf.leafId}
                sketchEditsLocked={sketchEditsLocked}
                onMaster={() => setSketchSurface('master')}
                onPickSheet={(id) => {
                  setSketchSurface('sheets');

                  setSketchSheetPickerId(id);
                }}
              />

              <div className="min-w-0 flex-1 space-y-3">
                <div id="w2-visuals-sketch-templates" className="scroll-mt-24">
                  {WORKSHOP2_MASTER_SKETCH_PIN_TEMPLATES_UI_ENABLED ? (
                    <details className="border-border-default bg-bg-surface2/50 mb-3 rounded-lg border shadow-sm">
                      <summary className="text-text-primary cursor-pointer list-none px-3 py-2.5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
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
                                  {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''})
                                </option>
                              ))}
                            </optgroup>
                          ) : null}

                          {orgSketchTemplatesList.length > 0 ? (
                            <optgroup label="Библиотека коллекции">
                              {orgSketchTemplatesList.map((t) => (
                                <option key={`o:${t.templateId}`} value={`o:${t.templateId}`}>
                                  {t.name} ({t.annotations.length} мет.
                                  {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''})
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
                  ) : null}

                  {WORKSHOP2_SKETCH_UNDERLAY_LIBRARY_UI_ENABLED ? (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Workshop2SketchUnderlayLibraryPicker
                        currentLeaf={currentLeaf}
                        disabled={sketchEditsLocked}
                        onUnderlayApplied={(payload) => {
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,

                            categorySketchImageDataUrl: payload.dataUrl,

                            categorySketchImageFileName: payload.fileName,

                            categorySketchBoardOrientation: 'landscape',
                          }));

                          toast({
                            title: 'Подложка из справочника',

                            description: payload.presetLabelRu,
                          });
                        }}
                      />
                    </div>
                  ) : null}

                  <CategorySketchAnnotator
                    ref={sketchMasterAnnotatorRef as Ref<CategorySketchAnnotatorHandle>}
                    externalPreviewSketchToolbar
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
                    onNavigateStage={(stage) => onNavigateWorkspaceTab?.(stage)}
                    onJumpToDossierSection={onJumpToTzPanelSection}
                    onNavigateRouteStage={onNavigateSketchRouteStage}
                    onPatch={(patch) =>
                      setDossier((p: Workshop2DossierPhase1) => ({ ...p, ...patch }))
                    }
                    onAddAsNewSheetFromUpload={appendSketchSheetFromUpload}
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
                    sketchMaterialCards={dossier.categorySketchMaterialCards ?? []}
                    onSketchMaterialCardsChange={(next) =>
                      setDossier((p: Workshop2DossierPhase1) => ({
                        ...p,

                        categorySketchMaterialCards: next,
                      }))
                    }
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
                </div>
              </div>
            </div>

            {normalizedSketchSheets.length > 0 ? (
              <div className={cn(sketchSurface !== 'sheets' && 'hidden')}>
                <CategorySketchSheetsBlock
                  sketchSheetsRail={
                    <W2SketchThumbRail
                      masterImageUrl={dossier.categorySketchImageDataUrl}
                      masterBoardOrientation={dossier.categorySketchBoardOrientation}
                      masterPins={sketchWorkspaceStats.masterPins}
                      sheets={normalizedSketchSheets}
                      activeSheetId={sketchSheetPickerId}
                      sketchSurface={sketchSurface}
                      leafId={currentLeaf.leafId}
                      sketchEditsLocked={sketchEditsLocked}
                      onMaster={() => setSketchSurface('master')}
                      onPickSheet={(id) => {
                        setSketchSurface('sheets');

                        setSketchSheetPickerId(id);
                      }}
                    />
                  }
                  hideSheetThumbnailRail
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
                  onOrgSketchTemplatesMutated={() => setOrgSketchLibraryRevision((n) => n + 1)}
                  auditActor={updatedByLabel}
                  sketchViewFloor={sketchEditsLocked}
                  embeddedPicker={{
                    activeSheetId: sketchSheetPickerId ?? normalizedSketchSheets[0]!.sheetId,

                    onActiveSheetChange: setSketchSheetPickerId,
                  }}
                  onJumpToDossierSection={onJumpToTzPanelSection}
                  onNavigateRouteStage={onNavigateSketchRouteStage}
                  visualCatalogAttributeIds={visualsCatalogAttributeIdsForSketch}
                  visualCatalogSketchLinks={visualsCatalogSketchLinksForPins}
                  onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
                  sketchToolbarEditorRef={
                    sketchSheetAnnotatorRef as Ref<CategorySketchAnnotatorHandle>
                  }
                />
              </div>
            ) : null}
          </>
        </TabsContent>

        <TabsContent value="sublevels" className="mt-0 outline-none focus-visible:ring-0">
          <div className="space-y-3">
            <div className="border-border-default space-y-2 rounded-lg border bg-white p-2 shadow-sm">
              {subcategorySketchActiveLevel !== 3 ? (
                <p className="rounded-md border border-amber-200 bg-amber-50/80 px-2 py-1.5 text-[10px] text-amber-950">
                  Сейчас открыт слот{' '}
                  <strong>«{BRANCH_CATALOG_SLOT_ROLE[subcategorySketchActiveLevel].label}»</strong>.
                  Вернуться к модели можно в блоке «Уровни ветки» ниже.
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
  );
}
