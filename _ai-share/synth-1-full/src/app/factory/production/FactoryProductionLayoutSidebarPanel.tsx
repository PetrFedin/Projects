'use client';

/**
 * Сайдбар factory/production layout — manufacturerNavGroups в отдельном chunk.
 */
import { useMemo } from 'react';
import { HubSidebarLazy } from '@/components/hub/HubSidebarLazy';
import {
  applyFactoryManufacturerInvestorSpineClusterOverrides,
  isFactoryNavInvestorSpineEnabled,
} from '@/lib/cabinet-nav-env';
import { manufacturerNavGroups } from '@/lib/data/factory-navigation';
import {
  FACTORY_MFR_ARCHIVE_GROUP_ORDER,
  FACTORY_MFR_CORE_GROUP_ORDER,
  FACTORY_MFR_INVESTOR_SPINE_CORE_GROUP_ORDER,
  SYNTHA_SIDEBAR_CLUSTERS,
} from '@/lib/data/syntha-nav-clusters';
import { ROUTES } from '@/lib/routes';

type FactoryProductionLayoutSidebarPanelProps = {
  onNavigate?: () => void;
};

export function FactoryProductionLayoutSidebarPanel({
  onNavigate,
}: FactoryProductionLayoutSidebarPanelProps) {
  const groups = useMemo(
    () => applyFactoryManufacturerInvestorSpineClusterOverrides(manufacturerNavGroups),
    []
  );
  const coreGroupOrder = isFactoryNavInvestorSpineEnabled()
    ? FACTORY_MFR_INVESTOR_SPINE_CORE_GROUP_ORDER
    : FACTORY_MFR_CORE_GROUP_ORDER;

  return (
    <HubSidebarLazy
      groups={groups}
      basePath={ROUTES.factory.production}
      ariaLabel="Меню производства"
      accentClass="text-emerald-600"
      activeBgClass="bg-emerald-600"
      onNavigate={onNavigate}
      sidebarClusters={SYNTHA_SIDEBAR_CLUSTERS}
      coreGroupOrder={coreGroupOrder}
      archiveGroupOrder={FACTORY_MFR_ARCHIVE_GROUP_ORDER}
    />
  );
}
