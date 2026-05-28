# Схемы по удерживаемым разделам (расширенный слой)

**Дата:** 2026-05-11 · **Источники:** `VISUAL_DETAILED_SECTIONS_STATUS.md`, `FOCUS_ONE_PAGER.md`, `DIAGRAMS_RETAINED_STRUCTURE_MASTER.md` (без повторения его сводных §1–§5) · **Канон кода:** `_ai-share/synth-1-full`

---

## Назначение документа

Здесь — **погружение по каждому сохраняемому модулю**: этапы внутри подсистем, типовые функции и зависимости в формате **Mermaid `flowchart TB`** с `subgraph`. Сводный «три столба + сквозной LR» остаётся в мастер-файле; ниже — опорные **детальные карты** для питча и дорожной карты.

---

## 1. Разработка артикула, ТЗ и Workshop 2

```mermaid
flowchart TB
  subgraph hub["Хаб и контекст"]
    H1["/brand/production/workshop2"]
    H2["c/[collectionId]/a/[articleId]"]
  end
  subgraph dossier["Досье Phase1"]
    D1["Секции ТЗ"]
    D2["Версии"]
    D3["Merge конфликтов"]
    D4["Lifecycle transitions"]
    D5["События досье"]
  end
  subgraph signoff["Согласования"]
    S1["Signoff по секциям"]
    S2["Глобальный TZ signoff"]
    S3["Sample-stage в демо-конфиге"]
  end
  subgraph pack["Артефакты и передача"]
    E1["Final export / snapshot"]
    T1["Tech pack: presign"]
    T2["Tech pack: index"]
    T3["Handoff → производство"]
  end
  subgraph api["Контуры API"]
    A1["phase1-dossier/**"]
    A2["collection-stage-review"]
    A3["Контрагенты пошива → план"]
  end
  H1 --> H2 --> D1
  D1 --> D2 --> D3 --> D4 --> D5
  D1 --> S1 --> S2 --> S3
  S2 --> E1
  S2 --> T1 --> T2 --> T3
  D3 --> A1
  D4 --> A1
  T3 --> A1
  S2 --> A2
  H2 --> A3
```



Подпись: внутри столба A показан **скелет W2** — от входа в артикул до API и tech pack; пересечение с коллекцией (`collection-stage-review`) и пошивом вынесено как явные рёбра, а не как дублирование общей «триады» из мастера.

---

## 2. Поставщик и материалы

```mermaid
flowchart TB
  subgraph dirs["Справочники и контрагенты"]
    R1["/brand/suppliers"]
    R2["/brand/materials"]
    R3["Supplier / Contractor"]
  end
  subgraph stock["Учёт и параметры"]
    M1["MaterialLot"]
    M2["production-params"]
    M3["Блоки materials в производстве"]
  end
  subgraph sourcing["Закупка"]
    F1["RFQ и широкая матрица маршрутов"]
    F2["Live-поставщики как карта"]
  end
  subgraph chain["Место в цепочке"]
    L1["← W2 / номенклатура артикула"]
    L2["→ доступность для PO"]
    L3["→ финансы при наличии маршрутов"]
  end
  R1 --> R3
  R2 --> M1
  M1 --> M2 --> M3
  R3 --> F1 --> F2
  L1 --> R2
  M3 --> L2
  F2 --> L3
```



Подпись: раздел **не ERP целиком**, а удерживаемый контур справочников, партий и связки с производством; отдельно отмечены **вход из ТЗ** и **выход на партию**.

---

## 3. Производство, сэмпл и гейт качества

```mermaid
flowchart TB
  subgraph entry["Вход"]
    I1["След W2 / handoff"]
    I2["/brand/production hub"]
  end
  subgraph sample["Сэмпл и качество"]
    Q1["Этап sample по ТЗ"]
    Q2["Согласования бренд ↔ цех"]
    Q3["Gold sample gate"]
    Q4["SampleAggregate"]
  end
  subgraph floor["Пол цеха"]
    F1["Этаж / shell производства"]
    F2["Gantt / календарь цеха"]
    F3["Вкладки чат / календарь"]
  end
  subgraph out["Исходящие связи"]
    O1["→ политика коллекции"]
    O2["→ CreatePOFromSamples"]
    O3["→ материалы к PO"]
  end
  I1 --> I2 --> Q1
  Q1 --> Q2 --> Q3 --> Q4
  I2 --> F1 --> F2
  F1 --> F3
  Q4 --> O1
  Q3 --> O2 --> O3
```



