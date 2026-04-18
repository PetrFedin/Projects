'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, Clock, Package, Navigation } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/** Карта магазинов (Farfetch для РФ): точки с наличием, часы работы, маршрут. Яндекс.Карты / 2GIS при интеграции. */
const MOCK_STORES = [
  {
    id: '1',
    name: 'Podium, Москва',
    address: 'ул. Тверская, 3',
    city: 'Москва',
    open: '10:00 – 22:00',
    inStock: true,
  },
  {
    id: '2',
    name: 'ЦУМ',
    address: 'ул. Петровка, 2',
    city: 'Москва',
    open: '10:00 – 22:00',
    inStock: true,
  },
  {
    id: '3',
    name: 'Boutique No.7',
    address: 'Невский пр., 88',
    city: 'Санкт-Петербург',
    open: '11:00 – 21:00',
    inStock: false,
  },
];

export default function StoreLocatorPage() {
  const [city, setCity] = useState<string>('all');
  const cities = ['all', ...new Set(MOCK_STORES.map((s) => s.city))];
  const filtered = city === 'all' ? MOCK_STORES : MOCK_STORES.filter((s) => s.city === city);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.home}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <MapPin className="h-6 w-6" /> Карта магазинов
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Наличие в точках в реальном времени. Часы работы и маршрут. Интеграция с
            2GIS/Яндекс.Карты — в планах.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Города</CardTitle>
          <CardDescription>Выберите город или смотрите все точки</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {cities.map((c) => (
              <Button
                key={c}
                variant={city === c ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCity(c)}
              >
                {c === 'all' ? 'Все' : c}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((store) => (
              <div
                key={store.id}
                className="flex items-start justify-between rounded-xl border border-slate-200 p-4 hover:border-slate-300"
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <MapPin className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-slate-500">
                      {store.address}, {store.city}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" /> {store.open}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {store.inStock ? (
                    <Badge variant="default">В наличии</Badge>
                  ) : (
                    <Badge variant="secondary">Нет в наличии</Badge>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <Navigation className="mr-1 h-3 w-3" /> Маршрут
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2b}>B2B Шоурум</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bPartners}>Партнёры</Link>
        </Button>
      </div>
    </div>
  );
}
