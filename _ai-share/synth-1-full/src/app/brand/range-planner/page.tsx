'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { RangePlannerCorePage } from '@/app/brand/range-planner/range-planner-core';

const RangePlannerLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/range-planner/range-planner-legacy').then(
      (m) => m.RangePlannerLegacyPage
    ),
  { ssr: false }
);

function RangePlannerPageInner() {
  if (isPlatformCoreMode()) return <RangePlannerCorePage />;
  return <RangePlannerLegacyPage />;
}

export default function RangePlannerPage() {
  return (
    <Suspense fallback={null}>
      <RangePlannerPageInner />
    </Suspense>
  );
}
