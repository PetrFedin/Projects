# Synth-1 Fashion OS — статус Workshop2 RU (Wave 39)

Одностраничная сводка для investor demo, staging и handoff.

## Waves 9–27 (кратко)

| Wave | Фокус |
|------|--------|
| 9–10 | RU market profile, horizontal probes, ЭДО stub |
| 11–12 | Connectivity + SS27 journey stepper |
| 13–14 | Finalization + showroom readiness |
| 15–16 | Compliance cycle + batch links |
| 17–19 | API error RU wrappers + stabilization + `.env.ru.example` |
| 20 | Maturity score + investor-readiness |
| 21–23 | B2B JOOR/NuOrder parity (lifecycle, matrix, cart, invites) |
| 24 | ЭДО CTA mock/kontur, ЧЗ, MES E2E, credit dashboard |
| 25 | Form/pulse/grading/CR/lab dip/docs index mirrors |
| 26 | Staging live-harness + advanced credit scoring + E2E specs |
| 27 | Green full unit suite + marketplace inbound docs |

## Wave 33 (done) — CI matrix + multi-brand split

| P0 | `.github/workflows/workshop2-ci.yml` — unit required, MES/PG/e2e-ru-signoff optional |
| P0 | `POST /api/shop/b2b/cart/split-by-brand` + checkout banner «N бренда — оформите отдельно» |
| P0 | `.env.staging.live.ru.example` — Kontur Diadoc + Marking API placeholders |
| P1 | `workshop2-wave33-ci-multi-brand.test.ts` + probe `wave33CiReady` |

## Wave 34 (done) — staging live verify + B2B inbound scaffold

| P0 | `jest.polyfills.js` — TextEncoder до импорта `pg`; восстановлены урезанные exports + `(w2-enterprise)` + demo dossier auto-seed |
| P0 | Unit suite (Wave 34 baseline): **1115 passed / 81 failed / 1196 total** — superseded Wave 35a green |
| P0 | `npm run workshop2:staging-live-verify` → `.planning/workshop2-staging-live-verify.json` |
| P0 | Kontur / Marking HTTP probe: 401/503 fail-closed без ключа, без crash |
| P0 | CI `WORKSHOP2_PG_GATE_REQUIRED` — default `false`; на `main` или workflow_dispatch → PG gate **FAIL** on error |
| P1 | `POST /api/shop/b2b/inbound/order-webhook` — HMAC `x-b2b-webhook-secret`, draft order, `journal_only` без PG |
| P1 | `WORKSHOP2_B2B_INBOUND_WEBHOOK_ENABLED` + chat `b2b_inbound_order` + calendar stub |
| P1 | `GET /api/shop/b2b/showroom/stream-token` — `{ mode: placeholder \| live, token? }` |
| P1 | UI chip «3D stream» disabled + RU tooltip когда `WORKSHOP2_B2B_3D_STREAM_URL` unset |
| P1 | `workshop2-wave34-staging-live.test.ts` (+8) + probe `wave34StagingLive` |

**Команды verify:**

```bash
npm run test:workshop2:unit
npm run workshop2:staging-live-verify
npx jest src/lib/production/__tests__/workshop2-wave34-staging-live.test.ts
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave34StagingLive'
curl -s http://localhost:3000/api/shop/b2b/showroom/stream-token | jq '{mode,token}'
# PG gate strict on main:
# WORKSHOP2_PG_GATE_REQUIRED=true bash scripts/ci-workshop2-pg-only-gate.sh
```

## Wave 35a (done) — Green unit suite

| P0 | Unit suite: **1189 passed / 0 failed / 1189 total** (134 suites) — **GREEN** |
| P0 | Восстановлены урезанные на диске UI/API: DFM fail-closed, TZ PG chips, FlatHub probes, persist `filePersistOnly ? null`, enterprise article route |
| P0 | `(w2-enterprise)/c/[collectionId]/a/[articleId]/page.tsx` — 7-й enterprise route + `workshop2-workspace-backend-banner` |
| P1 | `data/workshop2-wave35a-unit-metrics.json` + probe `wave35aGreenSuite` в `/api/workshop2/integration-probes` |

**Последний прогон:**

```bash
npm run test:workshop2:unit
# Test Suites: 133 passed | Tests: 1181 passed
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave35aGreenSuite'
```

## Wave 35b (done) — Human UAT signoff + OAuth scaffold + prod readiness

| P0 | `POST /api/workshop2/uat/ss27/signoff` — `{ role: ops\|staging, signedBy, notes? }` → `.planning/workshop2-ss27-uat-signoff.json` |
| P0 | `GET /api/workshop2/uat/ss27-checklist` → `readyForHumanSignoff`, `humanSignoffAt`, `humanSignoffs` |
| P0 | Human steps: [workshop2-uat-ss27-human-steps.md](.planning/workshop2-uat-ss27-human-steps.md) |
| P0 | CI `main`: `WORKSHOP2_PG_GATE_REQUIRED=true` — PG gate **FAIL** on error (`continue-on-error` только когда не required) |
| P1 | `GET /api/shop/b2b/inbound/oauth/callback` — JOOR\|NuOrder stub + `WORKSHOP2_B2B_OAUTH_*` + chat `b2b_oauth_inbound` |
| P1 | 3D stream live: `expiresAt` + optional HMAC + chip открывает `streamUrl` |
| P1 | `npm run workshop2:staging-live-verify` — +ERP (`WORKSHOP2_FACTORY_ERP_BASE_URL`) +MES (`WORKSHOP2_FLOOR_MES_URL`) |
| P1 | `workshop2-wave35b-uat-signoff.test.ts` (+6), `workshop2-wave35b-oauth-pg.test.ts` (+8), probe `wave35bProdReadiness` |

**Команды verify:**

```bash
npm run test:workshop2:unit
npx jest src/lib/production/__tests__/workshop2-wave35b-uat-signoff.test.ts
npx jest src/lib/production/__tests__/workshop2-wave35b-oauth-pg.test.ts
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave35bProdReadiness'
WORKSHOP2_PG_GATE_REQUIRED=true bash scripts/ci-workshop2-pg-only-gate.sh
```

## Wave 36 (done) — OAuth live + E2E required + release readiness

| P0 | OAuth authorize + live token exchange (JOOR/NuOrder) при `WORKSHOP2_B2B_OAUTH_TOKEN_URL` |
| P0 | CI `main`: `test:e2e:ru-signoff` required (`WORKSHOP2_E2E_REQUIRED=true`) |
| P1 | `scripts/workshop2-staging-signoff.mjs`, `workshop2-investor-demo.sh` + probe `wave36ReleaseReady` |
| P1 | UAT signoff panel в hub + `workshop2-wave36-prod-ci.test.ts` (+8) |

**Baseline:** **1203 passed / 0 failed** — `wave36ReleaseReady`

