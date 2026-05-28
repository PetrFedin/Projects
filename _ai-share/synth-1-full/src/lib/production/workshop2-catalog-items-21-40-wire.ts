/**
 * Wave Y — реестр проводки каталога #21–40 (workspace shell / TZ sample→vault→QC path).
 * Статическая верификация API + UI path для CI (без PG).
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

/** Критичные маршруты и UI для пунктов 21–40 каталога «Разработка». */
export const WORKSHOP2_CATALOG_ITEMS_21_40_WIRE: Workshop2CatalogWireEntry[] = [
  {
    id: 21,
    nameRu: 'Оболочка · вкладка «Обзор»',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2OverviewKpiStrip.tsx',
      'src/components/brand/production/Workshop2ArticleWorkspace.tsx',
    ],
    uiPatterns: ['persistWorkshop2OverviewMirrorToDossier'],
  },
  {
    id: 22,
    nameRu: 'Оболочка · полоса вкладок',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop-article-main-tab-labels.ts',
      'src/lib/production/workshop2-main-tab-strip-status.ts',
      'src/components/brand/production/Workshop2ArticleWorkspace.tsx',
    ],
    uiPatterns: ['W2_ARTICLE_MAIN_TAB_STRIP', 'summarizeWorkshop2MainTabStripStatus'],
  },
  {
    id: 23,
    nameRu: 'Оболочка · related sections',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleRelatedSectionsStrip.tsx',
      'src/lib/production/workshop2-related-sections-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2RelatedSectionsMirrorToDossier'],
  },
  {
    id: 24,
    nameRu: 'Оболочка · конфликт версий 409',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2DossierVersionConflictDialog.tsx',
      'src/lib/production/workshop2-dossier-version-merge-policy.ts',
    ],
    uiPatterns: ['mergeWorkshop2DossierWithServerWinsPolicy'],
  },
  {
    id: 25,
    nameRu: 'Оболочка · профили вида ТЗ',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2Phase1DossierPanel.tsx',
      'src/lib/production/workshop2-dossier-layout-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2DossierLayoutMirrorToDossier'],
  },
  {
    id: 26,
    nameRu: 'Оболочка · operational TZ ribbon',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleOperationalTzRibbon.tsx',
      'src/lib/production/workshop2-operational-tz-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2OperationalTzMirrorToDossier'],
  },
  {
    id: 27,
    nameRu: 'Оболочка · handoff checklist',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/handoff-readiness/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2HandoffChecklistPanel.tsx',
      'src/lib/production/workshop2-handoff-readiness.ts',
    ],
    uiPatterns: ['evaluateWorkshop2HandoffReadiness'],
  },
  {
    id: 28,
    nameRu: 'ТЗ · паспорт · change requests',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/change-requests/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/workshop2-change-requests-panel.tsx',
      'src/lib/production/workshop2-pending-change-requests.ts',
    ],
  },
  {
    id: 29,
    nameRu: 'ТЗ · паспорт · identity gate',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-phase1-dossier-panel-section-body-general.tsx',
      'src/lib/production/workshop2-passport-identity-gate.ts',
    ],
    uiPatterns: ['evaluateWorkshop2PassportIdentityGate'],
  },
  {
    id: 30,
    nameRu: 'ТЗ · паспорт · designer intent',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop2-dossier-phase1.types.ts',
      'src/components/brand/production/workshop2-phase1-dossier-panel-section-body-general-design-visual.tsx',
    ],
    uiPatterns: ['designerIntent'],
  },
  {
    id: 31,
    nameRu: 'ТЗ · паспорт · визуальные референсы',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop2-visual-references-dossier-persist.ts',
      'src/lib/production/workshop2-tz-export-bundle-gate.ts',
    ],
    uiPatterns: ['persistWorkshop2VisualReferencesMirrorToDossier'],
  },
  {
    id: 32,
    nameRu: 'ТЗ · паспорт · цвет и палитра',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-phase1-dossier-panel-section-body-general.tsx',
      'src/lib/production/workshop2-colorway-lab-dip-sync.ts',
    ],
    uiPatterns: ['syncColorLabDipStatusesFromColorways'],
  },
  {
    id: 33,
    nameRu: 'ТЗ · паспорт · карточка артикула',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleFlatHub.tsx',
      'src/components/brand/production/Workshop2ArticleWorkspace.tsx',
    ],
  },
  {
    id: 34,
    nameRu: 'ТЗ · паспорт · InfoPick matrix',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-phase1-dossier-panel-section-body-general.tsx',
      'src/components/brand/production/workshop2-panel-status-banners.tsx',
      'src/lib/production/workshop2-infopick-matrix-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2InfopickMatrixMirrorToDossier'],
  },
  {
    id: 35,
    nameRu: 'ТЗ · материалы · состав',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/workshop2-phase1-dossier-panel-material-section-body.tsx',
      'src/lib/production/workshop2-material-composition-gate.ts',
      'src/lib/production/workshop2-material-composition-status.ts',
    ],
    uiPatterns: [
      'summarizeWorkshop2MaterialCompositionStatus',
      'evaluateWorkshop2MaterialCompositionGate',
    ],
  },
  {
    id: 36,
    nameRu: 'ТЗ · материалы · BOM по узлам',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2ProductionBomByNodesPanel.tsx',
      'src/lib/production/workshop2-bom-nodes-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2BomNodesMirrorToDossier'],
  },
  {
    id: 37,
    nameRu: 'ТЗ · материалы · бирка состава',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2CompositionLabelSpecBlock.tsx',
      'src/lib/production/workshop2-composition-label-pdf-export.ts',
    ],
  },
  {
    id: 38,
    nameRu: 'ТЗ · конструкция · POM',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/lib/production/workshop2-pom-table-dossier-persist.ts',
      'src/lib/production/workshop2-pom-table-status.ts',
    ],
    uiPatterns: ['persistWorkshop2PomTableMirrorToDossier'],
  },
  {
    id: 39,
    nameRu: 'ТЗ · конструкция · градации',
    apiRoutes: [DOSSIER_ROUTE],
    uiFiles: [
      'src/components/brand/production/Workshop2GradingMatrixPanel.tsx',
      'src/lib/production/workshop2-grading-apply-dossier-persist.ts',
    ],
    uiPatterns: ['persistWorkshop2GradingApplyMirrorToDossier'],
  },
  {
    id: 40,
    nameRu: 'ТЗ · конструкция · CAD / vault',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/vault/cad-mirror-sync/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2ConstructionCadViewerPanel.tsx',
      'src/lib/production/workshop2-cad-vault-dossier-persist.ts',
    ],
    uiPatterns: ['postWorkshop2CadVaultMirrorSync'],
  },
];

/** Проверяет наличие файлов и UI-паттернов для каталога #21–40. */
export function verifyWorkshop2CatalogItems21To40Wire(): Workshop2CatalogWireGap[] {
  const gaps: Workshop2CatalogWireGap[] = [];

  for (const entry of WORKSHOP2_CATALOG_ITEMS_21_40_WIRE) {
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
