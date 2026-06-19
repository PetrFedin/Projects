'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { CommunicationsNavBar } from '@/components/brand/communications/CommunicationsNavBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Workshop2SampleGanttChart } from '@/components/brand/production/workshop2-sample-gantt-chart';
import { Workshop2AssortmentRiskChip } from '@/components/brand/production/workshop2-assortment-risk-chip';
import { buildWorkshop2CollectionTnaBoard } from '@/lib/production/workshop2-collection-tna-board';
import type { Workshop2BrandCalendarSyncEvent } from '@/lib/production/workshop2-brand-calendar-sync';
import { mergeWorkshop2B2bEventsIntoBrandCalendar } from '@/lib/production/workshop2-b2b-wave22-parity';
import type { Workshop2B2bCalendarEvent } from '@/lib/production/workshop2-b2b-campaign-hub';

export default function BrandCollectionTnaBoardPage() {
  const params = useParams<{ collectionId: string }>();
  const collectionId = decodeURIComponent(params.collectionId ?? '');
  const [events, setEvents] = useState<Workshop2BrandCalendarSyncEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([
      fetch(`/api/brand/calendar/w2-events?collectionId=${encodeURIComponent(collectionId)}`),
      fetch(`/api/brand/calendar/b2b-events?collectionId=${encodeURIComponent(collectionId)}`),
    ])
      .then(async ([w2Res, b2bRes]) => {
        const w2Data = w2Res.ok
          ? ((await w2Res.json()) as { w2Events?: Workshop2BrandCalendarSyncEvent[] })
          : null;
        const b2bData = b2bRes.ok
          ? ((await b2bRes.json()) as { events?: Workshop2B2bCalendarEvent[] })
          : null;
        const w2Events = (w2Data?.w2Events ?? []) as Workshop2BrandCalendarSyncEvent[];
        const b2bEvents = (b2bData?.events ?? []) as Workshop2B2bCalendarEvent[];
        setEvents(mergeWorkshop2B2bEventsIntoBrandCalendar({ w2Events, b2bEvents }));
      })
      .finally(() => setLoading(false));
  }, [collectionId]);

  const board = useMemo(
    () => buildWorkshop2CollectionTnaBoard({ collectionId, events }),
    [collectionId, events]
  );

  const icalHref = `/api/brand/calendar/w2-events.ics?collectionId=${encodeURIComponent(collectionId)}`;

  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-4 pb-16">
      <CommunicationsNavBar currentPath="/brand/calendar" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
            <span>TNA board · {collectionId}</span>
            <Workshop2AssortmentRiskChip collectionId={collectionId} />
          </h1>
          <p className="text-text-muted text-sm">
            Gantt по артикулам коллекции · critical path dependsOn из calendar sync
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/brand/calendar">← Календарь</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={icalHref}>Подписаться (iCal)</a>
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Загрузка TNA…</p>
      ) : board.articles.length === 0 ? (
        <p className="text-text-secondary text-sm">
          Нет синхронизированных событий — выполните calendar sync на артикулах коллекции.
        </p>
      ) : (
        <div className="space-y-8">
          {board.articles.map((row) => (
            <section
              key={row.articleId}
              className="border-border-subtle bg-bg-surface rounded-lg border p-4"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">{row.articleId}</h2>
                {row.blockerCount > 0 ? (
                  <Badge variant="destructive">{row.blockerCount} gate blockers</Badge>
                ) : (
                  <Badge variant="outline">on track</Badge>
                )}
                <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
                  <Link
                    href={`/brand/production/workshop2/${encodeURIComponent(collectionId)}/${encodeURIComponent(row.articleId)}?w2pane=plan`}
                  >
                    Открыть артикул
                  </Link>
                </Button>
              </div>
              <Workshop2SampleGanttChart phases={row.phases} />
              {row.criticalPathEventIds.length > 0 ? (
                <p className="text-text-muted mt-2 text-[11px]">
                  Critical path: {row.criticalPathEventIds.join(' → ')}
                </p>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </CabinetPageContent>
  );
}
