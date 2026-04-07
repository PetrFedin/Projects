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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Globe className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">EAEU Cross-Border B2B</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duty-Free Hub</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
         {countries.map(c => (
           <button 
             key={c.code}
             onClick={() => setSelectedCountry(c.code)}
             className={`px-3 py-1.5 rounded-xl border-2 text-[8px] font-black uppercase tracking-widest transition-all ${
               selectedCountry === c.code ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400'
             }`}
           >
             {c.code}
           </button>
         ))}
      </div>

      <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
         <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>VAT Rate (NDS)</span>
            <span className="text-slate-800">{Math.round(taxes.vatRate * 100)}%</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Customs Duty</span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] h-4 font-black">0% DUTY-FREE</Badge>
         </div>
         <div className="h-px bg-slate-50" />
         <div className="flex justify-between items-center text-[11px] font-black text-slate-900 uppercase">
            <span>Est. Tax (Total)</span>
            <span className="text-indigo-600">{taxes.estimatedTotalTax.toLocaleString()} {taxes.currency}</span>
         </div>
      </div>

      <div className="mt-4 p-2.5 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
         <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
         <p className="text-[8px] font-bold text-amber-700 uppercase leading-tight">Tax is calculated based on <b>1M ₽</b> order volume for {selectedCountry}.</p>
      </div>
    </Card>
  );
}
