'use client';

import Link from 'next/link';
import { CalendarClock, Download, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { TimeAndActionSnapshot } from '@/lib/production/article-workspace/types';
import { buildWorkshop2TaPlanFactSummary } from '@/lib/production/workshop2-ta-plan-fact';
import { cn } from '@/lib/utils';
import { workshop2ArticleHref, W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';

type Props = {
  dossier: Workshop2DossierPhase1 | null;
  bundleTa?: TimeAndActionSnapshot | null;
  collectionId: string;
  articleUrlSegment: string;
  /** Plan-fact SASH из release operations (опционально). */
  operationsProgressPct?: number;
  routingVariancePct?: number | null;
};

/** Read-only timeline T&A milestones + plan-fact chips (M8). */
export function Workshop2ReleaseTimelinePanel({
  dossier,
  bundleTa,
  collectionId,
  articleUrlSegment,
  operationsProgressPct,
  routingVariancePct,
}: Props) {
  const planFact = buildWorkshop2TaPlanFactSummary({ dossier, bundleTa });

  const planHref = workshop2ArticleHref(collectionId, articleUrlSegment, {
    w2pane: 'plan',
    hash: W2_ARTICLE_SECTION_DOM.planPo,
  });

  return (
    <div
      className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
      data-testid="workshop2-release-timeline-panel"
    >
      <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
        <CalendarClock className="h-4 w-4 text-indigo-500" />
        Timeline · T&amp;A · Plan-fact
      </p>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="text-[9px]">
          {planFact.source === 'dossier' ? 'досье' : planFact.source === 'bundle' ? 'bundle' : 'пусто'}
        </Badge>
        {planFact.overdueCount > 0 ? (
          <Badge className="bg-rose-100 text-rose-900 text-[9px] hover:bg-rose-100">
            просрочено {planFact.overdueCount}
          </Badge>
        ) : null}
        {planFact.delayedCount > 0 ? (
          <Badge className="bg-amber-100 text-amber-900 text-[9px] hover:bg-amber-100">
            задержка {planFact.delayedCount}
          </Badge>
        ) : null}
        {typeof operationsProgressPct === 'number' ? (
          <Badge variant="secondary" className="text-[9px]">
            ops {operationsProgressPct}%
          </Badge>
        ) : null}
        {routingVariancePct != null ? (
          <Badge
            variant="outline"
            className={cn(
              'text-[9px]',
              Math.abs(routingVariancePct) > 15 && 'border-amber-400 text-amber-900'
            )}
          >
            маршрут Δ {routingVariancePct > 0 ? '+' : ''}
            {routingVariancePct}%
          </Badge>
        ) : null}
      </div>

      <p className="text-text-secondary text-[10px]">{planFact.planFactLabelRu}</p>

      {planFact.rows.length === 0 ? (
        <p className="text-text-muted text-sm">Вех T&amp;A не заданы — добавьте на вкладке «План».</p>
      ) : (
        <ol className="max-h-52 space-y-1.5 overflow-y-auto text-[11px]">
          {planFact.rows.slice(0, 14).map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 px-2 py-1"
            >
              <span className="font-medium min-w-0 flex-1 truncate">{m.title}</span>
              <span className="text-text-muted flex flex-wrap items-center gap-1.5 shrink-0">
                {m.targetDate ? <span>план {m.targetDate}</span> : null}
                {m.actualDate ? (
                  <span className="text-emerald-700">факт {m.actualDate}</span>
                ) : null}
                {m.isOverdue ? (
                  <Badge className="h-4 bg-rose-500 text-[8px] text-white hover:bg-rose-500">
                    overdue
                  </Badge>
                ) : null}
                {m.isDelayed ? (
                  <Badge className="h-4 bg-amber-500 text-[8px] text-white hover:bg-amber-500">
                    delayed
                  </Badge>
                ) : null}
                <Badge variant="outline" className="text-[8px]">
                  {m.status}
                </Badge>
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]" asChild>
          <Link href={planHref}>Редактировать T&amp;A → План</Link>
        </Button>
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]" asChild>
          <a
            href={`/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleUrlSegment)}/production-analytics?format=csv`}
            download
            data-testid="workshop2-release-timeline-export-csv"
          >
            <Download className="mr-1 h-3 w-3 inline" />
            Экспорт CSV
          </a>
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-8 text-[11px]" asChild>
          <Link
            href={`/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleUrlSegment)}/production-analytics`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TrendingUp className="mr-1 h-3 w-3 inline" />
            Analytics API
          </Link>
        </Button>
      </div>
    </div>
  );
}
