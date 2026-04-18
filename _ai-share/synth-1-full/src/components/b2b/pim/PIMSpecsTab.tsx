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
            <Box className="text-accent-primary h-4 w-4" />
            <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
              Material Composition
            </h4>
          </div>
          <div className="space-y-3">
            {(selectedProduct.composition || []).map((c: any, i: number) => (
              <div key={i} className="bg-bg-surface2 flex items-center gap-3 rounded-2xl p-4">
                <Input
                  defaultValue={c.material}
                  className="h-10 flex-1 rounded-xl border-none bg-white text-[10px] font-bold"
                />
                <div className="relative w-24">
                  <Input
                    defaultValue={c.percent}
                    type="number"
                    className="h-10 rounded-xl border-none bg-white pr-6 text-[10px] font-black"
                  />
                  <span className="text-text-muted absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black">
                    %
                  </span>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              className="border-border-subtle text-text-muted hover:border-accent-primary/30 h-12 w-full rounded-2xl border-2 border-dashed text-[9px] font-black uppercase"
            >
              <Plus className="mr-2 h-3.5 w-3.5" /> Add Material
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-accent-primary h-4 w-4" />
            <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
              Compliance & Certs
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {(selectedProduct.certs || []).map((cert: string) => (
              <Badge
                key={cert}
                className="flex h-10 items-center gap-2 rounded-xl border-emerald-100 bg-emerald-50 px-4 text-emerald-600"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-[9px] font-black">{cert}</span>
              </Badge>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-border-default h-10 rounded-xl border-dashed text-[9px] font-black uppercase"
            >
              Upload Certificate
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Wind className="text-accent-primary h-4 w-4" />
            <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
              Performance Metrics
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Breathability', val: '20K g/m²', icon: Wind },
              { label: 'Waterproof', val: '15K mm', icon: Droplets },
            ].map((m, i) => (
              <Card key={i} className="bg-bg-surface2 space-y-2 border-none p-4 shadow-sm">
                <m.icon className="text-accent-primary mb-2 h-4 w-4" />
                <p className="text-text-muted text-[8px] font-black uppercase">{m.label}</p>
                <Input
                  defaultValue={m.val}
                  className="h-8 border-none bg-transparent p-0 text-sm font-black"
                />
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-accent-primary group relative overflow-hidden rounded-xl border-none p-4 text-white shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
            <Settings2 className="h-20 w-20" />
          </div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-base font-black uppercase tracking-tight">Production Tech-Pack</h4>
            <p className="text-[10px] font-medium uppercase leading-relaxed tracking-widest text-white/60">
              Upload your pattern files and BOM for automated factory sync
            </p>
            <Button className="text-accent-primary h-12 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-white/90">
              Sync with Factory
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
