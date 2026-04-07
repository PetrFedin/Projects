'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildCategoryPriceStats, categoryPriceStatsToCsv } from '@/lib/fashion/category-price-stats';
import { ArrowLeft, BarChart3 } from 'lucide-react';

export default function CategoryPricingPage() {
  const rows = useMemo(() => buildCategoryPriceStats(products), []);

  const downloadCsv = () => {
    const csv = categoryPriceStatsToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `category-pricing-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <BarChart3 className="h-6 w-6" />
            Цены по категориям
          </h1>
          <p className="text-sm text-muted-foreground">
            Агрегаты по полю <code className="text-[10px] bg-muted px-1 rounded">category</code> демо-каталога — для прайс-гридов и отчётов мерча.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadCsv}>
          Скачать CSV
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.assortmentMix}>Микс категорий</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Таблица</CardTitle>
          <CardDescription>
            {rows.length} категорий, {products.length} SKU
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Категория</TableHead>
                <TableHead className="text-right">SKU</TableHead>
                <TableHead className="text-right">Min</TableHead>
                <TableHead className="text-right">Max</TableHead>
                <TableHead className="text-right">Средн.</TableHead>
                <TableHead className="text-right">Медиана</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.category}>
                  <TableCell className="font-medium">{r.category}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{r.count}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{r.min}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{r.max}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{r.avg}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{r.median}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
