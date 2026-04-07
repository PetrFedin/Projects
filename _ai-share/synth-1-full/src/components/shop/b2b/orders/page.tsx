
'use client';

import { FeatureGate } from '@/components/FeatureGate';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, Search, Edit, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { B2BOrder } from "@/lib/types";
import { mockB2BOrders as initialMockOrders } from "@/lib/order-data";
import { cn } from "@/lib/utils";

export default function B2BOrdersPage() {
  const router = useRouter();
  const [brandFilter, setBrandFilter] = useState('all');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Черновик": return "secondary";
      case "На проверке": return { variant: "default", className: "" };
      case "Согласован": return "outline";
      case "Требует внимания": return { variant: "destructive", className: "bg-amber-500 hover:bg-amber-600 text-white"};
      default: return "secondary";
    }
  }

  const brands = [...new Set(initialMockOrders.map(o => o.brand))];
  const filteredOrders = initialMockOrders.filter(order => brandFilter === 'all' || order.brand === brandFilter);

  return (
    <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <CardTitle>Заказы у брендов</CardTitle>
                    <CardDescription>
                    Ваши оптовые закупки у брендов-партнеров.
                    </CardDescription>
                </div>
                 <div className="flex gap-2 items-center">
                    <Select value={brandFilter} onValueChange={setBrandFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Фильтр по бренду" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все бренды</SelectItem>
                            {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent>
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
                    const requiresAction = order.status === 'Требует внимания' || order.status === 'На проверке';
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
                            <Badge variant={typeof statusInfo === 'string' ? statusInfo as any : statusInfo.variant} className={typeof statusInfo !== 'string' ? statusInfo.className : ''}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             {order.status === 'Черновик' ? (
                                <FeatureGate resource="b2b_orders" action="edit" fallback={
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/shop/b2b/orders/${order.order}`}>Посмотреть</Link>
                                  </Button>
                                }>
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
                                      {requiresAction && <AlertCircle className="mr-2 h-4 w-4"/>}
                                      {requiresAction ? 'Рассмотреть' : 'Посмотреть'}
                                    </Link>
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                )})}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
