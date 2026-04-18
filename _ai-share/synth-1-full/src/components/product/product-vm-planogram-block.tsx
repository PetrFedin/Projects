'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout, Boxes, ArrowRight, Layers, Info } from 'lucide-react';
import { generateVMPlanogram } from '@/lib/fashion/vm-planogram';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductVMPlanogramBlock({ product }: { product: Product }) {
  const planograms = generateVMPlanogram([product.sku]);
  const vm = planograms[0];

  return (
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Layout className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent-primary flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Visual Merchandising Planogram
          </h4>
        </div>
        <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
          Priority: {vm.priorityLevel === 1 ? 'High' : 'Normal'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="border-accent-primary/20 rounded-xl border bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
              <Boxes className="h-3 w-3" /> Display Instructions
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-accent-primary/30 text-accent-primary px-3 text-[10px] font-black uppercase"
              >
                {vm.displayType}
              </Badge>
              <div className="text-text-secondary text-[9px] font-bold leading-tight">
                {vm.technicalNotes}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-text-muted flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
              <Layers className="h-3 w-3" /> Suggested Capsule Neighbors
            </div>
            <div className="flex gap-2">
              {vm.suggestedNeighbors.map((n) => (
                <div
                  key={n}
                  className="bg-bg-surface2 border-accent-primary/20 text-text-muted flex h-12 w-10 items-center justify-center rounded border text-[7px] font-black uppercase"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-accent-primary/5 border-accent-primary/20 flex flex-col justify-center rounded-xl border p-4 text-center">
          <Info className="text-accent-primary mx-auto mb-2 h-5 w-5" />
          <p className="text-text-secondary text-[9px] font-bold leading-tight">
            "This item is a core driver for SS26 retail floor traffic. Recommended for window
            mannequin placement."
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-accent-primary hover:bg-accent-primary/10 mt-3 flex h-8 w-full items-center justify-center gap-2 text-[8px] font-black uppercase"
      >
        Download Full VM Guide <ArrowRight className="h-3 w-3" />
      </Button>
    </Card>
  );
}
