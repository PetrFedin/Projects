'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileText, QrCode, Globe, Info } from 'lucide-react';
import { getEaeuPassport } from '@/lib/fashion/digital-passport-eaeu';

export const ProductDigitalPassportBlock: React.FC<{ product: Product }> = ({ product }) => {
  const p = getEaeuPassport(product);
  
  return (
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-xs uppercase text-emerald-700 tracking-tight">Digital Product Passport (EAEU)</h4>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-black uppercase">
          <Globe className="w-3 h-3" /> Compliance OK
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded border border-emerald-100 shadow-sm shrink-0">
             <QrCode className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Declaration No.</div>
            <div className="text-[11px] font-bold text-slate-700 truncate">{p.declarationNumber}</div>
            <div className="mt-1 flex gap-1.5">
               <Badge variant="outline" className="text-[8px] h-3.5 bg-emerald-50 border-emerald-100 text-emerald-700 font-black">{p.standard}</Badge>
               <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Until: {p.validUntil}</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-white/60 rounded-lg border border-emerald-50 text-[10px] space-y-2">
           <div className="flex justify-between items-center text-slate-500">
              <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> Testing Lab</span>
              <span className="font-bold">{p.testingLab}</span>
           </div>
           <div className="flex justify-between items-center text-slate-500">
              <span className="flex items-center gap-1.5"><Info className="w-3 h-3" /> EAEU-Standard Declaration</span>
              <span className="text-emerald-600 font-bold underline cursor-pointer">View PDF</span>
           </div>
        </div>
      </div>

      <div className="mt-4 text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1.5 italic">
        Certified for RF, BY, KZ, AM, KG Markets • Digital Safety Passport v1.2
      </div>
    </Card>
  );
};
