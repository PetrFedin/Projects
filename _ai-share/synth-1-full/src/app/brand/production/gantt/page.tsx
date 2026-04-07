'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionGanttDailyBadges } from '@/components/brand/SectionBadgeCta';
import { Calendar, Factory, ArrowLeft, ClipboardList, Save } from 'lucide-react';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getGanttLines, getGanttWeekLabels } from '@/lib/production/gantt-data';
import { cn } from '@/lib/utils';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';

const GANTT_DEFAULT = { v: 1 as const, lines: getGanttLines() };

export default function GanttProductionPage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('gantt', GANTT_DEFAULT);
  const weekLabels = getGanttWeekLabels();

  const toggleCell = (lineIndex: number, weekIndex: number) => {
    setData((prev) => {
      const lines = prev.lines.map((line, li) => {
        if (li !== lineIndex) return line;
        const weeks = line.weeks.map((w, wi) => (wi === weekIndex ? (w ? 0 : 1) : w));
        return { ...line, weeks };
      });
      return { ...prev, lines };
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="GANTT Production Scheduler"
        description="Клик по ячейке недели переключает загрузку линии. Сохранение — floor-tab: gantt."
        icon={Calendar}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<ProductionGanttDailyBadges />}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href={ROUTES.brand.production}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold uppercase">GANTT Production Scheduler</h1>
          <Link href={ROUTES.brand.productionDailyOutput}><Button variant="outline" size="sm" className="gap-1"><ClipboardList className="h-4 w-4" /> Daily Output</Button></Link>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'План линий записан (gantt).' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить план
        </Button>
      </div>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" /> Загрузка линий
          </CardTitle>
          <CardDescription>Нажмите на ячейку, чтобы отметить / снять неделю</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-2 font-bold uppercase text-[10px] text-slate-500 w-32">Линия</th>
                  {weekLabels.map((w) => (
                    <th key={w.key} className="p-2 text-center font-bold uppercase text-[10px] text-slate-500 min-w-[80px]">{w.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.lines.map((line, lineIndex) => (
                  <tr key={line.lineId} className="border-b border-slate-100">
                    <td className="p-2">
                      <p className="font-bold text-sm">{line.lineName}</p>
                      <p className="text-[10px] text-slate-500">{line.orderIds.length ? line.orderIds.join(', ') : '—'}</p>
                    </td>
                    {line.weeks.map((filled, wi) => (
                      <td key={wi} className="p-1">
                        <button
                          type="button"
                          onClick={() => toggleCell(lineIndex, wi)}
                          className={cn(
                            'h-8 w-full rounded-md transition-colors',
                            filled ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-slate-100 hover:bg-slate-200'
                          )}
                          aria-label={`Линия ${line.lineName}, неделя ${wi + 1}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getProductionLinks()} />
    </div>
  );
}
