'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { mockB2BOrders } from '@/lib/order-data';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function B2BOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(mockB2BOrders);

  const getStatusVariant = (status: string) => {
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

  const brands = [...new Set(mockB2BOrders.map((o) => o.brand))];
  const [brandFilter, setBrandFilter] = useState('all');
  const filteredOrders = orders.filter(
    (order) => brandFilter === 'all' || order.brand === brandFilter
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>B2B Заказы</CardTitle>
          <CardDescription>Заказы, поступившие от ритейлеров на вашу продукцию.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Поиск по номеру или магазину..." className="pl-8" />
          </div>
          <Button variant="outline" onClick={() => router.push('/brand/b2b-orders/calendar')}>
            <Calendar className="mr-2 h-4 w-4" />
            Календарь
          </Button>
          <Button variant="outline" onClick={() => router.push('/brand/b2b/linesheets')}>
            <BookText className="mr-2 h-4 w-4" />
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
              const requiresAction =
                order.status === 'Требует внимания' || order.status === 'На проверке';
              return (
                <TableRow key={order.order} data-state={requiresAction ? 'selected' : ''}>
                  <TableCell className="font-medium">
                    <Button variant="link" asChild className="p-0 font-medium">
                      <Link href={`/brand/b2b-orders/${order.order}`}>{order.order}</Link>
                    </Button>
                  </TableCell>
                  <TableCell>{order.shop}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{new Date(order.deliveryDate).toLocaleDateString('ru-RU')}</TableCell>
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
                  <TableCell className="text-right">{order.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant={requiresAction ? 'default' : 'outline'} size="sm" asChild>
                      <Link href={`/brand/b2b-orders/${order.order}`}>
                        {requiresAction && <AlertCircle className="mr-2 h-4 w-4" />}
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
