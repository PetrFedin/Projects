'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

import { useSearchParamsNonNull } from '@/hooks/use-search-params-non-null';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getAllCalendarEvents } from '@/lib/live-process/calendar-sync';
import { getCalendarEvents } from '@/lib/collaboration/calendar-store';
import type { CalendarEvent } from '@/lib/types/calendar';
import StyleCalendar from '@/components/user/style-calendar';
import { CollaborationCalendarSection } from '@/components/collaboration/CollaborationCalendarSection';
import { CommunicationsNavBar } from '@/components/brand/communications/CommunicationsNavBar';
import { CommunicationsOperationalStrip } from '@/components/brand/communications/CommunicationsOperationalStrip';
import { CommunicationsUpcomingStrip } from '@/components/brand/communications/CommunicationsUpcomingStrip';
import { demoCalendarEventsForProductionStage } from '@/lib/production/stages-comm-demo';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getCommLinks } from '@/lib/data/entity-links';
import { CommunicationsEntityContextBanner } from '@/components/brand/communications/CommunicationsEntityContextBanner';

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
  const searchParams = useSearchParamsNonNull();
  const [liveEvents, setLiveEvents] = useState<ReturnType<typeof getAllCalendarEvents>>([]);
  const [collabEvents, setCollabEvents] = useState<CalendarEvent[]>([]);

  /** Без stagesStep в строке поиска — слоты матрицы содержат sku/сезон/заказ/этап в описании */
  const contextSearchSeed = useMemo(() => {
    const parts = [
      searchParams.get('q')?.trim(),
      searchParams.get('sku')?.trim(),
      searchParams.get('season')?.trim(),
      searchParams.get('order')?.trim(),
      searchParams.get('orderId')?.trim(),
      searchParams.get('stagesStep')?.trim(),
      searchParams.get('collectionId')?.trim(),
      searchParams.get('po')?.trim(),
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
    <CabinetPageContent maxWidth="full" className="w-full space-y-6 pb-16">
      <StyleCalendar
        initialRole="brand"
        variant="full"
        externalEvents={externalEvents}
        contextSearchSeed={contextSearchSeed || undefined}
      />
      <CollaborationCalendarSection />
      <RelatedModulesBlock
        title="Связанные операции"
        links={getCommLinks()}
        className="mt-2"
      />
    </CabinetPageContent>
  );
}

export default function BrandCalendarPage() {
  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-4 pb-16">
      <div className="border-border-subtle bg-bg-surface2/90 supports-[backdrop-filter]:bg-bg-surface2/75 sticky top-0 z-30 -mx-4 space-y-2 border-b px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <CommunicationsNavBar currentPath="/brand/calendar" />
        <CommunicationsUpcomingStrip />
        <CommunicationsOperationalStrip variant="brand" className="-mx-1 mt-1" />
        <Suspense fallback={null}>
          <CommunicationsEntityContextBanner variant="brand" className="-mx-1 mt-2 rounded-lg" />
        </Suspense>
      </div>
      <Suspense
        fallback={<div className="text-text-secondary py-10 text-sm">Загрузка календаря…</div>}
      >
        <BrandCalendarMain />
      </Suspense>
    </CabinetPageContent>
  );
}
