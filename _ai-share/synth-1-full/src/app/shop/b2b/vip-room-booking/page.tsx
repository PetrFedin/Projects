'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';

/** Бронирование приватного демо-шоурума по слотам для персональной презентации коллекции. */
const MOCK_SLOTS = [
  {
    id: '1',
    date: '2025-03-14',
    time: '10:00–12:00',
    room: 'Шоурум Syntha, Москва',
    status: 'free',
  },
  {
    id: '2',
    date: '2025-03-14',
    time: '14:00–16:00',
    room: 'Шоурум Syntha, Москва',
    status: 'free',
  },
<<<<<<< HEAD
  { id: '3', date: '2025-03-15', time: '11:00–13:00', room: 'VIP Room A.P.C.', status: 'free' },
=======
  {
    id: '3',
    date: '2025-03-15',
    time: '11:00–13:00',
    room: 'VIP Room · Nordic Wool',
    status: 'free',
  },
>>>>>>> recover/cabinet-wip-from-stash
];

export default function VipRoomBookingPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <CalendarCheck className="h-6 w-6" /> VIP Шоурум
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            TSUM: бронирование приватного шоурума по слотам. Подтверждение и напоминание.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-2xl space-y-6">
      <ShopB2bContentHeader lead="Бронирование приватного шоурума по слотам: подтверждение и напоминание." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Слоты</CardTitle>
          <CardDescription>Выберите слот для персональной презентации коллекции</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_SLOTS.map((slot) => (
            <div
              key={slot.id}
              onClick={() => setSelected(slot.id)}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                selected === slot.id
                  ? 'border-amber-500 bg-amber-50'
<<<<<<< HEAD
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <MapPin className="h-5 w-5 text-slate-600" />
=======
                  : 'border-border-default hover:bg-bg-surface2'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-lg">
                  <MapPin className="text-text-secondary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
                <div>
                  <p className="font-medium">
                    {slot.date} · {slot.time}
                  </p>
<<<<<<< HEAD
                  <p className="text-sm text-slate-500">{slot.room}</p>
=======
                  <p className="text-text-secondary text-sm">{slot.room}</p>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              </div>
              <Badge variant="secondary">Свободно</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {selected && (
        <div className="mb-6 flex gap-2">
          <Button>Забронировать</Button>
          <Button variant="outline" onClick={() => setSelected(null)}>
            Отмена
          </Button>
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bVideoConsultation}>Видео-консультация</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
<<<<<<< HEAD
          <Link href={ROUTES.shop.b2b}>Шоурум</Link>
=======
          <Link href={ROUTES.shop.b2bShowroom}>Шоурум</Link>
>>>>>>> recover/cabinet-wip-from-stash
        </Button>
      </div>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Видео-консультация, выставки, заказы"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
