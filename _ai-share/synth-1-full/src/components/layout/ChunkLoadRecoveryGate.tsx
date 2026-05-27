'use client';

import dynamic from 'next/dynamic';

const ChunkLoadRecovery = dynamic(
  () =>
    import('@/components/layout/chunk-load-recovery').then((m) => ({
      default: m.ChunkLoadRecovery,
    })),
  { ssr: false }
);

/** @deprecated Prefer `DevOnlyChromeGate` in root layout. */
export function ChunkLoadRecoveryGate() {
  if (process.env.NODE_ENV === 'production') return null;
  return <ChunkLoadRecovery />;
}
