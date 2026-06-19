'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bPartnersCorePage } from '@/app/shop/b2b/partners/partners-core';

const ShopB2bPartnersLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/shop/b2b/partners/partners-legacy').then(
      (m) => m.ShopB2bPartnersLegacyPage
    ),
  { ssr: false }
);

export default function PartnersPage() {
  if (isPlatformCoreMode()) return <ShopB2bPartnersCorePage />;
  return <ShopB2bPartnersLegacyPage />;
}
