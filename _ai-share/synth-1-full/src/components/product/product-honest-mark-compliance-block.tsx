'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck, ShieldAlert, Scan, Info, CheckCircle2 } from 'lucide-react';
import { getHonestMarkRequirementsForSkus } from '@/lib/fashion/honest-mark-compliance';
import type { Product } from '@/lib/types';

export function ProductHonestMarkComplianceBlock({ product }: { product: Product }) {
  const status = getHonestMarkRequirementsForSkus([product.sku])[0];

  return (
    <Card className="my-4 border-2 border-emerald-50 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan className="h-4 w-4 text-emerald-600" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            RU Compliance: Honest Mark (ЧЗ)
          </h4>
        </div>
        <Badge
          className={
            status.status === 'ready'
              ? 'border-none bg-emerald-500 text-[8px] font-black uppercase text-white'
              : 'border-none bg-orange-500 text-[8px] font-black uppercase text-white'
          }
        >
          {status.status.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-black uppercase">
<<<<<<< HEAD
          <span className="text-slate-500">EAN-13 Code</span>
          <span className="text-slate-800">{status.ean}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase">
          <span className="text-slate-500">EAEU Declaration</span>
          <span className="max-w-[150px] truncate text-slate-800">{status.declarationEaeu}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase">
          <span className="text-slate-500">Codes in Pool</span>
=======
          <span className="text-text-secondary">EAN-13 Code</span>
          <span className="text-text-primary">{status.ean}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase">
          <span className="text-text-secondary">EAEU Declaration</span>
          <span className="text-text-primary max-w-[150px] truncate">{status.declarationEaeu}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase">
          <span className="text-text-secondary">Codes in Pool</span>
>>>>>>> recover/cabinet-wip-from-stash
          <span className="text-emerald-600">{status.codesRequired}+ Avail</span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-2.5">
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
        <div className="text-[9px] font-medium leading-tight text-emerald-700">
          Товар полностью соответствует требованиям маркировки РФ. Коды DataMatrix готовы к эмиссии.
        </div>
      </div>
    </Card>
  );
}
