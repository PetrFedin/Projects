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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-rose-100 rounded-lg">
            <Layers className="w-6 h-6 text-rose-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Assortment Cannibalization</h1>
        </div>
        <p className="text-muted-foreground">
          Overlap detection to prevent SKUs from competing for the same customer budget and shelf space.
        </p>
      </div>

      <div className="space-y-4">
        {impacts.map((impact, idx) => {
          const p1 = products.find(p => p.sku === impact.primarySku);
          const p2 = products.find(p => p.sku === impact.competingSku);
          if (!p1 || !p2) return null;

          const isHighRisk = impact.riskLevel === 'high';

          return (
            <Card key={idx} className={`p-6 overflow-hidden border-2 ${isHighRisk ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100'}`}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 flex gap-4 items-center">
                  <div className="w-16 h-20 bg-slate-100 rounded overflow-hidden border">
                    <img src={p1.image} alt={p1.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground font-bold">{p1.sku}</div>
                    <div className="text-sm font-bold truncate">{p1.name}</div>
                    <div className="text-xs font-semibold text-rose-600">${p1.price}</div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-1">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isHighRisk ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                    {impact.overlapScore}% Overlap
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-10 h-px bg-slate-200" />
                    <AlertTriangle className={`w-4 h-4 ${isHighRisk ? 'text-rose-500' : 'text-orange-500'}`} />
                    <div className="w-10 h-px bg-slate-200" />
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase">Risk: {impact.riskLevel}</div>
                </div>

                <div className="flex-1 flex gap-4 items-center text-right md:flex-row-reverse">
                  <div className="w-16 h-20 bg-slate-100 rounded overflow-hidden border">
                    <img src={p2.image} alt={p2.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground font-bold">{p2.sku}</div>
                    <div className="text-sm font-bold truncate">{p2.name}</div>
                    <div className="text-xs font-semibold text-rose-600">${p2.price}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border flex gap-3 items-start shadow-sm">
                <Info className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1 leading-none">AI Recommendation</div>
                  <div className="text-sm font-medium text-slate-700">{impact.recommendation}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
