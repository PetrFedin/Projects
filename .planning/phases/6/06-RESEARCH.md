# Phase 6: Интеллектуальный ОТК (Quality Control / QC) - Research

**Researched:** 2026-05-15
**Domain:** Quality Control, Computer Vision, 3D/2D Annotation, Supplier Analytics
**Confidence:** HIGH

## Summary

Фаза 6 направлена на автоматизацию контроля качества (ОТК) с использованием компьютерного зрения, улучшение визуальной фиксации дефектов и агрегацию данных для оценки поставщиков. Текущая реализация (`workshop2-article-workspace-qc-panel.tsx` и `workshop2-qc-visual-inspection.tsx`) уже поддерживает ручное управление партиями, расчет AQL и базовый 2D-пиннинг дефектов точками.

**Primary recommendation:** Использовать уже интегрированный Genkit (Gemini 1.5 Flash/Pro) для zero-shot распознавания дефектов на фото, расширить текущий 2D-пиннинг до SVG-полигонов (с опциональным 3D через `@react-three/fiber` для GLB-моделей) и создать read-model для Supplier Scorecard с визуализацией через Recharts.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| **AI Defect Detection** | API / Backend | External AI (Genkit/Gemini) | Тяжелая обработка изображений и вызов LLM/VLM должны происходить на сервере для безопасности и скорости. |
| **3D/SVG Pinning UI** | Browser / Client | — | Интерактивное позиционирование пинов, raycasting (3D) и рендеринг SVG требуют работы с DOM/WebGL на клиенте. |
| **Supplier Scorecard** | API / Backend | Browser (Recharts) | Агрегация статистики по AQL сотен партий должна выполняться на сервере (read-model), клиент только рендерит графики. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `genkit` + `@genkit-ai/google-genai` | ^1.21.0 | AI Defect Detection | Уже настроен в `src/ai/genkit.ts`. Gemini 1.5 Flash отлично справляется с multimodal задачами (zero-shot поиск дефектов). |
| `recharts` | ^2.15.1 | Supplier Scorecard Charts | Стандарт проекта (согласно `AGENTS.md`). Используется для дашбордов и аналитики. |

### Supporting (для 3D пиннинга - опционально)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@react-three/fiber` | ^8.15.0 | 3D Canvas | Если требуется рендеринг GLB/OBJ моделей для 3D-пиннинга. |
| `@react-three/drei` | ^9.100.0 | 3D Helpers | Для аннотаций (`<Html>`) поверх 3D модели. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Genkit (Gemini) | AWS Lookout for Vision | AWS Lookout требует сбора датасета и обучения кастомной модели под конкретные дефекты фабрики. Gemini работает "из коробки" (zero-shot), но может уступать в специфичных микро-дефектах. Рекомендуется начать с Gemini. |
| 3D Pinning | SVG Overlays (2D) | 3D требует наличия GLB-модели для каждого артикула и тяжелее для мобильных терминалов ОТК. SVG-полигоны поверх фото/скетча работают везде и уже частично реализованы. |

## Architecture Patterns

### System Architecture Diagram: AI Defect Detection Flow

```text
[Mobile QC Terminal] 
       │ (1. Uploads defect photo & batch ID)
       ▼
[Next.js API Route: /api/brand/workshop2/qc/detect]
       │ (2. Presigned S3 upload & trigger flow)
       ▼
[Genkit Flow: detect-defects-flow]
       │ (3. Sends image + prompt to Gemini 1.5 Flash)
       ▼
[Gemini 1.5 Multimodal]
       │ (4. Returns JSON: { defects: [{ type, description, boundingBox }] })
       ▼
[Next.js API Route]
       │ (5. Updates bundle.qc.batches with new pins)
       ▼
[QC Panel UI] (Auto-updates via React state/SWR)
```

### Pattern 1: SVG-based 2D Pinning (Улучшение текущего UI)
**What:** Переход от абсолютного позиционирования `<div>` к `<svg>` overlay для поддержки полигонов и линий (например, выделение кривого шва линией, а не точкой).
**When to use:** Для разметки фото с мобильного терминала или плоских скетчей.

### Pattern 2: Supplier Scorecard Read-Model
**What:** Агрегирующая read-model, которая собирает данные из `bundle.qc.batches` всех досье фабрики.
**When to use:** Для построения рейтингов поставщиков (AQL Pass Rate, Rework Rate).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 3D Raycasting | Кастомная математика пересечений | `@react-three/fiber` (onClick event) | R3F из коробки отдает координаты точки клика на меше (`event.point`), что делает 3D-пиннинг тривиальным. |
| AI Image Analysis | Свои CNN модели (YOLO) | Genkit (Gemini 1.5) | Разметка датасета и деплой YOLO займут недели. Gemini 1.5 Flash дает результат сразу по промпту. |

## Common Pitfalls

### Pitfall 1: Отсутствие 3D моделей для пиннинга
**What goes wrong:** ОТК не может зафиксировать брак, так как для артикула не загружена 3D-модель.
**Why it happens:** Не все артикулы проходят полноценную 3D-разработку (Phase 3).
**How to avoid:** Всегда иметь fallback на 2D-пиннинг (SVG поверх фото или плоского технического эскиза). Текущий `Workshop2QcVisualInspection` уже использует `categorySketchImageDataUrl` как fallback.

### Pitfall 2: Галлюцинации Vision AI
**What goes wrong:** Нейросеть находит дефекты там, где их нет (блики света, складки ткани).
**Why it happens:** Zero-shot модели могут ошибаться на специфичных материалах.
**How to avoid:** AI должен работать в режиме **"Copilot"**, а не авто-реджекта. AI предлагает пины (bounding boxes), инспектор ОТК подтверждает или удаляет их одним кликом.

### Pitfall 3: Производительность 3D на мобильных терминалах
**What goes wrong:** Планшет инспектора в цеху тормозит при открытии 3D-модели.
**Why it happens:** Тяжелые GLB файлы с текстурами высокого разрешения.
**How to avoid:** Использовать сжатие Draco для GLB моделей и ограничивать DPR (device pixel ratio) в `<Canvas>` для мобильных устройств.

## Open Questions

1. **Глубина интеграции 3D**
   - What we know: В roadmap заявлен "Интерактивный 3D-пиннинг брака".
   - What's unclear: Будет ли 3D-модель (GLB) гарантированно присутствовать в досье на этапе ОТК?
   - Recommendation: Реализовать гибридный компонент: если есть `dossier.model3dUrl` — рендерить `<Canvas>` (R3F), иначе — рендерить текущий 2D `<svg>` overlay.

2. **Формат Supplier Scorecard**
   - What we know: Нужен авто-рейтинг на основе AQL.
   - What's unclear: Где именно он должен отображаться (в карточке контрагента, на дашборде производства или в отдельном отчете)?
   - Recommendation: Создать переиспользуемый виджет `SupplierQcScorecard` (на базе `WidgetContainer` и `ChartCard`), который можно встроить как в профиль фабрики, так и в Control Center.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V4 Access Control | yes | Доступ к добавлению/удалению пинов брака должен быть только у роли `qc_inspector` или `production_manager`. |
| V5 Input Validation | yes | Валидация координат пинов (x,y) и загружаемых фото (размер, формат) через Zod. |

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Genkit и Recharts уже являются стандартами проекта.
- Architecture: HIGH - Гибридный подход (2D fallback + AI Copilot) минимизирует риски внедрения.
- Pitfalls: HIGH - Опирается на реальный опыт внедрения Vision AI в производстве.

**Research date:** 2026-05-15
**Valid until:** 2026-06-15
