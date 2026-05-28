'use client';

import { useCallback, useMemo, useState } from 'react';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import {
  buildDisplayedCollectionArticles,
  countCollectionArticlesNeedingAttention,
  downloadCollectionArticlesCsv,
} from '@/app/brand/production/production-page-collection-articles-helpers';

export function useBrandProductionCollectionArticlesListUi(args: {
  collectionArticles: readonly CollectionArticle[];
  collectionIdFromQuery: string;
  dropLabelById: Record<string, string>;
}) {
  const { collectionArticles, collectionIdFromQuery, dropLabelById } = args;

  const [articleSearch, setArticleSearch] = useState('');
  const [articleFilterStage, setArticleFilterStage] = useState<string>('');
  const [articleFilterDrop, setArticleFilterDrop] = useState<string>('');
  const [articleFocusNeedsAttention, setArticleFocusNeedsAttention] = useState(false);
  const [articleSortBy, setArticleSortBy] = useState<'stage' | 'drop' | 'revenue'>('stage');

  const displayedArticles = useMemo(
    () =>
      buildDisplayedCollectionArticles(collectionArticles, {
        articleSearch,
        articleFilterStage,
        articleFilterDrop,
        articleFocusNeedsAttention,
        articleSortBy,
      }),
    [
      collectionArticles,
      articleSearch,
      articleFilterStage,
      articleFilterDrop,
      articleFocusNeedsAttention,
      articleSortBy,
    ]
  );

  const needsAttentionCount = useMemo(
    () => countCollectionArticlesNeedingAttention(collectionArticles),
    [collectionArticles]
  );

  const exportArticlesCsv = useCallback(
    () =>
      downloadCollectionArticlesCsv({
        displayedArticles,
        dropLabelById,
        collectionIdFromQuery,
      }),
    [displayedArticles, dropLabelById, collectionIdFromQuery]
  );

  return {
    articleSearch,
    setArticleSearch,
    articleFilterStage,
    setArticleFilterStage,
    articleFilterDrop,
    setArticleFilterDrop,
    articleFocusNeedsAttention,
    setArticleFocusNeedsAttention,
    articleSortBy,
    setArticleSortBy,
    displayedArticles,
    needsAttentionCount,
    exportArticlesCsv,
  };
}
