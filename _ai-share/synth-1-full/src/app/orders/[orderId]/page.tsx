'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, CheckCircle, Clock, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { RegistryPageShell } from '@/components/design-system';

const statusConfig = {
  pending: { label: 'В ожидании', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Обработка', icon: Package, color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Отправлен', icon: Truck, color: 'bg-accent-primary/15 text-text-primary' },
  delivered: { label: 'Доставлен', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Отменен', icon: Clock, color: 'bg-red-100 text-red-800' },
};

export default function OrderConfirmationPage({
  params: paramsPromise,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadOrder = async () => {
      try {
        const orderData = await ordersRepository.getOrderById(user.uid, params.orderId);
        if (!orderData) {
          router.push('/orders');
          return;
        }
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [user, params.orderId, router]);

  if (loading) {
    return (
      <RegistryPageShell className="py-12 pb-16">
        <div className="text-center">Загрузка...</div>
      </RegistryPageShell>
    );
  }

  if (!order) {
    return null;
  }

  const statusInfo = statusConfig[order.status];

  return (
<<<<<<< HEAD
    <div className="container mx-auto px-4 py-12">
=======
    <RegistryPageShell className="py-12 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-headline text-base font-bold">Заказ оформлен!</h1>
            <p className="mt-1 text-muted-foreground">
              Номер заказа: <span className="font-mono">{order.id}</span>
            </p>
          </div>
          <Badge className={cn('text-sm', statusInfo.color)}>{statusInfo.label}</Badge>
        </div>

        {/* Success Message */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Спасибо за ваш заказ!</h2>
                <p className="text-muted-foreground">
                  Мы отправили подтверждение на {order.shippingAddress.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid gap-3 md:grid-cols-2">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Товары в заказе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                  <div className="relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.images[0].url}
                      alt={item.images[0].alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                    <p className="text-sm text-muted-foreground">Размер: {item.selectedSize}</p>
                    <p className="text-sm text-muted-foreground">Количество: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping & Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о доставке</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Адрес доставки</p>
                <p className="font-medium">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Контактная информация</p>
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.email}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Статус оплаты</p>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                  {order.paymentStatus === 'paid' ? 'Оплачено' : 'Ожидает оплаты'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Итого</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Подытог</span>
                <span>{order.subtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Доставка</span>
                <span>{order.shipping.toLocaleString('ru-RU')} ₽</span>
              </div>
              {order.tax && (
                <div className="flex justify-between text-muted-foreground">
                  <span>НДС</span>
                  <span>{order.tax.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm font-bold">
                <span>Итого</span>
                <span>{order.total.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Дата заказа: {format(new Date(order.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Продолжить покупки</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/client/me/payments">Мои заказы</Link>
          </Button>
        </div>
      </div>
    </RegistryPageShell>
  );
}
