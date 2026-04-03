# Детальный аудит модулей Synth-1: сильные/слабые стороны и сравнение с конкурентами

**Дата:** 20 марта 2025  
**Конкуренты для сравнения:** Joor, Nuorder, Faire, Brandboom, RepSpark, Fashion Cloud, Le New Black, Ankorstore, Candid Wholesale, Playology, Balluun, Aleran, Ordre, Vycora

---

## Общие наблюдения

### Повторы в API (routes.py)
- **fintech** — подключён дважды (строки 24 и 44)
- **retail** — дважды (41, 68)
- **factory** — дважды (46, 70)
- **marketing** — дважды (26, 49)
- **compliance** — дважды (23, 60)
- **academy** — дважды (25, 62)
- **collaboration** — дважды (27, 63)

### ~~Ошибка в supply_chain.py~~ (исправлено)
- ~~В `supply_chain.py` используется `User` в Depends, но не импортирован~~ — добавлен импорт `User` из `app.db.models.base`.

### Отсутствует API для аукционов
- В UI suggestions упоминаются страницы `auctions`, `brand/auctions`, `factory/auctions`, но в API **нет** endpoint'ов для аукционов.

---

## 1. ОРГАНИЗАЦИЯ

**API:** `/organization`, `/brand`

### Что есть
- `GET /organization/health/{brand_id}` — метрики здоровья организации (возвращает пустой список)
- `GET /brand/profile/{brand_id}` — профиль бренда (legal, contacts, DNA, certificates)
- `GET /brand/dashboard/{brand_id}` — KPIs (retailers, orders, marking, collections)
- `GET /brand/integrations/status/{brand_id}` — статус интеграций (1C, CDEK, Ozon, Честный ЗНАК)

### Сильные стороны
- Разделение brand/organization
- Учёт РФ-интеграций (1C, ЭДО, маркировка, Озон)

### Слабые стороны
- `organization/health` возвращает пустой массив — логика не реализована
- Brand profile и dashboard используют TODO и mock-данные
- Нет CRUD для организаций, брендов, юрлиц
- Нет управления дочерними юрлицами/филиалами

### У конкурентов (Joor, Fashion Cloud)
- Мультибренд, мультиюрлица
- Полный профиль организации с верификацией
- Связь с ERP (SAP, NetSuite, 1C)

### Что добавить
- Реализовать агрегацию метрик в `organization/health`
- Модели Organization, Brand с полями для РФ (ИНН, ОГРН, КПП)
- CRUD для организаций
- Подключение реальных интеграций (1C, CDEK, Ozon) вместо mock

### РФ-специфика
- Интеграции 1C, ЭДО, Честный ЗНАК заложены в UI — хорошо
- Озон — возможны ограничения для B2B

---

## 2. ЛОГИСТИКА

**API:** `/logistics`

### Что есть
- `POST /logistics/packing-lists` — создание упаковочных листов
- `POST /logistics/customs` — таможенные декларации (международные заказы)
- `GET /logistics/shipments/{order_id}` — статус отгрузки

### Сильные стороны
- Packing lists привязаны к заказам
- Поддержка таможни (международная торговля)
- Отдельный сервис LogisticsService

### Слабые стороны
- Нет трекинга посылок (отслеживание трек-номеров)
- Нет интеграции с перевозчиками РФ (СДЭК, Боксберри, DPD)
- Нет мультискладской логистики
- Нет расчёта стоимости доставки

### У конкурентов (Fashion Cloud, Joor)
- EDI с перевозчиками
- Smart Replenishment на основе real-time stock
- Интеграция с 50 000+ POS
- Расчёт доставки и сроков

### Что добавить
- Интеграция с СДЭК API для РФ
- Трекинг посылок
- Мультисклад
- Расчёт стоимости доставки по весу/объёму

### РФ-специфика
- CDEK упоминается в brand integrations — нужна полная интеграция
- Для РФ важна доставка до пунктов выдачи, постаматов

---

## 3. ЭДО И МАРКИРОВКА (РФ)

**API:** `/compliance`, `/plm` (marking)

