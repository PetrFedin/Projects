# Synth-1 — runbook

## Два корня

| Часть | Путь |
|--------|------|
| API | Репозиторий корень (`app/`, Poetry) |
| Web | `_ai-share/synth-1-full/` (отдельный `package.json`) |

## CI

Файл **`.github/workflows/ci.yml`**: на push/PR в `main` параллельно backend (`poetry install --without ml`, `pytest tests/smoke tests/unit`) и frontend в `_ai-share/synth-1-full/`: `npm ci`, **`npm run lint`** (`eslint.config.cjs`, области `src/lib` + корневой `lib/`), **`npm run typecheck:ci`** (`tsconfig.ci.json`, подмножество до полного `npm run typecheck`):

| Область | Путь в репозитории |
|---------|---------------------|
| Корневые типы/утилиты фронта | `_ai-share/synth-1-full/lib/**/*.ts` |
| Маршруты и каталог | `src/lib/routes.ts`, `src/lib/products.ts` |
| Репозитории и поиск | `src/lib/repositories/**`, `src/lib/repo/searchRepo.ts`, `src/lib/repo/aiStylistRepo.ts` |
| Сокеты и серверные архивы | `src/lib/websocket-service.ts`, `src/lib/server/workshop2-dossier-metrics-archive.ts` |
| Fashion domain | `src/lib/fashion/**/*.ts` |
| Production / Цех | `src/lib/production/**/*.ts` |
| Чистая логика (utils) | `src/lib/logic/**/*.ts` |
| Доменные TS-типы | `src/lib/types/**/*.ts` |
| B2B feature flags / типы | `src/lib/b2b-features/**/*.ts` |

Полный проект: `npm run typecheck` (без `-p`) — пока не обязателен в CI.

**`npm run build`**.

Локально backend-тесты: `poetry run pytest tests/smoke tests/unit` из корня (импорт `app` задаётся через `pythonpath` в `pyproject.toml`).

## Окружения (кратко)

- **UI без API:** не задавать `NEXT_PUBLIC_USE_FASTAPI` или `false`. См. `_ai-share/synth-1-full/src/lib/syntha-api-mode.ts`.
- **UI + FastAPI:** `NEXT_PUBLIC_USE_FASTAPI=true`, `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1`; в корне `.env` с `SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS`.

## Demo / mock (не путать с prod)

- **Backend:** `POST /api/v1/auth/login/access-token` не проверяет пароль; `get_current_user` строит пользователя из JWT (`app/api/v1/endpoints/auth.py`, `app/api/deps.py`).
- **Frontend:** при `USE_FASTAPI === false` часть API — локальные ответы (`collections-api.ts`, `demo-data.ts`).

## Brand Center — основной контур UI (`/brand`)

Кабинет бренда — отдельное дерево маршрутов под префиксом `/brand`. Его нельзя путать с публичной витриной бренда (`/b/[brandId]`, другой стек страниц и данных).

| Слой | Файл / модуль | Назначение |
|------|----------------|------------|
| Оболочка (навигация, KPI, контейнер страниц) | `_ai-share/synth-1-full/src/app/brand/layout.tsx` | `brandNavGroups` / `allBrandNavLinks` из `src/lib/data/brand-navigation.ts`, RBAC (`canSeeNavGroup`), `businessMode`, полоса KPI (мок + опционально FastAPI), `PageContainer`, `StageContextBar`, `Suspense` для `useSearchParams` |
| Главная страница профиля | `src/app/brand/page.tsx` | Табы `?group=` / `?tab=`, карточки разделов, синк профиля, ссылки на подразделы |
| Маршруты | `src/lib/routes.ts` → `ROUTES.brand.*` | В коде кабинета предпочитать константы, не строки |
| Синхронизация «профиля» (демо-хук) | `src/hooks/use-brand-profile-sync.ts` | При включённом FastAPI дергает `getBrandProfile` / `getBrandDashboard` / `getIntegrationsStatus`; без API — только локальный state |

**Демо-поведение внутри контура:** KPI в шапке и часть сценариев остаются на заглушках; при `NEXT_PUBLIC_USE_FASTAPI=true` и доступном API часть метрик может подставляться с сервера (`fastApiService.getDashboardKpis` в layout). Не интерпретировать моки как боевые метрики.

**Смежные зоны:** `/brand/academy/*` (отдельный `academy/layout.tsx`), `/brand/integrations/*`, календарь, документы — те же правила: клиентские компоненты, query-параметры, локальные сторы там, где нет бэка.

### Хаб «Связь»: сообщения и календарь (`/brand/messages`, `/brand/calendar`)

- **Навбар и лента:** `CommunicationsNavBar`, `CommunicationsUpcomingStrip`; дедлайны из `src/lib/data/calendar-events.ts` (`getDefaultUpcomingDeadlines`, `buildCalendarUrl` → `ROUTES.brand.calendar`).
- **Календарь (операционный UI):** `StyleCalendar` получает query с **родительской** страницы (`calendarLayers`, `calendarDate`, …), чтобы не вызывать `useSearchParams` внутри виджета (он встраивается и в admin/shop без Suspense). Слои из agenda (`?layers=orders,tasks`) мапятся на слои StyleCalendar через `src/lib/communications/calendar-bridge.ts`.
- **Сообщения:** `MessagesPage` + `mockChatHistories`; непрочитанные для бейджа — подсчёт по сообщениям **не от** `user_petr` без `readBy`, хранение прочитанного в `localStorage` (`message-read-state.ts`), синк с списком чатов и навбаром через `useBrandCommunicationsUnread`.
