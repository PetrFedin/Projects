'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, LayoutGrid, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { getB2BOrderSplit } from '@/lib/fashion/order-splitting';
import type { Product } from '@/lib/types';

export function ProductOrderSplitBlock({ product }: { product: Product }) {
  const split = getB2BOrderSplit(product.sku, 150);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Ship-to-Store Splitter</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">Multi-Store Order</div>
      </div>

      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm mb-4">
         <div className="flex justify-between items-center">
            <div className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Total Allocation: {split.totalQty} Units</div>
            <Badge className="bg-indigo-100 text-indigo-700 border-none text-[8px] h-4 font-black">ACTIVE SPLIT</Badge>
         </div>
      </div>

      <div className="space-y-2 mb-4">
         {split.splits.map((s, i) => (
           <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-50 shadow-sm group hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-2.5">
                 <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                 <div className="text-[10px] font-bold text-slate-700">{s.storeId}</div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-[11px] font-black text-slate-900">{s.qty} units</div>
                 {s.status === 'confirmed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
              </div>
           </div>
         ))}
      </div>

      <button className="w-full h-8 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 transition-all">
         Modify Distributions <ArrowRight className="w-3 h-3" />
      </button>
    </Card>
  );
}