### Что есть
- **Compliance:**
  - `POST /compliance/eac/register` — регистрация сертификата EAC
  - `POST /compliance/marking/emit` — эмиссия кодов маркировки (Честный ЗНАК)
  - `GET /compliance/edo/documents` — список ЭДО документов
  - `POST /compliance/edo/{doc_id}/sign` — подписание ЭДО
- **PLM:**
  - `POST /plm/marking/order` — заказ кодов маркировки для батча

### Сильные стороны
- Модуль Russian Layer выделен отдельно
- EAC, Честный ЗНАК, ЭДО покрыты
- ComplianceService связан с AIRuleEngine (алерты по истечению сертификатов)
- Два пути: compliance (общий) и plm (производство)

### Слабые стороны
- **Нет реальной интеграции с CRPT** (Честный ЗНАК) — эмиссия симулирована
- **Нет интеграции с операторами ЭДО** (Диадок, СберБизнес, Контур) — подписание только в БД
- Нет вывода/приёма (отправки в оборот, вывод из оборота)
- Нет агрегации кодов в агрегаты
- EAC — только регистрация, нет проверки по реестру

### У конкурентов
- Fashion Cloud: Advanced EDI services
- Большинство западных платформ не имеют Честный ЗНАК — это наше преимущество для РФ

### Что добавить
- Интеграция с API Честный ЗНАК (эмиссия, вывод, приём)
- Интеграция с оператором ЭДО (Диадок/Контур)
- Автоматическая генерация УПД/ТОРГ-12 при отгрузке
- Валидация EAC по реестру ФСА

### РФ-специфика
- Критически важно для РФ — без этого B2B не работает
- Маркировка: одежда, обувь, текстиль под обязательной маркировкой

---

## 4. ЦЕНТР УПРАВЛЕНИЯ (Dashboard)

**API:** `/dashboard`

### Что есть
- `GET /dashboard/` — агрегированные метрики по роли (brand_admin, buyer)
- KPIs: orders, revenue, profit, margin, stock_health, esg_score, pending_tasks, showrooms, linesheets
- Buyer: my_orders, my_total_spent, accessible_showrooms, health_score, budget_used, market_rank

### Сильные стороны
- Разные дашборды для brand и buyer
- Учёт showrooms, linesheets

### Слабые стороны
- Часть метрик — mock (profit = revenue * 0.25, operations = 94.5, margin = 42)
- Нет единого «Центра управления» как отдельного раздела с виджетами
- Нет кастомизации дашборда (drag-and-drop виджетов)
- Нет алертов и уведомлений на дашборде

### У конкурентов (Joor, Nuorder)
- Real-time reporting
- Кастомизируемые дашборды
- Алерты по заказам, запасам, срокам

### Что добавить
- Реальные расчёты вместо mock
- Виджеты с возможностью настройки
- Алерты и уведомления
- Сводка по всем модулям (заказы, производство, маркировка, логистика)

---

## 5. КОЛЛЕКЦИИ

**API:** `/collections`, `/seasons`

### Что есть
- **Collections:**
  - `GET/POST /collections/drops` — дропы коллекций
  - `GET/POST /collections/color-stories` — цветовые палитры
  - `GET/POST /collections/merchandise-grid/{season}` — мерчандайзинг-сетка
- **Seasons:** отдельный endpoint

### Сильные стороны
- Drops, color stories, merchandise grid — полный цикл планирования
- CollectionService реализован

### Слабые стороны
- В product.py тоже есть `GET/POST /product/drops/{brand_id}` — **дублирование** drops
- Нет связи коллекций с showrooms/linesheets
- Нет превью коллекций, мудбордов
- Нет версионирования коллекций

### У конкурентов (RepSpark, Joor)
- Event Microsites для дропов
- Связь коллекция → linesheet → заказ
- Мультиязычность коллекций

### Что добавить
- Убрать дублирование drops (оставить в collections)
- Связь collection → showroom → linesheet
- Мудборды, превью
- Версионирование

### РФ-специфика
- Сезонность (SS/FW) универсальна

---

## 6. ПРОДУКТЫ

**API:** `/product`, `/plm`

### Что есть
- Feature proposals, grading, 3D assets, samples, construction, swatches, LCA, drops, fit corrections
- PLM: tech pack, BOM, costing, SMV, fabric rolls, marking, документы, RFQ, compliance, milestones, этапы производства

