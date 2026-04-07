# Полный аудит проекта Syntha

**Дата:** март 2026. Проверены все фичи, маршруты, навигация, entity-links, тесты и рекомендации по улучшению.

---

## 1. Методология проверки

- **Маршруты:** сверка пунктов навигации (Brand, Shop) и ссылок в `entity-links` с фактическими `page.tsx` в `src/app`.
- **Работоспособность:** учтены результаты smoke- и a11y-тестов (e2e), линтер.
- **Данные:** отмечено, где используются только моки (заглушки API) и где возможна интеграция с бэкендом.

---

## 2. Сводка по сегментам

| Сегмент | Маршрутов в навигации | Страница существует | Работает (smoke) | Данные |
|--------|------------------------|----------------------|-------------------|--------|
| **Brand** | ~95 | ✅ все | ✅ | Часть с моками, часть с реальными данными |
| **Shop** | ~35 | ✅ все | ✅ | Аналогично |
| **Client** | 5 (меню) + из Brand | ✅ все | ✅ | Моки на Wardrobe, TBYB, Returns |
| **Admin** | — | ✅ много | не в nav | Отдельный кабинет |
| **Factory / Distributor** | — | ✅ есть | — | Отдельные порталы |

---

## 3. Brand (бренд-кабинет)

### 3.1 Организация
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Центр управления | `/brand/organization` | ✅ | |
| Профиль бренда | `/brand` | ✅ | |
| Команда | `/brand/team` | ✅ | |
| Интеграции | `/brand/integrations` | ✅ | |
| Webhooks & API | `/brand/integrations/webhooks` | ✅ | |
| SSO | `/brand/integrations/sso` | ✅ | |
| Подписка | `/brand/subscription` | ✅ | |
| Документы | `/brand/documents` | ✅ | |
| Настройки | `/brand/settings` | ✅ | |
| Безопасность | `/brand/security` | ✅ | |

### 3.2 Логистика
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Центр логистики | `/brand/logistics` | ✅ | |
| Складской учёт | `/brand/warehouse` | ✅ | |
| Inventory | `/brand/inventory` | ✅ | |
| Global Duty Engine | `/brand/logistics/duty-calculator` | ✅ | |
| Консолидация грузов | `/brand/logistics/consolidation` | ✅ | |
| Shadow Inventory | `/brand/logistics/shadow-inventory` | ✅ | |

### 3.3 Russian Layer (Compliance)
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| ЭДО & Маркировка | `/brand/compliance` | ✅ | Честный ЗНАК, ЭДО |
| Складской учёт КИЗ | `/brand/compliance/stock` | ✅ | |

### 3.4 Центр управления
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Стратегический хаб | `/brand/control-center` | ✅ | |
| Операционный пульс | `/brand/dashboard` | ✅ | |

### 3.5 Продукты
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| PIM-центр | `/brand/products` | ✅ | |
| Карточка готового товара | `/brand/products/create-ready` | ✅ | |
| Матрица ассортимента | `/brand/products/matrix` | ✅ | |
| Colors | `/brand/colors` | ✅ | |
| Digital Passport | `/client/passport/PASS-9921` | ✅ [id] | Захардкожен ID; лучше ссылаться на список или контекст |
| Планирование | `/brand/planning` | ✅ | |
| Range Planner | `/brand/range-planner` | ✅ | |
| Digital twin sample testing | `/brand/products/digital-twin-testing` | ✅ | Моки, инфра под API |
| Weather-Driven Collections | `/brand/weather-collections` | ✅ | |

### 3.6 B2B продажи
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| B2B Шоурум | `/brand/showroom` | ✅ | |
| Лайншиты | `/brand/b2b/linesheets` | ✅ | |
| Digital Linesheet Builder | `/brand/b2b/linesheets/create` | ✅ | |
| B2B Заказы | `/brand/b2b-orders` | ✅ | |
| Shopify Sync | `/shop/b2b/shopify-sync` | ✅ | |
| Видео-консультация | `/shop/b2b/video-consultation` | ✅ | |
| Pre-order в checkout | `/shop/b2b/pre-order` | ✅ | |
| Try Before Buy (B2B) | `/shop/b2b/matrix` | ✅ | |
| Партнёры | `/brand/retailers` | ✅ | |
| Дистрибьюторы | `/brand/distributors` | ✅ | |
| Territory Protection | `/brand/distributor/territory` | ✅ | Моки, entity-links |
| Pre-Order Quota | `/brand/distributor/pre-order-quota` | ✅ | Моки |
| Sub-Agent Commission | `/brand/distributor/commissions` | ✅ | Моки |
| Fashion Social Investing | `/brand/investing` | ✅ | |
| Credit Risk Scoring | `/brand/credit-risk` | ✅ | |
| B2B Last Call | `/brand/last-call` | ✅ | |

