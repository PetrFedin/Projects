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
  RefreshCw
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
    { id: 'EUR', symbol: '€', label: 'Евро', rate: 0.010, icon: Wallet },
    { id: 'AED', symbol: 'د.إ', label: 'Дирхам ОАЭ', rate: 0.040, icon: Coins }
  ] as const;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-2xl border border-slate-100 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-600" />
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[8px]">Global_Engine_v1</Badge>
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Валюта расчетов</h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
          <RefreshCw className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {currencies.map((curr) => (
          <button
            key={curr.id}
            onClick={() => setCurrency(curr.id)}
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all border group",
              activeCurrency === curr.id 
                ? "bg-slate-900 border-slate-900 shadow-xl shadow-slate-200" 
                : "bg-slate-50 border-transparent hover:bg-slate-100"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                activeCurrency === curr.id ? "bg-white/10 text-white" : "bg-white text-slate-400 border border-slate-100"
              )}>
                <curr.icon className="h-5 w-5" />
              </div>
              <div className="text-left space-y-0.5">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  activeCurrency === curr.id ? "text-white" : "text-slate-900"
                )}>{curr.id}</p>
                <p className={cn(
                  "text-[8px] font-bold uppercase",
                  activeCurrency === curr.id ? "text-slate-400" : "text-slate-400"
                )}>{curr.label}</p>
              </div>
            </div>
            {activeCurrency === curr.id && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-white text-sm font-black">{curr.symbol}</span>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md">
                  <TrendingUp className="h-2 w-2" />
                  <span className="text-[7px] font-black">LIVE</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
        <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-[9px] font-medium text-indigo-900 leading-relaxed">
          Оптовые цены и условия оплаты будут автоматически пересчитаны на основе выбранной валюты расчетов.
        </p>
      </div>

      <Button className="w-full h-12 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg">
        Подтвердить регион <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
