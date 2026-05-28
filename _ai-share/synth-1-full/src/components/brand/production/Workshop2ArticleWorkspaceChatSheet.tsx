'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ContextualChatThread } from '@/components/brand/messages/ContextualChatThread';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import {
  countWorkshop2ContextualChatUnread,
  readWorkshop2ContextualChatLastReadAt,
  writeWorkshop2ContextualChatLastReadAt,
} from '@/lib/production/workshop2-contextual-chat-unread';

type Workshop2ArticleWorkspaceChatSheetProps = {
  collectionId: string;
  articleId: string;
};

/** Contextual chat drawer для workspace — contextId = collectionId:articleId */
export function Workshop2ArticleWorkspaceChatSheet({
  collectionId,
  articleId,
}: Workshop2ArticleWorkspaceChatSheetProps) {
  const contextId = workshop2ArticleContextId(collectionId, articleId);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

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
    const timer = window.setInterval(() => void refreshUnread(), 30_000);
    return () => window.clearInterval(timer);
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
          aria-label="Чат по артикулу"
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          Чат
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
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-border-subtle border-b px-4 py-3">
          <SheetTitle className="text-base">Чат артикула</SheetTitle>
          <p className="text-text-muted text-xs">{contextId}</p>
        </SheetHeader>
        <div className="min-h-0 flex-1 p-3">
          <ContextualChatThread
            contextType={WORKSHOP2_ARTICLE_CONTEXT_TYPE}
            contextId={contextId}
            collectionId={collectionId}
            articleId={articleId}
            className="h-[calc(100vh-8rem)]"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
