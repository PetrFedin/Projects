'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SearchResultsGrid({
  loading,
  q,
  total,
  items,
}: {
  loading: boolean;
  q: string;
  total: number;
  items: any[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          {loading
            ? 'Загрузка результатов...'
            : `Найдено: ${total} ${total === 1 ? 'позиция' : 'позиций'} · запрос: “${q || '—'}”`}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {(items ?? []).map((p) => (
          <Card
            key={p.id}
            className="bg-text-primary/50 border-text-primary/30 group overflow-hidden rounded-2xl transition-all hover:border-accent/50"
          >
            <CardContent className="space-y-0 p-0">
              <div className="bg-text-primary/90 relative aspect-[4/5] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                  {p.season !== 'All' && (
                    <Badge className="border-none bg-black/60 text-[8px] font-black uppercase backdrop-blur-md">
                      {p.season}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
                      {p.brand}
                    </div>
                    <div className="truncate text-sm font-bold text-white">{p.title}</div>
                  </div>
                  <div className="shrink-0 text-sm font-black text-white">
                    {Number(p.price).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(p.tags ?? []).slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-text-secondary bg-text-primary/50 rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && (!items || !items.length) && (
        <div className="text-text-muted bg-text-primary/30 border-text-primary/30 rounded-3xl border border-dashed p-4 text-center text-sm">
          <div className="mx-auto max-w-xs space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              Ничего не найдено
            </p>
            <p className="text-[11px]">
              Попробуйте изменить параметры фильтрации или поисковый запрос.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
