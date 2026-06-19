'use client';

import { useCallback, useState } from 'react';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { RangePlannerTier } from '@/lib/production/workshop2-range-planner-bridge';
import {
  RANGE_PLANNER_DEMO_TIERS,
  type RangePlannerTierArticles,
} from '@/lib/production/workshop2-range-planner-pg';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { cn } from '@/lib/utils';

const TIER_SHORT: Record<RangePlannerTier, string> = {
  core: 'Базовый',
  trend: 'Тренд',
  novelty: 'Новинки',
};

export function RangePlannerTierArticleBoard({
  collectionId,
  tierArticles,
  onMoved,
}: {
  collectionId: string;
  tierArticles: RangePlannerTierArticles;
  onMoved: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOverTier, setDragOverTier] = useState<RangePlannerTier | null>(null);

  const moveArticle = useCallback(
    async (articleId: string, tier: RangePlannerTier) => {
      setBusyId(articleId);
      setError(null);
      try {
        const res = await fetch(
          `/api/workshop2/collections/${encodeURIComponent(collectionId)}/range-planner`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...buildWorkshop2ApiRequestHeaders(),
            },
            body: JSON.stringify({ articleId, tier }),
          }
        );
        const json = (await res.json()) as { ok?: boolean; messageRu?: string };
        if (!res.ok || !json.ok) {
          setError(json.messageRu ?? 'Не удалось перенести артикул');
          return;
        }
        onMoved();
      } catch {
        setError('Ошибка сети');
      } finally {
        setBusyId(null);
        setDragOverTier(null);
      }
    },
    [collectionId, onMoved]
  );

  const totalArticles = RANGE_PLANNER_DEMO_TIERS.reduce(
    (sum, row) => sum + tierArticles[row.id].length,
    0
  );
  if (totalArticles === 0) return null;

  return (
    <div
      className="border-border-default space-y-3 rounded-xl border bg-slate-50/30 p-4"
      data-testid="range-planner-tier-article-board"
    >
      <div>
        <p className="text-sm font-semibold">Состав по уровням ассортимента</p>
        <p className="text-text-secondary text-xs">
          Перетащите артикул в другую колонку или нажмите стрелку — tier сохраняется в PostgreSQL.
        </p>
      </div>
      <div
        className={cn(
          'grid gap-3 md:grid-cols-3',
          'max-md:flex max-md:gap-3 max-md:overflow-x-auto max-md:snap-x max-md:overscroll-x-contain max-md:pb-1',
          hubCabinet.workspaceTableScroll
        )}
        data-testid="range-planner-tier-columns-scroll"
      >
        {RANGE_PLANNER_DEMO_TIERS.map((row) => {
          const articles = tierArticles[row.id];
          const isDropTarget = dragOverTier === row.id;
          return (
            <div
              key={row.id}
              className={cn(
                'border-border-default min-h-[8rem] rounded-lg border bg-white p-3 transition-colors',
                isDropTarget ? 'border-accent-primary bg-accent-primary/5' : '',
                'max-md:min-w-[min(72vw,16rem)] max-md:snap-start max-md:shrink-0'
              )}
              data-testid={`range-planner-tier-column-${row.id}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setDragOverTier(row.id);
              }}
              onDragLeave={() => setDragOverTier((prev) => (prev === row.id ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                const articleId = e.dataTransfer.getData('text/article-id');
                if (articleId) void moveArticle(articleId, row.id);
              }}
            >
              <p className="text-text-secondary mb-2 text-[10px] font-bold uppercase tracking-wide">
                {TIER_SHORT[row.id]} · {articles.length}
              </p>
              {articles.length === 0 ? (
                <p className="text-text-muted text-xs">Перетащите сюда артикул</p>
              ) : (
                <ul className="space-y-2">
                  {articles.map((art) => (
                    <li
                      key={art.articleId}
                      draggable={busyId !== art.articleId}
                      data-testid={`range-planner-tier-article-${art.articleId}`}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/article-id', art.articleId);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      className="border-border-default flex cursor-grab flex-wrap items-center gap-1 rounded-md border bg-slate-50/80 px-2 py-1.5 text-xs active:cursor-grabbing"
                    >
                      <span className="min-w-0 flex-1 font-medium">
                        {art.sku ?? art.articleId}
                        {art.name ? (
                          <span className="text-text-muted ml-1 font-normal">· {art.name}</span>
                        ) : null}
                      </span>
                      {RANGE_PLANNER_DEMO_TIERS.filter((t) => t.id !== row.id).map((target) => (
                        <button
                          key={target.id}
                          type="button"
                          disabled={busyId === art.articleId}
                          data-testid={`range-planner-tier-move-${art.articleId}-${target.id}`}
                          onClick={() => void moveArticle(art.articleId, target.id)}
                          className="text-accent-primary hover:bg-accent-primary/10 rounded px-1.5 py-0.5 text-[10px] font-semibold disabled:opacity-50"
                          title={`Перенести в ${TIER_SHORT[target.id]}`}
                        >
                          → {target.id}
                        </button>
                      ))}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      {error ? (
        <p className="text-xs text-rose-600" data-testid="range-planner-tier-move-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