### 3.7 B2C продажи
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Розничные заказы | `/brand/pre-orders` | ✅ | |
| BOPIS (самовывоз) | `/brand/bopis` | ✅ | Моки, ЭДО/маркировка |
| Список подарков | `/brand/gift-registry` | ✅ | Моки |
| Клиентская база | `/brand/customers` | ✅ | |
| CRM & Лояльность | `/brand/customer-intelligence` | ✅ | |
| Digital Wardrobe | `/client/wardrobe` | ✅ | Клиент; единое меню в layout |
| Try Before You Buy (B2C) | `/client/try-before-you-buy` | ✅ | Моки, холд |

### 3.8 Производство
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Цех (Live) | `/brand/production` | ✅ | |
| Фабрики | `/brand/factories` | ✅ | |
| Materials | `/brand/materials` | ✅ | |
| Material Reservation Hub | `/brand/materials/reservation` | ✅ | |
| Готовый товар | `/brand/production/ready-made` | ✅ | |
| VMI | `/brand/vmi` | ✅ | |
| Поставщики | `/brand/suppliers` | ✅ | |
| Fit Comments Log | `/brand/production/fit-comments` | ✅ | |
| Gold Sample Approval | `/brand/production/gold-sample` | ✅ | |
| GANTT | `/brand/production/gantt` | ✅ | |
| Daily Output Tracking | `/brand/production/daily-output` | ✅ | |
| Worker Skill Matrix | `/brand/production/worker-skills` | ✅ | |
| Mobile QC App | `/brand/production/qc-app` | ✅ | Моки |
| Milestones with Video Proof | `/brand/production/milestones-video` | ✅ | Моки |
| Subcontractor Hub | `/brand/production/subcontractor` | ✅ | Моки |
| Supplier RFQ | `/brand/suppliers/rfq` | ✅ | Моки |

### 3.9 Маркетинг и PR
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| AI Кампании | `/brand/kickstarter` | ✅ | |
| Промо и акции | `/brand/promotions` | ✅ | |
| PR Sample Control | `/brand/marketing/samples` | ✅ | |
| Trend Sentiment Radar | `/brand/marketing/trend-sentiment` | ✅ | |
| Brand Heritage Timeline | `/brand/marketing/heritage-timeline` | ✅ | |
| Design Copyright AI | `/brand/marketing/design-copyright` | ✅ | |
| Style-Me Upsell | `/brand/marketing/style-me-upsell` | ✅ | Моки, CRM/заказы/контент |
| Local Inventory Ads | `/brand/marketing/local-inventory-ads` | ✅ | Моки, склад/маркетинг/BOPIS |

### 3.10 Контент
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Content Hub | `/brand/content-hub` | ✅ | |
| Content Factory (CMS) | `/brand/marketing/content-factory` | ✅ | |
| Media & DAM | `/brand/media` | ✅ | |
| Блог | `/brand/blog` | ✅ | |
| Live | `/brand/live` | ✅ | |

### 3.11 Аналитика
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| B2B Analytics Hub | `/brand/analytics-bi` | ✅ | |
| Analytics Phase 2 | `/brand/analytics/phase2` | ✅ | Моки, ETL/buying API |
| План vs Факт | `/brand/analytics/budget-actual` | ✅ | Моки |
| Аналитика 360 | `/brand/analytics-360` | ✅ | |
| AI Прогнозы | `/brand/analytics` | ✅ | |

### 3.12 Финансы
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| AI Ценообразование | `/brand/pricing` | ✅ | |
| Сравнение цен | `/brand/pricing/price-comparison` | ✅ | |
| Price Elasticity | `/brand/pricing/elasticity` | ✅ | |
| Markdown Optimizer | `/brand/pricing/markdown` | ✅ | |
| Финансовый хаб | `/brand/finance` | ✅ | |
| Landed Cost Engine | `/brand/finance/landed-cost` | ✅ | |
| Escrow Engine | `/brand/finance/escrow` | ✅ | |

