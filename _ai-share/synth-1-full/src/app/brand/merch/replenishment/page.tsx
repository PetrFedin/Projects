'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { generateReplenishmentPlan } from '@/lib/fashion/replenishment-logic';
import { ArrowLeft, RefreshCw, AlertCircle, ShoppingCart } from 'lucide-react';

export default function ReplenishmentPage() {
  const rows = useMemo(() => generateReplenishmentPlan(products), []);

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
            <RefreshCw className="h-6 w-6" />
            Smart Replenishment
          </h1>
          <p className="text-sm text-muted-foreground">Авто-планирование подсортировки бестселлеров на основе скорости продаж.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended Restocks</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Suggest. Qty</TableHead>
                <TableHead className="text-center">Urgency</TableHead>
                <TableHead>Restock Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell className="font-mono text-xs">{r.sku}</TableCell>
                  <TableCell className="text-right font-bold text-xs">{r.suggestedQty} pcs</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={r.urgency === 'high' ? 'destructive' : 'secondary'} className="text-[9px]">
                      {r.urgency.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.restockDate}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1.5">
                      <ShoppingCart className="h-3 w-3" /> Create PO
                    </Button>
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
