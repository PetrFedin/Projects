import { NextResponse } from 'next/server';
import { getHomeCmsServerBaseline } from '@/lib/home/get-home-cms-server';

/** GET baseline home CMS для client prefetch (localStorage override остаётся на клиенте). */
export async function GET() {
  return NextResponse.json(getHomeCmsServerBaseline(), {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
}
