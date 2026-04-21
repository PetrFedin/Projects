'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package } from 'lucide-react';
import Link from 'next/link';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { ROUTES } from '@/lib/routes';

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
    <CabinetPageContent maxWidth="4xl" className="space-y-6">
      <ShopB2bContentHeader lead="Предзаказ коллекций к дате дропа: выберите дроп и оформите заказ в режиме Pre-order в матрице." />

      <Card className="border-accent-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-accent-primary h-5 w-5" />
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
              className="border-border-subtle hover:border-accent-primary/30 flex items-center justify-between rounded-xl border p-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-accent-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Package className="text-accent-primary h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{drop.name}</p>
                  <p className="text-text-secondary text-sm">{drop.description}</p>
                  <p className="text-text-muted mt-1 text-xs">
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
                    <Link href={ROUTES.shop.b2bMatrix}>В матрицу заказа</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
          <p className="text-text-muted pt-2 text-xs">
            В{' '}
            <Link href={ROUTES.shop.b2bMatrix} className="text-accent-primary underline">
              матрице заказа
            </Link>{' '}
            выберите режим <strong>Pre-order</strong> и дроп.
          </p>
        </CardContent>
      </Card>
    </CabinetPageContent>
  );
}
