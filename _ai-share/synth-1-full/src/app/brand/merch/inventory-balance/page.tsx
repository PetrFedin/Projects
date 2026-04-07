'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { buildStockTransferProposals } from '@/lib/fashion/inventory-balance';
import { ArrowLeft, ArrowRightLeft, MoveRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InventoryBalancePage() {
  const { toast } = useToast();
  const rows = useMemo(() => buildStockTransferProposals(products), []);

  const handleTransfer = (sku: string) => {
    toast({ title: 'Трансфер инициирован', description: `Заявка на перемещение SKU ${sku} отправлена в WMS.` });
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
            <ArrowRightLeft className="h-6 w-6" />
            Балансировка остатков (Stock Transfer)
          </h1>
          <p className="text-sm text-muted-foreground">Оптимизация запасов между складами и офлайн-точками.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-amber-50/20 border-amber-200">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Риск OOS (Out-of-Stock)</CardDescription>
            <CardTitle className="text-xl font-bold text-amber-700">
              {rows.filter(r => r.reason === 'oos_prevention').length} <span className="text-sm font-normal text-muted-foreground">позиций</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-50/20 border-emerald-200">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Ликвидация Slow-movers</CardDescription>
            <CardTitle className="text-xl font-bold text-emerald-700">
              {rows.filter(r => r.reason === 'slow_mover_liquidation').length} <span className="text-sm font-normal text-muted-foreground">позиций</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Рекомендации по перемещению</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Откуда</TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead>Куда</TableHead>
                <TableHead className="text-right">Кол-во</TableHead>
                <TableHead>Причина</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{r.sku}</TableCell>
                  <TableCell className="text-xs">{r.fromLocation}</TableCell>
                  <TableCell className="text-center">
                    <MoveRight className="h-3 w-3 text-muted-foreground mx-auto" />
                  </TableCell>
                  <TableCell className="text-xs font-medium">{r.toLocation}</TableCell>
                  <TableCell className="text-right font-bold text-xs">{r.quantity} шт</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[9px] border-none px-0 ${r.reason === 'oos_prevention' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {r.reason === 'oos_prevention' ? 'Подсортировка' : 'Стимуляция продаж'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => handleTransfer(r.sku)}>Перебросить</Button>
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
