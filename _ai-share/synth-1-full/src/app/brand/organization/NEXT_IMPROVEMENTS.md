# Разделы организации — что улучшать дальше

## Уже сделано

- Общий период (7 дней / 30 дней / Календарь) в шапке, справа от «Организация › Центр управления»
- Один период управляет «Недавняя активность» и «Партнёрская экосистема»
- Индекс здоровья: кнопка «Обновить», скелетон при загрузке; при успешном ответе **`GET /api/v1/organization/health/{brandId}`** (`GenericResponse.data` = **bundle**: `metrics` + сырые `profile` / `dashboard` / `integrations`) хаб делает **один** запрос — метрики и шапка из одного снимка (`useOrganizationHealth`). Старый контракт (`data` = только массив метрик) или сбой — fallback: отдельные GET profile/dashboard/integrations и при необходимости локальный расчёт метрик.
- Шапка: название организации и юр.данные из API (profile); при ошибке загрузки профиля — сообщение и «Повторить»; при частичном сбое дашборда/интеграций — предупреждение и «Повторить»; участники/онлайн из `brand/dashboard` (`participantsCount`, зеркала **`teamMembersCount`** / **`membersCount`**, **`onlineCount`** / **`membersOnline`**) или из `user.team`, иначе демо
- Карточки модулей: целиком кликабельны, aria-label; подстановка `label`/`value`/`status` из `brand/dashboard.moduleStats` (демо полный набор; при активной орг. — участники из команды, **«На подписи» из ЭДО** `COUNT(EDODocument)` со статусами draft/sent, compliance по `markingSyncStatus`)
- Партнёрская экосистема: блок «Партнёры по типам» / полоска роста из `dashboard.partnerEcosystem` (`growthByPeriod`, `countsPatchById`, при активной орг. ещё `businessProcessesPatchById` и `ecosystemBlocksPatchById` поверх `PARTNER_*` в page-data)
- Блок «Требует внимания»: неактивные блоки одного размера (110px), «Детально» в раздел; «Устранить» снимает пункт через `useAttentionAlerts` и **persist в localStorage по brand id** (`attention-dismiss-storage.ts`); начальное состояние из `dashboard.attentionAlerts`
- Недавняя активность: демо-события с `dayOffset` и `getRecentActivities(сегодня)` — даты в актуальном окне 7/30 дней
- Рефакторинг UI обзора: секции вынесены в `_components/*`
- Бэкенд: `/api/v1/brand/profile`, `/api/v1/brand/dashboard`, `/api/v1/brand/integrations`; **`/api/v1/organization/health/{brand_id}`** — один снимок метрик + источников через `get_organization_health_bundle` (`organization_health_service`), без дублирующих параллельных запросов на фронте при актуальном контракте.

---

## Приоритет 1 — быстрые победы

### 1. ~~Недавняя активность: даты относительно «сегодня»~~ (сделано)

Реализовано через `RECENT_ACTIVITIES_BASE` + `dayOffset` и `getRecentActivities()` в эмбеде.

### 2. ~~Шапка: «24 участника» и «8 онлайн» из API~~ (сделано)

Бэкенд (`fetch_brand_dashboard_data`): **`participantsCount`** / **`teamMembersCount`** / **`membersCount`** — число активных **`User`** организации; при отсутствии записей — демо **24**. **`onlineCount`** / **`membersOnline`** — эвристика (~⅓ команды при участниках в БД; без участников — демо **8**). Фронт по-прежнему может подставить длину **`user.team`** как запасной источник.

Дальше при появлении телеметрии — реальный онлайн вместо эвристики.

### 3. Ошибки и пустые состояния

- ~~При ошибке загрузки profile — короткое сообщение и «Повторить» в шапке.~~ Частичный сбой дашборда/интеграций при успешном профиле — мягкое предупреждение в шапке + «Повторить».
- Если после загрузки profile пустой — не ломать шапку, оставить fallback «Syntha HQ» (уже так).

---

## Приоритет 2 — данные с бэкенда

### 4. ~~Алерты «Требует внимания» из API~~ (частично сделано)

Инициализация из `brand/dashboard.attentionAlerts` после загрузки (`useAttentionAlerts`). **Dismiss:** «Устранить» по пунктам с id сохраняется в **localStorage** по ключу бренда (`profile.brand.id` или fallback `BRAND_ID` из `organization-config`) — см. `attention-dismiss-storage.ts`. После перезагрузки страницы скрытые id не показываются, пока API снова не пришлёт те же записи (тогда пользователь может скрыть снова).

Дальше: синхронизация dismiss с бэкендом для нескольких устройств; отдельные действия по строкам `integrationIssues` (сейчас без dismiss).

### 5. Brand/dashboard — реальные агрегаты

**Частично:** в `app/api/v1/endpoints/brand.py` (`fetch_brand_dashboard_data`) сняты частые заглушки при «активной» организации (`orders` / `showrooms` / `members`):

