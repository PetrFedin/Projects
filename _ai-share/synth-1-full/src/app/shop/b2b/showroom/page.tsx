'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bShowroomCorePage } from '@/app/shop/b2b/showroom/showroom-core';

const ShopB2bShowroomLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/shop/b2b/showroom/showroom-legacy').then(
      (m) => m.ShopB2bShowroomLegacyPage
    ),
  { ssr: false }
);

export default function VirtualShowroomPage() {
  if (isPlatformCoreMode()) return <ShopB2bShowroomCorePage />;
  return <ShopB2bShowroomLegacyPage />;
}
