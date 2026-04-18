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
    <Card className="relative my-4 overflow-hidden border-2 border-rose-50 bg-rose-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Flame className="h-16 w-16 text-rose-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-600">
          <Flame className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            AI Retail Dynamic Markdown Optimizer
          </h4>
        </div>
        <Badge
          className={cn(
            'border-none text-[8px] font-black uppercase text-white',
            markdown.localStockLevel === 'excess' ? 'bg-rose-600' : 'bg-emerald-600'
          )}
        >
          Stock: {markdown.localStockLevel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-100 bg-white/80 p-3 text-center shadow-sm">
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
              Suggested Action
            </div>
            {markdown.suggestedMarkdownPercent > 0 ? (
              <>
                <div className="text-3xl font-black text-rose-600">
                  -{markdown.suggestedMarkdownPercent}%
                </div>
                <div className="mt-1 text-[9px] font-bold uppercase text-slate-500">
                  Limited Time Price Drop
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-black uppercase text-emerald-600">Maintain MSRP</div>
                <div className="mt-1 text-[9px] font-bold uppercase text-slate-500">
                  Healthy Velocity
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 rounded-xl border border-rose-100 bg-white/50 p-2.5 text-center">
              <TrendingUp className="mx-auto mb-1 h-3.5 w-3.5 text-rose-500" />
              <div className="text-[12px] font-black leading-none text-slate-800">
                +{markdown.projectedSellThroughIncrease}%
              </div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Proj. Lift</div>
            </div>
            <div className="flex-1 rounded-xl border border-rose-100 bg-white/50 p-2.5 text-center">
              <BarChart3 className="mx-auto mb-1 h-3.5 w-3.5 text-sky-500" />
              <div className="text-[12px] font-black leading-none text-slate-800">AI</div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Model-V2</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-rose-100 bg-rose-600/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase text-rose-600">
            <Info className="h-3.5 w-3.5" /> Markdown Rational
          </div>
          <p className="text-[10px] font-bold leading-tight text-slate-600">"{markdown.reason}"</p>
          <div className="mt-3 border-t border-rose-100 pt-3">
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
              <span>Current Price</span>
              <span>{markdown.currentPrice.toLocaleString()} ₽</span>
            </div>
            {markdown.suggestedMarkdownPercent > 0 && (
              <div className="mt-1 flex justify-between text-[10px] font-black uppercase text-rose-600">
                <span>Markdown Price</span>
                <span>
                  {(
                    markdown.currentPrice *
                    (1 - markdown.suggestedMarkdownPercent / 100)
                  ).toLocaleString()}{' '}
                  ₽
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button className="mt-3 h-8 w-full bg-rose-600 text-[8px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-rose-700">
        Apply to All PoS Terminals
      </Button>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
