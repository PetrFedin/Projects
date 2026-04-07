'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildPackRuleRow, packRulesToCsv } from '@/lib/fashion/pack-rules-rollup';
import { ArrowLeft, Package } from 'lucide-react';

export default function PackRulesPage() {
  const rows = useMemo(() => products.map(buildPackRuleRow), []);
  const withAny = rows.filter((r) => r.moq != null || r.casePack != null || r.leadWeeks != null || r.incoterm || r.shipFrom);

  const downloadCsv = () => {
    const csv = packRulesToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pack-rules-${Date.now()}.csv`;
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
            <Package className="h-6 w-6" />
            MOQ и короба
          </h1>
          <p className="text-sm text-muted-foreground">
            Поля <code className="text-[10px] bg-muted px-1 rounded">attributes.moq</code>, casePack, leadTimeWeeks, incoterm, shipFrom.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadCsv}>
          CSV по всем SKU
        </Button>
        <span className="text-xs text-muted-foreground self-center">
          С заполненными B2B-полями: {withAny.length} / {rows.length}
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.assortmentMix}>Микс категорий</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Таблица</CardTitle>
          <CardDescription>Пустые ячейки — нет данных в демо; заполните PIM для выгрузки байерам.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Короб</TableHead>
                <TableHead>Нед.</TableHead>
                <TableHead>Incoterm</TableHead>
                <TableHead>Откуда</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell>
                    <Link href={`/products/${r.slug}`} className="font-mono text-xs underline">
                      {r.sku}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{r.moq ?? '—'}</TableCell>
                  <TableCell className="text-xs font-mono">{r.casePack ?? '—'}</TableCell>
                  <TableCell className="text-xs font-mono">{r.leadWeeks ?? '—'}</TableCell>
                  <TableCell className="text-xs">{r.incoterm || '—'}</TableCell>
                  <TableCell className="text-xs max-w-[160px] truncate" title={r.shipFrom}>
                    {r.shipFrom || '—'}
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
