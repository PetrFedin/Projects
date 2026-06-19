import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/lib/routes';
import {
  buildWorkshop2LegacyArticleRedirectPath,
  parseWorkshop2LegacyArticlePath,
} from '@/lib/production/workshop2-legacy-article-url';
import { buildWorkshop2DevBypassRequestHeaders } from '@/lib/server/workshop2-dev-auth-bypass';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname.replace(/\/$/, '') || '/';

  /** Workshop2: legacy `/workshop2/{collection}/{article}` → canonical `/c/.../a/...`. */
  const legacyArticle = parseWorkshop2LegacyArticlePath(path);
  if (legacyArticle) {
    const next = url.clone();
    next.pathname = buildWorkshop2LegacyArticleRedirectPath(legacyArticle, url.search);
    return NextResponse.redirect(next);
  }

  /** Workshop2: dev-only actor headers for `/api/workshop2/*` smoke (never production). */
  if (path.startsWith('/api/workshop2')) {
    const bypassHeaders = buildWorkshop2DevBypassRequestHeaders(req);
    if (bypassHeaders) {
      return NextResponse.next({ request: { headers: bypassHeaders } });
    }
  }

  if (path === ROUTES.factory.home && url.searchParams.get('role') === 'supplier') {
    const next = url.clone();
    next.pathname = ROUTES.factory.supplier;
    next.searchParams.delete('role');
    return NextResponse.redirect(next);
  }

  if (path === '/supplier' || path.startsWith('/supplier/')) {
    const next = url.clone();
    next.pathname = path.replace(/^\/supplier/, ROUTES.factory.supplier) || ROUTES.factory.supplier;
    return NextResponse.redirect(next);
  }

  if (path === '/u') {
    const next = url.clone();
    next.pathname = '/client/me';
    return NextResponse.redirect(next);
  }
  if (path.startsWith('/u/')) {
    const next = url.clone();
    next.pathname = '/client' + path.slice(2);
    return NextResponse.redirect(next);
  }

  /** Wave 53: B2B cart/orders API — no-store (см. .planning/workshop2-cdn-routing.md). */
  if (
    path.startsWith('/api/shop/b2b/cart') ||
    path.startsWith('/api/shop/b2b/orders')
  ) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
