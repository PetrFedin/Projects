'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bWorkingOrderCorePage } from '@/app/shop/b2b/working-order/working-order-core';

const ShopB2bWorkingOrderLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/shop/b2b/working-order/working-order-legacy').then(
      (m) => m.ShopB2bWorkingOrderLegacyPage
    ),
  { ssr: false }
);

function WorkingOrderPageInner() {
  if (isPlatformCoreMode()) return <ShopB2bWorkingOrderCorePage />;
  return <ShopB2bWorkingOrderLegacyPage />;
}

export default function WorkingOrderPage() {
  return (
    <Suspense fallback={null}>
      <WorkingOrderPageInner />
    </Suspense>
  );
}
