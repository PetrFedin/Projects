# Оставляем, улучшаем, вне ядра: оценки (три столба Fashion OS)

**Дата:** 2026-05-11 · **Канон приложения:** `_ai-share/synth-1-full` · **Источники:** `FOCUS_ONE_PAGER.md`, `VISUAL_DETAILED_SECTIONS_STATUS.md`, `GAP_ANALYSIS_USER_FLOW_COLLECTION_B2B_CHAT_CALENDAR.md`, `PLAN_RESTRUCTURE_THREE_PILLARS.md`, `PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md`; верхний уровень `src/app` — перечень сегментов из каталога.

**Формат оценок вне ядра:** `код / продукт / использование` — целые **1–10** по каждой оси (см. сноску в конце).

---

## Оставляем (ядро)

Три столба из `FOCUS_ONE_PAGER.md`: **(A) ТЗ → образец**, **(B) коллекции + B2B**, **(C) чат + календарь** как сквозной слой.

- **Workshop 2 (досье фазы 1)** — *зачем:* единая правда по ТЗ на артикул, согласования, версии, merge, lifecycle, события, экспорт; *как развивать:* закрепить один демо-проход hub → артикул (напр. `SS27` / `demo-ss27-01`) → ключевая секция ТЗ; API `src/app/api/brand/workshop2/phase1-dossier/*`; UI `/brand/production/workshop2`, `/brand/production/workshop2/c/[collectionId]/a/[articleId]`; смоки `e2e/workshop2-smoke.spec.ts`, `e2e/helpers/w2-demo-routes.ts` (`PLAN_RESTRUCTURE_THREE_PILLARS.md` §2(A)).
- **Tech pack (пилот)** — *зачем:* артефакты и handoff в производство; *как развивать:* env S3/DB, `npm run w2:techpack:preflight`, чеклист `docs/W2_TECHPACK_PILOT.md`, `env.w2-techpack.example`; API `src/app/api/brand/workshop2/tech-pack/*` (presign, index, complete, handoff, download); UI-пилот `/brand/production/tech-pack/[id]` (`VISUAL_DETAILED_SECTIONS_STATUS.md` §2).
- **Справочники пошива / контрагенты** — *зачем:* привязка исполнителя к плану и к W2; *как развивать:* единый read-model в UI без дублирования; `GET /api/brand/contractors`, `sewing-contractors`, `sewing-plan-reference` (`GAP_ANALYSIS…` §5).
- **Операционные B2B-заказы (v1)** — *зачем:* повторяемый оптовый контур и зеркало у ритейла; *как развивать:* список + карточка, один источник read-model, e2e API; `/brand/b2b-orders`, `/brand/b2b-orders/[orderId]`, `/shop/b2b-orders`; `GET /api/b2b/operational-orders` (и v1-хуки из `AGENTS.md`, см. `PROJECT_ANALYSIS…` §1.1); `e2e/b2b-operational-orders-api.spec.ts` (`PLAN_RESTRUCTURE…` §2(B)).
- **Коллекции и витрина сезона (узкий сценарий)** — *зачем:* мост «артикул → байер»; *как развивать:* один showcase (linesheet *или* shoppable lookbook) с явной связью к operational order; `/brand/collections`, `/brand/showroom`, `ROUTES.brand.*` по cutline (`FOCUS_ONE_PAGER`, `PLAN_RESTRUCTURE…` §2(B)).
- **Интеграции как карта экосистемы** — *зачем:* доверие к B2B-реальности без обещания всех коннекторов; *как развивать:* `/brand/integrations`, `GET /api/b2b/integrations/catalog-summary`, смок `e2e/b2b-catalog.spec.ts` (`PLAN_RESTRUCTURE…` §2(B)).
- **Сообщения и календарь (brand + shop)** — *зачем:* сроки и договорённости не теряются между кабинетами; *как развивать:* зафиксировать в IA «два уровня чата» (полный `/brand/messages` vs вкладка на полу производства) и **один канонический календарь** на квартал для кросс-роли; `/brand/messages`, `/brand/calendar`, зеркала shop (`FOCUS_ONE_PAGER` §C, `PLAN_RESTRUCTURE…` §2(C)).
- **Производство бренда (пол / gold sample) как опора столба A и гейта качества** — *зачем:* сэмпл, `goldSampleApproved`, связь с PO; *как развивать:* явная связка с политикой коллекции и с B2B (см. GAP); `/brand/production`, `/brand/production/gold-sample`, вкладки чат/календарь в shell (`VISUAL_DETAILED_SECTIONS_STATUS.md` §4, `GAP_ANALYSIS…`).
- **Приёмочные смоки «спины»** — *зачем:* регрессия демо; *как развивать:* union URL из `package.json`: `smoke`, `unified-ecosystem-smoke`, `workshop2-smoke` + при необходимости API e2e (`FOCUS_ONE_PAGER` «следующий шаг», `PLAN_RESTRUCTURE…` §3–4).

