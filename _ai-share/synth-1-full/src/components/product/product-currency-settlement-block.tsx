'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Wallet,
  Percent,
  ArrowUpRight,
  Target,
  AlertTriangle,
  Activity,
  BarChart3,
  TrendingUp,
  Zap,
  MousePointer2,
  Leaf,
  Heart,
  Hammer,
  Users,
  Clock,
  MessageSquare,
  Send,
  BarChart,
  Gift,
  Truck,
  MapPin,
  Globe,
  Box,
  LayoutGrid,
} from 'lucide-react';
import { getB2BCurrencySettlement } from '@/lib/fashion/b2b-currency-settlement';
import type { Product } from '@/lib/types';

const currencies = [
  { code: 'CNY' as const, name: 'Yuan' },
  { code: 'KZT' as const, name: 'Tenge' },
  { code: 'BYN' as const, name: 'BYN' },
  { code: 'RUB' as const, name: 'Rubles' },
];

export function ProductCurrencySettlementBlock({ product }: { product: Product }) {
  const [selectedCurrency, setSelectedCurrency] = useState<'CNY' | 'KZT' | 'BYN' | 'RUB'>('CNY');
  const settlement = getB2BCurrencySettlement('PO-2026-001', 5000000, selectedCurrency);

  return (
    <Card className="group relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Globe className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Regional B2B Settlement
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          Multi-Currency
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {currencies.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCurrency(c.code)}
            className={`rounded-xl border-2 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${
              selectedCurrency === c.code
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-100 bg-white text-slate-400'
            }`}
          >
            {c.code}
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>Exchange Rate</span>
          <span className="text-slate-800">
            1 RUB = {settlement.exchangeRate} {settlement.currency}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>Base Amount</span>
          <span className="text-slate-800">{settlement.baseAmount.toLocaleString()} RUB</span>
        </div>
        <div className="h-px bg-slate-50" />
        <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-900">
          <span>Settlement Total</span>
          <span className="text-indigo-600">
            {settlement.finalAmount.toLocaleString()} {settlement.currency}
          </span>
        </div>
      </div>

      <div className="group/btn relative mt-4 flex cursor-pointer items-center justify-between overflow-hidden rounded-xl bg-indigo-600 p-2.5 text-white shadow-lg shadow-indigo-100">
        <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform group-hover/btn:scale-125">
          <CreditCard className="h-12 w-12 text-white" />
        </div>
        <div className="relative z-10 text-[10px] font-black uppercase tracking-widest">
          Lock Exchange Rate & Pay
        </div>
        <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </div>
    </Card>
  );
}
