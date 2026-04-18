'use client';

import Link from 'next/link';
import { Calendar, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDefaultUpcomingDeadlines, buildCalendarUrl } from '@/lib/data/calendar-events';
import { ROUTES } from '@/lib/routes';

export function CommunicationsUpcomingStrip({ limit = 5 }: { limit?: number }) {
  const items = getDefaultUpcomingDeadlines({ limit });
  return (
<<<<<<< HEAD
    <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
      <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
    <div className="bg-bg-surface2 border-border-subtle flex items-center gap-3 overflow-x-auto rounded-xl border px-4 py-2.5">
      <span className="text-text-muted flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
        <Calendar className="h-3.5 w-3.5" />
        Следующие:
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {items.length === 0 ? (
          <Link
            href={buildCalendarUrl({ add: true })}
<<<<<<< HEAD
            className="flex shrink-0 items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-600"
=======
            className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary flex shrink-0 items-center gap-2 rounded-lg border border-dashed bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Plus className="h-3 w-3" /> Добавить событие
          </Link>
        ) : (
          items.map((d, i) => (
            <Link
              key={`${d.t}-${d.d}-${i}`}
<<<<<<< HEAD
              href={d.calendarHref || '/brand/calendar'}
=======
              href={d.calendarHref || ROUTES.brand.calendar}
>>>>>>> recover/cabinet-wip-from-stash
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight transition-all',
                d.isOverdue
                  ? 'border-rose-200 hover:border-rose-300 hover:bg-rose-50/50'
<<<<<<< HEAD
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30'
              )}
            >
              <span className={cn('rounded px-1.5 py-0.5 text-[8px]', d.color)}>{d.d}</span>
              <span className="max-w-[140px] truncate text-slate-800">{d.t}</span>
=======
                  : 'border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10'
              )}
            >
              <span className={cn('rounded px-1.5 py-0.5 text-[8px]', d.color)}>{d.d}</span>
              <span className="text-text-primary max-w-[140px] truncate">{d.t}</span>
>>>>>>> recover/cabinet-wip-from-stash
              {d.isOverdue && <span className="text-[7px] text-rose-500">!</span>}
            </Link>
          ))
        )}
      </div>
      <Link
<<<<<<< HEAD
        href="/brand/calendar"
        className="flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
=======
        href={ROUTES.brand.calendar}
        className="text-accent-primary hover:text-accent-primary flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
      >
        Календарь <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
