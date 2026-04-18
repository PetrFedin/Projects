# Разработка и развитие `synth-1-full` (единый контур)

Документ связывает **канон**, **перенос из доноров**, **настройки окружения**, **связи модулей** и **цикл фич** — чтобы не дублировать разрозненные указания из README / `AGENTS.md` / `INTEGRATION_MAP.md`.

## 1. Канон

| Что | Где |
|-----|-----|
| Единственное активное приложение Next.js | **`_ai-share/synth-1-full`** |
| Политика «только full» и порядок заморозки доноров | **`docs/CANONICAL_FULL.md`**, **`AGENTS.md`** (начало файла) |
| Указатели типов, API, CI | **`SOURCE_OF_TRUTH.md`** |
| Связи data↔UI, приёмка §6 | **`INTEGRATION_MAP.md`** |
| Монорепо и фазы D/E | **`docs/MONOREPO_INTEGRATION.md`** |

Доноры **`synth-1/`**, **`Projects/src/`** — только сравнение diff при переносе; новый продуктовый код туда не кладём.

## 2. Окружение и настройки

| Шаг | Действие |
|-----|----------|
| Node | **`nvm use`** по **`.nvmrc`** (см. **`package.json` → `engines`**) |
| Зависимости | **`npm ci`** в каталоге full |
| Локальные секреты | **`cp .envrc.example .envrc`** → **`direnv allow`** (`.envrc` не коммитим) |
| Дымок перед PR | **`npm run smoke:fast`**, **`npm test`**, при UI/API — профильный e2e из таблицы ниже |

Публичные режимы и моки: **`src/lib/runtime-mode.ts`** (см. **`README.md`**, раздел Runtime).

## 3. Структура репозитория (кратко)

- **`src/app/`** — маршруты App Router; **`src/app/api/`** — BFF.
- **`src/components/`** — UI; дизайн-система — **`src/components/design-system/`**.
- **`src/lib/`** — домен, **`routes.ts`**, навигация **`src/lib/data/shop-navigation*.ts`**, связи **`entity-links.ts`**.
- **`e2e/`** — Playwright; матрица demo — **`unified-ecosystem-smoke.spec.ts`**.
- **`.cursor/rules/`** — правила Cursor (ритейл: **`retail-shop-cabinet.mdc`**, миграция: **`donor-migration-before-freeze.mdc`**).

## 4. Связи между модулями

1. **Маршруты** — только **`ROUTES.*`** из **`src/lib/routes.ts`**, без строковых путей в новом коде.
2. **Навигация сайдбаров** — **`shop-navigation-normalized.ts`** (shop); B2B — см. **`b2b-hub-nav`** и `AGENTS.md`.
3. **Перекрёстные ссылки в UI** — **`get*` в `entity-links.ts`**, при необходимости **`finalizeRelatedModuleLinks`** / **`dedupeEntityLinksByHref`**.
4. **RBAC** — **`profile-page-features.ts`**, **`rbac.ts`**, guard для API (B2B v1 — см. **`AGENTS.md`**).
5. **Стабильные якоря для e2e** — **`src/lib/ui/test-ids.ts`**, профильные **`data-testid`** (ритейл: **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`**).

## 5. Цикл разработки фичи (чеклист)

1. Описать сценарий и маршрут(ы); добавить **`ROUTES.*`** в **`routes.ts`**.
2. Страница в нужный **`layout`**, навигация — **`shop-navigation-normalized`** или аналог.
3. Связанные модули — **`entity-links`** / RelatedModulesBlock по образцу соседних страниц.
4. API — **`docs/api-response-contracts.md`**, при необходимости **`observeApiRoute`**.
5. **`data-testid`** для критичных CTA и e2e.
6. Тесты: unit при логике; Playwright для HTTP/критичного UI; обновить **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`** при новом якоре матрицы (согласовать с **`INTEGRATION_MAP.md` §6**).
7. PR — **`/.github/pull_request_template.md`**; доменные изменения — канон **`docs/domain-model/*`** / **`TASK_QUEUE.md`** по **`AGENTS.md`.

## 6. Ритейл-кабинет `/shop`

Полный контур: **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`**. Продуктовый бэклог: **`docs/shop-retailer-cabinet-roadmap.md`** (если есть в репо).

| Команда | Назначение |
|---------|------------|
| **`npm run test:e2e:shop-retail`** | ERP API + сегменты аналитики + перекрёстные ссылки |
| **`npm run test:e2e:verification`** | В т.ч. дашборд `/shop`, footfall, хаб маржи |

## 7. Перенос с доноров

Порядок: **diff → встраивание в паттерны full → связи → смоки → затем** заморозка участка донора. Не слепой `cp`. Детали: **`docs/CANONICAL_FULL.md`**, правило **`.cursor/rules/donor-migration-before-freeze.mdc`**.

## 8. CI и качество

| Слой | Команда / файл |
|------|----------------|
| Быстрый контрактный smoke | **`npm run smoke:fast`** / **`check:contracts:ci`** |
| Полные guard-ы | **`npm run check:contracts`** |
| TypeScript | **`npm run typecheck`** (`tsconfig.typecheck.json`) |
| Линт / формат | **`npm run lint`**, **`npm run format:check`** |
| Монорепо workflow | **`.github/workflows/synth-1-full-ci.yml`** — `changes`, `ci-fast`, `ci-heavy` |

Узкие PR: **`docs/MONOREPO_PR_HYGIENE.md`**.

## 9. Дорожные карты и владельцы

- Квартальные приоритеты: **`docs/roadmap/ENTERPRISE-Q1.md`**
- Strict CI: **`docs/roadmap/STRICT_CI.md`**
- Владельцы модулей: **`docs/OWNERS.md`**

---

## 10. Единый стиль кабинетов (UI)

- **Токены:** `src/lib/ui/cabinet-surface.ts` — вкладки, бейджи, панели; не плодить альтернативные классы для тех же паттернов.
- **Страницы:** `RegistryPageShell` + `RegistryPageHeader` (`@/components/design-system`) для заголовков в духе реестра; крошки — как на соседних экранах кабинета.
- **Правило Cursor:** `.cursor/rules/cabinet-ui-consistency.mdc`.
- **RBAC и маршруты:** `profile-page-features.ts` + `ROUTES` / `entity-links`.

---

**Сопровождение:** при новом «центральном» процессе добавить секцию и ссылку из **`README.md`** / **`AGENTS.md`**. Длинные перечни маршрутов не дублировать — они в **`README.md`** и **`e2e/README.md`**.
