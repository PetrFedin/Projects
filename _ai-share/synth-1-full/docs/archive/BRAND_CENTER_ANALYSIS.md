# Brand Center — Анализ структуры, функций и рекомендаций

## 1. ТЕКУЩАЯ СТРУКТУРА (18 групп навигации)

### Организация (org, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| Обзор организации | /brand/organization | Центр управления организацией |
| Профиль бренда | /brand | DNA, коммерция, юрлицо, сертификаты, контакты |
| Команда | /brand/team | Управление командой и коллаборация |
| Интеграции | /brand/integrations | Integration Marketplace |
| Webhooks & API | /brand/integrations/webhooks | Уведомления и автоматизация |
| SSO | /brand/integrations/sso | Корпоративная аутентификация |
| Подписка | /brand/subscription | Тариф и биллинг |
| Документы | /brand/documents | Договоры, акты, счета, NDA, ЭДО |
| Настройки | /brand/settings | Настройки системы |

### Логистика (shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| Складской учёт | /brand/warehouse | Инвентарь и остатки |
| Global Duty Engine | /brand/logistics/duty-calculator | Расчёт пошлин и налогов (DDP) |
| Консолидация грузов | /brand/logistics/consolidation | Группировка партий |
| Shadow Inventory | /brand/logistics/shadow-inventory | Продажа товаров в пути |

### Russian Layer (compliance, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| ЭДО & Маркировка | /brand/compliance | Честный ЗНАК, документооборот |
| Складской учёт КИЗ | /brand/compliance/stock | Синхронизация маркированных остатков |

### Центр управления (overview, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| Стратегический хаб | /brand/control-center | Общая панель всех модулей |
| Операционный пульс | /brand/dashboard | Ключевые метрики, пульс бренда |

### Продукты (product, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| PIM-центр | /brand/products | Управление данными товаров |
| Карточка готового товара | /brand/products/create-ready | Создание карточки уже произведённого товара |
| Digital Passport | /client/passport/… | История и аутентичность вещи |
| Планирование | /brand/planning | Ассортиментная матрица и планы |

### B2B Продажи (b2b_wholesale, **scope: b2b**)
| Раздел | Путь | Функции |
|--------|------|---------|
| B2B Шоурум | /brand/showroom | Виртуальный шоурум для байеров |
| Лайншиты | /brand/b2b/linesheets | Оптовые каталоги |
| Digital Linesheet Builder | /brand/b2b/linesheets/create | Early Bird, VIP, Outlet |
| B2B Заказы | /brand/b2b-orders | Управление оптовыми отгрузками |
| Партнеры | /brand/retailers | База ритейлеров и CRM |
| Дистрибьюторы | /brand/distributors | Региональные дистрибьюторы |

### B2C Продажи (b2c_retail, **scope: b2c**)
| Раздел | Путь | Функции |
|--------|------|---------|
| Розничные заказы | /brand/pre-orders | Управление прямыми продажами |
| Клиентская база | /brand/customers | Профили розничных покупателей |

### Производство (production, **scope: b2b**)
| Раздел | Путь | Функции |
|--------|------|---------|
| Цех (Live) | /brand/production | Мониторинг производственных линий |
| Готовый товар | /brand/production/ready-made | Flow без полного цикла производства |
| Запасы (VMI) | /brand/vmi | Vendor Managed Inventory |
| Поставщики | /brand/suppliers | Реестр поставщиков |
| Fit Comments Log | /brand/production/fit-comments | Визуальные правки сэмплов |
| Gold Sample Approval | /brand/production/gold-sample | Утверждение эталона |

### Маркетинг и PR (marketing, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| AI Кампании | /brand/kickstarter | AI генератор маркетинговых кампаний |
| PR Sample Control | /brand/marketing/samples | RFID/QR учёт образцов |
| Trend Sentiment Radar | /brand/marketing/trend-sentiment | Анализ соцсетей |
| Brand Heritage Timeline | /brand/marketing/heritage-timeline | Storytelling |
| Design Copyright AI | /brand/marketing/design-copyright | Мониторинг копий |

### Контент (content, **scope: b2c**)
| Раздел | Путь | Функции |
|--------|------|---------|
| Content Hub | /brand/content-hub | Синк TG/IG/VK, видео, стримы, блог, репосты |
| Content Factory (CMS) | /brand/cms → /brand/marketing/content-factory | AI-генерация контента |
| Media & DAM | /brand/media | Медиа-банк, трансляции, фото |

### Аналитика (analytics, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| B2B Analytics Hub | /brand/analytics-bi | Продажи, production, остатки, импорт 1С/Excel |
| Аналитика 360 | /brand/analytics-360 | Сквозная стратегическая аналитика |
| AI Прогнозы | /brand/analytics | Предиктивная аналитика SKU |

