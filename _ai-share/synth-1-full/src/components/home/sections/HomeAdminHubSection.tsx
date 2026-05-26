'use client';

import dynamic from 'next/dynamic';

const B2BControlCenter = dynamic(
  () =>
    import('@/components/admin/B2BControlCenter').then((m) => ({ default: m.B2BControlCenter })),
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

type HomeAdminHubSectionProps = {
  viewRole: string;
};

/** Admin control hub — B2BControlCenter в отдельном chunk. */
export function HomeAdminHubSection({ viewRole }: HomeAdminHubSectionProps) {
  if (viewRole !== 'admin') return null;

  return (
    <section id="ADMIN_HUB" className="section-spacing relative bg-transparent pt-24">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <B2BControlCenter />
      </div>
    </section>
  );
}
