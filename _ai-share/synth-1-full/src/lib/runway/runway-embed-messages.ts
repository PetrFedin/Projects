/**
 * Стабильный postMessage-контракт для /embed/runway/[slug].
 * Pure functions — unit-testable без DOM.
 */

/** Канонический ready-сигнал (Iteration 3). */
export type RunwayEmbedReadyMessage = {
  type: 'runway:ready';
  slug: string;
};

/** Канонический resize (Iteration 3) — debounced на стороне bridge. */
export type RunwayEmbedResizeMessage = {
  type: 'runway:resize';
  height: number;
};

/** Legacy aliases для существующих интеграций. */
export type RunwayEmbedLegacyReadyMessage = {
  type: 'data-runway-embed-ready';
  slug: string;
};

export type RunwayEmbedLegacyResizeMessage = {
  type: 'runway-embed-resize';
  height: number;
  slug: string;
  sectionIndex?: number;
};

export type RunwayEmbedPostMessage =
  | RunwayEmbedReadyMessage
  | RunwayEmbedResizeMessage
  | RunwayEmbedLegacyReadyMessage
  | RunwayEmbedLegacyResizeMessage;

export function buildRunwayEmbedReadyMessages(slug: string): RunwayEmbedPostMessage[] {
  const trimmed = slug.trim();
  return [
    { type: 'runway:ready', slug: trimmed },
    { type: 'data-runway-embed-ready', slug: trimmed },
  ];
}

export function buildRunwayEmbedResizeMessages(
  height: number,
  slug: string,
  sectionIndex?: number
): RunwayEmbedPostMessage[] {
  const safeHeight = Math.max(0, Math.ceil(height));
  const trimmed = slug.trim();
  return [
    { type: 'runway:resize', height: safeHeight },
    {
      type: 'runway-embed-resize',
      height: safeHeight,
      slug: trimmed,
      ...(sectionIndex != null ? { sectionIndex } : {}),
    },
  ];
}

/** Проверка shape для parent listener (unit tests). */
export function isRunwayEmbedResizeMessage(data: unknown): data is RunwayEmbedResizeMessage {
  if (!data || typeof data !== 'object') return false;
  const msg = data as Record<string, unknown>;
  return msg.type === 'runway:resize' && typeof msg.height === 'number' && msg.height >= 0;
}
