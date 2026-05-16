'use client';

import { useMemo } from 'react';
import type { StagesTabArticle } from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import {
  createStagesTabModuleNavigation,
  type StagesTabNavigationRouter,
} from '@/components/brand/production/stages-dependencies-tab-module-navigation';

export function useStagesDependenciesModuleNavigation(args: {
  poolArticles: StagesTabArticle[];
  collectionQuery: string;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  router: StagesTabNavigationRouter;
  focusArticle: StagesTabArticle | null;
}) {
  const { poolArticles, collectionQuery, mergeCollectionQuery, router, focusArticle } = args;

  return useMemo(
    () =>
      createStagesTabModuleNavigation({
        poolArticles,
        collectionQuery,
        mergeCollectionQuery,
        router,
        focusArticle,
      }),
    [poolArticles, collectionQuery, mergeCollectionQuery, router, focusArticle]
  );
}
