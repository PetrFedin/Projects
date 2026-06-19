'use client';

import { useEffect, useMemo, useState } from 'react';
import { mockChatHistories } from '@/lib/data/messages-data';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { buildUnreadCountByChat, totalUnreadFromByChat } from './message-metrics';
import { subscribeMessageReadState } from './message-read-state';
import { usePgCommunicationsUnread } from './use-pg-communications-unread';

const BRAND_CURRENT_USER_ID = 'user_petr';

export function useBrandCommunicationsUnread() {
  const [mockTick, setMockTick] = useState(0);
  const pg = usePgCommunicationsUnread('brand', true);

  useEffect(() => subscribeMessageReadState(() => setMockTick((t) => t + 1)), []);

  const mockUnreadByChat = useMemo(
    () =>
      isPlatformCoreMode()
        ? ({} as Record<string, number>)
        : buildUnreadCountByChat(mockChatHistories, BRAND_CURRENT_USER_ID),
    [mockTick]
  );

  const unreadByChat = useMemo(
    () => ({ ...mockUnreadByChat, ...pg.unreadByChat }),
    [mockUnreadByChat, pg.unreadByChat]
  );
  const totalUnread = useMemo(() => totalUnreadFromByChat(unreadByChat), [unreadByChat]);

  return { unreadByChat, totalUnread, currentUserId: BRAND_CURRENT_USER_ID };
}

export function useShopCommunicationsUnread() {
  const pg = usePgCommunicationsUnread('shop', true);
  return {
    unreadByChat: pg.unreadByChat,
    totalUnread: pg.totalUnread,
    currentUserId: pg.currentUserId,
  };
}
