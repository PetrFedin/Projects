# Product Scroll Switcher

Runway / scroll-video режим для hero SKU на PDP (`?view=runway`).

## Data source

- `NEXT_PUBLIC_RUNWAY_DATA_SOURCE=api` — каталог и секции через `/api/products/:slug` (рекомендуется для staging/production).
- `static` — встроенный JSON (dev fallback).

E2E использует **api data source**: `NEXT_PUBLIC_RUNWAY_DATA_SOURCE=api` в `playwright.runway.config.ts`.

## Контент

3 секции на SKU: `sectionStory`, `sectionTitle`, `sectionDescription`, 2+ `sectionLookItems`, `posterUrl`, `sectionVideoUrl`.

```bash
node scripts/patch-runway-hero-products.mjs --apply
node scripts/download-runway-demo-assets.mjs
node scripts/validate-runway-content.mjs
```
