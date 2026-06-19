'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Workshop2DossierMaterialSectionBody } from '@/components/brand/production/workshop2-phase1-dossier-panel-material-section-body';
import { Workshop2DossierPanelSectionTzSignoffBridge } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-tz-signoff-bridge';
import { Workshop2DossierSectionBodyAssignment } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-assignment';
import {
  Workshop2DossierSectionBodyConstruction,
  type Workshop2DossierSectionBodyConstructionProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-construction';
import { Workshop2DossierSectionBodyDefaultRows } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-default-rows';
import {
  Workshop2DossierSectionBodyGeneral,
  type Workshop2DossierSectionBodyGeneralProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-general';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

type MaterialBodyProps = ComponentProps<typeof Workshop2DossierMaterialSectionBody>;
/** Общий bundle строк — в панели одно поле `workshop2DossierSectionRowsSharedProps`, без дубля `sectionRowsShared`. */
type MaterialFields = Omit<MaterialBodyProps, 'tzSignoffStrip' | 'sectionRowsShared'>;

export type Workshop2Phase1DossierPanelSectionBodyProps = {
  activeSection: Workshop2TzSignoffSectionKey;
  onOpenPulse?: () => void;
  tzBlockersFooter: ReactNode;
} & Workshop2DossierSectionBodyGeneralProps &
  MaterialFields &
  Workshop2DossierSectionBodyConstructionProps &
  Omit<ComponentProps<typeof Workshop2DossierSectionBodyAssignment>, 'sectionRowsShared'> &
  Omit<ComponentProps<typeof Workshop2DossierSectionBodyDefaultRows>, 'sectionRowsShared'>;

/** Роутер тела панели ТЗ по активной секции (без изменения поведения относительно прежнего IIFE в панели). */
export function Workshop2Phase1DossierPanelSectionBody(
  props: Workshop2Phase1DossierPanelSectionBodyProps
) {
  const activeSectionStr = props.activeSection as string;
  if (
    activeSectionStr === 'time_and_action' ||
    activeSectionStr === 'sustainability' ||
    activeSectionStr === 'b2b_sales'
  ) {
    const where =
      activeSectionStr === 'time_and_action'
        ? 'шаг «План заказа» — блок «Сроки и календарь (T&A)».'
        : activeSectionStr === 'sustainability'
          ? 'шаг «Снабжение и закупка» — блок «Эко-след».'
          : 'шаг «План заказа» — блок «B2B и предзаказы».';
    return (
      <>
        <div className="border-border-subtle bg-bg-surface2 text-text-secondary space-y-2 rounded-xl border p-4 text-[12px] leading-relaxed">
          <p className="text-text-primary font-semibold">
            Раздел перенесён из технического задания
          </p>
          <p>
            Эта часть относится к следующему этапу разработки образца. Откройте в ленте разработки
            артикула: {where}
          </p>
        </div>
        {props.tzBlockersFooter}
      </>
    );
  }

  if (props.activeSection === 'general') {
    return (
      <Workshop2DossierSectionBodyGeneral
        sectionReadinessUi={props.sectionReadinessUi}
        sectionGateErrorsById={props.sectionGateErrorsById}
        currentPhase={props.currentPhase}
        isPhase1={props.isPhase1}
        isPhase2={props.isPhase2}
        tzMinimalModeBySection={props.tzMinimalModeBySection}
        setTzMinimalModeBySection={props.setTzMinimalModeBySection}
        dossier={props.dossier}
        setDossier={props.setDossier}
        passportHubModel={props.passportHubModel}
        skuDraft={props.skuDraft}
        setSkuDraft={props.setSkuDraft}
        nameDraft={props.nameDraft}
        setNameDraft={props.setNameDraft}
        internalArticleCode={props.internalArticleCode}
        passportCategoryCaption={props.passportCategoryCaption}
        setActivePassportSubNavId={props.setActivePassportSubNavId}
        tzScrollBehavior={props.tzScrollBehavior}
        appendPassportPostSignoffJournalNote={props.appendPassportPostSignoffJournalNote}
        passportDriftLogDone={props.passportDriftLogDone}
        setPassportDriftLogDone={props.setPassportDriftLogDone}
        tzWriteDisabled={props.tzWriteDisabled}
        jumpToTzSectionAnchor={props.jumpToTzSectionAnchor}
        jumpToMaterialMatTable={props.jumpToMaterialMatTable}
        jumpToSketchLineRefs={props.jumpToSketchLineRefs}
        jumpToConstructionContour={props.jumpToConstructionContour}
        jumpToQcArticleSection={props.jumpToQcArticleSection}
        onNavigateToTab={props.onNavigateToTab}
        dossierViewProfile={props.dossierViewProfile}
        passportCriticalAuditSummaries={props.passportCriticalAuditSummaries}
        workshop2FactoryShareUrl={props.workshop2FactoryShareUrl}
        sketchBomRefsUnion={props.sketchBomRefsUnion}
        matSketchBomGapRefs={props.matSketchBomGapRefs}
        audiences={props.audiences}
        selectedAudienceId={props.selectedAudienceId}
        onAudienceSelect={props.onAudienceSelect}
        l1Opts={props.l1Opts}
        l2Opts={props.l2Opts}
        l3Opts={props.l3Opts}
        currentLeaf={props.currentLeaf}
        onL1Select={props.onL1Select}
        onL2Select={props.onL2Select}
        onL3Select={props.onL3Select}
        commitSku={props.commitSku}
        commitName={props.commitName}
        tzMinimalHideDeferCommentUi={props.tzMinimalHideDeferCommentUi}
        deferredAttrIds={props.deferredAttrIds}
        toggleDeferAttribute={props.toggleDeferAttribute}
        attrCommentsById={props.attrCommentsById}
        openAttrComments={props.openAttrComments}
        passportSewingPlanStartRows={props.passportSewingPlanStartRows}
        passportSewingPlanStartExtras={props.passportSewingPlanStartExtras}
        workshop2DossierSectionRowsSharedProps={props.workshop2DossierSectionRowsSharedProps}
        saveDraft={props.saveDraft}
        updatedByLabel={props.updatedByLabel}
        sectionRowsCurrent={props.sectionRowsCurrent}
        allowMultiHandbook={props.allowMultiHandbook}
        patchColor={props.patchColor}
        onSetHandbookParametersWithColorBundleSync={
          props.onSetHandbookParametersWithColorBundleSync
        }
        onSetHandbookParameters={props.onSetHandbookParameters}
        onFreeTextSide={props.onFreeTextSide}
        showPhase1PassportArticleCard={props.showPhase1PassportArticleCard}
        passportArticleCardStartRows={props.passportArticleCardStartRows}
        passportArticleCardStartExtras={props.passportArticleCardStartExtras}
        generalPassportPreSampleRows={props.generalPassportPreSampleRows}
        generalPassportPreSampleExtras={props.generalPassportPreSampleExtras}
        passportStep1BriefHref={props.passportStep1BriefHref}
        articleSku={props.articleSku}
        dvTzSignoffSides={props.dvTzSignoffSides}
        sectionSignoffPassportPreviews={props.sectionSignoffPassportPreviews}
        sectionSignoffOrganizationLabel={props.sectionSignoffOrganizationLabel}
        sectionSignoffProfileGateOk={props.sectionSignoffProfileGateOk}
        sectionSignoffSessionBrandOk={props.sectionSignoffSessionBrandOk}
        sectionSignoffSessionTechOk={props.sectionSignoffSessionTechOk}
        tzSectionSignoffRevokeAllowed={props.tzSectionSignoffRevokeAllowed}
        tzNotifyHighlightRowKey={props.tzNotifyHighlightRowKey}
        commitSectionSignoff={props.commitSectionSignoff}
        revokeSectionSignoff={props.revokeSectionSignoff}
        notifyStakeholdersForSectionSignoff={props.notifyStakeholdersForSectionSignoff}
        setSignoffDeadline={props.setSignoffDeadline}
        tzBlockersFooter={props.tzBlockersFooter}
        collectionId={props.collectionId}
        articleId={props.articleId}
      />
    );
  }

  if (props.activeSection === 'material') {
    return (
      <Workshop2DossierMaterialSectionBody
        currentLeaf={props.currentLeaf}
        sectionRowsShared={props.workshop2DossierSectionRowsSharedProps}
        sectionRowsCurrent={props.sectionRowsCurrent}
        currentPhase={props.currentPhase}
        dossier={props.dossier}
        setDossier={props.setDossier}
        tzWriteDisabled={props.tzWriteDisabled}
        tzBlockersFooter={props.tzBlockersFooter}
        tzSignoffStrip={
          <Workshop2DossierPanelSectionTzSignoffBridge
            section="material"
            dossier={props.dossier}
            sectionFillPct={props.sectionReadinessUi.material?.pct ?? 0}
            tzWriteDisabled={props.tzWriteDisabled}
            tzSectionSignoffRevokeAllowed={props.tzSectionSignoffRevokeAllowed}
            sectionSignoffPassportPreviews={props.sectionSignoffPassportPreviews}
            sectionSignoffOrganizationLabel={props.sectionSignoffOrganizationLabel}
            updatedByLabel={props.updatedByLabel}
            sectionGateErrors={props.sectionGateErrorsById.material}
            sectionSignoffProfileGateOk={props.sectionSignoffProfileGateOk}
            dvTzSignoffSides={props.dvTzSignoffSides}
            sectionSignoffSessionBrandOk={props.sectionSignoffSessionBrandOk}
            sectionSignoffSessionTechOk={props.sectionSignoffSessionTechOk}
            tzNotifyHighlightRowKey={props.tzNotifyHighlightRowKey}
            commitSectionSignoff={props.commitSectionSignoff}
            revokeSectionSignoff={props.revokeSectionSignoff}
            notifyStakeholdersForSectionSignoff={props.notifyStakeholdersForSectionSignoff}
            setSignoffDeadline={props.setSignoffDeadline}
          />
        }
      />
    );
  }

  if (props.activeSection === 'construction') {
    return (
      <Workshop2DossierSectionBodyConstruction
        sectionReadinessUi={props.sectionReadinessUi}
        sectionGateErrorsById={props.sectionGateErrorsById}
        currentPhase={props.currentPhase}
        tzMinimalConstruction={props.tzMinimalModeBySection.construction}
        onToggleTzMinimalConstruction={() =>
          props.setTzMinimalModeBySection((prev) => ({
            ...prev,
            construction: !prev.construction,
          }))
        }
        dossier={props.dossier}
        setDossier={props.setDossier}
        tzBlockersFooter={props.tzBlockersFooter}
        tzWriteDisabled={props.tzWriteDisabled}
        currentLeaf={props.currentLeaf}
        sectionRowsCurrent={props.sectionRowsCurrent}
        extraRowsCurrent={props.extraRowsCurrent}
        renderPhaseRow={props.renderPhaseRow}
        dossierAttrCardCtx={props.dossierAttrCardCtx}
        workshop2DossierSectionRowsSharedProps={props.workshop2DossierSectionRowsSharedProps}
        collectionId={props.collectionId}
        articleId={props.articleId}
        skuDraft={props.skuDraft}
        techPackSessionBlobById={props.techPackSessionBlobById}
        setTechPackSessionBlobById={props.setTechPackSessionBlobById}
        logTechPackZipLine={props.logTechPackZipLine}
        appendTzPulse={props.appendTzPulse}
        updatedByLabel={props.updatedByLabel}
        factorySendHubPreview={props.factorySendHubPreview}
        isPhase1={props.isPhase1}
        tzMinimalHideDeferCommentUi={props.tzMinimalHideDeferCommentUi}
        deferredAttrIds={props.deferredAttrIds}
        toggleDeferAttribute={props.toggleDeferAttribute}
        openAttrComments={props.openAttrComments}
        attrCommentsById={props.attrCommentsById}
        sketchViewFloor={props.sketchViewFloor}
        showVisualSketchLinkFieldsNav={props.showVisualSketchLinkFieldsNav}
        sketchPinLinkAudit={props.sketchPinLinkAudit}
        sketchTechGaps={props.sketchTechGaps}
        jumpToSketchLineRefs={props.jumpToSketchLineRefs}
        setSketchWorkspaceTab={props.setSketchWorkspaceTab}
        setSketchSurface={props.setSketchSurface}
        sketchMasterAnnotatorRef={props.sketchMasterAnnotatorRef}
        sketchSheetAnnotatorRef={props.sketchSheetAnnotatorRef}
        canOpenSketchFromToolbar={props.canOpenSketchFromToolbar}
        sketchEditsLocked={props.sketchEditsLocked}
        sketchSurface={props.sketchSurface}
        sketchWorkspaceTab={props.sketchWorkspaceTab}
        sketchWorkspaceStats={props.sketchWorkspaceStats}
        sketchSheetPickerId={props.sketchSheetPickerId}
        setSketchSheetPickerId={props.setSketchSheetPickerId}
        dossierViewProfile={props.dossierViewProfile}
        sketchMasterTemplateId={props.sketchMasterTemplateId}
        setSketchMasterTemplateId={props.setSketchMasterTemplateId}
        orgSketchTemplatesList={props.orgSketchTemplatesList}
        applyMasterSketchPinTemplate={props.applyMasterSketchPinTemplate}
        saveMasterSketchPinTemplate={props.saveMasterSketchPinTemplate}
        saveMasterSketchPinTemplateToOrg={props.saveMasterSketchPinTemplateToOrg}
        sketchAttributeOptions={props.sketchAttributeOptions}
        bomLinePickOptions={props.bomLinePickOptions}
        normalizedSketchSheets={props.normalizedSketchSheets}
        appendSketchSheetFromUpload={props.appendSketchSheetFromUpload}
        selectedAudienceId={props.selectedAudienceId}
        selectedAudienceLabel={props.selectedAudienceLabel}
        onNavigateToTab={props.onNavigateToTab}
        onSelectTzSection={props.onSelectTzSection}
        nameDraft={props.nameDraft}
        visualsCatalogAttributeIdsForSketch={props.visualsCatalogAttributeIdsForSketch}
        visualsCatalogSketchLinksForPins={props.visualsCatalogSketchLinksForPins}
        onVisualCatalogSuggestFromSketch={props.onVisualCatalogSuggestFromSketch}
        orgSketchLibraryRevision={props.orgSketchLibraryRevision}
        setOrgSketchLibraryRevision={props.setOrgSketchLibraryRevision}
        subcategorySketchActiveLevel={props.subcategorySketchActiveLevel}
        setSubcategorySketchActiveLevel={props.setSubcategorySketchActiveLevel}
        branchLevelsDetailsOpen={props.branchLevelsDetailsOpen}
        setBranchLevelsDetailsOpen={props.setBranchLevelsDetailsOpen}
        setSketchFloorMode={props.setSketchFloorMode}
        lockedSketchFloorOnly={props.lockedSketchFloorOnly}
        copySketchFloorLink={props.copySketchFloorLink}
        saveSketchLabelsSnapshot={props.saveSketchLabelsSnapshot}
        sketchBundleBusy={props.sketchBundleBusy}
        exportSketchVisualBundleZip={props.exportSketchVisualBundleZip}
        setSketchPinLibraryOpen={props.setSketchPinLibraryOpen}
        visualsCatalogOnlyRows={props.visualsCatalogOnlyRows}
        visualsCatalogOnlyExtras={props.visualsCatalogOnlyExtras}
        dvTzSignoffSides={props.dvTzSignoffSides}
        sectionSignoffPassportPreviews={props.sectionSignoffPassportPreviews}
        sectionSignoffOrganizationLabel={props.sectionSignoffOrganizationLabel}
        sectionSignoffProfileGateOk={props.sectionSignoffProfileGateOk}
        sectionSignoffSessionBrandOk={props.sectionSignoffSessionBrandOk}
        sectionSignoffSessionTechOk={props.sectionSignoffSessionTechOk}
        tzSectionSignoffRevokeAllowed={props.tzSectionSignoffRevokeAllowed}
        tzNotifyHighlightRowKey={props.tzNotifyHighlightRowKey}
        commitSectionSignoff={props.commitSectionSignoff}
        revokeSectionSignoff={props.revokeSectionSignoff}
        notifyStakeholdersForSectionSignoff={props.notifyStakeholdersForSectionSignoff}
        setSignoffDeadline={props.setSignoffDeadline}
      />
    );
  }

  if (props.activeSection === 'assignment') {
    return (
      <Workshop2DossierSectionBodyAssignment
        onOpenProblemBlock={props.onOpenProblemBlock}
        sampleIntakeCatalogRows={props.sampleIntakeCatalogRows}
        sampleIntakeCatalogExtras={props.sampleIntakeCatalogExtras}
        sectionRowsShared={props.workshop2DossierSectionRowsSharedProps}
        currentPhase={props.currentPhase}
        sendPanelProps={props.sendPanelProps}
        handoffBlockProps={props.handoffBlockProps}
        articleId={props.articleId}
        collectionId={props.collectionId}
        dossier={props.dossier}
        setDossier={props.setDossier}
        onOpenPulse={props.onOpenPulse}
        tzBlockersFooter={props.tzBlockersFooter}
      />
    );
  }

  return (
    <>
      <Workshop2DossierSectionBodyDefaultRows
        sectionRowsShared={props.workshop2DossierSectionRowsSharedProps}
        sectionRowsCurrent={props.sectionRowsCurrent}
        currentPhase={props.currentPhase}
      />
      {props.tzBlockersFooter}
    </>
  );
}
