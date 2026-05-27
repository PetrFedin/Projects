'use client';

/**
 * Футер профиля в сайдбаре Academy — education-data грузится только на /academy*.
 */
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getClientAcademyLearningActivity, getMyPlatformEnrollments } from '@/lib/education-data';

type ClientAcademySidebarFooterProps = {
  clientNuOrderHub?: boolean;
};

export function ClientAcademySidebarFooter({ clientNuOrderHub }: ClientAcademySidebarFooterProps) {
  const activity = useMemo(() => getClientAcademyLearningActivity(getMyPlatformEnrollments()), []);
  const accentNum = clientNuOrderHub ? 'text-[#4a5fc8]' : 'text-accent-primary';
  const accentBar = clientNuOrderHub ? 'bg-[#4a5fc8]' : 'bg-accent-primary';

  return (
    <div className="border-border-subtle/90 bg-bg-surface2/60 rounded-md border px-2.5 py-2 shadow-sm">
      <div className="space-y-2">
        <div className="min-w-0">
          <p className="text-text-muted text-[10px] font-medium leading-tight">Активность</p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-x-0.5 leading-none">
            <span className={cn('text-sm font-bold tabular-nums tracking-tight', accentNum)}>
              {activity.activityScore}
            </span>
            <span className="text-text-muted text-[10px] font-normal tabular-nums">/ 100</span>
          </p>
        </div>
        <div className="border-border-subtle/70 min-w-0 border-t pt-2">
          <p className="text-text-muted text-[10px] font-medium leading-tight">Рейтинг</p>
          <p className="text-text-primary mt-0.5 text-[11px] font-semibold tabular-nums leading-tight">
            {activity.rankAmongClients.toLocaleString('ru-RU')}
            <span className="text-text-muted text-[10px] font-normal"> / </span>
            <span className="text-text-muted text-[10px] font-normal tabular-nums">
              {activity.totalClientsRanked.toLocaleString('ru-RU')}
            </span>
          </p>
        </div>
      </div>
      <div className="pointer-events-none mt-2" aria-hidden>
        <Progress
          value={activity.activityScore}
          className="bg-border-subtle/90 h-1 rounded-full"
          indicatorClassName={cn('rounded-full', accentBar)}
        />
      </div>
    </div>
  );
}
