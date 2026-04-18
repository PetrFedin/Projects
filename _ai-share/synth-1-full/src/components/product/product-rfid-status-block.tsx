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
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-50 bg-indigo-50/5 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Radio className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Radio className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            RFID Inventory Sync (Instore)
          </h4>
        </div>
        <Badge
          className={
            rfid.status === 'matched'
              ? 'border-none bg-emerald-100 text-[8px] uppercase text-emerald-700'
              : 'border-none bg-rose-100 text-[8px] uppercase text-rose-700'
          }
        >
          {rfid.status}
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-indigo-100 bg-white p-3 text-center shadow-sm">
          <div className="text-[18px] font-black leading-none text-slate-800">
            {rfid.scannedQty}
          </div>
          <div className="mt-1 text-[8px] font-black uppercase text-slate-400">Scanned (RFID)</div>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-white p-3 text-center shadow-sm">
          <div
            className={
              rfid.discrepancy === 0
                ? 'text-[18px] font-black leading-none text-emerald-600'
                : 'text-[18px] font-black leading-none text-rose-600'
            }
          >
            {rfid.discrepancy > 0 ? '+' : ''}
            {rfid.discrepancy}
          </div>
          <div className="mt-1 text-[8px] font-black uppercase text-slate-400">Discrepancy</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[9px] font-bold uppercase text-slate-500">
          <span>Scan Accuracy</span>
          <span>{Math.round((rfid.scannedQty / rfid.expectedQty) * 100)}%</span>
        </div>
        <Progress
          value={(rfid.scannedQty / rfid.expectedQty) * 100}
          className="h-1 bg-slate-100 fill-indigo-500"
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-indigo-50 pt-3 text-[8px] font-black uppercase text-slate-400">
        <div className="flex items-center gap-1.5">
          <History className="h-3 w-3" /> Last Scan: {rfid.lastScanDate}
        </div>
        <button className="flex items-center gap-1 text-indigo-600 hover:underline">
          <RefreshCw className="h-2.5 w-2.5" /> Re-trigger Scan
        </button>
      </div>
    </Card>
  );
}
