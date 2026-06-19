'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bOrdersCorePage } from '@/app/shop/b2b/orders/orders-core';

const ShopB2bOrdersLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/shop/b2b/orders/orders-legacy').then(
      (m) => m.ShopB2bOrdersLegacyPage
    ),
  { ssr: false }
);

export default function ShopB2BOrdersPage() {
  if (isPlatformCoreMode()) return <ShopB2bOrdersCorePage />;
  return <ShopB2bOrdersLegacyPage />;
}
