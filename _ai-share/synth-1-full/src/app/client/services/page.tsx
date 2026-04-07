'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Droplets, Scissors, Package } from 'lucide-react';
import { getClientServiceBookingLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

const MOCK_SERVICES = [
  { id: '1', name: 'Химчистка', desc: 'Деликатная химчистка верхней одежды', icon: Droplets, price: 'от 1 500 ₽' },
  { id: '2', name: 'Ремонт', desc: 'Починка молний, подшивка', icon: Scissors, price: 'от 500 ₽' },
  { id: '3', name: 'Кастомизация', desc: 'Нанесение принта, монограммы', icon: Package, price: 'индивидуально' },
];

export default function ServiceBookingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
      <header>
        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-600" /> Service Booking Hub
        </h1>
        <p className="text-sm text-slate-500 mt-1">Заказ химчистки, ремонта или кастомизации. Привязка к вещи из гардероба.</p>
      </header>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">Услуги</CardTitle>
          <CardDescription>Выберите услугу и привяжите к вещи из гардероба</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_SERVICES.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-[11px] text-slate-500">{s.desc} · {s.price}</p>
                  </div>
                </div>
                <Button size="sm" className="rounded-lg">Записаться</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getClientServiceBookingLinks()} />
    </div>
  );
}
