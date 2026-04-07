'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, Star, CheckCircle2, MessageSquare, TrendingUp } from 'lucide-react';
import { getMarketplaceSentiment } from '@/lib/fashion/marketplace-sentiment';
import type { Product } from '@/lib/types';

export function ProductMarketplaceSentimentBlock({ product }: { product: Product }) {
  const sentiment = getMarketplaceSentiment(product.sku);

  return (
    <Card className="p-4 border-2 border-fuchsia-50 bg-fuchsia-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Quote className="w-16 h-16 text-fuchsia-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-fuchsia-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Marketplace Sentiment Mirror</h4>
        </div>
        <div className="flex gap-1">
           <Badge className="bg-indigo-600 text-white text-[8px] font-black border-none uppercase">WB {sentiment.wbRating}</Badge>
           <Badge className="bg-blue-600 text-white text-[8px] font-black border-none uppercase">OZON {sentiment.ozonRating}</Badge>
        </div>
      </div>

      <div className="space-y-3">
         <p className="text-[11px] font-bold text-slate-600 italic leading-tight">
            "{sentiment.summarySentiment}"
         </p>
         
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
               <div className="text-[8px] font-black text-emerald-600 uppercase tracking-tight">Positive Signals</div>
               {sentiment.topPositiveTraits.map((t, i) => (
                 <div key={i} className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t}
                 </div>
               ))}
            </div>
            <div className="space-y-1.5">
               <div className="text-[8px] font-black text-rose-600 uppercase tracking-tight">Watch Outs</div>
               {sentiment.topNegativeTraits.map((t, i) => (
                 <div key={i} className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {t}
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-fuchsia-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Source: AI Review Aggregator</span>
         <span>{sentiment.reviewCountTotal.toLocaleString()} Reviews</span>
      </div>
    </Card>
  );
}
