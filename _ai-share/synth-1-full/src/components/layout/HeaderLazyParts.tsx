'use client';

import dynamic from 'next/dynamic';

export { SearchBar } from '@/components/search/SearchBarLazy';

export const UserNav = dynamic(() => import('@/components/user-nav'), {
  ssr: false,
  loading: () => (
    <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted/60" aria-hidden />
  ),
});

export const HeaderEcosystemAccessMenu = dynamic(
  () =>
    import('@/components/layout/HeaderEcosystemAccessMenu').then((m) => ({
      default: m.HeaderEcosystemAccessMenu,
    })),
  { ssr: false }
);
