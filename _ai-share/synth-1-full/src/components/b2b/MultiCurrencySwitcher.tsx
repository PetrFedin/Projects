'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Coins,
  ArrowRight,
  Info,
  Banknote,
  Wallet,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function MultiCurrencySwitcher() {
  const { activeCurrency, setCurrency } = useUIState();

  const currencies = [
    { id: 'RUB', symbol: '₽', label: 'Российский рубль', rate: 1, icon: Banknote },
    { id: 'USD', symbol: '$', label: 'Доллар США', rate: 0.011, icon: Banknote },
    { id: 'EUR', symbol: '€', label: 'Евро', rate: 0.01, icon: Wallet },
    { id: 'AED', symbol: 'د.إ', label: 'Дирхам ОАЭ', rate: 0.04, icon: Coins },
  ] as const;

  return (
    <div className="flex max-w-sm flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-2xl">
      <div className="mb-2 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-600" />
            <Badge
              variant="outline"
              className="border-indigo-100 text-[8px] font-black uppercase tracking-widest text-indigo-600"
            >
              Global_Engine_v1
            </Badge>
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
            Валюта расчетов
          </h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400">
          <RefreshCw className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {currencies.map((curr) => (
          <button
            key={curr.id}
            onClick={() => setCurrency(curr.id)}
            className={cn(
              'group flex items-center justify-between rounded-2xl border p-4 transition-all',
              activeCurrency === curr.id
                ? 'border-slate-900 bg-slate-900 shadow-xl shadow-slate-200'
                : 'border-transparent bg-slate-50 hover:bg-slate-100'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                  activeCurrency === curr.id
                    ? 'bg-white/10 text-white'
                    : 'border border-slate-100 bg-white text-slate-400'
                )}
              >
                <curr.icon className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <p
                  className={cn(
                    'text-[10px] font-black uppercase tracking-widest',
                    activeCurrency === curr.id ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {curr.id}
                </p>
                <p
                  className={cn(
                    'text-[8px] font-bold uppercase',
                    activeCurrency === curr.id ? 'text-slate-400' : 'text-slate-400'
                  )}
                >
                  {curr.label}
                </p>
              </div>
            </div>
            {activeCurrency === curr.id && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-black text-white">{curr.symbol}</span>
                <div className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-emerald-400">
                  <TrendingUp className="h-2 w-2" />
                  <span className="text-[7px] font-black">LIVE</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
        <p className="text-[9px] font-medium leading-relaxed text-indigo-900">
          Оптовые цены и условия оплаты будут автоматически пересчитаны на основе выбранной валюты
          расчетов.
        </p>
      </div>

      <Button className="h-12 w-full gap-2 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
        Подтвердить регион <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
