'use client';

import { TabsTrigger } from '@/components/ui/tabs';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabsListSegmentPlanning({ cn }: { cn: CnFn }) {
  return (
    <>
      <div className="flex items-center gap-1 px-1">
        <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
          1
        </span>
        <TabsTrigger
          value="collections"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Коллекции
        </TabsTrigger>
        <TabsTrigger
          value="dashboard"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary flex h-9 shrink-0 items-center gap-1.5 px-5 font-black tracking-widest'
          )}
        >
          Дашборд{' '}
          <span className="bg-accent-primary/15 text-accent-primary ml-0.5 flex h-4 min-w-4 items-center justify-center rounded text-[8px] font-black">
            2
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="demand"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
          )}
        >
          Прогноз
        </TabsTrigger>
        <TabsTrigger
          value="tz"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
          )}
        >
          ТЗ
        </TabsTrigger>
      </div>
      <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
      <div className="flex items-center gap-1 px-1">
        <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
          2
        </span>
        <TabsTrigger
          value="plm"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Артикулы
        </TabsTrigger>
        <TabsTrigger
          value="samples"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Сэмплы
        </TabsTrigger>
        <TabsTrigger
          value="fitting"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
          )}
        >
          Примерки
        </TabsTrigger>
        <TabsTrigger
          value="approval"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Утверждения
        </TabsTrigger>
      </div>
      <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
    </>
  );
}
