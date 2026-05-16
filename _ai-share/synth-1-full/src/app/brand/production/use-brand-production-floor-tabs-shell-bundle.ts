'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { stagesTabHasActiveFilters } from '@/lib/production/stages-url';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import type { BrandProductionFloorTabsShellProps } from '@/app/brand/production/brand-production-floor-tabs-shell';
import type { BrandProductionWorkshopFloorTabPanelProps } from '@/app/brand/production/brand-production-workshop-floor-tab-panel';
import type { BrandProductionWorkshopStageChainProps } from '@/app/brand/production/use-brand-production-workshop-stage-chain-props';
import type { BrandProductionWorkshopFloorMocks } from '@/app/brand/production/use-brand-production-workshop-floor-mocks';
import { useBrandProductionFloorNavigation } from '@/app/brand/production/use-brand-production-floor-navigation';
import { useBrandProductionStagesTabContentProps } from '@/app/brand/production/use-brand-production-stages-tab-content-props';
import { useBrandProductionWorkshopFloorTabPanelProps } from '@/app/brand/production/use-brand-production-workshop-floor-tab-panel-props';
import { useBrandProductionFloorTabsShellProps } from '@/app/brand/production/use-brand-production-floor-tabs-shell-props';
import { useBrandProductionExportUnifiedFlowJson } from '@/app/brand/production/use-brand-production-export-unified-flow-json';
import type { ImportLocalInventoryResult } from '@/app/brand/production/use-brand-production-local-inventory';

type FloorTabsShellRouter = {
  replace: (href: string, options?: { scroll?: boolean }) => void;
  push: (href: string) => void;
};

export type BrandProductionFloorTabsShellBundleArgs = {
  searchParams: ReadonlyURLSearchParams;
  router: FloorTabsShellRouter;
  pathname: string;
  collectionIdFromQuery: string;
  effectiveCollectionId: string;
  collectionFlowKey: string;
  tab: ProductionFloorTabId;
  setTabState: Dispatch<SetStateAction<ProductionFloorTabId>>;
  suppliesSub: 'vmi' | 'reservation';
  setSuppliesSub: Dispatch<SetStateAction<'vmi' | 'reservation'>>;
  sampleSub: 'gold' | 'fit';
  setSampleSub: Dispatch<SetStateAction<'gold' | 'fit'>>;
  launchSub: 'daily' | 'skills' | 'video' | 'sub';
  setLaunchSub: Dispatch<SetStateAction<'daily' | 'skills' | 'video' | 'sub'>>;
  qualitySub: 'mobile' | 'desk';
  setQualitySub: Dispatch<SetStateAction<'mobile' | 'desk'>>;
  floorHref: (tab: ProductionFloorTabId) => string;
  handleLiveContextCollectionChange: (id: string) => void;
  handleCollectionChange: (value: string) => void;
  unifiedDoc: CollectionSkuFlowDoc;
  setUnifiedDoc: Dispatch<SetStateAction<CollectionSkuFlowDoc>>;
  flowDocReady: CollectionSkuFlowDoc;
  collectionArticles: CollectionArticle[];
  stagesSkuContextId: string;
  stagesSkuContextLine: string | undefined;
  stagesStepContextId: string;
  stagesStepContextTitle: string | undefined;
  stagesSkuCatalogContext:
    | { title?: string; phase?: string | undefined; positionLabel?: string }
    | null
    | undefined;
  articleContextValid: boolean;
  collectionQuery: string;
  workshopStageChainProps: BrandProductionWorkshopStageChainProps;
  localRemovableArticles: { id: string; sku: string }[];
  isUserDefinedCollection: boolean;
  pushLocalArticle: (skuCode: string, displayName?: string) => boolean;
  pushUserCollection: (rawId: string, displayName: string) => void;
  removeLocalArticle: (articleId: string) => void;
  removeCurrentUserCollection: () => void;
  exportLocalInventory: () => void;
  importLocalInventory: (jsonText: string, replaceAll: boolean) => ImportLocalInventoryResult;
  isLocalSkuDuplicate: (skuCode: string) => boolean;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  getProductionFloorTabTitle: (tab: ProductionFloorTabId) => string;
  collectionLabel: string;
  completedCount: number;
  collectionSelectOptions: BrandProductionWorkshopFloorTabPanelProps['collectionSelectOptions'];
  workshopCollections: BrandProductionWorkshopFloorTabPanelProps['workshopCollections'];
  progressPct: number;
  totalForecastQty: number;
  totalForecastRevenue: number;
  mockFloor: Pick<
    BrandProductionWorkshopFloorMocks,
    | 'dropsWithMeta'
    | 'dropStats'
    | 'dropLabelById'
    | 'qcSummary'
    | 'milestonesSummary'
    | 'subcontractSummary'
    | 'hasRisks'
  >;
  collectionChecklist: BrandProductionWorkshopFloorTabPanelProps['collectionChecklist'];
  needsAttentionCount: number;
  articlesProgressSummary: BrandProductionWorkshopFloorTabPanelProps['articlesProgressSummary'];
  setArticleFocusNeedsAttention: Dispatch<SetStateAction<boolean>>;
  displayedArticles: BrandProductionWorkshopFloorTabPanelProps['displayedArticles'];
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
  exportArticlesCsv: () => void;
};

export type BrandProductionFloorTabsShellBundleResult = {
  shell: BrandProductionFloorTabsShellProps;
  setTab: (nextRaw: string) => void;
};

