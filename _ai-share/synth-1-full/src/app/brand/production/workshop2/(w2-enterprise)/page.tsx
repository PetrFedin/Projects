'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { Workshop2HubCorePage } from '@/app/brand/production/workshop2/workshop2-hub-core';

const Workshop2HubLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/production/workshop2/workshop2-hub-legacy').then(
      (m) => m.Workshop2HubLegacyPage
    ),
  { ssr: false }
);

function ProductionWorkshop2PageInner() {
  if (isPlatformCoreMode()) return <Workshop2HubCorePage />;
  return <Workshop2HubLegacyPage />;
}

export default function ProductionWorkshop2Page() {
  return (
    <Suspense fallback={null}>
      <ProductionWorkshop2PageInner />
    </Suspense>
  );
}
