'use client';

import { memo, type ReactNode } from 'react';
import { useDeferredMount } from '@/components/home/hooks/use-deferred-mount';

type HomeBelowFoldSectionGateProps = {
  minHeight: string;
  rootMargin?: string;
  children: ReactNode;
};

/** Одна below-fold секция — chunk грузится при scroll near viewport. */
export const HomeBelowFoldSectionGate = memo(function HomeBelowFoldSectionGate({
  minHeight,
  rootMargin = '320px 0px',
  children,
}: HomeBelowFoldSectionGateProps) {
  const { sentinelRef, ready } = useDeferredMount({
    rootMargin,
    idleTimeout: 4500,
    idleFallbackMs: 2000,
  });

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      {ready ? (
        children
      ) : (
        <div className={`${minHeight} animate-pulse rounded-xl bg-muted/40`} aria-hidden />
      )}
    </>
  );
});
