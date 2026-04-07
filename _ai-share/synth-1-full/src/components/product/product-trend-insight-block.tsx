'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { calculateTrendSentiment } from '@/lib/fashion/trend-logic';
import { TrendingUp, Zap, BarChart, Info } from 'lucide-react';

type Props = { product: Product };

export function ProductTrendInsightBlock({ product }: Props) {
  const trend = calculateTrendSentiment(product);

  return (
    <Card className="mt-4 border-amber-500/30 bg-amber-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-600" />
          AI Trend Insight
        </CardTitle>
        <CardDescription className="text-xs">
          Анализ актуальности модели на основе Design DNA и рыночных данных.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Trend Score</p>
            <p className="text-2xl font-black text-amber-700">{trend.score}/100</p>
          </div>
          <Badge variant="outline" className="gap-1 border-amber-200 text-amber-700 bg-amber-100/50 uppercase text-[9px] font-bold">
            <TrendingUp className="h-3 w-3" />
            {trend.momentum}
          </Badge>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-amber-200/30">
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Key Trend Drivers</p>
          <div className="flex flex-wrap gap-1.5">
            {trend.keyDrivers.map(d => (
              <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-amber-200 text-amber-800">
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <BarChart className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{trend.marketComparison}</span>
        </div>
      </CardContent>
    </Card>
  );
}
