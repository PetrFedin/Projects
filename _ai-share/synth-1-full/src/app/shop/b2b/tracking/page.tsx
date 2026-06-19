'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bTrackingCorePage } from '@/app/shop/b2b/tracking/tracking-core';

const ShopB2bTrackingLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/shop/b2b/tracking/tracking-legacy').then(
      (m) => m.ShopB2bTrackingLegacyPage
    ),
  { ssr: false }
);

export default function B2BTrackingPage() {
  if (isPlatformCoreMode()) return <ShopB2bTrackingCorePage />;
  return <ShopB2bTrackingLegacyPage />;
}
