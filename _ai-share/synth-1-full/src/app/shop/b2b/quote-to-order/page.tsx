'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

/** NetSuite/BigCommerce: Quote-to-Order — переход от коммерческого предложения к заказу */
const MOCK_QUOTES = [
  {
    id: 'q1',
    number: 'КП-2026-001',
    brand: 'Syntha',
    total: 450000,
    items: 12,
    status: 'sent',
    createdAt: '2026-03-10',
  },
  {
    id: 'q2',
    number: 'КП-2026-002',
    brand: 'Nordic Wool',
    total: 280000,
    items: 8,
    status: 'accepted',
    createdAt: '2026-03-08',
  },
];

export default function QuoteToOrderPage() {
  const [converting, setConverting] = useState<string | null>(null);

  const handleConvert = (id: string) => {
    setConverting(id);
    setTimeout(() => setConverting(null), 1500);
    // В проде: API POST /api/b2b/quote-to-order { quoteId } → создаёт заказ
  };

  return (
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader lead="Конвертация коммерческого предложения в заказ одной кнопкой (интеграции NetSuite / BigCommerce)." />

      <Card>
        <CardHeader>
          <CardTitle>Коммерческие предложения</CardTitle>
          <CardDescription>
            Примите КП и оформите заказ — позиции и цены перенесутся автоматически
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_QUOTES.map((q) => (
            <div
              key={q.id}
              className="border-border-default flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">
                  {q.number} · {q.brand}
                </p>
                <p className="text-text-secondary text-xs">
                  {q.items} позиций · {q.total.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={q.status === 'accepted' ? 'default' : 'secondary'}>
                  {q.status === 'accepted' ? 'Принято' : 'Отправлено'}
                </Badge>
                {q.status === 'accepted' && (
                  <Button size="sm" disabled={!!converting} onClick={() => handleConvert(q.id)}>
                    {converting === q.id ? (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowRight className="mr-1 h-4 w-4" />
                    )}
                    {converting === q.id ? 'Создан заказ' : 'В заказ'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCreateOrder}>Написание заказа</Link>
        </Button>
      </div>
    </RegistryPageShell>
  );
}
