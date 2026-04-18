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
    retailer: 'Демо-магазин · Москва 1',
    amount: 2400000,
    status: 'Eligible',
    rate: '1.2%',
    advance: '80%',
  },
  {
    id: 'inv-0015',
    retailer: 'Демо-магазин · Москва 2',
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
      <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="rounded-lg bg-emerald-600 p-1.5 text-white shadow-lg shadow-emerald-100/50">
              <Landmark className="h-4 w-4" />
            </div>
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
        <Card className="border-border-subtle group space-y-3.5 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-emerald-100">
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
            <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
              Кредитный лимит
            </p>
            <p className="text-text-primary text-sm font-bold uppercase leading-none tracking-tighter">
              45,000,000 ₽
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-bold uppercase leading-none tracking-widest">
              <span className="text-text-muted">Использовано</span>
              <span className="text-emerald-600">12%</span>
            </div>
            <Progress value={12} className="h-1 border border-emerald-100/30 bg-emerald-50" />
          </div>
        </Card>

        <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-3.5 rounded-xl border bg-white p-4 shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-lg border p-2 shadow-inner transition-transform group-hover:scale-105">
              <BarChart3 className="h-4 w-4" />
            </div>
            <Badge
              variant="outline"
              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
            >
              SPEED
            </Badge>
          </div>
          <div className="space-y-0.5">
            <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
              Ср. время выплаты
            </p>
            <p className="text-text-primary text-sm font-bold uppercase leading-none tracking-tighter">
              4.2 <span className="text-text-muted text-xs">часа</span>
            </p>
          </div>
          <p className="text-text-muted text-[8px] font-bold uppercase leading-tight tracking-tight opacity-60">
            Скорость получения средств на счет после отгрузки.
          </p>
        </Card>

        <Card className="shadow-accent-primary/10 bg-text-primary hover:bg-text-primary/90 group relative space-y-3.5 overflow-hidden rounded-xl border-none p-4 text-white shadow-xl transition-colors">
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
                  className="border-text-primary bg-text-primary/90 text-text-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-[8px] font-bold shadow-lg transition-transform hover:-translate-y-1"
                >
                  B{i}
                </div>
              ))}
              <div className="border-text-primary bg-accent-primary flex h-8 w-8 items-center justify-center rounded-full border-2 text-[8px] font-bold text-white shadow-lg">
                +4
              </div>
            </div>
            <p className="text-text-muted text-[8px] font-bold uppercase leading-tight tracking-tight opacity-80">
              Инвойсы доступны для выкупа 7 банками Syntha.
            </p>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
        <CardHeader className="bg-bg-surface2/80 border-border-subtle flex flex-row items-center justify-between border-b p-4">
          <div className="space-y-0.5">
            <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
              <FileText className="text-accent-primary h-3.5 w-3.5" /> Дебиторская задолженность
            </CardTitle>
            <CardDescription className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
              Инвойсы для мгновенного финансирования
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-accent-primary hover:bg-accent-primary/10 h-7 rounded-lg px-2.5 text-[8px] font-bold uppercase tracking-widest transition-all"
          >
            Архив
          </Button>
        </CardHeader>
        <CardContent className="p-0">
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
                              ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                              : 'border-amber-100 bg-amber-50 text-amber-600'
                        )}
                      >
                        {inv.status === 'Funded'
                          ? 'Выплачено'
                          : inv.status === 'Eligible'
                            ? 'Доступно'
                            : 'На проверке'}
                      </Badge>
                      <span className="text-text-muted text-[8px] font-bold uppercase tracking-widest opacity-60">
                        Ставка: {inv.rate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest">
                      Сумма инвойса
                    </p>
                    <p className="text-text-primary text-[13px] font-bold uppercase tabular-nums leading-none">
                      {fmtMoney(inv.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase leading-none tracking-widest">
                      Макс. аванс
                    </p>
                    <p className="text-[13px] font-bold uppercase tabular-nums leading-none text-emerald-600">
                      {fmtMoney((inv.amount * parseFloat(inv.advance)) / 100)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {inv.status === 'Eligible' ? (
                      <Button className="bg-text-primary hover:bg-accent-primary h-8 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all">
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
                        className="border-border-default text-text-muted hover:bg-bg-surface2 h-8 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all"
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
        <CardFooter className="bg-bg-surface2/30 border-border-subtle flex items-center justify-between border-t p-4">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">
              2 инвойса требуют уточнения данных для выплаты.
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-text-muted hover:text-accent-primary h-7 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all"
          >
            Справка <ArrowUpRight className="ml-1 h-2.5 w-2.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
