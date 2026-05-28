'use client';

/**
 * Отложенная загрузка ShopSidebar — не тянет UI сайдбара в initial chunk shop layout.
 */
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { ShopSidebar } from './ShopSidebar';

export type ShopSidebarLazyProps = ComponentProps<typeof ShopSidebar>;

function ShopSidebarSkeleton() {
  return <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" aria-hidden />;
}

export const ShopSidebarLazy = dynamic(
  () => import('./ShopSidebar').then((m) => ({ default: m.ShopSidebar })),
  { ssr: false, loading: ShopSidebarSkeleton }
);
