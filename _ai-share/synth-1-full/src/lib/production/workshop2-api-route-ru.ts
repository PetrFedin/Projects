/**
 * Wave 17 RU: обёртка Next route handler — единый catch для необработанных ошибок Workshop2 API.
 */
import { buildWorkshop2ErrorRuBody } from '@/lib/production/workshop2-api-error-ru';

type NextRequest = import('next/server').NextRequest;
type RouteHandler<C = unknown> = (req: NextRequest, ctx: C) => Promise<Response> | Response;

function resolveWorkshop2ApiThrownError(err: unknown): {
  code: string;
  messageRu?: string;
  details?: Record<string, unknown>;
} {
  if (err && typeof err === 'object') {
    const e = err as { code?: unknown; messageRu?: unknown; status?: unknown; message?: unknown };
    if (typeof e.code === 'string' && e.code.trim()) {
      return {
        code: e.code.trim(),
        messageRu: typeof e.messageRu === 'string' ? e.messageRu : undefined,
        details: typeof e.status === 'number' ? { statusHint: e.status } : undefined,
      };
    }
  }
  if (err instanceof Error && err.message.trim()) {
    return {
      code: 'internal_error',
      messageRu: err.message.trim(),
      details:
        process.env.NODE_ENV !== 'production' ? { name: err.name, stack: err.stack } : undefined,
    };
  }
  return { code: 'internal_error', messageRu: 'Внутренняя ошибка Workshop2 API.' };
}

/** Pure helper для unit-тестов и wrapper — единое тело `{ ok, error, code, messageRu, details? }`. */
export function buildWorkshop2ApiRouteRuErrorBody(err: unknown): Record<string, unknown> {
  const parsed = resolveWorkshop2ApiThrownError(err);
  const body = buildWorkshop2ErrorRuBody(parsed.code, {
    messageRu: parsed.messageRu,
    ...parsed.details,
  });
  body.code = parsed.code;
  if (parsed.details && Object.keys(parsed.details).length) {
    body.details = parsed.details;
  }
  return body;
}

/** Оборачивает GET/POST/… — возвращает `{ ok:false, error, code, messageRu, details? }` при throw. */
export function withWorkshop2ApiErrorRu<C>(handler: RouteHandler<C>): RouteHandler<C> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      const { NextResponse } = require('next/server') as typeof import('next/server');
      return NextResponse.json(buildWorkshop2ApiRouteRuErrorBody(err), { status: 500 });
    }
  };
}
