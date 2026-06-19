'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandB2bOrdersCorePage } from '@/app/brand/b2b-orders/b2b-orders-core';

const BrandB2bOrdersLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/b2b-orders/b2b-orders-legacy').then(
      (m) => m.BrandB2bOrdersLegacyPage
    ),
  { ssr: false }
);

export default function BrandB2BOrdersListPage() {
  if (isPlatformCoreMode()) return <BrandB2bOrdersCorePage />;
  return <BrandB2bOrdersLegacyPage />;
}
