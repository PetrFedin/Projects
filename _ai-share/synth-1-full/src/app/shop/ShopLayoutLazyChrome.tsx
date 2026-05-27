'use client';

import dynamic from 'next/dynamic';
import { ShoppingCart } from 'lucide-react';

export { SearchBar } from '@/components/search/SearchBarLazy';

export { ShoppingCart as ShopHubIcon };

function SidebarSkeleton() {
  return <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" aria-hidden />;
}

/** RBAC + shopNavGroups + ShopSidebar — отдельный chunk от shop layout shell. */
export const ShopLayoutSidebarPanel = dynamic(
  () =>
    import('./ShopLayoutSidebarPanel').then((m) => ({
      default: m.ShopLayoutSidebarPanel,
    })),
  { ssr: false, loading: SidebarSkeleton }
);

export const ShopMobileSidebarSheet = dynamic(
  () =>
    import('./ShopMobileSidebarSheet').then((m) => ({
      default: m.ShopMobileSidebarSheet,
    })),
  { ssr: false }
);
