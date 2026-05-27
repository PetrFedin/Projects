'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { useHomeCmsLive } from '@/components/home/context/HomeCmsContext';
import { useDeferredMount } from '@/components/home/hooks/use-deferred-mount';

const HomeBelowFoldStack = dynamic(
  () =>
    import('@/components/home/sections/HomeBelowFoldStack').then((m) => ({
      default: m.HomeBelowFoldStack,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[800px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

type HomeBelowFoldReadyProps = {
  viewRole: string;
  isDropsUnlocked: boolean;
};

const HomeBelowFoldReady = memo(function HomeBelowFoldReady({
  viewRole,
  isDropsUnlocked,
}: HomeBelowFoldReadyProps) {
  const live = useHomeCmsLive();

  return <HomeBelowFoldStack viewRole={viewRole} isDropsUnlocked={isDropsUnlocked} live={live} />;
});

type HomeBelowFoldGateProps = HomeBelowFoldReadyProps;

/** Below-fold — IO/idle chunk; `live` из HomeCmsContext, не из shell props. */
export const HomeBelowFoldGate = memo(function HomeBelowFoldGate({
  viewRole,
  isDropsUnlocked,
}: HomeBelowFoldGateProps) {
  const { sentinelRef, ready } = useDeferredMount({
    rootMargin: '600px 0px',
    idleTimeout: 4000,
    idleFallbackMs: 2000,
  });

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      {ready ? (
        <HomeBelowFoldReady viewRole={viewRole} isDropsUnlocked={isDropsUnlocked} />
      ) : (
        <div className="min-h-[800px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
      )}
    </>
  );
});
