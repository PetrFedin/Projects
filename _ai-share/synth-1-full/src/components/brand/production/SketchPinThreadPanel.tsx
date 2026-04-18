'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { saveCalendarEvent } from '@/lib/collaboration/calendar-store';
import {
  appendSketchPinComment,
  parseSketchPinAtMentions,
} from '@/lib/production/sketch-pin-thread-utils';
import type { Workshop2SketchPinThreadComment } from '@/lib/production/workshop2-dossier-phase1.types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/lib/routes';
import type { CalendarEvent } from '@/lib/types/calendar';
import type { UserRole } from '@/lib/types';
import { Calendar, ExternalLink, MessageSquare, StickyNote } from 'lucide-react';

type Props = {
  annotationId: string;
  /** Порядковый номер кружка на доске (для ОТК / ссылок в одном потоке с меткой). */
  pinNumber?: number;
  mesDefectCode?: string;
  linkedQcZoneId?: string;
  linkedBomLineRef?: string;
  comments: Workshop2SketchPinThreadComment[] | undefined;
  actorLabel: string;
  sku?: string;
  pathLabel: string;
  readOnly?: boolean;
  onReplaceComments: (next: Workshop2SketchPinThreadComment[]) => void;
  /** Тред закрыт (решён). */
  threadResolved?: boolean;
  onPatchThreadMeta?: (patch: {
    sketchPinThreadResolved?: boolean;
    sketchPinThreadLastReadAt?: string;
  }) => void;
  /** URL страницы досье — в календарь и для коллег. */
  sketchPageUrl?: string;
  /** Прочитано до (ISO) — сообщения позже считаются новыми. */
  threadLastReadAt?: string;
};

function newEventId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `ev-${Date.now()}`;
}

