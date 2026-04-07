'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Target, Info } from 'lucide-react';
import { getMarketplaceSeo } from '@/lib/fashion/marketplace-seo';

export const ProductMarketplaceSeoBlock: React.FC<{ product: Product }> = ({ product }) => {
  const seo = getMarketplaceSeo(product);
  
  return (
    <Card className="p-4 border-2 border-purple-50 bg-purple-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 -rotate-12">
        <Search className="w-16 h-16 text-purple-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-600" />
          <h4 className="font-bold text-xs uppercase text-purple-700 tracking-tight">Marketplace Search Visibility</h4>
        </div>
        <div className="text-[10px] font-black text-purple-500 uppercase flex items-center gap-1">
           Keywords Tracked: {seo.length}
        </div>
      </div>

      <div className="space-y-3">
        {seo.map((s, idx) => (
          <div key={idx} className="p-3 bg-white rounded-lg border border-purple-100 shadow-sm group">
             <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="bg-purple-600 text-white border-none text-[10px] font-black h-4 uppercase">{s.marketplace}</Badge>
                <div className="text-[10px] font-black text-slate-400 uppercase">Score: {s.visibilityScore}</div>
             </div>
             
             <div className="flex items-end justify-between">
                <div>
                   <div className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Top Keyword</div>
                   <div className="text-xs font-bold text-slate-700 italic">"{s.keyword}"</div>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-black text-slate-800 leading-none">#{s.rank}</div>
                   <div className={`text-[9px] font-black uppercase flex items-center gap-1 justify-end mt-1 ${s.searchTrend === 'rising' ? 'text-green-600' : 'text-slate-400'}`}>
                      {s.searchTrend === 'rising' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3 opacity-40" />}
                      Trend {s.searchTrend}
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-purple-100 text-[9px] text-slate-400 font-bold uppercase italic flex items-center gap-1.5 leading-none">
         <Info className="w-3 h-3" /> Search Index v4.1 • Data synced 2h ago
      </div>
    </Card>
  );
};
