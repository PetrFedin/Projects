# ADR 001: Расширение контура Workshop2 (Фаза C — Enterprise)

## Статус
**Предложено** (Proposed)

## Контекст
Контур формирования ТЗ для фабрики (Workshop2, фаза 1) успешно запущен и покрывает базовые потребности (гейты, BOM ↔ скетч, подписи, лекала). Однако для масштабирования на международные производства (Азия, Восточная Европа) и для бесшовной интеграции с финансовым (Costing) и контрольным (Fit-цепочка) контурами требуется расширение доменной модели.

Мы планируем переход к Фазе C (Enterprise-слой), которая включает:
1. **Двуязычный factory bundle (RU+EN)** — экспорт единого пакета (PDF/HTML/ZIP) с глоссарием и переведенными терминами, чтобы снизить количество ошибок перевода на стороне фабрики.
2. **Fit-цепочка** — связывание комментариев, статусов и решений по примеркам (Proto, SMS, PPS) с конкретными строками табеля мер и узлами в ТЗ.
3. **3D-вложения (GLTF/OBJ)** — поддержка 3D-файлов как ссылок/рендер-превью в tech pack (без сложного встроенного редактора, только просмотр и передача).
4. **Углубленная интеграция Costing (Landed cost)** — прямая связь строки BOM (где указан расход `yieldPerUnit` и цена) со сценариями себестоимости фабрики.

В соответствии с правилами монорепозитория (`AGENTS.md`), любые изменения доменной логики и API-контрактов должны сопровождаться ADR.

## Решение и архитектура

### 1. Двуязычный Factory Bundle
Досье и справочники должны поддерживать билингвальный контекст. В `Workshop2FinalTzSpecExport` мы вводим возможность генерации бандла в смешанном режиме или с выбором языка.

**Изменения в данных (BFF):**
Справочник категорий и атрибутов будет отдавать переводные поля. В досье сохраняется предпочитаемый язык экспорта (по умолчанию `ru`, опционально `ru_en`).

### 2. Fit-цепочка (Образцы и примерки)
Потребуется новый модуль `fit-session`, который будет привязываться к `Workshop2DossierPhase1`.

**Доменные сущности:**
- `FitSession`: привязка к `articleId` и `dossierId`. Включает тип образца (`Proto`, `SMS`, `PPS`), статус, дату, список замечаний.
- `FitComment`: связь с конкретным полем (например, измерением `chest` в табеле мер) и фото-отчетами.

### 3. 3D-вложения
Расширяем блок CAD / вложений в досье. GLTF/OBJ файлы будут грузиться в S3 (аналогично текущим CAD-файлам), а в UI будет отображаться `model-viewer` или превью.

### 4. Углубленная интеграция Costing
Добавляем API-мост между `Workshop2DossierPhase1.productionModel` (где лежит BOM) и модулем `/brand/finance/landed-cost`. Каждая строка BOM получает `targetCost` и `actualCost`, которые синхронизируются с costing-калькулятором.

## Контракты API (v1 Extensions)

Мы расширяем существующий B2B API для поддержки новых фич.

```typescript
// 1. Двуязычный экспорт
// GET /api/brand/workshop2/phase1-dossier/final-export-document?lang=ru_en

// 2. Fit Session API
export type FitSessionDto = {
  id: string;
  articleId: string;
  sampleType: 'proto' | 'sms' | 'pps' | 'top';
  status: 'pending' | 'approved' | 'rejected' | 'approved_with_comments';
  dateStr: string;
  measurementsDelta: Record<string, number>; // Отклонение от базы (напр. chest: +2)
  comments: {
    id: string;
    targetAnchor: string; // ссылка на часть ТЗ, напр. 'w2-measurements-fields'
    text: string;
    photoUrls: string[];
  }[];
};

// GET /api/brand/workshop2/fit-sessions?articleId={id}
// POST /api/brand/workshop2/fit-sessions

// 3. Расширение BOM для Costing
export type BomLineCostingExtensionDto = {
  bomLineId: string;
  yieldPerUnit: number; // Расход
  yieldUnit: string;
  unitCostNet: number;  // Чистая цена за единицу
  landedCost: number;   // Цена с учетом логистики/пошлин
  currency: string;
};

// GET /api/brand/finance/costing/bom-estimate?articleId={id}
// PATCH /api/brand/workshop2/phase1-dossier/bom-costing
```

## Последствия (Consequences)
**Положительные:**
- Производственный пакет становится понятным зарубежным партнерам без ручного перевода.
- Замыкается цикл разработки: от скетча до готового образца (Fit) и расчета экономики (Costing).
- 3D-рендеры повысят качество понимания конструкции фабрикой.

**Отрицательные / Риски:**
- Усложнение UI (потребуются вкладки или переключатели языков).
- Риск расхождения данных между Costing и BOM, если синхронизация не будет строгой (требуется event-driven подход или жесткий API-контракт).
- Требуется поддержка 3D-вьювера в браузере (увеличение бандла фронтенда).

## План внедрения
1. Завести типы и DTO в `src/lib/production/` (FitSession, CostingExtension).
2. Реализовать `model-viewer` для 3D файлов в компоненте CAD.
3. Доработать функцию экспорта `workshop2-final-tz-spec-export.ts` для поддержки словаря переводов (i18n).
4. Настроить мок-API и E2E тесты перед интеграцией с реальным бэкендом.
