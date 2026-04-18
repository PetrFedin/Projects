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
<<<<<<< HEAD
    <Card className="relative overflow-hidden border-2 border-fuchsia-50 bg-fuchsia-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Users className="h-16 w-16 text-fuchsia-400" />
=======
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Users className="text-accent-primary h-16 w-16" />
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
<<<<<<< HEAD
          <Heart className="h-4 w-4 text-fuchsia-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-fuchsia-700">
            Body Inclusivity Index
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-fuchsia-500">
          <Star className="h-3 w-3 fill-fuchsia-500" /> Slavic Fit: {i.slavicFitScore}
=======
          <Heart className="text-accent-primary h-4 w-4" />
          <h4 className="text-accent-primary text-xs font-bold uppercase tracking-tight">
            Body Inclusivity Index
          </h4>
        </div>
        <div className="text-accent-primary flex items-center gap-1 text-[10px] font-black uppercase">
          <Star className="fill-accent-primary h-3 w-3" /> Slavic Fit: {i.slavicFitScore}
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div
<<<<<<< HEAD
          className={`flex flex-col items-center justify-center rounded-xl border p-3 ${i.petiteFriendly ? 'border-fuchsia-100 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 opacity-40'}`}
        >
          <Ruler className="mb-1 h-4 w-4 text-fuchsia-400" />
          <span className="text-[9px] font-black uppercase text-slate-600">Petite Friendly</span>
        </div>
        <div
          className={`flex flex-col items-center justify-center rounded-xl border p-3 ${i.tallFriendly ? 'border-fuchsia-100 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 opacity-40'}`}
        >
          <Users className="mb-1 h-4 w-4 text-fuchsia-400" />
          <span className="text-[9px] font-black uppercase text-slate-600">Tall Friendly</span>
=======
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
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </div>

      <div className="space-y-2">
<<<<<<< HEAD
        <div className="mb-1 text-[9px] font-black uppercase leading-none tracking-widest text-slate-400">
=======
        <div className="text-text-muted mb-1 text-[9px] font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
          Adjustment Points
        </div>
        <div className="flex flex-wrap gap-1.5">
          {i.adjustmentPoints.map((p) => (
            <Badge
              key={p}
              variant="secondary"
<<<<<<< HEAD
              className="h-4 border border-fuchsia-50 bg-white text-[8px] font-bold uppercase text-fuchsia-700"
=======
              className="border-accent-primary/15 text-accent-primary h-4 border bg-white text-[8px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center gap-1.5 border-t border-fuchsia-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
=======
      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center gap-1.5 border-t pt-3 text-[9px] font-bold uppercase italic">
>>>>>>> recover/cabinet-wip-from-stash
        <Info className="h-3 w-3" /> Based on regional demographic fit data v3.1
      </div>
    </Card>
  );
};
