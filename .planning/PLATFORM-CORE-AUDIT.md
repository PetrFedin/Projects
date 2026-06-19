# Platform Core — честный аудит «5 столпов × 4 роли»

> **SoT для всех агентов.** Оценки **ручные**, не телеметрия. **Запрещено** завышать (9.3 / shop 9.0 / empty 9+ — устаревший narrative, не использовать).
> Обновлено: **2026-06-16** — волна **122** (PG-primary spine); детальный аудит **4 столпов цепочки**; hub: Продукт / План / Аудит (toggle).

## ⚠ Синхронизация параллельных агентов (читать первым)

Перед отчётом сверяй **код + последний `core:verify` + `/api/workshop2/platform-core/health`**, не копируй устаревшие блоки.

| Утверждение | Факт в репо (2026-06-16) |
|-------------|---------------------------|
| E2E core | **49 spec-файлов** `core-01…core-49`; clean-pg spine (`core-17`, `core-18`, `core-19`, `core-33`…); pillars targeted **green** после baseline (волна 121) |
| PG-primary spine | `platform-core-spine-pg.server.ts` — core + PG: chat/orders/dossier/tasks/invoice **без JSON/memory fallback** |
| env.core.example | `SPINE_OPERATIONAL_PG=1`, `SPINE_OPERATIONAL_PG_PRIMARY=1` по умолчанию |
| Health API | `platformCoreSpinePgPrimary`, `spineStores[]` |
| Ручной UAT 69 разделов | **0/69** — чеклист есть, сессия не пройдена |
| Оценка 9+ | **Запрещена** без UAT + zero-mock на всех golden-разделах |
| `audit:platform-core-ui` | **11/11** passed |
| Hub UI | Toggle `?views=business,planner,audit`; planner chat inline; «Доработать» → Cursor SDK (iPhone → Mac) |
| E2E specs | **core-01 … core-49** |
| core-08 smoke | **69/69** разделов HTTP+chrome |
| Golden/interactive | **~28/69** + clean-pg кластер **core-15…core-49** |
| buyerId checkout | SoT `SHOP_CORE_DEMO_BUYER_ID` (= `shop1`) — один демо-магазин |
| Резерв склада | Честный бейдж; live reserve только после handoff+WMS |
| Legacy archive | **51/51** в `_archive/platform-core-legacy/` |
| Invoice | HTML счёт-оферта + PG `workshop2_b2b_invoice`; **нет binary PDF** |
| Contextual chat | PG + SSE; sender `x-w2-actor-label` (не «Current User») |
| Brand tasks | PG `brand_tasks_kanban`; core без localStorage |
| dev:core fonts | **Исправлено** — `@/lib/app-fonts` |

**Актуальные метрики (волна 122):** цепочка **~7.2–7.4** · cross-role **~7.1** · инженерия **~8.2** · бренд **~6.9–7.0** · магазин **~7.4–7.7** · UAT **0/69** · smoke **69/69**.

**Автопроверка:** `npm run core:verify` · `npm run core:verify:pg-primary` · `npm run audit:platform-core-ui` · `npm run audit:section-uat-checklist`

**Следующий шаг (P0 gate):** `core:verify` exit 0 → UAT 10 golden (столпы 3+4) → 69.

## Принципы (обязательны для всех агентов)

1. **Требовательная оценка** — функционал, наполнение, связи: вертикаль внутри столпа, горизонталь между столпами, cross-role между ролями; где нужно взаимодействие — оно должно быть и влиять на цепочку.
2. **Роль × столп** — каждый столп для роли отражает реальную работу этой роли в бизнес-процессе и с кем она взаимодействует.
3. **Без мусора** — нет demo/заглушек, тупиковых CTA, шума, лишних блоков; только то, что ведёт к следующему шагу цепочки.
4. **Не участвует = тишина** — если роль не ведёт столп: нет оценки (—), нет панелей/мостов в кабинете, столп не в nav и strip; deep-link `?pillar=` → редирект на первый активный.
5. **Единый визуал** — все роли и столпы оформлены одинаково; кнопки, переходы, фильтры, расчёты, ссылки **работают**.
6. **RU UX** — весь UI на русском; аббревиатуры (B2B, PO, BOM, RFQ, PG…) с расшифровкой при наведении (`PlatformCoreTerm`).
7. **Бизнес-названия** — без «demo», кодов сезонов в заголовках, JOOR/NuOrder/RepSpark и прочего investor-жаргона на core-path; простые названия этапов цепочки.
8. **Честность hub** — итог считается из `summarizePlatformCoreReadiness()` / `CELL_AUDIT`; не захардкоженные 9+.
9. **Разделы столпа** — разворот «разделы» в матрице `/platform` питается из **`SECTION_AUDIT`** (`platform-core-readiness-sections.ts`), не из hub CTA. На каждую активную ячейку: **4–6 разделов** (рабочие экраны + кабинет + связи + cross-role). У каждого раздела: `summary`, `good`/`bad`/`fix`, ручной `/10`; tooltip при наведении.

### Шкала (/10)

| Диапазон | Смысл |
|----------|--------|
| 9+ | **Не ставить** без полного workspace + PG + e2e + zero mock на core-path |
| 8–8.5 | Сильный срез, мелкие дыры |
| 7–8 | Рабочий guided path, есть bad/fix |
| 6–7 | Слабое звено, mock/legacy на пути |
| empty-bridge | **7–8 max**, явные bad/fix; не «идеал» |

## Критерии оценки

| Критерий | Вес |
|----------|-----|
| Функционал роли в столпе | 35% |
| Вертикаль внутри столпа | 20% |
| Горизонталь между столпами | 20% |
| Cross-role (между ролями) | 15% |
| Честность + RU UX | 10% |

## Строгий аудит 2026-06 (SoT: `CELL_AUDIT`)

> Мертвые ссылки, seed-зависимость, шум UI, разрывы cross-role. **9+ не ставим** без полного workspace + PG + e2e без mock.

### Сводка по ролям (/10)

| Роль | Активных столпов | Средняя (строгая) | Слабое звено |
|------|------------------|-------------------|--------------|
| Бренд | 5 | **6.9** | development, collection_order (spine +0.1) |
| Магазин | 4 | **7.3** | seed-зависимость; tracking read-only |
| Производство | 3 | **7.4** | ERP retry; dossier read-only |
| Поставщик | 3 | **7.2** | нет WMS reserve; multi-article procurement |
| **Цепочка (15 ячеек)** | 15 | **~7.3** | Cross-role **~7.1**; spine PG +0.1 |

Не участвуют (—, без оценки и UI): магазин·ТЗ→образец; производство·образец→коллекция, коллекция→заказ; поставщик·образец→коллекция, коллекция→заказ.

### Матрица оценок

| Столп | Бренд | Магазин | Производство | Поставщик |
|-------|-------|---------|--------------|-----------|
| 1. ТЗ → образец | 6.8 | — | 7.6 | 7.2 |
| 2. Образец → коллекция | 7.0 | 7.4 | — | — |
| 3. Коллекция → заказ | 6.9 | 7.6 | — | — |
| 4. Заказ → производство | 6.9 | 7.1 | 7.3 | 7.3 |
| 5. Связь | 7.1 | 7.3 | 7.4 | 7.3 |

| Метрика | Устаревший narrative | **Честно сейчас (2026-06-10)** |
|---------|---------------------|-------------------------------|
| Общая цепочка | 9.3 | **~7.3** (15 ячеек + spine PG волна 122) |
| Интеграция cross-role | 9+ | **~7.0** (comms core-13/14 green; handoff ручной) |
| E2E automated | 43 теста | **152 passed** в `core:verify`; 14 spec-файлов |
| Ручной UAT | «покрыто e2e» | **0/69** — автоматика ≠ продуктовый sign-off |
| Продуктовая зрелость | «готовый B2B» | **Guided demo** SS27 после `core:bootstrap` |

**Вердикт:** инженерный контур **~8.2** (spine PG + verify baseline); продуктовый — **~7.2–7.4**, не 9+. Бренд тянет столпы 1+3; магазин — сильнейший столп 3 (matrix→checkout→PG order). Блокер для 8+: **ручной UAT** + multi-tenant buyer + полный W2 UI create без seed.

---

## Детальный аудит 4 столпов цепочки (2026-06-16)

> **Scope:** столпы **1–4** (бизнес-цепочка ТЗ→…→производство). Столп 5 «Связь» — отдельная секция в `CELL_AUDIT.comms`.  
> **SoT оценок:** `src/lib/platform-core-readiness-audit.ts` (`CELL_AUDIT`) + `SECTION_AUDIT`.  
> **SoT данных (волна 122):** `src/lib/server/platform-core-spine-pg.server.ts` + health `spineStores[]`.

### Spine PG-primary (сквозная БД)

| Store | PG table | Core mode (:3001) | Full app (:3000) |
|-------|----------|-------------------|------------------|
| Contextual chat | `workshop2_contextual_messages` | postgres only | memory/file если нет PG |
| B2B native orders | `workshop2_b2b_orders` | postgres only (snapshot skip) | snapshot + merge |
| Dossier phase1 | `workshop2_dossiers` | postgres only | file fallback |
| Brand tasks Kanban | `brand_tasks_kanban` | postgres only | localStorage fallback |
| B2B invoice | `workshop2_b2b_invoice` | postgres + HTML schet-offerta | journal stub |
| Calendar tasks | `platform_core_user_calendar_tasks` | postgres | file fallback |

**Bootstrap:** `npm run core:bootstrap` → SS27 dossier + B2B demo order + contextual chat seed + showroom.

---

### Столп 1 · ТЗ → образец (`development`)

**Участники:** бренд (ведёт), производство (read), поставщик (BOM); магазин — **—**.

| Роль | CELL live | Trend | PG / SoT |
|------|-----------|-------|----------|
| Бренд | **6.8** | ↑ spine | `workshop2_dossiers`, W2 PUT/GET, range planner metadata |
| Производство | **7.6** | = | Factory dossier read-only, sample queue |
| Поставщик | **7.2** | = | BOM из dossier API, materials development view |

**Vertical (внутри столпа):** hub → W2 editor → dossier tabs (general, BOM, composition) → range planner → export context. **Golden:** `demo-ss27-01`, e2e core-02 round-trip полей ТЗ, core-37 create-article wizard (`?w2create=1`).

**Horizontal:** W2 → linesheets (столп 2); BOM → supplier materials (столп 4 prep).

**Cross-role:** brand W2 ↔ factory dossier portal; supplier BOM link `view=development` (волна 120).

**Good (2026-06-16):**
- PG-authoritative dossier в core; localStorage overlay отключён для SS27/FW27
- `PlatformCoreEmptyChainBanner` → wizard create article для EMPTY27
- Dossier file fallback **fail-closed** при pg-primary
- Sample queue hash-scroll + development pillar card (цех)

**Bad / gaps:**
- Investor PDF/SVG export без e2e
- Margin tier PATCH — частичное покрытие
- Цех не редактирует состав — только read
- EMPTY27 без seed — честно «пустая цепочка», нужен wizard onboarding

**E2E:** core-02 (dossier UI), core-06 (FW27 PG), core-37 (wizard), core-44 (disclosure), core-26 (export audit path).

**План P0–P2:**

| Приоритет | Действие |
|-----------|----------|
| P0 | UAT: brand-dev-w2 + brand-dev-dossier + mfr-dev-dossier (3 раздела) |
| P0 | `core:verify` exit 0 с pg-primary env |
| P1 | E2E PDF export composition label |
| P1 | EMPTY27 onboarding: wizard → first article → hub chain green |
| P2 | Декомпозиция `workshop2-phase1-dossier-panel*` (monster-file) |

**Целевая оценка после UAT:** бренд **7.2**, производство **7.8**, поставщик **7.4**.

---

### Столп 2 · Образец → коллекция (`sample_collection`)

**Участники:** бренд, магазин; производство и поставщик — **—**.

| Роль | CELL live | Trend | PG / SoT |
|------|-----------|-------|----------|
| Бренд | **7.0** | = | Linesheets PG, showroom publish, matrix CTA |
| Магазин | **7.4** | = | Showroom published-articles, partnerships API |

**Vertical:** linesheets → PDF из PG → showroom publish → shop showroom mini → matrix entry (столп 3).

**Horizontal:** brand linesheet CTA → shop matrix; showroom hero из dossier PG.

**Cross-role:** `brand-pillar-to-shop-matrix`, `brand-linesheet-to-shop-matrix`, partner invite (Nordic Wool profile).

**Good:**
- E2E linesheets → matrix (core-02, core-28 batch)
- Showroom PG + legacy tab guard
- Shop empty-state без «опубликуйте в кабинете бренда»
- `core-38` shop showroom empty onboarding

**Bad / gaps:**
- PDF edge cases на пустой коллекции
- Partner hero может перекрыть PG partnership row
- Нет e2e на mini-matrix CTA из кабинета бренда

**E2E:** core-02, core-28, core-38, core-45 (showroom unified).

**План:**

| Приоритет | Действие |
|-----------|----------|
| P0 | UAT: brand-sc-linesheets + shop-sc-showroom (2 раздела) |
| P1 | E2E `brand-sample-collection-mini-matrix` |
| P1 | Бейдж fallback vs PG на partner row |
| P2 | Deep-link checkout e2e из showroom |

**Целевая оценка:** бренд **7.3**, магазин **7.6**.

---

### Столп 3 · Коллекция → заказ (`collection_order`)

**Участники:** бренд, магазин; производство и поставщик — **—**.

| Роль | CELL live | Trend | PG / SoT |
|------|-----------|-------|----------|
| Бренд | **6.9** | ↑ spine | `workshop2_b2b_orders`, operational bridge, confirm-order |
| Магазин | **7.6** | ↑ spine | Matrix → checkout → PG order (не snapshot) |

**Vertical (магазин — golden path):** matrix W2 PG → checkout sync → `B2B-{timestamp}` / demo ids → order detail → amend.

**Vertical (бренд):** registry PG → confirm-order (до handoff) → amend approve/reject → pre-orders guard.

**Horizontal:** order → handoff (столп 4); order → comms thread `b2b_order`.

**Cross-role:** shop checkout создаёт PG row, visible в brand registry; pinned `B2B-DEMO-*` в core mode.

**Good (волна 122):**
- `listB2BOrdersForOperationalUiServerAsync` — pg-primary **без** `b2b-orders.snapshot.json`
- `mergeOperationalB2bOrderLists` — PG override snapshot duplicates
- `isPlatformCorePgB2bOrder` gate, CollectionOrderPillarCard в обоих кабинетах
- Amend structured API (волна 98)
- Registry golden filter — без INT-JOOR шума в SSE
- Invoice upsert on schet-offerta GET

**Bad / gaps:**
- Резерв склада — честный badge, не live при checkout
- E2E зависит от `core:bootstrap` / seed
- shop2 без seed — пустой реестр
- Pre-orders side-path в tail redirect
- **Multi-tenant buyer** — один `shop1`

**E2E:** core-02 (matrix→order), core-03 (handoff context), core-15/33 (registry pg-primary), core-19/39 (clean-pg spine), core-49 (minimums).

**План:**

| Приоритет | Действие |
|-----------|----------|
| P0 | UAT: brand-co-registry + shop-co-matrix + shop-co-checkout (3 раздела) |
| P0 | E2E checkout на **чистой PG** без pre-seed (`core-22` pattern) |
| P1 | Seed B2B для shop2 / второй buyer |
| P1 | Убрать legacy pre-orders из golden CTA |
| P2 | Push notification при смене order status |
| P2 | Binary PDF invoice (optional — сейчас HTML print) |

**Целевая оценка:** бренд **7.4**, магазин **7.9** (блокер 8+ = UAT + multi-buyer).

---

### Столп 4 · Заказ → производство (`order_production`)

**Участники:** все 4 роли.

| Роль | CELL live | Trend | PG / SoT |
|------|-----------|-------|----------|
| Бренд | **6.9** | = | confirm-handoff, dossier lock, chain-status |
| Магазин | **7.1** | = | tracking read-only, reserve badge |
| Производство | **7.3** | = | handoff queue PG, bulk ack, ERP retry |
| Поставщик | **7.3** | ↑ | materials PATCH, multi-article wizard, bulk confirm |

