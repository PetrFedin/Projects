# W2 ТЗ — Implementation Spec (жесткий сценарий)

Документ фиксирует внедрение правил готовности ТЗ в коде:  
`правило -> где проверяется -> текст ошибки -> блокирующий гейт -> тест`.

---

## 1) Scope и текущие модули

- **Секции и пороги подписи:** `src/components/brand/production/Workshop2TzSectionSignoffStrip.tsx`, `src/lib/production/workshop2-tz-section-signoff-thresholds.ts`
- **Гейты / preflight:** `src/lib/production/workshop2-tz-gates.ts`, `src/lib/production/workshop2-tz-trace.ts`
- **Узел → BOM (lineRef) → обработка:** `src/lib/production/workshop2-bom-construction-node-integrity.ts` (коды `W2_CNODE_*`, гейт «Минимальный стандарт ТЗ»)
- **Стрип mat↔скетч (gap ref-ов):** `src/lib/production/workshop2-mat-sketch-bom-crosscheck.ts` (`resolveMatSketchBomGapRefs` — реестр как у конструкции, иначе эвристика по строкам mat)
- **Готовность секций:** `src/lib/production/workshop2-tz-section-readiness.ts`
- **Финальный экспорт:** `src/lib/production/workshop2-final-tz-spec-export.ts`
- **Подписанты:** `src/components/brand/production/Workshop2ArticleWorkspace.tsx`, `src/lib/production/workshop2-tz-signatory-options.ts`
- **Панель досье / действия:** `src/components/brand/production/Workshop2Phase1DossierPanel.tsx`

---

## 2) Матрица правил (обязательный минимум)

## Паспорт

| Поле/правило | Где в коде | Ошибка в UI | Гейт | Тест |
|---|---|---|---|---|
| Артикул/название/категория/сезон не пустые | `workshop2-tz-section-readiness.ts` + паспортные атрибуты в `Workshop2Phase1DossierPanel.tsx` | `Заполните обязательные поля паспорта` | Блок подтверждения секции и handoff | unit: readiness + e2e smoke |
| Закреплены роли подписи (минимум дизайн+технолог) | `Workshop2ArticleWorkspace.tsx`, `workshop2-tz-signatory-options.ts` | `Назначьте исполнителя в паспорте (кнопка «Подписанты»).` | Блок digital signoff | unit: signatory-options |

## Визуал

| Поле/правило | Где в коде | Ошибка в UI | Гейт | Тест |
|---|---|---|---|---|
| `>=1` референс | `workshop2-tz-section-readiness.ts` (visual refs) | `Добавьте минимум 1 референс` | Блок подписи секции `visuals` | unit: section-readiness |
| `=1` базовый силуэт | `workshop2-tz-section-readiness.ts` + визуальные атрибуты в `Workshop2Phase1DossierPanel.tsx` | `Выберите базовый силуэт` | Блок подписи секции `visuals` | unit: section-readiness |
| Основной цвет выбран | `primaryColorFamilyOptions` в `Workshop2Phase1DossierPanel.tsx` | `Выберите основной цвет` | Блок `visuals` | unit: readiness/trace |
| Референс цвета заполнен (Pantone/RAL/код) | `colorReferenceSystemOptions` в `Workshop2Phase1DossierPanel.tsx` | `Укажите референс цвета (Pantone/RAL/код)` | Блок `visuals` | unit: readiness/trace |

## Материалы / BOM

