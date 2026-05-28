'use client';

import { Fragment } from 'react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PODetailExpanded } from '@/components/brand/production/ProductionSectionEnhancements';

export function ProductionPageContentTabOrdersBodyTable({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    filteredProductionOrders,
    setActiveTab,
    ordersFilter,
    setIsAutoPOOpen,
    setSelectedPoId,
    selectedPoId,
  } = px;

  const rows = (filteredProductionOrders || []).filter(
    (o: any) => ordersFilter === 'all' || o.status === ordersFilter
  );

  return (
    <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-xs font-black uppercase">Заказы на производство (PO)</CardTitle>
        <Button size="sm" className="text-[9px]" onClick={() => setIsAutoPOOpen?.(true)}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Создать PO
        </Button>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[9px]">ID</TableHead>
            <TableHead className="text-[9px]">Коллекция</TableHead>
            <TableHead className="text-[9px]">Фабрика</TableHead>
            <TableHead className="text-[9px]">Кол-во</TableHead>
            <TableHead className="text-[9px]">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((o: any) => (
            <Fragment key={o.id}>
              <TableRow
                className="hover:bg-accent-primary/10 cursor-pointer"
                onClick={() => setSelectedPoId?.(selectedPoId === o.id ? null : o.id)}
              >
                <TableCell className="font-mono text-[10px]">{o.id}</TableCell>
                <TableCell className="text-[10px]">{o.collection}</TableCell>
                <TableCell className="text-[10px]">{o.factory}</TableCell>
                <TableCell className="text-[10px] tabular-nums">{o.qty}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[8px]">
                    {o.status}
                  </Badge>
                </TableCell>
              </TableRow>
              {selectedPoId === o.id && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-bg-surface2/80 p-3">
                    <PODetailExpanded
                      po={{
                        id: o.id,
                        collection: o.collection,
                        factory: o.factory,
                        qty: o.qty,
                        status: o.status,
                        sizeMatrix: o.sizeMatrix,
                        colors: o.colors,
                        progress: o.progress,
                      }}
                      onNavigateFinance={() => setActiveTab?.('finance')}
                      onNavigateLogistics={() => setActiveTab?.('execution')}
                    />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
