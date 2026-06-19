'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bCheckoutCorePage } from '@/app/shop/b2b/checkout/checkout-core';

const ShopB2bCheckoutLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/shop/b2b/checkout/checkout-legacy').then(
      (m) => m.ShopB2bCheckoutLegacyPage
    ),
  { ssr: false }
);

export default function B2BCheckoutPage() {
  if (isPlatformCoreMode()) return <ShopB2bCheckoutCorePage />;
  return <ShopB2bCheckoutLegacyPage />;
}
