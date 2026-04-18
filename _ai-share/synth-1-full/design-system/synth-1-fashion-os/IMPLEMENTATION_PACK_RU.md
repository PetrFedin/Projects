# Implementation Pack — Кабинеты и локализация (RU)

Документ переводит `FIGMA_SPEC_PACK_RU.md` в конкретный план внедрения в кодовую базу.

---

## 1) AcronymWithTooltip — где внедрять в первую очередь

## 1.1 Базовый компонент (создать)

- `src/components/ui/acronym-with-tooltip.tsx`
  - API:
    - `abbr: string`
    - `titleRu: string`
    - `descriptionRu?: string`
    - `className?: string`
  - Поведение:
    - hover + keyboard focus
    - `aria-label` содержит русскую расшифровку
  - Использовать существующий `Tooltip` из UI-kit.

## 1.2 Общие словари (создать)

- `src/lib/i18n/abbreviations-ru.ts`
  - `ROI`, `SKU`, `PO`, `RFM`, `KPI`, `GMV`, `LTV`, `AOV`, `ASN`, `PIM`, `ERP`, `SSO`, `VMI`, `BOM`, `QC`, `KIZ`, `MTK`, `RFID`, `LCA`, `ESG`, `DPP`, `API`.

---

## 1.3 Точки внедрения (конкретные файлы)

Ниже — приоритетный список для кабинетов и ключевых рабочих экранов.

### A) Client / User

- `src/app/client/page.tsx`
- `src/app/client/passport/page.tsx`
- `src/app/client/passport/[id]/page.tsx`
- `src/app/client/returns/page.tsx`
- `src/app/client/wardrobe/page.tsx`
- `src/app/client/style-quiz/page.tsx`
- `src/app/client/visual-search/page.tsx`
- `src/app/u/_components/LoyaltyBrandsTab.tsx`

### B) Brand

- `src/app/brand/page.tsx`
- `src/app/brand/control-center/page.tsx`
- `src/app/brand/analytics/page.tsx`
- `src/app/brand/customer-intelligence/page.tsx`
- `src/app/brand/warehouse/page.tsx`
- `src/app/brand/integrations/page.tsx`
- `src/app/brand/b2b-orders/[orderId]/page.tsx`
- `src/app/brand/production/operations/page.tsx`
- `src/app/brand/production/production-page-main.tsx`
- `src/app/brand/production/tech-pack/[id]/page.tsx`
- `src/app/brand/academy/platform/page.tsx`

### C) Admin

- `src/app/admin/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/admin/compliance/page.tsx`
- `src/app/admin/integrations/page.tsx`
- `src/app/admin/production/dossier-metrics/page.tsx`

### D) Distributor / Supplier / Factory / Shop

- `src/app/distributor/commissions/page.tsx`
- `src/app/distributor/vmi/page.tsx`
- `src/app/factory/page.tsx`
- `src/app/factory/inventory/rfid-gates/page.tsx`
- `src/app/shop/b2b/settings/page.tsx`
- `src/app/shop/b2b/reports/page.tsx`

---

## 2) Матрица кабинетов (готово / расхождения / что правим)

| Кабинет / роль | Ключевые маршруты | Готово | Расхождения | Что правим |
|---|---|---|---|---|
| Client hub | `/client/*` | Частично | На части страниц локальные `max-w/container` и разные плотности контента | Привести к `RoleShell` + токенам плотности, убрать page-level `max-w` где не нужен |
| User profile | `/u/*` | Да | Точечно возможны локальные визуальные паттерны в табах | Свести к общим компонентам header/list/kpi, убрать hand-made variants |
| Orders | `/orders/*` | Да | Контентные паттерны могут отличаться от `client/*` карточек | Унифицировать list-row/table row и action bar |
| Wallet | `/wallet` | Да | Уникальный визуальный стиль блока нормален, но должен жить в том же shell | Проверка только на shell consistency и локализацию |
| Academy (public client entry) | `/academy` | Да | Контентно может оставаться уникальным, но shell уже общий | Привести фильтры/карточки к общим patterns |
| Brand cabinet | `/brand/*` | Да | Большое число legacy-экранов с локальными паттернами | Batch-унификация: headers, KPI cards, tables, status-badge |
| Brand production | `/brand/production/*`, `/brand/production/workshop2/*` | Частично | Много сложных рабочих панелей с собственной плотностью | Зафиксировать `dense` режим, единые статус/label/tooltip правила |
| Admin cabinet | `/admin/*` | Да | Разброс в old/new страницах по типографике и таблицам | Единые table/list templates + локализация |
| Distributor cabinet | `/distributor/*` | Да | Меньше страниц, но есть mixed visual density | Привести к тем же card/table presets |
| Factory cabinet | `/factory/*` | Да | Supplier-режим через query норм, но есть отдельно `/supplier/*` | Либо алиасить `/supplier/*` в factory shell, либо отдельный supplier layout 1:1 по стилю |
| Supplier entry | `/supplier/*` | Нет (как полноценный кабинет) | Отдельный маршрут без системного shell | Добавить layout с тем же RoleShell и навигацией supplier |
| Shop cabinet | `/shop/*` | Да | B2B-подразделы местами с legacy заголовками | Пройтись по B2B страницам и унифицировать section header/actions |

---

## 3) Обязательные правила русского языка

- Всё, что можно локализовать, пишем на русском.
- Английскими остаются только:
  - общепринятые аббревиатуры (`ROI`, `SKU`, ...),
  - официальные названия внешних систем/интеграций.
- Для каждой английской аббревиатуры в UI: `AcronymWithTooltip` с русской расшифровкой.
- В одном label/control не смешивать RU+EN без необходимости.

---

## 4) Порядок внедрения (спринты)

### Sprint 1 (Shell + локализация основы)
- `AcronymWithTooltip` + словарь `abbreviations-ru`.
- Внедрить в Admin/Brand overview + Client core (`/client`, `/u`, `/orders`, `/wallet`).
- Закрыть `/supplier/*` shell mismatch.

### Sprint 2 (Ключевые рабочие модули)
- Brand production / b2b / logistics.
- Shop b2b.
- Distributor + factory high-value pages.

### Sprint 3 (Полировка и приемка)
- QA по чеклисту из `FIGMA_SPEC_PACK_RU.md`.
- Контраст, keyboard-focus, text overflow, тултипы аббревиатур.

---

## 5) Definition of Done (implementation)

- [ ] Во всех кабинетах одна и та же структура shell по роли.
- [ ] Нет страниц кабинета без левой панели (кроме явно утвержденных full-screen flow).
- [ ] Аббревиатуры имеют русскую расшифровку в tooltip.
- [ ] Новые и переработанные страницы проходят чеклист приемки без расхождений.

