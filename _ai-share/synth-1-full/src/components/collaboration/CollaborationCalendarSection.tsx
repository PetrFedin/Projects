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
  const currentRole =
    (user?.roles?.[0] as string) ||
    (user?.activeOrganizationId?.includes('brand') ? 'brand' : 'client');

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
    setDraft({
      title: '',
      layer: 'events',
      type: 'event',
      visibility: 'internal',
      startAt: new Date().toISOString().slice(0, 16),
      endAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      participants: [],
    });
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

  const myParticipant = (ev: CalendarEvent) => ev.participants?.find((p) => p.uid === userId);
  const isOwner = (ev: CalendarEvent) => ev.ownerId === userId;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Users className="h-4 w-4" />
              События с участниками
            </h2>
<<<<<<< HEAD
            <p className="mt-0.5 text-xs text-slate-500">
=======
            <p className="text-text-secondary mt-0.5 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
              Создавайте события, приглашайте участников. Они смогут принять или отклонить
              приглашение.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setDraft({
                title: '',
                layer: 'events',
                type: 'event',
                visibility: 'internal',
                startAt: new Date().toISOString().slice(0, 16),
                endAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
                participants: [],
              });
              setIsCreateOpen(true);
              setEditingEvent(null);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Создать
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
<<<<<<< HEAD
          <p className="py-6 text-center text-sm text-slate-500">
=======
          <p className="text-text-secondary py-6 text-center text-sm">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 transition-colors hover:bg-slate-50/50"
=======
                    className="hover:bg-bg-surface2/80 flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                    onClick={() => {
                      setEditingEvent(ev);
                      setDraft(ev);
                      setIsCreateOpen(false);
                    }}
                  >
<<<<<<< HEAD
                    <div className="h-10 w-2 shrink-0 rounded bg-indigo-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{ev.title}</p>
                      <p className="text-[10px] text-slate-500">
=======
                    <div className="bg-accent-primary h-10 w-2 shrink-0 rounded" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{ev.title}</p>
                      <p className="text-text-secondary text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        {format(parseISO(ev.startAt), 'd MMM, HH:mm', { locale: ru })} ·{' '}
                        {ev.ownerName}
                        {ev.participants && ev.participants.length > 0 && (
                          <> · {ev.participants.length} участн.</>
                        )}
                        {ev.linkedPinId ? <> · скетч-метка</> : null}
                      </p>
                    </div>
                    {participant && participant.status === 'pending' && (
                      <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7"
                          onClick={() => handleAcceptReject(ev.id, 'accepted')}
                        >
                          <Check className="mr-1 h-3 w-3" /> Принять
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7"
                          onClick={() => handleAcceptReject(ev.id, 'rejected')}
                        >
                          <X className="mr-1 h-3 w-3" /> Отклонить
                        </Button>
                      </div>
                    )}
                    {participant?.status === 'accepted' && (
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        Принято
                      </Badge>
                    )}
                    {participant?.status === 'rejected' && (
<<<<<<< HEAD
                      <Badge variant="outline" className="shrink-0 text-[10px] text-slate-400">
=======
                      <Badge variant="outline" className="text-text-muted shrink-0 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        Отклонено
                      </Badge>
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
        isPendingInvitee={
          !!editingEvent &&
          !!myParticipant(editingEvent) &&
          myParticipant(editingEvent)!.status === 'pending'
        }
        onAccept={
          editingEvent && myParticipant(editingEvent)?.status === 'pending'
            ? () => handleAcceptReject(editingEvent.id, 'accepted')
            : undefined
        }
        onReject={
          editingEvent && myParticipant(editingEvent)?.status === 'pending'
            ? () => handleAcceptReject(editingEvent.id, 'rejected')
            : undefined
        }
      />
    </Card>
  );
}
