# Workshop2 — CDN и cache routing (RU)

## B2B static assets (immutable)

Настроено в `next.config.ts` → `headers()`:

| Path | Cache-Control |
| --- | --- |
| `/shop/b2b/_next/static/*` | `public, max-age=31536000, immutable` |
| `/shop/b2b/images/*` | `public, max-age=86400, stale-while-revalidate=3600` |

## API routes — no-store (персональные / заказы)

| Path | Cache-Control | Где |
| --- | --- | --- |
| `/api/shop/b2b/cart/*` | `no-store` | `middleware.ts` |
| `/api/shop/b2b/orders/*` | `no-store` | `middleware.ts` |
| `/api/workshop2/cutover-dashboard` | `no-store` | route default |
| `/api/workshop2/ops/sla-dashboard` | `no-store` | route default |

## Staging vs production

- Staging checklist links: `WORKSHOP2_STAGING_PUBLIC_URL`
- Prod probe cron: `WORKSHOP2_PRODUCTION_PUBLIC_URL` + `workshop2-probe-prod.yml`

## Wave 53

CDN doc используется probe `wave53ProdSlaReady` — без fake CDN ACK.
