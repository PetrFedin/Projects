'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle2,
  FileCheck,
  CreditCard,
  History,
  Info,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { EscrowTransaction } from '@/lib/types/b2b';
import { cn } from '@/lib/cn';

export function B2BPaymentEscrow() {
  const { viewRole } = useUIState();
  const { b2bEscrowTransactions, addEscrowTransaction } = useB2BState();
  const [selectedTx, setSelectedTx] = useState<EscrowTransaction | null>(null);

  const mockTxs: EscrowTransaction[] = [
    {
      id: 'ESC-9921',
      orderId: 'WH-8241',
      totalAmount: 1250000,
      depositAmount: 250000,
      status: 'held',
      createdAt: '2026-02-05T10:00:00Z',
    },
    {
      id: 'ESC-9922',
      orderId: 'WH-9012',
      totalAmount: 480000,
      depositAmount: 96000,
      status: 'released',
      createdAt: '2026-01-20T14:30:00Z',
    },
  ];

  const transactions = b2bEscrowTransactions.length > 0 ? b2bEscrowTransactions : mockTxs;

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-4 bg-slate-50 p-4">
=======
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4">
>>>>>>> recover/cabinet-wip-from-stash
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-emerald-100 text-[9px] font-black uppercase tracking-widest text-emerald-600"
            >
              Escrow_Protocol_v3.4
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Финансовый
            <br />
            Гарант
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Безопасные B2B-транзакции через смарт-контракт эскроу. Средства удерживаются до
            подтверждения этапов поставки.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
<<<<<<< HEAD
            className="h-12 gap-2 rounded-xl border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <History className="h-4 w-4" /> Журнал аудита
          </Button>
          <Button className="h-12 gap-2 rounded-xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
            className="border-border-default h-12 gap-2 rounded-xl bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <History className="h-4 w-4" /> Журнал аудита
          </Button>
          <Button className="bg-text-primary h-12 gap-2 rounded-xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            Настройки эскроу <Lock className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Transaction List */}
        <div className="space-y-4 lg:col-span-5">
<<<<<<< HEAD
          <h3 className="px-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
          <h3 className="text-text-muted px-2 text-left text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Активные эскроу-контракты
          </h3>
          {transactions.map((tx) => (
            <button
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className={cn(
                'flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-300',
                selectedTx?.id === tx.id
                  ? 'scale-[1.02] border-emerald-200 bg-white shadow-xl shadow-emerald-100'
<<<<<<< HEAD
                  : 'border-slate-100 bg-white/50 hover:border-slate-200 hover:bg-white'
=======
                  : 'border-border-subtle hover:border-border-default bg-white/50 hover:bg-white'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      tx.status === 'released'
                        ? 'bg-emerald-100 text-emerald-600'
<<<<<<< HEAD
                        : 'bg-indigo-100 text-indigo-600'
=======
                        : 'bg-accent-primary/15 text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {tx.status === 'released' ? (
                      <Unlock className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div>
<<<<<<< HEAD
                    <p className="text-xs font-black uppercase text-slate-900">
                      Заказ {tx.orderId}
                    </p>
                    <p className="text-[9px] font-bold uppercase text-slate-400">{tx.id}</p>
=======
                    <p className="text-text-primary text-xs font-black uppercase">
                      Заказ {tx.orderId}
                    </p>
                    <p className="text-text-muted text-[9px] font-bold uppercase">{tx.id}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
                <Badge
                  className={cn(
                    'text-[8px] font-black uppercase tracking-widest',
                    tx.status === 'released'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  )}
                >
                  {tx.status === 'released' ? 'Выплачено' : 'Удержано'}
                </Badge>
              </div>

<<<<<<< HEAD
              <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase leading-none tracking-widest text-slate-400">
                    Удержанная сумма
                  </p>
                  <p className="text-sm font-black text-slate-900">
=======
              <div className="border-border-subtle flex items-end justify-between border-t pt-4">
                <div className="space-y-1">
                  <p className="text-text-muted text-[8px] font-black uppercase leading-none tracking-widest">
                    Удержанная сумма
                  </p>
                  <p className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    {tx.depositAmount.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="space-y-1 text-right">
<<<<<<< HEAD
                  <p className="text-[8px] font-black uppercase leading-none tracking-widest text-slate-400">
                    Сумма контракта
                  </p>
                  <p className="text-sm font-bold text-slate-600">
=======
                  <p className="text-text-muted text-[8px] font-black uppercase leading-none tracking-widest">
                    Сумма контракта
                  </p>
                  <p className="text-text-secondary text-sm font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                    {tx.totalAmount.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Status & Controls */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedTx ? (
              <motion.div
                key={selectedTx.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
<<<<<<< HEAD
                <Card className="relative overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl shadow-slate-200/50">
=======
                <Card className="relative overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
                  <div className="absolute right-0 top-0 p-4 opacity-[0.03]">
                    <ShieldCheck className="h-64 w-64" />
                  </div>

                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
<<<<<<< HEAD
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Жизненный цикл эскроу
                        </p>
                        <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                          Верификация контракта
                        </h3>
                      </div>
                      <Badge className="border-none bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase text-white">
=======
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                          Жизненный цикл эскроу
                        </p>
                        <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
                          Верификация контракта
                        </h3>
                      </div>
                      <Badge className="bg-text-primary border-none px-4 py-1.5 text-[10px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                        v3.4 Защищено
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="space-y-6">
<<<<<<< HEAD
                        <div className="space-y-4 rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-indigo-600" />
                            <h4 className="text-xs font-black uppercase text-slate-900">
=======
                        <div className="bg-bg-surface2 space-y-4 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="text-accent-primary h-5 w-5" />
                            <h4 className="text-text-primary text-xs font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                              Депозит ритейлера
                            </h4>
                          </div>
                          <div className="space-y-1">
<<<<<<< HEAD
                            <p className="text-sm font-black text-slate-900">
=======
                            <p className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                              {selectedTx.depositAmount.toLocaleString('ru-RU')} ₽
                            </p>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
<<<<<<< HEAD
                              <span className="text-[10px] font-bold uppercase text-slate-400">
=======
                              <span className="text-text-muted text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                Подтверждено и удержано
                              </span>
                            </div>
                          </div>
                        </div>

<<<<<<< HEAD
                        <div className="space-y-4 rounded-xl bg-slate-50 p-4 opacity-50">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-slate-400" />
                            <h4 className="text-xs font-black uppercase text-slate-900">
=======
                        <div className="bg-bg-surface2 space-y-4 rounded-xl p-4 opacity-50">
                          <div className="flex items-center gap-3">
                            <DollarSign className="text-text-muted h-5 w-5" />
                            <h4 className="text-text-primary text-xs font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                              Выплата остатка
                            </h4>
                          </div>
                          <div className="space-y-1">
<<<<<<< HEAD
                            <p className="text-sm font-black text-slate-400">
=======
                            <p className="text-text-muted text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                              {(selectedTx.totalAmount - selectedTx.depositAmount).toLocaleString(
                                'ru-RU'
                              )}{' '}
                              ₽
                            </p>
                            <div className="flex items-center gap-2">
<<<<<<< HEAD
                              <Clock className="h-3 w-3 text-slate-300" />
                              <span className="text-[10px] font-bold uppercase text-slate-300">
=======
                              <Clock className="text-text-muted h-3 w-3" />
                              <span className="text-text-muted text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                Ожидает этапа
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex flex-col gap-3">
<<<<<<< HEAD
                          <h4 className="ml-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Требуемые действия
                          </h4>
                          <Button className="h-10 gap-2 rounded-2xl bg-indigo-600 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-200">
=======
                          <h4 className="text-text-muted ml-2 text-left text-[10px] font-black uppercase tracking-widest">
                            Требуемые действия
                          </h4>
                          <Button className="bg-accent-primary shadow-accent-primary/15 h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                            Подтвердить получение <FileCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
<<<<<<< HEAD
                            className="h-10 gap-2 rounded-2xl border-slate-200 px-8 text-[10px] font-black uppercase tracking-widest"
=======
                            className="border-border-default h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            Открыть спор <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>

<<<<<<< HEAD
                        <div className="flex flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed border-slate-100 p-4 text-center">
                          <Info className="h-5 w-5 text-slate-300" />
                          <p className="text-[10px] font-medium leading-relaxed text-slate-400">
=======
                        <div className="border-border-subtle flex flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed p-4 text-center">
                          <Info className="text-text-muted h-5 w-5" />
                          <p className="text-text-muted text-[10px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                            Как только доставка будет подтверждена ритейлером, удержанные средства
                            будут переведены бренду в течение 24 часов.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
<<<<<<< HEAD
                  <Card className="space-y-6 rounded-xl border-none bg-slate-900 p-4 text-white shadow-2xl shadow-slate-200/50">
=======
                  <Card className="bg-text-primary space-y-6 rounded-xl border-none p-4 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
                    <h4 className="text-sm font-black uppercase tracking-tight">
                      Движок комплаенса
                    </h4>
                    <p className="text-[11px] font-medium leading-relaxed text-white/60">
                      "Все транзакции автоматически проверяются на соответствие региональным
                      торговым правилам и политике AML."
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                        Комплаенс пройден
                      </span>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                  </Card>

<<<<<<< HEAD
                  <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-slate-200/50">
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                      Подтверждение средств
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                        <CreditCard className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-900">
                          Верифицированный кошелек
                        </p>
                        <p className="text-[8px] font-bold uppercase text-slate-400">
=======
                  <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
                    <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                      Подтверждение средств
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-surface2 border-border-subtle flex h-12 w-12 items-center justify-center rounded-xl border">
                        <CreditCard className="text-text-muted h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-primary text-[10px] font-black uppercase">
                          Верифицированный кошелек
                        </p>
                        <p className="text-text-muted text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Банк: Premium International
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-auto w-full gap-2 p-0 text-[10px] font-black uppercase tracking-widest hover:bg-transparent"
                    >
                      Просмотреть сертификат <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-4 opacity-30">
<<<<<<< HEAD
                <Lock className="h-20 w-20 text-slate-300" />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
=======
                <Lock className="text-text-muted h-20 w-20" />
                <p className="text-text-muted text-[11px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Выберите контракт для просмотра деталей безопасности
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
