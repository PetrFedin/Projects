'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Store, TrendingUp } from 'lucide-react';

const MOCK_STORES = [
  { id: 's1', name: 'Магазин Москва Тверская', stock: 45, threshold: 50, recommend: 30 },
  { id: 's2', name: 'Магазин СПб Невский', stock: 12, threshold: 40, recommend: 50 },
  { id: 's3', name: 'Магазин Казань', stock: 80, threshold: 30, recommend: 0 },
];

export default function VMIPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl pb-24">
      <header>
        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Package className="h-6 w-6 text-emerald-600" /> VMI — Vendor Managed Inventory
        </h1>
        <p className="text-sm text-slate-500 mt-1">Автопополнение полок магазинов на основе данных об их продажах</p>
      </header>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Store className="h-4 w-4" /> Рекомендации по дозаказу
          </CardTitle>
          <CardDescription>Остаток ниже порога — рекомендуемый объём к заказу</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_STORES.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-[11px] text-slate-500">Остаток: {s.stock} · Порог: {s.threshold}</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.recommend > 0 ? (
                    <>
                      <Badge variant="destructive" className="text-[9px]">Дозаказ</Badge>
                      <span className="font-black text-sm">+{s.recommend} ед.</span>
                      <Button size="sm" className="rounded-lg text-[10px]">Создать заказ</Button>
                    </>
                  ) : (
                    <Badge variant="secondary">OK</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild><Link href="/distributor">Кабинет</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/distributor/orders">Заказы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/distributor/analytics">Аналитика</Link></Button>
      </div>
    </div>
  );
}