| Поле/правило | Где в коде | Ошибка в UI | Гейт | Тест |
|---|---|---|---|---|
| `>=2` материалов | `workshop2-tz-gates.ts` (new rule `materials_min_count`) | `Добавьте минимум 2 материала` | Блок подписи `material` и handoff | unit: tz-gates |
| Материал в строке BOM выбран | `workshop2-tz-gates.ts` (new `material_required`) | `В строке BOM не выбран материал` | Блок `material` | unit: tz-gates |
| Состав по материалу = `100%` | уже частично: `Workshop2Phase1DossierPanel.tsx` (`matCompositionSumInvalid`), закрепить в `workshop2-tz-gates.ts` | `Сумма состава должна быть 100%` | Блок `material` + handoff | unit: tz-gates + existing composition tests |
| Ref-ы на скетче в реестре lineRef (если реестр не пуст) | `resolveMatSketchBomGapRefs` в `workshop2-mat-sketch-bom-crosscheck.ts`, вызов из `Workshop2Phase1DossierPanel.tsx` (`matSketchBomGapRefs`) | стрип «не найдены в mat» / gap-список | Информирование в хабе материалов | unit: `workshop2-mat-sketch-bom-crosscheck.test.ts` |
| lineRef в реестре → конструктивная метка на скетче (`material_without_node`) | `validateRegisteredBomRefsHaveConstructionPin` в `workshop2-bom-construction-node-integrity.ts` → `workshop2-tz-gates.ts` (`sectionMinimumErrors.material`) | `[W2_MATERIAL_WITHOUT_NODE] …` | Блок подписи `material` | unit: integrity + `workshop2-tz-gates.test.ts` |

## Конструкция

| Поле/правило | Где в коде | Ошибка в UI | Гейт | Тест |
|---|---|---|---|---|
| `=1` тип застежки | `workshop2-tz-gates.ts` (new `closure_required`) + construction attrs | `Укажите тип застёжки` | Блок подписи `construction` | unit: tz-gates |
| `>=3` конструктивных узла | `workshop2-tz-gates.ts` (new `nodes_min_count`) | `Добавьте минимум 3 узла конструкции` | Блок `construction` и handoff | unit: tz-gates |
| Карман есть -> описание/обработка заполнены | `workshop2-tz-gates.ts` (new `pocket_requires_description`) | `Для кармана заполните описание и обработку` | Блок `construction` | unit: tz-gates |
| Метка с `linkedAttributeId` → строка BOM (`linkedBomLineRef`) → обработка | `workshop2-bom-construction-node-integrity.ts` + `workshop2-tz-gates.ts` (`buildSectionMinimumErrors`, опция `activeCategoryLeafId`) | сообщения с префиксом `[W2_CNODE_0xx]` | Блок `construction` (минимальный стандарт ТЗ) | unit: `workshop2-bom-construction-node-integrity.test.ts`, `workshop2-tz-gates.test.ts` |

---

## 3) Критичная связка BOM <-> конструкция

Реализовано: **метка (узел)** = непустой `linkedAttributeId` на master-скетче или листах; **материал/BOM** = точное совпадение `linkedBomLineRef` с реестром lineRef в досье (`bomLineCostingHints`, `bomLineDeltaDrafts`, токены `LREF-…` в строках атрибута `mat`); **обработка** = непустой `text` метки или `linkedMaterialNote`.

Модуль: `workshop2-bom-construction-node-integrity.ts`, подключение к гейту секции: `workshop2-tz-gates.ts` → `sectionMinimumErrors.construction`.

Коды (machine id в сообщении и в тестах):

| Код | Условие |
|-----|--------|
| `W2_CNODE_001` | у метки с `linkedAttributeId` нет `linkedBomLineRef` |
| `W2_CNODE_002` | `linkedBomLineRef` не входит в реестр (при непустом реестре) |
| `W2_CNODE_003` | пусты и `text`, и `linkedMaterialNote` |
| `W2_CNODE_004` | есть такие метки, но в досье нет ни одного зарегистрированного lineRef |

Симметрия (материалы / BOM):

| Код | Условие |
|-----|--------|
| `W2_MATERIAL_WITHOUT_NODE` | lineRef есть в реестре досье, но ни одна конструктивная метка (`linkedAttributeId` + тот же `linkedBomLineRef`) на скетче его не ссылает |

