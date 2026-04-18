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
    <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-xl duration-700 animate-in fade-in">
      <CardHeader className="border-b border-slate-50 p-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">
              Profit & Loss Statement
            </CardTitle>
            <CardDescription className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
                  Себестоимость (COGS)
                </span>
                <span className="text-sm font-bold text-rose-500">
                  -{pnlData.cogs.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex items-end justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-sm font-black uppercase tracking-widest text-indigo-600">
                  Валовая прибыль
                </span>
                <span className="text-base font-black text-indigo-600">
                  {pnlData.grossProfit.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Операционные расходы (OPEX)
                </span>
                <span className="text-sm font-bold text-rose-500">
                  -{pnlData.opex.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Налоги
                </span>
                <span className="text-sm font-bold text-rose-500">
                  -{pnlData.taxes.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex items-end justify-between rounded-2xl bg-slate-900 p-4 text-white">
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
      <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Percent className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Рентабельность по чистой прибыли: <span className="text-slate-900">22.8%</span>
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
