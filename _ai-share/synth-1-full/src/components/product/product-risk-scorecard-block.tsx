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
<<<<<<< HEAD
    <Card className="border-2 border-slate-100 bg-slate-50/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h4 className="text-sm font-bold uppercase text-slate-600">Merchant Risk Scorecard</h4>
=======
    <Card className="border-border-subtle bg-bg-surface2/30 border-2 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h4 className="text-text-secondary text-sm font-bold uppercase">
            Merchant Risk Scorecard
          </h4>
>>>>>>> recover/cabinet-wip-from-stash
        </div>
        <div className={`text-xl font-black ${getRiskColor(risk.overallRisk)}`}>
          {risk.overallRisk}%
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1">
<<<<<<< HEAD
          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
=======
          <div className="text-text-muted flex justify-between text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            <span>Delivery</span>
            <span>{risk.deliveryRisk}%</span>
          </div>
          <Progress value={risk.deliveryRisk} className="bg-bg-surface2 h-1" />
        </div>
        <div className="space-y-1">
<<<<<<< HEAD
          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
=======
          <div className="text-text-muted flex justify-between text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            <span>Quality</span>
            <span>{risk.qualityRisk}%</span>
          </div>
          <Progress value={risk.qualityRisk} className="bg-bg-surface2 h-1" />
        </div>
        <div className="space-y-1">
<<<<<<< HEAD
          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
=======
          <div className="text-text-muted flex justify-between text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            <span>Popularity</span>
            <span>{risk.popularityRisk}%</span>
          </div>
          <Progress value={risk.popularityRisk} className="bg-bg-surface2 h-1" />
        </div>
      </div>

      {risk.alerts.length > 0 && (
        <div className="space-y-2">
          {risk.alerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded bg-amber-50 p-2 text-xs text-amber-700"
            >
              <TrendingDown className="h-3 w-3" />
              {alert}
            </div>
          ))}
        </div>
      )}

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[10px] font-bold uppercase text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center justify-between border-t pt-3 text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <span>Source: Inventory AI Service</span>
        <Badge variant="outline" className="h-4 text-[9px]">
          Beta Insights
        </Badge>
      </div>
    </Card>
  );
};
