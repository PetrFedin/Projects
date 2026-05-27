/**
 * Wave 2 #C4: @mentions parsing + safe highlight segments for contextual chat UI.
 */

export type Workshop2ContextualMentionSegment =
  | { kind: 'text'; value: string }
  | { kind: 'mention'; value: string; handle: string };

const MENTION_RE = /(^|[\s(])@([a-zA-Z0-9._-]{2,32})/g;

/** Извлекает уникальные @handles из текста сообщения. */
export function parseWorkshop2ContextualMentions(message: string): string[] {
  const handles = new Set<string>();
  for (const m of message.matchAll(MENTION_RE)) {
    const handle = m[2]?.trim();
    if (handle) handles.add(handle.toLowerCase());
  }
  return [...handles];
}

/** Разбивает сообщение на сегменты для подсветки @mentions в UI. */
export function splitWorkshop2ContextualMessageForDisplay(
  message: string
): Workshop2ContextualMentionSegment[] {
  const segments: Workshop2ContextualMentionSegment[] = [];
  let lastIndex = 0;

  for (const m of message.matchAll(MENTION_RE)) {
    const full = m[0] ?? '';
    const handle = m[2] ?? '';
    const mentionStart = (m.index ?? 0) + full.indexOf('@');
    if (mentionStart > lastIndex) {
      segments.push({ kind: 'text', value: message.slice(lastIndex, mentionStart) });
    }
    segments.push({ kind: 'mention', value: `@${handle}`, handle });
    lastIndex = mentionStart + handle.length + 1;
  }

  if (lastIndex < message.length) {
    segments.push({ kind: 'text', value: message.slice(lastIndex) });
  }

  return segments.length ? segments : [{ kind: 'text', value: message }];
}
