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
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildFabricRollupRows, fabricRollupToCsv } from '@/lib/fashion/fabric-rollup';
import { downloadJsonFile } from '@/lib/platform/json-io';
import { ArrowLeft, FileSpreadsheet, Database } from 'lucide-react';

export default function BrandFabricPassportPage() {
  const rows = useMemo(() => buildFabricRollupRows(products.slice(0, 60)), []);

  const csv = useMemo(() => fabricRollupToCsv(rows), [rows]);

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fabric-passport-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Database className="h-6 w-6" />
            Сводка состава и ухода
          </h1>
          <p className="text-sm text-muted-foreground">
            Единый CSV для выгрузки в PIM и маркетплейсы; источник —{' '}
            <code className="rounded bg-muted px-1 text-[10px]">lib/fashion/fabric-rollup</code>.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadCsv}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Скачать CSV
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => downloadJsonFile('fabric-passport-rows.json', rows)}
        >
          JSON (строки)
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href={ROUTES.brand.products}>PIM-центр</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Первые {rows.length} SKU</CardTitle>
          <CardDescription>
            Состав парсится из полей товара; уход — из attributes.care или демо-набор.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Цвет</TableHead>
                <TableHead>Сезон</TableHead>
                <TableHead>Состав</TableHead>
                <TableHead>Care IDs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell className="font-mono text-xs">{r.sku}</TableCell>
                  <TableCell className="max-w-[180px] text-xs">{r.name}</TableCell>
                  <TableCell className="text-xs">{r.color}</TableCell>
                  <TableCell className="text-xs">{r.season}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-xs" title={r.compositionText}>
                    {r.compositionText || '—'}
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">
                    {r.careIds}
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
