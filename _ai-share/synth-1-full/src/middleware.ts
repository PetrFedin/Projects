import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/lib/routes';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname.replace(/\/$/, '') || '/';

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
