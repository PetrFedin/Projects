# B2B Capability Gap Map (Фаза 0)

Источник инвентаризации: `getShopB2BHubLinks()` в `src/lib/data/entity-links.ts`.

## Легенда статусов

- `ready` — функционал уже присутствует в целевых ролевых кабинетах и связан workflow.
- `partial` — есть маршрут/экран, но нет полной межролевой связки или parity.
- `missing` — в ролевых кабинетах нет требуемого capability-layer.
- `duplicate` — дублирует существующий сценарий, подлежит консолидации.

## Полный инвентарный список фич и gap-статусы

| Фича из `/shop/b2b/catalog` | Source route                         | Owner роль           | Target role cabinets                | Статус    | Комментарий                                                      |
| --------------------------- | ------------------------------------ | -------------------- | ----------------------------------- | --------- | ---------------------------------------------------------------- |
| Каталог                     | `/shop/b2b/catalog`                  | shop                 | shop, brand                         | partial   | Базовый контур есть, но нет единого оффера с brand-side SoT      |
| Виртуальный шоурум          | `/shop/b2b/showroom`                 | shop                 | shop, brand                         | partial   | Есть route в shop и showroom в brand, нужна унификация сущностей |
| Заказы                      | `/shop/b2b/orders`                   | shop                 | shop, brand, admin                  | partial   | Вход в order flow есть, audit/админ связки частичные             |
| Финансы партнёра            | `/shop/b2b/finance`                  | shop                 | shop, brand, admin                  | partial   | Финансы в brand/shop есть, но нет единого e2e контроля           |
| JOOR Pay / оплата           | `/shop/b2b/payment`                  | shop                 | shop, brand, admin                  | partial   | Есть отдельный payment route, нужна связка с order lifecycle     |
| Документы B2B               | `/shop/b2b/documents`                | shop                 | shop, brand, factory, admin         | partial   | Документы разбросаны, нет сквозной матрицы состояний             |
| Контракты B2B               | `/shop/b2b/contracts`                | distributor          | distributor, shop, brand, admin     | partial   | Контрактный контур есть в distributor/shop, интеграция неполная  |
| Аналитика закупок           | `/shop/b2b/analytics`                | shop                 | shop, distributor, brand            | partial   | Аналитические поверхности есть, но не нормализованы              |
| Аналитика по заказам        | `/shop/b2b/order-analytics`          | shop                 | shop, brand, admin                  | partial   | Есть экран, нет канонического cross-role scorecard               |
| Fulfillment Dashboard       | `/shop/b2b/fulfillment-dashboard`    | brand                | brand, factory, shop, admin         | partial   | Требуется явный handoff brand->factory                           |
| Replenishment               | `/shop/b2b/replenishment`            | shop                 | shop, brand, factory                | partial   | Есть route, нет полной orchestration цепочки                     |
| Трекинг заказов             | `/shop/b2b/tracking`                 | shop                 | shop, brand, factory, admin         | partial   | Отдельный трекинг есть, event-витрина не едина                   |
| Календарь поставок          | `/shop/b2b/delivery-calendar`        | shop                 | shop, brand, factory                | partial   | Планирование есть, привязка к производственным этапам частичная  |
| Рекламации (RMA)            | `/shop/b2b/claims`                   | shop                 | shop, brand, admin                  | partial   | Есть route, но dispute/SLA flow не полностью сквозной            |
| Отчёты партнёра             | `/shop/b2b/reports`                  | shop                 | shop, distributor, admin            | partial   | Есть отчётность, но роль admin контролирует не все срезы         |
| Landed Cost                 | `/shop/b2b/landed-cost`              | shop                 | shop, brand, finance(admin)         | partial   | Финансовый расчёт есть, нет общей модели влияния на маржу        |
| Карта стока                 | `/shop/b2b/stock-map`                | shop                 | shop, brand, factory, supplier      | partial   | Есть поверхность в shop, supplier/factory parity ограничен       |
| Ритейл: загрузка остатков   | `/shop/inventory`                    | shop                 | shop, brand, factory                | partial   | Работает как bridge, но синхронизация ролей не полная            |
| Доска ассортимента          | `/shop/b2b/whiteboard`               | shop                 | shop, brand, distributor            | partial   | Есть инструмент, но стандарты перехода в order flow частичные    |
| Академия B2B                | `/shop/b2b/academy`                  | shop                 | shop, brand                         | partial   | Академия есть, role-specific learning map не унифицирован        |
| Календарь закупок           | `/shop/b2b/purchase-calendar`        | shop                 | shop, brand, distributor            | partial   | Route есть, связка с contract/collection terms неполная          |
| Условия по коллекциям       | `/shop/b2b/collection-terms`         | brand                | brand, shop                         | partial   | Требуется канон terms-source на стороне brand                    |
| Заказ по коллекции          | `/shop/b2b/order-by-collection`      | shop                 | shop, brand                         | partial   | Есть сценарий, нужен единый id/состояния                         |
| Шаблоны заказов             | `/shop/b2b/order-templates`          | shop                 | shop, distributor                   | partial   | Есть route, нет общей governance модели шаблонов                 |
| Черновики заказов           | `/shop/b2b/order-drafts`             | shop                 | shop, brand                         | partial   | Черновики есть, межролевой visibility ограничен                  |
| Быстрый заказ               | `/shop/b2b/quick-order`              | shop                 | shop                                | ready     | Функция локально завершена для buyer role                        |
| Reorder                     | `/shop/b2b/reorder`                  | shop                 | shop, brand                         | partial   | Нужна связь с historical brand availability                      |
| Pre-order                   | `/shop/b2b/pre-order`                | shop                 | shop, brand, factory                | partial   | Есть route, supplier/factory сигналы не полные                   |
| Маржа по брендам            | `/shop/b2b/margin-report`            | shop                 | shop, brand, admin                  | partial   | Метрики есть, нет единой финансовой модели                       |
| Режим заказа                | `/shop/b2b/order-mode`               | shop                 | shop                                | ready     | Локальный buyer UX стабилен                                      |
| Working Order               | `/shop/b2b/working-order`            | shop                 | shop, brand                         | partial   | Нужен канонический merge в order pipeline                        |
| Лукбуки                     | `/shop/b2b/lookbooks`                | brand                | brand, shop                         | partial   | Есть в shop, brand-side связки частичные                         |
| Кабинет агента              | `/shop/b2b/agent`                    | distributor          | distributor, shop                   | partial   | Фича есть, governance между ролями ограничен                     |
| Сводный заказ агента        | `/shop/b2b/agent/consolidated-order` | distributor          | distributor, shop, brand            | partial   | Требует единых правил апрува брендом                             |
| Grid Ordering               | `/shop/b2b/grid-ordering`            | shop                 | shop                                | ready     | Рабочий buyer инструмент                                         |
| Quote-to-Order              | `/shop/b2b/quote-to-order`           | distributor          | distributor, shop, brand            | partial   | Контур есть, межролевые статусы не унифицированы                 |
| Синхронизация Shopify       | `/shop/b2b/shopify-sync`             | admin/integration    | shop, admin                         | partial   | Интеграция есть, контроль ошибок и SLA needs hardening           |
| Режимы заказа (список)      | `/shop/b2b/order-modes`              | shop                 | shop                                | duplicate | Дублирует `order-mode`, нужна консолидация                       |
| EZ Order                    | `/shop/b2b/ez-order`                 | shop                 | shop                                | ready     | Локальный buyer сценарий готов                                   |
| AI Smart Order              | `/shop/b2b/ai-smart-order`           | shop                 | shop, brand                         | partial   | Есть экран, качество/обратная связь для brand ограничены         |
| Sales Rep Portal            | `/shop/b2b/sales-rep-portal`         | distributor          | distributor, shop, brand            | partial   | Есть route, требуется role RBAC clear-up                         |
| Онбординг партнёра          | `/shop/b2b/partner-onboarding`       | brand/distributor    | brand, distributor, admin           | partial   | Нужен единый статус в admin контроле                             |
| Мультивалютность            | `/shop/b2b/multi-currency`           | shop                 | shop, brand, finance(admin)         | partial   | Есть route, нужны сквозные правила пересчёта                     |
| Маппинг размеров            | `/shop/b2b/size-mapping`             | shop                 | shop, brand                         | partial   | Route есть, source-of-truth размеров не зафиксирован             |
| Custom assortments          | `/shop/b2b/custom-assortments`       | shop                 | shop, brand, distributor            | partial   | Есть surface, жизненный цикл ассортимента не унифицирован        |
| Подбор размера              | `/shop/b2b/size-finder`              | shop                 | shop                                | ready     | Локальный UX готов                                               |
| Рейтинг брендов             | `/shop/b2b/rating`                   | shop                 | shop, brand, admin                  | partial   | Требуется прозрачная scoring-модель                              |
| Челленджи и бейджи          | `/shop/b2b/gamification`             | shop                 | shop                                | partial   | Есть route, бизнес-ценность/интеграция ограничены                |
| Лента брендов               | `/shop/b2b/social-feed`              | shop                 | shop, brand                         | partial   | Контентный контур есть, транзакционная связка слабая             |
| Видео-консультация          | `/shop/b2b/video-consultation`       | shop                 | shop, brand                         | partial   | Есть route, заказные действия после консультации частичные       |
| VIP шоурум                  | `/shop/b2b/vip-room-booking`         | brand                | brand, shop                         | partial   | Нужна единая booking/attendance модель                           |
| Шаринг лукбука              | `/shop/b2b/lookbook-share`           | shop                 | shop, brand                         | partial   | Есть route, governance доступа не унифицирован                   |
| Планирование ассортимента   | `/shop/b2b/assortment-planning`      | shop                 | shop, brand, distributor            | partial   | Есть route, нужен единый план-факт цикл                          |
| OTB бюджет                  | `/shop/b2b/budget`                   | shop                 | shop, brand, finance(admin)         | partial   | Требуется привязка к фактическому order spend                    |
| Анализ маржи                | `/shop/b2b/margin-analysis`          | shop                 | shop, brand, admin                  | partial   | Частично покрыт, нет единых KPI-границ                           |
| Shoppable lookbook          | `/shop/lookbook/lb-fw26-1`           | shop                 | shop, brand                         | partial   | Route отдельный, нужно включение в канонический B2B flow         |
| Настройки B2B               | `/shop/b2b/settings`                 | shop                 | shop, admin                         | partial   | Есть route, не все policy параметры централизованы               |
| Checkout B2B                | `/shop/b2b/checkout`                 | shop                 | shop, brand                         | partial   | Есть checkout, post-checkout lifecycle needs unification         |
| Passport выставки           | `/shop/b2b/passport`                 | shop                 | shop, brand                         | partial   | Есть на обеих сторонах, но parity ограничен                      |
| Партнёры                    | `/shop/b2b/partners`                 | shop                 | shop, brand, distributor            | partial   | Нужна единая partner identity модель                             |
| Discover брендов            | `/shop/b2b/discover`                 | shop                 | shop, brand                         | partial   | Discover есть, но публикация/availability needs alignment        |
| AI Discovery Radar          | `/shop/b2b/partners/discover`        | shop                 | shop, brand                         | partial   | Route есть, валидность рекомендаций/feedback loop ограничены     |
| Заявка на партнёрство       | `/shop/b2b/apply`                    | shop                 | shop, brand, admin                  | partial   | Нужна прозрачная status-трассировка для всех ролей               |
| Тендеры B2B                 | `/shop/b2b/tenders`                  | distributor/supplier | distributor, supplier, brand, admin | partial   | Есть route, supplier кабинеты пока с сильным gap                 |
| Поиск поставщиков           | `/shop/b2b/supplier-discovery`       | supplier/distributor | supplier, distributor, brand        | partial   | Supplier role coverage ограничен                                 |
| Collaborative Order         | `/shop/b2b/collaborative-order`      | shop                 | shop, distributor, brand            | partial   | Есть route, права и версия документа нуждаются в доработке       |
| Margin Calculator           | `/shop/b2b/margin-calculator`        | shop                 | shop                                | ready     | Локальный калькулятор готов                                      |
| AI-поиск                    | `/shop/b2b/ai-search`                | shop                 | shop, brand                         | partial   | Есть route, нет общей relevance governance                       |
| Формирование селекции       | `/shop/b2b/selection-builder`        | shop                 | shop, brand, distributor            | partial   | Есть route, требуется унификация с assortment planning           |
| Sales App                   | `/shop/b2b/scanner`                  | shop                 | shop                                | ready     | Покрывает оперативный buyer сценарий                             |
| Личный кабинет дилера       | `/shop/b2b/dealer-cabinet`           | distributor          | distributor, shop                   | partial   | Есть route, межролевая политика доступа частичная                |
| Мои выставки                | `/shop/b2b/trade-shows`              | shop                 | shop, brand                         | partial   | Есть route + brand counterpart, нужно единое событие/статус      |
| Запись на встречи           | `/shop/b2b/trade-shows/appointments` | shop                 | shop, brand                         | partial   | Booking есть, lifecycle встречи не сквозной                      |
| Выставки (бренд)            | `/brand/b2b/trade-shows`             | brand                | brand, shop, admin                  | partial   | Brand route есть, cross-role аналитика ограничена                |

