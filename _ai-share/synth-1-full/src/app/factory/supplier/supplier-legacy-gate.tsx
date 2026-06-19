'use client';

import dynamic from 'next/dynamic';

const FactorySupplierLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/factory/supplier/supplier-legacy').then(
      (m) => m.FactorySupplierLegacyPage
    ),
  { ssr: false }
);

/** Legacy hub — только вне Platform Core mode. */
export function SupplierHubLegacyGate() {
  return <FactorySupplierLegacyPage />;
}