---

## Улучшаем внутри ядра


| Область                               | Что сделать                                                                                                                                                                                                                             | Зачем                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **IA / навигация**                    | Флаг(и) «investor / demo spine», сужение сайдбаров (`brand-navigation.ts`, `shop-navigation-normalized.ts`, при необходимости factory/distributor); не удалять legacy-URL, но убрать из демо-меню шум (`PLAN_RESTRUCTURE…` §1, Фаза 1). | Инвестор видит 3–7 экранов без «леса» маршрутов (`PROJECT_ANALYSIS…`). |
| **Копирайт и честность демо**         | Подписи «mock / demo tenant / localStorage» для W2 и organization hub                                                                                                                                                                   | Снижает репутационный риск на демо (`FOCUS_ONE_PAGER`, `VISUAL…` §2).  |
| **Operational order — глубина строк** | Аудит DTO/UI: размеры, delivery days, ship window                                                                                                                                                                                       | Юридически и операционно значимые поля (`VISUAL…` §6, `GAP…`).         |
| **Шоурум → заказ**                    | Один зафиксированный URL-сценарий и CTA к operational order                                                                                                                                                                             | Сквозная история «витрина → деньги» (`GAP…` §3–4).                     |
| **Чат**                               | Правила deep link: thread ↔ `orderId` / `collectionId` / `articleId` (продуктовое решение)                                                                                                                                              | Проектный контекст переписки (`GAP…` вопрос 3, `VISUAL…` §8).          |
| **Календарь**                         | Легенды и разделение семантик (brand vs shop delivery vs factory capacity) в UI + одна фраза в питче                                                                                                                                    | Иначе путаница у байера и у инвестора (`VISUAL…` §9).                  |
| **W2 персистентность**                | Целевой артикул вне localStorage для prod-пилота                                                                                                                                                                                        | Доверие к столбу A (`VISUAL…` §2, топ-приоритеты §13).                 |
| **Tech pack**                         | Зелёный preflight в CI/чеклисте демо                                                                                                                                                                                                    | Переводит ○ в управляемый пилот (`VISUAL…` §2).                        |
| `**collection-stage-review`**         | Расширение из узкого JSON-порта к общему BFF-контракту                                                                                                                                                                                  | Стадии коллекции как процесс (`GAP…`, `VISUAL…` §2, §5).               |


---

## Доделать до «рабочего контура»

Чеклист с **зависимостями** (порядок осмысленный, не жёсткий waterfall):

