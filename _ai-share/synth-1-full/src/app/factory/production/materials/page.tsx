'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { FactoryMaterialsCorePage } from '@/app/factory/production/materials/materials-core';

const FactoryMaterialsLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/factory/production/materials/materials-legacy').then(
      (m) => m.FactoryMaterialsLegacyPage
    ),
  { ssr: false }
);

function FactoryMaterialsPageInner() {
  if (isPlatformCoreMode()) return <FactoryMaterialsCorePage />;
  return <FactoryMaterialsLegacyPage />;
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={null}>
      <FactoryMaterialsPageInner />
    </Suspense>
  );
}
