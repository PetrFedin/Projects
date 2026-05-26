'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';

const HomeAdminHubSection = dynamic(
  () =>
    import('@/components/home/sections/HomeAdminHubSection').then((m) => ({
      default: m.HomeAdminHubSection,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="border-border-default bg-bg-surface2/60 min-h-[240px] rounded-xl border border-dashed"
        aria-hidden
      />
    ),
  }
);

type HomeAdminHubGateProps = {
  viewRole: string;
};

/** Admin hub — chunk только для admin role. */
export const HomeAdminHubGate = memo(function HomeAdminHubGate({ viewRole }: HomeAdminHubGateProps) {
  if (viewRole !== 'admin') return null;
  return <HomeAdminHubSection viewRole={viewRole} />;
});