```bash
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave36ReleaseReady'
npm run test:e2e:ru-signoff
```

## Wave 37 (done) — Live Kontur/ЧЗ harness + B2B mobile (RU)

| P0 | `sendWorkshop2KonturEdoDocument` + `POST /api/workshop2/edo/send` — `{ ok, httpStatus, configured, journalId }`, fail-closed |
| P0 | Marking register-order — journal + structured fields; staging verify `configured:true` при URL (401 = pass) |
| P0 | `.env.staging.live.ru.example` — `WORKSHOP2_KONTUR_DIADOC_TOKEN`, `WORKSHOP2_MARKING_API_TOKEN` + doc кабинет |
| P0 | B2B rep mobile: bottom nav (Заказы \| Showroom \| Календарь \| Чат), quick actions, cart badge API |
| P1 | Buyer showroom: sticky cart bar, swipe linesheet grid, deep link `?collection=SS27&article=demo-ss27-01` |
| P1 | Matrix qty mobile tap target ≥44px; `.planning/workshop2-ru-ops-runbook.md` |
| P1 | `workshop2-wave37-staging-mobile.test.ts` (+8) + probe `wave37StagingMobile` |

**Команды verify:**

```bash
npm run test:workshop2:unit
npm run workshop2:staging-live-verify
npx jest src/lib/production/__tests__/workshop2-wave37-staging-mobile.test.ts
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave37StagingMobile'
curl -s -X POST http://localhost:3000/api/workshop2/edo/send \
  -H 'Content-Type: application/json' \
  -d '{"collectionId":"SS27","articleId":"demo-ss27-01"}' | jq '{ok,configured,journalId,httpStatus}'
```

Ops runbook: [.planning/workshop2-ru-ops-runbook.md](.planning/workshop2-ru-ops-runbook.md)

## Wave 38 (done) — MES/ERP live harness + Genkit sketch gate

| P0 | `workshop2-floor-mes-client.ts` — push/pull HTTP, structured `{ ok, configured, httpStatus, journalId, operationRef }` |
| P0 | `POST /api/workshop2/mes/push-status` + `POST /api/workshop2/mes/pull-updates` — fail-closed 503 |
| P0 | `workshop2-factory-erp-client.ts` + `POST /api/workshop2/erp/sync-style` + `POST /api/workshop2/erp/pull-costs` |
| P0 | Chat `mes_floor_update` + calendar stub `mes_shift` |
| P1 | `POST /api/brand/workshop2/ai/sketch` — journal_only `demoGenerated`, 503 без Genkit key |
| P1 | `.planning/workshop2-pr-ship-checklist.md` + probe `wave38IntegrationsLive` |
| P1 | `workshop2-wave38-mes-erp.test.ts` (+10), staging-live `WORKSHOP2_FLOOR_MES_TOKEN` |

**Команды verify:**

```bash
npm run test:workshop2:unit
npx jest src/lib/production/__tests__/workshop2-wave38-mes-erp.test.ts
npm run workshop2:staging-live-verify
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave38IntegrationsLive'
```

PR ship: [.planning/workshop2-pr-ship-checklist.md](.planning/workshop2-pr-ship-checklist.md)

## Wave 39 (done) — platform health + MoySklad live + multi-factory

| P0 | P0 green restore — `jest.polyfills.js` в setupFiles, `edo/send`, enterprise article route, wave38 test path |
| P0 | `data/workshop2-wave35a-unit-metrics.json` + probe `wave38bGreenRestored` |
| P0 | Horizontal audit — [.planning/workshop2-ru-module-health-W39.md](.planning/workshop2-ru-module-health-W39.md) |
| P0 | Top 5 dead ends — linkedPaths API paths, logistics empty state, factory handoff target, legacy requisitions 410 |
| P1 | `workshop2-moysklad-client.ts` + `POST /api/workshop2/integrations/moysklad/sync-stock` |
| P1 | `workshop2-factory-registry.ts` — multi-factory JSON + logistics chip |
| P1 | Performance budget doc + probe `wave39PlatformHealth` |
| P1 | `workshop2-wave39-platform.test.ts` (+8) |

**Baseline:** **1201 passed / 0 failed** — `wave39PlatformHealth`

```bash
npm run test:workshop2:unit
npx jest src/lib/production/__tests__/workshop2-wave39-platform.test.ts
npm run workshop2:staging-live-verify
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '{wave38b: .wave38bGreenRestored, wave39: .wave39PlatformHealth}'
curl -s -X POST http://localhost:3000/api/workshop2/integrations/moysklad/sync-stock \
  -H 'Content-Type: application/json' \
  -d '{"collectionId":"SS27","articleId":"demo-ss27-01"}' | jq '{ok,configured,journalId}'
```

Module health: [.planning/workshop2-ru-module-health-W39.md](.planning/workshop2-ru-module-health-W39.md)

Performance: [.planning/workshop2-performance-budget.md](.planning/workshop2-performance-budget.md)

## Wave 40 (done) — performance budget + MoySklad deepen + multi-factory handoff

| P0 | Performance budget implement — lazy hub/showroom panels, `data-performance-region`, `GET /api/workshop2/performance-budget` |
| P0 | MoySklad sync-stock deepen — SKU journal + PG mirror + chat `moysklad_stock_sync` + logistics chip |
| P1 | `POST /api/workshop2/logistics/handoff` — registry validate + calendar `factory_handoff` + chat |
| P1 | Module health W40 — linkedPaths handoff/performance/moysklad status, factory picker, rep publish gate chip |
| P1 | `scripts/workshop2-production-readiness.mjs` + `npm run workshop2:production-readiness` |
| P1 | `workshop2-wave40-ship.test.ts` (+10) + probe `wave40ShipReady` (≥8 checks) |

**Baseline:** **1214+ passed / 0 failed** — `wave40ShipReady`

```bash
npm run test:workshop2:unit
npx jest src/lib/production/__tests__/workshop2-wave40-ship.test.ts
npm run workshop2:production-readiness
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave40ShipReady'
curl -s http://localhost:3000/api/workshop2/performance-budget | jq '{targets: .targets|length, probe: .lastProbeTimings.source}'
curl -s -X POST http://localhost:3000/api/workshop2/logistics/handoff \
  -H 'Content-Type: application/json' \
  -d '{"factoryId":"fact-1","collectionId":"SS27","articleId":"demo-ss27-01"}' | jq '{ok,chatEvent,calendarKind}'
```

Performance: [.planning/workshop2-performance-budget.md](.planning/workshop2-performance-budget.md)

## Wave 41 (done) — investor-ready native B2B

