"use client";

import { Wallet, ArrowUpRight, ArrowDownRight, Banknote, Scale, AlertCircle, Package, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { metrics } from "../_fixtures/finance-data";

export function BalanceSheet() {
  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-base font-black uppercase tracking-tight text-emerald-600">Активы (Assets)</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Что принадлежит компании</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {[
              { name: 'Денежные средства', value: metrics.cashInBank, icon: <Wallet className="h-4 w-4" /> },
              { name: 'Товарные запасы (Stock)', value: metrics.inventoryValue, icon: <Package className="h-4 w-4" /> },
              { name: 'Дебиторская задолженность', value: metrics.receivables, icon: <ArrowUpRight className="h-4 w-4" /> },
              { name: 'Оборудование и ОС', value: 5000000, icon: <Building2 className="h-4 w-4" /> },
            ].map((asset, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">{asset.icon}</div>
                  <span className="text-xs font-black uppercase text-slate-900">{asset.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{asset.value.toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center px-4">
              <span className="text-sm font-black uppercase text-slate-400">Всего активов</span>
              <span className="text-base font-black text-emerald-600">{metrics.totalAssets.toLocaleString('ru-RU')} ₽</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-base font-black uppercase tracking-tight text-rose-600">Обязательства (Liabilities)</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Долги и обязательства компании</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {[
              { name: 'Кредиторская задолженность', value: metrics.payables, icon: <ArrowDownRight className="h-4 w-4" /> },
              { name: 'Кредиты и займы', value: metrics.debt, icon: <Banknote className="h-4 w-4" /> },
              { name: 'Налоговые обязательства', value: 1200000, icon: <Scale className="h-4 w-4" /> },
              { name: 'Прочие обязательства', value: 800000, icon: <AlertCircle className="h-4 w-4" /> },
            ].map((liability, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">{liability.icon}</div>
                  <span className="text-xs font-black uppercase text-slate-900">{liability.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{liability.value.toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center px-4">
              <span className="text-sm font-black uppercase text-slate-400">Всего обязательств</span>
              <span className="text-base font-black text-rose-600">{metrics.totalLiabilities.toLocaleString('ru-RU')} ₽</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-none shadow-2xl bg-slate-900 text-white p-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Чистая стоимость компании (Net Worth)</p>
          <h3 className="text-sm font-black tracking-tighter">{metrics.netWorth.toLocaleString('ru-RU')} ₽</h3>
          <p className="text-xs text-white/40 italic">"Собственный капитал компании за вычетом всех внешних обязательств."</p>
        </div>
        <div className="flex flex-col items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 min-w-[240px]">
          <p className="text-[10px] font-black uppercase text-white/40">ROI Инвестиций</p>
          <span className="text-sm font-black text-emerald-400">+24.5%</span>
          <Button className="bg-white text-black hover:bg-indigo-50 rounded-xl font-black uppercase text-[9px] tracking-widest px-6 h-10 shadow-xl">Анализ эффективности</Button>
        </div>
      </Card>
    </div>
  );
}