### Финансы (finance, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| AI Ценообразование | /brand/pricing | AI для цен и маржи |
| Сравнение цен | /brand/pricing/price-comparison | Парсинг, сравнение с рынком |
| Price Elasticity | /brand/pricing/elasticity | Влияние цены на объём |
| Markdown Optimizer | /brand/pricing/markdown | Рекомендации по скидкам |
| Финансовый хаб | /brand/finance | P&L, Cash Flow |
| Landed Cost Engine | /brand/finance/landed-cost | Себестоимость |
| Escrow Engine | /brand/finance/escrow | Безопасные сделки |

### Арбитраж и Защита (protection, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| Dispute Hub | /brand/disputes | Претензии, споры |
| Возвраты и рекламации | /brand/returns-claims | RMA B2B |

### Аукционы (auctions, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| Аукционы потребностей | /brand/auctions | Закупки, потребности бренда |

### AI Инструменты (ai-tools, **scope: b2c**)
| Раздел | Путь | Функции |
|--------|------|---------|
| AI Design Assistant | /brand/ai-design | Генеративный дизайн коллекций |
| AI Body Scanner | /client/scanner | 3D обмеры тела |
| Генераторы образов | /brand/ai-tools | Лукбуки и контент |

### Устойчивость (esg, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| ESG Мониторинг | /brand/esg | Экологический след и этика |

### Коллаборации (collabs, **scope: b2c**)
| Раздел | Путь | Функции |
|--------|------|---------|
| Партнерства | /brand/collaborations | Работа с партнёрами |

### HR & Персонал (hr, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| HR Hub | /brand/hr-hub | Вакансии, резюме, онбординг |
| Вакансии и резюме | /shop/career | Поиск персонала (внешний раздел) |

### Академия (academy, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| Академия бренда | /brand/academy | Обучение сотрудников |
| Академия платформы | /academy | Курсы платформы |

### Лояльность (loyalty, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| CRM & Лояльность | /brand/customer-intelligence | Бонусы, активность, клиенты |

### Соцсети и продвижение (social, **scope: b2c**)
| Раздел | Путь | Функции |
|--------|------|---------|
| Промо и акции | /brand/promotions | Кампании, скидки |

### Коммуникации (comm, shared)
| Раздел | Путь | Функции |
|--------|------|---------|
| Сообщения | /brand/messages | Чаты с партнёрами и командой |
| Календарь | /brand/calendar | Production, заказы, события, задачи |
| Задачи | /brand/tasks | Kanban |
| События | /brand/events | Мероприятия, показы |

---

## 2. СТРАНИЦЫ БЕЗ ПУНКТА В НАВИГАЦИИ

| Путь | Предлагаемое размещение |
|------|-------------------------|
| /brand/inventory | Логистика или Продукты (сейчас warehouse) |
| /brand/inventory/archive | Подстраница inventory |
| /brand/materials | Production (сырьё, BOM) |
| /brand/quality | Production (контроль качества) |
| /brand/factories | Production (список фабрик) |
| /brand/colors | Продукты (палитра) |
| /brand/products/matrix | Продукты (матрица ассортимента) |
| /brand/blog | Контент |
| /brand/live | Центр управления или Контент |
| /brand/brands | Организация (справочник брендов) |
| /brand/customization | Продукты (кастомизация) |
| /brand/ip-ledger | Маркетинг или Защита (IP-реестр) |
| /brand/security | Организация / Настройки |
| /brand/merchandising | Продукты |
| /brand/reviews | Маркетинг или B2C (отзывы) |
| /brand/showroom/collaborative | B2B Шоурум |
| /brand/showroom/vr | B2B Шоурум |
| /brand/linesheets | Дублирует /brand/b2b/linesheets |
| /brand/circular-hub | Устойчивость или Продукты |

---

## 3. ПЕРЕРАСПРЕДЕЛЕНИЕ И УПОРЯДОЧИВАНИЕ

### 3.1 Объединить/переместить

| Действие | Текущее | Новое |
|----------|---------|-------|
| **Content Factory** | Нав: /brand/cms (редирект) | Унифицировать href на /brand/marketing/content-factory |
| **Коллаборации** | Отдельная группа (b2c) | Переместить в «Организация» или «B2B» (партнёрства) |
| **Лояльность** | Отдельная группа (1 пункт) | Объединить с «B2C Продажи» или «CRM & Лояльность» в Центр управления |
| **Соцсети** | Отдельная группа (1 пункт) | Объединить с «Контент» или «Маркетинг» |
| **Аукционы** | Отдельная группа (1 пункт) | Переместить в «Закупки/Production» или оставить, добавив «Поставщики» |
| **AI Инструменты** | scope b2c | Сделать shared — AI Design полезен и для B2B |
| **Фабрики** | Нет в нав | Добавить в Production |
| **Materials** | Нет в нав | Добавить в Production |
| **Inventory** | Нет в нав | Добавить в Логистику (или связать с warehouse) |