| Поле | Источник в БД |
|------|----------------|
| `retailersCount` | UNION DISTINCT buyer из `orders` (`buyer_organization_id` \| `buyer_id`) и retailer id из **`Assortment.retailer_ids`** по `organization_id`; иначе при активной орг. — `max(orders, showrooms, 1)`, демо — как раньше |
| `collectionsCount` | `CollectionDrop` + `Lookbook` по `brand_id` |
| `certsActive` | активные `EACCertificate` |
| `poInProduction` | заказы со статусом `confirmed` |
| `openB2bOrders` | только фактический pending (без «или 7» при активной орг.) |
| `markingSyncStatus` / `markingLastSync` | локальные **`ChestnyZnakCode`**: `COUNT`, последнее событие `max(coalesce(applied_at, created_at))`; без записей при активной орг. — warning |
| `inventorySyncFailed30d` | **`InventorySyncLog`** со статусом `failed`, `organization_id == brand_id`, за 30 дн.; без активной орг. — `0` |
| `inventorySyncLastSuccessAt` | **`max(timestamp)`** успешных синков по `organization_id`; ISO datetime или `null` |

**Inventory sync:** в модели **`InventorySyncLog`** добавлено поле **`organization_id`** (nullable, индекс). SQL-патч: `scripts/sql/inventory_sync_logs_organization_id.sql`. Репозиторий: **`get_latest_logs_for_organization`**.

**CRPT / operational outbox (Python):** отдельная очередь операций ЧЗ не заведена — по-прежнему клиент **`CRPTClient`** и доменные события/outbox на стороне **`synth-1-full`** (см. `SOURCE_OF_TRUTH.md`, ops health). Следующий шаг при необходимости — таблица ретраев или зеркало статуса из шины.

Дальше: выравнивание retailer id с таблицей контрагентов при появлении модели.

### 6. Карточки модулей: цифры из API

Сделано: `dashboard.moduleStats` (ключ = `href`) + `mergeNavigationCardsWithModuleStats` на фронте. При активной организации карточка **`/brand/documents`** («На подписи») считается из **`EDODocument`** со статусами `draft`/`sent` (`documentsPendingSignature` в ответе дашборда для прозрачности). Карточка **`/brand/integrations`**: числитель/знаменатель **`X/Y`** по числу слотов с **`is_configured`** (те же 6 клиентов, что в `/integrations/status`), без сетевых health-check внутри запроса дашборда. Дальше — профиль с метриками заполненности при расширении моделей; при необходимости расширить знаменатель каталогом провайдеров.

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

- **Сделано:** осмысленные `aria-label` у триггеров карточек «Требует внимания», кнопки «Устранить» (локальный dismiss), кнопок Help по блокам; у значков «требует внимания» и подсказок в «Разделы организации» и «Партнёрская экосистема»; у основных ссылок на счётчики партнёров и процессов; группа периода в шапке — **`radiogroup`** для 7/30 дней, связка **`aria-labelledby`** с подписью «Период:», календарь без ложного **`aria-expanded`**, подпись контента календаря; фильтр участников в «Недавняя активность» — **`radiogroup`** и **`role="radio"`** / **`aria-checked`**; снижение дублей озвучки — тултипы на бейджах предупреждений с **`aria-hidden`** (подпись только **`aria-label`**), у фильтра участников тултип убран при сохранении **`aria-label`**.
- **Дальше:** при необходимости полный аудит таб-порядка (горизонтальные полосы карточек, вложенные попапы).

### 9. Скелетоны при загрузке

- **Сделано:** пока `healthLoading`, блоки «Партнёрская экосистема» и «Разделы организации» показывают полоски-карточки вместо статических данных из `page-data`; при подгрузке JS-чанка хаба — расширенный placeholder (шапка + полосы + скелетон модулей); блок **«Результаты бренда по ролям»** — `OrgHubRoleReportsSkeleton` при `healthLoading`.
- **Дальше:** при появлении удалённых данных в отчётах по ролям — расширить скелетон под фактическую раскладку.

### 10. ~~Organization health с бэкенда~~ (снимок без дублей — сделано)

**Контракт:** `GET /api/v1/organization/health/{brand_id}` → `GenericResponse.data` — объект **`{ metrics, profile, dashboard, integrations }`**: `metrics` — массив в форме `HealthMetric`; остальное — те же полезные нагрузки, что отдельные brand-эндпоинты (один проход на бэкенде: `get_organization_health_bundle`). Обратная совместимость: если задеплоен только массив в `data`, фронт как раньше подтягивает три GET и подставляет метрики из массива.

**Фронт:** `useOrganizationHealth` — при bundle с непустым `metrics` заполняет индекс и шапку без параллельных profile/dashboard/integrations; иначе — три запроса и/или локальный расчёт метрик.

**Дальше:** при желании — клиентский кэш/stale-time между визитами; доменные scores для «Безопасность», «Документы», «Настройки» вместо статических заглушек.

---

Рекомендуемый следующий шаг: расширить **п.6**, operational **CRPT**-очередь в Python при контракте; SQL **`scripts/sql/inventory_sync_logs_organization_id.sql`** на живых БД; клиентский кэш health между визитами при необходимости; реальный **online** в шапке при телеметрии (**п.2** дальше).
