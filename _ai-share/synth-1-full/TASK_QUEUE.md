# TASK_QUEUE.md — Очередь задач (v65.0)

## ✅ СУЩЕСТВУЮЩИЕ (DONE)

- [completed] Инициализация Landed Cost Engine (Финансовое ядро P0)
- [completed] Проектирование Digital Tech Pack 2.0 (Производственное ядро P0)
- [completed] Реализация Matrix Order Entry (Оптовое ядро P0)
- [completed] **Интеграция AI Body Scanner** (Клиентское ядро P0)
- [completed] **EDO Sync & Честный ЗНАК Integration** (Russian Layer P0)
- [completed] **Integration Hub (Connective Tissue)** - Связывание B2B и B2C стоков.
- [completed] **Landed Cost Engine (Logic & UI)** (Финансовое ядро P0)
- [completed] **AI SKU Planner** (Analytics P1) - Прогнозирование спроса.
- [completed] **Digital Tech Pack 2.0 (UI & Data Layer)** - Интерактивный паспорт изделия.
- [completed] **PR Sample Control (P0)** - RFID/QR учет перемещения образцов коллекции.
- [completed] **Escrow Milestone Engine (P0)** - Безопасные сделки и оплата этапов.
- [completed] **Global Duty Engine (P1)** - Расчет налогов и пошлин в реальном времени (DDP).
- [completed] **Digital Product Passport (P1)** - Генерация QR-кодов истории вещи.
- [completed] **Smart Logistics Consolidation (P1)** - Группировка грузов разных брендов.
- [completed] **Dispute Resolution Hub (P1)** - Арбитраж B2B-споров.
- [completed] **Clienteling 2.0 Dash (P1)** - Планшет продавца с AI-профилем клиента.
- [completed] **AI Design Assistant (P2)** - Генерация дизайна по текстовому описанию.
- [completed] **Editorial CMS (P2)** - Журнальный формат Marketroom (Admin + Public + ShopTheLook).
- [completed] **Headless Commerce API (P2)**: Инфраструктура, UI и API (Products + Orders) для внешних фронтендов.
- [completed] **Smart Fitting Rooms (P2)**: Интерфейс умного зеркала, Body Scan Sync и Styling AI.
- [completed] **VR Showroom 360 (P2)**: Виртуальное пространство (Brand + Buyer views) с активными хотспотами.
- [completed] **Dynamic ESL Sync (P2)**: Система синхронизации электронных ценников в реальном времени.
- [completed] **Shadow Inventory (P2)**: Продажа товаров "в пути" (Sell-in-Transit).
- [completed] **Role Dashboard Consolidation (P2)**: Структурная оптимизация навигации. Все функции вынесены внутрь соответствующих кабинетов. Реализован Client OS Dash.
- [completed] **Blockchain IP Ledger (P3)**: Реестр авторских прав на дизайны.
- [completed] **RFID Warehouse Gates (P3)**: Программная поддержка мгновенной приемки паллет.
- [completed] **Mass Customization Hub (P3)**: Платформа для индивидуального пошива.
- [completed] **Circular Economy Hub (P3)**: Учёт возвратов и перераспределение остатков сырья.
- [completed] **IoT Machine Monitoring (P3)**: Сбор данных о КПД каждой швейной машины.
- [completed] **AI Content Factory (P3)**: Автоматическая генерация маркетингового контента.
- [completed] **Staff Gamification (P3)**: Дашборд бонусов и наград продавцов.
- [completed] **Smart Store Footfall AI (P3)**: Анализ трафика и тепловые карты магазина.
- [completed] **In-store AR Navigation (P3)**: AR-навигация для клиентов в торговом зале.

## 🏗️ ТЕКУЩИЕ / В ПРОЦЕССЕ (IN PROGRESS)

- [in_progress] **Unified Ecosystem Verification**: Финальная проверка интеграции всех функций во все профили.
  - Подпункты приёмки (закрыть перед снятием флага): **`npm run check:contracts`**; на PR — **`npm run test:e2e:light`**; перед релизом или при смене hot paths — **`npm run test:e2e:verification`** и при необходимости **`npm run test:e2e:api`** (см. **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`**, **`INTEGRATION_MAP.md` §6**); локально **`nvm use`** по **`_ai-share/synth-1-full/.nvmrc`**.
  - Матрица: заголовки **`test('…')`** в **`e2e/unified-ecosystem-smoke.spec.ts`** ↔ строки в **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`** (порядок serial / не serial не ломать).

## 📦 OPEN-SOURCE INTEGRATION (см. OPEN_SOURCE_INTEGRATION.md, FASHION_PLATFORM_OSS.md)

- [completed] **Testing foundation**: Jest + RTL + jsdom + next/jest; компонентные тесты (Button) в составе `npm test`.
- [completed] **Sentry in logger**: reportError / logApiError отправляют в Sentry при настроенном DSN.
- [planned] **План vs факт**: единый паттерн снимков для аналитики и бюджетов; RBAC middleware FastAPI.

## 📊 PLANNING & PROCUREMENT ANALYTICS (backend: app/docs/ANALYTICS_DATA_MODEL.md)

- [completed] **Phase 1 — Analytics data model**: dimension, fact, snapshot tables в app/db/models/analytics.py; миграция create_analytics_tables. Связь: entity-links «Analytics (Planning & Procurement)» → /brand/analytics-bi.
- [planned] **Phase 2**: ETL в fact*\* и snapshot*\*; buying analytics API; дашборды.

## 📅 ЗАПЛАНИРОВАННЫЕ (PLANNED P0-P1)

1. **Gift Registry Manager (P3)**: Списки подарков с синхронизацией.
2. **BOPIS Hub (P3)**: Управление выдачей интернет-заказов в магазине.
3. **Fashion Social Investing (P3)**: Инвестиции в дропы брендов.
4. **Digital twin sample testing (P3)**: Виртуальная примерка новых моделей для фидбека.
