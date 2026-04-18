'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  ArrowLeftRight,
  TrendingUp,
  AlertCircle,
  BarChart3,
  MoveRight,
  Layers,
  Package,
  History,
} from 'lucide-react';
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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <ArrowLeftRight className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Stock Transfer Tracking (Intra-Retail)
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase leading-none tracking-widest text-slate-400">
          Global Sourcing Hub
        </div>
      </div>

      <div className="relative z-10 mb-6 space-y-3">
        {transfers.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 truncate text-[10px] font-black uppercase tracking-tighter text-slate-800">
                Transfer {t.transferId}
              </div>
              <div className="flex items-center gap-2 truncate text-[9px] font-bold text-slate-500">
                <span className="text-slate-700">{t.fromStoreId}</span>
                <MoveRight className="h-3 w-3 text-slate-300" />
                <span className="font-black text-indigo-600">{t.toStoreId}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <Badge
                className={`${statusColors[t.status]} h-4 border-none px-1.5 text-[8px] font-black uppercase`}
              >
                {t.status.replace('_', ' ')}
              </Badge>
              <div className="mt-1 text-[9px] font-black text-slate-700">{t.qty} Units</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-[9px] font-black uppercase text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95">
          <Layers className="h-3.5 w-3.5" /> Start New Swap
        </button>
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white text-[9px] font-black uppercase text-slate-600 transition-all hover:bg-slate-50">
          <History className="h-3.5 w-3.5" /> Swap History
        </button>
      </div>
    </Card>
  );
}
