'use client';

import Link from 'next/link';
import { Calendar, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDefaultUpcomingDeadlines, buildCalendarUrl } from '@/lib/data/calendar-events';

export function CommunicationsUpcomingStrip({ limit = 5 }: { limit?: number }) {
  const items = getDefaultUpcomingDeadlines({ limit });
  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
      <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        <Calendar className="h-3.5 w-3.5" />
        Следующие:
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {items.length === 0 ? (
          <Link
            href={buildCalendarUrl({ add: true })}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-600"
          >
            <Plus className="h-3 w-3" /> Добавить событие
          </Link>
        ) : (
          items.map((d, i) => (
            <Link
              key={`${d.t}-${d.d}-${i}`}
              href={d.calendarHref || '/brand/calendar'}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight transition-all',
                d.isOverdue
                  ? 'border-rose-200 hover:border-rose-300 hover:bg-rose-50/50'
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30'
              )}
            >
              <span className={cn('rounded px-1.5 py-0.5 text-[8px]', d.color)}>{d.d}</span>
              <span className="max-w-[140px] truncate text-slate-800">{d.t}</span>
              {d.isOverdue && <span className="text-[7px] text-rose-500">!</span>}
            </Link>
          ))
        )}
      </div>
      <Link
        href="/brand/calendar"
        className="flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
      >
        Календарь <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
