'use client';

/**
 * Сайдбар brand layout — brandNavGroups + RBAC + primary/secondary split в отдельном chunk.
 */
import { useMemo } from 'react';
import { BrandSidebarLazy } from '@/components/brand/BrandSidebarLazy';
import { applyBrandNavPipeline, filterNavGroupsForCoreSidebar } from '@/lib/cabinet-core-mode';
import { augmentBrandNavGroupsForCore } from '@/lib/brand-core-nav-augment';
import { augmentBrandNavForCoreCabinet } from '@/lib/platform-core-nav-augment';
import { filterWorkshop2BrandNavGroupsForMarket } from '@/lib/production/workshop2-brand-nav-market-filter';
import {
  brandNavGroups,
  getPrimaryNavGroups,
  getSecondaryNavItems,
} from '@/lib/data/brand-navigation';
import { canSeeNavGroup } from '@/lib/data/profile-page-features';
import type { useRbac } from '@/hooks/useRbac';

const BRAND_HUB_BUSINESS_MODE = 'b2b' as const;

type BrandLayoutSidebarPanelProps = {
  role: ReturnType<typeof useRbac>['role'];
  can: ReturnType<typeof useRbac>['can'];
  onNavigate?: () => void;
};

export function BrandLayoutSidebarPanel({ role, can, onNavigate }: BrandLayoutSidebarPanelProps) {
  const { filteredNavGroups, secondaryNavItems } = useMemo(() => {
    let groupsToFilter = applyBrandNavPipeline(brandNavGroups);
    groupsToFilter = augmentBrandNavGroupsForCore(groupsToFilter);
    groupsToFilter = augmentBrandNavForCoreCabinet(groupsToFilter);
    groupsToFilter = filterWorkshop2BrandNavGroupsForMarket(groupsToFilter);

    const filteredFull = groupsToFilter
      .filter(
        (group) =>
          (group as { scope?: string }).scope === 'shared' ||
          (group as { scope?: string }).scope === BRAND_HUB_BUSINESS_MODE
      )
      .filter((group) => canSeeNavGroup(role, group.id, can));

    return {
      filteredNavGroups: getPrimaryNavGroups(filteredFull, () => true),
      secondaryNavItems: getSecondaryNavItems(filteredFull, () => true),
    };
  }, [role, can]);

  const sidebarGroups = useMemo(
    () => filterNavGroupsForCoreSidebar(filteredNavGroups),
    [filteredNavGroups]
  );

  return (
    <BrandSidebarLazy
      groups={sidebarGroups}
      secondaryItems={secondaryNavItems}
      businessMode={BRAND_HUB_BUSINESS_MODE}
      onNavigate={onNavigate}
    />
  );
}
