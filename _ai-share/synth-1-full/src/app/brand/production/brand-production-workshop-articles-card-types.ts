import type { CollectionArticle } from '@/app/brand/production/production-page-types';

export type WorkshopArticlesProgressSummary = {
  total: number;
  withTechPack: number;
  withSamples: number;
  withPo: number;
  ready: number;
};

export type BrandProductionWorkshopArticlesCardProps = {
  collectionLabel: string;
  collectionQuery: string;
  totalCollectionArticles: number;
  displayedArticles: readonly CollectionArticle[];
  dropLabelById: Record<string, string>;
  articlesProgress: WorkshopArticlesProgressSummary;
  articleSearch: string;
  onArticleSearchChange: (value: string) => void;
  articleFilterStage: string;
  onArticleFilterStageChange: (value: string) => void;
  articleFilterDrop: string;
  onArticleFilterDropChange: (value: string) => void;
  articleSortBy: 'stage' | 'drop' | 'revenue';
  onArticleSortByChange: (value: 'stage' | 'drop' | 'revenue') => void;
  articleFocusNeedsAttention: boolean;
  onToggleArticleFocusNeedsAttention: () => void;
  needsAttentionCount: number;
  onExportArticlesCsv: () => void;
  onOpenArticleProductionHub: (articleId: string) => void;
  onResetArticleFilters: () => void;
};
