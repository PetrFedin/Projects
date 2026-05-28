'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

const AsSeenOnLive = dynamic(
  () =>
    import('@/components/home/sections/AsSeenOnLive').then((m) => ({ default: m.AsSeenOnLive })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[240px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

const SynthaEdit = dynamic(
  () => import('@/components/home/sections/SynthaEdit').then((m) => ({ default: m.SynthaEdit })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[240px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

type HomeClientEditorialSectionsProps = {
  viewRole: string;
};

/** Social sync + editorial B2C — below-fold chunks отдельно от HomePageClient. */
export function HomeClientEditorialSections({ viewRole }: HomeClientEditorialSectionsProps) {
  if (viewRole !== 'client') return null;

  return (
    <>
      <section
        id="SOCIAL_SYNC_b2c"
        className="section-spacing relative scroll-mt-24 bg-transparent"
      >
        <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
          <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
            <CardContent className="relative z-10 p-4">
              <AsSeenOnLive />
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="EDITORIAL_b2c" className="section-spacing relative scroll-mt-24 bg-transparent">
        <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
          <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
            <CardContent className="relative z-10 p-4">
              <SynthaEdit />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
