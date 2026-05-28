'use client';

import { useState, useRef, useMemo } from 'react';
import { MessageSquare, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LiveProcessComment, LiveProcessTeamMember } from '@/lib/live-process/types';

interface StageChatPanelProps {
  stageId: string;
  comments: LiveProcessComment[];
  team: LiveProcessTeamMember[];
  onAddComment: (
    body: string,
    mentions?: { userId: string; userName: string; match: string }[]
  ) => void;
}

/** Парсинг @упоминаний в тексте */
function parseMentions(
  text: string,
  team: LiveProcessTeamMember[]
): { userId: string; userName: string; match: string }[] {
  const mentions: { userId: string; userName: string; match: string }[] = [];
  team.forEach((m) => {
    if (text.includes(`@${m.name}`)) {
      mentions.push({ userId: m.id, userName: m.name, match: `@${m.name}` });
    }
  });
  return mentions;
}

/** Рендер тела с подсветкой @упоминаний */
function CommentBody({ body, team }: { body: string; team: LiveProcessTeamMember[] }) {
  const sorted = [...team].sort((a, b) => b.name.length - a.name.length);
  let remaining = body;
  const result: (string | JSX.Element)[] = [];

  sorted.forEach((m) => {
    const match = `@${m.name}`;
    const idx = remaining.indexOf(match);
    if (idx !== -1) {
      result.push(remaining.slice(0, idx));
      result.push(
        <span
          key={m.id}
          className="text-accent-primary bg-accent-primary/10 rounded px-0.5 font-medium"
        >
          @{m.name}
        </span>
      );
      remaining = remaining.slice(idx + match.length);
    }
  });
  if (remaining) result.push(remaining);

  return <>{result.length ? result : body}</>;
}

export function StageChatPanel({ stageId, comments, team, onAddComment }: StageChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showMentionSuggest, setShowMentionSuggest] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    const mentions = parseMentions(trimmed, team);
    onAddComment(trimmed, mentions.length ? mentions : undefined);
    setNewMessage('');
  };

  const insertMention = (name: string) => {
    setNewMessage((prev) => prev + `@${name} `);
    setShowMentionSuggest(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <div className="text-text-secondary flex items-center gap-1 text-[10px] font-bold">
        <MessageSquare className="h-3 w-3" />
        Чат этапа
        <span className="text-text-muted font-normal">(@упоминания отправят уведомление)</span>
      </div>
      <ul className="max-h-32 space-y-1.5 overflow-y-auto">
        {comments.map((c) => (
          <li key={c.id} className="border-border-subtle rounded border bg-white p-2 text-[11px]">
            <span className="text-text-primary font-medium">{c.authorName}:</span>{' '}
            <CommentBody body={c.body} team={team} />
            {c.mentions?.length ? (
              <span className="text-accent-primary mt-0.5 block text-[9px]">
                Упомянуты: {c.mentions.map((m) => m.userName).join(', ')}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="relative">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setShowMentionSuggest(!showMentionSuggest)}
            title="Вставить @упоминание"
          >
            <AtSign className="h-3.5 w-3.5" />
          </Button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Сообщение... (используйте @ для упоминания)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="border-border-default flex-1 rounded border px-2 py-1.5 text-xs"
          />
          <Button size="sm" className="h-7 text-[10px]" onClick={handleSubmit}>
            Отправить
          </Button>
        </div>
        {showMentionSuggest && (
          <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded border bg-white py-1 shadow-lg">
            {team.map((m) => (
              <button
                key={m.id}
                type="button"
                className="hover:bg-bg-surface2 w-full px-2 py-1 text-left text-xs"
                onClick={() => insertMention(m.name)}
              >
                @{m.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