## Ролевые агрегированные gap-выводы

- `shop`: покрытие широкое, но много `partial` из-за слабой межролевой связки.
- `brand`: seller-core есть, нужна унификация статусов/идентификаторов с shop.
- `factory`: присутствуют базовые маршруты, но недостаточная привязка к B2B lifecycle.
- `supplier`: самый большой gap (роль представлена минимально, parity отсутствует).
- `distributor`: есть ключевые маршруты, но governance и cross-role flow неполные.
- `admin`: контрольные поверхности есть, но нет единого B2B lifecycle control dashboard.

## Top-10 критичных gap для закрытия (приоритет P0/P1)

1. Supplier parity для `supplier-discovery`, `tenders`, availability/compliance.
2. Factory handoff bridge: `brand b2b orders` -> `factory orders/production`.
3. Единый статусный словарь order lifecycle для всех ролей.
4. Admin сквозной timeline + audit для B2B заказа.
5. Консолидация duplicate surfaces (`order-mode` vs `order-modes`).
6. Unified partner identity между `shop/b2b/partners` и brand/distributor.
7. Сквозной документный контур (shop docs -> brand docs -> factory docs).
8. Каноническая финансовая модель (payment/finance/margin across roles).
9. Нормализация selection/planning surfaces.
10. E2E smoke coverage межролевых переходов.

## Exit-критерий для деактивации `/shop/b2b/catalog`

- Все P0/P1 gap закрыты.
- Для каждой capability в таблице есть канонический role-cabinet маршрут.
- `/shop/b2b/catalog` не нужен как обязательная операционная точка.
