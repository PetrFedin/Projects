import React from 'react';
import { Chat as ChatConversation } from '@/lib/types';
import { ID } from './types';

export function safeDate(value: any): Date {
  if (value instanceof Date) return value;
  const d = new Date(value ?? Date.now());
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function formatDayLabel(d: Date) {
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Сегодня';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Вчера';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export function chatTitleById(chats: ChatConversation[], id: ID) {
  return chats.find((c) => c.id === id)?.title ?? 'чат';
}

export function extractUrls(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

export function highlightText(text: string, q: string): React.ReactNode {
  if (!q.trim()) return text;
  const t = text ?? '';
  const qq = q.trim().toLowerCase();
  const idx = t.toLowerCase().indexOf(qq);
  if (idx < 0) return t;
  const before = t.slice(0, idx);
  const mid = t.slice(idx, idx + q.length);
  const after = t.slice(idx + q.length);
  return (
    <>
      {before}
      <mark className="rounded px-1 bg-yellow-200 text-foreground">{mid}</mark>
      {after}
    </>
  );
}
