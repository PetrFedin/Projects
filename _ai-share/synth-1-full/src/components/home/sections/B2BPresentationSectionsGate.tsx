'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { useDeferredMount } from '@/components/home/hooks/use-deferred-mount';

const B2BPresentationSections = dynamic(
  () =>
    import('@/components/home/B2BPresentationSections').then((m) => ({
      default: m.B2BPresentationSections,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[240px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

type B2BPresentationSectionsGateProps = {
  isFlowMapOpen: boolean;
};

/** B2B presentation — отдельный chunk для b2b + IO/idle prefetch. */
export function B2BPresentationSectionsGate({ isFlowMapOpen }: B2BPresentationSectionsGateProps) {
  const { sentinelRef, ready } = useDeferredMount({
    rootMargin: '400px 0px',
    idleTimeout: 2500,
  });

  return (
    <div className={cn('transition-all duration-300', isFlowMapOpen && 'pt-0')}>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      {ready ? (
        <B2BPresentationSections isVisible />
      ) : (
        <div className="min-h-[240px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
      )}
    </div>
  );
}
