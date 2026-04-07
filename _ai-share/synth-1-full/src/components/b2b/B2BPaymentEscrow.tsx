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
  Info
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
      createdAt: '2026-02-05T10:00:00Z'
    },
    {
      id: 'ESC-9922',
      orderId: 'WH-9012',
      totalAmount: 480000,
      depositAmount: 96000,
      status: 'released',
      createdAt: '2026-01-20T14:30:00Z'
    }
  ];

  const transactions = b2bEscrowTransactions.length > 0 ? b2bEscrowTransactions : mockTxs;

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-emerald-100 text-emerald-600 uppercase font-black tracking-widest text-[9px]">
              Escrow_Protocol_v3.4
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Финансовый<br/>Гарант
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Безопасные B2B-транзакции через смарт-контракт эскроу. Средства удерживаются до подтверждения этапов поставки.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
            <History className="h-4 w-4" /> Журнал аудита
          </Button>
          <Button className="h-12 bg-slate-900 text-white rounded-xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
            Настройки эскроу <Lock className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Transaction List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 text-left">Активные эскроу-контракты</h3>
          {transactions.map((tx) => (
            <button
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-300 border flex flex-col gap-3",
                selectedTx?.id === tx.id 
                  ? "bg-white border-emerald-200 shadow-xl shadow-emerald-100 scale-[1.02]" 
                  : "bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    tx.status === 'released' ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
                  )}>
                    {tx.status === 'released' ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase">Заказ {tx.orderId}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{tx.id}</p>
                  </div>
                </div>
                <Badge className={cn(
                  "font-black text-[8px] uppercase tracking-widest",
                  tx.status === 'released' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                  {tx.status === 'released' ? 'Выплачено' : 'Удержано'}
                </Badge>
              </div>
              
              <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Удержанная сумма</p>
                  <p className="text-sm font-black text-slate-900">{tx.depositAmount.toLocaleString('ru-RU')} ₽</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Сумма контракта</p>
                  <p className="text-sm font-bold text-slate-600">{tx.totalAmount.toLocaleString('ru-RU')} ₽</p>
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
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <ShieldCheck className="h-64 w-64" />
                  </div>

                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Жизненный цикл эскроу</p>
                        <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Верификация контракта</h3>
                      </div>
                      <Badge className="bg-slate-900 text-white border-none font-black text-[10px] px-4 py-1.5 uppercase">v3.4 Защищено</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-slate-50 space-y-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-indigo-600" />
                            <h4 className="text-xs font-black uppercase text-slate-900">Депозит ритейлера</h4>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-slate-900">{selectedTx.depositAmount.toLocaleString('ru-RU')} ₽</p>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Подтверждено и удержано</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 space-y-4 opacity-50">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-slate-400" />
                            <h4 className="text-xs font-black uppercase text-slate-900">Выплата остатка</h4>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-slate-400">{(selectedTx.totalAmount - selectedTx.depositAmount).toLocaleString('ru-RU')} ₽</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-300 uppercase">Ожидает этапа</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex flex-col gap-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 text-left">Требуемые действия</h4>
                          <Button className="h-10 bg-indigo-600 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-indigo-200">
                            Подтвердить получение <FileCheck className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-8 font-black uppercase text-[10px] tracking-widest gap-2">
                            Открыть спор <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="p-4 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
                          <Info className="h-5 w-5 text-slate-300" />
                          <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                            Как только доставка будет подтверждена ритейлером, удержанные средства будут переведены бренду в течение 24 часов.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-tight">Движок комплаенса</h4>
                    <p className="text-[11px] font-medium text-white/60 leading-relaxed">
                      "Все транзакции автоматически проверяются на соответствие региональным торговым правилам и политике AML."
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Комплаенс пройден</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                  </Card>

                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Подтверждение средств</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <CreditCard className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-900 uppercase">Верифицированный кошелек</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Банк: Premium International</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest gap-2 p-0 h-auto hover:bg-transparent">
                      Просмотреть сертификат <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
                <Lock className="h-20 w-20 text-slate-300" />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Выберите контракт для просмотра деталей безопасности</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
