# Разделы организации — что улучшать дальше

## Уже сделано

- Общий период (7 дней / 30 дней / Календарь) в шапке, справа от «Организация › Центр управления»
- Один период управляет «Недавняя активность» и «Партнёрская экосистема»
- Индекс здоровья: кнопка «Обновить», скелетон при загрузке; при успешном ответе **`GET /api/v1/organization/health/{brandId}`** (`GenericResponse.data` = массив метрик в формате `HealthMetric`) фронт берёт метрики оттуда (`useOrganizationHealth`). Если запрос пустой/ошибка — расчёт на клиенте из profile/dashboard/integrations.
- Шапка: название организации и юр.данные из API (profile); при ошибке загрузки профиля — сообщение и «Повторить»; при частичном сбое дашборда/интеграций — предупреждение и «Повторить»; участники/онлайн из dashboard (`participantsCount` и др.) или из `user.team`, иначе демо
- Карточки модулей: целиком кликабельны, aria-label; подстановка `label`/`value`/`status` из `brand/dashboard.moduleStats` (демо полный набор; при активной орг. — участники из команды, **«На подписи» из ЭДО** `COUNT(EDODocument)` со статусами draft/sent, compliance по `markingSyncStatus`)
- Партнёрская экосистема: блок «Партнёры по типам» / полоска роста из `dashboard.partnerEcosystem` (`growthByPeriod`, `countsPatchById`, при активной орг. ещё `businessProcessesPatchById` и `ecosystemBlocksPatchById` поверх `PARTNER_*` в page-data)
- Блок «Требует внимания»: неактивные блоки одного размера (110px), «Детально» в раздел; «Устранить» снимает пункт через `useAttentionAlerts` и **persist в localStorage по brand id** (`attention-dismiss-storage.ts`); начальное состояние из `dashboard.attentionAlerts`
- Недавняя активность: демо-события с `dayOffset` и `getRecentActivities(сегодня)` — даты в актуальном окне 7/30 дней
- Рефакторинг UI обзора: секции вынесены в `_components/*`
- Бэкенд: `/api/v1/brand/profile`, `/api/v1/brand/dashboard`, `/api/v1/brand/integrations`; **`/api/v1/organization/health/{brand_id}`** — агрегация метрик через `organization_health_service` (профиль и дашборд из БД, интеграции через `fetch_integrations_status_data`; имейте в виду дублирующие запросы при параллельной загрузке хаба и health).

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

Дальше: operational CRPT/outbox и InventorySync по бренду (сейчас лог без `organization_id`); выравнивание retailer id с таблицей контрагентов при появлении модели.

### 6. Карточки модулей: цифры из API

Сделано: `dashboard.moduleStats` (ключ = `href`) + `mergeNavigationCardsWithModuleStats` на фронте. При активной организации карточка **`/brand/documents`** («На подписи») считается из **`EDODocument`** со статусами `draft`/`sent` (`documentsPendingSignature` в ответе дашборда для прозрачности). Дальше — интеграции «активно X/Y» из snapshot статусов без лишних health-check на каждый открытый хаб; профиль с метриками заполненности при расширении моделей.

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

- **Сделано:** осмысленные `aria-label` у триггеров карточек «Требует внимания», кнопки «Устранить» (локальный dismiss), кнопок Help по блокам; у значков «требует внимания» и подсказок в «Разделы организации» и «Партнёрская экосистема»; у основных ссылок на счётчики партнёров и процессов.
- **Дальше:** кнопки периода, календарь, проход по остальным виджетам хаба (фокус, порядок табуляции, дублирование озвучки).

### 9. Скелетоны при загрузке

Там, где данные приходят с API (шапка при первом загрузке профиля, партнёрская экосистема при появлении API), добавить скелетоны вместо резкого появления контента.

### 10. ~~Organization health с бэкенда~~ (частично сделано)

**Контракт:** `GET /api/v1/organization/health/{brand_id}` → `GenericResponse.data`: массив словарей в форме метрик хаба (`label`, `score`, `color`, `href`, `status`, `details`, …). Реализация: `app/services/organization_health_service.py` вызывает `fetch_brand_profile_data` / `fetch_brand_dashboard_data` с **`AsyncSession`** и `fetch_integrations_status_data`; счёт «Активность команды» берёт `participantsCount` из дашборда (fallback 8 как демо).

**Фронт:** `useOrganizationHealth` — если `data` непустой массив, это источник правды для блока индекса; иначе локальный расчёт (как раньше).

**Дальше:** кэш/snapshot чтобы не трижды дергать профиль+дашборд при открытии хаба; доменные_scores для «Безопасность», «Документы», «Настройки» вместо статических заглушек.

---

Рекомендуемый следующий шаг: **п.8–9** (a11y и скелетоны), углубление **п.6** (интеграции в module stats), или **CRPT/outbox** для п.5.
