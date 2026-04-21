# Детальный аудит: раздел ОРГАНИЗАЦИЯ

**Дата:** 20 марта 2025  
**Область (архив аудита):** Backend API (`app/`) + Frontend (канон: **`_ai-share/synth-1-full/`**; субмодуль **`synth-1/`** на момент аудита уже не используется как зависимость монорепо) + Связи

---

## 1. СТРУКТУРА РАЗДЕЛА

### 1.1 Backend API

| Endpoint | Файл | Статус | Описание |
|----------|------|--------|----------|
| `GET /organization/health/{brand_id}` | organization.py | ⚠️ **Пустой** | Возвращает `[]` — логика не реализована |
| `GET /brand/profile/{brand_id}` | brand.py | ⚠️ **Mock** | TODO: load from DB; фиксированные данные |
| `GET /brand/dashboard/{brand_id}` | brand.py | ⚠️ **Mock** | retailersCount, openB2bOrders — статика |
| `GET /brand/integrations/status/{brand_id}` | brand.py | ✅ **Реальный** | Health check CRPT, EDO, 1C, CDEK, Payment |

### 1.2 Frontend (synth-1)

**Главная:** `/brand/organization`  
**Подразделы по brand-navigation.ts:**

| value | label | href | В NAVIGATION_CARDS |
|-------|-------|------|--------------------|
| organization | Профиль и команда | /brand/organization | — |
| profile | Профиль бренда | /brand | ✅ |
| team | Команда | /brand/team | ✅ |
| integrations | Интеграции | /brand/integrations | ✅ |
| erp-plm | ERP, PLM, POS | /brand/integrations/erp-plm | ❌ (под integrations) |
| webhooks | Webhooks & API | /brand/integrations/webhooks | ❌ |
| sso | SSO | /brand/integrations/sso | ❌ |
| subscription | Подписка | /brand/subscription | ✅ |
| documents | Документы | /brand/documents | ✅ (как «Документооборот») |
| settings | Настройки | /brand/settings | ✅ |
| security | Безопасность | /brand/security | ✅ |

**В page-data.ts NAVIGATION_CARDS (8 карточек):**  
Профиль, Команда, Документооборот, Интеграции, Подписка, Безопасность, Настройки, **ЭДО и маркировка**

---

## 2. ПОВТОРЫ И ЛИШНЕЕ

### 2.1 Дублирование навигации

| Проблема | Где | Рекомендация |
|----------|-----|--------------|
| **Профиль и команда** vs **Профиль бренда** + **Команда** | brandNavGroups: «Профиль и команда» ведёт на organization; отдельно profile и team | «Профиль и команда» — обзор; profile и team — детали. Оставить, но уточнить: organization = обзор всей орг-и |
| **Документы** vs **Документооборот** | В nav: «Документы»; в карточках: «Документооборот» | Унифицировать: «Документооборот» (РФ) или «Документы» |
| **ЭДО и маркировка** | Отдельная карточка в modules + отдельная группа «ЭДО и маркировка (РФ)» в brandNavGroups | Карточка дублирует навигацию — оставить, это быстрый доступ |
| **Интеграции** | integrations, erp-plm, webhooks, sso — 4 пункта в nav | erp-plm, webhooks, sso — подпункты integrations. Лишнего нет |

### 2.2 Избыточное для РФ

| Элемент | Оценка | Комментарий |
|---------|--------|-------------|
| **SSO** | Опционально | Корпоративная аутентификация — полезно для крупных брендов |
| **Webhooks & API** | Нужно | Автоматизация, интеграции |
| **ERP, PLM, POS** | Нужно | 1С, Мой Склад — критично для РФ |
| **Credit Risk, Last Call** | Узкоспец. | B2B‑специфика; для РФ актуально |
| **JOOR/NuOrder/Fashion Cloud** | Лишнее для РФ | Западные платформы; РФ: WB, Ozon, 1С, Диадок |

### 2.3 HEALTH_METRICS vs ONBOARDING

- **HEALTH_METRICS:** 9 метрик (Профиль, Безопасность, Команда, Интеграции, ЭДО и маркировка, Подписка, Документы, Настройки).
- **ONBOARDING_STEPS:** 5 шагов (Профиль, Команда, Интеграции, ЭДО и маркировка, Подписка).
- **Повтор:** Документы и Настройки есть только в HEALTH_METRICS.
- **Вывод:** Повторов по сути нет, разные цели (health vs onboarding).

---

## 3. НЕРАБОТАЮЩИЕ ЭЛЕМЕНТЫ

### 3.1 Backend

| Endpoint | Проблема |
|----------|----------|
| `GET /organization/health/{brand_id}` | Всегда `[]` — фронт не получает метрики |
| `GET /brand/profile/{brand_id}` | Mock, нет сохранения |
| `GET /brand/dashboard/{brand_id}` | Mock, нет реальных KPIs |

### 3.2 Frontend (из ORGANIZATION_AUDIT.md)

| Элемент | Проблема |
|---------|----------|
| «Добавить интеграцию» | Нет модального окна |
| Verify Now / Verify Sync | Заглушки (setTimeout) |
| «Изменить план» | Нет страницы выбора плана |
| «История изменений» в профиле | Заглушка |
| Переход Интеграции → Безопасность (API ключи) | Логика не связана |

