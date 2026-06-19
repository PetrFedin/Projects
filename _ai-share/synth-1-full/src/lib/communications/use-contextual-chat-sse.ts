'use client';

import { useEffect, useRef, useState } from 'react';

type ContextualSseEvent = {
  type: string;
  messageId?: string;
  ts?: string;
};

/** Подписка на SSE contextual chat; onBump — перезагрузить сообщения. */
export function useContextualChatSse(
  contextType: string,
  contextId: string,
  onBump: () => void
): { live: boolean } {
  const onBumpRef = useRef(onBump);
  onBumpRef.current = onBump;
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!contextType || !contextId) return;

    const params = new URLSearchParams({ contextType, contextId });
    const es = new EventSource(`/api/messages/contextual/stream?${params.toString()}`);

    es.onopen = () => setLive(true);
    es.onerror = () => setLive(false);

    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as ContextualSseEvent;
        if (data.type === 'CONTEXTUAL_MESSAGE_APPENDED') {
          onBumpRef.current();
        }
      } catch {
        /* ignore malformed */
      }
    };

    return () => {
      es.close();
      setLive(false);
    };
  }, [contextType, contextId]);

  return { live };
}
