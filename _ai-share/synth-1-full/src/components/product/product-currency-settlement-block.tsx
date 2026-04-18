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
    <Card className="border-border-subtle bg-bg-surface2/5 group relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Regional B2B Settlement
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
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
                ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                : 'border-border-subtle text-text-muted bg-white'
            }`}
          >
            {c.code}
          </button>
        ))}
      </div>

      <div className="border-border-subtle space-y-3 rounded-2xl border bg-white p-3 shadow-sm">
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span>Exchange Rate</span>
          <span className="text-text-primary">
            1 RUB = {settlement.exchangeRate} {settlement.currency}
          </span>
        </div>
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span>Base Amount</span>
          <span className="text-text-primary">{settlement.baseAmount.toLocaleString()} RUB</span>
        </div>
        <div className="bg-bg-surface2 h-px" />
        <div className="text-text-primary flex items-center justify-between text-[11px] font-black uppercase">
          <span>Settlement Total</span>
          <span className="text-accent-primary">
            {settlement.finalAmount.toLocaleString()} {settlement.currency}
          </span>
        </div>
      </div>

      <div className="bg-accent-primary shadow-accent-primary/10 group/btn relative mt-4 flex cursor-pointer items-center justify-between overflow-hidden rounded-xl p-2.5 text-white shadow-lg">
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
