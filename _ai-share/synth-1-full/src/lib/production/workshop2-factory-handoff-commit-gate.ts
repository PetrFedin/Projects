/**
 * Ворота commit handoff в цех: signoff + readiness + скетч + tech pack.
 */
import { evaluateWorkshop2AssignmentSignoffGate } from '@/lib/production/workshop2-assignment-signoff-gate';
import {
  evaluateWorkshop2HandoffReadiness,
  type Workshop2HandoffReadinessCheck,
  type Workshop2HandoffReadinessInput,
  type Workshop2HandoffReadinessResult,
} from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2PlmOutboxHandoffGate } from '@/lib/production/workshop2-plm-outbox-dossier-persist';
import { evaluateWorkshop2MatchmakerHandoffGate } from '@/lib/production/workshop2-matchmaker-handoff-gate';
import { evaluateWorkshop2HubRollupHandoffGate } from '@/lib/production/workshop2-hub-collection-rollup-persist';
import { evaluateWorkshop2HubActivityHandoffGate } from '@/lib/production/workshop2-hub-activity-dossier-persist';
import { evaluateWorkshop2MatchmakerMirrorHandoffGate } from '@/lib/production/workshop2-matchmaker-dossier-persist';
import { evaluateWorkshop2ReferencesHandoffGate } from '@/lib/production/workshop2-references-dossier-persist';
import { evaluateWorkshop2SetupHealthHandoffGate } from '@/lib/production/workshop2-setup-health-dossier-persist';
import { evaluateWorkshop2SignoffStagesProgressMirrorGate } from '@/lib/production/workshop2-signoff-stages-dossier-persist';
import { evaluateWorkshop2BackendHealthHandoffGate } from '@/lib/production/workshop2-backend-health-dossier-persist';
import { evaluateWorkshop2SkuValidationHandoffGate } from '@/lib/production/workshop2-article-sku-validation-persist';
import { evaluateWorkshop2SseRealtimeHandoffGate } from '@/lib/production/workshop2-sse-realtime-dossier-persist';
import { evaluateWorkshop2SupplierQcHandoffGate } from '@/lib/production/workshop2-supplier-qc-dossier-persist';
import { evaluateWorkshop2RndLifecycleHandoffGate } from '@/lib/production/workshop2-rnd-lifecycle-dossier-persist';
import { evaluateWorkshop2CadVaultLinkHandoffGate } from '@/lib/production/workshop2-cad-vault-dossier-persist';
import { evaluateWorkshop2PurchaseOrderErpHandoffGate } from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import { evaluateWorkshop2QcAqlHandoffGate } from '@/lib/production/workshop2-qc-aql-dossier-persist';
import { evaluateWorkshop2QcPanelHandoffGate } from '@/lib/production/workshop2-qc-panel-dossier-persist';
import { evaluateWorkshop2InspectorReportHandoffGate } from '@/lib/production/workshop2-inspector-report-dossier-persist';
import { evaluateWorkshop2VisualReferencesHandoffGate } from '@/lib/production/workshop2-visual-references-dossier-persist';
import { evaluateWorkshop2FitSessionsHandoffGate } from '@/lib/production/workshop2-fit-sessions-dossier-persist';
import { evaluateWorkshop2PlanPoHandoffGate } from '@/lib/production/workshop2-plan-po-bundle-persist';
import { evaluateWorkshop2SupplyRiskHandoffGate } from '@/lib/production/workshop2-supply-risk-sample-gate';
import { evaluateWorkshop2LogisticsHandoffGate } from '@/lib/production/workshop2-logistics-dossier-persist';
import { evaluateWorkshop2InternalWmsReserveSnapshotHandoffGate } from '@/lib/production/workshop2-internal-wms';
import { evaluateWorkshop2StockWmsHandoffGate } from '@/lib/production/workshop2-stock-wms-ledger-persist';
import { evaluateWorkshop2SmartRoutingHandoffGate } from '@/lib/production/workshop2-smart-routing-dossier-persist';
import { evaluateWorkshop2PomTableHandoffGate } from '@/lib/production/workshop2-pom-table-dossier-persist';
import { evaluateWorkshop2FactoryHandoffBundleCommitGate } from '@/lib/production/workshop2-factory-handoff-bundle-dossier-persist';
import { evaluateWorkshop2VaultPanelHandoffGate } from '@/lib/production/workshop2-vault-panel-dossier-persist';
import {
  evaluateWorkshop2ErpJournalSecondLayerHandoff,
  evaluateWorkshop2NestingJournalSecondLayerHandoff,
} from '@/lib/production/workshop2-journal-mode-second-layer';
import { evaluateWorkshop2GradingApplyHandoffGate } from '@/lib/production/workshop2-grading-apply-dossier-persist';
import { evaluateWorkshop2ReadinessPulseHandoffGate } from '@/lib/production/workshop2-readiness-pulse-dossier-persist';
import { evaluateWorkshop2CategoryMergeHandoffGate } from '@/lib/production/workshop2-category-merge-dossier-persist';
import { evaluateWorkshop2ReleaseRoutingHandoffGate } from '@/lib/production/workshop2-release-routing-dossier-persist';
import { evaluateWorkshop2SketchCoverageHandoffGate } from '@/lib/production/workshop2-sketch-coverage-dossier-persist';
import { evaluateWorkshop2OverviewHandoffGate } from '@/lib/production/workshop2-overview-dossier-persist';
import { evaluateWorkshop2OperationalTzHandoffGate } from '@/lib/production/workshop2-operational-tz-dossier-persist';
import { evaluateWorkshop2TechPackVisualHandoffGate } from '@/lib/production/workshop2-tech-pack-visual-dossier-persist';
import { evaluateWorkshop2IntegrationCeilingHandoffWarnings } from '@/lib/production/workshop2-integration-ceiling-fail-closed';
import { evaluateWorkshop2ShowroomB2bHandoffGate } from '@/lib/production/workshop2-showroom-b2b-journal';
import { evaluateWorkshop2Fit3dVaultGlbGate } from '@/lib/production/workshop2-fit3d-vault-gate';
import { evaluateWorkshop2DppRegistryExportGate } from '@/lib/production/workshop2-dpp-registry-staging';
import { evaluateWorkshop2SustainabilityStagingExportGate } from '@/lib/production/workshop2-sustainability-staging';
import { evaluateWorkshop2Fit3dStagingExportGate } from '@/lib/production/workshop2-fit3d-staging';
import { evaluateWorkshop2NestingStagingExportGate } from '@/lib/production/workshop2-nesting-staging-journal';
import { evaluateWorkshop2FactoryErpStagingHandoffGate } from '@/lib/production/workshop2-factory-erp-staging';
import { evaluateWorkshop2PlmTransportHandoffGate } from '@/lib/production/workshop2-plm-transport-journal';
import { evaluateWorkshop2FloorBridgeHandoffGate } from '@/lib/production/workshop2-floor-bridge-dossier-persist';
import { evaluateWorkshop2HubInventoryHandoffGate } from '@/lib/production/workshop2-hub-inventory-dossier-persist';
import { evaluateWorkshop2PendingChangeRequestHandoffGate } from '@/lib/production/workshop2-pending-change-requests';

