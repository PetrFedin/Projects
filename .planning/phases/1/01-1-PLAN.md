---
phase: 01-1-smart-handbooks
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - _ai-share/synth-1-full/src/lib/data/category-handbook.ts
  - _ai-share/synth-1-full/src/lib/data/production-params.ts
  - _ai-share/synth-1-full/src/lib/production/workshop-size-handbook.ts
  - _ai-share/synth-1-full/src/lib/production/category-leaf-handbook-checklist.ts
autonomous: true
requirements: ["Smart Dimensions Matrix", "Category-Aware Attributes", "Расширение справочников"]
must_haves:
  truths:
    - User creating a tech pack sees only attributes and dimensions relevant to the selected L3 category and audience.
    - Handbooks are exhaustive and prevent combinations that make no physical sense.
  artifacts:
    - path: _ai-share/synth-1-full/src/lib/data/category-handbook.ts
      provides: Expanded category ontology
    - path: _ai-share/synth-1-full/src/lib/data/production-params.ts
      provides: Detailed parameter sets per category
  key_links:
    - from: category-leaf
      to: production-params
      via: L3 category mapping
---

<objective>
Провести полную ревизию и расширение справочников (Категории L1-L3, Аудитории, Шкалы размеров, Точки измерений). Создать интеллектуальный маппинг, который будет автоматически подбирать релевантный набор атрибутов и точек измерения в зависимости от выбранного узла справочника.
</objective>

<execution_context>
@.cursor/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/ROADMAP.md
@_ai-share/synth-1-full/src/lib/data/category-handbook.ts
@_ai-share/synth-1-full/src/lib/data/production-params.ts
@_ai-share/synth-1-full/src/lib/production/workshop-size-handbook.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Аудит и расширение категорийного дерева (L1-L3)</name>
  <files>_ai-share/synth-1-full/src/lib/data/category-handbook.ts</files>
  <action>
    Проверить дерево категорий для всех аудиторий (Мужчины, Женщины, Дети, Унисекс). Убедиться, что учтены все основные группы товаров: Одежда (включая белье, купальники), Обувь, Сумки, Головные уборы, Аксессуары. Добавить недостающие узлы L3 (например, разделить обувь на зимнюю, летнюю, спортивную, если это необходимо для атрибутов).
  </action>
  <verify>
    <automated>npm run typecheck:w2 --prefix _ai-share/synth-1-full</automated>
  </verify>
</task>

<task type="auto">
  <name>Task 2: Обогащение базы производственных параметров (Production Params)</name>
  <files>_ai-share/synth-1-full/src/lib/data/production-params.ts</files>
  <action>
    Расширить объект `PRODUCTION_PARAMS_BY_CATEGORY`. Создать уникальные наборы `dimensionPoints` (точки измерения) для всех основных типов изделий:
    - Плечевые изделия (куртки, рубашки, платья)
    - Поясные изделия (брюки, юбки)
    - Обувь (длина стопы, полнота колодки, высота голенища)
    - Сумки (высота, ширина, глубина, длина ручек)
    - Головные уборы (обхват головы, глубина)
    Привязать специфичные атрибуты (например, "Тип подошвы" для обуви, "Тип крепления ручек" для сумок).
  </action>
  <verify>
    <automated>npm run typecheck:w2 --prefix _ai-share/synth-1-full</automated>
  </verify>
</task>

<task type="auto">
  <name>Task 3: Интеллектуальный маппинг (Category-Aware Auto-selection)</name>
  <files>
    - _ai-share/synth-1-full/src/lib/production/workshop-size-handbook.ts
    - _ai-share/synth-1-full/src/lib/production/category-leaf-handbook-checklist.ts
  </files>
  <action>
    Реализовать функции-селекторы, которые принимают `HandbookCategoryLeaf` (l1, l2, l3, audience) и возвращают точный набор шкал (`sizeScales`) и точек измерений (`dimensionPoints`). Улучшить функцию `handbookCatL1FromLeaf` для точного определения профиля изделия вплоть до уровня L2/L3, а не только L1.
  </action>
  <verify>
    <automated>npm run typecheck:w2 --prefix _ai-share/synth-1-full</automated>
  </verify>
</task>

</tasks>

<verification>
Убедиться, что при создании ТЗ для "Сумки -> Рюкзаки" система предлагает параметры габаритов сумки, а не длину рукава.
</verification>

<output>
After completion, create `.planning/phases/1/01-1-SUMMARY.md`
</output>