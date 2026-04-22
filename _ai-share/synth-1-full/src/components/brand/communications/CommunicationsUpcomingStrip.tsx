'use client';

import Link from 'next/link';
import { Calendar, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDefaultUpcomingDeadlines, buildCalendarUrl } from '@/lib/data/calendar-events';
import { ROUTES } from '@/lib/routes';

export function CommunicationsUpcomingStrip({ limit = 5 }: { limit?: number }) {
  const items = getDefaultUpcomingDeadlines({ limit });
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl overflow-x-auto">
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 shrink-0 flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        Следующие:
      </span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {items.length === 0 ? (
          <Link
            href={buildCalendarUrl({ add: true })}
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-[10px] font-bold uppercase tracking-tight text-slate-500 hover:text-indigo-600"
          >
            <Plus className="h-3 w-3" /> Добавить событие
          </Link>
        ) : items.map((d, i) => (
          <Link
            key={`${d.t}-${d.d}-${i}`}
            href={d.calendarHref || ROUTES.brand.calendar}
            className={cn(
              "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white transition-all text-[10px] font-bold uppercase tracking-tight",
              d.isOverdue ? "border-rose-200 hover:border-rose-300 hover:bg-rose-50/50" : "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30"
            )}
          >
            <span className={cn("px-1.5 py-0.5 rounded text-[8px]", d.color)}>{d.d}</span>
            <span className="text-slate-800 truncate max-w-[140px]">{d.t}</span>
            {d.isOverdue && <span className="text-rose-500 text-[7px]">!</span>}
          </Link>
        ))}
      </div>
      <Link
        href={ROUTES.brand.calendar}
        className="shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
      >
        Календарь <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
