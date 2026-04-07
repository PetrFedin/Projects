'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { ALL_CALENDAR_EVENTS, getUpcomingDeadlines, buildCalendarUrl } from '@/lib/data/calendar-events';
import type { CalendarEvent } from '@/lib/data/calendar-events';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const YEAR = 2026;
const MONTH = 0; // January

export default function BrandEventsPage() {
  const eventOnly = useMemo(
    () => ALL_CALENDAR_EVENTS.filter((e): e is CalendarEvent => e.source === 'events'),
    []
  );
  const upcoming = useMemo(
    () => getUpcomingDeadlines(ALL_CALENDAR_EVENTS, YEAR, MONTH, { limit: 15, layer: 'events' }),
    []
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl pb-24">
      <SectionInfoCard
        title="События"
        description="Мероприятия, показы, дедлайны. Полный календарь со всеми слоями — в разделе Календарь."
        icon={Calendar}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">Мероприятия</Badge>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href={buildCalendarUrl({ layers: 'events' })}>Открыть календарь</Link>
            </Button>
          </>
        }
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase">События</h1>
          <p className="text-sm text-slate-500">Мероприятия, показы, дедлайны</p>
        </div>
        <Button size="sm" className="gap-2" asChild>
          <Link href={buildCalendarUrl({ layers: 'events' })}>
            <Calendar className="h-4 w-4" /> Календарь
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Ближайшие мероприятия
              <Badge variant="secondary" className="text-[10px]">{eventOnly.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eventOnly.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">Нет событий в текущем периоде.</p>
            ) : (
              eventOnly.map((ev, i) => {
                const date = new Date(YEAR, MONTH, ev.d);
                return (
                  <Link
                    key={`${ev.d}-${ev.t}-${i}`}
                    href={ev.href ?? buildCalendarUrl({ layers: 'events', date: format(date, 'yyyy-MM-dd') })}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border transition-colors hover:border-indigo-200',
                      ev.c,
                      'border-transparent'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{ev.t}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{format(date, 'd MMMM yyyy', { locale: ru })}</span>
                        {ev.location && (
                          <>
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{ev.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Дедлайны (слой «Мероприятия»)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">Нет предстоящих дедлайнов.</p>
            ) : (
              upcoming.slice(0, 10).map((d, i) => (
                <Link
                  key={`${d.d}-${d.t}-${i}`}
                  href={d.calendarHref ?? buildCalendarUrl({ layers: 'events' })}
                  className={cn(
                    'flex items-center justify-between p-2.5 rounded-lg border text-sm transition-colors hover:opacity-90',
                    d.color
                  )}
                >
                  <span className="font-medium truncate">{d.t}</span>
                  <span className="text-[11px] shrink-0 ml-2">{d.d}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <RelatedModulesBlock
        links={[
          { label: 'Календарь', href: buildCalendarUrl({ layers: 'events' }), entityType: 'event' },
          { label: 'Виртуальные выставки', href: ROUTES.brand.tradeShows, entityType: 'event' },
          { label: 'Задачи', href: '/brand/tasks', entityType: 'task' },
          { label: 'Production', href: ROUTES.brand.production, entityType: 'production' },
        ]}
      />
    </div>
  );
}
