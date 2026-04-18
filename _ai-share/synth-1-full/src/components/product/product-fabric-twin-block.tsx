'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Boxes, Zap, ShieldCheck, Droplets, Wind, RefreshCw, Layers, Info } from 'lucide-react';
import { getFabricTwinData } from '@/lib/fashion/fabric-digital-twin';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductFabricTwinBlock({ product }: { product: Product }) {
  const twin = getFabricTwinData(product.sku);

  return (
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-100 bg-white p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Layers className="h-16 w-16 text-indigo-600" />
=======
    <Card className="border-accent-primary/20 relative my-4 overflow-hidden border-2 bg-white p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Layers className="text-accent-primary h-16 w-16" />
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
<<<<<<< HEAD
          <Boxes className="h-4 w-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Digital Twin: Fabric Performance
          </h4>
        </div>
        <Badge className="border-none bg-indigo-50 text-[8px] font-black uppercase text-indigo-700">
=======
          <Boxes className="text-accent-primary h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Digital Twin: Fabric Performance
          </h4>
        </div>
        <Badge className="bg-accent-primary/10 text-accent-primary border-none text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          Technical Spec V1.2
        </Badge>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1.5">
<<<<<<< HEAD
          <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="h-2.5 w-2.5" /> Martindale
            </span>
            <span className="text-slate-700">{twin.martindaleCycles.toLocaleString()}</span>
          </div>
          <Progress
            value={(twin.martindaleCycles / 50000) * 100}
            className="h-1 bg-slate-50 fill-indigo-500"
=======
          <div className="text-text-muted flex items-center justify-between text-[8px] font-black uppercase">
            <span className="flex items-center gap-1">
              <Zap className="h-2.5 w-2.5" /> Martindale
            </span>
            <span className="text-text-primary">{twin.martindaleCycles.toLocaleString()}</span>
          </div>
          <Progress
            value={(twin.martindaleCycles / 50000) * 100}
            className="bg-bg-surface2 fill-accent-primary h-1"
>>>>>>> recover/cabinet-wip-from-stash
          />
        </div>

        <div className="space-y-1.5">
<<<<<<< HEAD
          <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-2.5 w-2.5" /> Color Fastness
            </span>
            <span className="text-slate-700">{twin.colorFastness}/5</span>
          </div>
          <Progress
            value={(twin.colorFastness / 5) * 100}
            className="h-1 bg-slate-50 fill-emerald-500"
=======
          <div className="text-text-muted flex items-center justify-between text-[8px] font-black uppercase">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-2.5 w-2.5" /> Color Fastness
            </span>
            <span className="text-text-primary">{twin.colorFastness}/5</span>
          </div>
          <Progress
            value={(twin.colorFastness / 5) * 100}
            className="bg-bg-surface2 h-1 fill-emerald-500"
>>>>>>> recover/cabinet-wip-from-stash
          />
        </div>

        <div className="space-y-1.5">
<<<<<<< HEAD
          <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-400">
            <span className="flex items-center gap-1">
              <Wind className="h-2.5 w-2.5" /> Breathability
            </span>
            <span className="text-slate-700">{twin.breathabilityGsm} g/m²</span>
          </div>
          <Progress
            value={(twin.breathabilityGsm / 300) * 100}
            className="h-1 bg-slate-50 fill-blue-400"
=======
          <div className="text-text-muted flex items-center justify-between text-[8px] font-black uppercase">
            <span className="flex items-center gap-1">
              <Wind className="h-2.5 w-2.5" /> Breathability
            </span>
            <span className="text-text-primary">{twin.breathabilityGsm} g/m²</span>
          </div>
          <Progress
            value={(twin.breathabilityGsm / 300) * 100}
            className="bg-bg-surface2 h-1 fill-blue-400"
>>>>>>> recover/cabinet-wip-from-stash
          />
        </div>

        <div className="space-y-1.5">
<<<<<<< HEAD
          <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-400">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-2.5 w-2.5" /> Wash Life
            </span>
            <span className="text-slate-700">{twin.washDurability} Cycles</span>
          </div>
          <Progress
            value={(twin.washDurability / 100) * 100}
            className="h-1 bg-slate-50 fill-rose-400"
=======
          <div className="text-text-muted flex items-center justify-between text-[8px] font-black uppercase">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-2.5 w-2.5" /> Wash Life
            </span>
            <span className="text-text-primary">{twin.washDurability} Cycles</span>
          </div>
          <Progress
            value={(twin.washDurability / 100) * 100}
            className="bg-bg-surface2 h-1 fill-rose-400"
>>>>>>> recover/cabinet-wip-from-stash
          />
        </div>
      </div>

<<<<<<< HEAD
      <div className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        <div className="text-[9px] font-medium leading-tight text-slate-500">
=======
      <div className="bg-bg-surface2 border-border-subtle flex items-start gap-2 rounded-lg border p-2.5">
        <Info className="text-accent-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="text-text-secondary text-[9px] font-medium leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
          <b>Цифровой паспорт материала:</b> Высокая устойчивость к истиранию (Martindale 45k+) и
          стабильность цвета. Идеально для повседневной эксплуатации в РФ условиях.
        </div>
      </div>
    </Card>
  );
}
