'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { analyzeAssortmentGaps } from '@/lib/fashion/assortment-gap';
import { ArrowLeft, LayoutPanelLeft, AlertCircle, PlusCircle, Search } from 'lucide-react';

export default function AssortmentGapsPage() {
  const categories = Array.from(new Set(products.map(p => p.category)));
  const gaps = useMemo(() => categories.map(c => analyzeAssortmentGaps(products, c)), [categories]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6" />
            Assortment Gap Analysis
          </h1>
          <p className="text-sm text-muted-foreground">Поиск пустых ниш в категориях (цвета, ценовые точки).</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gaps.map(g => (
          <Card key={g.category} className={g.demandSignal === 'high' ? 'border-rose-200 bg-rose-50/10' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{g.category}</CardTitle>
                <Badge variant={g.demandSignal === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                  {g.demandSignal.toUpperCase()} SIGNAL
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Missing Colors</p>
                <div className="flex flex-wrap gap-1">
                  {g.missingColors.map(c => (
                    <Badge key={c} variant="outline" className="text-[9px] font-normal">{c}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Price Gaps</p>
                <div className="flex flex-wrap gap-1">
                  {g.missingPricePoints.map(p => (
                    <Badge key={p} variant="outline" className="text-[9px] font-normal border-amber-200 text-amber-700">{p}</Badge>
                  ))}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-[10px] h-7 gap-1 mt-2 border border-dashed">
                <PlusCircle className="h-3 w-3" /> Add Placeholder Style
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
