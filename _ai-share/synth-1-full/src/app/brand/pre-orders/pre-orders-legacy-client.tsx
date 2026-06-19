'use client';

import dynamic from 'next/dynamic';

const BrandPreOrdersLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/pre-orders/pre-orders-legacy').then(
      (m) => m.BrandPreOrdersLegacyPage
    ),
  { ssr: false }
);

export function PreOrdersLegacyClient() {
  return <BrandPreOrdersLegacyPage />;
}
