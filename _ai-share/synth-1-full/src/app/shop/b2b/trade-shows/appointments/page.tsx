'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTradeShowById, getUpcomingEvents } from '@/lib/b2b/trade-show-calendar';
import { getAppointments, createAppointment } from '@/lib/b2b/trade-show-appointments';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

export default function TradeShowAppointmentsPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event');
  const event = eventId ? getTradeShowById(eventId) : null;
  const events = getUpcomingEvents();
  const appointments = getAppointments(eventId ?? undefined);

  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');

  const handleBook = () => {
    if (!event || !slot) return;
    createAppointment({
      tradeShowId: event.id,
      tradeShowName: event.name,
      partnerId: 'current',
      partnerName: 'Текущий байер',
      slotStart: slot,
      slotEnd: slot,
      status: 'pending',
      notes: notes || undefined,
    });
    setSlot('');
    setNotes('');
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2bTradeShows}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
          <Calendar className="h-6 w-6" /> Запись на встречи
        </h1>
      </div>
=======
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader
        backHref={ROUTES.shop.b2bTradeShows}
        lead="Запись на встречи с брендами на выставке."
      />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Выберите выставку</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {events.map((e) => (
            <Button key={e.id} variant={eventId === e.id ? 'default' : 'outline'} size="sm" asChild>
              <Link href={`${ROUTES.shop.b2bTradeShowAppointments}?event=${e.id}`}>{e.name}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      {event && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
<<<<<<< HEAD
              <p className="text-sm text-slate-500">
=======
              <p className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
                {event.startDate} – {event.endDate} · {event.city}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Дата и время</Label>
                <Input
                  type="datetime-local"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Заметка</Label>
                <Input
                  placeholder="Тема встречи, контакт"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleBook} disabled={!slot}>
                Записаться
              </Button>
            </CardContent>
          </Card>

          {appointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Мои записи</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {appointments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between rounded border p-2">
                      <span>{a.slotStart.slice(0, 16)}</span>
                      <span className="text-text-secondary text-sm">{a.status}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Button variant="outline" className="mt-6" asChild>
        <Link href={ROUTES.shop.b2bTradeShows}>← К выставкам</Link>
      </Button>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
