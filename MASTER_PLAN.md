# MASTER_PLAN.md — Ультимативная Fashion OS Synth-1 (v88.0)

## 1. СТРАТЕГИЧЕСКАЯ ЦЕЛЬ: GLOBAL FASHION INTELLIGENCE ECOSYSTEM
Synth-1 — это **единая интеллектуальная среда**, объединяющая дизайн, производство, опт (B2B), ритейл (B2C), финтех и клиента. Платформа работает на принципе **Unified Context**, исключая потерю данных на каждом этапе жизненного цикла продукта.

---

## II. TECHNICAL ARCHITECTURE (STABILIZED FOUNDATION)
1.  **RBAC 2.0:** Строгая типизация ролей через `UserRole` Enum и декларативная защита эндпоинтов через `check_permissions`.
2.  **Multitenancy:** Автоматическая фильтрация БД-запросов на уровне Repository Pattern по `organization_id`.
3.  **Standardized API:** Использование `GenericResponse[T]` для всех ответов и глобальная обработка исключений (`SynthBaseException`).
4.  **Observability:** Request ID и Logging Middleware для прослеживаемости каждого запроса.
5.  **AI Orchestration:** Единый LLM Router с поддержкой кэширования и семантического поиска (RAG).
6.  **Service Layer:** Централизованная бизнес-логика в `app/services/` (например, `RuleEngine`).

## III. USER ROLES & ACCESS MATRIX
- **Platform Admin:** Глобальный контроль, биллинг, системные настройки.
- **Brand Admin:** Управление брендом, командой, интеграциями.
- **Sales Rep:** Ведение оптовых заказов, презентация шоурумов.
- **Buyer:** Просмотр коллекций, создание черновиков заказов (Draft Orders).
- **Merchandiser:** Управление ассортиментом, техпакетами и BOM.
- **Planner:** Прогнозирование спроса и контроль бюджетов.