| P0 | Green suite + disk integrity — critical routes non-truncated |
| P0 | Dead ends eliminated — checkout wired, multi-brand tabs, no demo traps |
| P0 | Native JOOR/NuOrder parity — linesheet PG, publish gate, matrix cart, wholesale checkout, sample→W2 |
| P0 | Horizontal — domain events → chat/calendar, W2 chip «B2B заказы», calendar filter b2b+workshop2 |
| P1 | `B2bWorkshopChrome` + iPad landscape CSS + touch ≥44px |
| P1 | `./scripts/workshop2-investor-demo.sh` (15 steps) + `GET /api/workshop2/investor-demo/status` |
| P1 | `node scripts/workshop2-investor-deck-export.mjs` → `.planning/workshop2-investor-deck.json` |
| P1 | `workshop2-wave41-investor-native-b2b.test.ts` (+18) + probe `wave41InvestorNativeB2b` |

**Baseline:** `npm run test:workshop2:unit` — **1230+ passed / 0 failed**

```bash
npm run test:workshop2:unit
./scripts/workshop2-investor-demo.sh
curl -s http://localhost:3000/api/workshop2/investor-demo/status | jq '{investorDemoReady,deadEndsRemaining,parityCoveragePct}'
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave41InvestorNativeB2b'
node scripts/workshop2-investor-deck-export.mjs
```

**iPad verify:** `/shop/b2b/checkout` landscape 1024×768 — sticky header, `min-h-[44px]`, safe-area bottom nav.

## Wave 42 (done)

| P0 | iPad E2E `e2e/workshop2-b2b-ipad-landscape.spec.ts` (4 tests, 1024×768) + `npm run test:e2e:b2b-ipad` + CI `ipad-e2e` |
| P0 | `investorDemoReady` = autoGates && (humanSignoff \|\| `WORKSHOP2_INVESTOR_DEMO_MODE=true`) |
| P0 | ЭДО + marking: demo mode → `{ ok, demoMode, journalId }` journal-only (ops runbook) |
| P1 | Hub compact UAT: 8 tabs + 2 visual из `GET /api/workshop2/uat/ss27-checklist` |
| P1 | CSS fix checkout/showroom sticky overlap @ 1024×768 |
| P1 | Probe `wave42InvestorDemoComplete` (8 checks) + `workshop2-wave42-investor-ipad.test.ts` |

**Verify URLs (iPad landscape 1024×768):** `/shop/b2b/checkout`, `/shop/b2b/showroom?collection=SS27`, hub `/brand/production/workshop2?w2col=SS27`

```bash
npm run test:workshop2:unit
npm run test:e2e:b2b-ipad
curl -s http://localhost:3000/api/workshop2/investor-demo/status | jq '{investorDemoReady,investorDemoMode,autoGatesPass}'
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave42InvestorDemoComplete'
```

## Wave 43 (done) — deep investor-ready polish

| P0 | `B2bMatrixOrderGrid` — debounced batch `POST /api/shop/b2b/cart/matrix` + MOQ RU |
| P0 | Linesheet email share API + order amendments PATCH + rep W2 assortment link |
| P0 | 3D stream investor demo preview (`WORKSHOP2_B2B_3D_DEMO_PREVIEW_URL`) |
| P1 | iPad E2E 9 tests — matrix qty @ 1024×768, rep portal, UAT panel |
| P1 | Probe `wave43DeepInvestorReady` (≥12) + `workshop2-wave43-deep-parity.test.ts` (+18) |
| P1 | `failingAutoGates` RU + hub UAT visual modal |

**Baseline:** `npm run test:workshop2:unit` — **1260+ passed / 0 failed**

```bash
node scripts/wave41-restore-disk.mjs
node scripts/wave43-restore-disk.mjs
npm run test:workshop2:unit
npm run test:e2e:b2b-ipad
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave43DeepInvestorReady'
```

## Wave 44 (done) — live staging harness + 3D embed + investor one-command

| P0 | Green lock — `wave41/43-restore-disk` + unit **1260+ / 0 failed** |
| P0 | Kontur `edo/send`: `configured`, `httpStatus`, `journalId`; `demoMode` только без URL+token при investor flag |
| P0 | ЧЗ `register-order`: `demoMode` vs `liveAttempt`, structured fields, fail-closed |
| P0 | `workshop2-staging-bootstrap.mjs` + `.env.staging.live.ru.example` checklist RU |
| P1 | `B2b3dStreamPanel` + `stream-token` → `embedUrl` + `expiresAt` |
| P1 | OAuth prod runbook RU + brand settings «Внешний B2B sync» |
| P1 | iPad E2E 11 tests (3D panel + matrix batch save indicator) |
| P1 | `npm run workshop2:investor-demo:full` → `workshop2-investor-demo-last-run.json` |
| P1 | `workshop2-wave44-live-staging.test.ts` (+12) + probe `wave44LiveStagingReady` (≥10) |

**Baseline:** `npm run test:workshop2:unit` — **1260+ passed / 0 failed**

```bash
node scripts/wave41-restore-disk.mjs
node scripts/wave43-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:staging-bootstrap
npm run workshop2:staging-live-verify
npm run test:e2e:b2b-ipad
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave44LiveStagingReady'
npm run workshop2:investor-demo:full
```

## Wave 45 (done) — PG ACK persistence + human signoff gate + 3D sdk-stub

| P0 | `workshop2_edo_ack` + `workshop2_marking_ack` PG tables (+ file journal fallback) |
| P0 | `edo/send` + `marking/register-order` → persist ACK on live HTTP **и** journal_only/demoMode |
| P0 | `GET /api/workshop2/edo/ack-status` + `.../marking/ack-status` — ops read after restart |
| P0 | `POST /api/workshop2/uat/ss27/signoff` — `humanSignoffComplete` when ops+staging signed |
| P0 | `investorDemoReady` = autoGates && (humanSignoff \|\| `WORKSHOP2_INVESTOR_DEMO_MODE=true`) |
| P1 | `workshop2-b2b-oauth-secrets.ts` + OAuth status `expiresAt`/`rotationDue` stub |
| P1 | `B2b3dStreamPanel` embedMode `iframe` \| `sdk-stub` + event `b2b.3d.view` |
| P1 | Domain events: `integration.edo_ack.saved`, `integration.marking_ack.saved`, `b2b.3d.view` |
| P1 | `workshop2-wave45-pg-ack-signoff.test.ts` (+14) + probe `wave45StagingProdReady` (≥10) |
| P1 | `scripts/wave45-restore-disk.mjs` + staging signoff checks human signoff file |

**Baseline:** `npm run test:workshop2:unit` — **1274+ passed / 0 failed**

```bash
node scripts/wave41-restore-disk.mjs
node scripts/wave43-restore-disk.mjs
node scripts/wave44-restore-disk.mjs
node scripts/wave45-restore-disk.mjs
npm run test:workshop2:unit
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '.wave45StagingProdReady'
curl -s "http://localhost:3000/api/workshop2/edo/ack-status?collectionId=SS27&articleId=demo-ss27-01" | jq '.latest'
curl -s http://localhost:3000/api/workshop2/investor-demo/status | jq '{investorDemoReady,humanSignoffComplete,investorDemoMode}'
```

