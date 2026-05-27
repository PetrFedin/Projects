'use client';

/**
 * Отложенная загрузка BrandSidebar — UI навигации вне initial brand layout chunk.
 */
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { BrandSidebar } from './BrandSidebar';

export type BrandSidebarLazyProps = ComponentProps<typeof BrandSidebar>;

function BrandSidebarSkeleton() {
  return <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" aria-hidden />;
}

export const BrandSidebarLazy = dynamic(
  () => import('./BrandSidebar').then((m) => ({ default: m.BrandSidebar })),
  { ssr: false, loading: BrandSidebarSkeleton }
);
