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
import { buildDemandForecast } from '@/lib/fashion/waitlist-store';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Bell } from 'lucide-react';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';

export default function DemandForecastPage() {
  const rows = useMemo(() => buildDemandForecast(products), []);

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
            <Bell className="h-6 w-6" />
            Упущенный спрос (Waitlist)
          </h1>
          <p className="text-sm text-muted-foreground">
            Анализ запросов клиентов на отсутствующие размеры. Помогает планировать подсортировку
            (Re-order).
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Всего запросов</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {rows.reduce((sum, r) => sum + r.waitlistCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
<<<<<<< HEAD
            <CardDescription className="text-xs">Топовый SKU</CardDescription>
=======
            <CardDescription className="text-xs">
              Топовый <AcronymWithTooltip abbr="SKU" />
            </CardDescription>
>>>>>>> recover/cabinet-wip-from-stash
            <CardTitle className="truncate text-base">{rows[0]?.name}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardDescription className="text-xs">В тренде</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {rows.filter((r) => r.trend === 'up').length}{' '}
              <span className="text-xs font-normal text-muted-foreground">модели</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Рейтинг спроса</CardTitle>
          <CardDescription>
            <AcronymWithTooltip abbr="SKU" /> × Размер × Количество «Узнать о наличии»
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <AcronymWithTooltip abbr="SKU" /> / Товар
                </TableHead>
                <TableHead>Размер</TableHead>
                <TableHead className="text-right">Ждут (чел.)</TableHead>
                <TableHead className="text-center">Тренд</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={`${r.sku}-${r.size}`}>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate text-xs font-medium">{r.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{r.sku}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {r.size}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold">{r.waitlistCount}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {r.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                      {r.trend === 'down' && <TrendingDown className="h-4 w-4 text-rose-500" />}
                      {r.trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="h-7 text-[10px]">
                      Заказать Re-order
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
