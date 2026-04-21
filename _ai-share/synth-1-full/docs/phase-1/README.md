# Этап 1 — навигация и UI-контур ядра

**Назначение:** после [`docs/phase-0`](../phase-0/README.md) выровнять **пять кабинетов** так, чтобы основной контур был **понятен за 30 секунд**, навигация и матрица ролей не расходились с кодом, а демо честно отмечалось — без попытки «закрыть весь ERP» одним спринтом.

**Входные артефакты:** [`PHASE-0-MAIN-CONTOUR.md`](../phase-0/PHASE-0-MAIN-CONTOUR.md), ADR, [`glossary-ids.md`](../phase-0/glossary-ids.md), [`src/lib/data/CORE_OPERATING_CHAIN.md`](../../src/lib/data/CORE_OPERATING_CHAIN.md), [`src/lib/data/CORE_PRODUCT_DEEP_PLAN.md`](../../src/lib/data/CORE_PRODUCT_DEEP_PLAN.md).

**Исполняемый план (волны A–D, задачи, DoD):** [`PHASE-1-PLAN.md`](./PHASE-1-PLAN.md).

**Что делать дальше по шагам (список, якоря кода):** [`PHASE-1-NEXT-ACTIONS.md`](./PHASE-1-NEXT-ACTIONS.md).

**Решение §6.1 (демо + продукт):** [`PHASE-1-DECISION-6.1.md`](./PHASE-1-DECISION-6.1.md) · **инвентаризация демо-экранов:** [`PHASE-1-DEMO-INVENTORY.md`](./PHASE-1-DEMO-INVENTORY.md).

| Файл | Назначение |
|------|------------|
| [`PHASE-1-PLAN.md`](./PHASE-1-PLAN.md) | Волны A–D, DoD |
| [`PHASE-1-NEXT-ACTIONS.md`](./PHASE-1-NEXT-ACTIONS.md) | Пошаговый чеклист |
| [`PHASE-1-DECISION-6.1.md`](./PHASE-1-DECISION-6.1.md) | Принятое решение демо + продукт |
| [`PHASE-1-DEMO-INVENTORY.md`](./PHASE-1-DEMO-INVENTORY.md) | Экраны с `placeholder-data` (DEMO1) |

---

## 1. Цели этапа 1 (что считаем «готово»)

1. **Инварианты:** любые правки меню/матрицы проходят `npm run validate:cabinet-nav` и при необходимости `validate:role-hub-matrix` (см. `CORE_OPERATING_CHAIN` §8.1).
2. **Сущности P0-ENTITY:** продолжить выравнивание `order` / `collection` / чат-контекста по [`cross-role-entity-ids.ts`](../../src/lib/domain/cross-role-entity-ids.ts) и §8.6 `CORE_OPERATING_CHAIN` — до снятия 🟡 там, где это реалистично без этапа 2.
3. **Политика демо:** явные бейджи или дисклеймеры на экранах со статичными/мок-данными (направление из `CORE_PRODUCT_DEEP_PLAN` §2 P0 п.5).
4. **Выбор первого сквозного E2E:** по **§6.1** — **принято:** [`PHASE-1-DECISION-6.1.md`](./PHASE-1-DECISION-6.1.md) (демо-базис + продукт-волна B по §5.7 «B2B заказ»).

---

## 2. Предлагаемый порядок работ (как в `CORE_PRODUCT_DEEP_PLAN` §5)

| Шаг | Фокус | Зачем |
|-----|--------|--------|
| A | `tsc` зелёный в зонах кабинетов; дожим критичных `unknown` в production/product | Регрессии не накапливать |
| B | Один **сквозной E2E** по выбранной строке матрицы (заказ ↔ второй актор) | Доказательство связи, не только UI |
| C | Workflow `/api/processes` — осознанная политика single-instance vs БД (P1) | Без иллюзий для multi-replica |
| D | Продуктовый «сводный заказ/поставка» для магазина или дистрибутора | Боль заказчика из §3.2–3.3 плана |

Этап 1 **перекрывается** со спринтами A–B минимум; C–D могут уйти в этап 2 по приоритету PO.

---

## 3. Этап 2 (превью)

**Этап 2** = заказы B2B как ядро: статусы из [`PHASE-0-MAIN-CONTOUR`](../phase-0/PHASE-0-MAIN-CONTOUR.md) §7, поля РФ-черновик, мутации под ADR-0001 (COGS), read-model на `wholesaleOrderId`. Отдельный план заводится при старте этапа 2.

---

## 4. Чеклист «старт этапа 1»

- [ ] §C [`PHASE-0-CLOSURE-CHECKLIST`](../phase-0/PHASE-0-CLOSURE-CHECKLIST.md) — подписи по политике компании.
- [ ] Прочитаны §6.1 и §8 `CORE_OPERATING_CHAIN`.
- [ ] В таск-трекере эпик ссылается на строку `CROSS_ROLE_FLOWS` / матрицы (`CORE_PRODUCT_DEEP_PLAN` §5).
- [x] Открыт [`PHASE-1-PLAN.md`](./PHASE-1-PLAN.md) — режим §6.1 и волна B зафиксированы в [`PHASE-1-DECISION-6.1.md`](./PHASE-1-DECISION-6.1.md).

## 5. Следующий документ

- При старте **этапа 2:** завести `docs/phase-2/` (по аналогии с phase-0/1) и **`PHASE-2-PLAN.md`** — заказы B2B как ядро, без смешения с волнами C/D этапа 1, если они перенесены.
