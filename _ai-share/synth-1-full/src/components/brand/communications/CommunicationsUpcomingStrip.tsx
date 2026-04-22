'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildCalendarUrl, getTodayCommunicationsStripItems } from '@/lib/data/calendar-events';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/providers/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function CommunicationsUpcomingStrip({ limit = 8 }: { limit?: number }) {
  const { user } = useAuth();
  const uid = user?.uid ?? 'guest';
  const [open, setOpen] = useState(false);
  const items = useMemo(() => getTodayCommunicationsStripItems(uid, { limit }), [uid, limit]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl overflow-x-auto text-left hover:border-slate-200 transition-colors"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 shrink-0 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          События на сегодня
        </span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {items.length === 0 ? (
            <span className="text-[10px] text-slate-500">Нет событий на сегодня</span>
          ) : (
            items.map((d, i) => (
              <span
                key={`${d.id}-${i}`}
                className={cn(
                  'shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white text-[10px] font-semibold border-slate-100',
                  d.color
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-100 text-slate-700 tabular-nums">{d.d}</span>
                <span className="text-slate-800 truncate max-w-[160px]">{d.t}</span>
              </span>
            ))
          )}
        </div>
        <span className="shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-indigo-600">
          Подробнее <ChevronRight className="h-3 w-3" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>События на сегодня</DialogTitle>
          </DialogHeader>
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto py-2">
            {items.length === 0 ? (
              <li className="text-sm text-muted-foreground">Нет записей на сегодня.</li>
            ) : (
              items.map((d) => (
                <li key={d.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <div className="font-semibold text-slate-900">{d.t}</div>
                  <div className="text-xs text-muted-foreground mt-1 tabular-nums">
                    {d.startAt && d.endAt
                      ? `${new Date(d.startAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} — ${new Date(d.endAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
                      : `Время: ${d.d}`}
                  </div>
                  {d.reminderMinutes != null && d.reminderMinutes > 0 && (
                    <div className="text-[11px] text-indigo-700 mt-1">Напоминание за {d.reminderMinutes} мин до начала</div>
                  )}
                  {d.description ? (
                    <p className="text-xs text-slate-600 mt-2 leading-snug">{d.description}</p>
                  ) : null}
                  {d.calendarHref ? (
                    <Button variant="outline" size="sm" className="mt-2 h-8 text-xs" asChild>
                      <Link href={d.calendarHref}>Открыть в календаре</Link>
                    </Button>
                  ) : null}
                </li>
              ))
            )}
          </ul>
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button size="sm" asChild>
              <Link href={buildCalendarUrl({ add: true })} onClick={() => setOpen(false)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Добавить событие
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={ROUTES.brand.calendar} onClick={() => setOpen(false)}>
                Календарь
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
