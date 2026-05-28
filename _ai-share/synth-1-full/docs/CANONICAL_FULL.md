# Канон: только `synth-1-full`

## Правило порядка (обязательно)

**Продуктовую разработку вне канона** (корневой **`Projects/src/`** и любые внешние копии дерева) **не ведём** — только перенос и приёмка в **`_ai-share/synth-1-full`**. Субмодуль **`synth-1/`** из корня монорепо **удалён**; исторический репозиторий при необходимости — вне этого репо (см. **`Projects/docs/MIGRATION_FULL_CUTOVER.md`**).

Порядок работ:

1. **Новые сценарии** — сразу в `_ai-share/synth-1-full` с паттернами канона: `routes.ts`, навигация, `entity-links`, RBAC, BFF/API, типы.
2. **Связи и приёмка** — перекрёстные ссылки между кабинетами, `data-testid`, E2E и строки в `docs/UNIFIED_ECOSYSTEM_VERIFICATION.md` по матрице.
3. **Смоки** — команды из `package.json`, профильные `test:e2e:*`.
4. **Legacy** — физическое состояние корневого **`Projects/src/`** и ворота D/E — по `docs/MONOREPO_INTEGRATION.md`, если документ ведётся для вашей ветки.

## Цель

В монорепо **один** фронтенд Next.js — **`_ai-share/synth-1-full`**.

## Правила для команд

1. **Весь новый код** — только в `_ai-share/synth-1-full`.
2. **Приёмка** — `npm run test:e2e:verification`, `test:e2e:api`, профильные `test:e2e:*` из `package.json` в этом каталоге.

## Связанные файлы

- `AGENTS.md` (в full) — операционные правила.
- `SOURCE_OF_TRUTH.md` — указатели канона и CI.
- `Projects/docs/MIGRATION_FULL_CUTOVER.md` — отказ от субмодуля `synth-1/`.
