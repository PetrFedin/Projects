'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Map, Factory, Droplet, Mountain } from 'lucide-react';
import { getSupplyChainTiers } from '@/lib/fashion/traceability-map';

export const ProductTraceabilityBlock: React.FC<{ product: Product }> = ({ product }) => {
  const tiers = getSupplyChainTiers(product);
  
  const icons: Record<string, any> = {
    'assembly': Factory,
    'fabric': Droplet,
    'yarn': Map,
    'raw_material': Mountain,
  };

  return (
    <Card className="p-4 border-dashed bg-stone-50/50">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-4 h-4 text-orange-500" />
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Traceability Map (Tier 1-3)</h4>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, idx) => {
          const Icon = icons[tier.role] || Factory;
          return (
            <div key={idx} className="flex gap-4 relative">
              {idx < tiers.length - 1 && (
                <div className="absolute left-3 top-6 bottom-0 w-px bg-slate-200 -mb-4" />
              )}
              <div className="w-6 h-6 rounded-full bg-white border flex items-center justify-center z-10">
                <Icon className="w-3 h-3 text-slate-600" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">Tier {tier.tier}</span>
                  {tier.certification && (
                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">
                      {tier.certification}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-slate-800">{tier.name}</div>
                <div className="text-xs text-slate-500">{tier.location} • {tier.role}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
