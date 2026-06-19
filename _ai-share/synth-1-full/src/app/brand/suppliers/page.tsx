'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandSuppliersCoreRedirect } from '@/app/brand/suppliers/suppliers-core-redirect';

const BrandSuppliersLegacyPage = dynamic(
  () => import('@/app/brand/suppliers/suppliers-legacy-page'),
  { ssr: false }
);

export default function SuppliersPage() {
  if (isPlatformCoreMode()) {
    return <BrandSuppliersCoreRedirect />;
  }
  return <BrandSuppliersLegacyPage />;
}
