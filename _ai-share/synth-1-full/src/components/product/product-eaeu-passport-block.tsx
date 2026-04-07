'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileText, Globe, Truck, CheckCircle2, History, AlertCircle, Sparkles } from 'lucide-react';
import { getEaeuDigitalPassport } from '@/lib/fashion/eaeu-digital-passport';
import type { Product } from '@/lib/types';

export function ProductEaeuPassportBlock({ product }: { product: Product }) {
  const passport = getEaeuDigitalPassport(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-900 bg-slate-900 text-white shadow-2xl my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
         <ShieldCheck className="w-16 h-16 text-white" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">EAEU Digital Passport 2.0</h4>
        </div>
        <Badge className="bg-indigo-500 text-white border-none uppercase text-[8px] font-black tracking-widest px-2 h-5">
          {passport.certificationType} Certified
        </Badge>
      </div>

      <div className="space-y-3 mb-6 relative z-10">
         <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
               </div>
               <div>
                  <div className="text-[11px] font-black text-indigo-400 uppercase tracking-tighter">Honest Mark (Честный Знак)</div>
                  <div className="text-[10px] font-mono text-white/80">{passport.honestMarkId}</div>
               </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
               <div className="text-[8px] font-black text-white/40 uppercase mb-1 tracking-widest">EDO (ЭДО) Status</div>
               <div className="flex items-center gap-2">
                  <Badge className={passport.edoStatus === 'signed' ? 'bg-emerald-500/20 text-emerald-400 border-none text-[8px] h-4 font-black uppercase px-1.5' : 'bg-amber-500/20 text-amber-400 border-none text-[8px] h-4 font-black uppercase px-1.5'}>
                     {passport.edoStatus}
                  </Badge>
               </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
               <div className="text-[8px] font-black text-white/40 uppercase mb-1 tracking-widest">Origin Country</div>
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> {passport.originCountry}
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
               <div className="text-[10px] font-black text-slate-800 leading-tight">Customs Declaration (ГТД)</div>
               <div className="text-[8px] font-mono text-slate-400">{passport.customsDeclarationNum || 'PENDING'}</div>
            </div>
         </div>
         <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline">Download Cert</button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-white/30 uppercase tracking-widest text-center justify-center">
         <ShieldCheck className="w-3 h-3" /> RU Regulation Compliance Verified (March 2026)
      </div>
    </Card>
  );
}
