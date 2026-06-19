'use client';

import { ShopSidebarHeader } from '@/components/shop/ShopSidebarHeader';
import { ShopLayoutSidebarPanel } from '@/app/shop/ShopLayoutSidebarPanel';
import type { Resource, Action, PlatformRole } from '@/lib/rbac';

type ShopDesktopSidebarProps = {
  role: PlatformRole;
  can: (resource: Resource, action: Action) => boolean;
};

/** Desktop shop aside — header + nav в одном chunk (только ≥ lg). */
export function ShopDesktopSidebar({ role, can }: ShopDesktopSidebarProps) {
  return (
    <>
      <ShopSidebarHeader />
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <ShopLayoutSidebarPanel role={role} can={can} />
      </div>
    </>
  );
}

export function ShopDesktopSidebarPlaceholder() {
  return (
    <div className="flex min-h-0 flex-1 flex-col" aria-hidden>
      <div className="border-border-subtle mx-2 mb-2 h-16 animate-pulse rounded-md bg-muted/40" />
      <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" />
    </div>
  );
}
