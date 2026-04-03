# Task Queue — задачи из TODO/FIXME

Задачи вынесены из кодовой базы. Обновлять по мере выполнения.

## Backend

| Источник | Задача | Приоритет |
|----------|--------|-----------|
| `app/ai/modules/__init__.py` | Реализовать collection_analyzer | medium |
| `app/ai/modules/__init__.py` | Реализовать sku_performance_predic tor | medium |
| `app/ai/modules/__init__.py` | Реализовать order_validator_ai | medium |
| `app/ai/modules/__init__.py` | Реализовать trend_radar | medium |
| `app/ai/modules/__init__.py` | Реализовать brand_scoring_engine | medium |
| `app/api/v1/endpoints/brand.py` | Загружать brand из DB по brand_id/org | high |
| `app/api/v1/endpoints/brand.py` | Агрегировать метрики из orders, retailers, compliance | medium |
| `app/api/v1/endpoints/brand.py` | Интеграция Ozon API | low |
| `app/services/organization_health_service.py` | team_count из staff/team API | medium |
| `app/services/audit_service.py` | Ping LLM provider для ai_layer статуса | low |
| `app/services/logistics_service.py` | Сохранять cdek_order_uuid при создании shipment | medium |
| `app/db/models/collaboration.py` | Уточнить enum (todo, in_progress, done, cancelled) | low |

## Продукт: ТЗ и визуал для производства (synth-1 / Цех 2)

**Цель:** при подготовке ТЗ показывать **3D-сэмпл** (одежда / обувь / аксессуары) с **вращением ~360°** и **метками с комментариями**, чтобы цех однозначно понимал, о какой детали речь (согласуется с волной «визуализация ТЗ», не блокирует текущий 2D-скетч в досье).

| Этап | Что сделать | Заметки |
|------|-------------|---------|
| 1. Спайк | Встроить просмотр **GLB/GLTF** (`<model-viewer>` или Three.js / R3F), одна тестовая модель на категорию | Проверка perf на мобильных, жесты вращения |
| 2. Данные | Модель хранения: `assetId`, **ревизия** (как у ТЗ), массив **hits**: позиция на меши (raycast → local/world + нормаль опционально), `text`, автор, время | Версия модели обязательна, иначе метки «уезжают» |
| 3. UI | Режим «поставить метку» → клик по поверхности → панель текста; список меток; фильтр по зоне/тегу | Дублировать краткий список для мастера |
| 4. Ассеты | Low-poly манекен / колодка / форма сумки **по L1** или загрузка своего GLB бренда | Лицензии; fallback — несколько фиксированных ракурсов 2D |
| 5. Интеграция | Привязка к **артикулу/досье Цеха 2**, экспорт в сводку ТЗ / передача на фабрику | См. также ревизии ТЗ и аудит согласований |

**Компромисс на старт:** если 3D задерживается — **4–6 ракурсов** (рендеры) с метками в координатах **каждого ракурса**; позже миграция в единый 3D.

**Связь с кодом:** текущая доска «Скетч по категории» (`CategorySketchAnnotator`, 2D + localStorage) — прототип логики меток; 3D-слой заменит или дополнит подложку.

## Выполнено

- assortment_ai подключён к API (`/ai/assortment/optimize`, `/ai/assortment/size-curve`)
- Showrooms: attach-asset через ShowroomService (убран прямой импорт db.models)
- Gemini: поддержка GEMINI_API_KEY, реальные вызовы при наличии ключа
- UI: responsive breakpoints в error.tsx, not-found.tsx
