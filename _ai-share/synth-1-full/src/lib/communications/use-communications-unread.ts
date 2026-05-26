'use client';

import { useEffect, useMemo, useState } from 'react';
import { mockChatHistories } from '@/lib/data/messages-data';
import { buildUnreadCountByChat, totalUnreadFromByChat } from './message-metrics';
import { subscribeMessageReadState } from './message-read-state';

const BRAND_CURRENT_USER_ID = 'user_petr';

export function useBrandCommunicationsUnread() {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeMessageReadState(() => setTick((t) => t + 1)), []);

  const unreadByChat = useMemo(
    () => buildUnreadCountByChat(mockChatHistories, BRAND_CURRENT_USER_ID),
    [tick]
  );
  const totalUnread = useMemo(() => totalUnreadFromByChat(unreadByChat), [unreadByChat]);

  return { unreadByChat, totalUnread, currentUserId: BRAND_CURRENT_USER_ID };
}
