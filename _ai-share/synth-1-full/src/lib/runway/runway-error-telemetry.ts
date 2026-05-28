/**
 * Клиентская телеметрия ошибок runway — POST в /api/runway/analytics без PII.
 */

export function reportRunwayScrollSwitcherError(message: string, productSlug?: string): void {
  if (typeof window === 'undefined') return;
  const safeMessage = message
    .slice(0, 500)
    .replace(/[\r\n]+/g, ' ')
    .trim();
  if (!safeMessage) return;

  const payload = {
    events: [
      {
        event: 'error' as const,
        productSlug: productSlug?.slice(0, 200) || 'unknown',
        message: safeMessage,
        timestamp: Date.now(),
        surface: 'scroll-switcher',
      },
    ],
  };

  void fetch('/api/runway/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
