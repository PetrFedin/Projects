'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { calculateAssortmentMix } from '@/lib/fashion/assortment-mix-logic';
import { ArrowLeft, LayoutGrid, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function AssortmentMixPlannerPage() {
  const mix = useMemo(() => calculateAssortmentMix(products), []);

  return (
    <CabinetPageContent maxWidth="6xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <LayoutGrid className="h-6 w-6" />
            Assortment Mix Planner (OTB)
          </h1>
          <p className="text-sm text-muted-foreground">
            Балансировка долей категорий в коллекции относительно целевых показателей.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {mix.map((item) => (
          <Card key={item.category}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-base font-bold">{item.category}</p>
                  <p className="text-xs text-muted-foreground">{item.skuCount} SKU in catalog</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">Target: {item.targetPct}%</p>
                  <p
                    className={`text-sm font-black ${Math.abs(item.gap) > 10 ? 'text-rose-600' : 'text-emerald-600'}`}
                  >
                    Current: {item.currentPct}%
                  </p>
                </div>
              </div>

              <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`absolute h-full ${Math.abs(item.gap) > 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${item.currentPct}%` }}
                />
                <div
                  className="absolute h-full border-r-2 border-dashed border-foreground/40"
                  style={{ left: `${item.targetPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  {item.gap > 0 ? (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                  )}
                  <span className="text-[10px] italic text-muted-foreground">
                    {item.gap > 0
                      ? `Over-assorted by ${item.gap}%`
                      : `Opportunity to add ${Math.abs(item.gap)}% more`}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                  Adjust OTB
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CabinetPageContent>
  );
}
