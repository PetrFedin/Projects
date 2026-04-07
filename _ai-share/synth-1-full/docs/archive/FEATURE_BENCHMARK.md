# Бенчмарк фич для платформы Syntha

> Источники: Fashion Cloud, Candid Wholesale, RepSpark, Colect, Faire, Brandboom, Le New Black, Playologie, WizCommerce, SparkLayer, Uphance, Velo/Velveto — и AGORA, Sellty, Compo, СотБит, InSales B2B, B2B-Center, Supl.biz.  
> Критерии: российский рынок + функционал fashion B2B платформы.

---

## 1. Краткий обзор источников

| Платформа | Фокус | Регион | Зачем смотреть |
|-----------|-------|--------|----------------|
| Fashion Cloud | Data Hub, preorder/reorder, showroom | EU | Единый вход для ритейлеров, Data Hub, Digital Showroom |
| Candid Wholesale | Order, invoice, inventory, payments | US | Self-serve ordering, встроенный CRM, Virtual Showroom |
| RepSpark | B2B wholesale e-commerce | US | Line sheets, event microsites, AI Order Insights |
| Colect | B2B sales, showroom, AI | EU | Brand Portal, AI order management, 360° product views |
| Faire | Маркетплейс B2B | US | Buyer discovery, Promoted Listings, curated shopping |
| Brandboom | Order management, line sheets | US | Collaborative orders, re-order, exclusion zones |
| Le New Black | Wholesale showroom, sales app | EU | iPad app, inventory control, multi-door ordering |
| Playologie | Virtual trade show, kids/maternity | EU | 24/7 ordering, multi-language, iPad app |
| WizCommerce | AI-first B2B | US | AI storefronts, WizOrder, WizStudio (AI imagery) |
| SparkLayer | B2B на Shopify | Global | Blended B2B/B2C, sales rep ordering, RFQ |
| Uphance | PLM + B2B + ERP | US | Tech packs, linesheets, multi-season, mobile sales |
| Velveto | Luxury B2B marketplace | EU | Ask-to-source, vetted sellers, confidential deals |
| **AGORA** | B2B portal, ЭТП, SRM | РФ | 1C, EDI, российские платежи, портал дилеров |
| **Sellty** | B2B/B2C портал | РФ | 1C, российские платежи, ИИ-аналитика, чат-боты |
| **Compo** | PIM, MDM, DAM, B2B | РФ | Импортозамещение, интеграционная шина |
| **СотБит** | B2B на Битрикс | РФ/СНГ | 1C, Битрикс24, персональные цены, рекламации |
| **InSales** | E-commerce, маркетплейсы | РФ | WB, Ozon, Яндекс, до 500 модификаций |
| **B2B-Center** | Электронные торги, тендеры | РФ | Аукционы, запрос предложений, ЭЦП |
| **Supl.biz** | Маркетплейс B2B | РФ/СНГ | Поиск поставщиков, 1.7M компаний, каталог товаров |

---

## 2. Рекомендуемые фичи для Syntha (по приоритету)

### A. Критично для РФ и fashion B2B

| Фича | Источник | Зачем |
|------|----------|-------|
| **1C интеграция** | AGORA, Sellty, СотБит | Товары, цены, остатки, заказы — основа для РФ |
| **Персональные цены / прайс-листы** | СотБит, SparkLayer, Brandboom | B2B без этого не работает |
| **Электронный документооборот (ЭДО)** | AGORA, B2B-Center | Счета, акты, накладные для РФ |
| **Интеграции с российскими платежами** | Sellty | СБП, Тинькофф, ЮKassa и др. |
| **Интеграции с логистикой РФ** | InSales, Sellty | CDEK, Boxberry, DPD и т.п. |
| **Выгрузка на маркетплейсы** | InSales | WB, Ozon, Яндекс.Маркет — уже есть в схеме |
| **Личный кабинет дилера/ритейлера** | AGORA, СотБит | Самообслуживание, 24/7 заказы |

