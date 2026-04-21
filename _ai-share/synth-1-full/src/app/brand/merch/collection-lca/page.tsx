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
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function CollectionLcaPage() {
  const summary = useMemo(() => summarizeCollectionLca(products), []);

  return (
    <CabinetPageContent maxWidth="5xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Leaf className="h-6 w-6 text-emerald-600" />
            Collection Sustainability Rollup
          </h1>
          <p className="text-sm text-muted-foreground">
            Сводный отчет по экологическому следу всей коллекции (LCA Aggregation).
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">
              Total Collection Score
            </CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-700">
              {summary.avgScore}/100
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">
              Total CO₂e Impact
            </CardDescription>
            <CardTitle className="text-2xl font-bold">
              {summary.totalCo2.toLocaleString()}{' '}
              <span className="text-sm font-normal text-muted-foreground">kg</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">
              Total Water Usage
            </CardDescription>
            <CardTitle className="text-2xl font-bold">
              {summary.totalWater.toLocaleString()}{' '}
              <span className="text-sm font-normal text-muted-foreground">Liters</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Impact Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-rose-100 bg-rose-50 p-4">
              <Wind className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-tight text-rose-800">
                  Top Driver: {summary.topImpactCategory}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-rose-700">
                  65% выбросов CO₂ в этой коллекции связаны с обработкой хлопка. Рекомендуется
                  переход на Organic или Recycled альтернативы.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-tight text-emerald-800">
                  Eco-Optimized SKUs
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
                  12 моделей из текущего дропа используют GRS-сертифицированный полиэстер, что
                  снизило общий углеродный след на 14%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base italic">Sustainability Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            1. Замена базового джерси на BCI-хлопок (Target: Q3 2026).
            <br />
            2. Внедрение QR-кодов с DPP-паспортами для всех SKU.
            <br />
            3. Аудит водного баланса на фабрике FAC-CN-04.
          </CardContent>
        </Card>
      </div>
    </CabinetPageContent>
  );
}
