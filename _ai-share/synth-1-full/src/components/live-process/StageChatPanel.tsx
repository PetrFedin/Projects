'use client';

import { useState, useRef, useMemo } from 'react';
import { MessageSquare, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LiveProcessComment, LiveProcessTeamMember } from '@/lib/live-process/types';

interface StageChatPanelProps {
  stageId: string;
  comments: LiveProcessComment[];
  team: LiveProcessTeamMember[];
  onAddComment: (body: string, mentions?: { userId: string; userName: string; match: string }[]) => void;
}

/** Парсинг @упоминаний в тексте */
function parseMentions(text: string, team: LiveProcessTeamMember[]): { userId: string; userName: string; match: string }[] {
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
        <span key={m.id} className="text-indigo-600 font-medium bg-indigo-50 px-0.5 rounded">
          @{m.name}
        </span>
      );
      remaining = remaining.slice(idx + match.length);
    }
  });
  if (remaining) result.push(remaining);

  return <>{result.length ? result : body}</>;
}

export function StageChatPanel({
  stageId,
  comments,
  team,
  onAddComment,
}: StageChatPanelProps) {
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
      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
        <MessageSquare className="h-3 w-3" />
        Чат этапа
        <span className="text-slate-400 font-normal">(@упоминания отправят уведомление)</span>
      </div>
      <ul className="space-y-1.5 max-h-32 overflow-y-auto">
        {comments.map((c) => (
          <li key={c.id} className="text-[11px] bg-white rounded border border-slate-100 p-2">
            <span className="font-medium text-slate-700">{c.authorName}:</span>{' '}
            <CommentBody body={c.body} team={team} />
            {c.mentions?.length ? (
              <span className="text-[9px] text-indigo-500 block mt-0.5">
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
            className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-xs"
          />
          <Button size="sm" className="h-7 text-[10px]" onClick={handleSubmit}>
            Отправить
          </Button>
        </div>
        {showMentionSuggest && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded border bg-white shadow-lg z-10 py-1">
            {team.map((m) => (
              <button
                key={m.id}
                type="button"
                className="w-full text-left px-2 py-1 text-xs hover:bg-slate-50"
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
