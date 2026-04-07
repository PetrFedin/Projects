# Карта: единая модель контроля коллекции ↔ реализованный функционал Synth-1

Документ привязывает блоки из `COLLECTION_CONTROL_UNIFIED_RU.md` к **маршрутам и модулям** в репозитории, указывает **кто по смыслу ведёт** (роли из UI) и отмечает **пробелы**.

**Важно:** большая часть производственного контура — **UI и демо-данные** (в т.ч. `localStorage` в `brand-production`), **без единого production API**. «Реализовано» ниже = **есть экран/тип/логика на фронте**, если не указано иное.

**Роли производства:** `synth-1/src/lib/production-permissions.ts` — `admin`, `brand`, `designer`, `technologist`, `production_manager`, `manufacturer`, `supplier`.  
**Роли операций (localStorage):** `synth-1/src/lib/brand-production/rbac.ts` — `design`, `production`, `procurement`, `merchandising`, `admin`.

---

## Легенда

| Статус | Смысл |
|--------|--------|
| ✅ Есть | Страница/компонент покрывает сценарий (часто на моках) |
| ⚠️ Частично | Задел есть, нет полной сквозной модели или бэкенда |
| ❌ Нет | Нужно добавить |

---

## 1. Цели и объекты данных

| Блок | Где в продукте | Кто (типично) | Статус |
|------|----------------|---------------|--------|
| Коллекция | `/brand/production` (контекст коллекции), `brand-production` | brand, production_manager, admin | ⚠️ Нет единого backend CRUD коллекций; ведение в UI производства |
| Стиль / SKU | `/brand/products`, `/brand/products/matrix`, карточка продукта | merchandising, brand | ✅ PIM UI |
| Tech Pack / BOM | `/brand/production/tech-pack/[id]`, `synth-1/src/lib/types/production.ts` | technologist, brand | ✅ UI; ❌ общий персистентный API |
| PO, фабрики | `/brand/production`, `/brand/factories`, `/brand/production/gantt` | production_manager; manufacturer — узко | ✅ UI; ❌ ERP |
| Сообщения / задачи / календарь | `/brand/messages`, `/brand/tasks`, `/brand/calendar` | команда бренда | ✅; ❌ строгая привязка треда к `styleId`/`poId` — проверять реализацию |
| Аудит | `/brand/production/operations` | admin | ⚠️ localStorage, не юридический аудит |

---

## 2. Этапы (`collection-steps-catalog.ts` → UI)

Визуализация цеха: `/brand/production?floorTab=…` — `synth-1/src/lib/production/floor-flow.ts`.

| Этап (id) | Маршрут | Статус |
|-----------|---------|--------|
| brief | `/brand/collections/new` | ✅ `src/app/brand/collections/new/page.tsx` |
| assortment-map | `/brand/products` | ✅ |
| collection-hub | `/brand/production?floorTab=workshop` | ✅ |
| costing | `/brand/analytics/budget-actual`, прайсинг | ✅ |
| materials | `/brand/materials`, RFQ, резерв | ✅ |
| tech-pack | `/brand/production/tech-pack/...` | ✅ |
| photo-ref | `/brand/media`, content-hub | ✅ |
| gate-all-stakeholders | `/brand/process/production/live` | ✅ схема; ❌ формальные подписи сторон |
| supply-path | материалы, `/brand/vmi`, `/brand/warehouse` | ✅ |
| samples | `floorTab=sample`, gold-sample, fit-comments | ✅ |
| b2b-linesheets | `/brand/b2b/linesheets` | ✅ |
| production-window | `/brand/factories`, `floorTab=plan` | ✅ |
| po | plan / gantt | ✅ |
| floor-ops | `/brand/production/operations`, `floorTab=ops` | ✅ |
| supplies-bind | `floorTab=supplies` | ✅ |
| nesting-cut | `floorTab=nesting` | ✅ |
| floor-execution | `floorTab=launch` | ✅ |
| qc | `floorTab=quality`, `/brand/production/qc-app`, `/brand/quality` | ✅ (`/brand/quality` не вынесен в `ROUTES`, но папка есть) |
| ready-made | `floorTab=receipt`, ready-made | ✅ |
| wholesale-prep | `/brand/warehouse`, логистика | ✅ |
| b2b-ship-stores | `/brand/b2b/shipments` | ✅ |
| sustainability | `/brand/esg` | ✅ |

---

## 3. Фурнитура, бирки, упаковка, остатки

| Блок | Где | Статус |
|------|-----|--------|
| BOM: trim, label, packaging | `BOMItem` + tech-pack | ✅ типы; ⚠️ не все отдельные рабочие процессы |
| Склад, резерв, VMI | warehouse, inventory, materials/reservation, vmi | ✅ UI; ❌ единый журнал движений и владелец «бренд vs цех» |
| Тираж/остатки бирок | — | ❌ |
| Упаковка как снабжение | только BOM packaging | ⚠️ |

---

## 4. Российский контур

| Блок | Где | Статус |
|------|-----|--------|
| ЭДО | `/brand/compliance`, `/brand/documents` | ✅ демо |
| КИЗ / Честный ЗНАК | compliance, копирайт | ❌ интеграция ЦРПТ/ГИС МТ |
| EAC / ТР ТС | compliance, демо на brand page | ⚠️ без API на SKU |
| 1С / МойСклад | `/brand/integrations/erp-plm` | ⚠️ задел |
| НДС, отсрочки РФ | `/brand/finance/rf-terms` | ✅ |

---

## 5. Кто что делает (`production-permissions`)

| Роль | Суть |
|------|------|
| designer | PLM/творчество, без апрува семпла и без PO |
| technologist | PLM, апрув семпла, QC |
| production_manager | операционный полный цикл (кроме нюансов бюджета в матрице) |
| brand / admin | по флагам — максимум |
| manufacturer | семплы/заказы/QC, **без** коллекций и PLM в матрице |
| supplier | в матрице почти всё false — **нужен кабинет поставщика** ❌ |

---

## 6. Пробелы (добавить)

1. Сквозной **backend** коллекция → артикул → версия ТЗ → PO → склад.  
2. **Профили коллекции** (новая / reorder).  
3. **Гейты с подписью** и неизменяемый аудит.  
4. **Маркировка РФ** как данные по партии + УПД.  
5. **Кабинет поставщика**.  
6. **Hotspot мерок** на скетче.  
7. **Бирки/упаковка** — отдельный учёт и остатки.

---

## 7. Файлы

- `synth-1/src/lib/routes.ts`
- `synth-1/src/lib/production/collection-steps-catalog.ts`
- `synth-1/src/lib/production/floor-flow.ts`
- `synth-1/src/lib/production-permissions.ts`
- `synth-1/src/lib/brand-production/*`
- `synth-1/src/lib/types/production.ts`
- `synth-1/src/app/brand/production/production-page-main.tsx`
- `synth-1/src/app/brand/production/operations/page.tsx`

*Версия: 1.0*
