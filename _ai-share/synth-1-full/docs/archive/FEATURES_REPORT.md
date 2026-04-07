# Отчёт по фичам проекта Syntha

Проверка: март 2026. Что работает, что нет, что улучшить.

---

## 1. Что работает (есть страница + навигация/ссылки)

### Brand (бренд-кабинет)
- **Организация:** `/brand`, `/brand/organization`, `/brand/team`, `/brand/integrations`, `/brand/integrations/webhooks`, `/brand/integrations/sso`, `/brand/subscription`, `/brand/documents`, `/brand/settings`, `/brand/security`
- **Логистика:** `/brand/logistics`, `/brand/warehouse`, `/brand/inventory`, `/brand/logistics/duty-calculator`, `/brand/logistics/consolidation`, `/brand/logistics/shadow-inventory`
- **Russian Layer:** `/brand/compliance`, `/brand/compliance/stock`
- **Центр управления:** `/brand/control-center`, `/brand/dashboard`
- **Продукты:** `/brand/products`, `/brand/products/create-ready`, `/brand/products/matrix`, `/brand/colors`, `/brand/planning`, `/brand/range-planner`, `/brand/products/digital-twin-testing`, `/brand/weather-collections`
- **B2B:** `/brand/showroom`, `/brand/b2b/linesheets`, `/brand/b2b/linesheets/create`, `/brand/b2b-orders`, `/brand/retailers`, `/brand/distributors`, **Territory / Pre-Order Quota / Sub-Agent Commission:** `/brand/distributor/territory`, `/brand/distributor/pre-order-quota`, `/brand/distributor/commissions`, `/brand/investing`, `/brand/credit-risk`, `/brand/last-call`
- **B2C:** `/brand/pre-orders`, `/brand/bopis`, `/brand/gift-registry`, `/brand/customers`, `/brand/customer-intelligence`
- **Производство:** `/brand/production`, `/brand/factories`, `/brand/materials`, `/brand/materials/reservation`, `/brand/production/ready-made`, `/brand/vmi`, `/brand/suppliers`, `/brand/suppliers/rfq`, `/brand/production/fit-comments`, `/brand/production/gold-sample`, `/brand/production/gantt`, `/brand/production/daily-output`, `/brand/production/worker-skills`, `/brand/production/qc-app`, `/brand/production/milestones-video`, `/brand/production/subcontractor`
- **Маркетинг:** `/brand/kickstarter`, `/brand/promotions`, `/brand/marketing/samples`, `/brand/marketing/trend-sentiment`, `/brand/marketing/heritage-timeline`, `/brand/marketing/design-copyright`, **Style-Me Upsell**, **Local Inventory Ads:** `/brand/marketing/style-me-upsell`, `/brand/marketing/local-inventory-ads`
- **Контент:** `/brand/content-hub`, `/brand/marketing/content-factory`, `/brand/media`, `/brand/blog`, `/brand/live`
- **Аналитика:** `/brand/analytics-bi`, **Analytics Phase 2**, **План vs Факт:** `/brand/analytics/phase2`, `/brand/analytics/budget-actual`, `/brand/analytics-360`, `/brand/analytics`
- **Финансы:** `/brand/pricing`, `/brand/pricing/price-comparison`, `/brand/pricing/elasticity`, `/brand/pricing/markdown`, `/brand/finance`, `/brand/finance/landed-cost`, `/brand/finance/escrow`
- **Защита:** `/brand/disputes`, `/brand/returns-claims`, `/brand/auctions`
- **AI:** `/brand/ai-design`, `/brand/ai-tools`

### Shop (магазин/ритейлер)
- **B2C:** `/shop/orders`, `/shop/inventory`, `/shop/promotions`, `/shop/clienteling`, **BOPIS**, **Endless Stylist Tablet**, **BNPL**, **Cycle Counting**, **LIA**, **Endless Aisle**, **Ship-from-Store:** `/shop/bopis`, `/shop/stylist-tablet`, `/shop/bnpl`, `/shop/inventory/cycle-counting`, `/shop/local-inventory-ads`, `/shop/endless-aisle`, `/shop/ship-from-store`
- **B2B:** `/shop/b2b`, `/shop/b2b/catalog`, `/shop/b2b/matrix`, `/shop/b2b/whiteboard`, `/shop/b2b/landed-cost`, `/shop/b2b/partners`, `/shop/b2b/partners/discover`, `/shop/b2b/stock-map`, `/shop/b2b/claims`, `/shop/b2b/orders`, `/shop/b2b/replenishment`, `/shop/b2b/tracking`, `/shop/b2b/budget`, `/shop/b2b/contracts`, `/shop/b2b/rating`, `/shop/b2b/documents`, `/shop/b2b/shopify-sync`, `/shop/b2b/video-consultation`, `/shop/b2b/vip-room-booking`, `/shop/b2b/pre-order`, `/shop/b2b/gamification`, `/shop/b2b/social-feed`, `/shop/b2b/order-modes`, `/shop/b2b/margin-calculator`, `/shop/b2b/multi-currency`, `/shop/b2b/analytics`, `/shop/b2b/margin-analysis`, `/shop/b2b/settings`
- **Прочее:** `/shop`, `/shop/analytics`, `/shop/calendar`, `/shop/messages`, `/shop/staff`, `/shop/store-locator` (как `/store-locator`)

