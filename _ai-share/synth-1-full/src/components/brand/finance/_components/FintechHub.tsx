'use client';

import {
  CreditCard,
  ShieldCheck,
  Scale,
  History,
  ArrowUpRight,
  Zap,
  Lock,
  DollarSign,
  Globe,
  FileText,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function FintechHub() {
  const escrowTransactions = [
    {
      id: 'TX-9021',
      partner: 'Guangzhou Factory #4',
      amount: 1250000,
      status: 'Locked',
      stage: 'Production',
    },
    {
      id: 'TX-8842',
      partner: 'Milan Leather Hub',
      amount: 450000,
      status: 'Released',
      stage: 'Quality Control OK',
    },
    {
      id: 'TX-9105',
      partner: 'Istanbul Denim Corp',
      amount: 890000,
      status: 'Locked',
      stage: 'Material Sourcing',
    },
  ];

  const activeClaims = [
    {
      id: 'CLM-442',
      store: 'Stockmann Helsinki',
      reason: 'Ткань: зацепки',
      status: 'AI Analyzing',
      timer: '42s',
    },
    {
      id: 'CLM-441',
      store: 'Selfridges London',
      reason: 'Фурнитура: брак',
      status: 'Resolved',
      result: 'Refund Approved',
    },
  ];

  const customsDocs = [
    { country: 'USA', duty: '12%', tax: '0%', status: 'Ready', form: '7501' },
    { country: 'EU (Germany)', duty: '0%', tax: '19%', status: 'Auto-Pay', form: 'T1' },
    { country: 'UK', duty: '4.5%', tax: '20%', status: 'Audit required', form: 'C88' },
  ];

  return (
    <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-4">
      {/* Top Section: Escrow & Credit Limit */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 text-white shadow-xl">
=======
        <Card className="bg-accent-primary relative overflow-hidden rounded-xl border-none text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <TrendingUp className="h-32 w-32" />
          </div>
          <CardHeader className="p-4 pb-0">
            <div className="flex items-start justify-between">
              <Badge className="mb-2 w-fit border-none bg-white/20 text-[9px] font-black uppercase tracking-widest text-white">
                Syntha Wallet & Yield
              </Badge>
<<<<<<< HEAD
              <Badge className="border-none bg-emerald-400 text-[9px] font-black uppercase text-indigo-900">
=======
              <Badge className="text-accent-primary border-none bg-emerald-400 text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Yield: 4.2% APY
              </Badge>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              Available Balance
            </CardTitle>
<<<<<<< HEAD
            <CardDescription className="font-medium text-indigo-100">
=======
            <CardDescription className="text-accent-primary/30 font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              Ваш оборотный капитал с функцией авто-кешбэка.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black tabular-nums">4,820,000</span>
                <span className="text-sm font-bold opacity-60">₽</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    Заморожено (Escrow)
                  </p>
                  <p className="mt-1 text-base font-bold">2,140,000 ₽</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    Бонусы за период
                  </p>
                  <p className="mt-1 text-base font-bold text-emerald-300">+12,400 ₽</p>
                </div>
              </div>
              <div className="flex gap-3">
<<<<<<< HEAD
                <Button className="h-12 flex-1 rounded-xl bg-white text-[10px] font-black uppercase text-indigo-600 shadow-lg hover:bg-indigo-50">
                  Вывести средства
                </Button>
                <Button className="h-12 flex-1 rounded-xl border border-indigo-400 bg-indigo-500 text-[10px] font-black uppercase text-white hover:bg-indigo-400">
=======
                <Button className="text-accent-primary hover:bg-accent-primary/10 h-12 flex-1 rounded-xl bg-white text-[10px] font-black uppercase shadow-lg">
                  Вывести средства
                </Button>
                <Button className="bg-accent-primary hover:bg-accent-primary border-accent-primary/40 h-12 flex-1 rounded-xl border text-[10px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                  Пополнить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-slate-100 bg-white shadow-xl">
          <div className="absolute right-0 top-0 p-4 text-indigo-600 opacity-5">
=======
        <Card className="border-border-subtle relative overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="text-accent-primary absolute right-0 top-0 p-4 opacity-5">
>>>>>>> recover/cabinet-wip-from-stash
            <CreditCard className="h-32 w-32" />
          </div>
          <CardHeader className="p-4 pb-0">
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="mb-2 w-fit border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
            >
              B2B Credit & Factoring
            </Badge>
            <CardTitle className="text-base font-black uppercase tracking-tighter text-slate-900">
              Credit Limit
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
=======
              className="border-accent-primary/20 text-accent-primary mb-2 w-fit text-[9px] font-black uppercase tracking-widest"
            >
              B2B Credit & Factoring
            </Badge>
            <CardTitle className="text-text-primary text-base font-black uppercase tracking-tighter">
              Credit Limit
            </CardTitle>
            <CardDescription className="text-text-secondary font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              Доступный лимит на закупку сырья и оплату мощностей.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 pt-6">
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-text-primary text-sm font-black tabular-nums">
                    3,500,000
                  </span>
                  <span className="text-text-muted text-sm font-bold">₽</span>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-600">
                  Score: 840/1000
                </span>
              </div>
              <Progress value={65} className="bg-bg-surface2 h-2" />
              <div className="text-text-muted flex justify-between text-[10px] font-bold uppercase">
                <span>Использовано: 1,250,000 ₽</span>
                <span>Доступно: 2,250,000 ₽</span>
              </div>
            </div>
<<<<<<< HEAD
            <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <Zap className="h-8 w-8 fill-current text-indigo-600" />
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-indigo-900">Спецпредложение</p>
                <p className="text-[11px] font-medium leading-tight text-indigo-700">
                  Увеличьте лимит до 5.0M ₽, подтвердив контракт с новым ритейлером.
                </p>
              </div>
              <Button size="sm" className="bg-indigo-600 text-[9px] font-bold uppercase text-white">
=======
            <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center gap-3 rounded-2xl border p-4">
              <Zap className="text-accent-primary h-8 w-8 fill-current" />
              <div className="flex-1">
                <p className="text-accent-primary text-[10px] font-black uppercase">
                  Спецпредложение
                </p>
                <p className="text-accent-primary text-[11px] font-medium leading-tight">
                  Увеличьте лимит до 5.0M ₽, подтвердив контракт с новым ритейлером.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-accent-primary text-[9px] font-bold uppercase text-white"
              >
>>>>>>> recover/cabinet-wip-from-stash
                Подать заявку
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Section: Smart Claims & Logistics */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
        <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm md:col-span-2">
=======
        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm md:col-span-2">
>>>>>>> recover/cabinet-wip-from-stash
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-rose-500" />
                <Badge
                  variant="outline"
                  className="border-rose-100 text-[8px] font-black uppercase text-rose-500"
                >
                  AI Smart Claims
                </Badge>
              </div>
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Активные претензии
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-[9px] font-black uppercase"
            >
              Новый спор
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-border-subtle divide-y">
              {activeClaims.map((claim) => (
                <div
                  key={claim.id}
<<<<<<< HEAD
                  className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/50"
=======
                  className="hover:bg-bg-surface2/80 flex items-center justify-between p-4 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        claim.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600'
<<<<<<< HEAD
                          : 'bg-indigo-50 text-indigo-600'
=======
                          : 'bg-accent-primary/10 text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {claim.status === 'Resolved' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <PlayCircle className="h-5 w-5 animate-pulse" />
                      )}
                    </div>
                    <div>
<<<<<<< HEAD
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {claim.id} • {claim.store}
                      </p>
                      <p className="text-sm font-bold text-slate-900">{claim.reason}</p>
=======
                      <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                        {claim.id} • {claim.store}
                      </p>
                      <p className="text-text-primary text-sm font-bold">{claim.reason}</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                  <div className="text-right">
                    {claim.status === 'Resolved' ? (
                      <Badge className="border-none bg-emerald-500 text-[9px] font-black uppercase text-white">
                        {claim.result}
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-2">
<<<<<<< HEAD
                        <span className="text-[10px] font-bold uppercase text-indigo-600">
                          AI Analyzing... {claim.timer}
                        </span>
                        <Progress value={65} className="h-1 w-12 bg-indigo-100" />
=======
                        <span className="text-accent-primary text-[10px] font-bold uppercase">
                          AI Analyzing... {claim.timer}
                        </span>
                        <Progress value={65} className="bg-accent-primary/15 h-1 w-12" />
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-none bg-slate-900 text-white shadow-sm">
=======
        <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none text-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Globe className="h-24 w-24" />
          </div>
          <CardHeader className="p-4 pb-4">
<<<<<<< HEAD
            <Badge className="mb-2 w-fit border-none bg-indigo-500 text-[8px] font-black uppercase tracking-widest text-white">
=======
            <Badge className="bg-accent-primary mb-2 w-fit border-none text-[8px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
              Logistics & Customs
            </Badge>
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Global Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 pt-0">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
<<<<<<< HEAD
                <p className="mb-2 text-[9px] font-black uppercase text-indigo-400">
=======
                <p className="text-accent-primary mb-2 text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  Customs & Tax Hub
                </p>
                <div className="space-y-2">
                  {customsDocs.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <span className="font-bold">{c.country}</span>
                      <div className="flex gap-2 font-black tabular-nums">
                        <span className="text-white/40">{c.duty} duty</span>
                        <span className="text-emerald-400">{c.tax} tax</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="text-[9px] font-black uppercase text-white/40">Best Rate</p>
                  <p className="text-sm font-bold">DHL Express</p>
                </div>
                <p className="text-xs font-bold text-emerald-400">-12% cost</p>
              </div>
            </div>
<<<<<<< HEAD
            <Button className="h-10 w-full rounded-xl bg-indigo-500 text-[9px] font-black uppercase text-white hover:bg-indigo-400">
=======
            <Button className="bg-accent-primary hover:bg-accent-primary h-10 w-full rounded-xl text-[9px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
              Оптимизировать экспорт
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
<<<<<<< HEAD
      <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm">
=======
      <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-4">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-[11px] font-medium">
              Последние операции в системе безопасных расчетов.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-bold uppercase">
            Вся история <History className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
<<<<<<< HEAD
            <table className="w-full border-t border-slate-50 text-left text-sm">
              <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
            <table className="border-border-subtle w-full border-t text-left text-sm">
              <thead className="bg-bg-surface2/80 text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                <tr>
                  <th className="px-8 py-4">ID / Транзакция</th>
                  <th className="px-8 py-4">Контрагент</th>
                  <th className="px-8 py-4">Сумма</th>
                  <th className="px-8 py-4">Этап проекта</th>
                  <th className="px-8 py-4">Статус</th>
                  <th className="px-8 py-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {escrowTransactions.map((tx) => (
<<<<<<< HEAD
                  <tr key={tx.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-8 py-5 font-bold text-slate-900">{tx.id}</td>
=======
                  <tr key={tx.id} className="hover:bg-bg-surface2/80 group transition-colors">
                    <td className="text-text-primary px-8 py-5 font-bold">{tx.id}</td>
>>>>>>> recover/cabinet-wip-from-stash
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-bg-surface2 h-8 w-8 rounded-full" />
                        <span className="text-text-secondary font-semibold">{tx.partner}</span>
                      </div>
                    </td>
<<<<<<< HEAD
                    <td className="px-8 py-5 font-black text-slate-900">
=======
                    <td className="text-text-primary px-8 py-5 font-black">
>>>>>>> recover/cabinet-wip-from-stash
                      {tx.amount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
<<<<<<< HEAD
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                        <span className="text-[11px] font-bold uppercase text-slate-500">
=======
                        <div className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full" />
                        <span className="text-text-secondary text-[11px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          {tx.stage}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge
                        variant="outline"
                        className={
                          tx.status === 'Locked'
                            ? 'border-amber-100 bg-amber-50 text-amber-600'
                            : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border-none hover:bg-white"
                      >
<<<<<<< HEAD
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
=======
                        <FileText className="text-text-muted group-hover:text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
