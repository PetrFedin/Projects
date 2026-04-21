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
import { buildTradeCodeRows, tradeCodeRowsToCsv } from '@/lib/fashion/trade-code-rollup';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function TradeCodesPage() {
  const rows = useMemo(() => buildTradeCodeRows(products), []);
  const stats = useMemo(() => {
    const full = rows.filter((r) => r.completeness === 'full').length;
    const partial = rows.filter((r) => r.completeness === 'partial').length;
    const empty = rows.filter((r) => r.completeness === 'empty').length;
    return { full, partial, empty };
  }, [rows]);

  const downloadCsv = () => {
    const csv = tradeCodeRowsToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-codes-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CabinetPageContent maxWidth="6xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <FileSpreadsheet className="h-6 w-6" />
            Таможня и маркировка
          </h1>
          <p className="text-sm text-muted-foreground">
            Поля <code className="rounded bg-muted px-1 text-[10px]">hsCode</code>,{' '}
            <code className="rounded bg-muted px-1 text-[10px]">eac</code>, страна происхождения —
            заготовка под выгрузку в compliance и логистику.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={downloadCsv}>
          CSV по <AcronymWithTooltip abbr="SKU" />
        </Button>
        <span className="text-xs text-muted-foreground">
          Полных: {stats.full} · частичных: {stats.partial} · пустых: {stats.empty}
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.attributeHealth}>Здоровье атрибутов</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Таблица</CardTitle>
          <CardDescription>{rows.length} строк</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[min(70vh,720px)] overflow-x-auto overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <AcronymWithTooltip abbr="SKU" />
                </TableHead>
                <TableHead>Название</TableHead>
                <TableHead>ТН ВЭД / HS</TableHead>
                <TableHead>ЕАС</TableHead>
                <TableHead>Происхождение</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{r.sku}</TableCell>
                  <TableCell className="max-w-[180px] text-xs">
                    <Link href={`/products/${r.slug}`} className="line-clamp-2 hover:underline">
                      {r.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{r.hsCode || '—'}</TableCell>
                  <TableCell className="text-xs">{r.eacMark || '—'}</TableCell>
                  <TableCell className="text-xs">{r.origin || '—'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.completeness === 'full'
                          ? 'default'
                          : r.completeness === 'partial'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="text-[10px]"
                    >
                      {r.completeness}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </CabinetPageContent>
  );
}
