import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CalendarEvent, EventType, Layer, Visibility } from '@/lib/types/calendar';
import { LAYERS } from '../constants';
import { ParticipantPicker } from './ParticipantPicker';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import { Video, Phone } from 'lucide-react';

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  draft: Partial<CalendarEvent>;
  setDraft: (draft: Partial<CalendarEvent>) => void;
  onSave: () => void;
  onDelete?: () => void;
  currentRole: string;
  onAccept?: () => void;
  onReject?: () => void;
  isPendingInvitee?: boolean;
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'event', label: 'Событие' },
  { value: 'task', label: 'Задача' },
  { value: 'call', label: 'Звонок' },
  { value: 'livestream', label: 'Видео / эфир' },
  { value: 'reminder', label: 'Напоминание' },
  { value: 'appointment', label: 'Встреча' },
  { value: 'delivery', label: 'Доставка' },
  { value: 'podcast', label: 'Подкаст' },
];

function CallActionBlock({ draft }: { draft: Partial<CalendarEvent> }) {
  const { user } = useAuth();
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 5000);
    return () => window.clearInterval(id);
  }, []);
  if (draft.type !== 'call' && draft.type !== 'livestream') return null;
  const url = draft.callUrl || draft.streamUrl;
  if (!url) return null;
  const start = draft.startAt ? new Date(draft.startAt) : null;
  const end = draft.endAt ? new Date(draft.endAt) : null;
  const now = new Date();
  const isAuthor = Boolean(draft.ownerId && user?.uid && draft.ownerId === user.uid);
  const started = start ? now >= start : false;
  const finished = end ? now > end : false;
  if (finished) {
    return <p className="text-xs text-muted-foreground">Звонок завершён по расписанию.</p>;
  }
  const label = started
    ? isAuthor
      ? 'Комната (ведущий)'
      : 'Подключиться'
    : isAuthor
      ? 'Начать звонок'
      : 'Ожидание начала';
  const disabled = !started && !isAuthor;
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 flex flex-wrap items-center gap-2">
      {draft.type === 'call' ? <Phone className="h-4 w-4 text-slate-500" /> : <Video className="h-4 w-4 text-slate-500" />}
      <span className="text-xs font-medium text-slate-700">Демо-комната</span>
      {disabled ? (
        <Button size="sm" type="button" disabled>
          {label}
        </Button>
      ) : (
        <Button size="sm" type="button" asChild>
          <a href={url} target="_blank" rel="noreferrer">
            {label}
          </a>
        </Button>
      )}
    </div>
  );
}

