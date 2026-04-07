'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Percent, ArrowUpRight, Target, AlertTriangle, Activity, BarChart3, TrendingUp, Zap, MousePointer2, Leaf, Heart, Hammer, Users, Clock, MessageSquare, Send, BarChart, Gift, Truck, MapPin, Globe, Box, LayoutGrid } from 'lucide-react';
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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Globe className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Regional B2B Settlement</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Multi-Currency</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
         {currencies.map(c => (
           <button 
             key={c.code}
             onClick={() => setSelectedCurrency(c.code)}
             className={`px-3 py-1.5 rounded-xl border-2 text-[8px] font-black uppercase tracking-widest transition-all ${
               selectedCurrency === c.code ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400'
             }`}
           >
             {c.code}
           </button>
         ))}
      </div>

      <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
         <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Exchange Rate</span>
            <span className="text-slate-800">1 RUB = {settlement.exchangeRate} {settlement.currency}</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Base Amount</span>
            <span className="text-slate-800">{settlement.baseAmount.toLocaleString()} RUB</span>
         </div>
         <div className="h-px bg-slate-50" />
         <div className="flex justify-between items-center text-[11px] font-black text-slate-900 uppercase">
            <span>Settlement Total</span>
            <span className="text-indigo-600">{settlement.finalAmount.toLocaleString()} {settlement.currency}</span>
         </div>
      </div>

      <div className="mt-4 p-2.5 bg-indigo-600 text-white rounded-xl flex items-center justify-between shadow-lg shadow-indigo-100 relative overflow-hidden group/btn cursor-pointer">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/btn:scale-125 transition-transform">
            <CreditCard className="w-12 h-12 text-white" />
         </div>
         <div className="text-[10px] font-black uppercase tracking-widest relative z-10">Lock Exchange Rate & Pay</div>
         <ArrowUpRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
}
