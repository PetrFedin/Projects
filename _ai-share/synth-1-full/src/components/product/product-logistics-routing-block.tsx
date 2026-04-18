'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Gauge, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { getLogisticsRouting } from '@/lib/fashion/logistics-routing';
import type { Product } from '@/lib/types';

export function ProductLogisticsRoutingBlock({ product }: { product: Product }) {
  const routing = getLogisticsRouting(product.sku);

  return (
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Regional Middle-Mile Routing
          </h4>
        </div>
        <Badge className="border-none bg-indigo-100 text-[8px] font-black uppercase text-indigo-700">
=======
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Regional Middle-Mile Routing
          </h4>
        </div>
        <Badge className="bg-accent-primary/15 text-accent-primary border-none text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          {routing.routeType}
        </Badge>
      </div>

      <div className="mb-4 flex items-center gap-4">
<<<<<<< HEAD
        <div className="flex-1 rounded-xl border border-slate-100 bg-white p-3">
          <div className="mb-1 text-[8px] font-black uppercase text-slate-400">Transit Time</div>
          <div className="text-lg font-black leading-none text-slate-800">
            {routing.transitDays} Days
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-slate-100 bg-white p-3">
          <div className="mb-1 text-[8px] font-black uppercase text-slate-400">Cost Per Unit</div>
          <div className="text-lg font-black leading-none text-slate-800">
=======
        <div className="border-border-subtle flex-1 rounded-xl border bg-white p-3">
          <div className="text-text-muted mb-1 text-[8px] font-black uppercase">Transit Time</div>
          <div className="text-text-primary text-lg font-black leading-none">
            {routing.transitDays} Days
          </div>
        </div>
        <div className="border-border-subtle flex-1 rounded-xl border bg-white p-3">
          <div className="text-text-muted mb-1 text-[8px] font-black uppercase">Cost Per Unit</div>
          <div className="text-text-primary text-lg font-black leading-none">
>>>>>>> recover/cabinet-wip-from-stash
            {routing.costPerUnit} ₽
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
<<<<<<< HEAD
        <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/30 p-2.5">
          <MapPin className="h-4 w-4 text-indigo-500" />
          <div className="text-[10px] font-bold text-slate-700">
            {routing.warehouseId} <ArrowRight className="mx-1 inline h-3 w-3 text-slate-400" />{' '}
=======
        <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center gap-2 rounded-lg border p-2.5">
          <MapPin className="text-accent-primary h-4 w-4" />
          <div className="text-text-primary text-[10px] font-bold">
            {routing.warehouseId} <ArrowRight className="text-text-muted mx-1 inline h-3 w-3" />{' '}
>>>>>>> recover/cabinet-wip-from-stash
            {routing.targetRegion}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter text-slate-400">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Customs Cleared (EAEU)
        </div>
        <div className="text-slate-300">CO2 Impact: {routing.co2Impact}kg</div>
=======
      <div className="text-text-muted flex items-center justify-between text-[9px] font-black uppercase tracking-tighter">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Customs Cleared (EAEU)
        </div>
        <div className="text-text-muted">CO2 Impact: {routing.co2Impact}kg</div>
>>>>>>> recover/cabinet-wip-from-stash
      </div>
    </Card>
  );
}
