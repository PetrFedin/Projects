/**
 * Сборка плоского `Record` пропсов для `ProductionPageContent` (legacy production-main).
 * Дети ожидают плоский объект — здесь склейка, копия `SAMPLE_STAGES` и карта `page + derived + handlers → partA/partB`.
 */
import type { ClassValue } from 'clsx';
import type { ProductionRole } from '@/lib/production-permissions';
import type { ProductionPageMainApiDrop } from '@/app/brand/production/use-production-page-main-url-and-drops';
import type { ProductionPageMainPageState } from '@/app/brand/production/use-production-page-main-page-state';
import type { ProductionPageMainDerivedSnapshot } from '@/app/brand/production/use-production-page-main-derived';
import type { ProductionPageMainHandlersSnapshot } from '@/app/brand/production/use-production-page-main-handlers';

type ProductionPermissionsSnapshot =
  (typeof import('@/lib/production-permissions').PRODUCTION_PERMISSIONS)[ProductionRole];

export function buildProductionPageMainBodyProps(input: {
  sampleStages: readonly string[];
  partA: Record<string, unknown>;
  partB: Record<string, unknown>;
}): Record<string, unknown> {
  return {
    ...input.partA,
    ...input.partB,
    SAMPLE_STAGES: [...input.sampleStages],
  };
}

export type ProductionPageMainBodyPropParts = {
  partA: Record<string, unknown>;
  partB: Record<string, unknown>;
};

