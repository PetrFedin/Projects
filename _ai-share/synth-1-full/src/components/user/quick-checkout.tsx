'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, CreditCard, Truck, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ordersRepository, paymentRepository, cartRepository } from '@/lib/repositories';
import Link from 'next/link';
import type { CartItem } from '@/lib/types';

export default function QuickCheckout({
  compact = false,
  scopeItems,
}: {
  compact?: boolean;
  /** Если задано (например образ в корзине), быстрый заказ только по этим позициям. */
  scopeItems?: CartItem[];
}) {
  const { user } = useAuth();
  const { cart } = useUIState();
  const lineItems = scopeItems ?? cart;
  const router = useRouter();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const subtotal = useMemo(
<<<<<<< HEAD
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
=======
    () => lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [lineItems]
>>>>>>> recover/cabinet-wip-from-stash
  );
  const shipping = subtotal > 10000 ? 0 : 500;
  const tax = (subtotal + shipping) * 0.2;
  const total = subtotal + shipping + tax;

  const handleQuickCheckout = async () => {
    if (!user) return;

    setProcessing(true);
    try {
      // Create payment intent
<<<<<<< HEAD
      const paymentIntent = await paymentRepository.createPaymentIntent(user.uid, total);

      // Confirm payment (mock - always succeeds)
      await paymentRepository.confirmPayment(paymentIntent.id);
=======
      const paymentIntent = await paymentRepository.createPaymentIntent(total, 'RUB', {
        userId: user.uid,
      });

      // Confirm payment (mock - always succeeds)
      await paymentRepository.confirmPayment(paymentIntent.paymentIntentId);
>>>>>>> recover/cabinet-wip-from-stash

      // Create order
      const order = await ordersRepository.createOrder(user.uid, {
        userId: user.uid,
        items: lineItems,
        subtotal,
        shipping,
        tax,
        total,
        status: 'processing',
        paymentStatus: 'paid',
        shippingAddress: {
          firstName: user.displayName.split(' ')[0] || 'Елена',
          lastName: user.displayName.split(' ')[1] || 'Петрова',
          email: user.email,
          phone: '+7 (916) 234-56-78',
          address: 'ул. Тверская, д. 15, кв. 42',
          city: 'Москва',
          postalCode: '101000',
          country: 'Россия',
        },
      });

      // Clear cart
      for (const item of lineItems) {
        await cartRepository.removeItem(user.uid, item.id, item.selectedSize, item.color);
      }

      toast({
        title: 'Заказ оформлен!',
        description: 'Ваш заказ успешно создан',
      });

      router.push(`/orders/${order.id}`);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось оформить заказ',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!user || lineItems.length === 0) {
    return null;
  }

  const hasSavedAddress = true; // Demo - user has saved address
  const hasSavedCard = true; // Demo - user has saved card

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Итого:</span>
            <span className="text-lg font-bold">{Math.round(total).toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
        <Button className="w-full" size="lg" onClick={handleQuickCheckout} disabled={processing}>
          {processing ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-pulse" />
              Оформление...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Быстрое оформление
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-background to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Быстрое оформление
        </CardTitle>
        <CardDescription>Оформите заказ в один клик используя сохраненные данные</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Товаров:</span>
              <span className="font-medium">{lineItems.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Сумма:</span>
              <span className="font-medium">{subtotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            {shipping > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Доставка:</span>
                <span className="font-medium">{shipping.toLocaleString('ru-RU')} ₽</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Доставка:</span>
                <Badge variant="outline" className="text-green-600">
                  Бесплатно
                </Badge>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">НДС:</span>
              <span className="font-medium">{Math.round(tax).toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Итого:</span>
                <span className="text-xl font-bold text-accent">
                  {Math.round(total).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Saved Info */}
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            {hasSavedAddress && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Адрес:</span>
                <span className="font-medium">ул. Тверская, д. 15, кв. 42, Москва</span>
              </div>
            )}
            {hasSavedCard && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Карта:</span>
                <span className="font-medium">**** **** **** 4242</span>
              </div>
            )}
          </div>

          {/* Quick Checkout Button */}
          <Button className="w-full" size="lg" onClick={handleQuickCheckout} disabled={processing}>
            {processing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Оформление...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Оформить заказ
              </>
            )}
          </Button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Безопасная оплата</span>
            <CheckCircle className="h-3 w-3 text-green-600" />
          </div>

          {/* Link to full checkout */}
          <Button variant="link" className="w-full text-xs" asChild>
            <Link href="/checkout">Изменить адрес или способ оплаты →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
