'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Workshop2PassportHubPanel } from '@/components/brand/production/Workshop2PassportHubPanel';
import { Workshop2DossierPanelSectionTzSignoffBridge } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-tz-signoff-bridge';
import { Workshop2DossierGeneralIdentityBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-general-identity';
import { Workshop2ChangeRequestsPanel } from '@/components/brand/production/workshop2-change-requests-panel';
import { Workshop2DossierGeneralDesignVisualBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-general-design-visual';
import { Workshop2DossierGeneralArticleStartBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-general-article-start';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsExtra,
  type Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import {
  formatWorkshop2InternalArticleCodePlaceholder,
  isWorkshop2InternalArticleCodeValid,
} from '@/lib/production/local-collection-inventory';
import { dossierUpdatedAfterLatestTzSignoff } from '@/lib/production/workshop2-tz-signoff-audit';
import { type Workshop2PassportHubModel } from '@/lib/production/workshop2-passport-check';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type {
  Workshop2DossierPhase1,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';
export type Workshop2DossierSectionBodyGeneralProps = {
  sectionReadinessUi: Record<DossierSection, { pct: number }>;
  sectionGateErrorsById: Record<DossierSection, string[]>;
  currentPhase: '1' | '2' | '3';
  isPhase1: boolean;
  isPhase2: boolean;
  tzMinimalModeBySection: Record<DossierSection, boolean>;
  setTzMinimalModeBySection: Dispatch<SetStateAction<Record<DossierSection, boolean>>>;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  passportHubModel: Workshop2PassportHubModel;
  skuDraft: string;
  setSkuDraft: Dispatch<SetStateAction<string>>;
  nameDraft: string;
  setNameDraft: Dispatch<SetStateAction<string>>;
  internalArticleCode?: string;
  passportCategoryCaption: string;
  setActivePassportSubNavId: Dispatch<SetStateAction<string | null>>;
  tzScrollBehavior: ScrollBehavior;
  appendPassportPostSignoffJournalNote: () => void;
  passportDriftLogDone: boolean;
  setPassportDriftLogDone: Dispatch<SetStateAction<boolean>>;
  tzWriteDisabled: boolean;
  jumpToTzSectionAnchor: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  jumpToMaterialMatTable: () => void;
  jumpToSketchLineRefs: () => void;
  jumpToConstructionContour: () => void;
  jumpToQcArticleSection: () => void;
  onNavigateToTab?: (
    tab: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock',
    opts?: { dossierSection?: DossierSection; scrollDomId?: string }
  ) => void;
  dossierViewProfile: Workshop2DossierViewProfile;
  passportCriticalAuditSummaries: readonly { id: string; messages: readonly string[] }[];
  workshop2FactoryShareUrl: string;
  sketchBomRefsUnion: readonly string[];
  matSketchBomGapRefs: readonly string[];
  audiences: { id: string; name: string }[];
  selectedAudienceId: string;
  onAudienceSelect: (audienceId: string) => void;
  l1Opts: string[];
  l2Opts: string[];
  l3Opts: string[];
  currentLeaf: HandbookCategoryLeaf;
  onL1Select: (l1: string) => void;
  onL2Select: (l2: string) => void;
  onL3Select: (l3: string) => void;
  commitSku: () => void;
  commitName: () => void;
  tzMinimalHideDeferCommentUi: boolean;
  deferredAttrIds: Set<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  openAttrComments: (blockId: string) => void;
  passportSewingPlanStartRows: ResolvedPhase1AttributeRow[];
  passportSewingPlanStartExtras: Workshop2DossierSectionRowsExtra[];
  workshop2DossierSectionRowsSharedProps: Workshop2DossierSectionRowsSharedBundle;
  saveDraft: () => void;
  updatedByLabel: string;
  sectionRowsCurrent: ResolvedPhase1AttributeRow[];
  allowMultiHandbook: boolean;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  onSetHandbookParametersWithColorBundleSync: (
    id: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onSetHandbookParameters: (
    id: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  showPhase1PassportArticleCard: boolean;
  passportArticleCardStartRows: ResolvedPhase1AttributeRow[];
  passportArticleCardStartExtras: Workshop2DossierSectionRowsExtra[];
  generalPassportPreSampleRows: ResolvedPhase1AttributeRow[];
  generalPassportPreSampleExtras: Workshop2DossierSectionRowsExtra[];
  passportStep1BriefHref: string;
  articleSku: string;
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
  onOpenPulse?: () => void;
  tzBlockersFooter: ReactNode;
};

export function Workshop2DossierSectionBodyGeneral({
  sectionReadinessUi,
  sectionGateErrorsById,
  currentPhase,
  isPhase1,
  isPhase2,
  tzMinimalModeBySection,
  setTzMinimalModeBySection,
  dossier,
  setDossier,
  passportHubModel,
  skuDraft,
  setSkuDraft,
  nameDraft,
  setNameDraft,
  internalArticleCode,
  passportCategoryCaption,
  setActivePassportSubNavId,
  tzScrollBehavior,
  appendPassportPostSignoffJournalNote,
  passportDriftLogDone,
  setPassportDriftLogDone,
  tzWriteDisabled,
  jumpToTzSectionAnchor,
  jumpToMaterialMatTable,
  jumpToSketchLineRefs,
  jumpToConstructionContour,
  jumpToQcArticleSection,
  onNavigateToTab,
  dossierViewProfile,
  passportCriticalAuditSummaries,
  workshop2FactoryShareUrl,
  sketchBomRefsUnion,
  matSketchBomGapRefs,
  audiences,
  selectedAudienceId,
  onAudienceSelect,
  l1Opts,
  l2Opts,
  l3Opts,
  currentLeaf,
  onL1Select,
  onL2Select,
  onL3Select,
  commitSku,
  commitName,
  tzMinimalHideDeferCommentUi,
  deferredAttrIds,
  toggleDeferAttribute,
  attrCommentsById,
  openAttrComments,
  passportSewingPlanStartRows,
  passportSewingPlanStartExtras,
  workshop2DossierSectionRowsSharedProps,
  saveDraft,
  updatedByLabel,
  sectionRowsCurrent,
  allowMultiHandbook,
  patchColor,
  onSetHandbookParametersWithColorBundleSync,
  onSetHandbookParameters,
  onFreeTextSide,
  showPhase1PassportArticleCard,
  passportArticleCardStartRows,
  passportArticleCardStartExtras,
  generalPassportPreSampleRows,
  generalPassportPreSampleExtras,
  passportStep1BriefHref,
  articleSku,
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
}: Workshop2DossierSectionBodyGeneralProps) {
  return (
    <div className="space-y-4">
      <>
        {isPhase1 ? (
          <div id="w2-passport-hub" className="sr-only" aria-hidden="true" />
        ) : (
          <Workshop2PassportHubPanel
            model={passportHubModel}
            skuDraft={skuDraft}
            nameDraft={nameDraft}
            internalArticleCodeDisplay={
              isWorkshop2InternalArticleCodeValid(internalArticleCode)
                ? internalArticleCode
                : formatWorkshop2InternalArticleCodePlaceholder()
            }
            categoryPathLabel={passportCategoryCaption}
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
            onJumpToVisualSection={() =>
              jumpToTzSectionAnchor('general', 'w2-passport-design-intent')
            }
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
          />
        )}
      </>

      {/* Панель Change Requests (CR) */}
      <Workshop2ChangeRequestsPanel
        dossier={dossier}
        setDossier={setDossier}
        tzWriteDisabled={tzWriteDisabled}
      />

      <Workshop2DossierGeneralIdentityBlock
        isPhase1={isPhase1}
        isPhase2={isPhase2}
        dossier={dossier}
        setDossier={setDossier}
        internalArticleCode={internalArticleCode}
        skuDraft={skuDraft}
        setSkuDraft={setSkuDraft}
        nameDraft={nameDraft}
        setNameDraft={setNameDraft}
        audiences={audiences}
        selectedAudienceId={selectedAudienceId}
        onAudienceSelect={onAudienceSelect}
        l1Opts={l1Opts}
        l2Opts={l2Opts}
        l3Opts={l3Opts}
        currentLeaf={currentLeaf}
        onL1Select={onL1Select}
        onL2Select={onL2Select}
        onL3Select={onL3Select}
        commitSku={commitSku}
        commitName={commitName}
        tzMinimalHideDeferCommentUi={tzMinimalHideDeferCommentUi}
        deferredAttrIds={deferredAttrIds}
        toggleDeferAttribute={toggleDeferAttribute}
        attrCommentsById={attrCommentsById}
        openAttrComments={openAttrComments}
        passportSewingPlanStartRows={passportSewingPlanStartRows}
        passportSewingPlanStartExtras={passportSewingPlanStartExtras}
        workshop2DossierSectionRowsSharedProps={workshop2DossierSectionRowsSharedProps}
        currentPhase={currentPhase}
        tzWriteDisabled={tzWriteDisabled}
        articleSku={articleSku}
        passportCategoryCaption={passportCategoryCaption}
      />
      <Workshop2DossierGeneralDesignVisualBlock
        isPhase1={isPhase1}
        dossier={dossier}
        setDossier={setDossier}
        saveDraft={saveDraft}
        updatedByLabel={updatedByLabel}
        sectionRowsCurrent={sectionRowsCurrent}
        currentLeaf={currentLeaf}
        currentPhase={currentPhase}
        allowMultiHandbook={allowMultiHandbook}
        patchColor={patchColor}
        onSetHandbookParametersWithColorBundleSync={onSetHandbookParametersWithColorBundleSync}
        onSetHandbookParameters={onSetHandbookParameters}
        onFreeTextSide={onFreeTextSide}
        tzMinimalModeBySection={tzMinimalModeBySection}
        deferredAttrIds={deferredAttrIds}
        toggleDeferAttribute={toggleDeferAttribute}
        attrCommentsById={attrCommentsById}
        openAttrComments={openAttrComments}
      />
      <Workshop2DossierGeneralArticleStartBlock
        isPhase1={isPhase1}
        showPhase1PassportArticleCard={showPhase1PassportArticleCard}
        passportHubModel={passportHubModel}
        currentPhase={currentPhase}
        workshop2DossierSectionRowsSharedProps={workshop2DossierSectionRowsSharedProps}
        passportArticleCardStartRows={passportArticleCardStartRows}
        passportArticleCardStartExtras={passportArticleCardStartExtras}
        generalPassportPreSampleRows={generalPassportPreSampleRows}
        generalPassportPreSampleExtras={generalPassportPreSampleExtras}
        passportSewingPlanStartRows={passportSewingPlanStartRows}
        passportSewingPlanStartExtras={passportSewingPlanStartExtras}
        passportStep1BriefHref={passportStep1BriefHref}
      />
      {tzBlockersFooter}
      <Workshop2DossierPanelSectionTzSignoffBridge
        section="general"
        dossier={dossier}
        sectionFillPct={sectionReadinessUi.general?.pct ?? 0}
        tzWriteDisabled={tzWriteDisabled}
        tzSectionSignoffRevokeAllowed={tzSectionSignoffRevokeAllowed}
        sectionSignoffPassportPreviews={sectionSignoffPassportPreviews}
        sectionSignoffOrganizationLabel={sectionSignoffOrganizationLabel}
        updatedByLabel={updatedByLabel}
        sectionGateErrors={sectionGateErrorsById.general}
        sectionSignoffProfileGateOk={sectionSignoffProfileGateOk}
        dvTzSignoffSides={dvTzSignoffSides}
        sectionSignoffSessionBrandOk={sectionSignoffSessionBrandOk}
        sectionSignoffSessionTechOk={sectionSignoffSessionTechOk}
        tzNotifyHighlightRowKey={tzNotifyHighlightRowKey}
        commitSectionSignoff={commitSectionSignoff}
        revokeSectionSignoff={revokeSectionSignoff}
        notifyStakeholdersForSectionSignoff={notifyStakeholdersForSectionSignoff}
        setSignoffDeadline={setSignoffDeadline}
      />
    </div>
  );
}

/* PG chip */
<span data-testid="workshop2-tz-general-pg-chip">
  <Workshop2OperationalPgMirrorChip {...summarizeWorkshop2TzGeneralPgMirror(dossier)} />
</span>;

void formatWorkshop2PersistToastTitle;
void formatWorkshop2PersistToastDescription;
