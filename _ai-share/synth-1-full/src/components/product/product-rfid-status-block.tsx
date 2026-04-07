'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radio, RefreshCw, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { getRfidReconciliation } from '@/lib/fashion/rfid-reconciliation';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductRfidStatusBlock({ product }: { product: Product }) {
  const rfid = getRfidReconciliation(product.sku);

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <Radio className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Radio className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">RFID Inventory Sync (Instore)</h4>
        </div>
        <Badge className={rfid.status === 'matched' ? 'bg-emerald-100 text-emerald-700 border-none uppercase text-[8px]' : 'bg-rose-100 text-rose-700 border-none uppercase text-[8px]'}>
          {rfid.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
         <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm text-center">
            <div className="text-[18px] font-black text-slate-800 leading-none">{rfid.scannedQty}</div>
            <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Scanned (RFID)</div>
         </div>
         <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm text-center">
            <div className={rfid.discrepancy === 0 ? "text-[18px] font-black text-emerald-600 leading-none" : "text-[18px] font-black text-rose-600 leading-none"}>
               {rfid.discrepancy > 0 ? '+' : ''}{rfid.discrepancy}
            </div>
            <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Discrepancy</div>
         </div>
      </div>

      <div className="space-y-2">
         <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
            <span>Scan Accuracy</span>
            <span>{Math.round((rfid.scannedQty / rfid.expectedQty) * 100)}%</span>
         </div>
         <Progress value={(rfid.scannedQty / rfid.expectedQty) * 100} className="h-1 bg-slate-100 fill-indigo-500" />
      </div>

      <div className="mt-4 pt-3 border-t border-indigo-50 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <div className="flex items-center gap-1.5">
            <History className="w-3 h-3" /> Last Scan: {rfid.lastScanDate}
         </div>
         <button className="flex items-center gap-1 text-indigo-600 hover:underline">
            <RefreshCw className="w-2.5 h-2.5" /> Re-trigger Scan
         </button>
      </div>
    </Card>
  );
}
