'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { assessLaunchReadiness, launchReadinessToCsv } from '@/lib/fashion/launch-readiness';
import { ArrowLeft, Rocket, FileSpreadsheet } from 'lucide-react';

export default function LaunchReadinessPage() {
  const rows = useMemo(() => {
    return products.map((p) => {
      const r = assessLaunchReadiness(p);
      const failed = r.checks.filter((c) => !c.ok).map((c) => c.id);
      return { product: p, ...r, failedStr: failed.join('|') };
    });
  }, []);

  const notReady = rows.filter((r) => r.percent < 100).length;

  const downloadCsv = () => {
    const payload = rows.map((r) => ({
      sku: r.product.sku,
      slug: r.product.slug,
      percent: r.percent,
      failed: r.failedStr,
    }));
    const csv = launchReadinessToCsv(payload);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `launch-readiness-${Date.now()}.csv`;
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
            <Rocket className="h-6 w-6" />
            Готовность к запуску
          </h1>
          <p className="text-sm text-muted-foreground">
            8 чек-листов на карточку (цена, медиа, копирайт, размеры…). Отличается от attribute health более «go-live» фокусом.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadCsv}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          CSV
        </Button>
        <Badge variant="secondary">
          &lt; 100%: {notReady} / {rows.length}
        </Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.attributeHealth}>Здоровье атрибутов</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SKU</CardTitle>
          <CardDescription>Разверните строку мысленно до чеков — в CSV список провалов.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.product.sku}>
                  <TableCell>
                    <Link href={`/products/${r.product.slug}`} className="font-mono text-xs underline">
                      {r.product.sku}
                    </Link>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[220px]">{r.product.name}</p>
                  </TableCell>
                  <TableCell className="font-mono">{r.percent}</TableCell>
                  <TableCell className="text-xs">
                    {r.percent === 100 ? (
                      <span className="text-emerald-600">ready</span>
                    ) : (
                      <span className="text-muted-foreground">{r.failedStr.replace(/\|/g, ', ')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
