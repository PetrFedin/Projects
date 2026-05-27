/**
 * Gate заказа образца: handoff-readiness + подписи секций ТЗ + матрица InfoPick.
 */
import { evaluateWorkshop2AssignmentSignoffMirrorGate } from '@/lib/production/workshop2-assignment-signoff-dossier-persist';
import { evaluateWorkshop2InfopickMatrixMirrorGate } from '@/lib/production/workshop2-infopick-matrix-dossier-persist';
import { evaluateWorkshop2BomNodesSampleGate } from '@/lib/production/workshop2-bom-nodes-dossier-persist';
import { evaluateWorkshop2ReadinessPulseSampleGate } from '@/lib/production/workshop2-readiness-pulse-dossier-persist';
import { evaluateWorkshop2AssemblyPreviewMirrorGate } from '@/lib/production/workshop2-assembly-preview-dossier-persist';
import { evaluateWorkshop2TaMilestonesSampleGate } from '@/lib/production/workshop2-ta-milestones-mirror-persist';
import { evaluateWorkshop2CategoryMergeSampleGate } from '@/lib/production/workshop2-category-merge-dossier-persist';
import { evaluateWorkshop2ArticleFormMirrorSampleGate } from '@/lib/production/workshop2-article-form-dossier-persist';
import { evaluateWorkshop2ChangeRequestMirrorGate } from '@/lib/production/workshop2-change-request-dossier-persist';
import { evaluateWorkshop2LabDipMirrorGate } from '@/lib/production/workshop2-lab-dip-dossier-persist';
import { evaluateWorkshop2LabDipSampleGate } from '@/lib/production/workshop2-lab-dip-sample-gate';
import { evaluateWorkshop2SupplyBundleSampleGate } from '@/lib/production/workshop2-supply-bundle-dossier-persist';
import { evaluateWorkshop2PlanTaSampleGate } from '@/lib/production/workshop2-plan-ta-dossier-persist';
import { evaluateWorkshop2VaultPanelSampleGate } from '@/lib/production/workshop2-vault-panel-dossier-persist';
import { evaluateWorkshop2MaterialCompositionGate } from '@/lib/production/workshop2-material-composition-gate';
import { evaluateWorkshop2PassportIdentityGate } from '@/lib/production/workshop2-passport-identity-gate';
import { evaluateWorkshop2PendingChangeRequestGate } from '@/lib/production/workshop2-pending-change-requests';
import { evaluateWorkshop2SampleEconomicsGate } from '@/lib/production/workshop2-sample-economics-gate';
import { evaluateWorkshop2StockWmsLedgerGate } from '@/lib/production/workshop2-stock-wms-ledger-persist';
/** MoySklad не участвует в sample-order gate — только internal PG WMS + dossier ledger. */
import { evaluateWorkshop2SetupHealthSampleGate } from '@/lib/production/workshop2-setup-health-dossier-persist';
import { evaluateWorkshop2SupplierQcSampleGate } from '@/lib/production/workshop2-supplier-qc-dossier-persist';
import { evaluateWorkshop2HubRollupSampleGate } from '@/lib/production/workshop2-hub-collection-rollup-persist';
import { evaluateWorkshop2BackendHealthSampleGate } from '@/lib/production/workshop2-backend-health-dossier-persist';
import { evaluateWorkshop2SkuValidationSampleGate } from '@/lib/production/workshop2-article-sku-validation-persist';
import { evaluateWorkshop2PlanPoSampleGate } from '@/lib/production/workshop2-plan-po-bundle-persist';
import { evaluateWorkshop2SupplyRiskSampleGate } from '@/lib/production/workshop2-supply-risk-sample-gate';
import { evaluateWorkshop2HubFilterSampleGate } from '@/lib/production/workshop2-hub-filter-dossier-persist';
import { evaluateWorkshop2VisualReferencesSampleGate } from '@/lib/production/workshop2-visual-references-dossier-persist';
import { evaluateWorkshop2PurchaseOrderErpSampleGate } from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import { evaluateWorkshop2FitSessionsSampleGate } from '@/lib/production/workshop2-fit-sessions-dossier-persist';
import { evaluateWorkshop2LogisticsSampleGate } from '@/lib/production/workshop2-logistics-dossier-persist';
import { evaluateWorkshop2OverviewSampleGate } from '@/lib/production/workshop2-overview-dossier-persist';
import { evaluateWorkshop2RelatedSectionsSampleGate } from '@/lib/production/workshop2-related-sections-dossier-persist';
import { evaluateWorkshop2DossierLayoutSampleGate } from '@/lib/production/workshop2-dossier-layout-dossier-persist';
import { evaluateWorkshop2OperationalTzSampleGate } from '@/lib/production/workshop2-operational-tz-dossier-persist';
import { evaluateWorkshop2HandoffPdfSampleGate } from '@/lib/production/workshop2-handoff-pdf-dossier-persist';
import { evaluateWorkshop2HubOnboardingSampleGate } from '@/lib/production/workshop2-hub-onboarding-dossier-persist';
import { evaluateWorkshop2HubInventorySampleGate } from '@/lib/production/workshop2-hub-inventory-dossier-persist';
import { evaluateWorkshop2PlmOutboxSampleGate } from '@/lib/production/workshop2-plm-outbox-dossier-persist';
import { evaluateWorkshop2HubActivitySampleGate } from '@/lib/production/workshop2-hub-activity-dossier-persist';
import { evaluateWorkshop2MatchmakerMirrorSampleGate } from '@/lib/production/workshop2-matchmaker-dossier-persist';
import { evaluateWorkshop2ReferencesSampleGate } from '@/lib/production/workshop2-references-dossier-persist';
import { evaluateWorkshop2SseRealtimeSampleGate } from '@/lib/production/workshop2-sse-realtime-dossier-persist';
import { evaluateWorkshop2RndLifecycleSampleGate } from '@/lib/production/workshop2-rnd-lifecycle-dossier-persist';
import { evaluateWorkshop2CadVaultLinkSampleGate } from '@/lib/production/workshop2-cad-vault-dossier-persist';
import { evaluateWorkshop2SmartRoutingSampleGate } from '@/lib/production/workshop2-smart-routing-dossier-persist';
import { evaluateWorkshop2FloorBridgeSampleGate } from '@/lib/production/workshop2-floor-bridge-dossier-persist';
import { evaluateWorkshop2ShowroomB2bHandoffGate } from '@/lib/production/workshop2-showroom-b2b-journal';
import { evaluateWorkshop2Fit3dVaultGlbGate } from '@/lib/production/workshop2-fit3d-vault-gate';
import { evaluateWorkshop2Fit3dStagingSampleGate } from '@/lib/production/workshop2-fit3d-staging';
import { evaluateWorkshop2PlmTransportHandoffGate } from '@/lib/production/workshop2-plm-transport-journal';
import { evaluateWorkshop2FactoryErpStagingHandoffGate } from '@/lib/production/workshop2-factory-erp-staging';
import { evaluateWorkshop2QcAqlSampleGate } from '@/lib/production/workshop2-qc-aql-dossier-persist';
import { evaluateWorkshop2QcPanelSampleGate } from '@/lib/production/workshop2-qc-panel-dossier-persist';
import { evaluateWorkshop2InspectorReportSampleGate } from '@/lib/production/workshop2-inspector-report-dossier-persist';
import { evaluateWorkshop2ArticleDevelopmentPathGate } from '@/lib/production/workshop2-article-development-state';
import {
  evaluateWorkshop2HandoffReadiness,
  type Workshop2HandoffReadinessInput,
  type Workshop2HandoffReadinessResult,
} from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2RuMarkingSampleOrderGate } from '@/lib/production/workshop2-marking-sample-order-gate';

