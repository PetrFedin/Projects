import { NextRequest, NextResponse } from 'next/server';

import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

/** GET — HTML embed preview для sdk-stub / demo 3D panel (iframe src). */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() || 'SS27';
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim() || 'demo-ss27-01';

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>3D Showroom · ${collectionId}</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: linear-gradient(145deg,#0f172a,#1e293b); color: #e2e8f0; min-height: 100vh; display: grid; place-items: center; }
    .card { text-align: center; padding: 2rem; border: 1px dashed rgba(148,163,184,.4); border-radius: 12px; max-width: 420px; }
    h1 { font-size: 1rem; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 .5rem; }
    p { font-size: .85rem; opacity: .85; margin: .25rem 0; }
    code { font-size: .75rem; background: rgba(15,23,42,.6); padding: .15rem .35rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>3D Showroom preview</h1>
    <p><code>${collectionId}</code> · <code>${articleId}</code></p>
    <p>Демо-embed Platform Core. LIVE stream — <code>WORKSHOP2_B2B_3D_STREAM_URL</code>.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Workshop2-3d-Embed': 'demo-preview',
    },
  });
}
