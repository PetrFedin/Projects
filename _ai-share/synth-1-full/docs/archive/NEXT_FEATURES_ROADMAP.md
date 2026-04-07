# Следующие фичи: Fashion Lab — Marketroom, производство, заказы, аналитика

Приоритизация по **MASTER_PLAN.md** и **TASK_QUEUE.md** (без внешнего GitHub — опора на внутренний план). Фокус: маркетрум, производство, заказы, аналитика.

---

## 1. Аналитика (Analytics)

| Фича | Источник | Описание | Приоритет |
|------|----------|----------|-----------|
| **План vs факт (Budget vs Actual)** | MASTER_PLAN 2.2, TASK_QUEUE | Единый паттерн снимков для аналитики и бюджетов; сравнение плановых и фактических затрат по заказам/производству. Связь с `/brand/analytics-bi`, `budgetActual`. | **P0** |
| **Phase 2 Planning & Procurement Analytics** | TASK_QUEUE | ETL в fact_* и snapshot_* (модель уже есть в app/db); buying analytics API; дашборды закупок и планирования. | **P0** |
| **Статистика Marketroom и Аутлет** | routes: analyticsPlatformSales | Полная статистика продаж по платформам Маркетрум/Аутлет. | P1 |
| **Сводная аналитика (Unified)** | routes: analyticsUnified | Все каналы на одной платформе для полного анализа. | P1 |
| **Network Sell-Through BI** | MASTER_PLAN 2.2 | Анонимизированное сравнение своих продаж со средними по индустрии. | P2 |
| **Markdown Optimizer** | MASTER_PLAN 2.2 | AI-рекомендации по времени и глубине скидок. | P2 |
| **Geo-Demand Heatmap** | MASTER_PLAN 2.2 | Карта спроса для планирования точек и стока. | P2 |

---

## 2. Marketroom (Маркетрум)

| Фича | Источник | Описание | Приоритет |
|------|----------|----------|-----------|
| **Editorial CMS / журнал** | Уже реализовано (TASK_QUEUE) | Журнальный формат Marketroom, Shop-the-Look. Доработки: лента по сезонам, теги, лид-формы. | — |
| **Расширение Shop-the-Look** | MASTER_PLAN, PROJECT_MAP | Более глубокие луки из каталога, привязка к заказу/корзине, кросс-бренд. | **P0** |
| **AI Trend Radar (Marketroom)** | PROJECT_MAP | Тренд-радар в публичном Маркетруме. | P1 |
| **Контент из 1С/Excel** | entity-links | Импорт контента/каталога для Маркетрума из 1С или Excel (связь с analytics-bi?tab=import). | P2 |

---

## 3. Производство (Factory / Production)

| Фича | Источник | Описание | Приоритет |
|------|----------|----------|-----------|
| **GANTT Production Scheduler** | MASTER_PLAN §5, routes: productionGantt | Визуальный график загрузки линий и заказов. | **P0** |
| **Daily Output Tracking** | MASTER_PLAN §5, routes: productionDailyOutput | Ежедневные отчёты мастеров смен (план/факт по сменам). | **P0** |
| **Mobile QC App (AQL)** | MASTER_PLAN §5, productionQcApp | Приложение инспектора (AQL 2.5/4.0) с фотофиксацией брака. | P1 |
| **Worker Skill Matrix** | MASTER_PLAN §5, productionWorkerSkills | База компетенций швей и привязка к операциям. | P1 |
| **Milestones with Video Proof** | MASTER_PLAN §5, productionMilestonesVideo | Обязательная видео-фиксация этапов. | P2 |
| **Subcontractor Hub** | MASTER_PLAN §5, productionSubcontractor | Учёт работ, передаваемых на сторону. | P2 |
| **Automated Nesting AI** | MASTER_PLAN §5 | Оптимизация раскладки лекал (можно начать с мока/расчёта). | P2 |

*IoT Machine Monitoring уже в TASK_QUEUE как выполненный.*

---

## 4. Заказы (Orders / B2B)

| Фича | Источник | Описание | Приоритет |
|------|----------|----------|-----------|
| **Трекинг и отчёты партнёра** | Реализовано в текущей сессии | Отгрузка/доставка, «Мои отчёты», фильтры, CSV. Доработать: реальный API, уведомления. | — |
| **BOPIS Hub** | TASK_QUEUE, MASTER_PLAN 3.1 | Управление выдачей, примеркой и возвратом интернет-заказов (Buy Online, Pick Up In Store). | **P0** |
| **Gift Registry Manager** | TASK_QUEUE, MASTER_PLAN 3.1 | Списки подарков (свадьба/ДР) с отметкой купленного по сети. | P1 |
| **Order Approval Workflow (JOOR-style)** | routes: orderApprovalWorkflow | Многошаговое согласование заказа брендом. | P1 |
| **Order Amendments (заявки на изменение)** | routes: orderAmendments | Заявки магазинов на изменение заказа и их обработка. | P1 |

---

## Рекомендуемый порядок внедрения (ближайшие шаги)

1. **Аналитика:** План vs факт (единый снимок бюджет/факт) + привязка к существующей странице `/brand/analytics-bi` или `budgetActual`. Затем Phase 2: дашборды по закупкам/планированию на основе текущей analytics data model.
2. **Производство:** GANTT планировщик и Daily Output (план/факт по сменам) — дают быстрый визуал и связь с заказами.
3. **Заказы:** BOPIS Hub (выдача и возврат интернет-заказов в магазине) — усиливает омниканальность.
4. **Marketroom:** Расширение Shop-the-Look и, при наличии контента, AI Trend Radar.

Все маршруты и ссылки уже заданы в `src/lib/routes.ts` и `src/lib/data/entity-links.ts` — новые страницы можно подключать по существующим путям.
