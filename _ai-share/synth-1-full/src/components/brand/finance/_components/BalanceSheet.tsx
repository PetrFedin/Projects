'use client';

import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Scale,
  AlertCircle,
  Package,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { metrics } from '../_fixtures/finance-data';
<<<<<<< HEAD
=======
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
>>>>>>> recover/cabinet-wip-from-stash

export function BalanceSheet() {
  return (
    <div className="space-y-4 duration-700 animate-in fade-in">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
<<<<<<< HEAD
        <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-50 p-4">
            <CardTitle className="text-base font-black uppercase tracking-tight text-emerald-600">
              Активы (Assets)
            </CardTitle>
            <CardDescription className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardHeader className="border-border-subtle border-b p-4">
            <CardTitle className="text-base font-black uppercase tracking-tight text-emerald-600">
              Активы (Assets)
            </CardTitle>
            <CardDescription className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Что принадлежит компании
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4">
            {[
              {
                name: 'Денежные средства',
                value: metrics.cashInBank,
                icon: <Wallet className="h-4 w-4" />,
              },
              {
                name: 'Товарные запасы (Stock)',
                value: metrics.inventoryValue,
                icon: <Package className="h-4 w-4" />,
              },
              {
                name: 'Дебиторская задолженность',
                value: metrics.receivables,
                icon: <ArrowUpRight className="h-4 w-4" />,
              },
              {
                name: 'Оборудование и ОС',
                value: 5000000,
                icon: <Building2 className="h-4 w-4" />,
              },
            ].map((asset, i) => (
              <div
                key={i}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                    {asset.icon}
                  </div>
                  <span className="text-xs font-black uppercase text-slate-900">{asset.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">
=======
                className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="text-text-muted flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                    {asset.icon}
                  </div>
                  <span className="text-text-primary text-xs font-black uppercase">
                    {asset.name}
                  </span>
                </div>
                <span className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                  {asset.value.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between px-4">
<<<<<<< HEAD
              <span className="text-sm font-black uppercase text-slate-400">Всего активов</span>
=======
              <span className="text-text-muted text-sm font-black uppercase">Всего активов</span>
>>>>>>> recover/cabinet-wip-from-stash
              <span className="text-base font-black text-emerald-600">
                {metrics.totalAssets.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD
        <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-50 p-4">
            <CardTitle className="text-base font-black uppercase tracking-tight text-rose-600">
              Обязательства (Liabilities)
            </CardTitle>
            <CardDescription className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardHeader className="border-border-subtle border-b p-4">
            <CardTitle className="text-base font-black uppercase tracking-tight text-rose-600">
              Обязательства (Liabilities)
            </CardTitle>
            <CardDescription className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Долги и обязательства компании
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4">
            {[
              {
                name: 'Кредиторская задолженность',
                value: metrics.payables,
                icon: <ArrowDownRight className="h-4 w-4" />,
              },
              {
                name: 'Кредиты и займы',
                value: metrics.debt,
                icon: <Banknote className="h-4 w-4" />,
              },
              {
                name: 'Налоговые обязательства',
                value: 1200000,
                icon: <Scale className="h-4 w-4" />,
              },
              {
                name: 'Прочие обязательства',
                value: 800000,
                icon: <AlertCircle className="h-4 w-4" />,
              },
            ].map((liability, i) => (
              <div
                key={i}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                    {liability.icon}
                  </div>
                  <span className="text-xs font-black uppercase text-slate-900">
                    {liability.name}
                  </span>
                </div>
                <span className="text-sm font-black text-slate-900">
=======
                className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="text-text-muted flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                    {liability.icon}
                  </div>
                  <span className="text-text-primary text-xs font-black uppercase">
                    {liability.name}
                  </span>
                </div>
                <span className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                  {liability.value.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between px-4">
<<<<<<< HEAD
              <span className="text-sm font-black uppercase text-slate-400">
=======
              <span className="text-text-muted text-sm font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Всего обязательств
              </span>
              <span className="text-base font-black text-rose-600">
                {metrics.totalLiabilities.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

<<<<<<< HEAD
      <Card className="flex flex-col items-center justify-between gap-3 rounded-xl border-none bg-slate-900 p-3 text-white shadow-2xl md:flex-row">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
=======
      <Card className="bg-text-primary flex flex-col items-center justify-between gap-3 rounded-xl border-none p-3 text-white shadow-2xl md:flex-row">
        <div className="space-y-2">
          <p className="text-accent-primary text-[10px] font-black uppercase tracking-[0.3em]">
>>>>>>> recover/cabinet-wip-from-stash
            Чистая стоимость компании (Net Worth)
          </p>
          <h3 className="text-sm font-black tracking-tighter">
            {metrics.netWorth.toLocaleString('ru-RU')} ₽
          </h3>
          <p className="text-xs italic text-white/40">
            "Собственный капитал компании за вычетом всех внешних обязательств."
          </p>
        </div>
        <div className="flex min-w-[240px] flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
<<<<<<< HEAD
          <p className="text-[10px] font-black uppercase text-white/40">ROI Инвестиций</p>
          <span className="text-sm font-black text-emerald-400">+24.5%</span>
          <Button className="h-10 rounded-xl bg-white px-6 text-[9px] font-black uppercase tracking-widest text-black shadow-xl hover:bg-indigo-50">
=======
          <p className="text-[10px] font-black uppercase text-white/40">
            <AcronymWithTooltip abbr="ROI" /> инвестиций
          </p>
          <span className="text-sm font-black text-emerald-400">+24.5%</span>
          <Button className="hover:bg-accent-primary/10 h-10 rounded-xl bg-white px-6 text-[9px] font-black uppercase tracking-widest text-black shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            Анализ эффективности
          </Button>
        </div>
      </Card>
    </div>
  );
}