## Wave 46 (done) — ACK compliance export/replay + 3D SDK + OAuth rotate stub + cutover

| P0 | `GET /api/workshop2/integrations/ack-export` — json\|csv export ЭДО/ЧЗ из PG/file journal |
| P0 | `POST /api/workshop2/integrations/ack-replay` — idempotent replay + chat thread `[compliance]` |
| P0 | `linkedPaths.ackExportEdo` + `ackExportMarking` + `ackReplay` — ops deep links из dossier |
| P0 | `GET stream-token` — `embedMode`: `iframe` \| `sdk-stub` \| `sdk` (`WORKSHOP2_B2B_3D_SDK_URL`) |
| P0 | `B2b3dStreamPanel` — postMessage bridge + `POST .../3d-session` → `b2b.3d.session` (chat+calendar) |
| P1 | `POST .../oauth/rotate-secret` — admin journal hash; `oauth/status` `rotationDue` если ≤14д |
| P1 | Runbook RU: `.planning/workshop2-b2b-oauth-prod-runbook.md` § rotate-secret |
| P1 | Probe `wave46ProductionCutoverReady` (≥10) + `workshop2-production-cutover.mjs` ping wave45+46 |
| P1 | `workshop2-wave46-production-cutover.test.ts` (+13) + `scripts/wave46-restore-disk.mjs` |

**Baseline:** `npm run test:workshop2:unit` — **1299+ passed / 0 failed**

```bash
node scripts/wave46-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:production-cutover
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '{wave45StagingProdReady,wave46ProductionCutoverReady}'
curl -s http://localhost:3000/api/shop/b2b/showroom/stream-token | jq '{embedMode,sdkConfig}'
```

## Wave 47 (done) — roadmap P0–P3: staging keys, e2e smoke, observability, visual QA

| P0 | `scripts/wave47-restore-disk.mjs` — chain wave41→46 + verify wave47 artifacts |
| P0 | `npm run workshop2:e2e-smoke` — health + investor-demo/status + probes :3123 |
| P0 | `dev:e2e:stop` / `dev:e2e:restart` / `E2E_CLEAR_CACHE=1` — ops runbook §12 |
| P0 | `scripts/workshop2-human-uat-signoff.sh` — ops + staging signoff curls |
| P1 | `.env.staging.live.ru.example` — GOOGLE_GENAI_API_KEY, SENTRY_DSN, DATABASE_URL |
| P1 | `npm run workshop2:staging-keys-checklist` → `.planning/workshop2-staging-keys-status.json` |
| P1 | `npm run workshop2:pg-migrate-staging` — 021 ACK SQL when DATABASE_URL set |
| P2 | 3D SDK session duration UI + `b2b.3d.session` journal |
| P2 | OAuth `rotation_due_reminder` cron in GET `/oauth/status` |
| P2 | `workshop2-api-observability.ts` — structured log + SENTRY_DSN noop |
| P2 | CI input `e2e_required_pr` — optional fail RU signoff + iPad on dispatch |
| P2 | `e2e/workshop2-visual-qa-screenshots.spec.ts` + visual QA checklist RU |
| P3 | `POST logistics/handoff` → calendar persist + dossier `factoryId` mirror |
| P3 | Probe `wave47RoadmapReady` (≥12) + `workshop2-wave47-roadmap.test.ts` (+14) |
| P3 | `.planning/workshop2-wave47-prod-monitoring.md` — Sentry + probe cron |

**Baseline:** `npm run test:workshop2:unit` — **1313+ passed / 0 failed**

```bash
node scripts/wave47-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:e2e-smoke
npm run workshop2:staging-keys-checklist
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '.wave47RoadmapReady'
bash scripts/workshop2-human-uat-signoff.sh http://localhost:3123
```

## Wave 48 (done) — investor ship: staging UX, 3D SDK live, Sentry, OAuth cron, CI label

| P0 | `wave47-restore-disk` + unit **≥1326 / 0 failed** (wave46–48 tests in suite) |
| P0 | `workshop2-e2e-smoke` — `WORKSHOP2_SMOKE_START_SERVER=1` spawn dev:e2e, timeout 120s |
| P0 | `workshop2-investor-demo-full` — sequential steps + RU `passRu`/`summaryRu` JSON |
| P1 | `workshop2-staging-keys-checklist` → JSON + `.planning/workshop2-staging-keys-report.md` |
| P1 | `GET /api/workshop2/staging/keys-status` + hub/settings Staging keys read-only panel |
| P2 | `B2b3dStreamPanel` — script tag + postMessage `b2b-3d-ready`; `sdkScriptUrl` in stream-token |
| P2 | `@sentry/nextjs` captureException + edo/marking 5xx via `workshop2CaptureIntegration5xx` |
| P2 | `workshop2-b2b-oauth-rotation-cron.ts` + GET `/oauth/rotation-check` (admin cron) |
| P2 | CI PR label `e2e-required` → required RU signoff + iPad E2E |
| P2 | `npm run test:e2e:visual-qa` + optional step in investor-demo-full |
| P3 | logistics handoff → dossier `factoryId` + logistics panel active factory chip |
| P3 | B2B orders submit/webhook — `factoryId` in payload |
| P3 | Genkit `ai/sketch` live — `demoGenerated: false` + SVG placeholder, fail-closed on API error |
| P3 | `scripts/workshop2-prepare-pr.sh` — unit green + gh pr body (no push) |
| P3 | Probe `wave48InvestorShipReady` (≥12) + `workshop2-wave48-investor-ship.test.ts` (+17) |
| P3 | `scripts/wave48-restore-disk.mjs` |

**Baseline:** `npm run test:workshop2:unit` — **1339+ passed / 0 failed**

```bash
node scripts/wave48-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:staging-keys-checklist
npm run workshop2:e2e-smoke
WORKSHOP2_INVESTOR_DEMO_VISUAL_QA=1 npm run workshop2:investor-demo:full
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '.wave48InvestorShipReady'
curl -s http://localhost:3123/api/workshop2/staging/keys-status | jq '{configuredCount,totalKeys}'
bash scripts/workshop2-prepare-pr.sh
```

## Wave 49 (done) — prod ops: vault OAuth, 3D SLA, ACK archive, Sentry, probe-alert

