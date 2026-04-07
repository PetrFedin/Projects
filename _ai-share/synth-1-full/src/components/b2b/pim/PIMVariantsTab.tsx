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
          <h4 className="text-base font-black uppercase tracking-tight text-slate-900">Color & Size Matrix</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage available to sell (ATS) quantities per variant</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 rounded-xl px-6 border-slate-200 font-black uppercase text-[9px] tracking-widest gap-2 bg-white">
            <RefreshCcw className="h-3.5 w-3.5" /> Sync All ATS
          </Button>
          <Button className="h-10 bg-slate-900 text-white rounded-xl px-6 font-black uppercase text-[9px] tracking-widest gap-2">
            <Plus className="h-3.5 w-3.5" /> Add Color Way
          </Button>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-4 rounded-2xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-black uppercase">Rapid ATS Adjustment</p>
            <p className="text-[9px] font-medium text-indigo-200 uppercase">Apply +/- offsets across all sizes for the selected season</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Offset (e.g. +50)" className="h-10 w-32 bg-white/5 border-white/10 text-white text-[10px] font-black placeholder:text-white/20" />
          <Button className="h-10 bg-white text-indigo-900 px-6 rounded-xl font-black uppercase text-[10px]">Apply</Button>
        </div>
      </div>

      <div className="space-y-6">
        {(selectedProduct.variants || []).map((v: any, idx: number) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: v.hex }} />
                <div>
                  <p className="text-xs font-black uppercase text-slate-900">{v.color}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Status: Live on Marketplace</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg bg-white border-slate-200 text-[8px] font-black uppercase">Edit Mapping</Button>
                <Button variant="outline" size="sm" className="h-8 rounded-lg bg-white border-slate-200 text-rose-600 text-[8px] font-black uppercase">Disable</Button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {Object.entries(v.sizes).map(([size, qty]: [string, any]) => (
                <div key={size} className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 block text-center">{size}</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      defaultValue={qty} 
                      className="h-12 rounded-xl bg-white border-slate-100 text-center font-black text-xs focus:ring-indigo-500" 
                    />
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
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