### Сильные стороны
- Очень богатый функционал продукта (grading, LCA, 3D, construction)
- PLM с полным циклом: техпакет → BOM → производство → QC
- AI-агенты: product_architect, roadmap
- Интеграция с маркировкой в plm

### Слабые стороны
- Дублирование drops (product и collections)
- product/propose жёстко создаёт proposal "AI Styled Lookbooks" — не гибко
- Нет базового CRUD для SKU/Product (есть только связанные сущности)

### У конкурентов (RepSpark, Nuorder)
- Product customization (insignia, licensing)
- Live inventory views
- Multi-warehouse

### Что добавить
- Единый источник истины для Product/SKU
- CRUD для базового продукта
- Связь product → collection → linesheet
- Убрать дублирование drops

### РФ-специфика
- LCA, DPP — востребованы для экспорта в ЕС
- Маркировка через plm — ок

---

## 7. B2B ПРОДАЖИ

**API:** `/orders`, `/wholesale`, `/showrooms`, `/buyer`

### Что есть
- **Orders:** draft, submit, cancel, validate, items
- **Wholesale:** discounts, MOQ, credit limits, linesheets, draft-from-selection, attach linesheet to showroom
- **Showrooms:** CRUD, items, 360, visit
- **Buyer:** endpoint есть

### Сильные стороны
- Полный цикл: showroom → selection → draft order → submit
- Linesheets с генерацией PDF
- Credit limits, BNPL, seasonal credit (схемы есть)
- Роли и права (check_permissions)

### Слабые стороны
- buyer endpoint нужно проверить на полноту
- Нет каталога брендов для байера (discovery)
- Нет сравнения цен/условий
- Нет массового заказа (bulk order)

### У конкурентов (Joor, Faire, Nuorder)
- JOOR Discover — поиск ритейлеров
- JOOR Passport — digital trade show
- JOOR Pay — cash flow
- Faire — маркетплейс с финансированием
- Nuorder — 60% faster order processing

### Что добавить
- Discovery каталог брендов для байера
- Массовый заказ
- Сравнение предложений
- Интеграция оплаты (для РФ — эквайринг, рассрочка)

### РФ-специфика
- BNPL, факторинг — есть в fintech
- Для РФ: оплата по счёту, отсрочка — типичны

---

## 8. ПРОИЗВОДСТВО

**API:** `/factory`, `/plm`

### Что есть
- **Factory:** телеметрия машин, milestones, schedules, QC, ESG, needle counter, chemical audit, sourcing, batches, maintenance
- **PLM:** tech pack, BOM, RFQ, suppliers, compliance, production stages, materials, lab dips, cutting, defect tracking, GRN, CAPA

### Сильные стороны
- Полноценный factory monitoring (IoT-подобный)
- QC checklists, AQL
- Sourcing с AI-подбором фабрик
- ESG на уровне фабрики
- Детальный production pipeline в PLM

### Слабые стороны
- Factory и PLM частично пересекаются (sourcing в обоих)
- Нет Gantt-диаграмм, визуализации графика
- Нет учёта простоев оборудования

### У конкурентов
- Большинство B2B платформ не покрывают производство так глубоко
- Специализированные PLM (Centric, Infor) — конкуренты в этом сегменте

### Что добавить
- Единая визуализация производственного графика
- Учёт простоев
- Связь factory telemetry → alerts

### РФ-специфика
- Производство в РФ/СНГ — важно
- Связь с маркировкой (batch → marking) — есть

---

## 9. ЗАКУПКИ И СОРСИНГ

**API:** `/supply-chain`, `/plm` (RFQ, suppliers)

### Что есть
- **Supply-chain:** analyze-batch-risk, active-risks, mitigate
- **PLM:** RFQ, supplier offers, material planning, supplier scorecards

### Сильные стороны
- AI risk analysis для батчей
- RFQ workflow
- Supplier scorecards

### Слабые стороны
- Supply-chain — только risk, нет закупок материалов
- Нет управления заказами поставщикам (PO to supplier)
- Нет отслеживания доставки материалов
- Нет сравнения предложений поставщиков

