'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, CreditCard, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface POWithPayment {
  id: string;
  collection?: string;
  factory?: string;
  total?: number;
  status?: string;
  paymentStatus?: 'paid' | 'advance' | 'pending' | 'overdue';
  dueDate?: string;
}

export interface POOverviewAndPaymentsProps {
  orders: POWithPayment[];
  onPayClick?: (id: string) => void;
  onNavigateToFinance?: () => void;
}

export function POOverviewAndPayments({
  orders,
  onPayClick,
  onNavigateToFinance,
}: POOverviewAndPaymentsProps) {
  const pending = orders.filter(
    (o) =>
      o.paymentStatus === 'pending' ||
      o.paymentStatus === 'advance' ||
      o.paymentStatus === 'overdue'
  );
  const totalPending = pending.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <Card className="border-border-subtle rounded-xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase">
          <Package className="h-4 w-4" /> Сводка по PO
        </CardTitle>
        {onNavigateToFinance && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[8px]"
            onClick={onNavigateToFinance}
          >
            Финансы →
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {totalPending > 0 && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 p-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-[10px] font-bold">
              К оплате: {(totalPending / 1000).toFixed(0)}k ₽
            </span>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[9px]">PO</TableHead>
              <TableHead className="text-[9px]">Фабрика</TableHead>
              <TableHead className="text-[9px]">Оплата</TableHead>
              <TableHead className="text-right text-[9px]">Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.slice(0, 6).map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-[10px]">{o.id}</TableCell>
                <TableCell className="text-[10px]">{o.factory}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[8px]',
                      o.paymentStatus === 'paid' && 'border-emerald-200 text-emerald-600',
                      o.paymentStatus === 'overdue' && 'border-rose-200 text-rose-600',
                      (o.paymentStatus === 'pending' || o.paymentStatus === 'advance') &&
                        'border-amber-200 text-amber-600'
                    )}
                  >
                    {o.paymentStatus === 'paid'
                      ? 'Оплачено'
                      : o.paymentStatus === 'advance'
                        ? 'Аванс'
                        : o.paymentStatus === 'overdue'
                          ? 'Просрочено'
                          : 'Ожидает'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {o.paymentStatus !== 'paid' && onPayClick && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[8px]"
                      onClick={() => onPayClick(o.id)}
                    >
                      <CreditCard className="mr-0.5 h-3 w-3" /> Оплатить
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
