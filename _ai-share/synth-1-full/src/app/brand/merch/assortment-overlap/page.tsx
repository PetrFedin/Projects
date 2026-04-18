'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { products } from '@/lib/products';
import { analyzeCannibalization } from '@/lib/fashion/cannibalization-analysis';

export default function AssortmentOverlapPage() {
  const impacts = analyzeCannibalization(products);

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-rose-100 p-2">
            <Layers className="h-6 w-6 text-rose-600" />
          </div>
<<<<<<< HEAD
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
=======
          <h1 className="text-text-primary text-3xl font-bold tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Assortment Cannibalization
          </h1>
        </div>
        <p className="text-muted-foreground">
          Overlap detection to prevent SKUs from competing for the same customer budget and shelf
          space.
        </p>
      </div>

      <div className="space-y-4">
        {impacts.map((impact, idx) => {
          const p1 = products.find((p) => p.sku === impact.primarySku);
          const p2 = products.find((p) => p.sku === impact.competingSku);
          if (!p1 || !p2) return null;

          const isHighRisk = impact.riskLevel === 'high';

          return (
            <Card
              key={idx}
<<<<<<< HEAD
              className={`overflow-hidden border-2 p-6 ${isHighRisk ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100'}`}
            >
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex flex-1 items-center gap-4">
                  <div className="h-20 w-16 overflow-hidden rounded border bg-slate-100">
                    <img src={p1.image} alt={p1.name} className="h-full w-full object-cover" />
=======
              className={`overflow-hidden border-2 p-6 ${isHighRisk ? 'border-rose-100 bg-rose-50/10' : 'border-border-subtle'}`}
            >
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex flex-1 items-center gap-4">
                  <div className="bg-bg-surface2 h-20 w-16 overflow-hidden rounded border">
                    <img
                      src={p1.images?.[0]?.url ?? ''}
                      alt={p1.name}
                      className="h-full w-full object-cover"
                    />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-muted-foreground">{p1.sku}</div>
                    <div className="truncate text-sm font-bold">{p1.name}</div>
                    <div className="text-xs font-semibold text-rose-600">${p1.price}</div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-1">
                  <div
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${isHighRisk ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}
                  >
                    {impact.overlapScore}% Overlap
                  </div>
                  <div className="flex items-center gap-1">
<<<<<<< HEAD
                    <div className="h-px w-10 bg-slate-200" />
                    <AlertTriangle
                      className={`h-4 w-4 ${isHighRisk ? 'text-rose-500' : 'text-orange-500'}`}
                    />
                    <div className="h-px w-10 bg-slate-200" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
=======
                    <div className="bg-border-subtle h-px w-10" />
                    <AlertTriangle
                      className={`h-4 w-4 ${isHighRisk ? 'text-rose-500' : 'text-orange-500'}`}
                    />
                    <div className="bg-border-subtle h-px w-10" />
                  </div>
                  <div className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    Risk: {impact.riskLevel}
                  </div>
                </div>

                <div className="flex flex-1 items-center gap-4 text-right md:flex-row-reverse">
<<<<<<< HEAD
                  <div className="h-20 w-16 overflow-hidden rounded border bg-slate-100">
                    <img src={p2.image} alt={p2.name} className="h-full w-full object-cover" />
=======
                  <div className="bg-bg-surface2 h-20 w-16 overflow-hidden rounded border">
                    <img
                      src={p2.images?.[0]?.url ?? ''}
                      alt={p2.name}
                      className="h-full w-full object-cover"
                    />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-muted-foreground">{p2.sku}</div>
                    <div className="truncate text-sm font-bold">{p2.name}</div>
                    <div className="text-xs font-semibold text-rose-600">${p2.price}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
<<<<<<< HEAD
                <Info className="mt-1 h-4 w-4 text-slate-400" />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-400">
                    AI Recommendation
                  </div>
                  <div className="text-sm font-medium text-slate-700">{impact.recommendation}</div>
=======
                <Info className="text-text-muted mt-1 h-4 w-4" />
                <div>
                  <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
                    AI Recommendation
                  </div>
                  <div className="text-text-primary text-sm font-medium">
                    {impact.recommendation}
                  </div>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
