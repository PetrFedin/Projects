'use client';

import { FeatureGate } from '@/components/FeatureGate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
<<<<<<< HEAD
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, PlusCircle, Search, Edit, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
=======
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { operationalLayoutContract as o } from '@/lib/ui/operational-layout-contract';
import { tid } from '@/lib/ui/test-ids';
>>>>>>> recover/cabinet-wip-from-stash
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
<<<<<<< HEAD
import { useState } from 'react';
import type { B2BOrder } from '@/lib/types';
import { mockB2BOrders as initialMockOrders } from '@/lib/order-data';
=======
import { useMemo, useState } from 'react';
import { useB2BOperationalOrdersList } from '@/hooks/use-b2b-operational-orders-list';
>>>>>>> recover/cabinet-wip-from-stash
import { cn } from '@/lib/utils';

export default function B2BOrdersPage() {
  const [brandFilter, setBrandFilter] = useState('all');
  const ordersWithPayment = useB2BOperationalOrdersList();

  type OrderStatusBadge =
    | NonNullable<BadgeProps['variant']>
    | { variant: NonNullable<BadgeProps['variant']>; className: string };

  const getStatusVariant = (status: string): OrderStatusBadge => {
    switch (status) {
      case 'Черновик':
        return 'secondary';
      case 'На проверке':
        return { variant: 'default', className: '' };
      case 'Согласован':
        return 'outline';
      case 'Требует внимания':
        return { variant: 'destructive', className: 'bg-amber-500 hover:bg-amber-600 text-white' };
      default:
        return 'secondary';
    }
  };

<<<<<<< HEAD
  const brands = [...new Set(initialMockOrders.map((o) => o.brand))];
  const filteredOrders = initialMockOrders.filter(
    (order) => brandFilter === 'all' || order.brand === brandFilter
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Заказы у брендов</CardTitle>
            <CardDescription>Ваши оптовые закупки у брендов-партнеров.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
=======
  const brands = useMemo(
    () => [...new Set(ordersWithPayment.map((o) => o.brand))],
    [ordersWithPayment]
  );
  const filteredOrders = useMemo(
    () => ordersWithPayment.filter((order) => brandFilter === 'all' || order.brand === brandFilter),
    [ordersWithPayment, brandFilter]
  );

  return (
    <Card className={cn(o.panel, 'shadow-sm')}>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-text-primary text-xl font-semibold tracking-tight">
              Заказы у брендов
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Ваши оптовые закупки у брендов-партнеров.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="border-border-default w-full rounded-lg sm:w-[180px]">
>>>>>>> recover/cabinet-wip-from-stash
                <SelectValue placeholder="Фильтр по бренду" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все бренды</SelectItem>
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
<<<<<<< HEAD
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Номер заказа</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead>Дата заказа</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const statusInfo = getStatusVariant(order.status);
              const requiresAction =
                order.status === 'Требует внимания' || order.status === 'На проверке';
              return (
                <TableRow key={order.order} data-state={requiresAction ? 'selected' : ''}>
                  <TableCell className="font-medium">
                    <Button variant="link" asChild className="p-0 font-medium">
                      <Link href={`/shop/b2b/orders/${order.order}`}>{order.order}</Link>
                    </Button>
                  </TableCell>
                  <TableCell>{order.brand}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        typeof statusInfo === 'string' ? (statusInfo as any) : statusInfo.variant
                      }
                      className={typeof statusInfo !== 'string' ? statusInfo.className : ''}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === 'Черновик' ? (
                      <FeatureGate
                        resource="b2b_orders"
                        action="edit"
                        fallback={
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/shop/b2b/orders/${order.order}`}>Посмотреть</Link>
                          </Button>
                        }
                      >
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/shop/b2b/matrix">
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                          </Link>
                        </Button>
                      </FeatureGate>
                    ) : (
                      <Button variant={requiresAction ? 'default' : 'outline'} size="sm" asChild>
                        <Link href={`/shop/b2b/orders/${order.order}`}>
                          {requiresAction && <AlertCircle className="mr-2 h-4 w-4" />}
                          {requiresAction ? 'Рассмотреть' : 'Посмотреть'}
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
=======
        <div className={o.tableWrap} data-testid={tid.shopB2bOrdersTable}>
          <Table>
            <TableHeader>
              <TableRow className="border-border-default border-b hover:bg-transparent">
                <TableHead className={cn(o.tableHeadCell, 'h-11')}>Номер заказа</TableHead>
                <TableHead className={cn(o.tableHeadCell, 'h-11')}>Бренд</TableHead>
                <TableHead className={cn(o.tableHeadCell, 'h-11')}>Дата заказа</TableHead>
                <TableHead className={cn(o.tableHeadCell, 'h-11 text-right')}>Сумма</TableHead>
                <TableHead className={cn(o.tableHeadCell, 'h-11')}>Статус</TableHead>
                <TableHead className={cn(o.tableHeadCell, 'h-11 text-right')}>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusVariant(order.status);
                const requiresAction =
                  order.status === 'Требует внимания' || order.status === 'На проверке';
                return (
                  <TableRow
                    key={order.order}
                    className={cn(o.tableRow, requiresAction && 'bg-amber-50/50')}
                    data-state={requiresAction ? 'selected' : ''}
                    data-testid={tid.orderRow(order.order)}
                  >
                    <TableCell className={cn(o.tableCell, 'font-medium')}>
                      <Button variant="link" asChild className={cn('h-auto p-0', o.primaryLink)}>
                        <Link href={ROUTES.shop.b2bOrder(order.order)}>{order.order}</Link>
                      </Button>
                    </TableCell>
                    <TableCell className={o.tableCell}>{order.brand}</TableCell>
                    <TableCell className={o.tableCell}>
                      {new Date(order.date).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell className={cn(o.tableCell, o.numericCell)}>{order.amount}</TableCell>
                    <TableCell className={o.tableCell}>
                      <Badge
                        variant={typeof statusInfo === 'string' ? statusInfo : statusInfo.variant}
                        className={typeof statusInfo !== 'string' ? statusInfo.className : ''}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(o.tableCell, 'text-right')}>
                      {order.status === 'Черновик' ? (
                        <FeatureGate
                          resource="b2b_orders"
                          action="edit"
                          fallback={
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border-default rounded-lg"
                              asChild
                            >
                              <Link href={ROUTES.shop.b2bOrder(order.order)}>Посмотреть</Link>
                            </Button>
                          }
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border-default rounded-lg"
                            asChild
                          >
                            <Link href={ROUTES.shop.b2bMatrix}>
                              <Edit className="mr-2 size-4" />
                              Редактировать
                            </Link>
                          </Button>
                        </FeatureGate>
                      ) : (
                        <Button
                          variant={requiresAction ? 'default' : 'outline'}
                          size="sm"
                          className="rounded-lg"
                          asChild
                        >
                          <Link href={ROUTES.shop.b2bOrder(order.order)}>
                            {requiresAction && <AlertCircle className="mr-2 size-4" />}
                            {requiresAction ? 'Рассмотреть' : 'Посмотреть'}
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
>>>>>>> recover/cabinet-wip-from-stash
      </CardContent>
    </Card>
  );
}
