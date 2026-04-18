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
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { attributeHealthToCsv, buildAttributeHealthRows } from '@/lib/fashion/attribute-health';
import { ArrowLeft, Stethoscope, FileSpreadsheet } from 'lucide-react';

export default function AttributeHealthPage() {
  const rows = useMemo(() => buildAttributeHealthRows(products), []);
  const weak = useMemo(() => rows.filter((r) => r.completeness < 100).length, [rows]);

  const downloadCsv = () => {
    const csv = attributeHealthToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attribute-health-${Date.now()}.csv`;
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
            <Stethoscope className="h-6 w-6" />
            Здоровье атрибутов SKU
          </h1>
          <p className="text-sm text-muted-foreground">
            8 проверок: идентификаторы, медиа, сезон, состав, eco-теги, явный уход. Источник:{' '}
            <code className="rounded bg-muted px-1 text-[10px]">assessProductAttributeHealth</code>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={downloadCsv}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          CSV по всем SKU
        </Button>
        <Badge variant="secondary">
          SKU с пробелами: {weak} / {rows.length}
        </Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.fabricPassportRollup}>Состав и уход (rollup)</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Таблица</CardTitle>
          <CardDescription>
            Сортировка по умолчанию — как в каталоге; фильтры добавятся с API.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[480px] overflow-x-auto overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Пробелы</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell>
                    <Link href={`/products/${r.slug}`} className="font-mono text-xs underline">
                      {r.sku}
                    </Link>
                    <p className="line-clamp-1 max-w-[200px] text-[10px] text-muted-foreground">
                      {r.name}
                    </p>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{r.completeness}</TableCell>
                  <TableCell className="text-xs">
                    {r.gaps.length === 0 ? (
                      <span className="text-emerald-600">ok</span>
                    ) : (
                      <span className="text-muted-foreground">{r.gaps.join(', ')}</span>
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
