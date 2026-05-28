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
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Assortment Clash Detection
          </h4>
        </div>
        <Badge
          className={`${statusColors[clash.clashIntensity]} border-none text-[8px] font-black uppercase`}
        >
          {clash.clashIntensity} risk
        </Badge>
      </div>

      <div className="relative z-10 mb-4 flex items-center gap-4">
        <div className="border-border-subtle flex h-12 w-12 items-center justify-center rounded-xl border bg-white shadow-sm">
          <Layers
            className={`h-6 w-6 ${clash.clashIntensity === 'high' ? 'text-rose-500' : 'text-accent-primary'}`}
          />
        </div>
        <div className="flex-1">
          <div className="text-text-primary text-[11px] font-black leading-tight">
            Nearby Multi-brand Stores: {clash.nearbyCompetitorStores}
          </div>
          <div className="text-text-muted mt-0.5 text-[8px] font-bold uppercase tracking-widest">
            Scan Radius: {clash.radiusKm}km
          </div>
        </div>
      </div>

      <div
        className={`flex items-center gap-3 rounded-xl border p-3 ${clash.suggestedAction === 'skip' ? 'border-rose-100 bg-rose-50 text-rose-700' : 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary'}`}
      >
        {clash.suggestedAction === 'skip' ? (
          <AlertCircle className="h-4 w-4 shrink-0" />
        ) : (
          <CheckCircle2 className="h-4 w-4 shrink-0" />
        )}
        <div className="text-[10px] font-bold leading-tight">
          <b>Action:</b>{' '}
          {clash.suggestedAction === 'skip'
            ? 'High overlap in neighborhood. Skip this SKU.'
            : 'Unique style for this location. Proceed.'}
        </div>
      </div>

      <div className="text-text-muted mt-3 flex items-center gap-1.5 text-[8px] font-black uppercase italic tracking-widest opacity-60">
        <Navigation className="h-3 w-3" /> Geospatial B2B Analysis Enabled
      </div>
    </Card>
  );
}
