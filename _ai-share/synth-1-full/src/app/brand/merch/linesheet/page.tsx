'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildLineSheetItems, lineSheetToCsv } from '@/lib/fashion/linesheet-logic';
import { ArrowLeft, FileText, Download, ShoppingCart } from 'lucide-react';

export default function LineSheetPage() {
  const rows = useMemo(() => buildLineSheetItems(products), []);

  const downloadCsv = () => {
    const csv = lineSheetToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linesheet-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <FileText className="h-6 w-6 text-violet-600" />
            Wholesale Line Sheet
          </h1>
          <p className="text-sm text-muted-foreground">
            Оптовый каталог коллекции для байеров. Включает MOQ, оптовые цены и размерные сетки.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={downloadCsv} className="gap-2">
          <Download className="h-4 w-4" />
          Экспорт в CSV / B2B
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Печать PDF (Lookbook)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Коллекция</CardTitle>
          <CardDescription>
            {rows.length} SKU доступно для оптового заказа.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU / Товар</TableHead>
                <TableHead>Опт (₽)</TableHead>
                <TableHead>РРЦ (₽)</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Цвета / Размеры</TableHead>
                <TableHead className="text-right">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell className="max-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 rounded border bg-muted shrink-0 overflow-hidden relative">
                         {r.imageUrl && <img src={r.imageUrl} className="object-cover h-full w-full" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">{r.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{r.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-xs">{r.wholesalePrice.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {r.moq} шт
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="text-[10px] truncate">{r.colors.join(', ')}</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase">{r.sizes.join(', ')}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ShoppingCart className="h-4 w-4" />
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
