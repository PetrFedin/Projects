'use client';

import {
  Calculator,
  Download,
  Plus,
  PieChart,
  DollarSign,
  Scale,
  Wallet,
  Package,
  FileText,
  Banknote,
  Percent,
  Zap,
  ShieldCheck,
  AlertCircle,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockBankAccounts } from '../_fixtures/finance-data';

interface FinancialSidebarProps {
  setActiveView: (view: any) => void;
  activeView: string;
  isAdmin: boolean;
}

export function FinancialSidebar({ setActiveView, activeView, isAdmin }: FinancialSidebarProps) {
  return (
    <div className="space-y-10 lg:col-span-4">
<<<<<<< HEAD
      <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 text-white shadow-2xl">
=======
      <Card className="bg-accent-primary relative overflow-hidden rounded-xl border-none text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="absolute right-0 top-0 rotate-12 p-3 opacity-10">
          <Zap className="h-48 w-48" />
        </div>
        <CardHeader className="relative z-10 p-3">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-xl backdrop-blur-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-base font-black uppercase leading-none tracking-tight">
                AI Advisor
              </CardTitle>
              <p className="mt-2 text-[8px] font-black uppercase tracking-widest text-white/40">
                Financial Intelligence
              </p>
            </div>
          </div>
          <CardDescription className="text-xs font-medium leading-relaxed text-white/70">
            Интеллектуальный анализ вашей экономики на основе данных платформы и банковских выписок.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6 p-3 pt-0">
          <div className="space-y-4">
            {[
              {
                title: 'Оптимизация налогов',
                text: 'Вы можете снизить налоговую нагрузку на 4.2% в этом квартале, применив льготу для IT-партнеров.',
                type: 'tip',
              },
              {
                title: 'Риск кассового разрыва',
                text: 'Внимание: 15.02 ожидаются крупные выплаты (ФОТ + Аренда). Рекомендуется ускорить подтверждение INV-883.',
                type: 'alert',
              },
              {
                title: 'Инвестиционный потенциал',
                text: 'Текущий индекс устойчивости (88%) позволяет привлечь кредитную линию до 15 млн ₽ под 8.5%.',
                type: 'insight',
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="group relative cursor-pointer space-y-2 overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-3 transition-all hover:bg-white/15"
              >
                {tip.type === 'alert' && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-rose-400" />
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50 transition-colors group-hover:text-white/90">
                    {tip.title}
                  </span>
                  {tip.type === 'alert' && (
                    <AlertCircle className="h-3.5 w-3.5 animate-pulse text-rose-300" />
                  )}
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-white/80">{tip.text}</p>
              </div>
            ))}
          </div>
<<<<<<< HEAD
          <Button className="h-10 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-2xl transition-transform hover:bg-indigo-50 active:scale-95">
=======
          <Button className="text-accent-primary hover:bg-accent-primary/10 h-10 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-2xl transition-transform active:scale-95">
>>>>>>> recover/cabinet-wip-from-stash
            Сформировать стратегию FW26
          </Button>
        </CardContent>
      </Card>

<<<<<<< HEAD
      <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 shadow-inner">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">
                Интеграция с банком
              </CardTitle>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
      <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
        <CardHeader className="border-border-subtle border-b p-3">
          <div className="flex items-center gap-3">
            <div className="bg-bg-surface2 text-text-muted flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-text-primary text-xs font-black uppercase tracking-widest">
                Интеграция с банком
              </CardTitle>
              <p className="text-text-muted mt-1 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Партнер: Alfa Bank Business
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-3">
          <div className="flex items-center justify-between">
<<<<<<< HEAD
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Статус синхронизации
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black uppercase text-emerald-600">
                Активна: 10 мин назад
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {mockBankAccounts.map((account) => (
              <div
                key={account.id}
<<<<<<< HEAD
                className="group flex cursor-pointer items-center justify-between rounded-[1.5rem] border border-slate-100 bg-slate-50 p-3 transition-all hover:border-indigo-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:text-indigo-600">
                    {account.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-600">
                    {account.name}
                  </span>
                </div>
                <span className="text-sm font-black tabular-nums text-slate-900">
=======
                className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group flex cursor-pointer items-center justify-between rounded-[1.5rem] border p-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-text-muted group-hover:text-accent-primary flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-colors">
                    {account.icon}
                  </div>
                  <span className="text-text-secondary text-[10px] font-bold uppercase">
                    {account.name}
                  </span>
                </div>
                <span className="text-text-primary text-sm font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                  {account.balance.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
<<<<<<< HEAD
            className="h-12 w-full gap-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:text-indigo-600"
=======
            className="text-text-muted hover:text-accent-primary h-12 w-full gap-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Управление счетами <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
