# Разделы организации — что улучшать дальше

## Уже сделано

- Общий период (7 дней / 30 дней / Календарь) в шапке, справа от «Организация › Центр управления»
- Один период управляет «Недавняя активность» и «Партнёрская экосистема»
- Индекс здоровья: кнопка «Обновить», скелетон при загрузке, данные из API (profile/dashboard/integrations); KPI brand/dashboard частично из БД (см. п.5)
- Шапка: название организации и юр.данные из API (profile); при ошибке загрузки профиля — сообщение и «Повторить»; при частичном сбое дашборда/интеграций — предупреждение и «Повторить»; участники/онлайн из dashboard (`participantsCount` и др.) или из `user.team`, иначе демо
- Карточки модулей: целиком кликабельны, aria-label; подстановка `label`/`value`/`status` из `brand/dashboard.moduleStats` (демо полный набор; при активной орг. — участники, «на подписи» из pending заказов, маркировка по `markingSyncStatus`)
- Партнёрская экосистема: блок «Партнёры по типам» / полоска роста из `dashboard.partnerEcosystem` (`growthByPeriod`, `countsPatchById`, при активной орг. ещё `businessProcessesPatchById` и `ecosystemBlocksPatchById` поверх `PARTNER_*` в page-data)
- Блок «Требует внимания»: неактивные блоки одного размера (110px), «Детально» в раздел; «Устранить» снимает пункт через `useAttentionAlerts`; начальное состояние из `dashboard.attentionAlerts`
- Недавняя активность: демо-события с `dayOffset` и `getRecentActivities(сегодня)` — даты в актуальном окне 7/30 дней
- Рефакторинг UI обзора: секции вынесены в `_components/*`
- Бэкенд: эндпоинты `/api/v1/brand/profile`, `/api/v1/brand/dashboard`, `/api/v1/brand/integrations`, `/api/v1/organization/health` (пока заглушки)

---

## Приоритет 1 — быстрые победы

### 1. ~~Недавняя активность: даты относительно «сегодня»~~ (сделано)

Реализовано через `RECENT_ACTIVITIES_BASE` + `dayOffset` и `getRecentActivities()` в эмбеде.

### 2. Шапка: «24 участника» и «8 онлайн» из API

Фронт уже подставляет числа из ответа `brand/dashboard` (поля `participantsCount` | `teamMembersCount` | `membersCount`, `onlineCount` | `membersOnline`) и из длины `user.team`, иначе — демо-константы. Когда контракт бэкенда стабилизируется, достаточно заполнять эти поля.

### 3. Ошибки и пустые состояния

- ~~При ошибке загрузки profile — короткое сообщение и «Повторить» в шапке.~~ Частичный сбой дашборда/интеграций при успешном профиле — мягкое предупреждение в шапке + «Повторить».
- Если после загрузки profile пустой — не ломать шапку, оставить fallback «Syntha HQ» (уже так).

---

## Приоритет 2 — данные с бэкенда

### 4. ~~Алерты «Требует внимания» из API~~ (частично сделано)

Инициализация из `brand/dashboard.attentionAlerts` после загрузки (`useAttentionAlerts`). Dismiss пока только локально.

### 5. Brand/dashboard — реальные агрегаты

**Частично:** в `app/api/v1/endpoints/brand.py` (`fetch_brand_dashboard_data`) сняты частые заглушки при «активной» организации (`orders` / `showrooms` / `members`):

| Поле | Источник в БД |
|------|----------------|
| `retailersCount` | `COUNT(DISTINCT coalesce(buyer_organization_id, buyer_id))` по `orders`; иначе `max(orders, showrooms, 1)` |
| `collectionsCount` | `CollectionDrop` + `Lookbook` по `brand_id` |
| `certsActive` | активные `EACCertificate` |
| `poInProduction` | заказы со статусом `confirmed` |
| `openB2bOrders` | только фактический pending (без «или 7» при активной орг.) |
| `markingSyncStatus` / `markingLastSync` | `ChestnyZnakCode`; без записей при активной орг. — warning |

Дальше: ритейлеры из доменной модели ассортимента/дилеров; маркировка из operational CRPT/outbox, не только локальные коды.

### 6. Карточки модулей: цифры из API

Сделано: `dashboard.moduleStats` (ключ = `href`) + `mergeNavigationCardsWithModuleStats` на фронте. Дальше — точнее считать профиль/интеграции и реальные документы «на подписи», не через proxy pending orders.

### 7. ~~Партнёрская экосистема: данные по периоду~~ (частично сделано)

Ответ `brand/dashboard.partnerEcosystem`:

| Поле | Поведение при `has_org_activity` |
|------|-----------------------------------|
| `growthByPeriod` | как демо-мок на фронте (пока без выравнивания с аналитикой) |
| `countsPatchById` | патч карточки «Магазины» (`retailersCount`/orders) |
| `businessProcessesPatchById` | `b2b-orders`, `documents`, `shipments`: счётчики заказов/ЭДО из БД |
| `ecosystemBlocksPatchById` | `contracts-docs`, `logistics-shipments`, `partner-analytics`: метрики/алерты из тех же источников где возможно |

Остальные процессы и блоки — заготовки из `page-data` до появления доменных агрегатов (возвраты, задачи, финансы).

---

## Приоритет 3 — полировка

### 8. Доступность (a11y)

- Проверить aria-label у всех интерактивных элементов в блоках «Требует внимания» и «Модули».
- Фокус и навигация с клавиатуры (кнопки периода, календарь, карточки).

### 9. Скелетоны при загрузке

Там, где данные приходят с API (шапка при первом загрузке профиля, партнёрская экосистема при появлении API), добавить скелетоны вместо резкого появления контента.

### 10. Organization health с бэкенда

Сейчас `/organization/health` возвращает `[]`, фронт сам считает метрики из profile/dashboard/integrations. Опционально: бэкенд считает агрегированные метрики и возвращает их в `data`, фронт использует при наличии.

---

Рекомендуемый следующий шаг: **persist dismiss алертов** (п.4), **health API или явный отказ** (п.10), **a11y/скелетоны** (п.8–9), или доработка п.5/п.6 под доменные счётчики.
