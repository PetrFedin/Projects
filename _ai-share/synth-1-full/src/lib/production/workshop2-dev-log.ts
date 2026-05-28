/**
 * Wave U — structured dev-only logging (замена console.error в Workshop2 UI).
 * В production — no-op; в dev — console.warn с префиксом [workshop2].
 */

export type Workshop2DevLogContext = {
  panel?: string;
  action?: string;
  collectionId?: string;
  articleId?: string;
  cause?: unknown;
};

function formatWorkshop2DevLogMessage(
  scope: string,
  message: string,
  ctx?: Workshop2DevLogContext
): string {
  const parts = [`[workshop2:${scope}]`, message];
  if (ctx?.panel) parts.push(`panel=${ctx.panel}`);
  if (ctx?.action) parts.push(`action=${ctx.action}`);
  if (ctx?.collectionId) parts.push(`c=${ctx.collectionId}`);
  if (ctx?.articleId) parts.push(`a=${ctx.articleId}`);
  return parts.join(' · ');
}

/** Dev-only warning — для recoverable ошибок UI (fetch, parse, optional AI). */
export function workshop2DevWarn(
  scope: string,
  message: string,
  ctx?: Workshop2DevLogContext
): void {
  if (process.env.NODE_ENV === 'production') return;
  const line = formatWorkshop2DevLogMessage(scope, message, ctx);
  if (ctx?.cause !== undefined) {
    console.warn(line, ctx.cause);
    return;
  }
  console.warn(line);
}

/** Dev-only error — для сбоев persist/signoff без шума в tab strip production. */
export function workshop2DevError(
  scope: string,
  message: string,
  ctx?: Workshop2DevLogContext
): void {
  if (process.env.NODE_ENV === 'production') return;
  const line = formatWorkshop2DevLogMessage(scope, message, ctx);
  if (ctx?.cause !== undefined) {
    console.warn(line, ctx.cause);
    return;
  }
  console.warn(line);
}