Подпись: акцент на **мосте ТЗ → качество образца → допуск к сезону и PO**; вкладки comms на полу показаны как **локальный UX** поверх того же производственного контекста.

---

## 4. Коллекции бренда

```mermaid
flowchart TB
  subgraph ui["Экраны сезона"]
    U1["/brand/collections"]
    U2["/brand/collections/new"]
    U3["Навигация PIM / showroom"]
  end
  subgraph model["Состав и политика"]
    C1["Collection как контейнер"]
    C2["Article / SKU в сезоне"]
    C3["Целевой gate: gold-sample-approved"]
    C4["Факт в коде: частично"]
  end
  subgraph review["Стадии и согласования"]
    S1["collection-stage-review"]
    S2["Стадии коллекции JSON-порт"]
    S3["Витрина состава сезона"]
  end
  subgraph next["Выход на витрину и B2B"]
    N1["→ showroom / linesheet"]
    N2["→ подборка под operational order"]
  end
  U1 --> C1
  U2 --> C2
  C1 --> C2 --> C3 --> C4
  C1 --> S1 --> S2 --> S3
  S3 --> N1 --> N2
```



Подпись: визуализированы **три слоя** — UI сезона, желаемая **политика eligible** и текущий **узкий порт стадий**; связь со шоурумом и B2B как следующий шаг цепочки.

---

## 5. Шоурум и B2B-заказ

```mermaid
flowchart TB
  subgraph vitrina["Курация витрины"]
    W1["Showroom"]
    W2["Linesheet"]
    W3["Shoppable lookbook"]
  end
  subgraph bff["Операционный контур"]
    B1["BFF operational-orders v1"]
    B2["/brand/b2b-orders"]
    B3["/shop/b2b-orders"]
    B4["Карточка [orderId]"]
  end
  subgraph lines["Строки заказа"]
    L1["Размерные ряды"]
    L2["Delivery / ship window"]
    L3["Аудит полноты DTO ↔ UI"]
  end
  subgraph comm["Связь с comms"]
    X1["Тред / сообщения по заказу"]
    X2["Календари заказа shop"]
  end
  W1 --> B1
  W2 --> B1
  W3 --> B1
  B1 --> B2
  B1 --> B3
  B2 --> B4
  B4 --> L1 --> L2 --> L3
  B4 --> X1
  B4 --> X2
```



Подпись: столб B «в глубину» — **один узкий сценарий** от витрины к BFF и карточке заказа, плюс явные **пробелы по строкам** и **связь с чатом/календарём** без перечисления архивных интеграций.

---

## 6. Агрегация спроса и производственный заказ

```mermaid
flowchart TB
  subgraph demand["Вход спроса"]
    I1["Shop operational orders"]
    I2["Brand operational orders"]
    I3["Целевой merge orders в UI"]
  end
  subgraph agg["Агрегаты в коде"]
    A1["OrderAggregate"]
    A2["CollectionAggregate"]
    A3["SampleAggregate"]
  end
  subgraph po["Производственное решение"]
    P1["CreatePOFromSamples"]
    P2["ProductionOrder"]
    P3["Проверка сырья / фурнитуры"]
  end
  subgraph risk["Риски и ADR"]
    R1["Слабая связь B2B → PO"]
    R2["Источник правды ERP vs платформа"]
  end
  I1 --> A1
  I2 --> A1
  I1 --> I3
  I2 --> I3
  A1 --> A2 --> A3
  A3 --> P1 --> P2 --> P3
  A1 -.-> R1
  A1 -.-> R2
```