### У конкурентов (Fashion Cloud, Joor)
- EDI с поставщиками
- Управление заказами на закупку

### Что добавить
- Модуль закупок: PO to supplier, delivery tracking
- Сравнение офферов
- Связь material order → fabric roll (есть в plm) — усилить

### РФ-специфика
- Импорт материалов — таможня, сертификаты

---

## 10. КОНТРОЛЬ КАЧЕСТВА (ОТК)

**API:** `/factory` (qc), `/plm` (inline QC, defects, GRN, CAPA), `/product-testing`

### Что есть
- Factory: `GET/POST /factory/qc` — чеклисты по заказу
- PLM: inline QC, defect types, GRN, CAPA
- Product-testing: Digital Twin feedback, fit summary

### Сильные стороны
- QC на уровне заказа
- Дефекты, GRN, CAPA — производственный цикл
- Digital Twin для сбора обратной связи по fit

### Слабые стороны
- Product-testing — только feedback, нет тестов (прочность, усадка и т.д.)
- Нет AQL-калькулятора в API (есть в schemas — AQLCalculationResponse)
- Нет отчётности по качеству (брак по фабрикам, SKU)

### У конкурентов
- Специализированные QA системы (QA etc.) — глубже

### Что добавить
- AQL calculator endpoint
- Отчёты по качеству
- Стандарты тестов (прочность, цветостойкость)

### РФ-специфика
- ГОСТ, ТР ТС — сертификация качества

---

## 11. МАРКЕТИНГ И PR

**API:** `/marketing`, `/marketing-crm`

### Что есть
- **Marketing:** campaign concept (AI), content generate (AI), campaign performance
- **Marketing CRM:** отдельный модуль

### Сильные стороны
- AI-генерация кампаний и контента
- Привязка к SKU и платформам (instagram, tiktok, shopify, amazon)

### Слабые стороны
- marketing_crm — нужно проверить содержимое
- Нет планирования кампаний (календарь)
- Нет таргетинга B2B (e-mail, LinkedIn)
- Нет PR (пресс-релизы, медиа)

### У конкурентов (RepSpark)
- Campaign generator
- Event Microsites

### Что добавить
- Календарь кампаний
- B2B email маркетинг
- PR модуль (пресс-релизы)

### РФ-специфика
- Telegram, VK — каналы для РФ
- Ozon/WB — маркетплейс реклама

---

## 12. КОНТЕНТ

**API:** `/dam`, `/creative`, `/assets`

### Что есть
- **DAM:** assets CRUD, process (background removal, watermark), analyze-trends, 360-config
- **Creative:** lookbooks, Style DNA, consultations, AI assets, virtual shows, AI Studio
- **Assets:** отдельный endpoint

### Сильные стороны
- DAM с AI (тренды, 360)
- Creative: lookbooks, virtual shows, AI Studio
- Обработка изображений (bg removal, watermark)

### Слабые стороны
- Дублирование: assets и dam — возможно одно и то же
- Creative и Marketing — пересечение (контент)
- Нет версионирования ассетов
- Нет прав доступа к ассетам (лицензии)

### У конкурентов (Fashion Cloud, Joor)
- Digital asset management
- Мультиканальная публикация

### Что добавить
- Версионирование ассетов
- Права и лицензии
- Связь asset → product → campaign

### РФ-специфика
- Контент для Озон, WB — специфичные требования

---

## 13. АНАЛИТИКА

**API:** `/analytics`, `/forecasting`

### Что есть
- Demand forecast, footfall, AR nodes, sell-through, returns, merchandise grids, feedback, NPS
- AI assortment intelligence
- Forecasting: отдельный endpoint

### Сильные стороны
- Богатая аналитика: sell-through, returns, NPS
- AI demand forecasting с учётом визуальных трендов (DAM)
- Assortment intelligence (связь с costing, demand)

### Слабые стороны
- Часть данных может быть mock
- Нет дашбордов аналитики (только API)
- Нет экспорта отчётов (Excel, PDF)

### У конкурентов (Joor, Nuorder)
- Real-time reporting
- 60% faster processing за счёт аналитики

