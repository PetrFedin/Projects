'use client';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

const FILTERS = ['all', 'In Production', 'Confirmed', 'Shipped'] as const;

export function ProductionPageContentTabOrdersBodyFilters({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setOrdersFilter, ordersFilter } = px;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setOrdersFilter?.(f)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
            ordersFilter === f
              ? 'text-accent-primary border-border-default border bg-white shadow-sm'
              : 'text-text-secondary hover:bg-bg-surface2'
          )}
        >
          {f === 'all' ? 'Все' : f}
        </button>
      ))}
    </div>
  );
}