/** Вкладки пола коллекции: навигация + пропсы stages/workshop + оболочка табов. */
export function useBrandProductionFloorTabsShellBundle(
  args: BrandProductionFloorTabsShellBundleArgs
): BrandProductionFloorTabsShellBundleResult {
  const stagesFilterOn = stagesTabHasActiveFilters(args.searchParams);

  const { setTab, openArticleProductionHub, productionFullPageUrl } = useBrandProductionFloorNavigation({
    articleContextValid: args.articleContextValid,
    pathname: args.pathname,
    router: args.router,
    searchParams: args.searchParams,
    setTabState: args.setTabState,
  });

  const exportUnifiedFlowJson = useBrandProductionExportUnifiedFlowJson({
    unifiedDoc: args.unifiedDoc,
    collectionFlowKey: args.collectionFlowKey,
  });

  const stagesTabContentProps = useBrandProductionStagesTabContentProps({
    collectionArticles: args.collectionArticles,
    flowDocReady: args.flowDocReady,
    steps: COLLECTION_STEPS,
    collectionQuery: args.collectionQuery,
    floorHref: args.floorHref,
    mergeCollectionQuery: args.mergeCollectionQuery,
    setUnifiedDoc: args.setUnifiedDoc,
    getProductionFloorTabTitle: args.getProductionFloorTabTitle,
    collectionFlowKey: args.collectionFlowKey,
    collectionIdFromQuery: args.collectionIdFromQuery,
    localRemovableArticles: args.localRemovableArticles,
    isUserDefinedCollection: args.isUserDefinedCollection,
    pushLocalArticle: args.pushLocalArticle,
    pushUserCollection: args.pushUserCollection,
    removeLocalArticle: args.removeLocalArticle,
    removeCurrentUserCollection: args.removeCurrentUserCollection,
    exportLocalInventory: args.exportLocalInventory,
    importLocalInventory: args.importLocalInventory,
    isLocalSkuDuplicate: args.isLocalSkuDuplicate,
    exportUnifiedFlowJson,
  });

  const workshopTabPanelProps = useBrandProductionWorkshopFloorTabPanelProps({
    articleContextValid: args.articleContextValid,
    stagesSkuContextLine: args.stagesSkuContextLine,
    setTab,
    router: args.router,
    collectionIdFromQuery: args.collectionIdFromQuery,
    workshopCollections: args.workshopCollections,
    floorHref: args.floorHref,
    liveProcessOverviewCollectionId: args.effectiveCollectionId,
    collectionLabel: args.collectionLabel,
    completedCount: args.completedCount,
    collectionSelectOptions: args.collectionSelectOptions,
    progressPct: args.progressPct,
    dropsWithMeta: args.mockFloor.dropsWithMeta,
    dropStats: args.mockFloor.dropStats,
    onCollectionSelectChange: args.handleCollectionChange,
    workshopStageChainProps: args.workshopStageChainProps,
    collectionQuery: args.collectionQuery,
    collectionArticlesCount: args.collectionArticles.length,
    totalForecastQty: args.totalForecastQty,
    totalForecastRevenue: args.totalForecastRevenue,
    collectionChecklist: args.collectionChecklist,
    needsAttentionCount: args.needsAttentionCount,
    articlesProgressSummary: args.articlesProgressSummary,
    setArticleFocusNeedsAttention: args.setArticleFocusNeedsAttention,
    displayedArticles: args.displayedArticles,
    dropLabelById: args.mockFloor.dropLabelById,
    articleSearch: args.articleSearch,
    setArticleSearch: args.setArticleSearch,
    articleFilterStage: args.articleFilterStage,
    setArticleFilterStage: args.setArticleFilterStage,
    articleFilterDrop: args.articleFilterDrop,
    setArticleFilterDrop: args.setArticleFilterDrop,
    articleSortBy: args.articleSortBy,
    setArticleSortBy: args.setArticleSortBy,
    articleFocusNeedsAttention: args.articleFocusNeedsAttention,
    onExportArticlesCsv: args.exportArticlesCsv,
    onOpenArticleProductionHub: openArticleProductionHub,
    qcSummary: args.mockFloor.qcSummary,
    milestonesSummary: args.mockFloor.milestonesSummary,
    subcontractSummary: args.mockFloor.subcontractSummary,
    hasRisks: args.mockFloor.hasRisks,
  });

  const shell = useBrandProductionFloorTabsShellProps({
    articleContextValid: args.articleContextValid,
    stagesFilterOn,
    collectionLabel: args.collectionLabel,
    collectionIdFromQuery: args.collectionIdFromQuery,
    stagesSkuContextId: args.stagesSkuContextId,
    stagesSkuContextLine: args.stagesSkuContextLine,
    stagesStepContextId: args.stagesStepContextId,
    stagesStepContextTitle: args.stagesStepContextTitle,
    skuCatalogStageTitle: args.stagesSkuCatalogContext?.title,
    skuCatalogStagePhase: args.stagesSkuCatalogContext?.phase,
    skuCatalogPositionLabel: args.stagesSkuCatalogContext?.positionLabel,
    productionFullPageUrl,
    floorHref: args.floorHref,
    tab: args.tab,
    getProductionFloorTabTitle: args.getProductionFloorTabTitle,
    stagesTabContentProps,
    workshopTabPanelProps,
    onWorkshopCollectionChange: args.handleLiveContextCollectionChange,
    suppliesSub: args.suppliesSub,
    onSuppliesSubChange: args.setSuppliesSub,
    sampleSub: args.sampleSub,
    onSampleSubChange: args.setSampleSub,
    launchSub: args.launchSub,
    onLaunchSubChange: args.setLaunchSub,
    qualitySub: args.qualitySub,
    onQualitySubChange: args.setQualitySub,
  });

  return { shell, setTab };
}
