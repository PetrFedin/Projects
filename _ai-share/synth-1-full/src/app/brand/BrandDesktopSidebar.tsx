'use client';

import type { ReactNode } from 'react';
import { SidebarOrgHeaderGate } from '@/components/brand/SidebarOrgHeaderGate';
import { BrandLayoutSidebarPanel } from '@/app/brand/BrandLayoutSidebarPanel';
import { BrandSidebarWidgetGate } from '@/app/brand/BrandSidebarWidgetGate';
import type { useRbac } from '@/hooks/useRbac';

type BrandDesktopSidebarProps = {
  role: ReturnType<typeof useRbac>['role'];
  can: ReturnType<typeof useRbac>['can'];
};

/** Desktop brand aside — org header + nav + widget в одном chunk (только ≥ lg). */
export function BrandDesktopSidebar({ role, can }: BrandDesktopSidebarProps) {
  return (
    <>
      <SidebarOrgHeaderGate />
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <BrandLayoutSidebarPanel role={role} can={can} />
      </div>
      <BrandSidebarWidgetGate />
    </>
  );
}

export function BrandDesktopSidebarPlaceholder() {
  return (
    <div className="flex min-h-0 flex-1 flex-col" aria-hidden>
      <div className="border-border-subtle mx-2 mb-2 h-20 animate-pulse rounded-md bg-muted/40" />
      <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" />
    </div>
  );
}
