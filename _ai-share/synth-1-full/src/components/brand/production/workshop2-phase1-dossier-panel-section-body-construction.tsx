'use client';

import type { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import type { CategorySketchAnnotatorHandle } from '@/components/brand/production/CategorySketchAnnotator';
import { Workshop2DossierPanelSectionTzSignoffBridge } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-tz-signoff-bridge';
import { Workshop2DossierConstructionBasicParamsBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-construction-basic-params';
import { Workshop2DossierConstructionCadBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-construction-cad-block';
import { useToast } from '@/hooks/use-toast';
import { Workshop2DossierConstructionSketchPhase23Panel } from '@/components/brand/production/workshop2-phase1-dossier-panel-construction-sketch-phase23';
import { Workshop2DossierConstructionSketchPhase1Workspace } from '@/components/brand/production/workshop2-phase1-dossier-panel-construction-sketch-phase1-workspace';
import type { Workshop2SketchPhase1WorkspaceStats } from '@/components/brand/production/workshop2-phase1-dossier-panel-construction-sketch-phase1-workspace';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsExtra,
  type Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';
import type { Workshop2DossierAttributeCardContextProps } from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-card';
import { Workshop2DossierAttributeCard } from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-card';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB } from '@/lib/production/workshop2-sketch-route-workspace-tab';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1SketchSheet,
  Workshop2SketchPinTemplate,
  Workshop2TzActionLogPayload,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import type { VisualCatalogSketchLinkRow } from '@/lib/production/workshop2-sketch-tz-matrix';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';
import type { Workshop2ConstructionPhase1ExtraRow } from '@/components/brand/production/workshop2-phase1-dossier-panel-construction-basic-params';
import { Workshop2GradingMatrixPanel } from '@/components/brand/production/Workshop2GradingMatrixPanel';
import { Workshop2SmartRoutingPanel } from '@/components/brand/production/Workshop2SmartRoutingPanel';
import { Workshop2MeasurementsTableHub } from '@/components/brand/production/Workshop2MeasurementsTableHub';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

export type Workshop2DossierSectionBodyConstructionProps = {
  sectionReadinessUi: Record<DossierSection, { pct: number }>;
  sectionGateErrorsById: Record<DossierSection, string[]>;
  currentPhase: '1' | '2' | '3';
  tzMinimalConstruction: boolean;
  onToggleTzMinimalConstruction: () => void;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  tzWriteDisabled: boolean;
  currentLeaf: HandbookCategoryLeaf;
  sectionRowsCurrent: ResolvedPhase1AttributeRow[];
  extraRowsCurrent: Workshop2ConstructionPhase1ExtraRow[];
  renderPhaseRow: (
    row: ResolvedPhase1AttributeRow,
    phase: '1' | '2' | '3',
    showAttributeNameHintIcon?: boolean,
    strictAttributeFillLabelColors?: boolean
  ) => ReactNode;
  dossierAttrCardCtx: Workshop2DossierAttributeCardContextProps;
  workshop2DossierSectionRowsSharedProps: Workshop2DossierSectionRowsSharedBundle;
  collectionId: string;
  articleId: string;
  skuDraft: string;
  techPackSessionBlobById: Record<string, string>;
  setTechPackSessionBlobById: Dispatch<SetStateAction<Record<string, string>>>;
  logTechPackZipLine: (line: string) => void;
  appendTzPulse: (action: Workshop2TzActionLogPayload) => void;
  updatedByLabel: string;
  factorySendHubPreview: {
    techPackCount: number;
    techPackWithBytes: number;
    sketchReady: boolean;
    firstUnmet?: { id: string; label: string } | null;
  };
  isPhase1: boolean;
  tzMinimalHideDeferCommentUi: boolean;
  deferredAttrIds: Set<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  openAttrComments: (blockId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  sketchViewFloor: boolean;
  showVisualSketchLinkFieldsNav: boolean;
  sketchPinLinkAudit: readonly { id: string; messages: readonly string[] }[];
  sketchTechGaps: { pinsWithoutAttrOrBom: number; criticalPinsWithoutDue: number };
  jumpToSketchLineRefs: () => void;
  setSketchWorkspaceTab: Dispatch<SetStateAction<'sketch' | 'sublevels'>>;
  sketchMasterAnnotatorRef: RefObject<CategorySketchAnnotatorHandle | null>;
  sketchSheetAnnotatorRef: RefObject<CategorySketchAnnotatorHandle | null>;
  canOpenSketchFromToolbar: boolean;
  sketchEditsLocked: boolean;
  sketchSurface: 'master' | 'sheets';
  setSketchSurface: Dispatch<SetStateAction<'master' | 'sheets'>>;
  sketchWorkspaceTab: 'sketch' | 'sublevels';
  sketchWorkspaceStats: Workshop2SketchPhase1WorkspaceStats;
  sketchSheetPickerId: string | null;
  setSketchSheetPickerId: Dispatch<SetStateAction<string | null>>;
  dossierViewProfile: Workshop2DossierViewProfile;
  sketchMasterTemplateId: string;
  setSketchMasterTemplateId: Dispatch<SetStateAction<string>>;
  orgSketchTemplatesList: Workshop2SketchPinTemplate[];
  applyMasterSketchPinTemplate: (mode: 'merge' | 'replace') => void;
  saveMasterSketchPinTemplate: () => void;
  saveMasterSketchPinTemplateToOrg: () => void;
  sketchAttributeOptions: { id: string; label: string }[];
  bomLinePickOptions: { value: string; label: string }[];
  normalizedSketchSheets: Workshop2Phase1SketchSheet[];
  appendSketchSheetFromUpload: (imageDataUrl: string, imageFileName?: string) => void;
  selectedAudienceId: string;
  selectedAudienceLabel: string;
  onNavigateToTab?: (
    tab: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock',
    opts?: { dossierSection?: Workshop2TzSignoffSectionKey; scrollDomId?: string }
  ) => void;
  onSelectTzSection: (section: Workshop2TzPanelSectionId) => void;
  nameDraft: string;
  visualsCatalogAttributeIdsForSketch: readonly string[];
  visualsCatalogSketchLinksForPins: readonly VisualCatalogSketchLinkRow[];
  onVisualCatalogSuggestFromSketch: (ids: string[]) => void;
  orgSketchLibraryRevision: number;
  setOrgSketchLibraryRevision: Dispatch<SetStateAction<number>>;
  subcategorySketchActiveLevel: 1 | 2 | 3;
  setSubcategorySketchActiveLevel: Dispatch<SetStateAction<1 | 2 | 3>>;
  branchLevelsDetailsOpen: boolean;
  setBranchLevelsDetailsOpen: Dispatch<SetStateAction<boolean>>;
  setSketchFloorMode: (next: boolean) => void;
  lockedSketchFloorOnly: boolean;
  copySketchFloorLink: () => void | Promise<void>;
  saveSketchLabelsSnapshot: () => void;
  sketchBundleBusy: boolean;
  exportSketchVisualBundleZip: () => void | Promise<void>;
  setSketchPinLibraryOpen: Dispatch<SetStateAction<boolean>>;
  visualsCatalogOnlyRows: ResolvedPhase1AttributeRow[];
  visualsCatalogOnlyExtras: Workshop2DossierSectionRowsExtra[];
  dvTzSignoffSides: { brand: boolean; tech: boolean };
  sectionSignoffPassportPreviews: {
    brandPassportName: string | null;
    brandPassportOrg: string | null;
    brandPassportMissing: boolean;
    techPassportName: string | null;
    techPassportOrg: string | null;
    techPassportMissing: boolean;
  };
  sectionSignoffOrganizationLabel?: string;
  sectionSignoffProfileGateOk: boolean;
  sectionSignoffSessionBrandOk: boolean;
  sectionSignoffSessionTechOk: boolean;
  tzSectionSignoffRevokeAllowed: boolean;
  tzNotifyHighlightRowKey: string | null;
  commitSectionSignoff: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    role: 'brand' | 'tech'
  ) => void;
  revokeSectionSignoff: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    role: 'brand' | 'tech'
  ) => void;
  notifyStakeholdersForSectionSignoff: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    sectionTitle: string,
    side?: 'brand' | 'tech'
  ) => void;
  setSignoffDeadline: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    side: 'brand' | 'tech',
    dueAt: string | undefined
  ) => void;
  tzBlockersFooter: ReactNode;
};

