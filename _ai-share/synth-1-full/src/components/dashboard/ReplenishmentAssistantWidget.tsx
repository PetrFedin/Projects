'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, TrendingDown, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useB2BState } from '@/providers/b2b-state';

interface ReplenishmentSuggestion {
  sku: string;
  productName: string;
  currentStock: number;
  sellRate: number; // units per day
  daysUntilStockout: number;
  suggestedQuantity: number;
  urgency: 'critical' | 'high' | 'medium';
  image: string;
}

export function ReplenishmentAssistantWidget() {
  const { inventoryATS } = useB2BState();

  // Calculate replenishment suggestions
  const suggestions: ReplenishmentSuggestion[] = inventoryATS
<<<<<<< HEAD
    .filter((item) => item.quantity < (item.reorderPoint || 50))
=======
    .filter((item) => item.available < 50)
>>>>>>> recover/cabinet-wip-from-stash
    .map((item) => {
      const sellRate = 5; // mock - в реальности из analytics
      const daysUntil = Math.floor(item.available / sellRate);
      const leadTime = 14; // days
      const safetyStock = sellRate * 7;
      const suggested = Math.ceil(sellRate * leadTime + safetyStock);

      return {
        sku: item.sku,
        productName: item.productName,
        currentStock: item.available,
        sellRate,
        daysUntilStockout: daysUntil,
        suggestedQuantity: suggested,
<<<<<<< HEAD
        urgency: daysUntil <= 7 ? 'critical' : daysUntil <= 14 ? 'high' : 'medium',
=======
        urgency: (daysUntil <= 7
          ? 'critical'
          : daysUntil <= 14
            ? 'high'
            : 'medium') as ReplenishmentSuggestion['urgency'],
>>>>>>> recover/cabinet-wip-from-stash
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=200',
      };
    })
    .slice(0, 3);

  if (suggestions.length === 0) {
    return (
      <Card className="rounded-xl border-2 border-emerald-100 shadow-xl">
        <CardContent className="p-3 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
<<<<<<< HEAD
          <h3 className="mb-2 font-black text-slate-900">All Stock Levels Healthy</h3>
          <p className="text-sm text-slate-500">No replenishment needed at this time</p>
=======
          <h3 className="text-text-primary mb-2 font-black">All Stock Levels Healthy</h3>
          <p className="text-text-secondary text-sm">No replenishment needed at this time</p>
>>>>>>> recover/cabinet-wip-from-stash
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-2 border-amber-100 shadow-xl">
<<<<<<< HEAD
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
=======
      <CardHeader className="border-border-subtle border-b bg-gradient-to-r from-amber-50 to-orange-50">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-text-primary text-sm font-black uppercase tracking-tight">
              Smart Restock Suggestions
            </CardTitle>
<<<<<<< HEAD
            <p className="text-[10px] font-medium text-slate-500">
=======
            <p className="text-text-secondary text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              AI-powered inventory optimization
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.sku}
            className={cn(
              'rounded-xl border-2 p-4',
              suggestion.urgency === 'critical'
                ? 'border-rose-200 bg-rose-50'
                : suggestion.urgency === 'high'
                  ? 'border-amber-200 bg-amber-50'
<<<<<<< HEAD
                  : 'border-slate-200 bg-slate-50'
=======
                  : 'bg-bg-surface2 border-border-default'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          >
            <div className="mb-3 flex items-start gap-3">
              <img
                src={suggestion.image}
                alt={suggestion.productName}
                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
<<<<<<< HEAD
                    <h4 className="text-sm font-black uppercase leading-tight text-slate-900">
                      {suggestion.productName}
                    </h4>
                    <p className="mt-1 text-[10px] text-slate-600">SKU: {suggestion.sku}</p>
=======
                    <h4 className="text-text-primary text-sm font-black uppercase leading-tight">
                      {suggestion.productName}
                    </h4>
                    <p className="text-text-secondary mt-1 text-[10px]">SKU: {suggestion.sku}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>

                  <Badge
                    className={cn(
                      'flex-shrink-0 border-none text-[7px] font-black uppercase',
                      suggestion.urgency === 'critical'
                        ? 'bg-rose-600 text-white'
                        : suggestion.urgency === 'high'
                          ? 'bg-amber-600 text-white'
<<<<<<< HEAD
                          : 'bg-slate-500 text-white'
=======
                          : 'bg-bg-surface2 text-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {suggestion.urgency === 'critical' ? 'CRITICAL' : 'REORDER NOW'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white p-2">
<<<<<<< HEAD
                    <p className="text-xs font-black tabular-nums text-slate-900">
                      {suggestion.currentStock}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-slate-500">Current</p>
=======
                    <p className="text-text-primary text-xs font-black tabular-nums">
                      {suggestion.currentStock}
                    </p>
                    <p className="text-text-secondary text-[8px] font-bold uppercase">Current</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>

                  <div className="rounded-lg bg-white p-2">
                    <p
                      className={cn(
                        'text-xs font-black tabular-nums',
                        suggestion.daysUntilStockout <= 7 ? 'text-rose-600' : 'text-amber-600'
                      )}
                    >
                      {suggestion.daysUntilStockout}d
                    </p>
<<<<<<< HEAD
                    <p className="text-[8px] font-bold uppercase text-slate-500">Until Out</p>
=======
                    <p className="text-text-secondary text-[8px] font-bold uppercase">Until Out</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>

                  <div className="rounded-lg bg-white p-2">
                    <p className="text-xs font-black tabular-nums text-emerald-600">
                      {suggestion.suggestedQuantity}
                    </p>
<<<<<<< HEAD
                    <p className="text-[8px] font-bold uppercase text-slate-500">Suggested</p>
=======
                    <p className="text-text-secondary text-[8px] font-bold uppercase">Suggested</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-600">
=======
            <div className="text-text-secondary mb-3 flex items-center gap-2 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
              <TrendingDown className="h-3 w-3 text-rose-600" />
              <span>
                Selling at <strong>{suggestion.sellRate} units/day</strong> • Lead time:{' '}
                <strong>14 days</strong> • Safety stock:{' '}
                <strong>{suggestion.sellRate * 7} units</strong>
              </span>
            </div>

            <Button size="sm" className="h-9 w-full text-[8px] font-black uppercase">
              <ShoppingCart className="mr-2 h-3 w-3" />
              Add {suggestion.suggestedQuantity} Units to Cart
            </Button>
          </div>
        ))}

        {suggestions.length > 3 && (
          <Button variant="outline" className="h-10 w-full text-[8px] font-black uppercase">
            View All {suggestions.length} Suggestions
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
