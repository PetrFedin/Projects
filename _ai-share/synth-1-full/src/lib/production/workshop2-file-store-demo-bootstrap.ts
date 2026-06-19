/**
 * Wave P/S — автоподстановка demo-ss27-01/02/03 в file-store при PG off.
 * Гарантирует 200 на GET dossier / hub batch без ручного seed PG.
 */
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2Ss27MenCoat01FullTzDemoDossier,
  buildWorkshop2Ss27UnisexSneakers03DemoDossier,
  buildWorkshop2Ss27WomenDress02DemoDossier,
  isSs27MenCoatFullTzDemoArticle,
  isSs27UnisexSneakersDemoArticle,
  isSs27WomenDressDemoArticle,
} from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { assembleWorkshop2ArticleFromTaxonomy } from '@/lib/production/workshop2-article-assembler';
import { persistWorkshop2HubOnboardingStateToDossier } from '@/lib/production/workshop2-hub-onboarding-dossier-persist';
import {
  WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID,
  WORKSHOP2_HUB_ONBOARDING_DEMO_SKU,
} from '@/lib/production/workshop2-hub-onboarding-create-flow';

export type Workshop2FileStoreDemoArticleSpec = {
  articleId: string;
  sku: string;
  categoryLeafId: string;
  build: (updatedBy: string) => Workshop2DossierPhase1;
};

/** Каталог SS27 demo-артикулов для file-store bootstrap (primary + secondary UAT). */
export const WORKSHOP2_FILE_STORE_DEMO_ARTICLES: Workshop2FileStoreDemoArticleSpec[] = [
  {
    articleId: 'demo-ss27-01',
    sku: 'SS27-M-COAT-01',
    categoryLeafId: 'catalog-apparel-g0-l0',
    build: (by) =>
      buildWorkshop2Ss27MenCoat01FullTzDemoDossier(
        findHandbookLeafById('catalog-apparel-g0-l0') ?? null,
        by
      ),
  },
  {
    articleId: 'demo-ss27-02',
    sku: 'SS27-W-DRS-02',
    categoryLeafId: 'catalog-apparel-g2-l0',
    build: (by) =>
      buildWorkshop2Ss27WomenDress02DemoDossier(
        findHandbookLeafById('catalog-apparel-g2-l0') ?? null,
        by
      ),
  },
  {
    articleId: 'demo-ss27-03',
    sku: 'SS27-U-SNK-03',
    categoryLeafId: 'catalog-shoes-g0-l0',
    build: (by) =>
      buildWorkshop2Ss27UnisexSneakers03DemoDossier(
        findHandbookLeafById('catalog-shoes-g0-l0') ?? null,
        by
      ),
  },
  {
    articleId: WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID,
    sku: WORKSHOP2_HUB_ONBOARDING_DEMO_SKU,
    categoryLeafId: 'catalog-apparel-g1-l0',
    build: (by) => {
      const assembled = assembleWorkshop2ArticleFromTaxonomy({
        categoryLeafId: 'catalog-apparel-g1-l0',
        audienceId: 'women',
        isUnisex: false,
        sku: WORKSHOP2_HUB_ONBOARDING_DEMO_SKU,
        name: 'Онбординг · demo-ss27-04',
        updatedBy: by,
      });
      if (!assembled) {
        return persistWorkshop2HubOnboardingStateToDossier(emptyWorkshop2DossierPhase1(), {
          done: true,
          workspaceOpened: true,
          role: 'technologist',
          markCompleted: true,
        });
      }
      return persistWorkshop2HubOnboardingStateToDossier(assembled.dossier, {
        done: true,
        workspaceOpened: true,
        role: 'technologist',
        markCompleted: true,
      });
    },
  },
];

export function isWorkshop2FileStoreDemoArticle(
  collectionId: string,
  article: { id: string; sku?: string }
): boolean {
  if (collectionId !== 'SS27') return false;
  return (
    isSs27MenCoatFullTzDemoArticle(collectionId, article) ||
    isSs27WomenDressDemoArticle(collectionId, article) ||
    isSs27UnisexSneakersDemoArticle(collectionId, article) ||
    (collectionId === 'SS27' && article.id === WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID)
  );
}

export function buildWorkshop2FileStoreDemoDossier(input: {
  collectionId: string;
  articleId: string;
  updatedBy?: string;
}): Workshop2DossierPhase1 | null {
  if (input.collectionId !== 'SS27') return null;
  const spec = WORKSHOP2_FILE_STORE_DEMO_ARTICLES.find((a) => a.articleId === input.articleId);
  if (!spec) return null;
  return spec.build(input.updatedBy ?? 'file-store-demo-bootstrap');
}
