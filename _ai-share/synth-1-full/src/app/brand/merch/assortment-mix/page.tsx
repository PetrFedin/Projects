'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { assortmentMixToCsv, buildAssortmentMix } from '@/lib/fashion/assortment-mix';
import { ArrowLeft, PieChart } from 'lucide-react';

export default function AssortmentMixPage() {
  const rows = useMemo(() => buildAssortmentMix(products), []);

  const downloadCsv = () => {
    const csv = assortmentMixToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assortment-mix-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <PieChart className="h-6 w-6" />
            Микс ассортимента
          </h1>
          <p className="text-sm text-muted-foreground">
            Доля SKU по <code className="rounded bg-muted px-1 text-[10px]">category</code> —
            заготовка под OTB и баланс коллекции.
          </p>
        </div>
      </div>

      <Button type="button" onClick={downloadCsv}>
        Скачать CSV
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Распределение</CardTitle>
          <CardDescription>Всего SKU: {products.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((r) => (
            <div key={r.category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate pr-2 font-medium">{r.category}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {r.count} · {r.pct}%
                </span>
              </div>
              <Progress value={r.pct} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