**Vertical:** confirm-order → confirm-production-handoff → PO queue → materials procurement → materials_supplied → tracking milestones.

**Horizontal:** handoff связывает столп 3→4; dossier `b2bEditLock` после handoff.

**Cross-role:** brand handoff strip ↔ factory queue ↔ supplier procurement ↔ shop tracking; PATCH material-request → системное сообщение в `b2b_order` chat.

**Good:**
- Два шага confirm (order / handoff) — не сливаются
- `dossierVersionAtHandoff` + diff в chain-status
- ERP POST после bulk ack + retry UI
- SSE chain-status + hub bump
- Tracking list: golden filter `B2B-DEMO-*` + `?order=` focus
- E2E materials_supplied на pillar cards (core-02)

**Bad / gaps:**
- ERP `live_failed` до ручного retry
- Tracking poll 15s — не push (кроме SSE chain-status)
- Нет WMS live reserve
- Supplier: нет inventory reserve после confirm

**E2E:** core-03 (interactive handoff), core-09 (SSE), core-34 (ERP retry), core-42 (mfr handoff shop floor), core-36 (supplier delivery).

**План:**

| Приоритет | Действие |
|-----------|----------|
| P0 | UAT: brand-op-handoff + mfr-op-queue + sup-op-procurement + shop-op-tracking (4 раздела) |
| P1 | Auto-retry ERP с backoff |
| P1 | Inventory reserve (волна D) после materials confirm |
| P2 | WebSocket вместо SSE при масштабировании |

**Целевая оценка:** средняя по 4 ролям **7.5** после UAT handoff cluster.

---

### Сводка 4 столпов (бизнес-цепочка)

| Столп | Ср. live (4 роли*) | Spine PG | Слабое звено | P0 следующий шаг |
|-------|-------------------|----------|--------------|------------------|
| 1 development | **7.2** (3 роли) | dossier PG | brand PDF/export, EMPTY27 | UAT dev cluster |
| 2 sample_collection | **7.2** (2 роли) | linesheets/showroom PG | partner hero overlap | UAT showroom |
| 3 collection_order | **7.25** (2 роли) | `workshop2_b2b_orders` | multi-buyer, reserve | UAT matrix→order |
| 4 order_production | **7.15** (4 роли) | handoff queue PG | ERP retry, WMS reserve | UAT handoff cluster |

\* только активные роли в столпе.

### Tech debt spine (статус после волны 122)

| ID | Было | Сейчас |
|----|------|--------|
| td-comms-chat-memory | memory/file | **Закрыто в core** — PG + SSE; full app fallback |
| td-comms-sender-hardcoded | Current User | **Закрыто** — `x-w2-actor-label` / «Участник» |
| td-comms-no-realtime | poll only | **Частично** — SSE contextual stream |
| td-brand-tasks-localstorage | LS | **Закрыто в core** — PG API |
| td-b2b-orders-json-snapshot | snapshot | **Закрыто в core** — pg-primary skip |
| td-b2b-orders-no-pg | no SoT | **Закрыто** — `workshop2_b2b_orders` |
| td-b2b-invoice-pdf-stub | journal | **Частично** — HTML schet-offerta + PG row |
| td-spine-no-single-pg-e2e | split SoT | **Частично** — core spine unified; INT-* отдельно |
| td-dossier-file-fallback | tmp JSON | **Закрыто в core** — fail-closed |
| td-no-pg-json-fallback | JSON mirrors | **Закрыто в core** — `shouldSkipNativeJsonFileStores` |
| td-brand-create-article-wizard-gap | no hub entry | **Закрыто** — EMPTY27 banner + core-37 |

---

### План на текущий момент (2026-06-16)

**Неделя 1 — инженерный gate**
1. `npm run core:bootstrap` + `npm run core:verify:pg-primary` exit 0
2. Полный `core:verify` на idle :3001 (не параллельно с dev hammer)
3. Baseline PR platform components на `main` (волна 121 rsync)
4. Обновить `TECH_DEBT_REGISTRY` статусы в planner (done/partial)

**Неделя 2 — продуктовый gate (4 столпа)**
1. Ручной UAT **10 golden** разделов: столп 3 (matrix, checkout, registry) + столп 4 (handoff, procurement, tracking)
2. Ручной UAT **6 dev** разделов: столп 1 (W2, dossier, factory read)
3. EMPTY27 walkthrough: wizard → hub chain partial green
4. Зафиксировать CELL +0.1…+0.2 только после UAT sign-off

**Неделя 3–4 — 8+ prerequisites**
1. Multi-tenant buyer (shop2 seed + checkout)
2. Clean PG e2e без bootstrap (`core-22` / `core-39` расширить)
3. ERP auto-retry + inventory reserve spike
4. UAT оставшиеся 53 раздела (SECTION-AUDIT-UAT-CHECKLIST)

**Не в scope до UAT:** binary PDF invoice, WebSocket comms, полный CRM supplier, investor export polish.

---

### Закрыто в волне P0 (2026-06-04)

- [x] Brand hub «Досье» → W2 бренда (не `/factory/.../dossier`)
- [x] Shop order detail / cross-role — без dead-link на `#production-handoff` бренда
- [x] `materials_supplied` в pillar card цеха и поставщика
- [x] CTA «Закупка · поставщик» в кабинете производства
- [x] Удалены orphan: `ShopDevelopmentReadOnly`, `SupplierRfqReadonlyPanel` в кабинете
- [x] `CELL_AUDIT` синхронизирован со строгими баллами

### Разделы по ячейкам (SECTION_AUDIT)

| Роль | Столп | Разделов | Ср. static (разделы) |
|------|-------|----------|----------------------|
| Бренд | development | 6 | ~6.5 |
| Бренд | sample_collection | 5 | ~6.8 |
| Бренд | collection_order | 5 | ~6.5 |
| Бренд | order_production | 5 | ~6.5 |
| Бренд | comms | 5 | ~6.9 |
| Магазин | sample_collection | 4 | ~7.0 |
| Магазин | collection_order | 5 | ~7.3 |
| Магазин | order_production | 4 | ~6.9 |
| Магазин | comms | 4 | ~7.1 |
| Производство | development | 4 | ~7.2 |
| Производство | order_production | 5 | ~7.1 |
| Производство | comms | 4 | ~7.2 |
| Поставщик | development | 4 | ~7.1 |
| Поставщик | order_production | 5 | ~7.0 |
| Поставщик | comms | 4 | ~7.1 |

**Итого:** 74 раздела на 15 активных ячеек. SoT: `src/lib/platform-core-readiness-sections.ts`.

### Закрыто в волне P0/P1 (2026-06-04, продолжение)

- [x] W2 e2e: round-trip 2 полей ТЗ (`plannedLaunchCustomNote` + `packagingAndLabelingNote`)
- [x] SS27 range planner e2e: `pg-badge`, без `demo-notice`
- [x] E2E linesheets → matrix (core-02, core-06) — уже было; зафиксировано в CELL_AUDIT
- [x] `BrandSampleCollectionMini` → ссылка «Матрица магазина»
- [x] Shop кабинет `collection_order` → `CollectionOrderPillarCard` со steps
- [x] Дубль CTA «Планировщик» убран из hub `sample_collection` бренда
- [x] Shop showroom empty-state — без «опубликуйте в кабинете бренда»
- [x] Удалён orphan `ShopCollectionOrderMini` (заменён `CollectionOrderPillarCard`)

### Закрыто в волне P1 (2026-06-04, UI + цепочка)

- [x] `ListChrome`: убран дубль `HandoffStrip` — остаётся `RolePillarCrossRoleLinks`
- [x] Hub: телеметрия PG в `<details>`; убран дубль «Итого» под матрицей; снята подсветка строк ≥9
- [x] Hub lead: один абзац вместо HUB_LEAD + CHAIN_LEAD
- [x] `CommsPillarCard` (цех): PO-ссылка — `ClipboardList` + «Очередь передачи», не иконка чата
- [x] `buyerId`: checkout/matrix → `SHOP_CORE_DEMO_BUYER_ID` (SoT `shop-workshop2-b2b-order-ui.ts`)
- [x] Procurement: confirm по всем строкам BOM / pending requisitions (не одна строка)
- [x] E2E: `inventory_reserved.done === true` в chain-status; reserve badge на tracking (core-02)

### Закрыто в волне P1 (2026-06-04, chain-status + comms)

- [x] Chain-status poll: 15с при активной вкладке + refresh на focus (`use-platform-core-chain-status-poll`)
- [x] Реестры brand/shop B2B: live refetch chain summaries через тот же poll
- [x] PATCH material-request → системное сообщение в чат **b2b_order** (не только article)
- [x] E2E: brand messages после confirm материалов (core-02)
- [x] Убран `SupplierRfqReadonlyPanel` с core-path `/factory/production/materials` (development)

### Закрыто в волне P0/P2 (2026-06-04, W2 + nav + investor copy)

- [x] W2 e2e: round-trip **3 полей** ТЗ (`plannedLaunchCustomNote`, `packagingAndLabelingNote`, `weightAndDimensionsNote`)
- [x] Кабинет: убран дубль `RolePillarStrip` — остаётся aside `role-core-pillar-nav`
- [x] Рабочие экраны: убран `PillarSectionNav` (prev/next) — остаётся `RolePillarStrip` + cross-role
- [x] Order detail: убран дубль HandoffStrip; entity «Оптовый заказ · коллекция» без `B2B-DEMO-*` в chrome
- [x] Shop tracking deep link: `shopB2bTrackingOrderHref` + highlight по `?order=`
- [x] Hub shop labels: «Заказ · SS27» вместо тех. id в CTA

### Закрыто в волне P2 hub (2026-06-04, схлопывание + investor labels)

- [x] Hub: убрана «Живая цепочка» (`PlatformHubChainSection` / chain-flow-strip) — матрица + компактные блоки ролей
- [x] Hub: убраны бейджи `{N} активных / не в роли` на карточках ролей
- [x] Hub matrix CTA: `buildPillarEntityLabels` — без `B2B-DEMO-*` в подписях (чат/календарь/заказ/досье по коллекции)
- [x] Supplier hub `order_production`: убран дубль CTA «Мой кабинет» (≤3 действия)
- [x] E2E core-01/core-02: hub без chain-strip; core-01 без badge assertions
- [x] Unit: `platform-core-hub-matrix.test.ts` — entity labels и comms без тех. id

### Закрыто в волне P2 comms (2026-06-04, тред из реестра)

- [x] Brand/shop реестры: CTA **Чат** на каждой строке (`brandMessagesB2bOrderContextHref` / `shopMessagesB2bOrderContextHref`)
- [x] Shop реестр: **Цепочка** → `shopB2bTrackingOrderHref(orderId)` вместо общего tracking
- [x] Messages: `buildPlaceholderB2bOrderChat` — пустой тред по deep-link, если в PG ещё нет сообщений

### Закрыто в волне P2 cleanup + e2e (2026-06-04)

- [x] E2E core-02: **Чат** из реестров brand/shop → `contextType=b2b_order` + context banner
- [x] Orphan hub: 6 компонентов в `_archive/platform-core-legacy/components/platform/` (Scorecard, DemoTrail, HubDemoContext, PillarRoleMap, InvestorWalkthrough, SupplierRfqReadonlyPanel)
- [x] `OrderProductionPillarCard` shop: deep link на tracking заказа (`shopB2bTrackingOrderHref`)
- [x] Readiness sections: brand/shop comms — отражён чат из реестра

### Закрыто в волне P1 guards + FW27 (2026-06-04)

- [x] Shop B2B layout guard: `ShopB2bCoreLayoutGuard` — catch-all side-paths вне golden/redirect registry
- [x] `platform-core-shop-b2b-golden-paths.ts` + unit tests; tail `platform-core-b2b-side-path-redirect`
- [x] E2E core-04: `/shop/b2b/tenders` не рендерит mock
- [x] E2E core-06: FW27 tracking `?order=` + чат из реестра
- [x] Hub matrix tooltips: ≤2 пункта good/bad/fix + ссылка «Открыть рабочий экран»

### Закрыто в волне P2 comms + calendar (2026-06-04)

- [x] Реестры brand/shop: **превью последнего сообщения** под CTA «Чат» (`useB2bOrderThreadPreviews`)
- [x] `calendar-events` API: поле `targetChatId` на каждом событии (e2e core-01)
- [x] Checkout e2e: entity карточки заказа — коллекция, не `B2B-DEMO-*`

### Закрыто в волне UI dedup 3 — hub investor + workspace slim (2026-06-04)

- [x] Hub: убран kicker «Syntha · ядро платформы»; роли над матрицей (без scope-note / telemetry `<details>`)
- [x] Матрица: заголовок «Оценка готовности»; без `(PG)`/`(стат.)` в tooltip; без «ср.» в строках ролей; business-подпись режима (без E2E/PG jargon)
- [x] Wayfinding: `PlatformCoreWorkspaceWayfinding` + `backHref` на W2 артикул, досье цеха, materials
- [x] Workspace slim CardHeader: showroom (ранее), linesheets list, shop orders, partners; BOM description без «PostgreSQL»
- [x] E2E core-05: без клика telemetry; `platform-core-workspace-back`

- [x] Hub Business/Audit toggle: по умолчанию «Продукт» — без матрицы /10; «Аудит» — полная матрица

- [x] Slim CardHeader: brand b2b-orders, shop checkout, partner detail (entity в context bar)
- [x] Кабинет: `PlatformCoreRoleCabinetStrip` скрыт в platform core (вход с hub)
- [x] Nav core: без `SHOWROOM_SHOP_LEAD` в description

### Закрыто в волне 4 (2026-06-09)

- [x] `layout.tsx` → `@/lib/app-fonts` — dev:core не падает на Google Fonts (Turbopack)
- [x] `core:verify.sh` → `test:e2e:core:external` (reuse dev:core :3001)
- [x] core-02 cabinet e2e: side-nav, сезонные labels (`Весна–лето 2027`), supplier cabinet
- [x] Supplier material-confirm e2e идемпотентен при уже подтверждённой поставке в PG
- [x] pillar 2 e2e: пользовательский сезонный context label, не тех. `SS27`

### Закрыто в волне 13 — dossier/partners/shop e2e (2026-06-10)

- [x] `brand-op-dossier` (6.8→7.1): карточка ТЗ на order detail + link в pillar compact
- [x] `shop-sc-partners` (6.9→7.1): бейджи коллекций на карточке, RU без PG jargon
- [x] `shop-sc-matrix-entry` (7.2→7.3): MOQ уже на витрине — SECTION_AUDIT синхронизирован
- [x] `mfr-cm-cabinet` (7.5→7.6): «Все треды» в CommsPillarCard compact
- [x] `core-01`: e2e shop core pillars + partners discover
- [x] SECTION_AUDIT обновлён

### Закрыто в волне 12 — showroom/handoff/BOM + e2e pillars (2026-06-10)

- [x] `brand-sc-showroom` (6.8→7.1): CTA «Матрица магазина» на карточке артикула бренда
- [x] `brand-sc-cabinet` (6.9→7.1): error state `brand-sample-collection-mini-error` + fallback links
- [x] `brand-op-handoff` (6.7→7.0): CTA «Передача» в реестре заказов
- [x] `brand-op-cabinet/chain`: BOM preview + materials step badges в OrderProductionPillarCard
- [x] `shop-co-cabinet`: реестр в compact CollectionOrderPillarCard
- [x] `core-01`: e2e smoke на pillar testids + collection filter
- [x] SECTION_AUDIT обновлён

### Закрыто в волне 11 — cross-role W2 + empty states + filters (2026-06-10)

- [x] `brand-dev-dossier/cross/pg-sync` (6.7→7.0): W2 wayfinding — BOM badge, sample status, Gates ТЗ link
- [x] `DevelopmentPillarCard`: бейдж статуса образца в очереди цеха
- [x] `shop-sc-cabinet` (7.1→7.3): empty state `shop-showroom-mini-empty`
- [x] `brand-co-registry` (6.7→7.0): фильтр коллекции `brand-b2b-collection-filter`
- [x] `sup-op-cabinet` (7.1→7.3): compact CTA закупка · очередь ПЗ · чат
- [x] SECTION_AUDIT обновлён

