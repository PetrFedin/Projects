'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isSynthaEmbedClient } from '@/lib/syntha-embed';

/** SYNTHA preview iframe → parent: live updates без полной перезагрузки shell. */
export function SynthaPreviewBridge() {
  const pathname = usePathname();
  const lastSent = useRef(0);

  useEffect(() => {
    if (!isSynthaEmbedClient()) return;
    document.documentElement.dataset.synthaEmbed = '1';
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (typeof window === 'undefined' || window.parent === window) return;
    if (!isSynthaEmbedClient()) return;

    const notify = (type: 'syntha:update' | 'syntha:ready' | 'syntha:navigate') => {
      const now = Date.now();
      if (type === 'syntha:update' && now - lastSent.current < 500) return;
      lastSent.current = now;
      try {
        window.parent.postMessage({ type, at: now, path: pathname }, '*');
      } catch {
        /* ignore */
      }
    };

    notify('syntha:navigate');
    notify('syntha:ready');
    const mo = new MutationObserver(() => notify('syntha:update'));
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    return () => mo.disconnect();
  }, [pathname]);

  return null;
}
