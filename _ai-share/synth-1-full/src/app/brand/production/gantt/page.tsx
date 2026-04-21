'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
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
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';

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
    <CabinetPageContent maxWidth="5xl" className="space-y-6 pb-16">
      <SectionInfoCard
        title="Планировщик Gantt производства"
        description="Клик по ячейке недели переключает загрузку линии. Сохранение — floor-tab: gantt."
        icon={Calendar}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={<ProductionGanttDailyBadges />}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.production} aria-label="Назад к производству">
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold uppercase">Планировщик Gantt производства</h1>
            <Link href={ROUTES.brand.productionDailyOutput}>
            <Button variant="outline" size="sm" className="gap-1">
              <ClipboardList className="h-4 w-4" aria-hidden /> Сменный выпуск
            </Button>
          </Link>
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
          <Save className="h-3.5 w-3.5" aria-hidden /> Сохранить план
        </Button>
      </div>

      <Card className="border-border-default rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" aria-hidden /> Загрузка линий
          </CardTitle>
          <CardDescription>
            Нажмите на ячейку, чтобы отметить / снять неделю. Ключевые{' '}
            <AcronymWithTooltip abbr="KPI" /> рассчитываются на дашборде производства.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-border-default border-b">
                  <th className="text-text-secondary w-32 p-2 text-left text-[10px] font-bold uppercase">
                    Линия
                  </th>
                  {weekLabels.map((w) => (
                    <th
                      key={w.key}
                      className="text-text-secondary min-w-[80px] p-2 text-center text-[10px] font-bold uppercase"
                    >
                      {w.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.lines.map((line, lineIndex) => (
                  <tr key={line.lineId} className="border-border-subtle border-b">
                    <td className="p-2">
                      <p className="text-sm font-bold">{line.lineName}</p>
                      <p className="text-text-secondary text-[10px]">
                        {line.orderIds.length ? line.orderIds.join(', ') : '—'}
                      </p>
                    </td>
                    {line.weeks.map((filled, wi) => (
                      <td key={wi} className="p-1">
                        <button
                          type="button"
                          onClick={() => toggleCell(lineIndex, wi)}
                          className={cn(
                            'h-8 w-full rounded-md transition-colors',
                            filled
                              ? 'bg-accent-primary hover:bg-accent-primary'
                              : 'bg-bg-surface2 hover:bg-bg-surface2'
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
    </CabinetPageContent>
  );
}
