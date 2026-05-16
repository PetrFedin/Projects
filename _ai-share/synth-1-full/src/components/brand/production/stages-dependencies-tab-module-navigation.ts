import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import { ROUTES } from '@/lib/routes';
import { STAGES_SKU_PARAM, STAGES_WORK_SKU_PARAM } from '@/lib/production/stages-url';
import type { StagesTabArticle } from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export type StagesTabNavigationRouter = { push: (href: string) => void };

export type StagesTabModuleNavigation = {
  buildTransitionUrl: (targetHref: string, chosenArticleId: string, stepId: string) => string;
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string;
  navigateToStageModule: (step: CollectionStep, targetHref: string) => void;
};

/** Сборка URL переходов в модули этапов (как в экране этапов). */
export function createStagesTabModuleNavigation(args: {
  poolArticles: StagesTabArticle[];
  collectionQuery: string;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  router: StagesTabNavigationRouter;
  focusArticle: StagesTabArticle | null;
}): StagesTabModuleNavigation {
  const { poolArticles, collectionQuery, mergeCollectionQuery, router, focusArticle } = args;

  const buildTransitionUrl = (targetHref: string, chosenArticleId: string, stepId: string) => {
    const article = poolArticles.find((a) => a.id === chosenArticleId);
    const merged = mergeCollectionQuery(targetHref, collectionQuery);
    if (typeof window === 'undefined') return merged;
    const u = new URL(merged, window.location.origin);
    if (chosenArticleId) u.searchParams.set(STAGES_SKU_PARAM, chosenArticleId);
    u.searchParams.delete('stagesPick');
    u.searchParams.delete(STAGES_WORK_SKU_PARAM);
    if (stepId) u.searchParams.set('stagesStep', stepId);
    if (article) {
      u.searchParams.set('sku', article.sku);
      u.searchParams.set('productId', article.id);
    }

    const pathNorm = (u.pathname.replace(/\/$/, '') || '/') as string;
    const collectionsNewBase = ROUTES.brand.collectionsNew.replace(/\/$/, '');
    if (pathNorm === collectionsNewBase || pathNorm.endsWith('/collections/new')) {
      const cid = u.searchParams.get('collectionId')?.trim();
      if (cid && cid.toLowerCase() !== 'new') {
        u.pathname = ROUTES.brand.production;
        u.searchParams.set('floorTab', 'workshop');
      }
    }

    return `${u.pathname}${u.search}`;
  };

  const mergeModuleHref = (href: string, stepId: string, articleId?: string) => {
    const id = articleId ?? focusArticle?.id;
    if (!id) return mergeCollectionQuery(href, collectionQuery);
    return buildTransitionUrl(href, id, stepId);
  };

  const navigateToStageModule = (step: CollectionStep, targetHref: string) => {
    if (step.collectionScopedModuleNav) {
      router.push(mergeCollectionQuery(targetHref, collectionQuery));
      return;
    }
    if (!focusArticle) return;
    router.push(buildTransitionUrl(targetHref, focusArticle.id, step.id));
  };

  return { buildTransitionUrl, mergeModuleHref, navigateToStageModule };
}
