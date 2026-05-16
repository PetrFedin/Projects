'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  buildProductionLossesSummary,
  computeContextBarBudgetRemainder,
  computeProductionKpisDemo,
  countSamplesPendingReview,
  countSlaOverdueSamples,
  filterListedProductionCollections,
  filterProductionAuditLog,
  filterRowsByCaseInsensitiveSubstring,
  filterRowsByCollectionSelection,
  filterSlaSamplesByOverdue,
} from '@/app/brand/production/production-page-main-selection-utils';

/** Фильтры таблиц и KPI для legacy production hub — производное от выбора коллекций и поиска. */
export function useProductionPageMainDerived(args: {
  selectedCollectionIds: string[];
  setSelectedCollectionIds: Dispatch<SetStateAction<string[]>>;
  setSelectedContext: Dispatch<SetStateAction<'brand' | 'collection' | 'drop'>>;
  archivedCollectionIds: string[];
  collections: any[];
  skus: any[];
  materialsList: any[];
  productionLosses: any[];
  calendarEvents: any[];
  chatMessages: any[];
  sampleStatuses: any[];
  skuSearchQuery: string;
  sampleSearchQuery: string;
  productionOrders: any[];
  collectionFilter: { search?: string; status?: string; priority?: string };
  auditLog: any[];
  auditFilter: 'all' | 'bom' | 'sample' | 'po' | 'status';
  slaFilterOverdue: boolean;
  collectionBudgets: any[];
}) {
  const {
    selectedCollectionIds,
    setSelectedCollectionIds,
    setSelectedContext,
    archivedCollectionIds,
    collections,
    skus,
    materialsList,
    productionLosses,
    calendarEvents,
    chatMessages,
    sampleStatuses,
    skuSearchQuery,
    sampleSearchQuery,
    productionOrders,
    collectionFilter,
    auditLog,
    auditFilter,
    slaFilterOverdue,
    collectionBudgets,
  } = args;

  const selectedId = selectedCollectionIds.length === 1 ? selectedCollectionIds[0] : null;

  const toggleCollectionSelection = useCallback(
    (id: string) => {
      setSelectedCollectionIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
      setSelectedContext('collection');
    },
    [setSelectedCollectionIds, setSelectedContext]
  );

  const productionKpis = useMemo(() => {
    const activeIds =
      selectedCollectionIds.length > 0
        ? selectedCollectionIds
        : collections.filter((c) => !archivedCollectionIds.includes(c.id)).map((c) => c.id);
    return computeProductionKpisDemo(activeIds);
  }, [selectedCollectionIds, collections, archivedCollectionIds]);

  const filteredSkus = useMemo(
    () => filterRowsByCollectionSelection(skus, selectedCollectionIds, archivedCollectionIds),
    [skus, selectedCollectionIds, archivedCollectionIds]
  );

  const filteredMaterials = useMemo(
    () =>
      filterRowsByCollectionSelection(materialsList, selectedCollectionIds, archivedCollectionIds),
    [materialsList, selectedCollectionIds, archivedCollectionIds]
  );

  const filteredLosses = useMemo(
    () =>
      filterRowsByCollectionSelection(
        productionLosses,
        selectedCollectionIds,
        archivedCollectionIds
      ),
    [productionLosses, selectedCollectionIds, archivedCollectionIds]
  );

  const filteredEvents = useMemo(
    () =>
      filterRowsByCollectionSelection(calendarEvents, selectedCollectionIds, archivedCollectionIds),
    [calendarEvents, selectedCollectionIds, archivedCollectionIds]
  );

  const filteredChat = useMemo(
    () =>
      filterRowsByCollectionSelection(chatMessages, selectedCollectionIds, archivedCollectionIds),
    [chatMessages, selectedCollectionIds, archivedCollectionIds]
  );

  const filteredSampleStatuses = useMemo(
    () =>
      filterRowsByCollectionSelection(sampleStatuses, selectedCollectionIds, archivedCollectionIds),
    [sampleStatuses, selectedCollectionIds, archivedCollectionIds]
  );

  const displaySkus = useMemo(
    () =>
      filterRowsByCaseInsensitiveSubstring(filteredSkus, skuSearchQuery, (s) => [s.name, s.id]),
    [filteredSkus, skuSearchQuery]
  );

  const displaySampleStatuses = useMemo(
    () =>
      filterRowsByCaseInsensitiveSubstring(filteredSampleStatuses, sampleSearchQuery, (s) => [
        s.skuName,
        s.skuId,
      ]),
    [filteredSampleStatuses, sampleSearchQuery]
  );

  const filteredProductionOrders = useMemo(
    () =>
      filterRowsByCollectionSelection(
        productionOrders,
        selectedCollectionIds,
        archivedCollectionIds
      ),
    [productionOrders, selectedCollectionIds, archivedCollectionIds]
  );

  const filteredCollections = useMemo(
    () =>
      filterListedProductionCollections(collections, archivedCollectionIds, collectionFilter),
    [
      collections,
      archivedCollectionIds,
      collectionFilter.search,
      collectionFilter.status,
      collectionFilter.priority,
    ]
  );

  const filteredAuditLog = useMemo(
    () => filterProductionAuditLog(auditLog, selectedCollectionIds, auditFilter),
    [auditLog, selectedCollectionIds, auditFilter]
  );

  const filteredSlaSamples = useMemo(
    () => filterSlaSamplesByOverdue(filteredSampleStatuses, slaFilterOverdue),
    [filteredSampleStatuses, slaFilterOverdue]
  );

  const slaOverdueCount = useMemo(
    () => countSlaOverdueSamples(filteredSampleStatuses),
    [filteredSampleStatuses]
  );

  const contextBarBudgetRemainder = useMemo(
    () => computeContextBarBudgetRemainder(collectionBudgets, selectedCollectionIds),
    [collectionBudgets, selectedCollectionIds]
  );

  const samplePendingCount = useMemo(
    () => countSamplesPendingReview(filteredSampleStatuses),
    [filteredSampleStatuses]
  );

  const lossesSummary = useMemo(
    () => buildProductionLossesSummary(filteredLosses),
    [filteredLosses]
  );

  return {
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
  };
}

export type ProductionPageMainDerivedSnapshot = ReturnType<
  typeof useProductionPageMainDerived
>;
