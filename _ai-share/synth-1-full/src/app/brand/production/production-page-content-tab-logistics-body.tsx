'use client';

import { FileText, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CargoTrackingCard } from '@/components/brand/production/ProductionEnhancementsHub';
import { LogisticsCostCalc } from '@/components/brand/production/LogisticsCostCalc';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

const VIEWS = ['cargo', 'inbound', 'docs', 'customs', 'wms'] as const;

export function ProductionPageContentTabLogisticsBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setLogisticsView, logisticsView } = px;

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <CargoTrackingCard trackId="TRK-2026-001" status="В пути" eta="15.03.2026" />
        <LogisticsCostCalc />
      </div>
      <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setLogisticsView?.(v)}
            className={cn(
              'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
              logisticsView === v
                ? 'text-accent-primary bg-white shadow-sm'
                : 'text-text-secondary'
            )}
          >
            {v === 'cargo' && 'Груз'}
            {v === 'inbound' && 'Входящие'}
            {v === 'docs' && 'Документы'}
            {v === 'customs' && 'Таможня'}
            {v === 'wms' && 'WMS'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase">В пути (Карго)</p>
              <p className="text-text-secondary text-[9px]">Отслеживание грузов</p>
            </div>
          </div>
        </Card>
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase">Входящие поставки</p>
              <p className="text-text-secondary text-[9px]">Приёмка на склад</p>
            </div>
          </div>
        </Card>
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase">Документы</p>
              <p className="text-text-secondary text-[9px]">CMR, инвойсы</p>
            </div>
          </div>
        </Card>
      </div>
      <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
            <Truck className="h-4 w-4" /> Логистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-[10px]">
            Модуль грузоперевозок, таможня, WMS. Выберите подраздел выше.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
