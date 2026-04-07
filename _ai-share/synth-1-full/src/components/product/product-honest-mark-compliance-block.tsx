'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck, ShieldAlert, Scan, Info, CheckCircle2 } from 'lucide-react';
import { getHonestMarkStatus } from '@/lib/fashion/honest-mark-compliance';
import type { Product } from '@/lib/types';

export function ProductHonestMarkComplianceBlock({ product }: { product: Product }) {
  const status = getHonestMarkStatus([product.sku])[0];

  return (
    <Card className="p-4 border-2 border-emerald-50 bg-white shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-emerald-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">RU Compliance: Honest Mark (ЧЗ)</h4>
        </div>
        <Badge className={status.status === 'ready' ? "bg-emerald-500 text-white border-none text-[8px] font-black uppercase" : "bg-orange-500 text-white border-none text-[8px] font-black uppercase"}>
          {status.status.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3">
         <div className="flex justify-between items-center text-[10px] font-black uppercase">
            <span className="text-slate-500">EAN-13 Code</span>
            <span className="text-slate-800">{status.ean}</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-black uppercase">
            <span className="text-slate-500">EAEU Declaration</span>
            <span className="text-slate-800 truncate max-w-[150px]">{status.declarationEaeu}</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-black uppercase">
            <span className="text-slate-500">Codes in Pool</span>
            <span className="text-emerald-600">{status.codesRequired}+ Avail</span>
         </div>
      </div>

      <div className="mt-4 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 flex gap-2 items-start">
         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
         <div className="text-[9px] text-emerald-700 font-medium leading-tight">
            Товар полностью соответствует требованиям маркировки РФ. Коды DataMatrix готовы к эмиссии.
         </div>
      </div>
    </Card>
  );
}
