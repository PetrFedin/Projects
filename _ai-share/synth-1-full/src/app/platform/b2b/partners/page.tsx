import { Suspense } from 'react';
import { PlatformCoreB2bPartnersClient } from '@/components/platform/PlatformCoreB2bPartnersClient';

export default function PlatformCoreB2bPartnersPage() {
  return (
    <Suspense fallback={<div className="bg-bg-canvas min-h-[calc(100vh-2.5rem)]" aria-hidden />}>
      <PlatformCoreB2bPartnersClient />
    </Suspense>
  );
}
