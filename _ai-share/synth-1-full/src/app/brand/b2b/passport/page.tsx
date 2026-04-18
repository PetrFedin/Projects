'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/lib/routes';
import {
  loadPassportState,
  savePassportState,
  updateMeetingNotes,
  linkOrderToMeeting,
  getMeetingsByEvent,
  getSlotsByEvent,
  type PassportState,
  type PassportMeeting,
  type PassportEvent,
  type PassportSlot,
} from '@/lib/b2b/joor-passport';
import { Calendar, Users, FileText, ShoppingBag, MapPin } from 'lucide-react';

const MEETING_STATUS_LABELS: Record<PassportMeeting['status'], string> = {
  scheduled: 'Запланирована',
  completed: 'Состоялась',
  no_show: 'Не явка',
  cancelled: 'Отменена',
};

export default function BrandB2BPassportPage() {
  const [state, setState] = useState<PassportState | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [editingNotesMeetingId, setEditingNotesMeetingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const refresh = useCallback(() => setState(loadPassportState()), []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (state?.events?.length && !selectedEventId) setSelectedEventId(state.events[0].id);
  }, [state, selectedEventId]);

  const slots = useMemo(
    () => (state && selectedEventId ? getSlotsByEvent(state, selectedEventId) : []),
    [state, selectedEventId]
  );
  const meetings = useMemo(
    () => (state && selectedEventId ? getMeetingsByEvent(state, selectedEventId) : []),
    [state, selectedEventId]
  );
  const selectedEvent = useMemo(
    () => state?.events.find((e) => e.id === selectedEventId),
    [state, selectedEventId]
  );

  const handleSaveNotes = (meetingId: string) => {
    if (!state) return;
    setState(updateMeetingNotes(state, meetingId, notesDraft));
    setEditingNotesMeetingId(null);
    setNotesDraft('');
  };

  if (!state)
    return <div className="container py-8 text-center text-sm text-slate-500">Загрузка…</div>;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight">
            <Calendar className="h-6 w-6" /> JOOR Passport — шоурум на выставке
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Расписание встреч, заметки по байеру, привязка заказов к слоту/событию.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bPassport}>Сторона байера (Passport)</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" /> События
          </CardTitle>
          <CardDescription className="text-xs">Выберите выставку или шоурум.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {state.events.map((ev) => (
              <Button
                key={ev.id}
                variant={selectedEventId === ev.id ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
                onClick={() => setSelectedEventId(ev.id)}
              >
                {ev.name}
              </Button>
            ))}
          </div>
          {selectedEvent && (
            <p className="mt-2 text-xs text-slate-500">
              {selectedEvent.startDate} – {selectedEvent.endDate} · {selectedEvent.type}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" /> Встречи по слотам
          </CardTitle>
          <CardDescription className="text-xs">
            Заметки по байеру видны только бренду. Заказы, привязанные к слоту, отображаются в
            заказах с eventId/slotId.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {meetings.length === 0 ? (
            <p className="text-sm text-slate-500">Нет встреч по выбранному событию.</p>
          ) : (
            meetings.map((m) => {
              const slot = slots.find((s) => s.id === m.slotId);
              const isEditing = editingNotesMeetingId === m.id;
              return (
                <div key={m.id} className="space-y-2 rounded-xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-slate-500">{slot?.label ?? m.slotId}</span>
                      <p className="font-semibold">{m.buyerCompany}</p>
                      <p className="text-xs text-slate-600">{m.buyerName}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {MEETING_STATUS_LABELS[m.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <FileText className="h-3.5 w-3.5" />
                    Заметки по байеру:
                    {!isEditing ? (
                      <>
                        <span className={m.brandNotes ? 'text-slate-800' : 'italic text-slate-400'}>
                          {m.brandNotes || 'Нет'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            setEditingNotesMeetingId(m.id);
                            setNotesDraft(m.brandNotes);
                          }}
                        >
                          Изменить
                        </Button>
                      </>
                    ) : (
                      <>
                        <Textarea
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          className="min-h-[60px] text-xs"
                          placeholder="Заметки для внутреннего использования…"
                        />
                        <Button
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => handleSaveNotes(m.id)}
                        >
                          Сохранить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            setEditingNotesMeetingId(null);
                            setNotesDraft('');
                          }}
                        >
                          Отмена
                        </Button>
                      </>
                    )}
                  </div>
                  {m.orderIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-xs">
                      <ShoppingBag className="h-3.5 w-3.5 text-slate-500" />
                      Заказы привязаны к слоту:
                      {m.orderIds.map((oid) => (
                        <Link
                          key={oid}
                          href={`${ROUTES.shop.b2bOrders}/${oid}`}
                          className="font-mono text-indigo-600 hover:underline"
                        >
                          {oid}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="py-3 text-xs text-slate-500">
          Привязка заказа к слоту: в карточке заказа (байер или бренд) укажите eventId и
          passportSlotId — заказ появится в блоке «Заказы привязаны к слоту» для соответствующей
          встречи.
        </CardContent>
      </Card>
    </div>
  );
}
