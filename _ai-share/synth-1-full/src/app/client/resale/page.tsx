'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Package, ArrowRight } from 'lucide-react';

const MOCK_PURCHASES = [
  { id: '1', name: 'Cyber Parka', orderId: '4501', date: '01.02.2026', estimate: '12 000 ₽' },
];

export default function ResalePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
      <header>
        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-emerald-600" /> One-Click Resale / Trade-in
        </h1>
        <p className="text-sm text-slate-500 mt-1">Быстрая перепродажа вещи из истории заказов</p>
      </header>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="h-4 w-4" /> Ваши покупки
          </CardTitle>
          <CardDescription>Выберите вещь для сдачи в ресейл или trade-in</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_PURCHASES.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-[11px] text-slate-500">Заказ #{p.orderId} · {p.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Оценка: {p.estimate}</span>
                  <Button size="sm" className="rounded-lg gap-1" asChild><Link href="/resale">Сдать на ресейл <ArrowRight className="h-3 w-3" /></Link></Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild><Link href="/client">Кабинет</Link></Button>
        <Button variant="ghost" size="sm" asChild><Link href="/client/try-before-buy">Try Before Buy</Link></Button>
        <Button variant="ghost" size="sm" asChild><Link href="/client/services">Услуги</Link></Button>
        <Button variant="ghost" size="sm" asChild><Link href="/client/allergy">Аллергии</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/resale">Circular Hub</Link></Button>
        <Button variant="ghost" size="sm" asChild><Link href="/u/wardrobe">Гардероб</Link></Button>
      </div>
    </div>
  );
}
