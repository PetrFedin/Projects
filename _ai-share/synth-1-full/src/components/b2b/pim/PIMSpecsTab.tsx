'use client';

import React from 'react';
import { Plus, Box, ShieldCheck, CheckCircle2, Wind, Droplets, Settings2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PIMSpecsTabProps {
  selectedProduct: any;
}

export function PIMSpecsTab({ selectedProduct }: PIMSpecsTabProps) {
  return (
    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Box className="h-4 w-4 text-indigo-600" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Material Composition</h4>
          </div>
          <div className="space-y-3">
            {(selectedProduct.composition || []).map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                <Input defaultValue={c.material} className="flex-1 h-10 rounded-xl bg-white border-none text-[10px] font-bold" />
                <div className="w-24 relative">
                  <Input defaultValue={c.percent} type="number" className="h-10 rounded-xl bg-white border-none text-[10px] font-black pr-6" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">%</span>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full border-2 border-dashed border-slate-100 h-12 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:border-indigo-200">
              <Plus className="h-3.5 w-3.5 mr-2" /> Add Material
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Compliance & Certs</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {(selectedProduct.certs || []).map((cert: string) => (
              <Badge key={cert} className="h-10 px-4 rounded-xl bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-[9px] font-black">{cert}</span>
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-200 border-dashed text-[9px] font-black uppercase">
              Upload Certificate
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Wind className="h-4 w-4 text-indigo-600" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Performance Metrics</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Breathability', val: '20K g/m²', icon: Wind },
              { label: 'Waterproof', val: '15K mm', icon: Droplets }
            ].map((m, i) => (
              <Card key={i} className="border-none shadow-sm bg-slate-50 p-4 space-y-2">
                <m.icon className="h-4 w-4 text-indigo-400 mb-2" />
                <p className="text-[8px] font-black text-slate-400 uppercase">{m.label}</p>
                <Input defaultValue={m.val} className="h-8 bg-transparent border-none p-0 font-black text-sm" />
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-none shadow-sm bg-indigo-900 text-white p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Settings2 className="h-20 w-20" />
          </div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-base font-black uppercase tracking-tight">Production Tech-Pack</h4>
            <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase tracking-widest">Upload your pattern files and BOM for automated factory sync</p>
            <Button className="w-full bg-white text-indigo-900 hover:bg-white/90 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
              Sync with Factory
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
