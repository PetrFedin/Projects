'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Map, Factory, Droplet, Mountain } from 'lucide-react';
import { getSupplyChainTiers } from '@/lib/fashion/traceability-map';

export const ProductTraceabilityBlock: React.FC<{ product: Product }> = ({ product }) => {
  const tiers = getSupplyChainTiers(product);

  const icons: Record<string, any> = {
    assembly: Factory,
    fabric: Droplet,
    yarn: Map,
    raw_material: Mountain,
  };

  return (
    <Card className="border-dashed bg-stone-50/50 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Map className="h-4 w-4 text-orange-500" />
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Traceability Map (Tier 1-3)
        </h4>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, idx) => {
          const Icon = icons[tier.role] || Factory;
          return (
            <div key={idx} className="relative flex gap-4">
              {idx < tiers.length - 1 && (
                <div className="absolute bottom-0 left-3 top-6 -mb-4 w-px bg-slate-200" />
              )}
              <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
                <Icon className="h-3 w-3 text-slate-600" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Tier {tier.tier}
                  </span>
                  {tier.certification && (
                    <span className="rounded border border-green-100 bg-green-50 px-1.5 py-0.5 text-[10px] text-green-600">
                      {tier.certification}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-slate-800">{tier.name}</div>
                <div className="text-xs text-slate-500">
                  {tier.location} • {tier.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
