'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { FactoryProductionCorePage } from '@/app/factory/production/production-core';

const FactoryProductionLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/factory/production/production-legacy').then(
      (m) => m.FactoryProductionLegacyPage
    ),
  { ssr: false }
);

function FactoryProductionHubPageInner() {
  if (isPlatformCoreMode()) return <FactoryProductionCorePage />;
  return <FactoryProductionLegacyPage />;
}

export default function FactoryProductionHubPage() {
  return (
    <Suspense fallback={null}>
      <FactoryProductionHubPageInner />
    </Suspense>
  );
}