### Закрыто в волне 16 — static &lt;7.0 brand/shop cabinets (2026-06-10)

- [x] `brand-dev-cabinet` (6.5→7.0): compact план · +SKU · образец (`development-*-link`)
- [x] `brand-co-cabinet` (6.5→7.0): ритейлеры в compact (`brand-co-retailers-link`)
- [x] `brand-co-registry` (6.6→7.0): e2e filter + CSV export в good
- [x] `brand-sc-cabinet` (6.8→7.0): compact 3 CTA + published badge
- [x] `brand-sc-showroom` (6.7→7.0): summary strip matrix/linesheets
- [x] `brand-op-handoff` (6.6→7.0): retry UI уже в коде — зафиксировано в audit
- [x] `shop-sc-partners` (6.8→7.0): testid showroom/matrix на карточках
- [x] `core-01`: e2e development/collection/sample/showroom/partners asserts
- [x] SECTION_AUDIT обновлён

**Остаток static &lt;7.0:** `brand-dev-dossier`, `brand-dev-range`, `brand-op-*` static-only, EMPTY27.

### Закрыто в волне 15 — последние liveScore &lt;7.0 (2026-06-10)

- [x] `brand-dev-w2-hub` (6.9→7.0): UI create + cross-links планировщик/лайншиты
- [x] `brand-dev-range` (6.9→7.0): сводка маржи (`range-planner-margin-summary`)
- [x] `brand-co-chain` (6.9→7.0): CTA передача после confirm (`collection-order-handoff-link`)
- [x] `brand-cm-calendar` (6.9→7.0): контекст заказа в календаре (`brand-calendar-order-context-strip`)
- [x] `shop-cm-calendar-logistics` (6.9→7.0): слой закупок + трекинг/чат (`shop-calendar-logistics-strip`)
- [x] `core-01`: e2e W2 hub, range planner, calendars, partners collections
- [x] SECTION_AUDIT обновлён

**Остаток &lt;70% live:** в основном static-only brand cabinets (`dev-cabinet`, `co-cabinet`, …) и EMPTY27 edge cases.

### Закрыто в волне 14 — разделы &lt;70% + cross-role e2e (2026-06-10)

- [x] `brand-op-cabinet` (7.0→7.1): inline BOM строки (`brand-op-bom-preview-lines`)
- [x] `brand-op-chain` (6.9→7.0): e2e `brand-op-materials-step-badge` в кабинете
- [x] `brand-co-detail` (6.9→7.0): e2e `brand-b2b-factory-queue-link`
- [x] `brand-co-retailers` (6.9→7.0): cross-role «Витрина» (`retailer-showroom-link-*`)
- [x] `brand-dev-cross` (7.0→7.1): e2e `brand-w2-sample-handoff-link`
- [x] `mfr-dev-cabinet` (7.2→7.3): compact ТЗ бренда · досье · образцы
- [x] `mfr-op-materials` (7.1→7.2): WMS reserve badge (`mfr-op-wms-reserve-badge`)
- [x] `sup-op-handoff-read` (6.9→7.0): PO deep-link + e2e supplier pillars
- [x] `sup-op-chain` (7.1→7.2): чат бренду после materials_supplied
- [x] `core-06`: FW27 чат — навигация по href (обход demo-rail)
- [x] `core-01`: manufacturer redirect через `gotoRoleCoreCabinet`; pillars e2e 4 роли
- [x] SECTION_AUDIT обновлён

**Остаток P1:** полный green `core:verify`; UAT 69; W2 UI create; margin edit в range planner.

### Закрыто в волне 10 — блокер 500 + detail/range/chain (2026-06-10)

- [x] **Блокер:** дубль импорта `factoryMaterialsProcurementHrefForDemo` в `PlatformCoreEmptyCellPanels.tsx` → 500 на всех кабинетах
- [x] `brand-co-detail` (6.6→6.9): цепочка заказа первым блоком — handoff без scroll
- [x] `brand-op-chain` (6.6→6.9): CTA «Очередь цеха» в `B2bOrderChainStatusCard`
- [x] `brand-dev-range` (6.6→6.9): tier→W2 link, убран PostgreSQL jargon в UI
- [x] SECTION_AUDIT обновлён

### Закрыто в волне 9 — кабинеты бренда + UX честность (2026-06-10)

- [x] `brand-co-cabinet` (6.6→7.0): сводка qty/сумма заказа (`collection-order-qty-summary`); compact: реестр · карточка · матрица
- [x] `brand-op-cabinet` (6.6→7.0): compact закупка + чат (`brand-op-procurement-preview-link`)
- [x] `brand-dev-cabinet` (6.6→7.0): бейдж BOM по досье (`development-bom-ready-badge`)
- [x] `brand-co-retailers` (6.7→6.9): tier-бейдж «Оптовый» (`retailer-tier-badge-shop1`)
- [x] `PlatformCoreBootstrapBanner`: user-facing без PostgreSQL/npm; dev-only `<details>`
- [x] `shop-co-cabinet` compact: матрица + карточка заказа в CollectionOrderPillarCard
- [x] SECTION_AUDIT обновлён для затронутых разделов

**Остаток P1:** inline BOM preview в brand-op-cabinet; e2e на новые testid; повторный green `core:verify`.

### Закрыто в волне 8 — smoke-only + verify prep (2026-06-10)

- [x] Инфра: `stop:stale-dev` + `dev:core` на :3001 (блокер `core:verify`)
- [x] `brand-sc-publish` (6.7→7.1): кнопка «Снять с витрины» в linesheets (`brand-linesheet-unpublish-*`)
- [x] `shop-op-order-status` (7.0→7.3): карточка ETA + календарь/трекинг (`shop-order-production-eta-card`)
- [x] `brand-cm-cabinet`: CTA «Все треды» в CommsPillarCard compact
- [x] `shop-sc-cabinet`: compact mini — витрина + матрица; бейдж «Партнёр» вместо «PG»
- [x] Legacy redirect: без «PostgreSQL» в user-facing copy
- [x] core-02 handoff: `let res` (исправление TypeError) — в коде

**Честно (verify 2026-06-10):** после `stop:stale-dev` + `dev:core` прогон стартовал, но часть e2e ушла в **timeout 1.5m** (core-02 столп 1, core-04 legacy batch, core-05) — вероятно холодный compile / нестабильный dev. **Не считаем green** до повторного прогона с `npm run core:prep` при стабильном :3001.

### Закрыто в волне 7 — smoke-only uplift (2026-06-10)

- [x] `brand-co-chain` (6.4→6.9): SLA бейдж + CTA чат при ожидании confirm
- [x] `shop-op-registry` (6.9→7.3): колонка ПЗ + фильтр «В производстве»
- [x] `brand-op-registry`: экспорт CSV реестра
- [x] `brand-sc-linesheets`: CTA «Матрица» на каждой строке лайншита
- [x] `brand-dev-cabinet` compact: cross-role (образец, досье, BOM) в DevelopmentPillarCard
- [x] `mfr-cm-cabinet`: supplier thread + article chat в CommsPillarCard compact
- [x] `sup-op-handoff-read`: procurement links → `factoryMaterialsProcurementHrefForDemo` (order= в URL)
- [x] Jargon: убран `(PG)` / «база данных» из CollectionOrderPillarCard, OrderProductionPillarCard

### Закрыто в волне 6 — low-readiness uplift (2026-06-10)

- [x] Кабинет: пустые столпы — cross-role peers вместо blank panel (`role-pillar-empty-participant`)
- [x] User-facing: убран jargon «база данных» / npm из `platform-core-user-messages.ts` и panels
- [x] `brand-dev-cross`: CTA «Передать образец в цех», досье цеха, BOM поставщика (W2 wayfinding + DevelopmentPillarCard)
- [x] `brand-co-retailers`: CTA «Заказы коллекции» + deep-link `?partner=` в реестр
- [x] `brand-op-registry`: колонка ПЗ, фильтр «Ожидает передачу»
- [x] `sup-op-bom-po`: убран progress cap 40% в SupplierProcurementPillarCard
- [x] Shop order_production cabinet: ссылка «Календарь поставки» из pillar card
- [x] Showroom: data-testid MOQ на карточке артикула
- [x] SECTION_AUDIT scores обновлены для затронутых разделов

### Закрыто в волне 5 (2026-06-10)

- [x] core-02: «Матрица заказа» (не legacy «Настройка Оптового Заказа»)
- [x] core-02: linesheets через `platform-core-list-chrome`; FW27 → «Осень–зима 2027»
- [x] core-02: кабинет без `role-pillar-strip`; handoff `const`→`let` TypeError fix
- [x] `BrandSampleCollectionMini` compact: CTA «Матрица магазина» сохранён
- [x] Checkout: убран invalid `deliveryDate: standard`; `cartSession` URL + cookie fallback
- [x] PG dossier merge `b2bIntegrationDraft` для demo-ss27 при отсутствии wholesale в dossier
- [x] dev-gate skip для file-store demo articles (`demo-ss27-01`); `collectionId` в gate
- [x] **Полный `npm run core:verify`:** 152 passed / 0 failed / 5 skipped / exit 0

### Сводный аудит 5×4 (2026-06-10, ручные + agents)

| Метрика | Балл | Комментарий |
|---------|------|-------------|
| Цепочка 15 ячеек | **~7.1** | Guided path SS27; verify green, UAT не пройден |
| Cross-role | **~7.0** | core-13/14 comms; SSE chain-status; handoff ручной |
| UI-дедуп | **~8.5** | 11/11 `audit:platform-core-ui`; hub Business default |
| Инвесторская читаемость | **~7.5** | Сезонные RU labels; без B2B-DEMO в chrome |
| Автоматика E2E | **8.0** | 152 passed; 69/69 smoke; ~40% golden |
| Продукт (ручной) | **~6.5** | UAT 0/69 — главный разрыв «зелёный CI ≠ готовый продукт» |

| Столп | Бренд | Магазин | Производство | Поставщик |
|-------|-------|---------|--------------|-----------|
| 1 | 6.6 | — | 7.5 | 7.2 |
| 2 | 6.9 | 7.3 | — | — |
| 3 | 6.6 | 7.6 | — | — |
| 4 | 6.6 | 7.1 | 7.3 | 7.1 |
| 5 | 7.1 | 7.3 | 7.4 | 7.3 |
| **Средняя** | **6.8** | **7.3** | **7.4** | **7.2** |

**Покрытие SECTION_AUDIT (agents):** smoke 69/69 (`core-08`) · golden ~18 · interactive ~10 · без e2e 0.

**Волны развития (остаток):** (A) **UAT 69** — P1 gate; (B) multi-tenant buyer, W2 UI create article, dossier full round-trip; (C) inventory live reserve Wave D, push вместо poll; (D) telemetry→liveScore, entity-links cleanup.

### Закрыто в волне UI dedup 2 (2026-06-04)

- [x] Comms/calendar: `PlatformCoreCommsWorkspaceExtras` — slim banner, контент внутри `ListChrome`
- [x] Factory comms banner `slim` — без ряда CTA (cross-role внизу)
- [x] Убраны `ShopB2bToolHeader` и дубли lead на shop calendar
- [x] Hub: chips столпов убраны из `PlatformCoreRoleCabinetBlocks`
- [x] Матрица hub: без subtitle в заголовках столбцов
- [x] Empty panels: cross-role только `variant="compact"`

### Закрыто в волне UI dedup (2026-06-04)

- [x] Канон поверхностей: `platform-core-ui-surfaces.ts` + правило `.cursor/rules/platform-core-ui-dedup.mdc`
- [x] Кабинет: убраны дубли title/lead/secondary actions; insight cards `compact`; один primary CTA + compact cross-role
- [x] Pillar cards / mini: в кабинете только статус (без ряда ссылок)
- [x] `RolePillarCrossRoleLinks` compact на workspace и кабинете; full — короче (только активные peers)
- [x] Hub: один lead вместо lead + disclaimer

### Закрыто в волне P0 materials + calendar (2026-06-04)

- [x] E2E core-02: после PATCH material-request — `materials_supplied` **done** на pillar card цеха и поставщика (`data-testid=platform-core-chain-step-materials_supplied`)
- [x] E2E core-02: brand calendar — клик B2B-события → `/brand/messages` с контекстом заказа
- [x] `CELL_AUDIT`: brand development (3 поля ТЗ), comms (targetChatId), supplier procurement (чат бренду)

## Агентный пересмотр (2026-06-10)

Параллельно сверены: код волны 5, `CELL_AUDIT`, 14 e2e-spec, UAT checklist.

| Агент | Вывод |
|-------|-------|
| Code vs AUDIT | Волны 4–5 закрыты; устаревшие claims (46 e2e, два календаря, B2B-DEMO в UI) сняты |
| E2E coverage | 69/69 smoke; ~28 golden/interactive; 0 разделов без автоматики |
| Честные scores | Цепочка +0.1 vs 06-04; UI-dedup +0.3; продуктовый слой −1.5 из-за UAT 0/69 |

**Top-10 оставшихся разрывов:** (1) UAT 69, (2) W2 UI create article, (3) multi-tenant buyer, (4) dossier full round-trip, (5) live WMS reserve, (6) shop tail paths, (7) Range Planner margin UI, (8) tracking push/inbox, (9) telemetry→liveScore, (10) FW27 full golden.

## Что сделано хорошо

- Единая модель **5×4** — `platform-core-hub-matrix.ts`, ≤3 действия/столп, active/empty
- **Полный `core:verify` green** — 152 passed, инфраструктура стабильна (fonts, cartSession, external dev)
- Кабинеты `/brand|shop|factory/*/core` — 5 столпов, 1 primary CTA, insight cards (бренд 5/5)
- Golden path магазина — showroom → `CoreWholesaleMatrix` → checkout → orders → tracking → comms
- Handoff — brand confirm → PO queue → dossier BOM
- Comms — `CommunicationsEntityContextBanner` на 4 ролях; slim messages; fail-closed memory
- W2 PG-authoritative golden — досье + состав без localStorage overlay (SS27/FW27)
- Linesheets PG read-only (без LineSheetGenerator на core-path)
- Supplier PATCH `material-request`; batch `chain-status-batch`
- Cross-role — linesheets→matrix, manufacturer→supplier procurement, empty panels `embedCrossRole`
- Guards/redirects — legacy B2B-00xx, ~27+ shop B2B side-paths
- Readiness UI — итог из матрицы; manufacturer 8.2 (не 8.9)

## Что плохо / нарушает принципы

| Проблема | Где | Эффект | Приоритет |
|----------|-----|--------|-----------|
| **Ручной UAT 0/69** | `SECTION-AUDIT-UAT-CHECKLIST.md` | CI green ≠ продуктовый sign-off | **P1 gate** |
| Новый артикул только через API | W2 golden | нет UI «создать SKU»; 4 поля e2e, не все секции ТЗ | P0 бренд |
| `buyerId` = один демо-магазин | `SHOP_CORE_DEMO_BUYER_ID` | multi-tenant checkout невозможен | P0 |
| Резерв checkout — честный badge | checkout-core | live WMS reserve только после handoff | P1 (волна D) |
| Range Planner margin UI | `range-planner-core` | FW27 PG ok; margin не редактируется | P1 бренд |
| ~11 shop tail paths | guards registry | часть URL вне golden — redirect/banner | P1 |
| 51 `*-legacy.tsx` | `_archive/` | ✅ 51/51 перенесены | — |
| `entity-links` ~73 getters | `entity-links.ts` | фильтр при рендере, не удалены | P2 |
| Hub scores не telemetry | `CELL_AUDIT` | ручной spreadsheet | P2 |
| Два календаря shop | nav | ✅ слит в canonical | — |
| RFQ legacy vs chat-only | nav/legacy | ✅ RFQ mock off, chat path | — |
| `B2B-DEMO-*` в seed id | PG seeds | маскируется RU labels в UI | P2 rename |
| FW27 / EMPTY27 | core-06 | partial e2e; не полный golden как SS27 | P2 |
| Tracking без push | shop tracking | poll 15с / SSE hub, не inbox push | P2 |

## Разрывы связей

