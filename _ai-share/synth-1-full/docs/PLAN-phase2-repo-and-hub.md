# Фаза 2 — репо, хаб организации, демо, «гиганты»

Согласованный бэклог после закрытия основных пунктов `src/app/brand/organization/NEXT_IMPROVEMENTS.md`. Чекбоксы для трекинга PR.

## Правила для агентов / ревью (экономия токенов)

- **Узкий read:** не читать файлы >500–800 строк целиком; сначала `grep` / поиск по символу, затем чтение с `offset`/`limit`.
- **Scope по фиче:** ревью и правки в пределах каталога, например `src/app/brand/organization/`, `src/components/brand/production/workshop2*` — не обходить весь `src/` без задачи.
- **Контракты API:** краткий JSDoc/TSDoc у `fastApiService` / хука (`useOrganizationHealth`, `useAttentionAlerts`) или один общий `types/api-brand.ts` — дубли длинных описаний в markdown не размножать; при появлении OpenAPI — ссылка из комментария.

---

## Волна A — гигиена и вес репозитория

- [ ] **`.gitignore` (корень монорепо + `synth-1-full`):** исключить `.next/`, `.next-codex/`, артефакты сборки, кэши; убедиться, что случайно закоммиченные `**/.next*` удалены из индекса (отдельный PR `chore:`).
- [ ] **`raw-chunk-*` / тяжёлые типы:** решение на уровне пайплайна — генерация из схемы, один JSON-артефакт вне git, или подмодуль; цель — меньше diff и контекста в чатах.

---

## Волна B — хаб организации и brand API

- [ ] **П.7 `growthByPeriod`:** не демо-мок в `partnerEcosystem`, а данные из тех же агрегатов, что счётчики, или отдельный лёгкий endpoint аналитики.
- [ ] **П.4 (хвост):** `integrationIssues` — стабильные **id** в `attentionAlerts` + dismiss на сервере (как cert/profile/task).
- [ ] **Health:** клиентский **кэш / stale-time** для health bundle; метрики «Безопасность», «Документы», «Настройки» — доменные значения или явный `placeholder` без влия на `overallHealth`, пока нет данных.

---

## Волна C — сплит «гигантов» (по одному PR на файл)

Критерий готовности PR: **`npm run typecheck`**, страница открывается в dev без регрессии маршрута.

- [ ] **`Workshop2Phase1DossierPanel.tsx`** — shell + секции / lazy по табам.
- [ ] **`src/app/brand/profile/page.tsx`** — вынести табы в `_components/`, хуки для данных.
- [ ] **`src/app/academy/page.tsx`** — секции + данные из `lib`/API.

---

## Волна D — демо и дубли с бэкендом

- [ ] **`fastapi-service.ts` `MOCK_FALLBACKS`:** вынести в отдельный модуль/JSON, оставить минимальный набор для MVP-режима без FastAPI.
- [ ] **`organization/page-data` vs демо:** один источник демо-констант рядом с хабом (`organization-demo-data`), в `page-data` — типы и merge с API.
- [ ] **Слоты интеграций:** при изменении UI каталога синхронизировать `app/integrations/hub_catalog.py` (одна таблица слотов в комментарии в обоих местах).

---

## Волна E — операции и бэкенд вне фронта

- [ ] SQL на живых БД: `inventory_sync_logs_organization_id`, `organization_attention_dismiss_json`.
- [ ] По контракту: **CRPT / operational outbox** в Python (если принято архитектурно).

---

## Связанные документы

- Текущий скоуп хаба: `src/app/brand/organization/NEXT_IMPROVEMENTS.md`
- Иерархия UI: `docs/ORGANIZATION_OVERVIEW_UI_HIERARCHY.md`
- PR-гигиена монорепо: `docs/MONOREPO_PR_HYGIENE.md`
