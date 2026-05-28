## Описание

<!-- Кратко: что меняется и зачем. -->

## Чеклист

- [ ] **Node** из **`_ai-share/synth-1-full/.nvmrc`** (`nvm use` / CI берёт версию из этого файла).
- [ ] **`npm run check:contracts:ci`** (или **`npm run smoke:fast`**) — без ошибок (как в **`ci-fast`**, live health без URL не ломает прогон).
- [ ] **`npm run check:contracts`** — перед merge локально, если трогали контракты, AI/client-границу или хотите совпасть с «полным» набором guard-ов.
- [ ] При существенных правках домена — **`npm test`**.
- [ ] При изменении HTTP-контракта health / ops — прогнан **`e2e/domain-events-health-api.spec.ts`** локально или задана **`DOMAIN_EVENTS_HEALTH_URL`** в CI (см. **`_ai-share/synth-1-full/docs/ci/DOMAIN_EVENTS_HEALTH_CI.md`**).

- [ ] Затронут домен (Order, Article, Inventory, Availability, SoT, публичный API)? → обновлены **`docs/domain-model/*`**, **`TASK_QUEUE.md`** и соответствующий **`*-boundaries-checklist.md`** (в каталоге **`_ai-share/synth-1-full`**) или отдельный ADR с исключением.
- [ ] Новый или изменённый HTTP-контракт → **`docs/api-response-contracts.md`** / Zod / клиент **`fetchWithHttpDeadline`** по месту (пути относительно **`_ai-share/synth-1-full`**).
- [ ] Затронуты маршруты, которые уже покрыты e2e → прогнан релевантный **`npm run test:e2e:*`** локально или добавлен label **`ci-heavy`** на PR.
- [ ] Не добавлен новый legacy API без записи в **`docs/ci/LEGACY_API_POLICY.md`** / ADR.

## CLI (опционально)

- **`gh`**: `brew install gh` → `gh auth login` → создание/просмотр PR: **`gh pr create`**, **`gh pr checks`**.

## Метки CI (опционально)

- **`ci-heavy`** — полный API Playwright + verification (см. **`.github/workflows/synth-1-full-ci.yml`**).
- **`ci-visual`** — визуальные снапшоты Playwright.
