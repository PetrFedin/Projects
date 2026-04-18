'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Package, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const MOCK_PURCHASES = [
  { id: '1', name: 'Cyber Parka', orderId: '4501', date: '01.02.2026', estimate: '12 000 ₽' },
];

export default function ResalePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 pb-24">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
          <RefreshCw className="h-6 w-6 text-emerald-600" /> One-Click Resale / Trade-in
        </h1>
<<<<<<< HEAD
        <p className="mt-1 text-sm text-slate-500">Быстрая перепродажа вещи из истории заказов</p>
=======
        <p className="text-text-secondary mt-1 text-sm">
          Быстрая перепродажа вещи из истории заказов
        </p>
>>>>>>> recover/cabinet-wip-from-stash
      </header>

      <Card className="border-border-default rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4" /> Ваши покупки
          </CardTitle>
          <CardDescription>Выберите вещь для сдачи в ресейл или trade-in</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_PURCHASES.map((p) => (
              <li
                key={p.id}
<<<<<<< HEAD
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-[11px] text-slate-500">
=======
                className="bg-bg-surface2 border-border-default flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
              >
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-text-secondary text-[11px]">
>>>>>>> recover/cabinet-wip-from-stash
                    Заказ #{p.orderId} · {p.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Оценка: {p.estimate}</span>
                  <Button size="sm" className="gap-1 rounded-lg" asChild>
                    <Link href="/resale">
                      Сдать на ресейл <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild>
<<<<<<< HEAD
          <Link href="/client">Кабинет</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/client/try-before-buy">Try Before Buy</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/client/services">Услуги</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/client/allergy">Аллергии</Link>
=======
          <Link href={ROUTES.client.home}>Кабинет</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.tryBeforeYouBuy}>Try Before Buy</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.services}>Услуги</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.client.allergy}>Аллергии</Link>
>>>>>>> recover/cabinet-wip-from-stash
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/resale">Circular Hub</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
<<<<<<< HEAD
          <Link href="/u/wardrobe">Гардероб</Link>
=======
          <Link href={ROUTES.client.profileWardrobe}>Гардероб</Link>
>>>>>>> recover/cabinet-wip-from-stash
        </Button>
      </div>
    </div>
  );
}
