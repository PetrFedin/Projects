'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildColorwayRollup, colorwayRollupToCsv } from '@/lib/fashion/colorway-rollup';
import { ArrowLeft, Palette } from 'lucide-react';

export default function ColorwayCoveragePage() {
  const rows = useMemo(() => buildColorwayRollup(products), []);

  const downloadCsv = () => {
    const csv = colorwayRollupToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colorway-coverage-${Date.now()}.csv`;
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
            <Palette className="h-6 w-6" />
            Цветовые ряды
          </h1>
          <p className="text-sm text-muted-foreground">
            Сколько SKU на каждое значение <code className="text-[10px] bg-muted px-1 rounded">color</code> — для OTB и визуального баланса полки.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadCsv}>
          CSV
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.assortmentMix}>Микс категорий</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Сводка</CardTitle>
          <CardDescription>
            {rows.length} оттенков / значений, {products.length} SKU
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Цвет (как в PIM)</TableHead>
                <TableHead className="text-right">SKU</TableHead>
                <TableHead>Категории (фрагмент)</TableHead>
                <TableHead>Сезоны (фрагмент)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.displayColor}>
                  <TableCell className="font-medium">{r.displayColor}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{r.skuCount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px]">{r.categorySample}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[160px]">{r.seasonSample}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
