'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Zap, AlertCircle, TrendingUp, Info, Package } from 'lucide-react';
import { optimizeFulfillment } from '@/lib/fashion/marketplace-fulfillment';

export const ProductFulfillmentStrategyBlock: React.FC<{ product: Product }> = ({ product }) => {
  const strategy = optimizeFulfillment(product);
  
  return (
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <Package className="w-16 h-16 text-emerald-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-xs uppercase text-emerald-700 tracking-tight">Marketplace Fulfillment Strategy</h4>
        </div>
        <Badge className="bg-emerald-600 text-white border-none text-[10px] font-black h-4 uppercase">
          {strategy.recommendedModel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
           <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Margin Impact</div>
           <div className={`text-xl font-black ${strategy.marginImpact > 0 ? 'text-green-600' : 'text-slate-700'}`}>
              {strategy.marginImpact > 0 ? '+' : ''}{strategy.marginImpact}%
           </div>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Delivery Speed</div>
           <div className="text-xl font-black text-emerald-700">
              {strategy.deliverySpeedBonus > 0 ? `-${strategy.deliverySpeedBonus} days` : 'Standard'}
           </div>
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg border border-emerald-100 flex gap-3 items-start shadow-sm">
         <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
         <div className="text-[11px] font-medium text-emerald-800 leading-tight">
            {strategy.reason}
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase italic leading-none">
         <Info className="w-3 h-3" /> FBO vs FBS vs DBS Optimizer v2.4
      </div>
    </Card>
  );
};
