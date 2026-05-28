# Схемы удерживаемой структуры продукта (мастер)

**Дата:** 2026-05-11 · **Источники:** `VISUAL_DETAILED_SECTIONS_STATUS.md`, `FOCUS_ONE_PAGER.md`, фрагмент `GAP_ANALYSIS_USER_FLOW_COLLECTION_B2B_CHAT_CALENDAR.md` · **Канон кода:** `_ai-share/synth-1-full`

---

## Введение

Документ фиксирует **структуру того, что сознательно сохраняем** в продуктовом нарративе: три столба фокуса, сквозные слои и контекст админа. Внутри модулей — **стадии, секции, взаимодействия и функции**, сгруппированные в кластеры (без перечисления каждой микрофичи).

## Легенда типов диаграмм


| Тип                           | Назначение                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| **flowchart TB** с `subgraph` | Иерархия доменов/модулей и вложенные подсистемы с ключевыми функциями.                             |
| **flowchart LR**              | Сквозной **процесс по стадиям** с ветвлениями (решения).                                           |
| **flowchart** (роли)          | **Кто с кем** по материалам, сэмплу и заказам — рёбра с подписями.                                 |
| **stateDiagram-v2**           | Упрощённый **жизненный цикл** артикула/коллекции (целевые состояния из GAP и визуального статуса). |


Синтаксис **Mermaid**, совместимый с рендером на GitHub: `flowchart`, `subgraph id["…"]`, кавычки для длинных подписей узлов.

---

## 1. Три столба + сквозные слои и контекст

**Подпись:** верхний уровень — **что остаётся в фокусе** (FOCUS): (A) разработка артикула и ТЗ, (B) коллекции и B2B, (C) чат и календарь; плюс **поставщик/материалы**, **производство/агрегация** как опорные домены цепочки и **общий слой** tenant/админ.

```mermaid
flowchart TB
  subgraph pillarA["Столб A: ТЗ → образец (Workshop 2)"]
    A1["Хаб W2 + артикул c/a"]
    A2["Досье Phase1: секции, версии, merge"]
    A3["Signoff: секции / глобальный / sample"]
    A4["Lifecycle + события досье"]
    A5["Экспорт / snapshot + tech pack пилот"]
    A6["API: phase1-dossier/**, collection-stage-review"]
    A7["Контрагенты пошива → план"]
    A1 --> A2 --> A3 --> A4 --> A5
    A2 --> A6
    A2 --> A7
  end

  subgraph pillarB["Столб B: коллекции + B2B + шоурум"]
    B1["Коллекции: состав, стадии review"]
    B2["Showroom / linesheet / lookbook"]
    B3["Operational orders v1 BFF"]
    B4["Карточка заказа: строки, сроки"]
    B1 --> B2 --> B3 --> B4
  end

  subgraph pillarC["Столб C: коммуникации и время"]
    C1["Messages brand / shop"]
    C2["Календари brand / shop B2B / factory"]
    C3["Вкладки чат/календарь на полу производства"]
    C1 --- C2
    C2 --- C3
  end

  subgraph supply["Поставщик и материалы (удерживаемый контур)"]
    S1["Справочники supplier / materials"]
    S2["Параметры production-params, лоты"]
    S3["RFQ / широкие маршруты как карта"]
    S1 --> S2 --> S3
  end

  subgraph prodexec["Производство, сэмпл, PO, агрегация"]
    P1["Сэмпл по ТЗ, этаж цеха"]
    P2["Gold sample gate"]
    P3["CreatePOFromSamples + агрегаты"]
    P4["PO / материалы к партии"]
    P1 --> P2 --> P3 --> P4
  end

  subgraph cross["Кросс-срез: tenant, демо, админ"]
    X1["Профиль / organization hub"]
    X2["Смоки, демо-bootstrap"]
    X3["Админ, cron W2 metrics — вне P0 питча"]
    X1 --> X2 --> X3
  end

  pillarA --> prodexec
  supply --> prodexec
  prodexec --> pillarB
  pillarA -.-> pillarC
  pillarB -.-> pillarC
  prodexec -.-> pillarC
  cross -.-> pillarA
  cross -.-> pillarB
```



---

## 2. Сквозные стадии: от ТЗ до PO

**Подпись:** целевой **end-to-end** поток из GAP и визуального статуса: ТЗ и согласования → сэмпл и качество → допуск в коллекцию → витрина и B2B → свод спроса → производственный заказ. Ромбы — продуктовые **решения/гейты** (часть ещё не как единый контракт в коде).

