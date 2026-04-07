'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { parseSizeChartRows, sizeChartColumnOrder } from '@/lib/fashion/size-chart';
import { Ruler } from 'lucide-react';

type Props = { product: Product };

export function ProductSizeChartBlock({ product }: Props) {
  const rows = parseSizeChartRows(product);
  if (!rows?.length) return null;

  const cols = sizeChartColumnOrder(rows);

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Таблица мерок
        </CardTitle>
        <CardDescription className="text-xs">
          Данные из <code className="bg-muted px-1 rounded">attributes.sizeChart</code> — готовый контракт для PIM → витрина.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {cols.map((c) => (
                <TableHead key={c} className="text-xs whitespace-nowrap capitalize">
                  {c.replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                {cols.map((c) => (
                  <TableCell key={c} className="text-xs font-mono">
                    {r[c] ?? '—'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