Подтверждение секций ТЗ: в `Workshop2TzSectionSignoffStrip.tsx` в каждой строке с кнопкой «Подтвердить» — **ответственный (паспорт): имя · организация** и **от вашей сессии в досье запишется: имя · организация**; после фиксации — **подписал … · организация …**.

---

## 4) Блокировка подтверждения и подписи

- Порог секции: `W2_SECTION_SIGNOFF_PCT_THRESHOLD[section]` (сейчас UX: кнопка неактивна ниже порога).
- Для секции обязательны **оба условия**:
  1) порог `%` достигнут,
  2) rule-set секции прошёл без ошибок.

Формула допуска к подтверждению:

- `canConfirmSection = fillPct >= threshold && gateErrorsForSection.length === 0`

Где применить:

- `Workshop2TzSectionSignoffStrip.tsx` (кнопки confirm/tooltip)
- `Workshop2Phase1DossierPanel.tsx` (commitSectionSignoff guard)
- `workshop2-tz-digital-signoff.ts` (глобальная подпись)

---

## 5) Роли: технолог раньше (этапы 2–3)

Политика:

- технолог обязательный участник на `tz`, `sample`, `supply` минимум;
- нельзя оставлять только финальную подпись в конце.

Внедрение:

- `Workshop2ArticleWorkspace.tsx`: prefill stage flags для технолога;
- `workshop2-tz-signatory-options.ts`: helper policy `technologistEarlyStagesRequired`.

UI-текст:

- `Технолог обязателен на ранних этапах (ТЗ/образец/снабжение).`

---

## 6) Уведомления и “кто задержал”

Текущее состояние:

- `notifyStakeholdersForSectionSignoff` уже пишет action log + копирует ссылку.

Дальше:

- завести `dueAt`, `lastNotifiedAt`, `notifyCount` per role/section;
- показывать в кабинете роли индикатор `Ожидает подтверждения`.

Минимальный data shape (phase1):

- `sectionSignoffReminders[section][role] = { dueAt, lastNotifiedAt, notifyCount }`

---

## 7) План внедрения (очерёдность)

1. **P0**: добавить gate rules в `workshop2-tz-gates.ts` (минимум, логические ошибки, BOM<->конструкция).  
2. **P0**: связать gate errors с disable confirm в `Workshop2TzSectionSignoffStrip.tsx`/`Workshop2Phase1DossierPanel.tsx`.  
3. **P1**: технолог early-stage policy в `Workshop2ArticleWorkspace.tsx`/`workshop2-tz-signatory-options.ts`.  
4. **P1**: reminder-state в досье + индикатор в кабинете роли.  
5. **P2**: расширить preflight/handoff report (`workshop2-tz-trace.ts`) с новыми кодами ошибок.

---

## 8) Acceptance criteria

- Нельзя подтвердить секцию при нарушении минимума.
- Нельзя подписать глобально при логических ошибках материалов/конструкции.
- Для каждой ошибки есть:
  - machine code,
  - понятный текст,
  - ссылка на секцию/поле.
- Визуально:
  - кнопка подтверждения неактивна при недопуске,
  - без текста вида «подпись не действует».

---

## 9) Минимальный тест-пак

- `src/lib/__tests__/workshop2-tz-gates.test.ts`
- `src/lib/__tests__/workshop2-bom-construction-node-integrity.test.ts`
- `src/lib/__tests__/workshop2-mat-sketch-bom-crosscheck.test.ts`
  - `materials_min_count`
  - `composition_sum_100_required`
  - `nodes_min_count`
  - `closure_required`
  - `pocket_requires_description`
  - `node_material_link_missing`
- `src/lib/__tests__/workshop2-tz-section-readiness.test.ts`
  - coverage на визуал минимум (реф/силуэт/цвет/референс цвета)
- `e2e/workshop2-smoke.spec.ts`
  - confirm disabled при ошибках;
  - confirm enabled после фикса.