export type Workshop2FactoryHandoffCommitGateResult = {
  allowed: boolean;
  readiness: Workshop2HandoffReadinessResult;
};

export function evaluateWorkshop2FactoryHandoffCommitGate(
  input: Workshop2HandoffReadinessInput
): Workshop2FactoryHandoffCommitGateResult {
  const base = evaluateWorkshop2HandoffReadiness(input);
  const extra: Workshop2HandoffReadinessCheck[] = [];

  const signoff = evaluateWorkshop2AssignmentSignoffGate(input.dossier);
  if (signoff) extra.push(signoff);

  const sketchHandoff = evaluateWorkshop2SketchCoverageHandoffGate(
    input.dossier,
    input.categoryLeafId
  );
  if (sketchHandoff) extra.push(sketchHandoff);

  const techHandoff = evaluateWorkshop2TechPackVisualHandoffGate(input.dossier);
  if (techHandoff) extra.push(techHandoff);

  const overviewHandoff = evaluateWorkshop2OverviewHandoffGate(input.dossier);
  if (overviewHandoff) extra.push(overviewHandoff);

  const operationalHandoff = evaluateWorkshop2OperationalTzHandoffGate(input.dossier);
  if (operationalHandoff) extra.push(operationalHandoff);

  const plm = evaluateWorkshop2PlmOutboxHandoffGate(input.dossier);
  if (plm) extra.push(plm);

  const matchmakerMirror = evaluateWorkshop2MatchmakerMirrorHandoffGate(input.dossier);
  if (matchmakerMirror) extra.push(matchmakerMirror);
  else {
    const matchmaker = evaluateWorkshop2MatchmakerHandoffGate(input.dossier);
    if (matchmaker) extra.push(matchmaker);
  }

  const hubRollup = evaluateWorkshop2HubRollupHandoffGate(input.dossier);
  if (hubRollup) extra.push(hubRollup);

  const hubActivity = evaluateWorkshop2HubActivityHandoffGate(input.dossier);
  if (hubActivity) extra.push(hubActivity);

  const references = evaluateWorkshop2ReferencesHandoffGate(input.dossier);
  if (references) extra.push(references);

  const setupHealth = evaluateWorkshop2SetupHealthHandoffGate(input.dossier);
  if (setupHealth) extra.push(setupHealth);

  const signoffStages = evaluateWorkshop2SignoffStagesProgressMirrorGate(input.dossier);
  if (signoffStages) extra.push(signoffStages);

  const backendHealth = evaluateWorkshop2BackendHealthHandoffGate(input.dossier);
  if (backendHealth) extra.push(backendHealth);

  const skuValidation = evaluateWorkshop2SkuValidationHandoffGate(input.dossier);
  if (skuValidation) extra.push(skuValidation);

  const sseRealtime = evaluateWorkshop2SseRealtimeHandoffGate(input.dossier);
  if (sseRealtime) extra.push(sseRealtime);

  const supplierQc = evaluateWorkshop2SupplierQcHandoffGate(input.dossier);
  if (supplierQc) extra.push(supplierQc);

  const rndLifecycle = evaluateWorkshop2RndLifecycleHandoffGate(input.dossier);
  if (rndLifecycle) extra.push(rndLifecycle);

  const cadVault = evaluateWorkshop2CadVaultLinkHandoffGate(input.dossier);
  if (cadVault) extra.push(cadVault);

  const poErpHandoff = evaluateWorkshop2PurchaseOrderErpHandoffGate(input.dossier);
  if (poErpHandoff) extra.push(poErpHandoff);

  const showroomB2b = evaluateWorkshop2ShowroomB2bHandoffGate({ dossier: input.dossier });
  if (showroomB2b) extra.push(showroomB2b);

  const fit3dVault = evaluateWorkshop2Fit3dVaultGlbGate({ dossier: input.dossier });
  if (fit3dVault) extra.push(fit3dVault);

  const dppStaging = evaluateWorkshop2DppRegistryExportGate({ dossier: input.dossier });
  if (dppStaging) extra.push(dppStaging);
  const lcaStaging = evaluateWorkshop2SustainabilityStagingExportGate({ dossier: input.dossier });
  if (lcaStaging) extra.push(lcaStaging);
  const fit3dStaging = evaluateWorkshop2Fit3dStagingExportGate({ dossier: input.dossier });
  if (fit3dStaging) extra.push(fit3dStaging);
  const nestingStaging = evaluateWorkshop2NestingStagingExportGate({ dossier: input.dossier });
  if (nestingStaging) extra.push(nestingStaging);
  const erpStaging = evaluateWorkshop2FactoryErpStagingHandoffGate(input.dossier);
  if (erpStaging) extra.push(erpStaging);
  const plmTransport = evaluateWorkshop2PlmTransportHandoffGate({ dossier: input.dossier });
  if (plmTransport) extra.push(plmTransport);

  const qcAql = evaluateWorkshop2QcAqlHandoffGate(input.dossier);
  if (qcAql) extra.push(qcAql);

  const qcPanel = evaluateWorkshop2QcPanelHandoffGate(input.dossier);
  if (qcPanel) extra.push(qcPanel);

  const inspectorReport = evaluateWorkshop2InspectorReportHandoffGate(input.dossier);
  if (inspectorReport) extra.push(inspectorReport);

  const visualRefs = evaluateWorkshop2VisualReferencesHandoffGate(input.dossier);
  if (visualRefs) extra.push(visualRefs);

  const fitSessions = evaluateWorkshop2FitSessionsHandoffGate(input.dossier);
  if (fitSessions) extra.push(fitSessions);

  const planPo = evaluateWorkshop2PlanPoHandoffGate(input.dossier);
  if (planPo) extra.push(planPo);

  const supplyRisk = evaluateWorkshop2SupplyRiskHandoffGate(input.dossier);
  if (supplyRisk) extra.push(supplyRisk);

  const logistics = evaluateWorkshop2LogisticsHandoffGate(input.dossier);
  if (logistics) extra.push(logistics);

  const stockWms = evaluateWorkshop2StockWmsHandoffGate({ dossier: input.dossier });
  if (stockWms) extra.push(stockWms);

  const wmsSnapshot = evaluateWorkshop2InternalWmsReserveSnapshotHandoffGate({
    dossier: input.dossier,
  });
  if (wmsSnapshot) extra.push(wmsSnapshot);

  const routing = evaluateWorkshop2SmartRoutingHandoffGate(input.dossier);
  if (routing) extra.push(routing);

  const pom = evaluateWorkshop2PomTableHandoffGate(input.dossier);
  if (pom) extra.push(pom);

  const handoffBundle = evaluateWorkshop2FactoryHandoffBundleCommitGate(input.dossier);
  if (handoffBundle) extra.push(handoffBundle);

  const vault = evaluateWorkshop2VaultPanelHandoffGate(input.dossier);
  if (vault) extra.push(vault);

  const nestingJournal = evaluateWorkshop2NestingJournalSecondLayerHandoff(input.dossier);
  if (nestingJournal) extra.push(nestingJournal);
  const erpJournal = evaluateWorkshop2ErpJournalSecondLayerHandoff(input.dossier);
  if (erpJournal) extra.push(erpJournal);

  const gradingHandoff = evaluateWorkshop2GradingApplyHandoffGate(input.dossier);
  if (gradingHandoff) extra.push(gradingHandoff);

  const pulseHandoff = evaluateWorkshop2ReadinessPulseHandoffGate(input.dossier);
  if (pulseHandoff) extra.push(pulseHandoff);

  const categoryMergeHandoff = evaluateWorkshop2CategoryMergeHandoffGate(input.dossier);
  if (categoryMergeHandoff) extra.push(categoryMergeHandoff);

  const releaseRoutingHandoff = evaluateWorkshop2ReleaseRoutingHandoffGate(input.dossier);
  if (releaseRoutingHandoff) extra.push(releaseRoutingHandoff);

  const pendingCr = evaluateWorkshop2PendingChangeRequestHandoffGate(input.dossier);
  if (pendingCr) extra.push(pendingCr);

  const hubInventory = evaluateWorkshop2HubInventoryHandoffGate(input.dossier);
  if (hubInventory) extra.push(hubInventory);

  const floorBridge = evaluateWorkshop2FloorBridgeHandoffGate(input.dossier);
  if (floorBridge) extra.push(floorBridge);

  const ceilingWarnings = evaluateWorkshop2IntegrationCeilingHandoffWarnings(
    process.env,
    input.dossier
  );
  const checks = [...base.checks, ...extra, ...ceilingWarnings];
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
