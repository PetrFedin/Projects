'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ROUTES } from '@/lib/routes';
import { SupplierHubLegacyGate } from '@/app/factory/supplier/supplier-legacy-gate';

export default function SupplierHubPage() {
  const router = useRouter();
  const core = isPlatformCoreMode();

  useEffect(() => {
    if (!core) return;
    const hash = window.location.hash;
    const search = window.location.search;
    const target = `${ROUTES.factory.supplierCoreCabinet}${search}${hash}`;
    router.replace(target);
  }, [core, router]);

  if (core) {
    return (
      <div className="text-text-secondary py-10 text-sm">Перенаправление в кабинет поставщика…</div>
    );
  }

  return <SupplierHubLegacyGate />;
}
