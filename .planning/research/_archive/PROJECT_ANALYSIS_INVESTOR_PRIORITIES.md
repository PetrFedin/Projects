# Анализ монорепо: приоритеты и инвесторский фокус

**Дата:** 2026-05-11 · **Корень:** `/Users/petr/Projects` · **Канон фронта:** `_ai-share/synth-1-full` (см. корневой `AGENTS.md`, `docs/MIGRATION_FULL_CUTOVER.md`).

---

## Краткое резюме (executive summary)

Монорепо **Projects** — это **Next.js «Fashion OS»** в каталоге `**_ai-share/synth-1-full`** (BFF, UI, доменные контракты, Playwright, CI) плюс **отдельный Python FastAPI** (`pyproject.toml`, `app/main.py`) и инфраструктура GSD/Cursor/скриптов. Продуктовая ценность для демо и выручки концентрируется в **кабинете бренда (`/brand/*`)**, **ритейл/B2B shop (`/shop/*`)**, **операционных B2B-заказах** и растущем контуре **производство / Workshop 2 (ТЗ, tech pack, dossier)**. Тестовая база **существенная по Jest** (сотни файлов `**/__tests__/`**, плюс целевой `npm run verify`), **Playwright** — матрица смоков и API-контрактов (`e2e/README.md`). Риск для истории инвестору: **очень широкая поверхность UI** (сотни страниц в `src/app`) при смеси **канонических v1 API**, **legacy/archive B2B** и **демо read-model** — демо нужно **сужать до 3–7 экранов** с явной подписью «mock / demo tenant».

---

## 1. Карта кода и сервисов (по факту дерева)

### 1.1 Канонический фронт и BFF — `_ai-share/synth-1-full`


| Область               | Путь / якорь                                                                            | Назначение                                                                                                                                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **App Router (UI)**   | `src/app/` (~1000+ файлов в дереве)                                                     | Страницы: `**brand/`**, `**shop/`** (в т.ч. обширный `**shop/b2b/**`), `**client/**`, `**factory/**`, `**distributor/**`, `**admin/**`, `**academy/**`, публичные `**b/[brandId]**`, `**customer-360**`, и др.                                                                                         |
| **API Routes (Next)** | `src/app/api/**/route.ts`                                                               | **~130** файлов `route.ts` (оценка по glob): B2B operational (legacy + `**b2b/v1/*`**), shop/cart/session/inventory, processes, integrations, AI (`api/ai/*`), production, `**brand/workshop2/*`** (phase1-dossier, tech-pack), **cron**, **archive** интеграций (`b2b/archive/*`), headless v1 и т.д. |
| **Домен и навигация** | `src/lib/routes.ts`, `src/lib/types.ts`, `src/lib/b2b-features/`, `docs/domain-model/*` | Маршруты без «магических строк», B2B-фичи, канон домена (правила merge в `AGENTS.md`).                                                                                                                                                                                                                 |
| **Карта связей**      | `INTEGRATION_MAP.md`                                                                    | Вертикальные/горизонтальные связи data↔UI; приёмка экосистемы перекрёстно с `UNIFIED_ECOSYSTEM_VERIFICATION.md`.                                                                                                                                                                                       |


### 1.2 Python-бэкенд (вне Next)


| Область     | Путь                                                | Назначение (по метаданным)                                                                                                                                          |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FastAPI** | `app/main.py`, `pyproject.toml` (`synth-1-backend`) | Отдельный сервис: FastAPI, SQLAlchemy, asyncpg, JWT/passlib, redis; группа ML (torch, transformers, faiss). Не смешивать с BFF в Next без явной интеграции в доках. |


### 1.3 Прочее в корне монорепо

- `**tools/superpowers`**, `**.cursor/`**, `**.planning/**` — методология, агенты, GSD-roadmap (см. п. 5).
- `**scripts/**`, `**docs/**` (корень Projects) — bootstrap, MCP, SQL-патчи, миграционная политика.
- ~~`pw-demo/`~~ — субмодуль удалён; E2E только в `_ai-share/synth-1-full` (см. `docs/SUBMODULES.md`).

### 1.4 Явно не канон (политика репозитория)

- `**Projects/src/**` при наличии — **legacy**, не источник правды для фронта (`_ai-share/synth-1-full/AGENTS.md`).

---

## 2. Качество: короткие сигналы (evidence-based)


