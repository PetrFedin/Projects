'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  W2_TZ_ATTR_NAME_OVERRIDE,
  w2TzAttributeDisplayName,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-w2-tz-labels';
import { getAttributeById } from '@/lib/production/attribute-catalog';
import type { Workshop2TzAttrComment } from '@/lib/production/workshop2-attr-comments-storage';
import { cn } from '@/lib/utils';

export type Workshop2AttrComment = Workshop2TzAttrComment;

export function Workshop2AttrCommentsDialog({
  openAttrId,
  onOpenChange,
  commentsById,
  draft,
  draftSeverity,
  draftAssignee,
  draftDueAt,
  draftVisibility,
  onlyOpen,
  onDraftChange,
  onDraftSeverityChange,
  onDraftAssigneeChange,
  onDraftDueAtChange,
  onDraftVisibilityChange,
  onOnlyOpenChange,
  onToggleCommentStatus,
  onSend,
}: {
  openAttrId: string | null;
  onOpenChange: (open: boolean) => void;
  commentsById: Record<string, Workshop2AttrComment[] | undefined>;
  draft: string;
  draftSeverity: 'normal' | 'critical';
  draftAssignee: string;
  draftDueAt: string;
  draftVisibility: 'internal' | 'factory';
  onlyOpen: boolean;
  onDraftChange: (v: string) => void;
  onDraftSeverityChange: (v: 'normal' | 'critical') => void;
  onDraftAssigneeChange: (v: string) => void;
  onDraftDueAtChange: (v: string) => void;
  onDraftVisibilityChange: (v: 'internal' | 'factory') => void;
  onOnlyOpenChange: (v: boolean) => void;
  onToggleCommentStatus: (commentId: string) => void;
  onSend: () => void;
}) {
  const attrLabel =
    openAttrId == null
      ? ''
      : (W2_TZ_ATTR_NAME_OVERRIDE[openAttrId] ??
        (() => {
          const a = getAttributeById(openAttrId);
          return a ? w2TzAttributeDisplayName(a) : openAttrId;
        })());
  const thread = openAttrId ? commentsById[openAttrId] : undefined;
  const visibleThread = onlyOpen
    ? (thread ?? []).filter((comment) => (comment.status ?? 'open') === 'open')
    : (thread ?? []);
  return (
    <Dialog open={Boolean(openAttrId)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,640px)] w-[min(96vw,620px)] max-w-none overflow-hidden p-0 sm:rounded-xl">
        <DialogHeader className="border-border-subtle border-b px-4 py-3 sm:px-5">
          <DialogTitle>Комментарии по атрибуту{openAttrId ? ` «${attrLabel}»` : ''}</DialogTitle>
          <DialogDescription>Комментарии, статусы и владельцы по атрибуту.</DialogDescription>
        </DialogHeader>
        <div className="flex h-[min(72vh,520px)] flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-[11px]">
            <span className="text-text-secondary">Показывать только открытые</span>
            <Checkbox checked={onlyOpen} onCheckedChange={(v) => onOnlyOpenChange(v === true)} />
          </div>
          <div className="border-border-subtle bg-bg-surface2/40 flex-1 space-y-2 overflow-y-auto rounded-lg border p-3">
            {visibleThread.length ? (
              visibleThread.map((comment) => (
                <div key={comment.id} className="space-y-1 rounded-md border bg-white px-3 py-2">
                  <div className="text-text-muted flex items-center justify-between text-[10px]">
                    <span className="font-semibold">{comment.by || 'Участник'}</span>
                    <span>{new Date(comment.at).toLocaleString('ru-RU')}</span>
                  </div>
                  <p className="text-sm leading-snug">{comment.text}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-semibold',
                        (comment.severity ?? 'normal') === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {(comment.severity ?? 'normal') === 'critical' ? 'Критично' : 'Обычный'}
                    </span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-semibold',
                        (comment.status ?? 'open') === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {(comment.status ?? 'open') === 'resolved' ? 'Resolved' : 'Open'}
                    </span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-semibold',
                        comment.visibility === 'factory'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {comment.visibility === 'factory' ? 'Для фабрики' : 'Внутренний'}
                    </span>
                    {comment.assignee?.trim() ? (
                      <span className="text-text-secondary">Ответственный: {comment.assignee}</span>
                    ) : null}
                    {comment.dueAt ? (
                      <span className="text-text-secondary">Срок: {comment.dueAt}</span>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-1.5 text-[10px]"
                      onClick={() => onToggleCommentStatus(comment.id)}
                    >
                      {(comment.status ?? 'open') === 'resolved' ? 'Вернуть в Open' : 'Resolve'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-xs">Пока нет сообщений по этому атрибуту.</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-4">
              <select
                className="h-8 rounded-md border px-2 text-xs"
                value={draftVisibility}
                onChange={(e) => onDraftVisibilityChange(e.target.value as 'internal' | 'factory')}
              >
                <option value="internal">Внутренний</option>
                <option value="factory">Для фабрики</option>
              </select>
              <select
                className="h-8 rounded-md border px-2 text-xs"
                value={draftSeverity}
                onChange={(e) => onDraftSeverityChange(e.target.value as 'normal' | 'critical')}
              >
                <option value="normal">Обычный</option>
                <option value="critical">Критичный</option>
              </select>
              <Input
                className="h-8 text-xs"
                placeholder="Ответственный"
                value={draftAssignee}
                onChange={(e) => onDraftAssigneeChange(e.target.value)}
              />
              <Input
                type="date"
                className="h-8 text-xs"
                value={draftDueAt}
                onChange={(e) => onDraftDueAtChange(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Textarea
                className="min-h-[68px] flex-1 text-sm"
                placeholder="Напишите комментарий..."
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
              />
              <Button
                type="button"
                className="h-9 shrink-0 self-end text-xs"
                disabled={!draft.trim()}
                onClick={onSend}
              >
                Отправить
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
