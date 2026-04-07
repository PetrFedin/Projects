'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, TrendingUp, Info, Package, ArrowRight, Activity } from 'lucide-react';
import { getRetailInventoryHealth } from '@/lib/fashion/retail-inventory-health';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductRetailInventoryHealthBlock({ product }: { product: Product }) {
  const health = getRetailInventoryHealth(product.sku, 'Store-Moscow-Central');

  return (
    <Card className={cn("p-4 border-2 shadow-sm my-4 relative overflow-hidden", 
      health.status === 'critical' ? 'border-rose-100 bg-rose-50/10' : 
      health.status === 'at_risk' ? 'border-amber-100 bg-amber-50/10' : 'border-emerald-100 bg-emerald-50/10'
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Activity className="w-16 h-16" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Retail Inventory Health (Local Store)</h4>
        </div>
        <Badge className={cn("text-white text-[8px] font-black border-none uppercase", 
          health.status === 'healthy' ? 'bg-emerald-600' : 
          health.status === 'excess' ? 'bg-blue-600' : 'bg-rose-600'
        )}>
           {health.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
               <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">On Hand Stk.</div>
                  <div className="text-2xl font-black text-slate-800">{health.onHand} <span className="text-xs text-slate-400 uppercase font-bold">u.</span></div>
               </div>
               <div className="text-right">
                  <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Min. Buffer</div>
                  <div className="text-lg font-black text-slate-500">{health.minBuffer} u.</div>
               </div>
            </div>
            
            <div className="p-3 bg-white/50 rounded-xl border border-slate-100">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-500" /> Stock Runway
               </div>
               <div className="text-[14px] font-black text-slate-800">12 Days <span className="text-[8px] text-slate-400 uppercase">Estimated</span></div>
            </div>
         </div>

         <div className={cn("p-4 rounded-xl border flex flex-col justify-center",
           health.status === 'critical' ? 'bg-rose-600/5 border-rose-100' : 'bg-emerald-600/5 border-emerald-100'
         )}>
            <div className="text-[8px] font-black uppercase mb-2 flex items-center gap-2">
               <Info className="w-3.5 h-3.5" /> AI Action Insight
            </div>
            <p className="text-[10px] font-bold text-slate-600 leading-tight">
               "{health.action}"
            </p>
            <Button className={cn("w-full mt-3 h-8 text-[8px] font-black uppercase tracking-widest shadow-lg",
              health.status === 'healthy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
            )}>
               {health.status === 'excess' ? 'Initiate Swap' : 'Restock Store'}
            </Button>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Last Sync with PoS: Today, 14:45</span>
         <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> RFID Data Verified
         </span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
