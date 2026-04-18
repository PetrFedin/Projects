'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, DollarSign, Calculator, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { calculateEaeuTaxes } from '@/lib/fashion/eaeu-tax-calculator';
import type { Product } from '@/lib/types';

const countries = [
  { code: 'KZ' as const, name: 'Kazakhstan' },
  { code: 'BY' as const, name: 'Belarus' },
  { code: 'AM' as const, name: 'Armenia' },
  { code: 'KG' as const, name: 'Kyrgyzstan' },
];

export function ProductEaeuTaxBlock({ product }: { product: Product }) {
  const [selectedCountry, setSelectedCountry] = useState<'KZ' | 'BY' | 'AM' | 'KG'>('KZ');
  const taxes = calculateEaeuTaxes(1000000, selectedCountry);

  return (
    <Card className="group relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Globe className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            EAEU Cross-Border B2B
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          Duty-Free Hub
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCountry(c.code)}
            className={`rounded-xl border-2 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${
              selectedCountry === c.code
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
          <span>VAT Rate (NDS)</span>
          <span className="text-slate-800">{Math.round(taxes.vatRate * 100)}%</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>Customs Duty</span>
          <Badge
            variant="outline"
            className="h-4 border-emerald-100 bg-emerald-50 text-[8px] font-black text-emerald-600"
          >
            0% DUTY-FREE
          </Badge>
        </div>
        <div className="h-px bg-slate-50" />
        <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-900">
          <span>Est. Tax (Total)</span>
          <span className="text-indigo-600">
            {taxes.estimatedTotalTax.toLocaleString()} {taxes.currency}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 p-2.5">
        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
        <p className="text-[8px] font-bold uppercase leading-tight text-amber-700">
          Tax is calculated based on <b>1M ₽</b> order volume for {selectedCountry}.
        </p>
      </div>
    </Card>
  );
}
