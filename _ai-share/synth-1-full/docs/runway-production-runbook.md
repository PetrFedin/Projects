# Runway Production Runbook

## Переменные окружения

См. `.env.production.example`. Ключевые: `RUNWAY_VIDEO_CDN_SIGNED_QUERY`, `brandRunwayEnabled` в `scroll-experience.json`.

## Health

`GET /api/runway/health` — catalog, assets, analytics, config.

## Загрузка видео

Dev: `POST /api/runway/upload` при `RUNWAY_ALLOW_LOCAL_UPLOAD=1`.
Production: `POST /api/runway/upload/presign` + R2/S3 CDN — миграция с локального storage на CDN.

## CDN / S3

Hero section videos отдаются с brand CDN (`videoCdnBaseUrl`, `brandVideoCdnBaseUrl`). Cutover: `npm run verify:runway-cdn`.

## analyticsWebhookUrl

Пример в scroll-experience.json: `"analyticsWebhookUrl": "https://brand.example/hook"`

## Bundle audit

Перед релизом: `npm run build` затем `node scripts/runway-bundle-check.mjs` (или `npm run test:runway:bundle`).
Пороги: warn/fail KB для runway chunks в `.next/static/chunks`.

