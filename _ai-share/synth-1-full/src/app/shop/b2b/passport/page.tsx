'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Users, Package, Layers } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** JOOR Passport для байера: портал выставки — участники, каталог события, заказы с выставки. */
const MOCK_EVENT = { name: 'FW26 Syntha', date: '15–20 марта 2026' };

export default function ShopB2BPassportPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><FileText className="h-6 w-6" /> Passport выставки</h1>
          <p className="text-slate-500 text-sm mt-0.5">Единый портал события: нетворкинг, каталог, заказы с выставки.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{MOCK_EVENT.name}</CardTitle>
          <CardDescription>{MOCK_EVENT.date}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-xl border border-slate-200">
            <Users className="h-8 w-8 text-slate-500 mb-2" />
            <p className="font-medium">Участники</p>
            <p className="text-xs text-slate-500">Контакты бренда и байеров</p>
          </div>
          <Link href={`${ROUTES.shop.b2bCreateOrder}?eventId=fw26`} className="block p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
            <Layers className="h-8 w-8 text-indigo-600 mb-2" />
            <p className="font-medium">Создать заказ с выставки</p>
            <p className="text-xs text-slate-500">Написание заказа → привязка к событию FW26</p>
          </Link>
          <Link href={ROUTES.shop.b2bOrders} className="block p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
            <Package className="h-8 w-8 text-indigo-600 mb-2" />
            <p className="font-medium">Мои заказы</p>
            <p className="text-xs text-slate-500">В т.ч. заказы с этого события</p>
          </Link>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Выставки, заказы, матрица" />
    </div>
  );
}
