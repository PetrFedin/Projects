'use client';

import { TabsTrigger } from '@/components/ui/tabs';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabsListSegmentGovernance({ cn }: { cn: CnFn }) {
  return (
    <>
      <div className="flex items-center gap-1 px-1">
        <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
          5
        </span>
        <TabsTrigger
          value="budget"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Бюджет
        </TabsTrigger>
        <TabsTrigger
          value="finance"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Финансы
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Документы
        </TabsTrigger>
        <TabsTrigger
          value="losses"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Потери
        </TabsTrigger>
        <TabsTrigger
          value="factories"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Фабрики
        </TabsTrigger>
        <TabsTrigger
          value="handbooks"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Партнёры
        </TabsTrigger>
        <TabsTrigger
          value="audit"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          Аудит
        </TabsTrigger>
        <TabsTrigger
          value="sla"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
          )}
        >
          SLA
        </TabsTrigger>
        <TabsTrigger
          value="reports"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
          )}
        >
          Отчёты
        </TabsTrigger>
      </div>
      <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
      <div className="flex items-center gap-1 px-1">
        <TabsTrigger
          value="archive"
          className={cn(
            cabinetSurface.tabsTrigger,
            'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
          )}
        >
          Архив
        </TabsTrigger>
      </div>
    </>
  );
}
