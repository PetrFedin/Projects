'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Params = {
  q: string;
  brand: string;
  category: string;
  sort: string;
  priceMin?: number;
  priceMax?: number;
};

export function SearchFilters({
  params,
  facets,
  loading,
  onChange,
}: {
  params: Params;
  facets?: {
    brands: { value: string; count: number }[];
    categories: { value: string; count: number }[];
  };
  loading: boolean;
  onChange: (next: Params) => void;
}) {
  return (
    <Card className="sticky top-24 overflow-hidden rounded-none border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-900" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">
              Refine Results
            </h3>
          </div>
          <button
            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900"
            onClick={() => onChange({ q: '', brand: '', category: '', sort: 'relevance' })}
          >
            <RotateCcw className="h-3 w-3" /> Clear
          </button>
        </div>

        <div className="space-y-4 p-4">
          {/* Text Search */}
          <div className="space-y-2.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
              Ключевые слова
            </label>
            <div className="relative">
              <input
                className="h-11 w-full rounded-none border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900"
                value={params.q}
                onChange={(e) => onChange({ ...params, q: e.target.value })}
                placeholder="Напр. кашемир, oversize…"
              />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Sort */}
          <div className="space-y-2.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
              Сортировка
            </label>
            <select
              className="h-11 w-full cursor-pointer appearance-none rounded-none border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none transition-all focus:border-slate-900"
              value={params.sort}
              onChange={(e) => onChange({ ...params, sort: e.target.value })}
            >
              <option value="relevance">По релевантности</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
            </select>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Brands */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-900">
                Бренды
              </label>
              <div className="h-px flex-1 bg-slate-900/10" />
            </div>
            <div className="scrollbar-thin scrollbar-thumb-slate-200 max-h-64 space-y-2 overflow-y-auto pr-2">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="brand"
                  checked={params.brand === ''}
                  onChange={() => onChange({ ...params, brand: '' })}
                  className="h-3.5 w-3.5 accent-slate-900"
                />
                <span
                  className={cn(
                    'text-[11px] font-bold uppercase transition-colors',
                    params.brand === ''
                      ? 'text-slate-900'
                      : 'text-slate-500 group-hover:text-slate-700'
                  )}
                >
                  Все бренды
                </span>
              </label>
              {(facets?.brands ?? []).map((b) => (
                <label key={b.value} className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="brand"
                    value={b.value}
                    checked={params.brand === b.value}
                    onChange={(e) => onChange({ ...params, brand: e.target.value })}
                    className="h-3.5 w-3.5 accent-slate-900"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span
                      className={cn(
                        'text-[11px] font-bold uppercase transition-colors',
                        params.brand === b.value
                          ? 'text-slate-900'
                          : 'text-slate-500 group-hover:text-slate-700'
                      )}
                    >
                      {b.value}
                    </span>
                    <span className="text-[9px] font-black tabular-nums text-slate-300">
                      {b.count}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-900">
                Categories
              </label>
              <div className="h-px flex-1 bg-slate-900/10" />
            </div>
            <div className="scrollbar-thin scrollbar-thumb-slate-200 max-h-64 space-y-2 overflow-y-auto pr-2">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="category"
                  checked={params.category === ''}
                  onChange={() => onChange({ ...params, category: '' })}
                  className="h-3.5 w-3.5 accent-slate-900"
                />
                <span
                  className={cn(
                    'text-[11px] font-bold uppercase transition-colors',
                    params.category === ''
                      ? 'text-slate-900'
                      : 'text-slate-500 group-hover:text-slate-700'
                  )}
                >
                  Все категории
                </span>
              </label>
              {(facets?.categories ?? []).map((c) => (
                <label key={c.value} className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="category"
                    value={c.value}
                    checked={params.category === c.value}
                    onChange={(e) => onChange({ ...params, category: e.target.value })}
                    className="h-3.5 w-3.5 accent-slate-900"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span
                      className={cn(
                        'text-[11px] font-bold uppercase transition-colors',
                        params.category === c.value
                          ? 'text-slate-900'
                          : 'text-slate-500 group-hover:text-slate-700'
                      )}
                    >
                      {c.value}
                    </span>
                    <span className="text-[9px] font-black tabular-nums text-slate-300">
                      {c.count}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-900">
                Диапазон цен (₽)
              </label>
              <div className="h-px flex-1 bg-slate-900/10" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="h-11 w-full rounded-none border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900"
                value={params.priceMin?.toString() ?? ''}
                onChange={(e) =>
                  onChange({
                    ...params,
                    priceMin: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                inputMode="numeric"
                placeholder="От"
              />
              <input
                className="h-11 w-full rounded-none border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900"
                value={params.priceMax?.toString() ?? ''}
                onChange={(e) =>
                  onChange({
                    ...params,
                    priceMax: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                inputMode="numeric"
                placeholder="До"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/30 p-4">
          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black disabled:opacity-50"
            onClick={() => onChange({ ...params })}
          >
            {loading ? 'Поиск…' : 'Применить фильтры'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
