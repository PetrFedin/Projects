'use client';

/**
 * Сайдбар factory/supplier layout — supplierNavGroups в отдельном chunk.
 */
import { useMemo } from 'react';
import { HubSidebarLazy } from '@/components/hub/HubSidebarLazy';
import {
  applyFactorySupplierInvestorSpineClusterOverrides,
  isFactoryNavInvestorSpineEnabled,
} from '@/lib/cabinet-nav-env';
import { supplierNavGroups } from '@/lib/data/factory-navigation';
import {
  FACTORY_SUP_ARCHIVE_GROUP_ORDER,
  FACTORY_SUP_CORE_GROUP_ORDER,
  FACTORY_SUP_INVESTOR_SPINE_CORE_GROUP_ORDER,
  SYNTHA_SIDEBAR_CLUSTERS,
} from '@/lib/data/syntha-nav-clusters';
import { ROUTES } from '@/lib/routes';

type FactorySupplierLayoutSidebarPanelProps = {
  onNavigate?: () => void;
};

export function FactorySupplierLayoutSidebarPanel({
  onNavigate,
}: FactorySupplierLayoutSidebarPanelProps) {
  const groups = useMemo(
    () => applyFactorySupplierInvestorSpineClusterOverrides(supplierNavGroups),
    []
  );
  const coreGroupOrder = isFactoryNavInvestorSpineEnabled()
    ? FACTORY_SUP_INVESTOR_SPINE_CORE_GROUP_ORDER
    : FACTORY_SUP_CORE_GROUP_ORDER;

  return (
    <HubSidebarLazy
      groups={groups}
      basePath={ROUTES.factory.supplier}
      ariaLabel="Меню поставщика"
      accentClass="text-emerald-600"
      activeBgClass="bg-emerald-600"
      onNavigate={onNavigate}
      sidebarClusters={SYNTHA_SIDEBAR_CLUSTERS}
      coreGroupOrder={coreGroupOrder}
      archiveGroupOrder={FACTORY_SUP_ARCHIVE_GROUP_ORDER}
    />
  );
}
