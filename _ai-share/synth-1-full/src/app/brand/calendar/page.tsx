'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { getAllCalendarEvents } from '@/lib/live-process/calendar-sync';
import { getCalendarEvents } from '@/lib/collaboration/calendar-store';
import type { CalendarEvent } from '@/lib/types/calendar';
import StyleCalendar from '@/components/user/style-calendar';
import { CollaborationCalendarSection } from '@/components/collaboration/CollaborationCalendarSection';
import { CommunicationsNavBar } from '@/components/brand/communications/CommunicationsNavBar';
import { CommunicationsUpcomingStrip } from '@/components/brand/communications/CommunicationsUpcomingStrip';
import { demoCalendarEventsForProductionStage } from '@/lib/production/stages-comm-demo';

/** Преобразовать LIVE process события в CalendarEvent */
function mapLiveToCalendarEvent(e: {
  id: string;
  processId: string;
  contextId: string;
  stageId: string;
  title: string;
  startAt: string;
  endAt: string;
}): CalendarEvent {
  return {
    id: e.id,
    ownerId: 'live',
    ownerRole: 'brand',
    ownerName: 'LIVE process',
    calendarId: 'live',
    title: e.title,
    description: `${e.processId} · ${e.contextId}`,
    layer: 'production',
    visibility: 'internal',
    type: 'event',
    startAt: e.startAt,
    endAt: e.endAt,
    participants: [],
    importance: 'high',
  };
}

function BrandCalendarMain() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [liveEvents, setLiveEvents] = useState<ReturnType<typeof getAllCalendarEvents>>([]);
  const [collabEvents, setCollabEvents] = useState<CalendarEvent[]>([]);

  /** Без stagesStep в строке поиска — слоты матрицы содержат sku/сезон/заказ/этап в описании */
  const contextSearchSeed = useMemo(() => {
    const parts = [
      searchParams.get('q')?.trim(),
      searchParams.get('sku')?.trim(),
      searchParams.get('season')?.trim(),
      searchParams.get('order')?.trim(),
    ].filter(Boolean) as string[];
    return parts.join(' ');
  }, [searchParams]);

  useEffect(() => {
    setLiveEvents(getAllCalendarEvents());
  }, []);

  useEffect(() => {
    const uid = user?.uid ?? 'guest';
    setCollabEvents(getCalendarEvents(uid));
  }, [user?.uid]);

  const stageDemoCalendar = useMemo(() => {
    const step = searchParams.get('stagesStep')?.trim();
    if (!step) return [] as CalendarEvent[];
    return demoCalendarEventsForProductionStage(step, {
      sku: searchParams.get('sku'),
      season: searchParams.get('season'),
      order: searchParams.get('order'),
    });
  }, [searchParams]);

  const externalEvents = useMemo(() => {
    const mapped = liveEvents.map(mapLiveToCalendarEvent);
    return [...stageDemoCalendar, ...mapped, ...collabEvents];
  }, [liveEvents, collabEvents, stageDemoCalendar]);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <StyleCalendar
        initialRole="brand"
        variant="full"
        externalEvents={externalEvents}
        contextSearchSeed={contextSearchSeed || undefined}
      />
      <CollaborationCalendarSection />
    </div>
  );
}

export default function BrandCalendarPage() {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-30 space-y-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-slate-50/75">
        <CommunicationsNavBar currentPath="/brand/calendar" />
        <CommunicationsUpcomingStrip />
      </div>
      <Suspense
        fallback={
          <div className="container mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
            Загрузка календаря…
          </div>
        }
      >
        <BrandCalendarMain />
      </Suspense>
    </div>
  );
}
