'use client';

import { TabsTrigger } from '@/components/ui/tabs';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabsListSegmentOperations({ cn }: { cn: CnFn }) {
  return (
    <>
      <div className="flex items-center gap-1 px-1">
        <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
          3
        </span>
        <TabsTrigger
          value="orders"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Заказы (PO)
        </TabsTrigger>
        <TabsTrigger
          value="materials"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Снабжение
        </TabsTrigger>
        <TabsTrigger
          value="costing"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Костинг
        </TabsTrigger>
        <TabsTrigger
          value="execution"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary flex h-9 shrink-0 items-center gap-1.5 px-5 font-black tracking-widest'
          )}
        >
          Цех{' '}
          <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded bg-amber-100 text-[8px] font-black text-amber-600">
            4
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="mps"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
          )}
        >
          MPS
        </TabsTrigger>
      </div>
      <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
      <div className="flex items-center gap-1 px-1">
        <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
          4
        </span>
        <TabsTrigger
          value="compliance"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Закон / QC
        </TabsTrigger>
        <TabsTrigger
          value="logistics"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Логистика
        </TabsTrigger>
        <TabsTrigger
          value="warehouse"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
          )}
        >
          Склад
        </TabsTrigger>
        <TabsTrigger
          value="labeling"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Маркировка
        </TabsTrigger>
      </div>
      <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
    </>
  );
}
