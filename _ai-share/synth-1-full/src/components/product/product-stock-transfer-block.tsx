'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, ArrowLeftRight, TrendingUp, AlertCircle, BarChart3, MoveRight, Layers, Package, History } from 'lucide-react';
import { getStockTransferLog } from '@/lib/fashion/stock-transfer-tracking';
import type { Product } from '@/lib/types';

export function ProductStockTransferBlock({ product }: { product: Product }) {
  const transfers = getStockTransferLog(product.sku);

  const statusColors = {
    picking: 'bg-amber-100 text-amber-700',
    in_transit: 'bg-indigo-100 text-indigo-700',
    received: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <ArrowLeftRight className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Stock Transfer Tracking (Intra-Retail)</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Sourcing Hub</div>
      </div>

      <div className="space-y-3 mb-6 relative z-10">
         {transfers.map((t, i) => (
           <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                 <div className="text-[10px] font-black text-slate-800 truncate mb-1 uppercase tracking-tighter">Transfer {t.transferId}</div>
                 <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 truncate">
                    <span className="text-slate-700">{t.fromStoreId}</span>
                    <MoveRight className="w-3 h-3 text-slate-300" />
                    <span className="text-indigo-600 font-black">{t.toStoreId}</span>
                 </div>
              </div>
              
              <div className="text-right shrink-0">
                 <Badge className={`${statusColors[t.status]} border-none text-[8px] h-4 font-black px-1.5 uppercase`}>
                   {t.status.replace('_', ' ')}
                 </Badge>
                 <div className="text-[9px] font-black text-slate-700 mt-1">{t.qty} Units</div>
              </div>
           </div>
         ))}
      </div>

      <div className="flex gap-2">
         <button className="flex-1 h-9 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
            <Layers className="w-3.5 h-3.5" /> Start New Swap
         </button>
         <button className="flex-1 h-9 bg-white border border-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all hover:bg-slate-50">
            <History className="w-3.5 h-3.5" /> Swap History
         </button>
      </div>
    </Card>
  );
}
