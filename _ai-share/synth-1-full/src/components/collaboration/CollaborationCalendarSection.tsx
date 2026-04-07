'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X, Calendar, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  getCalendarEvents,
  saveCalendarEvent,
  deleteCalendarEvent,
  respondToInvitation,
} from '@/lib/collaboration/calendar-store';
import type { CalendarEvent } from '@/lib/types/calendar';
import { EventDialog } from '@/components/user/calendar/_components/EventDialog';

export function CollaborationCalendarSection({ className }: { className?: string }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [draft, setDraft] = useState<Partial<CalendarEvent>>({
    title: '',
    layer: 'events',
    type: 'event',
    visibility: 'internal',
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    participants: [],
  });

  const userId = user?.uid ?? 'guest';
  const currentRole = (user?.roles?.[0] as string) || (user?.activeOrganizationId?.includes('brand') ? 'brand' : 'client');

  const load = useCallback(() => {
    setEvents(getCalendarEvents(userId));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = () => {
    if (!draft.title?.trim()) return;
    const ev: CalendarEvent = {
      ...draft,
      id: editingEvent?.id ?? `ev_${Date.now()}`,
      ownerId: userId,
      ownerRole: currentRole as any,
      ownerName: user?.displayName ?? 'Пользователь',
      calendarId: 'collab',
      title: draft.title!,
      layer: draft.layer ?? 'events',
      visibility: draft.visibility ?? 'internal',
      type: (draft.type as any) ?? 'event',
      startAt: draft.startAt!,
      endAt: draft.endAt!,
      participants: draft.participants ?? [],
    };
    saveCalendarEvent(userId, ev);
    load();
    setIsCreateOpen(false);
    setEditingEvent(null);
    setDraft({ title: '', layer: 'events', type: 'event', visibility: 'internal', startAt: new Date().toISOString().slice(0, 16), endAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16), participants: [] });
  };

  const handleDelete = () => {
    if (editingEvent) {
      deleteCalendarEvent(userId, editingEvent.id);
      load();
      setEditingEvent(null);
      setIsCreateOpen(false);
    }
  };

  const handleAcceptReject = (eventId: string, status: 'accepted' | 'rejected') => {
    respondToInvitation(eventId, userId, status);
    load();
    setEditingEvent(null);
  };

  const myParticipant = (ev: CalendarEvent) =>
    ev.participants?.find((p) => p.uid === userId);
  const isOwner = (ev: CalendarEvent) => ev.ownerId === userId;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Users className="h-4 w-4" />
              События с участниками
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Создавайте события, приглашайте участников. Они смогут принять или отклонить приглашение.
            </p>
          </div>
          <Button size="sm" onClick={() => { setDraft({ title: '', layer: 'events', type: 'event', visibility: 'internal', startAt: new Date().toISOString().slice(0, 16), endAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16), participants: [] }); setIsCreateOpen(true); setEditingEvent(null); }}>
            <Plus className="h-4 w-4 mr-1" />
            Создать
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            Нет событий. Создайте событие и пригласите участников из команды.
          </p>
        ) : (
          <div className="space-y-2">
            {events
              .sort((a, b) => a.startAt.localeCompare(b.startAt))
              .map((ev) => {
                const participant = myParticipant(ev);
                const owner = isOwner(ev);
                return (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setEditingEvent(ev);
                      setDraft(ev);
                      setIsCreateOpen(false);
                    }}
                  >
                    <div className="w-2 h-10 rounded bg-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ev.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {format(parseISO(ev.startAt), 'd MMM, HH:mm', { locale: ru })} · {ev.ownerName}
                        {ev.participants && ev.participants.length > 0 && (
                          <> · {ev.participants.length} участн.</>
                        )}
                        {ev.linkedPinId ? <> · скетч-метка</> : null}
                      </p>
                    </div>
                    {participant && participant.status === 'pending' && (
                      <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="default" className="h-7" onClick={() => handleAcceptReject(ev.id, 'accepted')}>
                          <Check className="h-3 w-3 mr-1" /> Принять
                        </Button>
                        <Button size="sm" variant="outline" className="h-7" onClick={() => handleAcceptReject(ev.id, 'rejected')}>
                          <X className="h-3 w-3 mr-1" /> Отклонить
                        </Button>
                      </div>
                    )}
                    {participant?.status === 'accepted' && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">Принято</Badge>
                    )}
                    {participant?.status === 'rejected' && (
                      <Badge variant="outline" className="text-[10px] shrink-0 text-slate-400">Отклонено</Badge>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>

      <EventDialog
        isOpen={isCreateOpen || !!editingEvent}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingEvent(null);
          }
        }}
        mode={editingEvent ? 'edit' : 'create'}
        draft={editingEvent ?? draft}
        setDraft={setDraft}
        onSave={handleSave}
        onDelete={editingEvent && isOwner(editingEvent) ? handleDelete : undefined}
        currentRole={currentRole}
        isPendingInvitee={!!editingEvent && !!myParticipant(editingEvent) && myParticipant(editingEvent)!.status === 'pending'}
        onAccept={editingEvent && myParticipant(editingEvent)?.status === 'pending' ? () => handleAcceptReject(editingEvent.id, 'accepted') : undefined}
        onReject={editingEvent && myParticipant(editingEvent)?.status === 'pending' ? () => handleAcceptReject(editingEvent.id, 'rejected') : undefined}
      />
    </Card>
  );
}
