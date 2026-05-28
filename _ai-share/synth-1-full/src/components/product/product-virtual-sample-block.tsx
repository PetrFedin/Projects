'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Sparkles, Smartphone, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getVirtualSampleData } from '@/lib/fashion/virtual-sample-fitting';
import type { Product } from '@/lib/types';

export function ProductVirtualSampleBlock({ product }: { product: Product }) {
  const vto = getVirtualSampleData(product.sku);

  if (!vto.has3dModel) return null;

  return (
    <Card className="border-accent-primary/20 bg-accent-primary/10 group relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-4 opacity-5 transition-transform group-hover:scale-110">
        <Box className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent-primary flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Showroom Virtual Sample
          </h4>
        </div>
        <Badge className="bg-accent-primary h-4 border-none text-[8px] font-black uppercase text-white">
          3D READY
        </Badge>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="bg-border-subtle border-border-default flex h-24 w-20 items-center justify-center rounded-xl border-2 border-dashed">
          <User className="text-text-muted h-10 w-10" />
        </div>
        <div className="flex-1">
          <div className="text-text-primary mb-1 text-[11px] font-black">VTO Digital Fitting</div>
          <p className="text-text-secondary mb-3 text-[9px] leading-tight">
            View this sample on multiple regional body archetypes.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {vto.avatarTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="border-border-subtle h-3.5 bg-white text-[7px] font-black uppercase"
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="border-accent-primary/15 flex items-center justify-between rounded-xl border bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-text-secondary text-[9px] font-black">
            Fit Accuracy: {vto.fitAccuracy}%
          </span>
        </div>
        <button className="bg-accent-primary flex h-6 items-center gap-1.5 rounded-lg px-3 text-[8px] font-black uppercase text-white shadow-md">
          Launch VTO <Smartphone className="h-2.5 w-2.5" />
        </button>
      </div>
    </Card>
  );
}
