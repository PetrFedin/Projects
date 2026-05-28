# Phase 2 — репозиторий, хаб, токены

Чеклист перенесён из плана по `synth-1-full` и монорепо. Статус обновлять по мере работ.

## A. Режимы и dev-контур

- [x] Path-based dev auto-login: только non-production; выключение `NEXT_PUBLIC_SYNTH_DEV_AUTO_LOGIN=false`; код в `synth-1-full/src/lib/auth/dev-auth-bootstrap.ts`.
- [x] Единый демо-пароль мока: `NEXT_PUBLIC_SYNTH_DEV_PASSWORD` или дефолт; баннер сессии `DevSessionBanner`.
- [x] Карта режимов (кратко): абзац в `_ai-share/synth-1-full/AGENTS.md` (USE_FASTAPI / mock / dev-auth).

## B. Гигантские TSX (приоритет по строкам / использованию)

- [x] Тонкий `/brand` — `src/app/brand/page.tsx` (редирект на `/brand/profile`).
- [x] Орг-обзор: типы вынесены в `organization-overview-content-types.ts` (композиция секций уже в `_components/`).
- [x] `production-page-content.tsx`: контракт `production-page-content-props.ts`, `cn` из `@/lib/utils`, без `as any`.
- [ ] `Workshop2Phase1DossierPanel.tsx` — дальше секции + хуки + типы; частично: `use-workshop2-phase1-dossier-send-handoff-bundles.ts`, `use-workshop2-phase1-dossier-tz-trace-and-preflight.ts`, `use-workshop2-phase1-dossier-sketch-pin-readiness.ts`, `use-workshop2-phase1-dossier-passport-audit-view-url.ts`, `use-workshop2-phase1-dossier-audience-and-attribute-rows.ts` (аудитория + строки каталога по фазам + extra/custom).
- [ ] `app/academy/page.tsx`, `syntha-product-card.tsx`, `tech-pack/[id]/page.tsx`, `Workshop2ArticleWorkspace.tsx`, … (см. `wc -l` по `src/**/*.tsx`).
- [ ] `b2b-state.tsx`, крупные home-секции — по одному модулю за PR.

## C. Демо → API

- [x] Фикстуры: `src/lib/dashboard/dashboard-demo-fixtures.ts` (дашборд), `src/lib/brand/analytics/platform-sales-demo-fixtures.ts` (platform-sales page).
- [x] Clienteling: `src/lib/brand/shop/clienteling-dash-demo-seed.ts` (даш `/shop/clienteling`); B2B/in-store поля — `src/lib/fashion/clienteling-demo-fixtures.ts` (`clienteling-hub`, `instore-clienteling`).
- [x] Хуки `usePaymentData` / `useCollaborativeOrder`: флаг `SYNTH_DASHBOARD_DEMO_MOCKS` + данные из fixtures.
- [x] CI: `npm run check:mock-fallback-contract` (входит в `check:contracts:ci`) — `src/lib/api/__tests__/mock-fallbacks-contract.test.ts`; при новом пути в `fastapi-service` добавляйте ключ в `mock-fallbacks.ts` и кейс в тест.

## D. Типы и `any`

- [x] `ai/genkit.ts` — извлечение `usage` из результата без `as any`; `withRetry` — `lastError: unknown`.
- [x] `src/lib/order/domain-events.ts` — `DomainEventHandler`, DLQ `error: string`, `validateEvent(unknown)`, без `(event as any).type`.

## E. Дедупликация UI

- [x] Archive-интеграции: `useArchiveIntegrationAction` + `archiveMessageFromB2bShape` — JOOR, NuORDER, SparkLayer, **Colect**, **Fashion Cloud**; парсер ошибок с `errors[]`; Zedonk — только исправление `await res.json()` на GET.
- [ ] B2B таблицы: общие обёртки / типы ответов.

## F. Орг-хаб (из `NEXT_IMPROVEMENTS.md`)

- [ ] Brand/dashboard агрегаты (retailer id, контрагенты).
- [ ] Карточки модулей / интеграции, партнёрская экосистема.
- [ ] CRPT / operational queue (Python), SQL из `scripts/sql/README.md`.

## G. Вес репо

- [ ] Не коммитить `.next*`, кеши, сгенерённые `route.js`.
- [ ] По возможности `dynamic()` для тяжёлых блоков.
- [ ] Осторожный прогон `knip` / удаление мёртвых страниц.
