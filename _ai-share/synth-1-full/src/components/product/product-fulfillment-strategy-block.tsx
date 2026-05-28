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
    <Card className="relative overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Package className="h-16 w-16 text-emerald-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-emerald-700">
            Marketplace Fulfillment Strategy
          </h4>
        </div>
        <Badge className="h-4 border-none bg-emerald-600 text-[10px] font-black uppercase text-white">
          {strategy.recommendedModel}
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
            Margin Impact
          </div>
          <div
            className={`text-xl font-black ${strategy.marginImpact > 0 ? 'text-green-600' : 'text-text-primary'}`}
          >
            {strategy.marginImpact > 0 ? '+' : ''}
            {strategy.marginImpact}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
            Delivery Speed
          </div>
          <div className="text-xl font-black text-emerald-700">
            {strategy.deliverySpeedBonus > 0 ? `-${strategy.deliverySpeedBonus} days` : 'Standard'}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <div className="text-[11px] font-medium leading-tight text-emerald-800">
          {strategy.reason}
        </div>
      </div>

      <div className="text-text-muted mt-4 flex items-center gap-2 border-t border-emerald-100 pt-3 text-[9px] font-bold uppercase italic leading-none">
        <Info className="h-3 w-3" /> FBO vs FBS vs DBS Optimizer v2.4
      </div>
    </Card>
  );
};
