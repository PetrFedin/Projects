'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Package, ShieldCheck } from 'lucide-react';
import { calculateProductRisk } from '@/lib/fashion/product-risk';
import { Progress } from '@/components/ui/progress';

export const ProductRiskScorecardBlock: React.FC<{ product: Product }> = ({ product }) => {
  const risk = calculateProductRisk(product);
  
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h4 className="font-bold text-sm uppercase text-slate-600">Merchant Risk Scorecard</h4>
        </div>
        <div className={`text-xl font-black ${getRiskColor(risk.overallRisk)}`}>
          {risk.overallRisk}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
            <span>Delivery</span>
            <span>{risk.deliveryRisk}%</span>
          </div>
          <Progress value={risk.deliveryRisk} className="h-1 bg-slate-100" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
            <span>Quality</span>
            <span>{risk.qualityRisk}%</span>
          </div>
          <Progress value={risk.qualityRisk} className="h-1 bg-slate-100" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
            <span>Popularity</span>
            <span>{risk.popularityRisk}%</span>
          </div>
          <Progress value={risk.popularityRisk} className="h-1 bg-slate-100" />
        </div>
      </div>

      {risk.alerts.length > 0 && (
        <div className="space-y-2">
          {risk.alerts.map((alert, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
              <TrendingDown className="w-3 h-3" />
              {alert}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
        <span>Source: Inventory AI Service</span>
        <Badge variant="outline" className="text-[9px] h-4">Beta Insights</Badge>
      </div>
    </Card>
  );
};
