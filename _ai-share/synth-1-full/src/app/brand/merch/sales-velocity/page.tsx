'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildSalesVelocityRows } from '@/lib/fashion/sales-velocity';
import { ArrowLeft, TrendingUp, AlertCircle, ShoppingCart, BarChart3 } from 'lucide-react';

export default function SalesVelocityPage() {
  const rows = useMemo(() => buildSalesVelocityRows(products), []);

  const stats = useMemo(() => {
    return {
      best: rows.filter(r => r.status === 'bestseller').length,
      slow: rows.filter(r => r.status === 'slow-mover').length,
      critical: rows.filter(r => r.status === 'critical').length,
    };
  }, [rows]);

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
            <TrendingUp className="h-6 w-6" />
            Скорость продаж и остатки
          </h1>
          <p className="text-sm text-muted-foreground">
            Анализ оборачиваемости (Sell-through) и прогноз Out-of-Stock.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Бестселлеры</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">{stats.best}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-rose-200 bg-rose-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Critical (Soon OOS)</CardDescription>
            <CardTitle className="text-2xl font-bold text-rose-700">{stats.critical}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-amber-200 bg-amber-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Slow-movers (Markdown candidate)</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-700">{stats.slow}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SKU Analytics</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU / Товар</TableHead>
                <TableHead className="text-right">Продано (30д)</TableHead>
                <TableHead className="text-right">Остаток</TableHead>
                <TableHead className="text-right">Дней до OOS</TableHead>
                <TableHead className="text-center">Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell className="max-w-[200px]">
                    <p className="font-medium text-xs truncate">{r.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">{r.category}</p>
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs">{r.unitsSold} шт</TableCell>
                  <TableCell className="text-right text-xs">{r.inventoryLevel} шт</TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {r.daysToOOS === null ? '∞' : `${r.daysToOOS} дн.`}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={
                      r.status === 'critical' ? 'destructive' : 
                      r.status === 'bestseller' ? 'default' : 
                      r.status === 'slow-mover' ? 'secondary' : 'outline'
                    } className="text-[9px]">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === 'critical' && (
                      <Button size="sm" className="h-7 text-[10px] bg-rose-600">Re-order</Button>
                    )}
                    {r.status === 'slow-mover' && (
                      <Button size="sm" variant="outline" className="h-7 text-[10px]">Markdown</Button>
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
