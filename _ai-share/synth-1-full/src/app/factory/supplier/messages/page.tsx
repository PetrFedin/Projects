'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { FactorySupplierMessagesCorePage } from '@/app/factory/supplier/messages/supplier-messages-core';

const FactoryProductionMessagesLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/factory/production/messages/messages-legacy').then(
      (m) => m.FactoryProductionMessagesLegacyPage
    ),
  { ssr: false }
);

function FactorySupplierMessagesInner() {
  if (isPlatformCoreMode()) return <FactorySupplierMessagesCorePage />;
  return <FactoryProductionMessagesLegacyPage />;
}

/** `/factory/supplier/messages` — сообщения поставщика (role=supplier по pathname). */
export default function FactorySupplierMessagesPage() {
  return (
    <Suspense fallback={null}>
      <FactorySupplierMessagesInner />
    </Suspense>
  );
}
