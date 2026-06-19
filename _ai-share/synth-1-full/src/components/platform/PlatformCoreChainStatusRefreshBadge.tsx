'use client';

import { Badge } from '@/components/ui/badge';

type Props = {
  sseConnected: boolean;
  enabled?: boolean;
  sseTestId: string;
  pollTestId: string;
  /** Сохраняет совместимость e2e/аудита до полного переименования. */
  sseLegacyTestId?: string;
};

/** Live SSE или poll fallback (15–45 с) для chain-status в hub/workspace карточках. */
export function PlatformCoreChainStatusRefreshBadge({
  sseConnected,
  enabled = true,
  sseTestId,
  pollTestId,
  sseLegacyTestId,
}: Props) {
  if (!enabled) return null;

  if (sseConnected) {
    return (
      <Badge
        variant="outline"
        className="h-5 border-emerald-200 bg-emerald-50/80 text-[9px] text-emerald-800"
        data-testid={sseTestId}
        {...(sseLegacyTestId ? { 'data-audit-legacy': sseLegacyTestId } : {})}
      >
        Live
      </Badge>
    );
  }

  return (
    <span
      data-testid={pollTestId}
      className="text-text-muted inline-flex items-center gap-1.5 text-[9px] font-medium"
      title="Данные обновляются автоматически (опрос каждые 15 с)"
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden />
      Опрос
    </span>
  );
}
