'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { summarizeCollectionLca } from '@/lib/fashion/lca-summary';
import { ArrowLeft, Leaf, Droplets, Wind, ShieldCheck, BarChart3 } from 'lucide-react';

export default function CollectionLcaPage() {
  const summary = useMemo(() => summarizeCollectionLca(products), []);

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
            <Leaf className="h-6 w-6 text-emerald-600" />
            Collection Sustainability Rollup
          </h1>
          <p className="text-sm text-muted-foreground">Сводный отчет по экологическому следу всей коллекции (LCA Aggregation).</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Total Collection Score</CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-700">{summary.avgScore}/100</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Total CO₂e Impact</CardDescription>
            <CardTitle className="text-2xl font-bold">{summary.totalCo2.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">kg</span></CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Total Water Usage</CardDescription>
            <CardTitle className="text-2xl font-bold">{summary.totalWater.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">Liters</span></CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Impact Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-3">
              <Wind className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-800 uppercase tracking-tight">Top Driver: {summary.topImpactCategory}</p>
                <p className="text-[11px] text-rose-700 leading-relaxed mt-1">
                  65% выбросов CO₂ в этой коллекции связаны с обработкой хлопка. Рекомендуется переход на Organic или Recycled альтернативы.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-tight">Eco-Optimized SKUs</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed mt-1">
                  12 моделей из текущего дропа используют GRS-сертифицированный полиэстер, что снизило общий углеродный след на 14%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="text-base italic">Sustainability Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2 text-muted-foreground leading-relaxed">
            1. Замена базового джерси на BCI-хлопок (Target: Q3 2026).<br />
            2. Внедрение QR-кодов с DPP-паспортами для всех SKU.<br />
            3. Аудит водного баланса на фабрике FAC-CN-04.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