```mermaid
flowchart LR
  TZ["ТЗ W2: досье, signoff, merge"]
  TP{"Tech pack / handoff готов?"}
  SM["Сэмпл по ТЗ + согласования"]
  GS{"Gold sample утверждён?"}
  COL["Коллекция сезона"]
  ELIG{"Политика eligible: только после сэмпла?"}
  SH["Шоурум: курация ассортимента"]
  OO["B2B operational order"]
  AGG["Агрегация спроса shop→brand"]
  PO["Production PO по ТЗ"]
  MAT["Проверка сырья/фурнитуры"]

  TZ --> TP
  TP -->|да / пилот| SM
  TP -->|нет| TZ
  SM --> GS
  GS -->|нет| SM
  GS -->|да| COL
  COL --> ELIG
  ELIG -->|да целевое| SH
  ELIG -->|частично сейчас| SH
  SH --> OO
  OO --> AGG
  AGG --> PO
  PO --> MAT
  MAT -->|достаточно| SM
```



---

## 3. Взаимодействия ролей: материалы, сэмпл, заказы

**Подпись:** **кто с кем** в удерживаемой истории: бренд ведёт ТЗ и B2B; магазин — зеркало заказов; производство — сэмпл, календарь цеха, приём handoff; поставщик материалов — в связке с брендом и производством (часть UX через фабрику по FOCUS).

```mermaid
flowchart LR
  BR["Бренд"]
  SHP["Магазин shop"]
  PR["Производство / фабрика"]
  SU["Поставщик материалов"]

  BR -->|"ТЗ, правки, signoff"| PR
  PR -->|"сэмпл, статусы, запросы"| BR
  BR -->|"handoff / tech pack"| PR
  SU -->|"поставка ткани/фурнитуры"| PR
  SU -->|"RFQ, условия"| BR
  BR -->|"материалы к артикулу/PO"| SU
  BR -->|"шоурум, условия, linesheet"| SHP
  SHP -->|"operational order"| BR
  BR -->|"подтверждение / исполнение B2B"| SHP
  BR -->|"агрегированный спрос → PO"| PR
```



---

## 4. Жизненный цикл артикула и коллекции (целевые состояния)

**Подпись:** упрощённая **машина состояний** для питча и дорожной карты: от черновика ТЗ до продажи в B2B; отдельно — **коллекция** как контейнер сезона с желаемым гейтом по сэмплу (в коде — частично, см. GAP).

```mermaid
stateDiagram-v2
  [*] --> ArticleDraft: создание артикула
  ArticleDraft --> W2Editing: досье фазы 1
  W2Editing --> W2Signoff: секции / глобальный signoff
  W2Signoff --> SampleCycle: этап sample
  SampleCycle --> GoldApproved: gold sample OK
  GoldApproved --> InCollection: в сезонной коллекции
  InCollection --> OnShowroom: витрина / lookbook
  OnShowroom --> B2BOrdered: operational order
  B2BOrdered --> DemandAggregated: свод с магазинов
  DemandAggregated --> POIssued: производственный заказ
  POIssued --> ProductionRun: партия по ТЗ
  ProductionRun --> [*]

  W2Editing --> W2Editing: merge / версии
  SampleCycle --> W2Editing: возврат правок по ТЗ
```



---

## 5. Компактная карта функций по разделам (кластеры)

**Подпись:** группировка **функций**, которые документируем как удерживаемые (из таблиц §2–§10 визуального статуса), без полного списка URL.

```mermaid
flowchart TB
  subgraph w2["W2 / ТЗ"]
    F1["Досье, merge, lifecycle API"]
    F2["Signoff по секциям"]
    F3["Tech pack: presign, index, handoff"]
  end
  subgraph collb2b["Коллекция и B2B"]
    F4["Состав коллекции, stage review"]
    F5["Showroom, operational orders"]
    F6["Строки заказа: размеры, delivery"]
  end
  subgraph prodagg["Производство и спрос"]
    F7["Gold sample, PO из сэмплов"]
    F8["OrderAggregate / CollectionAggregate"]
    F9["Материалы к PO"]
  end
  subgraph comm["Чат и календарь"]
    F10["Треды в контексте заказа/проекта"]
    F11["События: отгрузка, встречи, этапы"]
  end
  w2 --> prodagg
  w2 --> collb2b
  prodagg --> collb2b
  collb2b -.-> comm
  prodagg -.-> comm
```



---

## Связь с приоритетами

Диаграммы **не заменяют** матрицу зрелости и топ-10 из `VISUAL_DETAILED_SECTIONS_STATUS.md`: они визуализируют **ту же** удерживаемую структуру на уровне модулей, стадий и ролей. Узкие места (gate коллекции, B2B→агрегация→PO, канон календаря и чата) на схемах отмечены явно в §2–§4.

---

*Документ планирования; код не изменялся.*