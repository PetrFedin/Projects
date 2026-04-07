# Интеграции по аналогии с JOOR, NuOrder и другими fashion-платформами

Список фичей и интеграций, которые можно добавить в Synth-1 по образцу лидеров индустрии (JOOR, NuOrder, Farfetch, Mytheresa, TSUM, Zalando, Wildberries и др.). Уже реализованное отмечено ✅; остальное — кандидаты в бэклог.

---

## 1. JOOR / NuOrder (B2B Wholesale)

| Фича | Описание | Synth-1 | Приоритет |
|------|----------|---------|-----------|
| **Visual Assortment Planning** | Планирование ассортимента «рядом» (избежание дублей, оптимизация микса) | Есть AssortmentPlanning, B2B матрица | — |
| **Digital Linesheets** | Тысячи брендов, линшиты в одном месте | Linesheet Creator, Showroom | — |
| **Multi-Currency** | 135+ валют (JOOR) | Частично (нужна явная поддержка в UI/API) | Средний |
| **Shopify Sync** | Синхронизация заказов/каталога с Shopify | Нет | Высокий (для ритейлеров) |
| **Market Week / Event Calendar** | Глобальный календарь fashion weeks и показов | Showroom Calendar есть | Расширить событиями |
| **Smart Line Sheets (AI)** | Персональные лайншиты под байера | Есть LineSheetGenerator | — |
| **Buy Now / Reorder / Pre-order** | Три режима закупки в одном потоке | Частично (Draft Orders) | Добавить режимы в checkout |
| **Real-time Inventory Sync** | Связка с ERP/WMS ритейлера | Stock Sync, VMI | Углубить ERP-коннекторы |
| **Sales Rep Dashboard** | Отдельный интерфейс для агентов бренда | Роли есть, отдельный дашборд — точечно | Средний |
| **Margin Calculator** | Встроенный расчёт маржи при заказе | Есть в аналитике/ассортименте | Вынести в виджет корзины |
| **Integrated Payments (JOOR Pay)** | Эскроу, факторинг, BNPL в одном хабе | Payment Hub, Net Terms | — |
| **Virtual Showroom 3D / hotspots** | 3D-модели и интерактивные точки | AR Showroom есть | Расширить 3D/hotspots |

**Рекомендации:** Multi-Currency в API и UI; режимы Buy Now / Reorder / Pre-order в B2B checkout; опция Shopify Sync; Margin Calculator в корзине/заказе.

---

## 2. Farfetch / Mytheresa (Luxury & Marketplaces)

| Фича | Описание | Synth-1 | Приоритет |
|------|----------|---------|-----------|
| **Store Locator + stock** | Карта магазинов с наличием в реальном времени | Нет | Средний |
| **Pre-Order / Early Access** | Ранний доступ к коллекциям | Pre-order в MASTER_PLAN | Высокий |
| **Unified Multi-Vendor Checkout** | Один чекаут для нескольких бутиков/брендов | Нет | Средний |
| **Authentication / Verification** | Проверка подлинности (badges, сертификаты) | Нет | Низкий (luxury/outlet) |
| **Concierge / Personal Shopping** | VIP-сервис, персональный подбор | Clienteling 2.0 | — |
| **Editorial / Trend Reports** | Журнал, отчёты по трендам для байеров | Market Intelligence | Расширить форматом отчётов |
| **VIP Access Program** | Эксклюзивы и уведомления для топ-покупателей | Loyalty, роли | Оформить как отдельный поток |

**Рекомендации:** Pre-Order и Early Access в B2B; Store Locator с остатками; при необходимости — блок Authentication для outlet/sample.

---

## 3. TSUM / Lamoda (Premium & РФ)

| Фича | Описание | Synth-1 | Приоритет |
|------|----------|---------|-----------|
| **Video Consultation** | Бронирование видеозвонков (Zoom/Teams) со стилистом/мерчем | В Roadmap Phase 6 | Высокий |
| **VIP Room / Showroom Booking** | Бронирование приватного шоурума по слотам | Нет | Средний |
| **Concierge Chat** | Живой чат с менеджером | AI Chat есть | Отдельный «человек»-канал |
| **Gift Registry / Wishlist** | Списки подарков, корпоративные вишлисты | Нет | Низкий |
| **Event Invitations** | Приглашения на закрытые показы/ивенты | Showroom Calendar | Расширить рассылкой |
| **Try at Home / Sample to Showroom** | Несколько размеров на примерку, сэмплы в шоурум | Try Before Buy в планах | Средний |
| **Subscription (Lamoda Club)** | Платная подписка с бонусами для B2B (Premium Access) | Нет | Низкий |
| **Bonus / Cashback для B2B** | Объёмные скидки, кешбэк за объём | Loyalty | Оформить B2B-тир |

