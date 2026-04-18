'use client';

import React from 'react';
import type { MarketplaceFilters } from '../../types/filters';
import type { Facets } from '../../types/facets';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Range } from '../ui/Range';
import { DateRange } from '../ui/DateRange';
import { cn } from '../../lib/cn';
import { AsyncMultiSelect } from '../ui/AsyncMultiSelect';

async function fetchFacets(filters: MarketplaceFilters): Promise<Facets> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters as any)) {
    if (Array.isArray(v) && v.length) qs.set(k, v.join(','));
    else if (typeof v === 'boolean' && v) qs.set(k, '1');
    else if (v !== '' && v != null) qs.set(k, String(v));
  }

  const res = await fetch(`/api/facets?${qs.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch facets');
  const json = await res.json();
  return json.facets as Facets;
}

export function FilterBarMarketplace({
  filters,
  setFilters,
  reset,
}: {
  filters: MarketplaceFilters;
  setFilters: (patch: Partial<MarketplaceFilters>, opts?: { replace?: boolean }) => void;
  reset: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [facets, setFacets] = React.useState<Facets | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      fetchFacets(filters)
        .then(setFacets)
        .catch(() => setFacets(null));
    }, 200);
    return () => clearTimeout(t);
  }, [filters]);

  const toggleBool = (k: keyof MarketplaceFilters) =>
    setFilters({ [k]: !(filters as any)[k], page: 1 } as any, { replace: true });

  return (
    <Card className="space-y-4 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-[360px] max-w-full">
          <Input
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value, page: 1 }, { replace: true })}
            placeholder="Search SKU / product / brand / factory…"
          />
        </div>

        <Select
          value={filters.currency}
          onValueChange={(v: string) => setFilters({ currency: v, page: 1 }, { replace: true })}
        >
          <SelectTrigger className="h-10 w-[120px]">
            <SelectValue placeholder="Валюта" />
          </SelectTrigger>
          <SelectContent>
            {[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'RUB', label: 'RUB' },
            ].map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {[
          ['inStockOnly', 'In stock'],
          ['lowStock', 'Low stock'],
          ['slowMover', 'Slow mover'],
          ['highReturnRisk', 'Return risk'],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={cn(
              'h-10 rounded-md border px-3 text-sm',
              (filters as any)[k]
                ? 'border-accent-primary bg-accent-soft text-text-primary'
                : 'border-border-default bg-bg-surface text-text-secondary'
            )}
            onClick={() => toggleBool(k as any)}
          >
            {label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
            {open ? 'Hide filters' : 'More filters'}
          </Button>
          <Button variant="secondary" onClick={reset}>
            Reset
          </Button>
          <Button variant="cta" onClick={() => setFilters({ page: 1 }, { replace: false })}>
            Apply
          </Button>
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AsyncMultiSelect
            type="brands"
            value={filters.brandIds}
            onChange={(v) => setFilters({ brandIds: v, page: 1 }, { replace: true })}
            placeholder={`Brands${facets?.brand?.length ? ` (${facets.brand.reduce((a, b) => a + b.count, 0)})` : ''}`}
          />
          <AsyncMultiSelect
            type="retailers"
            value={filters.retailerIds}
            onChange={(v) => setFilters({ retailerIds: v, page: 1 }, { replace: true })}
            placeholder="Retailers"
          />
          <AsyncMultiSelect
            type="suppliers"
            value={filters.supplierIds}
            onChange={(v) => setFilters({ supplierIds: v, page: 1 }, { replace: true })}
            placeholder="Suppliers / Factories"
          />
          <AsyncMultiSelect
            type="marketplaces"
            value={filters.marketplaceIds}
            onChange={(v) => setFilters({ marketplaceIds: v, page: 1 }, { replace: true })}
            placeholder="Marketplaces / Channels"
          />

          <div>
            <div className="text-text-muted mb-1 text-xs uppercase tracking-[0.06em]">
              Wholesale price
            </div>
            <Range
              min={filters.wholesaleMin}
              max={filters.wholesaleMax}
              onChange={({ min, max }) =>
                setFilters({ wholesaleMin: min, wholesaleMax: max, page: 1 }, { replace: true })
              }
            />
          </div>

          <div>
            <div className="text-text-muted mb-1 text-xs uppercase tracking-[0.06em]">
              Retail price
            </div>
            <Range
              min={filters.retailMin}
              max={filters.retailMax}
              onChange={({ min, max }) =>
                setFilters({ retailMin: min, retailMax: max, page: 1 }, { replace: true })
              }
            />
          </div>

          <div>
            <div className="text-text-muted mb-1 text-xs uppercase tracking-[0.06em]">GM %</div>
            <Range
              min={filters.gmMin}
              max={filters.gmMax}
              onChange={({ min, max }) =>
                setFilters({ gmMin: min, gmMax: max, page: 1 }, { replace: true })
              }
            />
          </div>

          <div>
            <div className="text-text-muted mb-1 text-xs uppercase tracking-[0.06em]">
              Sell-through %
            </div>
            <Range
              min={filters.sellThroughMin}
              max={filters.sellThroughMax}
              onChange={({ min, max }) =>
                setFilters({ sellThroughMin: min, sellThroughMax: max, page: 1 }, { replace: true })
              }
            />
          </div>

          <div>
            <div className="text-text-muted mb-1 text-xs uppercase tracking-[0.06em]">
              Stock (units)
            </div>
            <Range
              min={filters.stockMin}
              max={filters.stockMax}
              onChange={({ min, max }) =>
                setFilters({ stockMin: min, stockMax: max, page: 1 }, { replace: true })
              }
            />
          </div>

          <div>
            <div className="text-text-muted mb-1 text-xs uppercase tracking-[0.06em]">
              Created date
            </div>
            <DateRange
              from={filters.createdFrom}
              to={filters.createdTo}
              onChange={({ from, to }) =>
                setFilters({ createdFrom: from, createdTo: to, page: 1 }, { replace: true })
              }
            />
          </div>

          <div>
            <div className="text-text-muted mb-1 text-xs uppercase tracking-[0.06em]">
              Delivery window
            </div>
            <DateRange
              from={filters.deliveryFrom}
              to={filters.deliveryTo}
              onChange={({ from, to }) =>
                setFilters({ deliveryFrom: from, deliveryTo: to, page: 1 }, { replace: true })
              }
            />
          </div>
        </div>
      )}
    </Card>
  );
}
