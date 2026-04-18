# Domain events — матрица типов и план миграции

**Статус:** черновик (согласование с `src/lib/order/domain-event-catalog.ts`).  
**Цель:** один канонический список строк `domain.*` / `*.type`, понятные имена для продукта, отделение демо-типов от операционных, без массового рефакторинга UI.

## Принципы

1. **Строка `type` — контракт.** Смена значения (`order.confirmed` → другое) ломает outbox, логи, интеграции, health-check списки. Переименование **wire-строки** только с фазой: дублирующий alias в каталоге → обновление продьюсеров/потребителей → deprecation window → удаление старой строки.
2. **Переименование ключа TypeScript** (`grainUnlocked` → `lotReleased`) безопаснее: остаётся та же строка `'inventory.grain_unlocked'`, меняется только идентификатор в коде.
3. **Удаление ключа** допустимо только если нет ссылок в коде и нет ожидания этой строки во внешних системах (grep по репо + при необходимости по persisted events).

## Краткая карта потребителей (не UI)

| Область | Файлы |
|--------|--------|
| Фабрики событий | `src/lib/order/domain-event-factories.ts` |
| Типы событий + шина | `src/lib/order/domain-events.ts` |
| «Нервная система» (список типов для мониторинга) | `src/lib/core/nervous-system.ts` |
| Подписки | `supply-chain-orchestrator.ts`, `interaction-linkage.ts`, `crowd-sentiment.ts`, `b2b-integration-service.ts`, `global-anomaly-engine.ts` |
| Тесты | `domain-events-health.test.ts`, `crowd-sentiment.test.ts`, `domain-event-outbox.test.ts`, `b2b-export-domain-event.test.ts` |

---

## Таблица: `DomainEventTypes` → действие

**Легенда:** `keep` — оставить; `rename_key` — переименовать только TS-ключ (строка та же); `rename_wire` — сменить строковое значение (планируется отдельная миграция); `demo` — вынести в `DomainEventTypesDemo` или суффикс `_demo` в доке; `merge` — объединить с другим типом при согласовании семантики.

### `order`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `confirmed` | `order.confirmed` | keep | Nervous system + factories |
| `partialCancelled` | `order.partial_cancelled` | keep | |
| `shipped` | `order.shipped` | keep | |
| `claimResolved` | `order.claim_resolved` | keep | |
| `shipmentCreated` | `order.shipment_created` | keep | Дублирование смысла с `logistics.shipment_created` — см. merge (позже) |
| `b2bPlatformExportResult` | `order.b2b_platform_export_result` | keep | B2B export; тесты |

### `inventory`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `customerReturnProcessed` | `inventory.customer_return_processed` | keep | |
| `channelTransferCompleted` | `inventory.channel_transfer_completed` | keep | |
| `reconciliationCompleted` | `inventory.reconciliation_completed` | keep | |
| `discrepancyDetected` | `inventory.discrepancy_detected` | keep | Factory only |
| `ownershipTransferred` | `inventory.ownership_transferred` | keep | |
| `grainUnlocked` | `inventory.grain_unlocked` | rename_key → `batchUnlocked` или `lotUnlocked` (опционально) | Семантика «партия/лот», не grain |
| `snapshotCreated` | `inventory.snapshot_created` | keep | |
| `cycleCountCompleted` | `inventory.cycle_count_completed` | keep | |
| `stockLow` | `inventory.stock_low` | keep | Orchestrator + nervous |
| `stockReserved` | `inventory.stock_reserved` | keep | Тип в domain-events; проверить фабрику |
| `reservationExpired` | `inventory.reservation_expired` | keep | |
| `b2b2cAllocationCompleted` | `inventory.b2b2c_allocation_completed` | keep | |
| `overstockDetected` | `inventory.overstock_detected` | keep | Nervous system |
| `shopStockFileIngested` | `inventory.shop_stock_file_ingested` | keep | |

### `production`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `qcUpdated` | `production.qc_updated` | keep | |
| `qcFailed` | `production.qc_failed` | keep | Nervous system |
| `transferCreated` | `production.transfer_created` | keep | |
| `draftCreated` | `production.draft_created` | keep | |
| `bioReactorApproved` | `production.bio_reactor_approved` | demo → `rename_wire` при серьёзной модели | Заменить на `production.step_approved` / `qc_gate_passed` |
| `replicatorMassDepleted` | `production.replicator_mass_depleted` | demo | |
| `insufficientDarkEnergy` | `production.insufficient_dark_energy` | demo | Заменить на `production.resource_shortage` или `energy_budget_exceeded` |
| `timelineFractureRisk` | `production.timeline_fracture_risk` | demo | → `production.schedule_risk` или `milestone_slip_risk` |
| `wasteGenerated` | `production.waste_generated` | keep | |

### `article`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `readyForProduction` | `article.ready_for_production` | keep | |

### `control`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `riskAlert` | `control.risk_alert` | keep | interaction-linkage |
| `crisisCascadeTriggered` | `control.crisis_cascade_triggered` | demo | → `control.escalation_triggered` |

### `store`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `eslPriceUpdated` | `store.esl_price_updated` | keep | |

