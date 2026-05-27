/**
 * Wave Z — реестр проводки каталога #61–79 (plan ceilings, release, QC, stock, vault/docs).
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
const EXPORT_TZ =
  'src/app/api/workshop2/articles/[collectionId]/[articleId]/export-tz-bundle/route.ts';
const HANDOFF_PDF =
  'src/app/api/workshop2/articles/[collectionId]/[articleId]/handoff-pdf/route.ts';
const SAMPLE_ORDER =
  'src/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/route.ts';

/** Критичные маршруты и UI для пунктов 61–79 каталога «Разработка». */
export const WORKSHOP2_CATALOG_ITEMS_61_79_WIRE: Workshop2CatalogWireEntry[] = [
  {
    id: 61,
    nameRu: 'План · T&A (plan surface)',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2TimeAndActionPanel.tsx',
      'src/lib/production/workshop2-plan-ta-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2PlanTaMirrorToDossier'],
  },
  {
    id: 62,
    nameRu: 'План · B2B showroom',
    apiRoutes: ['src/app/api/workshop2/articles/[collectionId]/[articleId]/showroom/route.ts'],
    uiFiles: [
      'src/components/brand/production/Workshop2B2BIntegrationPanel.tsx',
      'src/lib/production/workshop2-showroom-publish-gate.ts',
    ],
    uiPatterns: ['evaluateWorkshop2ShowroomPublishGate'],
  },
  {
    id: 63,
    nameRu: 'План · nesting / factory params',
    apiRoutes: [EXPORT_TZ, SAMPLE_ORDER],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-nesting-panel.tsx',
      'src/lib/production/workshop2-nesting-export-gate.ts',
    ],
    uiPatterns: ['evaluateWorkshop2NestingExportGate'],
  },
  {
    id: 64,
    nameRu: 'Производство · release routing',
    apiRoutes: [DOSSIER_ROUTE, EXPORT_TZ],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-release-panel.tsx',
      'src/lib/production/workshop2-release-routing-dossier-persist.ts',
    ],
    uiPatterns: ['evaluateWorkshop2ReleaseRoutingHandoffGate'],
  },
  {
    id: 65,
    nameRu: 'Производство · logistics mirror',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/logistics/mirror-sync/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2LogisticsPanel.tsx',
      'src/lib/production/workshop2-logistics-dossier-persist.ts',
    ],
    uiPatterns: ['logisticsMode'],
  },
  {
    id: 66,
    nameRu: 'Производство · factory ERP',
    apiRoutes: ['src/app/api/workshop2/articles/[collectionId]/[articleId]/factory-erp/route.ts'],
    uiFiles: [
      'src/components/brand/production/Workshop2FactoryERPIntegrationPanel.tsx',
      'src/lib/production/workshop2-factory-erp-sync-gate.ts',
    ],
    uiPatterns: ['sanitizeWorkshop2FactoryErpSyncClaim'],
  },
  {
    id: 67,
    nameRu: 'ОТК · QC panel',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-qc-panel.tsx',
      'src/lib/production/workshop2-qc-panel-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2QcPanelMirrorToDossier'],
  },
  {
    id: 68,
    nameRu: 'ОТК · mobile inspector',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/app/brand/production/workshop2/(w2-enterprise)/inspector/[orderId]/page.tsx',
      'src/lib/production/workshop2-inspector-report-client.ts',
    ],
    uiPatterns: ['fetchWorkshop2InspectorReport'],
  },
  {
    id: 69,
    nameRu: 'ОТК · AQL calculator',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2AQLInspectionPanel.tsx',
      'src/lib/production/workshop2-qc-aql-dossier-persist.ts',
    ],
  },
  {
    id: 70,
    nameRu: 'ОТК · supplier QC scorecard',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/purchase-orders/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/supplier-qc-scorecard.tsx',
      'src/lib/production/workshop2-supplier-qc-dossier-persist.ts',
    ],
  },
  {
    id: 71,
    nameRu: 'Приёмка · WMS stock + MoySklad stub',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/wms/balances/route.ts',
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/wms/import-moysklad/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-stock-panel.tsx',
      'src/lib/production/workshop2-stock-wms-ledger-persist.ts',
    ],
    uiPatterns: ['evaluateWorkshop2StockWmsHandoffGate'],
  },
  {
    id: 72,
    nameRu: 'Приёмка · sample intake',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-sample-intake-stock-section.tsx',
      'src/lib/production/workshop2-sample-intake-status.ts',
    ],
    uiPatterns: ['summarizeWorkshop2SampleIntakeStatus'],
  },
  {
    id: 73,
    nameRu: 'Приёмка · sample plan from dossier',
    apiRoutes: [SAMPLE_ORDER],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleSamplePanel.tsx',
      'src/lib/production/workshop2-sample-order-movement-auto.ts',
    ],
    uiPatterns: ['syncMovementOnSampleOrderStatusChange'],
  },
  {
    id: 74,
    nameRu: 'Приёмка · sample goods movement',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/sample-order/[orderId]/movement/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2SampleGoodsMovementPanel.tsx',
      'src/lib/production/workshop2-sample-movement-status.ts',
    ],
    uiPatterns: ['summarizeWorkshop2SampleMovementStatus'],
  },
  {
    id: 75,
    nameRu: 'Документы · vault panel',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-article-workspace-vault-panel.tsx',
      'src/lib/production/workshop2-vault-panel-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2VaultPanelMirrorToDossier'],
  },
  {
    id: 76,
    nameRu: 'Документы · export TZ ZIP',
    apiRoutes: [EXPORT_TZ],
    uiFiles: [
      'src/lib/production/workshop2-tz-export-bundle-gate.ts',
      'src/lib/production/workshop2-tz-export-bundle-status.ts',
    ],
    uiPatterns: ['evaluateWorkshop2TzExportBundleGate'],
  },
  {
    id: 77,
    nameRu: 'Документы · index (no full-text)',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop2-documents-index.ts',
      'src/lib/production/workshop2-documents-index-status.ts',
    ],
    uiPatterns: ['fullTextSearchAvailable'],
  },
  {
    id: 78,
    nameRu: 'Документы · PLM outbox transport',
    apiRoutes: [
      'src/app/api/workshop2/plm-outbox/process/route.ts',
      'src/app/api/workshop2/plm-outbox/status/route.ts',
    ],
    uiFiles: [
      'src/lib/server/workshop2-plm-outbox.ts',
      'src/lib/production/workshop2-plm-manual-partner-ack.ts',
    ],
    uiPatterns: ['retryWorkshop2PlmOutboxFailed'],
  },
  {
    id: 79,
    nameRu: 'Документы · handoff PDF / sketch export',
    apiRoutes: [HANDOFF_PDF, EXPORT_TZ],
    uiFiles: [
      'src/lib/production/sketch-visual-bundle-export.ts',
      'src/lib/production/workshop2-handoff-pdf-dossier-persist.ts',
      'src/components/brand/production/Workshop2ArticleWorkspace.tsx',
    ],
    uiPatterns: ['persistWorkshop2HandoffPdfMirrorToDossier'],
  },
];

/** Проверяет наличие файлов и UI-паттернов для каталога #61–79. */
export function verifyWorkshop2CatalogItems61To79Wire(): Workshop2CatalogWireGap[] {
  const gaps: Workshop2CatalogWireGap[] = [];

  for (const entry of WORKSHOP2_CATALOG_ITEMS_61_79_WIRE) {
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
