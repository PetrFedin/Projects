'use client';

import Link from 'next/link';
import { Calendar, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDefaultUpcomingDeadlines, buildCalendarUrl } from '@/lib/data/calendar-events';
import { ROUTES } from '@/lib/routes';

export function CommunicationsUpcomingStrip({ limit = 5 }: { limit?: number }) {
  const items = getDefaultUpcomingDeadlines({ limit });
  return (
    <div className="bg-bg-surface2 border-border-subtle flex items-center gap-3 overflow-x-auto rounded-xl border px-4 py-2.5">
      <span className="text-text-muted flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
        <Calendar className="h-3.5 w-3.5" />
        Следующие:
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {items.length === 0 ? (
          <Link
            href={buildCalendarUrl({ add: true })}
            className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary flex shrink-0 items-center gap-2 rounded-lg border border-dashed bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight transition-all"
          >
            <Plus className="h-3 w-3" /> Добавить событие
          </Link>
        ) : (
          items.map((d, i) => (
            <Link
              key={`${d.t}-${d.d}-${i}`}
              href={d.calendarHref || ROUTES.brand.calendar}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight transition-all',
                d.isOverdue
                  ? 'border-rose-200 hover:border-rose-300 hover:bg-rose-50/50'
                  : 'border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10'
              )}
            >
              <span className={cn('rounded px-1.5 py-0.5 text-[8px]', d.color)}>{d.d}</span>
              <span className="text-text-primary max-w-[140px] truncate">{d.t}</span>
              {d.isOverdue && <span className="text-[7px] text-rose-500">!</span>}
            </Link>
          ))
        )}
      </div>
      <Link
        href={ROUTES.brand.calendar}
        className="text-accent-primary hover:text-accent-primary flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest"
      >
        Календарь <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