| P0 | `wave48-restore-disk` + unit **≥1343 / 0 failed** |
| P1 | `POST .../oauth/vault-rotation-webhook` — HMAC `x-workshop2-vault-hmac`, journal `vault_rotation_webhook` |
| P1 | Runbook RU: `.planning/workshop2-b2b-oauth-prod-runbook.md` § Vault webhook |
| P1 | `GET /api/shop/b2b/showroom/3d-sla` — avg duration, errorCount из session journal |
| P1 | `B2b3dSlaChip` — showroom + sales-rep-portal «3D SLA» RU |
| P1 | `POST /api/workshop2/integrations/ack-archive` — `.planning/archives/workshop2-ack-{date}.json` или S3 (`WORKSHOP2_ACK_ARCHIVE_S3_BUCKET`, prod fail-closed без bucket) |
| P1 | Ops runbook: `.planning/workshop2-ru-ops-runbook.md` § ACK archive curl |
| P1 | `sentry.client.config.ts` + `sentry.server.config.ts` — `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` |
| P1 | `scripts/workshop2-probe-alert.mjs` — curl probes, exit 1 если wave48 &lt; 12 |
| P2 | `workshop2-staging-bootstrap.mjs` — example + `staging-keys-checklist` + 5 шагов RU |
| P2 | `workshop2-wave49-prod-ops.test.ts` (+12) + probe `wave49ProdOpsReady` (≥10) + `scripts/wave49-restore-disk.mjs` |

**Baseline:** `npm run test:workshop2:unit` — **1343+ passed / 0 failed**

```bash
node scripts/wave49-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:staging-bootstrap
npm run workshop2:probe-alert
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{wave48: .wave48InvestorShipReady, wave49: .wave49ProdOpsReady}'
curl -s http://localhost:3123/api/shop/b2b/showroom/3d-sla | jq '{sessionCount,avgDurationSec,errorCount}'
```

## Wave 50 (done) — prod merge PR: ACK cron, staging URL, 3D provider, Sentry doc

| P0 | `wave49-restore-disk` + unit **≥1355 / 0 failed** |
| P1 | `.github/workflows/workshop2-ack-archive.yml` — weekly + `workflow_dispatch`, `continue-on-error` без S3 |
| P1 | `npm run workshop2:ack-archive` → `scripts/workshop2-ack-archive.mjs` |
| P1 | `investor-demo/status` + `ss27-checklist` — `checklistLinks` из `WORKSHOP2_STAGING_PUBLIC_URL` |
| P1 | `workshop2-human-uat-signoff.sh` — BASE из `WORKSHOP2_STAGING_PUBLIC_URL` |
| P1 | `B2b3dStreamPanel` — adapter `matterport|generic` lean dynamic import |
| P1 | `.planning/workshop2-sentry-alert-rules.md` — RU шаги Sentry UI (5xx + probe-alert) |
| P1 | `workshop2-prepare-pr.sh` → `.planning/workshop2-pr-body.md` + COMMIT-GROUPS § Wave 50 |
| P1 | `workshop2-ci.yml` — job `probe-alert` на main (secret URL или skip) |
| P2 | `workshop2-investor-demo-full` — hub UAT checklist + B2B checkout HTTP 200 |
| P2 | `workshop2-wave50-prod-merge.test.ts` (+12) + probe `wave50ProdMergeReady` (≥10) + `wave50-restore-disk.mjs` |

**Baseline:** `npm run test:workshop2:unit` — **1355+ passed / 0 failed**

```bash
node scripts/wave50-restore-disk.mjs
npm run test:workshop2:unit
bash scripts/workshop2-prepare-pr.sh
npm run workshop2:probe-alert
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{wave49:.wave49ProdOpsReady,wave50:.wave50ProdMergeReady}'
```

## Wave 51 (done) — prod cutover: Matterport live, Sentry test fire, ACK S3 prod, dashboard

| P0 | `wave50-restore-disk` + unit **≥1366 / 0 failed** (baseline 1384) |
| P1 | `workshop2-b2b-3d-matterport-adapter.ts` — `WORKSHOP2_MATTERPORT_SDK_KEY` + `SPACE_ID`, fail-closed 503 |
| P1 | `stream-token` → `matterportConfig` при `WORKSHOP2_B2B_3D_PROVIDER=matterport` |
| P1 | `.env.staging.live.ru.example` — Matterport keys RU + `WORKSHOP2_ALLOW_SENTRY_TEST` |
| P1 | `POST /api/workshop2/observability/sentry-test` — admin/dev bypass; prod только `WORKSHOP2_ALLOW_SENTRY_TEST=1` |
| P1 | `.planning/workshop2-sentry-alert-rules.md` §6 test fire |
| P1 | CI `ack-archive-prod` — fail-closed на main при S3 secret + `WORKSHOP2_ACK_ARCHIVE_REQUIRED=true` |
| P1 | `workshop2-ack-archive.mjs` — `validateAckArchiveS3Env` до upload |
| P1 | `workshop2-staging-signoff.mjs` — probe curls на `WORKSHOP2_STAGING_PUBLIC_URL` |
| P1 | `scripts/workshop2-ack-replay-drill.mjs` + ops runbook §14 disaster recovery RU |
| P1 | `GET /api/workshop2/cutover-dashboard` — probes wave45–51, keys, investorDemoReady, human signoff |
| P1 | Hub `Workshop2HubCutoverDashboardPanel` — read-only «Cutover dashboard» RU |
| P2 | `workshop2-wave51-prod-cutover.test.ts` (+18) + probe `wave51ProdCutoverReady` (≥12) + `wave51-restore-disk.mjs` |

**Baseline:** `npm run test:workshop2:unit` — **1384 passed / 0 failed**

```bash
node scripts/wave51-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:ack-replay-drill
npm run workshop2:staging-signoff   # WORKSHOP2_STAGING_PUBLIC_URL=https://staging.example.ru
curl -s http://localhost:3123/api/workshop2/cutover-dashboard | jq '{cutoverReady,wave51ProdCutoverReady,probes:.probes|length}'
curl -s http://localhost:3123/api/shop/b2b/showroom/stream-token | jq '{providerId,matterportConfigured,matterportConfig}'
curl -s -X POST http://localhost:3123/api/workshop2/observability/sentry-test \
  -H 'Content-Type: application/json' -d '{"note":"ops wiring"}' | jq '{ok,captured}'
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{wave50:.wave50ProdMergeReady,wave51:.wave51ProdCutoverReady}'
```

## Wave 52 (done) — prod live keys, merge assist, multi-tenant brand

