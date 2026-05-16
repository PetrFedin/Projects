# Канонический набор research (на чём опираться при работе)

Цель: **одна линия артефактов** без дублирования. Остальное — архив или удаление после переноса полезных фрагментов.

## Оставить как единственную базу (4 + 1 опционально)

| Файл | Роль |
|------|------|
| `FOCUS_ONE_PAGER.md` | Смысл продукта и **три столба** — северная звезда. |
| `GAP_ANALYSIS_USER_FLOW_COLLECTION_B2B_CHAT_CALENDAR.md` | **Процесс vs код**: что есть / частично / нет по вашему сценарию. |
| `PLAN_RESTRUCTURE_THREE_PILLARS.md` | **Как внедрять** сужение (фазы, навигация, критерии). |
| `FINAL_DIAGRAMS_AND_PAGES_RU.md` | **Визуализация + страницы + [Е]/[+]/[↑]** — рабочая карта UI и статусов. |
| `PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md` | *Опционально:* широкий снимок репо и приоритетов; если не нужен — см. архив. |

На этом наборе можно строить roadmap, задачи и демо без чтения остальных файлов.

## Объединить (содержимое уже перекрыто — не вести параллельно)

- `DIAGRAMS_RETAINED_STRUCTURE_MASTER.md` + `DIAGRAMS_RETAINED_SECTIONS_EXTENDED.md` + `VISUAL_INVESTOR_DEMO.md`  
  → **фактически сведены** в `FINAL_DIAGRAMS_AND_PAGES_RU.md`. Новые правки вносить **только** в FINAL (или перенести из старых PATCH-блоков из `VISUALIZATION_COMPLETENESS_PER_MODULE.md` в FINAL и забыть старые).

- `VISUAL_DETAILED_SECTIONS_STATUS.md` и длинный `FUNCTION_SPINE_ROLES_ARTICLE_B2B_CHAT_CALENDAR.md`  
  → пересекаются с **GAP** + **FINAL**. Для «роли и связи» достаточно **GAP**; детальные таблицы разделов — при необходимости **один** раздел в конце GAP или FINAL, не оба длинных файла.

- `INVESTOR_DEMO_VARIANT_THREE_PILLARS.md` + `INVESTOR_IA_CUTLINE.md`  
  → сценарий демо и IA частично в **PLAN** и **FINAL**. Имеет смысл **слить** «скрипт демо» в конец PLAN или в отдельный короткий `INVESTOR_DEMO_SCRIPT.md` (одна страница); IA-таблицы — в FINAL или удалить дубли.

- `KEEP_IMPROVE_OUTOFSCOPE_SCORES.md`  
  → уникальны **оценки 1–10 вне ядра**. Либо **оставить как 5-й канонический** (если часто смотрите внешний периметр), либо **перенести таблицу** в конец `PROJECT_ANALYSIS…` или `FINAL…` и файл убрать.

## Убрать за ненадобностью (после проверки, что нужное перенесено в FINAL/GAP/PLAN)

- `VISUALIZATION_COMPLETENESS_PER_MODULE.md` — аудит полноты схем; после переноса предложенных Mermaid-PATCH в **FINAL** не нужен как постоянный документ.

При желании не удалять, а переместить в `.planning/research/_archive/` (создать папку и `git mv`).

## Рекомендуемая структура папки после уборки

```
.planning/research/
  CANONICAL_RESEARCH_SET.md          ← этот файл (индекс)
  FOCUS_ONE_PAGER.md
  GAP_ANALYSIS_USER_FLOW_COLLECTION_B2B_CHAT_CALENDAR.md
  PLAN_RESTRUCTURE_THREE_PILLARS.md
  FINAL_DIAGRAMS_AND_PAGES_RU.md
  PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md   # опционально
  KEEP_IMPROVE_OUTOFSCOPE_SCORES.md         # опционально, если не влит в другой
  _archive/                                 # всё остальное из списка ниже
```

**В архив перенести (примерный список):**  
`DIAGRAMS_RETAINED_STRUCTURE_MASTER.md`, `DIAGRAMS_RETAINED_SECTIONS_EXTENDED.md`, `VISUAL_INVESTOR_DEMO.md`, `VISUAL_DETAILED_SECTIONS_STATUS.md`, `FUNCTION_SPINE_ROLES_ARTICLE_B2B_CHAT_CALENDAR.md`, `INVESTOR_DEMO_VARIANT_THREE_PILLARS.md`, `INVESTOR_IA_CUTLINE.md`, `VISUALIZATION_COMPLETENESS_PER_MODULE.md` — и при слиянии `KEEP_IMPROVE…` / `PROJECT_ANALYSIS…` тоже.

## Итог одной строкой

**Строить продукт и план:** `FOCUS` + `GAP` + `PLAN` + `FINAL`. Всё остальное — производные или черновики; держать их открытыми параллельно **не нужно**.

## Полнота четырёх файлов

Проверка на предмет «всей нужной детализации» и что дописать: **`AUDIT_FOUR_CANONICAL_COMPLETENESS.md`**.
