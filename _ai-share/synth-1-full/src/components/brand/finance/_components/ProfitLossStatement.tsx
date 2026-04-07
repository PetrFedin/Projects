"use client";

import { Percent, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pnlData } from "../_fixtures/finance-data";

export function ProfitLossStatement() {
  return (
    <Card className="rounded-xl border-slate-100 shadow-xl bg-white overflow-hidden animate-in fade-in duration-700">
      <CardHeader className="p-3 border-b border-slate-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">Profit & Loss Statement</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Отчет о прибылях и убытках за текущий период</CardDescription>
          </div>
          <Select defaultValue="current">
            <SelectTrigger className="w-[180px] rounded-xl font-black uppercase text-[10px] tracking-widest h-10">
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
        <div className="p-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">Выручка (Revenue)</span>
                <span className="text-base font-black text-slate-900">{pnlData.revenue.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Себестоимость (COGS)</span>
                <span className="text-sm font-bold text-rose-500">-{pnlData.cogs.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end bg-slate-50 p-4 rounded-2xl">
                <span className="text-sm font-black uppercase tracking-widest text-indigo-600">Валовая прибыль</span>
                <span className="text-base font-black text-indigo-600">{pnlData.grossProfit.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Операционные расходы (OPEX)</span>
                <span className="text-sm font-bold text-rose-500">-{pnlData.opex.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Налоги</span>
                <span className="text-sm font-bold text-rose-500">-{pnlData.taxes.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end bg-slate-900 p-4 rounded-2xl text-white">
                <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Чистая прибыль</span>
                <span className="text-base font-black text-emerald-400">{pnlData.netProfit.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Percent className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Рентабельность по чистой прибыли: <span className="text-slate-900">22.8%</span></p>
        </div>
        <Button variant="ghost" className="rounded-xl font-black uppercase text-[9px] tracking-widest gap-2">
          Детализация расходов <ChevronRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
