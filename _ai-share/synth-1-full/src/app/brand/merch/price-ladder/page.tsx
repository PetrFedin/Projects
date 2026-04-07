'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildPriceLadder } from '@/lib/fashion/price-ladder';
import { ArrowLeft, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

export default function PriceLadderPage() {
  const ladder = useMemo(() => buildPriceLadder(products), []);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Collection Price Ladder
          </h1>
          <p className="text-sm text-muted-foreground">Визуализация ценовой архитектуры и плотности SKU.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {ladder.map((bucket) => (
          <Card key={bucket.priceRange}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-[140px]">
                  <p className="text-sm font-bold">{bucket.priceRange}</p>
                  <p className="text-xs text-muted-foreground">{bucket.skuCount} SKU</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span>Distribution</span>
                    <span>{Math.round((bucket.skuCount / products.length) * 100)}%</span>
                  </div>
                  <Progress value={(bucket.skuCount / products.length) * 100} className="h-2 bg-muted" />
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg Margin</p>
                  <p className="text-sm font-black text-emerald-600">{bucket.avgMargin}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3">
        <BarChart3 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed italic">
          Рекомендация: Плотность SKU в сегменте Premium низкая. Рассмотрите перенос части Core моделей в верхний ценовой диапазон через улучшение материалов (Up-selling).
        </p>
      </div>
    </div>
  );
}
