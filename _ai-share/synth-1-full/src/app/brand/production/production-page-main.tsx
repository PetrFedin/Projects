'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { getProductionRole, PRODUCTION_PERMISSIONS } from '@/lib/production-permissions';
import { cn } from '@/lib/utils';
import { ProductionPageMainRoot } from '@/app/brand/production/production-page-main-root';
import { ProductionPageMainLazyContent } from '@/app/brand/production/production-page-main-lazy-content';
import {
  useProductionPageMainApiDrops,
  useProductionPageMainOrdersTabFromSearchParams,
} from '@/app/brand/production/use-production-page-main-url-and-drops';
import { useProductionPageMainDerived } from '@/app/brand/production/use-production-page-main-derived';
import { useProductionPageMainPageState } from '@/app/brand/production/use-production-page-main-page-state';
import { useProductionPageMainHandlers } from '@/app/brand/production/use-production-page-main-handlers';
import {
  SAMPLE_STAGES,
  STAGE_LABELS,
} from '@/app/brand/production/production-page-main-sample-stages';
import {
  assembleProductionPageMainBodyPropParts,
  buildProductionPageMainBodyProps,
} from '@/app/brand/production/production-page-main-body-props';
import { INITIAL_PRODUCTION_CONTEXT_DATA } from '@/app/brand/production/production-page-main-demo-context.resolve';

export default function ProductionControlPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const prodRole = getProductionRole(user?.roles);
  const perms = PRODUCTION_PERMISSIONS[prodRole];

  const page = useProductionPageMainPageState(prodRole);

  useProductionPageMainOrdersTabFromSearchParams(
    searchParams,
    page.setActiveTab,
    page.setOrdersFilter
  );

  const apiDrops = useProductionPageMainApiDrops();

  const derived = useProductionPageMainDerived({
    selectedCollectionIds: page.selectedCollectionIds,
    setSelectedCollectionIds: page.setSelectedCollectionIds,
    setSelectedContext: page.setSelectedContext,
    archivedCollectionIds: page.archivedCollectionIds,
    collections: page.collections,
    skus: page.skus,
    materialsList: page.materialsList,
    productionLosses: page.productionLosses,
    calendarEvents: page.calendarEvents,
    chatMessages: page.chatMessages,
    sampleStatuses: page.sampleStatuses,
    skuSearchQuery: page.skuSearchQuery,
    sampleSearchQuery: page.sampleSearchQuery,
    productionOrders: page.productionOrders,
    collectionFilter: page.collectionFilter,
    auditLog: page.auditLog,
    auditFilter: page.auditFilter,
    slaFilterOverdue: page.slaFilterOverdue,
    collectionBudgets: page.collectionBudgets,
  });

  const handlers = useProductionPageMainHandlers({
    toast: page.toast,
    selectedId: derived.selectedId,
    page,
  });

  const contextData = INITIAL_PRODUCTION_CONTEXT_DATA as unknown as Record<string, unknown>;
  const currentData = derived.selectedId ? (contextData[derived.selectedId] ?? null) : null;

  const { partA, partB } = assembleProductionPageMainBodyPropParts({
    page,
    derived,
    handlers,
    perms,
    prodRole,
    apiDrops,
    currentData,
    contextData,
    cn,
    stageLabels: STAGE_LABELS,
  });

  const bodyProps = buildProductionPageMainBodyProps({
    sampleStages: SAMPLE_STAGES,
    partA,
    partB,
  });

  return React.createElement(
    ProductionPageMainRoot,
    null,
    React.createElement(ProductionPageMainLazyContent, bodyProps)
  );
}