### 3.3 Связь Frontend ↔ Backend

| Данные на странице | API | Статус |
|--------------------|-----|--------|
| Organization Health | `GET /organization/health/{brand_id}` | ❌ Пустой ответ |
| Health metrics (92, 88, 84, 76) | — | Frontend mock (HEALTH_METRICS) |
| Integrations status | `GET /brand/integrations/status/{brand_id}` | ✅ Реальный |
| Recent Activity | — | Frontend mock (RECENT_ACTIVITIES_BASE) |
| Onboarding progress | — | Frontend mock |
| Partner counts | — | Frontend mock (PARTNER_COUNTS) |
| Navigation cards stats | — | Frontend mock |

---

## 4. КНОПКИ И СВЯЗИ

### 4.1 Control Panel (из page-data, ORGANIZATION_OVERVIEW)

Кнопки: Документы, Настройки, Безопасность, Профиль бренда.

| Кнопка | href | Работоспособность |
|--------|------|-------------------|
| Документы | /brand/documents | ✅ Есть в ROUTES |
| Настройки | /brand/settings | ✅ Есть в ROUTES |
| Безопасность | /brand/security | ✅ Есть в ROUTES |
| Профиль бренда | /brand | ✅ Есть в ROUTES |

### 4.2 NAVIGATION_CARDS (8 карточек)

| Карточка | href | addHref | addLabel |
|----------|------|---------|----------|
| Профиль бренда | /brand | /brand | Редактировать |
| Команда | /brand/team | /brand/team?action=invite | Добавить |
| Документооборот | /brand/documents | /brand/documents?action=new | Добавить |
| Интеграции | /brand/integrations | /brand/integrations | Подключить |
| Подписка и биллинг | /brand/subscription | — | — |
| Безопасность | /brand/security | /brand/security | Настроить |
| Настройки | /brand/settings | /brand/settings | Открыть |
| ЭДО и маркировка | /brand/compliance | /brand/compliance | Настроить |

Все href есть в `ROUTES`. Проверка существования страниц — отдельная задача.

### 4.3 RelatedModulesBlock (getOrgLinks)

Связи: Команда, Документы, Интеграции, Compliance, Центр управления — все через ROUTES.

### 4.4 ALERT_BLOCK_META (Требует внимания)

| Блок | detailHref |
|------|------------|
| certificates | /brand |
| profile | /brand |
| systems | /brand/integrations |
| tasks | /brand/team?tab=tasks |

### 4.5 ONBOARDING_STEPS

Каждый шаг имеет `href`; связи есть.

### 4.6 PARTNER_ECOSYSTEM (Партнёрская экосистема)

- PARTNER_COUNTS: factories, suppliers, retailers, distributors, integrations.
- PARTNER_BUSINESS_PROCESSES: B2B заказы, Документы, Задачи, Возвраты, Отгрузки, Закупки.
- Все href через ROUTES — связи настроены.

---

## 5. ОТСУТСТВУЮЩИЕ РАЗДЕЛЫ

### 5.1 Для РФ критично

| Раздел | Статус | Приоритет |
|--------|--------|-----------|
| ЭДО (Диадок/Контур) | Есть /brand/compliance, API integrations | Реализовать подключение |
| Честный ЗНАК | В compliance, API есть | Реализовать подключение |
| 1С интеграция | Упоминается, инфраструктура есть | Подключить |
| Маркетплейсы WB/Ozon | Ozon в integrations — not_configured | Добавить API |

### 5.2 Из ORGANIZATION_AUDIT (ещё не сделано)

| Раздел | Описание |
|--------|----------|
| Вкладка «Сертификаты» | В профиле бренда |
| Документооборот | /brand/documents — страница есть, полнота не проверена |
| Вкладка «Каналы продаж» | В настройках |
| Notifications Hub | Алерты на главной организации |

---

## 6. СВОДКА ПО РАЗДЕЛУ «ОРГАНИЗАЦИЯ»

### Сильные стороны
- Интеграции: реальный health check (CRPT, EDO, 1C, CDEK, Payment).
- Навигация: 8 карточек модулей + партнёрская экосистема.
- Онбординг: 5 шагов с href.
- Связи: entity-links, getOrgLinks, MODULE_HUBS — настроены.

### Критические пробелы
1. **`GET /organization/health/{brand_id}`** — пустой ответ, нужна агрегация метрик.
2. **Profile/Dashboard** — mock, нужна привязка к БД.
3. **Кнопки без действий:** Добавить интеграцию, Verify, Изменить план.

### Повторы
- «Документы» / «Документооборот» — разное именование.
- «Профиль и команда» vs «Профиль» + «Команда» — можно уточнить иерархию.

### Лишнее для РФ
- Западные интеграции (JOOR, NuOrder, Fashion Cloud) — низкий приоритет для локального рынка.

### Рекомендации (по приоритету)

1. **Высокий:** Реализовать `organization/health` — агрегация из profile, team, integrations, compliance.
2. **Высокий:** Подключить profile и dashboard к БД (Organization, Brand).
3. **Средний:** Модальные окна для «Добавить интеграцию», «Изменить план».
4. **Средний:** Verify Now — бэкенд верификации.
5. **Низкий:** Унифицировать «Документы» / «Документооборот».
