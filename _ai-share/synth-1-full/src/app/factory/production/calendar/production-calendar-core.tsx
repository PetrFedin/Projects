'use client';

import { useSearchParams } from 'next/navigation';
import StyleCalendar from '@/components/user/style-calendar';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';
import { PlatformCoreCommsWorkspaceExtras } from '@/components/platform/PlatformCoreCommsWorkspaceExtras';
import { PlatformCoreFactoryCalendarOrderContextStrip } from '@/components/platform/PlatformCoreFactoryCalendarOrderContextStrip';
import { getPlatformCoreDemo, resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';
import { usePlatformCoreCalendarEvents } from '@/hooks/use-platform-core-calendar-events';
import { usePlatformCoreCalendarTaskCreateEnabled } from '@/hooks/use-platform-core-calendar-task-create-enabled';
import { ManufacturerCalendarGanttBridgeStrip } from '@/components/factory/manufacturer/ManufacturerCalendarGanttBridgeStrip';

export function FactoryProductionCalendarCorePage() {
  const searchParams = useSearchParams();
  const activeRole = (searchParams.get('role') as 'manufacturer' | 'supplier') || 'manufacturer';
  const highlightRole = activeRole === 'supplier' ? 'supplier' : 'manufacturer';
  const collectionId = resolvePageCollectionId({
    collection: searchParams.get('collection'),
    w2col: searchParams.get('w2col'),
  });
  const orderId =
    searchParams.get('orderId')?.trim() || searchParams.get('order')?.trim() || undefined;
  const { events, loading, error, refetch } = usePlatformCoreCalendarEvents({
    collectionId,
    orderId,
    ownerRole: highlightRole,
    enabled: true,
  });
  const demo = getPlatformCoreDemo(collectionId);
  const calendarTaskCreateEnabled = usePlatformCoreCalendarTaskCreateEnabled(true);

  return (
    <div className="space-y-4 p-4">
      <PlatformCoreListChrome highlightRole={highlightRole} pillarId="comms">
        <PlatformCoreCommsWorkspaceExtras variant={highlightRole} />
        {orderId ? (
          <PlatformCoreFactoryCalendarOrderContextStrip orderId={orderId} role="manufacturer" />
        ) : null}
        {!loading && !error && events.length > 0 ? (
          <p
            className="text-muted-foreground mb-2 text-[11px]"
            data-testid="mfr-cm-calendar-events-badge"
            data-count={events.length}
          >
            B2B-события: {events.length}
          </p>
        ) : null}
        <ManufacturerCalendarGanttBridgeStrip collectionId={collectionId} orderId={orderId} />
        {loading ? <p className="text-text-secondary text-sm">Загрузка событий календаря…</p> : null}
        {error ? <p className="text-sm text-amber-800">{error}</p> : null}
        {!calendarTaskCreateEnabled ? (
          <p
            className="text-text-muted mb-1 text-[10px]"
            data-testid="mfr-cm-calendar-pg-required-hint"
          >
            Слоты задач — после core:bootstrap
          </p>
        ) : null}
        <StyleCalendar
          initialRole={activeRole}
          externalEvents={events}
          externalEventsOnly
          contextSearchSeed={orderId}
          platformCoreTaskContext={{
            collectionId,
            orderId,
            articleId: orderId ? undefined : demo.demoArticleId,
          }}
          onPlatformCoreTaskCreated={() => refetch()}
          platformCoreTaskCreateEnabled={calendarTaskCreateEnabled}
          calendarSearchTestId="mfr-cm-calendar-search"
        />
      </PlatformCoreListChrome>
    </div>
  );
}