1. **[ ] Зафиксировать короткий список URL демо** — зависимости: смоки `smoke.spec.ts`, `unified-ecosystem-smoke.spec.ts`, матрица `UNIFIED_ECOSYSTEM_VERIFICATION.md` (цит. в `PLAN_RESTRUCTURE…`). *Критерий:* владелец сценария и ≤N пунктов spine на столбец.
2. **[ ] Политика коллекции = только после финального сэмпла (gold + W2 sample/global)** — зависимости: данные `goldSampleApproved`, стадии W2, UI `/brand/collections`; **нет** сейчас единого контракта (`GAP…` шаг 1, `VISUAL…` §5). *Критерий:* API + UI отражают gate.
3. **[ ] Сквозная связь B2B operational order → агрегация → PO** — зависимости: read-model заказов, агрегаты (`OrderAggregate`, `CreatePOFromSamples`), ADR источника правды ERP vs платформа (`GAP…` шаг 5–7, `VISUAL…` §7, §13 п.2 и 10). *Критерий:* один ручной E2E + обновлённые смоки (`PLAN_RESTRUCTURE…` Фаза 2).
4. **[ ] Решение IA: два уровня чата или конвергенция** — зависимости: `production-page-content-shell-header-actions.tsx` vs `/brand/messages` (`GAP…` §6). *Критерий:* текст в навигации/питче (`FOCUS_ONE_PAGER` шаг 4).
5. **[ ] Канонический календарь на квартал (продуктовая строка)** — зависимости: согласование brand/shop/factory календарей (`VISUAL…` §9). *Критерий:* одна фраза в IA + подписи в UI.
6. **[ ] W2: персистентность prod-пути** — зависимости: backend/tenant; отделение от демо LS. *Критерий:* артикул без «тихого» localStorage в целевом окружении.
7. **[ ] Tech pack: env + preflight в демо-чеклисте** — зависимости: S3/DB, `w2:techpack:preflight`. *Критерий:* опциональный шаг демо не блокирует Фазу 2, но документирован (`PLAN_RESTRUCTURE…` Фаза 2 риски).
8. **[ ] BFF/UI «merge orders» / свод спроса с магазинов** — зависимости: п.3, контроль-агрегатор. *Критерий:* бренд видит свод без чтения кода (`VISUAL…` §7).
9. **[ ] CI: целевой поднабор** — `smoke:fast` (корень `npm run smoke`), `test:e2e:light`, `test:e2e:verification`, `workshop2-smoke`, по договорённости `test:e2e:api` (`PLAN_RESTRUCTURE…` §6, `PROJECT_ANALYSIS…`).

---

## Вне ядра (пока не задействуем)

Простой список зон **вне** приоритетных трёх столбов для текущего инвесторского/демо-фокуса (см. «сознательно не делаем» в `FOCUS_ONE_PAGER.md` и §5 `PLAN_RESTRUCTURE…`). Сегменты верхнего уровня `src/app/` (имена каталогов из `ls`): `about`, `academy`, `admin`, `auctions`, `b`, `blog`, `brands`, `careers`, `catalog`, `checkout`, `client`, `community`, `contact`, `customer-360`, `distributor`, `dpp`, `factory`, `faq`, `kickstarter`, `live`, `look-builder`, `looks`, `loyalty`, `marketroom`, `metaverse`, `o`, `orders`, `outlet`, `partner`, `press`, `privacy`, `products`, `project-info`, `project-status`, `quiz`, `s`, `search`, `shipping`, `store-locator`, `supplier`, `terms`, `try-on`, `u`, `wallet` — плюс **широкий хвост** `shop/b2b/*` сверх одного выбранного сценария, **маркетинг/паблик** без кабинетного контура, **отдельный Python FastAPI** без явной связки с Next в питче, **exploration** внутри `brand/` (ниже).


