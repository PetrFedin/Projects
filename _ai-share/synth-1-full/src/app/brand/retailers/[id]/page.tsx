'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { use } from 'react';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandRetailerDetailCorePage } from '@/app/brand/retailers/[id]/retailer-detail-core';

const DEMO_RETAILER_ID = 'shop1';
const DEMO_RETAILER_NAME = 'Оптовый партнёр · Москва 1';

const BrandRetailerDetailLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/retailers/[id]/retailer-detail-legacy').then(
      (m) => m.BrandRetailerDetailLegacyPage
    ),
  { ssr: false }
);

function RetailerDetailPageInner({ id }: { id: string }) {
  if (isPlatformCoreMode() && id === DEMO_RETAILER_ID) {
    return <BrandRetailerDetailCorePage retailerId={id} retailerName={DEMO_RETAILER_NAME} />;
  }
  return <BrandRetailerDetailLegacyPage id={id} />;
}

export default function RetailerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <RetailerDetailPageInner id={id} />
    </Suspense>
  );
}