/** Склеивает стейт страницы, производные и обработчики в два слоя для `buildProductionPageMainBodyProps`. */
export function assembleProductionPageMainBodyPropParts(input: {
  page: ProductionPageMainPageState;
  derived: ProductionPageMainDerivedSnapshot;
  handlers: ProductionPageMainHandlersSnapshot;
  perms: ProductionPermissionsSnapshot;
  prodRole: ProductionRole;
  apiDrops: ProductionPageMainApiDrop[];
  currentData: unknown | null;
  contextData: Record<string, unknown>;
  cn: (...inputs: ClassValue[]) => string;
  stageLabels: Record<string, string>;
}): ProductionPageMainBodyPropParts {
  const { page, derived, handlers, perms, prodRole, apiDrops, currentData, contextData, cn } =
    input;

  const {
    selectedId,
    toggleCollectionSelection,
    productionKpis,
    filteredSkus,
    filteredMaterials,
    filteredLosses,
    filteredEvents,
    filteredChat,
    filteredSampleStatuses,
    displaySkus,
    displaySampleStatuses,
    filteredProductionOrders,
    filteredCollections,
    filteredAuditLog,
    filteredSlaSamples,
    slaOverdueCount,
    contextBarBudgetRemainder,
    samplePendingCount,
    lossesSummary,
  } = derived;

  const {
    handleSendMessage,
    handleToggleSfcConfirmation,
    handleAddMaterial,
    handleAction,
    handleCollectionCreated,
    handleSkuCreated,
    handleAddLoss,
    getContextTitle,
    resetToBrand,
  } = handlers;

  const partA: Record<string, unknown> = {
    activeTab: page.activeTab,
    setActiveTab: page.setActiveTab,
    perms,
    prodRole,
    getContextTitle,
    selectedContext: page.selectedContext,
    resetToBrand,
    selectedCollectionIds: page.selectedCollectionIds,
    isLabellingWizardOpen: page.isLabellingWizardOpen,
    setIsLabellingWizardOpen: page.setIsLabellingWizardOpen,
    isHandoverActOpen: page.isHandoverActOpen,
    setIsHandoverActOpen: page.setIsHandoverActOpen,
    isArchiveOpen: page.isArchiveOpen,
    setIsArchiveOpen: page.setIsArchiveOpen,
    isMarketplaceOpen: page.isMarketplaceOpen,
    setIsMarketplaceOpen: page.setIsMarketplaceOpen,
    duplicateFromCollection: page.duplicateFromCollection,
    setDuplicateFromCollection: page.setDuplicateFromCollection,
    setSelectedCollectionIds: page.setSelectedCollectionIds,
    collections: page.collections,
    filteredCollections,
    selectedId,
    productionKpis,
    setActiveKpiDetail: page.setActiveKpiDetail,
    displaySkus,
    displaySampleStatuses,
    filteredSkus,
    filteredSampleStatuses,
    filteredProductionOrders,
    filteredMaterials,
    filteredLosses,
    filteredEvents,
    filteredAuditLog,
    filteredChat,
    filteredSlaSamples,
    samplePendingCount,
    slaOverdueCount,
    contextBarBudgetRemainder,
    lossesSummary,
    collectionBudgets: page.collectionBudgets,
    productionDocuments: page.productionDocuments,
    notificationsList: page.notificationsList,
    chatMessages: page.chatMessages,
    plmView: page.plmView,
    setPlmView: page.setPlmView,
    executionView: page.executionView,
    setExecutionView: page.setExecutionView,
    financeView: page.financeView,
    setFinanceView: page.setFinanceView,
    complianceView: page.complianceView,
    setComplianceView: page.setComplianceView,
    logisticsView: page.logisticsView,
    setLogisticsView: page.setLogisticsView,
    handbookView: page.handbookView,
    setHandbookView: page.setHandbookView,
    procurementView: page.procurementView,
    setProcurementView: page.setProcurementView,
    skuSearchQuery: page.skuSearchQuery,
    setSkuSearchQuery: page.setSkuSearchQuery,
    sampleSearchQuery: page.sampleSearchQuery,
    setSampleSearchQuery: page.setSampleSearchQuery,
    sampleStageFilter: page.sampleStageFilter,
    setSampleStageFilter: page.setSampleStageFilter,
    docFilter: page.docFilter,
    setDocFilter: page.setDocFilter,
    lossTypeFilter: page.lossTypeFilter,
    setLossTypeFilter: page.setLossTypeFilter,
    lossCategoryFilter: page.lossCategoryFilter,
    setLossCategoryFilter: page.setLossCategoryFilter,
    collectionSortOrder: page.collectionSortOrder,
    setCollectionSortOrder: page.setCollectionSortOrder,
    collectionViewMode: page.collectionViewMode,
    setCollectionViewMode: page.setCollectionViewMode,
    docStatusFilter: page.docStatusFilter,
    setDocStatusFilter: page.setDocStatusFilter,
    archiveSearchQuery: page.archiveSearchQuery,
    setArchiveSearchQuery: page.setArchiveSearchQuery,
    auditFilter: page.auditFilter,
    setAuditFilter: page.setAuditFilter,
    slaFilterOverdue: page.slaFilterOverdue,
    setSlaFilterOverdue: page.setSlaFilterOverdue,
    ordersFilter: page.ordersFilter,
    setOrdersFilter: page.setOrdersFilter,
    sizeCategoryId: page.sizeCategoryId,
    setSizeCategoryId: page.setSizeCategoryId,
    selectedSkuId: page.selectedSkuId,
    setSelectedSkuId: page.setSelectedSkuId,
    selectedPoId: page.selectedPoId,
    setSelectedPoId: page.setSelectedPoId,
    activeChatCollection: page.activeChatCollection,
    setActiveChatCollection: page.setActiveChatCollection,
    rejectSample: page.rejectSample,
    setRejectSample: page.setRejectSample,
    rejectReason: page.rejectReason,
    setRejectReason: page.setRejectReason,
    rejectCommentCustom: page.rejectCommentCustom,
    setRejectCommentCustom: page.setRejectCommentCustom,
    apiDrops,
    newMessage: page.newMessage,
    setNewMessage: page.setNewMessage,
    sfcOperations: page.sfcOperations,
    setSfcOperations: page.setSfcOperations,
    setSampleStatuses: page.setSampleStatuses,
    requisitions: page.requisitions,
    setRequisitions: page.setRequisitions,
  };

  const partB: Record<string, unknown> = {
    isCreatingCollection: page.isCreatingCollection,
    setIsCreatingCollection: page.setIsCreatingCollection,
    isSkuWizardOpen: page.isSkuWizardOpen,
    setIsSkuWizardOpen: page.setIsSkuWizardOpen,
    isAutoPOOpen: page.isAutoPOOpen,
    setIsAutoPOOpen: page.setIsAutoPOOpen,
    isCostingOpen: page.isCostingOpen,
    setIsCostingOpen: page.setIsCostingOpen,
    isFittingLogOpen: page.isFittingLogOpen,
    setIsFittingLogOpen: page.setIsFittingLogOpen,
    toggleCollectionSelection,
    handleSendMessage,
    handleToggleSfcConfirmation,
    handleAddMaterial,
    handleAction,
    handleCollectionCreated,
    handleAddLoss,
    handleSkuCreated,
    STAGE_LABELS: input.stageLabels,
    currentData,
    contextData,
    cn,
    isGlobalSearchOpen: page.isGlobalSearchOpen,
    setIsGlobalSearchOpen: page.setIsGlobalSearchOpen,
    collectionFilter: page.collectionFilter,
    setCollectionFilter: page.setCollectionFilter,
    sampleComments: page.sampleComments,
    setSampleComments: page.setSampleComments,
  };

  return { partA, partB };
}
