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
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-50 bg-indigo-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Layout className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Layout className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Visual Merchandising Planogram
          </h4>
        </div>
        <Badge className="border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
=======
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
>>>>>>> recover/cabinet-wip-from-stash
          Priority: {vm.priorityLevel === 1 ? 'High' : 'Normal'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
<<<<<<< HEAD
          <div className="rounded-xl border border-indigo-100 bg-white/80 p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
          <div className="border-accent-primary/20 rounded-xl border bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Boxes className="h-3 w-3" /> Display Instructions
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
<<<<<<< HEAD
                className="border-indigo-200 px-3 text-[10px] font-black uppercase text-indigo-600"
              >
                {vm.displayType}
              </Badge>
              <div className="text-[9px] font-bold leading-tight text-slate-600">
=======
                className="border-accent-primary/30 text-accent-primary px-3 text-[10px] font-black uppercase"
              >
                {vm.displayType}
              </Badge>
              <div className="text-text-secondary text-[9px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                {vm.technicalNotes}
              </div>
            </div>
          </div>

          <div className="space-y-2">
<<<<<<< HEAD
            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
            <div className="text-text-muted flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Layers className="h-3 w-3" /> Suggested Capsule Neighbors
            </div>
            <div className="flex gap-2">
              {vm.suggestedNeighbors.map((n) => (
                <div
                  key={n}
<<<<<<< HEAD
                  className="flex h-12 w-10 items-center justify-center rounded border border-indigo-100 bg-slate-100 text-[7px] font-black uppercase text-slate-400"
=======
                  className="bg-bg-surface2 border-accent-primary/20 text-text-muted flex h-12 w-10 items-center justify-center rounded border text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="flex flex-col justify-center rounded-xl border border-indigo-100 bg-indigo-600/5 p-4 text-center">
          <Info className="mx-auto mb-2 h-5 w-5 text-indigo-400" />
          <p className="text-[9px] font-bold leading-tight text-slate-600">
=======
        <div className="bg-accent-primary/5 border-accent-primary/20 flex flex-col justify-center rounded-xl border p-4 text-center">
          <Info className="text-accent-primary mx-auto mb-2 h-5 w-5" />
          <p className="text-text-secondary text-[9px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
            "This item is a core driver for SS26 retail floor traffic. Recommended for window
            mannequin placement."
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
<<<<<<< HEAD
        className="mt-3 flex h-8 w-full items-center justify-center gap-2 text-[8px] font-black uppercase text-indigo-500 hover:bg-indigo-50"
=======
        className="text-accent-primary hover:bg-accent-primary/10 mt-3 flex h-8 w-full items-center justify-center gap-2 text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
      >
        Download Full VM Guide <ArrowRight className="h-3 w-3" />
      </Button>
    </Card>
  );
}
