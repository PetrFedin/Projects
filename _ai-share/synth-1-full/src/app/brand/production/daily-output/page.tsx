'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionGanttBadges } from '@/components/brand/SectionBadgeCta';
import { Calendar, ClipboardList, ArrowLeft, Save } from 'lucide-react';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getShiftReports, getShiftReportSummary } from '@/lib/production/daily-output-data';
import { cn } from '@/lib/utils';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';

const DATE_OPTIONS = ['2026-03-11', '2026-03-10'];

const DAILY_DEFAULT = {
  v: 1 as const,
  masterNote: '',
};

export default function DailyOutputPage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('daily-output', DAILY_DEFAULT);
  const [selectedDate, setSelectedDate] = useState('2026-03-11');
  const reports = useMemo(() => getShiftReports(selectedDate), [selectedDate]);
  const summary = useMemo(() => getShiftReportSummary(reports), [reports]);

  return (
    <CabinetPageContent maxWidth="4xl" className="space-y-6 pb-16">
      <SectionInfoCard
        title="Контроль сменного выпуска"
        description="Сводка смен — из daily-output-data; комментарий мастера сохраняется в floor-tab: daily-output."
        icon={ClipboardList}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={<ProductionGanttBadges />}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.production} aria-label="Назад к производству">
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold uppercase">Контроль сменного выпуска</h1>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'Комментарий смены записан.' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить комментарий
        </Button>
      </div>

      <Card className="border-border-default rounded-xl border shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" /> Отчёты смен
            </CardTitle>
            <CardDescription>План и факт по линиям за выбранную дату</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {DATE_OPTIONS.map((d) => (
              <Button
                key={d}
                variant={selectedDate === d ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDate(d)}
              >
                {new Date(d).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-bg-surface2 border-border-default grid grid-cols-3 gap-2 rounded-lg border p-3 text-center">
            <div>
              <p className="text-text-secondary text-[10px] uppercase">
                <AcronymWithTooltip abbr="KPI" />: план
              </p>
              <p className="font-bold">{summary.totalPlan}</p>
            </div>
            <div>
              <p className="text-text-secondary text-[10px] uppercase">
                <AcronymWithTooltip abbr="KPI" />: факт
              </p>
              <p className="font-bold">{summary.totalFact}</p>
            </div>
            <div>
              <p className="text-text-secondary text-[10px] uppercase">
                <AcronymWithTooltip abbr="KPI" />: выполнение
              </p>
              <p
                className={cn(
                  'font-bold',
                  summary.percent >= 100 ? 'text-green-600' : 'text-amber-600'
                )}
              >
                {summary.percent}%
              </p>
            </div>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-border-default border-b">
                <th className="text-text-secondary p-2 text-left text-[10px] font-bold uppercase">
                  Линия
                </th>
                <th className="text-text-secondary p-2 text-right text-[10px] font-bold uppercase">
                  План
                </th>
                <th className="text-text-secondary p-2 text-right text-[10px] font-bold uppercase">
                  Факт
                </th>
                <th className="text-text-secondary p-2 text-right text-[10px] font-bold uppercase">
                  Статус
                </th>
                <th className="text-text-secondary p-2 text-left text-[10px] font-bold uppercase">
                  Комментарий
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((s) => (
                <tr key={s.id} className="border-border-subtle border-b">
                  <td className="p-2 font-medium">{s.lineName}</td>
                  <td className="p-2 text-right">{s.plan}</td>
                  <td className="p-2 text-right">{s.fact}</td>
                  <td className="p-2 text-right">
                    <Badge
                      variant={s.fact >= s.plan ? 'default' : 'destructive'}
                      className="text-[9px]"
                    >
                      {s.fact >= s.plan ? 'OK' : `${s.plan - s.fact} недобор`}
                    </Badge>
                  </td>
                  <td className="text-text-secondary p-2 text-[11px]">{s.comment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Label className="text-xs">Комментарий сменного мастера (сохраняется отдельно)</Label>
            <Textarea
              className="mt-1 min-h-[72px]"
              value={data.masterNote}
              onChange={(e) => setData((prev) => ({ ...prev, masterNote: e.target.value }))}
              placeholder="Итог смены, инциденты, перенос на завтра…"
            />
          </div>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getProductionLinks()} />
    </CabinetPageContent>
  );
}