## I. BRAND & PLM (1-65)
1.  **Создание Tech Pack:** Выбор типа изделия. (РЕАЛИЗОВАНО: Tech Pack Core)
2.  **BOM (Bill of Materials):** Выбор основной ткани. (РЕАЛИЗОВАНО: Micro-BOM)
3.  **BOM:** Выбор подкладочной ткани. (РЕАЛИЗОВАНО)
4.  **BOM:** Учет расхода ниток на единицу. (РЕАЛИЗОВАНО)
5.  **BOM:** Выбор фурнитуры (пуговицы, молнии). (РЕАЛИЗОВАНО)
6.  **BOM:** Учет этикеток и составников. (РЕАЛИЗОВАНО)
7.  **Grading:** Задание базового размера. (РЕАЛИЗОВАНО)
8.  **Grading:** Матрица прибавок для S, M, L, XL. (РЕАЛИЗОВАНО)
9.  **Grading:** Авто-генерация табеля мер (Measurement Chart). (РЕАЛИЗОВАНО)
10. **Construction:** Загрузка схем швов. (РЕАЛИЗОВАНО)
11. **Construction:** Описание обработки низа/горловины. (РЕАЛИЗОВАНО)
12. **3D Asset:** Привязка ссылки на CLO3D файл. (РЕАЛИЗОВАНО)
13. **3D Asset:** Просмотр 3D-вьювера в браузере. (РЕАЛИЗОВАНО)
14. **Digital Swatches:** Создание палитры цветов (Pantone/TCX). (РЕАЛИЗОВАНО)
15. **Digital Swatches:** Загрузка сканов текстур. (РЕАЛИЗОВАНО)
16. **Sampling:** Заказ Prototype 1 (макет). (РЕАЛИЗОВАНО)
17. **Sampling:** Приемка Prototype 1 (фото/комментарии). (РЕАЛИЗОВАНО)
18. **Sampling:** Заказ Prototype 2 (из основной ткани). (РЕАЛИЗОВАНО)
19. **Sampling:** Заказ SMS (Salesman Sample). (РЕАЛИЗОВАНО)
20. **Sampling:** Утверждение Golden Sample (эталон). (РЕАЛИЗОВАНО)
21. **Fit Comments:** Инструмент "карандаш" на фото примерки. (РЕАЛИЗОВАНО: Interactive Fit Review)
22. **Fit Comments:** Голосовые заметки к правкам. (РЕАЛИЗОВАНО)
23. **Range Planning:** Создание матрицы коллекции. (РЕАЛИЗОВАНО: Smart Range Planner)
24. **Range Planning:** Распределение Drop 1, Drop 2. (РЕАЛИЗОВАНО: Drop Management)
25. **Range Planning:** Цветовая карта коллекции (Color Story). (РЕАЛИЗОВАНО)
26. **Merchandise Grid:** Расчет баланса Top/Bottom. (РЕАЛИЗОВАНО: AI Merchandise Grid)
27. **Target Costing:** Калькулятор плановой себестоимости. (РЕАЛИЗОВАНО: Advanced Costing Engine)
28. **Target Costing:** Расчет наценки (Markup) для опта и розницы. (РЕАЛИЗОВАНО)
29. **Budgeting:** Лимит бюджета на закупку сырья. (РЕАЛИЗОВАНО: Budget Control)
30. **Budgeting:** Лимит бюджета на пошив. (РЕАЛИЗОВАНО)
31. **DAM:** Загрузка Lookbook (Hi-res). (РЕАЛИЗОВАНО: AI Lookbooks)
32. **DAM:** AI Packshot Manager (Background Removal & 360° support). (РЕАЛИЗОВАНО: DAM Engine v1)
33. **DAM:** Хранилище видео-контента (Reels/Shorts/360°). (РЕАЛИЗОВАНО: MediaAsset v1)
34. **DAM:** Авто-генерация водяных знаков и защита контента. (РЕАЛИЗОВАНО: Watermark Engine)
35. **Wholesale:** Linesheet Generator (PDF). (РЕАЛИЗОВАНО)
36. **Wholesale:** Order Rules Engine (MOQ/Limits). (РЕАЛИЗОВАНО)
37. **Showroom:** Digital Showroom 360 (VR integration). (РЕАЛИЗОВАНО)
38. **Dashboard:** Role-based Dashboard KPIs. (РЕАЛИЗОВАНО)
39. **Profiles:** Total Vertical Integration (Role-specific navigation & access). (РЕАЛИЗОВАНО)
40. **AI Studio:** Генерация постов для соцсетей. (РЕАЛИЗОВАНО: Content Agent)
41. **AI Studio:** Перевод описаний на 5+ языков. (РЕАЛИЗОВАНО)
42. **Brand Page:** Конструктор "О бренде".
43. **Brand Page:** Виджет "Наши ценности".
44. **Social CMS:** Ссылка на Instagram/TikTok бренда.
45. **Influencer CRM:** База инфлюенсеров. (РЕАЛИЗОВАНО)
46. **Influencer CRM:** Трекинг выданных вещей. (РЕАЛИЗОВАНО: Advanced Influencer CRM)
47. **Influencer CRM:** Расчет ROI посевов. (РЕАЛИЗОВАНО: Influencer ROI 2.0)
48. **PR Sample Control:** QR-коды для образцов. (РЕАЛИЗОВАНО)
49. **PR Sample Control:** Трекинг возвратов из редакций. (РЕАЛИЗОВАНО)
50. **Compliance:** Загрузка EAC сертификатов. (РЕАЛИЗОВАНО)
51. **Compliance:** Привязка сертификатов к моделям. (РЕАЛИЗОВАНО)
52. **Inventory:** Учет сырья на складе бренда. (РЕАЛИЗОВАНО: Material Inventory)
53. **Inventory:** Резервирование ткани под коллекцию. (РЕАЛИЗОВАНО: AI Material Reservation)
54. **Inventory:** Списание ткани по факту раскроя. (РЕАЛИЗОВАНО)
55. **Analytics:** Sell-through по категориям. (РЕАЛИЗОВАНО)
56. **Analytics:** Отчет по возвратам (причины брака). (РЕАЛИЗОВАНО)
57. **Analytics:** Анализ скорости оборачиваемости (Weeks of Cover). (РЕАЛИЗОВАНО)
58. **Collaboration:** Создание совместного проекта с другим брендом. (РЕАЛИЗОВАНО: Collaborative Design)
59. **Collaboration:** Разделение прав доступа к техкартам. (РЕАЛИЗОВАНО)
60. **Academy:** Загрузка инструкций для продавцов бренда. (РЕАЛИЗОВАНО)
61. **Academy:** Тесты на знание коллекции. (РЕАЛИЗОВАНО)
62. **Customer Feedback:** Анализ NPS по бренду. (РЕАЛИЗОВАНО: Feedback Analytics)
63. **Sustainability:** Расчет углеродного следа единицы. (РЕАЛИЗОВАНО: Product LCA)
64. **Sustainability:** Паспорт переработки (Recycle Info). (РЕАЛИЗОВАНО)
65. **Versioning:** История изменений техкарты. (РЕАЛИЗОВАНО: Audit Trail & Versioning)

---

