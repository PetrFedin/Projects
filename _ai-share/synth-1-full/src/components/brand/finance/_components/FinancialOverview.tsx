"use client";

import { TrendingUp, Package, Zap, ShieldCheck, Scale, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { metrics, inventoryStats } from "../_fixtures/finance-data";

export function FinancialOverview() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Valuation & Net Worth Card */}
      <Card className="rounded-xl border border-slate-100 shadow-xl shadow-indigo-100/30 bg-slate-900 text-white overflow-hidden relative group hover:bg-slate-800 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <TrendingUp className="h-32 w-32 text-indigo-500" />
        </div>
        <CardContent className="p-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400 leading-none">
                  Estimated Enterprise Value
                </p>
                <h3 className="text-base font-bold tracking-tighter tabular-nums text-white uppercase leading-none">
                  {metrics.estimatedValuation.toLocaleString("ru-RU")} ₽
                </h3>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-2 h-5 rounded-lg font-bold text-[8px] uppercase tracking-widest leading-none">
                  Multiplier: 3.7x
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 h-5 rounded-lg font-bold text-[8px] uppercase tracking-widest leading-none">
                  Growth: +22% YoY
                </Badge>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed max-w-sm font-bold uppercase tracking-tight">
                "Оценка сформирована на основе текущей выручки и индекса устойчивости Syntha."
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 group-hover:border-white/20 transition-colors shadow-inner">
                <p className="text-[8px] font-bold uppercase text-white/40 tracking-widest leading-none">
                  Капитал
                </p>
                <p className="text-sm font-bold tabular-nums leading-none">
                  {metrics.netWorth.toLocaleString("ru-RU")} ₽
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 group-hover:border-white/20 transition-colors shadow-inner">
                <p className="text-[8px] font-bold uppercase text-white/40 tracking-widest leading-none">
                  Активы
                </p>
                <p className="text-sm font-bold tabular-nums leading-none">
                  {metrics.totalAssets.toLocaleString("ru-RU")} ₽
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5 shadow-inner">
                <p className="text-[8px] font-bold uppercase text-indigo-300 tracking-widest leading-none">
                  Sustainability
                </p>
                <p className="text-sm font-bold tabular-nums text-indigo-400 leading-none">
                  {metrics.sustainabilityIndex}%
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5 shadow-inner">
                <p className="text-[8px] font-bold uppercase text-rose-300 tracking-widest leading-none">
                  Liabilities
                </p>
                <p className="text-sm font-bold tabular-nums text-rose-400 leading-none">
                  {metrics.totalLiabilities.toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 space-y-4 hover:border-indigo-100 transition-all group">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">
                Товарное обеспечение
              </p>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none uppercase">
                {metrics.inventoryValue.toLocaleString("ru-RU")} ₽
              </h4>
            </div>
          </div>
          <div className="space-y-2">
            {inventoryStats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest leading-none">
                  <span className="text-slate-400">{stat.category}</span>
                  <span className="text-slate-900">
                    {Math.round((stat.value / metrics.inventoryValue) * 100)}%
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (stat.value / metrics.inventoryValue) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 space-y-4 hover:border-indigo-100 transition-all group">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">
                Операционный Runway
              </p>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none uppercase">
                {metrics.runwayMonths} месяцев
              </h4>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1.5 group-hover:bg-white transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest leading-none">
                Burn Rate (Monthly)
              </span>
              <span className="text-[10px] font-bold text-rose-600 tabular-nums">
                -{metrics.monthlyBurn.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight opacity-60">
              Запас до сентября 2026.
            </p>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 overflow-hidden relative group hover:border-amber-100 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-inner group-hover:scale-105 transition-transform">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">
                Налоги и Комплаенс
              </p>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none uppercase">
                1,200,000 ₽
              </h4>
            </div>
          </div>
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 group-hover:bg-emerald-50 transition-colors">
              <span className="text-[8px] font-bold uppercase text-emerald-700 tracking-widest">
                НДС (Q1)
              </span>
              <Badge variant="outline" className="bg-emerald-500 text-white border-none text-[7px] font-bold px-1.5 h-3.5 tracking-widest shadow-sm">
                ОПЛАЧЕНО
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 group-hover:bg-amber-50 transition-colors">
              <span className="text-[8px] font-bold uppercase text-amber-700 tracking-widest">
                Налог на прибыль
              </span>
              <span className="text-[8px] font-bold text-amber-800 tracking-widest">
                ДО 28.03
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
