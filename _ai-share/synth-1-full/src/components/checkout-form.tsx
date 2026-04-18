'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { Separator } from './ui/separator';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';
import { ordersRepository, paymentRepository, cartRepository } from '@/lib/repositories';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(1, 'Телефон обязателен'),
  address: z.string().min(1, 'Адрес обязателен'),
  city: z.string().min(1, 'Город обязателен'),
  postalCode: z.string().min(1, 'Индекс обязателен'),
  country: z.string().min(1, 'Страна обязательна'),
});

export default function CheckoutForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { cart } = useUIState();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.displayName?.split(' ')[0] || '',
      lastName: user?.displayName?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: 'Москва',
      postalCode: '',
      country: 'Россия',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему для оформления заказа',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Корзина пуста',
        description: 'Добавьте товары в корзину перед оформлением заказа',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Calculate totals
      const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
      const shipping = subtotal > 0 ? 500 : 0;
      const tax = (subtotal + shipping) * 0.2;
      const total = subtotal + shipping + tax;

      // Create payment intent
      const { paymentIntentId } = await paymentRepository.createPaymentIntent(total, 'RUB', {
        userId: user.uid,
      });

      // Confirm payment (mock - always succeeds in demo)
      const paymentResult = await paymentRepository.confirmPayment(paymentIntentId);

      if (!paymentResult.success) {
        throw new Error('Ошибка при обработке платежа');
      }

      // Create order
      const order = await ordersRepository.createOrder(user.uid, {
        userId: user.uid,
        items: cart,
        subtotal,
        shipping,
        tax,
        total,
        paymentStatus: 'paid',
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
      });

      // Clear cart
      await cartRepository.clearCart(user.uid);

      toast({
        title: 'Заказ успешно оформлен!',
        description: `Номер заказа: ${order.id}`,
      });

      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Ошибка при оформлении заказа',
        description: error instanceof Error ? error.message : 'Попробуйте еще раз',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Информация о доставке</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Тверская, д. 1, кв. 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Город</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Индекс</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Страна</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <h3 className="text-sm font-medium">Контактная информация</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Оплатить <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
