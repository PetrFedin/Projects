/**
 * Wave Z — реестр проводки каталога #41–60 (ТЗ construction/assignment, supply, fit, plan).
 * Статическая верификация API + UI path для CI (без PG). Не влияет на score_prod.
 */
import fs from 'node:fs';
import path from 'node:path';

import type {
  Workshop2CatalogWireEntry,
  Workshop2CatalogWireGap,
} from '@/lib/production/workshop2-catalog-items-1-20-wire';

export type { Workshop2CatalogWireEntry, Workshop2CatalogWireGap };

const ROOT = process.cwd();

const DOSSIER_ROUTE = 'src/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route.ts';
const HANDOFF_READINESS =
  'src/app/api/workshop2/articles/[collectionId]/[articleId]/handoff-readiness/route.ts';
const SAMPLE_ORDER =
  'src/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/route.ts';

/** Критичные маршруты и UI для пунктов 41–60 каталога «Разработка». */
export const WORKSHOP2_CATALOG_ITEMS_41_60_WIRE: Workshop2CatalogWireEntry[] = [
  {
    id: 41,
    nameRu: 'ТЗ · конструкция · скетчи',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop2-sketch-coverage-dossier-persist.ts',
      'src/components/brand/production/Workshop2ArticleWorkspace.tsx',
    ],
    uiPatterns: ['persistWorkshop2SketchCoverageMirrorToDossier'],
  },
  {
    id: 42,
    nameRu: 'ТЗ · конструкция · smart routing (ML flags)',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2SmartRoutingPanel.tsx',
      'src/lib/production/workshop2-smart-routing-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2SmartRoutingMirrorToDossier', 'engineKind'],
  },
  {
    id: 43,
    nameRu: 'ТЗ · конструкция · tech pack visual gate',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2TechPackVisualGateBanner.tsx',
      'src/lib/production/workshop2-tech-pack-visual-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2TechPackVisualMirrorToDossier'],
  },
  {
    id: 44,
    nameRu: 'ТЗ · задание · signoff checklist',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-phase1-dossier-panel-section-body-assignment.tsx',
      'src/lib/production/workshop2-assignment-signoff-dossier-persist.ts',
    ],
    uiPatterns: ['summarizeWorkshop2AssignmentSignoffChecklist'],
  },
  {
    id: 45,
    nameRu: 'ТЗ · задание · handoff bundles',
    apiRoutes: [HANDOFF_READINESS, DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop2-factory-handoff-commit-gate.ts',
      'src/lib/production/workshop2-factory-handoff-bundle-dossier-persist.ts',
    ],
    uiPatterns: ['evaluateWorkshop2FactoryHandoffCommitGate'],
  },
  {
    id: 46,
    nameRu: 'Снабжение · supply bundle',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-supply-panel.tsx',
      'src/lib/production/workshop2-supply-bundle-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2SupplyBundleMirrorToDossier'],
  },
  {
    id: 47,
    nameRu: 'Снабжение · PO ERP sync',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/purchase-orders/erp-mirror-sync/route.ts',
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/purchase-orders/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2PurchaseOrdersErpPanel.tsx',
      'src/lib/production/workshop2-purchase-order-erp-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2PurchaseOrderErpMirrorToDossier'],
  },
  {
    id: 48,
    nameRu: 'Снабжение · material requisition',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/sample-material-request/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2MaterialRequisitionPanel.tsx',
      'src/components/brand/production/Workshop2ProductionBomByNodesPanel.tsx',
    ],
  },
  {
    id: 49,
    nameRu: 'Снабжение · sample economics rollup',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2SampleEconomicsRollupPanel.tsx',
      'src/lib/production/workshop2-sample-economics-rollup-status.ts',
    ],
    uiPatterns: ['summarizeWorkshop2SampleEconomicsRollupStatus'],
  },
  {
    id: 50,
    nameRu: 'Снабжение · DPP export',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop2-dpp-export-gate.ts',
      'src/components/brand/production/Workshop2DppDossierExportBlock.tsx',
    ],
    uiPatterns: ['evaluateWorkshop2DppExportGate'],
  },
  {
    id: 51,
    nameRu: 'Снабжение · T&A milestones',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2TimeAndActionPanel.tsx',
      'src/lib/production/workshop2-ta-milestones-mirror-persist.ts',
    ],
    uiPatterns: ['copyTaMilestonesToDossier'],
  },
  {
    id: 52,
    nameRu: 'Снабжение · lab dips',
    apiRoutes: ['src/app/api/brand/workshop2/materials/lab-dips/route.ts'],
    uiFiles: [
      'src/components/brand/production/Workshop2MaterialLabDipsPanel.tsx',
      'src/lib/production/workshop2-lab-dip-from-dossier.ts',
    ],
  },
  {
    id: 53,
    nameRu: 'Снабжение · sustainability LCA',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/sustainability/lca-staging/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2SustainabilityPanel.tsx',
      'src/lib/production/workshop2-sustainability-lca-persist.ts',
    ],
    uiPatterns: ['collectWorkshop2SustainabilityExportChecks'],
  },
  {
    id: 54,
    nameRu: 'Примерка · fit sessions',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-fit-gold-panel.tsx',
      'src/lib/production/workshop2-fit-sessions-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2FitSessionsMirrorToDossier'],
  },
  {
    id: 55,
    nameRu: 'Примерка · Fit3D viewer',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/fit-3d-viewer.tsx',
      'src/lib/production/workshop2-fit3d-readiness-gate.ts',
    ],
    uiPatterns: ['buildWorkshop2Fit3dReadinessRecord'],
  },
  {
    id: 56,
    nameRu: 'Примерка · sample order',
    apiRoutes: [SAMPLE_ORDER, HANDOFF_READINESS],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleSamplePanel.tsx',
      'src/lib/production/workshop2-sample-order-gate.ts',
    ],
    uiPatterns: ['summarizeWorkshop2SampleOrderStatus'],
  },
  {
    id: 57,
    nameRu: 'Примерка · gold sample',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleSamplePanel.tsx',
      'src/lib/production/workshop2-gold-sample-status.ts',
    ],
    uiPatterns: ['summarizeWorkshop2GoldSampleStatus'],
  },
  {
    id: 58,
    nameRu: 'Примерка · floor MES bridge',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/floor/sample-status/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleSamplePanel.tsx',
      'src/lib/production/workshop2-floor-bridge-sync.ts',
    ],
    uiPatterns: ['workshop2-floor-sync-from-tab', 'floorBridgeMirror'],
  },
  {
    id: 59,
    nameRu: 'План · PO bundle',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-plan-po-panel.tsx',
      'src/lib/production/workshop2-plan-po-bundle-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2PlanPoBundleSnapshotToDossier'],
  },
  {
    id: 60,
    nameRu: 'План · supply risk / ML heuristic',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/risk-prediction/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2PredictiveRiskPanel.tsx',
      'src/lib/production/workshop2-supply-risk-sample-gate.ts',
    ],
    uiPatterns: ['persistWorkshop2SupplyRiskSnapshotToDossier'],
  },
];

