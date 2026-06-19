'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { use } from 'react';
import { resolveWorkshop2FactoryContractorId } from '@/lib/factory/factory-id-bridge';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { BrandFactoryDetailCorePage } from '@/app/brand/factories/[id]/factory-detail-core';

const BrandFactoryDetailLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/factories/[id]/factory-detail-legacy').then(
      (m) => m.BrandFactoryDetailLegacyPage
    ),
  { ssr: false }
);

function FactoryDetailPageInner({ id }: { id: string }) {
  const contractorId = resolveWorkshop2FactoryContractorId(id);
  const showDevPillar = isPlatformCoreMode() && id === PLATFORM_CORE_DEMO.factoryHubId;

  if (showDevPillar) {
    return <BrandFactoryDetailCorePage contractorId={contractorId} />;
  }
  return <BrandFactoryDetailLegacyPage id={id} contractorId={contractorId} />;
}

export default function FactoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <FactoryDetailPageInner id={id} />
    </Suspense>
  );
}
