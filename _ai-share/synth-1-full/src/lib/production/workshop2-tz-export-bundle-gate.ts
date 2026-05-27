/**
 * Блокировка export-tz-bundle при неготовых скетче / tech pack.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2NestingRequest,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2SketchCoverage } from '@/lib/production/workshop2-sketch-coverage';
import { evaluateWorkshop2SketchCoverageExportGate } from '@/lib/production/workshop2-sketch-coverage-dossier-persist';
import { evaluateWorkshop2TechPackVisualExportGate } from '@/lib/production/workshop2-tech-pack-visual-dossier-persist';
import { evaluateWorkshop2TechPackVisualGateSummary } from '@/lib/production/workshop2-tech-pack-visual-gate-summary';
import { evaluateWorkshop2HandoffPdfMirrorExportGate } from '@/lib/production/workshop2-handoff-pdf-dossier-persist';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2DppExportGate } from '@/lib/production/workshop2-dpp-export-gate';
import { evaluateWorkshop2NestingExportGate } from '@/lib/production/workshop2-nesting-export-gate';
import { evaluateWorkshop2SustainabilityExportGate } from '@/lib/production/workshop2-sustainability-lca-persist';
import { evaluateWorkshop2DppRegistryExportGate } from '@/lib/production/workshop2-dpp-registry-staging';
import { evaluateWorkshop2SustainabilityCertifiedExportGate } from '@/lib/production/workshop2-sustainability-certified-persist';
import { evaluateWorkshop2Fit3dVaultExportGate } from '@/lib/production/workshop2-fit3d-vault-gate';
import { evaluateWorkshop2SustainabilityStagingExportGate } from '@/lib/production/workshop2-sustainability-staging';
import { evaluateWorkshop2Fit3dStagingExportGate } from '@/lib/production/workshop2-fit3d-staging';
import { evaluateWorkshop2NestingStagingExportGate } from '@/lib/production/workshop2-nesting-staging-journal';
import { evaluateWorkshop2PlmTransportExportGate } from '@/lib/production/workshop2-plm-transport-journal';
import { evaluateWorkshop2VisualReferencesExportGate } from '@/lib/production/workshop2-visual-references-dossier-persist';
import { evaluateWorkshop2GradingApplyExportGate } from '@/lib/production/workshop2-grading-apply-dossier-persist';
import { evaluateWorkshop2ReleaseRoutingExportGate } from '@/lib/production/workshop2-release-routing-dossier-persist';
import { evaluateWorkshop2DocumentsIndexExportGate } from '@/lib/production/workshop2-documents-index-dossier-persist';
import { evaluateWorkshop2IntegrationCeilingExportWarnings } from '@/lib/production/workshop2-integration-ceiling-fail-closed';
import { evaluateWorkshop2HubRollupExportGate } from '@/lib/production/workshop2-hub-collection-rollup-persist';
import { evaluateWorkshop2HubActivityExportGate } from '@/lib/production/workshop2-hub-activity-dossier-persist';
import { evaluateWorkshop2PlmOutboxExportGate } from '@/lib/production/workshop2-plm-outbox-dossier-persist';
import { evaluateWorkshop2CadVaultLinkExportGate } from '@/lib/production/workshop2-cad-vault-dossier-persist';
import { evaluateWorkshop2PurchaseOrderErpExportGate } from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import { evaluateWorkshop2LogisticsExportGate } from '@/lib/production/workshop2-logistics-dossier-persist';
import { evaluateWorkshop2VaultPanelExportGate } from '@/lib/production/workshop2-vault-panel-dossier-persist';
import {
  evaluateWorkshop2ErpJournalSecondLayerExport,
  evaluateWorkshop2NestingJournalSecondLayerExport,
} from '@/lib/production/workshop2-journal-mode-second-layer';

export type Workshop2TzExportBundleGateResult = {
  allowed: boolean;
  checks: Workshop2HandoffReadinessCheck[];
};

export function evaluateWorkshop2TzExportBundleGate(input: {
  dossier: Workshop2DossierPhase1;
  categoryLeafId?: string;
  collectionId?: string;
  articleId?: string;
  articleSku?: string;
  articleName?: string;
  hasActiveSampleOrder?: boolean;
  nestingRequest?: Workshop2NestingRequest | null;
}): Workshop2TzExportBundleGateResult {
  const checks: Workshop2HandoffReadinessCheck[] = [];

  const sketchMirror = evaluateWorkshop2SketchCoverageExportGate(input.dossier);
  if (sketchMirror) {
    checks.push(sketchMirror);
  } else {
    const sketch = evaluateWorkshop2SketchCoverage(input.dossier, input.categoryLeafId);
    if (sketch?.state === 'empty') {
      checks.push({
        id: 'export.sketch.empty',
        severity: 'blocker',
        messageRu: sketch.hintRu ?? 'ZIP ТЗ: нет скетча — загрузите канон или лист с подложкой.',
      });
    } else if (sketch?.state === 'partial') {
      checks.push({
        id: 'export.sketch.partial',
        severity: 'blocker',
        messageRu: sketch.hintRu ?? 'ZIP ТЗ: скетч неполный — метки BOM и ревизия обязательны.',
      });
    }
  }

  const techMirror = evaluateWorkshop2TechPackVisualExportGate(input.dossier);
  if (techMirror) {
    checks.push(techMirror);
  } else {
    const tech = evaluateWorkshop2TechPackVisualGateSummary(input.dossier);
    if (!tech || tech.attachmentCount === 0) {
      checks.push({
        id: 'export.tech_pack.empty',
        severity: 'blocker',
        messageRu: 'ZIP ТЗ: нет вложений tech pack на конструкции.',
      });
    } else if (tech.openVisualGateCount > 0) {
      checks.push({
        id: 'export.tech_pack.visual_gate',
        severity: 'blocker',
        messageRu:
          tech.hintRu ??
          `ZIP ТЗ: визуальный gate — ${tech.openVisualGateCount} открытых предупреждений.`,
      });
    }
  }

  const pdfMirror = evaluateWorkshop2HandoffPdfMirrorExportGate(input.dossier);
  if (pdfMirror) checks.push(pdfMirror);

  const visualRefs = evaluateWorkshop2VisualReferencesExportGate(input.dossier);
  if (visualRefs) checks.push(visualRefs);

  const grading = evaluateWorkshop2GradingApplyExportGate(input.dossier);
  if (grading) checks.push(grading);

  const releaseRouting = evaluateWorkshop2ReleaseRoutingExportGate(input.dossier);
  if (releaseRouting) checks.push(releaseRouting);

  const documentsIndex = evaluateWorkshop2DocumentsIndexExportGate(input.dossier);
  if (documentsIndex) checks.push(documentsIndex);

  if (input.collectionId && input.articleId) {
    const dpp = evaluateWorkshop2DppExportGate({
      dossier: input.dossier,
      collectionId: input.collectionId,
      articleId: input.articleId,
      articleSku: input.articleSku,
      articleName: input.articleName,
    });
    if (dpp) checks.push(dpp);
    const dppRegistry = evaluateWorkshop2DppRegistryExportGate({ dossier: input.dossier });
    if (dppRegistry) checks.push(dppRegistry);
    const fit3d = evaluateWorkshop2Fit3dVaultExportGate({
      dossier: input.dossier,
      collectionId: input.collectionId,
      articleId: input.articleId,
    });
    if (fit3d) checks.push(fit3d);
  }

  const nesting = evaluateWorkshop2NestingExportGate({
    hasActiveSampleOrder: Boolean(input.hasActiveSampleOrder),
    nesting: input.nestingRequest,
  });
  if (nesting) checks.push(nesting);
  const nestingStaging = evaluateWorkshop2NestingStagingExportGate({ dossier: input.dossier });
  if (nestingStaging) checks.push(nestingStaging);
  const plmStaging = evaluateWorkshop2PlmTransportExportGate({ dossier: input.dossier });
  if (plmStaging) checks.push(plmStaging);

  if (input.collectionId && input.articleId) {
    const lca =
      evaluateWorkshop2SustainabilityCertifiedExportGate({
        dossier: input.dossier,
        collectionId: input.collectionId,
        articleId: input.articleId,
      }) ??
      evaluateWorkshop2SustainabilityExportGate({
        dossier: input.dossier,
        collectionId: input.collectionId,
        articleId: input.articleId,
      });
    if (lca) checks.push(lca);
    const lcaStaging = evaluateWorkshop2SustainabilityStagingExportGate({ dossier: input.dossier });
    if (lcaStaging) checks.push(lcaStaging);
    const fit3dStaging = evaluateWorkshop2Fit3dStagingExportGate({ dossier: input.dossier });
    if (fit3dStaging) checks.push(fit3dStaging);
  }

  const hubRollup = evaluateWorkshop2HubRollupExportGate(input.dossier);
  if (hubRollup) checks.push(hubRollup);
  const hubActivity = evaluateWorkshop2HubActivityExportGate(input.dossier);
  if (hubActivity) checks.push(hubActivity);
  const plmExport = evaluateWorkshop2PlmOutboxExportGate(input.dossier);
  if (plmExport) checks.push(plmExport);
  const cadExport = evaluateWorkshop2CadVaultLinkExportGate(input.dossier);
  if (cadExport) checks.push(cadExport);
  const poErpExport = evaluateWorkshop2PurchaseOrderErpExportGate(input.dossier);
  if (poErpExport) checks.push(poErpExport);
  const logisticsExport = evaluateWorkshop2LogisticsExportGate(input.dossier);
  if (logisticsExport) checks.push(logisticsExport);

  const vaultExport = evaluateWorkshop2VaultPanelExportGate(input.dossier);
  if (vaultExport) checks.push(vaultExport);

  const nestingJournal = evaluateWorkshop2NestingJournalSecondLayerExport(input.dossier);
  if (nestingJournal) checks.push(nestingJournal);
  const erpJournal = evaluateWorkshop2ErpJournalSecondLayerExport(input.dossier);
  if (erpJournal) checks.push(erpJournal);

  for (const ceilingWarn of evaluateWorkshop2IntegrationCeilingExportWarnings(
    process.env,
    input.dossier
  )) {
    checks.push(ceilingWarn);
  }

  const blockers = checks.filter((c) => c.severity === 'blocker');
  return { allowed: blockers.length === 0, checks };
}