### 3.13 Арбитраж, ESG, AI, HR, Академия, Коммуникации
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Dispute Hub | `/brand/disputes` | ✅ | |
| Возвраты и рекламации | `/brand/returns-claims` | ✅ | |
| Аукционы | `/brand/auctions` | ✅ | |
| AI Design Assistant | `/brand/ai-design` | ✅ | |
| AI Body Scanner | `/client/scanner` | ✅ | |
| Генераторы образов | `/brand/ai-tools` | ✅ | |
| ESG Мониторинг | `/brand/esg` | ✅ | |
| Партнерства | `/brand/collaborations` | ✅ | |
| HR Hub | `/brand/hr-hub` | ✅ | |
| Вакансии и резюме | `/shop/career` | ✅ | |
| Академия бренда | `/brand/academy` | ✅ | |
| Академия платформы | `/academy` | ✅ | |
| Коммуникации (чаты, календарь) | из entity-links | ✅ | |

---

## 4. Shop (магазин / ритейлер)

### 4.1 B2C
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Дашборд | `/shop` | ✅ | |
| Заказы клиентов | `/shop/orders` | ✅ | |
| Склад и остатки | `/shop/inventory` | ✅ | |
| Акции и скидки | `/shop/promotions` | ✅ | |
| Клиентинг | `/shop/clienteling` | ✅ | |
| BOPIS (самовывоз) | `/shop/bopis` | ✅ | Моки, ЭДО/маркировка |
| Endless Stylist Tablet | `/shop/stylist-tablet` | ✅ | Моки |
| Рассрочка на кассе (BNPL) | `/shop/bnpl` | ✅ | Моки, Тинькофф/Сбер |
| Cycle Counting | `/shop/inventory/cycle-counting` | ✅ | Моки |
| Local Inventory Ads | `/shop/local-inventory-ads` | ✅ | Моки |
| Endless Aisle POS | `/shop/endless-aisle` | ✅ | Моки |
| Ship-from-Store | `/shop/ship-from-store` | ✅ | Моки |

### 4.2 B2B (магазин)
Все маршруты из shop-navigation (b2b/catalog, matrix, whiteboard, landed-cost, partners, discover, stock-map, claims, orders, replenishment, tracking, budget, contracts, rating, documents, shopify-sync, video-consultation, vip-room-booking, pre-order, gamification, social-feed, order-modes, margin-calculator, multi-currency, analytics, margin-analysis, settings) — **страницы есть**, проверены в smoke.

### 4.3 Прочее
| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Аналитика | `/shop/analytics` | ✅ | |
| Календарь | `/shop/calendar` | ✅ | |
| Сообщения | `/shop/messages` | ✅ | |
| Персонал | `/shop/staff` | ✅ | |
| Карта магазинов | `/store-locator` | ✅ | |

---

## 5. Client (клиент)

| Фича | Маршрут | Страница | Примечание |
|------|---------|----------|------------|
| Главная (дашборд) | `/client` | ✅ | |
| Мой шкаф (Digital Wardrobe) | `/client/wardrobe` | ✅ | Моки, единое меню |
| Try Before You Buy | `/client/try-before-you-buy` | ✅ | Моки |
| Заказы | `/orders` | ✅ | Общий маршрут заказов |
| Возвраты | `/client/returns` | ✅ | Заглушка, ссылки на заказы/TBYB |
| Список подарков | `/client/gift-registry` | ✅ | |
| Passport | `/client/passport/[id]` | ✅ | |
| Body Scan | `/client/scanner` | ✅ | |
| Аллергии и состав | `/client/allergy` | ✅ | |
| Услуги | `/client/services` | ✅ | |
| Style Me | `/client/style-me` | ✅ | |
| Resale | `/client/resale` | ✅ | |
| Кастомизация | `/client/customization` | ✅ | |
| AR навигация | `/client/navigation/ar` | ✅ | |
| Try Before Buy (другая) | `/client/try-before-buy` | ✅ | Отдельная от TBYB выше |

**Клиентская навигация:** в `ClientLayout` выведено единое меню (Главная, Мой шкаф, Try Before You Buy, Заказы, Возвраты). Маршруты заданы в `src/lib/routes.ts`.

---

## 6. Entity-links и MODULE_HUBS

