# Enterprise roadmap (Q1) — указатель

Файл связывает приоритеты квартала с каноническими документами в **`synth-1-full`**. Детальный бэклог по доменам — **`TASK_QUEUE.md`**, строгий CI — **`docs/roadmap/STRICT_CI.md`** (если есть).

## Ритейл и B2B (buy-side)

- Продуктовый контракт: **`docs/shop-retailer-cabinet-roadmap.md`** (сквозная цепочка, роли, MVP).
- UI кабинетов: **`docs/FULL_APP_DEVELOPMENT.md`**, **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`**, правило **`.cursor/rules/cabinet-ui-consistency.mdc`**.

## Следующие инкременты (пакетами)

1. Завершить **`tid.page('shop-b2b-*')`** на оставшихся экранах `/shop/b2b/*`, где уже есть `RegistryPageShell`.
2. Смоки: **`npm run test:e2e:shop-retail`**, **`npm run test:e2e:verification`**, профильные **`e2e/b2b-*.spec.ts`**.

Обновляйте этот файл при смене квартальных целей; не дублируйте длинные списки маршрутов — они в **`README.md`** и **`INTEGRATION_MAP.md`** §6.
