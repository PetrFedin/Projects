'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  MapPin,
  ExternalLink,
  Activity,
  Info,
  TrendingDown,
  Clock,
  Package,
} from 'lucide-react';
import { getOptimizedLogisticsRoutes } from '@/lib/fashion/logistics-optimizer';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductLogisticsOptimizerBlock({ product }: { product: Product }) {
  const routes = getOptimizedLogisticsRoutes('Moscow', 'Novosibirsk', 50);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Truck className="h-16 w-16 text-emerald-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <Truck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            AI B2B Logistics Route Optimizer (RU Delivery)
          </h4>
        </div>
        <Badge className="border-none bg-emerald-600 text-[8px] font-black uppercase text-white">
          Central RU → Novosibirsk
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
            <Activity className="h-3 w-3" /> Carrier Options
          </div>
          {routes.map((r) => (
            <div
              key={r.id}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-emerald-200 bg-white/80 p-2.5 shadow-sm transition-colors hover:bg-white"
            >
              <div>
                <div className="text-[10px] font-black uppercase text-slate-800">{r.carrier}</div>
                <div className="mt-0.5 text-[9px] font-bold uppercase text-slate-500">
                  {r.estDays} Days • {r.costRub.toLocaleString()} ₽
                </div>
              </div>
              <Badge className="h-3.5 border-none bg-emerald-600/20 text-[8px] text-emerald-600">
                {r.reliabilityScore}% REL
              </Badge>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
            <TrendingDown className="h-3 w-3" /> Delivery Efficiency
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border border-emerald-100 bg-white/50 p-3">
              <Clock className="mx-auto mb-1 h-4 w-4 text-emerald-600" />
              <div className="text-[12px] font-black text-slate-800">3-4 D.</div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Avg. TAT</div>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/50 p-3">
              <Package className="mx-auto mb-1 h-4 w-4 text-sky-600" />
              <div className="text-[12px] font-black text-sky-600">-12%</div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">
                Consolidation
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-xl border border-emerald-200 bg-white/80 p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[9px] font-black uppercase text-slate-700">AI Insights</span>
            </div>
            <p className="text-[9px] font-bold italic leading-tight text-slate-600">
              "Peak logistics congestion in Novosibirsk. PEK route recommended for bulk non-urgent
              shipments."
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Integrated with RU Carrier APIs</span>
        <span className="flex items-center gap-1 text-emerald-600">
          Track All Shipments <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </Card>
  );
}
