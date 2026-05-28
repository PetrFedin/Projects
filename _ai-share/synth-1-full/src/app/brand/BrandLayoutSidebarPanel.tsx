'use client';

/**
 * Сайдбар brand layout — brandNavGroups + RBAC + primary/secondary split в отдельном chunk.
 */
import { useMemo } from 'react';
import { BrandSidebarLazy } from '@/components/brand/BrandSidebarLazy';
import {
  applyBrandInvestorSpineClusterOverrides,
  isBrandNavInvestorSpineEnabled,
} from '@/lib/cabinet-nav-env';
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
    let groupsToFilter = brandNavGroups;

    if (isBrandNavInvestorSpineEnabled()) {
      groupsToFilter = applyBrandInvestorSpineClusterOverrides(brandNavGroups);
    }
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

  return (
    <BrandSidebarLazy
      groups={filteredNavGroups}
      secondaryItems={secondaryNavItems}
      businessMode={BRAND_HUB_BUSINESS_MODE}
      onNavigate={onNavigate}
    />
  );
}
