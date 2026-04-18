'use client';

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
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Daily Output Tracking"
        description="Сводка смен — из daily-output-data; комментарий мастера сохраняется в floor-tab: daily-output."
        icon={ClipboardList}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<ProductionGanttBadges />}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={ROUTES.brand.production}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold uppercase">Daily Output Tracking</h1>
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

      <Card className="rounded-xl border border-slate-200 shadow-sm">
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
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <div>
              <p className="text-[10px] uppercase text-slate-500">План (сумма)</p>
              <p className="font-bold">{summary.totalPlan}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500">Факт (сумма)</p>
              <p className="font-bold">{summary.totalFact}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500">Выполнение</p>
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
              <tr className="border-b border-slate-200">
                <th className="p-2 text-left text-[10px] font-bold uppercase text-slate-500">
                  Линия
                </th>
                <th className="p-2 text-right text-[10px] font-bold uppercase text-slate-500">
                  План
                </th>
                <th className="p-2 text-right text-[10px] font-bold uppercase text-slate-500">
                  Факт
                </th>
                <th className="p-2 text-right text-[10px] font-bold uppercase text-slate-500">
                  Статус
                </th>
                <th className="p-2 text-left text-[10px] font-bold uppercase text-slate-500">
                  Комментарий
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
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
                  <td className="p-2 text-[11px] text-slate-500">{s.comment || '—'}</td>
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
    </div>
  );
}
