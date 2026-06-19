'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ContextualChatThread } from '@/components/brand/messages/ContextualChatThread';
import Link from 'next/link';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import { brandMessagesWorkshop2ArticleContextHref } from '@/lib/routes';
import {
  countWorkshop2ContextualChatUnread,
  readWorkshop2ContextualChatLastReadAt,
  writeWorkshop2ContextualChatLastReadAt,
} from '@/lib/production/workshop2-contextual-chat-unread';

type Props = {
  collectionId: string;
  articleId: string;
};

/** Contextual chat drawer для workspace артикула (Wave 1 #33) + unread badge (Wave 5). */
export function Workshop2ArticleWorkspaceChatPanel({ collectionId, articleId }: Props) {
  const contextId = workshop2ArticleContextId(collectionId, articleId);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [inboxSseConnected, setInboxSseConnected] = useState(false);

  const refreshUnread = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
        contextId,
      });
      const res = await fetch(`/api/messages/contextual?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = (await res.json()) as { messages?: Array<{ createdAt: string }> };
      const messages = data.messages ?? [];
      const lastRead = readWorkshop2ContextualChatLastReadAt(contextId);
      setUnreadCount(
        countWorkshop2ContextualChatUnread(
          messages as Parameters<typeof countWorkshop2ContextualChatUnread>[0],
          lastRead
        )
      );
    } catch {
      /* optional */
    }
  }, [contextId]);

  useEffect(() => {
    void refreshUnread();
  }, [refreshUnread]);

  useEffect(() => {
    if (typeof EventSource === 'undefined') return;
    const es = new EventSource('/api/platform-core/comms/inbox-stream');
    es.onopen = () => setInboxSseConnected(true);
    es.onmessage = () => void refreshUnread();
    es.onerror = () => {
      setInboxSseConnected(false);
      es.close();
    };
    return () => {
      setInboxSseConnected(false);
      es.close();
    };
  }, [refreshUnread]);

  useEffect(() => {
    if (open) {
      writeWorkshop2ContextualChatLastReadAt(contextId);
      setUnreadCount(0);
    }
  }, [open, contextId]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative h-8 gap-1.5 text-xs"
          aria-label="Открыть чат артикула"
          data-testid="workshop2-article-chat-button"
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          Чат
          {!inboxSseConnected ? (
            <Badge
              variant="outline"
              className="ml-0.5 h-4 px-1 text-[8px] font-normal"
              data-testid="workshop2-article-chat-poll-badge"
            >
              poll
            </Badge>
          ) : null}
          {unreadCount > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[9px]"
              data-testid="workshop2-chat-unread-badge"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-border-subtle shrink-0 border-b px-4 py-3">
          <SheetTitle className="text-left text-sm">Чат артикула</SheetTitle>
          <p className="text-text-muted text-left text-[11px] font-normal">Контекст: {contextId}</p>
        </SheetHeader>
        <div className="min-h-0 flex-1 p-3">
          <ContextualChatThread
            contextType={WORKSHOP2_ARTICLE_CONTEXT_TYPE}
            contextId={contextId}
            className="h-[calc(100vh-7rem)]"
          />
        </div>
        <div className="border-border-subtle shrink-0 border-t px-4 py-2">
          <Link
            href={brandMessagesWorkshop2ArticleContextHref(collectionId, articleId)}
            data-testid="brand-cm-article-messages-link"
            className="text-accent-primary text-[11px] font-semibold hover:underline"
          >
            Открыть в сообщениях →
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
