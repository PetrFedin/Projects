'use client';

import dynamic from 'next/dynamic';

/** Shared skeleton for home lazy entry points. */
function sectionSkeleton(minHeight: string) {
  return function SectionSkeleton() {
    return <div className={`${minHeight} animate-pulse rounded-xl bg-muted/40`} aria-hidden />;
  };
}

export const HomeStickyNavBlock = dynamic(
  () =>
    import('@/components/home/sections/HomeStickyNavBlock').then((m) => ({
      default: m.HomeStickyNavBlock,
    })),
  { ssr: false, loading: sectionSkeleton('min-h-[120px]') }
);

export const HomeAdminHubGate = dynamic(
  () =>
    import('@/components/home/sections/HomeAdminHubGate').then((m) => ({
      default: m.HomeAdminHubGate,
    })),
  { ssr: false }
);

export const HomeMidFoldStack = dynamic(
  () =>
    import('@/components/home/sections/HomeMidFoldStack').then((m) => ({
      default: m.HomeMidFoldStack,
    })),
  { ssr: false, loading: sectionSkeleton('min-h-[640px]') }
);

export const HomeBelowFoldGate = dynamic(
  () =>
    import('@/components/home/sections/HomeBelowFoldGate').then((m) => ({
      default: m.HomeBelowFoldGate,
    })),
  { ssr: false, loading: sectionSkeleton('min-h-[800px]') }
);