### Client (клиент)
- **Работают:** `/client`, `/client/wardrobe`, `/client/try-before-you-buy`, `/client/gift-registry`, `/client/passport/[id]`, `/client/scanner`, `/client/allergy`, `/client/services`, `/client/style-me`, `/client/resale`, `/client/customization`, `/client/navigation/ar`
- **Есть также:** `/client/try-before-buy` (отдельная страница от try-before-you-buy)

---

## 2. Что не работает или неполно

### Битые ссылки в entity-links (клиент) — исправлено
- **`/client/orders`** — заменено на **`/orders`** в `getDigitalWardrobeLinks()` и `getTbybB2CLinks()`.
- **`/client/returns`** — добавлена заглушка **`/client/returns`** (страница «Возвраты» с описанием и ссылками на заказы и TBYB). Ссылка больше не ведёт в 404.

### Фичи только с UI (моки, без бэкенда)
Все недавно добавленные фичи работают **только на уровне интерфейса** с мок-данными и заглушками API:
- Analytics Phase 2, Endless Aisle POS, Ship-from-Store, Digital Wardrobe, Try Before You Buy (B2C)
- Style-Me Upsell, Endless Stylist Tablet, POS BNPL, Inventory Cycle Counting, Local Inventory Ads
- Territory Protection, Pre-Order Quota, Sub-Agent Commission, Supplier RFQ, QC App, Milestones Video, Subcontractor Hub, Digital twin testing, BOPIS, Gift Registry, План vs Факт

Это ожидаемо: «инфра под API», реальные вызовы нужно подключать отдельно.

### Digital Passport в навигации бренда
- В «Продукты» есть пункт **Digital Passport** с `href: '/client/passport/PASS-9921'` — захардкоженный ID. Для реального использования нужен переход на `/client/passport/[id]` с подстановкой ID из контекста или списка.

---

## 3. Что нужно и можно улучшить

### Сделано
1. **Ссылки в entity-links:** «Мои заказы» ведёт на `/orders`; добавлена страница-заглушка `/client/returns` для «Возвраты».

### Навигация и консистентность
2. **Клиентская навигация:** Digital Wardrobe и Try Before You Buy доступны из бренд-кабинета (B2C Продажи), но у клиента нет единого меню. Имеет смысл добавить в клиентский layout (или в профиль `/client`) пункты: «Мой шкаф», «Примерка (TBYB)», «Заказы», «Возвраты».
3. **Один источник правды для маршрутов:** вынести ключевые пути (например, `clientOrdersPath`, `clientReturnsPath`) в константы (например, в `entity-links` или `routes.ts`), чтобы не дублировать строки и избежать битых ссылок при переименовании.

### Фичи и UX
4. **Аналитика Phase 2:** на странице есть кнопка «Импорт 1С/Мой Склад» (disabled). При подключении API — включить и повесить вызовы импорта; при желании — добавить краткую инструкцию по настройке ETL.
5. **Endless Aisle / Ship-from-Store:** обратные ссылки «Назад» ведут на BOPIS и Orders — ок. При появлении API добавить реальные списки запросов/назначений и фильтры по статусу/дате.
6. **Digital Wardrobe:** синхронизация шкафа из заказов сейчас только в моках. При API — вызов `syncFromOrders` при входе на страницу или по кнопке «Обновить шкаф».
7. **Try Before You Buy (B2C):** при API — реальный холд средств, таймер «вернуть до», кнопки «Купить» / «Вернуть всё» с вызовом API.
8. **BNPL:** на странице указаны Тинькофф и Сбер. При интеграции — проверка 54-ФЗ и согласий; ссылка на раздел Compliance уже есть в entity-links.

### Техдолг и качество
9. **Типы и либы:** все перечисленные фичи имеют типы и константы API в `src/lib/` — при добавлении бэкенда достаточно реализовать вызовы по этим контрактам.
10. **Тесты:** на фичи из P0–P2 нет автотестов. Имеет смысл добавить хотя бы smoke-тесты страниц (рендер без падений) и, при появлении API, тесты на ключевые сценарии.
11. **Доступность:** на страницах с формами и кнопками проверить aria-labels и фокус (особенно в модалках и шагах TBYB).

### Документация
12. **Описание API-заглушек:** в каждом модуле в `src/lib/` уже указаны константы типа `*_API`. Можно добавить короткий README в `src/lib/` (или в проект) со списком модулей и планируемых эндпоинтов, чтобы упростить подключение бэкенда.

---

## 4. Сводная таблица

| Категория | Статус |
|-----------|--------|
| Страницы Brand (из навигации) | Работают (в т.ч. BOPIS, Gift Registry, Budget-Actual, Phase 2, Production, Supplier RFQ, Style-Me, LIA, Distributor) |
| Страницы Shop (из навигации) | Работают (BOPIS, Stylist Tablet, BNPL, Cycle Counting, LIA, Endless Aisle, Ship-from-Store и остальные) |
| Страницы Client (Wardrobe, TBYB) | Работают; ссылки «Мои заказы» и «Возвраты» ведут на несуществующие маршруты |
| Entity-links | Почти все ведут на существующие страницы; исключение — `/client/orders`, `/client/returns` |
| Реальные API | Не подключены; везде моки и заглушки |
| Навигация Brand/Shop | Соответствует существующим страницам |

---

*Отчёт сгенерирован по результатам проверки файловой структуры, навигации и entity-links.*
