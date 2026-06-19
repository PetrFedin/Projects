'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandLineSheetsCorePage } from '@/app/brand/linesheets/linesheets-core';

const BrandLineSheetsLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/linesheets/linesheets-legacy').then(
      (m) => m.BrandLineSheetsLegacyPage
    ),
  { ssr: false }
);

export default function BrandLineSheetsPage() {
  if (isPlatformCoreMode()) {
    return (
      <Suspense fallback={null}>
        <BrandLineSheetsCorePage />
      </Suspense>
    );
  }
  return <BrandLineSheetsLegacyPage />;
}
