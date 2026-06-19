# Visual QA — investor show (Wave 58)

**Viewport:** 1280×800 (desktop) + 1024×768 (iPad landscape)  
**Путь сохранения:** `.planning/screenshots/wave58-investor/` (создать перед показом)

| # | ID | Путь UI | Файл (placeholder) | Что проверить |
|---|-----|---------|-------------------|---------------|
| 1 | `w2-hub-ss27` | `/brand/production/workshop2?w2col=SS27` | `01-w2-hub-ss27.png` | Investor banner, UAT %, SS27 cards |
| 2 | `w2-dossier-01` | `.../c/SS27/a/demo-ss27-01` | `02-w2-dossier-demo-ss27-01.png` | TZ fill, phase tabs, no dead CTA |
| 3 | `b2b-showroom-matrix` | `/shop/b2b/showroom?collection=SS27&article=demo-ss27-01` | `03-b2b-showroom-matrix.png` | Matrix grid, 3D badge RU, chrome |
| 4 | `b2b-checkout` | `/shop/b2b/checkout` | `04-b2b-checkout.png` | Sticky header z-index, submit ≥44px |
| 5 | `b2b-rep-offline` | `/shop/b2b/sales-rep-portal` | `05-b2b-rep-offline-banner.png` | Offline queue banner + matrix |
| 6 | `investor-brief` | `/brand/production/workshop2/investor-brief` | `06-investor-brief-api.png` | Brief KPIs, failing gates visible |

## E2E

```bash
npm run test:e2e:visual-qa
npm run test:e2e:b2b-ipad
npx playwright test e2e/workshop2-investor-golden-path.spec.ts --workers=1
```

## Автоматический placeholder в last-run

`npm run workshop2:investor-show` записывает `screenshotChecklist[]` в `.planning/investor-demo-last-run.json` — ops подставляет файлы после ручного capture.
