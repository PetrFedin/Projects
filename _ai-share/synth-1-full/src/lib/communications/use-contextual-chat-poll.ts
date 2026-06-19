'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_POLL_MS = 15_000;

/** Периодический poll contextual chat (без SSE/WS — in-process hub не шарится между инстансами). */
export function useContextualChatPoll(
  contextType: string,
  contextId: string,
  onBump: () => void,
  pollMs = DEFAULT_POLL_MS
): { polling: boolean } {
  const onBumpRef = useRef(onBump);
  onBumpRef.current = onBump;

  useEffect(() => {
    if (!contextType?.trim() || !contextId?.trim()) return;
    const id = window.setInterval(() => onBumpRef.current(), pollMs);
    return () => window.clearInterval(id);
  }, [contextType, contextId, pollMs]);

  return { polling: Boolean(contextType?.trim() && contextId?.trim()) };
}
