'use client';

import dynamic from 'next/dynamic';

/** Header — отдельный chunk; skeleton сохраняет layout shift. */
export const Header = dynamic(() => import('@/components/layout/header'), {
  loading: () => (
    <header
      className="border-border-subtle bg-bg-surface/95 h-16 shrink-0 border-b"
      aria-hidden
    />
  ),
});

/** Ниже fold / опционально — не тянем в initial client-layout chunk на кабинетах. */
export const Footer = dynamic(() => import('@/components/layout/footer'), { ssr: false });

export const GlobalPodcastPlayer = dynamic(() => import('@/components/layout/global-podcast-player'), {
  ssr: false,
});

export const LeftSidebarNav = dynamic(
  () =>
    import('@/components/layout/left-sidebar-nav').then((m) => ({ default: m.LeftSidebarNav })),
  { ssr: false }
);

export const OfflineBanner = dynamic(
  () =>
    import('@/components/brand/production/OfflineBanner').then((m) => ({
      default: m.OfflineBanner,
    })),
  { ssr: false }
);

export const RunwayAnalyticsProvider = dynamic(
  () =>
    import('@/components/providers/RunwayAnalyticsProvider').then((m) => ({
      default: m.RunwayAnalyticsProvider,
    })),
  { ssr: false }
);

export const RegisterServiceWorker = dynamic(
  () =>
    import('@/components/pwa/RegisterServiceWorker').then((m) => ({
      default: m.RegisterServiceWorker,
    })),
  { ssr: false }
);
