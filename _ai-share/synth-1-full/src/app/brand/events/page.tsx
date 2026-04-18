'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import {
  ALL_CALENDAR_EVENTS,
  getUpcomingDeadlines,
  buildCalendarUrl,
} from '@/lib/data/calendar-events';
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
<<<<<<< HEAD
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="События"
        description="Мероприятия, показы, дедлайны. Полный календарь со всеми слоями — в разделе Календарь."
        icon={Calendar}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={
          <>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="События"
        leadPlain="Мероприятия, показы, дедлайны. Полный календарь со всеми слоями — в разделе Календарь."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Calendar className="size-6 shrink-0 text-muted-foreground" aria-hidden />
>>>>>>> recover/cabinet-wip-from-stash
            <Badge variant="outline" className="text-[9px]">
              Мероприятия
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={buildCalendarUrl({ layers: 'events' })}>Открыть календарь</Link>
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link href={buildCalendarUrl({ layers: 'events' })}>
                <Calendar className="h-4 w-4" /> Календарь
              </Link>
            </Button>
          </div>
        }
      />
<<<<<<< HEAD
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
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
=======
>>>>>>> recover/cabinet-wip-from-stash

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border-subtle rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              Ближайшие мероприятия
              <Badge variant="secondary" className="text-[10px]">
                {eventOnly.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eventOnly.length === 0 ? (
<<<<<<< HEAD
              <p className="py-4 text-sm text-slate-500">Нет событий в текущем периоде.</p>
=======
              <p className="text-text-secondary py-4 text-sm">Нет событий в текущем периоде.</p>
>>>>>>> recover/cabinet-wip-from-stash
            ) : (
              eventOnly.map((ev, i) => {
                const date = new Date(YEAR, MONTH, ev.d);
                return (
                  <Link
                    key={`${ev.d}-${ev.t}-${i}`}
                    href={
                      ev.href ??
                      buildCalendarUrl({ layers: 'events', date: format(date, 'yyyy-MM-dd') })
                    }
                    className={cn(
<<<<<<< HEAD
                      'flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-indigo-200',
=======
                      'hover:border-accent-primary/30 flex items-center gap-3 rounded-xl border p-3 transition-colors',
>>>>>>> recover/cabinet-wip-from-stash
                      ev.c,
                      'border-transparent'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{ev.t}</p>
<<<<<<< HEAD
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
=======
                      <div className="text-text-secondary mt-0.5 flex items-center gap-2 text-[11px]">
>>>>>>> recover/cabinet-wip-from-stash
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

        <Card className="border-border-subtle rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Дедлайны (слой «Мероприятия»)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 ? (
<<<<<<< HEAD
              <p className="py-4 text-sm text-slate-500">Нет предстоящих дедлайнов.</p>
=======
              <p className="text-text-secondary py-4 text-sm">Нет предстоящих дедлайнов.</p>
>>>>>>> recover/cabinet-wip-from-stash
            ) : (
              upcoming.slice(0, 10).map((d, i) => (
                <Link
                  key={`${d.d}-${d.t}-${i}`}
                  href={d.calendarHref ?? buildCalendarUrl({ layers: 'events' })}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-2.5 text-sm transition-colors hover:opacity-90',
                    d.color
                  )}
                >
                  <span className="truncate font-medium">{d.t}</span>
                  <span className="ml-2 shrink-0 text-[11px]">{d.d}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <RelatedModulesBlock
        links={[
          { label: 'Календарь', href: buildCalendarUrl({ layers: 'events' }) },
          { label: 'Виртуальные выставки', href: ROUTES.brand.tradeShows },
          { label: 'Задачи', href: '/brand/tasks' },
          { label: 'Production', href: ROUTES.brand.production },
        ]}
      />
    </RegistryPageShell>
  );
}
