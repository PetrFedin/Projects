'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

function SidebarOrgHeaderPlaceholder() {
  return (
    <div className="border-border-subtle shrink-0 border-b px-2 py-2" aria-hidden>
      <div className="bg-bg-surface2 mx-0 h-[52px] animate-pulse rounded-lg" />
    </div>
  );
}

const SidebarOrgHeader = dynamic(
  () =>
    import('@/components/brand/SidebarOrgHeader').then((m) => ({
      default: m.SidebarOrgHeader,
    })),
  { ssr: false, loading: SidebarOrgHeaderPlaceholder }
);

/** Org header в brand sidebar — после idle (team-data fixtures не на cold compile). */
export function SidebarOrgHeaderGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return <SidebarOrgHeaderPlaceholder />;
  return <SidebarOrgHeader />;
}
