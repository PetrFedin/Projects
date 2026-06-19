'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import type { HubSidebarProfile, HubSidebarHeaderProps } from '@/components/hub/HubSidebarHeader';

function HubSidebarHeaderPlaceholder({ profile }: { profile?: HubSidebarProfile }) {
  return (
    <div className="border-border-subtle shrink-0 border-b px-3 py-1" aria-hidden>
      <div
        className={cn('mx-1 animate-pulse rounded-lg bg-muted/40', profile ? 'h-[72px]' : 'h-11')}
      />
    </div>
  );
}

const HubSidebarHeader = dynamic(
  () =>
    import('@/components/hub/HubSidebarHeader').then((m) => ({
      default: m.HubSidebarHeader,
    })),
  { ssr: false, loading: () => <HubSidebarHeaderPlaceholder profile={undefined} /> }
);

/** Hub sidebar header — после idle, не тянет Avatar/RBAC на cold compile layout shell. */
export function HubSidebarHeaderGate(props: HubSidebarHeaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = globalThis.setTimeout(() => setReady(true), 1200);
    return () => globalThis.clearTimeout(timer);
  }, []);

  if (!ready) return <HubSidebarHeaderPlaceholder profile={props.profile} />;
  return <HubSidebarHeader {...props} />;
}
