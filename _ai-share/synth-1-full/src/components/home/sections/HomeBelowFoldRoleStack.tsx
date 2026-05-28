'use client';

import dynamic from 'next/dynamic';
import { HomeBelowFoldSectionGate } from '@/components/home/sections/HomeBelowFoldSectionGate';

const B2BUpdatesSection = dynamic(
  () =>
    import('@/components/home/B2BUpdatesSection').then((m) => ({
      default: m.B2BUpdatesSection,
    })),
  { ssr: false }
);

/** Below-fold для b2b/brand/shop — B2B news через IO gate. */
export function HomeBelowFoldRoleStack() {
  return (
    <HomeBelowFoldSectionGate minHeight="min-h-[200px]" rootMargin="400px 0px">
      <B2BUpdatesSection />
    </HomeBelowFoldSectionGate>
  );
}
