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
          <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
            Color & Size Matrix
          </h4>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Manage available to sell (ATS) quantities per variant
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-border-default h-10 gap-2 rounded-xl bg-white px-6 text-[9px] font-black uppercase tracking-widest"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Sync All ATS
          </Button>
          <Button className="bg-text-primary h-10 gap-2 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white">
            <Plus className="h-3.5 w-3.5" /> Add Color Way
          </Button>
        </div>
      </div>

      <div className="bg-accent-primary mb-8 flex items-center justify-between rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Zap className="text-accent-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase">Rapid ATS Adjustment</p>
            <p className="text-accent-primary/40 text-[9px] font-medium uppercase">
              Apply +/- offsets across all sizes for the selected season
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Offset (e.g. +50)"
            className="h-10 w-32 border-white/10 bg-white/5 text-[10px] font-black text-white placeholder:text-white/20"
          />
          <Button className="text-accent-primary h-10 rounded-xl bg-white px-6 text-[10px] font-black uppercase">
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {(selectedProduct.variants || []).map((v: any, idx: number) => (
          <div
            key={idx}
            className="bg-bg-surface2 border-border-subtle space-y-6 rounded-xl border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full border-4 border-white shadow-sm"
                  style={{ backgroundColor: v.hex }}
                />
                <div>
                  <p className="text-text-primary text-xs font-black uppercase">{v.color}</p>
                  <p className="text-text-muted text-[9px] font-bold uppercase">
                    Status: Live on Marketplace
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border-default h-8 rounded-lg bg-white text-[8px] font-black uppercase"
                >
                  Edit Mapping
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border-default h-8 rounded-lg bg-white text-[8px] font-black uppercase text-rose-600"
                >
                  Disable
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {Object.entries(v.sizes).map(([size, qty]: [string, any]) => (
                <div key={size} className="space-y-2">
                  <label className="text-text-muted block text-center text-[9px] font-black uppercase">
                    {size}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      defaultValue={qty}
                      className="border-border-subtle focus:ring-accent-primary h-12 rounded-xl bg-white text-center text-xs font-black"
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