### Что добавить
- Экспорт отчётов
- Pre-built дашборды
- Сравнение сезонов, брендов

### РФ-специфика
- Аналитика по регионам РФ
- Маркетплейсы (Озон, WB) — данные продаж

---

## 14. ФИНАНСЫ

**API:** `/fintech`, `/pricing`, `/smart-contracts`

### Что есть
- **Fintech:** campaigns, invest, invoices, factoring, insurance, liquidity, costing, budgets
- **Pricing:** AI pricing
- **Smart-contracts:** автоматическое исполнение условий (бонусы, штрафы, эскроу)

### Сильные стороны
- Широкий финансовый стек: факторинг, страхование, ликвидность
- AI pricing
- Smart contracts — уникальная фича

### Слабые стороны
- Нет платёжных шлюзов (оплата картой, СБП)
- Нет учёта (бухгалтерия) — только инвойсы
- Нет мультивалютности

### У конкурентов (Joor Pay, Faire)
- JOOR Pay — cash flow, risk minimization
- Faire — финансирование заказов

### Что добавить
- Интеграция оплаты (для РФ: СБП, эквайринг)
- Базовая бухгалтерия или интеграция с 1С
- Мультивалютность

### РФ-специфика
- 1С интеграция — критична
- СБП, эквайринг — для онлайн оплаты

---

## 15. АРБИТРАЖ И ЗАЩИТА

**API:** `/admin` (disputes), `/risk`

### Что есть
- **Admin:** create dispute, list disputes (platform_admin only), announcements
- **Risk:** global logistics risks (active, by region), analyze, resolve

### Сильные стороны
- Disputes между организациями
- Risk — логистические риски с AI-анализом

### Слабые стороны
- Disputes — только создание и список, нет workflow (эскалация, решение)
- Risk — глобальные риски, не арбитраж
- Нет защиты прав (жалобы на контрагента)

### У конкурентов
- Обычно есть dispute resolution workflow
- Рейтинги, отзывы

### Что добавить
- Workflow disputes: создание → ответ → эскалация → решение
- Роль арбитра
- Связь dispute → order

### РФ-специфика
- Юридическая поддержка для РФ контрактов

---

## 16. АУКЦИОНЫ

**API:** Отсутствует

### Что есть
- В UI (synth-1) упоминаются страницы: `/auctions`, `/brand/auctions`, `/factory/auctions`
- В API **нет** endpoints для аукционов

### Слабые стороны
- Фронтенд есть, бэкенд отсутствует
- Нет логики: лоты, ставки, закрытие

### У конкурентов
- Ordre — виртуальные показы, возможно аукционные механики
- Специализированные fashion auctions (не B2B оптовые)

### Что добавить
- API: lots, bids, auction lifecycle
- Модели: Auction, Lot, Bid
- Связь с products, batches (для остатков, samples)

### РФ-специфика
- Аукционы образцов, остатков — востребованы

---

## 17. AI ИНСТРУМЕНТЫ

**API:** `/ai`, `/ai-intelligence`

### Что есть
- **AI:** trends, similar-products, pricing-recommendation, sku-prediction, demand-forecast
- **AI-intelligence:** trends, similar-products, visual-search, demand-forecast, inventory-replenishment, sku-performance, brand-score

### Сильные стороны
- Визуальный поиск
- Demand forecasting
- Inventory replenishment (VMI)
- Trend radar
- Много AI-сервисов

### Слабые стороны
- Дублирование: trends, similar-products, demand-forecast в обоих
- /ai и /ai-intelligence — размытая граница
- Часть — mock (sku-prediction)

### У конкурентов
- AI — differentiating factor, не у всех есть
- Joor, Nuorder — базовая аналитика

### Что добавить
- Объединить /ai и /ai-intelligence в один модуль
- Убрать дублирование
- Документировать какие модели AI используются

### РФ-специфика
- AI для РФ рынка — тренды, спрос по регионам

---

## 18. УСТОЙЧИВОСТЬ

**API:** `/sustainability`, `/esg`

### Что есть
- **Sustainability:** proofs (blockchain), Digital Product Passport (DPP)
- **ESG:** отдельный модуль
- Product LCA в product
- Factory ESG metrics