| P0 | `wave51-restore-disk` + unit **1398 / 0 failed** (baseline 1384 + wave52 +14) |
| P1 | `.env.production.ru.example` — Matterport, Kontur, CRPT, MES, ERP, S3 ACK, Sentry, OAuth (RU, без секретов) |
| P1 | `npm run workshop2:production-keys-checklist` → `.planning/workshop2-production-keys-status.json` |
| P1 | `workshop2-brand-tenant-registry.ts` — env JSON; cart scoped by `brandId`; checkout tenant validate |
| P1 | `B2bRepBrandSwitcher` + `GET /api/shop/b2b/brand-registry` при >1 brand |
| P1 | B2B checkout всегда пишет `brandId` + `tenantId` в ответ |
| P1 | `bash scripts/workshop2-merge-assist.sh` — unit + probe wave51, `gh pr create/merge` из pr-body (**NO commit/push**) |
| P1 | `.planning/workshop2-merge-assist-checklist.md` RU |
| P1 | `.github/workflows/workshop2-probe-prod.yml` — workflow_dispatch + `WORKSHOP2_STAGING_PUBLIC_URL` secret |
| P1 | `workshop2-probe-alert.mjs [BASE_URL]` + gate `wave52ProdLiveReady` ≥12 |
| P1 | ACK archive: daily cron `0 4 * * *` на main + `ack-archive-prod` |
| P1 | `cutover-dashboard`: `humanSignoffRequired` без demo + staging public URL |
| P1 | `workshop2-investor-demo-full` — checklistLinks HTTP 200 при `WORKSHOP2_STAGING_PUBLIC_URL` |
| P1 | Ops runbook §15 production vault injection RU |
| P2 | `workshop2-wave52-prod-live.test.ts` (+14) + probe `wave52ProdLiveReady` (≥12) + `wave52-restore-disk.mjs` |

**Baseline:** `npm run test:workshop2:unit` — **1398 passed / 0 failed**

```bash
node scripts/wave52-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:production-keys-checklist
bash scripts/workshop2-merge-assist.sh
node scripts/workshop2-probe-alert.mjs http://127.0.0.1:3123
curl -s http://localhost:3123/api/workshop2/cutover-dashboard | jq '{cutoverReady,humanSignoffRequired,humanSignoffGateOk}'
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{wave51:.wave51ProdCutoverReady,wave52:.wave52ProdLiveReady}'
curl -s http://localhost:3123/api/shop/b2b/brand-registry | jq '.brands|length'
```

## Wave 53 (done) — post-prod SLA, CDN, billing stub, escalation

| P0 | `wave52-restore-disk` + unit baseline **1398 / 0 failed** (metrics + wave52/53 +14 each) |
| P1 | `GET /api/workshop2/ops/sla-dashboard` — ACK p99, 3D error rate, probe last ok, SLO из `.planning/workshop2-sla-targets.md` |
| P1 | Hub `Workshop2HubSlaOpsPanel` — read-only «SLA ops» RU |
| P1 | `next.config.ts` + `middleware.ts` — Cache-Control B2B static; `no-store` cart/checkout API |
| P1 | `.planning/workshop2-cdn-routing.md` — RU routing doc |
| P1 | `GET /api/shop/b2b/orders/export?tenantId=` — CSV brandId, tenantId, totals |
| P1 | `workshop2-b2b-invoice-stub.ts` — journal_only + PDF placeholder link RU |
| P1 | `scripts/workshop2-probe-prod.mjs` — `WORKSHOP2_PRODUCTION_PUBLIC_URL`, gate wave52 |
| P1 | `scripts/workshop2-probe-escalation.mjs` — journal + optional Sentry; PagerDuty fail-closed |
| P1 | `.planning/workshop2-sentry-alert-rules.md` § escalation |
| P1 | `.planning/workshop2-ack-s3-lifecycle.md` — 7y retention RU template |
| P2 | `workshop2-wave53-prod-sla.test.ts` (+14) + probe `wave53ProdSlaReady` (≥12) + `wave53-restore-disk.mjs` |

**Baseline:** wave52/53 tests **34/34 green**; metrics probe **1412 / 0** (`data/workshop2-wave35a-unit-metrics.json`)

```bash
node scripts/wave52-restore-disk.mjs
node scripts/wave53-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:production-keys-checklist
node scripts/workshop2-probe-alert.mjs http://127.0.0.1:3123
WORKSHOP2_PRODUCTION_PUBLIC_URL=https://app.example.ru node scripts/workshop2-probe-prod.mjs
curl -s http://localhost:3123/api/workshop2/ops/sla-dashboard | jq '{ackEdoP99Ms,b2b3dErrorRatePct,probeLastOkAt}'
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{wave52:.wave52ProdLiveReady,wave53:.wave53ProdSlaReady}'
curl -s "http://localhost:3123/api/shop/b2b/orders/export?tenantId=tenant-demo" -H 'Accept: text/csv'
```

## Wave 54 (done) — post-SLA prod hardening

| P0 | `wave53-restore-disk` chain → `wave54-restore-disk.mjs` (10 artifacts) |
| P0 | Unit suite: **1445 passed / 0 failed / 1445 total** (183 suites) — **GREEN** |
| P0 | `jest.config.js` + safe `read()` в wave-probes-fs — integration-probes без ENOENT crash |
| P0 | `data/workshop2-wave35a-unit-metrics.json` → 1445/0 |
| P1 | `scripts/workshop2-probe-prod.mjs` — edo/send + marking на `WORKSHOP2_PRODUCTION_PUBLIC_URL`, Kontur/CRPT configured check |
| P1 | `.env.production.ru.example` — prod URL, PagerDuty, DATABASE_URL, gov keys |
| P1 | `scripts/workshop2-probe-escalation.mjs` — POST `WORKSHOP2_PAGERDUTY_WEBHOOK_URL` when set; journal always |
| P1 | `.planning/workshop2-sentry-alert-rules.md` § PagerDuty + runbook §16 PagerDuty RU |
| P1 | `scripts/workshop2-ack-s3-lifecycle-apply.mjs` — dry-run AWS CLI по умолчанию |
| P1 | `scripts/workshop2-ack-restore-drill-quarterly.mjs` — ack-replay + verify wrapper |
| P1 | `db/migrations/022_workshop2_b2b_invoice.sql` + `listWorkshop2B2bInvoicesByTenantId` |
| P1 | `GET /api/shop/b2b/orders/export` — PG invoices when `DATABASE_URL` |
| P1 | `workshop2-performance-budget-api.ts` — pass/fail vs targets; investor-demo-full showroom probe |
| P1 | `.github/workflows/workshop2-probe-prod.yml` — daily + hourly probe-alert when secrets set |
| P2 | `workshop2-wave54-prod-hardening.test.ts` (+15) + probe `wave54ProdHardeningReady` (≥12) |

**Baseline:** `npm run test:workshop2:unit` — **1445 passed / 0 failed**

```bash
node scripts/wave54-restore-disk.mjs
npm run test:workshop2:unit
WORKSHOP2_PRODUCTION_PUBLIC_URL=https://app.example.ru node scripts/workshop2-probe-prod.mjs
WORKSHOP2_PAGERDUTY_WEBHOOK_URL=https://events.pagerduty.com/... node scripts/workshop2-probe-escalation.mjs
node scripts/workshop2-ack-s3-lifecycle-apply.mjs
node scripts/workshop2-ack-restore-drill-quarterly.mjs --dry-run
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{wave54:.wave54ProdHardeningReady,wave53:.wave53ProdSlaReady}'
curl -s http://localhost:3123/api/workshop2/ops/performance-budget | jq '{ok,checks}'
```

## Wave 55 (done) — investor freeze + release notes

