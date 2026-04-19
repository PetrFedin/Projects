# Матрица: экраны `synth-1-full` → референсы Figma (JOOR / NuOrder стиль)

Официальных открытых файлов **«JOOR»** / **«NuOrder»** в Figma Community нет. Ниже — **сочетание** community- и коммерческих китов с плотным B2B / маркетплейс / ERP видом, плюс привязка к **реальным маршрутам** этого репозитория.

**Локальный визуальный контур в коде (не Figma):** NuOrder-плотность B2B заказа — `ShopB2bNuOrderScope` + `src/lib/ui/nuorder-desk-shell.ts`; клиент — `UserCabinetLayout` + тот же shell.

---

## Базовые наборы (скачать в Figma и держать закреплёнными)

| Назначение | Ссылка |
|------------|--------|
| B2B marketplace, платформа | [B2B Marketplace Design System](https://www.figma.com/community/file/1435362489727086735/b2b-marketplace-design-system) |
| Витрина + дашборд продавца | [The Marketplace — platform + dashboard](https://www.figma.com/community/file/1389690518497914770/the-marketplace-online-selling-platform-and-dashboard) |
| Дашборд маркетплейса | [Campify — Marketplace Dashboard UI Kit](https://www.figma.com/community/file/1542700572249139791/campify-marketplace-dashboard-ui-kit) |
| Админ e-commerce (заказы, списки) | [E-commerce Dashboard (Admin) UI Kits](https://www.figma.com/community/file/1480498382035772022/e-commerce-dashboard-admin-ui-kits) |
| ERP / плотные таблицы, формы | [Dashboard ERP](https://www.figma.com/community/file/1232606506320446290/dashboard-erp) |
| Календарь в дашборде | [Dashboard Calendar UI](https://www.figma.com/community/file/1147365569269359278/dashboard-calendar-ui) |
| Чат / инбокс | [Dashboard Messenger UI](https://www.figma.com/community/file/1158972259677179731/dashboard-messenger-ui) |
| Чат + дашборд (вариант) | [Chat Dashboard](https://www.figma.com/community/file/1375713819413154152/chat-dashboard) |
| Много экранов fashion e-com (аккаунт, заказы) | [QuickBasket Fashion eCommerce](https://webbytemplate.com/product/quickbasket-fashion-ecommerce-website-figma-template) |
| Карточки / multi-vendor (платно) | [Bazaar Figma UI Kit](https://ui-lib.com/downloads/bazaar-figma-ecommerce-uikit/) |

---

## Магазин розница `/shop/*` (не B2B)

| Маршрут / зона | Что искать в Figma | Первичный референс |
|----------------|-------------------|-------------------|
| `/shop` — хаб, метрики | Главная дашборда маркетплейса, KPI cards | Campify, The Marketplace |
| `/shop/orders`, `/shop/orders/[orderId]` | Список заказов, детальная карточка, таймлайн | E-commerce Admin UI Kits, The Marketplace |
| `/shop/product/[id]` — PDP в кабинете | PDP, галерея, варианты | The Marketplace, Bazaar |
| `/shop/inventory*` | Таблицы остатков, фильтры, bulk actions | **Dashboard ERP**, E-commerce Admin |
| `/shop/analytics`, `/shop/analytics/footfall` | Графики, сегменты, отчёты | Campify, E-commerce Admin |
| `/shop/calendar` | Календарь слотов / событий | **Dashboard Calendar UI** |
| `/shop/messages` | Список тредов + панель сообщений | **Dashboard Messenger UI** |
| `/shop/staff`, `/shop/career` | Таблицы людей, карточки ролей | B2B Marketplace DS, Dashboard ERP |

---

## Магазин B2B `/shop/b2b/*` (NuOrder / JOOR контур)

| Маршрут / зона | Что искать в Figma | Первичный референс |
|----------------|-------------------|-------------------|
| `/shop/b2b/order-mode`, `/shop/b2b/order-modes` | Выбор режима, крупные карточки сценария | B2B Marketplace DS, The Marketplace |
| `/shop/b2b/create-order`, `/shop/b2b/quick-order`, `/shop/b2b/working-order` | Формы + кнопки + «Excel» метафора | B2B Marketplace DS, **Dashboard ERP** |
| `/shop/b2b/matrix` | Матрица style × size, плотная сетка | **Dashboard ERP**, E-commerce Admin |
| `/shop/b2b/orders`, `/shop/b2b/orders/[orderId]` | Таблица строк заказа, статусы, документы | **Dashboard ERP**, E-commerce Admin |
| `/shop/b2b/catalog`, `/shop/b2b/products/*` | Сетка карточек SKU, фильтры | The Marketplace, Bazaar |
| `/shop/b2b/delivery-calendar`, `/shop/b2b/calendar`, `/shop/b2b/purchase-calendar` | Календарь поставок / встреч | **Dashboard Calendar UI** + ERP |
| `/shop/b2b/ez-order`, `/shop/b2b/lookbooks/*`, `/shop/b2b/showroom` | Лайншит, lookbook, shoppable grid | The Marketplace, QuickBasket |
| `/shop/b2b/collaborative-order`, `/shop/b2b/agent*` | Совместное редактирование, split view | **Dashboard Messenger UI** + ERP |
| `/shop/b2b/finance`, `/shop/b2b/payment`, `/shop/b2b/contracts*` | Формы, таблицы, summary cards | E-commerce Admin, **Dashboard ERP** |
| `/shop/b2b/partners*`, `/shop/b2b/discover` | Каталог брендов, карточки партнёра | B2B Marketplace DS, The Marketplace |
| `/shop/b2b/workspace-map` | Карта модулей / сетка ссылок | Campify |

---

## Бренд `/brand/*`

| Маршрут / зона | Что искать в Figma | Первичный референс |
|----------------|-------------------|-------------------|
| `/brand` хаб, `/brand/dashboard` | Орг-дашборд, sidebar + контент | B2B Marketplace DS, Campify |
| `/brand/products`, `/brand/collections`, PIM / матрицы | Таблицы, массовые действия | **Dashboard ERP**, E-commerce Admin |
| `/brand/production*`, `/brand/warehouse` | Статусы, таблицы, таймлайны | Dashboard ERP |
| `/brand/messages` | Чат с ритейлерами | **Dashboard Messenger UI** |
| `/brand/calendar`, `/brand/tasks` | Календарь + задачи | **Dashboard Calendar UI**, ERP |
| `/brand/b2b/*`, showroom, linesheets | B2B продажи бренда | B2B Marketplace DS, The Marketplace |
| `/brand/analytics*` | BI-виджеты | Campify, E-commerce Admin |

---

## Клиент `/client/*`

| Маршрут / зона | Что искать в Figma | Первичный референс |
|----------------|-------------------|-------------------|
| `/client/me` | ЛК: вкладки, карточки, настройки | QuickBasket (account), The Marketplace |
| `/client/catalog`, `/client/wishlist`, `/client/wardrobe` | Карточки товара, сетки | The Marketplace, Bazaar |
| `/client/returns` и др. операционные | Списки, статусы | E-commerce Admin |
| Чаты / уведомления | Inbox | Dashboard Messenger UI |

---

## Админ платформы `/admin/*`

| Зона | Что искать в Figma | Первичный референс |
|------|-------------------|-------------------|
| Реестры (users, brands, attributes) | Плотные таблицы, фильтры | **Dashboard ERP** |
| `/admin/activity`, аудит | Лента событий | E-commerce Admin, ERP |
| `/admin/promotions/calendar` | Календарь акций | **Dashboard Calendar UI** |

---

## Публичная витрина / маркетплейс

| Зона | Что искать в Figma | Первичный референс |
|------|-------------------|-------------------|
| PLP / поиск / карточки товара | Product grid, filters | The Marketplace, Bazaar |
| `/b/[brandId]` | Storefront + табы | QuickBasket, The Marketplace |

---

## Как пользоваться

1. Файл **«References»** в Figma: **Copy** нужных фреймов из community — не подключать чужую библиотеку целиком в прод.
2. Новый экран в коде: 2–3 референса из таблицы + канон `STYLE_GUIDE.md`, `design-system/synth-1-fashion-os/MASTER.md`, `CABINET_PROFILES_STYLING_RULES_RU.md`.
3. B2B заказ: сверка с UI `ShopB2bNuOrderScope` в браузере; Figma — для новых блоков.

Маршруты см. `src/lib/routes.ts`. Обновлять эту матрицу при крупных новых разделах.
