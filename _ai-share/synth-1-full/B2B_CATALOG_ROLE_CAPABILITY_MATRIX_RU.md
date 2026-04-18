# Матрица ролей и возможностей B2B Каталога

## Назначение

Зафиксировать `B2B КАТАЛОГ` как сквозной capability-layer, встроенный в ролевые кабинеты, а не как изолированный раздел.

## Каноническая модель

- `B2B КАТАЛОГ` = общий процесс:
  - поиск и discovery ассортимента
  - формирование селекции
  - создание/согласование заказа
  - исполнение и отгрузка
  - контроль финансов и compliance
- Каждая роль работает с теми же сущностями, но со своими правами и действиями.
- Админ имеет сквозной контроль и аудит.

## Матрица ролей

| Роль                   | Ключевые B2B-цели                                                         | Входные маршруты в кабинете                                                                             | Обязательные возможности                                                                            | Кросс-ролевые взаимодействия                                                         |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Магазин (buyer)        | Находить бренды/SKU, собирать и отправлять оптовые заказы                 | `/shop/b2b/catalog`, `/shop/b2b/discover`, `/shop/b2b/create-order`, `/shop/b2b/orders`                 | Просмотр каталога, планирование ассортимента, quick/grid/working order, трекинг документов/платежей | Создает заказ для Brand; отправляет amendments; отслеживает исполнение Brand/Factory |
| Бренд (seller)         | Публиковать предложение, управлять условиями, обрабатывать входящий спрос | `/brand/showroom`, `/brand/b2b/linesheets`, `/brand/b2b-orders`, `/brand/b2b/price-lists`               | Управление оффером, лайншиты, approval workflow, shipments, коммерческие условия                    | Получает заказы от Shop/Distributor; передает исполнение Factory/Supplier            |
| Производство (factory) | Исполнять подтвержденный спрос и подтверждать выпуск/качество             | `/factory/production`, `/factory/orders`, `/factory/inventory`, `/factory/documents`                    | Прием задач на производство, статусы, аллокация остатков, quality checkpoints, документы            | Получает задачи от Brand; возвращает статусы Brand/Shop                              |
| Поставщик              | Обеспечивать материалы и upstream availability/compliance                 | `/supplier/circular-hub` (текущий), supplier-сценарии через Brand/Factory                               | Готовность материалов, compliance-сигналы, traceability                                             | Поддерживает доступность и compliance для Factory/Brand                              |
| Дистрибутор            | Агрегировать спрос, сопровождать каналы и контракты                       | `/distributor/orders`, `/distributor/matrix`, `/distributor/contracts`, `/distributor/brands`           | Multi-brand ordering, контрактные операции, territory/account контроль, координация ритейла         | Связывает спрос Shop и предложение Brand; может быть buyer-proxy                     |
| Админ                  | Сквозной контроль, policy enforcement, observability                      | `/admin`, `/admin/audit`, `/admin/disputes`, `/admin/integrations`, `/admin/production/dossier-metrics` | Мониторинг, override, аудит, SLA/watchdog, контроль интеграций                                      | Контролирует переходы состояний и исключения по всем ролям                           |

## Покрытие возможностей (Current vs Target)

### 1) Discovery и селекция

- Current:
  - Shop: сильное покрытие через `/shop/b2b/catalog`, `/shop/b2b/discover`, `/shop/b2b/selection-builder`.
  - Brand: сильное покрытие через showroom/linesheets в `/brand/*`.
- Target:
  - Сохранить role-view, но выровнять по общим product/order identifiers.

### 2) Сборка и отправка заказа

- Current:
  - Shop: несколько поверхностей (`create-order`, `quick-order`, `grid-ordering`, `working-order`).
  - Brand: обработка входящих заказов в `/brand/b2b-orders`.
- Target:
  - Зафиксировать один канонический buyer flow и один seller processing flow.

### 3) Исполнение и handoff в производство

- Current:
  - У Brand есть shipment/approval маршруты; у Factory есть production/order маршруты.
- Target:
  - Явный статусный мост между `/brand/b2b-orders` и `/factory/orders`/`/factory/production`.

### 4) Документы, финансы, compliance

- Current:
  - Shop: `/shop/b2b/documents`, `/shop/b2b/payment`, `/shop/b2b/finance`.
  - Brand: `/brand/documents`, `/brand/finance`, `/brand/compliance`.
  - Admin: audit/compliance/disputes.
- Target:
  - Единая policy + event-видимость по всем переходам и override.

## Обязательные UX-правила

- B2B-функции должны быть встроены в сайдбар и секционную структуру каждого ролевого кабинета.
- Верхнее глобальное меню — только platform entry; операционная глубина — внутри кабинетов.
- Без дублей по смыслу в top-level навигации.
- Кросс-ролевые ссылки должны быть контекстными и permission-safe.

## Требования к админ-контролю

- Единая кросс-ролевая timeline жизненного цикла заказа.
- Видимость аудит-событий create/update/approve/reject.
- Обработка исключений: disputes, SLA breaches, integration failures.
- Сквозной drill-down между кабинетами + контролируемые override-действия.

## Ближайший implementation backlog

1. Собрать каноническую B2B-карту навигации по ролям (shop/brand/factory/supplier/distributor/admin).
2. Зафиксировать канонические маршруты по этапам цикла (discover, compose, approve, fulfill, close).
3. Добавить явные кросс-ролевые переходы в order/entity detail.
4. Добавить в админке раздел “B2B lifecycle control” на тех же сущностях.
5. Убрать orphan/duplicate B2B entry points из глобального top-menu.

## Критерии приемки

- Каждая роль закрывает свои B2B-обязанности из собственного кабинета.
- Кросс-ролевые взаимодействия доступны через явные защищенные переходы.
- Админ видит и аудирует полный жизненный цикл без скрытых контекстов.
- Нет runtime-навигационных ошибок (`href`, duplicate keys) на B2B entry и related blocks.

## План отказа от агрегатора

- Дорожная карта деактивации `/shop/b2b/catalog`: `B2B_CATALOG_DEPRECATION_PLAN_RU.md`.