/** Проверяет наличие файлов и UI-паттернов для каталога #41–60. */
export function verifyWorkshop2CatalogItems41To60Wire(): Workshop2CatalogWireGap[] {
  const gaps: Workshop2CatalogWireGap[] = [];

  for (const entry of WORKSHOP2_CATALOG_ITEMS_41_60_WIRE) {
    for (const rel of entry.apiRoutes) {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) {
        gaps.push({
          itemId: entry.id,
          kind: 'missing_api',
          detail: `API route missing: ${rel}`,
        });
      }
    }
    const uiContents: string[] = [];
    for (const rel of entry.uiFiles) {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) {
        gaps.push({
          itemId: entry.id,
          kind: 'missing_ui',
          detail: `UI file missing: ${rel}`,
        });
      } else {
        uiContents.push(fs.readFileSync(abs, 'utf8'));
      }
    }
    if (entry.uiPatterns?.length) {
      for (const pattern of entry.uiPatterns) {
        const found = uiContents.some((src) => src.includes(pattern));
        if (!found) {
          gaps.push({
            itemId: entry.id,
            kind: 'missing_ui_pattern',
            detail: `UI pattern "${pattern}" not found in ${entry.uiFiles.join(', ')}`,
          });
        }
      }
    }
  }

  return gaps;
}
