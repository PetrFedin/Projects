'use client';

import { useCallback, useEffect, useState } from 'react';

export type PlatformCoreSynthaHealth = {
  ok: boolean;
  coreMode: boolean;
  pgReachable: boolean;
  demoSeeded: boolean;
  redisConfigured: boolean;
  messageRu?: string;
};

export function usePlatformCoreSynthaHealth(intervalMs = 8000) {
  const [health, setHealth] = useState<PlatformCoreSynthaHealth | null>(null);
  const [ollamaOk, setOllamaOk] = useState<boolean | null>(null);
  const [plannerLive, setPlannerLive] = useState(false);
  const [cursorAgentOk, setCursorAgentOk] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [h, s] = await Promise.all([
        fetch('/api/workshop2/platform-core/health', { cache: 'no-store' }),
        fetch('/api/dev/syntha-status', { cache: 'no-store' }).catch(() => null),
      ]);
      if (h.ok) {
        const j = (await h.json()) as PlatformCoreSynthaHealth;
        setHealth(j);
      } else {
        setHealth(null);
      }
      if (s?.ok) {
        const extra = (await s.json()) as {
          ollamaOk?: boolean;
          plannerLive?: boolean;
          cursorAgentConfigured?: boolean;
        };
        setOllamaOk(extra.ollamaOk ?? false);
        setPlannerLive(Boolean(extra.plannerLive));
        setCursorAgentOk(extra.cursorAgentConfigured ?? false);
      } else {
        setPlannerLive(false);
        setOllamaOk(null);
        setCursorAgentOk(null);
      }
    } catch {
      setHealth(null);
      setPlannerLive(false);
      setOllamaOk(null);
      setCursorAgentOk(null);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, refresh]);

  return { health, ollamaOk, plannerLive, cursorAgentOk, refresh };
}
