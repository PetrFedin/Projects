'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileText, Globe, Droplets, Wind, RefreshCw, Layers, CheckCircle2, History, AlertCircle, Sparkles, Leaf } from 'lucide-react';
import { getSustainabilityLedger } from '@/lib/fashion/sustainability-ledger';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductSustainabilityLedgerBlock({ product }: { product: Product }) {
  const ledger = getSustainabilityLedger(product.sku);

  return (
    <Card className="p-4 border-2 border-emerald-900 bg-emerald-900 text-white shadow-2xl my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
         <Leaf className="w-16 h-16 text-white" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Leaf className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Sustainability Traceability Ledger</h4>
        </div>
        <Badge className="bg-emerald-500 text-white border-none uppercase text-[8px] font-black tracking-widest px-2 h-5">
          Verified EAEU ESG
        </Badge>
      </div>

      <div className="space-y-4 mb-6 relative z-10">
         <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-emerald-400" />
               </div>
               <div>
                  <div className="text-[11px] font-black text-emerald-400 uppercase tracking-tighter">Material Origin</div>
                  <div className="text-[10px] font-mono text-white/80">{ledger.materialOrigin}</div>
               </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
               <div className="text-[8px] font-black text-white/40 uppercase mb-1 tracking-widest">CO2 Impact</div>
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" /> {ledger.carbonFootprintKg} kg
               </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
               <div className="text-[8px] font-black text-white/40 uppercase mb-1 tracking-widest">Water Usage</div>
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" /> {ledger.waterUsageLiters} L
               </div>
            </div>
         </div>
      </div>

      <div className="p-3 bg-white rounded-xl border border-slate-700/50 flex items-center justify-between shadow-lg">
         <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
               <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <div>
               <div className="text-[10px] font-black text-slate-800 leading-tight">ESG Certifications</div>
               <div className="text-[8px] font-mono text-slate-400">{ledger.certificates.join(', ')}</div>
            </div>
         </div>
         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      </div>

      <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-white/30 uppercase tracking-widest text-center justify-center">
         <ShieldCheck className="w-3 h-3" /> RU Regulation Compliance Verified (March 2026)
      </div>
    </Card>
  );
}