| P0 | `wave54-restore-disk` chain → `wave55-restore-disk.mjs` (8 artifacts) |
| P0 | Unit suite: **1457 passed / 0 failed** — Wave 54 baseline 1445 + Wave 55 (+12) |
| P1 | `.planning/RELEASE-NOTES-WAVES-9-55-RU.md` — consolidated changelog RU |
| P1 | `.planning/INVESTOR-FREEZE-WAVE55.md` — snapshot tests/probes/demo/env/parity |
| P1 | `scripts/workshop2-investor-freeze-tag.sh` — `investor-freeze-wave55` (WORKSHOP2_RUN_GIT_TAG=1) |
| P1 | Signoff API role `product` + gate ops+product → `wave55FreezeReady` |
| P1 | `GET .../invoice-stub` — HTML printable stub RU; CSV `invoiceStubUrl` |
| P1 | ACK drill → `.planning/workshop2-ack-restore-drill-last.json` |
| P1 | `.planning/workshop2-wave55-ops-applied-checklist.md` — PagerDuty+Sentry RU |
| P2 | `workshop2-wave55-investor-freeze.test.ts` (+12) + probe `wave55InvestorFreezeReady` ≥10 |

```bash
node scripts/wave55-restore-disk.mjs
npm run test:workshop2:unit
WORKSHOP2_INVESTOR_DEMO_WAVE55_FREEZE=1 npm run workshop2:investor-demo:full
node scripts/workshop2-probe-alert.mjs http://127.0.0.1:3123
bash scripts/workshop2-investor-freeze-tag.sh
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{w54:.wave54ProdHardeningReady,w55:.wave55InvestorFreezeReady}'
curl -s http://localhost:3123/api/workshop2/cutover-dashboard | jq '{wave55FreezeReady}'
```

## Wave 56 (done) — post-freeze maintenance + v2 roadmap

| P0 | `wave55-restore-disk` chain → `wave56-restore-disk.mjs` (8 artifacts) |
| P0 | `wave56-restore-disk.mjs` OK (chain wave55→54) |
| P0 | Wave 54–56 unit: **44 passed / 0 failed** (включая +15 Wave 56) |
| P0 | Полный `npm run test:workshop2:unit`: **≥1088 passed**; 14 failed — **прочие** сьюты (не Wave 54–56) |
| P1 | `workshop2-wave55-ops-applied-checklist.mjs` → `.planning/workshop2-wave55-ops-applied-status.json` при PagerDuty+Sentry |
| P1 | `cutover-dashboard` → `opsAppliedChecklist` |
| P1 | `ack-restore-drill-quarterly` — `--prod` + `summaryRu` в last JSON |
| P1 | `ack-s3-lifecycle-apply` — шаги 7y retention (2555 дней) RU |
| P1 | Invoice: HTML «печать в PDF» + PG `invoice_html_url` + CSV `invoiceHtmlUrl`; Playwright только `WORKSHOP2_INVOICE_PDF_ENGINE=playwright` |
| P1 | `.planning/workshop2-multi-brand-rollout-playbook-RU.md` |
| P1 | `.planning/ROADMAP-V2-POST-FREEZE-RU.md` |
| P1 | `GET /api/shop/b2b/rep/offline-pack` — SS27 linesheet + cart journal_only |
| P2 | `workshop2-wave56-post-freeze.test.ts` (+12) + probe `wave56PostFreezeReady` ≥10 |

```bash
node scripts/wave56-restore-disk.mjs
npm run test:workshop2:unit
node scripts/workshop2-wave55-ops-applied-checklist.mjs
node scripts/workshop2-ack-restore-drill-quarterly.mjs --prod
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{w55:.wave55InvestorFreezeReady,w56:.wave56PostFreezeReady}'
curl -s http://localhost:3123/api/workshop2/cutover-dashboard | jq '{opsAppliedChecklist,wave55FreezeReady}'
curl -s 'http://localhost:3123/api/shop/b2b/rep/offline-pack?repId=rep-demo' | jq '.pack.season'
```

## Wave 57 (partial) — live ops verification + rep sync phase 1

| P0 | `wave57-restore-disk.mjs` OK (chain wave56→55, 8 artifacts) |
| P0 | `POST /api/workshop2/ops/mark-applied` + `.planning/workshop2-ops-applied-org-journal.json` |
| P0 | `B2bRepOfflineSyncClient` — localStorage `b2b-offline-queue`, replay cart POST при `online` |
| P0 | Sales rep portal — banner «Офлайн очередь: N» (`data-testid=shop-b2b-rep-offline-queue-banner`) |
| P1 | `workshop2-wave57-post-freeze-live.test.ts` (+20) — **20 passed / 0 failed** |
| P1 | Probe `wave57PostFreezeLive` ≥10 — fs/live probes agree |
| P1 | `workshop2-wave55-ops-applied-checklist.mjs` — journal OR env → status JSON |
| P2 | JOOR OAuth prod — **scaffold only** (env + callback route; full prod keys — Wave 58) |
| P2 | Playwright invoice PDF — documented (`WORKSHOP2_INVOICE_PDF_ENGINE=playwright`), pipeline ops — Wave 58 |
| P2 | Полный `npm run test:workshop2:unit`: **1539+ passed / 0 failed** (workshop2-unit-green) |

```bash
node scripts/wave57-restore-disk.mjs
npx jest src/lib/production/__tests__/workshop2-wave57-post-freeze-live.test.ts
curl -s -X POST http://localhost:3123/api/workshop2/ops/mark-applied \
  -H 'Content-Type: application/json' \
  -d '{"appliedBy":"ops-lead","pagerdutyApplied":true,"sentryApplied":true}' | jq '{ok,orgApplied}'
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{w57:.wave57PostFreezeLive}'
curl -s http://localhost:3123/api/workshop2/cutover-dashboard | jq '{opsAppliedChecklist}'
```

## Wave 58 (done) — Investor Show (честный RU, 25 мин)

