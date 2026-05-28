'use client';

import dynamic from 'next/dynamic';
import { useIdleMount } from '@/components/home/hooks/use-idle-mount';

const AdvertisingSection = dynamic(
  () =>
    import('@/components/home/AdvertisingSection').then((m) => ({
      default: m.AdvertisingSection,
    })),
  {
    ssr: false,
    loading: () => <div className="min-h-[120px] animate-pulse bg-muted/30" aria-hidden />,
  }
);

/** Hero advertising — framer-motion chunk после idle (не блокирует sticky nav shell). */
export function HomeAdvertisingSectionGate() {
  const ready = useIdleMount({ idleTimeout: 800, idleFallbackMs: 350 });

  if (!ready) {
    return <div className="min-h-[120px] animate-pulse bg-muted/30" aria-hidden />;
  }

  return <AdvertisingSection />;
}