| Сигнал                       | Факт из репозитория                                                                                                                                                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jest**                     | `package.json`: `test`, `**verify`** = `typecheck:w2` + `typecheck:order-subset` + **Jest**; отдельный узкий набор `**test:contracts:b2b`**. Много тестов в `src/**/__tests__/`** (в т.ч. **workshop2**, **order**, **b2b**, **server/domain-events**).                                        |
| **Playwright**               | **18** файлов `e2e/*.spec.ts`: `smoke`, `**unified-ecosystem-smoke`**, `test:e2e:api`, shop-retail, factory snapshot, a11y, **workshop2-smoke**, **client-sewing-patterns**, и др. Документация порога: `e2e/README.md`.                                                                       |
| **Паттерн API**              | Роуты колокированы с `**__tests__/route.test.ts`** для части `**api/brand/workshop2/`**** и смежных brand API (плотная W2-тематика по дереву тестов). Hot paths: `**observeApiRoute`** (см. `AGENTS.md`).                                                                                      |
| **Дублирование / tech debt** | Параллель **legacy** `/api/b2b/operational-orders*` и `**/api/b2b/v1/operational-orders*`** с fallback в хуках (описано в `AGENTS.md`). Каталог `**api/b2b/archive/*`** — интеграционный архив. Огромное число маршрутов `**shop/b2b/*`** увеличивает риск «витрины фич» vs глубокой зрелости. |
| **Безопасность / auth**      | RBAC для B2B v1: `**B2B_V1_API_ENFORCE_ROLES`**, `b2b-v1-api-guard.ts`, `rbac.ts`, заголовки клиента в `AGENTS.md`. Cron/outbox: тесты вида `domain-event-outbox-cron-auth.test.ts`. Кросс-кабинет inventory: `shop-inventory-cross-cabinet.ts` (см. `AGENTS.md`).                             |
| **CI / smoke**               | Корень: `npm run smoke` → контрактный чек full; внутри full: `smoke:fast`, `verify`, e2e light / conditional shop-retail / ci-heavy (описано в `AGENTS.md` + `e2e/README.md`).                                                                                                                 |


---

## 3. Важность vs зрелость (P0–P3)

Ось **важность**: выручка / удержание B2B, операционный риск, история для инвестора. Ось **зрелость**: код + тесты + смоки vs в основном UI-заглушки/доки.


| Уровень | Важность            | Зрелость                                              | Примеры (обоснование)                                                                                                                                                                                       |
| ------- | ------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0**  | Высокая             | Высокая (контуры с verify / v1 / e2e:api)             | **B2B operational orders** (list/detail, v1 DTO, заметки), **integrations dashboard/export**, **domain events / health / outbox**, **shop** cart/session/orders/inventory API, **processes** workflow.      |
| **P1**  | Высокая             | Средняя (активная разработка, много unit + часть e2e) | **Brand production / Workshop 2**: phase1-dossier API, tech-pack (S3/presign/complete — см. `AGENTS.md`, preflight `npm run w2:techpack:preflight`), **organization** hub, связка планирование ↔ коллекция. |
| **P2**  | Средняя             | Смешанная                                             | **Academy**, **PIM / products**, **control-center**, **analytics-360**, часть **factory/distributor** — сильный UI, зрелость по сценарию неоднородна.                                                       |
| **P3**  | Ниже для core pitch | Часто низкая / exploratory                            | Длинный хвост `**shop/b2b/*`** (десятки сценариев в одном смоке как URL-лист — см. `e2e/README.md`), маркетинговые/edge страницы без выделенного контрактного CI.                                           |


---

## 4. Ценность сейчас vs шум (с уверенностью)


