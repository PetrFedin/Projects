# Phase 3: Цифровая Примерка (Sample & Fit) - Research

**Researched:** 2026-05-15
**Domain:** 3D Visualization, Computer Vision (AI), CAD Versioning
**Confidence:** HIGH

## Summary
Исследование охватывает инструменты для интеграции 3D-просмотра с поддержкой карт натяжения, обработку изображений с примерки с помощью AI и структуры для контроля версий лекал. Для 3D рекомендуется использовать `three` + `@react-three/fiber` для работы с шейдерами (Tension Maps). Для AI Fit Analyzer целесообразно применять мультимодальные модели (через `@genkit-ai/google-genai` и `@mediapipe/tasks-vision`, которые уже есть в проекте) для анализа заломов. Для CAD Version Control нужна явная связь между `CadVersion` (метаданные лекал в БД/S3) и `FitSession`.

**Primary recommendation:** Использовать `@react-three/fiber` для 3D, Genkit для анализа заломов на фото, и связать `FitSession` с версией лекал (CAD) через обязательный `cadVersionId`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| 3D Viewer & Tension Map | Browser / Client | CDN / Static | Рендеринг 3D GLB/OBJ требует WebGL на клиенте. Ассеты хранятся на CDN (S3). |
| AI Fit Analyzer (Vision) | API / Backend | Browser / Client | Мультимодальный анализ тяжелых фото выполняется на бэкенде (Genkit/Gemini), клиент может делать предобработку (crop/resize) через MediaPipe. |
| CAD Version Control | Database / Storage | API / Backend | Хранение метаданных о версиях DXF/PLT в БД, файлы в S3. Жесткая связь (Foreign Key) с `FitSession`. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | ^0.160.0 | 3D Engine | Индустриальный стандарт для WebGL. |
| `@react-three/fiber` | ^8.15.0 | React 3D Renderer | Декларативный React-интерфейс для Three.js. Позволяет легко применять кастомные шейдеры (Tension Maps). |
| `@react-three/drei` | ^9.96.0 | 3D Helpers | Готовые контролы (OrbitControls), загрузчики (useGLTF), камеры. |
| `dxf-parser` | ^1.1.2 | DXF Parsing | Проверенный парсер для извлечения метаданных из лекал на клиенте/Node.js. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@genkit-ai/google-genai` | ^1.21.0 | Multimodal AI | *Уже в проекте*. Для отправки фото примерки и получения анализа заломов и посадки. |
| `@mediapipe/tasks-vision` | ^0.10.34 | Computer Vision | *Уже в проекте*. Для разметки точек (landmarks/поза) на фото перед отправкой в LLM, если нужно. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@react-three/fiber` | `@google/model-viewer` | `model-viewer` проще во внедрении (веб-компонент), но крайне ограничен в работе с кастомными материалами. Наложить Heatmap/Tension map программно там почти невозможно без форка. |

**Installation:**
```bash
npm install three @react-three/fiber @react-three/drei dxf-parser
npm install -D @types/three
```

## Architecture Patterns

### System Architecture Diagram
(Data flow for Sample & Fit)
1. Конструктор загружает лекала (DXF) -> Сохранение в S3 + БД (`CadVersion`).
2. Образец отшивается -> Создается `FitSession` (с привязкой к `CadVersion`).
3. Примерка -> Загружаются фото образца.
4. Backend (Genkit) анализирует фото -> Возвращает список дефектов посадки (заломы, баланс).
5. 3D-Дизайнер опционально загружает GLB + Tension Map -> Клиент (R3F) рендерит Heatmap поверх аватара для визуальной оценки натяжения ткани.

### Структура CAD Version Control
Для жесткой связки лекал и сессий примерки, структуру `FitGoldSnapshot` и `FitSession` (в `workshop2-article-workspace-fit-gold-panel.tsx`) необходимо расширить:

