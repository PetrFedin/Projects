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
    <Card className="border-border-default sticky top-24 overflow-hidden rounded-none border bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="border-border-subtle bg-bg-surface2/80 flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-2">
            <Filter className="text-text-primary h-3.5 w-3.5" />
            <h3 className="text-text-primary text-[11px] font-black uppercase tracking-[0.1em]">
              Refine Results
            </h3>
          </div>
          <button
            className="text-text-muted hover:text-text-primary flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest transition-colors"
            onClick={() => onChange({ q: '', brand: '', category: '', sort: 'relevance' })}
          >
            <RotateCcw className="h-3 w-3" /> Clear
          </button>
        </div>

        <div className="space-y-4 p-4">
          {/* Text Search */}
          <div className="space-y-2.5">
            <label className="text-text-muted text-[9px] font-black uppercase tracking-[0.15em]">
              Search Keywords
            </label>
            <div className="relative">
              <input
                className="border-border-default text-text-primary focus:border-text-primary placeholder:text-text-muted h-11 w-full rounded-none border bg-white px-4 text-[11px] font-bold outline-none transition-all"
                value={params.q}
                onChange={(e) => onChange({ ...params, q: e.target.value })}
                placeholder="e.g. Cashmere, Oversize..."
              />
            </div>
          </div>

          <div className="bg-bg-surface2 h-px" />

          {/* Sort */}
          <div className="space-y-2.5">
            <label className="text-text-muted text-[9px] font-black uppercase tracking-[0.15em]">
              Sort By
            </label>
            <select
              className="border-border-default text-text-primary focus:border-text-primary h-11 w-full cursor-pointer appearance-none rounded-none border bg-white px-4 text-[11px] font-bold outline-none transition-all"
              value={params.sort}
              onChange={(e) => onChange({ ...params, sort: e.target.value })}
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="bg-bg-surface2 h-px" />

          {/* Brands */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-text-primary block text-[9px] font-black uppercase tracking-[0.15em]">
                Brands
              </label>
              <div className="bg-text-primary/10 h-px flex-1" />
            </div>
            <div className="scrollbar-thin scrollbar-thumb-border-default max-h-64 space-y-2 overflow-y-auto pr-2">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="brand"
                  checked={params.brand === ''}
                  onChange={() => onChange({ ...params, brand: '' })}
                  className="accent-accent-primary h-3.5 w-3.5"
                />
                <span
                  className={cn(
                    'text-[11px] font-bold uppercase transition-colors',
                    params.brand === ''
                      ? 'text-text-primary'
                      : 'text-text-secondary group-hover:text-text-primary'
                  )}
                >
                  All Brands
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
                    className="accent-accent-primary h-3.5 w-3.5"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span
                      className={cn(
                        'text-[11px] font-bold uppercase transition-colors',
                        params.brand === b.value
                          ? 'text-text-primary'
                          : 'text-text-secondary group-hover:text-text-primary'
                      )}
                    >
                      {b.value}
                    </span>
                    <span className="text-text-muted text-[9px] font-black tabular-nums">
                      {b.count}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface2 h-px" />

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-text-primary block text-[9px] font-black uppercase tracking-[0.15em]">
                Categories
              </label>
              <div className="bg-text-primary/10 h-px flex-1" />
            </div>
            <div className="scrollbar-thin scrollbar-thumb-border-default max-h-64 space-y-2 overflow-y-auto pr-2">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="category"
                  checked={params.category === ''}
                  onChange={() => onChange({ ...params, category: '' })}
                  className="accent-accent-primary h-3.5 w-3.5"
                />
                <span
                  className={cn(
                    'text-[11px] font-bold uppercase transition-colors',
                    params.category === ''
                      ? 'text-text-primary'
                      : 'text-text-secondary group-hover:text-text-primary'
                  )}
                >
                  All Categories
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
                    className="accent-accent-primary h-3.5 w-3.5"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span
                      className={cn(
                        'text-[11px] font-bold uppercase transition-colors',
                        params.category === c.value
                          ? 'text-text-primary'
                          : 'text-text-secondary group-hover:text-text-primary'
                      )}
                    >
                      {c.value}
                    </span>
                    <span className="text-text-muted text-[9px] font-black tabular-nums">
                      {c.count}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface2 h-px" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-text-primary text-[9px] font-black uppercase tracking-[0.15em]">
                Price Range (₽)
              </label>
              <div className="bg-text-primary/10 h-px flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="border-border-default text-text-primary focus:border-text-primary placeholder:text-text-muted h-11 w-full rounded-none border bg-white px-4 text-[11px] font-bold outline-none transition-all"
                value={params.priceMin?.toString() ?? ''}
                onChange={(e) =>
                  onChange({
                    ...params,
                    priceMin: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                inputMode="numeric"
                placeholder="From"
              />
              <input
                className="border-border-default text-text-primary focus:border-text-primary placeholder:text-text-muted h-11 w-full rounded-none border bg-white px-4 text-[11px] font-bold outline-none transition-all"
                value={params.priceMax?.toString() ?? ''}
                onChange={(e) =>
                  onChange({
                    ...params,
                    priceMax: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                inputMode="numeric"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        <div className="border-border-subtle bg-bg-surface2/30 border-t p-4">
          <button
            disabled={loading}
            className="bg-text-primary flex h-12 w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black disabled:opacity-50"
            onClick={() => onChange({ ...params })}
          >
            {loading ? 'Searching...' : 'Apply Filters'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
