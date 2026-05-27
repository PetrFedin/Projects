'use client';

/**
 * Отложенная загрузка HubSidebar — выносит тяжёлый UI навигации кабинетов
 * из initial chunk layout'ов admin / distributor / factory / client.
 */
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { HubSidebar } from './HubSidebar';

export type HubSidebarLazyProps = ComponentProps<typeof HubSidebar>;

function HubSidebarSkeleton() {
  return <div className="mx-3 my-4 h-24 animate-pulse rounded-md bg-muted/40" aria-hidden />;
}

export const HubSidebarLazy = dynamic(
  () => import('./HubSidebar').then((m) => ({ default: m.HubSidebar })),
  { ssr: false, loading: HubSidebarSkeleton }
);
