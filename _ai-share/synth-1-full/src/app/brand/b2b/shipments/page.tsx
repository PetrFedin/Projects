'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, ArrowLeft, Send } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';

/** JOOR/Zalando: ASN (Advanced Shipping Notice) со стороны бренда — создание отгрузок, статусы. */
const MOCK_ASN = [
  { id: 'ASN-1', orderId: 'B2B-0012', partner: 'Podium (Москва)', status: 'В пути', sentAt: '2025-03-12' },
  { id: 'ASN-2', orderId: 'B2B-0011', partner: 'ЦУМ', status: 'Доставлено', sentAt: '2025-03-08' },
];

export default function ShipmentsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.b2bOrders}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Truck className="h-6 w-6" /> Отгрузки (ASN)</h1>
          <p className="text-slate-500 text-sm mt-0.5">Advanced Shipping Notice: создание отгрузки, уведомление ритейлера, трекинг.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Действия</CardTitle>
          <CardDescription>Отправить ASN по заказу — ритейлер увидит статус в «Карте поставок»</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm"><Send className="h-4 w-4 mr-2" /> Создать ASN по заказу</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Отгрузки</CardTitle>
          <CardDescription>История ASN по заказам</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_ASN.map((s) => (
              <li key={s.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-medium">{s.id}</p>
                  <p className="text-xs text-slate-500">Заказ {s.orderId} · {s.partner} · {s.sentAt}</p>
                </div>
                <Badge variant="outline">{s.status}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getB2BLinks()} title="B2B заказы, логистика, партнёры" />
    </div>
  );
}
