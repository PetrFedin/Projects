'use client';

import React, { useState } from 'react';
import {
  Landmark,
  DollarSign,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  RefreshCw,
  Clock,
  Wallet,
  BarChart3,
  Handshake,
  Scale,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { fmtMoney } from '@/lib/format';

const MOCK_FACTORING_INVOICES = [
  {
    id: 'inv-0012',
<<<<<<< HEAD
    retailer: 'Podium',
=======
    retailer: 'Демо-магазин · Москва 1',
>>>>>>> recover/cabinet-wip-from-stash
    amount: 2400000,
    status: 'Eligible',
    rate: '1.2%',
    advance: '80%',
  },
  {
    id: 'inv-0015',
<<<<<<< HEAD
    retailer: 'ЦУМ',
=======
    retailer: 'Демо-магазин · Москва 2',
>>>>>>> recover/cabinet-wip-from-stash
    amount: 1200000,
    status: 'Funded',
    rate: '1.1%',
    advance: '90%',
  },
  {
    id: 'inv-0018',
    retailer: 'Boutique No.7',
    amount: 3100000,
    status: 'Under Review',
    rate: '1.5%',
    advance: '75%',
  },
];

export function FactoringAutomation() {
  return (
    <div className="space-y-4 pb-24 duration-700 animate-in fade-in">
<<<<<<< HEAD
      <header className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
=======
      <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="rounded-lg bg-emerald-600 p-1.5 text-white shadow-lg shadow-emerald-100/50">
              <Landmark className="h-4 w-4" />
            </div>
<<<<<<< HEAD
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
              Автоматический Факторинг
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Автоматическое финансирование дебиторской задолженности.
          </p>
        </div>
        <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <Button
            variant="ghost"
            className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
=======
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
              Автоматический Факторинг
            </h1>
          </div>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Автоматическое финансирование дебиторской задолженности.
          </p>
        </div>
        <div className="bg-bg-surface2 border-border-default flex gap-2 rounded-xl border p-1 shadow-inner">
          <Button
            variant="ghost"
            className="text-text-secondary border-border-default hover:text-accent-primary h-7 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Scale className="mr-1.5 h-3 w-3" /> Лимиты
          </Button>
          <Button className="h-7 rounded-lg bg-emerald-600 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-emerald-700">
            <Zap className="mr-1.5 h-3 w-3 fill-white" /> Финансировать все
          </Button>
        </div>
      </header>

      {/* Financial Health Dashboard */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
        <Card className="group space-y-3.5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100">
=======
        <Card className="border-border-subtle group space-y-3.5 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-emerald-100">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="flex items-start justify-between">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
              <Wallet className="h-4 w-4" />
            </div>
            <Badge
              variant="outline"
              className="h-4 border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm"
            >
              ДОСТУПНО
            </Badge>
          </div>
          <div className="space-y-0.5">
<<<<<<< HEAD
            <p className="text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400">
              Кредитный лимит
            </p>
            <p className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
            <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
              Кредитный лимит
            </p>
            <p className="text-text-primary text-sm font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              45,000,000 ₽
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-bold uppercase leading-none tracking-widest">
<<<<<<< HEAD
              <span className="text-slate-400">Использовано</span>
=======
              <span className="text-text-muted">Использовано</span>
>>>>>>> recover/cabinet-wip-from-stash
              <span className="text-emerald-600">12%</span>
            </div>
            <Progress value={12} className="h-1 border border-emerald-100/30 bg-emerald-50" />
          </div>
        </Card>

<<<<<<< HEAD
        <Card className="group space-y-3.5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
          <div className="flex items-start justify-between">
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-2 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
=======
        <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-3.5 rounded-xl border bg-white p-4 shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-lg border p-2 shadow-inner transition-transform group-hover:scale-105">
>>>>>>> recover/cabinet-wip-from-stash
              <BarChart3 className="h-4 w-4" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="h-4 border-indigo-100 bg-indigo-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm"
=======
              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              SPEED
            </Badge>
          </div>
          <div className="space-y-0.5">
<<<<<<< HEAD
            <p className="text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400">
              Ср. время выплаты
            </p>
            <p className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
              4.2 <span className="text-xs text-slate-400">часа</span>
            </p>
          </div>
          <p className="text-[8px] font-bold uppercase leading-tight tracking-tight text-slate-400 opacity-60">
=======
            <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
              Ср. время выплаты
            </p>
            <p className="text-text-primary text-sm font-bold uppercase leading-none tracking-tighter">
              4.2 <span className="text-text-muted text-xs">часа</span>
            </p>
          </div>
          <p className="text-text-muted text-[8px] font-bold uppercase leading-tight tracking-tight opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
            Скорость получения средств на счет после отгрузки.
          </p>
        </Card>

<<<<<<< HEAD
        <Card className="group relative space-y-3.5 overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl shadow-indigo-100/30 transition-colors hover:bg-slate-800">
=======
        <Card className="shadow-accent-primary/10 bg-text-primary hover:bg-text-primary/90 group relative space-y-3.5 overflow-hidden rounded-xl border-none p-4 text-white shadow-xl transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
          <Handshake className="absolute -right-6 -top-4 h-24 w-24 text-emerald-500 opacity-10 transition-transform duration-700 group-hover:scale-110" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Активные партнеры</h3>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-[8px] font-bold text-slate-400 shadow-lg transition-transform hover:-translate-y-1"
=======
                  className="border-text-primary bg-text-primary/90 text-text-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-[8px] font-bold shadow-lg transition-transform hover:-translate-y-1"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  B{i}
                </div>
              ))}
<<<<<<< HEAD
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-indigo-600 text-[8px] font-bold text-white shadow-lg">
                +4
              </div>
            </div>
            <p className="text-[8px] font-bold uppercase leading-tight tracking-tight text-slate-400 opacity-80">
=======
              <div className="border-text-primary bg-accent-primary flex h-8 w-8 items-center justify-center rounded-full border-2 text-[8px] font-bold text-white shadow-lg">
                +4
              </div>
            </div>
            <p className="text-text-muted text-[8px] font-bold uppercase leading-tight tracking-tight opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
              Инвойсы доступны для выкупа 7 банками Syntha.
            </p>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
<<<<<<< HEAD
      <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="space-y-0.5">
            <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-700">
              <FileText className="h-3.5 w-3.5 text-indigo-600" /> Дебиторская задолженность
            </CardTitle>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
      <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
        <CardHeader className="bg-bg-surface2/80 border-border-subtle flex flex-row items-center justify-between border-b p-4">
          <div className="space-y-0.5">
            <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
              <FileText className="text-accent-primary h-3.5 w-3.5" /> Дебиторская задолженность
            </CardTitle>
            <CardDescription className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Инвойсы для мгновенного финансирования
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
<<<<<<< HEAD
            className="h-7 rounded-lg px-2.5 text-[8px] font-bold uppercase tracking-widest text-indigo-600 transition-all hover:bg-indigo-50"
=======
            className="text-accent-primary hover:bg-accent-primary/10 h-7 rounded-lg px-2.5 text-[8px] font-bold uppercase tracking-widest transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Архив
          </Button>
        </CardHeader>
        <CardContent className="p-0">
<<<<<<< HEAD
          <div className="divide-y divide-slate-50">
            {MOCK_FACTORING_INVOICES.map((inv) => (
              <div
                key={inv.id}
                className="group flex items-center justify-between p-4 transition-all hover:bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 shadow-inner transition-transform group-hover:scale-105">
                    #{inv.id.split('-')[1]}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
=======
          <div className="divide-border-subtle divide-y">
            {MOCK_FACTORING_INVOICES.map((inv) => (
              <div
                key={inv.id}
                className="hover:bg-bg-surface2/80 group flex items-center justify-between p-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-bg-surface2 border-border-subtle text-text-muted flex h-10 w-10 items-center justify-center rounded-xl border text-[10px] font-bold shadow-inner transition-transform group-hover:scale-105">
                    #{inv.id.split('-')[1]}
                  </div>
                  <div>
                    <p className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase leading-none tracking-tight transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                      {inv.retailer}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-3.5 border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                          inv.status === 'Funded'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                            : inv.status === 'Eligible'
<<<<<<< HEAD
                              ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
=======
                              ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
>>>>>>> recover/cabinet-wip-from-stash
                              : 'border-amber-100 bg-amber-50 text-amber-600'
                        )}
                      >
                        {inv.status === 'Funded'
                          ? 'Выплачено'
                          : inv.status === 'Eligible'
                            ? 'Доступно'
                            : 'На проверке'}
                      </Badge>
<<<<<<< HEAD
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
=======
                      <span className="text-text-muted text-[8px] font-bold uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                        Ставка: {inv.rate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
<<<<<<< HEAD
                    <p className="mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                      Сумма инвойса
                    </p>
                    <p className="text-[13px] font-bold uppercase tabular-nums leading-none text-slate-900">
=======
                    <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest">
                      Сумма инвойса
                    </p>
                    <p className="text-text-primary text-[13px] font-bold uppercase tabular-nums leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                      {fmtMoney(inv.amount)}
                    </p>
                  </div>
                  <div className="text-right">
<<<<<<< HEAD
                    <p className="mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                    <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Макс. аванс
                    </p>
                    <p className="text-[13px] font-bold uppercase tabular-nums leading-none text-emerald-600">
                      {fmtMoney((inv.amount * parseFloat(inv.advance)) / 100)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {inv.status === 'Eligible' ? (
<<<<<<< HEAD
                      <Button className="h-8 rounded-lg bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-indigo-600">
=======
                      <Button className="bg-text-primary hover:bg-accent-primary h-8 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                        Получить аванс
                      </Button>
                    ) : inv.status === 'Funded' ? (
                      <Button
                        variant="outline"
                        disabled
                        className="h-8 rounded-lg border-emerald-100 bg-emerald-50 px-4 text-[9px] font-bold uppercase tracking-widest text-emerald-600 opacity-100 shadow-sm"
                      >
                        <CheckCircle2 className="mr-1.5 h-3 w-3" /> Выплачено
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
<<<<<<< HEAD
                        className="h-8 rounded-lg border-slate-200 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-50"
=======
                        className="border-border-default text-text-muted hover:bg-bg-surface2 h-8 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        Статус
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
<<<<<<< HEAD
        <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 p-4">
=======
        <CardFooter className="bg-bg-surface2/30 border-border-subtle flex items-center justify-between border-t p-4">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">
              2 инвойса требуют уточнения данных для выплаты.
            </p>
          </div>
          <Button
            variant="ghost"
<<<<<<< HEAD
            className="h-7 rounded-lg text-[8px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:text-indigo-600"
=======
            className="text-text-muted hover:text-accent-primary h-7 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Справка <ArrowUpRight className="ml-1 h-2.5 w-2.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
