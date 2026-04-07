'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Package, QrCode, Truck, Factory, ArrowUpFromLine } from 'lucide-react';
import { useRbac } from '@/hooks/useRbac';
import { getAvailableQty, type InventoryItem } from '@/lib/warehouse';
import { cn } from '@/lib/utils';
import { getLogisticsLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

const MOCK_INVENTORY: InventoryItem[] = [
  { skuId: 'TP-9921', size: 'M', color: 'Black', qty: 120, reserved: 30, location: 'main', updatedAt: '2026-03-10T09:00:00Z' },
  { skuId: 'TP-9921', size: 'L', color: 'Black', qty: 80, reserved: 0, location: 'main', updatedAt: '2026-03-10T09:00:00Z' },
  { skuId: 'TP-8812', size: 'M', color: 'Green', qty: 200, reserved: 50, location: 'retailer', locationId: 'TSUM', updatedAt: '2026-03-09T14:00:00Z' },
];

export default function WarehousePage() {
  const { can } = useRbac();
  const canEdit = can('warehouse', 'edit');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">Складской учёт</h1>
          <p className="text-sm text-slate-500">Инвентарь, остатки, связь с Production и маркировкой</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link href="/brand/production"><Factory className="h-4 w-4 mr-2" /> Production</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/brand/logistics/duty-calculator"><Truck className="h-4 w-4 mr-2" /> Duty Calculator</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/brand/logistics/consolidation"><Package className="h-4 w-4 mr-2" /> Консолидация</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/brand/logistics/shadow-inventory"><ArrowUpFromLine className="h-4 w-4 mr-2" /> Shadow Inventory</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/brand/compliance/stock"><QrCode className="h-4 w-4 mr-2" /> КИЗ / Честный ЗНАК</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Всего SKU</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black">{new Set(MOCK_INVENTORY.map((i) => i.skuId)).size}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">В наличии</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black">{MOCK_INVENTORY.reduce((s, i) => s + i.qty, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Зарезервировано</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black">{MOCK_INVENTORY.reduce((s, i) => s + (i.reserved ?? 0), 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Остатки по позициям</CardTitle>
          <p className="text-sm text-slate-500">Связь с B2B заказами и Production</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Цвет</TableHead>
                <TableHead>Кол-во</TableHead>
                <TableHead>Резерв</TableHead>
                <TableHead>Доступно</TableHead>
                <TableHead>Локация</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVENTORY.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono font-bold">{item.skuId}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.reserved ?? 0}</TableCell>
                  <TableCell className={cn(getAvailableQty(item) < 20 && 'text-amber-600 font-bold')}>
                    {getAvailableQty(item)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[9px]">{item.location}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getLogisticsLinks()} className="mt-6" />
    </div>
  );
}