## SYSTEM INTEGRATION (Connective Tissue)
1.  **AI Rule Engine Integration:** Cross-module events (Production -> Collaboration) automatically trigger tasks. (РЕАЛИЗОВАНО)
2.  **Vertical Domain Services:** Marketing, Pricing, and VMI sections are backed by real backend services. (РЕАЛИЗОВАНО)
3.  **Horizontal Data Flow:** Collection planning (Drops) automatically creates inventory replenishment tasks. (РЕАЛИЗОВАНО)
2.  **Horizontal Integration:** API links between Dashboard, PIM, DAM, and Wholesale. (РЕАЛИЗОВАНО)
3.  **Unified Auth Context:** Shared state between legacy mock auth and FastAPI JWT. (РЕАЛИЗОВАНО)
4.  **Real-time KPIs:** Cross-module metrics aggregation in Dashboard. (РЕАЛИЗОВАНО)

---

## РЕЕСТР ТЕКУЩЕЙ РЕАЛИЗАЦИИ (Status Audit):
*   **РЕАЛИЗОВАНО (Backend & Base Logic):** PIM-центр, ATS инвентарь, B2B Portal, Matrix Order, VR Showroom 360, AI Body Scanner, EDO Sync, Marking Hub, Landed Cost Engine, AI SKU Planner, Tech Pack Core, PR Sample Control, Escrow Milestone Engine, Global Duty Engine, Digital Product Passport, Clienteling 2.0, AI Content Factory, Editorial CMS, Headless Commerce API, Smart Fitting Rooms, Dynamic ESL Sync, Shadow Inventory, Blockchain IP Ledger, RFID Warehouse Gates, IoT Machine Monitoring, AI Content Factory, Mass Customization Hub, Circular Economy Hub, AI Quota Allocator, Roadmap Agent, Gift Registry, BOPIS Hub, Social Investing, Digital Twin Testing, Footfall AI, AR Navigation, Global Risk Dash, AI Lookbooks, Smart Wardrobe, HS Auto-Coder, Design Copyright, Supply Chain Debugger, **Wholesale MCQ/B2B Discounts/Seasonal Credits (P3)**, **Staff Training & Replenishment (P3)**, **Store Expenses & Profitability (P3)**, **Multi-party Split Payments (P3)**, **Supplier Database & Material Orders (P3)**, **Global Expansion Dash (P4)**, **Predictive Production 2.0 (P4)**, **Circular Subscription Rental (P4)**, **BOM Details & Construction (P5)**, **Supply Chain RFQ & Invoicing (P5)**, **QC Checklist & ESG Metrics (P5)**, **Retail Sync & Staffing (P5)**, **B2C Wishlists & Referrals (P5)**, **Brand Marketing (Color Stories/Markups) (P5)**, **Advanced Logistics (Packing/Labels) (P5)**, **Wholesale B2B CRM (Chat/Audit) (P5)**, **Retail CX (Repairs/Bookings) (P5)**, **B2C Engagement (Subscriptions/UGC) (P5)**, **Global Compliance (Customs/EAC) (P7)**, **Advanced AI Creative (Virtual Shows) (P7)**, **Fintech 2.0 (Factoring/Insurance) (P7)**, **Sustainability Deep Audit (LCA/Trace) (P8)**, **Academy & Knowledge Hub (P8)**, **Advanced AI Sourcing (P8)**, **AI Merchandise Grid & Budgeting (P9)**, **Advanced Target Costing (P9)**, **Influencer ROI 2.0 (P9)**, **AI Studio Tools (P10)**, **SEO Copywriting (P10)**, **Drop Management (P10)**, **Interactive Fit Review (P11)**, **Budgeting & Control (P11)**, **Advanced Influencer CRM (P11)**, **Collaborative Design (P12)**, **Advanced Supply Chain 2.0 (P12)**, **Retail Staff Gamification 2.0 (P12)**, **Audit Trail & Versioning (P13)**, **Customer Feedback Analytics (P13)**, **AI Material Reservation (P13)**,     **System Registry & Project Brain (P14)**, **Audit & Health Services (P14)**, **Project Registry Core (P14)**, **Project Health Dashboard (P14)**, **Production PLM Layer (Sourcing/TechPack/Sampling/Collab) (P15)**, **Team Collaboration System (Notifications/Tasks) (P16)**, **Collection Management (Drops/Range Planning/Merch Grid) (P17)**, **Advanced PLM (RFQ/AQL/Variance/Delay Prop) (P18)**.
*   **ПЛАН (Core Expansion):** Расширение 420+ функций согласно новому детализированному списку.
