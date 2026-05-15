# Roadmap

## Active Milestone: Оживление и Интеллектуализация Блока Разработки (Workshop 2.0)

### Phase 1: Интеллектуализация ТЗ (Tech Pack)
**Goal:** Автоматизация проверок и калькуляции в паспорте артикула.
**Requirements:**
1. **AI Pre-flight Cross-check:** Валидация ТЗ перед отправкой. Нейросеть предупреждает о несоответствиях (например, тонкая ткань + тяжелая игла).
2. **Predictive Costing:** Авто-расчёт предварительной себестоимости (COGS) на основе SASH, узлов и средних цен сырья.
**Plans:** 2 plans
- [ ] 01-01-PLAN.md — AI Pre-flight Cross-check: Умная валидация логики ТЗ
- [ ] 01-02-PLAN.md — Predictive Costing: Авто-расчёт предварительной себестоимости

### Phase 2: Интеграция Снабжения (Supply & Purchasing)
**Goal:** Подключение внешних данных к BOM и экологическая отчетность.
**Requirements:**
1. **B2B Vendor Connect:** API-заглушки или реальные запросы к каталогам поставщиков для Live Stock и Lead Time.
2. **AI Auto-Replenishment:** Автоматические предложения по закупке сырья (с учетом wastage и MOQ) на основе плана заказа (PO).
3. **DPP & Эко-след:** Калькулятор углеродного следа (CO2) и % переработанных материалов.
**Plans:** 3 plans
- [x] 02-01-PLAN.md — B2B Vendor Connect (Live Stock & Lead Time)
- [ ] 02-02-PLAN.md — DPP & Eco-footprint (Углеродный след и вторсырьё)
- [ ] 02-03-PLAN.md — AI Auto-Replenishment (Авто-пополнение сырья)

### Phase 3: Цифровая Примерка (Sample & Fit)
**Goal:** Переход от текстовых правок к визуальному 3D/AI анализу.
**Requirements:**
1. **3D Fit & Avatar Overlay:** Интеграция 3D-вьювера для GLB/OBJ с картой натяжения (Tension Map).
2. **AI Fit Analyzer:** Компьютерное зрение (Vision) для распознавания заломов на фото примерки и рекомендаций по лекалам.
3. **CAD Version Control:** Жесткая связка версий лекал (DXF/PLT) с итерациями сэмпла.
**Plans:** 3 plans
- [ ] 03-01-PLAN.md — CAD Version Control
- [ ] 03-02-PLAN.md — 3D Fit & Avatar Overlay
- [ ] 03-03-PLAN.md — AI Fit Analyzer

### Phase 4: Динамическое Планирование (Order Plan / PO) - Адаптация под Сэмплы
**Goal:** Таймлайны и оценка мощностей для единичных/малых партий (сэмплы, дропы).
**Requirements:**
1. **T&A Timeline (Диаграмма Ганта):** Визуальный календарь критического пути для пошива образцов. От заказа ткани до раскроя и пошива сэмпла.
2. **AI Capacity Planner (Сэмпл-рум):** Оценка загрузки экспериментального цеха/лаборатории и предсказание риска срыва сроков разработки.
*(Массовые заказы и B2B Pre-order Sync перенесены в отдельный контур, так как блок разработки сфокусирован на единичных образцах).*
**Plans:** 2 plans
- [x] 04-01-PLAN.md — T&A Timeline (Диаграмма Ганта для сэмпл-рума)
- [x] 04-02-PLAN.md — AI Capacity Planner (Оценка загрузки и рисков срыва сроков пошива сэмпла)

### Phase 5: Мониторинг Производства (Production / Release)
**Goal:** Трекинг (Shop Floor Control) в реальном времени.
**Requirements:**
1. **MES Barcoding (WIP):** Генерация маршрутных листов (QR/штрихкоды) для трекинга бандлов на планшетах.
2. **Real-time Bottleneck Detection:** Дашборд "узких горлышек" на линии.
3. **Видео-инструкции для швей:** Прикрепление коротких видео (GIF/MP4) к сложным узлам в маршруте.
**Plans:** 3 plans
- [ ] 05-01-PLAN.md — MES Barcoding & Print Layout
- [ ] 05-02-PLAN.md — Video Instructions Integration
- [ ] 05-03-PLAN.md — Real-time Bottleneck Dashboard

### Phase 6: Интеллектуальный ОТК (Quality Control / QC)
**Goal:** Автоматизация поиска брака и рейтинги фабрик.
**Requirements:**
1. **AI Defect Detection:** Нейросеть (Vision AI) для поиска дефектов на фото (строчки, пятна, паттерны).
2. **Интерактивный 3D-пиннинг брака:** Тепловая карта дефектов прямо на 3D-модели в терминале ОТК.
3. **Supplier Scorecard:** Авто-рейтинг фабрик на основе статистики AQL.
**Plans:** 3 plans
- [ ] 06-01-PLAN.md — AI Defect Detection (API endpoint & Genkit Flow)
- [ ] 06-02-PLAN.md — Interactive SVG Pinning & AI Copilot in UI
- [ ] 06-03-PLAN.md — Supplier Scorecard (AQL Recharts Widget)

### Phase 7: Умная Приёмка (Stock / Intake)
**Goal:** Интеграция с B2B/ритейлом и гос. системами.
**Requirements:**
1. **Smart Allocation:** AI-распределение партии (розница, e-com, B2B) по спросу.
2. **Compliance Sync:** Генерация кодов маркировки (Честный ЗНАК) и таможенных деклараций на основе состава.
3. **RFID Auto-Intake:** Массовое сканирование коробок и сверка с PO.
**Plans:** 4 plans

Plans:
- [ ] 07-01-PLAN.md — Define core interfaces and test skeletons (Wave 0)
- [ ] 07-02-PLAN.md — Implement Smart Allocation Engine (Wave 1)
- [ ] 07-03-PLAN.md — Implement Compliance Sync (Wave 1)
- [ ] 07-04-PLAN.md — Implement RFID Auto-Intake Client & Reconciliation (Wave 2)


## Backlog

### Phase 999.1: Боевой PO ↔ ядро №1 (матрица, stepId, бандл) (BACKLOG)

**Goal:** Связать заказы поставщику (PO) из ERP/внешнего API с единым контуром ядра №1.

**Requirements (черновик для promote):**

1. **Контракт API:** CRUD и статусы PO.
2. **Маппинг:** PO ref → `stepId` каталога.
3. **Расхождения:** явная обработка черновика в бандле vs подтверждённого PO в ERP.
4. **Порядок внедрения:** стабильный UX -> боевой API.

**Plans:** 0 plans