export function SketchPinThreadPanel({
  annotationId,
  pinNumber,
  mesDefectCode,
  linkedQcZoneId,
  linkedBomLineRef,
  comments,
  actorLabel,
  sku,
  pathLabel,
  readOnly,
  onReplaceComments,
  threadResolved,
  onPatchThreadMeta,
  sketchPageUrl,
  threadLastReadAt,
}: Props) {
  const { user } = useAuth();
  const [draft, setDraft] = useState('');
  const list = comments ?? [];

  const unreadCount = useMemo(() => {
    const lr = threadLastReadAt?.trim();
    if (list.length === 0) return 0;
    if (!lr) return list.length;
    return list.filter((c) => c.at > lr).length;
  }, [list, threadLastReadAt]);

  const mentionPending = useMemo(
    () =>
      list.filter((c) => {
        if (!c.mentionNotifyPending) return false;
        const lr = threadLastReadAt?.trim();
        if (!lr) return true;
        return c.at > lr;
      }).length,
    [list, threadLastReadAt]
  );

  const submit = useCallback(() => {
    if (readOnly) return;
    const t = draft.trim();
    if (!t) return;
    const next = appendSketchPinComment(list, { by: actorLabel, body: t });
    onReplaceComments(next);
    setDraft('');
  }, [actorLabel, draft, list, onReplaceComments, readOnly]);

  const pushToCalendar = useCallback(
    (c: Workshop2SketchPinThreadComment) => {
      const uid = user?.uid ?? 'guest-local';
      const ownerRole = (user?.roles?.[0] as UserRole | undefined) ?? 'brand';
      const ownerName = user?.displayName?.trim() || actorLabel || 'Участник';
      const eventId = newEventId();
      const start = new Date();
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const pageUrl =
        sketchPageUrl?.trim() ||
        (typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '');
      const event: CalendarEvent = {
        id: eventId,
        ownerId: uid,
        ownerRole,
        ownerName,
        calendarId: 'production',
        title: `Скетч · ${sku?.trim() || 'SKU'} · метка`,
        description: `${pathLabel}\nannotationId=${annotationId}\n\n${c.body}`,
        layer: 'production',
        visibility: 'internal',
        type: 'task',
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        participants: [],
        tags: ['sketch-pin', annotationId.slice(0, 12)],
        entityId: annotationId,
        entityName: sku?.trim() || pathLabel,
        linkedPinId: annotationId,
        sketchPageUrl: pageUrl || undefined,
      };
      saveCalendarEvent(uid, event);
      if (!readOnly) {
        onReplaceComments(
          list.map((x) =>
            x.commentId === c.commentId ? { ...x, linkedCalendarEventId: eventId } : x
          )
        );
      }
    },
    [
      actorLabel,
      annotationId,
      list,
      onReplaceComments,
      pathLabel,
      readOnly,
      sku,
      sketchPageUrl,
      user,
    ]
  );

  const messagesHref = `${ROUTES.brand.messages}?context=sketch-pin&pin=${encodeURIComponent(annotationId)}`;
  const brandNotesHref = `${ROUTES.brand.productionWorkshop2}#w2-attr-brandNotes`;

  return (
    <div className="border-accent-primary/20 bg-accent-primary/10 space-y-2 rounded-md border p-2 text-[10px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-accent-primary font-semibold uppercase tracking-wide">Тред у метки</p>
          {threadResolved ? (
<<<<<<< HEAD
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[8px] font-medium text-slate-700">
=======
            <span className="bg-border-subtle text-text-primary rounded px-1.5 py-0.5 text-[8px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              Решён
            </span>
          ) : (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-medium text-emerald-900">
              Открыт
            </span>
          )}
          {unreadCount > 0 ? (
            <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[8px] font-bold text-amber-950">
              {unreadCount} нов.
            </span>
          ) : null}
          {mentionPending > 0 ? (
            <span
              className="bg-accent-primary/15 text-text-primary rounded px-1.5 py-0.5 text-[8px]"
              title="Заглушка под push: есть @упоминания после последнего «прочитано»"
            >
              @ {mentionPending}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-1">
          {!readOnly && onPatchThreadMeta ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[9px]"
              onClick={() => onPatchThreadMeta({ sketchPinThreadResolved: !threadResolved })}
            >
              {threadResolved ? 'Снова открыть' : 'Пометить решённым'}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-[9px]"
            asChild
          >
            <Link href={messagesHref} target="_blank" rel="noreferrer">
              <MessageSquare className="h-3 w-3" aria-hidden />
              Чаты
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-[9px]"
            asChild
          >
            <Link href={ROUTES.brand.calendar} target="_blank" rel="noreferrer">
              <Calendar className="h-3 w-3" aria-hidden />
              Календарь
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-[9px]"
            asChild
          >
            <Link href={brandNotesHref} target="_blank" rel="noreferrer">
              <StickyNote className="h-3 w-3" aria-hidden />
              Заметки бренда
            </Link>
          </Button>
        </div>
      </div>
      <p className="border-accent-primary/30 text-accent-primary rounded border bg-white/50 px-2 py-1 font-mono text-[8px] leading-relaxed">
        <span className="text-accent-primary font-sans font-semibold">Привязка к метке: </span>
        {pinNumber != null ? <>№{pinNumber} на доске · </> : null}
        <span title={annotationId}>id {annotationId.slice(0, 8)}…</span>
        {mesDefectCode?.trim() ? <> · MES {mesDefectCode.trim()}</> : null}
        {linkedQcZoneId?.trim() ? <> · QC-зона {linkedQcZoneId.trim()}</> : null}
        {linkedBomLineRef?.trim() ? <> · BOM-ref {linkedBomLineRef.trim()}</> : null}
      </p>
      <p className="text-accent-primary/80 text-[9px] leading-snug">
        Упоминания: <code className="rounded bg-white/80 px-0.5">@designer</code>{' '}
        <code className="rounded bg-white/80 px-0.5">@tech</code>{' '}
        <code className="rounded bg-white/80 px-0.5">@manager</code> — для фильтра в чате; общие
        заметки по артикулу — поле «Заметки бренда» или ссылка выше.
      </p>
      {!readOnly && onPatchThreadMeta ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-accent-primary h-6 px-2 text-[8px]"
          onClick={() => {
            const now = new Date().toISOString();
            const cleared = list.map((x) => ({ ...x, mentionNotifyPending: undefined }));
            onReplaceComments(cleared);
            onPatchThreadMeta({ sketchPinThreadLastReadAt: now });
          }}
        >
          Прочитано · сбросить счётчик @
        </Button>
      ) : null}
      <ul className="max-h-36 space-y-2 overflow-y-auto">
        {list.length === 0 ? (
          <li className="text-text-secondary text-[9px]">Пока нет сообщений.</li>
        ) : (
          list.map((c) => {
            const mentions = c.mentions?.length ? c.mentions : parseSketchPinAtMentions(c.body);
            return (
              <li
                key={c.commentId}
<<<<<<< HEAD
                className="rounded border border-white/60 bg-white/70 p-1.5 text-[9px] text-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-[8px] text-slate-500">
=======
                className="text-text-primary rounded border border-white/60 bg-white/70 p-1.5 text-[9px]"
              >
                <div className="text-text-secondary flex flex-wrap items-center justify-between gap-1 font-mono text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                  <span>
                    {c.by} ·{' '}
                    {(() => {
                      try {
                        return new Date(c.at).toLocaleString('ru-RU');
                      } catch {
                        return c.at;
                      }
                    })()}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.linkedCalendarEventId ? (
                      <Link
                        href={ROUTES.brand.calendar}
                        className="text-accent-primary inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-2.5 w-2.5" aria-hidden />в календаре
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-accent-primary h-6 px-1 text-[8px]"
                        disabled={readOnly}
                        onClick={() => pushToCalendar(c)}
                      >
                        В календарь
                      </Button>
                    )}
                  </div>
                </div>
                <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
                {mentions.length > 0 ? (
                  <p className="text-accent-primary mt-0.5 text-[8px]">@{mentions.join(' @')}</p>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
      {!readOnly ? (
        <div className="border-accent-primary/20 space-y-1 border-t pt-2">
          <Textarea
            className="min-h-[52px] text-[11px]"
            placeholder="Ответ по метке… @designer посмотрите фото"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button
            type="button"
            size="sm"
            className="h-7 text-[10px]"
            onClick={submit}
            disabled={!draft.trim()}
          >
            Добавить в тред
          </Button>
        </div>
      ) : null}
    </div>
  );
}
