'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

const MOCK_LAST_PURCHASE = { name: 'Cyber Parka', orderId: '4501', date: '2 дня назад' };
const MOCK_RECOMMENDATIONS = [
  { id: '1', name: 'Cargo Pants', reason: 'Дополняет образ', price: '9 500 ₽' },
  { id: '2', name: 'Neural Tee', reason: 'Базовая пара', price: '4 500 ₽' },
  { id: '3', name: 'Overshirt', reason: 'Слой под парку', price: '12 000 ₽' },
];

export default function StyleMePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 pb-24">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-slate-900">
          <Sparkles className="h-6 w-6 text-indigo-600" /> Style-Me: дополняем образ
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Персональные подборки к вашей последней покупке
        </p>
      </header>

      <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="text-sm">Ваша последняя покупка</CardTitle>
          <CardDescription>Рекомендации составлены на основе этой вещи</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-bold">{MOCK_LAST_PURCHASE.name}</p>
          <p className="text-[11px] text-slate-500">
            Заказ #{MOCK_LAST_PURCHASE.orderId} · {MOCK_LAST_PURCHASE.date}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShoppingBag className="h-4 w-4" /> Рекомендуем докупить
          </CardTitle>
          <CardDescription>Составят полный образ с вашей паркой</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_RECOMMENDATIONS.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-[11px] text-slate-500">{r.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{r.price}</span>
                  <Button size="sm" variant="outline" className="rounded-lg text-[10px]" asChild>
                    <Link href="/marketroom">
                      В каталог <ArrowRight className="ml-1 h-3 w-3" />
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
          <Link href="/client">В кабинет</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/marketroom">Marketroom</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/u/wardrobe">Гардероб</Link>
        </Button>
      </div>
    </div>
  );
}
