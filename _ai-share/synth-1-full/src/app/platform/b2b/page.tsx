import { Suspense } from 'react';
import { PlatformCoreB2bHubClient } from '@/components/platform/PlatformCoreB2bHubClient';

export default function PlatformCoreB2bIndexPage() {
  return (
    <Suspense fallback={<div className="bg-bg-canvas min-h-[calc(100vh-2.5rem)]" aria-hidden />}>
      <PlatformCoreB2bHubClient />
    </Suspense>
  );
}
