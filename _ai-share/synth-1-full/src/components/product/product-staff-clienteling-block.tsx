'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Target, Heart, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { getClientStyleProfile } from '@/lib/fashion/instore-clienteling';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStaffClientelingBlock({ product }: { product: Product }) {
  // Demo: assumption of an active client in-store
  const client = getClientStyleProfile('CLIENT-RU-99');

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-sky-100 bg-sky-50/5 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <UserCheck className="h-16 w-16 text-sky-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-600">
          <UserCheck className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            In-Store Clienteling Card
          </h4>
        </div>
        <Badge className="border-none bg-sky-100 text-[8px] font-black uppercase text-sky-700">
          Active Client Profile
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm">
<<<<<<< HEAD
          <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
            Style DNA Match
          </div>
          <div className="text-sm font-black text-slate-800">{client.styleProfile}</div>
=======
          <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
            Style DNA Match
          </div>
          <div className="text-text-primary text-sm font-black">{client.styleProfile}</div>
>>>>>>> recover/cabinet-wip-from-stash
          <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-emerald-600">
            <Sparkles className="h-2.5 w-2.5" /> 92% Alignment
          </div>
        </div>
        <div className="rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm">
<<<<<<< HEAD
          <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
            Recommended Size
          </div>
          <div className="text-sm font-black text-slate-800">{client.sizeAffinity}</div>
          <div className="mt-1 text-[8px] font-black uppercase leading-none text-slate-400">
=======
          <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
            Recommended Size
          </div>
          <div className="text-text-primary text-sm font-black">{client.sizeAffinity}</div>
          <div className="text-text-muted mt-1 text-[8px] font-black uppercase leading-none">
>>>>>>> recover/cabinet-wip-from-stash
            Base: {client.lastPurchaseCategory}
          </div>
        </div>
      </div>

      <div className="mb-2 rounded-xl border border-sky-100 bg-sky-600/5 p-3">
        <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-sky-600">
          <Target className="h-3.5 w-3.5" /> Cross-sell Strategy for Staff
        </div>
<<<<<<< HEAD
        <p className="text-[10px] font-bold leading-tight text-slate-600">
=======
        <p className="text-text-secondary text-[10px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
          "Client prefers monochromatic looks. Offer this <b>{product.name}</b> as a layering piece
          for their existing <b>{client.lastPurchaseCategory}</b> collection."
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-2 flex h-8 w-full items-center justify-center gap-2 border-sky-200 text-[8px] font-black uppercase text-sky-700 hover:bg-sky-50"
      >
        <ShoppingBag className="h-3 w-3" /> View Full Purchase History{' '}
        <ArrowRight className="h-2.5 w-2.5" />
      </Button>
    </Card>
  );
}
