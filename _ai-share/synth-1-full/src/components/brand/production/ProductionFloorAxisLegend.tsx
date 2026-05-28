'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  buildPrimaryStagesByFloorTab,
  FLOOR_TAB_INDEX_NOTES,
} from '@/lib/production/production-floor-stage-index';
import { PRODUCTION_FLOOR_STEPS, type ProductionFloorTabId } from '@/lib/production/floor-flow';
import { cn } from '@/lib/utils';

type Props = {
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  className?: string;
};

function truncateTitles(titles: string[], max = 2): { line: string; more: number } {
  if (titles.length === 0) return { line: '', more: 0 };
  const shown = titles.slice(0, max);
  const more = Math.max(0, titles.length - max);
  return { line: shown.join(' · '), more };
}

export function ProductionFloorAxisLegend({
  floorHref,
  mergeCollectionQuery,
  collectionQuery,
  className,
}: Props) {
  const rows = useMemo(() => buildPrimaryStagesByFloorTab(), []);

  return (
    <details
      className={cn(
        'border-border-default/90 text-text-primary group rounded-xl border bg-white/90 px-3 py-2 text-[10px] shadow-sm',
        className
      )}
    >
      <summary className="text-text-secondary flex cursor-pointer list-none items-center justify-between gap-2 text-[9px] font-black uppercase tracking-wider [&::-webkit-details-marker]:hidden">
        <span>Вкладки цеха ↔ этапы каталога</span>
        <ChevronDown
          className="text-text-muted h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <p className="text-text-secondary mt-2 text-[9px] leading-snug">
        Основной модуль этапа (кнопка «В модуль» / переход из матрицы). Дополнительные экраны — в
        блоке «Связи» у каждого этапа.
      </p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ tab, primaryStageTitles }) => {
          const meta = PRODUCTION_FLOOR_STEPS.find((s) => s.id === tab);
          const label = meta?.label ?? tab;
          const hint = meta?.hint ?? '';
          const note = FLOOR_TAB_INDEX_NOTES[tab];
          const { line, more } = truncateTitles(primaryStageTitles);
          const href = mergeCollectionQuery(floorHref(tab), collectionQuery);
          return (
            <li
              key={tab}
              className="border-border-subtle bg-bg-surface2/80 min-w-0 rounded-lg border p-2"
            >
              <Link
                href={href}
                className="text-accent-primary break-words font-bold hover:underline"
                title={hint}
              >
                {label}
              </Link>
              {note ? (
                <p className="text-text-secondary mt-1 text-[9px] leading-snug">{note}</p>
              ) : line ? (
                <p className="text-text-secondary mt-1 text-[9px] leading-snug">
                  <span className="text-text-secondary">Этапы: </span>
                  {line}
                  {more > 0 ? <span className="text-text-muted"> · +{more}</span> : null}
                </p>
              ) : (
                <p className="text-text-muted mt-1 text-[9px]">
                  Нет этапа с основной ссылкой на вкладку — см. «Связи» в матрице.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
