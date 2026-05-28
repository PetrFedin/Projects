# Этап 0 — основной контур (продуктовый пакет)

**Версия пакета:** 1.1 · **Статус:** пункты **A–B** чеклиста закрытия выполнены (2026-04-19); таблица подписей **§C** — по корпоративной процедуре. См. [`PHASE-0-CLOSURE-CHECKLIST.md`](./PHASE-0-CLOSURE-CHECKLIST.md).

Каталог фиксирует **продуктовый контракт** до разработки **Этапа 2** (B2B-заказы как ядро): границы scope, роли, статусы заказа, дистрибуторские режимы, чат+календарь, себестоимость, риски. Старт **этапа 1** допускается при выполнении чеклиста и допущении по черновику полей РФ (§A4).

## Быстрый старт

1. Прочитать **[PHASE-0-MAIN-CONTOUR.md](./PHASE-0-MAIN-CONTOUR.md)** (v1.1).
2. Ознакомиться с **[PHASE-0-INVESTOR-ONE-PAGER.md](./PHASE-0-INVESTOR-ONE-PAGER.md)** и согласовать с §2 главного документа.
3. Просмотреть **ADR:** [индекс](./ADR/README.md) (ADR-0001…0003 закрывают бывшие «серые зоны» §3.3).
4. Согласовать **[glossary-ids.md](./glossary-ids.md)** с кодом — раздел **«Согласование с кодом»**; канон: `src/lib/domain/cross-role-entity-ids.ts`.
5. Владельцы в **[PHASE-0-RISK-REGISTER.md](./PHASE-0-RISK-REGISTER.md)** назначены; финальные **[PHASE-0-CLOSURE-CHECKLIST.md](./PHASE-0-CLOSURE-CHECKLIST.md)** — подписи §C при необходимости.
6. Связать с исполнением: **`src/lib/data/CORE_OPERATING_CHAIN.md`** (§7–9 — журнал и реестр ядра в коде).
7. **Следующий шаг:** [`docs/phase-1/README.md`](../phase-1/README.md) — этап 1 (навигация/UI).

## Файлы

| Файл | Назначение |
|------|------------|
| [PHASE-0-MAIN-CONTOUR.md](./PHASE-0-MAIN-CONTOUR.md) | Единый документ этапа 0 (v1.1) |
| [glossary-ids.md](./glossary-ids.md) | Идентификаторы и сущности |
| [ADR/README.md](./ADR/README.md) | Индекс решений |
| [ADR/ADR-TEMPLATE.md](./ADR/ADR-TEMPLATE.md) | Шаблон ADR |
| [PHASE-0-RF-FIELDS-MINIMUM.md](./PHASE-0-RF-FIELDS-MINIMUM.md) | Минимум полей РФ (v1) |
| [PHASE-0-RISK-REGISTER.md](./PHASE-0-RISK-REGISTER.md) | Реестр рисков |
| [PHASE-0-INVESTOR-ONE-PAGER.md](./PHASE-0-INVESTOR-ONE-PAGER.md) | Тезисы для инвестора |
| [PHASE-0-CLOSURE-CHECKLIST.md](./PHASE-0-CLOSURE-CHECKLIST.md) | Закрытие этапа 0 → разрешение на этап 1 |
| [../phase-1/README.md](../phase-1/README.md) | Этап 1: навигация/UI, P0-ENTITY, E2E |

## Что остаётся «человеческим» после артефактов A–B

- Подписи в **§C** чеклиста — если в компании есть формальная процедура (иначе см. примечание в чеклисте).
- Юридический sign-off **PHASE-0-RF-FIELDS-MINIMUM.md** — перед продакшен-ЭДО (черновик + допущение для этапа 1 уже зафиксированы).
