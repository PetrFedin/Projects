'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const BrandGlobalHubNav = dynamic(
  () =>
    import('./BrandGlobalHubNav').then((m) => ({
      default: m.BrandGlobalHubNav,
    })),
  { ssr: false }
);

type BrandGlobalHubNavGateProps = {
  navigation: unknown;
};

/** Profile navigation strip — dynamic chunk, только если API вернул items. */
export function BrandGlobalHubNavGate({ navigation }: BrandGlobalHubNavGateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!Array.isArray(navigation) || navigation.length === 0) return;
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  if (!Array.isArray(navigation) || navigation.length === 0 || !mounted) return null;
  return <BrandGlobalHubNav navigation={navigation} />;
}