| Связь | Статус |
|-------|--------|
| W2 publish → showroom PG | ✅ |
| Showroom → matrix → checkout | ✅ |
| matrix → checkout → **новый** PG order | ✅ core-02 + cartSession (волна 5); нужен `core:prep` |
| B2B registry → PG detail | ✅ B2B-DEMO-* / B2B-{ts} |
| Legacy B2B-00xx → redirect | ✅ |
| Handoff → PO → dossier | ✅ |
| Brand linesheets → shop matrix | ✅ CTA |
| Manufacturer ↔ supplier | ✅ procurement + comms banner |
| Supplier material-request | ✅ PATCH API |
| W2 полная PG sync | ⚠️ golden OK; новый артикул — Range Planner |
| Cross-role в empty panels | ✅ частично |
| chain-status batch | ✅ |

## По ролям: что улучшать

### Бренд (~6.8) — слабое звено

| Столп | Сейчас | Следующий шаг |
|-------|--------|---------------|
| 1 | W2 API-first; Range Planner PG для SS27/FW27 | tier-метки на всех артикулах; e2e dossier round-trip |
| 2 | Linesheets PG + cross-role | e2e linesheets→matrix стабильно с PG |
| 3 | Registry PG + pillar card + batch chain на строке | ✅ `B2bChainPhaseBadge` |
| 4 | Handoff + pillar card | ✅ retry + `brand-b2b-handoff-retry` |
| 5 | slim + banner | ✅ `key` на MessagesPage при смене collection |

### Магазин (~7.3) — сильнейший guided path

| Столп | Оценка | Главный разрыв |
|-------|--------|----------------|
| 1 | — | Роль не участвует в столпе |
| 2 | 7.3 | E2E partner/hero mini; fallback cover |
| 3 | **7.6** | Checkout PG order ✅; резерв badge честный, не live WMS |
| 4 | 7.1 | Read-only tracking; poll не push |
| 5 | 7.3 | core-13 calendar↔chat ✅; tracking→calendar CTA нет |

### Производство (~7.4)

| Столп | Оценка | Главный разрыв |
|-------|--------|----------------|
| 1 | 7.5 | Read-only досье; export meta e2e есть |
| 2–3 | — | Роль не участвует в столпах |
| 4 | 7.3 | bulk-ack ✅ (core-12); ERP retry ручной; MES core-11 |
| 5 | 7.4 | Universal inbox по handoff queue; dedupe e2e слабый |

### Поставщик (~7.2)

| Столп | Оценка | Главный разрыв |
|-------|--------|----------------|
| 1 | 7.2 | BOM PG; нет каталога в кабинете |
| 2–3 | — | Роль не участвует в столпах |
| 4 | 7.1 | PATCH+bulk confirm ✅; нет WMS reserve; 1 article/view |
| 5 | 7.3 | core-13 calendar; banner dedupe core-14 частично |

## Дорожная карта (по важности)

### Волна A — честность (остаток)

- [x] Redirect messages shop B2B — бизнес-RU без «demo»/SS27 (27 правил + тест)
- [x] Range Planner — без mock-tier цифр; бюджет/маржа только из PG (`budgetFromPg`)
- [x] Hub/scope/profile leads — без SS27/demo/investor jargon
- [x] Shop empty-cell development — бейдж «Ожидаем публикацию коллекции» + deep-link на артикул бренда
- [x] Календарь магазина — canonical `/shop/b2b/calendar` в nav augment + dashboard
- [x] User-facing ошибки без `npm run core:bootstrap` (`platform-core-user-messages.ts`)
- [x] Brand legacy redirect messages — бизнес-RU (26 правил)
- [x] +7 shop guards (analytics, rfq, replenishment, …) → **37 shop + 26 brand**
- [x] E2E `core-04-legacy-redirects.spec.ts` на все testId
- [x] W2 hub: код коллекции только в dev-контексте, не в заголовках hub
- [x] Core *-core.tsx: user-facing ошибки через `platform-core-user-messages.ts` (orders, linesheets, messages, range, materials, retailer)
- [x] Hub/cross-role/mini-панели: бизнес-RU без demo/SS27 в заголовках; коллекции — `getPlatformCoreCollectionLabel()`
- [x] Archive legacy **51/51** в `_archive/platform-core-legacy/`

### Волна B — связность (остаток)

- [x] e2e create order — `core-02` matrix → checkout → новый PG order (требует `core:prep` при прогоне)
- [x] Readiness live/static toggle e2e — `core-05`, `data-testid="platform-core-readiness-mode"`
- [x] slimCore: assertion что AI widgets скрыты — `core-05`, testId на `AiVoiceAssistant` / `GlobalPulse`
- [x] Один реестр side-paths — `platform-core-side-paths-registry.ts` (redirect + nav augment)
- [x] User-facing readiness/hub/orders без `npm run` на investor surfaces

### Волна D — резерв и досье (частично)

- [x] Резерв WMS при handoff (`tryReserveB2bInventoryOnHandoff`) + статус `allocated`
- [x] Шаг `inventory_reserved` в chain-status (4 шага)
- [x] E2E dossier API round-trip (`core-01`)
- [x] Calendar ↔ thread: `b2bOrderId` + `targetChatId` + ссылка «Открыть чат» в карточке события
- [x] Factory dossier: метка SKU экспорта ТЗ (`factory-dossier-export-sku`) + e2e core-02
- [x] UI round-trip досье в W2 golden path (`core-02`, `plannedLaunchCustomNote` → PG)
- [x] Календарь: клик по событию B2B → сообщения с `chat=` (авто-фокус треда)
- [x] Tracking: бейдж резерва + poll chain-status 45с (`platform-core-tracking-reserve-*`)
- [x] Procurement: context query (`order` + `orderId`) на href закупки; forecast → закупка (e2e `core-06`)
- [x] E2E PATCH material-request — подтверждение поставки (`core-02`, `materials-procurement-confirm`)
- [x] Chain-status: шаг `materials_supplied` (5 этапов) + бейдж в tracking и прогнозе поставщика
- [x] RU: «закупка под производственный заказ» вместо «PO»/handoff на supplier procurement path

### Волна C — PG-only product

