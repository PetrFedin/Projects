'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** TSUM / Farfetch: бронирование видеозвонков со стилистом или мерчандайзером (Zoom/Teams). */
const MOCK_SLOTS = [
  { id: '1', date: '2025-03-14', time: '10:00', expert: 'Анна К., стилист Syntha', type: 'Zoom' },
  { id: '2', date: '2025-03-14', time: '14:00', expert: 'Елена М., мерчандайзер', type: 'Teams' },
  { id: '3', date: '2025-03-15', time: '11:00', expert: 'Анна К., стилист Syntha', type: 'Zoom' },
];

export default function VideoConsultationPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Video className="h-6 w-6" /> Видео-консультация</h1>
          <p className="text-slate-500 text-sm mt-0.5">TSUM / Farfetch: слоты со стилистом или мерчандайзером. Zoom/Teams, напоминание перед встречей.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Доступные слоты</CardTitle>
          <CardDescription>Выберите время — на почту придёт ссылка на звонок и напоминание</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_SLOTS.map((slot) => (
            <div
              key={slot.id}
              onClick={() => setSelected(slot.id)}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                selected === slot.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium">{slot.date} · {slot.time}</p>
                  <p className="text-sm text-slate-500">{slot.expert}</p>
                </div>
              </div>
              <Badge variant="outline">{slot.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {selected && (
        <div className="mb-6 flex gap-2">
          <Button>Забронировать</Button>
          <Button variant="outline" onClick={() => setSelected(null)}>Отмена</Button>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bVipRoomBooking}>VIP Шоурум</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bTradeShows}>Выставки</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="VIP шоурум, выставки, заказы" className="mt-6" />
    </div>
  );
}
