'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

const mockDrops = [
  {
    id: '1',
    name: 'FW26 Core',
    date: '2026-03-20',
    status: 'open',
    description: 'Базовая коллекция осень-зима',
  },
  {
    id: '2',
    name: 'FW26 Trend',
    date: '2026-04-05',
    status: 'open',
    description: 'Трендовые модели',
  },
  {
    id: '3',
    name: 'SS26 Early',
    date: '2026-01-15',
    status: 'closed',
    description: 'Ранний доступ весна-лето',
  },
];

export default function PreOrderB2BPage() {
  return (
    <div className="container max-w-4xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Link href="/shop/b2b">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pre-order / Ранний доступ</h1>
          <p className="text-sm text-slate-500">
            Предзаказ коллекций к дате дропа (Farfetch / Mytheresa style)
          </p>
        </div>
      </div>

      <Card className="border-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Ближайшие дропы
          </CardTitle>
          <CardDescription>
            Выберите коллекцию. В матрице заказа включите режим Pre-order и оформите заказ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockDrops.map((drop) => (
            <div
              key={drop.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-colors hover:border-indigo-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <Package className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">{drop.name}</p>
                  <p className="text-sm text-slate-500">{drop.description}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Поступление: {new Date(drop.date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={drop.status === 'open' ? 'default' : 'secondary'}>
                  {drop.status === 'open' ? 'Приём заказов' : 'Закрыт'}
                </Badge>
                {drop.status === 'open' && (
                  <Button size="sm" asChild>
                    <Link href="/shop/b2b/matrix">В матрицу заказа</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
          <p className="pt-2 text-xs text-slate-400">
            В{' '}
            <Link href="/shop/b2b/matrix" className="text-indigo-600 underline">
              матрице заказа
            </Link>{' '}
            выберите режим <strong>Pre-order</strong> и дроп.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
