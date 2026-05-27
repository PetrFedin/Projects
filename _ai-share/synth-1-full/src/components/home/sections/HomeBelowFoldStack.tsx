'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import type { CmsHomeConfig } from '@/data/cms.home.default';

const HomeBelowFoldClientStack = dynamic(
  () =>
    import('@/components/home/sections/HomeBelowFoldClientStack').then((m) => ({
      default: m.HomeBelowFoldClientStack,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[800px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

const HomeBelowFoldRoleStack = dynamic(
  () =>
    import('@/components/home/sections/HomeBelowFoldRoleStack').then((m) => ({
      default: m.HomeBelowFoldRoleStack,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

type HomeBelowFoldStackProps = {
  viewRole: string;
  isDropsUnlocked: boolean;
  live: CmsHomeConfig['live'];
};

function isClientBelowFoldRole(viewRole: string) {
  return viewRole === 'client' || viewRole === 'admin';
}

/** Below-fold router — B2C stack vs lightweight role stack (b2b/brand/shop…). */
export const HomeBelowFoldStack = memo(function HomeBelowFoldStack({
  viewRole,
  isDropsUnlocked,
  live,
}: HomeBelowFoldStackProps) {
  if (isClientBelowFoldRole(viewRole)) {
    return (
      <HomeBelowFoldClientStack viewRole={viewRole} isDropsUnlocked={isDropsUnlocked} live={live} />
    );
  }

  return <HomeBelowFoldRoleStack />;
});
