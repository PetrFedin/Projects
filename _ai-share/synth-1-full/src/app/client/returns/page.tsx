'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function ClientReturnsPage() {
  return (
    <div className="container max-w-4xl space-y-6 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.client.home} aria-label="В личный кабинет">
          <Button variant="ghost" size="icon" aria-label="Назад">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Возвраты</h1>
          <p className="text-sm text-slate-500">
            Оформление возврата товаров. Связь с заказами и Try Before You Buy.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Мои возвраты
          </CardTitle>
          <CardDescription>Список возвратов будет доступен после подключения API.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Связанные разделы:{' '}
            <Link href={ROUTES.client.orders} className="text-indigo-600 underline">
              Мои заказы
            </Link>
            ,{' '}
            <Link href={ROUTES.client.tryBeforeYouBuy} className="text-indigo-600 underline">
              Try Before You Buy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
