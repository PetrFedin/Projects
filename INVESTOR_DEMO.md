# Fashion OS Synth-1 — Investor Demo Guide

MVP без подключения к внешним API. Вся инфраструктура готова для демонстрации и масштабирования.

## Профили и главные страницы

| Профиль | Главная | Доступные зоны |
|---------|---------|----------------|
| **Admin** | `/admin`, `/brand`, `/shop`, `/factory`, `/distributor` | Видит всё, полный доступ |
| **Brand** | `/brand` | Brand Hub: профиль, коллекции, B2B, производство, логистика, финансы |
| **Shop / Retailer** | `/shop`, `/shop/b2b` | B2B каталог, заказы, аналитика |
| **Distributor** | `/distributor` | Заказы, каталог, склад, аналитика |
| **Factory** (manufacturer/supplier) | `/factory` | Производство, заказы, compliance |
| **Client** | `/client` | Wardrobe, Try Before Buy, Wishlist, Catalog, Passport, Returns |

**RBAC**: пункты Brand sidebar фильтруются по роли. Admin видит все разделы. Остальные — только ресурсы, к которым есть доступ (b2b_orders, production, warehouse, finance, analytics, team, compliance, edo, settings).

## Что работает без API ключей

### 1. Brand Hub
- **GET /api/v1/brand/profile/{brand_id}** — профиль бренда (Organization из БД или demo)
- **GET /api/v1/brand/dashboard/{brand_id}** — KPIs: заказы, шоурумы, linesheets из БД
- **GET /api/v1/brand/integrations/status/{brand_id}** — статус интеграций (not_configured когда ключи не заданы)

### 2. Global Search (Cmd+K)
- **GET /api/v1/search?q=** — поиск по Order, Organization, FeatureProposal, Showroom + статические страницы
- Работает на данных из БД без Elasticsearch

### 3. Dashboard
- **GET /api/v1/dashboard/** — KPIs из OrderRepository, Showroom, Linesheet, Task
- Fallback на demo-значения при пустых таблицах

### 4. Интеграции (готовы к подключению)
- **CDEK** — `CDEK_CLIENT_ID`, `CDEK_CLIENT_SECRET` → расчёт доставки, трекинг
- **Честный ЗНАК** — `CRPT_CLIENT_ID`, `CRPT_CLIENT_SECRET`
- **ЭДО** — `DIADOC_API_KEY`, `KONTUR_EDO_TOKEN`
- **1С** — `C1C_BASE_URL`, `C1C_USER`, `C1C_PASSWORD`
- **Marketplace** — `SHOPIFY_*`, `OZON_*`, `WB_*` для Shopify, Ozon, Wildberries

### 5. Логистика
- **POST /api/v1/logistics/shipments/{order_id}/tracking** — сохранение CDEK uuid в Order.metadata_json
- **GET /api/v1/logistics/shipments/{order_id}** — статус доставки (CDEK при наличии uuid и ключей)

### 6. AI
- **GEMINI_API_KEY** — реальные LLM-вызовы (иначе mock)
- **poetry install --with ml** — CLIP + FAISS для визуального поиска

## Конфигурация для демо

```bash
cp .env.example .env
# Оставить ключи пустыми — всё работает в stub/demo режиме
```

## Что показать инвесторам

1. **Архитектура** — 80+ эндпоинтов, RBAC, multitenancy, AI orchestration
2. **Вертикальная интеграция** — Brand → PLM → Wholesale → Retail
3. **Горизонтальные события** — AI Rule Engine, cross-module triggers
4. **Расширяемость** — добавление `SHOPIFY_ACCESS_TOKEN` сразу включает Shopify sync
5. **Российский фокус** — CDEK, Честный ЗНАК, ЭДО, 1С в конфиге

## Главные страницы (hubs)

- **useIdentitySwitch**: client → `/client` (было `/u`)
- **Layouts**: Factory, Distributor, Client — единый хедер + навигация между хабами
- **Роль в header**: Shop и Admin показывают текущую роль (badge)
- **Empty state**: Shop — при отсутствии доступа к разделам показывается сообщение и ссылка на главную

---

| Hub | Маршрут | Layout | RBAC фильтрация |
|-----|---------|--------|-----------------|
| Brand | `/brand` | BrandSidebar, B2B/B2C mode | canSeeNavGroup (admin — всё) |
| Shop | `/shop` | shopNavGroups, subsections | canSeeShopNavGroup (retailer/buyer по ресурсам) |
| Admin | `/admin` | adminNavGroups | Только admin |
| Factory | `/factory` | Stub page | manufacturer, supplier, admin |
| Distributor | `/distributor` | Stub page | distributor, admin |
| Client | `/client` | Stub page | client, admin |

RouteGuard защищает все cabinet-маршруты. ClientLayout скрывает LeftSidebarNav на CABINET_ROUTES (включая /client).

## Маппинг профилей (код)

- `_ai-share/synth-1-full/src/lib/data/profile-page-features.ts` — PROFILE_MAIN_PAGES, RESOURCE_TO_ROUTES, NAV_GROUP_RESOURCE, canSeeNavGroup()
- `_ai-share/synth-1-full/src/lib/rbac.ts` — RBAC матрица, getPlatformRole, canAccess
- `_ai-share/synth-1-full/src/components/route-guard.tsx` — ROUTE_ROLES по префиксам

## Следующие шаги (post-MVP)

- Подключить реальные API ключи
- `poetry install --with ml` для CLIP/FAISS
- Миграции: `python -m app.db.migrations.create_agent_feedback_table`
