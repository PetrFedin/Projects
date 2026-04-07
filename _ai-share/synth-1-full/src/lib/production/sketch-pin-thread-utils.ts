import type { Workshop2SketchPinThreadComment } from '@/lib/production/workshop2-dossier-phase1.types';

/** Упоминания вида @designer @tech в тексте комментария. */
export function parseSketchPinAtMentions(body: string): string[] {
  const re = /@([\w.-]+)/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const tag = m[1];
    if (tag && !out.includes(tag)) out.push(tag);
  }
  return out;
}

function newCommentId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}`;
}

export function appendSketchPinComment(
  existing: Workshop2SketchPinThreadComment[] | undefined,
  input: {
    by: string;
    body: string;
    parentCommentId?: string;
    linkedCalendarEventId?: string;
  }
): Workshop2SketchPinThreadComment[] {
  const prev = existing ?? [];
  const body = input.body.trim();
  if (!body) return prev;
  const mentions = parseSketchPinAtMentions(body);
  const row: Workshop2SketchPinThreadComment = {
    commentId: newCommentId(),
    at: new Date().toISOString(),
    by: input.by.trim() || '—',
    body,
    parentCommentId: input.parentCommentId,
    mentions: mentions.length ? mentions : undefined,
    linkedCalendarEventId: input.linkedCalendarEventId,
    mentionNotifyPending: mentions.length > 0 ? true : undefined,
  };
  return [...prev, row];
}
