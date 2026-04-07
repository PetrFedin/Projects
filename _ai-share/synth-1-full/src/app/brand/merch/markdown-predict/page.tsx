'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildMarkdownRecommendations } from '@/lib/fashion/markdown-logic';
import { ArrowLeft, TrendingDown, Percent, ArrowDownRight, Lightbulb } from 'lucide-react';

export default function MarkdownPredictPage() {
  const rows = useMemo(() => buildMarkdownRecommendations(products), []);

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
            <ArrowDownRight className="h-6 w-6" />
            Markdown Strategy Engine
          </h1>
          <p className="text-sm text-muted-foreground">Оптимизация остатков через умную уценку на основе возраста SKU.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-rose-700">Liquidation Recommendations</CardTitle>
          <CardDescription className="text-xs">
            SKU, требующие дисконтирования для освобождения склада (Sell-through &lt; 60%).
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU / Товар</TableHead>
                <TableHead className="text-right">Price (₽)</TableHead>
                <TableHead className="text-center">Suggest. Off</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell className="max-w-[200px]">
                    <p className="font-medium text-xs truncate">{r.sku}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{r.sku}</p>
                  </TableCell>
                  <TableCell className="text-right text-xs">{r.currentPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive" className="font-mono">-{r.suggestedDiscount}%</Badge>
                  </TableCell>
                  <TableCell className="text-[11px] font-medium">{r.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="h-7 text-[10px]">Apply Markdown</Button>
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
