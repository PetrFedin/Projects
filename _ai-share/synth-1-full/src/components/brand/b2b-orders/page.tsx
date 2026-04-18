'use client';

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
=======
import { Badge, type BadgeProps } from '@/components/ui/badge';
>>>>>>> recover/cabinet-wip-from-stash
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, FileText, Calendar, AlertCircle, BookText } from 'lucide-react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { mockB2BOrders } from '@/lib/order-data';
import { useState } from 'react';
import { cn } from '@/lib/utils';
=======
import { useB2BOperationalOrdersList } from '@/hooks/use-b2b-operational-orders-list';
import { B2B_ORDERS_REGISTRY_LABEL } from '@/lib/ui/b2b-registry-label';
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash

export default function B2BOrdersPage() {
  const router = useRouter();
  const orders = useB2BOperationalOrdersList();

  type StatusBadgeConfig = {
    variant: NonNullable<BadgeProps['variant']>;
    className?: string;
  };

  const getStatusVariant = (status: string): StatusBadgeConfig => {
    switch (status) {
      case 'На проверке':
        return { variant: 'destructive', className: 'bg-amber-500 hover:bg-amber-600 text-white' };
      case 'Согласован':
        return { variant: 'default', className: '' };
      case 'В производстве':
        return { variant: 'outline', className: 'text-blue-600 border-blue-500' };
      case 'Требует внимания':
        return { variant: 'destructive' };
      default:
        return { variant: 'secondary', className: '' };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
<<<<<<< HEAD
          <CardTitle>B2B Заказы</CardTitle>
=======
          <CardTitle>{B2B_ORDERS_REGISTRY_LABEL}</CardTitle>
>>>>>>> recover/cabinet-wip-from-stash
          <CardDescription>Заказы, поступившие от ритейлеров на вашу продукцию.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:max-w-xs">
<<<<<<< HEAD
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Поиск по номеру или магазину..." className="pl-8" />
          </div>
          <Button variant="outline" onClick={() => router.push('/brand/b2b-orders/calendar')}>
            <Calendar className="mr-2 h-4 w-4" />
            Календарь
          </Button>
          <Button variant="outline" onClick={() => router.push('/brand/b2b/linesheets')}>
            <BookText className="mr-2 h-4 w-4" />
=======
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Поиск по номеру или магазину..." className="pl-8" />
          </div>
          <Button variant="outline" onClick={() => router.push(ROUTES.brand.calendar)}>
            <Calendar className="mr-2 size-4" />
            Календарь
          </Button>
          <Button variant="outline" onClick={() => router.push('/brand/b2b/linesheets')}>
            <BookText className="mr-2 size-4" />
>>>>>>> recover/cabinet-wip-from-stash
            Лайншиты
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заказ</TableHead>
              <TableHead>Магазин</TableHead>
              <TableHead>Дата заказа</TableHead>
              <TableHead>Дата отгрузки</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead>
                <span className="sr-only">Действия</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusInfo = getStatusVariant(order.status);
              const requiresAction = order.status === 'На проверке';
              return (
                <TableRow key={order.order} data-state={requiresAction ? 'selected' : ''}>
                  <TableCell className="font-medium">
                    <Button variant="link" asChild className="p-0 font-medium">
<<<<<<< HEAD
                      <Link href={`/brand/b2b-orders/${order.order}`}>{order.order}</Link>
=======
                      <Link href={ROUTES.brand.b2bOrder(order.order)}>{order.order}</Link>
>>>>>>> recover/cabinet-wip-from-stash
                    </Button>
                  </TableCell>
                  <TableCell>{order.shop}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{new Date(order.deliveryDate).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>
<<<<<<< HEAD
                    <Badge
                      variant={
                        typeof statusInfo === 'string' ? (statusInfo as any) : statusInfo.variant
                      }
                      className={typeof statusInfo !== 'string' ? statusInfo.className : ''}
                    >
=======
                    <Badge variant={statusInfo.variant} className={statusInfo.className ?? ''}>
>>>>>>> recover/cabinet-wip-from-stash
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant={requiresAction ? 'default' : 'outline'} size="sm" asChild>
<<<<<<< HEAD
                      <Link href={`/brand/b2b-orders/${order.order}`}>
                        {requiresAction && <AlertCircle className="mr-2 h-4 w-4" />}
=======
                      <Link href={ROUTES.brand.b2bOrder(order.order)}>
                        {requiresAction && <AlertCircle className="mr-2 size-4" />}
>>>>>>> recover/cabinet-wip-from-stash
                        {requiresAction ? 'Рассмотреть' : 'Посмотреть'}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