### B. Digital Showroom & Line Sheets

| Фича | Источник | Зачем |
|------|----------|-------|
| **Digital Showroom** | Fashion Cloud, Colect, Le New Black | Коллекции, визуальный сторителлинг, 360°/видео |
| **Интерактивные line sheets** | Brandboom, RepSpark, Uphance | Заказ прямо из лайншита, обновление в реальном времени |
| **Event microsites** | RepSpark | Мини-сайты под сезон/выставку |
| **Collaborative ordering** | Brandboom, Uphance | Редактирование заказа брендом и байером до/после размещения |
| **Offline / iPad app для репов** | Le New Black, Playologie, WizCommerce | Заказы на выезде, выставки |
| **Pre-order / Re-order разделение** | Fashion Cloud, Le New Black | Preorder vs At-Once vs Future delivery |
| **Ship window / ATP** | Brandboom | Видимость «что можно отгрузить когда» |

### C. Orders & Inventory

| Фича | Источник | Зачем |
|------|----------|-------|
| **Smart Replenishment** | Fashion Cloud, Candid | Автоматические допоставки по данным |
| **Volume discounts / скидки от объёма** | Brandboom, SparkLayer | Типично для B2B |
| **Re-order напоминания** | Brandboom, Candid | Снижение cart abandonment, рост повторных заказов |
| **Stock reservations** | SparkLayer | Резервирование под заказ |
| **Multi-door ordering** | RepSpark, Colect | Разные склады/точки отгрузки в одном заказе |
| **Draft orders / корзина** | RepSpark, Colect | Сохранение черновика, shared cart |
| **Request for Quote (RFQ)** | SparkLayer | Запрос КП перед заказом |

### D. Payments & Credit

| Фича | Источник | Зачем |
|------|----------|-------|
| **Отсрочка платежа (net terms)** | SparkLayer, Candid | B2B стандарт |
| **Credit limits / лимиты** | SparkLayer | Контроль рисков |
| **Интегрированные счета и оплаты** | Brandboom, Candid | Stripe/PayPal в РФ — аналог через локальные шлюзы |
| **Напоминания о просроченных платежах** | Candid | Автоматизация |

### E. AI & Insights

| Фича | Источник | Зачем |
|------|----------|-------|
| **AI-powered product recommendations** | WizCommerce, Colect | Рекомендации в шоуруме/каталоге |
| **AI order insights / anomaly detection** | RepSpark | Аномалии в заказах, предупреждения |
| **ИИ-описания товаров** | Uphance | Генерация описаний |
| **AI imagery (WizStudio)** | WizCommerce | Каталог без фотосессий — долгосрочно |
| **ИИ-аналитика продаж** | Sellty | Отчёты, прогнозы |
| **AI buyer matching** | Brandboom Connect, Faire | Подбор байеров под бренд |

### F. Content & PIM

| Фича | Источник | Зачем |
|------|----------|-------|
| **Data Hub / PIM** | Fashion Cloud, Compo | Единый источник продукта, маркетинг, EDI |
| **DAM / медиа-активы** | Compo, Uphance | У Syntha уже есть Media Assets / Press Kit |
| **Автоматическая выгрузка в ритейл-шопы** | Fashion Cloud | Ускорение онбординга ритейлеров |
| **Многоязычность** | Playologie, SparkLayer | РФ + СНГ + экспорт |
| **Управление сезонами** | Uphance | Перенос SKU между сезонами без дублирования |

### G. Маркетплейс и discovery (если нужен marketplace-слой)

| Фича | Источник | Зачем |
|------|----------|-------|
| **Buyer discovery / поиск брендов** | Faire, Supl.biz | Ритейлер ищет бренды по критериям |
| **Каталог поставщиков/брендов** | Supl.biz | 1.7M компаний — масштаб |
| **Promoted listings / реклама** | Faire | Таргетированная видимость брендов |
| **Curated collections** | Faire | Eco, handmade, women-owned и т.п. |
| **Запрос предложений / тендеры** | B2B-Center | Для крупных закупок — скорее корпоративный сегмент |

