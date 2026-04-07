'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle, CheckCircle2, Navigation, Layers, Info } from 'lucide-react';
import { detectAssortmentClash } from '@/lib/fashion/assortment-clash-detection';
import type { Product } from '@/lib/types';

export function ProductAssortmentClashBlock({ product }: { product: Product }) {
  const clash = detectAssortmentClash(product.sku);

  const statusColors = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Assortment Clash Detection</h4>
        </div>
        <Badge className={`${statusColors[clash.clashIntensity]} border-none uppercase text-[8px] font-black`}>
          {clash.clashIntensity} risk
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4 relative z-10">
         <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
            <Layers className={`w-6 h-6 ${clash.clashIntensity === 'high' ? 'text-rose-500' : 'text-indigo-500'}`} />
         </div>
         <div className="flex-1">
            <div className="text-[11px] font-black text-slate-800 leading-tight">Nearby Multi-brand Stores: {clash.nearbyCompetitorStores}</div>
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scan Radius: {clash.radiusKm}km</div>
         </div>
      </div>

      <div className={`p-3 rounded-xl border flex items-center gap-3 ${clash.suggestedAction === 'skip' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
         {clash.suggestedAction === 'skip' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
         <div className="text-[10px] font-bold leading-tight">
            <b>Action:</b> {clash.suggestedAction === 'skip' ? 'High overlap in neighborhood. Skip this SKU.' : 'Unique style for this location. Proceed.'}
         </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
         <Navigation className="w-3 h-3" /> Geospatial B2B Analysis Enabled
      </div>
    </Card>
  );
}