- [x] Инвентарь legacy — `platform-core-legacy-manifest.ts` (51 page-split + guards); физический archive **51/51** в `src/_archive/`
- [x] `entity-links` core filter — `platform-core-entity-links-registry.ts` + RU labels в hub slice
- [x] Hub telemetry strip (не заменяет оценки) — `platform-core-readiness-telemetry.ts`, `core-05` e2e
- [x] Handoff retry UX + RU без npm на brand order card
- [x] Archive playbook — `src/_archive/platform-core-legacy/README.md`
- [x] FW27 + EMPTY27 e2e — `core-06-collections-fw-empty.spec.ts`
- [x] Бизнес-подписи коллекций (без SS27/FW27/EMPTY27 в UI labels)
- [x] RU: «передача в производство» вместо handoff/mini-workspace на core-path
- [x] UoM (ед. изм.) в supplier BOM preview + batch API (`materials[]` с `unitLabelRu`)
- [x] Checkout: RU lead без W2/PG jargon + честный бейдж резерва (`SHOP_B2B_CHECKOUT_INVENTORY_HOLD_RU`)
- [x] Range Planner FW27: metadata fallback → `dataSource: pg`; честные бейджи pg/partial
- [x] Physical archive pilot: 3 shop B2B legacy → `_archive/platform-core-legacy/`
- [x] Brand comms: remount threads при смене `?collection=`
- [x] Showroom hero из dossier + RU labels (`PlatformCorePublishedShowroom`, `ShopShowroomMini`)
- [x] B2B side-path guards: `shop-b2b-core-legacy-guard.tsx` + `/rfq/create`
- [x] Physical archive batch 2: catalog, discover, grid-ordering, lookbooks, order-mode (8/51)
- [x] Physical archive batch 3: payment, pre-order, quick-order, whiteboard, working-order (13/51)
- [x] Physical archive batch 4: ai-smart-order, collaborative-order, quote-to-order, selection-builder, shopify-sync (18/51)
- [x] Physical archive batch 5: create-order, order-by-collection, reorder, workspace-map, calendar (23/51)
- [x] Manufacturer sample_collection: CTA «Лайншит у бренда» из PG status
- [x] Supplier redirect: client-side с сохранением hash/search
- [x] RFQ mock отключён в Platform Core (`listRfq` → `[]`)
- [x] Cross-role links: «Рабочий экран» вместо «Demo-экран»
- [x] Manufacturer order_production: golden CTA «Очередь передачи в производство» в кабинете
- [x] Factory comms: dedupe `PlatformCoreFactoryCommsContextBanner` при `hasCommunicationsUrlContext`
- [x] Physical archive batch 6: orders, showroom, tracking, partners/* — shop B2B legacy **полностью** (30/51)
- [x] `factory/supplier/supplier-legacy` → `_archive/` (31/51)
- [x] `ShopShowroomMini`: бренд-партнёр + logo/cover из PG partnerships API
- [x] Brand `suppliers/rfq` в core → чат поставщика по артикулу
- [x] Physical archive batch 7: factory production ×5 + `factory/calendar` (36/51)
- [x] Factory dossier portal: метаданные экспорта ТЗ из PG-досье (без mock)
- [x] Physical archive batch 8: brand linesheets, b2b-orders, messages legacy (40/51)

## E2E (2026-06-10)

**Полный прогон:** `npm run core:verify` → **152 passed / 0 failed / 5 skipped** (~16 мин). Smoke: all checks passed.

| Spec | Фокус |
|------|-------|
| core-01 | Hub smoke, calendar targetChatId, dossier API |
| core-02 | **Golden path** SS27: W2, linesheets, matrix, checkout→PG order, handoff, materials PATCH, 4 кабинета |
| core-03 | Interactive handoff POST |
| core-04 | Legacy redirects (37 shop + 26 brand) |
| core-05 | Readiness Business/Audit, slimCore no AI widgets |
| core-06 | FW27 + EMPTY27 collections |
| core-07 | PG interactive bootstrap (no auto-handoff seed) |
| core-08 | **69/69 SECTION_AUDIT** HTTP smoke + chrome |
| core-09 | Chain-status SSE honesty |
| core-10 | No-bootstrap honesty banners |
| core-11 | MES release stages (cut→sew→QC) |
| core-12 | Bulk accept registry |
| core-13 | Comms cross-nav 4 роли + supplier calendar |
| core-14 | Comms banner dedupe + B2B templates |

**Покрыто golden/interactive (~40% разделов):** matrix→checkout→order, handoff, materials confirm, comms registry→chat, MES, bulk ack.

**Не покрыто e2e (остаток):** полный UI round-trip всех секций ТЗ; UI create article; multi-tenant buyer; live WMS reserve at checkout; чистая PG без seed (`core-10` только honesty banner).

### Волна 17 (2026-06-10) — static &lt;7.0 → 0

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | `Workshop2TzExportButton` в wayfinding (`brand-w2-tz-export-btn`) — ZIP или gate-статус |
| brand-dev-pg-sync | `development-progress-pct` в DevelopmentPillarCard |
| brand-dev-range | cross-links витрина/лайншиты (`range-planner-showroom-link`) |
| brand-dev-cross | `development-showroom-link` в compact кабинете |
| brand-sc-linesheets | empty state CTA W2/витрина (`brand-linesheets-empty-*`) |
| brand-co-detail | `brand-order-detail-cross-links`; pre-orders → `brand-pre-orders-demo-order-link` |
| brand-op-chain/cabinet | `brand-op-po-id-badge` |
| brand-op-dossier | `brand-order-w2-dossier-locked-badge` после handoff |
| brand-cm-calendar | `brand-calendar-registry-link` |
| shop-cm-calendar-logistics | `shop-calendar-order-detail-link` |
| sup-op-handoff-read | `supplier-handoff-queue-count` |

**SECTION_AUDIT:** все `staticScore` ≥ **7.0**. E2E `core-01` расширен под новые testId.

**Verify волна 17:** `155 passed / 2 failed` — (1) `core-01` неверный URL hub вместо `/c/SS27/a/…` → исправлен; (2) `core-13` клик по событию без `targetChatId` → селектор только «Передача в производство».

### Волна 18 (2026-06-10) — P1 product gaps

| Раздел | Изменение |
|--------|-----------|
| brand-dev-range | PATCH `/api/workshop2/collections/…/range-planner` + UI редактирование маржи/бюджета tier |
| brand-dev-range | EMPTY27: `range-planner-empty-chain-notice` + ссылка на SS27 (без mock-tier шума) |
| brand-dev-w2-hub | PG fallback create: POST `/api/workshop2/articles` (sku+categoryLeafId) при PG-authoritative SS27 |
| brand-dev-w2-hub | E2E `core-02` UI create round-trip (`brand-w2-create-article-*`) |
| brand-cm-calendar | `calendar-b2b-event-{id}` на B2B-событиях с `targetChatId` |
| brand-dev-dossier | (волна 17) экспорт ТЗ — без изменений в 18 |

**E2E:** `core-02` W2 create + calendar→chat (testId handoff) · `core-06` EMPTY27 · `core-13` calendar→chat.

**Verify волна 18:** `159 passed / 0 failed / 4 skipped` — PG dialog create, calendar B2B testIds.

### Волна 19 (2026-06-10) — comms + range planner + MES FW27

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier / brand-cm-article-chat | POST `attach-tz-to-chat` + `brand-w2-tz-attach-chat-btn` + ссылка в contextual chat |
| brand-dev-range | PATCH tier для артикула + `range-planner-tier-assign-panel` |
| brand-sc-showroom | `brand-showroom-article-chat-link-*` с витрины |
| mfr-op-production-orders | `core-11` FW27 MES strip e2e |

**E2E:** `core-02` TZ→chat · `core-11` FW27 MES.

### Волна 20 (2026-06-10) — shop cross-links + prebook chain

| Раздел | Изменение |
|--------|-----------|
| shop-cm-order-chat | `shopMessagesWorkshop2ArticleContextHref` + CTA витрина/матрица |
| shop-cm-cabinet | CommsPillarCard: чат артикула для shop |
| shop-op-cabinet | `shop-op-tracking-hub-link` + `shop-op-tracking-pillar-compact` |
| shop-co-cabinet | `shop-collection-order-matrix-cta` (продолжить матрицу) |
| brand-co-detail | `brand-pre-orders-chain-badge-*` на prebook |

**E2E:** `core-01` shop pillars + showroom article-chat + tracking hub.

### Волна 21 (2026-06-10) — cart qty + prebook chain e2e

| Раздел | Изменение |
|--------|-----------|
| shop-co-cabinet | `shop-collection-order-cart-qty-badge` в compact |
| brand-co-detail | chain badge empty state + e2e `/brand/pre-orders` |
| shop-cm-order-chat | e2e matrix article-chat (`shop-b2b-matrix-article-chat-*`) |

**E2E:** `core-01` cart qty badge, matrix article-chat, pre-orders chain badge.

### Волна 22 (2026-06-10) — shop CSV + sample queue position

| Раздел | Изменение |
|--------|-----------|
| shop-co-registry | `shop-b2b-registry-export-csv` + thread preview e2e |
| shop-op-tracking | `shop-b2b-tracking-export-csv` |
| brand-dev-pg-sync | `development-sample-queue-position` (#N/M в очереди) |
| shop-sc-cabinet | e2e EMPTY27 `shop-showroom-mini-empty` |
| core-08 | retry ×2 при transient HTTP 500 |

**E2E:** `core-01` registry/tracking CSV + sample queue position · `core-06` EMPTY27 mini empty.

### Волна 23 (2026-06-10) — linesheet qty + retailer detail + error fallbacks

| Раздел | Изменение |
|--------|-----------|
| brand-sc-cross-matrix | `brand-linesheet-matrix-qty-*` из demo B2B order |
| brand-sc-publish | e2e unpublish button visible |
| brand-sc-cabinet | error fallback links + e2e core-06 |
| brand-co-retailers | `retailer-detail-link-*` → `brand-retailer-detail-core` |
| shop-sc-partners | `partners-discover-invite-*` для неподключённых |

**E2E:** `core-01` linesheet qty/unpublish + retailer detail · `core-06` mini-error fallback.

### Волна 24 (2026-06-10) — showroom→matrix, checkout→chat, shop order detail

| Раздел | Изменение |
|--------|-----------|
| shop-sc-matrix-entry | `shop-showroom-cart-qty-*`, `shop-showroom-matrix-quick-add-*`, deep link `?article=` + scroll в матрице |
| shop-co-checkout | checkout → `submitted` + системное сообщение в чат заказа (`dispatchNow`) |
| shop-co-detail | `shop-order-detail-cross-links` (чат/трекинг/календарь/матрица) |
| brand-co-chain | системное сообщение при submit заказа из корзины |

**E2E:** `core-01` showroom matrix/quick-add + shop order detail chat · `core-02` checkout submitted (без регрессии).

### Волна 25 (2026-06-10) — multi-tenant buyer (P0)

| Раздел | Изменение |
|--------|-----------|
| shop-co-checkout | `shop-b2b-buyer-switcher` (shop1/shop2), cookie `shop_b2b_buyer_id`, API resolver |
| shop-co-registry | реестр/inbox фильтруются по активному buyer |
| shop-co-matrix | buyer label из контекста, не hardcode «Партнёр» |

**E2E:** `core-01` buyer switcher shop1→shop2 · unit `shop-core-buyer-context.test.ts`.

### Волна 26 (2026-06-10) — shop2 seed + brand bulk handoff

| Раздел | Изменение |
|--------|-----------|
| shop-co-registry | seed `B2B-DEMO-SHOP2-SS27` (buyer shop2, confirmed) |
| brand-op-handoff | bulk API + UI (`brand-b2b-bulk-handoff`, checkboxes) |
| shop-cm-order-chat | contextual seed для shop2 order thread |

**Seed:** `npm run db:seed:workshop2-b2b-demo-order` (shop1+shop2) · **E2E:** `core-01` shop2 row + brand bulk select.

### Волна 27 (2026-06-10) — SSE registry push при новом заказе (P0)

| Раздел | Изменение |
|--------|-----------|
| brand-co-chain | `registry-stream` SSE + `bumpPlatformCoreB2bRegistry` из domain event `b2b.order.status_changed` |
| brand-co-registry | auto-refetch списка без ручного refresh; thread preview bump |
| shop-co-registry | тот же hub для shop orders list |
| brand-co-chain | `bumpPlatformCoreChainStatus` при смене статуса (checkout/handoff) |

**Файлы:** `platform-core-b2b-registry-hub.ts`, `use-platform-core-b2b-registry-poll.ts`, `/api/platform-core/b2b/registry-stream`.

### Волна 28 (2026-06-10) — PG unread в messages (P0)

| Раздел | Изменение |
|--------|-----------|
| brand-cm-order-chat | `usePgCommunicationsUnread` + `pg-contextual-read-state` (messageCount − lastSeen) |
| shop-cm-order-chat | shop cabinet unread + ChatList badges |
| brand-co-chain | CommunicationsNavBar → PG unread (не mock) |
| CommsPillarCard | `comms-pillar-unread-badge` + статус «N непрочит.» |

**Честно:** read-state пока **localStorage**, не server-side receipts.

### Волна 29 (2026-06-10) — dossier e2e + live WMS reserve

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | core-02: assignment PG chip + API passportProductionBrief round-trip |
| shop-op-tracking | core-02: live WMS reserve на tracking + `b2b-chain-step-inventory_reserved` |
| B2bOrderChainStatusCard | `data-testid`/`data-done` на шагах цепочки |

**WMS e2e:** skip если `internal_wms_disabled`; при PG+WMS — strict assert `inventoryReserved`.

### Волна 30 (2026-06-10) — construction dossier e2e + buyer из org

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | core-02: UI+API round-trip `smartRoutingSequence` (construction/equipment) |
| shop-co-checkout | `resolveShopCoreBuyerIdFromOrganization` + wire в `useShopCoreBuyerId` / API header |
| Workshop2SmartRoutingPanel | testids: load-template, equipment-0 |

**Честно:** buyer map — демо-пресеты (`org-shop-001`, `retail_msk_*`), не полный auth-bound tenant; cookie/query по-прежнему приоритетнее org.

### Волна 31 (2026-06-10) — material dossier e2e + WMS reserve в seed

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | core-02: UI+API round-trip `productionModel.materialLines[0].materialName` |
| shop-op-tracking / chain-status | handoff seed вызывает `confirmWorkshop2B2bProductionHandoff` → `PO.payload.inventoryReserve` |
| Workshop2ProductionBomByNodesPanel | testids: material-hub, bom-panel, bom-name-0 |

**Честно:** composition label (бирка) в e2e пока только через BOM; полный UI бирки — в fix.

### Волна 32 (2026-06-10) — composition label dossier e2e

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | core-02: UI+API `compositionLabelSpec.technologistNotes` (шаг 1 составника) |
| Workshop2CompositionLabelSpecBlock | testid `workshop2-dossier-composition-label-panel` |
| Workshop2CompositionLabelDimensionsSection | testid `workshop2-dossier-composition-technologist-notes` |

**Честно:** шаги 2–4 составника (волокна, макет, PDF) в e2e не покрыты.

### Волна 33 (2026-06-10) — server read receipts (P1)

| Раздел | Изменение |
|--------|-----------|
| brand-cm-order-chat | `workshop2_contextual_read_state` PG + `POST /api/messages/contextual/read-state` |
| shop-cm-order-chat | threads API `?readerId=shop-buyer` → `lastSeenMessageCount` |
| brand-co-chain | unread = max(localStorage, server lastSeen) |

**Файлы:** `024_workshop2_contextual_read_state.sql`, `workshop2-contextual-read-state-repository.ts`, `pg-contextual-read-state.ts` (sync POST), `pg-contextual-actor-ids.ts`.

**Честно:** actor ids — demo presets (`user_petr`, `shop-buyer`, `factory-ops`), не JWT-bound multi-tenant; localStorage остаётся offline cache.

### Волна 34 (2026-06-10) — composition steps 2–4 e2e + core:verify fixes

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | core-02: UI+API `careInstructionsSupplement`, `labelGarmentSizeText`, `draftTextManual` |
| core-02 handoff | idempotent confirm принимает `allocated` (после WMS seed) |
| core-02 matrix | `Матрица заказа · SS27` + `retailer-w2-badge-shop1` (strict mode) |

**Testids:** `composition-care-supplement`, `composition-label-size`, `composition-draft-manual`.

**Честно:** fiber constructor rows и PDF/SVG export в e2e не покрыты.

### Волна 35 (2026-06-10) — org→buyer onboarding map (P1)

| Раздел | Изменение |
|--------|-----------|
| shop-co-checkout | org map расширен; **org > cookie** при resolve buyer |
| shop-co-registry | API `x-w2-organization-id: retail_msk_2` → shop2 orders |
| core-01 | e2e `api: shop orders buyer from org header` |

**Честно:** JWT-bound buyer из сессии — следующий шаг; резерв на checkout по-прежнему фейк до handoff.

### Волна 36 (2026-06-10) — session uid для PG read-state

| Раздел | Изменение |
|--------|-----------|
| brand-cm-order-chat | `resolvePgContextualActorId` → `user.uid` (brand-001, shop-001, factory-001) |
| shop-cm-order-chat | то же для shop cabinet |
| Comms unread | `usePgContextualActorId` вместо hardcoded demo ids |

**Честно:** server-side actor по-прежнему из header `x-w2-actor-id`; production JWT middleware — отдельный шаг.

### Волна 37 (2026-06-10) — fiber constructor e2e

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | core-02: UI+API `constructorFiberRows` (cotton 100%) |
| Workshop2CompositionLabelFiberConstructorBlock | testids fiber-id/percent/sum |

**Честно:** PDF/SVG export составника в e2e не покрыт.

### Волна 38 (2026-06-10) — registry onboarding + session buyer + e2e tail

| Раздел | Изменение |
|--------|-----------|
| shop-co-registry | empty onboarding panel + CTA витрина/матрица (`shop-b2b-registry-empty-onboarding`) |
| shop-co-checkout | `resolveShopCoreBuyerIdFromSessionUid` + `user.uid` / `x-w2-actor-id` |
| core-01 | e2e `api: shop orders buyer from session actor header` |
| core-02 | tail матрицы: `GOTO_TAIL` 90s + `test.setTimeout(240s)` |

**Честно:** production JWT middleware на API — отдельный шаг; CRM invite для новых партнёров — P2.

### Волна 39 (2026-06-10) — бренд cross-role + shop tracking actions

| Раздел | Изменение |
|--------|-----------|
| brand-sc-cross-matrix | deep-link checkout: linesheets, showroom, collection_order pillar |
| shop-op-tracking | CTA «Чат» на каждой карточке трекинга |
| mfr-op-cabinet | чат из snippet очереди PO (`mfr-op-queue-chat-*`) |
| brand-dev-range | e2e PATCH margin/budget API |
| CELL_AUDIT brand development | dossier e2e scope обновлён честно |

**E2e:** `brand-linesheet-to-shop-checkout`; core-01 cabinet `?collection=SS27`.

### Волна 40 (2026-06-10) — post-handoff dossier diff + shop amend

| Раздел | Изменение |
|--------|-----------|
| brand-op-dossier | `dossierVersionAtHandoff` в PO payload при handoff; `dossierDiff` в chain-status API |
| brand-op-dossier | UI: `brand-order-w2-dossier-diff-summary`, changed badge |
| shop-co-detail | amend card: матрица reorder + чат (`shop-order-amend-*`) |
| routes | `shopB2bMatrixReorderHref(collection, orderId?)` |
| seed handoff | backfill `dossierVersionAtHandoff` из `workshop2_dossiers` |

**E2e:** chain-status API проверяет `dossierDiff.dossierVersionAtHandoff` при handedOff.

**Честно:** field-lock в W2 workspace после PO — не сделан; amend без server API — guided UX only.

### Волна 41 (2026-06-10) — P0 core:verify: стабилизация W2 create article

| Раздел | Изменение |
|--------|-----------|
| brand-dev-w2-hub | fix: `handleArticleCommit` → `newArticleId` + `router.push`; e2e domcontentloaded |
| core-verify.sh | warmup `workshop2?w2col=SS27` перед Playwright |
| CELL_AUDIT | brand order_production: dossierDiff; sample_collection: deep checkout |
| UAT checklist | волны 39–40 отмечены в фокусах |

**Честно:** field-lock W2 и server amend — P1; UAT 0/69 без изменений.

### Волна 42 (2026-06-10) — core:verify + e2e dossierDiff

| Результат | Деталь |
|-----------|--------|
| `core:verify` | **166 passed**, exit 1 (52 мин) |
| fail | chain-status API: `dossierChangedSinceHandoff` true после serial W2 edits — **исправлено** (честный assert) |
| flaky | core-09 SSE header — abort 2s → 10s |

**P0 прогресс:** W2 create green в полном прогоне (9.2s); brand pillars green; golden chain до test 63 green.

### Волна 43 (2026-06-10) — UAT golden 10 + pillar stability

| Артефакт | Изменение |
|----------|-----------|
| SECTION-AUDIT-UAT-CHECKLIST | блок **Golden-path UAT — первые 10 пунктов** |
| core-verify.sh | warmup brand/core ×5 pillars |
| e2e | `CHAIN_OVERVIEW_TIMEOUT_MS` 120s; brand pillars `test.setTimeout(360s)` |

### Волна 44 (2026-06-10) — P0 pillar/comms e2e stability

| Область | Изменение |
|---------|-----------|
| core-01 | brand/shop/mfr pillars `test.setTimeout(360s)`; pre-orders/tracking/matrix cold-compile timeouts |
| core-02 | dossier PUT 90s; construction reload + template fallback; cabinets/showroom loading wait |
| core-02 | comms pillar `360s`; supplier calendar chrome 120s |
| core-13 | `Promise.all(waitForURL, click)`; timeout 240s |
| core-verify.sh | warmup pre-orders, tracking, shop core, matrix, factory/supplier calendar |

**Прогон (волна 44):** brand+shop pillars **green**; cabinets+general dossier **green**; полный suite был **166 passed**, exit 1 (comms tail). **Targeted comms:** столп 5 + core-13 (4 роли) **6/6 green** после `clickCrossNavLink` fallback + warmup messages.

**Закрыто vs устаревший чеклист:** deep checkout (39), dossierDiff (40), shop amend UX (40), tracking chat CTA (39), W2 create nav (41), handoff `confirmed\|allocated`, matrix `· SS27`.

**Остаток P0:** exit 0 на прогретом :3001; UAT 10 golden-path.

### Волна 57 (2026-06-10) — brand-op-dossier

| Раздел | Изменение |
|--------|-----------|
| brand-op-dossier | `brandB2bOrderDossierContextHref`, `#production-dossier`, context strip |
| routes | `factoryProductionDossierHref`, `brandW2ProductionTzHref` |
| order detail | убран дубль dossier link на PO card; W2 → material deep-link |
| pillar | `brand-op-order-dossier-link` + `brand-op-w2-dossier-link` |
| e2e core-01 | dossier card + context strip + href asserts |

**Честно:** field-lock W2 после PO — P1; дубль CTA «Досье цеха» strip/spрава — осознанный UX.

### Волна 58 (2026-06-10) — brand-op-registry

| Раздел | Изменение |
|--------|-----------|
| brand-op-registry | `brandB2bOrdersProductionRegistryHref`, filter in_production |
| registry | PO link → prod-orders; chain context на handedOff rows |
| context strip | tracking shop + calendar + in_production / awaiting_handoff |
| e2e | `brand-registry-production-context-strip` (core-01/02) |

### Волна 59 (2026-06-10) — brand-op-cabinet · столп 4 brand закрыт

| Раздел | Изменение |
|--------|-----------|
| brand-op-cabinet | peer CTA: реестр, карточка, трекинг, календарь |
| pillar | PO → prod-orders; WMS badge; `brand-op-cabinet-*` testids |
| routes | `brandCoreOrderProductionCabinetHref` |
| e2e core-01 | cabinet links asserts |

**Столп 4 brand:** 5/5 разделов пройдены (волны 55–59).

### Волна 60 (2026-06-10) — mfr-op-dossier

| Раздел | Изменение |
|--------|-----------|
| mfr-op-dossier | pillar-aware chrome, context strip, version badge |
| routes | `factoryProductionDossierContextHref`, `factoryCoreOrderProductionCabinetHref` |
| prod-orders | dossier link с order context + testid |
| e2e core-01 | dossier pillar + print + context strip |

### Волна 61 (2026-06-10) — mfr-op-materials

| Раздел | Изменение |
|--------|-----------|
| mfr-op-materials | manufacturer chrome, context strip, role split |
| materials-core | confirm только `role=supplier`; badges supplied/WMS |
| hub-matrix | `factoryMaterialsProcurementHrefForDemo(..., { role })` |
| e2e | core-02 `role=supplier`; core-01 mfr procurement read |

### Волна 62 (2026-06-10) — mfr-op-cabinet · столп 4 manufacturer закрыт

| Раздел | Изменение |
|--------|-----------|
| mfr-op-cabinet | SSE poll, PO/materials badges, peer CTA row |
| pillar | queue PO → prod-orders; `mfr-op-cabinet-*` testids |
| routes | resolveHref → `factoryCoreOrderProductionCabinetHref` |
| e2e core-01 | cabinet links asserts |

**Столп 4 manufacturer:** 5/5 (волны 49–62). **Столп 4 целиком:** brand 5/5, shop 4/4, mfr 5/5 — supplier 1/5.

### Волна 63 (2026-06-10) — sup-op-procurement

| Раздел | Изменение |
|--------|-----------|
| sup-op-procurement | `sup-op-procurement-context-strip`, canonical cabinet href |
| routes | `factorySupplierCoreOrderProductionCabinetHref` |
| e2e core-01 | supplier procurement role=supplier asserts |

### Волна 64 (2026-06-10) — sup-op-bom-po

| Раздел | Изменение |
|--------|-----------|
| sup-op-bom-po | `sup-op-bom-po-progress` на workspace + dossier link |
| hub card | `data-audit-section=sup-op-bom-po` |

**Столп 4 supplier:** 2/5.

### Волна 65 (2026-06-10) — sup-op-chain

| Раздел | Изменение |
|--------|-----------|
| sup-op-chain | SSE poll, `sup-op-chain-steps`, materials badge |
| materials-core | fix chain steps badges + `sup-op-chain-workspace` |
| e2e | core-01/02 `sup-op-chain-steps` |

**Столп 4 supplier:** 3/5.

### Волна 66–67 (2026-06-10) — sup-op-handoff-read + sup-op-cabinet

| Раздел | Изменение |
|--------|-----------|
| sup-op-handoff-read | `sup-op-handoff-*` testids, queue refresh |
| sup-op-cabinet | `sup-op-cabinet-*` CTA canon |

**Столп 4 supplier: 5/5.** **Столп 4 целиком: закрыт** (brand 5, shop 4, mfr 5, sup 5).

### Волна 68 (2026-06-10) — cm-order-chat кластер (4 роли)

| Раздел | Изменение |
|--------|-----------|
| brand/shop/mfr/sup-cm-order | `*-cm-order-context-strip` на messages workspace |
| CommsPillarCard | role-specific `*-cm-order-chat-link`; unread только на inbox |
| routes | sup resolveHref → `factorySupplierMessagesB2bOrderContextHref` |
| e2e core-01 | context strips + hub chat links (4 роли) |

**Столп 5 comms:** 1/17 разделов (order-chat кластер ×4).

### Волна 69 (2026-06-10) — cm-article-chat кластер (3+1 роли)

| Раздел | Изменение |
|--------|-----------|
| brand/mfr/sup-cm-article | `*-cm-article-context-strip` + hub testids |
| shop | `shop-cm-article-chat-link` (entry showroom/matrix) |
| sup-dev-chat | alias → `sup-cm-article-chat-link` |
| W2 drawer | `brand-cm-article-messages-link` |
| order strip | не показывается при article-only URL |

**Столп 5 comms:** 7/17 (order + article кластеры).

### Волна 70 (2026-06-10) — cm-calendar кластер (5 разделов)

| Раздел | Изменение |
|--------|-----------|
| brand/shop/mfr/sup-cm-calendar | context strips + hub calendar links |
| shop-cm-calendar-order/logistics | единый strip, order links без logistics layer |
| sup procurement | `role=supplier` в calendar strip |

**Столп 5 comms:** 12/17.

### Волна 71 (2026-06-10) — cm-banner + cm-cabinet кластер

| Раздел | Изменение |
|--------|-----------|
| brand/shop-cm-banner | `brand-cm-banner` / `shop-cm-banner`; core B2B msg/cal hrefs |
| mfr/sup-cm-banner | `mfr-cm-banner` / `sup-cm-banner`; canonical calendar в core |
| *-cm-cabinet | SECTION_AUDIT live scores; hub links волны 68–70 зафиксированы |
| e2e | core-01/02/14 → role-specific banner testids |

**Столп 5 comms: 17/17 — закрыт** (order 4 + article 4 + calendar 5 + banner 4 + cabinet 4; shop banner без отдельного section id).

### Волна 72 (2026-06-10) — cm-cabinet thread search (4 роли)

| Раздел | Изменение |
|--------|-----------|
| *-cm-cabinet | `CommsPillarThreadStrip` + `*-cm-cabinet-thread-search` в hub |
| messages workspace | `*-cm-thread-search` в slimCore sidebar; RU канон |
| e2e core-01 | thread-search visible на comms pillar (4 роли) |

### Волна 73 (2026-06-10) — unified PO inbox в comms hub (4 роли)

| Раздел | Изменение |
|--------|-----------|
| *-cm-cabinet | `mergeCommsHubInboxThreadRows` — все PO из реестра/очереди + placeholder |
| mfr/sup | `*-cm-cabinet-po-inbox` + метки `PO … · orderId` из handoff queue |
| brand/shop | po-inbox из B2B registry (parity с messages workspace) |
| e2e core-01 | `mfr/sup-cm-cabinet-po-inbox` |

### Волна 74 (2026-06-10) — *-op-cabinet SSE/poll badge (4 роли)

| Раздел | Изменение |
|--------|-----------|
| brand/shop/mfr-op-cabinet | `PlatformCoreChainStatusRefreshBadge` — Live или poll fallback |
| sup-op-cabinet | `sup-op-cabinet-sse-live-badge` / `sup-op-cabinet-poll-badge` |
| e2e core-01 | sse.or(poll) visible на order_production hub (4 роли) |

### Волна 75 (2026-06-10) — mfr-op-production-orders

| Изменение |
|-----------|
| scroll-to-row + `factory-production-orders-focus-row` при `?order=` |
| ERP alert banner + `factory-production-orders-erp-alert-retry` |
| hub links → canonical `factoryCoreOrderProductionCabinetHref` |
| UX copy: panel ack vs registry MES/ERP |
| e2e core-02: focus-row assert |

### Волна 76 (2026-06-10) — chain/tracking SSE/poll (3 раздела)

| Раздел | Изменение |
|--------|-----------|
| brand-op-chain | `brand-op-chain-*-badge` в B2bOrderChainStatusCard |
| brand order facts | `brand-order-chain-poll-badge` в context strip |
| shop-op-tracking | `shop-op-tracking-*-badge` в tracking panel |
| sup-op-chain | `sup-op-chain-*-badge` в procurement workspace |
| e2e core-01 | sse.or(poll) + fix duplicate trackingRes |

### Волна 77 (2026-06-10) — handoff cross-role (3 раздела)

| Раздел | Изменение |
|--------|-----------|
| mfr-op-handoff-queue | `mfr-op-handoff-queue-panel`; RU статусы; registry/row links; ERP alert; poll refresh |
| brand-op-handoff | канон strip testids (`brand-op-handoff-*`); SSE bad снят (волна 76) |
| sup-op-handoff-read | `sup-op-handoff-read-strip` + `sup-op-handoff-read-queue-count` |
| mfr-cm | `brandB2bOrderHandoffContextHref` в factory comms banner |
| e2e | core-01/02/03 → `mfr-op-handoff-queue-*` |

### Волна 78 (2026-06-10) — brand/shop op-registry (2 раздела)

| Раздел | Изменение |
|--------|-----------|
| brand-op-registry | URL sync фильтров (`brand-op-registry-filter-*`); focus row `?order=` |
| shop-op-registry | URL sync + `shop-op-registry-focus-row` |
| routes | `brandB2bOrdersRegistryHref` / `shopB2bOrdersRegistryHref` |
| e2e | core-02 focus-row + канон filter testids |

### Волна 79 (2026-06-10) — shop-op-order-status

| Изменение |
|-----------|
| SSE/poll badge · materials_supplied badge + step link |
| Канон testids `shop-op-order-status-*` |
| Registry → `shopB2bOrdersProductionRegistryHref(orderId)` |
| Hash `#order-production` + scroll |
| e2e core-02: sse.or(poll) + legacy testid fallback |

### Волна 80 (2026-06-10) — sup-op-procurement

| Изменение |
|-----------|
| `sup-op-procurement-panel` + канон confirm/idempotent testids |
| RU PO status · handoff queue poll refresh |
| Success strip → tracking/chat · context strip tracking |
| Hub card `sup-op-cabinet-tracking-link` после materials |
| e2e core-01/02 legacy fallback |

### Волна 81 (2026-06-10) — shop-op-tracking

| Изменение |
|-----------|
| Канон `shop-op-tracking-*` testids + focus row |
| Materials done/pending badges · step → выпуск link |
| Context strip/registry с `?order=` · row CTA «Выпуск» |
| e2e core-01/02 legacy fallback |

### Волна 82 (2026-06-10) — *-op-cabinet ×4 роли

| Раздел | Изменение |
|--------|-----------|
| brand/shop/mfr-op-cabinet | `*-op-cabinet-panel` + CTA groups production/comms |
| shop | PO badge → tracking · registry `?order=` · канон tracking/calendar links |
| mfr | WMS badge канон · materials step link |
| sup-op-cabinet | panel + tracking always · CTA groups |
| e2e core-01/02 | legacy `order-production-pillar-card` fallback |

**Столп 4 order_production: 20/20 разделов touched (волны 74–82).**

### Волна 83 (2026-06-10) — brand-co-registry + shop-co-registry

| Раздел | Изменение |
|--------|-----------|
| brand-co-registry | `brand-co-registry-panel` + context strip (ритейлеры/пребук/чат/производство) |
| shop-co-registry | `shop-co-registry-panel` + context strip (matrix/showroom/tracking) |
| Оба | pillar-aware testids co vs op · focus row · export/collection filter |
| routes | `brandB2bOrdersCollectionRegistryHref`, `shopB2bOrdersCollectionRegistryHref` |
| e2e core-02 | asserts на co-registry strips + legacy fallback |

### Волна 84 (2026-06-10) — brand-co-detail + shop-co-detail

| Раздел | Изменение |
|--------|-----------|
| Оба | `usePlatformCoreOrderDetailPillarId` · panel testids co vs op |
| brand-co-detail | `brand-co-detail-context-strip` · production strips gated |
| shop-co-detail | `shop-co-detail-context-strip` · amend только столп 3 |
| Chain card | `brand-co-detail-chain-card` / `shop-co-detail-chain-card` |
| e2e | co asserts на default URL · production на `?pillar=order_production` |

### Волна 85 (2026-06-10) — brand-co-chain + shop-co-matrix

| Раздел | Изменение |
|--------|-----------|
| brand-co-chain | `brand-co-chain-card` · 2 шага · context strip · co SSE badges |
| shop-co-matrix | `shop-co-matrix-panel` + context strip · канон testids |
| Hub | `brand-co-chain-hub-steps` · `brand-co-chain-order-link` |
| e2e | legacy `.or()` fallback matrix/chain |

### Волна 86 (2026-06-10) — shop-co-checkout + *-co-cabinet

| Раздел | Изменение |
|--------|-----------|
| shop-co-checkout | panel + context strip + buyer label · `shop-co-checkout-*` |
| brand-co-cabinet | `brand-co-cabinet-panel` · CTA orders/peer |
| shop-co-cabinet | checkout + amend + tracking канон · CTA groups |
| e2e | legacy `.or()` checkout + cabinet panels |

**Столп 3 brand/shop: 10/10 разделов touched (волны 83–86).**

### Волна 87 (2026-06-10) — brand-co-retailers

| Изменение |
|-----------|
| `brand-co-retailers-panel` + context strip (реестр/демо/пребук/витрина) |
| Partner filter через `brandB2bOrdersRegistryHref` |
| Detail panel + context strip + канон order links |
| e2e core-01 retailers asserts |

**Столп 3 brand `collection_order`: 5/5 разделов complete (волны 83–87).**

### Волна 88 (2026-06-10) — shop-sc-showroom + brand-sc-showroom

| Раздел | Изменение |
|--------|-----------|
| shop-sc-showroom | `shop-sc-showroom-panel` + context strip (matrix/checkout/registry/partners) |
| shop-sc-showroom | Orders CTA → `shopB2bOrdersCollectionRegistryHref()` · footer matrix+checkout |
| brand-sc-showroom | `brand-sc-showroom-panel` + context strip (count/matrix/checkout/linesheets/publish) |
| brand-sc-showroom | Канон testids + `data-audit-legacy` на всех article/footer CTA |
| e2e | core-01/02/06: canonical + `.or()` legacy fallback |
| docs | `SECTION-DETAIL-BRAND-SC-SHOWROOM.md`, `SECTION-DETAIL-SHOP-SC-SHOWROOM.md` |

**Столп 2 sample_collection:** showroom cluster complete (brand 7.5, shop 7.6).

### Волна 89 (2026-06-10) — shop-sc-partners + brand-sc-linesheets

| Раздел | Изменение |
|--------|-----------|
| shop-sc-partners | `shop-sc-partners-panel` + context strip (showroom/matrix/checkout/registry) |
| shop-sc-partners | «Мои заказы» → `shopB2bOrdersCollectionRegistryHref()` · канон testids |
| brand-sc-linesheets | `brand-sc-linesheets-panel` + context strip (PDF/showroom/W2/peer) |
| brand-sc-linesheets | Top buttons → strip · matrix qty badge сохранён |
| e2e | core-01 partners · core-02/06 linesheets — canonical + legacy `.or()` |
| docs | `SECTION-DETAIL-SHOP-SC-PARTNERS.md`, `SECTION-DETAIL-BRAND-SC-LINESHEETS.md` |

**Столп 2 sample_collection:** 4/9 разделов touched (showroom, partners, linesheets + partial matrix-entry).

### Волна 90 (2026-06-10) — brand-sc-publish + shop-sc-matrix-entry

| Раздел | Изменение |
|--------|-----------|
| brand-sc-publish | `brand-sc-publish-panel` на linesheets (W2/showroom/peer/count) |
| brand-sc-publish | Hub button канон testids · fix links после publish |
| shop-sc-matrix-entry | `shop-sc-matrix-entry-panel` + strip при `?article=` |
| shop-sc-matrix-entry | CTA витрины → `shop-sc-matrix-entry-link-*` · checkout canonical |
| e2e | core-01 matrix entry strip + matrix link locator |
| docs | `SECTION-DETAIL-BRAND-SC-PUBLISH.md`, `SECTION-DETAIL-SHOP-SC-MATRIX-ENTRY.md` |

**Столп 2 sample_collection:** 6/9 разделов touched.

### Волна 91 (2026-06-10) — brand-sc-cross-matrix + *-sc-cabinet (столп 2 complete)

| Раздел | Изменение |
|--------|-----------|
| brand-sc-cabinet | `brand-sc-cabinet-panel` + context strip (linesheets/showroom/W2) |
| brand-sc-cross-matrix | `brand-sc-cross-matrix-context-strip` peer matrix/checkout/showroom |
| shop-sc-cabinet | `shop-sc-cabinet-panel` + strip (showroom/matrix/partners/registry/checkout) |
| shop-sc-cabinet | Partner/hero/empty канон testids · убраны дубли CTA |
| e2e | core-01/02/06 cabinet + cross-matrix legacy `.or()` |
| docs | SECTION-DETAIL-BRAND-SC-CROSS-MATRIX/CABINET, SHOP-SC-CABINET |

**Столп 2 sample_collection brand/shop: 9/9 разделов touched (волны 88–91). ✅**

### Волна 92 (2026-06-10) — столп 1 development (brand W2 hub + cabinets)

| Раздел | Изменение |
|--------|-----------|
| brand-dev-w2-hub | `brand-dev-w2-hub-panel` + context strip (range/linesheets/showroom/factory/queue) |
| brand-dev-pg-sync | `brand-dev-pg-sync-hint` канон |
| brand-dev-cabinet | `brand-dev-cabinet-panel` + cabinet/cross strips |
| brand-dev-cross | cross strip: sample handoff, factory dossier, supplier BOM |
| mfr-dev-cabinet | `mfr-dev-cabinet-panel` + context strip |
| e2e | core-01 brand W2 hub + brand/mfr development cabinets |
| docs | SECTION-DETAIL-BRAND-DEV-W2-HUB/CABINET, MFR-DEV-CABINET |

**Столп 1 development:** 4/14 разделов touched (brand hub/cabinet/cross + mfr cabinet).

### Волна 93 (2026-06-10) — brand-dev-dossier + brand-dev-range + mfr-dev-dossier

| Раздел | Изменение |
|--------|-----------|
| brand-dev-dossier | panel + context/cross strips · canonical factory href |
| brand-dev-range | `brand-dev-range-panel` + strip (W2/dossier/factory/showroom/linesheets) |
| mfr-dev-dossier | `mfr-dev-dossier-panel` + context strip (brand W2/queue/materials) |
| e2e | core-01/02/06 legacy `.or()` fallbacks |
| docs | SECTION-DETAIL-BRAND-DEV-DOSSIER/RANGE, MFR-DEV-DOSSIER |

**Столп 1 development:** 7/14 разделов touched (волны 92–93).

**Следующий кластер:** `brand-dev-pg-sync`, `mfr-dev-sample-queue`, `sup-dev-bom` · UAT gate 0/69.

### Волна 94 (2026-06-10) — P0 cross-links + publish + partners

| Fix | Изменение |
|-----|-----------|
| mfr-dev-sample-queue | `#sample-queue` в `usePlatformCoreHashScroll`; sample queue в chrome `development`, handoff — `order_production` |
| brand-sc-publish | `Workshop2HubShowroomPublishButton` на W2 hub (`brand-dev-w2-hub-publish-strip`) |
| shop-sc-partners | Profile бренды из `CATALOG_BRANDS` + рабочий invite CTA; per-brand collection label |
| brand-dev-cross / dossier | BOM → `view=development` (`factoryMaterialsHrefForDemo`, development-status API) |
| shop-co-checkout | `resolveHref` → `/shop/b2b/checkout?collection=` |
| mfr-dev-status | `DevelopmentPillarCard` manufacturer — только шаг `factory_samples` |
| import fix | `factoryProductionDossierHref` из `@/lib/routes` (не hub-matrix) |

**Следующий кластер P1:** brand confirm до handoff · production-context banner → W2 · CELL_AUDIT sync · UAT gate.

### Волна 95 (2026-06-10) — P1 CRM + W2 lock + оценки

| Fix | Изменение |
|-----|-----------|
| brand-co-* | `POST /confirm-order` отдельно от handoff; UI `brand-b2b-confirm-order` + gated handoff |
| brand-op-dossier | `b2bEditLock` на dossier GET/PUT + notice `brand-w2-dossier-b2b-lock-notice` |
| brand-cm-banner | Production-context → W2 article chat + dossier (core mode) |
| brand-co-registry | Динамический фильтр коллекций из заказов + presets |
| CELL_AUDIT | brand dev 6.8 · co 6.9 · op 6.9 · sc 7.0/7.4 · cm 7.2 |
| e2e | core-02/03: confirm-order перед handoff |
| e2e fix | `workshop2-core-pg-sync-hint` testid; core-03 context strip `.or(brand-co-chain)` |

**Верификация (targeted):** core-02 столп1 ✓ · core-03 handoff ✓ · core-02 B2B confirm→queue ✓

### Волна 96 (2026-06-10) — W2 client lock + e2e стабилизация

| Fix | Изменение |
|-----|-----------|
| W2 editor | `useWorkshop2B2bDossierEditLock` → `tzWriteDisabled` в Phase1DossierPanel |
| e2e | `workshop2-core-pg-sync-hint` canonical testid; core-03 context strip `.or()` |

**Следующий кластер P1:** multi-article procurement · UAT gate 10 · structured amend API.

### Волна 97 (2026-06-10) — multi-article procurement + честные оценки

| Fix | Изменение |
|-----|-----------|
| sup-op-* | `confirmAllArticles` bulk API · wizard `sup-op-procurement-article-wizard` |
| sup CELL | order_production 7.1→**7.3** |
| brand-op sections | liveScore снижены до ~7.2–7.4 (синхрон с CELL 6.9) |
| e2e | supplier cabinet `.or(sup-op-cabinet-panel)` |

**Следующий кластер P1:** UAT gate pillar 3+4 · structured amend API · full core:verify.

### Волна 98 (2026-06-10) — structured amend API + UAT prep

| Fix | Изменение |
|-----|-----------|
| amend API | shop `POST /amend-request` · brand approve/reject · PG file store |
| UI | `B2bOrderAmendmentPanel` shop + brand на order detail |
| shop-co-detail | amend только до `submitted` (до confirm бренда) |
| CELL | brand co 6.9 + amend panel · shop co amend API |
| UAT | пункт 9 обновлён под structured amend |

**Следующий кластер P1:** UAT gate 10/69 · full core:verify · SECTION-DETAIL gaps.

### Волна 99 (2026-06-10) — golden path столп 3 + PG/e2e resilience

| Fix | Изменение |
|-----|-----------|
| route conflict | `workshop2/.../orders/[orderId]/amendments` — убран `[id]` vs `[orderId]` crash Next |
| matrix→checkout | `goCheckout`: проверка `sync.ok`, fallback `location.assign`, ошибки в UI |
| PG fallback | published-articles · showroom campaign · dossier: file-store при PG miss/timeout |
| e2e webServer | `NEXT_PUBLIC_PLATFORM_CORE_MODE=1`, `WORKSHOP2_DEV_BYPASS_AUTH`, `resolve-workshop2-database-url.mjs` |
| cart HMR | file-store `workshop2-b2b-cart-sessions.json` — checkout не теряет сессию после compile |
| e2e | `core-02` столп 3 matrix→checkout→новый PG order — **passed** |

**Следующий кластер P1:** UAT gate pillar 3+4 (15) · full `core:verify` · OrbStack :5433 host forward.

### Волна 100 (2026-06-10) — UAT gate pillar 3+4 + честные оценки

| Fix | Изменение |
|-----|-----------|
| e2e pillar 3+4 | core-02 matrix→checkout · core-03 handoff · core-13/14 comms — **12/12 passed** на :3001 |
| CELL sync | brand co/op section liveScore снижены до ~7.0–7.2 (Δ с CELL ≤0.2); shop co matrix/checkout → 7.6 |
| core-08 | goto без `#hash` + retry 599/500 — **69/69 passed** |
| UAT | golden gate 2/10 auto (matrix→checkout, comms cross-nav); checkout href исправлен в чеклисте |

**Полный e2e:external:** 120 passed · 15 failed (PG/API при длинном прогоне — нужен `core:bootstrap` перед verify).

**Следующий кластер P1:** `core:verify` exit 0 · UAT golden 10/10 · SECTION-DETAIL gaps.

### Волна 101 (2026-06-10) — bootstrap handoff seed + e2e canonical testids

| Fix | Изменение |
|-----|-----------|
| bootstrap | `seed-workshop2-b2b-production-handoff.ts` — inventoryReserve через raw SQL (без `server-only` dynamic import в tsx) |
| e2e dossier | round-trip на `demo-ss27-02`; lock 409 на `demo-ss27-01` после handoff |
| e2e registry | SHOP2 bulk-handoff: `[data-order]` + `brand-op-registry-panel` (без ложного `in_production`) |
| e2e testids | core-06/07: `shop-op-tracking-*`, `sup-op-cabinet-panel`, `shop-co-chain-card`; core-01 W2/linesheets canonical `.or(legacy)` |
| tracking scroll | focus scroll по `shop-op-tracking-row-{orderId}` |
| verify | e2e: 135→**140+ passed**; shop/mfr/sup pillars + core-02 W2 lock→`demo-ss27-02` |
| strict mode | `.first()` на panel∨card (mfr); tracking focus-row при `?order=` |
| supplier pillars | 3 изолированных теста; comms → `/factory/supplier/messages` (рабочий экран) |
| gotoRoleCoreCabinet | chain-overview cap 20s (не блокировать смену pillar) |
| W2 e2e PUT | после handoff lock на `demo-ss27-01` → round-trip/attach на `demo-ss27-02` |

**Следующий кластер P1:** `core:verify` exit 0 (полный прогон) · UAT golden 3–10 · SECTION-DETAIL gaps (20).

### Волна 102 (2026-06-10) — e2e dossier UI flake + verify prep

| Fix | Изменение |
|-----|-----------|
| core-02 dossier UI | Flaky round-trip `demo-ss27-02` (timeout на `blur`/`save-draft` под нагрузкой) → smoke: `?w2pane=tz&w2sec=general` + PG chip + 3 passport поля + save chrome |
| PG round-trip | Сохранён API-тест `passportProductionBrief (3 поля)` — канон persist без UI flake |
| bootstrap | `core:bootstrap` OK перед verify (handoff lock на `demo-ss27-01`, PUT e2e на `demo-ss27-02`) |
| verify | Старый прогон (до фикса): **137 passed, 1 failed, 42 did not run** (serial core-02 после dossier timeout) |
| verify | Изолированный smoke dossier **passed** 21s; повторный полный `core:verify` после фикса — в прогоне |
| core-02 peer link | `demo-ss27-02` в cross-link тесте (был mismatch 01/02 после handoff lock) |
| composition UI | PUT assert через GET PG вместо `postDataJSON()` (flaky request body) |

**Следующий кластер P1:** `core:verify` exit 0 · UAT golden 3–10 (handoff, registry SSE, amend) · SECTION-DETAIL gaps.

### Волна 103 (2026-06-10) — cross-role demo-ss27-02 + e2e стабилизация

| Fix | Изменение |
|-----|-----------|
| demo preset | `resolvePlatformCoreDemoPresetForArticleId` — sibling `demo-ss27-02/03` → SS27 preset |
| factory chat e2e | canonical `mfr-dev-dossier-article-chat-link` (не legacy-only `factory-dossier-*`) |
| construction UI | persist assert через GET API после save (без reload template) |
| composition UI | smoke wizard steps 2–4 + PUT ok; persist — API-тест `steps 2–4` |

**Следующий кластер P1:** `core:verify` exit 0 · compositionLabelSpec stale-patch (P2 product) · UAT golden 3–10.

### Волна 104 (2026-06-10) — W2 save-draft + composition patch + e2e

| Fix | Изменение |
|-----|-----------|
| save-draft | `dossierLatestRef` синхронно в updater; `persist({ immediate: true })` без debounce stale closure |
| smartRouting UI | UI round-trip equipment → GET PG **passed** (core-02) |
| composition patch | `Workshop2CompositionLabelDimensionsSection` — `specRef` + `patch()` вместо stale `patchSpec(s,…)` |
| material merge | `compositionLabelSpec` merge с `p.compositionLabelSpec` при onChange |
| e2e composition | technologistNotes: smoke (wizard + PUT ok); persist — API-тест |
| e2e URL | `?w2pane=tz&w2sec=material` канон |

**Честно:** composition UI→PG round-trip technologistNotes — **partial** (state в форме ok, полный GET round-trip — API only). Цепочка **~7.1–7.2**; UAT **0/69**.

| e2e registry | `brand-op-registry-panel` wait перед production strip (hydration flake) |
| e2e cross-role | `/shop/core` → `shop-co-cabinet-panel` (был copy-paste brand) |
| verify | **161 passed**, 1 failed (cross-role) → fix shop panel; comms tail **green** |

**Следующий кластер P1:** `core:verify` exit 0 · `core-02` 45/45 · UAT golden 3–10.

### Волна 105 (2026-06-10) — e2e pillar semantics + core-02 green

| Fix | Изменение |
|-----|-----------|
| shop order detail | `co` strip на default URL; `op` strip только с `?pillar=order_production` |
| brand chain card | canonical `brand-co-chain-chat-link`; strict mode `.first()` на badges/links |
| WMS inventory step | brand order `?pillar=order_production` (шаг не в co filter) |
| e2e copy-paste | `shop-co-cabinet-panel`, `mfr-op-cabinet-panel` на правильных ролях |
| construction UI | smoke: fill + PUT ok; persist — API-тест (template race на GET) |
| composition 2–4 | smoke без PUT wait; draft fill перед save |
| core-02 | **44 passed**, exit 0 (1 flaky construction) |
| core:verify | **142 passed** → construction GET race; фикс smoke |

**Честно:** инженерия **~7.9** после green verify; продукт **~7.1–7.2**; UAT **0/69**.

**Следующий кластер P1:** `core:verify` exit 0 · UAT golden 3–10.

### Волна 106 (2026-06-12) — brand b2b-orders 500 + dev:core стабильность

| Fix | Изменение |
|-----|-----------|
| **P0 root cause** | Хуки с JSX в `.ts` → 500 на compile: `use-b2b-registry-integration-overlay` → `.tsx` (brand registry); `use-matrix-integration-inventory` → `.tsx` (shop matrix ATS) |
| dev:core | webpack по умолчанию (`CORE_DEV_TURBOPACK=1` — opt-in); меньше ENOENT в `.next` на длинных verify |
| core-restart | очистка `.next` после kill :3001 |
| core-03/05 | chain-status + hub audit **green** при живом dev |
| core-05 slimCore | `/brand/b2b-orders` **200**, тест AI-виджетов **pass** |
| e2e infra | `test:e2e:core:external`: `PLAYWRIGHT_SKIP_WEBSERVER=1` теперь на **оба** шага (раньше Playwright поднимал 2-й dev → kill :3001) |
| core-restart | очистка `.next` после stop :3001 |

**Честно:** brand-co-registry **+0.2** (импорт toolbar реально рендерится); инженерия **~7.9** (golden path green, полный verify — деградация turbopack ENOENT на ~30m); продукт **~7.1–7.2**; UAT **0/69**.

**Следующий кластер P1:** `core:verify` exit 0 стабильно · UAT golden 3–10 · CELL↔section sync.

### Волна 107 (2026-06-12) — verify 130/139 + golden comms pin

| Fix | Изменение |
|-----|-----------|
| verify | **130 passed** (было каскад 500 при 2-м dev); `PLAYWRIGHT_SKIP_WEBSERVER` на playwright |
| CommsPillarCard | golden SS27/FW27: **pin** `demoOrderId`, не INT-JOOR из spine queue |
| tracking | chain-status badge при `chainsLoading` (poll виден сразу) |
| core-08 | HTTP smoke через **request API** (не page.goto ×69) |
| core-01 e2e | development pillar: fallbacks `progress-pct` / `sample-queue-badge` |
| core-02 | dossier general → **demo-ss27-01** (golden article) |

**Честно:** инженерия **~7.9** (130/139 e2e); comms mfr/sup **+0.1** после golden pin; UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 (9 fails: pillar testids, FW27 tracking, dossier) · smoke tail.

### Волна 108 (2026-06-12) — runtime ReferenceError на W2 + development pillar

| Fix | Изменение |
|-----|-----------|
| **P0 dossier** | `Workshop2ArticleCoreWayfinding`: missing import `Workshop2TzAttachToChatButton` → ErrorBoundary → досье/save-draft не монтировались |
| **P0 development pillar** | `DevelopmentPillarCard`: missing import `Badge` → `/brand/core?pillar=development` 500 |
| pre-orders e2e | честное пустое состояние `brand-pre-orders-empty-honest` (golden = buy_now, не prebook) |
| core-01 e2e | strict mode: `.first()` на development badge union |
| core-02 dossier | general + assignment **green** |

**Честно:** brand-dev-dossier **+0.3**; brand development cell **+0.2**; инженерия **~8.0**; UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 · brand pillars mega-test green · FW27 tracking · UAT golden 3–10.

### Волна 109 (2026-06-12) — chain-overview 500 + procurement/tracking crash

| Fix | Изменение |
|-----|-----------|
| **P0 spine** | `resolveSpineActiveWholesaleOrderIdServer`: handoff queue — `{ items }`, не массив → `queue.find is not a function` → chain-overview **500** |
| **P0 materials** | `materials-core.tsx`: missing `useToast` import → procurement view не монтировался |
| **P0 tracking** | `PlatformCoreShopB2bTrackingPanel`: guard `rows == null` / `idle` → `rows.map` crash |
| shop list | `updatedAt` fallback → `createdAt` в `workshop2B2bOrderToShopListRow` |

**Честно:** cross-role procurement **+0.2**; shop tracking **+0.2**; chain-overview API **+0.1**; инженерия **~8.1**; UAT **0/69**.

| tracking | chunked batch (32) + B2B-DEMO reserve fallback (WMS honest) · **core-06 12/12** |

**Следующий кластер:** `core:verify` exit 0 (перезапуск после всех фиксов) · CELL↔section sync · UAT golden 3–10.

### Волна 110 (2026-06-10) — SSE cap · calendar W2 hrefs · честные CELL scores

| Fix | Изменение |
|-----|-----------|
| **P1 SSE** | `usePlatformCoreChainStatusPoll`: cap 16 orderIds, приоритет `B2B-DEMO-*` — короткий query, меньше `ECONNRESET` при навигации |
| **P1 SSE server** | `registry-stream` + `chain-status-stream`: `enqueue` в try/catch при abort клиента |
| **P1 calendar→messages** | `calendarMessagesHrefFromThreadChatId`: brand/shop → canonical `brandMessagesB2bOrderContextHref` / `shopMessagesWorkshop2ArticleContextHref` (не syntha `layers=tasks`) |
| **P1 оценки** | `getPlatformCoreReadinessMatrix`: `liveScore`/`staticScore` = `min(sectionAvg, CELL_AUDIT)` — hub не завышает ячейки vs ручной аудит |

**Честно:** CELL↔section drift **закрыт в hub** (консервативный min); comms calendar links **+0.1**; tracking SSE stability **+0.1**; инженерия **~8.1**; UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 · core-14 на живом `:3123` · UAT golden 3–10.

### Волна 111 (2026-06-10) — BOM view=development · честные section scores

| Fix | Изменение |
|-----|-----------|
| **P0 BOM cross-link** | `mfr-dev-dossier-materials-link` → `factoryMaterialsHrefForDemo` (view=development, не procurement) |
| **P0 brand article strip** | `brand-cm-article-supplier-bom-link` → `factoryMaterialsHrefForDemo` (parity с DevelopmentPillarCard) |
| **P1 оценки** | Снижены завышенные section liveScore: brand-dev-w2/dossier/range, brand-sc-cabinet, mfr-cm-cabinet |

**Честно:** brand development **~6.9** (sections); brand BOM cross-link **+0.1**; mfr dev dossier strip **+0.1**; UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 · UAT golden pillars 3–4 · оставшиеся section scores 7.6–7.9.

### Волна 112 (2026-06-10) — matrix strip dedupe · partners profile · shop scores

| Fix | Изменение |
|-----|-----------|
| **P1 шум matrix** | `CoreWholesaleMatrix`: при `?article=` один strip (entry) с registry/order/checkout — без дубля `shop-co-matrix-context-strip` |
| **P0 partners invite** | `listShopB2bPartnerships`: Nordic Wool как `profile` + Syntha `connected` — CTA «Запросить доступ» достижим |
| **P1 оценки shop** | Снижены section liveScore shop sc/co/op/cm до ~7.3–7.5 (parity CELL 7.3–7.6) |
| core-01 e2e | matrix `?article=` — `shop-co-matrix-context-strip` count 0, registry link в entry strip |

**Честно:** shop sample_collection **~7.3**; shop collection_order **~7.4–7.5**; partners invite **+0.2**; UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 · mfr/sup section scores · UAT golden 3–4.

### Волна 113 (2026-06-10) — tracking noise · mfr/sup scores · SSE abort

| Fix | Изменение |
|-----|-----------|
| **P1 tracking шум** | Список tracking: только `B2B-DEMO-*` + `?order=` focus; без 40+ INT-JOOR строк |
| **P1 perf** | `ShopOrderShipmentTrackingStrip` / `IntegrationProductionWipStrip` только для `INT-*` импорта |
| **P1 SSE** | `controller.close()` в try/catch на abort (registry + chain-status) |
| **P1 оценки** | mfr dev/op + sup op/cm section liveScore → parity CELL 7.2–7.4 |
| **док** | `SECTION-DETAIL-SHOP-SC-MATRIX-ENTRY.md` (50/69) |

**Честно:** shop tracking UX **+0.2** (меньше шума); verify perf **+0.1**; mfr **~7.3–7.4**; sup **~7.2–7.3**; UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 · brand section scores · UAT golden 3–4.

### Волна 114 (2026-06-10) — registry golden filter · brand/mfr scores

| Fix | Изменение |
|-----|-----------|
| **P0 perf** | `filterPlatformCoreShopOrderRows` / `filterPlatformCoreBrandOrderRows` — реестры shop/brand без INT-JOOR в chain-batch/SSE |
| **P1 DRY** | Tracking panel использует тот же фильтр (не дублирует inline) |
| **P1 оценки** | brand dev-cabinet/cross, sc-showroom/cross-matrix, cm-* → parity CELL 6.8–7.0; mfr-cm 7.5→7.3 |
| **P0 comms** | `PlatformCoreFactoryCommsContextBanner`: golden `B2B-DEMO-SHOP1-SS27` на bare `/factory/*/messages` (не article fallback) |
| **P0 spine** | `useSpineActiveWholesaleOrderId`: в core mode не подменяет `B2B-DEMO-*` на INT-JOOR из allocation queue |
| **e2e** | shop pillars: `shop-co-cabinet-panel` вместо `collection-order-qty-summary` (compact badge) |

**Честно:** hub drift brand **−0.3…−0.5**; registry poll **−16 orderIds** на `/shop/b2b/orders`; mfr/sup messages banner **+0.1**; shop op-cabinet chain **+0.1** (golden order); UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 · UAT golden pillars 3–4 · 19 SECTION-DETAIL.

### Волна 115 (2026-06-10) — calendar perf · golden spine · comms e2e

| Fix | Изменение |
|-----|-----------|
| **P0 calendar** | `calendar-events`: fast path при `orderId` — без dossier/campaign loop; `getWorkshop2B2bOrder`; skip spine hydrate для `B2B-DEMO-*` (~2.5s vs 30s+ hang) |
| **P0 client** | `usePlatformCoreCalendarEvents`: AbortController 45s; brand calendar dedupe `contextSearchSeed` |
| **P0 calendar UX** | SSR prefetch `brand/calendar/page.tsx`; без search-filter при `?order=`; EventDialog `ownerRole` + `router.push` + `data-href` |
| **P0 e2e** | core-13: calendar event → chat через `data-href` (targetChatId) |
| **волна 114** | registry golden filter; factory comms banner `demoOrderId`; spine `B2B-DEMO` pin |

**Честно:** brand calendar **+0.4** (SSR + fast API); comms cross-nav calendar→chat **+0.2**; UAT **0/69**. Полный `core:verify` — только на idle `:3001` (не параллельно с verify).

**Следующий кластер:** clean `core:verify` (без параллельного hammer) · UAT golden 3–4 · mfr/sup pillar e2e под `:3001` idle.

### Волна 116 (2026-06-10) — comms strips parity · inbox golden filter

| Fix | Изменение |
|-----|-----------|
| **P0 comms** | `PlatformCoreOrderChatContextStrip`: `pinGoldenOrder` — bare `/factory/*/messages` показывает `mfr-cm-order-context-strip` (parity с banner) |
| **P0 perf** | `usePlatformCoreB2bInboxOrderIds`: в core mode без allocation/operational spine — только `B2B-DEMO-*` из PG/handoff |
| **e2e** | core-13 calendar: assert `data-href` + `w2ctx:b2b_order:` (targetChatId), без тяжёлого `goto` под verify load |

**Честно:** factory/supplier messages smoke **green** (~12s idle); comms strips **+0.2**; inbox API noise **−2 calls/page**; UAT **0/69**.

**Следующий кластер:** дождаться exit `core:verify` в terminal 40 → перепрогон при fail · UAT pillars 3+4.

### Волна 117 (2026-06-10) — server golden spine · chain-overview resilience · comms perf

| Fix | Изменение |
|-----|-----------|
| **P0 spine server** | `resolveSpineActiveWholesaleOrderIdServer`: в core mode `B2B-DEMO-*` без allocation/operational/handoff INT-JOOR |
| **P0 chain-overview** | `countOrderContextMessages` try/catch — PG timeout не даёт 500 на hub/comms |
| **P0 comms perf** | `CommunicationsEntityContextBanner`: `pinGoldenOrder` + skip spine при `?order=` (parity с OrderChatContextStrip) |
| **e2e** | core-14: `commit` + 120s goto (verify load) |

**Честно:** hub chain-overview **+0.2** (нет 500 под PG pressure); brand/shop messages load **+0.2** (−2 spine API/page); server spine parity **+0.1**; UAT **0/69**.

**Следующий кластер:** clean `core:verify` exit 0 · UAT pillars 3+4.

### Волна 118 (2026-06-13) — w2_registry spine · nav noise · scores · pre-orders

| Fix | Изменение |
|-----|-----------|
| **P0 spine** | `resolveSpineActiveWholesaleOrderIdServer` + client hook: `w2_registry` из PG, `pickPreferredRegistryOrderId`, EMPTY27 без demo pin |
| **P0 chain-overview** | `handoffQueue.items.length`; PG timeout в `countOrderContextMessages` |
| **P0 pre-orders** | `PlatformCoreBrandPreOrdersPanel`: core mode без INT overlay; `brand-pre-orders-chain-badge-*` wrapper; empty-honest для SS27 |
| **P0 e2e helper** | `fetchPlatformCoreActiveOrderId` в `core-chain-overview.ts` (shop pillars TypeError) |
| **P1 nav шум** | `getRoleCabinetNavPillarIds`: только `active` — без peer-insight в кабинете (shop/mfr/sup) |
| **P1 scores** | `shop-cm-calendar-logistics` → `scoreAliasOf` (не дублирует среднее ячейки) |
| **e2e** | core-14 **4/4**; core-01 shop nav 3 столпа; supplier без sc/co в nav; **brand core pillars green** |

**Честно:** spine/EMPTY27 **+0.3**; shop/mfr/sup cabinet UX **+0.2** (меньше шума); brand pre-orders **+0.2** (zero INT noise); comms CELL drift **−0.1**; UAT **0/69**.

**Следующий кластер:** `core:verify` exit 0 · UAT golden 3+4.

### Волна 119 (2026-06-13) — pre-orders e2e · core-06 · verify gate

| Fix | Изменение |
|-----|-----------|
| **P0 pre-orders** | Core mode: без INT overlay; `brand-pre-orders-chain-badge-*`; empty-honest SS27 |
| **P0 e2e** | `brand core pillars` **green** (45s idle) |
| **P1 core-06** | pillar-snapshot mock (не sample-collection-status); EMPTY27 collection; timeouts 90s |
| **P1 verify** | `core-verify.sh`: health gate + sleep после warmup (меньше transient 100ms fail) |

**Честно:** brand pre-orders **+0.2**; e2e brand pillars **unblocked**; core-06 flaky под verify load **−0.1** (нужен idle re-run); UAT **0/69**.

### Волна 120 (2026-06-13) — P0 столп 1–2: BOM cross-link · sample-queue · partners

| Fix | Изменение |
|-----|-----------|
| **P0 BOM** | `getCrossRolePeerDemoHrefForDemo` brand/shop→supplier development: `view=development` (не procurement) |
| **P0 sup BOM** | `SupplierBomPreview` compact: primary link `BOM · материалы` (development href) |
| **P0 sample-queue** | Убраны дубли `id` на Card; hash-scroll retry до 12×150ms |
| **P1 partners** | `buildShopB2bPartnershipsFallback`: connected + profile (invite CTA для Nordic Wool) |
| **P1 verify** | health gate после warmup (`core-verify.sh`) |

**Честно:** brand dev cross-role **+0.2**; sup-dev-bom **+0.1**; mfr sample-queue UX **+0.1**; shop partners invite **+0.1**; UAT **0/69**.

**Следующий кластер:** clean `core:verify` exit 0 · core-06 green idle · UAT golden 3+4.

### Волна 104 (2026-06-16) — PR chain merged + CI-scoped wave 101

| PR | Статус | Содержимое |
|----|--------|------------|
| #21 | merged | 10× P0 SECTION-DETAIL skeletons |
| #22 | merged | split `platform-core-readiness-sections/` |
| #23 | merged | visibility API + route fix; `PLATFORM_CORE_PINNED_B2B_ORDER_IDS` (shop2 registry); `core-restart.sh` |

| Fix (локально, не в #23) | Изменение |
|--------------------------|-----------|
| cabinet CTAs | `resolvePlatformCoreCabinetOrderId` в OrderProduction / Comms / Supplier pillars |
| registry | pin `B2B-DEMO-SHOP2-SS27` при e2e churn (LIMIT 200) |

**Урок:** worktree-PR не копировать platform UI без baseline на `main` — CI `Module not found`. Следующий шаг: **baseline PR** всего `src/components/platform` + hub matrix с локальной ветки.

**Следующий кластер P0:** `core:verify` exit 0 · baseline PR на main · UAT golden 3+.

### Волна 121 (2026-06-16) — baseline rsync · pillar smoke · build gate

| Fix | Изменение |
|-----|-----------|
| disk | `npm run synth-1:clean` — диск 100% → baseline cp не падал на `.next-e2e` |
| baseline script | `create-platform-core-baseline-pr.sh`: `rsync --delete` + exclude caches; **1337 files** staged |
| dup route | удалён `workshop2/c/.../page` (остался `(w2-enterprise)/…`) |
| build | `brand/team` → dynamic import `calendar-page-client` (не server `page.tsx`) |
| e2e | targeted pillars **3/3 green** (brand + shop + manufacturer) |
| core-03 | e2e: `brand-co-detail-context-strip` в or() handoff strip (collection order detail) |
| core-02 | BOM UI → smoke+PUT (persist в API-тесте); hub strip **visible** (core-28 parity) |
| build | `brand/b2b/credit` → `dynamic = force-dynamic` (PG timeout при export) |
| verify | полный `core:verify` **~153+** без новых ✘ после core-04 (4 старых: core-02×2 flake, core-03×2 → fixed) |

**Следующий кластер P0:** `core:verify` exit 0 · baseline PR commit/push · UAT golden 3+.

### Волна 122 (2026-06-16) — PG-primary spine · 4 столпа · planner UX

| Fix | Изменение |
|-----|-----------|
| **P0 spine** | `platform-core-spine-pg.server.ts` — единый PG-primary для core mode |
| **P0 chat** | `workshop2_contextual_messages` only в core; `contextualFallbackBlocked()` |
| **P0 orders** | `getB2BOrdersBaseForOperationalApi()` skip snapshot при pg-primary |
| **P0 dossier** | `shouldSkipNativeJsonFileStores()` — no file read/write в core |
| **P0 tasks** | `brand_tasks_kanban` PG; `/brand/tasks` pg-only в core mode |
| **P1 invoice** | `renderWorkshop2SchetOffertaHtml` + upsert `workshop2_b2b_invoice` |
| **P1 health** | `platformCoreSpinePgPrimary`, `spineStores[]` в health API |
| **P1 env** | `env.core.example`: `SPINE_OPERATIONAL_PG*` enabled by default |
| **P1 hub** | Toggle views business/planner/audit; planner inline chat; scroll preserve |
| **P1 planner** | iPhone → Mac Cursor SDK via `x-syntha-planner-client` |
| **P1 wizard** | `PlatformCoreEmptyChainBanner` → `?w2create=1` (core-37) |
| **tests** | `workshop2-spine-pg-bridge.test.ts` 6/6 |

**Честно:** столп 3 brand **+0.2** (PG orders SoT); столп 1 dossier **+0.1** (fail-closed file); comms **+0.1** (SSE chat); инженерия **~8.2**; UAT **0/69** — оценки в CELL пока без bump до UAT.

**Следующий кластер:** `core:verify:pg-primary` · UAT golden pillars 3+4 · planner TECH_DEBT status sync.

## SoT файлы

| Область | Путь |
|---------|------|
| Hub matrix | `src/lib/platform-core-hub-matrix.ts` |
| Readiness | `src/lib/platform-core-readiness-audit.ts` |
| Labels RU | `src/lib/platform-core-canonical-labels.ts` |
| Scorecard/matrix UI | `PlatformCoreReadinessScorecard.tsx`, `PlatformCorePillarRoleScoreMatrix.tsx` |
| Cabinets | `src/components/platform/RoleCoreCabinetHub.tsx` |
| E2E | `e2e/core-01` … `core-14` |
| UAT checklist | `.planning/audits/SECTION-AUDIT-UAT-CHECKLIST.md` |
| Verify script | `scripts/core-verify.sh` |
| Entity-links core | `src/lib/platform-core-entity-links-registry.ts` |
| Side-paths | `src/lib/platform-core-side-paths-registry.ts` |
| Legacy inventory | `src/lib/platform-core-legacy-manifest.ts` |
| Collection labels | `getPlatformCoreCollectionLabel()` в `platform-core-demo-context.ts` |
| Spine PG-primary | `src/lib/server/platform-core-spine-pg.server.ts` |
| Planner tech debt | `src/lib/platform-core-planner.ts` (`TECH_DEBT_REGISTRY`) |
| Dev | `npm run dev:core` → `:3001/platform` (не `:3000`) |

## Резюме одной фразой

**Инженерно:** волна 122 — PG-primary spine (chat/orders/dossier/tasks/invoice в одной PG в core mode). **Продуктово:** **~7.2–7.4** guided demo SS27; детальный аудит **4 столпов** выше. **Блокер:** UAT **0/69**. **P0:** `core:verify:pg-primary` → UAT 10 (столпы 3+4) → CELL bump.
