'use client';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

const VIEWS = [
  'rolls',
  'haberdashery',
  'requisition',
  'quotes',
  'po',
  'receipt',
  'subcontract',
] as const;

export function ProductionPageContentTabMaterialsBodyViewSwitch({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setProcurementView, procurementView } = px;

  return (
    <div className="bg-bg-surface2 border-border-default flex w-fit gap-1 rounded-2xl border p-1">
      {VIEWS.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setProcurementView?.(v)}
          className={cn(
            'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
            procurementView === v
              ? 'text-accent-primary bg-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {v === 'rolls' && 'Рулоны'}
          {v === 'haberdashery' && 'Фурнитура'}
          {v === 'requisition' && 'Заявки'}
          {v === 'quotes' && 'КП'}
          {v === 'po' && 'PO'}
          {v === 'receipt' && 'Приёмка'}
          {v === 'subcontract' && 'Субподряд'}
        </button>
      ))}
    </div>
  );
}
