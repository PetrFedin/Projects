# Runway Milestone Summary

## Статус: READY FOR STAGING

> **Code complete — awaiting brand CDN + staging URL**

Код и локальные gates готовы; для prod остаётся brand CDN cutover и `STAGING_BASE_URL` на целевом хосте.

## Live verification (local, 2026-05-29)

| Gate | Результат |
|------|-----------|
| `npm test -- --testPathPattern=runway` | **401/401** (32 suites) |
| `node scripts/validate-runway-content.mjs` | **3/3** hero SKU (silk, cashmere, tech-anorak-men) |
| `node scripts/runway-doctor.mjs --skip-health` | **pass** (video-budget OK после real MP4) |
| `node scripts/runway-video-lint.mjs` | **pass** (24 файла; ffprobe skip — size-only) |
| `smoke:runway-staging` @ http://127.0.0.1:3000 | **9/9 OK** |
| E2E `test:e2e:runway:stable` | **open** — параллельный worker; не блокирует staging |

Smoke output:
- GET /api/runway/health, config, analytics POST/GET
- GET /products/silk-midi-dress?view=runway
- GET /products/cashmere-crewneck-sweater?view=runway
- GET /products/tech-anorak-men?view=runway
- presign 503 (expected without RUNWAY_UPLOAD_ENABLED)

## Демо-ассеты

| Категория | Статус |
|-----------|--------|
| Hero MP4/WebM | Wikimedia CC (Commons API) |
| Section MP4 | Реальные клипы; stub 16 B заменены через `npm run download:runway-assets` + ffmpeg-static |
| Budget | Все MP4 ≤ 50 MB (presign maxBytes) |

```bash
npm run download:runway-assets   # Commons + MP4 repair/compress
node scripts/validate-runway-content.mjs
```

## Команды

```bash
npm run pre-deploy:runway:local
PLAYWRIGHT_SKIP_WEBSERVER=1 npm run pre-deploy:runway:local
STAGING_BASE_URL=https://staging.example.com npm run pre-deploy:runway
npm run deploy:runway-check        # unit + validate + doctor + video-lint
```

## Метрики (2026-05-29)

| Gate | Статус |
|------|--------|
| Hero SKU | **3** (silk-midi-dress, cashmere-crewneck-sweater, tech-anorak-men) |
| Unit `npm test -- --testPathPattern=runway` | **401/401** (32 suites) |
| `validate-runway-content` | **3/3** |
| `runway-doctor --skip-health` | pass |
| `runway-video-lint` | pass (ffprobe optional) |
| `pre-deploy:runway:local` smoke | **9/9** |
| E2E stable | **open** (parallel worker) |