| Название / зона                                                                                                                           | код / продукт / использование | Комментарий при оценке ниже 5                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Academy** (`/academy`)                                                                                                                  | 5 / 3 / 3                     | Продукт и использование низкие: вне P0-питча (`FOCUS_ONE_PAGER`).                                                                              |
| **Client: sewing patterns, preset editor, for-you, style-quiz** (`/client/*`)                                                             | 6 / 2 / 2                     | Продукт низкий: явный non-goal для главного экрана; e2e `client-sewing-patterns` не делает это «ядром».                                        |
| **Admin (общий кабинет, не демо-spine)** (`/admin`)                                                                                       | 7 / 4 / 4                     | Использование: не целевой пользователь демо; метрики W2 — вспомогательно (`VISUAL…` §10).                                                      |
| **Хвост `shop/b2b/*`** (margin, replenishment, selection-builder, отчёты и т.д.)                                                          | 7 / 3 / 3                     | Ширина кода vs одна история; без сужения IA — шум для инвестора (`PROJECT_ANALYSIS…` P3).                                                      |
| `**brand/planning` + AI-симуляция**                                                                                                       | 5 / 3 / 3                     | Низкая пригодность без связи «план ↔ заказ/артикул» (`PLAN_RESTRUCTURE…` §5).                                                                  |
| `**brand/ai-design` и прочие AI-витрины без spine**                                                                                       | 5 / 3 / 3                     | Продукт не привязан к трём столбам в доках.                                                                                                    |
| **Аналитика 360 / platform-sales** (`/brand/analytics/`*, distributor analytics)                                                          | 6 / 4 / 4                     | Использование среднее: не центр демо, риск scope creep (`PLAN_RESTRUCTURE…` Фаза 3).                                                           |
| **Архивные B2B-интеграции UI** (`/brand/integrations/archive/`*, JOOR/NuORDER/…)                                                          | 7 / 4 / 4                     | Много кода; продукт — «карта», не полный shipped контур на каждый коннектор.                                                                   |
| **Distributor cabinet** (`/distributor`)                                                                                                  | 6 / 4 / 4                     | Вне узкого spine; comms есть в `ROUTES`, но не фокус one-pager.                                                                                |
| **Factory cabinet (весь кабинет, кроме зеркала comms/handoff)** (`/factory`)                                                              | 6 / 5 / 4                     | Частично связан с handoff; полнота сценария для фабрики не выровнена под демо.                                                                 |
| **Metaverse, try-on, look-builder, live, marketroom**                                                                                     | 4 / 2 / 2                     | Низкая зрелость продукта и пригодность для операционного питча.                                                                                |
| **Kickstarter, wallet, loyalty, auctions**                                                                                                | 4 / 2 / 2                     | Экспериментальные или побочные воронки, не B2B spine.                                                                                          |
| **DPP, circular-hub, merch/trade-codes, logistics/duty** (узкие `brand/`*)                                                                | 5 / 3 / 3                     | Нишевые модули вне трёх столбов.                                                                                                               |
| **Публичные витрины:** `catalog`, `products`, `search`, `outlet`, `store-locator`, `brands`, `b/[brandId]`                                | 7 / 5 / 6                     | Код есть; продукт — не операционный контур кабинета в фокусе.                                                                                  |
| **Маркетинговые страницы:** `about`, `blog`, `press`, `careers`, `contact`, `faq`, `privacy`, `terms`, `community`, `partner`, `shipping` | 6 / 5 / 7                     | Контент-сайт; не «мода как операционная платформа».                                                                                            |
| **Checkout, orders (розница), quiz**                                                                                                      | 6 / 4 / 5                     | Не центр B2B/производственного демо.                                                                                                           |
| **Customer-360, project-info, project-status**                                                                                            | 5 / 3 / 4                     | Внутренние/демо-мета, не spine.                                                                                                                |
| **Supplier (публичный маршрут `src/app/supplier`)**                                                                                       | 5 / 3 / 3                     | Не закреплён в трёх столбах как исполнительский UX (поставщик в данных W2).                                                                    |
| **Python FastAPI** (`Projects/app`, `pyproject.toml`)                                                                                     | 7 / 2 / 2                     | Код отдельного сервиса есть; **продукт и использование** низкие без явной связки с видимым Next (`PROJECT_ANALYSIS…` §1.2, `FOCUS_ONE_PAGER`). |
| **Организационный hub бренда** (`/brand/organization`)                                                                                    | 6 / 5 / 5                     | Полезен как «command center», но демо-mock требует подписи; не заменяет столбы A–C (`PROJECT_ANALYSIS…` spine п.1).                            |
| **CMS бренда** (`/brand/cms`)                                                                                                             | 6 / 4 / 5                     | Контент, не операционный B2B/W2 контур.                                                                                                        |
| **B2B content-syndication, order-approval-workflow** (отдельные `brand/b2b/`*)                                                            | 6 / 4 / 4                     | Рядом с ядром, но не зафиксированы в коротком списке URL демо.                                                                                 |
| **Shop: clienteling, career** и прочие shop-ветки вне b2b-orders/spine                                                                    | 5 / 3 / 4                     | Не входят в union смоков spine без явного решения.                                                                                             |


---

## Сноска: шкала 1–10

- **Код (1–10):** **1** — заглушка или нет стабильного маршрута/API; **5** — UI и частичные тесты или разрозненные хендлеры; **10** — предсказуемые контракты, колокированные тесты роутов где уместно, смоки/verify не расходятся с поведением (`PROJECT_ANALYSIS…` §2).
- **Продукт (1–10):** **1** — нет позиции в IA/roadmap; **5** — есть экраны, но нет сквозного сценария и критериев приёмки; **10** — явный пользовательский поток, метрики успеха, честная подпись mock/real (`VISUAL…` легенда ●/◐/○/◌).
- **Использование (1–10):** **1** — только с инженером/флагами; **5** — работает для внутренней роли с оговорками; **10** — можно отдать пилотному клиенту без сопровождения по известным ограничениям (`GAP…` «есть/частично/нет»).

---

*Документ планирования; изменений в коде репозитория не вносилось.*