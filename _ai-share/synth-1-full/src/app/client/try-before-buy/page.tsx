'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CreditCard, RotateCcw } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const MOCK_ORDER = {
  id: 'TB-501',
  items: ['Cyber Parka M'],
  amount: 18000,
  status: 'delivered_try',
  expires: '18.03.2026',
};

export default function TryBeforeBuyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 pb-24">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
          <Package className="text-accent-primary h-6 w-6" /> Try Before You Buy
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Примерка перед покупкой: средства заблокированы, вы решаете — выкупить или вернуть
        </p>
      </header>

      <Card className="border-accent-primary/30 bg-accent-primary/10 rounded-xl border">
        <CardHeader>
          <CardTitle className="text-sm">Текущая примерка</CardTitle>
          <CardDescription>
            Заказ доставлен на примерку. Решите до {MOCK_ORDER.expires}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium">{MOCK_ORDER.items.join(', ')}</p>
          <p className="text-text-secondary text-sm">
            Сумма к списанию: <strong>{MOCK_ORDER.amount.toLocaleString()} ₽</strong> (средства
            заблокированы)
          </p>
          <div className="flex gap-2">
            <Button className="gap-2 rounded-xl">
              <CreditCard className="h-4 w-4" /> Выкупить
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Вернуть
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.home}>В кабинет</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.resale}>Resale</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.services}>Услуги</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.allergy}>Аллергии</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.profileWardrobe}>Гардероб</Link>
        </Button>
      </div>
    </div>
  );
}
