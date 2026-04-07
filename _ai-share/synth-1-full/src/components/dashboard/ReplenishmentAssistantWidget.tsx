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
    .filter(item => item.quantity < (item.reorderPoint || 50))
    .map(item => {
      const sellRate = 5; // mock - в реальности из analytics
      const daysUntil = Math.floor(item.quantity / sellRate);
      const leadTime = 14; // days
      const safetyStock = sellRate * 7;
      const suggested = Math.ceil((sellRate * leadTime) + safetyStock);
      
      return {
        sku: item.sku,
        productName: item.productName,
        currentStock: item.quantity,
        sellRate,
        daysUntilStockout: daysUntil,
        suggestedQuantity: suggested,
        urgency: daysUntil <= 7 ? 'critical' : daysUntil <= 14 ? 'high' : 'medium',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=200'
      };
    })
    .slice(0, 3);
  
  if (suggestions.length === 0) {
    return (
      <Card className="border-2 border-emerald-100 shadow-xl rounded-xl">
        <CardContent className="p-3 text-center">
          <Package className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="font-black text-slate-900 mb-2">All Stock Levels Healthy</h3>
          <p className="text-sm text-slate-500">No replenishment needed at this time</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-2 border-amber-100 shadow-xl rounded-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-amber-600 flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              Smart Restock Suggestions
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">
              AI-powered inventory optimization
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.sku}
            className={cn(
              "p-4 rounded-xl border-2",
              suggestion.urgency === 'critical' ? 'bg-rose-50 border-rose-200' :
              suggestion.urgency === 'high' ? 'bg-amber-50 border-amber-200' :
              'bg-slate-50 border-slate-200'
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <img 
                src={suggestion.image}
                alt={suggestion.productName}
                className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-black uppercase text-slate-900 leading-tight">
                      {suggestion.productName}
                    </h4>
                    <p className="text-[10px] text-slate-600 mt-1">
                      SKU: {suggestion.sku}
                    </p>
                  </div>
                  
                  <Badge className={cn(
                    "text-[7px] font-black uppercase border-none flex-shrink-0",
                    suggestion.urgency === 'critical' ? 'bg-rose-600 text-white' :
                    suggestion.urgency === 'high' ? 'bg-amber-600 text-white' :
                    'bg-slate-500 text-white'
                  )}>
                    {suggestion.urgency === 'critical' ? 'CRITICAL' : 'REORDER NOW'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-xs font-black text-slate-900 tabular-nums">
                      {suggestion.currentStock}
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold">
                      Current
                    </p>
                  </div>
                  
                  <div className="p-2 bg-white rounded-lg">
                    <p className={cn(
                      "text-xs font-black tabular-nums",
                      suggestion.daysUntilStockout <= 7 ? 'text-rose-600' : 'text-amber-600'
                    )}>
                      {suggestion.daysUntilStockout}d
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold">
                      Until Out
                    </p>
                  </div>
                  
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-xs font-black text-emerald-600 tabular-nums">
                      {suggestion.suggestedQuantity}
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold">
                      Suggested
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-600 mb-3">
              <TrendingDown className="h-3 w-3 text-rose-600" />
              <span>
                Selling at <strong>{suggestion.sellRate} units/day</strong> • 
                Lead time: <strong>14 days</strong> • 
                Safety stock: <strong>{suggestion.sellRate * 7} units</strong>
              </span>
            </div>
            
            <Button 
              size="sm" 
              className="w-full h-9 text-[8px] font-black uppercase"
            >
              <ShoppingCart className="mr-2 h-3 w-3" />
              Add {suggestion.suggestedQuantity} Units to Cart
            </Button>
          </div>
        ))}
        
        {suggestions.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full h-10 text-[8px] font-black uppercase"
          >
            View All {suggestions.length} Suggestions
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
