'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp, Info, ArrowRight, DollarSign, BarChart3 } from 'lucide-react';
import { getDynamicMarkdown } from '@/lib/fashion/markdown-optimizer';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductDynamicMarkdownBlock({ product }: { product: Product }) {
  const markdown = getDynamicMarkdown(product.sku, product.price);

  return (
    <Card className="p-4 border-2 border-rose-50 bg-rose-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Flame className="w-16 h-16 text-rose-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-rose-600">
          <Flame className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">AI Retail Dynamic Markdown Optimizer</h4>
        </div>
        <Badge className={cn("text-white text-[8px] font-black border-none uppercase", markdown.localStockLevel === 'excess' ? 'bg-rose-600' : 'bg-emerald-600')}>
           Stock: {markdown.localStockLevel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-rose-100 shadow-sm text-center">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Suggested Action</div>
               {markdown.suggestedMarkdownPercent > 0 ? (
                 <>
                    <div className="text-3xl font-black text-rose-600">-{markdown.suggestedMarkdownPercent}%</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Limited Time Price Drop</div>
                 </>
               ) : (
                 <>
                    <div className="text-xl font-black text-emerald-600 uppercase">Maintain MSRP</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Healthy Velocity</div>
                 </>
               )}
            </div>
            
            <div className="flex gap-2">
               <div className="flex-1 p-2.5 bg-white/50 rounded-xl border border-rose-100 text-center">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500 mx-auto mb-1" />
                  <div className="text-[12px] font-black text-slate-800 leading-none">+{markdown.projectedSellThroughIncrease}%</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Proj. Lift</div>
               </div>
               <div className="flex-1 p-2.5 bg-white/50 rounded-xl border border-rose-100 text-center">
                  <BarChart3 className="w-3.5 h-3.5 text-sky-500 mx-auto mb-1" />
                  <div className="text-[12px] font-black text-slate-800 leading-none">AI</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Model-V2</div>
               </div>
            </div>
         </div>

         <div className="p-4 bg-rose-600/5 rounded-xl border border-rose-100 flex flex-col justify-center">
            <div className="text-[8px] font-black text-rose-600 uppercase mb-2 flex items-center gap-2">
               <Info className="w-3.5 h-3.5" /> Markdown Rational
            </div>
            <p className="text-[10px] font-bold text-slate-600 leading-tight">
               "{markdown.reason}"
            </p>
            <div className="mt-3 pt-3 border-t border-rose-100">
               <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                  <span>Current Price</span>
                  <span>{markdown.currentPrice.toLocaleString()} ₽</span>
               </div>
               {markdown.suggestedMarkdownPercent > 0 && (
                 <div className="flex justify-between text-[10px] font-black uppercase text-rose-600 mt-1">
                    <span>Markdown Price</span>
                    <span>{(markdown.currentPrice * (1 - markdown.suggestedMarkdownPercent/100)).toLocaleString()} ₽</span>
                 </div>
               )}
            </div>
         </div>
      </div>

      <Button className="w-full mt-3 h-8 bg-rose-600 text-white hover:bg-rose-700 text-[8px] font-black uppercase tracking-widest shadow-lg">
         Apply to All PoS Terminals
      </Button>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
