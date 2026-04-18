'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'В ожидании', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Обработка', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Отправлен', color: 'bg-accent-primary/15 text-text-primary' },
  delivered: { label: 'Доставлен', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-800' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const ordersData = await ordersRepository.getOrders(user.uid);
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    // Subscribe to changes
    const unsubscribe = ordersRepository.onOrdersChange(user.uid, (updatedOrders) => {
      setOrders(updatedOrders);
    });

    return unsubscribe;
  }, [user, router]);

  if (loading) {
    return (
      <div className="w-full py-6">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="w-full">
        <h1 className="mb-8 font-headline text-base font-bold">Мои заказы</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 pt-6 text-center">
              <p className="mb-4 text-muted-foreground">У вас пока нет заказов</p>
              <Button asChild>
                <Link href="/">Начать покупки</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status];
              return (
                <Card key={order.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-sm font-semibold">Заказ #{order.id.split('-')[1]}</h3>
                          <Badge className={cn('text-xs', statusInfo.color)}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="mb-2 text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'товар' : 'товаров'} •{' '}
                          {order.total.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
