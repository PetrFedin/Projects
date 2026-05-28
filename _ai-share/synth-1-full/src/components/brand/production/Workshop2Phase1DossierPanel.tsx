'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import * as LucideIcons from 'lucide-react';
import {
  defaultSizeScaleIdForLeaf,
  getAttributeById,
  resolveEffectiveParametersForLeaf,
} from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import { getWorkshopDimensionLabels } from '@/lib/production/workshop-size-handbook';
import {
  formatWorkshop2InternalArticleCodePlaceholder,
  isWorkshop2InternalArticleCodeValid,
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
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import {
  buildWorkshop2VisualGateItems,
  W2_VISUAL_SUBPAGE_ANCHORS,
} from '@/lib/production/workshop2-visual-section-warnings';
import {
  effectiveMoqTargetMaxPieces,
  emptyWorkshop2DossierPhase1,
  estimateWorkshop2Phase1DossierJsonUtf8Bytes,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildBomLinePickOptions } from '@/lib/production/workshop2-collection-dossier-analytics';
import {
  workshopTzAssigneeOrganizationName,
  workshopTzExtraRowsRequiringTzSignoff,
  workshopTzSignerAllowed,
  workshopTzSignoffRequiredForRole,
} from '@/lib/production/workshop2-tz-signatory-options';
import { W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE } from '@/lib/production/workshop2-tz-rbac-hints';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1AttributeAssignment,
  Workshop2Phase1AttributeValue,
  Workshop2PassportDeadlineCriticality,
  Workshop2PassportPlannedLaunchType,
  Workshop2SketchLabelsSnapshot,
  Workshop2TzActionLogPayload,
  Workshop2TzSignoffSectionKey,
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
  parseMatRowsFromDossier,
  type MatPctRow,
} from '@/lib/production/workshop2-material-mat-rows';
import {
  buildPassportHubModel,
  partitionGeneralPassportExtras,
  partitionGeneralPassportRows,
  passportCheckpointTitleClass,
  PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS,
} from '@/lib/production/workshop2-passport-check';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { useAuth } from '@/providers/auth-provider';
import type { Workshop2DossierMetricsFlushContext } from '@/lib/production/workshop2-dossier-metrics-ingest';
import { workshop2SketchTechnologistGaps } from '@/lib/production/workshop2-sketch-technologist-gaps';
import { W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';
import { useWorkshop2DossierView } from '@/components/brand/production/workshop2-dossier-view-context';
import {
  isWorkshop2DossierViewPrimarySection,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import { WORKSHOP2_TZ_DIGITAL_SIGNOFF_DEFAULT_CAPABILITIES } from '@/lib/production/workshop2-tz-digital-signoff';
import { useToast } from '@/hooks/use-toast';
import { useRbac } from '@/hooks/useRbac';
import type { CategorySketchAnnotatorHandle } from '@/components/brand/production/CategorySketchAnnotator';
import {
  createEmptySketchSheet,
  defaultExtraSketchSheetTitle,
  MAX_SKETCH_SHEETS,
  normalizeSketchSheets,
} from '@/lib/production/workshop2-sketch-sheets';
import {
  isWorkshop2TzSectionTabDoneForUi,
  W2_SECTION_SIGNOFF_PCT_THRESHOLD,
  W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF,
} from '@/components/brand/production/Workshop2TzSectionTabIndicator';
import { isWorkshop2TzSectionFullySigned } from '@/lib/production/workshop2-tz-signoff-complete';
import { workshop2TzSectionSignoffByLabelMeaningful } from '@/lib/production/workshop2-tz-signoff-actor';
import { useWorkshop2Phase1DossierTzTraceAndPreflight } from '@/components/brand/production/use-workshop2-phase1-dossier-tz-trace-and-preflight';
import { Workshop2DossierTzBlockersFooter } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-blockers-footer';
import {
  buildWorkshop2FinalTzSpecDocumentHtml,
  downloadWorkshop2FinalTzSpecHtmlFile,
  openWorkshop2FinalTzSpecPrintWindow,
  type Workshop2FinalTzSpecExportContext,
} from '@/lib/production/workshop2-final-tz-spec-export';
import { isSketchFloorOnlyRole } from '@/lib/production/sketch-floor-rbac';
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
  sketchPinBelongsToLeaf,
} from '@/lib/production/workshop2-sketch-pin-templates';
import { restoreSketchLabelsSnapshot } from '@/lib/production/workshop2-sketch-snapshots';
import { bomRefsUnionFromSketchSurfaces } from '@/lib/production/sketch-bom-integrity';
import { resolveMatSketchBomGapRefs } from '@/lib/production/workshop2-mat-sketch-bom-crosscheck';
import {
  calculateWorkshopTzSectionCompletion,
  getWorkshopTzSectionForAttribute as getSectionForAttr,
  getWorkshopTzSectionStatusLabel,
  resolveWorkshop2TechPackHandoffChecklistRow,
} from '@/lib/production/workshop2-tz-section-readiness';
import {
  buildWorkshop2TzGateSnapshot,
  type Workshop2TzGateCommentLike,
} from '@/lib/production/workshop2-tz-gates';
import { WORKSHOP_FIELD_LABEL_CLASS } from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';
import { buildWorkshop2TzDigitalSignoffRows } from '@/components/brand/production/workshop2-phase1-dossier-panel-build-tz-digital-signoff-rows';
import { useWorkshop2Phase1DossierAudienceAndAttributeRows } from '@/components/brand/production/use-workshop2-phase1-dossier-audience-and-attribute-rows';
import { useWorkshop2Phase1DossierSketchSheetsToolbar } from '@/components/brand/production/use-workshop2-phase1-dossier-sketch-sheets-toolbar';
import { useWorkshop2Phase1DossierBranchSlotSketchUi } from '@/components/brand/production/use-workshop2-phase1-dossier-branch-slot-sketch-ui';
import { useWorkshop2Phase1DossierAttrGroupUi } from '@/components/brand/production/use-workshop2-phase1-dossier-attr-group-ui';
import { useWorkshop2Phase1DossierSketchFloorMode } from '@/components/brand/production/use-workshop2-phase1-dossier-sketch-floor-mode';
import { useWorkshop2Phase1DossierPassportSubnavScrollSpy } from '@/components/brand/production/use-workshop2-phase1-dossier-passport-subnav-scroll-spy';
import { useWorkshop2Phase1DossierSketchVisualCatalogHighlights } from '@/components/brand/production/use-workshop2-phase1-dossier-sketch-visual-catalog-highlights';
import { useWorkshop2Phase1DossierMainColumnFlash } from '@/components/brand/production/use-workshop2-phase1-dossier-main-column-flash';
import { useWorkshop2Phase1DossierSessionMetricsUi } from '@/components/brand/production/use-workshop2-phase1-dossier-session-metrics-ui';
import { useWorkshop2Phase1DossierArticleLineDrafts } from '@/components/brand/production/use-workshop2-phase1-dossier-article-line-drafts';
import { useWorkshop2Phase1DossierTzMinimalMode } from '@/components/brand/production/use-workshop2-phase1-dossier-tz-minimal-mode';
import { useWorkshop2Phase1DossierFieldDeferralActions } from '@/components/brand/production/use-workshop2-phase1-dossier-field-deferral';
import {
  registerWorkshop2Phase1TechPackSessionBlobSetter,
  useWorkshop2Phase1DossierTechPackBlobResetOnArticleChange,
} from '@/components/brand/production/use-workshop2-phase1-dossier-tech-pack-blob-reset-on-article-change';
import { useWorkshop2Phase1DossierTzScrollBehavior } from '@/components/brand/production/use-workshop2-phase1-dossier-tz-scroll-behavior';
import { useWorkshop2Phase1DossierJumpToTzSectionAnchor } from '@/components/brand/production/use-workshop2-phase1-dossier-jump-to-tz-section-anchor';
import { useWorkshop2Phase1DossierWriteGuardedSetDossier } from '@/components/brand/production/use-workshop2-phase1-dossier-write-guarded-set-dossier';
import { useWorkshop2Phase1DossierPersist } from '@/components/brand/production/use-workshop2-phase1-dossier-persist';
import { useWorkshop2Phase1DossierPassportDriftLogResetOnArticleId } from '@/components/brand/production/use-workshop2-phase1-dossier-passport-drift-log-reset-on-article-id';
import { useWorkshop2Phase1DossierAttrCommentsOpenBridge } from '@/components/brand/production/use-workshop2-phase1-dossier-attr-comments-open-bridge';
import { useWorkshop2Phase1DossierHydrateFromStorage } from '@/components/brand/production/use-workshop2-phase1-dossier-hydrate-from-storage';
import { useWorkshop2Phase1DossierLeafCatalogSyncEffects } from '@/components/brand/production/use-workshop2-phase1-dossier-leaf-catalog-sync-effects';
import { useWorkshop2Phase1DossierViewProfileSectionSyncEffect } from '@/components/brand/production/use-workshop2-phase1-dossier-view-profile-section-sync-effect';
import { useWorkshop2Phase1DossierMaterialComplianceSessionHydrate } from '@/components/brand/production/use-workshop2-phase1-dossier-material-compliance-session-hydrate';
import { useWorkshop2Phase1DossierTzBlockCommentMetricsEffect } from '@/components/brand/production/use-workshop2-phase1-dossier-tz-block-comment-metrics-effect';
import { useWorkshop2Phase1DossierW2SessionMetricRecordEffects } from '@/components/brand/production/use-workshop2-phase1-dossier-w2-session-metric-record-effects';
import { useWorkshop2Phase1DossierTzFocusAndHashScrollEffects } from '@/components/brand/production/use-workshop2-phase1-dossier-tz-focus-and-hash-scroll-effects';
import { useWorkshop2Phase1DossierHandbookCheckReportExpansionEffects } from '@/components/brand/production/use-workshop2-phase1-dossier-handbook-check-report-expansion-effects';
import { useWorkshop2Phase1DossierHandbookCheckSnapshotResetOnActiveSection } from '@/components/brand/production/use-workshop2-phase1-dossier-handbook-check-snapshot-reset-on-active-section';
import { useWorkshop2Phase1DossierTzNotifyHighlightResetOnArticleChange } from '@/components/brand/production/use-workshop2-phase1-dossier-tz-notify-highlight-reset-on-article-change';
import { useWorkshop2Phase1DossierPulseSlotLayoutEffect } from '@/components/brand/production/use-workshop2-phase1-dossier-pulse-slot-layout-effect';
import { useWorkshop2Phase1DossierPassportAuditViewFactoryUrl } from '@/components/brand/production/use-workshop2-phase1-dossier-passport-audit-view-url';
import { useWorkshop2Phase1DossierSketchPinReadiness } from '@/components/brand/production/use-workshop2-phase1-dossier-sketch-pin-readiness';
import { stampDossierAfterFinalTzExport } from '@/components/brand/production/workshop2-phase1-dossier-panel-stamp-final-tz-export';
import {
  commitDossierEditJournalViaBrowser,
  commitTzActionJournalViaBrowser,
  type CommitJournalViaBrowserBase,
  W2_JOURNAL_COMMIT_LS_FULL,
  W2_JOURNAL_COMMIT_LS_JOURNAL,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-commit-tz-journal-line';
import {
  validatePhase2CanonicalRequiredFilled,
  validateWorkshopMatAndCompositionBlockers,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-continue-step-validation';
import { buildWorkshop2VisualsTzSignoffShareAbsoluteUrl } from '@/components/brand/production/workshop2-phase1-dossier-panel-article-absolute-urls';
import { buildWorkshop2Phase1DossierRouteHandoffAbsoluteUrl } from '@/components/brand/production/workshop2-phase1-dossier-panel-build-route-handoff-absolute-url';
import { buildWorkshop2Phase1DossierPassportStep1BriefHref } from '@/components/brand/production/workshop2-phase1-dossier-panel-passport-step1-brief-href';
import { passportManualFieldLabelClass } from '@/components/brand/production/workshop2-phase1-dossier-panel-signoff-format';
import { W2_VISUAL_QUAD_ATTR_IDS } from '@/components/brand/production/workshop2-phase1-dossier-panel-w2-tz-labels';
import {
  WorkshopInlineHintIcon,
  WorkshopLabelWithHint,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-field-hints';
import { HandbookMultiSelectPopover } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-multi-select';
import { resolvedHandbookDisplayLabel } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-display-label';
import { partitionHandbookAndFree } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import {
  clampSampleBasePieceQtyToCap,
  removeAssignmentById,
  sumSampleBasePieceQtyForPids,
  upsertCanonicalHandbookValues,
  upsertCanonicalMultiHandbookPreservingFreeSide,
  upsertCanonicalMultiHandbookPreservingHandbookSide,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import { collectWorkshop2Phase1LinkedAttributeIdsForLeaf } from '@/components/brand/production/workshop2-phase1-dossier-panel-sketch-linked-attribute-ids';
import { applyMatComposition } from '@/components/brand/production/workshop2-phase1-dossier-panel-color-mat-helpers';
import {
  applyHandbookParametersWithColorBundleSync,
  applyPassportColorPatchWithPrimarySync,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-passport-color-handbook-sync';
import { exportSketchVisualZipWithGates } from '@/components/brand/production/workshop2-phase1-dossier-panel-export-sketch-visual-zip';
import { applySaveSketchLabelsSnapshotWithTzLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-sketch-label-snapshot-tz';
import {
  canRevokeTzSignoff,
  pushTzActionLog,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import {
  notifyResponsibleForTzRowAction,
  notifyStakeholdersForSectionSignoffAction,
  updateSignoffDeadlineAction,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-notify-clipboard-handlers';
import { jumpToTzSignoffsAreaFooterAction } from '@/components/brand/production/workshop2-phase1-dossier-panel-jump-to-tz-signoffs-footer';
import { revokeTzDigitalRowAction } from '@/components/brand/production/workshop2-phase1-dossier-panel-revoke-tz-digital-row';
import { signTzDigitalRowAction } from '@/components/brand/production/workshop2-phase1-dossier-panel-sign-tz-digital-row';
import { commitSectionSignoffAction } from '@/components/brand/production/workshop2-phase1-dossier-panel-commit-section-signoff';
import { revokeSectionSignoffAction } from '@/components/brand/production/workshop2-phase1-dossier-panel-revoke-section-signoff';
import { getSectionWarnings } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-warnings';
import {
  buildHandbookCheckSnapshot,
  HANDBOOK_SNAPSHOT_SECTION_KEYS,
  type HandbookCheckSnapshot,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';
import { type Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import {
  buildSectionControlPoints,
  type BuildControlPointsCtx,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-control-points';
import { useWorkshop2Phase1DossierAttrCardContext } from '@/components/brand/production/workshop2-phase1-dossier-panel-use-attr-card-context';
import { useWorkshop2Phase1DossierRenderPhaseRow } from '@/components/brand/production/workshop2-phase1-dossier-panel-use-render-phase-row';
import {
  useWorkshop2SampleIntakeCatalogExtras,
  useWorkshop2SampleIntakeCatalogRows,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-use-sample-intake-catalog';
import { useWorkshop2Phase1DossierSectionRowsSharedBundle } from '@/components/brand/production/workshop2-phase1-dossier-panel-use-section-rows-shared';
import { Workshop2Phase1DossierPanelSectionBody } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body';
import { Workshop2Phase1DossierPanelBodyShell } from '@/components/brand/production/workshop2-phase1-dossier-panel-body-shell';
import { Workshop2DossierPanelPostMainTrail } from '@/components/brand/production/workshop2-phase1-dossier-panel-post-main-trail';
import { useWorkshop2Phase1DossierSendHandoffBundles } from '@/components/brand/production/use-workshop2-phase1-dossier-send-handoff-bundles';
import {
  PASSPORT_COLOR_BUNDLE_IDS,
  SECTION_LABEL_BY_ID,
  TZ_READINESS_SECTION_KEYS,
  TZ_TAB_SECTIONS,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { Workshop2Phase1DossierPanelProps } from '@/components/brand/production/workshop2-phase1-dossier-panel-props';

export type { Workshop2DossierPanelVariant } from '@/components/brand/production/workshop2-phase1-dossier-panel-props';

export function Workshop2Phase1DossierPanel({
  collectionId,
  articleId,
  internalArticleCode,
  articleSku,
  articleName,
  categoryLeafId,
  updatedByLabel,
  sectionSignoffOrganizationLabel = '',
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
  pulseSlotRef,
  onRequestClosePulse,
  onTzSpecPreviewHtml,
  onArticleLineDraftsChange,
  dossierCommentsBridgeRef,
  tzBlockCommentMetricKeys,
  onTzBlockCommentMetrics,
}: Workshop2Phase1DossierPanelProps) {
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

  useEffect(() => {
    const handleFactoryPin = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      toast({
        title: 'Новый комментарий от фабрики',
        description: customEvent.detail.message,
        className: 'bg-blue-50 border-blue-200 text-blue-900',
      });
    };
    window.addEventListener('factory-pin-added', handleFactoryPin);
    return () => window.removeEventListener('factory-pin-added', handleFactoryPin);
  }, [toast]);

  const { profile: dossierViewProfile, setProfile: setDossierViewProfileFromCtx } =
    useWorkshop2DossierView();
  /** Нет права production:edit — досье и скетч только для чтения (без API, матрица rbac.ts). */
  const tzWriteDisabled = !can('production', 'edit');
  const lockedSketchFloorOnly = isSketchFloorOnlyRole(role);

  const { sketchViewFloor, sketchEditsLocked, setSketchFloorMode, copySketchFloorLink } =
    useWorkshop2Phase1DossierSketchFloorMode({
      lockedSketchFloorOnly,
      tzWriteDisabled,
      toast,
    });

  const isPhase1 = variant === 'phase1';
  const isPhase2 = variant === 'phase2';
  const isPhase3 = variant === 'phase3';

  const visualsShareAbsoluteUrl = useMemo(
    () =>
      buildWorkshop2VisualsTzSignoffShareAbsoluteUrl({
        collectionId,
        internalArticleCode,
        articleId,
      }),
    [articleId, collectionId, internalArticleCode]
  );

  const buildRouteHandoffAbsoluteUrl = useCallback(
    (tab: 'fit' | 'qc' | 'supply', domId: string) =>
      buildWorkshop2Phase1DossierRouteHandoffAbsoluteUrl(
        { collectionId, articleId, internalArticleCode },
        tab,
        domId
      ),
    [articleId, collectionId, internalArticleCode]
  );

  const passportStep1BriefHref = useMemo(
    () =>
      buildWorkshop2Phase1DossierPassportStep1BriefHref({
        collectionId,
        articleId,
        internalArticleCode,
      }),
    [articleId, collectionId, internalArticleCode]
  );

  const tzScrollBehavior = useWorkshop2Phase1DossierTzScrollBehavior();

  const [activeSection, setActiveSection] = useState<Workshop2TzSignoffSectionKey>('general');

  const { dossierMainColumnFlash } = useWorkshop2Phase1DossierMainColumnFlash({
    flashDossier,
    activeSection,
  });

  const { sketchVisualCatalogHighlightSet, onVisualCatalogSuggestFromSketch } =
    useWorkshop2Phase1DossierSketchVisualCatalogHighlights(activeSection);

  const jumpToTzSectionAnchor = useWorkshop2Phase1DossierJumpToTzSectionAnchor(
    tzScrollBehavior,
    onNavigateToTab,
    setActiveSection
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

  const jumpToTzSectionAnchorFromPulse = useCallback(
    (section: Workshop2TzSignoffSectionKey, anchorId: string) => {
      onRequestClosePulse?.();
      jumpToTzSectionAnchor(section, anchorId);
    },
    [jumpToTzSectionAnchor, onRequestClosePulse]
  );

  const { setActivePassportSubNavId } = useWorkshop2Phase1DossierPassportSubnavScrollSpy({
    activeSection,
    dossierHydrateKey,
  });

  useWorkshop2Phase1DossierTzFocusAndHashScrollEffects({
    isPhase1,
    focusDossierSection,
    setActiveSection,
    activeSection,
    dossierHydrateKey,
    tzScrollBehavior,
  });

  const [passportDriftLogDone, setPassportDriftLogDone] = useState(false);
  useWorkshop2Phase1DossierPassportDriftLogResetOnArticleId(articleId, setPassportDriftLogDone);

  useWorkshop2Phase1DossierTechPackBlobResetOnArticleChange(collectionId, articleId);

  /** Без чтения localStorage в initializer — иначе SSR и первый paint клиента расходятся. */
  const [dossier, setDossierInternal] = useState<Workshop2DossierPhase1>(() =>
    emptyWorkshop2DossierPhase1()
  );
  const setDossier = useWorkshop2Phase1DossierWriteGuardedSetDossier(
    tzWriteDisabled,
    toast,
    setDossierInternal
  );

  const { dossierMetricsFooterLine, setDossierMetricsTick } =
    useWorkshop2Phase1DossierSessionMetricsUi({
      isPhase1,
      collectionId,
      articleId,
      dossierUpdatedAt: dossier.updatedAt,
      w2DossierMetricsCtx,
    });

  const { skuDraft, setSkuDraft, nameDraft, setNameDraft } =
    useWorkshop2Phase1DossierArticleLineDrafts({
      articleSku,
      articleName,
    });
  w2MetricsSkuRef.current = skuDraft.trim() || articleSku.trim() || null;

  useEffect(() => {
    onArticleLineDraftsChange?.({ sku: skuDraft, name: nameDraft });
  }, [skuDraft, nameDraft, onArticleLineDraftsChange]);

  const [savedHint, setSavedHint] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { persist, lastPersistedDossierRef } = useWorkshop2Phase1DossierPersist({
    collectionId,
    articleId,
    updatedByLabel,
    tzWriteDisabled,
    toast,
    w2DossierMetricsCtx,
    setDossierInternal,
    setDossierMetricsTick,
    setSaveError,
    setSavedHint,
  });
  const [tzRevokeDeniedHint, setTzRevokeDeniedHint] = useState<string | null>(null);
  const [handbookCheckSnapshot, setHandbookCheckSnapshot] = useState<HandbookCheckSnapshot | null>(
    null
  );
  const [handbookCheckReportExpanded, setHandbookCheckReportExpanded] = useState(true);
  const deferredAttrIds = useMemo(
    () => new Set(dossier.deferredAttrIds ?? []),
    [dossier.deferredAttrIds]
  );
  const [attrCommentDialogAttrId, setAttrCommentDialogAttrId] = useState<string | null>(null);
  const [attrCommentDraft, setAttrCommentDraft] = useState('');
  const [attrCommentDraftSeverity, setAttrCommentDraftSeverity] = useState<'normal' | 'critical'>(
    'normal'
  );
  const [attrCommentDraftAssignee, setAttrCommentDraftAssignee] = useState('');
  const [attrCommentDraftDueAt, setAttrCommentDraftDueAt] = useState('');
  const [attrCommentDraftVisibility, setAttrCommentDraftVisibility] = useState<
    'internal' | 'factory'
  >('internal');
  const [attrCommentOnlyOpen, setAttrCommentOnlyOpen] = useState(true);
  const { tzMinimalModeBySection, setTzMinimalModeBySection, tzMinimalHideDeferCommentUi } =
    useWorkshop2Phase1DossierTzMinimalMode({ isPhase1, activeSection });
  const [tzNotifyHighlightRowKey, setTzNotifyHighlightRowKey] = useState<string | null>(null);
  useWorkshop2Phase1DossierHandbookCheckSnapshotResetOnActiveSection(
    activeSection,
    setHandbookCheckSnapshot
  );
  useWorkshop2Phase1DossierTzNotifyHighlightResetOnArticleChange(
    collectionId,
    articleId,
    setTzNotifyHighlightRowKey
  );
  const [sketchWorkspaceTab, setSketchWorkspaceTab] = useState<'sketch' | 'sublevels'>('sketch');
  const [sketchSurface, setSketchSurface] = useState<'master' | 'sheets'>('master');
  const [sketchSheetPickerId, setSketchSheetPickerId] = useState<string | null>(null);
  const sketchMasterAnnotatorRef = useRef<CategorySketchAnnotatorHandle | null>(null);
  const sketchSheetAnnotatorRef = useRef<CategorySketchAnnotatorHandle | null>(null);
  const [sketchBundleBusy, setSketchBundleBusy] = useState(false);
  const [sketchPinLibraryOpen, setSketchPinLibraryOpen] = useState(false);
  const [techPackSessionBlobById, setTechPackSessionBlobById] = useState<Record<string, string>>(
    () => ({})
  );
  registerWorkshop2Phase1TechPackSessionBlobSetter(setTechPackSessionBlobById);
  const [sketchSnapshotDiffA, setSketchSnapshotDiffA] = useState('');
  const [sketchSnapshotDiffB, setSketchSnapshotDiffB] = useState('');
  const [sketchSnapshotDiffSummary, setSketchSnapshotDiffSummary] = useState<string | null>(null);
  const [sketchMasterTemplateId, setSketchMasterTemplateId] = useState('');
  const [orgSketchLibraryRevision, setOrgSketchLibraryRevision] = useState(0);

  const tzRevokersEffective = tzSignoffRevokerLabels ?? [];
  const tzSignCaps =
    tzDigitalSignoffCapabilities ?? WORKSHOP2_TZ_DIGITAL_SIGNOFF_DEFAULT_CAPABILITIES;
  const tzDigitalSignoffRows = useMemo(
    () =>
      buildWorkshop2TzDigitalSignoffRows(
        {
          tzSignatoryBindings: dossier.tzSignatoryBindings,
          designerSignoff: dossier.designerSignoff,
          technologistSignoff: dossier.technologistSignoff,
          managerSignoff: dossier.managerSignoff,
          extraTzSignoffsByRowId: dossier.extraTzSignoffsByRowId,
        },
        tzSignCaps,
        updatedByLabel,
        sectionSignoffOrganizationLabel
      ),
    [
      dossier.tzSignatoryBindings,
      dossier.designerSignoff,
      dossier.technologistSignoff,
      dossier.managerSignoff,
      dossier.extraTzSignoffsByRowId,
      tzSignCaps.designer,
      tzSignCaps.technologist,
      tzSignCaps.manager,
      updatedByLabel,
      sectionSignoffOrganizationLabel,
    ]
  );

  const onTzRevokeDenied = useCallback(() => {
    setTzRevokeDeniedHint(
      'Снять цифровую подпись могут только пользователи из списка руководителей (гендиректор, руководитель бренда, зам и т.п.). Обратитесь к администратору.'
    );
    window.setTimeout(() => setTzRevokeDeniedHint(null), 7000);
  }, []);

  const { pinnedAttrGroups, collapsedAttrGroups, toggleAttrGroupPinned, toggleAttrGroupCollapsed } =
    useWorkshop2Phase1DossierAttrGroupUi(activeSection);

  useWorkshop2Phase1DossierHydrateFromStorage({
    collectionId,
    articleId,
    articleSku,
    dossierHydrateKey,
    tzWriteDisabled,
    setDossierInternal,
    lastPersistedDossierRef,
    setHandbookCheckSnapshot,
  });

  const leaves = useMemo(() => getHandbookCategoryLeaves(), []);
  const audiences = useMemo(() => getHandbookAudiencesWorkshop2(), []);

  const currentLeaf = useMemo(() => {
    const t = categoryLeafId?.trim();
    if (t && findHandbookLeafById(t)) return findHandbookLeafById(t)!;
    return leaves[0]!;
  }, [categoryLeafId, leaves]);

  const { normalizedSketchSheets, canOpenSketchFromToolbar } =
    useWorkshop2Phase1DossierSketchSheetsToolbar({
      leafId: currentLeaf.leafId,
      sketchSheets: dossier.sketchSheets,
      categorySketchImageDataUrl: dossier.categorySketchImageDataUrl,
      sketchSheetPickerId,
      setSketchSheetPickerId,
      sketchSurface,
      setSketchSurface,
      setSketchWorkspaceTab,
    });

  const {
    subcategorySketchActiveLevel,
    setSubcategorySketchActiveLevel,
    branchLevelsDetailsOpen,
    setBranchLevelsDetailsOpen,
  } = useWorkshop2Phase1DossierBranchSlotSketchUi(currentLeaf.leafId);

  const attrCommentsById = dossier.attrComments ?? {};

  const { tzTraceRows, tzPreflight, productionPreflight, handoffBlockedByProduction } =
    useWorkshop2Phase1DossierTzTraceAndPreflight({
      dossier,
      techPackSessionBlobById,
      attrCommentsById,
      articleSkuDraft: skuDraft,
      articleNameDraft: nameDraft,
    });

  const {
    passportCriticalAuditSummaries,
    dossierViewUiCaps,
    dvTzSignoffSides,
    showVisualSketchExportSurfacesNav,
    showVisualSketchLinkFieldsNav,
    workshop2FactoryShareUrl,
  } = useWorkshop2Phase1DossierPassportAuditViewFactoryUrl({
    tzActionLog: dossier.tzActionLog,
    dossierViewProfile,
    collectionId,
    internalArticleCode,
    articleId,
  });

  const {
    sketchWorkspaceStats,
    sketchPinLinkAudit,
    factorySendSketchPinReadiness,
    jumpSketchFocusPin,
  } = useWorkshop2Phase1DossierSketchPinReadiness({
    leafId: currentLeaf.leafId,
    categorySketchAnnotations: dossier.categorySketchAnnotations,
    sketchSheets: dossier.sketchSheets,
    subcategorySketchSlots: dossier.subcategorySketchSlots,
    dossierViewProfile,
    showVisualSketchLinkFieldsNav,
    jumpToSketchLineRefs,
    sketchMasterAnnotatorRef,
  });

  const [finalTzWizardOpen, setFinalTzWizardOpen] = useState(false);
  const [exportLanguage, setExportLanguage] = useState<'ru' | 'ru_en' | 'ru_zh'>('ru');

  const appendSketchSheetFromUpload = useCallback(
    (imageDataUrl: string, imageFileName?: string) => {
      let newId: string | null = null;
      setDossier((p: Workshop2DossierPhase1) => {
        const cur = normalizeSketchSheets(p.sketchSheets);
        if (cur.length >= MAX_SKETCH_SHEETS) return p;
        const sheet = createEmptySketchSheet(defaultExtraSketchSheetTitle(cur.length));
        newId = sheet.sheetId;
        return {
          ...p,
          sketchSheets: [
            ...cur,
            {
              ...sheet,
              imageDataUrl,
              imageFileName,
              boardOrientation: p.categorySketchBoardOrientation ?? 'landscape',
            },
          ],
        };
      });
      if (newId) {
        // Остаёмся в режиме «Скетч» (master), чтобы рейл листов (после загрузки файла) не терял контекст.
        setSketchWorkspaceTab('sketch');
        setSketchSurface('master');
        setSketchSheetPickerId(newId);
      }
    },
    [setDossier]
  );

  const {
    selectedAudienceId,
    selectedAudienceLabel,
    passportCategoryCaption,
    effectiveAudienceId,
    baseRows,
    leafPhase1Ids,
    leafPhase2Ids,
    leafPhase3Ids,
    baseRowsPhase2,
    baseRowsPhase3,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    linkedMatCompositionPhase3,
    leafRowPolicy,
    rowsToShow,
    rowsToShowPhase2,
    rowsToShowPhase3,
    baseAttributeIdSet,
    extraIds,
    extraRows,
    customAssignments,
  } = useWorkshop2Phase1DossierAudienceAndAttributeRows({
    dossierSelectedAudienceId: dossier.selectedAudienceId,
    dossierAssignments: dossier.assignments,
    audiences,
    leaves,
    currentLeaf,
  });

  const recordFinalTzExport = useCallback(
    (format: 'html' | 'pdf') => {
      if (tzWriteDisabled) return;
      const stamped = stampDossierAfterFinalTzExport({
        dossier,
        format,
        updatedByLabel,
        skuDraft,
        nameDraft,
        pathLabel: currentLeaf.pathLabel,
      });
      /** Не сдвигаем `updatedAt`: иначе метка «документ актуален» ломается сразу после экспорта. */
      persist(stamped, { freezeUpdatedAt: true });
    },
    [dossier, tzWriteDisabled, updatedByLabel, skuDraft, nameDraft, currentLeaf.pathLabel, persist]
  );

  const journalCommitBase = useMemo(
    (): CommitJournalViaBrowserBase => ({
      collectionId,
      articleId,
      lastPersistedDossierRef,
      w2DossierMetricsCtx,
      setDossierMetricsTick,
      setSaveError,
      toast,
      updatedByLabel,
    }),
    [
      collectionId,
      articleId,
      lastPersistedDossierRef,
      w2DossierMetricsCtx,
      setDossierMetricsTick,
      setSaveError,
      toast,
      updatedByLabel,
    ]
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
    setDossierInternal((prev: Workshop2DossierPhase1) =>
      commitDossierEditJournalViaBrowser(
        journalCommitBase,
        prev,
        [
          'Напоминание: досье изменено после подписи ТЗ — пересмотреть подтверждение при существенных правках паспорта / брифа.',
        ],
        W2_JOURNAL_COMMIT_LS_FULL,
        { title: 'Запись добавлена', description: 'Строка в журнале действий ТЗ.' }
      )
    );
  }, [journalCommitBase, setDossierInternal, toast, tzWriteDisabled]);

  const logTechPackZipLine = useCallback(
    (line: string) => {
      if (tzWriteDisabled) return;
      setDossierInternal((prev) =>
        commitDossierEditJournalViaBrowser(
          journalCommitBase,
          prev,
          [line],
          W2_JOURNAL_COMMIT_LS_JOURNAL
        )
      );
    },
    [journalCommitBase, setDossierInternal, tzWriteDisabled]
  );

  const appendTzPulse = useCallback(
    (action: Workshop2TzActionLogPayload) => {
      if (tzWriteDisabled) return;
      setDossierInternal((prev) =>
        commitTzActionJournalViaBrowser(
          journalCommitBase,
          prev,
          action,
          W2_JOURNAL_COMMIT_LS_JOURNAL
        )
      );
    },
    [journalCommitBase, setDossierInternal, tzWriteDisabled]
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

  useWorkshop2Phase1DossierLeafCatalogSyncEffects({
    tzWriteDisabled,
    currentLeaf,
    setDossierInternal,
  });

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
    setDossier((prev: Workshop2DossierPhase1) =>
      applySaveSketchLabelsSnapshotWithTzLog(prev, updatedByLabel, label, currentLeaf.leafId)
    );
    toast({ title: 'Снимок меток сохранён', description: 'В досье и в журнале ТЗ.' });
  }, [currentLeaf.leafId, toast, updatedByLabel]);

  const exportSketchVisualBundleZip = useCallback(async () => {
    setSketchBundleBusy(true);
    try {
      const r = await exportSketchVisualZipWithGates({
        dossier,
        currentLeaf,
        dossierViewProfile,
        skuDraft,
      });
      if (r === 'aborted') return;
      if (r === 'exported') {
        toast({ title: 'Скачан архив', description: 'ZIP: PNG по доскам и PDF паспорт визуала.' });
      } else {
        toast({ title: 'Не удалось сформировать архив', variant: 'destructive' });
      }
    } finally {
      setSketchBundleBusy(false);
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
      const matErr = validateWorkshopMatAndCompositionBlockers({
        dossier,
        matLabelById,
        linkedMatComposition,
        enforceMat: Boolean(leafPhase1Ids.includes('mat') && matAttrDef?.requiredForPhase1),
      });
      if (matErr) {
        setSaveError(matErr);
        return;
      }
      persist(dossier);
      onContinueToNextStep?.();
      return;
    }
    if (isPhase2) {
      const matErr = validateWorkshopMatAndCompositionBlockers({
        dossier,
        matLabelById,
        linkedMatComposition: linkedMatCompositionPhase2,
        enforceMat: Boolean(leafPhase2Ids.includes('mat') && matAttrDef?.requiredForPhase2),
      });
      if (matErr) {
        setSaveError(matErr);
        return;
      }
      const phase2Err = validatePhase2CanonicalRequiredFilled({ leafPhase2Ids, dossier });
      if (phase2Err) {
        setSaveError(phase2Err);
        return;
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
      setDossier((prev: Workshop2DossierPhase1) =>
        upsertCanonicalMultiHandbookPreservingFreeSide(prev, attributeId, parts)
      );
    },
    []
  );

  /** Синхронизация блока «Цвет»: primary → палитра; референс → оттенок/градиент и при пустой группе — основная группа. */
  const onSetHandbookParametersWithColorBundleSync = useCallback(
    (attributeId: string, parts: { parameterId: string; displayLabel: string }[]) => {
      setDossier((prev: Workshop2DossierPhase1) =>
        applyHandbookParametersWithColorBundleSync(prev, attributeId, parts, currentLeaf)
      );
    },
    [currentLeaf]
  );

  const onFreeTextSide = useCallback((attributeId: string, text: string) => {
    setDossier((prev: Workshop2DossierPhase1) =>
      upsertCanonicalMultiHandbookPreservingHandbookSide(prev, attributeId, text)
    );
  }, []);

  const removeCustom = useCallback((assignmentId: string) => {
    setDossier((prev: Workshop2DossierPhase1) => removeAssignmentById(prev, assignmentId));
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
      setDossier((prev: Workshop2DossierPhase1) =>
        applyPassportColorPatchWithPrimarySync(prev, u, currentLeaf)
      );
    },
    [currentLeaf]
  );

  const allowMultiHandbook = isPhase1 || isPhase2 || isPhase3;

  const attributeIdsLinkedOnSketch = useMemo(
    () => collectWorkshop2Phase1LinkedAttributeIdsForLeaf(dossier, currentLeaf.leafId),
    [currentLeaf.leafId, dossier.categorySketchAnnotations, dossier.sketchSheets]
  );

  const { toggleDeferAttribute, deferGroupSetAll } =
    useWorkshop2Phase1DossierFieldDeferralActions(setDossier);

  const { openAttrComments } = useWorkshop2Phase1DossierAttrCommentsOpenBridge(
    dossierCommentsBridgeRef,
    setAttrCommentDialogAttrId,
    setAttrCommentDraft,
    setAttrCommentDraftSeverity,
    setAttrCommentDraftAssignee,
    setAttrCommentDraftDueAt,
    setAttrCommentDraftVisibility,
    setAttrCommentOnlyOpen
  );

  useWorkshop2Phase1DossierTzBlockCommentMetricsEffect({
    attrCommentsById,
    tzBlockCommentMetricKeys,
    onTzBlockCommentMetrics,
  });

  const saveAttrComment = useCallback(() => {
    const attrId = attrCommentDialogAttrId;
    const text = attrCommentDraft.trim();
    if (!attrId || !text) return;
    setDossier((prev) => {
      const prevComments = prev.attrComments ?? {};
      const nextRow: Workshop2AttrComment = {
        id: globalThis.crypto.randomUUID(),
        text,
        by: updatedByLabel.slice(0, 120),
        at: new Date().toISOString(),
        severity: attrCommentDraftSeverity,
        status: 'open',
        assignee: attrCommentDraftAssignee.trim() || undefined,
        dueAt: attrCommentDraftDueAt || undefined,
        visibility: attrCommentDraftVisibility,
      };
      const next = {
        ...prevComments,
        [attrId]: [...(prevComments[attrId] ?? []), nextRow],
      };
      return { ...prev, attrComments: next };
    });
    setAttrCommentDraft('');
    setAttrCommentDraftAssignee('');
    setAttrCommentDraftDueAt('');
    setAttrCommentDraftSeverity('normal');
  }, [
    attrCommentDialogAttrId,
    attrCommentDraft,
    attrCommentDraftAssignee,
    attrCommentDraftDueAt,
    attrCommentDraftSeverity,
    updatedByLabel,
    setDossier,
  ]);

  const toggleAttrCommentStatus = useCallback(
    (commentId: string) => {
      if (!attrCommentDialogAttrId) return;
      setDossier((prev) => {
        const prevComments = prev.attrComments ?? {};
        const rows = prevComments[attrCommentDialogAttrId] ?? [];
        const nextRows = rows.map((row) =>
          row.id !== commentId
            ? row
            : {
                ...row,
                status:
                  (row.status ?? 'open') === 'resolved' ? ('open' as const) : ('resolved' as const),
              }
        );
        const next = { ...prevComments, [attrCommentDialogAttrId]: nextRows };
        return { ...prev, attrComments: next };
      });
    },
    [attrCommentDialogAttrId, setDossier]
  );

  const dossierAttrCardCtx = useWorkshop2Phase1DossierAttrCardContext({
    activeSection,
    currentLeaf,
    dossier,
    setDossier,
    setDossierInternal,
    collectionId,
    articleId,
    techPackSessionBlobById,
    setTechPackSessionBlobById,
    skuDraft,
    allowMultiHandbook,
    onSetHandbookParameters,
    onFreeTextSide,
    patchColor,
    isPhase1,
    tzMinimalHideDeferCommentUi,
    tzWriteDisabled,
    deferredAttrIds,
    toggleDeferAttribute,
    attrCommentsById,
    openAttrComments,
    sketchVisualCatalogHighlightSet,
    attributeIdsLinkedOnSketch,
    logTechPackZipLine,
    appendTzPulse,
    updatedByLabel,
  });

  const renderPhaseRow = useWorkshop2Phase1DossierRenderPhaseRow({
    applyMatRows,
    applyMatSoloParts,
    dossier,
    dossierAttrCardCtx,
    currentLeafL2Name: currentLeaf.l2Name,
    linkedMatComposition,
    linkedMatCompositionPhase2,
    linkedMatCompositionPhase3,
    matAttrDef,
    matAttrForLeaf,
    matRequiredUnset,
  });

  const workshop2DossierSectionRowsSharedProps = useWorkshop2Phase1DossierSectionRowsSharedBundle({
    activeSection,
    currentLeaf,
    tzMinimalModeBySection,
    collapsedAttrGroups,
    pinnedAttrGroups,
    toggleAttrGroupPinned,
    toggleAttrGroupCollapsed,
    deferGroupSetAll,
    isPhase1,
    dossier,
    dossierAttrCardCtx,
    allowMultiHandbook,
    patchColor,
    deferredAttrIds,
    toggleDeferAttribute,
    attrCommentsById,
    openAttrComments,
    onSetHandbookParametersWithColorBundleSync,
    onSetHandbookParameters,
    onFreeTextSide,
    renderPhaseRow,
  });

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

  const visualsCatalogOnlyRows = useMemo(() => {
    const phaseRows = isPhase2 ? rowsToShowPhase2 : isPhase3 ? rowsToShowPhase3 : rowsToShow;
    return phaseRows.filter(
      (row) => getSectionForAttr(row.attribute.attributeId, row.group?.groupId) === 'visuals'
    );
  }, [isPhase2, isPhase3, rowsToShow, rowsToShowPhase2, rowsToShowPhase3]);

  const visualsCatalogOnlyExtras = useMemo(
    () =>
      isPhase1
        ? extraRows.filter(
            ({ attribute }) =>
              getSectionForAttr(attribute.attributeId, attribute.groupId) === 'visuals'
          )
        : [],
    [extraRows, isPhase1]
  );

  const sketchTechGaps = useMemo(
    () => workshop2SketchTechnologistGaps(dossier, currentLeaf.leafId),
    [dossier, currentLeaf.leafId]
  );

  const visualsCatalogAttributeIdsForSketch = useMemo(() => {
    const phaseRows = isPhase2 ? rowsToShowPhase2 : isPhase3 ? rowsToShowPhase3 : rowsToShow;
    const collectId = (attributeId: string, groupId?: string) => {
      const sec = getSectionForAttr(attributeId, groupId);
      if (sec === 'visuals') return true;
      if (sec === 'general' && PASSPORT_COLOR_BUNDLE_IDS.has(attributeId)) return true;
      if (sec === 'construction' && W2_VISUAL_QUAD_ATTR_IDS.has(attributeId)) return true;
      return false;
    };
    const base = phaseRows
      .filter((row) => collectId(row.attribute.attributeId, row.group?.groupId))
      .map((r) => r.attribute.attributeId);
    const ex = isPhase1
      ? extraRows
          .filter(({ attribute }) => collectId(attribute.attributeId, attribute.groupId))
          .map((e) => e.attribute.attributeId)
      : [];
    return [...new Set([...base, ...ex])];
  }, [isPhase1, isPhase2, isPhase3, extraRows, rowsToShow, rowsToShowPhase2, rowsToShowPhase3]);

  const visualsCatalogSketchLinksForPins = useMemo((): VisualCatalogSketchLinkRow[] => {
    const phaseRows = isPhase2 ? rowsToShowPhase2 : isPhase3 ? rowsToShowPhase3 : rowsToShow;
    const raw: VisualCatalogSketchLinkRow[] = [];
    const pushRow = (
      attributeId: string,
      groupId: string | undefined,
      attr: Pick<AttributeCatalogAttribute, 'sketchHighlightForPinTypes'>
    ) => {
      const sec = getSectionForAttr(attributeId, groupId);
      if (
        sec !== 'visuals' &&
        !(sec === 'general' && PASSPORT_COLOR_BUNDLE_IDS.has(attributeId)) &&
        !(sec === 'construction' && W2_VISUAL_QUAD_ATTR_IDS.has(attributeId))
      ) {
        return;
      }
      raw.push({ attributeId, sketchHighlightForPinTypes: attr.sketchHighlightForPinTypes });
    };
    for (const row of phaseRows) {
      pushRow(row.attribute.attributeId, row.group?.groupId, row.attribute);
    }
    if (isPhase1) {
      for (const { attribute } of extraRows) {
        pushRow(attribute.attributeId, attribute.groupId, attribute);
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
        (row) =>
          getSectionForAttr(row.attribute.attributeId, row.group?.groupId) === 'general' &&
          !PASSPORT_COLOR_BUNDLE_IDS.has(row.attribute.attributeId)
      ),
    [phaseRowsCurrent]
  );

  const generalPassportExtraRows = useMemo(
    () =>
      isPhase1
        ? extraRows.filter(
            ({ attribute }) =>
              getSectionForAttr(attribute.attributeId, attribute.groupId) === 'general' &&
              !PASSPORT_COLOR_BUNDLE_IDS.has(attribute.attributeId)
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

  const passportArticleCardStartRows = useMemo(
    () =>
      generalPassportStartRows.filter(
        (r) => !PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(r.attribute.attributeId)
      ),
    [generalPassportStartRows]
  );
  const passportSewingPlanStartRows = useMemo(
    () =>
      generalPassportStartRows.filter((r) =>
        PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(r.attribute.attributeId)
      ),
    [generalPassportStartRows]
  );
  const passportArticleCardStartExtras = useMemo(
    () =>
      generalPassportStartExtras.filter(
        (e) => !PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(e.attribute.attributeId)
      ),
    [generalPassportStartExtras]
  );
  const passportSewingPlanStartExtras = useMemo(
    () =>
      generalPassportStartExtras.filter((e) =>
        PASSPORT_MOVED_TO_SEWING_PLAN_ATTR_IDS.has(e.attribute.attributeId)
      ),
    [generalPassportStartExtras]
  );

  const showPhase1PassportArticleCard =
    passportArticleCardStartRows.length +
      passportArticleCardStartExtras.length +
      generalPassportPreSampleRows.length +
      generalPassportPreSampleExtras.length >
    0;

  /** Атрибуты каталога секции «приёмка» (таможня после образца) — не в карточке паспорта, UI в «Задание». */
  const sampleIntakeCatalogRows = useWorkshop2SampleIntakeCatalogRows({
    isPhase1,
    isPhase2,
    isPhase3,
    rowsToShow,
    rowsToShowPhase2,
    rowsToShowPhase3,
    baseRows,
    baseRowsPhase2,
    baseRowsPhase3,
    currentLeaf,
    selectedAudienceId,
  });

  const sampleIntakeCatalogExtras = useWorkshop2SampleIntakeCatalogExtras(extraRows, isPhase1);

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

  const expectedScaleId = defaultSizeScaleIdForLeaf(currentLeaf);
  const dimensionLabels = getWorkshopDimensionLabels(currentLeaf, dossier.isUnisex);
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
    const cap = effectiveMoqTargetMaxPieces(dossier.passportProductionBrief);
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
      warnings.push('Сумма штук по размерам в табеле превышает количество образцов в паспорте.');
    }
    return warnings;
  }, [dimensionLabels, dossier, expectedScaleId, leafPhase1Ids]);

  const sectionReadiness = useMemo(() => {
    const values = Object.fromEntries(
      TZ_READINESS_SECTION_KEYS.map((sectionId) => {
        const completion = calculateWorkshopTzSectionCompletion(
          sectionId,
          dossier,
          phaseRowsCurrent,
          {
            tzPhase: currentPhase,
            techPackZipSessionBlobById: techPackSessionBlobById,
          }
        );
        const status = getWorkshopTzSectionStatusLabel(sectionId, dossier, phaseRowsCurrent, {
          tzPhase: currentPhase,
          techPackZipSessionBlobById: techPackSessionBlobById,
        });
        return [sectionId, { ...completion, status }];
      })
    ) as Record<DossierSection, { done: number; total: number; pct: number; status: string }>;
    return values;
  }, [phaseRowsCurrent, dossier, currentPhase, techPackSessionBlobById]);

  /** UI-выравнивание: паспортный % должен учитывать draft SKU/Название до сохранения. */
  const sectionReadinessUi = useMemo(() => {
    const next = {
      ...sectionReadiness,
      general: { ...sectionReadiness.general },
    };
    const skuAssigned = dossier.assignments.some(
      (a) => a.attributeId === 'sku' && a.values.length > 0
    );
    const nameAssigned = dossier.assignments.some(
      (a) => a.attributeId === 'name' && a.values.length > 0
    );
    const skuFilledUi = skuAssigned || skuDraft.trim().length > 0;
    const nameFilledUi = nameAssigned || nameDraft.trim().length > 0;
    const bonusDone = Number(skuFilledUi && !skuAssigned) + Number(nameFilledUi && !nameAssigned);
    if (bonusDone > 0) {
      const done = next.general.done + bonusDone;
      const total = Math.max(next.general.total, 1);
      next.general = {
        ...next.general,
        done,
        pct: Math.round((done / total) * 100),
      };
    }
    return next;
  }, [sectionReadiness, dossier.assignments, skuDraft, nameDraft]);

  const sectionWarningsById = useMemo(() => {
    return Object.fromEntries(
      TZ_READINESS_SECTION_KEYS.map((sectionId) => [
        sectionId,
        getSectionWarnings(
          sectionId,
          dossier,
          currentLeaf,
          skuDraft,
          nameDraft,
          handbookWarnings,
          sectionReadinessUi
        ),
      ])
    ) as Record<DossierSection, string[]>;
  }, [dossier, currentLeaf, skuDraft, nameDraft, handbookWarnings, sectionReadinessUi]);

  /** Средний процент по четырём вкладкам ТЗ (без «Задание») — порог для кнопки «Подписать». */
  const tzCoreFieldsFillPctGate = useMemo(() => {
    const keys = ['general', 'material', 'construction'] as const;
    const perSectionPct = Object.fromEntries(
      keys.map((k) => [k, sectionReadinessUi[k].pct])
    ) as Record<(typeof keys)[number], number>;
    const pct = Math.round(
      keys.reduce((sum, k) => sum + perSectionPct[k], 0) / Math.max(keys.length, 1)
    );
    return {
      perSectionPct,
      pct,
      meets: pct >= W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF,
    };
  }, [sectionReadinessUi]);

  const tzGateSnapshot = useMemo(
    () =>
      buildWorkshop2TzGateSnapshot(dossier, {
        sessionBlobById: techPackSessionBlobById,
        commentsById: attrCommentsById as Record<string, Workshop2TzGateCommentLike[]>,
        sectionFillPct: {
          general: sectionReadinessUi.general.pct,
          material: sectionReadinessUi.material.pct,
          construction: sectionReadinessUi.construction.pct,
        },
        activeCategoryLeafId: currentLeaf.leafId,
      }),
    [dossier, techPackSessionBlobById, attrCommentsById, sectionReadinessUi, currentLeaf.leafId]
  );

  const sectionGateErrorsById = useMemo((): Record<DossierSection, string[]> => {
    const keys = ['general', 'material', 'construction'] as const;
    const core = Object.fromEntries(
      keys.map((k) => [
        k,
        [...(sectionWarningsById[k] ?? []), ...(tzGateSnapshot.sectionMinimumErrors[k] ?? [])],
      ])
    ) as Record<(typeof keys)[number], string[]>;
    return {
      general: core.general,
      material: core.material,
      construction: core.construction,
      measurements: [],
      assignment: [],
      packaging: [],
      sample_intake: [],
      visuals: [],
      b2b_sales: [],
    };
  }, [sectionWarningsById, tzGateSnapshot.sectionMinimumErrors]);

  const tzBlockersFooter = useMemo(
    () => (
      <Workshop2DossierTzBlockersFooter
        onOpenPulse={onOpenPulse}
        aiWarnings={productionPreflight.issues.filter((i) => i.id.startsWith('ai.'))}
      />
    ),
    [onOpenPulse, productionPreflight.issues]
  );

  const factorySendHubPreview = useMemo(
    () => ({
      techPackCount: tzGateSnapshot.techPackCount,
      techPackWithBytes: tzGateSnapshot.techPackWithBytes,
      sectionSignoffsFull: tzGateSnapshot.sectionSignoffsFull,
      lastHandoff: resolveWorkshop2TechPackHandoffChecklistRow(dossier.techPackFactoryHandoffs),
      sketchReady: tzGateSnapshot.sketchReady,
      openCriticalCommentsCount: tzGateSnapshot.openCriticalCommentsCount,
      lifecycleState: tzGateSnapshot.state,
      blockers: tzGateSnapshot.blockers,
      firstUnmet: tzGateSnapshot.firstUnmet,
    }),
    [dossier.techPackFactoryHandoffs, tzGateSnapshot]
  );

  const finalTzExportContext = useMemo((): Workshop2FinalTzSpecExportContext => {
    return {
      articleSku: skuDraft,
      articleName: nameDraft,
      pathLabel: currentLeaf.pathLabel,
      l2Name: currentLeaf.l2Name,
      tzPhase: currentPhase,
      categoryLeafId: currentLeaf.leafId,
      measurementsLeaf: currentLeaf,
      preflightOk: tzPreflight.ok,
      preflightIssueCount: tzPreflight.issues.length,
      sectionSignoffsFull: tzGateSnapshot.sectionSignoffsFull,
      gateLifecycleState: tzGateSnapshot.state,
      exportLanguage,
    };
  }, [
    skuDraft,
    nameDraft,
    currentLeaf.pathLabel,
    currentLeaf.l2Name,
    currentLeaf.leafId,
    currentPhase,
    tzPreflight.ok,
    tzPreflight.issues.length,
    tzGateSnapshot.sectionSignoffsFull,
    tzGateSnapshot.state,
    exportLanguage,
  ]);

  const finalTzSpecDocumentHtml = useMemo(
    () => buildWorkshop2FinalTzSpecDocumentHtml(dossier, finalTzExportContext),
    [dossier, finalTzExportContext]
  );

  useEffect(() => {
    onTzSpecPreviewHtml?.(finalTzSpecDocumentHtml);
  }, [finalTzSpecDocumentHtml, onTzSpecPreviewHtml]);

  const phase1DossierJsonUtf8Bytes = useMemo(() => {
    try {
      return new Blob([JSON.stringify(dossier)]).size;
    } catch {
      return 0;
    }
  }, [dossier]);

  const finalTzAssignmentChain = useMemo(() => {
    const lastExport = dossier.finalTzDocumentLastExport;
    const dossierUpdatedAt = dossier.updatedAt ?? '';
    const checklistReady = tzPreflight.ok && !factorySendHubPreview.firstUnmet;
    const docCurrent =
      lastExport != null &&
      lastExport.dossierUpdatedAtSnapshot === dossierUpdatedAt &&
      lastExport.articleSkuSnapshot === skuDraft.trim() &&
      lastExport.articleNameSnapshot === nameDraft.trim() &&
      lastExport.pathLabelSnapshot === currentLeaf.pathLabel;
    const handoff = factorySendHubPreview.lastHandoff;
    const handoffClosed = Boolean(handoff?.brandDispatchedAt && handoff?.factoryReceivedAt);
    return {
      checklistReady,
      lastExport: Boolean(lastExport),
      docCurrent,
      handoffClosed,
    };
  }, [
    tzPreflight.ok,
    factorySendHubPreview.firstUnmet,
    factorySendHubPreview.lastHandoff,
    dossier.finalTzDocumentLastExport,
    dossier.updatedAt,
    skuDraft,
    nameDraft,
    currentLeaf.pathLabel,
  ]);
  const lastProductionExportBadge = useMemo(() => {
    const last = dossier.productionTzLastExport;
    if (!last) return null;
    let at = last.exportedAt;
    try {
      at = new Date(last.exportedAt).toLocaleString('ru-RU');
    } catch {
      /* noop */
    }
    return {
      statusLabel: last.status === 'ready_for_factory' ? 'Готово к передаче' : 'Черновик',
      statusClass:
        last.status === 'ready_for_factory'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-amber-200 bg-amber-50 text-amber-900',
      score: last.score,
      blockers: last.blockersCount,
      warnings: last.warningsCount,
      at,
    };
  }, [dossier.productionTzLastExport]);

  const handleFinalTzDownloadHtml = useCallback(() => {
    downloadWorkshop2FinalTzSpecHtmlFile(finalTzSpecDocumentHtml, skuDraft);
    if (!tzWriteDisabled) recordFinalTzExport('html');
    toast({
      title: 'HTML скачан',
      description: tzWriteDisabled
        ? 'Запись в досье и журнал — только с правом «Редактировать производство».'
        : 'Один файл по всем разделам; мета экспорта сохранена в досье.',
    });
  }, [finalTzSpecDocumentHtml, skuDraft, tzWriteDisabled, recordFinalTzExport, toast]);

  const handleFinalTzPrintToPdf = useCallback(() => {
    openWorkshop2FinalTzSpecPrintWindow(finalTzSpecDocumentHtml);
    if (!tzWriteDisabled) recordFinalTzExport('pdf');
    toast({
      title: 'Печать',
      description: tzWriteDisabled
        ? 'Выберите «Сохранить как PDF». Запись экспорта в досье недоступна в режиме просмотра.'
        : 'В системном диалоге выберите «Сохранить как PDF».',
    });
  }, [finalTzSpecDocumentHtml, tzWriteDisabled, recordFinalTzExport, toast]);

  const activeSectionPctForSignHint = sectionReadinessUi[activeSection]?.pct ?? 0;
  const activeSectionLabelForSignHint = SECTION_LABEL_BY_ID[activeSection];
  const activeSectionFillPctMin = W2_SECTION_SIGNOFF_PCT_THRESHOLD[activeSection];
  const activeSectionSignGateMeets = activeSectionPctForSignHint >= activeSectionFillPctMin;
  const TZ_SIGNOFF_BLOCK_HINT = `Сначала доведите заполнение раздела «${activeSectionLabelForSignHint}» до не менее ${activeSectionFillPctMin}% (сейчас ${activeSectionPctForSignHint}%).`;

  const fourTzLevelsFullySignedByAll = useMemo(() => {
    const keys: ('general' | 'visuals' | 'material' | 'construction')[] = [
      'general',
      'visuals',
      'material',
      'construction',
    ];
    return keys.every((k) => {
      const pct = sectionReadinessUi[k]?.pct ?? 0;
      const hasWarnings = (sectionWarningsById[k]?.length ?? 0) > 0;
      return (
        isWorkshop2TzSectionFullySigned(k, dossier.sectionSignoffs) && !hasWarnings && pct >= 100
      );
    });
  }, [dossier.sectionSignoffs, sectionReadinessUi, sectionWarningsById]);

  const tzDigitalSignoffRowsGated = useMemo(() => {
    return tzDigitalSignoffRows.map((r) => {
      const base = r.canSign;
      const gated = base && activeSectionSignGateMeets && !tzWriteDisabled;
      return {
        ...r,
        signoff: activeSectionSignGateMeets ? r.signoff : undefined,
        canSign: gated,
        signBlockHint: tzWriteDisabled
          ? base
            ? W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE
            : undefined
          : !activeSectionSignGateMeets && base
            ? TZ_SIGNOFF_BLOCK_HINT
            : undefined,
      };
    });
  }, [tzDigitalSignoffRows, activeSectionSignGateMeets, TZ_SIGNOFF_BLOCK_HINT, tzWriteDisabled]);

  const dossierNavPrimarySections = useMemo(
    () =>
      dossierViewProfile === 'full'
        ? TZ_TAB_SECTIONS
        : TZ_TAB_SECTIONS.filter((s) =>
            isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id)
          ),
    [dossierViewProfile]
  );
  const dossierNavSecondarySections = useMemo(
    () =>
      dossierViewProfile === 'full'
        ? []
        : TZ_TAB_SECTIONS.filter(
            (s) => !isWorkshop2DossierViewPrimarySection(dossierViewProfile, s.id)
          ),
    [dossierViewProfile]
  );

  const w2ViewPrevForSectionSyncRef = useRef<Workshop2DossierViewProfile | null>(null);
  const assignmentSendChecklistDetailsRef = useRef<HTMLDetailsElement | null>(null);
  useWorkshop2Phase1DossierViewProfileSectionSyncEffect({
    w2ViewPrevForSectionSyncRef,
    isPhase1,
    dossierViewProfile,
    activeSection,
    dossierNavPrimarySections,
    setActiveSection,
  });

  useWorkshop2Phase1DossierMaterialComplianceSessionHydrate({
    isPhase1,
    collectionId,
    articleId,
    dossierHydrateKey,
    setDossierInternal,
  });

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
    () => resolveMatSketchBomGapRefs(dossier, sketchBomRefsUnion, materialBomExportInput.matLines),
    [dossier, sketchBomRefsUnion, materialBomExportInput.matLines]
  );

  const materialCategoryNotes = useMemo(
    () => buildMaterialCategoryNotes(currentLeaf.l2Name),
    [currentLeaf.l2Name]
  );

  const materialMatHint = useMemo(() => {
    const l2 = currentLeaf.l2Name;
    return l2 === 'Верхняя одежда'
      ? 'Зафиксируйте основную ткань (shell), подкладку, утеплитель, дублирин и фурнитуру.'
      : l2 === 'Платья и сарафаны'
        ? 'Укажите основную ткань, подкладку (если есть) и фурнитуру (молния, пуговицы).'
        : 'Материальная рамка для передачи в снабжение. Указывайте состав в процентах.';
  }, [currentLeaf.l2Name]);

  const openSketchFromMaterialHub = useCallback(() => {
    setActiveSection('construction');
    window.setTimeout(() => {
      document.getElementById(W2_VISUALS_SKETCH_ANCHOR_ID)?.scrollIntoView({
        behavior: tzScrollBehavior,
        block: 'start',
      });
    }, 120);
  }, [tzScrollBehavior]);

  const openSketchFromMaterialHubForPulse = useCallback(() => {
    onRequestClosePulse?.();
    openSketchFromMaterialHub();
  }, [onRequestClosePulse, openSketchFromMaterialHub]);

  useWorkshop2Phase1DossierPulseSlotLayoutEffect({
    pulseSlotRef,
    dossier,
    setDossier,
    updatedByLabel,
    normalizedSketchSheets,
    skuDraft,
    nameDraft,
    currentLeaf,
    visualsShareAbsoluteUrl,
    sketchViewFloor,
    currentPhase,
    dossierViewProfile,
    onNavigateToTab,
    buildRouteHandoffAbsoluteUrl,
    sectionReadinessConstructionPct: sectionReadiness.construction.pct,
    materialBomHubModel,
    materialMatHint,
    materialCategoryNotes,
    materialSketchBomStripModel,
    materialBomExportInput,
    tzWriteDisabled,
    sketchBomRefsUnion,
    matSketchBomGapRefs,
    collectionId,
    articleId,
    jumpToTzSectionAnchorFromPulse,
    onRequestClosePulse,
    openSketchFromMaterialHubForPulse,
    jumpToQcArticleSection,
    tzMinimalModeBySection,
    setTzMinimalModeBySection,
  });

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
  const allSectionSignoffPairsDone = useMemo(
    () =>
      (['general', 'material', 'construction'] as const).every((k) =>
        isWorkshop2TzSectionTabDoneForUi(
          k,
          dossier.sectionSignoffs,
          sectionReadinessUi[k]?.pct ?? 0,
          dossier
        )
      ),
    [dossier.sectionSignoffs, sectionReadinessUi]
  );
  const handbookCheckClean = useMemo(() => {
    if (!handbookCheckSnapshot) return false;
    const hasIssues =
      HANDBOOK_SNAPSHOT_SECTION_KEYS.some(
        (sid) => (handbookCheckSnapshot.bySection[sid]?.length ?? 0) > 0
      ) || (handbookCheckSnapshot.globalHandbookWarnings?.length ?? 0) > 0;
    return !hasIssues;
  }, [handbookCheckSnapshot]);
  const stageBoardHandbookWarnings = handbookCheckSnapshot?.bySection[activeSection] ?? [];

  useWorkshop2Phase1DossierHandbookCheckReportExpansionEffects({
    handbookCheckSnapshot,
    handbookCheckClean,
    setHandbookCheckReportExpanded,
  });

  const notifyResponsibleForTzRow = useCallback(
    (rowKey: string, roleTitle: string, assignee?: string) =>
      notifyResponsibleForTzRowAction(
        { setTzNotifyHighlightRowKey, toast, setDossier, persist, updatedByLabel },
        rowKey,
        roleTitle,
        assignee
      ),
    [toast, updatedByLabel, persist]
  );

  const notifyStakeholdersForSectionSignoff = useCallback(
    (
      section: 'general' | 'visuals' | 'material' | 'construction',
      sectionTitle: string,
      side?: 'brand' | 'tech'
    ) =>
      notifyStakeholdersForSectionSignoffAction(
        { setTzNotifyHighlightRowKey, toast, setDossier, persist, updatedByLabel },
        section,
        sectionTitle,
        side
      ),
    [toast, updatedByLabel, persist]
  );

  const setSignoffDeadline = useCallback(
    (
      section: 'general' | 'visuals' | 'material' | 'construction',
      side: 'brand' | 'tech',
      dueAt: string | undefined
    ) => updateSignoffDeadlineAction({ setDossier, persist, updatedByLabel }, section, side, dueAt),
    [updatedByLabel, persist]
  );

  const jumpToTzSignoffsAreaFooter = useCallback(
    () =>
      jumpToTzSignoffsAreaFooterAction({
        isPhase1,
        dossier,
        sectionReadinessUi,
        setActiveSection,
      }),
    [isPhase1, dossier.sectionSignoffs, sectionReadinessUi, setActiveSection]
  );

  const signTzDigitalRow = useCallback(
    (rowKey: string, extraRoleTitle?: string) =>
      signTzDigitalRowAction(
        {
          tzWriteDisabled,
          toast,
          activeSectionSignGateMeets,
          sectionSignGateBlockedDescription: TZ_SIGNOFF_BLOCK_HINT,
          technologistSignStages: dossier.tzSignatoryBindings?.technologistSignStages,
          materialSectionMinimumErrors: tzGateSnapshot.sectionMinimumErrors.material,
          constructionSectionMinimumErrors: tzGateSnapshot.sectionMinimumErrors.construction,
          setActiveSection,
          updatedByLabel,
          sectionSignoffOrganizationLabel,
          collectionId,
          articleId,
          articleSku,
          setDossier,
        },
        rowKey,
        extraRoleTitle
      ),
    [
      articleId,
      articleSku,
      collectionId,
      toast,
      activeSectionSignGateMeets,
      TZ_SIGNOFF_BLOCK_HINT,
      dossier.tzSignatoryBindings?.technologistSignStages,
      tzGateSnapshot.sectionMinimumErrors.material,
      tzGateSnapshot.sectionMinimumErrors.construction,
      updatedByLabel,
      sectionSignoffOrganizationLabel,
      tzWriteDisabled,
      setActiveSection,
      setDossier,
    ]
  );

  const revokeTzDigitalRow = useCallback(
    (rowKey: string, extraRoleTitle?: string) =>
      revokeTzDigitalRowAction(
        {
          tzWriteDisabled,
          toast,
          updatedByLabel,
          tzRevokersEffective,
          onTzRevokeDenied,
          setDossier,
        },
        rowKey,
        extraRoleTitle
      ),
    [onTzRevokeDenied, setDossier, updatedByLabel, tzRevokersEffective, tzWriteDisabled, toast]
  );

  const tzSectionSignoffRevokeAllowed = useMemo(
    () => canRevokeTzSignoff(updatedByLabel, tzRevokersEffective),
    [updatedByLabel, tzRevokersEffective]
  );

  const sectionSignoffProfileGateOk = useMemo(
    () =>
      workshop2TzSectionSignoffByLabelMeaningful(updatedByLabel) &&
      sectionSignoffOrganizationLabel.trim().length > 0,
    [updatedByLabel, sectionSignoffOrganizationLabel]
  );

  /** ФИО и компания из паспорта (Подписанты / карточка артикула) — показ в строках «Подтверждение секции». */
  const sectionSignoffPassportPreviews = useMemo(() => {
    const b = dossier.tzSignatoryBindings;
    const brandName = b?.designerDisplayLabel?.trim() ?? '';
    const techName = b?.technologistDisplayLabel?.trim() ?? '';
    const cabinetOrg = sectionSignoffOrganizationLabel.trim();
    const orgFor = (name: string) =>
      (workshopTzAssigneeOrganizationName(name) ?? '').trim() || cabinetOrg;
    return {
      brandPassportName: brandName,
      brandPassportOrg: brandName ? orgFor(brandName) : '',
      brandPassportMissing: !brandName,
      techPassportName: techName,
      techPassportOrg: techName ? orgFor(techName) : '',
      techPassportMissing: !techName,
    };
  }, [dossier.tzSignatoryBindings, sectionSignoffOrganizationLabel]);

  const sectionSignoffSessionBrandOk = useMemo(() => {
    if (sectionSignoffPassportPreviews.brandPassportMissing) return false;
    return workshopTzSignerAllowed(
      updatedByLabel,
      sectionSignoffPassportPreviews.brandPassportName
    );
  }, [sectionSignoffPassportPreviews, updatedByLabel]);

  const sectionSignoffSessionTechOk = useMemo(() => {
    if (sectionSignoffPassportPreviews.techPassportMissing) return false;
    return workshopTzSignerAllowed(updatedByLabel, sectionSignoffPassportPreviews.techPassportName);
  }, [sectionSignoffPassportPreviews, updatedByLabel]);

  const commitSectionSignoff = useCallback(
    (section: 'general' | 'visuals' | 'material' | 'construction', role: 'brand' | 'tech') =>
      commitSectionSignoffAction(
        {
          tzWriteDisabled,
          toast,
          sectionReadinessUi,
          sectionGateErrorsById,
          sectionSignoffOrganizationLabel,
          updatedByLabel,
          tzSignatoryBindings: dossier.tzSignatoryBindings,
          collectionId,
          articleId,
          articleSku,
          setDossier,
          persist,
        },
        section,
        role
      ),
    [
      articleId,
      articleSku,
      collectionId,
      dossier.tzSignatoryBindings,
      sectionReadinessUi,
      sectionGateErrorsById,
      sectionSignoffOrganizationLabel,
      toast,
      updatedByLabel,
      tzWriteDisabled,
      setDossier,
      persist,
    ]
  );

  const revokeSectionSignoff = useCallback(
    (section: 'general' | 'visuals' | 'material' | 'construction', role: 'brand' | 'tech') =>
      revokeSectionSignoffAction(
        {
          tzWriteDisabled,
          toast,
          sectionReadinessUi,
          updatedByLabel,
          tzRevokersEffective,
          onTzRevokeDenied,
          setDossier,
          persist,
        },
        section,
        role
      ),
    [
      onTzRevokeDenied,
      updatedByLabel,
      tzRevokersEffective,
      tzWriteDisabled,
      toast,
      sectionReadinessUi,
      setDossier,
      persist,
    ]
  );

  const tzReadyForSample =
    sectionReadiness.general.pct >= 60 &&
    sectionReadiness.visuals.pct >= 50 &&
    sectionReadiness.material.pct >= 50 &&
    sectionReadiness.construction.pct >= 100 &&
    (isPhase1
      ? allSectionSignoffPairsDone
      : (!reqDesigner || dossier.isVerifiedByDesigner) &&
        (!reqTechnologist || dossier.isVerifiedByTechnologist) &&
        (!reqManager || dossier.isVerifiedByManager) &&
        extrasReqTzSignoff.every((ex) => Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId]))) &&
    handbookWarnings.length === 0;

  useWorkshop2Phase1DossierW2SessionMetricRecordEffects({
    collectionId,
    articleId,
    passportHubModel,
    visualGateOpenCountGlobal,
    isPhase1,
    tzReadyForSample,
    setDossierMetricsTick,
  });

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
      sectionReadiness: sectionReadinessUi,
      selectedAudienceLabel,
      hasAssignmentValue,
    }),
    [
      dossier,
      currentLeaf,
      skuDraft,
      nameDraft,
      handbookWarnings,
      sectionReadinessUi,
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
        sectionReadinessUi,
        activeSection,
        aspects,
        SECTION_LABEL_BY_ID
      )
    );
  }, [
    dossier,
    currentLeaf,
    skuDraft,
    nameDraft,
    handbookWarnings,
    sectionReadinessUi,
    activeSection,
    controlPointsCtx,
  ]);

  const { openNextAssignmentBlocker, assignmentSendPanelBundle, assignmentHandoffBundle } =
    useWorkshop2Phase1DossierSendHandoffBundles({
      activeSection,
      setActiveSection,
      sendInput: {
        assignmentChain: finalTzAssignmentChain,
        assignmentSendChecklistDetailsRef,
        tzWriteDisabled,
        onOpenFinalTzWizard: () => setFinalTzWizardOpen(true),
        lastProductionExportBadge,
        factorySendHubPreview,
        factorySendSketchPinReadiness,
        tzPreflight,
        productionPreflight,
        tzTraceRows,
        jumpToSketchLineRefs,
        jumpToTzSectionAnchor,
        sketchPinLinkAudit,
        onSketchPinFocus: jumpSketchFocusPin,
        dossier,
        setDossier,
      },
      handoffInput: {
        dossier,
        setDossier,
        appendTzPulse,
        updatedByLabel,
        tzWriteDisabled,
        fourTzLevelsFullySignedByAll,
        handoffBlockedByProduction,
        productionPreflightBlockerCount: productionPreflight.blockers.length,
      },
      openNextBlocker: {
        factorySendHubPreview,
        tzPreflight,
        jumpToSketchLineRefs,
        jumpToTzSectionAnchor,
        setAttrCommentOnlyOpen,
        openAttrComments,
      },
    });

  const sectionBody = (
    <Workshop2Phase1DossierPanelSectionBody
      activeSection={activeSection}
      sectionReadinessUi={sectionReadinessUi}
      sectionGateErrorsById={sectionGateErrorsById}
      tzMinimalConstruction={tzMinimalModeBySection.construction}
      onToggleTzMinimalConstruction={() =>
        setTzMinimalModeBySection((prev) => ({
          ...prev,
          construction: !prev.construction,
        }))
      }
      currentPhase={currentPhase}
      isPhase1={isPhase1}
      isPhase2={isPhase2}
      tzMinimalModeBySection={tzMinimalModeBySection}
      setTzMinimalModeBySection={setTzMinimalModeBySection}
      dossier={dossier}
      setDossier={setDossier}
      passportHubModel={passportHubModel}
      skuDraft={skuDraft}
      setSkuDraft={setSkuDraft}
      nameDraft={nameDraft}
      setNameDraft={setNameDraft}
      internalArticleCode={internalArticleCode}
      passportCategoryCaption={passportCategoryCaption}
      setActivePassportSubNavId={setActivePassportSubNavId}
      tzScrollBehavior={tzScrollBehavior}
      appendPassportPostSignoffJournalNote={appendPassportPostSignoffJournalNote}
      passportDriftLogDone={passportDriftLogDone}
      setPassportDriftLogDone={setPassportDriftLogDone}
      tzWriteDisabled={tzWriteDisabled}
      jumpToTzSectionAnchor={jumpToTzSectionAnchor}
      jumpToMaterialMatTable={jumpToMaterialMatTable}
      jumpToSketchLineRefs={jumpToSketchLineRefs}
      jumpToConstructionContour={jumpToConstructionContour}
      jumpToQcArticleSection={jumpToQcArticleSection}
      onNavigateToTab={onNavigateToTab}
      dossierViewProfile={dossierViewProfile}
      passportCriticalAuditSummaries={passportCriticalAuditSummaries}
      workshop2FactoryShareUrl={workshop2FactoryShareUrl ?? ''}
      sketchBomRefsUnion={sketchBomRefsUnion}
      matSketchBomGapRefs={matSketchBomGapRefs}
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
      saveDraft={saveDraft}
      updatedByLabel={updatedByLabel}
      sectionRowsCurrent={sectionRowsCurrent}
      allowMultiHandbook={allowMultiHandbook}
      patchColor={patchColor}
      onSetHandbookParametersWithColorBundleSync={onSetHandbookParametersWithColorBundleSync}
      onSetHandbookParameters={onSetHandbookParameters}
      onFreeTextSide={onFreeTextSide}
      showPhase1PassportArticleCard={showPhase1PassportArticleCard}
      passportArticleCardStartRows={passportArticleCardStartRows}
      passportArticleCardStartExtras={passportArticleCardStartExtras}
      generalPassportPreSampleRows={generalPassportPreSampleRows}
      generalPassportPreSampleExtras={generalPassportPreSampleExtras}
      passportStep1BriefHref={passportStep1BriefHref}
      articleSku={articleSku}
      dvTzSignoffSides={dvTzSignoffSides}
      sectionSignoffPassportPreviews={sectionSignoffPassportPreviews}
      sectionSignoffOrganizationLabel={sectionSignoffOrganizationLabel}
      sectionSignoffProfileGateOk={sectionSignoffProfileGateOk}
      sectionSignoffSessionBrandOk={sectionSignoffSessionBrandOk}
      sectionSignoffSessionTechOk={sectionSignoffSessionTechOk}
      tzSectionSignoffRevokeAllowed={tzSectionSignoffRevokeAllowed}
      tzNotifyHighlightRowKey={tzNotifyHighlightRowKey}
      commitSectionSignoff={commitSectionSignoff}
      revokeSectionSignoff={revokeSectionSignoff}
      notifyStakeholdersForSectionSignoff={notifyStakeholdersForSectionSignoff}
      setSignoffDeadline={setSignoffDeadline}
      onSelectTzSection={setActiveSection}
      extraRowsCurrent={extraRowsCurrent}
      renderPhaseRow={renderPhaseRow}
      dossierAttrCardCtx={dossierAttrCardCtx}
      collectionId={collectionId}
      articleId={articleId}
      techPackSessionBlobById={techPackSessionBlobById}
      setTechPackSessionBlobById={setTechPackSessionBlobById}
      logTechPackZipLine={logTechPackZipLine}
      appendTzPulse={appendTzPulse}
      factorySendHubPreview={factorySendHubPreview}
      sketchViewFloor={sketchViewFloor}
      showVisualSketchLinkFieldsNav={showVisualSketchLinkFieldsNav}
      sketchPinLinkAudit={sketchPinLinkAudit}
      sketchTechGaps={sketchTechGaps}
      setSketchWorkspaceTab={setSketchWorkspaceTab}
      setSketchSurface={setSketchSurface}
      sketchMasterAnnotatorRef={sketchMasterAnnotatorRef}
      sketchSheetAnnotatorRef={sketchSheetAnnotatorRef}
      canOpenSketchFromToolbar={canOpenSketchFromToolbar}
      sketchEditsLocked={sketchEditsLocked}
      sketchSurface={sketchSurface}
      sketchWorkspaceTab={sketchWorkspaceTab}
      sketchWorkspaceStats={sketchWorkspaceStats}
      sketchSheetPickerId={sketchSheetPickerId}
      setSketchSheetPickerId={setSketchSheetPickerId}
      sketchMasterTemplateId={sketchMasterTemplateId}
      setSketchMasterTemplateId={setSketchMasterTemplateId}
      orgSketchTemplatesList={orgSketchTemplatesList}
      applyMasterSketchPinTemplate={applyMasterSketchPinTemplate}
      saveMasterSketchPinTemplate={saveMasterSketchPinTemplate}
      saveMasterSketchPinTemplateToOrg={saveMasterSketchPinTemplateToOrg}
      sketchAttributeOptions={sketchAttributeOptions}
      bomLinePickOptions={bomLinePickOptions}
      normalizedSketchSheets={normalizedSketchSheets}
      appendSketchSheetFromUpload={appendSketchSheetFromUpload}
      selectedAudienceLabel={selectedAudienceLabel}
      visualsCatalogAttributeIdsForSketch={visualsCatalogAttributeIdsForSketch}
      visualsCatalogSketchLinksForPins={visualsCatalogSketchLinksForPins}
      onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
      orgSketchLibraryRevision={orgSketchLibraryRevision}
      setOrgSketchLibraryRevision={setOrgSketchLibraryRevision}
      subcategorySketchActiveLevel={subcategorySketchActiveLevel}
      setSubcategorySketchActiveLevel={setSubcategorySketchActiveLevel}
      branchLevelsDetailsOpen={branchLevelsDetailsOpen}
      setBranchLevelsDetailsOpen={setBranchLevelsDetailsOpen}
      setSketchFloorMode={setSketchFloorMode}
      lockedSketchFloorOnly={lockedSketchFloorOnly}
      copySketchFloorLink={copySketchFloorLink}
      saveSketchLabelsSnapshot={saveSketchLabelsSnapshot}
      sketchBundleBusy={sketchBundleBusy}
      exportSketchVisualBundleZip={exportSketchVisualBundleZip}
      setSketchPinLibraryOpen={setSketchPinLibraryOpen}
      visualsCatalogOnlyRows={visualsCatalogOnlyRows}
      visualsCatalogOnlyExtras={visualsCatalogOnlyExtras}
      onOpenProblemBlock={openNextAssignmentBlocker}
      sampleIntakeCatalogRows={sampleIntakeCatalogRows}
      sampleIntakeCatalogExtras={sampleIntakeCatalogExtras}
      sendPanelProps={assignmentSendPanelBundle}
      handoffBlockProps={assignmentHandoffBundle}
      tzBlockersFooter={tzBlockersFooter}
    />
  );

  const internalArticleCodeDisplayForRibbon = isWorkshop2InternalArticleCodeValid(
    internalArticleCode
  )
    ? internalArticleCode
    : formatWorkshop2InternalArticleCodePlaceholder();

  const showCompactPassportContextRibbon =
    isPhase1 && activeSection !== 'general' && dossierViewUiCaps.showCompactPassportContextRibbon;

  const asideHasContent = dossierViewProfile === 'factory' || dossierViewProfile === 'finance';
  /** В фазе 1 глобальные подписи ролей скрыты — остаётся только «Подтверждение секции» на вкладках. */
  const hideTzGlobalRoleSignoffBlock = isPhase1;
  const showTzRightAside = !isPhase1 || Boolean(handbookCheckSnapshot);
  const showFooterTzSignoffShortcut = !isPhase1 || activeSection !== 'assignment';

  const showRollbackButton =
    dossier.lifecycleState === 'sent_to_production' || dossier.lifecycleState === 'handoff_ready';

  const handleRollbackToDevelopment = () => {
    setDossier((prev) => ({
      ...prev,
      lifecycleState: 'draft',
    }));
    toast({ title: 'Откат в разработку', description: 'ТЗ возвращено в статус черновика.' });
  };

  return (
    <div className="w-full min-w-0 space-y-3 text-left" data-w2-dossier-view={dossierViewProfile}>
      {showRollbackButton && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Статус:{' '}
              {dossier.lifecycleState === 'sent_to_production'
                ? 'В производстве'
                : 'Готово к передаче'}
            </h3>
            <p className="text-xs text-amber-800">ТЗ заблокировано для изменений.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleRollbackToDevelopment}>
            Откатить в разработку
          </Button>
        </div>
      )}
      <Workshop2Phase1DossierPanelBodyShell
        dossierViewProfile={dossierViewProfile}
        dossierNavPrimarySections={dossierNavPrimarySections}
        dossierNavSecondarySections={dossierNavSecondarySections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        sectionReadinessUi={sectionReadinessUi}
        sectionWarningsById={sectionWarningsById}
        dossier={dossier}
        tzWriteDisabled={tzWriteDisabled}
        onSwitchDossierViewToFull={() => setDossierViewProfileFromCtx('full')}
        isPhase1={isPhase1}
        jumpToTzSectionAnchor={jumpToTzSectionAnchor}
        jumpToConstructionContour={jumpToConstructionContour}
        jumpToSketchLineRefs={jumpToSketchLineRefs}
        asideHasContent={asideHasContent}
        showTzRightAside={showTzRightAside}
        dossierMainColumnFlash={dossierMainColumnFlash}
        stageBoardHandbookWarnings={stageBoardHandbookWarnings}
        tzRevokeDeniedHint={tzRevokeDeniedHint}
        onJumpToVisualBrandNotes={() => {
          setActiveSection('general');
          queueMicrotask(() => {
            document.getElementById('w2-attr-brandNotes')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          });
        }}
        showCompactPassportContextRibbon={showCompactPassportContextRibbon}
        skuDraft={skuDraft}
        nameDraft={nameDraft}
        internalArticleCodeDisplayForRibbon={internalArticleCodeDisplayForRibbon}
        sectionBody={sectionBody}
        sketchPinLibrary={{
          open: sketchPinLibraryOpen,
          onOpenChange: setSketchPinLibraryOpen,
          snapshots: sketchSnapshotsNewestFirst,
          snapshotDiffA: sketchSnapshotDiffA,
          snapshotDiffB: sketchSnapshotDiffB,
          onSnapshotDiffAChange: setSketchSnapshotDiffA,
          onSnapshotDiffBChange: setSketchSnapshotDiffB,
          snapshotDiffSummary: sketchSnapshotDiffSummary ?? '',
          onSnapshotDiffSummaryChange: setSketchSnapshotDiffSummary,
          onRestoreSnapshot: restoreSketchLabelsFromSnapshot,
          dossierPinTemplates: dossier.sketchPinTemplates,
          onDeleteDossierPinTemplate: deleteSketchPinTemplateById,
          collectionId,
          orgPinTemplates: orgSketchTemplatesList,
          onDeleteOrgPinTemplate: deleteOrgSketchPinTemplateById,
        }}
        rightAside={
          showTzRightAside
            ? {
                hideTzGlobalRoleSignoffBlock,
                allTzDigitalSignoffsDone,
                activeSectionSignGateMeets,
                tzDigitalSignoffRows,
                tzDigitalSignoffRowsGated,
                tzSignoffBlockHint: TZ_SIGNOFF_BLOCK_HINT,
                notifyResponsibleForTzRow,
                tzNotifyHighlightRowKey,
                updatedByLabel,
                tzRevokersEffective,
                signTzDigitalRow,
                revokeTzDigitalRow,
                handbookCheckSnapshot,
                handbookCheckReportExpanded,
                setHandbookCheckReportExpanded,
              }
            : null
        }
      />

      <Workshop2DossierPanelPostMainTrail
        persist={{
          updatedAtIso: dossier.updatedAt,
          savedHint,
          saveError,
          metricsFooterLine: dossierMetricsFooterLine,
        }}
        footer={{
          onBack,
          onPreviousStep,
          isPhase1,
          isPhase3,
          activeSection,
          saveDraft,
          runHandbookCheck,
          handbookCheckClean,
          showFooterTzSignoffShortcut,
          allSectionSignoffPairsDone,
          allTzDigitalSignoffsDone,
          jumpToTzSignoffsAreaFooter,
          handleContinue,
        }}
        finalWizard={{
          open: finalTzWizardOpen,
          onOpenChange: setFinalTzWizardOpen,
          exportLanguage,
          onExportLanguageChange: setExportLanguage,
          finalTzSpecDocumentHtml,
          phase1DossierJsonUtf8Bytes,
          tzWriteDisabled,
          onDownloadHtml: handleFinalTzDownloadHtml,
          onPrintPdf: handleFinalTzPrintToPdf,
        }}
        attrComments={{
          openAttrId: attrCommentDialogAttrId,
          onOpenChange: (open) => {
            if (!open) {
              setAttrCommentDialogAttrId(null);
              setAttrCommentDraft('');
            }
          },
          commentsById: attrCommentsById,
          draft: attrCommentDraft,
          draftSeverity: attrCommentDraftSeverity,
          draftAssignee: attrCommentDraftAssignee,
          draftDueAt: attrCommentDraftDueAt,
          draftVisibility: attrCommentDraftVisibility,
          onlyOpen: attrCommentOnlyOpen,
          onDraftChange: setAttrCommentDraft,
          onDraftSeverityChange: setAttrCommentDraftSeverity,
          onDraftAssigneeChange: setAttrCommentDraftAssignee,
          onDraftDueAtChange: setAttrCommentDraftDueAt,
          onDraftVisibilityChange: setAttrCommentDraftVisibility,
          onOnlyOpenChange: setAttrCommentOnlyOpen,
          onToggleCommentStatus: toggleAttrCommentStatus,
          onSend: saveAttrComment,
        }}
      />
    </div>
  );
}