```typescript
// Новая сущность
interface CadVersion {
  id: string;
  articleId: string;
  versionNumber: number; // v1, v2, v3
  fileUrl: string; // путь к S3 (DXF/PLT)
  createdAt: string;
}

// Расширение FitSession
interface FitSession {
  id: string;
  // ... текущие поля (status, sampleType, measurementsDelta, etc.)
  cadVersionId: string | null; // Ссылка на лекала, по которым сшили этот сэмпл
  aiFitAnalysis?: {
    wrinklesDetected: string[];
    recommendations: string[];
  };
}
```

### Pattern 1: Tension Map (Heatmap) Shader
**What:** Наложение карты натяжения поверх текстуры ткани.
**When to use:** Когда 3D-пакет (CLO3D / Browzwear) экспортирует Tension Map отдельной текстурой (grayscale или RGB), и ее нужно показать в браузере.
**Example:**
```tsx
// Source: @react-three/drei standard patterns
import { useGLTF, useTexture } from '@react-three/drei';

function GarmentMesh({ url, tensionMapUrl }) {
  const { scene } = useGLTF(url);
  const tensionMap = useTexture(tensionMapUrl);
  
  // Применение tension map поверх базового материала
  scene.traverse((child) => {
    if (child.isMesh) {
      // Использование emissiveMap или lightMap для визуализации tension map
      child.material.emissiveMap = tensionMap;
      child.material.emissiveIntensity = 1;
      // В production можно использовать custom shader (ShaderMaterial) для градиента
    }
  });

  return <primitive object={scene} />;
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 3D GLTF/GLB Loading | Custom XHR loaders | `useGLTF` (Drei) | Кэширование, встроенная Draco компрессия, suspense-ready. |
| Computer Vision for wrinkles | Custom CNN models | Genkit (Gemini Pro Vision) | Анализ дефектов посадки по фото требует широкого контекста. Современные мультимодальные LLM справляются с этим "из коробки" лучше, чем узкие CNN, не требуя сбора огромного датасета заломов. |
| DXF Parsing | Regex/String parsing | `dxf-parser` | Формат DXF крайне сложен (ENTITIES, BLOCKS, сплайны). |

## Common Pitfalls

### Pitfall 1: Огромные файлы GLB (Low Performance)
**What goes wrong:** Зависание браузера, долгая загрузка 3D-окна (Out of memory).
**Why it happens:** Экспорт из CLO3D без ретопологии часто содержит миллионы полигонов и 8K текстуры без компрессии.
**How to avoid:** Обязательно использовать Draco-компрессию. В `useGLTF` подключить draco-декодер (`useGLTF(url, true)`). Добавить в пайплайн загрузки валидацию размера файла и полигонажа.

### Pitfall 2: Рассинхрон Fit Session и CAD версий
**What goes wrong:** Дизайнер вносит дельты мерок в `FitSession`, но конструктор перезаписывает лекала (DXF) в старой версии, без создания новой `CadVersion`.
**Why it happens:** Нет жесткой append-only связи в БД.
**How to avoid:** Сделать `cadVersionId` обязательным при создании `FitSession`. Запретить редактировать (mutate) загруженный DXF — только append (v1 -> v2).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Plain Three.js | React Three Fiber | 2021+ | Декларативный 3D-код, легкая интеграция с состоянием (Zustand/Context, как в `article-workspace-context.ts`). |
| Manual Fit Photos | AI-Assisted Fit | 2024+ | Нейросети размечают заломы и дисбаланс на фото, предлагая корректировки (вытачки, баланс плеча) до ручного анализа конструктором. |

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - `react-three-fiber` является стандартом для React. Наличие `genkit` и `mediapipe` в `package.json` делает их идеальным выбором для AI.
- Architecture: HIGH - Хранение версий в S3 + БД с Foreign Key связью соответствует текущей архитектуре монорепо (например, W2 Tech Pack S3 upload).
- Pitfalls: HIGH - Draco-компрессия абсолютно обязательна для Fashion 3D (экспорты CLO3D не оптимизированы для web-рендеринга по умолчанию).

**Research date:** 2026-05-15
**Valid until:** 2026-11-15
