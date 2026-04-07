# Synth-1 — AI Agent Instructions

## Commands (/)
Наберите `/` в Cursor чате — доступны команды из `.cursor/commands/`. Проектные: syntha-design-audit, syntha-b2b-feature, syntha-sync-integration. Общие: lint-fix, code-review, refactor-code и др.

## Design System
Before UI/UX changes: read `STYLE_GUIDE.md` and `design-system/synth-1-fashion-os/MASTER.md`. Use Tailwind classes from STYLE_GUIDE. Cursor rule `ui-ux-design-system` applies to tsx/jsx.

## UI rules (enterprise SaaS layout)
- **Примитивы:** используй `@/components/design-system` — `PageContainer`, `PageHeader`, `SectionContainer`, `DashboardGrid`, `MetricCard`, `AnalyticsCard`, `WidgetContainer`, `ChartCard`, `HistogramCard`, `DataTableContainer`, `FilterToolbar`, `EmptyState`, `LoadingState`, `StatusBadge`. Не плоди одноразовые карточки с новыми тенями/отступами.
- **Токены:** `src/design/tokens.json` + корневой `design-tokens.json`; подробности для агентов: `src/design/UI_RULES.md`.
- **Графики:** только **Recharts** через `ChartCard` / `HistogramCard`; оси и легенда компактные, без декора.
- **Таблицы:** `@tanstack/react-table`, плотные строки, обёртка `DataTableContainer`.
- **Фильтры:** компактный ряд `FilterToolbar` где возможно.
- **Не ломать:** маршруты, навигацию, бизнес-логику; улучшения — инкрементальные обёртками.
- **JOOR + Oracle (fashion B2B enterprise):** полный бриф `src/design/JOOR_ORACLE_ENTERPRISE_UI.md`, правило Cursor `joor-oracle-enterprise-ui`. Плотные дашборды, wholesale/showroom, панели планирования — без «стартап-украшательств».

## Key Refs
- Profile schema: `BRAND_PROFILE_SCHEMA.md`
- Tokens: `src/design/tokens.json`, `design-tokens.json`, `src/design/UI_RULES.md`, `src/design/JOOR_ORACLE_ENTERPRISE_UI.md`, `.ai_context/ui_rules.md`, `.ai_context/joor_oracle_ui_rules.md`
- Layout & widgets: `src/components/design-system/`
- Components: `src/components/ui/` (SectionHeader, StatCard, WidgetCard, etc.)
- Routes: `src/lib/routes.ts` — всегда ROUTES.*, не строки
- B2B types: `src/lib/b2b-features/` — ShipWindow, PriceList, RFQ, Credit
- Integration map: `INTEGRATION_MAP.md` — связи data↔UI, модуль↔модуль

## Conventions
Icons: Lucide only. No emojis. Use `cn()` for class merging. Responsive: 375/768/1024. Drawers: vaul. Container queries: @container.
