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
    <Card className="border-border-subtle bg-bg-surface2/10 group relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            EAEU Cross-Border B2B
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
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
          <span>VAT Rate (NDS)</span>
          <span className="text-text-primary">{Math.round(taxes.vatRate * 100)}%</span>
        </div>
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <span>Customs Duty</span>
          <Badge
            variant="outline"
            className="h-4 border-emerald-100 bg-emerald-50 text-[8px] font-black text-emerald-600"
          >
            0% DUTY-FREE
          </Badge>
        </div>
        <div className="bg-bg-surface2 h-px" />
        <div className="text-text-primary flex items-center justify-between text-[11px] font-black uppercase">
          <span>Est. Tax (Total)</span>
          <span className="text-accent-primary">
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
