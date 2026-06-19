'use client';

import { useEffect, useState, type ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import type { CabinetHubSwitcherNav as CabinetHubSwitcherNavComponent } from '@/components/layout/CabinetHubSwitcherNav';

const CabinetHubSwitcherNavInner = dynamic(
  () =>
    import('./CabinetHubSwitcherNav').then((m) => ({
      default: m.CabinetHubSwitcherNav,
    })),
  { ssr: false }
);

type CabinetHubSwitcherNavProps = ComponentProps<typeof CabinetHubSwitcherNavComponent>;

/** Hub switcher — dynamic chunk + idle, не конкурирует с cold compile layout shell. */
export function CabinetHubSwitcherNav(props: CabinetHubSwitcherNavProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = globalThis.setTimeout(() => setMounted(true), 1200);
    return () => globalThis.clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  return <CabinetHubSwitcherNavInner {...props} />;
}