Подпись: показан **путь от зеркальных заказов к типам агрегатов и PO**, с пунктиром на **GAP** из матрицы зрелости — без дублирования LR-ромбов из мастер-§2.

---

## 7. Чаты (сквозной слой) — часть A

```mermaid
flowchart TB
  subgraph routes["Маршруты кабинетов"]
    R1["/brand/messages"]
    R2["/shop/messages"]
    R3["Factory / distributor messages"]
  end
  subgraph ctx["Контекст треда"]
    C1["orderId"]
    C2["collectionId"]
    C3["articleId"]
    C4["Deep links из доменов"]
  end
  subgraph ux["Два уровня UX"]
    U1["Полноформатный inbox"]
    U2["Вкладка на полу производства"]
    U3["IA: сходимость vs два канала"]
  end
  subgraph roadmap["Зрелость"]
    T1["Цель: единая модель ChatThread"]
    T2["Enterprise realtime — отдельная фаза"]
  end
  R1 --> U1
  R2 --> U1
  R3 --> U1
  U1 --> C1 --> C4
  C2 --> C4
  C3 --> C4
  U1 -.-> U2 --> U3
  U1 --> T1
  T1 -.-> T2
```



Подпись: схема фиксирует **маршруты, привязку к сущностям и продуктовый разрыв** между полноформатным чатом и вкладкой в производстве — в духе FOCUS и §8 визуального статуса.

---

## 8. Календарь — часть B

```mermaid
flowchart TB
  subgraph brandshop["Brand и shop"]
    B1["/brand/calendar"]
    S1["/shop/b2b/calendar"]
    S2["delivery-calendar"]
    S3["Календари B2B-заказов"]
  end
  subgraph factory["Производство"]
    F1["factory production/calendar"]
    F2["Демо-события стадий"]
  end
  subgraph sem["Семантики"]
    M1["Delivery / отгрузка"]
    M2["Ёмкость цеха"]
    M3["Milestone W2 / производства"]
  end
  subgraph pitch["Питч и демо"]
    H1["Канон календаря в IA"]
    H2["Подпись demo vs prod"]
  end
  B1 --> M3
  S1 --> M1
  S2 --> M1
  S3 --> M1
  F1 --> M2
  F2 --> M2
  M1 --> H1
  M2 --> H1
  M3 --> H1
  B1 --> H2
  F2 --> H2
```



Подпись: календарь разложен по **ролевым поверхностям и семантикам риска**; отдельно выделены **решения для питча** (один канон) и **честность демо** из FOCUS.

---

## Связь с мастер-файлом


| Мастер (`…MASTER`)                    | Этот файл                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| §1 три столба + supply + prod + cross | Здесь **нет** повторения того же TB-«пилона»; вместо этого — **внутренние** TB по §2–§9 визуального статуса. |
| §2 LR end-to-end с ромбами            | LR не дублируется; детали **внутри доменов** (§1–§6 выше).                                                   |
| §3 роли LR, §4 stateDiagram           | Сохранены на уровне мастера; здесь **flowchart TB** по подсистемам.                                          |
| §5 компактная карта функций           | Расшита в **отдельные разделы** §1–§8.                                                                       |


---

## Сжатая карта «кто читает какой блок»

```mermaid
flowchart TB
  subgraph product["Продукт / питч"]
    P1["§1 W2 + §4 коллекции"]
    P2["§5 шоурум B2B"]
    P3["§7–8 comms"]
  end
  subgraph ops["Операции цепочки"]
    O1["§2 материалы"]
    O2["§3 производство"]
    O3["§6 агрегация → PO"]
  end
  subgraph eng["Инженерия"]
    E1["API-узлы в §1 §4 §5"]
    E2["Агрегаты §6"]
    E3["GAP пунктир §6 §7"]
  end
  P1 --> O2
  P2 --> O3
  O1 --> O2 --> O3
  P1 --> E1
  P3 --> E3
  O3 --> E2
```



Подпись: вспомогательная **одна диаграмма-оглавление** для навигации по разделам документа; не заменяет мастер-сводку столбов.

---

*Документ планирования; код не изменялся.*