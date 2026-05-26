'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import type { GlobalCategory } from '@/lib/types';

const HomeAdvertisingSectionGate = dynamic(
  () =>
    import('@/components/home/sections/HomeAdvertisingSectionGate').then((m) => ({
      default: m.HomeAdvertisingSectionGate,
    })),
  { ssr: false, loading: () => <div className="min-h-[120px] animate-pulse bg-muted/30" aria-hidden /> }
);

const HomeStickyNavB2BPanel = dynamic(
  () =>
    import('@/components/home/sections/HomeStickyNavB2BPanel').then((m) => ({
      default: m.HomeStickyNavB2BPanel,
    })),
  { ssr: false, loading: () => <div className="min-h-[48px] animate-pulse bg-muted/30" aria-hidden /> }
);

const HomeStickyNavClientPanel = dynamic(
  () =>
    import('@/components/home/sections/HomeStickyNavClientPanel').then((m) => ({
      default: m.HomeStickyNavClientPanel,
    })),
  { ssr: false, loading: () => <div className="min-h-[48px] animate-pulse bg-muted/30" aria-hidden /> }
);

type HomeStickyNavBlockProps = {
  viewRole: string;
  globalCategory: GlobalCategory;
  setGlobalCategory: (category: GlobalCategory) => void;
};

/** Sticky nav — idle advertising + role-specific panel. */
export const HomeStickyNavBlock = memo(function HomeStickyNavBlock({
  viewRole,
  globalCategory,
  setGlobalCategory,
}: HomeStickyNavBlockProps) {
  return (
    <>
      <HomeAdvertisingSectionGate />
      {viewRole === 'b2b' ? (
        <HomeStickyNavB2BPanel viewRole={viewRole} />
      ) : (
        <HomeStickyNavClientPanel
          globalCategory={globalCategory}
          setGlobalCategory={setGlobalCategory}
        />
      )}
    </>
  );
});
