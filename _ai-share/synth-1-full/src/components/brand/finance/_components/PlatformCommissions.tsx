'use client';

import { Percent, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { platformMetrics, commissionStreams } from '../_fixtures/finance-data';

export function PlatformCommissions() {
  return (
    <div className="space-y-4 duration-700 animate-in fade-in">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Percent className="h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Доход от комиссий
            </p>
            <h3 className="text-sm font-black tabular-nums tracking-tighter">
              {platformMetrics.commissionRevenue.toLocaleString('ru-RU')} ₽
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">
              +18% к прошлому месяцу
            </p>
          </div>
        </Card>
        <Card className="rounded-xl border-slate-100 bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Общий GMV Экосистемы
            </p>
            <h3 className="text-sm font-black tabular-nums tracking-tighter text-slate-900">
              {platformMetrics.totalGmv.toLocaleString('ru-RU')} ₽
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600">
              <TrendingUp className="h-3 w-3" /> Высокая активность
            </div>
          </div>
        </Card>
        <Card className="rounded-xl border-slate-100 bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Чистая прибыль платформы
            </p>
            <h3 className="text-sm font-black tabular-nums tracking-tighter text-emerald-600">
              {platformMetrics.netPlatformProfit.toLocaleString('ru-RU')} ₽
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              После вычета Platform Burn
            </p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-50 p-4">
          <CardTitle className="text-base font-black uppercase tracking-tight">
            Потоки монетизации
          </CardTitle>
          <CardDescription className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Детализация доходов от взаимодействия с партнерами
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="h-12 border-slate-100 hover:bg-transparent">
                <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Источник дохода
                </TableHead>
                <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Объем операций
                </TableHead>
                <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Ставка комиссии
                </TableHead>
                <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Заработано
                </TableHead>
                <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Тренд
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionStreams.map((stream, i) => (
                <TableRow
                  key={i}
                  className="h-12 border-slate-50 transition-colors hover:bg-slate-50/30"
                >
                  <TableCell className="pl-10">
                    <p className="text-xs font-black uppercase text-slate-900">{stream.source}</p>
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold text-slate-600">
                    {stream.volume.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="border-none bg-indigo-50 text-[10px] font-black text-indigo-600"
                    >
                      {stream.rate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-black text-slate-900">
                    {stream.earned.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="pr-10 text-center">
                    {stream.trend === 'up' ? (
                      <TrendingUp className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowRight className="mx-auto h-4 w-4 text-slate-300" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
