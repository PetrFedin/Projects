'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { cn } from '@/lib/utils';
import type { RangePlannerTier } from '@/lib/production/workshop2-range-planner-bridge';
import type { RangePlannerUnassignedArticle } from '@/lib/production/workshop2-range-planner-pg';

const TIER_OPTIONS: { id: RangePlannerTier; label: string }[] = [
  { id: 'core', label: 'Базовый' },
  { id: 'trend', label: 'Тренд' },
  { id: 'novelty', label: 'Новинки' },
];

export function RangePlannerTierAssignPanel({
  collectionId,
  articles,
  onAssigned,
}: {
  collectionId: string;
  articles: RangePlannerUnassignedArticle[];
  onAssigned: () => void;
}) {
  const [tierByArticle, setTierByArticle] = useState<Record<string, RangePlannerTier>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const assign = useCallback(
    async (articleId: string) => {
      const tier = tierByArticle[articleId] ?? 'core';
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
          setError(json.messageRu ?? 'Не удалось назначить уровень');
          return;
        }
        onAssigned();
      } catch {
        setError('Ошибка сети');
      } finally {
        setBusyId(null);
      }
    },
    [collectionId, onAssigned, tierByArticle]
  );

  if (articles.length === 0) return null;

  return (
    <div
      className="border-border-default space-y-3 rounded-xl border bg-amber-50/40 p-4"
      data-testid="range-planner-tier-assign-panel"
    >
      <p className="text-sm font-semibold">Артикулы без уровня ассортимента</p>
      <p className="text-text-secondary text-xs">
        Назначьте tier — артикул появится в соответствующей колонке плана.
      </p>
      <ul className="space-y-2">
        {articles.map((row) => (
          <li
            key={row.articleId}
            className="flex flex-col gap-2 text-sm max-md:rounded-lg max-md:border max-md:border-border-subtle max-md:bg-white max-md:p-2 sm:flex-row sm:flex-wrap sm:items-center"
            data-testid={`range-planner-unassigned-${row.articleId}`}
          >
            <span className="min-w-0 flex-1 font-medium">
              {row.sku ?? row.articleId}
              {row.name ? (
                <span className="text-text-muted ml-1 text-xs font-normal">· {row.name}</span>
              ) : null}
            </span>
            <select
              className={cn(
                'border-border-default rounded-md border bg-white px-2 text-xs',
                hubCabinet.workspacePrimaryBtn,
                'h-11 w-full sm:h-9 sm:w-auto'
              )}
              data-testid={`range-planner-tier-select-${row.articleId}`}
              value={tierByArticle[row.articleId] ?? 'core'}
              onChange={(e) =>
                setTierByArticle((prev) => ({
                  ...prev,
                  [row.articleId]: e.target.value as RangePlannerTier,
                }))
              }
            >
              {TIER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={cn(hubCabinet.workspacePrimaryBtn, 'text-[10px]')}
              disabled={busyId === row.articleId}
              data-testid={`range-planner-tier-assign-${row.articleId}`}
              onClick={() => void assign(row.articleId)}
            >
              {busyId === row.articleId ? '…' : 'Назначить'}
            </Button>
          </li>
        ))}
      </ul>
      {error ? (
        <p className="text-xs text-rose-600" data-testid="range-planner-tier-assign-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
