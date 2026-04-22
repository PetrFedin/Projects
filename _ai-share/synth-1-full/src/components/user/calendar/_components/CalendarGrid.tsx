import React from 'react';
import {
  addDays,
  endOfDay,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/types/calendar';
import { layerBorder, layerColor } from '../constants';
import { AlertCircle, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CalendarGridProps {
  view: string;
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCellClick: (date: Date) => void;
}

function eventsOverlappingDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const d0 = startOfDay(day);
  const d1 = endOfDay(day);
  return events
    .filter((ev) => {
      const s = new Date(ev.startAt);
      const e = new Date(ev.endAt);
      return s <= d1 && e >= d0;
    })
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

function eventCard(
  ev: CalendarEvent,
  onEventClick: (e: CalendarEvent) => void,
  compact?: boolean,
  stopPropagation?: boolean
) {
  const cancelled = ev.status === 'cancelled';
  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        onEventClick(ev);
      }}
      className={cn(
        'w-full text-left rounded-md border-l-4 px-2 py-1.5 shadow-sm transition-all hover:brightness-95 cursor-pointer',
        layerColor(ev.layer),
        layerBorder(ev.layer),
        'text-white',
        compact && 'text-[10px]',
        cancelled && 'opacity-60 line-through'
      )}
    >
      <div className="flex items-center gap-1 min-w-0">
        {ev.isMystery && <EyeOff className="h-2.5 w-2.5 shrink-0 opacity-80" />}
        {ev.importance === 'critical' && <AlertCircle className="h-2.5 w-2.5 shrink-0 text-white" />}
        <span className={cn('font-semibold truncate', compact ? 'text-[10px]' : 'text-xs')}>{ev.title}</span>
      </div>
      <div className={cn('text-white/90 tabular-nums mt-0.5', compact ? 'text-[8px]' : 'text-[9px]')}>
        {format(new Date(ev.startAt), 'HH:mm')} — {format(new Date(ev.endAt), 'HH:mm')}
      </div>
      {ev.reminderMinutesBefore != null && ev.reminderMinutesBefore > 0 && (
        <div className="text-[8px] text-white/80 mt-0.5">Напоминание за {ev.reminderMinutesBefore} мин</div>
      )}
    </div>
  );
}

export function CalendarGrid({ view, currentDate, events, onEventClick, onCellClick }: CalendarGridProps) {
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const days: React.ReactNode[] = [];
    let day = startDate;
    for (let i = 0; i < 42; i++) {
      const cloneDay = day;
      const dayEvents = eventsOverlappingDay(events, day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      days.push(
        <div
          key={day.toISOString()}
          className={cn(
            'min-h-[100px] border p-1 transition-colors hover:bg-muted/20 cursor-pointer relative',
            !isCurrentMonth && 'bg-muted/10 text-muted-foreground',
            isToday && 'bg-accent/5'
          )}
          onClick={() => onCellClick(cloneDay)}
        >
          <div className={cn('text-right text-xs p-1 font-medium', isToday && 'text-accent font-bold')}>
            {format(day, 'd')}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 4).map((ev) => (
              <div key={ev.id}>{eventCard(ev, onEventClick, true, true)}</div>
            ))}
            {dayEvents.length > 4 && (
              <div className="text-[9px] text-center text-muted-foreground font-medium">
                Ещё {dayEvents.length - 4}…
              </div>
            )}
          </div>
          {isToday && <div className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
        </div>
      );
      day = addDays(day, 1);
    }
    const gridRows = [];
    for (let i = 0; i < days.length; i += 7) {
      gridRows.push(
        <div className="grid grid-cols-7" key={i}>
          {days.slice(i, i + 7)}
        </div>
      );
    }
    return (
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <div key={d} className="p-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        {gridRows}
      </div>
    );
  };

  const renderWeekView = () => {
    const wkStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const cols = Array.from({ length: 7 }, (_, i) => addDays(wkStart, i));
    return (
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b bg-muted/40 divide-x">
          {cols.map((d) => (
            <div key={d.toISOString()} className="p-2 text-center">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                {format(d, 'EEE', { locale: ru })}
              </div>
              <div className={cn('text-sm font-semibold', isSameDay(d, new Date()) && 'text-indigo-600')}>
                {format(d, 'd MMM', { locale: ru })}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[280px] divide-x">
          {cols.map((d) => {
            const list = eventsOverlappingDay(events, d);
            return (
              <div
                key={d.toISOString()}
                className="p-1.5 space-y-1.5 min-h-[260px] hover:bg-muted/10 cursor-pointer"
                onClick={() => onCellClick(d)}
              >
                {list.map((ev) => (
                  <div key={ev.id}>{eventCard(ev, onEventClick, true, true)}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const list = eventsOverlappingDay(events, currentDate);
    return (
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm p-4 space-y-3">
        <div className="text-sm font-semibold text-slate-700">
          {format(currentDate, 'EEEE, d MMMM yyyy', { locale: ru })}
        </div>
        <button
          type="button"
          className="text-xs text-indigo-600 font-medium hover:underline"
          onClick={() => onCellClick(currentDate)}
        >
          Добавить событие на этот день
        </button>
        <div className="space-y-2">
          {list.map((ev) => eventCard(ev, onEventClick))}
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground">Нет событий на выбранный день.</p>
          )}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
    return (
      <div className="space-y-2">
        {sortedEvents.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors bg-white"
            onClick={() => onEventClick(ev)}
          >
            <div className={cn('w-1 h-10 rounded-full shrink-0', layerColor(ev.layer))} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm truncate">{ev.title}</h4>
                {ev.status === 'cancelled' && (
                  <Badge variant="secondary" className="text-[9px] h-5">Отменено</Badge>
                )}
                {ev.isMystery && (
                  <Badge variant="secondary" className="text-[9px] h-5">
                    Mystery
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{ev.description}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground shrink-0">
              <div>{format(new Date(ev.startAt), 'd MMM', { locale: ru })}</div>
              <div>{format(new Date(ev.startAt), 'HH:mm')}</div>
            </div>
          </div>
        ))}
        {sortedEvents.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">Нет событий для отображения</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1">
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
      {view === 'list' && renderListView()}
    </div>
  );
}
