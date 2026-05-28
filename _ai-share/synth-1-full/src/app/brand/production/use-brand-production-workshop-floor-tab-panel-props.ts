'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import type { BrandProductionWorkshopFloorTabPanelProps } from '@/app/brand/production/brand-production-workshop-floor-tab-panel';

type RouterLike = { push: (href: string) => void };

export function useBrandProductionWorkshopFloorTabPanelProps(args: {
  articleContextValid: boolean;
  stagesSkuContextLine: string | undefined;
  setTab: (nextRaw: string) => void;
  router: RouterLike;
  collectionIdFromQuery: string;
  workshopCollections: BrandProductionWorkshopFloorTabPanelProps['workshopCollections'];
  floorHref: BrandProductionWorkshopFloorTabPanelProps['floorHref'];
  liveProcessOverviewCollectionId: string;
  collectionLabel: string;
  completedCount: number;
  collectionSelectOptions: BrandProductionWorkshopFloorTabPanelProps['collectionSelectOptions'];
  progressPct: number;
  dropsWithMeta: BrandProductionWorkshopFloorTabPanelProps['dropsWithMeta'];
  dropStats: BrandProductionWorkshopFloorTabPanelProps['dropStats'];
  onCollectionSelectChange: (value: string) => void;
  workshopStageChainProps: BrandProductionWorkshopFloorTabPanelProps['workshopStageChainProps'];
  collectionQuery: string;
  collectionArticlesCount: number;
  totalForecastQty: number;
  totalForecastRevenue: number;
  collectionChecklist: BrandProductionWorkshopFloorTabPanelProps['collectionChecklist'];
  needsAttentionCount: number;
  articlesProgressSummary: BrandProductionWorkshopFloorTabPanelProps['articlesProgressSummary'];
  setArticleFocusNeedsAttention: Dispatch<SetStateAction<boolean>>;
  displayedArticles: BrandProductionWorkshopFloorTabPanelProps['displayedArticles'];
  dropLabelById: BrandProductionWorkshopFloorTabPanelProps['dropLabelById'];
  articleSearch: string;
  setArticleSearch: Dispatch<SetStateAction<string>>;
  articleFilterStage: string;
  setArticleFilterStage: Dispatch<SetStateAction<string>>;
  articleFilterDrop: string;
  setArticleFilterDrop: Dispatch<SetStateAction<string>>;
  articleSortBy: BrandProductionWorkshopFloorTabPanelProps['articleSortBy'];
  setArticleSortBy: Dispatch<
    SetStateAction<BrandProductionWorkshopFloorTabPanelProps['articleSortBy']>
  >;
  articleFocusNeedsAttention: boolean;
  onExportArticlesCsv: () => void;
  onOpenArticleProductionHub: (articleId: string) => void;
  qcSummary: BrandProductionWorkshopFloorTabPanelProps['qcSummary'];
  milestonesSummary: BrandProductionWorkshopFloorTabPanelProps['milestonesSummary'];
  subcontractSummary: BrandProductionWorkshopFloorTabPanelProps['subcontractSummary'];
  hasRisks: boolean;
}): BrandProductionWorkshopFloorTabPanelProps {
  const onGoToStagesTab = useCallback(() => args.setTab('stages'), [args.setTab]);

  const onNewCollectionShortcut = useCallback(() => {
    args.router.push('/brand/production?collectionId=New');
  }, [args.router]);

  const onNeedsAttentionClick = useCallback(
    () => args.setArticleFocusNeedsAttention(true),
    [args.setArticleFocusNeedsAttention]
  );

  const onToggleArticleFocusNeedsAttention = useCallback(
    () => args.setArticleFocusNeedsAttention((v) => !v),
    [args.setArticleFocusNeedsAttention]
  );

  const onResetArticleFilters = useCallback(() => {
    args.setArticleSearch('');
    args.setArticleFilterStage('');
    args.setArticleFilterDrop('');
    args.setArticleFocusNeedsAttention(false);
  }, [
    args.setArticleSearch,
    args.setArticleFilterStage,
    args.setArticleFilterDrop,
    args.setArticleFocusNeedsAttention,
  ]);

  return useMemo(
    () => ({
      articleContextValid: args.articleContextValid,
      stagesSkuContextLine: args.stagesSkuContextLine,
      onGoToStagesTab,
      collectionIdFromQuery: args.collectionIdFromQuery,
      workshopCollections: args.workshopCollections,
      floorHref: args.floorHref,
      liveProcessOverviewCollectionId: args.liveProcessOverviewCollectionId,
      collectionLabel: args.collectionLabel,
      completedCount: args.completedCount,
      collectionSelectOptions: args.collectionSelectOptions,
      progressPct: args.progressPct,
      dropsWithMeta: args.dropsWithMeta,
      dropStats: args.dropStats,
      onCollectionSelectChange: args.onCollectionSelectChange,
      onNewCollectionShortcut,
      workshopStageChainProps: args.workshopStageChainProps,
      collectionQuery: args.collectionQuery,
      collectionArticlesCount: args.collectionArticlesCount,
      totalForecastQty: args.totalForecastQty,
      totalForecastRevenue: args.totalForecastRevenue,
      collectionChecklist: args.collectionChecklist,
      needsAttentionCount: args.needsAttentionCount,
      articlesProgressSummary: args.articlesProgressSummary,
      onNeedsAttentionClick,
      displayedArticles: args.displayedArticles,
      dropLabelById: args.dropLabelById,
      articleSearch: args.articleSearch,
      onArticleSearchChange: args.setArticleSearch,
      articleFilterStage: args.articleFilterStage,
      onArticleFilterStageChange: args.setArticleFilterStage,
      articleFilterDrop: args.articleFilterDrop,
      onArticleFilterDropChange: args.setArticleFilterDrop,
      articleSortBy: args.articleSortBy,
      onArticleSortByChange: args.setArticleSortBy,
      articleFocusNeedsAttention: args.articleFocusNeedsAttention,
      onToggleArticleFocusNeedsAttention,
      onExportArticlesCsv: args.onExportArticlesCsv,
      onOpenArticleProductionHub: args.onOpenArticleProductionHub,
      onResetArticleFilters,
      qcSummary: args.qcSummary,
      milestonesSummary: args.milestonesSummary,
      subcontractSummary: args.subcontractSummary,
      hasRisks: args.hasRisks,
    }),
    [
      args.articleContextValid,
      args.stagesSkuContextLine,
      onGoToStagesTab,
      args.collectionIdFromQuery,
      args.workshopCollections,
      args.floorHref,
      args.liveProcessOverviewCollectionId,
      args.collectionLabel,
      args.completedCount,
      args.collectionSelectOptions,
      args.progressPct,
      args.dropsWithMeta,
      args.dropStats,
      args.onCollectionSelectChange,
      onNewCollectionShortcut,
      args.workshopStageChainProps,
      args.collectionQuery,
      args.collectionArticlesCount,
      args.totalForecastQty,
      args.totalForecastRevenue,
      args.collectionChecklist,
      args.needsAttentionCount,
      args.articlesProgressSummary,
      onNeedsAttentionClick,
      args.displayedArticles,
      args.dropLabelById,
      args.articleSearch,
      args.setArticleSearch,
      args.articleFilterStage,
      args.setArticleFilterStage,
      args.articleFilterDrop,
      args.setArticleFilterDrop,
      args.articleSortBy,
      args.setArticleSortBy,
      args.articleFocusNeedsAttention,
      onToggleArticleFocusNeedsAttention,
      args.onExportArticlesCsv,
      args.onOpenArticleProductionHub,
      onResetArticleFilters,
      args.qcSummary,
      args.milestonesSummary,
      args.subcontractSummary,
      args.hasRisks,
    ]
  );
}
