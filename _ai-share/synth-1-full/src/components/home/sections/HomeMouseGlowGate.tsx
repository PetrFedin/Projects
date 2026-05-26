'use client';

import dynamic from 'next/dynamic';
import { useIdleMount } from '@/components/home/hooks/use-idle-mount';

const HomeMouseGlow = dynamic(
  () =>
    import('@/components/home/sections/HomeMouseGlow').then((m) => ({
      default: m.HomeMouseGlow,
    })),
  { ssr: false }
);

/** Below-fold glow — idle gate перед chunk + mousemove listeners. */
export function HomeMouseGlowGate() {
  const ready = useIdleMount({ idleTimeout: 2200, idleFallbackMs: 900 });

  if (!ready) return null;

  return <HomeMouseGlow />;
}