### `system`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `globalAnomalyDetected` | `system.global_anomaly_detected` | keep | global-anomaly-engine |
| `interplanetaryConflictResolved` | `system.interplanetary_conflict_resolved` | demo | удалить wire или заменить на `system.incident_resolved` |
| `singularityPatchProposed` | `system.singularity_patch_proposed` | demo | |
| `catastrophicFailureImminent` | `system.catastrophic_failure_imminent` | demo | → `system.severity_critical` / `system.degraded` |

### `logistics`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `rfidScan` | `logistics.rfid_scan` | keep | |
| `returnProcessed` | `logistics.return_processed` | keep | |
| `shipmentCreated` | `logistics.shipment_created` | merge? | См. `order.shipment_created` — одна сущность «отгрузка» |
| `nanoHealingFailed` | `logistics.nano_healing_failed` | demo | |
| `temporalParadoxRisk` | `logistics.temporal_paradox_risk` | demo | |
| `dimensionalCollapseRisk` | `logistics.dimensional_collapse_risk` | demo | |
| `telekineticDrop` | `logistics.telekinetic_drop` | demo | |
| `delayReported` | `logistics.delay_reported` | keep | |

### `finance`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `fraudDetected` | `finance.fraud_detected` | keep | |
| `omniversalTransferCompleted` | `finance.omniversal_transfer_completed` | demo | → `finance.transfer_completed` / `payment_settled` |

### `governance`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `proposalPassed` | `governance.proposal_passed` | keep | |

### `retail`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `biometricCheckoutCompleted` | `retail.biometric_checkout_completed` | demo | → `retail.checkout_completed` + атрибут channel |
| `telepathicIntentLocked` | `retail.telepathic_intent_locked` | demo | удалить или заменить на `retail.cart_locked` |

### `design`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `neuroConceptGenerated` | `design.neuro_concept_generated` | demo | → `design.concept_generated` |

### `planning`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `quantumForecastCompleted` | `planning.quantum_forecast_completed` | demo | → `planning.forecast_completed` |
| `multiverseBranchMerged` | `planning.multiverse_branch_merged` | demo | → `planning.scenario_merged` |

### `security`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `qkdEavesdroppingDetected` | `security.qkd_eavesdropping_detected` | demo | → `security.tamper_detected` |

### `edge`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `neuromorphicAnomalyDetected` | `edge.neuromorphic_anomaly_detected` | demo | → `edge.device_anomaly` |

### `energy`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `antimatterContainmentWarning` | `energy.antimatter_containment_warning` | demo | → `energy.capacity_warning` |
| `vacuumDecayWarning` | `energy.vacuum_decay_warning` | demo | |

### `operations`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `terraformingEnergyCritical` | `operations.terraforming_energy_critical` | demo | → `operations.sla_breach_risk` |

### `network`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `interstellarInterference` | `network.interstellar_interference` | demo | → `network.link_degraded` |

### `database`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `shardCapacityWarning` | `database.shard_capacity_warning` | demo | → `database.capacity_warning` |

### `marketing`

| Ключ (TS) | Строка (wire) | Действие | Примечание |
|-----------|-----------------|----------|------------|
| `dnaProfileAnalyzed` | `marketing.dna_profile_analyzed` | demo | |
| `hiveMindBroadcastSuccess` | `marketing.hive_mind_broadcast_success` | demo | |
| `sentimentSpike` | `marketing.sentiment_spike` | keep | Тесты health / crowd-sentiment |

---

## Предлагаемый порядок PR (без массового UI)

### PR-1 — Документация (только этот файл + ссылка в README/TASK при необходимости)

- Добавить/обновить `docs/domain-model/event-matrix.md`.
- Не менять `domain-event-catalog.ts`.
- Ревью: продукт + backend; зафиксировать «demo» строки как непродакшен-нейминг.

### PR-2 — Структура каталога без смены wire-строк

- Ввести `DomainEventTypesCore` (операционные) и `DomainEventTypesDemo` (или поле `metadata.tier` на уровне доки/генерации), **сохранив** `export const DomainEventTypes = { ...core, ...demo }` для обратной совместимости.
- Обновить только `nervous-system.ts` и импорты, если разделите объект — либо оставить один flatten export.

### PR-3 — Переименование только TS-ключей (опционально)

- Где одобрено таблицей: `grainUnlocked` → `lotUnlocked` и т.д., **string literal не трогать**.
- Правки: `domain-event-catalog.ts`, `domain-event-factories.ts`, `domain-events.ts` (типы), тесты.

### PR-4 — Смена wire-строк (по одному домену за PR)

- Для каждой пары: добавить новый ключ со **новой** строкой + alias старой строки в subscribe (двойная подписка) или маппинг в одном месте шины.
- Обновить продьюсеры, затем депрекейт старую строку, затем удаление после окна.

### Вне scope текущей инициативы

- Разруливание `order.shipment_created` vs `logistics.shipment_created` (требует доменной модели отгрузки).
- Любые изменения страниц `src/app/**` кроме точечных, если появится отображение типа события в админке.

---

## Чеклист перед merge rename_wire

- [ ] Grep по репозиторию на старую строку.
- [ ] Проверка persisted outbox / очередей (если есть).
- [ ] Обновление `nervous-system.ts` и API health metadata, если типы перечислены явно.
- [ ] E2E/контрактные тесты на `/api/ops/domain-events/health`, если зафиксирован список типов.
