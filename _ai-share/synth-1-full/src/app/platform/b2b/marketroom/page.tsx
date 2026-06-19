import { Suspense } from 'react';
import { PlatformCoreB2bMarketroomClient } from '@/components/platform/PlatformCoreB2bMarketroomClient';

export default function PlatformCoreB2bMarketroomPage() {
  return (
    <Suspense fallback={<div className="bg-bg-canvas min-h-[calc(100vh-2.5rem)]" aria-hidden />}>
      <PlatformCoreB2bMarketroomClient />
    </Suspense>
  );
}
