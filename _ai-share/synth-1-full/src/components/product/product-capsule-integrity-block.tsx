'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { checkCapsuleIntegrity } from '@/lib/fashion/assortment-capsule';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductCapsuleIntegrityBlock({ product }: { product: Product }) {
  // Demo current session SKUs
  const capsule = checkCapsuleIntegrity(product.sku, ['SKU-101-TOP', 'SKU-101-ACC']);

  return (
<<<<<<< HEAD
    <Card className="group relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <LayoutGrid className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
    <Card className="border-border-subtle bg-bg-surface2/10 group relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            B2B Capsule Integrity
          </h4>
        </div>
        <Badge
          variant="outline"
<<<<<<< HEAD
          className="h-4 border-slate-200 bg-white text-[8px] font-black uppercase"
=======
          className="border-border-default h-4 bg-white text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
        >
          {capsule.capsuleId}
        </Badge>
      </div>

<<<<<<< HEAD
      <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase text-slate-800">Capsule Health</div>
          <div className="text-[11px] font-black text-indigo-600">{capsule.integrityScore}%</div>
        </div>
        <Progress value={capsule.integrityScore} className="h-1 bg-slate-50 fill-indigo-600" />
      </div>

      <div className="mb-4 space-y-3">
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
      <div className="border-border-subtle mb-4 rounded-2xl border bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-text-primary text-[10px] font-black uppercase">Capsule Health</div>
          <div className="text-accent-primary text-[11px] font-black">
            {capsule.integrityScore}%
          </div>
        </div>
        <Progress
          value={capsule.integrityScore}
          className="bg-bg-surface2 fill-accent-primary h-1"
        />
      </div>

      <div className="mb-4 space-y-3">
        <div className="text-text-muted text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
          Required Components
        </div>
        {capsule.requiredSkus.map((req, i) => (
          <div
            key={i}
<<<<<<< HEAD
            className="flex items-center justify-between rounded-xl border border-slate-100/50 bg-slate-50 p-2.5"
=======
            className="bg-bg-surface2 border-border-subtle/50 flex items-center justify-between rounded-xl border p-2.5"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <div className="flex items-center gap-2">
              {capsule.missingSkus.includes(req) ? (
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-2 w-2 text-amber-600" />
                </div>
              ) : (
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                </div>
              )}
              <div
<<<<<<< HEAD
                className={`text-[10px] font-bold ${capsule.missingSkus.includes(req) ? 'text-slate-400' : 'text-slate-800'}`}
=======
                className={`text-[10px] font-bold ${capsule.missingSkus.includes(req) ? 'text-text-muted' : 'text-text-primary'}`}
>>>>>>> recover/cabinet-wip-from-stash
              >
                {req}
              </div>
            </div>
            {capsule.missingSkus.includes(req) && (
<<<<<<< HEAD
              <button className="flex items-center gap-1 text-[8px] font-black uppercase tracking-tighter text-indigo-600 hover:underline">
=======
              <button className="text-accent-primary flex items-center gap-1 text-[8px] font-black uppercase tracking-tighter hover:underline">
>>>>>>> recover/cabinet-wip-from-stash
                Add <ArrowRight className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="group/btn relative flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-100">
=======
      <div className="bg-accent-primary shadow-accent-primary/10 group/btn relative flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl p-3 text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform group-hover/btn:scale-125">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <div className="relative z-10 text-[10px] font-black uppercase tracking-widest">
          Optimize Capsule Mix
        </div>
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </div>
    </Card>
  );
}
