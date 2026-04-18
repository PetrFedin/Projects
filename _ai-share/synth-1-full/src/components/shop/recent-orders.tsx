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

const mockOrders = [
  {
    order: 'ORD001',
    status: 'В ожидании',
    customer: 'Лиам Джонсон',
    email: 'liam@example.com',
    amount: '25 000 ₽',
  },
  {
    order: 'ORD002',
    status: 'Обработка',
    customer: 'Оливия Смит',
    email: 'olivia@example.com',
    amount: '15 000 ₽',
  },
  {
    order: 'ORD003',
    status: 'Отправлен',
    customer: 'Ноа Уильямс',
    email: 'noah@example.com',
    amount: '35 000 ₽',
  },
  {
    order: 'ORD004',
    status: 'В ожидании',
    customer: 'Эмма Браун',
    email: 'emma@example.com',
    amount: '45 000 ₽',
  },
  {
    order: 'ORD005',
    status: 'Доставлен',
    customer: 'Ава Джонс',
    email: 'ava@example.com',
    amount: '55 000 ₽',
  },
];

export function RecentOrders() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'В ожидании':
        return 'secondary';
      case 'Обработка':
        return 'default';
      case 'Отправлен':
        return 'outline';
      case 'Доставлен':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Заказ</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Клиент</TableHead>
          <TableHead className="text-right">Сумма</TableHead>
          <TableHead className="text-right">Действие</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockOrders.map((order) => (
          <TableRow key={order.order}>
            <TableCell className="font-medium">
              <Button variant="link" asChild className="p-0 font-medium">
                <Link href={`/shop/orders/${order.order}`}>{order.order}</Link>
              </Button>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="font-medium">{order.customer}</div>
              <div className="text-sm text-muted-foreground">{order.email}</div>
            </TableCell>
            <TableCell className="text-right">{order.amount}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/shop/orders/${order.order}`}>Посмотреть</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
