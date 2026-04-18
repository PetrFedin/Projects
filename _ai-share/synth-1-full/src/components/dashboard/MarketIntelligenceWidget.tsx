'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Award, Target, AlertCircle, Loader2 } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { cn } from '@/lib/utils';

export function MarketIntelligenceWidget() {
  const { trendingItems, pricePosition, predictedSellthrough, isLoading } = useMarketData();

  if (isLoading) {
    return (
<<<<<<< HEAD
      <Card className="rounded-xl border-2 border-indigo-100 shadow-xl">
        <CardContent className="flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
=======
      <Card className="border-accent-primary/20 rounded-xl border-2 shadow-xl">
        <CardContent className="flex items-center justify-center p-20">
          <Loader2 className="text-accent-primary h-8 w-8 animate-spin" />
>>>>>>> recover/cabinet-wip-from-stash
        </CardContent>
      </Card>
    );
  }

  return (
<<<<<<< HEAD
    <Card className="rounded-xl border-2 border-indigo-100 shadow-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
=======
    <Card className="border-accent-primary/20 rounded-xl border-2 shadow-xl">
      <CardHeader className="border-border-subtle from-accent-primary/10 to-accent-primary/10 border-b bg-gradient-to-r">
        <div className="flex items-center gap-3">
          <div className="bg-accent-primary flex h-12 w-12 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-text-primary text-sm font-black uppercase tracking-tight">
              Market Intelligence
            </CardTitle>
<<<<<<< HEAD
            <p className="text-[10px] font-medium text-slate-500">
=======
            <p className="text-text-secondary text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              Powered by AI • Updated 5 min ago
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* Trending Items */}
        <div className="space-y-3">
<<<<<<< HEAD
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
=======
          <h4 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Trending in Your Category
          </h4>

          <div className="space-y-2">
            {trendingItems.map((item, i) => (
              <div
                key={i}
<<<<<<< HEAD
                className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100"
=======
                className="bg-bg-surface2 hover:bg-bg-surface2 flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      item.trend > 0 ? 'animate-pulse bg-emerald-500' : 'bg-rose-500'
                    )}
                  />
<<<<<<< HEAD
                  <span className="text-sm font-bold text-slate-900">{item.name}</span>
=======
                  <span className="text-text-primary text-sm font-bold">{item.name}</span>
>>>>>>> recover/cabinet-wip-from-stash
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      'border-none text-[8px] font-black uppercase',
                      item.trend > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    )}
                  >
                    {item.trend > 0 ? '+' : ''}
                    {item.trend}% demand
                  </Badge>

                  {item.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : item.trend < 0 ? (
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Position */}
<<<<<<< HEAD
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
=======
        <div className="border-border-subtle space-y-3 border-t pt-4">
          <h4 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <Target className="h-4 w-4 text-blue-600" />
            Your Price Position
          </h4>

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-black tabular-nums tracking-tight text-blue-900">
                  {pricePosition.yourAvg.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-[10px] font-bold uppercase text-blue-600">Your Avg Price</p>
              </div>

              <div className="text-right">
<<<<<<< HEAD
                <p className="text-sm font-black tabular-nums tracking-tight text-slate-600">
                  {pricePosition.marketAvg.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-500">Market Avg</p>
=======
                <p className="text-text-secondary text-sm font-black tabular-nums tracking-tight">
                  {pricePosition.marketAvg.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-text-secondary text-[10px] font-bold uppercase">Market Avg</p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>

            <Badge
              className={cn(
                'w-full justify-center border-none text-[8px] font-black uppercase',
                pricePosition.advantage ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              )}
            >
              {pricePosition.advantage ? '✓ Competitive Advantage' : '⚠ Above Market'}
            </Badge>
          </div>
        </div>

        {/* Sell-Through Prediction */}
<<<<<<< HEAD
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <AlertCircle className="h-4 w-4 text-purple-600" />
=======
        <div className="border-border-subtle space-y-3 border-t pt-4">
          <h4 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <AlertCircle className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
            Predicted Sell-Through Rate
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
<<<<<<< HEAD
              <span className="text-sm font-bold text-slate-600">Your FW26 Collection</span>
              <span className="text-sm font-black tabular-nums text-purple-600">
=======
              <span className="text-text-secondary text-sm font-bold">Your FW26 Collection</span>
              <span className="text-accent-primary text-sm font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                {predictedSellthrough.yours}%
              </span>
            </div>

            <Progress value={predictedSellthrough.yours} className="h-3" />

<<<<<<< HEAD
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
=======
            <div className="text-text-muted flex items-center justify-between text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              <span>Industry Average: {predictedSellthrough.industry}%</span>
              <Badge className="border-none bg-emerald-100 text-[7px] text-emerald-700">
                +{predictedSellthrough.yours - predictedSellthrough.industry}% Better
              </Badge>
            </div>
          </div>

<<<<<<< HEAD
          <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
            <p className="text-[10px] font-medium italic text-purple-900">
=======
          <div className="bg-accent-primary/10 border-accent-primary/20 rounded-lg border p-3">
            <p className="text-text-primary text-[10px] font-medium italic">
>>>>>>> recover/cabinet-wip-from-stash
              💡 <strong>AI Insight:</strong> Based on pre-order velocity and market trends, your
              collection is projected to outperform industry STR by{' '}
              {predictedSellthrough.yours - predictedSellthrough.industry}%. Consider increasing
              initial order quantities for top 3 SKU.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
