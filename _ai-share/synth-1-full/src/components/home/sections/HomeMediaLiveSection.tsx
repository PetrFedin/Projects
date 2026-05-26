'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import type { CmsHomeConfig } from '@/data/cms.home.default';

const HomeLiveStrip = dynamic(
  () => import('@/components/cms/HomeLiveStrip').then((m) => ({ default: m.HomeLiveStrip })),
  { ssr: false, loading: () => <div className="min-h-[200px] animate-pulse rounded-xl bg-muted/40" aria-hidden /> }
);

type HomeMediaLiveSectionProps = {
  viewRole: string;
  live: CmsHomeConfig['live'];
};

/** Live media strip B2C — CMS live chunk отдельно от shell. */
export function HomeMediaLiveSection({ viewRole, live }: HomeMediaLiveSectionProps) {
  if (viewRole !== 'client') return null;

  return (
    <section id="MEDIA_b2c" className="section-spacing relative scroll-mt-24 bg-transparent">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
          <CardContent className="relative z-10 p-4">
            <HomeLiveStrip live={live} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
