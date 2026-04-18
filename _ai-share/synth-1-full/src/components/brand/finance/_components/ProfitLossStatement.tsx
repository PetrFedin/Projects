'use client';

import { Percent, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { pnlData } from '../_fixtures/finance-data';

export function ProfitLossStatement() {
  return (
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-xl duration-700 animate-in fade-in">
      <CardHeader className="border-b border-slate-50 p-3">
=======
    <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-xl duration-700 animate-in fade-in">
      <CardHeader className="border-border-subtle border-b p-3">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">
              Profit & Loss Statement
            </CardTitle>
<<<<<<< HEAD
            <CardDescription className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
            <CardDescription className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Отчет о прибылях и убытках за текущий период
            </CardDescription>
          </div>
          <Select defaultValue="current">
            <SelectTrigger className="h-10 w-[180px] rounded-xl text-[10px] font-black uppercase tracking-widest">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="current">Январь 2026</SelectItem>
              <SelectItem value="q4">Q4 2025</SelectItem>
              <SelectItem value="year">Весь 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4 p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-6">
<<<<<<< HEAD
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">
                  Выручка (Revenue)
                </span>
                <span className="text-base font-black text-slate-900">
                  {pnlData.revenue.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
=======
              <div className="border-border-subtle flex items-end justify-between border-b pb-4">
                <span className="text-text-primary text-sm font-black uppercase tracking-widest">
                  Выручка (Revenue)
                </span>
                <span className="text-text-primary text-base font-black">
                  {pnlData.revenue.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="border-border-subtle flex items-end justify-between border-b pb-4">
                <span className="text-text-muted text-sm font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Себестоимость (COGS)
                </span>
                <span className="text-sm font-bold text-rose-500">
                  -{pnlData.cogs.toLocaleString('ru-RU')} ₽
                </span>
              </div>
<<<<<<< HEAD
              <div className="flex items-end justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-sm font-black uppercase tracking-widest text-indigo-600">
                  Валовая прибыль
                </span>
                <span className="text-base font-black text-indigo-600">
=======
              <div className="bg-bg-surface2 flex items-end justify-between rounded-2xl p-4">
                <span className="text-accent-primary text-sm font-black uppercase tracking-widest">
                  Валовая прибыль
                </span>
                <span className="text-accent-primary text-base font-black">
>>>>>>> recover/cabinet-wip-from-stash
                  {pnlData.grossProfit.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
            <div className="space-y-6">
<<<<<<< HEAD
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
=======
              <div className="border-border-subtle flex items-end justify-between border-b pb-4">
                <span className="text-text-muted text-sm font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Операционные расходы (OPEX)
                </span>
                <span className="text-sm font-bold text-rose-500">
                  -{pnlData.opex.toLocaleString('ru-RU')} ₽
                </span>
              </div>
<<<<<<< HEAD
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
=======
              <div className="border-border-subtle flex items-end justify-between border-b pb-4">
                <span className="text-text-muted text-sm font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Налоги
                </span>
                <span className="text-sm font-bold text-rose-500">
                  -{pnlData.taxes.toLocaleString('ru-RU')} ₽
                </span>
              </div>
<<<<<<< HEAD
              <div className="flex items-end justify-between rounded-2xl bg-slate-900 p-4 text-white">
=======
              <div className="bg-text-primary flex items-end justify-between rounded-2xl p-4 text-white">
>>>>>>> recover/cabinet-wip-from-stash
                <span className="text-sm font-black uppercase tracking-widest text-emerald-400">
                  Чистая прибыль
                </span>
                <span className="text-base font-black text-emerald-400">
                  {pnlData.netProfit.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
<<<<<<< HEAD
      <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Percent className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Рентабельность по чистой прибыли: <span className="text-slate-900">22.8%</span>
=======
      <CardFooter className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent-primary/15 text-accent-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Percent className="h-4 w-4" />
          </div>
          <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
            Рентабельность по чистой прибыли: <span className="text-text-primary">22.8%</span>
>>>>>>> recover/cabinet-wip-from-stash
          </p>
        </div>
        <Button
          variant="ghost"
          className="gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
        >
          Детализация расходов <ChevronRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
