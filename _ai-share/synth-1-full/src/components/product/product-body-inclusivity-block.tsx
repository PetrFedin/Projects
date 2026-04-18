'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Ruler, Info, Star } from 'lucide-react';
import { getBodyInclusivity } from '@/lib/fashion/body-inclusivity';

export const ProductBodyInclusivityBlock: React.FC<{ product: Product }> = ({ product }) => {
  const i = getBodyInclusivity(product);

  return (
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Users className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="text-accent-primary h-4 w-4" />
          <h4 className="text-accent-primary text-xs font-bold uppercase tracking-tight">
            Body Inclusivity Index
          </h4>
        </div>
        <div className="text-accent-primary flex items-center gap-1 text-[10px] font-black uppercase">
          <Star className="fill-accent-primary h-3 w-3" /> Slavic Fit: {i.slavicFitScore}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div
          className={`flex flex-col items-center justify-center rounded-xl border p-3 ${i.petiteFriendly ? 'border-accent-primary/20 bg-white shadow-sm' : 'bg-bg-surface2 border-border-subtle opacity-40'}`}
        >
          <Ruler className="text-accent-primary mb-1 h-4 w-4" />
          <span className="text-text-secondary text-[9px] font-black uppercase">
            Petite Friendly
          </span>
        </div>
        <div
          className={`flex flex-col items-center justify-center rounded-xl border p-3 ${i.tallFriendly ? 'border-accent-primary/20 bg-white shadow-sm' : 'bg-bg-surface2 border-border-subtle opacity-40'}`}
        >
          <Users className="text-accent-primary mb-1 h-4 w-4" />
          <span className="text-text-secondary text-[9px] font-black uppercase">Tall Friendly</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-text-muted mb-1 text-[9px] font-black uppercase leading-none tracking-widest">
          Adjustment Points
        </div>
        <div className="flex flex-wrap gap-1.5">
          {i.adjustmentPoints.map((p) => (
            <Badge
              key={p}
              variant="secondary"
              className="border-accent-primary/15 text-accent-primary h-4 border bg-white text-[8px] font-bold uppercase"
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center gap-1.5 border-t pt-3 text-[9px] font-bold uppercase italic">
        <Info className="h-3 w-3" /> Based on regional demographic fit data v3.1
      </div>
    </Card>
  );
};
