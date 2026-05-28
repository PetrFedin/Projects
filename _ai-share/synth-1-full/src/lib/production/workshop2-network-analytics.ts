/**
 * Wave 5 P1 #6: network analytics aggregate from domain events + calendar.
 */
import type { Workshop2BrandCalendarSyncEvent } from '@/lib/production/workshop2-brand-calendar-sync';
import type { Workshop2DomainEventEnvelope } from '@/lib/production/workshop2-domain-event-types';

export type Workshop2NetworkAnalyticsSnapshot = {
  generatedAt: string;
  articlesBlocked: number;
  samplesInTransit: number;
  showroomPublishedCount: number;
  mesQcDefectCount: number;
  calendarBlockerCount: number;
  hintRu: string;
};

export function aggregateWorkshop2NetworkAnalytics(input: {
  domainEvents: Workshop2DomainEventEnvelope[];
  calendarEvents: Workshop2BrandCalendarSyncEvent[];
}): Workshop2NetworkAnalyticsSnapshot {
  const blockedArticles = new Set<string>();
  const transitSamples = new Set<string>();
  let showroomPublishedCount = 0;
  let mesQcDefectCount = 0;

  for (const evt of input.domainEvents) {
    const key = `${evt.collectionId}:${evt.articleId}`;
    if (evt.type === 'dossier.gate_blocked') {
      blockedArticles.add(key);
    }
    if (evt.type === 'sample_order.status_changed') {
      const status = String(evt.payload.status ?? '').toLowerCase();
      if (status.includes('transit') || status.includes('ship') || status === 'in_production') {
        transitSamples.add(String(evt.payload.orderId ?? key));
      }
    }
    if (evt.type === 'showroom.published') {
      showroomPublishedCount += 1;
    }
    if (evt.type === 'qc.mes_defect.ingested') {
      mesQcDefectCount += 1;
    }
  }

  const calendarBlockerCount = input.calendarEvents.filter((e) => e.isBlocker).length;

  return {
    generatedAt: new Date().toISOString(),
    articlesBlocked: blockedArticles.size,
    samplesInTransit: transitSamples.size,
    showroomPublishedCount,
    mesQcDefectCount,
    calendarBlockerCount,
    hintRu: `Сеть: ${blockedArticles.size} blocked · ${transitSamples.size} образцов в пути · ${showroomPublishedCount} showroom publish · ${calendarBlockerCount} calendar blockers.`,
  };
}
