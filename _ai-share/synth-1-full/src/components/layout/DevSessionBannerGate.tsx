'use client';

import dynamic from 'next/dynamic';

const DevSessionBanner = dynamic(
  () =>
    import('@/components/layout/dev-session-banner').then((m) => ({
      default: m.DevSessionBanner,
    })),
  { ssr: false }
);

/** @deprecated Prefer `DevOnlyChromeGate` in root layout. */
export function DevSessionBannerGate() {
  if (process.env.NODE_ENV === 'production') return null;
  return <DevSessionBanner />;
}
