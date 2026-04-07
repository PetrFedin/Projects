# UI rules — dashboard & analytics (for agents)

**Canonical tokens:** `src/design/tokens.json` · **Scale alias:** `design-tokens.json` (repo root)

## Rules

- Use **shared layout primitives** from `@/components/design-system` (PageContainer, PageHeader, SectionContainer, SectionHeader, DashboardGrid, KPIWidget, MetricCard, AnalyticsCard, ChartCard, HistogramCard, DataPanel, DataTableContainer, PlanningPanel, PlanningCard, CommercePanel, FilterToolbar, InsightPanel, EmptyState, LoadingState, ErrorState, StatusBadge).
- **Charts:** Recharts only; minimal axes/legend; no decorative clutter.
- **Tables:** TanStack Table; dense rows; wrap in `DataTableContainer`.
- **Forms/filters:** react-hook-form + zod; compact `FilterToolbar` row when possible.
- Do **not** change routes, remove pages, or add one-off card styles.

## Page skeleton

`PageContainer` → `PageHeader` → optional `FilterToolbar` → `DashboardGrid` / `SectionContainer` → tables in `DataTableContainer` or `DataPanel`.

**Brand Center:** контент страниц обёрнут в `PageContainer` в `app/brand/layout.tsx` (узкая колонка `max-w-6xl` для внутренних роутов, шире для `/brand` и organization). **Цех 2** (`/brand/production/workshop2/**`): `max-w-7xl` в том же layout. Локальные `container mx-auto max-w-*` на этих страницах убраны — эталон посадки: `PageHeader`, `FilterToolbar`, `SectionContainer`, `EmptyState` в `Workshop2TabContent` / `Workshop2ArticleWorkspace`.

## JOOR + Oracle enterprise

Full brief: **`src/design/JOOR_ORACLE_ENTERPRISE_UI.md`**. Dense Oracle-style planning/analytics; clean JOOR-style wholesale/showroom blocks — additive, not a redesign.

## Style

Spacing scale 4–48px; radius 8/12/16; calm slate palette + indigo accent (see STYLE_GUIDE).
