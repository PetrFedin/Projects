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
import { Calendar, ArrowLeft } from 'lucide-react';

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
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bTradeShows}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Calendar className="h-6 w-6" /> Запись на встречи</h1>
      </div>

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
              <p className="text-sm text-slate-500">{event.startDate} – {event.endDate} · {event.city}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Дата и время</Label>
                <Input type="datetime-local" value={slot} onChange={(e) => setSlot(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Заметка</Label>
                <Input placeholder="Тема встречи, контакт" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={handleBook} disabled={!slot}>Записаться</Button>
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
                    <li key={a.id} className="flex justify-between items-center p-2 rounded border">
                      <span>{a.slotStart.slice(0, 16)}</span>
                      <span className="text-sm text-slate-500">{a.status}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Button variant="outline" className="mt-6" asChild><Link href={ROUTES.shop.b2bTradeShows}>← К выставкам</Link></Button>
    </div>
  );
}
