'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  FileText,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Scale,
  Percent,
  Wallet,
  AlertCircle,
<<<<<<< HEAD
=======
  RefreshCcw,
>>>>>>> recover/cabinet-wip-from-stash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_FINANCING_OFFERS = [
  {
    id: 'f1',
    type: 'Factoring',
    title: 'Мгновенный Факторинг',
    desc: 'Бренд получает оплату сразу, вы платите через 60 дней.',
    limit: '5,000,000 ₽',
    rate: '1.2%',
    period: '60 дней',
    icon: Zap,
    color: 'bg-amber-500',
    status: 'Доступно',
  },
  {
    id: 'f2',
    type: 'Credit',
    title: 'Кредитная Линия на подсорт',
    desc: 'Оборотные средства для срочного выкупа хитов продаж.',
    limit: '2,500,000 ₽',
    rate: '14% годовых',
    period: '12 месяцев',
    icon: Landmark,
<<<<<<< HEAD
    color: 'bg-indigo-600',
=======
    color: 'bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
    status: 'Пре-аппрув',
  },
];

export function B2BFintech() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 2000);
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="p-3 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                Fintech Gateway
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              B2B Fintech & Факторинг
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Финансовые инструменты для масштабирования ваших закупок и управления кэш-флоу.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className="border-none bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase text-emerald-600">
              Кредитный лимит: 7.5M ₽
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-10 p-3 pt-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Использовано
            </p>
            <h4 className="text-sm font-black tabular-nums text-slate-900">1.2M ₽</h4>
            <Progress value={16} className="mt-3 h-1 bg-slate-200" />
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              К оплате (30д)
            </p>
            <h4 className="text-sm font-black tabular-nums text-slate-900">450,000 ₽</h4>
=======
          <div className="bg-bg-surface2 border-border-subtle rounded-xl border p-4">
            <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
              Использовано
            </p>
            <h4 className="text-text-primary text-sm font-black tabular-nums">1.2M ₽</h4>
            <Progress value={16} className="bg-border-subtle mt-3 h-1" />
          </div>
          <div className="bg-bg-surface2 border-border-subtle rounded-xl border p-4">
            <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
              К оплате (30д)
            </p>
            <h4 className="text-text-primary text-sm font-black tabular-nums">450,000 ₽</h4>
>>>>>>> recover/cabinet-wip-from-stash
            <div className="mt-2 flex items-center gap-2">
              <Clock className="h-3 w-3 text-amber-500" />
              <span className="text-[9px] font-bold uppercase text-amber-600">
                Ближайший платеж: 12 фев
              </span>
            </div>
          </div>
<<<<<<< HEAD
          <div className="flex flex-col justify-between rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-indigo-400" />
=======
          <div className="bg-text-primary flex flex-col justify-between rounded-xl p-4 text-white">
            <div className="flex items-center gap-2">
              <BrainCircuit className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
              <span className="text-[9px] font-black uppercase tracking-widest">AI Scoring</span>
            </div>
            <div>
              <h4 className="text-base font-black uppercase leading-tight text-white">
                High Trust Level
              </h4>
              <p className="mt-1 text-[9px] font-bold uppercase text-white/40">
                Доступна пониженная ставка -0.5%
              </p>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="space-y-6">
<<<<<<< HEAD
          <h4 className="border-b pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
          <h4 className="text-text-muted border-b pb-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Доступные предложения
          </h4>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {MOCK_FINANCING_OFFERS.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setSelectedOffer(offer.id)}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all',
                  selectedOffer === offer.id
<<<<<<< HEAD
                    ? 'scale-102 border-indigo-600 bg-white shadow-2xl'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-300'
=======
                    ? 'border-accent-primary scale-102 bg-white shadow-2xl'
                    : 'border-border-subtle bg-bg-surface2 hover:border-border-default'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg',
                      offer.color
                    )}
                  >
                    {React.createElement(offer.icon, { className: 'h-6 w-6' })}
                  </div>
<<<<<<< HEAD
                  <Badge className="border-none bg-white/80 text-[8px] font-black uppercase text-slate-900 backdrop-blur-sm">
=======
                  <Badge className="text-text-primary border-none bg-white/80 text-[8px] font-black uppercase backdrop-blur-sm">
>>>>>>> recover/cabinet-wip-from-stash
                    {offer.type}
                  </Badge>
                </div>

                <div className="relative z-10 mt-6 space-y-2">
<<<<<<< HEAD
                  <h5 className="text-base font-black uppercase tracking-tighter text-slate-900">
                    {offer.title}
                  </h5>
                  <p className="text-xs font-medium leading-relaxed text-slate-500">{offer.desc}</p>
=======
                  <h5 className="text-text-primary text-base font-black uppercase tracking-tighter">
                    {offer.title}
                  </h5>
                  <p className="text-text-secondary text-xs font-medium leading-relaxed">
                    {offer.desc}
                  </p>
>>>>>>> recover/cabinet-wip-from-stash
                </div>

                <div className="relative z-10 mt-8 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
<<<<<<< HEAD
                    <p className="text-[8px] font-black uppercase text-slate-400">Лимит</p>
                    <p className="text-sm font-black text-slate-900">{offer.limit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-slate-400">Ставка</p>
                    <p className="text-sm font-black text-indigo-600">{offer.rate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-slate-400">Срок</p>
                    <p className="text-sm font-black text-slate-900">{offer.period}</p>
=======
                    <p className="text-text-muted text-[8px] font-black uppercase">Лимит</p>
                    <p className="text-text-primary text-sm font-black">{offer.limit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text-muted text-[8px] font-black uppercase">Ставка</p>
                    <p className="text-accent-primary text-sm font-black">{offer.rate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text-muted text-[8px] font-black uppercase">Срок</p>
                    <p className="text-text-primary text-sm font-black">{offer.period}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>

                {selectedOffer === offer.id && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
<<<<<<< HEAD
                    className="relative z-10 mt-8 flex items-center justify-between border-t border-slate-100 pt-8"
=======
                    className="border-border-subtle relative z-10 mt-8 flex items-center justify-between border-t pt-8"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">Одобрено AI</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply();
                      }}
                      disabled={isApplying}
<<<<<<< HEAD
                      className="h-10 rounded-xl bg-slate-900 px-8 text-[9px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
=======
                      className="bg-text-primary h-10 rounded-xl px-8 text-[9px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      {isApplying ? (
                        <RefreshCcw className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <ArrowRight className="mr-2 h-3 w-3" />
                      )}
                      Активировать
                    </Button>
                  </motion.div>
                )}

                <div className="absolute right-0 top-0 p-4 opacity-0 transition-opacity group-hover:opacity-5">
                  {React.createElement(offer.icon, { className: 'h-32 w-32' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Compliance */}
<<<<<<< HEAD
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                Безопасность сделок обеспечена Syntha Secure Pay
              </p>
              <p className="mt-0.5 text-[9px] font-bold uppercase text-slate-500">
=======
        <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-subtle flex h-12 w-12 items-center justify-center rounded-2xl border bg-white">
              <ShieldCheck className="text-accent-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-text-primary text-[11px] font-black uppercase tracking-tight">
                Безопасность сделок обеспечена Syntha Secure Pay
              </p>
              <p className="text-text-secondary mt-0.5 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Лицензированные финансовые партнеры • Смарт-контракты
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
<<<<<<< HEAD
            className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900"
=======
            className="text-text-muted hover:text-text-primary text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Посмотреть договор
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