export function EventDialog({
  isOpen,
  onOpenChange,
  mode,
  draft,
  setDraft,
  onSave,
  onDelete,
  currentRole: _currentRole,
  onAccept,
  onReject,
  isPendingInvitee = false,
}: EventDialogProps) {
  const { user } = useAuth();
  const participants = draft.participants ?? [];
  const readOnly = isPendingInvitee;
  const isCallish = draft.type === 'call' || draft.type === 'livestream';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Новое событие' : 'Событие'}</DialogTitle>
          <DialogDescription>Дата, участники и напоминание.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={draft.title ?? ''}
              onChange={(e) => !readOnly && setDraft({ ...draft, title: e.target.value })}
              placeholder="Название"
              readOnly={readOnly}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={draft.description ?? ''}
              onChange={(e) => !readOnly && setDraft({ ...draft, description: e.target.value })}
              placeholder="Описание"
              readOnly={readOnly}
            />
          </div>
          {(draft.linkedPinId || draft.sketchPageUrl) && (
            <div className="rounded-md border border-indigo-100 bg-indigo-50/60 p-2 text-xs text-indigo-950">
              {draft.linkedPinId ? (
                <p className="font-mono text-[11px]">
                  Метка скетча: <span className="text-indigo-800">{draft.linkedPinId.slice(0, 12)}…</span>
                </p>
              ) : null}
              {draft.sketchPageUrl ? (
                <p className="mt-1">
                  <Link
                    href={draft.sketchPageUrl}
                    className="font-medium text-indigo-700 underline underline-offset-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Открыть страницу со скетчем
                  </Link>
                </p>
              ) : null}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="start">Начало</Label>
              <Input
                id="start"
                type="datetime-local"
                value={draft.startAt ?? ''}
                onChange={(e) => !readOnly && setDraft({ ...draft, startAt: e.target.value })}
                readOnly={readOnly}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end">Конец</Label>
              <Input
                id="end"
                type="datetime-local"
                value={draft.endAt ?? ''}
                onChange={(e) => !readOnly && setDraft({ ...draft, endAt: e.target.value })}
                readOnly={readOnly}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Тип</Label>
              <Select
                value={draft.type ?? 'event'}
                onValueChange={(v: EventType) => {
                  const next: Partial<CalendarEvent> = { ...draft, type: v };
                  if (v === 'call' || v === 'livestream') {
                    next.callUrl = draft.callUrl || 'https://meet.example.com/demo-room';
                    next.streamUrl = draft.streamUrl || next.callUrl;
                  }
                  setDraft(next);
                }}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Тип" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Напоминание</Label>
              <Select
                value={String(draft.reminderMinutesBefore ?? 0)}
                onValueChange={(v) =>
                  setDraft({
                    ...draft,
                    reminderMinutesBefore: v === '0' ? undefined : Number(v),
                  })
                }
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Нет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Без напоминания</SelectItem>
                  <SelectItem value="5">За 5 минут</SelectItem>
                  <SelectItem value="15">За 15 минут</SelectItem>
                  <SelectItem value="30">За 30 минут</SelectItem>
                  <SelectItem value="60">За 1 час</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isCallish && (
            <div className="grid gap-2">
              <Label htmlFor="callUrl">Ссылка на звонок</Label>
              <Input
                id="callUrl"
                value={draft.callUrl ?? ''}
                onChange={(e) =>
                  !readOnly &&
                  setDraft({ ...draft, callUrl: e.target.value, streamUrl: e.target.value })
                }
                placeholder="https://…"
                readOnly={readOnly}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="layer">Слой</Label>
              <Select
                value={draft.layer}
                onValueChange={(v: Layer) => setDraft({ ...draft, layer: v })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Слой" />
                </SelectTrigger>
                <SelectContent>
                  {LAYERS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visibility">Видимость</Label>
              <Select
                value={draft.visibility}
                onValueChange={(v: Visibility) => setDraft({ ...draft, visibility: v })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Видимость" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Личное</SelectItem>
                  <SelectItem value="internal">Внутреннее</SelectItem>
                  <SelectItem value="partial">Частичное</SelectItem>
                  <SelectItem value="public">Публичное</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Участники</Label>
            <ParticipantPicker
              participants={participants}
              onChange={(p) => !readOnly && setDraft({ ...draft, participants: p })}
              currentUserId={user?.uid ?? ''}
              currentOrgId={user?.activeOrganizationId ?? undefined}
              disabled={readOnly}
            />
          </div>

          <CallActionBlock draft={draft} />
        </div>
        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row sm:justify-between sm:items-center">
          {isPendingInvitee && onAccept && onReject ? (
            <div className="flex gap-2 w-full sm:justify-end">
              <Button variant="outline" onClick={onReject}>
                Отклонить
              </Button>
              <Button onClick={onAccept}>Принять</Button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {mode === 'edit' && onDelete && (
                  <Button variant="destructive" onClick={onDelete}>
                    Удалить
                  </Button>
                )}
                {mode === 'edit' && !readOnly && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        status: draft.status === 'cancelled' ? 'scheduled' : 'cancelled',
                      })
                    }
                  >
                    {draft.status === 'cancelled' ? 'Восстановить' : 'Отменить'}
                  </Button>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Закрыть
                </Button>
                <Button onClick={onSave} disabled={readOnly}>
                  Сохранить
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
