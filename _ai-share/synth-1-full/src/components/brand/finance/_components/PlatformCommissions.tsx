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
        <Card className="bg-accent-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
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
        <Card className="border-border-subtle rounded-xl bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Общий GMV Экосистемы
            </p>
            <h3 className="text-text-primary text-sm font-black tabular-nums tracking-tighter">
              {platformMetrics.totalGmv.toLocaleString('ru-RU')} ₽
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600">
              <TrendingUp className="h-3 w-3" /> Высокая активность
            </div>
          </div>
        </Card>
        <Card className="border-border-subtle rounded-xl bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Чистая прибыль платформы
            </p>
            <h3 className="text-sm font-black tabular-nums tracking-tighter text-emerald-600">
              {platformMetrics.netPlatformProfit.toLocaleString('ru-RU')} ₽
            </h3>
            <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
              После вычета Platform Burn
            </p>
          </div>
        </Card>
      </div>

      <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
        <CardHeader className="border-border-subtle border-b p-4">
          <CardTitle className="text-base font-black uppercase tracking-tight">
            Потоки монетизации
          </CardTitle>
          <CardDescription className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
            Детализация доходов от взаимодействия с партнерами
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-bg-surface2/80">
              <TableRow className="border-border-subtle h-12 hover:bg-transparent">
                <TableHead className="text-text-muted pl-10 text-[9px] font-black uppercase tracking-widest">
                  Источник дохода
                </TableHead>
                <TableHead className="text-text-muted text-right text-[9px] font-black uppercase tracking-widest">
                  Объем операций
                </TableHead>
                <TableHead className="text-text-muted text-center text-[9px] font-black uppercase tracking-widest">
                  Ставка комиссии
                </TableHead>
                <TableHead className="text-text-muted text-right text-[9px] font-black uppercase tracking-widest">
                  Заработано
                </TableHead>
                <TableHead className="text-text-muted pr-10 text-center text-[9px] font-black uppercase tracking-widest">
                  Тренд
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionStreams.map((stream, i) => (
                <TableRow
                  key={i}
                  className="border-border-subtle hover:bg-bg-surface2/30 h-12 transition-colors"
                >
                  <TableCell className="pl-10">
                    <p className="text-text-primary text-xs font-black uppercase">
                      {stream.source}
                    </p>
                  </TableCell>
                  <TableCell className="text-text-secondary text-right text-xs font-bold">
                    {stream.volume.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-accent-primary/10 text-accent-primary border-none text-[10px] font-black"
                    >
                      {stream.rate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-primary text-right text-xs font-black">
                    {stream.earned.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="pr-10 text-center">
                    {stream.trend === 'up' ? (
                      <TrendingUp className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowRight className="text-text-muted mx-auto h-4 w-4" />
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
