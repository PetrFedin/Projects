'use client';

import dynamic from 'next/dynamic';
import { Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const StylistPanel = dynamic(
  () => import('@/components/ai/StylistPanel').then((m) => ({ default: m.StylistPanel })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

type HomeAiStylistSectionProps = {
  viewRole: string;
};

/** AI-стилист B2C — StylistPanel в отдельном chunk от HomePageClient shell. */
export function HomeAiStylistSection({ viewRole }: HomeAiStylistSectionProps) {
  if (viewRole !== 'client') return null;

  return (
    <section id="AI_STYLIST_b2c" className="section-spacing relative scroll-mt-24 bg-transparent">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
          <CardContent className="relative z-10 p-4 pb-4 pt-4">
            <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-bg-surface2 flex size-8 items-center justify-center rounded-xl">
                    <Brain className="size-4 text-black" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border-default text-text-primary px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                  >
                    ALGORITHM_B2C
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                    AI-стилист
                  </h2>
                  <p className="text-text-secondary max-w-xl text-sm">
                    Создавайте уникальные комбинации в один клик.
                  </p>
                </div>
              </div>
            </div>
            <StylistPanel viewRole={viewRole} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
