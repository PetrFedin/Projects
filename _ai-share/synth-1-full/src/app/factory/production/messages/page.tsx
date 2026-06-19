'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { FactoryProductionMessagesCorePage } from '@/app/factory/production/messages/messages-core';

const FactoryProductionMessagesLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/factory/production/messages/messages-legacy').then(
      (m) => m.FactoryProductionMessagesLegacyPage
    ),
  { ssr: false }
);

function FactoryMessagesInner() {
  if (isPlatformCoreMode()) return <FactoryProductionMessagesCorePage />;
  return <FactoryProductionMessagesLegacyPage />;
}

export default function FactoryMessagesPage() {
  return (
    <Suspense fallback={null}>
      <FactoryMessagesInner />
    </Suspense>
  );
}