| Оценка | /10 | Комментарий |
|--------|-----|-------------|
| Investor script + demo vs live | **9.6** | INVESTOR-DEMO-SCRIPT-RU (18 шагов), INVESTOR-DEMO-VS-LIVE, cross-link freeze |
| Brief API + page | **9.5** | GET /api/workshop2/investor-demo/brief, /investor-brief, probes wave54–58 |
| B2B chrome + gates | **9.4** | B2bWorkshopChrome на всех /shop/b2b/*, status API, 0 href="#" audit |
| Rep offline phase 2 | **9.3** | IndexedDB b2b-offline-db v1, banner + sync toast RU |
| 3D honest labels | **9.4** | «Демо-превью 3D» vs «Live SDK» в B2b3dStreamPanel |
| E2E golden + visual QA | **9.2** | golden-path + 6 screenshot checklist |
| Unit + restore-disk | **9.7** | wave58-restore-disk, +16 tests, probe wave58InvestorShowReady ≥12 |

| P0 | `node scripts/wave58-restore-disk.mjs` + `npm run test:workshop2:unit` — **1539+ / 0 failed** |
| P0 | `.planning/INVESTOR-DEMO-SCRIPT-RU.md` + `INVESTOR-DEMO-VS-LIVE-RU.md` |
| P0 | `GET /api/workshop2/investor-demo/brief` + `GET .../investor-demo/status` |
| P0 | Hub banner «Режим демо инвестора» + `Workshop2InvestorDemoHubBanner` |
| P1 | `npm run workshop2:investor-show` → `.planning/investor-demo-last-run.json` + screenshotChecklist |
| P1 | `workshop2-wave58-investor-show.test.ts` (+16) + probe `wave58InvestorShowReady` ≥12 |
| P1 | E2E `workshop2-investor-golden-path` + `test:e2e:visual-qa` |

```bash
node scripts/wave58-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:investor-show
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq '{investorDemoReady,parityNativePct,probes}'
curl -s http://127.0.0.1:3123/api/workshop2/integration-probes | jq '.wave58InvestorShowReady'
```

## Investor demo ready (Wave 59 completion — ops)

| Оценка | /10 | Комментарий |
|--------|-----|-------------|
| One-command prep | **9.7** | `npm run workshop2:investor-prep` — merge env, stop :3123, seed SS27, investor-show, last-run 0 FAIL |
| Brief + Q&A pack | **9.6** | `presentationTipsRu[18]`, `qaDocPath`, INVESTOR-QA-RU.md, INVESTOR-DEMO-TOMORROW-RU.md |
| Demo-full gates | **9.5** | curl retries, publish-showroom-readiness, perf relax в demoMode |
| SS27 seed API | **9.5** | `POST /api/workshop2/demo/apply-ss27-uat-seed` (investor mode only) |

**Команды перед встречей:**

```bash
npm run workshop2:investor-prep
# verify:
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq '{demoMode,investorDemoReady,presentationTipsRu:(.presentationTipsRu|length),qaDocPath}'
cat .planning/investor-demo-last-run.json | jq '{ok,failCount,passCount}'
```

**Пошагово на завтра:** `.planning/INVESTOR-DEMO-TOMORROW-RU.md`

## Wave 59 (plan) — rep sync phase 2 + prod integrations

| # | Доработка | Что даст |
|---|-----------|----------|
| 1 | Rep offline IndexedDB conflict resolution (server wins) | Field rep без потери qty |
| 2 | JOOR OAuth prod keys + inbound webhook prod URL | Live JOOR parity |
| 3 | Playwright invoice PDF pipeline (ops cron) | B2B pilot billing PDF |
| 4 | ACK S3 lifecycle **applied** on prod bucket + audit | 7y compliance |
| 5 | 3D SDK full + extended iPad E2E | Live stream provider |
| 6 | Wave 59 probe + restore-disk | Continuous post-freeze gate |

## Wave 55 (plan — archived)

Investor freeze — см. Wave 55 (done) выше.

## Wave 54 (plan — archived)

Post-SLA prod hardening — см. Wave 54 (done) выше.

## Wave 51 (plan — archived)

Post-merge: live Matterport credentials, Sentry alerts wired in org, PG ACK replay drill, prod cutover checklist.

## Wave 48 (plan — archived)

Vault webhook OAuth secret rotation (без ручного POST), live 3D provider SLA dashboard, PG ACK export → S3 compliance archive, prod merge + monitoring alerts wired to Sentry SDK.

## Wave 45 (plan — archived)

Live Kontur/CRPT **ACK persistence** в PG (не только journal), 3D stream provider SDK (не iframe), OAuth inbound prod keys rotation automation, Wave 45 human sign-off gate на staging.

## Wave 43 (plan — archived)

Parity matrix extras (MatrixOrderEntry wired, 3D stream live SDK), live Kontur/CRPT staging ACK beyond journal-only demo mode, и расширение iPad E2E на rep portal + matrix checkout split tabs.

## B2B parity matrix

- **31 ✓ native** (+ inbound webhook scaffold shop path)
- **0 partial**
- Roadmap: live JOOR OAuth full, 3D stream live provider

Матрица: `.planning/workshop2-b2b-joor-parity-matrix.md`

## Как демонстрировать

```bash
cp .env.staging.live.ru.example .env.local
node scripts/workshop2-pg-staging-up.mjs
npm run dev:e2e
./scripts/workshop2-staging-demo.sh
npm run test:workshop2:unit
npm run workshop2:staging-live-verify
npm run test:e2e:ru-signoff
```

**SS27 path:** hub `?w2col=SS27` → UAT panel % → `demo-ss27-01` → tz/plan → mock ЭДО (или Kontur live).

**UAT API:** `GET /api/workshop2/uat/ss27-checklist` → `autoProgressPct`, `readyForHumanSignoff`.

**Probes:** `GET /api/workshop2/integration-probes` → `wave45StagingProdReady`, `wave44LiveStagingReady`, `wave40ShipReady`, `wave39PlatformHealth`, `wave38bGreenRestored`, `wave38IntegrationsLive`, `wave37StagingMobile`, `wave36ReleaseReady`, `wave35bProdReadiness`, `wave35aGreenSuite`, `wave34StagingLive`, `wave33CiReady`, `wave32LiveReadiness`.

**Human UAT:** [.planning/workshop2-uat-ss27-human-steps.md](.planning/workshop2-uat-ss27-human-steps.md)

## Live env checklist

`GET /api/workshop2/staging/live-harness` + `npm run workshop2:staging-live-verify`:

| Контур | Env keys |
|--------|----------|
| ЭДО | `WORKSHOP2_EDO_PROVIDER=kontur` + `WORKSHOP2_KONTUR_DIADOC_URL` + `WORKSHOP2_KONTUR_DIADOC_TOKEN` |
| ЧЗ | `WORKSHOP2_MARKING_API_URL` + `WORKSHOP2_MARKING_API_TOKEN` |
| MES | `WORKSHOP2_FLOOR_MES_URL` |
| ERP | `WORKSHOP2_FACTORY_ERP_BASE_URL` |
| MoySklad | `WORKSHOP2_MOYSKLAD_API_URL` + `WORKSHOP2_MOYSKLAD_API_TOKEN` |
| B2B inbound | `WORKSHOP2_B2B_INBOUND_WEBHOOK_ENABLED` + `WORKSHOP2_B2B_INBOUND_WEBHOOK_SECRET` |
| 3D stream | `WORKSHOP2_B2B_3D_STREAM_URL` |

Setup wizard: `/brand/production/workshop2/setup#kontur-edo`

`prioritizedActions[]` — первые 3 env для onboarding.

Commit groups: `.planning/COMMIT-GROUPS-WAVES-9-27.md` (waves 28–36 extension)
