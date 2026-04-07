'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getBopisLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { ArrowLeft, Store, RotateCcw } from 'lucide-react';

const MOCK_PICKUPS = [
  { id: 'p1', orderId: 'ORD-2026-001', store: 'Москва, Тверская', customer: 'Иван П.', status: 'ready', createdAt: '2026-03-11T10:00:00' },
  { id: 'p2', orderId: 'ORD-2026-002', store: 'СПб, Невский', customer: 'Мария К.', status: 'picked', createdAt: '2026-03-11T09:30:00' },
  { id: 'p3', orderId: 'ORD-2026-003', store: 'Москва, Тверская', customer: 'Алексей В.', status: 'awaiting', createdAt: '2026-03-11T11:00:00' },
];

const MOCK_RETURNS = [
  { id: 'r1', orderId: 'ORD-2026-001', store: 'Москва, Тверская', reason: 'Размер не подошёл', status: 'accepted', at: '2026-03-10T14:00:00' },
];

export default function BopisHubPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={ROUTES.brand.home}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-5 w-5" /> Заказы на выдачу
            </CardTitle>
            <CardDescription>Готовы к выдаче в магазине или ожидают клиента</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {MOCK_PICKUPS.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-mono text-xs font-semibold">{p.orderId}</p>
                    <p className="text-[11px] text-slate-500">{p.store} · {p.customer}</p>
                  </div>
                  <Badge variant={p.status === 'picked' ? 'secondary' : p.status === 'ready' ? 'default' : 'outline'} className="text-[9px]">
                    {p.status === 'picked' ? 'Выдан' : p.status === 'ready' ? 'Готов' : 'Ожидает'}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RotateCcw className="h-5 w-5" /> Возвраты в магазине
            </CardTitle>
            <CardDescription>Принятые в точке выдачи возвраты по BOPIS-заказам</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {MOCK_RETURNS.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-mono text-xs font-semibold">{r.orderId}</p>
                    <p className="text-[11px] text-slate-500">{r.store} · {r.reason}</p>
                  </div>
                  <Badge variant="outline" className="text-[9px]">{r.status === 'accepted' ? 'Принят' : r.status}</Badge>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-500 mt-2">При API: синхронизация с кассой/складом и возвратами B2B.</p>
          </CardContent>
        </Card>
      </div>

      <RelatedModulesBlock links={getBopisLinks()} title="Склад, возвраты, BOPIS в магазине" />
    </div>
  );
}