export type Workshop2SampleOrderGateResult = {
  allowed: boolean;
  readiness: Workshop2HandoffReadinessResult;
};

export function evaluateWorkshop2SampleOrderGate(
  input: Workshop2HandoffReadinessInput
): Workshop2SampleOrderGateResult {
  const base = evaluateWorkshop2HandoffReadiness(input);
  const extraChecks = [
    evaluateWorkshop2PassportIdentityGate({ dossier: input.dossier }),
    evaluateWorkshop2AssignmentSignoffMirrorGate(input.dossier),
    evaluateWorkshop2InfopickMatrixMirrorGate(input.dossier, input.categoryLeafId),
    evaluateWorkshop2BomNodesSampleGate(input.dossier),
    evaluateWorkshop2ReadinessPulseSampleGate(input.dossier),
    evaluateWorkshop2AssemblyPreviewMirrorGate(input.dossier),
    evaluateWorkshop2TaMilestonesSampleGate(input.dossier),
    evaluateWorkshop2CategoryMergeSampleGate(input.dossier),
    evaluateWorkshop2ArticleFormMirrorSampleGate(input.dossier),
    evaluateWorkshop2ChangeRequestMirrorGate(input.dossier),
    evaluateWorkshop2LabDipMirrorGate(input.dossier) ??
      evaluateWorkshop2LabDipSampleGate(input.dossier),
    evaluateWorkshop2SupplyBundleSampleGate(input.dossier),
    evaluateWorkshop2PlanTaSampleGate(input.dossier),
    evaluateWorkshop2VaultPanelSampleGate(input.dossier),
    evaluateWorkshop2MaterialCompositionGate(input.dossier),
    evaluateWorkshop2SampleEconomicsGate(input.dossier),
    evaluateWorkshop2StockWmsLedgerGate({ dossier: input.dossier }),
    evaluateWorkshop2SetupHealthSampleGate(input.dossier),
    evaluateWorkshop2SupplierQcSampleGate(input.dossier),
    evaluateWorkshop2HubRollupSampleGate(input.dossier),
    evaluateWorkshop2BackendHealthSampleGate(input.dossier),
    evaluateWorkshop2SkuValidationSampleGate(input.dossier),
    evaluateWorkshop2PlanPoSampleGate(input.dossier),
    evaluateWorkshop2SupplyRiskSampleGate(input.dossier),
    evaluateWorkshop2HubFilterSampleGate(input.dossier),
    evaluateWorkshop2VisualReferencesSampleGate(input.dossier),
    evaluateWorkshop2PurchaseOrderErpSampleGate(input.dossier),
    evaluateWorkshop2FitSessionsSampleGate(input.dossier),
    evaluateWorkshop2LogisticsSampleGate(input.dossier),
    evaluateWorkshop2OverviewSampleGate(input.dossier),
    evaluateWorkshop2RelatedSectionsSampleGate(input.dossier),
    evaluateWorkshop2DossierLayoutSampleGate(input.dossier),
    evaluateWorkshop2OperationalTzSampleGate(input.dossier),
    evaluateWorkshop2HandoffPdfSampleGate(input.dossier),
    evaluateWorkshop2HubOnboardingSampleGate(input.dossier),
    evaluateWorkshop2HubInventorySampleGate(input.dossier),
    evaluateWorkshop2PlmOutboxSampleGate(input.dossier),
    evaluateWorkshop2HubActivitySampleGate(input.dossier),
    evaluateWorkshop2MatchmakerMirrorSampleGate(input.dossier),
    evaluateWorkshop2ReferencesSampleGate(input.dossier),
    evaluateWorkshop2SseRealtimeSampleGate(input.dossier),
    evaluateWorkshop2RndLifecycleSampleGate(input.dossier),
    evaluateWorkshop2CadVaultLinkSampleGate(input.dossier),
    evaluateWorkshop2SmartRoutingSampleGate(input.dossier),
    evaluateWorkshop2QcAqlSampleGate(input.dossier),
    evaluateWorkshop2QcPanelSampleGate(input.dossier),
    evaluateWorkshop2InspectorReportSampleGate(input.dossier),
    evaluateWorkshop2FloorBridgeSampleGate(input.dossier),
    evaluateWorkshop2ShowroomB2bHandoffGate({ dossier: input.dossier }),
    evaluateWorkshop2Fit3dVaultGlbGate({ dossier: input.dossier }),
    evaluateWorkshop2Fit3dStagingSampleGate({ dossier: input.dossier }),
    evaluateWorkshop2PlmTransportHandoffGate({ dossier: input.dossier }),
    evaluateWorkshop2FactoryErpStagingHandoffGate(input.dossier),
    evaluateWorkshop2ArticleDevelopmentPathGate(input.dossier),
    evaluateWorkshop2RuMarkingSampleOrderGate(input.dossier),
  ].filter((c): c is NonNullable<typeof c> => c != null);

  const checks = [...base.checks, ...extraChecks];
  const blockers = checks.filter((c) => c.severity === 'blocker');
  const warnings = checks.filter((c) => c.severity === 'warning');
  const score10 = Math.max(0, Math.min(10, 10 - blockers.length * 3 - warnings.length * 0.5));

  const readiness: Workshop2HandoffReadinessResult = {
    ...base,
    checks,
    ready: blockers.length === 0,
    score10: blockers.length === 0 && warnings.length === 0 ? 10 : Number(score10.toFixed(1)),
  };

  return { allowed: readiness.ready, readiness };
}
