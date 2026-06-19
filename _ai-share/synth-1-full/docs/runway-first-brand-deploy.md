# Runway First Brand Deploy

## 15 шагов

| # | Шаг | Команда / URL |
|---|-----|----------------|
| 1 | Включить scroll-video для hero SKU | `node scripts/runway-enable-product.mjs <slug> --apply` |
| 2 | Патч hero products (3 SKU) | `node scripts/patch-runway-hero-products.mjs --apply` |
| 3 | Скачать демо-ассеты | `node scripts/download-runway-demo-assets.mjs` |
| 4 | scroll-experience.json | `brandRunwayEnabled`, `heroProductSlugs` |
| 5 | Валидация контента | `node scripts/validate-runway-content.mjs` |
| 6 | Doctor (локально) | `node scripts/runway-doctor.mjs --skip-health` |
| 7 | Onboarding checklist | `node scripts/runway-onboard-brand.mjs "Brand" <slug>` |
| 8 | Preview PDP | `/products/<slug>?view=runway` |
| 9 | Health API | `GET /api/runway/health` |
| 10 | Config API | `GET /api/runway/config` |
| 11 | Unit tests | `npm test -- --testPathPattern=runway` |
| 12 | Local pre-deploy | `npm run pre-deploy:runway:local` |
| 13 | Staging env | `STAGING_BASE_URL=... npm run check:runway-staging-env` |
| 14 | Staging smoke | `npm run smoke:runway-staging -- --base https://staging.example.com` |
| 15 | Production gate | `STAGING_BASE_URL=... npm run pre-deploy:runway` |

## Быстрый onboarding

```bash
npm run pre-deploy:runway:local
node scripts/runway-onboard-brand.mjs "Nordic Wool" silk-midi-dress --apply
```
