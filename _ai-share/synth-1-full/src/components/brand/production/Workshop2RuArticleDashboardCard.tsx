'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2RuArticleDashboardCard } from '@/lib/production/workshop2-ru-workspace-dashboard';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';

type Props = {
  collectionId: string;
  articleUrlSegment: string;
  dossier: Workshop2DossierPhase1 | null;
  market?: 'ru' | 'global';
  unreadChatCount?: number;
};

/** Wave 10: сводка по артикулу без «Открыть панель» — данные подгружаются из досье. */
export function Workshop2RuArticleDashboardCard({
  collectionId,
  articleUrlSegment,
  dossier,
  market = 'ru',
  unreadChatCount = 0,
}: Props) {
  const card = useMemo(() => {
    if (!dossier || market !== 'ru') return null;
    return buildWorkshop2RuArticleDashboardCard({ dossier, unreadChatCount });
  }, [dossier, market, unreadChatCount]);

  if (!card) return null;

  return (
    <div
      className="border-border-subtle grid gap-2 rounded-lg border bg-white/95 p-3 text-xs shadow-sm sm:grid-cols-2 lg:grid-cols-3"
      data-testid="workshop2-ru-article-dashboard"
      title="Сводка РФ — gates, ₽, T&A, чат, маркировка, ЭДО"
    >
      <div>
        <p className="text-text-muted font-semibold uppercase tracking-wide">Сводка РФ</p>
        <p className="mt-1 text-slate-800">{card.gatesSummaryRu}</p>
        {card.costRollupRub ? (
          <p className="text-emerald-800">Себестоимость: {card.costRollupRub}</p>
        ) : null}
      </div>
      <div>
        <p className="text-text-muted font-medium">T&amp;A</p>
        <p>{card.taNextMilestoneRu ?? '—'}</p>
        <p className="text-text-muted mt-1">
          Чат: {card.unreadChatCount > 0 ? `${card.unreadChatCount} непрочит.` : 'нет новых'}
        </p>
      </div>
      <div className="space-y-1">
        <p>
          <span className="text-text-muted">Маркировка:</span> {card.markingStatusRu}
        </p>
        <p>
          <span className="text-text-muted">ЭДО:</span> {card.edoStatusRu}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={workshop2ArticleHref(collectionId, articleUrlSegment, { w2pane: 'tz' })}
            className="text-accent-primary hover:underline"
          >
            ТЗ
          </Link>
          <Link
            href={workshop2ArticleHref(collectionId, articleUrlSegment, { w2pane: 'plan' })}
            className="text-accent-primary hover:underline"
          >
            План
          </Link>
          <Link
            href={workshop2ArticleHref(collectionId, articleUrlSegment, { w2pane: 'release' })}
            className="text-accent-primary hover:underline"
          >
            Выпуск
          </Link>
        </div>
      </div>
    </div>
  );
}
