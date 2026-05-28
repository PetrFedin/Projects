'use client';

import { processLiveUrl } from '@/lib/routes';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import type { BrandProductionMockCollectionRow } from '@/app/brand/production/production-page-demo-data';
import type { DeliveryWindowWithMeta } from '@/app/brand/production/production-page-delivery-windows-meta';
import type {
  FloorMilestonesSummary,
  FloorQcSummary,
  FloorSubcontractSummary,
} from '@/app/brand/production/production-page-floor-mock-summaries';
import type { CollectionChecklistItem } from '@/app/brand/production/production-page-collection-articles-helpers';
import type { BrandProductionWorkshopStageChainProps } from '@/app/brand/production/use-brand-production-workshop-stage-chain-props';
import { BrandProductionWorkshopTabIntro } from '@/app/brand/production/brand-production-workshop-tab-intro';
import { BrandProductionWorkshopToolsCard } from '@/app/brand/production/brand-production-workshop-tools-card';
import { BrandProductionWorkshopStageSchemeCard } from '@/app/brand/production/brand-production-workshop-stage-scheme-card';
import { BrandProductionWorkshopQuickActionsBar } from '@/app/brand/production/brand-production-workshop-quick-actions-bar';
import {
  BrandProductionCollectionChecklistCard,
  BrandProductionWorkshopAttentionSummary,
} from '@/app/brand/production/brand-production-workshop-collection-focus-blocks';
import {
  BrandProductionWorkshopArticlesCard,
  type WorkshopArticlesProgressSummary,
} from '@/app/brand/production/brand-production-workshop-articles-card';
import { BrandProductionWorkshopProductionRisksCard } from '@/app/brand/production/brand-production-workshop-production-risks-card';
import { BrandProductionWorkshopOutro } from '@/app/brand/production/brand-production-workshop-outro';

export type BrandProductionWorkshopFloorTabPanelProps = {
  articleContextValid: boolean;
  stagesSkuContextLine: string | undefined;
  onGoToStagesTab: () => void;
  collectionIdFromQuery: string;
  workshopCollections: readonly BrandProductionMockCollectionRow[];
  floorHref: (floorTab: ProductionFloorTabId) => string;
  liveProcessOverviewCollectionId: string;
  collectionLabel: string;
  completedCount: number;
  collectionSelectOptions: readonly string[];
  progressPct: number;
  dropsWithMeta: readonly DeliveryWindowWithMeta[];
  dropStats: Record<string, { styles: number; qty: number }>;
  onCollectionSelectChange: (value: string) => void;
  onNewCollectionShortcut: () => void;
  workshopStageChainProps: BrandProductionWorkshopStageChainProps;
  collectionQuery: string;
  collectionArticlesCount: number;
  totalForecastQty: number;
  totalForecastRevenue: number;
  collectionChecklist: readonly CollectionChecklistItem[];
  needsAttentionCount: number;
  articlesProgressSummary: WorkshopArticlesProgressSummary;
  onNeedsAttentionClick: () => void;
  displayedArticles: readonly CollectionArticle[];
  dropLabelById: Record<string, string>;
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
  onExportArticlesCsv: () => void;
  onOpenArticleProductionHub: (articleId: string) => void;
  onResetArticleFilters: () => void;
  qcSummary: FloorQcSummary;
  milestonesSummary: FloorMilestonesSummary;
  subcontractSummary: FloorSubcontractSummary;
  hasRisks: boolean;
};

export function BrandProductionWorkshopFloorTabPanel(
  props: BrandProductionWorkshopFloorTabPanelProps
) {
  const {
    articleContextValid,
    stagesSkuContextLine,
    onGoToStagesTab,
    collectionIdFromQuery,
    workshopCollections,
    floorHref,
    liveProcessOverviewCollectionId,
    collectionLabel,
    completedCount,
    collectionSelectOptions,
    progressPct,
    dropsWithMeta,
    dropStats,
    onCollectionSelectChange,
    onNewCollectionShortcut,
    workshopStageChainProps,
    collectionQuery,
    collectionArticlesCount,
    totalForecastQty,
    totalForecastRevenue,
    collectionChecklist,
    needsAttentionCount,
    articlesProgressSummary,
    onNeedsAttentionClick,
    displayedArticles,
    dropLabelById,
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
    onExportArticlesCsv,
    onOpenArticleProductionHub,
    onResetArticleFilters,
    qcSummary,
    milestonesSummary,
    subcontractSummary,
    hasRisks,
  } = props;

  return (
    <>
      <BrandProductionWorkshopTabIntro
        articleContextValid={articleContextValid}
        stagesSkuContextLine={stagesSkuContextLine}
        onGoToStagesTab={onGoToStagesTab}
        collectionIdFromQuery={collectionIdFromQuery}
        workshopCollections={workshopCollections}
      />

      <BrandProductionWorkshopToolsCard floorHref={floorHref} />

      <BrandProductionWorkshopStageSchemeCard
        floorHref={floorHref}
        liveProcessOverviewHref={processLiveUrl('production', liveProcessOverviewCollectionId)}
        collectionLabel={collectionLabel}
        completedCount={completedCount}
        collectionIdFromQuery={collectionIdFromQuery}
        collectionSelectOptions={collectionSelectOptions}
        progressPct={progressPct}
        dropsWithMeta={dropsWithMeta}
        dropStats={dropStats}
        onCollectionSelectChange={onCollectionSelectChange}
        onNewCollectionShortcut={onNewCollectionShortcut}
        stageChain={workshopStageChainProps}
      />

      <BrandProductionWorkshopQuickActionsBar
        collectionLabel={collectionLabel}
        collectionIdFromQuery={collectionIdFromQuery}
        collectionQuery={collectionQuery}
        articleCount={collectionArticlesCount}
        totalForecastQty={totalForecastQty}
        totalForecastRevenue={totalForecastRevenue}
      />

      {collectionArticlesCount > 0 ? (
        <BrandProductionCollectionChecklistCard items={collectionChecklist} />
      ) : null}

      {collectionArticlesCount > 0 && needsAttentionCount > 0 ? (
        <BrandProductionWorkshopAttentionSummary
          needsAttentionCount={needsAttentionCount}
          withoutTechPackCount={
            articlesProgressSummary.total - articlesProgressSummary.withTechPack
          }
          withoutPoCount={articlesProgressSummary.total - articlesProgressSummary.withPo}
          onNeedsAttentionClick={onNeedsAttentionClick}
        />
      ) : null}

      <BrandProductionWorkshopArticlesCard
        collectionLabel={collectionLabel}
        collectionQuery={collectionQuery}
        totalCollectionArticles={collectionArticlesCount}
        displayedArticles={displayedArticles}
        dropLabelById={dropLabelById}
        articlesProgress={articlesProgressSummary}
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
        onOpenArticleProductionHub={onOpenArticleProductionHub}
        onResetArticleFilters={onResetArticleFilters}
      />
      <BrandProductionWorkshopProductionRisksCard
        qcSummary={qcSummary}
        milestonesSummary={milestonesSummary}
        subcontractSummary={subcontractSummary}
        hasRisks={hasRisks}
      />
      <BrandProductionWorkshopOutro opsFloorHref={floorHref('ops')} />
    </>
  );
}
