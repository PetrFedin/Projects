'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandRetailersCorePage } from '@/app/brand/retailers/retailers-core';

const BrandRetailersLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/retailers/retailers-legacy').then(
      (m) => m.BrandRetailersLegacyPage
    ),
  { ssr: false }
);

export default function RetailersPage() {
  if (isPlatformCoreMode()) return <BrandRetailersCorePage />;
  return <BrandRetailersLegacyPage />;
}
