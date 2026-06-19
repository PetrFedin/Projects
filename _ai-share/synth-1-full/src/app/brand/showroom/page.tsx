'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandShowroomCorePage } from '@/app/brand/showroom/showroom-core';

const BrandShowroomLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/showroom/showroom-legacy').then(
      (m) => m.BrandShowroomLegacyPage
    ),
  { ssr: false }
);

export default function BrandShowroomPage() {
  if (isPlatformCoreMode()) return <BrandShowroomCorePage />;
  return <BrandShowroomLegacyPage />;
}
