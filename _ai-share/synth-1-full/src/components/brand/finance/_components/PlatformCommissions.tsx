"use client";

import { Percent, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { platformMetrics, commissionStreams } from "../_fixtures/finance-data";

export function PlatformCommissions() {
  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="rounded-xl border-none shadow-xl bg-indigo-600 text-white p-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Percent className="h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Доход от комиссий
            </p>
            <h3 className="text-sm font-black tracking-tighter tabular-nums">
              {platformMetrics.commissionRevenue.toLocaleString("ru-RU")} ₽
            </h3>
            <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
              +18% к прошлому месяцу
            </p>
          </div>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm bg-white p-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Общий GMV Экосистемы
            </p>
            <h3 className="text-sm font-black tracking-tighter text-slate-900 tabular-nums">
              {platformMetrics.totalGmv.toLocaleString("ru-RU")} ₽
            </h3>
            <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase">
              <TrendingUp className="h-3 w-3" /> Высокая активность
            </div>
          </div>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm bg-white p-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Чистая прибыль платформы
            </p>
            <h3 className="text-sm font-black tracking-tighter text-emerald-600 tabular-nums">
              {platformMetrics.netPlatformProfit.toLocaleString("ru-RU")} ₽
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              После вычета Platform Burn
            </p>
          </div>
        </Card>
      </div>

      <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-50">
          <CardTitle className="text-base font-black uppercase tracking-tight">
            Потоки монетизации
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Детализация доходов от взаимодействия с партнерами
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent h-12">
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
                  className="border-slate-50 hover:bg-slate-50/30 transition-colors h-12"
                >
                  <TableCell className="pl-10">
                    <p className="text-xs font-black uppercase text-slate-900">
                      {stream.source}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs text-slate-600">
                    {stream.volume.toLocaleString("ru-RU")} ₽
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px]"
                    >
                      {stream.rate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-black text-xs text-slate-900">
                    {stream.earned.toLocaleString("ru-RU")} ₽
                  </TableCell>
                  <TableCell className="pr-10 text-center">
                    {stream.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-slate-300 mx-auto" />
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
