'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BrandProductionWorkshopArticlesCardTable } from '@/app/brand/production/brand-production-workshop-articles-card-table';
import { BrandProductionWorkshopArticlesCardToolbar } from '@/app/brand/production/brand-production-workshop-articles-card-toolbar';
import type { BrandProductionWorkshopArticlesCardProps } from '@/app/brand/production/brand-production-workshop-articles-card-types';

export type { WorkshopArticlesProgressSummary } from '@/app/brand/production/brand-production-workshop-articles-card-types';

export function BrandProductionWorkshopArticlesCard(
  props: BrandProductionWorkshopArticlesCardProps
) {
  const {
    collectionLabel,
    collectionQuery,
    totalCollectionArticles,
    displayedArticles,
    dropLabelById,
    articlesProgress,
    articleSearch,
    onArticleSearchChange,
    articleFilterStage,
    onArticleFilterStageChange,
    articleFilterDrop,
    onArticleFilterDropChange,
    articleSortBy,
    onArticleSortByChange,
    articleFocusNeedsAttention,
    onToggleArticleFocusNeedsAttention,
    needsAttentionCount,
    onExportArticlesCsv,
    onOpenArticleProductionHub,
    onResetArticleFilters,
  } = props;

  return (
    <Card>
      <BrandProductionWorkshopArticlesCardToolbar
        collectionLabel={collectionLabel}
        articlesProgress={articlesProgress}
        totalCollectionArticles={totalCollectionArticles}
        articleSearch={articleSearch}
        onArticleSearchChange={onArticleSearchChange}
        articleFilterStage={articleFilterStage}
        onArticleFilterStageChange={onArticleFilterStageChange}
        articleFilterDrop={articleFilterDrop}
        onArticleFilterDropChange={onArticleFilterDropChange}
        articleSortBy={articleSortBy}
        onArticleSortByChange={onArticleSortByChange}
        articleFocusNeedsAttention={articleFocusNeedsAttention}
        onToggleArticleFocusNeedsAttention={onToggleArticleFocusNeedsAttention}
        needsAttentionCount={needsAttentionCount}
        onExportArticlesCsv={onExportArticlesCsv}
      />
      <CardContent className="overflow-x-auto">
        <BrandProductionWorkshopArticlesCardTable
          collectionQuery={collectionQuery}
          totalCollectionArticles={totalCollectionArticles}
          displayedArticles={displayedArticles}
          dropLabelById={dropLabelById}
          onOpenArticleProductionHub={onOpenArticleProductionHub}
          onResetArticleFilters={onResetArticleFilters}
        />
      </CardContent>
    </Card>
  );
}
