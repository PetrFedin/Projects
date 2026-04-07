'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

const MOCK_AGENTS = [
  { id: '1', name: 'Иван Петров', deals: 12, volume: 2400000, commission: 72000, paid: true },
  { id: '2', name: 'Мария Сидорова', deals: 8, volume: 1800000, commission: 54000, paid: false },
];

export default function CommissionsPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl pb-24">
      <header>
        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-emerald-600" /> Sub-Agent Commission Dash
        </h1>
        <p className="text-sm text-slate-500 mt-1">Прозрачный расчёт комиссий торговых представителей</p>
      </header>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" /> Представители
          </CardTitle>
          <CardDescription>Сделки, объём и комиссия 3% от объёма</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_AGENTS.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold">{a.name}</p>
                  <p className="text-[11px] text-slate-500">{a.deals} сделок · {a.volume.toLocaleString()} ₽</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-600">{a.commission.toLocaleString()} ₽</span>
                  <Badge variant={a.paid ? 'secondary' : 'default'}>{a.paid ? 'Выплачено' : 'К выплате'}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild><Link href="/distributor">Кабинет</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/distributor/orders">Заказы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/distributor/vmi">VMI</Link></Button>
      </div>
    </div>
  );
}