export function Workshop2DossierSectionBodyConstruction(
  props: Workshop2DossierSectionBodyConstructionProps
) {
  const { toast } = useToast();
  const {
    sectionReadinessUi,
    sectionGateErrorsById,
    currentPhase,
    tzMinimalConstruction,
    onToggleTzMinimalConstruction,
    dossier,
    setDossier,
    tzWriteDisabled,
    currentLeaf,
    sectionRowsCurrent,
    extraRowsCurrent,
    renderPhaseRow,
    dossierAttrCardCtx,
    workshop2DossierSectionRowsSharedProps,
    collectionId,
    articleId,
    skuDraft,
    techPackSessionBlobById,
    setTechPackSessionBlobById,
    logTechPackZipLine,
    appendTzPulse,
    updatedByLabel,
    factorySendHubPreview,
    isPhase1,
    tzMinimalHideDeferCommentUi,
    deferredAttrIds,
    toggleDeferAttribute,
    openAttrComments,
    attrCommentsById,
    sketchViewFloor,
    showVisualSketchLinkFieldsNav,
    sketchPinLinkAudit,
    sketchTechGaps,
    jumpToSketchLineRefs,
    setSketchWorkspaceTab,
    setSketchSurface,
    sketchMasterAnnotatorRef,
    sketchSheetAnnotatorRef,
    canOpenSketchFromToolbar,
    sketchEditsLocked,
    sketchSurface,
    sketchWorkspaceTab,
    sketchWorkspaceStats,
    sketchSheetPickerId,
    setSketchSheetPickerId,
    dossierViewProfile,
    sketchMasterTemplateId,
    setSketchMasterTemplateId,
    orgSketchTemplatesList,
    applyMasterSketchPinTemplate,
    saveMasterSketchPinTemplate,
    saveMasterSketchPinTemplateToOrg,
    sketchAttributeOptions,
    bomLinePickOptions,
    normalizedSketchSheets,
    appendSketchSheetFromUpload,
    selectedAudienceId,
    selectedAudienceLabel,
    onNavigateToTab,
    onSelectTzSection,
    nameDraft,
    visualsCatalogAttributeIdsForSketch,
    visualsCatalogSketchLinksForPins,
    onVisualCatalogSuggestFromSketch,
    orgSketchLibraryRevision,
    setOrgSketchLibraryRevision,
    subcategorySketchActiveLevel,
    setSubcategorySketchActiveLevel,
    branchLevelsDetailsOpen,
    setBranchLevelsDetailsOpen,
    setSketchFloorMode,
    lockedSketchFloorOnly,
    copySketchFloorLink,
    saveSketchLabelsSnapshot,
    sketchBundleBusy,
    exportSketchVisualBundleZip,
    setSketchPinLibraryOpen,
    visualsCatalogOnlyRows,
    visualsCatalogOnlyExtras,
    dvTzSignoffSides,
    sectionSignoffPassportPreviews,
    sectionSignoffOrganizationLabel,
    sectionSignoffProfileGateOk,
    sectionSignoffSessionBrandOk,
    sectionSignoffSessionTechOk,
    tzSectionSignoffRevokeAllowed,
    tzNotifyHighlightRowKey,
    commitSectionSignoff,
    revokeSectionSignoff,
    notifyStakeholdersForSectionSignoff,
    setSignoffDeadline,
    tzBlockersFooter,
  } = props;

  const sketchPrimaryStatus = (() => {
    if (sketchViewFloor) {
      return (
        <div
          role="status"
          className="border-border-default bg-bg-surface2/90 text-text-primary rounded-md border px-3 py-2 text-[11px] leading-snug"
        >
          <span className="font-semibold">Режим цеха:</span> ориентируйтесь на канон-скетч и эталон
          подложки. Печать/QR — в «Дополнительно», общий пакет — в «Задание».
        </div>
      );
    }
    if (showVisualSketchLinkFieldsNav && sketchPinLinkAudit.length > 0) {
      return (
        <div
          role="status"
          className="rounded-md border border-amber-200 bg-amber-50/90 px-3 py-2 text-[11px] leading-snug text-amber-950"
        >
          <span className="font-semibold">{sketchPinLinkAudit.length} меток</span> — не хватает
          обязательных привязок к ТЗ; исправьте связи перед передачей.
        </div>
      );
    }
    if (sketchTechGaps.pinsWithoutAttrOrBom > 0 || sketchTechGaps.criticalPinsWithoutDue > 0) {
      return (
        <div
          role="status"
          className="rounded-md border border-teal-200 bg-teal-50/85 px-3 py-2 text-[11px] leading-snug text-teal-950"
        >
          Для технолога:{' '}
          {[
            sketchTechGaps.pinsWithoutAttrOrBom > 0
              ? `без привязки к атрибуту/Bom — ${sketchTechGaps.pinsWithoutAttrOrBom}`
              : null,
            sketchTechGaps.criticalPinsWithoutDue > 0
              ? `критичных без срока — ${sketchTechGaps.criticalPinsWithoutDue}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ')}
          .
        </div>
      );
    }
    return (
      <div
        role="status"
        className="rounded-md border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-[11px] leading-snug text-emerald-900"
      >
        Скетч-часть готова: связи меток заполнены, критичных пробелов нет.
      </div>
    );
  })();

  const sketchGuideHasSource =
    Boolean(dossier.categorySketchImageDataUrl?.trim()) || normalizedSketchSheets.length > 0;
  const sketchGuideHasPins = sketchWorkspaceStats.sketchLeafPinTotal > 0;
  const sketchGuidePinsLinked = sketchGuideHasPins && sketchPinLinkAudit.length === 0;
  const sketchGuideReadyForSend = factorySendHubPreview.sketchReady;

  const onSketchGuideAction = () => {
    jumpToSketchLineRefs();
  };

  const constructionSampleRow = sectionRowsCurrent.find(
    (r) => r.attribute.attributeId === 'sampleBaseSize'
  );
  const constructionSampleExtra = extraRowsCurrent.find(
    (e) => e.attribute.attributeId === 'sampleBaseSize'
  );
  const sampleBaseSizeBlockNode = constructionSampleRow ? (
    <ul className="grid grid-cols-1 gap-2 *:min-w-0">
      {renderPhaseRow(constructionSampleRow, currentPhase, false, false)}
    </ul>
  ) : constructionSampleExtra ? (
    <ul className="grid grid-cols-1 gap-2 *:min-w-0">
      <Workshop2DossierAttributeCard
        {...dossierAttrCardCtx}
        attribute={constructionSampleExtra.attribute}
        groupLabel={constructionSampleExtra.groupLabel}
        variant="extra"
        frame="card"
        workshopPhase={currentPhase}
        showAttributeNameHintIcon={false}
        strictAttributeFillLabelColors={false}
      />
    </ul>
  ) : null;

  return (
    <div id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub} className="flex scroll-mt-24 flex-col gap-4">
      <Workshop2DossierConstructionBasicParamsBlock
        l2Name={currentLeaf.l2Name}
        categoryLeafId={currentLeaf.leafId}
        currentLeaf={currentLeaf}
        sectionRows={sectionRowsCurrent}
        extraRows={extraRowsCurrent}
        currentPhase={currentPhase}
        renderPhaseRow={renderPhaseRow}
        dossierAttrCardCtx={dossierAttrCardCtx}
        sectionRowsShared={workshop2DossierSectionRowsSharedProps}
      />

      <Workshop2GradingMatrixPanel
        dossier={dossier}
        setDossier={setDossier}
        disabled={tzWriteDisabled}
        categoryLeafId={currentLeaf.leafId}
        currentLeaf={currentLeaf}
        sizeTableSlot={sampleBaseSizeBlockNode}
      />

      <div className="border-border-default space-y-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Табель мер по размерам</h2>
            <p className="text-text-secondary text-xs leading-snug">
              Единая таблица для образца, фабрики, fit и ОТК.
            </p>
          </div>
        </div>
        <Workshop2MeasurementsTableHub
          dossier={dossier}
          currentLeaf={currentLeaf}
          handbookWarnings={[]}
          onJumpToTzAnchor={(section, anchorId) =>
            onNavigateToTab?.('tz', { dossierSection: section, scrollDomId: anchorId })
          }
          constructionSectionPct={sectionReadinessUi.construction?.pct ?? 0}
        />
      </div>

      <Workshop2DossierConstructionCadBlock
        collectionId={collectionId}
        articleId={articleId}
        skuDraft={skuDraft}
        techPackSessionBlobById={techPackSessionBlobById}
        setTechPackSessionBlobById={setTechPackSessionBlobById}
        techPackAttachments={dossier.techPackAttachments ?? []}
        onTechPackAttachmentsChange={(next) =>
          setDossier((p: Workshop2DossierPhase1) => ({ ...p, techPackAttachments: next }))
        }
        onPatchTechPackAttachment={(id, patch) =>
          setDossier((p: Workshop2DossierPhase1) => ({
            ...p,
            techPackAttachments: (p.techPackAttachments ?? []).map((a) =>
              a.attachmentId === id ? { ...a, ...patch } : a
            ),
          }))
        }
        onJournalLine={logTechPackZipLine}
        onPulseAction={appendTzPulse}
        sealActorLabel={updatedByLabel}
        cadZipReadiness={{
          techPackCount: factorySendHubPreview.techPackCount,
          techPackWithBytes: factorySendHubPreview.techPackWithBytes,
          nextZipBytesStepLabel:
            factorySendHubPreview.firstUnmet?.id === 'zip_bytes'
              ? factorySendHubPreview.firstUnmet.label
              : null,
        }}
        showDeferCommentUi={isPhase1 && !tzMinimalHideDeferCommentUi}
        deferredAttrIds={deferredAttrIds}
        toggleDeferAttribute={toggleDeferAttribute}
        openAttrComments={openAttrComments}
        attrCommentsById={attrCommentsById}
        categoryLeafId={currentLeaf.leafId}
        currentLeaf={currentLeaf}
        onGenerateMeasurements={() => {
          // Имитируем заполнение мерок из CAD файла
          setDossier((p) => {
            const l1 = currentLeaf?.l1Name?.toLowerCase() || '';
            const isShoes =
              currentLeaf?.leafId?.startsWith('catalog-shoes') ||
              l1.includes('обувь') ||
              l1.includes('shoes') ||
              l1.includes('footwear');
            const isBags =
              currentLeaf?.leafId?.startsWith('catalog-bags') ||
              l1.includes('сумки') ||
              l1.includes('bags');
            const newExtras = [...(p.sampleBaseExtraDimensions ?? [])];

            // Добавляем тестовые мерки в зависимости от категории
            if (isShoes && !newExtras.some((e) => e.label === 'Толщина подошвы (CAD)')) {
              newExtras.push({ id: crypto.randomUUID(), label: 'Толщина подошвы (CAD)' });
            } else if (isBags && !newExtras.some((e) => e.label === 'Длина ремешка (CAD)')) {
              newExtras.push({ id: crypto.randomUUID(), label: 'Длина ремешка (CAD)' });
            } else if (
              !isShoes &&
              !isBags &&
              !newExtras.some((e) => e.label === 'Ширина плеча (CAD)')
            ) {
              newExtras.push({ id: crypto.randomUUID(), label: 'Ширина плеча (CAD)' });
            }

            return {
              ...p,
              sampleBaseExtraDimensions: newExtras,
            };
          });
        }}
      />

      <div
        id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour}
        className="h-px w-full shrink-0 scroll-mt-24 overflow-hidden opacity-0"
        aria-hidden="true"
      />

      <div
        id={W2_VISUALS_SKETCH_ANCHOR_ID}
        className="border-border-default order-20 scroll-mt-24 space-y-3 rounded-xl border bg-white p-3 shadow-sm"
      >
        <div className="text-text-secondary border-border-subtle bg-bg-surface2/40 space-y-1 rounded-lg border border-dashed px-3 py-2 text-[11px] leading-snug">
          <p className="text-text-primary font-semibold">Скетч и визуальный контур модели</p>
          <p>
            Мастер-лист, листы вида, пины к атрибутам и BOM: здесь фиксируется геометрия и
            примечания для цеха. Заполнение связано с блоком лекал/CAD выше — при смене каталога
            проверьте метки и критичные пины.
          </p>
        </div>
        {isPhase1 ? (
          <Workshop2DossierConstructionSketchPhase1Workspace
            tzMinimalHideDeferCommentUi={tzMinimalHideDeferCommentUi}
            deferredAttrIds={deferredAttrIds}
            toggleDeferAttribute={toggleDeferAttribute}
            openAttrComments={openAttrComments}
            attrCommentsById={attrCommentsById}
            sketchPrimaryStatus={sketchPrimaryStatus}
            sketchWorkspaceTab={sketchWorkspaceTab}
            setSketchWorkspaceTab={setSketchWorkspaceTab}
            sketchWorkspaceStats={sketchWorkspaceStats}
            sketchEditsLocked={sketchEditsLocked}
            canOpenSketchFromToolbar={canOpenSketchFromToolbar}
            sketchSurface={sketchSurface}
            setSketchSurface={setSketchSurface}
            sketchSheetPickerId={sketchSheetPickerId}
            setSketchSheetPickerId={setSketchSheetPickerId}
            dossier={dossier}
            dossierViewProfile={dossierViewProfile}
            sketchPinLinkAudit={sketchPinLinkAudit}
            sketchMasterAnnotatorRef={sketchMasterAnnotatorRef}
            sketchSheetAnnotatorRef={sketchSheetAnnotatorRef}
            sketchMasterTemplateId={sketchMasterTemplateId}
            setSketchMasterTemplateId={setSketchMasterTemplateId}
            orgSketchTemplatesList={orgSketchTemplatesList}
            applyMasterSketchPinTemplate={applyMasterSketchPinTemplate}
            saveMasterSketchPinTemplate={saveMasterSketchPinTemplate}
            saveMasterSketchPinTemplateToOrg={saveMasterSketchPinTemplateToOrg}
            currentLeaf={currentLeaf}
            sketchAttributeOptions={sketchAttributeOptions}
            bomLinePickOptions={bomLinePickOptions}
            normalizedSketchSheets={normalizedSketchSheets}
            appendSketchSheetFromUpload={appendSketchSheetFromUpload}
            selectedAudienceId={selectedAudienceId}
            selectedAudienceLabel={selectedAudienceLabel}
            onNavigateWorkspaceTab={onNavigateToTab}
            onJumpToTzPanelSection={(sec) => onSelectTzSection(sec)}
            onNavigateSketchRouteStage={(st) =>
              onNavigateToTab?.(SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB[st])
            }
            setDossier={setDossier}
            skuDraft={skuDraft}
            nameDraft={nameDraft}
            updatedByLabel={updatedByLabel}
            collectionId={collectionId}
            visualsCatalogAttributeIdsForSketch={visualsCatalogAttributeIdsForSketch}
            visualsCatalogSketchLinksForPins={visualsCatalogSketchLinksForPins}
            onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
            orgSketchLibraryRevision={orgSketchLibraryRevision}
            setOrgSketchLibraryRevision={setOrgSketchLibraryRevision}
            subcategorySketchActiveLevel={subcategorySketchActiveLevel}
            setSubcategorySketchActiveLevel={setSubcategorySketchActiveLevel}
            branchLevelsDetailsOpen={branchLevelsDetailsOpen}
            setBranchLevelsDetailsOpen={setBranchLevelsDetailsOpen}
          />
        ) : (
          <Workshop2DossierConstructionSketchPhase23Panel
            sketchPrimaryStatus={sketchPrimaryStatus}
            sketchViewFloor={sketchViewFloor}
            setSketchFloorMode={setSketchFloorMode}
            lockedSketchFloorOnly={lockedSketchFloorOnly}
            tzWriteDisabled={tzWriteDisabled}
            copySketchFloorLink={copySketchFloorLink}
            saveSketchLabelsSnapshot={saveSketchLabelsSnapshot}
            sketchBundleBusy={sketchBundleBusy}
            exportSketchVisualBundleZip={exportSketchVisualBundleZip}
            setSketchPinLibraryOpen={setSketchPinLibraryOpen}
            sketchMasterTemplateId={sketchMasterTemplateId}
            setSketchMasterTemplateId={setSketchMasterTemplateId}
            sketchEditsLocked={sketchEditsLocked}
            dossier={dossier}
            setDossier={setDossier}
            orgSketchTemplatesList={orgSketchTemplatesList}
            applyMasterSketchPinTemplate={applyMasterSketchPinTemplate}
            saveMasterSketchPinTemplate={saveMasterSketchPinTemplate}
            saveMasterSketchPinTemplateToOrg={saveMasterSketchPinTemplateToOrg}
            currentLeaf={currentLeaf}
            sketchAttributeOptions={sketchAttributeOptions}
            selectedAudienceId={selectedAudienceId}
            selectedAudienceLabel={selectedAudienceLabel}
            onNavigateWorkspaceTab={onNavigateToTab}
            onJumpToTzPanelSection={(sec) => onSelectTzSection(sec)}
            onNavigateSketchRouteStage={(st) =>
              onNavigateToTab?.(SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB[st])
            }
            appendSketchSheetFromUpload={appendSketchSheetFromUpload}
            skuDraft={skuDraft}
            nameDraft={nameDraft}
            updatedByLabel={updatedByLabel}
            visualsCatalogAttributeIdsForSketch={visualsCatalogAttributeIdsForSketch}
            visualsCatalogSketchLinksForPins={visualsCatalogSketchLinksForPins}
            onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
          />
        )}
      </div>
      <div id="w2-visuals-hub" className="sr-only scroll-mt-24" aria-hidden />
      {visualsCatalogOnlyRows.length + visualsCatalogOnlyExtras.length > 0 ? (
        <div className="border-border-default scroll-mt-24 space-y-3 rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-text-muted text-[10px] font-semibold">Каталог · визуал</p>
          <Workshop2DossierSectionRows
            {...workshop2DossierSectionRowsSharedProps}
            rows={visualsCatalogOnlyRows}
            phase={currentPhase}
            extras={visualsCatalogOnlyExtras}
            opts={{
              flatCatalogGroups: true,
              fieldLayout: 'stack',
            }}
          />
        </div>
      ) : null}

      <Workshop2SmartRoutingPanel
        dossier={dossier}
        setDossier={setDossier}
        csvBasename={`${collectionId}-${(skuDraft || articleId).trim() || 'article'}`}
        disabled={tzWriteDisabled}
        routingHydrateKey={`${collectionId}:${articleId}`}
        categoryLeafId={currentLeaf.leafId}
        currentLeaf={currentLeaf}
      />

      {tzBlockersFooter}

      <Workshop2DossierPanelSectionTzSignoffBridge
        section="construction"
        dossier={dossier}
        sectionFillPct={sectionReadinessUi.construction?.pct ?? 0}
        tzWriteDisabled={tzWriteDisabled}
        tzSectionSignoffRevokeAllowed={tzSectionSignoffRevokeAllowed}
        sectionSignoffPassportPreviews={sectionSignoffPassportPreviews}
        sectionSignoffOrganizationLabel={sectionSignoffOrganizationLabel}
        updatedByLabel={updatedByLabel}
        sectionGateErrors={sectionGateErrorsById.construction}
        sectionSignoffProfileGateOk={sectionSignoffProfileGateOk}
        dvTzSignoffSides={dvTzSignoffSides}
        sectionSignoffSessionBrandOk={sectionSignoffSessionBrandOk}
        sectionSignoffSessionTechOk={sectionSignoffSessionTechOk}
        tzNotifyHighlightRowKey={tzNotifyHighlightRowKey}
        commitSectionSignoff={commitSectionSignoff}
        revokeSectionSignoff={revokeSectionSignoff}
        notifyStakeholdersForSectionSignoff={notifyStakeholdersForSectionSignoff}
        setSignoffDeadline={setSignoffDeadline}
        omitBrandNotifyUi
      />
      <div className="flex flex-col" aria-hidden="true">
        <div id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.export} className="h-px w-full scroll-mt-24" />
        <div id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.signoff} className="h-px w-full scroll-mt-24" />
      </div>
    </div>
  );
}