- **MODULE_HUBS:** все `href` ведут на существующие страницы Brand (`/brand/...`).
- **getB2BLinks, getBopisLinks, getGiftRegistryLinks, getBudgetActualLinks, getOrderLinks, getTaskLinks, getPartnerLinks, getComplianceLinks, getSupplierLinks, getTerritoryProtectionLinks, getPreOrderQuotaLinks, getSubAgentCommissionLinks, getDistributorLinks, getProductionLinks, getOrgLinks, getLogisticsLinks, getProductLinks, getMarketingLinks, getAnalyticsLinks, getFinanceLinks, getArbitrationLinks, getEsgLinks, getCommLinks, getAcademyLinks, getAuctionLinks, getHRHubLinks, getDocumentsLinks, getIntegrationLinks, getClientAllergyLinks, getClientServiceBookingLinks, getDigitalTwinTestingLinks, getStyleMeUpsellLinks, getEndlessStylistLinks, getBnplLinks, getCycleCountingLinks, getLiaLinks, getAnalyticsPhase2Links, getEndlessAisleLinks, getShipFromStoreLinks, getDigitalWardrobeLinks, getTbybB2CLinks, getEventEntityLinks:** ссылки проверены; клиентские пути используют `ROUTES.client.*` из `src/lib/routes.ts`. **Битых ссылок нет.**

---

## 7. Что не работает или ограничено

1. **Digital Passport в навигации бренда:** ссылка `/client/passport/PASS-9921` с захардкоженным ID. Лучше вести на список паспортов или формировать ссылку из контекста (например, `/client/passport/[id]` с подстановкой ID).
2. **Фичи только на моках:** перечисленные в FEATURES_REPORT фичи (Analytics Phase 2, Endless Aisle, Ship-from-Store, Wardrobe, TBYB, Style-Me, Stylist Tablet, BNPL, Cycle Counting, LIA, Territory, Pre-Order Quota, Sub-Agent Commission, Supplier RFQ, QC App, Milestones, Subcontractor, Digital twin, BOPIS, Gift Registry, План vs Факт) работают на UI с заглушками; реальные API не подключены.
3. **Админка и порталы Factory/Distributor:** не входят в Brand/Shop навигацию; маршруты есть и открываются по прямым URL.

---

## 8. Тесты и качество

- **Smoke (e2e):** 17 маршрутов + проверка клиентского меню — все проходят.
- **A11y (e2e):** проверки заголовков, доступных имён, `aria-current` на ключевых клиентских и части Brand/Shop страниц — проходят.
- **Константы маршрутов:** `src/lib/routes.ts` — единый источник для client (и частично для entity-links). Brand/Shop в навигации пока на строках; при желании можно вынести и их в `ROUTES`.

---

## 9. Рекомендации по улучшению

### Критично
- **Digital Passport:** убрать захардкоженный `PASS-9921` из навигации; ссылаться на список паспортов или на `/client/passport/[id]` с ID из данных.

### Навигация и консистентность
- Постепенно переводить Brand/Shop `href` в навигации на константы из `ROUTES` (расширить `src/lib/routes.ts`), чтобы избежать опечаток и битых ссылок при переименовании.
- Проверить дубли: две страницы Try Before Buy (`/client/try-before-buy` и `/client/try-before-you-buy`) — решить, оставить одну точку входа или явно развести сценарии.

### Фичи и бэкенд
- При подключении API подключать вызовы по контрактам из `src/lib/` (типы и константы `*_API` уже заданы).
- Документация по заглушкам: в `src/lib/README.md` (или аналог) описать модули и планируемые эндпоинты — уже частично сделано.

### Тесты и доступность
- Расширить smoke на остальные важные маршруты Brand/Shop при необходимости.
- Добавить проверки a11y (например, через `@axe-core/playwright`) для WCAG по выбранным страницам.
- Для форм и модалок: проверить aria-labels и управление фокусом.

### Прочее
- ETL и импорт 1С/Мой Склад (Analytics Phase 2): при появлении API включить кнопку импорта и описать настройку в документации.
- BNPL: при интеграции с Тинькофф/Сбер учесть 54-ФЗ и согласия; ссылка на Compliance уже есть в entity-links.

---

## 10. Итоговая таблица

| Область | Статус | Действия |
|---------|--------|----------|
| Все маршруты Brand из навигации | ✅ Страницы есть | — |
| Все маршруты Shop из навигации | ✅ Страницы есть | — |
| Клиентские маршруты и меню | ✅ Работают, единое меню | — |
| Entity-links и MODULE_HUBS | ✅ Без битых ссылок, client через ROUTES | Расширить ROUTES на brand/shop при желании |
| Smoke- и a11y-тесты | ✅ Проходят | Добавить axe, расширить набор страниц |
| Фичи на моках | ⚠️ UI готов | Подключать API по контрактам из src/lib |
| Digital Passport в nav | ⚠️ Захардкожен ID | Заменить на динамическую ссылку |

Проект в текущем виде согласован: навигация и ссылки ведут на существующие страницы, клиентский раздел и тесты в порядке. Основной следующий шаг — подключение реальных API к фичам с моками и исправление ссылки на Digital Passport.