### 3.2 Порядок групп (предложение)

1. **Центр управления** — входная точка  
2. **Организация** — профиль, команда, настройки  
3. **Продукты** — PIM, планирование, материалы  
4. **Производство** — цех, VMI, поставщики, фабрики  
5. **B2B Продажи** — заказы, партнёры, дистрибьюторы  
6. **B2C Продажи** — pre-orders, customers, loyalty  
7. **Логистика**  
8. **Russian Layer**  
9. **Маркетинг и PR**  
10. **Контент** — Content Hub, CMS, Media  
11. **Аналитика**  
12. **Финансы**  
13. **Арбитраж и Защита**  
14. **Коммуникации** — сообщения, календарь, задачи  
15. **HR & Академия** — объединить или рядом  
16. **Устойчивость**  
17. **AI Инструменты**  
18. **Аукционы**  

---

## 4. СВЯЗИ (entity-links) — ЧТО ДОРАБОТАТЬ

### 4.1 Отсутствующие функции связей

| Модуль | Нужна функция | Использование |
|--------|---------------|---------------|
| Suppliers | `getSupplierLinks()` | Страница suppliers, factories |
| Distributors | `getDistributorLinks()` | Страница distributors |
| Returns & Claims | `getReturnsClaimsLinks()` | Страница returns-claims |
| Loyalty / Customer Intel | `getLoyaltyLinks()` | customer-intelligence |
| Content Hub | Использует getMarketingLinks | Добавить Content Hub, CMS, Media |
| Factories | Использует getProductionLinks | OK |

### 4.2 Несоответствия href

| Где | Сейчас | Должно быть |
|-----|--------|-------------|
| brand-navigation CMS | /brand/cms | /brand/marketing/content-factory (или оставить редирект) |
| getMarketingLinks | Content Factory → content-factory | OK |
| getProductLinks | Content Factory → content-factory | OK |

### 4.3 Добавить в связи

| В функцию | Добавить ссылку |
|-----------|-----------------|
| getPartnerLinks | Дистрибьюторы, Возвраты |
| getOrderLinks | Production, Возвраты |
| getProductionLinks | Фабрики (уже есть), Materials |
| getComplianceLinks | Возвраты (для рекламаций по маркировке) |
| getFinanceLinks | Возвраты и рекламации |
| getTaskLinks | Возвраты |
| getSupplierLinks (новая) | Production, Materials, B2B, Фабрики |
| getDistributorLinks (новая) | B2B, Партнёры, Аналитика |

---

## 5. SCOPE: B2B vs B2C vs SHARED

| Группа | Текущий scope | Рекомендация |
|--------|---------------|--------------|
| B2B Продажи | b2b | OK |
| B2C Продажи | b2c | OK |
| Production | b2b | **→ shared** (бренд всегда ведёт производство) |
| Контент | b2c | **→ shared** (контент нужен и для B2B) |
| AI Инструменты | b2c | **→ shared** (AI Design для B2B) |
| Коллаборации | b2c | **→ shared** или объединить с B2B |
| Соцсети | b2c | OK или объединить с Маркетинг |

---

## 6. MODULE_HUBS (Control Center)

Текущие 17 хабов. Добавить:

- **content** — Content Hub /brand/content-hub
- **suppliers** — Поставщики /brand/suppliers
- **distributors** — Дистрибьюторы /brand/distributors  
- **returns** — Возвраты /brand/returns-claims

Обновить href:

- **product** — desc: «PIM, DAM, планирование» (DAM убран из product, оставить Media)
- **marketing** — desc: добавить «Content Factory»

---

## 7. КРАТКИЙ ПЛАН ДЕЙСТВИЙ

### Высокий приоритет
1. Унифицировать href CMS: `/brand/cms` → `/brand/marketing/content-factory` в навигации.
2. Добавить в навигацию: **Фабрики**, **Materials**, **Inventory** (или уточнить связь с warehouse).
3. Создать `getSupplierLinks()`, `getDistributorLinks()` и использовать на соответствующих страницах.
4. Scope: Production → shared, Контент → shared, AI Инструменты → shared.

### Средний приоритет
5. Объединить «Лояльность» с B2C или Центр управления.
6. Объединить «Соцсети» с Маркетинг или Контент.
7. Добавить в entity-links: Возвраты в getOrderLinks, getFinanceLinks, getPartnerLinks.
8. Обновить MODULE_HUBS (content, suppliers, distributors, returns).

### Низкий приоритет
9. Добавить в навигацию: blog, live, colors, merchandising, quality, reviews, security, ip-ledger.
10. Разобрать дубликаты: /brand/linesheets vs /brand/b2b/linesheets.
11. Уточнить inventory vs warehouse (один модуль или два).