**Рекомендации:** Video Consultation (Phase 6); VIP Room Booking; при необходимости — Concierge Chat как отдельный канал.

---

## 4. Zalando / ASOS (Omnichannel & Tech)

| Фича | Описание | Synth-1 | Приоритет |
|------|----------|---------|-----------|
| **Sustainability Score / Badges** | Рейтинг и бейджи по экологичности | Sustainability Tracking, ESG | — |
| **Try Before You Buy** | Оплата после примерки | В планах (Try Before Buy) | Высокий |
| **Connected Retail** | Единый сток B2B + B2C по каналам | Stock Sync, VMI | — |
| **Size Recommendation AI** | Точная подборка размера по телу/истории | Body Scan, Client OS | — |
| **Virtual Catwalk / Video** | Видео на карточке (модель в движении) | Catwalk Videos в матрице | Внедрить в карточки |
| **AR Try-On** | Виртуальная примерка (B2B samples) | Virtual Try-On в матрице | Средний |
| **Partner Onboarding Wizard** | Пошаговый онбординг новых партнёров/магазинов | Нет | Средний |
| **Flash Sale / Lounge** | Закрытые распродажи для B2B (Last Call уже есть) | B2B Last Call | — |

**Рекомендации:** Try Before You Buy; Virtual Catwalk на карточках; Partner Onboarding Wizard.

---

## 5. Wildberries / Shein (Marketplace & Speed)

| Фича | Описание | Synth-1 | Приоритет |
|------|----------|---------|-----------|
| **Seller Dashboard** | Детальная аналитика для брендов (продажи, возвраты) | Analytics, Control Center | Углубить под «seller» |
| **Dynamic Pricing** | Автокоррекция цен по правилам/конкуренции | AI Pricing Optimizer | — |
| **Quick Restock Alerts** | Push/email при пополнении нужного SKU | Replenishment AI, алерты | — |
| **Volume-based Auto Discounts** | Скидки за объём заказа | Нет явно | Низкий |
| **Gamification** | Челенджи, лидерборды, бейджи (Shein) | В Roadmap Phase 6 | Средний |
| **AI Trend Prediction** | Предсказание вирусных стилей для байеров | Market Intelligence, Demand AI | — |
| **Flash B2B Deals** | Ограниченные по времени офферы | Last Call | Расширить таймером/акциями |

**Рекомендации:** Явные Volume Discounts в правилах заказа; Gamification (Phase 6); расширение Last Call форматом Flash Deals.

---

## 6. Resale & Circular (Vestiaire, RealReal, Depop)

| Фича | Описание | Synth-1 | Приоритет |
|------|----------|---------|-----------|
| **Authentication Service** | Проверка подлинности для outlet/samples | Нет | Низкий |
| **Condition Reports** | Описание состояния для sample/outlet продаж | Нет | Низкий |
| **Consignment Dashboard** | Трекинг продажи переданных на комиссию вещей | Нет | Низкий |
| **Social Feed** | Лента активностей/постов брендов (Depop-style) | В Roadmap Phase 6 | Средний |
| **In-App Messaging** | Прямой чат buyer–brand | Нет | Средний |
| **Live Shopping** | Стримы с продажами / виртуальные шоурумы | В Roadmap Phase 6 | Средний |

**Рекомендации:** Social Feed и Live Shopping (Phase 6); при развитии outlet/sample — Condition Reports и опционально Authentication.

---

## 7. Сводка по приоритетам

**Высокий приоритет (по аналогии с платформами):**
- Video Consultation (TSUM/Farfetch)
- Pre-Order / Early Access (Farfetch/Mytheresa)
- Try Before You Buy (Zalando)
- Shopify Sync (JOOR/NuOrder для ритейлеров)

**Средний приоритет:**
- Multi-Currency (JOOR)
- Buy Now / Reorder / Pre-order режимы в B2B
- Margin Calculator в корзине
- Store Locator с остатками
- VIP Room / Showroom Booking
- Virtual Catwalk на карточках
- Partner Onboarding Wizard
- Social Feed, Gamification, Live Shopping (Phase 6)
- In-App Messaging (buyer–brand)

**Низкий приоритет:**
- Authentication/Condition Reports (outlet/sample)
- Gift Registry, B2B Subscription, Volume Auto Discounts

---

## 8. Связь с текущими артефактами

- **Фичи уже в платформе:** см. `B2B_COMPETITOR_FEATURE_MATRIX.md`, `B2B_README.md`, `NAVIGATION_STRUCTURE.md`.
- **Roadmap Phase 6:** Video Consultation, Social Feed, Gamification, Live Shopping — `B2B_STRATEGIC_ROADMAP.md`.
- **Общая стратегия:** `MASTER_PLAN.md`, `TASK_QUEUE.md`.

Документ можно использовать для выбора следующих интеграций и обновления бэклога (например, в `TASK_QUEUE.md` или в тикетах).
