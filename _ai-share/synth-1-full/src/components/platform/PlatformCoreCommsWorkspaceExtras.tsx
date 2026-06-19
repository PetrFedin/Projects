'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { CommunicationsEntityContextBanner } from '@/components/brand/communications/CommunicationsEntityContextBanner';
import type { CommunicationsEntityContextVariant } from '@/components/brand/communications/CommunicationsEntityContextBanner';
import { PlatformCoreCommsCrossNav } from '@/components/platform/PlatformCoreCommsCrossNav';

type Props = {
  variant: CommunicationsEntityContextVariant;
};

/** Comms workspace: переключение чат↔календарь + один контекстный баннер (без дублей strip). */
export function PlatformCoreCommsWorkspaceExtras({ variant }: Props) {
  const pathname = usePathname() ?? '';
  const active = pathname.includes('/calendar') ? 'calendar' : 'chat';

  return (
    <div className="flex flex-col gap-2">
      <PlatformCoreCommsCrossNav variant={variant} active={active} />
      <Suspense fallback={null}>
        <CommunicationsEntityContextBanner
          variant={variant}
          className="rounded-lg"
          platformCoreWorkspace
          showWorkspaceShortcuts={false}
        />
      </Suspense>
    </div>
  );
}
