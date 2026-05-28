# JSON Schema: досье разработки коллекции (workshop2) · фаза 1 и каталог атрибутов

| Файл | Назначение |
|------|------------|
| `workshop2-dossier-phase1.json` | Сохраняемое состояние фазы 1: `optionalNote`, `assignments[]` (канон / custom_proposed, `values[]`, `valueSource`). |
| `attribute-catalog.json` | Канон: группы, атрибуты с `type`: `select` \| `multiselect` \| `text` \| `number` (как в `CategoryAttribute`), параметры, `leafBindings`, `globalAttributeIds`. |

## Проверка локально и в CI

```bash
cd _ai-share/synth-1-full
npm run schemas:validate              # JSON + каркас схем
npm run schemas:validate:examples     # ajv: schemas/examples/*.min.json
```

В CI монорепо шаги привязаны к **`_ai-share/synth-1-full`** (единственный фронтенд в репозитории).

Снимок категорий для приложения: `npm run gen:category-catalog` → `src/lib/production/generated/category-handbook.snapshot.json`; импорт в коде — `@/lib/production/category-catalog`.

Инстанс каталога атрибутов (фаза 1 разработки коллекции): `src/lib/production/data/attribute-catalog.instance.json`, загрузка в рантайме — `@/lib/production/attribute-catalog`.

В инстансе и схеме: **`workflowPhases`** `[1|2|3]` у атрибута — на экране фазы 1 показываются только с `1`; **`phase1CoreOrder`** — порядок глобальных полей (страна → сезон → цвет → …); **`leafBindings`** — какие атрибуты подмешиваются по `leafId` (Ур. 1–3 из снимка категорий). Подсказки под «свой атрибут»: **`phase1HintExamples`** у группы.

## Миграция из `CATEGORY_HANDBOOK`

Текущий `src/lib/data/category-handbook.ts`: у листов `attributes?: CategoryAttribute[]` с полем `options?: string[]` без `groupId` и без стабильных `parameterId`.

Рекомендуемый шаг:

1. Завести **группы** (`attributeGroup`) и проставить каждому атрибуту `groupId`.
2. Для каждой строки `options[i]` создать **parameter** с `parameterId` (например `${attributeId}-opt-${i}` или слаг от label) и `label = options[i]`.
3. `type`: `select` если один выбор, `multiselect` если в продукте нужно несколько значений одного атрибута.
4. `leafBindings[leafId] = ['len', 'mat', …]` скопировать с порядком как в текущих `attributes` на листе.
5. `GLOBAL_ATTRIBUTES` → записи в `attributes` + id в `globalAttributeIds`.

После стабилизации JSON каталог можно **генерировать** из TS или наоборот **импортировать** в рантайм (один источник правды — решение команды).

## Связь с кодом приложения

- `phase1.assignments[].attributeId` и `values[].parameterId` должны резолвиться в загруженный **attribute-catalog**.
- Пока каталог живёт только в TS, схемы — **контракт** для будущего API и миграций.

## Следующие шаги (продукт и разработка)

1. **Решить источник правды:** JSON-файл в репо vs генерация из `category-handbook.ts` vs админка + API.
2. **Реализовать хранение** `phase1` на артикуле (расширение `LocalOrderLine` или отдельный ключ в `localStorage` по `collectionId` + `articleId`).
3. **UI фазы 1:** группы из каталога, строки атрибутов, поиск по `parameters[].aliases`, `+ Атрибут`, сохранение в модель по схеме.
4. **«Сформировать ТЗ»:** шаблон документа из `optionalNote` + таблица assignments с `displayLabel`.
5. **Согласование:** статусы и версии ТЗ; связка с этапами Цеха 1 (`tech-pack`, `gate-all-stakeholders`) в данных потока SKU.
6. **CI:** добавить `validate-schemas` в `.github/workflows/ci.yml` после появления примеров или ajv.
