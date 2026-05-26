'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { totalLookCards } from '@/components/home/_fixtures/home-data';

const WeeklyLooks = dynamic(() => import('@/components/weekly-looks'), {
  ssr: false,
  loading: () => <div className="min-h-[420px] animate-pulse rounded-xl bg-muted/40" aria-hidden />,
});

type HomeWeeklyLooksSectionProps = {
  viewRole: string;
  showroomAnchor?: string;
};

function getWeeklyLookProductPreviews() {
  return totalLookCards
    .flatMap(
      (l) =>
        (
          l as {
            products?: {
              id: string;
              name: string;
              image: string;
              brand: string;
              price: number;
            }[];
          }
        ).products ?? []
    )
    .slice(0, 6);
}

/** Weekly looks B2C — weekly-looks + fixtures в отдельном chunk. */
export function HomeWeeklyLooksSection({
  viewRole,
  showroomAnchor = 'SHOWCASE_b2b',
}: HomeWeeklyLooksSectionProps) {
  if (viewRole !== 'client') return null;

  return (
    <section id="WEEKLY_LOOKS_b2c" className="section-spacing relative scroll-mt-24 bg-transparent">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
          <CardContent className="relative z-10 p-4">
            <WeeklyLooks
              viewRole={viewRole}
              productPreviews={getWeeklyLookProductPreviews()}
              showroomAnchor={showroomAnchor}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