### H. Интеграции и экосистема

| Фича | Источник | Зачем |
|------|----------|-------|
| **Битрикс24** | СотБит | CRM, коммуникации в РФ |
| **EDI** | AGORA, Fashion Cloud | Обмен с ритейлерами и ERP |
| **Shopify / WooCommerce** | Candid, SparkLayer, Uphance | Для blended B2B/B2C если будет |
| **ERP (NetSuite, ApparelMagic)** | Brandboom, Uphance | Для fashion-специфики |
| **Чат-боты Telegram/WhatsApp** | Sellty | У Syntha уже есть контакты TG/WA — логично развить |

### I. Организационное и compliance

| Фича | Источник | Зачем |
|------|----------|-------|
| **Exclusion zones** | Brandboom | Ограничение видимости по регионам (дистрибуция) |
| **Multi-brand на одной платформе** | Le New Black | Холдинги, несколько брендов |
| **Рекламации** | СотБит | Обработка возвратов/претензий B2B |
| **ЭЦП / КЭП** | B2B-Center, AGORA | Подписание документов в РФ |
| **GDPR / хранение данных** | Le New Black | Если работа с EU |

---

## 3. Что Syntha уже закрывает (по схеме)

- Профиль бренда: шоурум, магазины, интернет-магазины, контакты
- Media Assets / Press Kit с метками (Live, Внутреннее, Каталог, Индивидуально)
- B2B разделы: Коммерция, Лайншиты, Кампании, Прайсинг, Лояльность
- Маркетплейсы: WB, Ozon, Яндекс — парсинг цен, сравнение
- Синхронизация стоков магазинов
- Контакты с подписями (Пресса, B2B, Общий и т.д.)

---

## 4. Рекомендуемый roadmap фич (топ-20)

1. 1C интеграция (товары, цены, остатки, заказы)
2. Персональные прайс-листы и скидки по объёму
3. Digital Showroom с 360°/видео
4. Интерактивные line sheets с заказом из листа
5. Collaborative ordering (редактирование заказа бренд+байер)
6. ЭДО (счета, акты, накладные)
7. Интеграции с платёжными системами РФ
8. Интеграции с логистикой РФ
9. Re-order напоминания и Smart Replenishment
10. Pre-order / Re-order / At-Once ship windows
11. RFQ (запрос коммерческого предложения)
12. Отсрочка платежа и credit limits
13. Offline / мобильное приложение для репов
14. Event microsites под сезон/выставку
15. AI product recommendations
16. Чат-боты TG/WA для заказов
17. Buyer discovery / поиск брендов (если marketplace)
18. Exclusion zones по регионам
19. PIM / Data Hub для продукта
20. Многоязычность (RU/EN + при необходимости СНГ)

---

## 5. Не брать / отложить

| Фича | Источник | Почему |
|------|----------|--------|
| Полноценный маркетплейс как Faire | Faire | Другая модель, Syntha — платформа брендов, а не маркетплейс |
| Тендеры и аукционы | B2B-Center | Специфика B2G/крупные закупки, не core fashion B2B |
| PIM/MDM/DAM как Compo | Compo | Слишком тяжёлая платформа для старта; DAM уже частично есть |
| Velveto Ask-to-source | Velveto | Luxury, нишевая механика |
| WizStudio (AI imagery) | WizCommerce | Интересно, но долгосрочно — после базового функционала |

---

---

## 6. Интеграция в проект

- **Типы и константы:** `src/lib/b2b-features/` — ShipWindow, PriceList, RFQ, CreditTerms, ExclusionZone
- **Feature flags:** `src/lib/b2b-features/feature-config.ts`
- **Связи:** см. `INTEGRATION_MAP.md` — data→UI, модуль↔модуль
- **Компоненты:** `ShipWindowBadge` — пример использования b2b-features в B2B заказах

---

*Документ можно обновлять по мере появления новых платформ и требований рынка.*
