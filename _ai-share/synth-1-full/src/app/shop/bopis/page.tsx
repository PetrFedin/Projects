'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { PackageCheck, ArrowLeft, Store, RotateCcw } from 'lucide-react';

const MOCK_PICKUPS = [
  { id: 'p1', orderId: 'ORD-2026-001', customer: 'Иван П.', status: 'ready', items: 2 },
  { id: 'p2', orderId: 'ORD-2026-003', customer: 'Алексей В.', status: 'awaiting', items: 1 },
];

export default function ShopBopisPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl pb-24">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={ROUTES.shop.home}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold uppercase flex items-center gap-2">
          <Store className="h-6 w-6" /> BOPIS — выдача заказов
        </h1>
      </div>
      <p className="text-sm text-slate-500">
        Заказы, оформленные онлайн и выбранные для самовывоза в этом магазине. Подтвердите выдачу или примите возврат.
      </p>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PackageCheck className="h-5 w-5" /> К выдаче
          </CardTitle>
          <CardDescription>Готовые к выдаче клиенту</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {MOCK_PICKUPS.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-mono text-xs font-semibold">{p.orderId}</p>
                  <p className="text-[11px] text-slate-500">{p.customer} · {p.items} поз.</p>
                </div>
                <Badge variant={p.status === 'ready' ? 'default' : 'outline'} className="text-[9px]">
                  {p.status === 'ready' ? 'Готов' : 'Ожидает'}
                </Badge>
                {p.status === 'ready' && (
                  <Button size="sm" variant="outline" className="text-[10px] h-7">Выдать</Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RotateCcw className="h-5 w-5" /> Возврат в магазине
          </CardTitle>
          <CardDescription>Принять возврат по заказу с самовывозом</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Оформить возврат
          </Button>
        </CardContent>
      </Card>

      <p className="text-[11px] text-slate-500">
        Управление со стороны бренда: <Link href={ROUTES.brand.bopis} className="text-indigo-600 hover:underline">BOPIS Hub</Link>
      </p>
    </div>
  );
}
