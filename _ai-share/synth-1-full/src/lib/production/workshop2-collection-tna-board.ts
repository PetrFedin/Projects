/**
 * Wave 2 #K3: collection TNA board — Gantt phases + critical path dependsOn from calendar events.
 */
import type { Workshop2BrandCalendarSyncEvent } from '@/lib/production/workshop2-brand-calendar-sync';
import type { GanttPhase } from '@/components/brand/production/workshop2-sample-gantt-chart';

const PHASE_COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
];

function eventStartMs(e: Workshop2BrandCalendarSyncEvent): number {
  return Date.parse(e.startAt);
}

function eventEndMs(e: Workshop2BrandCalendarSyncEvent): number {
  return Date.parse(e.endAt);
}

export type Workshop2CollectionTnaArticleRow = {
  articleId: string;
  events: Workshop2BrandCalendarSyncEvent[];
  phases: GanttPhase[];
  criticalPathEventIds: string[];
  blockerCount: number;
};

export function buildWorkshop2CollectionTnaBoard(input: {
  collectionId: string;
  events: Workshop2BrandCalendarSyncEvent[];
}): {
  collectionId: string;
  articles: Workshop2CollectionTnaArticleRow[];
  totalBlockers: number;
} {
  const cid = input.collectionId.trim();
  const byArticle = new Map<string, Workshop2BrandCalendarSyncEvent[]>();

  for (const e of input.events) {
    if (e.collectionId !== cid) continue;
    const list = byArticle.get(e.articleId) ?? [];
    list.push(e);
    byArticle.set(e.articleId, list);
  }

  const articles: Workshop2CollectionTnaArticleRow[] = [];
  let totalBlockers = 0;

  for (const [articleId, articleEvents] of byArticle) {
    const sorted = [...articleEvents].sort((a, b) => eventStartMs(a) - eventStartMs(b));
    if (!sorted.length) continue;

    const minStart = Math.min(...sorted.map(eventStartMs));
    const maxEnd = Math.max(...sorted.map(eventEndMs));
    const span = Math.max(maxEnd - minStart, 1);

    const phases: GanttPhase[] = sorted.map((e, idx) => {
      const start = eventStartMs(e);
      const end = eventEndMs(e);
      const startPercent = ((start - minStart) / span) * 100;
      const widthPercent = Math.max(((end - start) / span) * 100, 4);
      const overdue = e.isBlocker || (end < Date.now() && !e.title.includes('✓'));
      return {
        id: e.id,
        name: e.title.replace(/^⛔\s*/, ''),
        startPercent: Number(startPercent.toFixed(1)),
        widthPercent: Number(widthPercent.toFixed(1)),
        color: overdue
          ? 'bg-rose-600 ring-2 ring-rose-300'
          : PHASE_COLORS[idx % PHASE_COLORS.length]!,
        href: e.href,
      };
    });

    const blockers = sorted.filter((e) => e.isBlocker);
    totalBlockers += blockers.length;

    const criticalPathEventIds = sorted
      .filter((e) => e.isBlocker || e.sourceKind === 'ta_milestone')
      .map((e) => e.id);

    articles.push({
      articleId,
      events: sorted,
      phases,
      criticalPathEventIds,
      blockerCount: blockers.length,
    });
  }

  articles.sort((a, b) => a.articleId.localeCompare(b.articleId));

  return { collectionId: cid, articles, totalBlockers };
}