### Сильные стороны
- DPP с публичным доступом (QR для потребителей)
- Blockchain proof для событий
- LCA на уровне продукта
- ESG на уровне фабрики

### Слабые стороны
- ESG endpoint — нужно проверить
- Нет отчётности (GRI, CDP)
- Нет carbon footprint калькулятора

### У конкурентов
- Fashion Cloud, крупные бренды — ESG отчётность
- DPP — требование ЕС с 2027

### Что добавить
- Carbon footprint по цепочке поставок
- Экспорт отчётов GRI/CDP
- Связь DPP → QR на продукте

### РФ-специфика
- ESG пока менее приоритетен для РФ, но важен для экспорта

---

## 19. HR И ПЕРСОНАЛ

**API:** `/staff`

### Что есть
- Shifts, shift swap, salary advance, leaderboard

### Сильные стороны
- Смены, обмен сменами
- Аванс зарплаты
- Геймификация (leaderboard)

### Слабые стороны
- Только ритейл (store staff)
- Нет учёта сотрудников бренда, производства
- Нет отпусков, больничных
- Нет onboarding

### У конкурентов
- Специализированные HR системы
- B2B платформы редко включают HR

### Что добавить
- Расширить на производство, офис
- Отпуска, табель
- Onboarding, обучение (связь с Academy)

### РФ-специфика
- Трудовой кодекс РФ
- Электронная трудовая книжка

---

## 20. АКАДЕМИЯ

**API:** `/academy`

### Что есть
- Modules (get, create), tests (submit)
- AcademyService

### Сильные стороны
- Модули обучения
- Тесты с прохождением

### Слабые стороны
- Нет контента (content_url — внешняя ссылка?)
- Нет прогресса пользователя (какие модули пройдены)
- Нет сертификации (badges)
- Нет связи с продуктами (обучение по ассортименту)

### У конкурентов (RepSpark)
- B2B Academy — обучение партнёров

### Что добавить
- Прогресс обучения
- Сертификаты, badges
- Контент по ассортименту, маркировке, ЭДО

### РФ-специфика
- Обучение по Честный ЗНАК, ЭДО — критично для партнёров

---

## 21. КОММУНИКАЦИИ

**API:** `/collaboration` (tasks, notifications, brand-to-brand)

### Что есть
- Team tasks (create, my tasks, by context, update status)
- Notifications (unread, mark read)
- Collaborations (create, visibility, my collaborations)

### Сильные стороны
- Задачи с контекстом (context_type, context_id)
- Уведомления
- Бренд-к-бренду коллаборации с настройкой видимости

### Слабые стороны
- Нет чата/мессенджера
- Нет комментариев к задачам
- Нет email-уведомлений
- Нет коммуникации buyer ↔ brand (переписка по заказу)

### У конкурентов
- In-app messaging
- Комментарии к заказам

### Что добавить
- Чат или комментарии к заказам
- Email/push уведомления
- Переписка buyer-brand

### РФ-специфика
- Telegram-бот для уведомлений — популярно в РФ

---

## Сводка: что не работает для РФ

| Функция | Статус |
|---------|--------|
| Честный ЗНАК | Симуляция, нет интеграции с CRPT |
| ЭДО | Только внутреннее подписание, нет оператора |
| 1С | Упоминается, нет интеграции |
| СДЭК/доставка | Упоминается, нет API |
| Озон/WB | Озон в integrations — error |
| Оплата (СБП, эквайринг) | Нет |
| Аукционы | API отсутствует |

---

## Рекомендации по приоритетам

### Высокий приоритет
1. Интеграция Честный ЗНАК (CRPT API)
2. Интеграция ЭДО (Диадок/Контур)
3. Убрать дублирование в routes.py
4. Исправить import User в supply_chain.py
5. API для аукционов (если UI уже есть)

### Средний приоритет
6. Интеграция СДЭК
7. 1С интеграция
8. Оплата (СБП)
9. Discovery для байеров
10. Workflow для disputes

### Низкий приоритет
11. Объединение /ai и /ai-intelligence
12. Убрать дублирование drops (collections vs product)
13. Расширение HR
14. PR модуль
