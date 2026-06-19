'use client';

import { pillarInsight } from '@/lib/platform-core-cabinet-chrome';
import { cn } from '@/lib/utils';

type Props = {
  testId?: string;
  className?: string;
};

/** Skeleton insight-карточки столпа в кабинете (пока pillar-snapshot грузится). */
export function PlatformCorePillarInsightSkeleton({
  testId = 'platform-core-pillar-insight-skeleton',
  className,
}: Props) {
  return (
    <div
      data-testid={testId}
      className={cn(pillarInsight.card, 'animate-pulse p-3 md:p-4', className)}
      aria-busy="true"
      aria-label="Загрузка insight столпа"
    >
      <div className={pillarInsight.header}>
        <div className="bg-bg-surface2 h-8 w-8 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="bg-bg-surface2 h-3 w-28 rounded" />
          <div className="bg-bg-surface2 h-2 max-w-[14rem] rounded" />
        </div>
      </div>
      <div className={pillarInsight.stepRow}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="bg-bg-surface2 h-5 w-[4.5rem] rounded-md" />
        ))}
      </div>
      <div className="bg-bg-surface2 mt-1 h-8 w-full rounded-lg md:max-w-[10rem]" />
    </div>
  );
}