| Наблюдение                                              | Добавляет ценность сейчас                                                          | Уверенность                                |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| Узкий **операционный контур** B2B + интеграции + export | Да — есть прямые API-тесты и доменные тесты                                        | **Высокая**                                |
| **Workshop 2 / tech pack / dossier**                    | Да для «производство + данные» в pitch; требует честного статуса env (S3/Postgres) | **Высокая**                                |
| **Unified ecosystem smoke**                             | Да для целостности демо и регрессии навигации                                      | **Высокая**                                |
| Весь перечень **shop/b2b/** как «продукт»               | Часто **шум** для инвестора без отдельной зрелости по экрану                       | **Средняя**                                |
| **Python FastAPI** как часть демо                       | Только если сознательно подключён к сценарию; иначе отвлекает от канона Next       | **Средняя**                                |
| **Backlog GSD 999.x** (PO ↔ ядро)                       | Пока **парковка** планов, не текущий shipped spine                                 | **Высокая** (текст `.planning/ROADMAP.md`) |


---

## 5. Согласование с планированием и дорожными картами

- `**.planning/ROADMAP.md`** — активная веха минимальна; в backlog зафиксирована фаза **999.1** (PO ↔ ядро, матрица, `stepId`, бандл) — **не смешивать** с готовым демо без promote.
- `**_ai-share/synth-1-full/docs/roadmap/ENTERPRISE-Q1.md`** — якорь процесса в `AGENTS.md` (enterprise Q1, strict subset линта/типов); при работе в IDE файл может быть недоступен из-за `.cursorignore`.
- **W2 tech pack:** `docs/W2_TECHPACK_PILOT.md`, `env.w2-techpack.example`, `npm run w2:techpack:preflight` — см. `AGENTS.md`.
- `**docs/PLAN-phase2-repo-and-hub.md`**, `**src/app/brand/organization/NEXT_IMPROVEMENTS.md`** — вход в «фазу 2» хаба (цитата из `AGENTS.md`).

**Рекомендуемая последовательность для рабочего демо (2–4 недели):**

1. Зафиксировать **один demo-tenant** и список маршрутов из `**unified-ecosystem-smoke`** / `smoke.spec.ts` как «граница демо».
2. Довести **P0-контур**: B2B orders list → card → одна запись в v1 (или честный mock) + **integrations** карточка.
3. Добавить **один сценарий P1**: например **production hub** → артикул/коллекция → **dossier или tech-pack handoff** (в зависимости от готовности env), с подписью «pilot».
4. Не расширять **shop/b2b** поверхность до стабилизации spine.

---

## 6. Инвесторский минимум: «spine» демо (3–7 экранов)

**Цель:** показать **операционную платформу** + **производственный handoff**, не «все модули».


| #   | Экран / поток                                          | Зачем инвестору                | Данные: real vs mock                                                         |
| --- | ------------------------------------------------------ | ------------------------------ | ---------------------------------------------------------------------------- |
| 1   | **Brand hub / organization или control-center**        | «Command center» экосистемы    | Demo profile / **mock** OK при стабильных `data-testid`                      |
| 2   | **B2B operational orders** (список)                    | Повторяемый B2B workflow       | **Demo read-model** или API v1 — как задокументировано в `AGENTS.md`         |
| 3   | **Карточка заказа** + действие (заметка / статус)      | Доказательство глубины         | Prefer **v1** + честная подпись если только demo store                       |
| 4   | **Integrations** (dashboard или ключевой виджет)       | История интеграций             | Контрактный ответ + **catalog summary** (константа источника в коде)         |
| 5   | **Production / planning** (коллекция → этап)           | Отличие от «ещё одного PIM»    | Смесь: **UI real**, данные частично **seed**                                 |
| 6   | **Workshop 2: dossier ИЛИ tech-pack download/handoff** | «Тяжёлая» мода, риск/комплаенс | **Real** только при S3/DB; иначе **mocked BFF** + экран «pilot requirements» |
| 7   | (Опционально) **Shop inventory** cross-link с brand    | Кросс-роль экосистемы          | Как в матрице приёмки (`AGENTS.md`)                                          |


**Как говорить честно:** отдельный слайд «**Shipped in repo**» (ссылки на `verify`, `test:e2e:api`, ключевые `route.ts`) vs «**Pilot / env-gated**» (W2, внешние интеграции) vs «**UX exploration**» (ширина `shop/b2b`).

---

## 7. Ссылки для углубления (без дублирования канона)

- `Projects/AGENTS.md` — монорепо, smoke, Node, bootstrap.
- `_ai-share/synth-1-full/AGENTS.md` — канон full, скрипты, RBAC, B2B v1, W2, строгий subset.
- `_ai-share/synth-1-full/e2e/README.md` — матрица Playwright.
- `_ai-share/synth-1-full/INTEGRATION_MAP.md` — интеграции.
- `.planning/ROADMAP.md` — backlog фаз.

---

## Примечание о пути файла

Запись в `**_ai-share/synth-1-full/docs/PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md`** в этой среде может быть запрещена правилами игнора; рабочая копия размещена здесь: `**.planning/research/PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md`**. При необходимости скопируйте файл в `docs/` локально вне агента.

---

*Документ сгенерирован агентом по обзору дерева, glob/grep и усечённому чтению файлов; не заменяет аудит безопасности.*