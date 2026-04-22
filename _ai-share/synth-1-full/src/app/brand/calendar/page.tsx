'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { getAllCalendarEvents } from '@/lib/live-process/calendar-sync';
import { getCalendarEvents } from '@/lib/collaboration/calendar-store';
import type { CalendarEvent } from '@/lib/types/calendar';
import StyleCalendar from '@/components/user/style-calendar';
import { CommunicationsNavBar } from '@/components/brand/communications/CommunicationsNavBar';
import { ROUTES } from '@/lib/routes';
import { CommunicationsUpcomingStrip } from '@/components/brand/communications/CommunicationsUpcomingStrip';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Calendar } from 'lucide-react';
import { demoCalendarEventsForProductionStage } from '@/lib/production/stages-comm-demo';

/** Преобразовать LIVE process события в CalendarEvent */
function mapLiveToCalendarEvent(e: { id: string; processId: string; contextId: string; stageId: string; title: string; startAt: string; endAt: string }): CalendarEvent {
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
  const searchParams = useSearchParams() ?? new URLSearchParams();
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
    <div className="container max-w-6xl mx-auto px-4 py-6 pb-24 space-y-6">
      <SectionInfoCard
        title="Календарь"
        description="Задачи, дедлайны и встречи. Участников и напоминания задаёте в карточке события."
        icon={Calendar}
        iconBg="bg-slate-100"
        iconColor="text-slate-700"
      />
      <StyleCalendar
        initialRole="brand"
        variant="full"
        externalEvents={externalEvents}
        contextSearchSeed={contextSearchSeed || undefined}
        calendarLayers={searchParams.get('layers')}
        calendarDate={searchParams.get('date')}
        calendarPartner={searchParams.get('partner')}
        calendarRole={searchParams.get('role')}
        calendarAdd={searchParams.get('add')}
      />
    </div>
  );
}

export default function BrandCalendarPage() {
  return (
    <div className="space-y-4" data-syntha-calendar="comm-hub-v2">
      {process.env.NODE_ENV === 'development' && (
        <div className="mx-4 rounded-lg border border-dashed border-emerald-400 bg-emerald-50 px-3 py-2 text-center text-[11px] text-emerald-950 leading-snug">
          <strong className="font-semibold">Проверка сборки:</strong> вы на обновлённом календаре (comm-hub-v2). Если этого зелёного блока нет — не тот каталог репозитория или не перезапущен{' '}
          <code className="rounded bg-white/80 px-1">npm run dev</code> из <code className="rounded bg-white/80 px-1">_ai-share/synth-1-full</code>.
        </div>
      )}
      <div className="sticky top-0 z-30 space-y-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-slate-50/75">
        <CommunicationsNavBar currentPath={ROUTES.brand.calendar} />
        <CommunicationsUpcomingStrip />
      </div>
      <Suspense fallback={<div className="container max-w-6xl mx-auto px-4 py-10 text-sm text-slate-500">Загрузка календаря…</div>}>
        <BrandCalendarMain />
      </Suspense>
    </div>
  );
}
