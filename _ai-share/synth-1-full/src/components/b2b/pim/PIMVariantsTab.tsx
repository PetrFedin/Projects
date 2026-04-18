'use client';

import React from 'react';
import { Plus, RefreshCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PIMVariantsTabProps {
  selectedProduct: any;
}

export function PIMVariantsTab({ selectedProduct }: PIMVariantsTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
<<<<<<< HEAD
          <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
            Color & Size Matrix
          </h4>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
          <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
            Color & Size Matrix
          </h4>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Manage available to sell (ATS) quantities per variant
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
<<<<<<< HEAD
            className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-6 text-[9px] font-black uppercase tracking-widest"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Sync All ATS
          </Button>
          <Button className="h-10 gap-2 rounded-xl bg-slate-900 px-6 text-[9px] font-black uppercase tracking-widest text-white">
=======
            className="border-border-default h-10 gap-2 rounded-xl bg-white px-6 text-[9px] font-black uppercase tracking-widest"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Sync All ATS
          </Button>
          <Button className="bg-text-primary h-10 gap-2 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="h-3.5 w-3.5" /> Add Color Way
          </Button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mb-8 flex items-center justify-between rounded-2xl bg-indigo-900 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Zap className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-black uppercase">Rapid ATS Adjustment</p>
            <p className="text-[9px] font-medium uppercase text-indigo-200">
=======
      <div className="bg-accent-primary mb-8 flex items-center justify-between rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Zap className="text-accent-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase">Rapid ATS Adjustment</p>
            <p className="text-accent-primary/40 text-[9px] font-medium uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              Apply +/- offsets across all sizes for the selected season
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Offset (e.g. +50)"
            className="h-10 w-32 border-white/10 bg-white/5 text-[10px] font-black text-white placeholder:text-white/20"
          />
<<<<<<< HEAD
          <Button className="h-10 rounded-xl bg-white px-6 text-[10px] font-black uppercase text-indigo-900">
=======
          <Button className="text-accent-primary h-10 rounded-xl bg-white px-6 text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {(selectedProduct.variants || []).map((v: any, idx: number) => (
<<<<<<< HEAD
          <div key={idx} className="space-y-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
=======
          <div
            key={idx}
            className="bg-bg-surface2 border-border-subtle space-y-6 rounded-xl border p-4"
          >
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full border-4 border-white shadow-sm"
                  style={{ backgroundColor: v.hex }}
                />
                <div>
<<<<<<< HEAD
                  <p className="text-xs font-black uppercase text-slate-900">{v.color}</p>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
=======
                  <p className="text-text-primary text-xs font-black uppercase">{v.color}</p>
                  <p className="text-text-muted text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    Status: Live on Marketplace
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
<<<<<<< HEAD
                  className="h-8 rounded-lg border-slate-200 bg-white text-[8px] font-black uppercase"
=======
                  className="border-border-default h-8 rounded-lg bg-white text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Edit Mapping
                </Button>
                <Button
                  variant="outline"
                  size="sm"
<<<<<<< HEAD
                  className="h-8 rounded-lg border-slate-200 bg-white text-[8px] font-black uppercase text-rose-600"
=======
                  className="border-border-default h-8 rounded-lg bg-white text-[8px] font-black uppercase text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Disable
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {Object.entries(v.sizes).map(([size, qty]: [string, any]) => (
                <div key={size} className="space-y-2">
<<<<<<< HEAD
                  <label className="block text-center text-[9px] font-black uppercase text-slate-400">
=======
                  <label className="text-text-muted block text-center text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    {size}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      defaultValue={qty}
<<<<<<< HEAD
                      className="h-12 rounded-xl border-slate-100 bg-white text-center text-xs font-black focus:ring-indigo-500"
=======
                      className="border-border-subtle focus:ring-accent-primary h-12 rounded-xl bg-white text-center text-xs font-black"
>>>>>>> recover/cabinet-wip-from-stash
                    />
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
