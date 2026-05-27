/**
 * Wave X — реестр проводки каталога #1–20 (hub / onboarding / TZ create / workspace shell).
 * Статическая верификация API + UI path для CI (без PG).
 */
import fs from 'node:fs';
import path from 'node:path';

export type Workshop2CatalogWireEntry = {
  id: number;
  nameRu: string;
  /** Относительные пути от корня репозитория — должны существовать. */
  apiRoutes: string[];
  uiFiles: string[];
  /** Подстроки, которые должны встречаться хотя бы в одном uiFile (опционально). */
  uiPatterns?: string[];
};

const ROOT = process.cwd();

/** Критичные маршруты и UI для пунктов 1–20 каталога «Разработка». */
export const WORKSHOP2_CATALOG_ITEMS_1_20_WIRE: Workshop2CatalogWireEntry[] = [
  {
    id: 1,
    nameRu: 'Хаб · сетка коллекций',
    apiRoutes: [
      'src/app/api/workshop2/setup/pg-counts/route.ts',
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/hub/rollup-mirror/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2TabContent.tsx',
      'src/components/brand/production/Workshop2HubPgMetricsStrip.tsx',
    ],
    uiPatterns: [
      'buildWorkshop2TabContentDossierRollupByCollectionId',
      'fetchWorkshop2HubPgMetrics',
    ],
  },
  {
    id: 2,
    nameRu: 'Хаб · список артикулов',
    apiRoutes: ['src/app/api/workshop2/articles/dossiers/batch/route.ts'],
    uiFiles: [
      'src/components/brand/production/workshop2-tab-content-articles-panel.tsx',
      'src/components/brand/production/Workshop2ArticleFlatHub.tsx',
    ],
    uiPatterns: ['fetchWorkshop2HubBatchScores'],
  },
  {
    id: 3,
    nameRu: 'Хаб · фильтры',
    apiRoutes: ['src/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route.ts'],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleFlatHub.tsx',
      'src/lib/production/workshop2-hub-filter-preset-storage.ts',
    ],
  },
  {
    id: 4,
    nameRu: 'Хаб · онбординг',
    apiRoutes: ['src/app/api/workshop2/references/status/route.ts'],
    uiFiles: [
      'src/components/brand/production/Workshop2HubOnboardingDialog.tsx',
      'src/lib/production/workshop2-hub-onboarding-create-flow.ts',
    ],
    uiPatterns: ['runWorkshop2HubOnboardingCreateFlow'],
  },
  {
    id: 5,
    nameRu: 'Хаб · setup / окружение',
    apiRoutes: [
      'src/app/api/workshop2/health/route.ts',
      'src/app/api/workshop2/setup/pg-counts/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2SetupHealthPanel.tsx',
      'src/app/brand/production/workshop2/(w2-enterprise)/setup/page.tsx',
    ],
  },
  {
    id: 6,
    nameRu: 'Хаб · справочники',
    apiRoutes: [
      'src/app/api/workshop2/references/status/route.ts',
      'src/app/api/workshop2/references/categories/route.ts',
    ],
    uiFiles: ['src/app/brand/production/workshop2/(w2-enterprise)/references/page.tsx'],
  },
  {
    id: 7,
    nameRu: 'Хаб · health API',
    apiRoutes: ['src/app/api/workshop2/health/route.ts'],
    uiFiles: [
      'src/components/brand/production/Workshop2BackendStatusBanner.tsx',
      'src/components/brand/production/use-workshop2-backend-status-hint.ts',
    ],
    uiPatterns: ['/api/workshop2/health'],
  },
  {
    id: 8,
    nameRu: 'Хаб · журнал активности',
    apiRoutes: [
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/events/route.ts',
      'src/app/api/workshop2/articles/[collectionId]/[articleId]/hub/activity-mirror/route.ts',
    ],
    uiFiles: [
      'src/components/brand/production/Workshop2TabContent.tsx',
      'src/lib/production/workshop2-hub-activity-client.ts',
    ],
    uiPatterns: ['fetchWorkshop2HubServerActivityBatch'],
  },
  {
    id: 9,
    nameRu: 'Matchmaker / DFM',
    apiRoutes: ['src/app/api/brand/workshop2/ai/match-contractors/route.ts'],
    uiFiles: ['src/components/brand/production/workshop2-contractor-matchmaker.tsx'],
  },
  {
    id: 10,
    nameRu: 'Local state provider',
    apiRoutes: ['src/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route.ts'],
    uiFiles: [
      'src/app/brand/production/workshop2/workshop2-local-state-provider.tsx',
      'src/lib/production/workshop2-hub-dossier-map.ts',
    ],
  },
  {
    id: 11,
    nameRu: 'Создание · диалог артикула',
    apiRoutes: ['src/app/api/workshop2/articles/sku-availability/route.ts'],
    uiFiles: ['src/components/brand/production/Workshop2CreateArticleDialog.tsx'],
    uiPatterns: ['fetchWorkshop2SkuAvailability'],
  },
  {
    id: 12,
    nameRu: 'Создание · валидация SKU',
    apiRoutes: ['src/app/api/workshop2/articles/sku-availability/route.ts'],
    uiFiles: [
      'src/lib/production/workshop2-article-sku-validation-persist.ts',
      'src/lib/production/workshop2-article-sku-availability-client.ts',
    ],
    uiPatterns: ['persistWorkshop2ArticleSkuValidationMirrorToDossier'],
  },
  {
    id: 13,
    nameRu: 'Создание · assembler preview',
    apiRoutes: [],
    uiFiles: [
      'src/lib/production/workshop2-article-assembler.ts',
      'src/lib/production/workshop2-assembly-preview-dossier-persist.ts',
    ],
    uiPatterns: ['buildWorkshop2ArticleAssemblyPreview'],
  },
  {
    id: 14,
    nameRu: 'Создание · POM opt-in',
    apiRoutes: ['src/app/api/workshop2/references/pom-templates/apply/route.ts'],
    uiFiles: ['src/lib/production/workshop2-pom-create-policy.ts'],
  },
  {
    id: 15,
    nameRu: 'Создание · PUT досье',
    apiRoutes: ['src/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route.ts'],
    uiFiles: ['src/lib/production/workshop2-api-client.ts'],
    uiPatterns: ['saveWorkshop2DossierToApi'],
  },
  {
    id: 16,
    nameRu: 'Создание · merge категории',
    apiRoutes: [],
    uiFiles: [
      'src/lib/production/workshop2-article-assembler.ts',
      'src/lib/production/workshop2-category-merge-dossier-persist.ts',
    ],
    uiPatterns: ['previewWorkshop2ArticleAssemblyMerge'],
  },
  {
    id: 17,
    nameRu: 'Оболочка · header pulse',
    apiRoutes: [],
    uiFiles: [
      'src/components/brand/production/Workshop2ArticleWorkspace.tsx',
      'src/lib/production/workshop2-readiness-pulse-dossier-persist.ts',
    ],
  },
  {
    id: 18,
    nameRu: 'Оболочка · PLM outbox',
    apiRoutes: ['src/app/api/workshop2/plm-outbox/status/route.ts'],
    uiFiles: [
      'src/lib/production/workshop2-plm-outbox-badge.ts',
      'src/components/brand/production/Workshop2ArticleWorkspace.tsx',
    ],
    uiPatterns: ['fetchWorkshop2PlmOutboxStatus'],
  },
  {
    id: 19,
    nameRu: 'Оболочка · R&D lifecycle',
    apiRoutes: ['src/app/api/workshop2/articles/[collectionId]/[articleId]/dossier/route.ts'],
    uiFiles: [
      'src/lib/production/workshop2-rnd-state-machine.ts',
      'src/lib/production/workshop2-rnd-lifecycle-dossier-persist.ts',
    ],
  },
  {
    id: 20,
    nameRu: 'Оболочка · SSE realtime',
    apiRoutes: ['src/app/api/workshop2/realtime/route.ts'],
    uiFiles: [
      'src/lib/production/workshop2-realtime-stub.ts',
      'src/lib/production/workshop2-sse-realtime-dossier-persist.ts',
    ],
    uiPatterns: ['useWorkshop2DossierRealtime'],
  },
];

export type Workshop2CatalogWireGap = {
  itemId: number;
  kind: 'missing_api' | 'missing_ui' | 'missing_ui_pattern';
  detail: string;
};

/** Проверяет наличие файлов и UI-паттернов для каталога #1–20. */
export function verifyWorkshop2CatalogItems1To20Wire(): Workshop2CatalogWireGap[] {
  const gaps: Workshop2CatalogWireGap[] = [];

  for (const entry of WORKSHOP2_CATALOG_ITEMS_1_20_WIRE) {
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
