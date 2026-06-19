import { Suspense } from 'react';
import { PlatformHubPageClient } from '@/components/platform/PlatformHubPageClient';

export default function PlatformHubPage() {
  return (
    <Suspense fallback={<div className="bg-bg-surface min-h-[calc(100vh-4rem)]" />}>
      <PlatformHubPageClient />
    </Suspense>
  );
}
