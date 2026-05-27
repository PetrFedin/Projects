'use client';

import { useState } from 'react';
import type { ProductionRole } from '@/lib/production-permissions';
import { PRODUCTION_PARAMS_BY_CATEGORY } from '@/lib/data/production-params';
import { useToast } from '@/hooks/use-toast';
import {
  INITIAL_AUDIT_LOG,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_COLLECTIONS,
  INITIAL_COLLECTION_BUDGETS,
  INITIAL_MATERIALS_LIST,
  INITIAL_NOTIFICATIONS_LIST,
  INITIAL_PRODUCTION_DOCUMENTS,
  INITIAL_PRODUCTION_LOSSES,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_REQUISITIONS,
  INITIAL_SAMPLE_STATUSES,
  INITIAL_SFC_OPERATIONS,
  INITIAL_SKUS,
} from '@/app/brand/production/production-page-main-demo-seed.resolve';

/** Локальный стейт legacy production hub (демо-сущности, фильтры, модалки). */
export function useProductionPageMainPageState(prodRole: ProductionRole) {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(() =>
    prodRole === 'manufacturer' ? 'samples' : 'collections'
  );
  const [selectedContext, setSelectedContext] = useState<'brand' | 'collection' | 'drop'>('brand');
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const archivedCollectionIds: string[] = ['ARCHIVE'];

  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isSkuWizardOpen, setIsSkuWizardOpen] = useState(false);
  const [duplicateFromCollection, setDuplicateFromCollection] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isLabellingWizardOpen, setIsLabellingWizardOpen] = useState(false);
  const [isHandoverActOpen, setIsHandoverActOpen] = useState(false);
  const [isCostingOpen, setIsCostingOpen] = useState(false);
  const [isFittingLogOpen, setIsFittingLogOpen] = useState(false);
  const [isAutoPOOpen, setIsAutoPOOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState<{
    search?: string;
    status?: string;
    priority?: string;
  }>({});
  const [sampleComments, setSampleComments] = useState<
    Record<string, Array<{ id: string; author: string; text: string; time: string }>>
  >({});

  const [skus, setSkus] = useState<any[]>(() => [...INITIAL_SKUS]);
  const [collections, setCollections] = useState(() => [...INITIAL_COLLECTIONS]);
  const [collectionBudgets, setCollectionBudgets] = useState<any[]>(() => [
    ...INITIAL_COLLECTION_BUDGETS,
  ]);
  const [materialsList, setMaterialsList] = useState<any[]>(() => [...INITIAL_MATERIALS_LIST]);
  const [sfcOperations, setSfcOperations] = useState<any[]>(() => [...INITIAL_SFC_OPERATIONS]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>(() => [...INITIAL_CALENDAR_EVENTS]);
  const [productionLosses, setProductionLosses] = useState<any[]>(() => [
    ...INITIAL_PRODUCTION_LOSSES,
  ]);
  const [productionOrders] = useState<any[]>(() => [...INITIAL_PRODUCTION_ORDERS]);
  const [sampleStatuses, setSampleStatuses] = useState<any[]>(() => [...INITIAL_SAMPLE_STATUSES]);
  const [auditLog] = useState<any[]>(() => [...INITIAL_AUDIT_LOG]);
  const [requisitions, setRequisitions] = useState<any[]>(() => [...INITIAL_REQUISITIONS]);
  const [productionDocuments] = useState<any[]>(() => [...INITIAL_PRODUCTION_DOCUMENTS]);
  const [activeChatCollection, setActiveChatCollection] = useState<string | null>(null);
  const [notificationsList] = useState(() => [...INITIAL_NOTIFICATIONS_LIST]);
  const [chatMessages, setChatMessages] = useState<any[]>(() => [...INITIAL_CHAT_MESSAGES]);
  const [newMessage, setNewMessage] = useState('');

  const [plmView, setPlmView] = useState<'matrix' | 'pim' | 'variants' | 'techpack'>('matrix');
  const [executionView, setExecutionView] = useState<'monitor' | 'twin'>('monitor');
  const [financeView, setFinanceView] = useState<'schedule' | 'terms' | 'factoring'>('schedule');
  const [handbookView, setHandbookView] = useState<
    'categories' | 'suppliers' | 'collabs' | 'sizes'
  >('categories');
  const [sizeCategoryId, setSizeCategoryId] = useState<string>(
    PRODUCTION_PARAMS_BY_CATEGORY[0]?.catL1Id ?? 'men-apparel'
  );
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);
  const [complianceView, setComplianceView] = useState<
    'marking' | 'qc' | 'passport' | 'certs' | 'eco' | 'defects'
  >('marking');
  const [logisticsView, setLogisticsView] = useState<
    'cargo' | 'inbound' | 'docs' | 'customs' | 'wms'
  >('cargo');
  const [procurementView, setProcurementView] = useState<
    'rolls' | 'haberdashery' | 'requisition' | 'quotes' | 'po' | 'receipt' | 'subcontract'
  >('rolls');
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [ordersFilter, setOrdersFilter] = useState<string>('all');

  const [docFilter, setDocFilter] = useState<string>('all');
  const [auditFilter, setAuditFilter] = useState<'all' | 'bom' | 'sample' | 'po' | 'status'>('all');
  const [slaFilterOverdue, setSlaFilterOverdue] = useState(false);
  const [rejectSample, setRejectSample] = useState<{ skuId: string; skuName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectCommentCustom, setRejectCommentCustom] = useState('');
  const [skuSearchQuery, setSkuSearchQuery] = useState('');
  const [sampleSearchQuery, setSampleSearchQuery] = useState('');
  const [sampleStageFilter, setSampleStageFilter] = useState<string>('all');
  const [lossTypeFilter, setLossTypeFilter] = useState<string>('all');
  const [lossCategoryFilter, setLossCategoryFilter] = useState<string>('all');
  const [collectionSortOrder, setCollectionSortOrder] = useState<'name' | 'status' | 'readiness'>(
    'name'
  );
  const [collectionViewMode, setCollectionViewMode] = useState<'grid' | 'list'>('grid');
  const [docStatusFilter, setDocStatusFilter] = useState<string>('all');
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');

  /** KPI-карточки вызывают setter; значение ниже по дереву не читается (деталь модалки не подключена). */
  const [, setActiveKpiDetail] = useState<
    'production' | 'cargo' | 'qc' | 'finance' | 'risk' | 'efficiency' | null
  >(null);

  return {
    toast,
    activeTab,
    setActiveTab,
    selectedContext,
    setSelectedContext,
    selectedCollectionIds,
    setSelectedCollectionIds,
    archivedCollectionIds,
    isCreatingCollection,
    setIsCreatingCollection,
    isSkuWizardOpen,
    setIsSkuWizardOpen,
    duplicateFromCollection,
    setDuplicateFromCollection,
    isArchiveOpen,
    setIsArchiveOpen,
    isLabellingWizardOpen,
    setIsLabellingWizardOpen,
    isHandoverActOpen,
    setIsHandoverActOpen,
    isCostingOpen,
    setIsCostingOpen,
    isFittingLogOpen,
    setIsFittingLogOpen,
    isAutoPOOpen,
    setIsAutoPOOpen,
    isMarketplaceOpen,
    setIsMarketplaceOpen,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    collectionFilter,
    setCollectionFilter,
    sampleComments,
    setSampleComments,
    skus,
    setSkus,
    collections,
    setCollections,
    collectionBudgets,
    setCollectionBudgets,
    materialsList,
    setMaterialsList,
    sfcOperations,
    setSfcOperations,
    calendarEvents,
    setCalendarEvents,
    productionLosses,
    setProductionLosses,
    productionOrders,
    sampleStatuses,
    setSampleStatuses,
    auditLog,
    requisitions,
    setRequisitions,
    productionDocuments,
    activeChatCollection,
    setActiveChatCollection,
    notificationsList,
    chatMessages,
    setChatMessages,
    newMessage,
    setNewMessage,
    plmView,
    setPlmView,
    executionView,
    setExecutionView,
    financeView,
    setFinanceView,
    handbookView,
    setHandbookView,
    sizeCategoryId,
    setSizeCategoryId,
    selectedSkuId,
    setSelectedSkuId,
    complianceView,
    setComplianceView,
    logisticsView,
    setLogisticsView,
    procurementView,
    setProcurementView,
    selectedPoId,
    setSelectedPoId,
    ordersFilter,
    setOrdersFilter,
    docFilter,
    setDocFilter,
    auditFilter,
    setAuditFilter,
    slaFilterOverdue,
    setSlaFilterOverdue,
    rejectSample,
    setRejectSample,
    rejectReason,
    setRejectReason,
    rejectCommentCustom,
    setRejectCommentCustom,
    skuSearchQuery,
    setSkuSearchQuery,
    sampleSearchQuery,
    setSampleSearchQuery,
    sampleStageFilter,
    setSampleStageFilter,
    lossTypeFilter,
    setLossTypeFilter,
    lossCategoryFilter,
    setLossCategoryFilter,
    collectionSortOrder,
    setCollectionSortOrder,
    collectionViewMode,
    setCollectionViewMode,
    docStatusFilter,
    setDocStatusFilter,
    archiveSearchQuery,
    setArchiveSearchQuery,
    setActiveKpiDetail,
  };
}

export type ProductionPageMainPageState = ReturnType<typeof useProductionPageMainPageState>;
